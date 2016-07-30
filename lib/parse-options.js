var path = require('path')
var xtend = require('xtend')
var read = require('read-directory')
var parseDocs = require('./parse-docs')

module.exports = function (options) {
  options.dir = options.dir || process.cwd()
  var contentsPath = path.resolve(options.dir, options.contents)
  var markdownPath = path.resolve(options.dir, options.markdown)
  var contents = require(contentsPath)
  var markdown = read.sync(markdownPath, { extensions: false, filter: '**/*.md' })

  var docs = parseDocs(xtend(options, {
    markdown: markdown,
    contents: contents
  }))

  return xtend(options, docs)
}
