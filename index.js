var yo = require('yo-yo')
var css = require('dom-css')
var contents = require('./components/contents')
var main = require('./components/main')

module.exports = function (opts) {

  var source = opts.source
  var theme = opts.theme

  var page = yo`<div style=${{width: '50%'}}>
  ${contents(opts.contents)}
  ${main()}
  </div>`
  css(page, {width: '100%'})

  css(document.body, {margin: '0px', padding: '0px'})

  document.body.appendChild(page)
}






// build a nested list on the left

// add an onclick event for each one

// onclick opens the markdown