var contents = require('./contents')
var include = require('include-folder')

require('../index.js')({
  title: 'minidocs',
  contents: contents,
  markdown: include('./markdown')
})
