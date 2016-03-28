var fs = require('fs')
var path = require('path')
var css = require('dom-css')
var marked = require('marked')
var camelcase = require('camelcase')
var insertcss = require('insert-css')
var find = require('lodash.find')
var isobject = require('lodash.isobject')
var foreach = require('lodash.foreach')
var include = require('include-folder')

module.exports = function (opts) {
  var contents = opts.contents
  var logo = opts.logo
  var init = opts.init

  var documents = include('./markdown')

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
  document.body.appendChild(container)

  var basecss = fs.readFileSync(path.join(__dirname, 'components', 'styles', 'base.css'))
  var highlightcss = fs.readFileSync(path.join(__dirname, 'components', 'styles', 'highlighting', 'tomorrow.css'))
  var githubcss = fs.readFileSync(path.join(__dirname, 'components', 'styles', 'github-markdown.css'))
  var fontscss = fs.readFileSync(path.join(__dirname, 'components', 'styles', 'fonts.css'))
  insertcss(basecss)
  insertcss(highlightcss)
  insertcss(githubcss)
  insertcss(fontscss)

  if (logo) require('./components/header')(container, logo)
  var sidebar = require('./components/sidebar')(container, contents)
  var main = require('./components/main')(container)
  
  sidebar.on('selected', function (key) {
    var name = lookup[key]
    var fileid = camelcase(name.replace('.md', ''))
    main.show(parsed[fileid])
  })

  css(document.body, {margin: '0px', padding: '0px'})
  css(container, {width: '90%', marginLeft: '5%', marginRight: '5%'})

  if (init) sidebar.select(init)
  else sidebar.select(first)
}