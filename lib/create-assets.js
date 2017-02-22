var fs = require('fs')
var path = require('path')
var assert = require('assert')
var tar = require('tar-fs')

module.exports = function createAssets (app, options, callback) {
  assert.ok(options)
  assert.ok(options.argv)
  assert.ok(options.outputDir)

  var argv = options.argv
  var state = options.state
  var outputDir = options.outputDir
  var logoSource = state.logoSource
  var assets = argv.assets || ''
  var assetsPath = path.parse(assets)

  function copyLogo (fn) {
    var stream = fs.createReadStream(state.logoSource)
    var logopath = path.join(outputDir, state.logo)
    var writelogo = fs.createWriteStream(logopath)
    stream.pipe(writelogo)
    stream.on('end', fn)
  }

  function copyAssets (fn) {
    var pack = tar.pack(assets)
    var extract = tar.extract(path.join(outputDir, assetsPath.name))
    pack.pipe(extract).on('finish', fn)
  }

  if (logoSource && assets) {
    copyLogo(function () {
      copyAssets(callback)
    })
  } else if (logoSource) {
    copyLogo(callback)
  } else if (assets) {
    copyAssets(callback)
  } else {
    callback()
  }
}
