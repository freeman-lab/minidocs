var choo = require('choo')

var parseContents = require('./lib/parse-contents')
var parseMarkdown = require('./lib/parse-markdown')

var main = require('./components/main')
var page = require('./components/page')

module.exports = function (opts) {
  var app = choo()

  app.model({
    namespace: 'app',
    state: {
      title: opts.title,
      logo: opts.logo
    },
    reducers: {}
  })

  var contents = parseContents(opts.contents)
  var documents = parseMarkdown(opts.markdown)

  app.model({
    namespace: 'pages',
    state: {
      contents: contents,
      markdown: documents.markdown,
      html: documents.html,
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
