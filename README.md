# minidocs

> build a site for your documentation

This module makes it easy to build a documentation site from very simple components
- a collection of markdown documents
- an object representing your table of contents

Especially well suited to documenting collections of small modules, keeping all the documentation in one place.

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
  'packages': {
    'core': {
      'cool-module': 'cool-module-readme.md',
      'rad-module': 'rad-module-readme.md'
    },
    'extra': {
      'another-module': 'another-module-readme.md'
    }
  }
}
```

Then build a site by specifying the base path for all markdown files

```javascript
var docs = require('minidocs')

docs({
  contents: contents,
  path: './markdown'
})
```

This assumes you have the files `cool-module-readme.md`, `rad-module-readme.md`, and `another-module-readme.md` inside the folder `./markdown`.