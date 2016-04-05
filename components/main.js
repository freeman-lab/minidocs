var css = require('dom-css')

module.exports = function (container, documents) {
  var style = {
    wrapper: {
      width: '57%',
      height: window.innerHeight * 0.75,
      paddingLeft: '6%',
      paddingRight: '10%',
      paddingTop: window.innerHeight * 0.15,
      paddingBottom: window.innerHeight * 0.1,
      verticalAlign: 'top',
      display: 'inline-block',
      overflowY: 'scroll'
    },
    markdown: {

    }
  }

  var wrapper = document.createElement('div')
  wrapper.className = 'minidocs-main'
  css(wrapper, style.wrapper)
  container.appendChild(wrapper)

  var markdown = document.createElement('div')
  markdown.className = 'markdown-body'
  css(markdown, style.markdown)
  wrapper.appendChild(markdown)

  function show (text) {
    markdown.innerHTML = text
  }

  return {
    show: show
  }
}
