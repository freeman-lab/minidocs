var css = require('sheetify')
var el = require('bel')

module.exports = function (params, state, send) {
  var html = state.html
  var currentPage = params.page || state.current
  var page = html[currentPage]
  var pageData = state.contents.filter(function (item) {
    return item.key === currentPage
  })[0]

  var prefix = css`
    a.markdown-link {
      color: #aaa;
      border: 1px solid #eee;
      display: inline-block;
      position: fixed;
      margin-top: -50px;
      padding: 3px 5px;
      text-decoration: none;
    }

    a.markdown-link:hover {
      color: #4078c0;
      border: 1px solid #4078c0;
    }
  `

  var contentWrapper = el`<div></div>`
  contentWrapper.innerHTML = page
  var link = pageData.source ? el`<a class="markdown-link" href="${pageData.source}">source</a>` : ''

  return el`<div class="${prefix} minidocs-content">
    ${link}
    ${contentWrapper}
  </div>`
}
