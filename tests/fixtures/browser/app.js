var minidocs = require('minidocs')

var app = minidocs({
  contents: './contents.js',
  markdown: './markdown'
})

var tree = app.start()
document.body.appendChild(tree)
