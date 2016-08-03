# using minidocs as a javascript module

Create a table of contents in a file named `contents.json`:

```json
{
  "overview": {
    "about": "about.md"
  },
  "animals": {
    "furry": {
      "sheep": "sheep.md"
    },
    "pink": {
      "pig": "pig.md"
    }
  }
}
```

Then build the site and add it to the page with

```javascript
var minidocs = require('minidocs')

var app = minidocs({
  contents: './contents.json',
  markdown: './markdown',,
  logo: './logo.svg'
})

var tree = app.start()
document.body.appendChild(tree)
```

This assumes you have the files `about.md`, `sheep.md`, and `pig.md` inside a local folder `markdown`.

To run this in the browser you'll need to use the minidocs transform with browserify or budo:

**browserify example:**

```
browserify index.js -t minidocs/transform > bundle.js
```

**budo example:**

```
budo index.js:bundle.js -P -- -t minidocs/transform
```

You can also add transforms to your project by adding a `browserify` field to the `package.json` file with a `transform` array:

```js
"browserify": {
  "transform": [
    "minidocs/transform"
  ]
}
```

### about the minidocs transform

Packaged with minidocs is a transform that takes care of reading the contents file, the markdown files, highlighting code in the markdown, and bundling the JS and CSS.

The minidocs transform is only necessary when using minidocs as a JS module, not when using the minidocs cli tool.


## run the example

To run a full example, clone this repository, go into the folder [`example`](example) then call

```
npm install
npm start
```