var html = require('choo/html')
var css = require('sheetify')
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (state, prev, send) {
  var prefix = css('./main.css')

  return html`<div id="choo-root" class="minidocs"}>
    ${sidebar(state, prev, send)}
    <div class="${prefix} minidocs-main">
      <div class="markdown-body">
        ${content(state, prev, send)}
      </div>
    </div>
  </div>`
}
