var css = require('sheetify')
var html = require('choo/html')

var menu = require('./menu')

module.exports = function (state, prev, send) {
  var prefix = css('./sidebar.css')

  function createHeader () {
    if (state.logo) {
      return html`
        <img class="minidocs-logo" src="${state.basedir + '/' + state.logo}" alt="${state.title}">
      `
    }
    return state.title
  }

  return html`<div class="${prefix} minidocs-sidebar">
    <div class="minidocs-header">
      <h1><a href="${state.basedir}/">${createHeader()}</a></h1>
    </div>
    ${menu(state, prev, send)}
  </div>`
}
