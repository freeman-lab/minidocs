var minidocs = require('minidocs')

var app = minidocs({
  contents: './contents.js',
  markdown: './markdown',
  logo: './logo.svg'
})

var tree = app.start()
document.body.appendChild(tree)
