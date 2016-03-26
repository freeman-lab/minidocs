# minidocs

> build a site for your documentation

This module makes it easy to build a documentation site from simple and standard components
- a collection of markdown documents
- a nested object representing your table of contents

You can include it as a module and bundle the site yourself with `browserify`, or use as a command line tool.

This is deliberately much, much simpler than something like Jekyll or Sphinx. It's well-suited to cases where your documentation consists entirely of markdown files, either specifically for your project or from the README files of other modules.

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

Then build a site by specifying the base path for all markdown files

```javascript
var docs = require('minidocs')

docs({
  contents: contents,
})
```

This assumes you have the files `about.md`, `sheep.md`, and `pig.md` inside the folder `./markdown`.