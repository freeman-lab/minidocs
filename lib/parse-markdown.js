var marked = require('marked')
var hl = require('highlight.js')

marked.setOptions({
  sanitize: true,
  highlight: function (code, lang) {
    var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
    return out.value
  }
})

module.exports = function parseMarkdown (markdown) {
  var html = {}

  Object.keys(markdown).forEach(function (key) {
    html[key] = marked(markdown[key])
  })

  var routes = { index: '/' }
  var keys = Object.keys(markdown)
  keys.forEach(function (key) {
    routes[key] = `/${key}`
  })

  return {
    html: html,
    markdown: markdown,
    routes: routes
  }
}
