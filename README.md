# minidocs

[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]

> build a site for your documentation

This module generates a documentation site from two simple components: (1) a collection of markdown documents and (2) a hierarchical object specifying your table of contents.

This module is intentionally simpler and more opinionated than something like [Jekyll](https://jekyllrb.com/) or [Sphinx](http://www.sphinx-doc.org/en/stable/). Depending on what you're looking for, that might be good, because it's easier to reason about, or not, because it's less flexible! It'll probably be most useful if your documentation already consists entirely of markdown files, and it composes well with any tools that generate markdown, for example [`ecosystem-docs`](https://github.com/hughsk/ecosystem-docs), which pulls README files from a collection of GitHub repositories.

Sites can be built using a command-line tool, or using the library as a module with browserify. There are options for specifying a project logo, custom css, and other basic formatting. Support for themes coming soon!

PRs welcome!

[**live demo**](http://minidocs.surge.sh)

## install

### command-line

Install as a command

```
npm install -g minidocs
```

### library

Add to your project with

```
npm install --save minidocs
```

## example

### command-line

Just specify the location of your markdown files, the table of contents, the output location, and build the site

```
minidocs docs/ --contents contents.json --output site/
```

### library

Specify a table of contents

```javascript
var contents = {
  'overview': {
    'about': 'about.md'
  },
  'animals': {
    'furry': {
      'sheep': 'sheep.md'
    },
    'pink': {
      'pig': 'pig.md'
    }
  }
}
```

Then generate the site

```javascript
var minidocs = require('minidocs')
var include = require('include-folder')

minidocs({
  contents: contents,
  markdown: include('./markdown')
  styles: fs.readFileSync('./styles.css')
})
```

This assumes you have the files `about.md`, `sheep.md`, and `pig.md` inside a local folder `markdown`.

To run this in the browser you'll need two browserify transforms:

- [folderify](https://github.com/parro-it/folderify), to transform the call to the `include-folder` module into an object with all your markdown files
- [brfs](https://github.com/substack/brfs), to transform `fs.readFileSync('./styles.css')` into a string with the contents of that file

To run a full example, clone this repository, go into the folder [`example`](example) then call

```
npm install
npm start
```

## usage

### command-line

```
Usage:
  minidocs {sourceDir} -c {contents.json} -o {buildDir}

Options:
  * --contents, -c     JSON file that defines the table of contents
  * --output, -o       Directory for built site [site]
  * --title, -t        Project name [name of current directory]
  * --logo, -l         Project logo
  * --css              Optional stylesheet
  * --help, -h         Show this help message
```

### library

#### `require('minidocs')(opts)`

Where `opts` is an object that can specify the following options

- `contents` object with the table of contents, required
- `documents` array of markdown files, required
- `styles` a stylesheet, if not required will only use base styles
- `logo` relative file path to a logo file, if unspecified will not include a logo
- `initial` which document to show on load, if unspecified will load the first document
- `root` a DOM node to append to, if unspecified will append to `document.body`

## license

[MIT](LICENSE)

[npm-image]: https://img.shields.io/badge/npm-v1.1.0-lightgray.svg?style=flat-square
[npm-url]: https://npmjs.org/package/minidocs
[standard-image]: https://img.shields.io/badge/code%20style-standard-lightgray.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
