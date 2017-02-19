const _ = require('lodash');
const chain = require('gulp-chain');
const fs = require('fs');
const gulp = require('gulp');
const connect = require('gulp-connect');
const del = require('del');
const doctoc = require('gulp-doctoc');
const handlebars = require('handlebars');
const markdown = require('gulp-markdown');
const md2remark = require('md2remark');
const open = require('gulp-open');
const path = require('path');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const through = require('through2');
const util = require('gulp-util');
const watch = require('gulp-watch');

const generatePdfFromSlides = require('./pdf');

const root = __dirname;

const config = {
  browser: process.env.BROWSER,
  buildDir: process.env.BUILD_DIR || 'build',
  liveReloadPort: process.env.LIVERELOAD_PORT,
  pdfBuildDir: process.env.PDF_BUILD_DIR || 'pdf',
  port: process.env.PORT,
  webfonts: true
};

try {
  _.defaults(config, require('./local.config'));
} catch (e) {
  // ignore
}

_.defaults(config, require('./config'));

_.defaults(config, {
  port: 3000,
  liveReloadPort: 35729
});

const src = {
  assets: [ 'assets/**/*.*' ],
  content: [ 'subjects/**/*.*', '!**/*.md', '!**/*.odg', '!**/*.odg#', '!**/node_modules/**' ],
  indexTemplate: 'templates/index.html',
  mainReadme: 'README.md',
  pdfSource: 'tmp/pdf/subjects/*/**/index.html',
  remarkTemplate: 'templates/remark.html',
  slides: [ 'subjects/**/*.md', '!subjects/**/node_modules/**/*.md' ]
};

const indexPageTemplate = loadIndexPageTemplate();
const remarkPageTemplate = loadRemarkPageTemplate();

gulp.task('build-assets', function() {
  return gulp
    .src(src.assets)
    .pipe(copyAssets());
});

gulp.task('build-content', function() {
  return gulp
    .src(src.content)
    .pipe(copyContent());
});

gulp.task('build-index', function() {
  return buildIndex();
});

gulp.task('build-slides', function() {
  return gulp
    .src(src.slides)
    .pipe(buildSlides());
});

gulp.task('build', [ 'build-assets', 'build-content', 'build-index', 'build-slides' ]);

gulp.task('clean-build', function() {
  return del([ 'build' ]);
});

gulp.task('clean-pdf', function() {
  return del([ 'tmp/pdf' ]);
});

gulp.task('clean', function() {
  return runSequence([ 'clean-build', 'clean-pdf' ]);
});

gulp.task('doctoc', function() {
  return gulp
    .src(src.slides)
    .pipe(doctoc({
      depth: 3,
      notitle: true,
      mode: 'github.com'
    }))
    .pipe(gulp.dest('subjects'));
});

gulp.task('generate-pdf', [ 'build' ], function() {
  return gulp
    .src(src.pdfSource)
    .pipe(generatePdf());
});

gulp.task('open', function() {
  gulp
    .src(__filename)
    .pipe(open({
      app: config.browser,
      uri: 'http://localhost:' + config.port
    }));
});

gulp.task('pdf', function() {
  config.buildDir = 'tmp/pdf';
  config.webfonts = false;
  return runSequence([ 'clean-build', 'clean-pdf' ], 'generate-pdf', 'clean-pdf');
});

gulp.task('serve', function() {
  return connect.server({
    root: config.buildDir,
    livereload: {
      port: config.liveReloadPort
    },
    port: config.port
  });
});

gulp.task('watch-assets', function() {
  return watch(src.assets, function(file) {
    return gulp
      .src(file.path, { base: 'assets' })
      .pipe(copyAssets());
  });
});

gulp.task('watch-content', function() {
  return watch(src.content, function(file) {
    return gulp
      .src(file.path, { base: 'subjects' })
      .pipe(copyContent());
  });
});

gulp.task('watch-index', function() {
  return watch(src.mainReadme, function() {
    return buildIndex();
  });
});

gulp.task('watch-index-template', function() {
  return watch(src.indexTemplate, function() {
    indexPageTemplate = loadIndexPageTemplate();
    return buildIndex();
  });
});

gulp.task('watch-slides', function() {
  return watch(src.slides, function(file) {
    return gulp
      .src(file.path, { base: 'subjects' })
      .pipe(buildSlides());
  });
});

gulp.task('watch-slides-template', function() {
  return watch(src.remarkTemplate, function() {
    remarkPageTemplate = loadRemarkPageTemplate();
    return gulp
      .src(src.slides)
      .pipe(buildSlides());
  });
});

gulp.task('watch', function() {
  return runSequence([ 'watch-assets', 'watch-content', 'watch-index', 'watch-index-template', 'watch-slides', 'watch-slides-template' ]);
});

gulp.task('default', function() {
  return runSequence('clean-build', 'build', [ 'serve', 'watch'], 'open');
});

function buildIndex() {
  const dest = config.buildDir;
  return gulp
    .src(src.mainReadme)
    .pipe(markdown())
    .pipe(rename(renameMarkdownToHtml))
    .pipe(through.obj(insertIntoIndexPage))
    .pipe(logFile(function(file) {
      const relativePath = path.relative(root, file.path);
      util.log('Generated ' + util.colors.magenta(path.join(dest, relativePath)));
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
};

const buildSlides = chain(function(stream) {
  const dest = path.join(config.buildDir, 'subjects');
  return stream
    .pipe(through.obj(convertMarkdownFileToRemarkSlides))
    .pipe(logFile(function(file) {
      const relativePath = path.relative('subjects', file.path);
      util.log('Generated ' + util.colors.magenta(path.join(dest, relativePath)));
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

const copyContent = chain(function(stream) {
  const dest = path.join(config.buildDir, 'subjects');
  return stream
    .pipe(logFile(function(file) {
      const relativePath = path.relative('subjects', file.path);
      util.log('Copied ' + util.colors.magenta(path.join(dest, relativePath)));
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

const copyAssets = chain(function(stream) {
  const dest = path.join(config.buildDir, 'assets');
  return stream
    .pipe(logFile(function(file) {
      const relativePath = path.relative('assets', file.path);
      util.log('Copied ' + util.colors.magenta(path.join(dest, relativePath)));
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

const generatePdf = chain(function(stream) {
  const base = 'tmp/pdf/subjects';
  const dest = path.relative(__dirname, config.pdfBuildDir);
  return stream
    .pipe(through.obj((file, enc, callback) => {
      const relativePath = path.relative(base, file.path);
      const destPath = `${path.dirname(relativePath)}.pdf`;
      const pdfFile = path.join(config.pdfBuildDir, destPath);
      generatePdfFromSlides(file.path, pdfFile).then(() => {
        util.log(`Generated ${util.colors.magenta(pdfFile)}`);
        callback(undefined, file)
      }, callback);
    }));
});

function loadIndexPageTemplate() {
  return handlebars.compile(fs.readFileSync(src.indexTemplate, { encoding: 'utf-8' }));
}

function loadRemarkPageTemplate() {
  return handlebars.compile(fs.readFileSync(src.remarkTemplate, { encoding: 'utf-8' }));
}

function logFile(func) {
  return through.obj(function(file, enc, callback) {
    func(file);
    this.push(file);
    callback();
  });
}

function renameMarkdownToHtml(file) {
  file.basename = 'index';
  file.extname = '.html';
}

function insertIntoIndexPage(file, enc, callback) {

  const contents = file.contents.toString();

  const indexPage = indexPageTemplate({
    contents: contents
  });

  file.contents = new Buffer(indexPage);
  this.push(file);

  callback();
}

function convertMarkdownFileToRemarkSlides(file, enc, callback) {

  let isReadme = false;
  let markdown = file.contents.toString();

  const basenameWithoutExt = path.basename(file.path, '.md');
  if (basenameWithoutExt == 'README') {
    isReadme = true;
    // Convert subjects/a/b/c/README.md to subjects/a/b/c/index.html
    file.path = path.join(path.dirname(file.path), 'index.html');
  } else {
    // Convert subjects/a/b/c/INSTALL.md to subjects/a/b/c/install/index.html
    file.path = path.join(path.dirname(file.path), basenameWithoutExt.toLowerCase(), 'index.html');

    // Update relative Markdown links to take into account the new directory
    markdown = markdown
      .replace(/(\[[^\]]+\]\(\.\.\/)/g, '$1../') // "[foo](../something)" => "[foo](../../something)"
      .replace(/^(\[[^\]]+\]:\s*\.\.\/)/g, '$1../'); // "[foo]: ../something" => "[foo]: ../../something"
  }

  // Determine depth of Markdown file compared to subjects directory
  // (subjects/a/index.html has depth 1, subjects/a/b/index.html has depth 2, etc)
  let depth = 0;
  let tmpPath = path.relative('subjects', path.dirname(file.path));
  while (tmpPath != '.') {
    depth++;
    tmpPath = path.dirname(tmpPath);
  }

  // Use the first Markdown header as the HTML <title>
  const subjectTitleMatch = markdown.match(/^#\s*([^\n]+)/m);
  const subjectTitle = subjectTitleMatch ? subjectTitleMatch[1] : 'Slides';

  const options = {
    breadcrumbs: true
  };

  // Convert the Markdown content to Remark Markdown
  md2remark(markdown, options).then(function(remarkMarkdown) {

    // Insert the Remark Markdown into our HTML template
    const remarkPage = remarkPageTemplate({
      basePath: '../'.repeat(depth + 1).replace(/\/$/, ''),
      source: remarkMarkdown,
      title: subjectTitle + ' (' + config.title + ')',
      webfonts: config.webfonts
    });

    file.contents = new Buffer(remarkPage);
    callback(undefined, file);
  });
}
