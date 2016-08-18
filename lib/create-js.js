var fs = require('fs')
var path = require('path')
var assert = require('assert')
var browserify = require('browserify')

module.exports = function buildJS (app, options, callback) {
  assert.ok(options)
  assert.ok(options.argv)
  assert.ok(options.state)
  assert.ok(options.outputDir)

  var argv = options.argv
  var state = options.state
  var outputDir = options.outputDir

  var filepath = path.join(outputDir, 'index.js')
  var customStylePath = argv.css ? path.join(state.dir, argv.css) : null
  var customStyle = argv.css ? `css('${customStylePath}', { global: true })` : ''

  var js = `
  var css = require('sheetify')
  var minidocs = require('minidocs')
  var app = minidocs(${JSON.stringify(state)})
  app.start('#choo-root')
  ${customStyle}
  `

  fs.writeFile(filepath, js, function (err) {
    if (err) return callback(err)
    browserify(filepath, { paths: [path.join(__dirname, '..', 'node_modules')] })
      .transform(require('sheetify/transform'))
      .plugin(require('css-extract'), { out: path.join(outputDir, 'bundle.css') })
      .bundle(function (err, src) {
        if (err) return callback(err)
        var filepath = path.join(outputDir, 'bundle.js')
        fs.writeFile(filepath, src, callback)
      })
  })
}
