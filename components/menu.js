var url = require('url')
var css = require('sheetify')
var html = require('choo/html')

module.exports = function (state, prev, send) {
  var contents = state.contents

  var prefix = css`
    :host {

    }

    .h2 {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 12px;
      margin-bottom: 12px;
    }

    .minidocs-menu, .minidocs-menu.menu-closed {
      display: none;
      z-index: 1000;
    }

    .minidocs-menu.menu-open.menu-small {
      display: block;
      background-color: rgb(240,240,240);
      position: fixed;
      width: 100%;
      top: 0;
      height: 100%;
      padding: 50px;
      margin-bottom:  0px;
      box-sizing: border-box;
    }

    .minidocs-menu.menu-open.menu-small .minidocs-menu-wrapper {
      height: 100%;
      overflow-y: auto;
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

    .minidocs-menu-toggle {
      display: block;
      position: absolute;
      top: 10px;
      left: 10px;
      border: 0px;
      background: transparent;
      padding-left: 20px;
      line-height: 0.9;
      z-index: 2000;
      cursor: pointer;
      font-size: 16px;
    }

    .minidocs-menu-toggle:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.25em;
      width: 1em;
      height: 0.15em;
      background: black;
      box-shadow: 
        0 0.25em 0 0 black,
        0 0.5em 0 0 black;
    }

    @media (min-width: 600px) {
      .minidocs-menu {
        display: block;
        margin-bottom: 25px;
      }

      .minidocs-menu-toggle {
        display: none;
      }
    }
  `

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
        return html`<div><a href="${item.link}" class="content-link ${isActive(current, item.key)}" onclick=${function (e) {
          send('menu:set', { open: false })
        }}>${item.name}</a></div>`
      }

      return html`<div class="h${item.depth}">${item.name}</div>`
    })
  }

  function isActive (current, item) {
    return current === item ? 'active' : ''
  }

  function isOpen () {
    if (typeof window !== 'undefined' && window.innerWidth > 600) return 'menu-open'
    return state.menu.open ? 'menu-open' : 'menu-closed'
  }

  function onclick (e) {
    send('menu:set', { open: !state.menu.open })
  }

  return html`<div class="${prefix} minidocs-contents">
    <button class="minidocs-menu-toggle" onclick=${onclick}>Menu</button>
    <div class="minidocs-menu ${isOpen()} menu-${state.menu.size}">
      <div class="minidocs-menu-wrapper">
        ${createMenu(contents)}
      </div>
    </div>
  </div>`
}
