var css = require('sheetify')
var el = require('bel')

module.exports = function (params, state, send) {
  var contents = state.contents
  var html = state.html
  var currentPage = params.page || state.current
  var page = html[currentPage]

  var prefix = css`
    :host {}
  `

  var element = el`<div class="prefix minidocs-content"></div>`
  element.innerHTML = page
  return element
}
