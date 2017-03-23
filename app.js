var choo = require('choo')

var main = require('./components/main')

module.exports = function (opts) {
  opts.basedir = (opts.basedir || '').replace(/\/$/, '')
  var app = choo()

  app.use(function (state, ee) {
    if (!state.title) state.title = opts.title
    if (!state.logo) state.logo = opts.logo
    if (!state.contents) state.contents = opts.contents
    if (!state.html) state.html = opts.html
    if (!state.routes) state.routes = opts.routes
    if (!state.current) state.current = opts.initial
    if (!state.basedir) state.basedir = opts.basedir
  })

  app.use(function (state, ee) {
    if (!state.menu) {
      state.menu = {}
      state.menu.open = false
    }

    if (typeof window !== 'undefined' && window.innerWidth > 600) {
      state.menu.open = true
    }

    ee.on('menu:toggle', function () {
      console.log('menu:toggle', state.menu)
      state.menu.open = !state.menu.open
    })
  })

  app.route(opts.basedir + '/', main)
  app.route(opts.basedir + '/:page', main)

  return app
}
