var url = require('url')
var css = require('sheetify')
var html = require('choo/html')

module.exports = function (state, prev, send) {
  var contents = state.contents

  var prefix = css`
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

    .minidocs-logo {
      width: 100%;
      max-width: 250px;
    }

    .minidocs-header {
      height: 105px;
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

    .h2 {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 12px;
      margin-bottom: 12px;
    }

    a.content-link {
      padding: 2px 8px 2px 5px;
      margin-bottom: 1px;
      cursor: pointer;
      text-decoration: none;
      color: #505050;
      display: block;
      border-left: 3px solid #eee;
    }

    a.content-link.active, a.content-link:hover {
      background-color: #fff;
      border-left: 3px solid rgb(200,200,200);
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

  function createMenu (contents) {
    return contents.map(function (item) {
      // TODO: figure out a better way to get current page in state based on link click
      var current
      var location

      if (state.location && state.location.pathname) {
        location = url.parse(state.location.pathname)
        var sliceBy = state.basedir.length + 1
        current = location.pathname.slice(sliceBy)
      }

      if (!current || current.length <= 1) {
        current = state.current
      }

      if (item.link) {
        return html`<div><a href="${item.link}" class="content-link ${isActive(current, item.key)}">${item.name}</a></div>`
      }

      return html`<div class="h${item.depth}">${item.name}</div>`
    })
  }

  function isActive (current, item) {
    return current === item ? 'active' : ''
  }

  return html`<div class="${prefix} minidocs-sidebar">
    <div class="minidocs-header">
      <h1><a href="${state.basedir}/">${createHeader()}</a></h1>
    </div>
    <div class="minidocs-contents">
      ${createMenu(contents)}
      <br>
      <br>
    </div>
  </div>`
}
