var marked = require('marked')
var hl = require('highlight.js')

marked.setOptions({
  highlight: function (code, lang) {
    try {
      return highlight(code, lang)
    } catch (e) {
      console.error(e)
    }
  }
})

function highlight (code, lang) {
  var out = lang ? hl.highlight(lang, code) : hl.highlightAuto(code)
  return out.value
}

module.exports = function parseMarkdown (markdown) {
  if (!markdown) return ''
  return marked(markdown)
}
