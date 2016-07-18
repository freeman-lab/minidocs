var path = require('path')
var through = require('through2')
var staticModule = require('static-module')

var sheetify = require('sheetify/transform')
var read = require('read-directory')

var minidocs = require('./index')
var parseDocs = require('./lib/parse-docs')

module.exports = function minidocsTransform (filename) {
  if (/\.json$/.test(filename)) return through()
  var basedir = path.dirname(filename)

  var vars = {
    __filename: filename,
    __dirname: basedir
  }

  var sm = staticModule({
    minidocs: function (options) {
      var stream = through()

      /*
      TODO: read the contents if available
      TODO: read the markdown directory, generate contents based on dir structure if needed
      TODO: reformat contents to necessary format
      TODO: parse the markdown & highlight code samples
      TODO: bundle the css
      */

      stream.push(`require('minidocs')(${JSON.stringify(options)})`)
      stream.push(null)
      return stream
    }
  }, { vars: vars, varModules: {} })

  return sm
}
