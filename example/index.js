var contents = require('./contents')
var read = require('read-directory')

require('../index.js')({
  contents: contents,
  markdown: read.sync('./markdown', { extensions: false }),
  logo: './logo.svg'
})
