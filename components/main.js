var el = require('bel')
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (params, state, send) {
  return el`<div id="choo-root" class="minidocs">
    ${sidebar(params, state, send)}
    <div class="minidocs-main">
      <div class="markdown-body">
        ${content(params, state, send)}
      </div>
    </div>
  </div>`
}
