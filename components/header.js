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
      fontSize: '300%'
    }
  }

  var header = document.createElement('div')
  header.className = 'minidocs-header'
  css(header, style.header)
  container.appendChild(header)

  if (logo) {
    var img = document.createElement('img')
    css(img, style.logo)
    img.src = logo
    header.appendChild(img)
  } else {
    var div = document.createElement('div')
    div.innerHTML = title
    css(div, style.title)
    header.appendChild(div)
  }
}
