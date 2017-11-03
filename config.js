const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const config = {};

_.merge(config, {
  title: 'COMEM+ Web Dev',
  version: '2017-2018',
  repoUrl: 'https://github.com/MediaComem/comem-webdev',
  homeTemplate: path.join(__dirname, 'templates', 'index.html'),
  remark: {
    highlightLines: true,
    highlightSpans: true,
    countIncrementalSlides: false
  },
  publish: {
    gitUrl: 'git@github.com:MediaComem/comem-webdev-docs.git',
    baseUrl: 'https://mediacomem.github.io/comem-webdev-docs',
    branch: 'master',
    version: '2017-2018'
  }
});

// Load `config.local.js` if it exists
if (fs.existsSync('./config.local.js')) {
  _.merge(config, require('./config.local'));
}

module.exports = config;
