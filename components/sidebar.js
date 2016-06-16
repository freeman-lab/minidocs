var url = require('url')
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

    .h1 {
      display: block;
      font-size: 2em;
      font-weight: bold;
      margin-top: 10px;
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

    .h2 {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 5px;
    }

    a.content-link {
      padding-left: 2%;
      cursor: pointer;
      padding-bottom: 2px;
      padding-right: 10px;
      text-decoration: none;
      color: #505050;
    }

    a.content-link.active, a.content-link:hover {
      background-color: #fff;
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
      // TODO: figure out a better way to get current page in state based on link click
      var current
      var location

      if (state.map && state.map.location) {
        location = url.parse(state.app.location)
        current = location.pathname.slice(1)
      } else {
        current = state.current
      }

      if (item.link) {
        return el`<div class="depth-${item.depth}">
          <a href="${item.link}" class="content-link ${isActive(current, item.key)}">${item.key}</a>
        </div>`
      }

      return el`<div class="h${item.depth} depth-${item.depth}">${item.key}</div>`
    })
  }

  function isActive (current, item) {
    return current === item ? 'active' : ''
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
