var fs = require('fs')
var path = require('path')
var css = require('dom-css')
var marked = require('marked')
var camelcase = require('camelcase')
var foreach = require('lodash.foreach')
var include = require('include-folder')

module.exports = function (opts) {
  var contents = opts.contents

  var documents = include('./markdown')

  parsed = {}
  foreach(documents, function (value, key) {
    parsed[key] = marked(value)
  })

  var container = document.createElement('div')
  document.body.appendChild(container)
  
  var sidebar = require('./components/sidebar')(container, contents)
  var main = require('./components/main')(container)
  
  sidebar.on('selected', function (id) {
    var fileid = camelcase(id.replace('.md', ''))
    main.show(parsed[fileid])
  })

  css(document.body, {margin: '0px', padding: '0px'})
}