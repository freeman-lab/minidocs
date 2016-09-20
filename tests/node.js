var test = require('tape')

var createApp = require('../app')
var parseOptions = require('../lib/parse-options')

test('app.js returns choo app', function (t) {
  var options = parseOptions({
    contents: './fixtures/browser/contents.js',
    markdown: './fixtures/browser/docs',
    dir: __dirname
  })

  var app = createApp(options)
  t.ok(app)
  t.ok(app.start)
  t.ok(app.toString)
  t.end()
})

test('app.toString() returns html', function (t) {
  var options = parseOptions({
    contents: './fixtures/browser/contents.js',
    markdown: './fixtures/browser/docs',
    dir: __dirname
  })

  var app = createApp(options)
  var html = app.toString('/', options)
  t.ok(html)
  t.end()
})
