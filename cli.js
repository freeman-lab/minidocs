var fs = require('fs')
var path = require('path')
var marked = require('marked')

// these are the arguments to the command line tool

var contents = {
  'overview': {
    'about': 'path.md'
  },
  'packages': {
    'interface': {
      'binder-client': 'binder-client.md'
    },
    'core': {
      'binder-build': 'binder-build.md'
    }
  }
}

var source = './markdown'

// build html from markdown

var marked = require('marked')
var raw = String(fs.readFileSync(path.join(source, 'about.md')))
var parsed = marked(raw)
fs.writeFileSync('about.html', parsed)

//

var bundle = fs.createWriteStream('./bundle.js')

var browserify = require('browserify')
var b = browserify()
b.add('example.js')
b.bundle().pipe(bundle)