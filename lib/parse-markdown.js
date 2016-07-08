var marked = require('marked')
var hl = require('./highlight')

marked.setOptions({
  sanitize: true,
  highlight: function (code, lang) {
    var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
    return out.value
  }
})

module.exports = function parseMarkdown (markdown) {
  return marked(markdown)
}
