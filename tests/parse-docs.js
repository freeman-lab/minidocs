var test = require('tape')
var parseDocs = require('../lib/parse-docs')

var options = require('./fixtures/app-options')

test('parseDocs returns contents, routes, html', function (t) {
  var docs = parseDocs(options)
  t.ok(docs)
  t.ok(docs.html)
  t.ok(docs.contents)
  t.ok(docs.routes)
  t.ok(docs.routes.index)
  t.ok(docs.routes.about)
  t.equal(docs.html.about, '<h1 id="about">about</h1>\n')
  t.end()
})
