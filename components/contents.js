var yo = require('yo-yo')
var css = require('dom-css')
var foreach = require('lodash.foreach')
var map = require('lodash.map')
var isobject = require('lodash.isobject')

module.exports = function (contents) {
  var documents = map(contents, function (value, key) {
    if (isobject(value)) {
      return level(key, value, 0)
    }
  })

  function heading (name, depth) {
    if (depth === 0) return yo`<h1>${name}</h1>`
    if (depth === 1) return yo`<h2>${name}</h2>`
    if (depth === 2) return yo`<h3>${name}</h3>`
    if (depth === 3) return yo`<h4>${name}</h4>`
  }

  function level (key, value, depth) {
    if (isobject(value)) {
      return yo`<div>
      ${heading(key, depth)}
      ${map(value, function (v, k) {return level(k, v, depth + 1)})}
      </div>`
    } else {
      return yo`<a>${value}</a>`
    }
  }

  // recursive render function
  // if the value is an object, render the key as a heading
  //     then call render on the value
  // if the value is a string, render the key as a link

  var side = yo`
  <div>
    ${documents}
  </div>
  `
  css(side, {width: '24%', display: 'inline-block'})
  return side
}