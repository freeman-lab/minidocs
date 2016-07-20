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
      current: opts.initial || docs.initial,
      basedir: opts.basedir
    },
    reducers: {}
  })

  app.model({
    namespace: 'menu',
    state: {
      open: false,
      size: 'small'
    },
    reducers: {
      set: function (data, state) {
        return data
      },
      size: function (data, state) {
        return data
      }
    },
    subscriptions: [
      checkSize,
      function (send, done) {
        window.onresize = function () {
          checkSize(send, done)
        }
      }
    ]
  })

  function checkSize (send, done) {
    var size = window.innerWidth > 600 ? 'large' : 'small'
    send('menu:size', { size: size }, done)
  }

  app.router(function (route) {
    var routes = [
      route('/', main),
      route('/:page', main)
    ]

    if (opts.basedir) {
      return route(opts.basedir, routes)
    }

    return routes
  })

  return app
}
