var test = require('tape')
var parseOptions = require('../lib/parse-options')

test('parseOptions returns contents, routes, html', function (t) {
  var options = parseOptions({
    contents: './fixtures/browser/contents.js',
    markdown: './fixtures/browser/docs',
    dir: __dirname
  })

  t.ok(options)
  t.ok(options.html)
  t.ok(options.contents)
  t.ok(options.routes)
  t.ok(options.routes.index)
  t.ok(options.routes.a)
  t.equal(options.html.a, '<p>a</p>\n')
  t.end()
})
