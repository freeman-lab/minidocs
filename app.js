var path = require('path')
var choo = require('choo')

var parseContents = require('./lib/parse-contents')
var parseMarkdown = require('./lib/parse-markdown')
var main = require('./components/main')

module.exports = function (opts) {
  var app = choo()

  var contents = parseContents(opts.contents)
  var documents = parseMarkdown(opts.markdown)
  console.log('opts.title', opts.title)
  app.model({
    state: {
      title: opts.title,
      logo: opts.logo,
      contents: contents,
      markdown: documents.markdown,
      html: documents.html,
      routes: documents.routes,
      current: opts.initial || Object.keys(documents.markdown)[0]
    },
    reducers: {}
  })

  app.router(function (route) {
    return [
      route('/', main),
      route('/:page', main)
    ]
  })

  return app
}
