var css = require('dom-css')

module.exports = function (container, logo) {
  var style = {
    header: {
      width: '100%',
      paddingLeft: '0%',
      marginTop: '25px',
      verticalAlign: 'top',
      display: 'inline-block',
    },
    graphic: {
      width: '200px'
    }
  }

  var header = document.createElement('div')
  header.className = 'minidocs-header'
  css(header, style.header)
  container.appendChild(header)

  var graphic = document.createElement('img')
  css(graphic, style.graphic)
  graphic.src = logo
  header.appendChild(graphic)
}