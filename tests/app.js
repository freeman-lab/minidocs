var test = require('tape')

var createApp = require('../app')
var parseOptions = require('../lib/parse-options')

test('app.js returns choo app', function (t) {
  var app = createApp(parseOptions({
    contents: './fixtures/contents.js',
    markdown: './fixtures/markdown',
    dir: __dirname
  }))
  t.ok(app)
  t.ok(app.start)
  t.ok(app.toString)
  t.end()
})

if (process.env.TEST_ENV !== 'node') {
  test('app.start() returns dom tree', function (t) {
    var app = createApp(parseOptions({
      contents: './fixtures/contents.js',
      markdown: './fixtures/markdown',
      dir: __dirname
    }))
    var tree = app.start()
    t.ok(tree)
    t.end()
  })
}

test('app.toString() returns html', function (t) {
  var options = parseOptions({
    contents: './fixtures/contents.js',
    markdown: './fixtures/markdown',
    dir: __dirname
  })

  var app = createApp(options)
  var html = app.toString('/', options)
  t.ok(html)
  t.end()
})
