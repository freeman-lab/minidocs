var isobject = require('lodash.isobject')
var map = require('lodash.map')

module.exports = function parseContents (contents) {
  var depth = 0
  var menu = []

  function iterate (contents, depth) {
    return map(contents, function (value, key, obj) {
      return level(contents, key, value, depth + 1)
    })[0]
  }

  function level (contents, key, value, depth) {
    var obj = { key: key, depth: depth }
    if (isobject(value) && Object.keys(value).indexOf('file') < 0) {
      menu.push(obj)
      iterate(value, depth)
    } else {
      obj.link = '/' + key
      menu.push(obj)
    }
    return menu
  }

  return iterate(contents, depth)
}
