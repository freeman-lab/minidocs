var html = require('choo/html')
var css = require('sheetify')
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (state, prev, send) {
  var prefix = css`
    :host {
      width: 100%;
      height: 529.5px;
      padding: 40px;
      vertical-align: top;
      display: inline-block;
      box-sizing: border-box;
    }

    @media (min-width: 600px) {
      :host {
        width: 58%;
        height: 529.5px;
        padding: 125.9px 10% 70.6px 6%;
        vertical-align: top;
        display: inline-block;
        margin-left: 24%;
      }
    }
  `

  if (typeof document !== 'undefined' && document.body.scrollTop > 0) {
    document.body.scrollTop = 0
  }

  return html`<div id="choo-root" class="minidocs">
    ${sidebar(state, prev, send)}
    <div class="${prefix} minidocs-main">
      <div class="markdown-body">
        ${content(state, prev, send)}
      </div>
    </div>
  </div>`
}
