var url = require('url')
var css = require('sheetify')
var html = require('choo/html')

module.exports = function (state, prev, send) {
  var contents = state.contents
  var prefix = css('./menu.css')

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

      function onclick (e) {
        send('menu:set', { open: false })
      }
      
      function createTocItem (tocItem) {
        if (tocItem.level === 1) return '' // Don't put title
        var depth = item.depth + (tocItem.level - 1)
        return html`<a href="#${tocItem.slug}" class="h${depth} content-link">${tocItem.title}</a>`
      }

      if (isActive(current, item.key) && item.toc.length > 1) {
        return html`
          <div>
            <a href="${item.link}" class="content-link ${isActive(current, item.key)}" onclick=${onclick}>${item.name}</a>
            <div class="minidocs-menu-toc">
              ${item.toc.map(function (tocItem) {
                return createTocItem(tocItem)
              })}
            </div>
          </div>
        `
      }

      if (item.link) {
        return html`<div><a href="${item.link}" class="content-link ${isActive(current, item.key)}" onclick=${onclick}>${item.name}</a></div>`
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
