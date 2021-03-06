# Command Line Cheatsheet

Useful commands for [Bash][bash] (**B**ourne-**a**gain **sh**ell),
the default shell for most Linux distributions and macOS.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting help (`man`, `--help`)](#getting-help-man---help)
- [Navigating](#navigating)
  - [Where am I? (`pwd`)](#where-am-i-pwd)
  - [What is there? (`ls`)](#what-is-there-ls)
  - [Move around (`cd`)](#move-around-cd)
  - [Special paths (`.`, `..`, `~`)](#special-paths---)
- [Reading](#reading)
  - [What's in this file? (`cat`, `head`, `tail`, `less`)](#whats-in-this-file-cat-head-tail-less)
- [Writing](#writing)
  - [Create a directory (`mkdir`)](#create-a-directory-mkdir)
  - [Create a file (`echo`, `touch`)](#create-a-file-echo-touch)
  - [Copy stuff (`cp`)](#copy-stuff-cp)
  - [Move stuff (`mv`)](#move-stuff-mv)
  - [Delete stuff (`rm`)](#delete-stuff-rm)
- [Finding (`find`)](#finding-find)
- [Environment variables](#environment-variables)
  - [`$PATH`](#path)
  - [Do I have that command? (`which`)](#do-i-have-that-command-which)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Getting help (`man`, `--help`)

* `man ls` displays the manual of the `ls` command
* `help ls` displays the help of the `ls` command in Git Bash on Windows
* `git --help` displays the help of the `git` command (many commands provide a help page)



## Navigating

### Where am I? (`pwd`)

Use the `pwd` command, meaning **p**rint **w**orking **d**irectory:

```bash
$> pwd
/Users/jdoe/Downloads
```

### What is there? (`ls`)

Command   | Effect
:---      | :---
`ls`      | List the files in the current directory (invisible files are hidden).
`ls -a`   | List all files in the current directory, including invisible ones.
`ls -ahl` | List all files in the current directory, also displaying their mode, owner, group, size, last modification date.
`ls foo`  | List all files in the `foo` directory inside the current directory.

### Move around (`cd`)

Command        | Effect
:---           | :---
`cd .`         | Move into the current directory ([wheeeeee][whee]).
`cd foo`       | Move into the `foo` directory inside the current directory.
`cd ./foo`     | *Same as previous.*
`cd foo/bar`   | Move into the `bar` directory inside the `foo` directory inside the current directory
`cd ./foo/bar` | *Same as previous.*
`cd ..`        | Move into the parent directory (e.g. into `/foo` if you are in `/foo/bar`).
`cd ../..`     | Move into the parent directory of the parent directory (e.g. into `/` if you are in `/foo/bar`).
`cd ~`         | Move into your home directory.
`cd`           | *Same as previous.*
`cd /`         | Move to the root of the file system.

### Special paths (`.`, `..`, `~`)

Path | Where
:--- | :---
`.`  | The current directory (the same as indicated by `pwd`).
`..` | The parent directory (e.g. `/foo` if you are in `/foo/bar`).
`~`  | Your user's home directory (e.g. `/Users/username` in macOS).
`/`  | The file system's root directory.



## Reading

### What's in this file? (`cat`, `head`, `tail`, `less`)

Display the **entire contents** of a file in the CLI with the `cat` command (as in con**cat**enate):

```bash
$> cat file.txt
Hello
World
```

Display the **first or last N lines** (10 by default) of a file with the `head` and `tail` commands, respectively:

```bash
$> head file.txt
$> head -n 100 file.txt
$> tail file.txt
$> tail -n 50 file.txt
```

Display a large file in interactive mode, allowing you to scroll with the up and down arrow keys:

```bash
$> less file.txt
```



## Writing

### Create a directory (`mkdir`)

Create one directory in the current directory:

```bash
$> mkdir foo
```

Create a directory and all missing intermediate directories:

```bash
$> mkdir -p foo/bar/baz/qux
```

### Create a file (`echo`, `touch`)

Create an empty file:

```bash
$> touch file.txt
```

Create (or overwrite) a file containing one line:

```bash
$> echo "Hello World!" > file.txt
```

Append one line at the end of a file:

```bash
$> echo "Hello World!" >> file.txt
```

### Copy stuff (`cp`)

Copy a file:

```bash
$> cp oldname.txt newname.txt
```

Copy a directory recursively:

```bash
cp -R olddirectory newdirectory
```

### Move stuff (`mv`)

Move a file (or directory):

```bash
$> mv file.txt /somewhere/else
$> mv directory /somewhere/else
```

### Delete stuff (`rm`)

Delete a file:

```bash
$> rm file.txt
```

You can also delete a directory with `rm` by adding the `-r` (**r**ecursive) option.

Be **EXTREMELY careful** when you type this command.
One wrong move and you could permanently lose a lot of files
(e.g. if you misspell the name of the directory you want to delete).

```bash
$> rm -r directory
```



## Finding (`find`)

Recursively list all files in the current directory:

```bash
$> find .
```

Recursively list all JavaScript files in the current directory:

```bash
$> find . -name "*.js"
```



## Environment variables

Display an environment variable:

```bash
$> echo $FOO
$> echo $PATH
```

Set an environment variable (it will be gone when you close the CLI):

```bash
$> export FOO=bar
$> echo $FOO
```

To be able to keep this environment variable in all future CLIs,
save the `export FOO=bar` to your `~/.bash_profile` file (create it if it doesn't exist).



### `$PATH`

`$PATH` is an environment variable that contains a semicolon-delimited (`:`) list of directories.
When you type a command such as `git`, Bash will look for a binary file named `git` in each of these
directories one by one and execute the first one it finds.

If it doesn't find such an executable, it will return a `command not found` error.

```bash
$> echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

You can modify your path by adding `export` statements to your `~/.bash_profile` file
(create it if it doesn't exist):

```
# Add the /foo directory to the beginning of $PATH
export PATH="/foo:$PATH"

# Add the /opt/local/bin directory to the beginning of $PATH
export PATH="/opt/local/bin:$PATH"
```

### Do I have that command? (`which`)

Locate an executable in the `$PATH` with the `which` command:

```bash
$> which git
/usr/local/bin/git
$> which foo
foo not found
```



[bash]: https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[whee]: https://en.wiktionary.org/wiki/whee
