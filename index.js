var fs = require('fs')
var path = require('path')
var css = require('dom-css')
var marked = require('marked')
var camelcase = require('camelcase')
var find = require('lodash.find')
var isobject = require('lodash.isobject')
var foreach = require('lodash.foreach')

module.exports = function (opts) {
  if (!opts.contents) throw new Error('contents option is required')
  if (!opts.markdown) throw new Error('markdown option is required')

  var contents = opts.contents
  var documents = opts.markdown
  var logo = opts.logo
  var initial = opts.initial
  var node = opts.node || document.body

  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js').highlightAuto(code).value
    }
  })

  parsed = {}
  foreach(documents, function (value, key) {
    parsed[key] = marked(value)
  })

  var lookup = {}
  var first
  function iterate (data) {
    foreach(data, function (value, key) {
      if (isobject(data[key])) iterate(value)
      else {
        if (!first) first = key
        lookup[key] = value
      }
    })
  }

  iterate(contents)

  var container = document.createElement('div')
  container.className = 'minidocs'
  node.appendChild(container)
  css(node, {margin: '0px', padding: '0px'})
  css(container, {width: '90%', marginLeft: '5%', marginRight: '5%'})

  if (logo) require('./components/header')(container, logo)
  var sidebar = require('./components/sidebar')(container, contents)
  var main = require('./components/main')(container)

  sidebar.on('selected', function (key) {
    var name = lookup[key]
    var fileid = camelcase(name.replace('.md', ''))
    main.show(parsed[fileid])
  })

  if (initial) sidebar.select(initial)
  else sidebar.select(first)
}
