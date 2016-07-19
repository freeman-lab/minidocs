var choo = require('choo')

var main = require('./components/main')

module.exports = function (opts) {
  opts.basedir = (opts.basedir || '').replace(/\/$/, '')
  var app = choo()

  app.model({
    state: {
      title: opts.title,
      logo: opts.logo,
      contents: opts.contents,
      html: opts.html,
      routes: opts.routes,
      current: opts.initial,
      basedir: opts.basedir
    },
    reducers: {}
  })

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
