var marked = require('marked')
var hl = require('highlight.js')
var slugify = require('slug')
var renderer = new marked.Renderer()

var toc = []

renderer.heading = function(text, level, raw) {
  var slug = slugify(raw, {lower: true})
  toc.push({
    level: level,
    slug: slug,
    title: raw
  })
  return "<h" + level + " id=\"" + slug + "\"><a href=\"#" + slug + "\" class=\"anchor\"></a>" + text + "</h" + level + ">"
}

marked.setOptions({
  renderer: renderer,
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
  if (!markdown) return {html: '', toc: []}
  toc = []
  return {
    html: marked(markdown),
    toc: toc
  }
}
