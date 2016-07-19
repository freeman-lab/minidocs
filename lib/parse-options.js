var path = require('path')
var xtend = require('xtend')
var read = require('read-directory')
var parseDocs = require('./parse-docs')

module.exports = function (options) {
  var contentsPath = path.resolve(options.dir, options.contents)
  var markdownPath = path.resolve(options.dir, options.markdown)
  var contents = require(contentsPath)
  var markdown = read.sync(markdownPath, { extensions: false })

  var docs = parseDocs({
    initial: options.initial,
    markdown: markdown,
    contents: contents
  })

  return xtend(options, docs)
}
