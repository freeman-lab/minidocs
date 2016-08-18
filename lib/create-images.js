var fs = require('fs')
var path = require('path')
var assert = require('assert')

module.exports = function createImages (app, options, callback) {
  assert.ok(options)
  assert.ok(options.argv)
  assert.ok(options.outputDir)

  var argv = options.argv
  var outputDir = options.outputDir

  if (argv.logo) {
    var logopath = path.join(outputDir, argv.logo)
    var writelogo = fs.createWriteStream(logopath)
    var stream = fs.createReadStream(argv.logo)
    stream.pipe(writelogo)
    stream.on('end', callback)
  } else {
    callback()
  }
}
