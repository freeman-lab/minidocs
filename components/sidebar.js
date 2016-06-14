var css = require('sheetify')
var el = require('bel')

module.exports = function (params, state, send) {
  var contents = state.contents

  var prefix = css`
    :host {
      width: 24%;
      padding: 0px 20px 20px 20px;
      display: inline-block;
      padding-bottom: 3%;
      overflow-y: scroll;
      background: rgb(240,240,240);
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
    }

    .minidocs-logo {
      width: 100%;
    }

    .depth-1 {
      display: block;
      font-size: 2em;
      font-weight: bold;
    }

    .depth-1:before {
      content: '# '
    }

    .depth-2 {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
    }
  `

  function createHeader () {
    if (state.logo) {
      return el`
        <img class="minidocs-logo" src="${state.logo}" alt="${state.title}">
      `
    }
    return state.title
  }

  function createMenu (contents) {
    return contents.map(function (item) {
      if (item.link) {
        return el`<div class="depth-${item.depth}">
          <a href="${item.link}">${item.key}</a>
        </div>`
      }
      return el`<div class="depth-${item.depth}">${item.key}</div>`
    })
  }

  return el`<div class="${prefix} minidocs-sidebar">
    <div class="minidocs-header">
      <h1><a href="/">${createHeader()}</a></h1>
    </div>
    <div class="minidocs-contents">
      ${createMenu(contents)}
    </div>
  </div>`
}
