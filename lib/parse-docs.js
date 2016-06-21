var parseContents = require('./parse-contents')
var parseMarkdown = require('./parse-markdown')

module.exports = function (options) {
  if (!options || !options.contents || !options.markdown) {
    throw new Error('options object with contents and markdown properties')
  }
  var contents = parseContents(options.contents)
  var documents = parseMarkdown(options.contents, options.markdown)

  var routes = { index: '/' }
  contents.forEach(function (item) {
    if (item.key) routes[item.key] = `/${item.key}/`
  })

  return {
    contents: contents,
    markdown: documents.markdown,
    html: documents.html,
    routes: routes
  }
}
