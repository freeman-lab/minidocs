var css = require('dom-css')

module.exports = function (container, logo, title) {
  var style = {
    header: {
      width: '100%',
      paddingLeft: '0%',
      marginTop: '30px',
      height: window.innerHeight * 0.09,
      marginBottom: '0px',
      verticalAlign: 'top',
      display: 'inline-block'
    },
    logo: {
      width: '200px'
    },
    title: {
      fontSize: '300%',
      fontFamily: 'clear_sans_mediumregular'
    }
  }

  var header = document.createElement('div')
  header.className = 'minidocs-header'
  css(header, style.header)
  container.appendChild(header)

  var el
  if (logo) {
    el = document.createElement('img')
    css(el, style.logo)
    el.src = logo
  } else if (title) {
    el = document.createElement('div')
    el.innerHTML = title
    css(el, style.title)
  } else {
    el = document.createElement('div')
    css(el, style.title)
    css(header, {height: window.innerHeight * 0})
  }

  header.appendChild(el)
}
