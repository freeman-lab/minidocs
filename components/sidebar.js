var css = require('sheetify')
var html = require('choo/html')

var menu = require('./menu')

module.exports = function (state, prev, send) {
  var prefix = css`
    :host {
      width: 100%;
    }

    .minidocs-logo {
      width: 100%;
    }

    .minidocs-header {
      width: 40%;
      max-width: 250px;
      margin: 0px auto;
    }

    .h1 {
      display: block;
      font-size: 2em;
      font-weight: bold;
      margin-top: 16px;
      margin-bottom: 16px;
    }

    .h1:before {
      content: '# '
    }

    h1 a {
      color: #505050;
      text-decoration: none;
    }

    h1 a:hover {
      color: #222;
    }

    @media (min-width: 600px) {
      :host {
        width: 21%;
        padding: 0px 20px 20px 35px;
        display: inline-block;
        padding-bottom: 3%;
        overflow-y: scroll;
        background: rgb(240,240,240);
        height: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
      }

      .minidocs-header {
        width: 100%;
        max-width: 250px;
        margin: 0px auto;
      }

      .minidocs-logo {
        width: 100%;
        max-width: 250px;
      }
    }
  `

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
