var marked = require('marked')
var hl = require('highlight.js')

marked.setOptions({
  sanitize: true,
  highlight: function (code, lang) {
    var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
    return out.value
  }
})

module.exports = function parseMarkdown (options) {
  var contents = options.contents
  var markdown = options.markdown
  var html = {}

  Object.keys(markdown).forEach(function (key) {
    html[key] = marked(markdown[key])
  })

  return {
    html: html,
    markdown: markdown
  }
}
