var fs = require('fs')
var path = require('path')
var assert = require('assert')
var createHTML = require('create-html')

module.exports = function createPushstateFile (app, options, callback) {
  assert.ok(options)
  assert.ok(options.state)
  assert.ok(options.outputDir)

  var state = options.state
  var outputDir = options.outputDir

  assert.ok(state.title)
  assert.ok(state.routes)

  var page = app.toString(state.basedir + '/', state)
  var pushstatefile = path.join(outputDir, '200.html')

  var html = createHTML({
    title: state.title,
    body: page,
    script: state.basedir + '/bundle.js',
    css: state.basedir + '/bundle.css'
  })

  fs.writeFile(pushstatefile, html, callback)
}
