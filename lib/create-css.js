var fs = require('fs')
var path = require('path')
var assert = require('assert')

module.exports = function createCSS (app, options, callback) {
  assert.ok(options)
  assert.ok(options.argv)
  assert.ok(options.outputDir)

  var argv = options.argv
  var state = options.state
  var outputDir = options.outputDir
  var customStylePath = argv.css ? path.join(state.dir, argv.css) : null

  if (argv.css) {
    var customStylePath = path.join(state.dir, argv.css)
    fs.createReadStream(customStylePath)
      .pipe(fs.createWriteStream(path.join(outputDir, 'style.css')))
      .on('close', callback)
  } else {
    callback()
  }
}
