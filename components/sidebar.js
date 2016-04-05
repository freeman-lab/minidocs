var css = require('dom-css')
var inherits = require('inherits')
var foreach = require('lodash.foreach')
var isobject = require('lodash.isobject')
var EventEmitter = require('events').EventEmitter

module.exports = Sidebar
inherits(Sidebar, EventEmitter)

function Sidebar (container, contents, logo, title) {
  if (!(this instanceof Sidebar)) return new Sidebar(container, contents, logo, title)
  var self = this

  var style = {
    sidebar: {
      width: '24%',
      paddingLeft: '3%',
      display: 'inline-block',
      paddingBottom: window.innerHeight * 0.03,
      overflowY: 'scroll',
      background: 'rgb(240,240,240)',
      height: window.innerHeight * 0.96
    },
    link: {
    }
  }

  
  var sidebar = document.createElement('div')
  var header = require('./header')(sidebar, logo, title)

  sidebar.className = 'minidocs-contents'
  iterate(sidebar, contents, -1)

  function heading (name, depth) {
    var el
    if (depth === 0) el = document.createElement('h1')
    if (depth === 1) el = document.createElement('h2')
    if (depth === 2) el = document.createElement('h3')
    if (depth === 3) el = document.createElement('h4')
    if (depth === 0) el.innerHTML = '# '
    el.innerHTML += name
    return el
  }

  function iterate (container, contents, depth) {
    foreach(contents, function (value, key) {
      level(container, key, value, depth + 1)
    })
  }

  function level (container, key, value, depth) {
    if (isobject(value)) {
      var el = document.createElement('div')
      container.appendChild(el)
      el.appendChild(heading(key, depth))
      iterate(el, value, depth)
    } else {
      var item = document.createElement('div')
      css(item, {marginBottom: '5px'})
      container.appendChild(item)
      var link = document.createElement('a')
      css(link, style.link)
      link.id = key + '-link'
      link.innerHTML = key
      link.className = 'contents-link'
      link.onclick = function () {
        highlight(link)
        self.emit('selected', key)
      }
      item.appendChild(link)
    }
  }

  function highlight (link) {
    foreach(document.querySelectorAll('.contents-link'), function (item) {
      item.className = 'contents-link'
    })
    link.className = 'contents-link contents-link-selected'
  }

  function select (key) {
    highlight(document.querySelector('#' + key + '-link'))
    self.emit('selected', key)
  }

  css(sidebar, style.sidebar)
  container.appendChild(sidebar)

  self.select = select
}
