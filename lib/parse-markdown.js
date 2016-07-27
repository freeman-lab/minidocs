var marked = require('marked')
var hl = require('./highlight')

marked.setOptions({
  highlight: function (code, lang) {
    var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
    return out.value
  }
})

module.exports = function parseMarkdown (markdown) {
  if (!markdown) return ''
  return marked(markdown)
}
