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
  var indexpath = path.join(outputDir, 'index.js')

  var js = `
  var minidocs = require('minidocs')
  var app = minidocs(${JSON.stringify(state)})
  app.start('#choo-root')
  `

  fs.writeFile(indexpath, js, function (err) {
    if (err) return callback(err)
    browserify(indexpath, { paths: [path.join(__dirname, '..', 'node_modules')] })
      .plugin(require('css-extract'), { out: path.join(outputDir, 'bundle.css') })
      .bundle(function (err, src) {
        if (err) return callback(err)
        var bundlepath = path.join(outputDir, 'bundle.js')
        fs.writeFile(bundlepath, src, function (err) {
          if (err) return callback(err)
          fs.unlink(indexpath, callback)
        })
      })
  })
}
