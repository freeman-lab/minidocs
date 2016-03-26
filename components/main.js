var yo = require('yo-yo')
var css = require('dom-css')

module.exports = function (state) {
  var main = yo`
  <div>
    main panel
  </div>
  `
  css(main, {width: '75%', verticalAlign: 'top', display: 'inline-block'})
  return main
}