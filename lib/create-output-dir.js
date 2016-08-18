var assert = require('assert')
var mkdir = require('mkdirp')
var rm = require('rimraf')

module.exports = function createOutputDir (app, options, callback) {
  assert.ok(options)
  assert.ok(options.outputDir)

  rm(options.outputDir, function (err) {
    if (err) return callback(err)
    mkdir(options.outputDir, callback)
  })
}
