var test = require('tape')

var createApp = require('../app')
var parseDocs = require('../lib/parse-docs')

test('app.js returns choo app', function (t) {
  var options = require('./fixtures/app-options')
  var app = createApp(options)
  t.ok(app)
  t.ok(app.start)
  t.ok(app.toString)
  t.end()
})

if (process.env.TEST_ENV !== 'node') {
  test('app.start() returns dom tree', function (t) {
    var options = require('./fixtures/app-options')
    var app = createApp(options)
    var tree = app.start()
    t.ok(tree)
    t.end()
  })
}

test('app.toString() returns html', function (t) {
  var options = require('./fixtures/app-options')
  var app = createApp(options)
  var docs = parseDocs(options)
  options.html = docs.html
  options.contents = docs.contents
  var html = app.toString('/', options)
  t.ok(html)
  t.end()
})
