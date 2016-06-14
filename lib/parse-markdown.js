var marked = require('marked')

marked.setOptions({
  sanitize: true
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
