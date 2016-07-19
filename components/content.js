var html = require('choo/html')
var css = require('sheetify')
var avatar = require('github-avatar-url')

module.exports = function (state, prev, send) {
  var currentPage = state.params.page || state.current
  var page = state.html[currentPage]
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

  var contentWrapper = html`<div></div>`
  contentWrapper.innerHTML = page

  var link = pageData.source ? html`<a class="markdown-link" href="${pageData.source}">source</a>` : ''

  function contributors (items) {
    return items.map(function (item) {
      if (!item) return
      var user = item.replace('@', '')
      var img = html`<img class="${prefix} contributor"></img>`
      img.style.opacity = 0
      avatar(user, function (err, url) {
        if (err) {
          // TODO: handle requests in effects, send error messages to state
          console.log(err)
        }
        img.src = url
        img.onload = function () {
          img.style.opacity = 1
        }
      })
      return html`<div class="${prefix} contributor-wrapper">
        <a href='https://github.com/${user}'>
          ${img}
        </a>
      </div>`
    })
  }

  if (pageData.contributors) {
    var contributorWrapper = html`<div class="${prefix} contributor-container">
      ${contributors(pageData.contributors)}
    </div>`
  }

  return html`<div class="${prefix} minidocs-content">
    ${link}
    ${contributorWrapper}
    ${contentWrapper}
  </div>`
}
