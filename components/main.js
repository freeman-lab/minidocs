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

    },
    link: {
      textDecoration: 'none',
      padding: '4px 6px',
      marginBottom: '10px',
      borderRadius: '2px'
    }
  }

  var wrapper = document.createElement('div')
  wrapper.className = 'minidocs-main'
  css(wrapper, style.wrapper)
  container.appendChild(wrapper)

  var link = document.createElement('a')
  css(link, style.link)
  wrapper.appendChild(link)

  var markdown = document.createElement('div')
  markdown.className = 'markdown-body'
  css(markdown, style.markdown)
  wrapper.appendChild(markdown)

  function show (opts) {
    if (wrapper.scrollTop > 0) wrapper.scrollTop = 0
    if (opts.link) {
      link.href = opts.link
      link.innerHTML = 'Source'
      link.className = 'markdown-link'
    } else {
      link.className = 'markdown-link hidden'
    }
    markdown.innerHTML = opts.text
  }

  return {
    show: show
  }
}
