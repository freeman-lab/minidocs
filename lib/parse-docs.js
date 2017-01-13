var parseContents = require('./parse-contents')
var parseMarkdown = require('./parse-markdown')

module.exports = function (options) {
  if (!options || !options.contents || !options.markdown) {
    throw new Error('options object with contents and markdown properties is required')
  }

  var initial = options.initial
  var markdown = options.markdown
  var contents = parseContents(options)
  var html = {}

  var routes = { index: '/' }
  contents.forEach(function (item) {
    if (item.key) {
      if (!initial) initial = item.key
      routes[item.key] = `/${item.key}/`
      var parsed = parseMarkdown(markdown[item.key])
      html[item.key] = parsed.html
      item.toc = parsed.toc
    }
  })

  return {
    initial: initial,
    contents: contents,
    routes: routes,
    html: html
  }
}
