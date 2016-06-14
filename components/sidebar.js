var css = require('sheetify')
var el = require('bel')

module.exports = function (params, state, send) {
  var contents = state.contents

  var prefix = css`
    :host {
      width: 24%;
      padding-left: 3%;
      display: inline-block;
      padding-bottom: 3%;
      overflow-y: scroll;
      background: rgb(240,240,240);
      height: 100%;
    }
  `
  console.log('prefix', prefix)
  
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
      <h1>${state.title}</h1>
    </div>
    <div class="minidocs-contents">
      ${createMenu(contents)}
    </div>
  </div>`
}
