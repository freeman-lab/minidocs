var fs = require('fs')
var url = require('url')
var path = require('path')
var css = require('dom-css')
var marked = require('marked')
var camelcase = require('camelcase')
var history = require('sheet-router/history')
var href = require('sheet-router/href')
var isobject = require('lodash.isobject')
var foreach = require('lodash.foreach')
var insertcss = require('insert-css')
var hl = require('highlight.js')

module.exports = function (opts) {
  if (!opts.contents) throw new Error('contents option is required')
  if (!opts.markdown) throw new Error('markdown option is required')

  var contents = opts.contents
  var documents = opts.markdown
  var logo = opts.logo
  var styles = opts.styles
  var initial = opts.initial
  var title = opts.title || ''
  var node = opts.node || document.body
  var pushstate = opts.pushstate !== false

  marked.setOptions({
    highlight: function (code, lang) {
      var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
      return out.value
    }
  })

  if (pushstate) {
    var pathname = url.parse(document.location.href).pathname
    href(setPathname)
    history(setPathname)
  }

  function setPathname (href) {
    pathname = url.parse(href).pathname
  }

  var parsed = {}
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
        lookup[key.replace(/\s+/g, '-')] = value
      }
    })
  }

  iterate(contents)

  var container = document.createElement('div')
  container.className = 'minidocs'
  node.appendChild(container)
  css(node, {margin: '0px', padding: '0px'})
  css(container, {width: '100%', marginLeft: '0%', marginRight: '0%'})

  if (styles) insertcss(styles)

  var basecss = fs.readFileSync(path.join(__dirname, './components/styles/base.css'))
  var fontcss = fs.readFileSync(path.join(__dirname, './components/styles/fonts.css'))
  var githubcss = fs.readFileSync(path.join(__dirname, './components/styles/github-markdown.css'))
  var highlightcss = fs.readFileSync(path.join(__dirname, './components/styles/highlighting/tomorrow.css'))
  insertcss(basecss)
  insertcss(fontcss)
  insertcss(githubcss)
  insertcss(highlightcss)

  var sidebar = require('./components/sidebar')({
    container: container,
    contents: contents,
    logo: logo,
    title: title,
    pushstate: pushstate
  })
  var main = require('./components/main')(container)

  sidebar.on('selected', showFile)

  function showFile (key) {
    var name = lookup[key.replace(/\s+/g, '-')]
    var fileid = camelcase(name.replace('.md', ''))
    main.show(parsed[fileid])
  }

  if (pushstate && pathname.length > 1) sidebar.select(pathname.replace(/^\/|\/$/g, ''))
  else if (initial) sidebar.select(initial)
  else sidebar.select(first)
}
