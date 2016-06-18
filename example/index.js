var contents = require('./contents')
var read = require('read-directory')

var app = require('../index.js')({
  contents: contents,
  markdown: read.sync('./markdown', { extensions: false }),
  logo: './logo.svg'
})

var tree = app.start()
document.body.appendChild(tree)
