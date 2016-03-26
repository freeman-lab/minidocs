var yo = require('yo-yo')
var css = require('dom-css')
var inherits = require('inherits')
var foreach = require('lodash.foreach')
var map = require('lodash.map')
var isobject = require('lodash.isobject')
var EventEmitter = require('events').EventEmitter

module.exports = Sidebar
inherits(Sidebar, EventEmitter)

function Sidebar (container, contents) {
  if (!(this instanceof Sidebar)) return new Sidebar(container, contents)
  var self = this

  var sidebar = document.createElement('div')
  iterate(sidebar, contents, -1)

  function heading (name, depth) {
    var el
    if (depth === 0) el = document.createElement('h1')
    if (depth === 1) el = document.createElement('h2')
    if (depth === 2) el = document.createElement('h3')
    if (depth === 3) el = document.createElement('h4')
    el.innerHTML = name
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
      var link = document.createElement('a')
      link.innerHTML = key
      link.onclick = function () {
        self.emit('selected', value)
      }
      container.appendChild(link)
    }
  }

  css(sidebar, {width: '24%', display: 'inline-block'})
  container.appendChild(sidebar)
}