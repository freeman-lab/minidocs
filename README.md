# minidocs

[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]

> build a site for your documentation

This module generates a documentation site from two simple components: (1) a collection of markdown documents and (2) a hierarchical object specifying your table of contents.

This module is intentionally simpler and more opinionated than something like [Jekyll](https://jekyllrb.com/) or [Sphinx](http://www.sphinx-doc.org/en/stable/). Depending on what you're looking for, that might be good, because it's easier to reason about, or not, because it's less flexible! It'll probably be most useful if your documentation already consists entirely of markdown files, and it composes well with any tools that generate markdown, for example [`ecosystem-docs`](https://github.com/hughsk/ecosystem-docs), which pulls README files from a collection of GitHub repositories.

There are options for specifying a project logo and which document to show on load. Support for themes, and bundling via a command-line tool, coming soon. PRs welcome!

[**live demo**](http://minidocs.surge.sh)

## install

Add to your project with

```
npm install minidocs
```

## example

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
minidocs(contents)
```

This assumes you have the files `about.md`, `sheep.md`, and `pig.md` inside a local folder `markdown`.

To run a full example, clone this repository, go into the folder [`example`](example) then call

```
npm install
npm start
```

## usage

#### `require('minidocs')(contents, opts)`

Where `contents` is an object describing the hierarchy of contents, used to build the sidebar, and `opts` is an object that can specify the following options

- `logo` relative file path to a logo file, if unspecified will not include a logo
- `initial` which document to show on load, if unspecified will load the first document
- `root` a DOM node to append to, if unspecified will append to `document.body`
- `style` a Boolean value to use custom style, if specified it will try to load `style.css` into the page, default to `false`

## license

[MIT](LICENSE)

[npm-image]: https://img.shields.io/badge/npm-v1.0.1-lightgray.svg?style=flat-square
[npm-url]: https://npmjs.org/package/minidocs
[standard-image]: https://img.shields.io/badge/code%20style-standard-lightgray.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
