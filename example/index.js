var contents = require('./contents')
var include = require('include-folder')

require('../index.js')({
  contents: contents,
  markdown: include('./markdown'),
  logo: './logo.svg'
})
