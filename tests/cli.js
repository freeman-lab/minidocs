var fs = require('fs')
var path = require('path')
var test = require('tape')
var exec = require('execspawn')
var each = require('each-async')

test('basic cli usage', function (t) {
  t.plan(1)

  var cmd = exec('minidocs ./fixtures/cli/docs -c ./fixtures/cli/contents.js -o site/', {
    cwd: __dirname
  })

  cmd.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  cmd.on('close', function () {
    check(['bundle.css', 'bundle.js', 'index.html', 'index.js'], function (err) {
      t.notOk(err)
      t.end()
    })
  })
})

function check (filepaths, done) {
  each(filepaths, function (item, i, next) {
    var filepath = path.join(__dirname, 'site', item)
    fs.stat(filepath, function (err, stats) {
      if (err) return next(err)
      next()
    })
  }, done)
}
