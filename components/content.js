var css = require('sheetify')
var el = require('bel')

module.exports = function (params, state, send) {
  console.log(state.pages)
  var contents = state.pages.contents
  var html = state.pages.html
  var currentPage = params.page || state.pages.current
  var page = html[currentPage]

  var prefix = css`
    :host {}
  `

  var element = el`<div class="prefix minidocs-content"></div>`
  element.innerHTML = page
  return element
}
