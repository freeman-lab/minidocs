var html = require('choo/html')
var css = require('sheetify')
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (state, prev, send) {
  var prefix = css`
    :host {
      width: 100%;
      padding: 40px;
      vertical-align: top;
      display: inline-block;
      box-sizing: border-box;
    }

    @media (min-width: 600px) {
      :host {
        position: absolute;
        right: 0;
        width: 73%;
        padding: 125.9px 8% 70.6px 8%;
        vertical-align: top;
        display: inline-block;
      }
    }

    @media (min-width: 900px) {
      :host {
        width: 77%;
        padding: 125.9px 6% 70.6px 6%;
      }
    }
  `

  return html`<div id="choo-root" class="minidocs"}>
    ${sidebar(state, prev, send)}
    <div class="${prefix} minidocs-main">
      <div class="markdown-body">
        ${content(state, prev, send)}
      </div>
    </div>
  </div>`
}
