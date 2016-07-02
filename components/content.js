var el = require('bel')
var css = require('sheetify')
var avatar = require('github-avatar-url')

module.exports = function (params, state, send) {
  var html = state.html
  var currentPage = params.page || state.current
  var page = html[currentPage]
  var pageData = state.contents.filter(function (item) {
    return item.key === currentPage
  })[0]

  var prefix = css`
    a.markdown-link {
      color: rgb(173,173,173);
      background: rgb(240,240,240);
      display: inline-block;
      position: absolute;
      margin-top: -50px;
      padding: 3px 5px;
      text-decoration: none;
    }

    a.markdown-link:hover {
      color: rgb(130,130,130);
      background: rgb(225,225,225);
    }

    img.contributor {
      border: none;
      background: rgb(225,225,225);
      width: 44px;
      height: 44px;
      margin-top: 3px;
    }

    div.contributor-wrapper {
      background: rgb(225,225,225);
      width: 50px;
      height: 50px;
      display: inline-block;
      text-align: center;
      margin-right: 5px;
      opacity: 0.8;
      cursor: pointer;
    }

    div.contributor-wrapper:hover {
      background: rgb(205,205,205);
      opacity: 0.95;
    }

    div.contributor-container {
      width: 40%;
      right: 12%;
      margin-top: -50px;
      position: absolute;
      display: inline-block;
      text-align: right;
    }
  `

  var contentWrapper = el`<div></div>`
  contentWrapper.innerHTML = page

  var link = pageData.source ? el`<a class="markdown-link" href="${pageData.source}">source</a>` : ''

  function contributors (items) {
    return items.map(function (item) {
      var user = item.replace('@', '')
      var img = el`<img class="${prefix} contributor"></img>`
      img.style.opacity = 0
      avatar(user, function (err, url) {
        img.src = url
        img.onload = function () {
          img.style.opacity = 1
        }
      })
      return el`<div class="${prefix} contributor-wrapper">
        <a href='https://github.com/${user}'>
          ${img}
        </a>
      </div>`
    })
  }

  if (pageData.contributors) {
    var contributorWrapper = el`<div class="${prefix} contributor-container">
      ${contributors(pageData.contributors)}
    </div>`
  }

  return el`<div class="${prefix} minidocs-content">
    ${link}
    ${contributorWrapper}
    ${contentWrapper}
  </div>`
}
