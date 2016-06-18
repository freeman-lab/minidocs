var parsePath = require('parse-filepath')
var isobject = require('lodash.isobject')
var map = require('lodash.map')
var slug = require('slug')

module.exports = function parseContents (contents) {
  var depth = 0
  var menu = []

  function iterate (contents, depth) {
    return map(contents, function (value, key, obj) {
      return level(contents, key, value, depth + 1)
    })[0]
  }

  function level (contents, key, value, depth) {
    var obj = { depth: depth, name: key }

    if (isobject(value) && value.link) {
      obj.source = value.link
    }

    if (isobject(value) && !value.file) {
      menu.push(obj)
      iterate(value, depth)
    } else {
      if (isobject(value)) {
        obj.source = value.link
        value = value.file
      }
      var parsed = parsePath(value)
      obj.key = parsed.name
      obj.link = '/' + obj.key
      menu.push(obj)
    }
    return menu
  }

  return iterate(contents, depth)
}
