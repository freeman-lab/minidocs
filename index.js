var css = require('sheetify')
var minidocs = require('./app')

module.exports = function (opts, callback) {
  var app = minidocs(opts)

  css('./styles/base.css', { global: true })
  css('./styles/fonts.css', { global: true })
  css('./styles/github-markdown.css', { global: true })
  css('./styles/highlighting/tomorrow.css', { global: true })

  return {
    app: app,
    start: function (id, opts) {
      return app.start()
    }
  }
}
