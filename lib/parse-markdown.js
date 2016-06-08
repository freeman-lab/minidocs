var marked = require('marked')

marked.setOptions({
  sanitize: true
})

module.exports = function parseMarkdown (markdown) {
  var html = {}

  Object.keys(markdown).forEach(function (key) {
    html[key] = marked(markdown[key])
  })

  return {
    html: html,
    markdown: markdown
  }
}
