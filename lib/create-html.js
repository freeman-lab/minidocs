var fs = require('fs')
var path = require('path')
var assert = require('assert')
var createHTML = require('create-html')
var each  = require('each-async')

module.exports = function (app, options, callback) {
  assert.ok(options)
  assert.ok(options.argv)
  assert.ok(options.state)
  assert.ok(options.outputDir)

  var argv = options.argv
  var state = options.state
  var outputDir = options.outputDir

  assert.ok(state.title)
  assert.ok(state.routes)

  function createFile (route, filepath, callback) {
    var page = app.toString(state.basedir + route, state)

    var html = createHTML({
      title: state.title,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      body: page,
      script: argv.basedir + '/bundle.js',
      css: argv.basedir + '/bundle.css'
    })

    fs.writeFile(filepath, html, callback)
  }

  if (argv['full-html']) {
    each(state.routes, function (key, i, next) {
      var route = state.routes[key]
      var filepath = path.join(outputDir, key + '.html')
      state.current = key === 'index' ? state.initial : key
      createFile(route, filepath, next)
    }, callback)
  } else {
    var filepath = path.join(outputDir, 'index.html')
    state.current = state.initial
    createFile('/', filepath, callback)
  }
}
