var parseContents = require('./parse-contents')
var parseMarkdown = require('./parse-markdown')

module.exports = function (options) {
  if (!options || !options.contents || !options.markdown) {
    throw new Error('options object with contents and markdown properties')
  }

  var initial = options.initial
  var markdown = options.markdown
  var contents = parseContents(options.contents)
  var html = {}

  var routes = { index: '/' }
  contents.forEach(function (item) {
    if (item.key) {
      if (!initial) initial = item.key
      routes[item.key] = `/${item.key}/`
      html[item.key] = parseMarkdown(markdown[item.key])
    }
  })

  return {
    initial: initial,
    contents: contents,
    routes: routes,
    html: html
  }
}
