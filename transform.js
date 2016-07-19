var path = require('path')
var through = require('through2')
var staticModule = require('static-module')

var minidocs = require('./index')
var parseOptions = require('./lib/parse-options')

module.exports = function minidocsTransform (filename) {
  if (/\.json$/.test(filename)) return through()
  var basedir = path.dirname(filename)

  var vars = {
    __filename: filename,
    __dirname: basedir
  }

  var sm = staticModule({
    minidocs: function (options) {
      options.dir = basedir
      var parsedOptions = parseOptions(options)
      var stream = through()
      stream.push(`require('minidocs')(${JSON.stringify(parsedOptions)})`)
      stream.push(null)
      return stream
    }
  }, { vars: vars, varModules: {} })

  return sm
}
