# minidocs

[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]

> build a minimalist site for your documentation

This module generates a documentation site from two simple components: 

1. A collection of markdown documents
2. A hierarchical object specifying your table of contents

This module is intentionally simpler and more opinionated than something like [Jekyll](https://jekyllrb.com/) or [Sphinx](http://www.sphinx-doc.org/en/stable/). Depending on what you're looking for, that might be good, because it's easier to reason about, or bad, because it's less flexible! It'll probably be most useful if your documentation already consists entirely of markdown files, and it composes well with any tools that generate markdown, for example [`ecosystem-docs`](https://github.com/hughsk/ecosystem-docs), which pulls README files from a collection of GitHub repositories.

Sites can be built using a command-line tool, or using the library as a module with browserify. There are options for specifying a project logo, custom css, and other basic formatting.Support for themes coming soon! PRs welcome!

Here are some example sites built with `minidocs`:
- [**simple demo**](http://minidocs-example.surge.sh)
- [**binder**](http://docs.mybinder.org)
- [**thunder**](http://docs.thunder-project.org)

## install

### command-line

Install as a command-line tool

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

The folder `site` will now contain the `html` `js` and `css` for your site.

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

Then build the site and add it to the page with

```javascript
var minidocs = require('minidocs')
var read = require('read-directory')

var app = minidocs({
  contents: contents,
  markdown: read.sync('./markdown', { extensions: false }),
  logo: './logo.svg'
})

var tree = app.start()
document.body.appendChild(tree)
```

This assumes you have the files `about.md`, `sheep.md`, and `pig.md` inside a local folder `markdown`.

To run this in the browser you'll need two browserify transforms:

- [read-directory/transform](https://github.com/sethvincent/read-directory), to transform the call to the `read.sync` module into an object with all your markdown files. This transform is part of the read-directory module.
- [sheetify/transform](https://github.com/stackcss/sheetify), to transform styles defined in the components into CSS that the browser can use. This transform is part of the sheetify module.

The easiest way to add transforms to your project is to add a `browserify` field to the package.json file with a `transform` array:

```js
"browserify": {
  "transform": [
    "sheetify/transform",
    "read-directory/transform"
  ]
}
```

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
  * --css, -s          Optional stylesheet
  * --initial, -i      Page to use for root url
  * --pushstate, p     Create a 200.html file for hosting services like surge.sh
  * --help, -h         Show this help message
```

### library

#### `var minidocs = require('minidocs')(opts)`

Where `opts` is an object that can specify the following options

- `contents` object with the table of contents, required
- `documents` array of markdown files, required
- `styles` a stylesheet, if not required will only use base styles
- `logo` relative file path to a logo file, if unspecified will not include a logo
- `initial` which document to show on load, if unspecified will load the first document
- `root` a DOM node to append to, if unspecified will append to `document.body`

#### `var tree = minidocs.start(rootId?, opts)`
The `start` method accepts the same options as [choo's `start` method](https://github.com/yoshuawuyts/choo#tree--appstartrootid-opts).

This generates the html tree of the application that can be added to the DOM like this:

```js
var tree = app.start()
document.body.appendChild(tree)
```

#### `var html = app.toString(route, state)`
The `toString` method accepts the same options as [choo's `toString` method](https://github.com/yoshuawuyts/choo#html--apptostringroute-state)

We use this in the command-line tool to generate the static files of the site.

## deploying minidocs

### surge

Surge supports HTML5 pushstate if you have a 200.html file in your built site. You can either create that file yourself when using minidocs as a JS module, or you can build the site with the minidocs cli tool and the `--pushstate` option:

```sh
minidocs docs/ -c contents.json --pushstate -o site/
```

##### Deploy with the `surge` command

You can use the [`surge`](https://www.npmjs.com/package/surge) module to push the built site to the [surge.sh service](https://surge.sh).

Install `surge`:

```sh
npm install --save-dev surge
```

Create a `deploy` npm script:

```js
"scripts": {
  "deploy": "surge dist"
}
```

Publish your site:

```sh
npm run deploy
```

### github pages

GitHub Pages doesn't support HTML5 pushstate, so you have two options:

##### 1. Generate the site with the minidocs cli

To create a minidocs site with the cli:

```sh
minidocs path/to/docs/dir -c contents.json -o site
```

##### 2. Use hash routing with the JS module

To use hash routing, start the app with the `{ hash: true }` option in the `minidocs.start` method:

```js
var tree = app.start({ hash: true })
document.body.appendChild(tree)
```

##### Deploy with the `gh-pages` command

You can use the [`gh-pages`](https://www.npmjs.com/package/gh-pages) module to push the built site to the gh-pages branch of your repo.

Install `gh-pages`:

```sh
npm install --save-dev gh-pages
```

Create a `deploy` npm script:

```js
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Publish your site:

```sh
npm run deploy
```

## license

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/minidocs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/minidocs
[standard-image]: https://img.shields.io/badge/code%20style-standard-lightgray.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
