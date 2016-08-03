var minidocs = require('minidocs')

var app = minidocs({
  title: 'minidocs',
  contents: './contents.js',
  markdown: '.'
})

var tree = app.start()
document.body.appendChild(tree)
