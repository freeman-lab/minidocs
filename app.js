var choo = require('choo')

var parseDocs = require('./lib/parse-docs')
var main = require('./components/main')

module.exports = function (opts) {
  opts.basedir = (opts.basedir || '').replace(/\/$/, '')
  var app = choo()
  var docs = parseDocs(opts)

  app.model({
    state: {
      title: opts.title,
      logo: opts.logo,
      contents: docs.contents,
      markdown: docs.markdown,
      html: docs.html,
      routes: docs.routes,
      current: opts.initial || Object.keys(docs.markdown)[0],
      basedir: opts.basedir
    }
  })

  app.router(function (route) {
    return [
      route('/', main),
      route('/:page', main)
    ]
  })

  return app
}
