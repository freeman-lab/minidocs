var path = require('path')
var through = require('through2')
var staticModule = require('static-module')
var xtend = require('xtend')

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
      var contentsPath = path.resolve(basedir, options.contents)
      var markdownPath = path.resolve(basedir, options.markdown)
      var contents = require(contentsPath)
      var markdown = read.sync(markdownPath, { extensions: false })

      var docs = parseDocs({
        initial: options.initial,
        markdown: markdown,
        contents: contents
      })

      var parsedOptions = xtend(options, docs)
      var stream = through()
      stream.push(`require('minidocs')(${JSON.stringify(parsedOptions)})`)
      stream.push(null)
      return stream
    }
  }, { vars: vars, varModules: {} })

  return sm
}
