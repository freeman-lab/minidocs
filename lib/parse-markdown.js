var marked = require('marked')
var hl = require('./highlight')

marked.setOptions({
  highlight: function (code, lang) {
    try {
      return highlight(code, lang)
    } catch (e) {
      hl.registerLanguage(lang, require('highlight.js/lib/languages/' + lang))
      return highlight(code, lang)
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
