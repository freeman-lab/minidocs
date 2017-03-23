var html = require('choo/html')
var css = require('sheetify')
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (state, emit) {
  var prefix = css('./main.css')

  return html`<div class="minidocs">
    ${sidebar(state, emit)}
    <div class="${prefix} minidocs-main">
      <div class="markdown-body">
        ${content(state, emit)}
      </div>
    </div>
  </div>`
}
