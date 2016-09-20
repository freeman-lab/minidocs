(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var choo = require('choo')

var main = require('./components/main')

module.exports = function (opts) {
  opts.basedir = (opts.basedir || '').replace(/\/$/, '')
  var app = choo()

  app.model({
    state: {
      title: opts.title,
      logo: opts.logo,
      contents: opts.contents,
      html: opts.html,
      routes: opts.routes,
      current: opts.initial,
      basedir: opts.basedir
    },
    reducers: {},
    subscriptions: [
      function catchLinks (send, done) {
        window.onclick = function (e) {
          var node = (function traverse (node) {
            if (!node) return
            if (node.localName !== 'a') return traverse(node.parentNode)
            if (node.href === undefined) return traverse(node.parentNode)
            if (window.location.host !== node.host) return traverse(node.parentNode)
            return node
          })(e.target)

          if (!node) return
          e.preventDefault()
          var href = node.href

          if (location.pathname !== node.pathname) {
            send('location:setLocation', { location: href }, done)
            window.history.pushState(null, null, href)
            document.body.scrollTop = 0
          } else {
            window.location.hash = node.hash
            var el = document.querySelector(node.hash)
            window.scrollTo(0, el.offsetTop)
          }
        }
      }
    ]
  })

  app.model({
    namespace: 'menu',
    state: {
      open: false,
      size: 'small'
    },
    reducers: {
      set: function (data, state) {
        return data
      },
      size: function (data, state) {
        return data
      }
    },
    subscriptions: [
      checkSize,
      function (send, done) {
        window.onresize = function () {
          checkSize(send, done)
        }
      }
    ]
  })

  function checkSize (send, done) {
    var size = window.innerWidth > 600 ? 'large' : 'small'
    send('menu:size', { size: size }, done)
  }

  app.router(function (route) {
    var routes = [
      route('/', main),
      route('/:page', main)
    ]

    if (opts.basedir) {
      return route(opts.basedir, routes)
    }

    return routes
  })

  return app
}

},{"./components/main":3,"choo":66}],2:[function(require,module,exports){
var html = require('choo/html')
var css = 0
var avatar = require('github-avatar-url')

module.exports = function (state, prev, send) {
  var currentPage = state.params.page || state.current
  var page = state.html[currentPage]
  var pageData = state.contents.filter(function (item) {
    return item.key === currentPage
  })[0]

  var prefix = ((require('insert-css')("._d706bf45 a.markdown-link {\n      color: rgb(173,173,173);\n      background: rgb(240,240,240);\n      display: inline-block;\n      position: absolute;\n      margin-top: -50px;\n      padding: 3px 5px;\n      text-decoration: none;\n    }\n\n    ._d706bf45 a.markdown-link:hover {\n      color: rgb(130,130,130);\n      background: rgb(225,225,225);\n    }\n\n    ._d706bf45 img.contributor {\n      border: none;\n      vertical-align: top;\n    }\n\n    ._d706bf45 div.contributor-wrapper {\n      width: 30px;\n      height: 30px;\n      display: inline-block;\n      text-align: center;\n      margin-right: 5px;\n      opacity: 0.8;\n      cursor: pointer;\n      border: 3px solid rgb(225, 225, 225);\n    }\n\n    ._d706bf45 div.contributor-wrapper:hover {\n      background: rgb(205,205,205);\n      opacity: 0.95;\n    }\n\n    ._d706bf45 div.contributor-container {\n      width: 60%;\n      right: 40px;\n      margin-top: -50px;\n      position: relative;\n      display: inline-block;\n      text-align: right;\n      float: right;\n    }\n\n    @media (min-width: 600px) {\n      ._d706bf45 div.contributor-wrapper {\n        width: 50px;\n        height: 50px;\n      }\n      ._d706bf45 div.contributor-container {\n        right: 0px;\n      }\n    }") || true) && "_d706bf45")

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

},{"choo/html":65,"github-avatar-url":76,"insert-css":93}],3:[function(require,module,exports){
var html = require('choo/html')
var css = 0
var sidebar = require('./sidebar')
var content = require('./content')

module.exports = function (state, prev, send) {
  var prefix = ((require('insert-css')("._6781b8a1 {\n      width: 100%;\n      padding: 40px;\n      vertical-align: top;\n      display: inline-block;\n      box-sizing: border-box;\n    }\n\n    @media (min-width: 600px) {\n      ._6781b8a1 {\n        position: absolute;\n        right: 0;\n        width: 73%;\n        padding: 125.9px 8% 70.6px 8%;\n        vertical-align: top;\n        display: inline-block;\n      }\n    }\n\n    @media (min-width: 900px) {\n      ._6781b8a1 {\n        width: 77%;\n        padding: 125.9px 6% 70.6px 6%;\n      }\n    }") || true) && "_6781b8a1")

  return html`<div id="choo-root" class="minidocs"}>
    ${sidebar(state, prev, send)}
    <div class="${prefix} minidocs-main">
      <div class="markdown-body">
        ${content(state, prev, send)}
      </div>
    </div>
  </div>`
}

},{"./content":2,"./sidebar":5,"choo/html":65,"insert-css":93}],4:[function(require,module,exports){
var url = require('url')
var css = 0
var html = require('choo/html')

module.exports = function (state, prev, send) {
  var contents = state.contents

  var prefix = ((require('insert-css')("._df8df972 {\n\n    }\n\n    ._df8df972 .h2 {\n      display: block;\n      font-size: 1.5em;\n      font-weight: bold;\n      margin-top: 12px;\n      margin-bottom: 12px;\n    }\n\n    ._df8df972 .minidocs-menu, ._df8df972 .minidocs-menu.menu-closed {\n      display: none;\n      z-index: 1000;\n    }\n\n    ._df8df972 .minidocs-menu.menu-open.menu-small {\n      display: block;\n      background-color: rgb(240,240,240);\n      position: fixed;\n      width: 100%;\n      top: 0;\n      height: 100%;\n      padding: 50px;\n      margin-bottom:  0px;\n      box-sizing: border-box;\n    }\n\n    ._df8df972 .minidocs-menu.menu-open.menu-small .minidocs-menu-wrapper {\n      height: 100%;\n      overflow-y: auto;\n    }\n\n    ._df8df972 a.content-link {\n      padding: 2px 8px 2px 5px;\n      margin-bottom: 1px;\n      cursor: pointer;\n      text-decoration: none;\n      color: #505050;\n      display: block;\n      border-left: 3px solid #eee;\n    }\n\n    ._df8df972 a.content-link.active, ._df8df972 a.content-link:hover {\n      background-color: #fff;\n      border-left: 3px solid rgb(200,200,200);\n    }\n\n    ._df8df972 .minidocs-menu-toggle {\n      display: block;\n      position: absolute;\n      top: 10px;\n      left: 10px;\n      border: 0px;\n      background: transparent;\n      padding-left: 20px;\n      line-height: 0.9;\n      z-index: 2000;\n      cursor: pointer;\n      font-size: 16px;\n    }\n\n    ._df8df972 .minidocs-menu-toggle:before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      top: 0.25em;\n      width: 1em;\n      height: 0.15em;\n      background: black;\n      box-shadow: \n        0 0.25em 0 0 black,\n        0 0.5em 0 0 black;\n    }\n\n    @media (min-width: 600px) {\n      ._df8df972 .minidocs-menu {\n        display: block;\n        margin-bottom: 25px;\n      }\n\n      ._df8df972 .minidocs-menu-toggle {\n        display: none;\n      }\n    }") || true) && "_df8df972")

  function createMenu (contents) {
    return contents.map(function (item) {
      // TODO: figure out a better way to get current page in state based on link click
      var current
      var location

      if (state.location && state.location.pathname) {
        location = url.parse(state.location.pathname)
        var sliceBy = state.basedir.length + 1
        current = location.pathname.slice(sliceBy)
      }

      if (!current || current.length <= 1) {
        current = state.current
      }

      function onclick (e) {
        send('menu:set', { open: false })
      }

      if (item.link) {
        return html`<div><a href="${item.link}" class="content-link ${isActive(current, item.key)}" onclick=${onclick}>${item.name}</a></div>`
      }

      return html`<div class="h${item.depth}">${item.name}</div>`
    })
  }

  function isActive (current, item) {
    return current === item ? 'active' : ''
  }

  function isOpen () {
    if (typeof window !== 'undefined' && window.innerWidth > 600) return 'menu-open'
    return state.menu.open ? 'menu-open' : 'menu-closed'
  }

  function onclick (e) {
    send('menu:set', { open: !state.menu.open })
  }

  return html`<div class="${prefix} minidocs-contents">
    <button class="minidocs-menu-toggle" onclick=${onclick}>Menu</button>
    <div class="minidocs-menu ${isOpen()} menu-${state.menu.size}">
      <div class="minidocs-menu-wrapper">
        ${createMenu(contents)}
      </div>
    </div>
  </div>`
}

},{"choo/html":65,"insert-css":93,"url":53}],5:[function(require,module,exports){
var url = require('url')
var css = 0
var html = require('choo/html')

var menu = require('./menu')

module.exports = function (state, prev, send) {
  var contents = state.contents

  var prefix = ((require('insert-css')("._68ad6959 {\n      width: 100%;\n    }\n\n    ._68ad6959 .minidocs-logo {\n      width: 100%;\n    }\n\n    ._68ad6959 .minidocs-header {\n      width: 40%;\n      max-width: 250px;\n      margin: 0px auto;\n    }\n\n    ._68ad6959 .h1 {\n      display: block;\n      font-size: 2em;\n      font-weight: bold;\n      margin-top: 16px;\n      margin-bottom: 16px;\n    }\n\n    ._68ad6959 .h1:before {\n      content: '# '\n    }\n\n    ._68ad6959 h1 a {\n      color: #505050;\n      text-decoration: none;\n    }\n\n    ._68ad6959 h1 a:hover {\n      color: #222;\n    }\n\n    @media (min-width: 600px) {\n      ._68ad6959 {\n        width: 21%;\n        padding: 0px 20px 20px 35px;\n        display: inline-block;\n        padding-bottom: 3%;\n        overflow-y: scroll;\n        background: rgb(240,240,240);\n        height: 100%;\n        position: fixed;\n        top: 0;\n        bottom: 0;\n      }\n\n      ._68ad6959 .minidocs-header {\n        width: 100%;\n        max-width: 250px;\n        margin: 0px auto;\n      }\n\n      ._68ad6959 .minidocs-logo {\n        width: 100%;\n        max-width: 250px;\n      }\n    }") || true) && "_68ad6959")

  function createHeader () {
    if (state.logo) {
      return html`
        <img class="minidocs-logo" src="${state.basedir + '/' + state.logo}" alt="${state.title}">
      `
    }
    return state.title
  }

  return html`<div class="${prefix} minidocs-sidebar">
    <div class="minidocs-header">
      <h1><a href="${state.basedir}/">${createHeader()}</a></h1>
    </div>
    ${menu(state, prev, send)}
  </div>`
}

},{"./menu":4,"choo/html":65,"insert-css":93,"url":53}],6:[function(require,module,exports){


var app = require('minidocs')({"contents":[{"depth":1,"name":"overview"},{"depth":2,"name":"about","source":"http://github.com/freeman-lab/minidocs","contributors":["@sethvincent","@yoshuawuyts","@freeman-lab","@fraserxu"],"key":"about","link":"/about"},{"depth":1,"name":"animals"},{"depth":2,"name":"furry"},{"depth":3,"name":"sheep","key":"sheep","link":"/sheep"},{"depth":3,"name":"puppy","key":"puppy","link":"/puppy"},{"depth":2,"name":"pink"},{"depth":3,"name":"pig","key":"pig","link":"/pig"}],"markdown":"./markdown","logo":"./logo.svg","dir":"/Users/sdv/workspace/freeman-lab/minidocs/example","initial":"about","routes":{"index":"/","about":"/about/","sheep":"/sheep/","puppy":"/puppy/","pig":"/pig/"},"html":{"about":"<h1 id=\"about\">about</h1>\n<p>Hello! This is an introduction to an example site built with <a href=\"https://github.com/freeman-lab/minidocs\"><code>minidocs</code></a>.</p>\n<h3 id=\"how-it-works\">how it works</h3>\n<p>Just make a folder of markdown files, and specify an object describing the table of contents</p>\n<pre><code class=\"lang-javascript\"><span class=\"hljs-keyword\">var</span> contents = {\n  <span class=\"hljs-string\">'overview'</span>: {\n    <span class=\"hljs-string\">'about'</span>: <span class=\"hljs-string\">'about.md'</span>\n  },\n  <span class=\"hljs-string\">'animals'</span>: {\n    <span class=\"hljs-string\">'furry'</span>: {\n      <span class=\"hljs-string\">'sheep'</span>: <span class=\"hljs-string\">'sheep.md'</span>,\n      <span class=\"hljs-string\">'puppy'</span>: <span class=\"hljs-string\">'puppy.md'</span>\n    },\n    <span class=\"hljs-string\">'pink'</span>: {\n      <span class=\"hljs-string\">'pig'</span>: <span class=\"hljs-string\">'pig.md'</span>\n    }\n  }\n}\n</code></pre>\n<p>Then build the site with <code>require(&#39;minidocs&#39;)(contents, {logo: &#39;logo.svg&#39;})</code></p>\n<p><b>Have fun with minidocs!</b></p>\n","sheep":"<h1 id=\"sheep\">sheep</h1>\n<p>i am a sheep, i say bahhhhhh!</p>\n","puppy":"<h1 id=\"puppy\">puppy</h1>\n<p>i am a puppy, i say woof!</p>\n","pig":"<h1 id=\"pig\">pig</h1>\n<p>i am a pig, i say oink!</p>\n<p>test</p>\n<p>test</p>\n<p>test</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<h2 id=\"pigs-like-pizza\">pigs like pizza</h2>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test\ntest</p>\n<p>test</p>\n<p><a href=\"/about\">about minidocs</a></p>\n"}})

var tree = app.start({ href: false })
document.body.appendChild(tree)

},{"minidocs":59}],7:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":57}],8:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
(function (process,Buffer){
var msg = require('pako/lib/zlib/messages');
var zstream = require('pako/lib/zlib/zstream');
var zlib_deflate = require('pako/lib/zlib/deflate.js');
var zlib_inflate = require('pako/lib/zlib/inflate.js');
var constants = require('pako/lib/zlib/constants');

for (var key in constants) {
  exports[key] = constants[key];
}

// zlib modes
exports.NONE = 0;
exports.DEFLATE = 1;
exports.INFLATE = 2;
exports.GZIP = 3;
exports.GUNZIP = 4;
exports.DEFLATERAW = 5;
exports.INFLATERAW = 6;
exports.UNZIP = 7;

/**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */
function Zlib(mode) {
  if (mode < exports.DEFLATE || mode > exports.UNZIP)
    throw new TypeError("Bad argument");
    
  this.mode = mode;
  this.init_done = false;
  this.write_in_progress = false;
  this.pending_close = false;
  this.windowBits = 0;
  this.level = 0;
  this.memLevel = 0;
  this.strategy = 0;
  this.dictionary = null;
}

Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
  this.windowBits = windowBits;
  this.level = level;
  this.memLevel = memLevel;
  this.strategy = strategy;
  // dictionary not supported.
  
  if (this.mode === exports.GZIP || this.mode === exports.GUNZIP)
    this.windowBits += 16;
    
  if (this.mode === exports.UNZIP)
    this.windowBits += 32;
    
  if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW)
    this.windowBits = -this.windowBits;
    
  this.strm = new zstream();
  
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflateInit2(
        this.strm,
        this.level,
        exports.Z_DEFLATED,
        this.windowBits,
        this.memLevel,
        this.strategy
      );
      break;
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
    case exports.UNZIP:
      var status  = zlib_inflate.inflateInit2(
        this.strm,
        this.windowBits
      );
      break;
    default:
      throw new Error("Unknown mode " + this.mode);
  }
  
  if (status !== exports.Z_OK) {
    this._error(status);
    return;
  }
  
  this.write_in_progress = false;
  this.init_done = true;
};

Zlib.prototype.params = function() {
  throw new Error("deflateParams Not supported");
};

Zlib.prototype._writeCheck = function() {
  if (!this.init_done)
    throw new Error("write before init");
    
  if (this.mode === exports.NONE)
    throw new Error("already finalized");
    
  if (this.write_in_progress)
    throw new Error("write already in progress");
    
  if (this.pending_close)
    throw new Error("close is pending");
};

Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {    
  this._writeCheck();
  this.write_in_progress = true;
  
  var self = this;
  process.nextTick(function() {
    self.write_in_progress = false;
    var res = self._write(flush, input, in_off, in_len, out, out_off, out_len);
    self.callback(res[0], res[1]);
    
    if (self.pending_close)
      self.close();
  });
  
  return this;
};

// set method for Node buffers, used by pako
function bufferSet(data, offset) {
  for (var i = 0; i < data.length; i++) {
    this[offset + i] = data[i];
  }
}

Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this._writeCheck();
  return this._write(flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype._write = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this.write_in_progress = true;
  
  if (flush !== exports.Z_NO_FLUSH &&
      flush !== exports.Z_PARTIAL_FLUSH &&
      flush !== exports.Z_SYNC_FLUSH &&
      flush !== exports.Z_FULL_FLUSH &&
      flush !== exports.Z_FINISH &&
      flush !== exports.Z_BLOCK) {
    throw new Error("Invalid flush value");
  }
  
  if (input == null) {
    input = new Buffer(0);
    in_len = 0;
    in_off = 0;
  }
  
  if (out._set)
    out.set = out._set;
  else
    out.set = bufferSet;
  
  var strm = this.strm;
  strm.avail_in = in_len;
  strm.input = input;
  strm.next_in = in_off;
  strm.avail_out = out_len;
  strm.output = out;
  strm.next_out = out_off;
  
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflate(strm, flush);
      break;
    case exports.UNZIP:
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
      var status = zlib_inflate.inflate(strm, flush);
      break;
    default:
      throw new Error("Unknown mode " + this.mode);
  }
  
  if (status !== exports.Z_STREAM_END && status !== exports.Z_OK) {
    this._error(status);
  }
  
  this.write_in_progress = false;
  return [strm.avail_in, strm.avail_out];
};

Zlib.prototype.close = function() {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }
  
  this.pending_close = false;
  
  if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
    zlib_deflate.deflateEnd(this.strm);
  } else {
    zlib_inflate.inflateEnd(this.strm);
  }
  
  this.mode = exports.NONE;
};

Zlib.prototype.reset = function() {
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflateReset(this.strm);
      break;
    case exports.INFLATE:
    case exports.INFLATERAW:
      var status = zlib_inflate.inflateReset(this.strm);
      break;
  }
  
  if (status !== exports.Z_OK) {
    this._error(status);
  }
};

Zlib.prototype._error = function(status) {
  this.onerror(msg[status] + ': ' + this.strm.msg, status);
  
  this.write_in_progress = false;
  if (this.pending_close)
    this.close();
};

exports.Zlib = Zlib;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":35,"buffer":14,"pako/lib/zlib/constants":25,"pako/lib/zlib/deflate.js":27,"pako/lib/zlib/inflate.js":29,"pako/lib/zlib/messages":31,"pako/lib/zlib/zstream":33}],11:[function(require,module,exports){
(function (process,Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Transform = require('_stream_transform');

var binding = require('./binding');
var util = require('util');
var assert = require('assert').ok;

// zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.
binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15;

// fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.
binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = (16 * 1024);

binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;

binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;

// expose all the zlib constants
Object.keys(binding).forEach(function(k) {
  if (k.match(/^Z/)) exports[k] = binding[k];
});

// translation table for return codes.
exports.codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};

Object.keys(exports.codes).forEach(function(k) {
  exports.codes[exports.codes[k]] = k;
});

exports.Deflate = Deflate;
exports.Inflate = Inflate;
exports.Gzip = Gzip;
exports.Gunzip = Gunzip;
exports.DeflateRaw = DeflateRaw;
exports.InflateRaw = InflateRaw;
exports.Unzip = Unzip;

exports.createDeflate = function(o) {
  return new Deflate(o);
};

exports.createInflate = function(o) {
  return new Inflate(o);
};

exports.createDeflateRaw = function(o) {
  return new DeflateRaw(o);
};

exports.createInflateRaw = function(o) {
  return new InflateRaw(o);
};

exports.createGzip = function(o) {
  return new Gzip(o);
};

exports.createGunzip = function(o) {
  return new Gunzip(o);
};

exports.createUnzip = function(o) {
  return new Unzip(o);
};


// Convenience methods.
// compress/decompress a string or buffer in one step.
exports.deflate = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Deflate(opts), buffer, callback);
};

exports.deflateSync = function(buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
};

exports.gzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gzip(opts), buffer, callback);
};

exports.gzipSync = function(buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
};

exports.deflateRaw = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
};

exports.deflateRawSync = function(buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
};

exports.unzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Unzip(opts), buffer, callback);
};

exports.unzipSync = function(buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
};

exports.inflate = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Inflate(opts), buffer, callback);
};

exports.inflateSync = function(buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
};

exports.gunzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gunzip(opts), buffer, callback);
};

exports.gunzipSync = function(buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
};

exports.inflateRaw = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new InflateRaw(opts), buffer, callback);
};

exports.inflateRawSync = function(buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
};

function zlibBuffer(engine, buffer, callback) {
  var buffers = [];
  var nread = 0;

  engine.on('error', onError);
  engine.on('end', onEnd);

  engine.end(buffer);
  flow();

  function flow() {
    var chunk;
    while (null !== (chunk = engine.read())) {
      buffers.push(chunk);
      nread += chunk.length;
    }
    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf = Buffer.concat(buffers, nread);
    buffers = [];
    callback(null, buf);
    engine.close();
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === 'string')
    buffer = new Buffer(buffer);
  if (!Buffer.isBuffer(buffer))
    throw new TypeError('Not a string or buffer');

  var flushFlag = binding.Z_FINISH;

  return engine._processChunk(buffer, flushFlag);
}

// generic zlib
// minimal 2-byte header
function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
}



// gzip - bigger header, same deflate compression
function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
}



// raw - no header
function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
}


// auto-detect header.
function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}


// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.

function Zlib(opts, mode) {
  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;

  Transform.call(this, opts);

  if (opts.flush) {
    if (opts.flush !== binding.Z_NO_FLUSH &&
        opts.flush !== binding.Z_PARTIAL_FLUSH &&
        opts.flush !== binding.Z_SYNC_FLUSH &&
        opts.flush !== binding.Z_FULL_FLUSH &&
        opts.flush !== binding.Z_FINISH &&
        opts.flush !== binding.Z_BLOCK) {
      throw new Error('Invalid flush flag: ' + opts.flush);
    }
  }
  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;

  if (opts.chunkSize) {
    if (opts.chunkSize < exports.Z_MIN_CHUNK ||
        opts.chunkSize > exports.Z_MAX_CHUNK) {
      throw new Error('Invalid chunk size: ' + opts.chunkSize);
    }
  }

  if (opts.windowBits) {
    if (opts.windowBits < exports.Z_MIN_WINDOWBITS ||
        opts.windowBits > exports.Z_MAX_WINDOWBITS) {
      throw new Error('Invalid windowBits: ' + opts.windowBits);
    }
  }

  if (opts.level) {
    if (opts.level < exports.Z_MIN_LEVEL ||
        opts.level > exports.Z_MAX_LEVEL) {
      throw new Error('Invalid compression level: ' + opts.level);
    }
  }

  if (opts.memLevel) {
    if (opts.memLevel < exports.Z_MIN_MEMLEVEL ||
        opts.memLevel > exports.Z_MAX_MEMLEVEL) {
      throw new Error('Invalid memLevel: ' + opts.memLevel);
    }
  }

  if (opts.strategy) {
    if (opts.strategy != exports.Z_FILTERED &&
        opts.strategy != exports.Z_HUFFMAN_ONLY &&
        opts.strategy != exports.Z_RLE &&
        opts.strategy != exports.Z_FIXED &&
        opts.strategy != exports.Z_DEFAULT_STRATEGY) {
      throw new Error('Invalid strategy: ' + opts.strategy);
    }
  }

  if (opts.dictionary) {
    if (!Buffer.isBuffer(opts.dictionary)) {
      throw new Error('Invalid dictionary: it should be a Buffer instance');
    }
  }

  this._binding = new binding.Zlib(mode);

  var self = this;
  this._hadError = false;
  this._binding.onerror = function(message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
    self._binding = null;
    self._hadError = true;

    var error = new Error(message);
    error.errno = errno;
    error.code = exports.codes[errno];
    self.emit('error', error);
  };

  var level = exports.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level === 'number') level = opts.level;

  var strategy = exports.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy === 'number') strategy = opts.strategy;

  this._binding.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS,
                     level,
                     opts.memLevel || exports.Z_DEFAULT_MEMLEVEL,
                     strategy,
                     opts.dictionary);

  this._buffer = new Buffer(this._chunkSize);
  this._offset = 0;
  this._closed = false;
  this._level = level;
  this._strategy = strategy;

  this.once('end', this.close);
}

util.inherits(Zlib, Transform);

Zlib.prototype.params = function(level, strategy, callback) {
  if (level < exports.Z_MIN_LEVEL ||
      level > exports.Z_MAX_LEVEL) {
    throw new RangeError('Invalid compression level: ' + level);
  }
  if (strategy != exports.Z_FILTERED &&
      strategy != exports.Z_HUFFMAN_ONLY &&
      strategy != exports.Z_RLE &&
      strategy != exports.Z_FIXED &&
      strategy != exports.Z_DEFAULT_STRATEGY) {
    throw new TypeError('Invalid strategy: ' + strategy);
  }

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function() {
      self._binding.params(level, strategy);
      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        if (callback) callback();
      }
    });
  } else {
    process.nextTick(callback);
  }
};

Zlib.prototype.reset = function() {
  return this._binding.reset();
};

// This is the _flush function called by the transform class,
// internally, when the last chunk has been written.
Zlib.prototype._flush = function(callback) {
  this._transform(new Buffer(0), '', callback);
};

Zlib.prototype.flush = function(kind, callback) {
  var ws = this._writableState;

  if (typeof kind === 'function' || (kind === void 0 && !callback)) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) {
    if (callback)
      process.nextTick(callback);
  } else if (ws.ending) {
    if (callback)
      this.once('end', callback);
  } else if (ws.needDrain) {
    var self = this;
    this.once('drain', function() {
      self.flush(callback);
    });
  } else {
    this._flushFlag = kind;
    this.write(new Buffer(0), '', callback);
  }
};

Zlib.prototype.close = function(callback) {
  if (callback)
    process.nextTick(callback);

  if (this._closed)
    return;

  this._closed = true;

  this._binding.close();

  var self = this;
  process.nextTick(function() {
    self.emit('close');
  });
};

Zlib.prototype._transform = function(chunk, encoding, cb) {
  var flushFlag;
  var ws = this._writableState;
  var ending = ws.ending || ws.ended;
  var last = ending && (!chunk || ws.length === chunk.length);

  if (!chunk === null && !Buffer.isBuffer(chunk))
    return cb(new Error('invalid input'));

  // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag.
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.
  if (last)
    flushFlag = binding.Z_FINISH;
  else {
    flushFlag = this._flushFlag;
    // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.
    if (chunk.length >= ws.length) {
      this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
    }
  }

  var self = this;
  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length;
  var availOutBefore = this._chunkSize - this._offset;
  var inOff = 0;

  var self = this;

  var async = typeof cb === 'function';

  if (!async) {
    var buffers = [];
    var nread = 0;

    var error;
    this.on('error', function(er) {
      error = er;
    });

    do {
      var res = this._binding.writeSync(flushFlag,
                                        chunk, // in
                                        inOff, // in_off
                                        availInBefore, // in_len
                                        this._buffer, // out
                                        this._offset, //out_off
                                        availOutBefore); // out_len
    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) {
      throw error;
    }

    var buf = Buffer.concat(buffers, nread);
    this.close();

    return buf;
  }

  var req = this._binding.write(flushFlag,
                                chunk, // in
                                inOff, // in_off
                                availInBefore, // in_len
                                this._buffer, // out
                                this._offset, //out_off
                                availOutBefore); // out_len

  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    if (self._hadError)
      return;

    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;
      // serve some output to the consumer.
      if (async) {
        self.push(out);
      } else {
        buffers.push(out);
        nread += out.length;
      }
    }

    // exhausted the output buffer, or used all the input create a new one.
    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = new Buffer(self._chunkSize);
    }

    if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
      inOff += (availInBefore - availInAfter);
      availInBefore = availInAfter;

      if (!async)
        return true;

      var newReq = self._binding.write(flushFlag,
                                       chunk,
                                       inOff,
                                       availInBefore,
                                       self._buffer,
                                       self._offset,
                                       self._chunkSize);
      newReq.callback = callback; // this same function
      newReq.buffer = chunk;
      return;
    }

    if (!async)
      return false;

    // finished with the chunk.
    cb();
  }
};

util.inherits(Deflate, Zlib);
util.inherits(Inflate, Zlib);
util.inherits(Gzip, Zlib);
util.inherits(Gunzip, Zlib);
util.inherits(DeflateRaw, Zlib);
util.inherits(InflateRaw, Zlib);
util.inherits(Unzip, Zlib);

}).call(this,require('_process'),require("buffer").Buffer)
},{"./binding":10,"_process":35,"_stream_transform":46,"assert":7,"buffer":14,"util":57}],12:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],13:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":14}],14:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = byteOffset; i < arrLength; ++i) {
    if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }

  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":8,"ieee754":19,"isarray":22}],15:[function(require,module,exports){
module.exports = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content",
  "207": "Multi-Status",
  "208": "Already Reported",
  "226": "IM Used",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": "Found",
  "303": "See Other",
  "304": "Not Modified",
  "305": "Use Proxy",
  "307": "Temporary Redirect",
  "308": "Permanent Redirect",
  "400": "Bad Request",
  "401": "Unauthorized",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed",
  "413": "Payload Too Large",
  "414": "URI Too Long",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable",
  "417": "Expectation Failed",
  "418": "I'm a teapot",
  "421": "Misdirected Request",
  "422": "Unprocessable Entity",
  "423": "Locked",
  "424": "Failed Dependency",
  "425": "Unordered Collection",
  "426": "Upgrade Required",
  "428": "Precondition Required",
  "429": "Too Many Requests",
  "431": "Request Header Fields Too Large",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates",
  "507": "Insufficient Storage",
  "508": "Loop Detected",
  "509": "Bandwidth Limit Exceeded",
  "510": "Not Extended",
  "511": "Network Authentication Required"
}

},{}],16:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":21}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],18:[function(require,module,exports){
var http = require('http');

var https = module.exports;

for (var key in http) {
    if (http.hasOwnProperty(key)) https[key] = http[key];
};

https.request = function (params, cb) {
    if (!params) params = {};
    params.scheme = 'https';
    params.protocol = 'https:';
    return http.request.call(this, params, cb);
}

},{"http":47}],19:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],20:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],21:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],22:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],23:[function(require,module,exports){
'use strict';


var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');


exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);

},{}],24:[function(require,module,exports){
'use strict';

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;

},{}],25:[function(require,module,exports){
'use strict';


module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

},{}],26:[function(require,module,exports){
'use strict';

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.


// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;

},{}],27:[function(require,module,exports){
'use strict';

var utils   = require('../utils/common');
var trees   = require('./trees');
var adler32 = require('./adler32');
var crc32   = require('./crc32');
var msg     = require('./messages');

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}


exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

},{"../utils/common":23,"./adler32":24,"./crc32":26,"./messages":31,"./trees":32}],28:[function(require,module,exports){
'use strict';

// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

},{}],29:[function(require,module,exports){
'use strict';


var utils         = require('../utils/common');
var adler32       = require('./adler32');
var crc32         = require('./crc32');
var inflate_fast  = require('./inffast');
var inflate_table = require('./inftrees');

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
    case HEAD:
      if (state.wrap === 0) {
        state.mode = TYPEDO;
        break;
      }
      //=== NEEDBITS(16);
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//

        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = FLAGS;
        break;
      }
      state.flags = 0;           /* expect zlib header */
      if (state.head) {
        state.head.done = false;
      }
      if (!(state.wrap & 1) ||   /* check if zlib header allowed */
        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
        strm.msg = 'incorrect header check';
        state.mode = BAD;
        break;
      }
      if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
      len = (hold & 0x0f)/*BITS(4)*/ + 8;
      if (state.wbits === 0) {
        state.wbits = len;
      }
      else if (len > state.wbits) {
        strm.msg = 'invalid window size';
        state.mode = BAD;
        break;
      }
      state.dmax = 1 << len;
      //Tracev((stderr, "inflate:   zlib header ok\n"));
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = hold & 0x200 ? DICTID : TYPE;
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      break;
    case FLAGS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.flags = hold;
      if ((state.flags & 0xff) !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      if (state.flags & 0xe000) {
        strm.msg = 'unknown header flags set';
        state.mode = BAD;
        break;
      }
      if (state.head) {
        state.head.text = ((hold >> 8) & 1);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = TIME;
      /* falls through */
    case TIME:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.time = hold;
      }
      if (state.flags & 0x0200) {
        //=== CRC4(state.check, hold)
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        hbuf[2] = (hold >>> 16) & 0xff;
        hbuf[3] = (hold >>> 24) & 0xff;
        state.check = crc32(state.check, hbuf, 4, 0);
        //===
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = OS;
      /* falls through */
    case OS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.xflags = (hold & 0xff);
        state.head.os = (hold >> 8);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = EXLEN;
      /* falls through */
    case EXLEN:
      if (state.flags & 0x0400) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length = hold;
        if (state.head) {
          state.head.extra_len = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      else if (state.head) {
        state.head.extra = null/*Z_NULL*/;
      }
      state.mode = EXTRA;
      /* falls through */
    case EXTRA:
      if (state.flags & 0x0400) {
        copy = state.length;
        if (copy > have) { copy = have; }
        if (copy) {
          if (state.head) {
            len = state.head.extra_len - state.length;
            if (!state.head.extra) {
              // Use untyped array for more conveniend processing later
              state.head.extra = new Array(state.head.extra_len);
            }
            utils.arraySet(
              state.head.extra,
              input,
              next,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              len
            );
            //zmemcpy(state.head.extra + len, next,
            //        len + copy > state.head.extra_max ?
            //        state.head.extra_max - len : copy);
          }
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          state.length -= copy;
        }
        if (state.length) { break inf_leave; }
      }
      state.length = 0;
      state.mode = NAME;
      /* falls through */
    case NAME:
      if (state.flags & 0x0800) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          // TODO: 2 or 1 bytes?
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.name_max*/)) {
            state.head.name += String.fromCharCode(len);
          }
        } while (len && copy < have);

        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.name = null;
      }
      state.length = 0;
      state.mode = COMMENT;
      /* falls through */
    case COMMENT:
      if (state.flags & 0x1000) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.comm_max*/)) {
            state.head.comment += String.fromCharCode(len);
          }
        } while (len && copy < have);
        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.comment = null;
      }
      state.mode = HCRC;
      /* falls through */
    case HCRC:
      if (state.flags & 0x0200) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.check & 0xffff)) {
          strm.msg = 'header crc mismatch';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      if (state.head) {
        state.head.hcrc = ((state.flags >> 9) & 1);
        state.head.done = true;
      }
      strm.adler = state.check = 0;
      state.mode = TYPE;
      break;
    case DICTID:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      strm.adler = state.check = zswap32(hold);
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = DICT;
      /* falls through */
    case DICT:
      if (state.havedict === 0) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        return Z_NEED_DICT;
      }
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = TYPE;
      /* falls through */
    case TYPE:
      if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case TYPEDO:
      if (state.last) {
        //--- BYTEBITS() ---//
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        state.mode = CHECK;
        break;
      }
      //=== NEEDBITS(3); */
      while (bits < 3) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.last = (hold & 0x01)/*BITS(1)*/;
      //--- DROPBITS(1) ---//
      hold >>>= 1;
      bits -= 1;
      //---//

      switch ((hold & 0x03)/*BITS(2)*/) {
      case 0:                             /* stored block */
        //Tracev((stderr, "inflate:     stored block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = STORED;
        break;
      case 1:                             /* fixed block */
        fixedtables(state);
        //Tracev((stderr, "inflate:     fixed codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = LEN_;             /* decode codes */
        if (flush === Z_TREES) {
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break inf_leave;
        }
        break;
      case 2:                             /* dynamic block */
        //Tracev((stderr, "inflate:     dynamic codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = TABLE;
        break;
      case 3:
        strm.msg = 'invalid block type';
        state.mode = BAD;
      }
      //--- DROPBITS(2) ---//
      hold >>>= 2;
      bits -= 2;
      //---//
      break;
    case STORED:
      //--- BYTEBITS() ---// /* go to byte boundary */
      hold >>>= bits & 7;
      bits -= bits & 7;
      //---//
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
        strm.msg = 'invalid stored block lengths';
        state.mode = BAD;
        break;
      }
      state.length = hold & 0xffff;
      //Tracev((stderr, "inflate:       stored length %u\n",
      //        state.length));
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = COPY_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case COPY_:
      state.mode = COPY;
      /* falls through */
    case COPY:
      copy = state.length;
      if (copy) {
        if (copy > have) { copy = have; }
        if (copy > left) { copy = left; }
        if (copy === 0) { break inf_leave; }
        //--- zmemcpy(put, next, copy); ---
        utils.arraySet(output, input, next, copy, put);
        //---//
        have -= copy;
        next += copy;
        left -= copy;
        put += copy;
        state.length -= copy;
        break;
      }
      //Tracev((stderr, "inflate:       stored end\n"));
      state.mode = TYPE;
      break;
    case TABLE:
      //=== NEEDBITS(14); */
      while (bits < 14) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
//#ifndef PKZIP_BUG_WORKAROUND
      if (state.nlen > 286 || state.ndist > 30) {
        strm.msg = 'too many length or distance symbols';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracev((stderr, "inflate:       table sizes ok\n"));
      state.have = 0;
      state.mode = LENLENS;
      /* falls through */
    case LENLENS:
      while (state.have < state.ncode) {
        //=== NEEDBITS(3);
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
        //--- DROPBITS(3) ---//
        hold >>>= 3;
        bits -= 3;
        //---//
      }
      while (state.have < 19) {
        state.lens[order[state.have++]] = 0;
      }
      // We have separate tables & no pointers. 2 commented lines below not needed.
      //state.next = state.codes;
      //state.lencode = state.next;
      // Switch to use dynamic table
      state.lencode = state.lendyn;
      state.lenbits = 7;

      opts = { bits: state.lenbits };
      ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
      state.lenbits = opts.bits;

      if (ret) {
        strm.msg = 'invalid code lengths set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, "inflate:       code lengths ok\n"));
      state.have = 0;
      state.mode = CODELENS;
      /* falls through */
    case CODELENS:
      while (state.have < state.nlen + state.ndist) {
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_val < 16) {
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.lens[state.have++] = here_val;
        }
        else {
          if (here_val === 16) {
            //=== NEEDBITS(here.bits + 2);
            n = here_bits + 2;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            if (state.have === 0) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            len = state.lens[state.have - 1];
            copy = 3 + (hold & 0x03);//BITS(2);
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            //---//
          }
          else if (here_val === 17) {
            //=== NEEDBITS(here.bits + 3);
            n = here_bits + 3;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 3 + (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          else {
            //=== NEEDBITS(here.bits + 7);
            n = here_bits + 7;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 11 + (hold & 0x7f);//BITS(7);
            //--- DROPBITS(7) ---//
            hold >>>= 7;
            bits -= 7;
            //---//
          }
          if (state.have + copy > state.nlen + state.ndist) {
            strm.msg = 'invalid bit length repeat';
            state.mode = BAD;
            break;
          }
          while (copy--) {
            state.lens[state.have++] = len;
          }
        }
      }

      /* handle error breaks in while */
      if (state.mode === BAD) { break; }

      /* check for end-of-block code (better have one) */
      if (state.lens[256] === 0) {
        strm.msg = 'invalid code -- missing end-of-block';
        state.mode = BAD;
        break;
      }

      /* build code tables -- note: do not change the lenbits or distbits
         values here (9 and 6) without reading the comments in inftrees.h
         concerning the ENOUGH constants, which depend on those values */
      state.lenbits = 9;

      opts = { bits: state.lenbits };
      ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.lenbits = opts.bits;
      // state.lencode = state.next;

      if (ret) {
        strm.msg = 'invalid literal/lengths set';
        state.mode = BAD;
        break;
      }

      state.distbits = 6;
      //state.distcode.copy(state.codes);
      // Switch to use dynamic table
      state.distcode = state.distdyn;
      opts = { bits: state.distbits };
      ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.distbits = opts.bits;
      // state.distcode = state.next;

      if (ret) {
        strm.msg = 'invalid distances set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, 'inflate:       codes ok\n'));
      state.mode = LEN_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case LEN_:
      state.mode = LEN;
      /* falls through */
    case LEN:
      if (have >= 6 && left >= 258) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        inflate_fast(strm, _out);
        //--- LOAD() ---
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        //---

        if (state.mode === TYPE) {
          state.back = -1;
        }
        break;
      }
      state.back = 0;
      for (;;) {
        here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if (here_bits <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if (here_op && (here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.lencode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      state.length = here_val;
      if (here_op === 0) {
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        state.mode = LIT;
        break;
      }
      if (here_op & 32) {
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.back = -1;
        state.mode = TYPE;
        break;
      }
      if (here_op & 64) {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break;
      }
      state.extra = here_op & 15;
      state.mode = LENEXT;
      /* falls through */
    case LENEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
      //Tracevv((stderr, "inflate:         length %u\n", state.length));
      state.was = state.length;
      state.mode = DIST;
      /* falls through */
    case DIST:
      for (;;) {
        here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if ((here_bits) <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if ((here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.distcode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      if (here_op & 64) {
        strm.msg = 'invalid distance code';
        state.mode = BAD;
        break;
      }
      state.offset = here_val;
      state.extra = (here_op) & 15;
      state.mode = DISTEXT;
      /* falls through */
    case DISTEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
//#ifdef INFLATE_STRICT
      if (state.offset > state.dmax) {
        strm.msg = 'invalid distance too far back';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
      state.mode = MATCH;
      /* falls through */
    case MATCH:
      if (left === 0) { break inf_leave; }
      copy = _out - left;
      if (state.offset > copy) {         /* copy from window */
        copy = state.offset - copy;
        if (copy > state.whave) {
          if (state.sane) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
        }
        if (copy > state.wnext) {
          copy -= state.wnext;
          from = state.wsize - copy;
        }
        else {
          from = state.wnext - copy;
        }
        if (copy > state.length) { copy = state.length; }
        from_source = state.window;
      }
      else {                              /* copy from output */
        from_source = output;
        from = put - state.offset;
        copy = state.length;
      }
      if (copy > left) { copy = left; }
      left -= copy;
      state.length -= copy;
      do {
        output[put++] = from_source[from++];
      } while (--copy);
      if (state.length === 0) { state.mode = LEN; }
      break;
    case LIT:
      if (left === 0) { break inf_leave; }
      output[put++] = state.length;
      left--;
      state.mode = LEN;
      break;
    case CHECK:
      if (state.wrap) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          // Use '|' insdead of '+' to make sure that result is signed
          hold |= input[next++] << bits;
          bits += 8;
        }
        //===//
        _out -= left;
        strm.total_out += _out;
        state.total += _out;
        if (_out) {
          strm.adler = state.check =
              /*UPDATE(state.check, put - _out, _out);*/
              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

        }
        _out = left;
        // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
        if ((state.flags ? hold : zswap32(hold)) !== state.check) {
          strm.msg = 'incorrect data check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   check matches trailer\n"));
      }
      state.mode = LENGTH;
      /* falls through */
    case LENGTH:
      if (state.wrap && state.flags) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.total & 0xffffffff)) {
          strm.msg = 'incorrect length check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   length matches trailer\n"));
      }
      state.mode = DONE;
      /* falls through */
    case DONE:
      ret = Z_STREAM_END;
      break inf_leave;
    case BAD:
      ret = Z_DATA_ERROR;
      break inf_leave;
    case MEM:
      return Z_MEM_ERROR;
    case SYNC:
      /* falls through */
    default:
      return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

},{"../utils/common":23,"./adler32":24,"./crc32":26,"./inffast":28,"./inftrees":30}],30:[function(require,module,exports){
'use strict';


var utils = require('../utils/common');

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  var i = 0;
  /* process all codes and make table entries */
  for (;;) {
    i++;
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};

},{"../utils/common":23}],31:[function(require,module,exports){
'use strict';

module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

},{}],32:[function(require,module,exports){
'use strict';


var utils = require('../utils/common');

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;

},{"../utils/common":23}],33:[function(require,module,exports){
'use strict';


function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;

},{}],34:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":35}],35:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout.call(null, cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout.call(null, timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout.call(null, drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],36:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],38:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],39:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":37,"./encode":38}],40:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":42,"./_stream_writable":44,"core-util-is":16,"inherits":20,"process-nextick-args":34}],41:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":43,"core-util-is":16,"inherits":20}],42:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

var hasPrependListener = typeof EE.prototype.prependListener === 'function';

function prependListener(emitter, event, fn) {
  if (hasPrependListener) return emitter.prependListener(event, fn);

  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS. This is here
  // only because this code needs to continue to work with older versions
  // of Node.js that do not include the prependListener() method. The goal
  // is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

var Duplex;
function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

var Duplex;
function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended) return 0;

  if (state.objectMode) return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length) return state.buffer[0].length;else return state.length;
  }

  if (n <= 0) return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else {
      return state.length;
    }
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading) n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended) state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0) endReadable(this);

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var _i = 0; _i < len; _i++) {
      dests[_i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1) return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && !this._readableState.endEmitted) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) return null;

  if (length === 0) ret = null;else if (objectMode) ret = list.shift();else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode) ret = list.join('');else if (list.length === 1) ret = list[0];else ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode) ret = '';else ret = bufferShim.allocUnsafe(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var _buf = list[0];
        var cpy = Math.min(n - c, _buf.length);

        if (stringMode) ret += _buf.slice(0, cpy);else _buf.copy(ret, c, 0, cpy);

        if (cpy < _buf.length) list[0] = _buf.slice(cpy);else list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":40,"_process":35,"buffer":14,"buffer-shims":13,"core-util-is":16,"events":17,"inherits":20,"isarray":22,"process-nextick-args":34,"string_decoder/":51,"util":9}],43:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er) {
      done(stream, er);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('Not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er) {
  if (er) return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":40,"core-util-is":16,"inherits":20}],44:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

var Duplex;
function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

var Duplex;
function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":40,"_process":35,"buffer":14,"buffer-shims":13,"core-util-is":16,"events":17,"inherits":20,"process-nextick-args":34,"util-deprecate":55}],45:[function(require,module,exports){
(function (process){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":40,"./lib/_stream_passthrough.js":41,"./lib/_stream_readable.js":42,"./lib/_stream_transform.js":43,"./lib/_stream_writable.js":44,"_process":35}],46:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":43}],47:[function(require,module,exports){
(function (global){
var ClientRequest = require('./lib/request')
var extend = require('xtend')
var statusCodes = require('builtin-status-codes')
var url = require('url')

var http = exports

http.request = function (opts, cb) {
	if (typeof opts === 'string')
		opts = url.parse(opts)
	else
		opts = extend(opts)

	// Normally, the page is loaded from http or https, so not specifying a protocol
	// will result in a (valid) protocol-relative url. However, this won't work if
	// the protocol is something else, like 'file:'
	var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : ''

	var protocol = opts.protocol || defaultProtocol
	var host = opts.hostname || opts.host
	var port = opts.port
	var path = opts.path || '/'

	// Necessary for IPv6 addresses
	if (host && host.indexOf(':') !== -1)
		host = '[' + host + ']'

	// This may be a relative url. The browser should always be able to interpret it correctly.
	opts.url = (host ? (protocol + '//' + host) : '') + (port ? ':' + port : '') + path
	opts.method = (opts.method || 'GET').toUpperCase()
	opts.headers = opts.headers || {}

	// Also valid opts.auth, opts.mode

	var req = new ClientRequest(opts)
	if (cb)
		req.on('response', cb)
	return req
}

http.get = function get (opts, cb) {
	var req = http.request(opts, cb)
	req.end()
	return req
}

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.STATUS_CODES = statusCodes

http.METHODS = [
	'CHECKOUT',
	'CONNECT',
	'COPY',
	'DELETE',
	'GET',
	'HEAD',
	'LOCK',
	'M-SEARCH',
	'MERGE',
	'MKACTIVITY',
	'MKCOL',
	'MOVE',
	'NOTIFY',
	'OPTIONS',
	'PATCH',
	'POST',
	'PROPFIND',
	'PROPPATCH',
	'PURGE',
	'PUT',
	'REPORT',
	'SEARCH',
	'SUBSCRIBE',
	'TRACE',
	'UNLOCK',
	'UNSUBSCRIBE'
]
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/request":49,"builtin-status-codes":15,"url":53,"xtend":58}],48:[function(require,module,exports){
(function (global){
exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.blobConstructor = false
try {
	new Blob([new ArrayBuffer(1)])
	exports.blobConstructor = true
} catch (e) {}

var xhr = new global.XMLHttpRequest()
// If location.host is empty, e.g. if this page/worker was loaded
// from a Blob, then use example.com to avoid an error
xhr.open('GET', global.location.host ? '/' : 'https://example.com')

function checkTypeSupport (type) {
	try {
		xhr.responseType = type
		return xhr.responseType === type
	} catch (e) {}
	return false
}

// For some strange reason, Safari 7.0 reports typeof global.ArrayBuffer === 'object'.
// Safari 7.1 appears to have fixed this bug.
var haveArrayBuffer = typeof global.ArrayBuffer !== 'undefined'
var haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

exports.arraybuffer = haveArrayBuffer && checkTypeSupport('arraybuffer')
// These next two tests unavoidably show warnings in Chrome. Since fetch will always
// be used if it's available, just return false for these to avoid the warnings.
exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer &&
	checkTypeSupport('moz-chunked-arraybuffer')
exports.overrideMimeType = isFunction(xhr.overrideMimeType)
exports.vbArray = isFunction(global.VBArray)

function isFunction (value) {
  return typeof value === 'function'
}

xhr = null // Help gc

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var response = require('./response')
var stream = require('readable-stream')
var toArrayBuffer = require('to-arraybuffer')

var IncomingMessage = response.IncomingMessage
var rStates = response.readyStates

function decideMode (preferBinary) {
	if (capability.fetch) {
		return 'fetch'
	} else if (capability.mozchunkedarraybuffer) {
		return 'moz-chunked-arraybuffer'
	} else if (capability.msstream) {
		return 'ms-stream'
	} else if (capability.arraybuffer && preferBinary) {
		return 'arraybuffer'
	} else if (capability.vbArray && preferBinary) {
		return 'text:vbarray'
	} else {
		return 'text'
	}
}

var ClientRequest = module.exports = function (opts) {
	var self = this
	stream.Writable.call(self)

	self._opts = opts
	self._body = []
	self._headers = {}
	if (opts.auth)
		self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
	Object.keys(opts.headers).forEach(function (name) {
		self.setHeader(name, opts.headers[name])
	})

	var preferBinary
	if (opts.mode === 'prefer-streaming') {
		// If streaming is a high priority but binary compatibility and
		// the accuracy of the 'content-type' header aren't
		preferBinary = false
	} else if (opts.mode === 'allow-wrong-content-type') {
		// If streaming is more important than preserving the 'content-type' header
		preferBinary = !capability.overrideMimeType
	} else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast') {
		// Use binary if text streaming may corrupt data or the content-type header, or for speed
		preferBinary = true
	} else {
		throw new Error('Invalid value for opts.mode')
	}
	self._mode = decideMode(preferBinary)

	self.on('finish', function () {
		self._onFinish()
	})
}

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
	var self = this
	var lowerName = name.toLowerCase()
	// This check is not necessary, but it prevents warnings from browsers about setting unsafe
	// headers. To be honest I'm not entirely sure hiding these warnings is a good thing, but
	// http-browserify did it, so I will too.
	if (unsafeHeaders.indexOf(lowerName) !== -1)
		return

	self._headers[lowerName] = {
		name: name,
		value: value
	}
}

ClientRequest.prototype.getHeader = function (name) {
	var self = this
	return self._headers[name.toLowerCase()].value
}

ClientRequest.prototype.removeHeader = function (name) {
	var self = this
	delete self._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
	var self = this

	if (self._destroyed)
		return
	var opts = self._opts

	var headersObj = self._headers
	var body
	if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
		if (capability.blobConstructor) {
			body = new global.Blob(self._body.map(function (buffer) {
				return toArrayBuffer(buffer)
			}), {
				type: (headersObj['content-type'] || {}).value || ''
			})
		} else {
			// get utf8 string
			body = Buffer.concat(self._body).toString()
		}
	}

	if (self._mode === 'fetch') {
		var headers = Object.keys(headersObj).map(function (name) {
			return [headersObj[name].name, headersObj[name].value]
		})

		global.fetch(self._opts.url, {
			method: self._opts.method,
			headers: headers,
			body: body,
			mode: 'cors',
			credentials: opts.withCredentials ? 'include' : 'same-origin'
		}).then(function (response) {
			self._fetchResponse = response
			self._connect()
		}, function (reason) {
			self.emit('error', reason)
		})
	} else {
		var xhr = self._xhr = new global.XMLHttpRequest()
		try {
			xhr.open(self._opts.method, self._opts.url, true)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}

		// Can't set responseType on really old browsers
		if ('responseType' in xhr)
			xhr.responseType = self._mode.split(':')[0]

		if ('withCredentials' in xhr)
			xhr.withCredentials = !!opts.withCredentials

		if (self._mode === 'text' && 'overrideMimeType' in xhr)
			xhr.overrideMimeType('text/plain; charset=x-user-defined')

		Object.keys(headersObj).forEach(function (name) {
			xhr.setRequestHeader(headersObj[name].name, headersObj[name].value)
		})

		self._response = null
		xhr.onreadystatechange = function () {
			switch (xhr.readyState) {
				case rStates.LOADING:
				case rStates.DONE:
					self._onXHRProgress()
					break
			}
		}
		// Necessary for streaming in Firefox, since xhr.response is ONLY defined
		// in onprogress, not in onreadystatechange with xhr.readyState = 3
		if (self._mode === 'moz-chunked-arraybuffer') {
			xhr.onprogress = function () {
				self._onXHRProgress()
			}
		}

		xhr.onerror = function () {
			if (self._destroyed)
				return
			self.emit('error', new Error('XHR error'))
		}

		try {
			xhr.send(body)
		} catch (err) {
			process.nextTick(function () {
				self.emit('error', err)
			})
			return
		}
	}
}

/**
 * Checks if xhr.status is readable and non-zero, indicating no error.
 * Even though the spec says it should be available in readyState 3,
 * accessing it throws an exception in IE8
 */
function statusValid (xhr) {
	try {
		var status = xhr.status
		return (status !== null && status !== 0)
	} catch (e) {
		return false
	}
}

ClientRequest.prototype._onXHRProgress = function () {
	var self = this

	if (!statusValid(self._xhr) || self._destroyed)
		return

	if (!self._response)
		self._connect()

	self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
	var self = this

	if (self._destroyed)
		return

	self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode)
	self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
	var self = this

	self._body.push(chunk)
	cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
	var self = this
	self._destroyed = true
	if (self._response)
		self._response._destroyed = true
	if (self._xhr)
		self._xhr.abort()
	// Currently, there isn't a way to truly abort a fetch.
	// If you like bikeshedding, see https://github.com/whatwg/fetch/issues/27
}

ClientRequest.prototype.end = function (data, encoding, cb) {
	var self = this
	if (typeof data === 'function') {
		cb = data
		data = undefined
	}

	stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

// Taken from http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader%28%29-method
var unsafeHeaders = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'user-agent',
	'via'
]

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":48,"./response":50,"_process":35,"buffer":14,"inherits":20,"readable-stream":45,"to-arraybuffer":52}],50:[function(require,module,exports){
(function (process,global,Buffer){
var capability = require('./capability')
var inherits = require('inherits')
var stream = require('readable-stream')

var rStates = exports.readyStates = {
	UNSENT: 0,
	OPENED: 1,
	HEADERS_RECEIVED: 2,
	LOADING: 3,
	DONE: 4
}

var IncomingMessage = exports.IncomingMessage = function (xhr, response, mode) {
	var self = this
	stream.Readable.call(self)

	self._mode = mode
	self.headers = {}
	self.rawHeaders = []
	self.trailers = {}
	self.rawTrailers = []

	// Fake the 'close' event, but only once 'end' fires
	self.on('end', function () {
		// The nextTick is necessary to prevent the 'request' module from causing an infinite loop
		process.nextTick(function () {
			self.emit('close')
		})
	})

	if (mode === 'fetch') {
		self._fetchResponse = response

		self.url = response.url
		self.statusCode = response.status
		self.statusMessage = response.statusText
		// backwards compatible version of for (<item> of <iterable>):
		// for (var <item>,_i,_it = <iterable>[Symbol.iterator](); <item> = (_i = _it.next()).value,!_i.done;)
		for (var header, _i, _it = response.headers[Symbol.iterator](); header = (_i = _it.next()).value, !_i.done;) {
			self.headers[header[0].toLowerCase()] = header[1]
			self.rawHeaders.push(header[0], header[1])
		}

		// TODO: this doesn't respect backpressure. Once WritableStream is available, this can be fixed
		var reader = response.body.getReader()
		function read () {
			reader.read().then(function (result) {
				if (self._destroyed)
					return
				if (result.done) {
					self.push(null)
					return
				}
				self.push(new Buffer(result.value))
				read()
			})
		}
		read()

	} else {
		self._xhr = xhr
		self._pos = 0

		self.url = xhr.responseURL
		self.statusCode = xhr.status
		self.statusMessage = xhr.statusText
		var headers = xhr.getAllResponseHeaders().split(/\r?\n/)
		headers.forEach(function (header) {
			var matches = header.match(/^([^:]+):\s*(.*)/)
			if (matches) {
				var key = matches[1].toLowerCase()
				if (key === 'set-cookie') {
					if (self.headers[key] === undefined) {
						self.headers[key] = []
					}
					self.headers[key].push(matches[2])
				} else if (self.headers[key] !== undefined) {
					self.headers[key] += ', ' + matches[2]
				} else {
					self.headers[key] = matches[2]
				}
				self.rawHeaders.push(matches[1], matches[2])
			}
		})

		self._charset = 'x-user-defined'
		if (!capability.overrideMimeType) {
			var mimeType = self.rawHeaders['mime-type']
			if (mimeType) {
				var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
				if (charsetMatch) {
					self._charset = charsetMatch[1].toLowerCase()
				}
			}
			if (!self._charset)
				self._charset = 'utf-8' // best guess
		}
	}
}

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {}

IncomingMessage.prototype._onXHRProgress = function () {
	var self = this

	var xhr = self._xhr

	var response = null
	switch (self._mode) {
		case 'text:vbarray': // For IE9
			if (xhr.readyState !== rStates.DONE)
				break
			try {
				// This fails in IE8
				response = new global.VBArray(xhr.responseBody).toArray()
			} catch (e) {}
			if (response !== null) {
				self.push(new Buffer(response))
				break
			}
			// Falls through in IE8	
		case 'text':
			try { // This will fail when readyState = 3 in IE9. Switch mode and wait for readyState = 4
				response = xhr.responseText
			} catch (e) {
				self._mode = 'text:vbarray'
				break
			}
			if (response.length > self._pos) {
				var newData = response.substr(self._pos)
				if (self._charset === 'x-user-defined') {
					var buffer = new Buffer(newData.length)
					for (var i = 0; i < newData.length; i++)
						buffer[i] = newData.charCodeAt(i) & 0xff

					self.push(buffer)
				} else {
					self.push(newData, self._charset)
				}
				self._pos = response.length
			}
			break
		case 'arraybuffer':
			if (xhr.readyState !== rStates.DONE)
				break
			response = xhr.response
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'moz-chunked-arraybuffer': // take whole
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING || !response)
				break
			self.push(new Buffer(new Uint8Array(response)))
			break
		case 'ms-stream':
			response = xhr.response
			if (xhr.readyState !== rStates.LOADING)
				break
			var reader = new global.MSStreamReader()
			reader.onprogress = function () {
				if (reader.result.byteLength > self._pos) {
					self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
					self._pos = reader.result.byteLength
				}
			}
			reader.onload = function () {
				self.push(null)
			}
			// reader.onerror = ??? // TODO: this
			reader.readAsArrayBuffer(response)
			break
	}

	// The ms-stream case handles end separately in reader.onload()
	if (self._xhr.readyState === rStates.DONE && self._mode !== 'ms-stream') {
		self.push(null)
	}
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./capability":48,"_process":35,"buffer":14,"inherits":20,"readable-stream":45}],51:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":14}],52:[function(require,module,exports){
var Buffer = require('buffer').Buffer

module.exports = function (buf) {
	// If the buffer is backed by a Uint8Array, a faster version will work
	if (buf instanceof Uint8Array) {
		// If the buffer isn't a subarray, return the underlying ArrayBuffer
		if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
			return buf.buffer
		} else if (typeof buf.buffer.slice === 'function') {
			// Otherwise we need to get a proper copy
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
		}
	}

	if (Buffer.isBuffer(buf)) {
		// This is the slow version that will work with any Buffer
		// implementation (even in old browsers)
		var arrayCopy = new Uint8Array(buf.length)
		var len = buf.length
		for (var i = 0; i < len; i++) {
			arrayCopy[i] = buf[i]
		}
		return arrayCopy.buffer
	} else {
		throw new Error('Argument must be a Buffer')
	}
}

},{"buffer":14}],53:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":54,"punycode":36,"querystring":39}],54:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],55:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],56:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],57:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":56,"_process":35,"inherits":20}],58:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],59:[function(require,module,exports){
var css = 0
var minidocs = require('./app')

module.exports = function (opts) {
  var app = minidocs(opts)

  ;((require('insert-css')("body {\n  font-family: 'clear_sans_thinregular';\n  color: rgb(80,80,80);\n  margin: 0px;\n  padding: 0px;\n  overflow-y: scroll;\n}\n\n.contents-link {\n  padding-left: 2%;\n  cursor: pointer;\n  padding-bottom: 2px;\n  padding-right: 10px;\n}\n\n.contents-link:hover {\n  background: rgb(255,255,255);\n}\n\n.contents-link-selected {\n  background: rgb(255,255,255);\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n}\n\n::-webkit-scrollbar-track {\n  background-color: white;\n} \n\n::-webkit-scrollbar-thumb {\n  background-color: rgba(0, 0, 0, 0.125); \n  height: 20px;\n} \n\n::-webkit-scrollbar-thumb:hover {\n  background-color: rgba(0, 0, 0, 0.25); \n} \n\n::-webkit-scrollbar-button {\n  background-color: rgb(200,200,200);\n} \n\n::-webkit-scrollbar-corner {\n  background-color: black;\n}") || true) && "_08b1ba12")
  ;((require('insert-css')("@font-face {\n    font-family: 'clear_sans_thinregular';\n    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),\n         url(data:application/font-woff;charset=utf-8;base64,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) format('woff'),\n         url('clearsans-thin-webfont.ttf') format('truetype');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'clear_sans_lightregular';\n    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),\n         url(data:application/font-woff;charset=utf-8;base64,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) format('woff'),\n         url('clearsans-light-webfont.ttf') format('truetype');\n    font-weight: normal;\n    font-style: normal;\n}\n\n@font-face {\n    font-family: 'clear_sans_mediumregular';\n    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),\n         url(data:application/font-woff;charset=utf-8;base64,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) format('woff'),\n         url('clearsans-medium-webfont.ttf') format('truetype');\n    font-weight: normal;\n    font-style: normal;\n\n}\n\n@font-face {\n    font-family: 'clear_sansregular';\n    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),\n         url(data:application/font-woff;charset=utf-8;base64,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) format('woff'),\n         url('clearsans-regular-webfont.ttf') format('truetype');\n    font-weight: normal;\n    font-style: normal;\n\n}\n\n\n@font-face {\n    font-family: 'clear_sans_thinregular';\n    src: url(data:application/font-woff2;charset=utf-8;base64,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) format('woff2'),\n         url(data:application/font-woff;charset=utf-8;base64,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) format('woff'),\n         url('clearsans-thin-webfont.ttf') format('truetype');\n    font-weight: normal;\n    font-style: normal;\n\n}") || true) && "_b8e1f1b6")
  ;((require('insert-css')("@font-face {\n  font-family: octicons-link;\n  src: url(data:font/woff;charset=utf-8;base64,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) format('woff');\n}\n\n.markdown-body {\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  color: rgb(80,80,80);\n  font-size: 16px;\n  line-height: 1.6;\n  word-wrap: break-word;\n}\n\n.markdown-body a {\n  background-color: transparent;\n}\n\n.markdown-body a:active,\n.markdown-body a:hover {\n  outline: 0;\n}\n\n.markdown-body strong {\n  font-weight: bold;\n}\n\n.markdown-body h1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n.markdown-body img {\n  border: 0;\n}\n\n.markdown-body hr {\n  box-sizing: content-box;\n  height: 0;\n}\n\n.markdown-body pre {\n  overflow: auto;\n}\n\n.markdown-body code,\n.markdown-body kbd,\n.markdown-body pre {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n.markdown-body input {\n  color: inherit;\n  font: inherit;\n  margin: 0;\n}\n\n.markdown-body html input[disabled] {\n  cursor: default;\n}\n\n.markdown-body input {\n  line-height: normal;\n}\n\n.markdown-body input[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\n\n.markdown-body table {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n.markdown-body td,\n.markdown-body th {\n  padding: 0;\n}\n\n.markdown-body * {\n  box-sizing: border-box;\n}\n\n.markdown-body input {\n  font: 13px / 1.4 Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n}\n\n.markdown-body a {\n  color: #4078c0;\n  text-decoration: none;\n}\n\n.markdown-body a:hover,\n.markdown-body a:active {\n  text-decoration: underline;\n}\n\n.markdown-body hr {\n  height: 0;\n  margin: 15px 0;\n  overflow: hidden;\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #ddd;\n}\n\n.markdown-body hr:before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body hr:after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 15px;\n  line-height: 1.1;\n}\n\n.markdown-body h1 {\n  font-size: 30px;\n}\n\n.markdown-body h2 {\n  font-size: 21px;\n}\n\n.markdown-body h3 {\n  font-size: 16px;\n}\n\n.markdown-body h4 {\n  font-size: 14px;\n}\n\n.markdown-body h5 {\n  font-size: 12px;\n}\n\n.markdown-body h6 {\n  font-size: 11px;\n}\n\n.markdown-body blockquote {\n  margin: 0;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body ol ol,\n.markdown-body ul ol {\n  list-style-type: lower-roman;\n}\n\n.markdown-body ul ul ol,\n.markdown-body ul ol ol,\n.markdown-body ol ul ol,\n.markdown-body ol ol ol {\n  list-style-type: lower-alpha;\n}\n\n.markdown-body dd {\n  margin-left: 0;\n}\n\n.markdown-body code {\n  font-family: Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  font-size: 12px;\n}\n\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 0;\n  font: 12px Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n}\n\n.markdown-body .select::-ms-expand {\n  opacity: 0;\n}\n\n.markdown-body .octicon {\n  font: normal normal normal 16px/1 octicons-link;\n  display: inline-block;\n  text-decoration: none;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.markdown-body .octicon-link:before {\n  content: '\\f05c';\n}\n\n.markdown-body:before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body:after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body>*:first-child {\n  margin-top: 0 !important;\n}\n\n.markdown-body>*:last-child {\n  margin-bottom: 0 !important;\n}\n\n.markdown-body a:not([href]) {\n  color: inherit;\n  text-decoration: none;\n}\n\n.markdown-body .anchor {\n  display: inline-block;\n  padding-right: 2px;\n  margin-left: -18px;\n}\n\n.markdown-body .anchor:focus {\n  outline: none;\n}\n\n.markdown-body h1,\n.markdown-body h2,\n.markdown-body h3,\n.markdown-body h4,\n.markdown-body h5,\n.markdown-body h6 {\n  margin-top: 1em;\n  margin-bottom: 16px;\n  font-weight: bold;\n  line-height: 1.4;\n}\n\n.markdown-body h1 .octicon-link,\n.markdown-body h2 .octicon-link,\n.markdown-body h3 .octicon-link,\n.markdown-body h4 .octicon-link,\n.markdown-body h5 .octicon-link,\n.markdown-body h6 .octicon-link {\n  color: #000;\n  vertical-align: middle;\n  visibility: hidden;\n}\n\n.markdown-body h1:hover .anchor,\n.markdown-body h2:hover .anchor,\n.markdown-body h3:hover .anchor,\n.markdown-body h4:hover .anchor,\n.markdown-body h5:hover .anchor,\n.markdown-body h6:hover .anchor {\n  text-decoration: none;\n}\n\n.markdown-body h1:hover .anchor .octicon-link,\n.markdown-body h2:hover .anchor .octicon-link,\n.markdown-body h3:hover .anchor .octicon-link,\n.markdown-body h4:hover .anchor .octicon-link,\n.markdown-body h5:hover .anchor .octicon-link,\n.markdown-body h6:hover .anchor .octicon-link {\n  visibility: visible;\n}\n\n.markdown-body h1 {\n  padding-bottom: 0.3em;\n  font-size: 2.25em;\n  line-height: 1.2;\n  margin-top: 15px;\n}\n\n.markdown-body h1 .anchor {\n  line-height: 1;\n}\n\n.markdown-body h2 {\n  padding-bottom: 0.3em;\n  font-size: 1.75em;\n  line-height: 1.225;\n}\n\n.markdown-body h2 .anchor {\n  line-height: 1;\n}\n\n.markdown-body h3 {\n  font-size: 1.5em;\n  line-height: 1.43;\n}\n\n.markdown-body h3 .anchor {\n  line-height: 1.2;\n}\n\n.markdown-body h4 {\n  font-size: 1.25em;\n}\n\n.markdown-body h4 .anchor {\n  line-height: 1.2;\n}\n\n.markdown-body h5 {\n  font-size: 1em;\n}\n\n.markdown-body h5 .anchor {\n  line-height: 1.1;\n}\n\n.markdown-body h6 {\n  font-size: 1em;\n  color: #777;\n}\n\n.markdown-body h6 .anchor {\n  line-height: 1.1;\n}\n\n.markdown-body p,\n.markdown-body blockquote,\n.markdown-body ul,\n.markdown-body ol,\n.markdown-body dl,\n.markdown-body table,\n.markdown-body pre {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n\n.markdown-body hr {\n  height: 4px;\n  padding: 0;\n  margin: 16px 0;\n  background-color: #e7e7e7;\n  border: 0 none;\n}\n\n.markdown-body ul,\n.markdown-body ol {\n  padding-left: 2em;\n}\n\n.markdown-body ul ul,\n.markdown-body ul ol,\n.markdown-body ol ol,\n.markdown-body ol ul {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body li>p {\n  margin-top: 16px;\n}\n\n.markdown-body dl {\n  padding: 0;\n}\n\n.markdown-body dl dt {\n  padding: 0;\n  margin-top: 16px;\n  font-size: 1em;\n  font-style: italic;\n  font-weight: bold;\n}\n\n.markdown-body dl dd {\n  padding: 0 16px;\n  margin-bottom: 16px;\n}\n\n.markdown-body blockquote {\n  padding: 0 15px;\n  color: #777;\n  border-left: 4px solid #ddd;\n}\n\n.markdown-body blockquote>:first-child {\n  margin-top: 0;\n}\n\n.markdown-body blockquote>:last-child {\n  margin-bottom: 0;\n}\n\n.markdown-body table {\n  display: block;\n  width: 100%;\n  overflow: auto;\n  word-break: normal;\n  word-break: keep-all;\n}\n\n.markdown-body table th {\n  font-weight: bold;\n}\n\n.markdown-body table th,\n.markdown-body table td {\n  padding: 6px 13px;\n  border: 1px solid #ddd;\n}\n\n.markdown-body table tr {\n  background-color: #fff;\n  border-top: 1px solid #ccc;\n}\n\n.markdown-body table tr:nth-child(2n) {\n  background-color: #f8f8f8;\n}\n\n.markdown-body img {\n  max-width: 100%;\n  box-sizing: content-box;\n  background-color: #fff;\n}\n\n.markdown-body code {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 85%;\n  background-color: rgba(0,0,0,0.04);\n  border-radius: 3px;\n}\n\n.markdown-body code:before,\n.markdown-body code:after {\n  letter-spacing: -0.2em;\n  content: \"\\00a0\";\n}\n\n.markdown-body pre>code {\n  padding: 0;\n  margin: 0;\n  font-size: 100%;\n  word-break: normal;\n  white-space: pre;\n  background: transparent;\n  border: 0;\n}\n\n.markdown-body .highlight {\n  margin-bottom: 16px;\n}\n\n.markdown-body .highlight pre,\n.markdown-body pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 85%;\n  line-height: 1.45;\n  background-color: #f7f7f7;\n  border-radius: 3px;\n}\n\n.markdown-body .highlight pre {\n  margin-bottom: 0;\n  word-break: normal;\n}\n\n.markdown-body pre {\n  word-wrap: normal;\n}\n\n.markdown-body pre code {\n  display: inline;\n  max-width: initial;\n  padding: 0;\n  margin: 0;\n  overflow: initial;\n  line-height: inherit;\n  word-wrap: normal;\n  background-color: transparent;\n  border: 0;\n}\n\n.markdown-body pre code:before,\n.markdown-body pre code:after {\n  content: normal;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font-size: 11px;\n  line-height: 10px;\n  color: #555;\n  vertical-align: middle;\n  background-color: #fcfcfc;\n  border: solid 1px #ccc;\n  border-bottom-color: #bbb;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #bbb;\n}\n\n.markdown-body .pl-c {\n  color: #969896;\n}\n\n.markdown-body .pl-c1,\n.markdown-body .pl-s .pl-v {\n  color: #0086b3;\n}\n\n.markdown-body .pl-e,\n.markdown-body .pl-en {\n  color: #795da3;\n}\n\n.markdown-body .pl-s .pl-s1,\n.markdown-body .pl-smi {\n  color: #333;\n}\n\n.markdown-body .pl-ent {\n  color: #63a35c;\n}\n\n.markdown-body .pl-k {\n  color: #a71d5d;\n}\n\n.markdown-body .pl-pds,\n.markdown-body .pl-s,\n.markdown-body .pl-s .pl-pse .pl-s1,\n.markdown-body .pl-sr,\n.markdown-body .pl-sr .pl-cce,\n.markdown-body .pl-sr .pl-sra,\n.markdown-body .pl-sr .pl-sre {\n  color: #183691;\n}\n\n.markdown-body .pl-v {\n  color: #ed6a43;\n}\n\n.markdown-body .pl-id {\n  color: #b52a1d;\n}\n\n.markdown-body .pl-ii {\n  background-color: #b52a1d;\n  color: #f8f8f8;\n}\n\n.markdown-body .pl-sr .pl-cce {\n  color: #63a35c;\n  font-weight: bold;\n}\n\n.markdown-body .pl-ml {\n  color: #693a17;\n}\n\n.markdown-body .pl-mh,\n.markdown-body .pl-mh .pl-en,\n.markdown-body .pl-ms {\n  color: #1d3e81;\n  font-weight: bold;\n}\n\n.markdown-body .pl-mq {\n  color: #008080;\n}\n\n.markdown-body .pl-mi {\n  color: #333;\n  font-style: italic;\n}\n\n.markdown-body .pl-mb {\n  color: #333;\n  font-weight: bold;\n}\n\n.markdown-body .pl-md {\n  background-color: #ffecec;\n  color: #bd2c00;\n}\n\n.markdown-body .pl-mi1 {\n  background-color: #eaffea;\n  color: #55a532;\n}\n\n.markdown-body .pl-mdr {\n  color: #795da3;\n  font-weight: bold;\n}\n\n.markdown-body .pl-mo {\n  color: #1d3e81;\n}\n\n.markdown-body kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font: 11px Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  line-height: 10px;\n  color: #555;\n  vertical-align: middle;\n  background-color: #fcfcfc;\n  border: solid 1px #ccc;\n  border-bottom-color: #bbb;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #bbb;\n}\n\n.markdown-body .task-list-item {\n  list-style-type: none;\n}\n\n.markdown-body .task-list-item+.task-list-item {\n  margin-top: 3px;\n}\n\n.markdown-body .task-list-item input {\n  margin: 0 0.35em 0.25em -1.6em;\n  vertical-align: middle;\n}\n\n.markdown-body :checked+.radio-label {\n  z-index: 1;\n  position: relative;\n  border-color: #4078c0;\n}") || true) && "_3b66eb47")
  ;((require('insert-css')("/* http://jmblog.github.com/color-themes-for-google-code-highlightjs */\n\n/* Tomorrow Comment */\n.hljs-comment,\n.hljs-quote {\n  color: #8e908c;\n}\n\n/* Tomorrow Red */\n.hljs-variable,\n.hljs-template-variable,\n.hljs-tag,\n.hljs-name,\n.hljs-selector-id,\n.hljs-selector-class,\n.hljs-regexp,\n.hljs-deletion {\n  color: #c82829;\n}\n\n/* Tomorrow Orange */\n.hljs-number,\n.hljs-built_in,\n.hljs-builtin-name,\n.hljs-literal,\n.hljs-type,\n.hljs-params,\n.hljs-meta,\n.hljs-link {\n  color: #f5871f;\n}\n\n/* Tomorrow Yellow */\n.hljs-attribute {\n  color: #eab700;\n}\n\n/* Tomorrow Green */\n.hljs-string,\n.hljs-symbol,\n.hljs-bullet,\n.hljs-addition {\n  color: #718c00;\n}\n\n/* Tomorrow Blue */\n.hljs-title,\n.hljs-section {\n  color: #4271ae;\n}\n\n/* Tomorrow Purple */\n.hljs-keyword,\n.hljs-selector-tag {\n  color: #8959a8;\n}\n\n.hljs {\n  display: block;\n  overflow-x: auto;\n  background: white;\n  color: #4d4d4c;\n  padding: 0.5em;\n}\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}") || true) && "_4337a147")

  return {
    app: app,
    start: function (id, opts) {
      if (typeof id === 'object') {
        opts = id
        id = null
      }
      opts.href = opts.href || false
      return app.start(id, opts)
    }
  }
}

},{"./app":1,"insert-css":93}],60:[function(require,module,exports){
module.exports = applyHook

// apply arguments onto an array of functions, useful for hooks
// (arr, any?, any?, any?, any?, any?) -> null
function applyHook (arr, arg1, arg2, arg3, arg4, arg5) {
  arr.forEach(function (fn) {
    fn(arg1, arg2, arg3, arg4, arg5)
  })
}

},{}],61:[function(require,module,exports){
const mutate = require('xtend/mutable')
const assert = require('assert')
const xtend = require('xtend')

const applyHook = require('./apply-hook')

module.exports = dispatcher

// initialize a new barracks instance
// obj -> obj
function dispatcher (hooks) {
  hooks = hooks || {}
  assert.equal(typeof hooks, 'object', 'barracks: hooks should be undefined or an object')

  const onStateChangeHooks = []
  const onActionHooks = []
  const onErrorHooks = []

  useHooks(hooks)

  var reducersCalled = false
  var effectsCalled = false
  var stateCalled = false
  var subsCalled = false

  const subscriptions = start._subscriptions = {}
  const reducers = start._reducers = {}
  const effects = start._effects = {}
  const models = start._models = []
  var _state = {}

  start.model = setModel
  start.state = getState
  start.start = start
  start.use = useHooks
  return start

  // push an object of hooks onto an array
  // obj -> null
  function useHooks (hooks) {
    assert.equal(typeof hooks, 'object', 'barracks.use: hooks should be an object')
    assert.ok(!hooks.onError || typeof hooks.onError === 'function', 'barracks.use: onError should be undefined or a function')
    assert.ok(!hooks.onAction || typeof hooks.onAction === 'function', 'barracks.use: onAction should be undefined or a function')
    assert.ok(!hooks.onStateChange || typeof hooks.onStateChange === 'function', 'barracks.use: onStateChange should be undefined or a function')

    if (hooks.onError) onErrorHooks.push(wrapOnError(hooks.onError))
    if (hooks.onAction) onActionHooks.push(hooks.onAction)
    if (hooks.onStateChange) onStateChangeHooks.push(hooks.onStateChange)
  }

  // push a model to be initiated
  // obj -> null
  function setModel (model) {
    assert.equal(typeof model, 'object', 'barracks.store.model: model should be an object')
    models.push(model)
  }

  // get the current state from the store
  // obj? -> obj
  function getState (opts) {
    opts = opts || {}
    assert.equal(typeof opts, 'object', 'barracks.store.state: opts should be an object')
    if (opts.state) {
      const initialState = {}
      const nsState = {}
      models.forEach(function (model) {
        const ns = model.namespace
        const modelState = model.state || {}
        if (ns) {
          nsState[ns] = {}
          apply(ns, modelState, nsState)
          nsState[ns] = xtend(nsState[ns], opts.state[ns])
        } else {
          apply(model.namespace, modelState, initialState)
        }
      })
      return xtend(_state, xtend(opts.state, nsState))
    } else if (opts.freeze === false) {
      return xtend(_state)
    } else {
      return Object.freeze(xtend(_state))
    }
  }

  // initialize the store hooks, get the send() function
  // obj? -> fn
  function start (opts) {
    opts = opts || {}
    assert.equal(typeof opts, 'object', 'barracks.store.start: opts should be undefined or an object')

    // register values from the models
    models.forEach(function (model) {
      const ns = model.namespace
      if (!stateCalled && model.state && opts.state !== false) {
        apply(ns, model.state, _state)
      }
      if (!reducersCalled && model.reducers && opts.reducers !== false) {
        apply(ns, model.reducers, reducers)
      }
      if (!effectsCalled && model.effects && opts.effects !== false) {
        apply(ns, model.effects, effects)
      }
      if (!subsCalled && model.subscriptions && opts.subscriptions !== false) {
        apply(ns, model.subscriptions, subscriptions, createSend, function (err) {
          applyHook(onErrorHooks, err)
        })
      }
    })

    if (!opts.noState) stateCalled = true
    if (!opts.noReducers) reducersCalled = true
    if (!opts.noEffects) effectsCalled = true
    if (!opts.noSubscriptions) subsCalled = true

    if (!onErrorHooks.length) onErrorHooks.push(wrapOnError(defaultOnError))

    return createSend

    // call an action from a view
    // (str, bool?) -> (str, any?, fn?) -> null
    function createSend (selfName, callOnError) {
      assert.equal(typeof selfName, 'string', 'barracks.store.start.createSend: selfName should be a string')
      assert.ok(!callOnError || typeof callOnError === 'boolean', 'barracks.store.start.send: callOnError should be undefined or a boolean')

      return function send (name, data, cb) {
        if (!cb && !callOnError) {
          cb = data
          data = null
        }
        data = (typeof data === 'undefined' ? null : data)

        assert.equal(typeof name, 'string', 'barracks.store.start.send: name should be a string')
        assert.ok(!cb || typeof cb === 'function', 'barracks.store.start.send: cb should be a function')

        const done = callOnError ? onErrorCallback : cb
        _send(name, data, selfName, done)

        function onErrorCallback (err) {
          err = err || null
          if (err) {
            applyHook(onErrorHooks, err, _state, function createSend (selfName) {
              return function send (name, data) {
                assert.equal(typeof name, 'string', 'barracks.store.start.send: name should be a string')
                data = (typeof data === 'undefined' ? null : data)
                _send(name, data, selfName, done)
              }
            })
          }
        }
      }
    }

    // call an action
    // (str, str, any, fn) -> null
    function _send (name, data, caller, cb) {
      assert.equal(typeof name, 'string', 'barracks._send: name should be a string')
      assert.equal(typeof caller, 'string', 'barracks._send: caller should be a string')
      assert.equal(typeof cb, 'function', 'barracks._send: cb should be a function')

      setTimeout(function () {
        var reducersCalled = false
        var effectsCalled = false
        const newState = xtend(_state)

        if (onActionHooks.length) {
          applyHook(onActionHooks, data, _state, name, caller, createSend)
        }

        // validate if a namespace exists. Namespaces are delimited by ':'.
        var actionName = name
        if (/:/.test(name)) {
          const arr = name.split(':')
          var ns = arr.shift()
          actionName = arr.join(':')
        }

        const _reducers = ns ? reducers[ns] : reducers
        if (_reducers && _reducers[actionName]) {
          if (ns) {
            const reducedState = _reducers[actionName](data, _state[ns])
            newState[ns] = xtend(_state[ns], reducedState)
          } else {
            mutate(newState, reducers[actionName](data, _state))
          }
          reducersCalled = true
          if (onStateChangeHooks.length) {
            applyHook(onStateChangeHooks, data, newState, _state, actionName, createSend)
          }
          _state = newState
          cb()
        }

        const _effects = ns ? effects[ns] : effects
        if (!reducersCalled && _effects && _effects[actionName]) {
          const send = createSend('effect: ' + name)
          if (ns) _effects[actionName](data, _state[ns], send, cb)
          else _effects[actionName](data, _state, send, cb)
          effectsCalled = true
        }

        if (!reducersCalled && !effectsCalled) {
          throw new Error('Could not find action ' + actionName)
        }
      }, 0)
    }
  }
}

// compose an object conditionally
// optionally contains a namespace
// which is used to nest properties.
// (str, obj, obj, fn?) -> null
function apply (ns, source, target, createSend, done) {
  if (ns && !target[ns]) target[ns] = {}
  Object.keys(source).forEach(function (key) {
    if (ns) {
      target[ns][key] = source[key]
    } else {
      target[key] = source[key]
    }
    if (createSend && done) {
      const send = createSend('subscription: ' + (ns ? ns + ':' + key : key))
      source[key](send, done)
    }
  })
}

// handle errors all the way at the top of the trace
// err? -> null
function defaultOnError (err) {
  throw err
}

function wrapOnError (onError) {
  return function onErrorWrap (err) {
    if (err) onError(err)
  }
}

},{"./apply-hook":60,"assert":7,"xtend":135,"xtend/mutable":136}],62:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function bel_onload () {
      load(el)
    }, function bel_onunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          el.setAttributeNS(null, p, val)
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement)
module.exports.createElement = belCreateElement

},{"global/document":82,"hyperx":88,"on-load":106}],63:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"buffer":14,"dup":13}],64:[function(require,module,exports){
'use strict';

module.exports = Error.captureStackTrace || function (error) {
	var container = new Error();

	Object.defineProperty(error, 'stack', {
		configurable: true,
		get: function getStack() {
			var stack = container.stack;

			Object.defineProperty(this, 'stack', {
				value: stack
			});

			return stack;
		}
	});
};

},{}],65:[function(require,module,exports){
module.exports = require('yo-yo')

},{"yo-yo":137}],66:[function(require,module,exports){
const history = require('sheet-router/history')
const sheetRouter = require('sheet-router')
const document = require('global/document')
const onReady = require('document-ready')
const href = require('sheet-router/href')
const hash = require('sheet-router/hash')
const hashMatch = require('hash-match')
const barracks = require('barracks')
const nanoraf = require('nanoraf')
const assert = require('assert')
const xtend = require('xtend')
const yo = require('yo-yo')

module.exports = choo

// framework for creating sturdy web applications
// null -> fn
function choo (opts) {
  opts = opts || {}

  const _store = start._store = barracks()
  var _router = start._router = null
  var _defaultRoute = null
  var _rootNode = null
  var _routes = null
  var _frame = null

  _store.use({ onStateChange: render })
  _store.use(opts)

  start.toString = toString
  start.router = router
  start.model = model
  start.start = start
  start.use = use

  return start

  // render the application to a string
  // (str, obj) -> str
  function toString (route, serverState) {
    serverState = serverState || {}
    assert.equal(typeof route, 'string', 'choo.app.toString: route must be a string')
    assert.equal(typeof serverState, 'object', 'choo.app.toString: serverState must be an object')
    _store.start({ subscriptions: false, reducers: false, effects: false })

    const state = _store.state({ state: serverState })
    const router = createRouter(_defaultRoute, _routes, createSend)
    const tree = router(route, state)
    return tree.outerHTML || tree.toString()

    function createSend () {
      return function send () {
        assert.ok(false, 'choo: send() cannot be called from Node')
      }
    }
  }

  // start the application
  // (str?, obj?) -> DOMNode
  function start (selector, startOpts) {
    if (!startOpts && typeof selector !== 'string') {
      startOpts = selector
      selector = null
    }
    startOpts = startOpts || {}

    _store.model(appInit(startOpts))
    const createSend = _store.start(startOpts)
    _router = start._router = createRouter(_defaultRoute, _routes, createSend)
    const state = _store.state({state: {}})

    if (!selector) {
      const tree = _router(state.location.pathname, state)
      _rootNode = tree
      return tree
    } else {
      onReady(function onReady () {
        const oldTree = document.querySelector(selector)
        assert.ok(oldTree, 'could not query selector: ' + selector)
        const newTree = _router(state.location.pathname, state)
        _rootNode = yo.update(oldTree, newTree)
      })
    }
  }

  // update the DOM after every state mutation
  // (obj, obj, obj, str, fn) -> null
  function render (data, state, prev, name, createSend) {
    if (!_frame) {
      _frame = nanoraf(function (state, prev) {
        const newTree = _router(state.location.pathname, state, prev)
        _rootNode = yo.update(_rootNode, newTree)
      })
    }
    _frame(state, prev)
  }

  // register all routes on the router
  // (str?, [fn|[fn]]) -> obj
  function router (defaultRoute, routes) {
    _defaultRoute = defaultRoute
    _routes = routes
  }

  // create a new model
  // (str?, obj) -> null
  function model (model) {
    _store.model(model)
  }

  // register a plugin
  // (obj) -> null
  function use (hooks) {
    assert.equal(typeof hooks, 'object', 'choo.use: hooks should be an object')
    _store.use(hooks)
  }

  // create a new router with a custom `createRoute()` function
  // (str?, obj, fn?) -> null
  function createRouter (defaultRoute, routes, createSend) {
    var prev = {}
    return sheetRouter(defaultRoute, routes, createRoute)

    function createRoute (routeFn) {
      return function (route, inline, child) {
        if (typeof inline === 'function') {
          inline = wrap(inline, route)
        }
        return routeFn(route, inline, child)
      }

      function wrap (child, route) {
        const send = createSend('view: ' + route, true)
        return function chooWrap (params, state) {
          const nwPrev = prev
          const nwState = prev = xtend(state, { params: params })
          if (opts.freeze !== false) Object.freeze(nwState)
          return child(nwState, nwPrev, send)
        }
      }
    }
  }
}

// initial application state model
// obj -> obj
function appInit (opts) {
  const loc = document.location
  const state = { pathname: (opts.hash) ? hashMatch(loc.hash) : loc.href }
  const reducers = {
    setLocation: function setLocation (data, state) {
      return { pathname: data.location.replace(/#.*/, '') }
    }
  }
  // if hash routing explicitly enabled, subscribe to it
  const subs = {}
  if (opts.hash === true) {
    pushLocationSub(function (navigate) {
      hash(function (fragment) {
        navigate(hashMatch(fragment))
      })
    }, 'handleHash', subs)
  } else {
    if (opts.history !== false) pushLocationSub(history, 'handleHistory', subs)
    if (opts.href !== false) pushLocationSub(href, 'handleHref', subs)
  }

  return {
    namespace: 'location',
    subscriptions: subs,
    reducers: reducers,
    state: state
  }

  // create a new subscription that modifies
  // 'app:location' and push it to be loaded
  // (fn, obj) -> null
  function pushLocationSub (cb, key, model) {
    model[key] = function (send, done) {
      cb(function navigate (pathname) {
        send('location:setLocation', { location: pathname }, done)
      })
    }
  }
}

},{"assert":7,"barracks":61,"document-ready":69,"global/document":82,"hash-match":86,"nanoraf":102,"sheet-router":126,"sheet-router/hash":123,"sheet-router/history":124,"sheet-router/href":125,"xtend":135,"yo-yo":137}],67:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../../example/node_modules/is-buffer/index.js")})
},{"../../../example/node_modules/is-buffer/index.js":21}],68:[function(require,module,exports){
'use strict';
var captureStackTrace = require('capture-stack-trace');

function inherits(ctor, superCtor) {
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
			value: ctor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
}

module.exports = function createErrorClass(className, setup) {
	if (typeof className !== 'string') {
		throw new TypeError('Expected className to be a string');
	}

	if (/[^0-9a-zA-Z_$]/.test(className)) {
		throw new Error('className contains invalid characters');
	}

	setup = setup || function (message) {
		this.message = message;
	};

	var ErrorClass = function () {
		Object.defineProperty(this, 'name', {
			configurable: true,
			value: className,
			writable: true
		});

		captureStackTrace(this, this.constructor);

		setup.apply(this, arguments);
	};

	inherits(ErrorClass, Error);

	return ErrorClass;
};

},{"capture-stack-trace":64}],69:[function(require,module,exports){
'use strict'

var document = require('global/document')

module.exports = document.addEventListener ? ready : noop

function ready (callback) {
  if (document.readyState === 'complete') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', function onLoad () {
    callback()
  })
}

function noop () {}

},{"global/document":82}],70:[function(require,module,exports){
"use strict";

var stream = require("readable-stream");

function DuplexWrapper(options, writable, readable) {
  if (typeof readable === "undefined") {
    readable = writable;
    writable = options;
    options = null;
  }

  stream.Duplex.call(this, options);

  if (typeof readable.read !== "function") {
    readable = (new stream.Readable(options)).wrap(readable);
  }

  this._writable = writable;
  this._readable = readable;
  this._waiting = false;

  var self = this;

  writable.once("finish", function() {
    self.end();
  });

  this.once("finish", function() {
    writable.end();
  });

  readable.on("readable", function() {
    if (self._waiting) {
      self._waiting = false;
      self._read();
    }
  });

  readable.once("end", function() {
    self.push(null);
  });

  if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
    writable.on("error", function(err) {
      self.emit("error", err);
    });

    readable.on("error", function(err) {
      self.emit("error", err);
    });
  }
}

DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: DuplexWrapper}});

DuplexWrapper.prototype._write = function _write(input, encoding, done) {
  this._writable.write(input, encoding, done);
};

DuplexWrapper.prototype._read = function _read() {
  var buf;
  var reads = 0;
  while ((buf = this._readable.read()) !== null) {
    this.push(buf);
    reads++;
  }
  if (reads === 0) {
    this._waiting = true;
  }
};

module.exports = function duplex2(options, writable, readable) {
  return new DuplexWrapper(options, writable, readable);
};

module.exports.DuplexWrapper = DuplexWrapper;

},{"readable-stream":122}],71:[function(require,module,exports){
(function (process,Buffer){
var stream = require('readable-stream')
var eos = require('end-of-stream')
var inherits = require('inherits')
var shift = require('stream-shift')

var SIGNAL_FLUSH = new Buffer([0])

var onuncork = function(self, fn) {
  if (self._corked) self.once('uncork', fn)
  else fn()
}

var destroyer = function(self, end) {
  return function(err) {
    if (err) self.destroy(err.message === 'premature close' ? null : err)
    else if (end && !self._ended) self.end()
  }
}

var end = function(ws, fn) {
  if (!ws) return fn()
  if (ws._writableState && ws._writableState.finished) return fn()
  if (ws._writableState) return ws.end(fn)
  ws.end()
  fn()
}

var toStreams2 = function(rs) {
  return new (stream.Readable)({objectMode:true, highWaterMark:16}).wrap(rs)
}

var Duplexify = function(writable, readable, opts) {
  if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts)
  stream.Duplex.call(this, opts)

  this._writable = null
  this._readable = null
  this._readable2 = null

  this._forwardDestroy = !opts || opts.destroy !== false
  this._forwardEnd = !opts || opts.end !== false
  this._corked = 1 // start corked
  this._ondrain = null
  this._drained = false
  this._forwarding = false
  this._unwrite = null
  this._unread = null
  this._ended = false

  this.destroyed = false

  if (writable) this.setWritable(writable)
  if (readable) this.setReadable(readable)
}

inherits(Duplexify, stream.Duplex)

Duplexify.obj = function(writable, readable, opts) {
  if (!opts) opts = {}
  opts.objectMode = true
  opts.highWaterMark = 16
  return new Duplexify(writable, readable, opts)
}

Duplexify.prototype.cork = function() {
  if (++this._corked === 1) this.emit('cork')
}

Duplexify.prototype.uncork = function() {
  if (this._corked && --this._corked === 0) this.emit('uncork')
}

Duplexify.prototype.setWritable = function(writable) {
  if (this._unwrite) this._unwrite()

  if (this.destroyed) {
    if (writable && writable.destroy) writable.destroy()
    return
  }

  if (writable === null || writable === false) {
    this.end()
    return
  }

  var self = this
  var unend = eos(writable, {writable:true, readable:false}, destroyer(this, this._forwardEnd))

  var ondrain = function() {
    var ondrain = self._ondrain
    self._ondrain = null
    if (ondrain) ondrain()
  }

  var clear = function() {
    self._writable.removeListener('drain', ondrain)
    unend()
  }

  if (this._unwrite) process.nextTick(ondrain) // force a drain on stream reset to avoid livelocks

  this._writable = writable
  this._writable.on('drain', ondrain)
  this._unwrite = clear

  this.uncork() // always uncork setWritable
}

Duplexify.prototype.setReadable = function(readable) {
  if (this._unread) this._unread()

  if (this.destroyed) {
    if (readable && readable.destroy) readable.destroy()
    return
  }

  if (readable === null || readable === false) {
    this.push(null)
    this.resume()
    return
  }

  var self = this
  var unend = eos(readable, {writable:false, readable:true}, destroyer(this))

  var onreadable = function() {
    self._forward()
  }

  var onend = function() {
    self.push(null)
  }

  var clear = function() {
    self._readable2.removeListener('readable', onreadable)
    self._readable2.removeListener('end', onend)
    unend()
  }

  this._drained = true
  this._readable = readable
  this._readable2 = readable._readableState ? readable : toStreams2(readable)
  this._readable2.on('readable', onreadable)
  this._readable2.on('end', onend)
  this._unread = clear

  this._forward()
}

Duplexify.prototype._read = function() {
  this._drained = true
  this._forward()
}

Duplexify.prototype._forward = function() {
  if (this._forwarding || !this._readable2 || !this._drained) return
  this._forwarding = true

  var data

  while ((data = shift(this._readable2)) !== null) {
    this._drained = this.push(data)
  }

  this._forwarding = false
}

Duplexify.prototype.destroy = function(err) {
  if (this.destroyed) return
  this.destroyed = true

  var self = this
  process.nextTick(function() {
    self._destroy(err)
  })
}

Duplexify.prototype._destroy = function(err) {
  if (err) {
    var ondrain = this._ondrain
    this._ondrain = null
    if (ondrain) ondrain(err)
    else this.emit('error', err)
  }

  if (this._forwardDestroy) {
    if (this._readable && this._readable.destroy) this._readable.destroy()
    if (this._writable && this._writable.destroy) this._writable.destroy()
  }

  this.emit('close')
}

Duplexify.prototype._write = function(data, enc, cb) {
  if (this.destroyed) return cb()
  if (this._corked) return onuncork(this, this._write.bind(this, data, enc, cb))
  if (data === SIGNAL_FLUSH) return this._finish(cb)
  if (!this._writable) return cb()

  if (this._writable.write(data) === false) this._ondrain = cb
  else cb()
}


Duplexify.prototype._finish = function(cb) {
  var self = this
  this.emit('preend')
  onuncork(this, function() {
    end(self._forwardEnd && self._writable, function() {
      // haxx to not emit prefinish twice
      if (self._writableState.prefinished === false) self._writableState.prefinished = true
      self.emit('prefinish')
      onuncork(self, cb)
    })
  })
}

Duplexify.prototype.end = function(data, enc, cb) {
  if (typeof data === 'function') return this.end(null, null, data)
  if (typeof enc === 'function') return this.end(data, null, enc)
  this._ended = true
  if (data) this.write(data)
  if (!this._writableState.ending) this.write(SIGNAL_FLUSH)
  return stream.Writable.prototype.end.call(this, cb)
}

module.exports = Duplexify

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":35,"buffer":14,"end-of-stream":73,"inherits":92,"readable-stream":122,"stream-shift":127}],72:[function(require,module,exports){
'use strict';
module.exports = function (opts) {
	opts = opts || {};
	var re = '[^\\.\\s@][^\\s@]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';
	return opts.exact ? new RegExp('^' + re + '$') : new RegExp(re, 'g');
};

},{}],73:[function(require,module,exports){
var once = require('once');

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback();
	};

	var onend = function() {
		readable = false;
		if (!writable) callback();
	};

	var onclose = function() {
		if (readable && !(rs && rs.ended)) return callback(new Error('premature close'));
		if (writable && !(ws && ws.ended)) return callback(new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', callback);
	stream.on('close', onclose);

	return function() {
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('end', onend);
		stream.removeListener('error', callback);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;
},{"once":107}],74:[function(require,module,exports){
'use strict';

var util = require('util');
var isArrayish = require('is-arrayish');

var errorEx = function errorEx(name, properties) {
	if (!name || name.constructor !== String) {
		properties = name || {};
		name = Error.name;
	}

	var errorExError = function ErrorEXError(message) {
		if (!this) {
			return new ErrorEXError(message);
		}

		message = message instanceof Error
			? message.message
			: (message || this.message);

		Error.call(this, message);
		Error.captureStackTrace(this, errorExError);
		this.name = name;

		delete this.message;

		Object.defineProperty(this, 'message', {
			configurable: true,
			enumerable: false,
			get: function () {
				var newMessage = message.split(/\r?\n/g);

				for (var key in properties) {
					if (properties.hasOwnProperty(key) && 'message' in properties[key]) {
						newMessage = properties[key].message(this[key], newMessage) ||
							newMessage;
						if (!isArrayish(newMessage)) {
							newMessage = [newMessage];
						}
					}
				}

				return newMessage.join('\n');
			},
			set: function (v) {
				message = v;
			}
		});

		var stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
		var stackGetter = stackDescriptor.get;

		stackDescriptor.get = function () {
			var stack = stackGetter.call(this).split(/\r?\n+/g);

			var lineCount = 1;
			for (var key in properties) {
				if (!properties.hasOwnProperty(key)) {
					continue;
				}

				var modifier = properties[key];

				if ('line' in modifier) {
					var line = modifier.line(this[key]);
					if (line) {
						stack.splice(lineCount, 0, '    ' + line);
					}
				}

				if ('stack' in modifier) {
					modifier.stack(this[key], stack);
				}
			}

			return stack.join('\n');
		};

		Object.defineProperty(this, 'stack', stackDescriptor);
	};

	util.inherits(errorExError, Error);

	return errorExError;
};

errorEx.append = function (str, def) {
	return {
		message: function (v, message) {
			v = v || def;

			if (v) {
				message[0] += ' ' + str.replace('%s', v.toString());
			}

			return message;
		}
	};
};

errorEx.line = function (str, def) {
	return {
		line: function (v) {
			v = v || def;

			if (v) {
				return str.replace('%s', v.toString());
			}

			return null;
		}
	};
};

module.exports = errorEx;

},{"is-arrayish":94,"util":57}],75:[function(require,module,exports){
(function (process){
'use strict';
var got = require('got');
var objectAssign = require('object-assign');

function ghGot(path, opts, cb) {
	if (!path) {
		throw new Error('path required');
	}

	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	opts = objectAssign({json: true}, opts);

	opts.headers = objectAssign({
		accept: 'application/vnd.github.v3+json',
		'user-agent': 'https://github.com/sindresorhus/gh-got'
	}, opts.headers);

	var env = process.env;
	var token = env.GITHUB_TOKEN || opts.token;

	if (token) {
		opts.headers.authorization = 'token ' + token;
	}

	// https://developer.github.com/v3/#http-verbs
	if (opts.method && opts.method.toLowerCase() === 'put' && !opts.body) {
		opts.headers['content-length'] = 0;
	}

	var endpoint = env.GITHUB_ENDPOINT ? env.GITHUB_ENDPOINT.replace(/[^/]$/, '$&/') : opts.endpoint;
	var url = (endpoint || 'https://api.github.com/') + path;

	return got(url, opts, cb);
}

[
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
].forEach(function (el) {
	ghGot[el] = function (url, opts, cb) {
		return ghGot(url, objectAssign({}, opts, {method: el.toUpperCase()}), cb);
	};
});

module.exports = ghGot;

}).call(this,require('_process'))
},{"_process":35,"got":84,"object-assign":105}],76:[function(require,module,exports){
'use strict';
var emailRegex = require('email-regex');
var githubUsername= require('github-username');
var ghGot = require('gh-got');

module.exports = function (str, token, cb) {

	if (typeof token === 'function') {
		cb = token;
		token = {};
	}

	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var fetchAvatar =  function (err, data) {
		if(err) return cb(err,null);
		return cb(null,data.avatar_url)
	};

	emailRegex({exact: true}).test(str) ?
	githubUsername(str,function(err,userName){
		ghGot('users/' + userName, token, fetchAvatar)
	}) : ghGot('users/' + str, token, fetchAvatar);
	
};

},{"email-regex":72,"gh-got":75,"github-username":77}],77:[function(require,module,exports){
'use strict';
var ghGot = require('gh-got');

module.exports = function (email, token, cb) {
	if (typeof email !== 'string' || email.indexOf('@') === -1) {
		throw new Error('`email` required');
	}

	if (typeof token === 'function') {
		cb = token;
		token = null;
	}

	ghGot('search/users', {
		token: token,
		query: {
			q: email + ' in:email'
		},
		headers: {
			'user-agent': 'https://github.com/sindresorhus/github-username'
		}
	}).then(function (result) {
		var data = result.body;

		if (data.total_count === 0) {
			cb(new Error('Couldn\'t find a username for the supplied email'));
			return;
		}

		cb(null, data.items[0].login);
	}).catch(cb);
};

},{"gh-got":78}],78:[function(require,module,exports){
(function (process){
'use strict';
var got = require('got');
var objectAssign = require('object-assign');
var Promise = require('pinkie-promise');

function ghGot(path, opts) {
	if (typeof path !== 'string') {
		return Promise.reject(new TypeError('Path should be a string'));
	}

	opts = objectAssign({json: true, endpoint: 'https://api.github.com/'}, opts);

	opts.headers = objectAssign({
		'accept': 'application/vnd.github.v3+json',
		'user-agent': 'https://github.com/sindresorhus/gh-got'
	}, opts.headers);

	var env = process.env;
	var token = env.GITHUB_TOKEN || opts.token;

	if (token) {
		opts.headers.authorization = 'token ' + token;
	}

	// https://developer.github.com/v3/#http-verbs
	if (opts.method && opts.method.toLowerCase() === 'put' && !opts.body) {
		opts.headers['content-length'] = 0;
	}

	var endpoint = env.GITHUB_ENDPOINT ? env.GITHUB_ENDPOINT.replace(/[^/]$/, '$&/') : opts.endpoint;
	var url = /https?/.test(path) ? path : endpoint + path;

	if (opts.stream) {
		return got.stream(url, opts);
	}

	return got(url, opts);
}

var helpers = [
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
];

helpers.forEach(function (el) {
	ghGot[el] = function (url, opts) {
		return ghGot(url, objectAssign({}, opts, {method: el.toUpperCase()}));
	};
});

ghGot.stream = function (url, opts) {
	return ghGot(url, objectAssign({}, opts, {json: false, stream: true}));
};

helpers.forEach(function (el) {
	ghGot.stream[el] = function (url, opts) {
		return ghGot.stream(url, objectAssign({}, opts, {method: el.toUpperCase()}));
	};
});

module.exports = ghGot;

}).call(this,require('_process'))
},{"_process":35,"got":79,"object-assign":81,"pinkie-promise":112}],79:[function(require,module,exports){
(function (Buffer){
'use strict';

var EventEmitter = require('events').EventEmitter;
var http = require('http');
var https = require('https');
var urlLib = require('url');
var querystring = require('querystring');
var objectAssign = require('object-assign');
var PassThrough = require('readable-stream').PassThrough;
var duplexer2 = require('duplexer2');
var isStream = require('is-stream');
var readAllStream = require('read-all-stream');
var timedOut = require('timed-out');
var urlParseLax = require('url-parse-lax');
var lowercaseKeys = require('lowercase-keys');
var isRedirect = require('is-redirect');
var PinkiePromise = require('pinkie-promise');
var unzipResponse = require('unzip-response');
var createErrorClass = require('create-error-class');
var nodeStatusCodes = require('node-status-codes');
var isPlainObj = require('is-plain-obj');
var parseJson = require('parse-json');
var isRetryAllowed = require('is-retry-allowed');
var pkg = require('./package.json');

function requestAsEventEmitter(opts) {
	opts = opts || {};

	var ee = new EventEmitter();
	var redirectCount = 0;
	var retryCount = 0;

	var get = function (opts) {
		var fn = opts.protocol === 'https:' ? https : http;

		var req = fn.request(opts, function (res) {
			var statusCode = res.statusCode;

			if (isRedirect(statusCode) && opts.followRedirect && 'location' in res.headers && (opts.method === 'GET' || opts.method === 'HEAD')) {
				res.resume();

				if (++redirectCount > 10) {
					ee.emit('error', new got.MaxRedirectsError(statusCode, opts), null, res);
					return;
				}

				var redirectUrl = urlLib.resolve(urlLib.format(opts), res.headers.location);
				var redirectOpts = objectAssign({}, opts, urlLib.parse(redirectUrl));

				ee.emit('redirect', res, redirectOpts);

				get(redirectOpts);
				return;
			}

			// do not write ee.bind(...) instead of function - it will break gzip in Node.js 0.10
			setImmediate(function () {
				ee.emit('response', typeof unzipResponse === 'function' && req.method !== 'HEAD' ? unzipResponse(res) : res);
			});
		});

		req.once('error', function (err) {
			var backoff = opts.retries(++retryCount, err);
			if (backoff) {
				setTimeout(get, backoff, opts);
				return;
			}

			ee.emit('error', new got.RequestError(err, opts));
		});

		if (opts.timeout) {
			timedOut(req, opts.timeout);
		}

		setImmediate(ee.emit.bind(ee), 'request', req);
	};

	get(opts);
	return ee;
}

function asCallback(opts, cb) {
	var ee = requestAsEventEmitter(opts);

	ee.on('request', function (req) {
		if (isStream(opts.body)) {
			opts.body.pipe(req);
			opts.body = undefined;
			return;
		}

		req.end(opts.body);
	});

	ee.on('response', function (res) {
		readAllStream(res, opts.encoding, function (err, data) {
			var statusCode = res.statusCode;
			var limitStatusCode = opts.followRedirect ? 299 : 399;

			if (err) {
				cb(new got.ReadError(err, opts), null, res);
				return;
			}

			if (statusCode < 200 || statusCode > limitStatusCode) {
				err = new got.HTTPError(statusCode, opts);
			}

			if (opts.json && data) {
				try {
					data = parseJson(data);
				} catch (e) {
					e.fileName = urlLib.format(opts);
					err = new got.ParseError(e, statusCode, opts);
				}
			}

			cb(err, data, res);
		});
	});

	ee.on('error', cb);
}

function asPromise(opts) {
	return new PinkiePromise(function (resolve, reject) {
		asCallback(opts, function (err, data, response) {
			if (response) {
				response.body = data;
			}

			if (err) {
				Object.defineProperty(err, 'response', {
					value: response,
					enumerable: false
				});
				reject(err);
				return;
			}

			resolve(response);
		});
	});
}

function asStream(opts) {
	var input = new PassThrough();
	var output = new PassThrough();
	var proxy = duplexer2(input, output);

	if (opts.json) {
		throw new Error('got can not be used as stream when options.json is used');
	}

	if (opts.body) {
		proxy.write = function () {
			throw new Error('got\'s stream is not writable when options.body is used');
		};
	}

	var ee = requestAsEventEmitter(opts);

	ee.on('request', function (req) {
		proxy.emit('request', req);

		if (isStream(opts.body)) {
			opts.body.pipe(req);
			return;
		}

		if (opts.body) {
			req.end(opts.body);
			return;
		}

		if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
			input.pipe(req);
			return;
		}

		req.end();
	});

	ee.on('response', function (res) {
		var statusCode = res.statusCode;
		var limitStatusCode = opts.followRedirect ? 299 : 399;

		res.pipe(output);

		if (statusCode < 200 || statusCode > limitStatusCode) {
			proxy.emit('error', new got.HTTPError(statusCode, opts), null, res);
			return;
		}

		proxy.emit('response', res);
	});

	ee.on('redirect', proxy.emit.bind(proxy, 'redirect'));

	ee.on('error', proxy.emit.bind(proxy, 'error'));

	return proxy;
}

function normalizeArguments(url, opts) {
	if (typeof url !== 'string' && typeof url !== 'object') {
		throw new Error('Parameter `url` must be a string or object, not ' + typeof url);
	}

	if (typeof url === 'string') {
		url = urlParseLax(url);

		if (url.auth) {
			throw new Error('Basic authentication must be done with auth option');
		}
	}

	opts = objectAssign(
		{protocol: 'http:', path: '', retries: 5},
		url,
		opts
	);

	opts.headers = objectAssign({
		'user-agent': pkg.name + '/' + pkg.version + ' (https://github.com/sindresorhus/got)',
		'accept-encoding': 'gzip,deflate'
	}, lowercaseKeys(opts.headers));

	var query = opts.query;

	if (query) {
		if (typeof query !== 'string') {
			opts.query = querystring.stringify(query);
		}

		opts.path = opts.path.split('?')[0] + '?' + opts.query;
		delete opts.query;
	}

	if (opts.json && opts.headers.accept === undefined) {
		opts.headers.accept = 'application/json';
	}

	var body = opts.body;

	if (body) {
		if (typeof body !== 'string' && !Buffer.isBuffer(body) && !isStream(body) && !isPlainObj(body)) {
			throw new Error('options.body must be a ReadableStream, string, Buffer or plain Object');
		}

		opts.method = opts.method || 'POST';

		if (isPlainObj(body)) {
			opts.headers['content-type'] = opts.headers['content-type'] || 'application/x-www-form-urlencoded';
			body = opts.body = querystring.stringify(body);
		}

		if (opts.headers['content-length'] === undefined && opts.headers['transfer-encoding'] === undefined && !isStream(body)) {
			var length = typeof body === 'string' ? Buffer.byteLength(body) : body.length;
			opts.headers['content-length'] = length;
		}
	}

	opts.method = opts.method || 'GET';

	opts.method = opts.method.toUpperCase();

	if (opts.hostname === 'unix') {
		var matches = /(.+)\:(.+)/.exec(opts.path);

		if (matches) {
			opts.socketPath = matches[1];
			opts.path = matches[2];
			opts.host = null;
		}
	}

	if (typeof opts.retries !== 'function') {
		var retries = opts.retries;
		opts.retries = function backoff(iter, err) {
			if (iter > retries || !isRetryAllowed(err)) {
				return 0;
			}

			var noise = Math.random() * 100;
			return (1 << iter) * 1000 + noise;
		};
	}

	if (opts.followRedirect === undefined) {
		opts.followRedirect = true;
	}

	return opts;
}

function got(url, opts, cb) {
	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	if (cb) {
		asCallback(normalizeArguments(url, opts), cb);
		return null;
	}

	try {
		return asPromise(normalizeArguments(url, opts));
	} catch (error) {
		return PinkiePromise.reject(error);
	}
}

var helpers = [
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
];

helpers.forEach(function (el) {
	got[el] = function (url, opts, cb) {
		if (typeof opts === 'function') {
			cb = opts;
			opts = {};
		}

		return got(url, objectAssign({}, opts, {method: el}), cb);
	};
});

got.stream = function (url, opts, cb) {
	if (cb || typeof opts === 'function') {
		throw new Error('callback can not be used with stream mode');
	}

	return asStream(normalizeArguments(url, opts));
};

helpers.forEach(function (el) {
	got.stream[el] = function (url, opts, cb) {
		if (typeof opts === 'function') {
			cb = opts;
			opts = {};
		}

		return got.stream(url, objectAssign({}, opts, {method: el}), cb);
	};
});

function stdError(error, opts) {
	if (error.code !== undefined) {
		this.code = error.code;
	}

	objectAssign(this, {
		message: error.message,
		host: opts.host,
		hostname: opts.hostname,
		method: opts.method,
		path: opts.path
	});
}

got.RequestError = createErrorClass('RequestError', stdError);
got.ReadError = createErrorClass('ReadError', stdError);

got.ParseError = createErrorClass('ParseError', function (e, statusCode, opts) {
	stdError.call(this, e, opts);
	this.statusCode = statusCode;
	this.statusMessage = nodeStatusCodes[this.statusCode];
});

got.HTTPError = createErrorClass('HTTPError', function (statusCode, opts) {
	stdError.call(this, {}, opts);
	this.statusCode = statusCode;
	this.statusMessage = nodeStatusCodes[this.statusCode];
	this.message = 'Response code ' + this.statusCode + ' (' + this.statusMessage + ')';
});

got.MaxRedirectsError = createErrorClass('MaxRedirectsError', function (statusCode, opts) {
	stdError.call(this, {}, opts);
	this.statusCode = statusCode;
	this.statusMessage = nodeStatusCodes[this.statusCode];
	this.message = 'Redirected 10 times. Aborting.';
});

module.exports = got;

}).call(this,require("buffer").Buffer)
},{"./package.json":80,"buffer":14,"create-error-class":68,"duplexer2":70,"events":17,"http":47,"https":18,"is-plain-obj":95,"is-redirect":96,"is-retry-allowed":97,"is-stream":98,"lowercase-keys":100,"node-status-codes":104,"object-assign":81,"parse-json":108,"pinkie-promise":112,"querystring":39,"read-all-stream":116,"readable-stream":122,"timed-out":129,"unzip-response":9,"url":53,"url-parse-lax":130}],80:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "got@^5.2.0",
        "scope": null,
        "escapedName": "got",
        "name": "got",
        "rawSpec": "^5.2.0",
        "spec": ">=5.2.0 <6.0.0",
        "type": "range"
      },
      "/Users/sdv/workspace/freeman-lab/minidocs/node_modules/github-username/node_modules/gh-got"
    ]
  ],
  "_from": "got@>=5.2.0 <6.0.0",
  "_id": "got@5.6.0",
  "_inCache": true,
  "_installable": true,
  "_location": "/github-username/got",
  "_nodeVersion": "4.4.1",
  "_npmOperationalInternal": {
    "host": "packages-12-west.internal.npmjs.com",
    "tmp": "tmp/got-5.6.0.tgz_1459967538089_0.3577845075633377"
  },
  "_npmUser": {
    "name": "floatdrop",
    "email": "floatdrop@gmail.com"
  },
  "_npmVersion": "2.14.20",
  "_phantomChildren": {},
  "_requested": {
    "raw": "got@^5.2.0",
    "scope": null,
    "escapedName": "got",
    "name": "got",
    "rawSpec": "^5.2.0",
    "spec": ">=5.2.0 <6.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/github-username/gh-got"
  ],
  "_resolved": "https://registry.npmjs.org/got/-/got-5.6.0.tgz",
  "_shasum": "bb1d7ee163b78082bbc8eb836f3f395004ea6fbf",
  "_shrinkwrap": null,
  "_spec": "got@^5.2.0",
  "_where": "/Users/sdv/workspace/freeman-lab/minidocs/node_modules/github-username/node_modules/gh-got",
  "browser": {
    "unzip-response": false
  },
  "bugs": {
    "url": "https://github.com/sindresorhus/got/issues"
  },
  "dependencies": {
    "create-error-class": "^3.0.1",
    "duplexer2": "^0.1.4",
    "is-plain-obj": "^1.0.0",
    "is-redirect": "^1.0.0",
    "is-retry-allowed": "^1.0.0",
    "is-stream": "^1.0.0",
    "lowercase-keys": "^1.0.0",
    "node-status-codes": "^1.0.0",
    "object-assign": "^4.0.1",
    "parse-json": "^2.1.0",
    "pinkie-promise": "^2.0.0",
    "read-all-stream": "^3.0.0",
    "readable-stream": "^2.0.5",
    "timed-out": "^2.0.0",
    "unzip-response": "^1.0.0",
    "url-parse-lax": "^1.0.0"
  },
  "description": "Simplified HTTP/HTTPS requests",
  "devDependencies": {
    "ava": "^0.5.0",
    "coveralls": "^2.11.4",
    "get-port": "^2.0.0",
    "into-stream": "^2.0.0",
    "nyc": "^3.2.2",
    "pem": "^1.4.4",
    "pify": "^2.3.0",
    "tempfile": "^1.1.1",
    "xo": "*"
  },
  "directories": {},
  "dist": {
    "shasum": "bb1d7ee163b78082bbc8eb836f3f395004ea6fbf",
    "tarball": "https://registry.npmjs.org/got/-/got-5.6.0.tgz"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "files": [
    "index.js"
  ],
  "gitHead": "d6a81871cf6871548bc79fd9998fd7b47e730f0e",
  "homepage": "https://github.com/sindresorhus/got",
  "keywords": [
    "http",
    "https",
    "get",
    "got",
    "url",
    "uri",
    "request",
    "util",
    "utility",
    "simple",
    "curl",
    "wget",
    "fetch"
  ],
  "license": "MIT",
  "maintainers": [
    {
      "name": "sindresorhus",
      "email": "sindresorhus@gmail.com"
    },
    {
      "name": "floatdrop",
      "email": "floatdrop@gmail.com"
    },
    {
      "name": "kevva",
      "email": "kevinmartensson@gmail.com"
    }
  ],
  "name": "got",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sindresorhus/got.git"
  },
  "scripts": {
    "coveralls": "nyc report --reporter=text-lcov | coveralls",
    "test": "xo && nyc ava"
  },
  "version": "5.6.0",
  "xo": {
    "ignores": [
      "test/**"
    ]
  }
}

},{}],81:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],82:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":9}],83:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],84:[function(require,module,exports){
(function (process,Buffer){
'use strict';
var http = require('http');
var https = require('https');
var urlLib = require('url');
var util = require('util');
var zlib = require('zlib');
var querystring = require('querystring');
var objectAssign = require('object-assign');
var infinityAgent = require('infinity-agent');
var duplexify = require('duplexify');
var isStream = require('is-stream');
var readAllStream = require('read-all-stream');
var timedOut = require('timed-out');
var prependHttp = require('prepend-http');
var lowercaseKeys = require('lowercase-keys');
var isRedirect = require('is-redirect');
var NestedErrorStacks = require('nested-error-stacks');

function GotError(message, nested) {
	NestedErrorStacks.call(this, message, nested);
	objectAssign(this, nested, {nested: this.nested});
}

util.inherits(GotError, NestedErrorStacks);
GotError.prototype.name = 'GotError';

function got(url, opts, cb) {
	if (typeof url !== 'string' && typeof url !== 'object') {
		throw new GotError('Parameter `url` must be a string or object, not ' + typeof url);
	}

	if (typeof opts === 'function') {
		cb = opts;
		opts = {};
	}

	opts = objectAssign(
		{
			protocol: 'http:'
		},
		typeof url === 'string' ? urlLib.parse(prependHttp(url)) : url,
		opts
	);

	opts.headers = objectAssign({
		'user-agent': 'https://github.com/sindresorhus/got',
		'accept-encoding': 'gzip,deflate'
	}, lowercaseKeys(opts.headers));

	if (opts.pathname) {
		opts.path = opts.pathname;
	}

	if (opts.query) {
		if (typeof opts.query !== 'string') {
			opts.query = querystring.stringify(opts.query);
		}

		opts.path = opts.pathname + '?' + opts.query;
		delete opts.query;
	}

	var encoding = opts.encoding;
	var body = opts.body;
	var json = opts.json;
	var timeout = opts.timeout;
	var proxy;
	var redirectCount = 0;

	delete opts.encoding;
	delete opts.body;
	delete opts.json;
	delete opts.timeout;

	if (json) {
		opts.headers.accept = opts.headers.accept || 'application/json';
	}

	if (body) {
		if (typeof body !== 'string' && !Buffer.isBuffer(body) && !isStream.readable(body)) {
			throw new GotError('options.body must be a ReadableStream, string or Buffer');
		}

		opts.method = opts.method || 'POST';

		if (!opts.headers['content-length'] && !opts.headers['transfer-encoding'] && !isStream.readable(body)) {
			var length = typeof body === 'string' ? Buffer.byteLength(body) : body.length;
			opts.headers['content-length'] = length;
		}
	}

	opts.method = opts.method || 'GET';

	// returns a proxy stream to the response
	// if no callback has been provided
	if (!cb) {
		proxy = duplexify();

		// forward errors on the stream
		cb = function (err, data, response) {
			proxy.emit('error', err, data, response);
		};
	}

	if (proxy && json) {
		throw new GotError('got can not be used as stream when options.json is used');
	}

	function get(opts, cb) {
		var fn = opts.protocol === 'https:' ? https : http;
		var url = urlLib.format(opts);

		if (opts.agent === undefined) {
			opts.agent = infinityAgent[fn === https ? 'https' : 'http'].globalAgent;

			if (process.version.indexOf('v0.10') === 0 && fn === https && (
				typeof opts.ca !== 'undefined' ||
				typeof opts.cert !== 'undefined' ||
				typeof opts.ciphers !== 'undefined' ||
				typeof opts.key !== 'undefined' ||
				typeof opts.passphrase !== 'undefined' ||
				typeof opts.pfx !== 'undefined' ||
				typeof opts.rejectUnauthorized !== 'undefined')) {
				opts.agent = new infinityAgent.https.Agent({
					ca: opts.ca,
					cert: opts.cert,
					ciphers: opts.ciphers,
					key: opts.key,
					passphrase: opts.passphrase,
					pfx: opts.pfx,
					rejectUnauthorized: opts.rejectUnauthorized
				});
			}
		}

		var req = fn.request(opts, function (response) {
			var statusCode = response.statusCode;
			var res = response;

			// auto-redirect only for GET and HEAD methods
			if (isRedirect(statusCode) && 'location' in res.headers && (opts.method === 'GET' || opts.method === 'HEAD')) {
				// discard response
				res.resume();

				if (++redirectCount > 10) {
					cb(new GotError('Redirected 10 times. Aborting.'), undefined, res);
					return;
				}

				var redirectUrl = urlLib.resolve(url, res.headers.location);
				var redirectOpts = objectAssign({}, opts, urlLib.parse(redirectUrl));

				if (opts.agent === infinityAgent.http.globalAgent && redirectOpts.protocol === 'https:' && opts.protocol === 'http:') {
					redirectOpts.agent = undefined;
				}

				if (proxy) {
					proxy.emit('redirect', res, redirectOpts);
				}

				get(redirectOpts, cb);
				return;
			}

			if (proxy) {
				proxy.emit('response', res);
			}

			if (['gzip', 'deflate'].indexOf(res.headers['content-encoding']) !== -1) {
				res = res.pipe(zlib.createUnzip());
			}

			if (statusCode < 200 || statusCode > 299) {
				readAllStream(res, encoding, function (err, data) {
					err = new GotError(opts.method + ' ' + url + ' response code is ' + statusCode + ' (' + http.STATUS_CODES[statusCode] + ')', err);
					err.code = statusCode;

					if (data && json) {
						try {
							data = JSON.parse(data);
						} catch (e) {
							err = new GotError('Parsing ' + url + ' response failed', new GotError(e.message, err));
						}
					}

					cb(err, data, response);
				});

				return;
			}

			// pipe the response to the proxy if in proxy mode
			if (proxy) {
				proxy.setReadable(res);
				return;
			}

			readAllStream(res, encoding, function (err, data) {
				if (err) {
					err = new GotError('Reading ' + url + ' response failed', err);
				} else if (json && statusCode !== 204) {
					// only parse json if the option is enabled, and the response
					// is not a 204 (empty reponse)
					try {
						data = JSON.parse(data);
					} catch (e) {
						err = new GotError('Parsing ' + url + ' response failed', e);
					}
				}

				cb(err, data, response);
			});
		}).once('error', function (err) {
			cb(new GotError('Request to ' + url + ' failed', err));
		});

		if (timeout) {
			timedOut(req, timeout);
		}

		if (!proxy) {
			if (isStream.readable(body)) {
				body.pipe(req);
			} else {
				req.end(body);
			}

			return;
		}

		if (body) {
			proxy.write = function () {
				throw new Error('got\'s stream is not writable when options.body is used');
			};

			if (isStream.readable(body)) {
				body.pipe(req);
			} else {
				req.end(body);
			}

			return;
		}

		if (opts.method === 'POST' || opts.method === 'PUT' || opts.method === 'PATCH') {
			proxy.setWritable(req);
			return;
		}

		req.end();
	}

	get(opts, cb);

	return proxy;
}

[
	'get',
	'post',
	'put',
	'patch',
	'head',
	'delete'
].forEach(function (el) {
	got[el] = function (url, opts, cb) {
		if (typeof opts === 'function') {
			cb = opts;
			opts = {};
		}

		return got(url, objectAssign({}, opts, {method: el.toUpperCase()}), cb);
	};
});

module.exports = got;

}).call(this,require('_process'),require("buffer").Buffer)
},{"_process":35,"buffer":14,"duplexify":71,"http":47,"https":18,"infinity-agent":91,"is-redirect":96,"is-stream":98,"lowercase-keys":100,"nested-error-stacks":103,"object-assign":85,"prepend-http":114,"querystring":39,"read-all-stream":116,"timed-out":129,"url":53,"util":57,"zlib":11}],85:[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],86:[function(require,module,exports){
module.exports = function hashMatch (hash, prefix) {
  var pre = prefix || '/';
  if (hash.length === 0) return pre;
  hash = hash.replace('#', '');
  hash = hash.replace(/\/$/, '')
  if (hash.indexOf('/') != 0) hash = '/' + hash;
  if (pre == '/') return hash;
  else return hash.replace(pre, '');
}

},{}],87:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],88:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12

module.exports = function (h, opts) {
  h = attrToProp(h)
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else cur[1][key] = concat(cur[1][key], parts[i][1])
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else cur[1][key] = concat(cur[1][key], parts[i][2])
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state)) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === TEXT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[\w-]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":87}],89:[function(require,module,exports){
(function (process){
'use strict';

var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var debug;

if (util.debuglog) {
  debug = util.debuglog('http');
} else {
  debug = function (x) {
    if (process.env.NODE_DEBUG && /http/.test(process.env.NODE_DEBUG)) {
      console.error('HTTP: %s', x);
    }
  };
}

// New Agent code.

// The largest departure from the previous implementation is that
// an Agent instance holds connections for a variable number of host:ports.
// Surprisingly, this is still API compatible as far as third parties are
// concerned. The only code that really notices the difference is the
// request object.

// Another departure is that all code related to HTTP parsing is in
// ClientRequest.onSocket(). The Agent is now *strictly*
// concerned with managing a connection pool.

function Agent(options) {
  if (!(this instanceof Agent))
    return new Agent(options);

  EventEmitter.call(this);

  var self = this;

  self.defaultPort = 80;
  self.protocol = 'http:';

  self.options = util._extend({}, options);

  // don't confuse net and make it think that we're connecting to a pipe
  self.options.path = null;
  self.requests = {};
  self.sockets = {};
  self.freeSockets = {};
  self.keepAliveMsecs = self.options.keepAliveMsecs || 1000;
  self.keepAlive = self.options.keepAlive || false;
  self.maxSockets = self.options.maxSockets || Agent.defaultMaxSockets;
  self.maxFreeSockets = self.options.maxFreeSockets || 256;

  self.on('free', function(socket, options) {
    var name = self.getName(options);
    debug('agent.on(free)', name);

    if (!socket.destroyed &&
        self.requests[name] && self.requests[name].length) {
      self.requests[name].shift().onSocket(socket);
      if (self.requests[name].length === 0) {
        // don't leak
        delete self.requests[name];
      }
    } else {
      // If there are no pending requests, then put it in
      // the freeSockets pool, but only if we're allowed to do so.
      var req = socket._httpMessage;
      if (req &&
          req.shouldKeepAlive &&
          !socket.destroyed &&
          self.options.keepAlive) {
        var freeSockets = self.freeSockets[name];
        var freeLen = freeSockets ? freeSockets.length : 0;
        var count = freeLen;
        if (self.sockets[name])
          count += self.sockets[name].length;

        if (count >= self.maxSockets || freeLen >= self.maxFreeSockets) {
          self.removeSocket(socket, options);
          socket.destroy();
        } else {
          freeSockets = freeSockets || [];
          self.freeSockets[name] = freeSockets;
          socket.setKeepAlive(true, self.keepAliveMsecs);
          socket.unref();
          socket._httpMessage = null;
          self.removeSocket(socket, options);
          freeSockets.push(socket);
        }
      } else {
        self.removeSocket(socket, options);
        socket.destroy();
      }
    }
  });
}

util.inherits(Agent, EventEmitter);
exports.Agent = Agent;

Agent.defaultMaxSockets = Infinity;

Agent.prototype.createConnection = net.createConnection;

// Get the key for a given set of request options
Agent.prototype.getName = function(options) {
  var name = '';

  if (options.host)
    name += options.host;
  else
    name += 'localhost';

  name += ':';
  if (options.port)
    name += options.port;
  name += ':';
  if (options.localAddress)
    name += options.localAddress;
  name += ':';
  return name;
};

Agent.prototype.addRequest = function(req, options) {
  // Legacy API: addRequest(req, host, port, path)
  if (typeof options === 'string') {
    options = {
      host: options,
      port: arguments[2],
      path: arguments[3]
    };
  }

  // If we are not keepAlive agent and maxSockets is Infinity
  // then disable shouldKeepAlive
  if (!this.keepAlive && !Number.isFinite(this.maxSockets)) {
    req._last = true;
    req.shouldKeepAlive = false;
  }

  var name = this.getName(options);
  if (!this.sockets[name]) {
    this.sockets[name] = [];
  }

  var freeLen = this.freeSockets[name] ? this.freeSockets[name].length : 0;
  var sockLen = freeLen + this.sockets[name].length;

  if (freeLen) {
    // we have a free socket, so use that.
    var socket = this.freeSockets[name].shift();
    debug('have free socket');

    // don't leak
    if (!this.freeSockets[name].length)
      delete this.freeSockets[name];

    socket.ref();
    req.onSocket(socket);
    this.sockets[name].push(socket);
  } else if (sockLen < this.maxSockets) {
    debug('call onSocket', sockLen, freeLen);
    // If we are under maxSockets create a new one.
    req.onSocket(this.createSocket(req, options));
  } else {
    debug('wait for socket');
    // We are over limit so we'll add it to the queue.
    if (!this.requests[name]) {
      this.requests[name] = [];
    }
    this.requests[name].push(req);
  }
};

Agent.prototype.createSocket = function(req, options) {
  var self = this;
  options = util._extend({}, options);
  options = util._extend(options, self.options);

  if (!options.servername) {
    options.servername = options.host;
    if (req) {
      var hostHeader = req.getHeader('host');
      if (hostHeader) {
        options.servername = hostHeader.replace(/:.*$/, '');
      }
    }
  }

  var name = self.getName(options);

  debug('createConnection', name, options);
  options.encoding = null;
  var s = self.createConnection(options);
  if (!self.sockets[name]) {
    self.sockets[name] = [];
  }
  this.sockets[name].push(s);
  debug('sockets', name, this.sockets[name].length);

  function onFree() {
    self.emit('free', s, options);
  }
  s.on('free', onFree);

  function onClose(err) {
    debug('CLIENT socket onClose');
    // This is the only place where sockets get removed from the Agent.
    // If you want to remove a socket from the pool, just close it.
    // All socket errors end in a close event anyway.
    self.removeSocket(s, options);
  }
  s.on('close', onClose);

  function onRemove() {
    // We need this function for cases like HTTP 'upgrade'
    // (defined by WebSockets) where we need to remove a socket from the
    // pool because it'll be locked up indefinitely
    debug('CLIENT socket onRemove');
    self.removeSocket(s, options);
    s.removeListener('close', onClose);
    s.removeListener('free', onFree);
    s.removeListener('agentRemove', onRemove);
  }
  s.on('agentRemove', onRemove);
  return s;
};

Agent.prototype.removeSocket = function(s, options) {
  var name = this.getName(options);
  debug('removeSocket', name, 'destroyed:', s.destroyed);
  var sets = [this.sockets];

  // If the socket was destroyed, remove it from the free buffers too.
  if (s.destroyed)
    sets.push(this.freeSockets);

  for (var sk = 0; sk < sets.length; sk++) {
    var sockets = sets[sk];

    if (sockets[name]) {
      var index = sockets[name].indexOf(s);
      if (index !== -1) {
        sockets[name].splice(index, 1);
        // Don't leak
        if (sockets[name].length === 0)
          delete sockets[name];
      }
    }
  }

  if (this.requests[name] && this.requests[name].length) {
    debug('removeSocket, have a request, make a socket');
    var req = this.requests[name][0];
    // If we have pending requests and a socket gets closed make a new one
    this.createSocket(req, options).emit('free');
  }
};

Agent.prototype.destroy = function() {
  var sets = [this.freeSockets, this.sockets];
  for (var s = 0; s < sets.length; s++) {
    var set = sets[s];
    var keys = Object.keys(set);
    for (var v = 0; v < keys.length; v++) {
      var setName = set[keys[v]];
      for (var n = 0; n < setName.length; n++) {
        setName[n].destroy();
      }
    }
  }
};

exports.globalAgent = new Agent();

}).call(this,require('_process'))
},{"_process":35,"events":17,"net":12,"util":57}],90:[function(require,module,exports){
(function (process){
'use strict';

var tls = require('tls');
var http = require('./http.js');
var util = require('util');
var inherits = util.inherits;

var debug;

if (util.debuglog) {
  debug = util.debuglog('https');
} else {
  debug = function (x) {
    if (process.env.NODE_DEBUG && /http/.test(process.env.NODE_DEBUG)) {
      console.error('HTTPS: %s', x);
    }
  };
}
function createConnection(port, host, options) {
  if (port !== null && typeof port === 'object') {
    options = port;
  } else if (host !== null && typeof host === 'object') {
    options = host;
  } else if (options === null || typeof options !== 'object') {
    options = {};
  }

  if (typeof port === 'number') {
    options.port = port;
  }

  if (typeof host === 'string') {
    options.host = host;
  }

  debug('createConnection', options);
  return tls.connect(options);
}


function Agent(options) {
  http.Agent.call(this, options);
  this.defaultPort = 443;
  this.protocol = 'https:';
}
inherits(Agent, http.Agent);
Agent.prototype.createConnection = createConnection;

Agent.prototype.getName = function(options) {
  var name = http.Agent.prototype.getName.call(this, options);

  name += ':';
  if (options.ca)
    name += options.ca;

  name += ':';
  if (options.cert)
    name += options.cert;

  name += ':';
  if (options.ciphers)
    name += options.ciphers;

  name += ':';
  if (options.key)
    name += options.key;

  name += ':';
  if (options.pfx)
    name += options.pfx;

  name += ':';
  if (options.rejectUnauthorized !== undefined)
    name += options.rejectUnauthorized;

  return name;
};

var globalAgent = new Agent();

exports.globalAgent = globalAgent;
exports.Agent = Agent;

}).call(this,require('_process'))
},{"./http.js":89,"_process":35,"tls":12,"util":57}],91:[function(require,module,exports){
'use strict';

exports.http = require('./http.js');
exports.https = require('./https.js');

},{"./http.js":89,"./https.js":90}],92:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],93:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],94:[function(require,module,exports){
'use strict';

module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && obj.splice instanceof Function);
};

},{}],95:[function(require,module,exports){
'use strict';
var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};

},{}],96:[function(require,module,exports){
'use strict';
module.exports = function (x) {
	if (typeof x !== 'number') {
		throw new TypeError('Expected a number');
	}

	return x === 300 ||
		x === 301 ||
		x === 302 ||
		x === 303 ||
		x === 305 ||
		x === 307 ||
		x === 308;
};

},{}],97:[function(require,module,exports){
'use strict';

var WHITELIST = [
	'ETIMEDOUT',
	'ECONNRESET',
	'EADDRINUSE',
	'ESOCKETTIMEDOUT',
	'ECONNREFUSED',
	'EPIPE'
];

var BLACKLIST = [
	'ENOTFOUND',
	'ENETUNREACH',

	// SSL errors from https://github.com/nodejs/node/blob/ed3d8b13ee9a705d89f9e0397d9e96519e7e47ac/src/node_crypto.cc#L1950
	'UNABLE_TO_GET_ISSUER_CERT',
	'UNABLE_TO_GET_CRL',
	'UNABLE_TO_DECRYPT_CERT_SIGNATURE',
	'UNABLE_TO_DECRYPT_CRL_SIGNATURE',
	'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY',
	'CERT_SIGNATURE_FAILURE',
	'CRL_SIGNATURE_FAILURE',
	'CERT_NOT_YET_VALID',
	'CERT_HAS_EXPIRED',
	'CRL_NOT_YET_VALID',
	'CRL_HAS_EXPIRED',
	'ERROR_IN_CERT_NOT_BEFORE_FIELD',
	'ERROR_IN_CERT_NOT_AFTER_FIELD',
	'ERROR_IN_CRL_LAST_UPDATE_FIELD',
	'ERROR_IN_CRL_NEXT_UPDATE_FIELD',
	'OUT_OF_MEM',
	'DEPTH_ZERO_SELF_SIGNED_CERT',
	'SELF_SIGNED_CERT_IN_CHAIN',
	'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
	'CERT_CHAIN_TOO_LONG',
	'CERT_REVOKED',
	'INVALID_CA',
	'PATH_LENGTH_EXCEEDED',
	'INVALID_PURPOSE',
	'CERT_UNTRUSTED',
	'CERT_REJECTED'
];

module.exports = function (err) {
	if (!err || !err.code) {
		return true;
	}

	if (WHITELIST.indexOf(err.code) !== -1) {
		return true;
	}

	if (BLACKLIST.indexOf(err.code) !== -1) {
		return false;
	}

	return true;
};

},{}],98:[function(require,module,exports){
'use strict';

var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};

},{}],99:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],100:[function(require,module,exports){
'use strict';
module.exports = function (obj) {
	var ret = {};
	var keys = Object.keys(Object(obj));

	for (var i = 0; i < keys.length; i++) {
		ret[keys[i].toLowerCase()] = obj[keys[i]];
	}

	return ret;
};

},{}],101:[function(require,module,exports){
// Create a range object for efficently rendering strings to elements.
var range;

var testEl = (typeof document !== 'undefined') ?
    document.body || document.createElement('div') :
    {};

var XHTML = 'http://www.w3.org/1999/xhtml';
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
var hasAttributeNS;

if (testEl.hasAttributeNS) {
    hasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttributeNS(namespaceURI, name);
    };
} else if (testEl.hasAttribute) {
    hasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttribute(name);
    };
} else {
    hasAttributeNS = function(el, namespaceURI, name) {
        return !!el.getAttributeNode(name);
    };
}

function empty(o) {
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            return false;
        }
    }
    return true;
}

function toElement(str) {
    if (!range && document.createRange) {
        range = document.createRange();
        range.selectNode(document.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = document.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think that "selected" is an
     * attribute when reading over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        fromEl.selected = toEl.selected;
        if (fromEl.selected) {
            fromEl.setAttribute('selected', '');
        } else {
            fromEl.removeAttribute('selected', '');
        }
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        fromEl.checked = toEl.checked;
        if (fromEl.checked) {
            fromEl.setAttribute('checked', '');
        } else {
            fromEl.removeAttribute('checked');
        }

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttributeNS(toEl, null, 'value')) {
            fromEl.removeAttribute('value');
        }

        fromEl.disabled = toEl.disabled;
        if (fromEl.disabled) {
            fromEl.setAttribute('disabled', '');
        } else {
            fromEl.removeAttribute('disabled');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        if (fromEl.firstChild) {
            fromEl.firstChild.nodeValue = newValue;
        }
    }
};

function noop() {}

/**
 * Returns true if two node's names and namespace URIs are the same.
 *
 * @param {Element} a
 * @param {Element} b
 * @return {boolean}
 */
var compareNodeNames = function(a, b) {
    return a.nodeName === b.nodeName &&
           a.namespaceURI === b.namespaceURI;
};

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === XHTML ?
        document.createElement(name) :
        document.createElementNS(namespaceURI, name);
}

/**
 * Loop over all of the attributes on the target node and make sure the original
 * DOM node has the same attributes. If an attribute found on the original node
 * is not on the new node then remove it from the original node.
 *
 * @param  {Element} fromNode
 * @param  {Element} toNode
 */
function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    for (i = attrs.length - 1; i >= 0; i--) {
        attr = attrs[i];
        attrName = attr.name;
        attrValue = attr.value;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        } else {
            fromValue = fromNode.getAttribute(attrName);
        }

        if (fromValue !== attrValue) {
            if (attrNamespaceURI) {
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            } else {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    attrs = fromNode.attributes;

    for (i = attrs.length - 1; i >= 0; i--) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (!hasAttributeNS(toNode, attrNamespaceURI, attrNamespaceURI ? attrName = attr.localName || attrName : attrName)) {
                if (attrNamespaceURI) {
                    fromNode.removeAttributeNS(attrNamespaceURI, attr.localName);
                } else {
                    fromNode.removeAttribute(attrName);
                }
            }
        }
    }
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdom(fromNode, toNode, options) {
    if (!options) {
        options = {};
    }

    if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
            var toNodeHtml = toNode;
            toNode = document.createElement('html');
            toNode.innerHTML = toNodeHtml;
        } else {
            toNode = toElement(toNode);
        }
    }

    // XXX optimization: if the nodes are equal, don't morph them
    /*
    if (fromNode.isEqualNode(toNode)) {
      return fromNode;
    }
    */

    var savedEls = {}; // Used to save off DOM elements with IDs
    var unmatchedEls = {};
    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || options.onBeforeMorphEl || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || options.onBeforeMorphElChildren || noop;
    var childrenOnly = options.childrenOnly === true;
    var movedEls = [];

    function removeNodeHelper(node, nestedInSavedEl) {
        var id = getNodeKey(node);
        // If the node has an ID then save it off since we will want
        // to reuse it in case the target DOM tree has a DOM element
        // with the same ID
        if (id) {
            savedEls[id] = node;
        } else if (!nestedInSavedEl) {
            // If we are not nested in a saved element then we know that this node has been
            // completely discarded and will not exist in the final DOM.
            onNodeDiscarded(node);
        }

        if (node.nodeType === ELEMENT_NODE) {
            var curChild = node.firstChild;
            while (curChild) {
                removeNodeHelper(curChild, nestedInSavedEl || id);
                curChild = curChild.nextSibling;
            }
        }
    }

    function walkDiscardedChildNodes(node) {
        if (node.nodeType === ELEMENT_NODE) {
            var curChild = node.firstChild;
            while (curChild) {


                if (!getNodeKey(curChild)) {
                    // We only want to handle nodes that don't have an ID to avoid double
                    // walking the same saved element.

                    onNodeDiscarded(curChild);

                    // Walk recursively
                    walkDiscardedChildNodes(curChild);
                }

                curChild = curChild.nextSibling;
            }
        }
    }

    function removeNode(node, parentNode, alreadyVisited) {
        if (onBeforeNodeDiscarded(node) === false) {
            return;
        }

        parentNode.removeChild(node);
        if (alreadyVisited) {
            if (!getNodeKey(node)) {
                onNodeDiscarded(node);
                walkDiscardedChildNodes(node);
            }
        } else {
            removeNodeHelper(node);
        }
    }

    function morphEl(fromEl, toEl, alreadyVisited, childrenOnly) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
            // If an element with an ID is being morphed then it is will be in the final
            // DOM so clear it out of the saved elements collection
            delete savedEls[toElKey];
        }

        if (!childrenOnly) {
            if (onBeforeElUpdated(fromEl, toEl) === false) {
                return;
            }

            morphAttrs(fromEl, toEl);
            onElUpdated(fromEl);

            if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                return;
            }
        }

        if (fromEl.nodeName !== 'TEXTAREA') {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeId;

            var fromNextSibling;
            var toNextSibling;
            var savedEl;
            var unmatchedEl;

            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeId = getNodeKey(curToNodeChild);

                while (curFromNodeChild) {
                    var curFromNodeId = getNodeKey(curFromNodeChild);
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (!alreadyVisited) {
                        if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
                            unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl);
                            morphEl(curFromNodeChild, unmatchedEl, alreadyVisited);
                            curFromNodeChild = fromNextSibling;
                            continue;
                        }
                    }

                    var curFromNodeType = curFromNodeChild.nodeType;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        var isCompatible = false;

                        // Both nodes being compared are Element nodes
                        if (curFromNodeType === ELEMENT_NODE) {
                            if (compareNodeNames(curFromNodeChild, curToNodeChild)) {
                                // We have compatible DOM elements
                                if (curFromNodeId || curToNodeId) {
                                    // If either DOM element has an ID then we
                                    // handle those differently since we want to
                                    // match up by ID
                                    if (curToNodeId === curFromNodeId) {
                                        isCompatible = true;
                                    }
                                } else {
                                    isCompatible = true;
                                }
                            }

                            if (isCompatible) {
                                // We found compatible DOM elements so transform
                                // the current "from" node to match the current
                                // target DOM node.
                                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited);
                            }
                        // Both nodes being compared are Text or Comment nodes
                    } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            isCompatible = true;
                            // Simply update nodeValue on the original node to
                            // change the text value
                            curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                        }

                        if (isCompatible) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }
                    }

                    // No compatible match so remove the old node from the DOM
                    // and continue trying to find a match in the original DOM
                    removeNode(curFromNodeChild, fromEl, alreadyVisited);
                    curFromNodeChild = fromNextSibling;
                }

                if (curToNodeId) {
                    if ((savedEl = savedEls[curToNodeId])) {
                        if (compareNodeNames(savedEl, curToNodeChild)) {
                            morphEl(savedEl, curToNodeChild, true);
                            // We want to append the saved element instead
                            curToNodeChild = savedEl;
                        } else {
                            delete savedEls[curToNodeId];
                            onNodeDiscarded(savedEl);
                        }
                    } else {
                        // The current DOM element in the target tree has an ID
                        // but we did not find a match in any of the
                        // corresponding siblings. We just put the target
                        // element in the old DOM tree but if we later find an
                        // element in the old DOM tree that has a matching ID
                        // then we will replace the target element with the
                        // corresponding old element and morph the old element
                        unmatchedEls[curToNodeId] = curToNodeChild;
                    }
                }

                // If we got this far then we did not find a candidate match for
                // our "to node" and we exhausted all of the children "from"
                // nodes. Therefore, we will just append the current "to node"
                // to the end
                if (onBeforeNodeAdded(curToNodeChild) !== false) {
                    fromEl.appendChild(curToNodeChild);
                    onNodeAdded(curToNodeChild);
                }

                if (curToNodeChild.nodeType === ELEMENT_NODE &&
                    (curToNodeId || curToNodeChild.firstChild)) {
                    // The element that was just added to the original DOM may
                    // have some nested elements with a key/ID that needs to be
                    // matched up with other elements. We'll add the element to
                    // a list so that we can later process the nested elements
                    // if there are any unmatched keyed elements that were
                    // discarded
                    movedEls.push(curToNodeChild);
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            // We have processed all of the "to nodes". If curFromNodeChild is
            // non-null then we still have some from nodes left over that need
            // to be removed
            while (curFromNodeChild) {
                fromNextSibling = curFromNodeChild.nextSibling;
                removeNode(curFromNodeChild, fromEl, alreadyVisited);
                curFromNodeChild = fromNextSibling;
            }
        }

        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
            specialElHandler(fromEl, toEl);
        }
    } // END: morphEl(...)

    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;

    if (!childrenOnly) {
        // Handle the case where we are given two DOM nodes that are not
        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
        if (morphedNodeType === ELEMENT_NODE) {
            if (toNodeType === ELEMENT_NODE) {
                if (!compareNodeNames(fromNode, toNode)) {
                    onNodeDiscarded(fromNode);
                    morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                }
            } else {
                // Going from an element node to a text node
                morphedNode = toNode;
            }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
            if (toNodeType === morphedNodeType) {
                morphedNode.nodeValue = toNode.nodeValue;
                return morphedNode;
            } else {
                // Text node to something else
                morphedNode = toNode;
            }
        }
    }

    if (morphedNode === toNode) {
        // The "to node" was not compatible with the "from node" so we had to
        // toss out the "from node" and use the "to node"
        onNodeDiscarded(fromNode);
    } else {
        morphEl(morphedNode, toNode, false, childrenOnly);

        /**
         * What we will do here is walk the tree for the DOM element that was
         * moved from the target DOM tree to the original DOM tree and we will
         * look for keyed elements that could be matched to keyed elements that
         * were earlier discarded.  If we find a match then we will move the
         * saved element into the final DOM tree.
         */
        var handleMovedEl = function(el) {
            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var savedEl = savedEls[key];
                    if (savedEl && compareNodeNames(curChild, savedEl)) {
                        curChild.parentNode.replaceChild(savedEl, curChild);
                        // true: already visited the saved el tree
                        morphEl(savedEl, curChild, true);
                        curChild = nextSibling;
                        if (empty(savedEls)) {
                            return false;
                        }
                        continue;
                    }
                }

                if (curChild.nodeType === ELEMENT_NODE) {
                    handleMovedEl(curChild);
                }

                curChild = nextSibling;
            }
        };

        // The loop below is used to possibly match up any discarded
        // elements in the original DOM tree with elemenets from the
        // target tree that were moved over without visiting their
        // children
        if (!empty(savedEls)) {
            handleMovedElsLoop:
            while (movedEls.length) {
                var movedElsTemp = movedEls;
                movedEls = [];
                for (var i=0; i<movedElsTemp.length; i++) {
                    if (handleMovedEl(movedElsTemp[i]) === false) {
                        // There are no more unmatched elements so completely end
                        // the loop
                        break handleMovedElsLoop;
                    }
                }
            }
        }

        // Fire the "onNodeDiscarded" event for any saved elements
        // that never found a new home in the morphed DOM
        for (var savedElId in savedEls) {
            if (savedEls.hasOwnProperty(savedElId)) {
                var savedEl = savedEls[savedElId];
                onNodeDiscarded(savedEl);
                walkDiscardedChildNodes(savedEl);
            }
        }
    }

    if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        // If we had to swap out the from node with a new node because the old
        // node was not compatible with the target node then we need to
        // replace the old DOM node in the original DOM tree. This is only
        // possible if the original DOM node was part of a DOM tree which
        // we know is the case if it has a parent node.
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }

    return morphedNode;
}

module.exports = morphdom;

},{}],102:[function(require,module,exports){
const window = require('global/window')
const assert = require('assert')

module.exports = nanoraf

// Only call RAF when needed
// (fn, fn?) -> fn
function nanoraf (render, raf) {
  assert.equal(typeof render, 'function', 'nanoraf: render should be a function')
  assert.ok(typeof raf === 'function' || typeof raf === 'undefined', 'nanoraf: raf should be a function or undefined')

  if (!raf) { raf = window.requestAnimationFrame }

  var inRenderingTransaction = false
  var redrawScheduled = false
  var currentState = null

  // pass new state to be rendered
  // (obj, obj?) -> null
  return function frame (state, prev) {
    assert.equal(typeof state, 'object', 'nanoraf: state should be an object')
    assert.equal(typeof prev, 'object', 'nanoraf: prev should be an object')
    assert.equal(inRenderingTransaction, false, 'nanoraf: infinite loop detected')

    // request a redraw for next frame
    if (currentState === null && !redrawScheduled) {
      redrawScheduled = true

      raf(function redraw () {
        redrawScheduled = false
        if (!currentState) return

        inRenderingTransaction = true
        render(currentState, prev)
        inRenderingTransaction = false

        currentState = null
      })
    }

    // update data for redraw
    currentState = state
  }
}

},{"assert":7,"global/window":83}],103:[function(require,module,exports){
var inherits = require('inherits');

var NestedError = function (message, nested) {
    this.nested = nested;

    Error.captureStackTrace(this, this.constructor);

    var oldStackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');

    if (typeof message !== 'undefined') {
        Object.defineProperty(this, 'message', {
            value: message,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }

    Object.defineProperties(this, {
        stack: {
            get: function () {
                var stack = oldStackDescriptor.get.call(this);
                if (this.nested) {
                    stack += '\nCaused By: ' + this.nested.stack;
                }
                return stack;
            }
        }

    });
};

inherits(NestedError, Error);
NestedError.prototype.name = 'NestedError';


module.exports = NestedError;

},{"inherits":92}],104:[function(require,module,exports){
'use strict';

// https://github.com/nodejs/io.js/commit/8be6060020
module.exports = {
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	203: 'Non-Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi-Status',
	300: 'Multiple Choices',
	301: 'Moved Permanently',
	302: 'Moved Temporarily',
	303: 'See Other',
	304: 'Not Modified',
	305: 'Use Proxy',
	307: 'Temporary Redirect',
	308: 'Permanent Redirect',
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Time-out',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Request Entity Too Large',
	414: 'Request-URI Too Large',
	415: 'Unsupported Media Type',
	416: 'Requested Range Not Satisfiable',
	417: 'Expectation Failed',
	418: 'I\'m a teapot',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	425: 'Unordered Collection',
	426: 'Upgrade Required',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	431: 'Request Header Fields Too Large',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Time-out',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',
	507: 'Insufficient Storage',
	509: 'Bandwidth Limit Exceeded',
	510: 'Not Extended',
	511: 'Network Authentication Required'
};

},{}],105:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],106:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"global/document":82,"global/window":83}],107:[function(require,module,exports){
var wrappy = require('wrappy')
module.exports = wrappy(once)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

},{"wrappy":134}],108:[function(require,module,exports){
'use strict';
var errorEx = require('error-ex');
var fallback = require('./vendor/parse');

var JSONError = errorEx('JSONError', {
	fileName: errorEx.append('in %s')
});

module.exports = function (x, reviver, filename) {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = null;
	}

	try {
		try {
			return JSON.parse(x, reviver);
		} catch (err) {
			fallback.parse(x, {
				mode: 'json',
				reviver: reviver
			});

			throw err;
		}
	} catch (err) {
		var jsonErr = new JSONError(err);

		if (filename) {
			jsonErr.fileName = filename;
		}

		throw jsonErr;
	}
};

},{"./vendor/parse":109,"error-ex":74}],109:[function(require,module,exports){
/*
 * Author: Alex Kocharin <alex@kocharin.ru>
 * GIT: https://github.com/rlidwka/jju
 * License: WTFPL, grab your copy here: http://www.wtfpl.net/txt/copying/
 */

// RTFM: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf

var Uni = require('./unicode')

function isHexDigit(x) {
  return (x >= '0' && x <= '9')
      || (x >= 'A' && x <= 'F')
      || (x >= 'a' && x <= 'f')
}

function isOctDigit(x) {
  return x >= '0' && x <= '7'
}

function isDecDigit(x) {
  return x >= '0' && x <= '9'
}

var unescapeMap = {
  '\'': '\'',
  '"' : '"',
  '\\': '\\',
  'b' : '\b',
  'f' : '\f',
  'n' : '\n',
  'r' : '\r',
  't' : '\t',
  'v' : '\v',
  '/' : '/',
}

function formatError(input, msg, position, lineno, column, json5) {
  var result = msg + ' at ' + (lineno + 1) + ':' + (column + 1)
    , tmppos = position - column - 1
    , srcline = ''
    , underline = ''

  var isLineTerminator = json5 ? Uni.isLineTerminator : Uni.isLineTerminatorJSON

  // output no more than 70 characters before the wrong ones
  if (tmppos < position - 70) {
    tmppos = position - 70
  }

  while (1) {
    var chr = input[++tmppos]

    if (isLineTerminator(chr) || tmppos === input.length) {
      if (position >= tmppos) {
        // ending line error, so show it after the last char
        underline += '^'
      }
      break
    }
    srcline += chr

    if (position === tmppos) {
      underline += '^'
    } else if (position > tmppos) {
      underline += input[tmppos] === '\t' ? '\t' : ' '
    }

    // output no more than 78 characters on the string
    if (srcline.length > 78) break
  }

  return result + '\n' + srcline + '\n' + underline
}

function parse(input, options) {
  // parse as a standard JSON mode
  var json5 = !(options.mode === 'json' || options.legacy)
  var isLineTerminator = json5 ? Uni.isLineTerminator : Uni.isLineTerminatorJSON
  var isWhiteSpace = json5 ? Uni.isWhiteSpace : Uni.isWhiteSpaceJSON

  var length = input.length
    , lineno = 0
    , linestart = 0
    , position = 0
    , stack = []

  var tokenStart = function() {}
  var tokenEnd = function(v) {return v}

  /* tokenize({
       raw: '...',
       type: 'whitespace'|'comment'|'key'|'literal'|'separator'|'newline',
       value: 'number'|'string'|'whatever',
       path: [...],
     })
  */
  if (options._tokenize) {
    ;(function() {
      var start = null
      tokenStart = function() {
        if (start !== null) throw Error('internal error, token overlap')
        start = position
      }

      tokenEnd = function(v, type) {
        if (start != position) {
          var hash = {
            raw: input.substr(start, position-start),
            type: type,
            stack: stack.slice(0),
          }
          if (v !== undefined) hash.value = v
          options._tokenize.call(null, hash)
        }
        start = null
        return v
      }
    })()
  }

  function fail(msg) {
    var column = position - linestart

    if (!msg) {
      if (position < length) {
        var token = '\'' +
          JSON
            .stringify(input[position])
            .replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
          + '\''

        if (!msg) msg = 'Unexpected token ' + token
      } else {
        if (!msg) msg = 'Unexpected end of input'
      }
    }

    var error = SyntaxError(formatError(input, msg, position, lineno, column, json5))
    error.row = lineno + 1
    error.column = column + 1
    throw error
  }

  function newline(chr) {
    // account for <cr><lf>
    if (chr === '\r' && input[position] === '\n') position++
    linestart = position
    lineno++
  }

  function parseGeneric() {
    var result

    while (position < length) {
      tokenStart()
      var chr = input[position++]

      if (chr === '"' || (chr === '\'' && json5)) {
        return tokenEnd(parseString(chr), 'literal')

      } else if (chr === '{') {
        tokenEnd(undefined, 'separator')
        return parseObject()

      } else if (chr === '[') {
        tokenEnd(undefined, 'separator')
        return parseArray()

      } else if (chr === '-'
             ||  chr === '.'
             ||  isDecDigit(chr)
                 //           + number       Infinity          NaN
             ||  (json5 && (chr === '+' || chr === 'I' || chr === 'N'))
      ) {
        return tokenEnd(parseNumber(), 'literal')

      } else if (chr === 'n') {
        parseKeyword('null')
        return tokenEnd(null, 'literal')

      } else if (chr === 't') {
        parseKeyword('true')
        return tokenEnd(true, 'literal')

      } else if (chr === 'f') {
        parseKeyword('false')
        return tokenEnd(false, 'literal')

      } else {
        position--
        return tokenEnd(undefined)
      }
    }
  }

  function parseKey() {
    var result

    while (position < length) {
      tokenStart()
      var chr = input[position++]

      if (chr === '"' || (chr === '\'' && json5)) {
        return tokenEnd(parseString(chr), 'key')

      } else if (chr === '{') {
        tokenEnd(undefined, 'separator')
        return parseObject()

      } else if (chr === '[') {
        tokenEnd(undefined, 'separator')
        return parseArray()

      } else if (chr === '.'
             ||  isDecDigit(chr)
      ) {
        return tokenEnd(parseNumber(true), 'key')

      } else if (json5
             &&  Uni.isIdentifierStart(chr) || (chr === '\\' && input[position] === 'u')) {
        // unicode char or a unicode sequence
        var rollback = position - 1
        var result = parseIdentifier()

        if (result === undefined) {
          position = rollback
          return tokenEnd(undefined)
        } else {
          return tokenEnd(result, 'key')
        }

      } else {
        position--
        return tokenEnd(undefined)
      }
    }
  }

  function skipWhiteSpace() {
    tokenStart()
    while (position < length) {
      var chr = input[position++]

      if (isLineTerminator(chr)) {
        position--
        tokenEnd(undefined, 'whitespace')
        tokenStart()
        position++
        newline(chr)
        tokenEnd(undefined, 'newline')
        tokenStart()

      } else if (isWhiteSpace(chr)) {
        // nothing

      } else if (chr === '/'
             && json5
             && (input[position] === '/' || input[position] === '*')
      ) {
        position--
        tokenEnd(undefined, 'whitespace')
        tokenStart()
        position++
        skipComment(input[position++] === '*')
        tokenEnd(undefined, 'comment')
        tokenStart()

      } else {
        position--
        break
      }
    }
    return tokenEnd(undefined, 'whitespace')
  }

  function skipComment(multi) {
    while (position < length) {
      var chr = input[position++]

      if (isLineTerminator(chr)) {
        // LineTerminator is an end of singleline comment
        if (!multi) {
          // let parent function deal with newline
          position--
          return
        }

        newline(chr)

      } else if (chr === '*' && multi) {
        // end of multiline comment
        if (input[position] === '/') {
          position++
          return
        }

      } else {
        // nothing
      }
    }

    if (multi) {
      fail('Unclosed multiline comment')
    }
  }

  function parseKeyword(keyword) {
    // keyword[0] is not checked because it should've checked earlier
    var _pos = position
    var len = keyword.length
    for (var i=1; i<len; i++) {
      if (position >= length || keyword[i] != input[position]) {
        position = _pos-1
        fail()
      }
      position++
    }
  }

  function parseObject() {
    var result = options.null_prototype ? Object.create(null) : {}
      , empty_object = {}
      , is_non_empty = false

    while (position < length) {
      skipWhiteSpace()
      var item1 = parseKey()
      skipWhiteSpace()
      tokenStart()
      var chr = input[position++]
      tokenEnd(undefined, 'separator')

      if (chr === '}' && item1 === undefined) {
        if (!json5 && is_non_empty) {
          position--
          fail('Trailing comma in object')
        }
        return result

      } else if (chr === ':' && item1 !== undefined) {
        skipWhiteSpace()
        stack.push(item1)
        var item2 = parseGeneric()
        stack.pop()

        if (item2 === undefined) fail('No value found for key ' + item1)
        if (typeof(item1) !== 'string') {
          if (!json5 || typeof(item1) !== 'number') {
            fail('Wrong key type: ' + item1)
          }
        }

        if ((item1 in empty_object || empty_object[item1] != null) && options.reserved_keys !== 'replace') {
          if (options.reserved_keys === 'throw') {
            fail('Reserved key: ' + item1)
          } else {
            // silently ignore it
          }
        } else {
          if (typeof(options.reviver) === 'function') {
            item2 = options.reviver.call(null, item1, item2)
          }

          if (item2 !== undefined) {
            is_non_empty = true
            Object.defineProperty(result, item1, {
              value: item2,
              enumerable: true,
              configurable: true,
              writable: true,
            })
          }
        }

        skipWhiteSpace()

        tokenStart()
        var chr = input[position++]
        tokenEnd(undefined, 'separator')

        if (chr === ',') {
          continue

        } else if (chr === '}') {
          return result

        } else {
          fail()
        }

      } else {
        position--
        fail()
      }
    }

    fail()
  }

  function parseArray() {
    var result = []

    while (position < length) {
      skipWhiteSpace()
      stack.push(result.length)
      var item = parseGeneric()
      stack.pop()
      skipWhiteSpace()
      tokenStart()
      var chr = input[position++]
      tokenEnd(undefined, 'separator')

      if (item !== undefined) {
        if (typeof(options.reviver) === 'function') {
          item = options.reviver.call(null, String(result.length), item)
        }
        if (item === undefined) {
          result.length++
          item = true // hack for check below, not included into result
        } else {
          result.push(item)
        }
      }

      if (chr === ',') {
        if (item === undefined) {
          fail('Elisions are not supported')
        }

      } else if (chr === ']') {
        if (!json5 && item === undefined && result.length) {
          position--
          fail('Trailing comma in array')
        }
        return result

      } else {
        position--
        fail()
      }
    }
  }

  function parseNumber() {
    // rewind because we don't know first char
    position--

    var start = position
      , chr = input[position++]
      , t

    var to_num = function(is_octal) {
      var str = input.substr(start, position - start)

      if (is_octal) {
        var result = parseInt(str.replace(/^0o?/, ''), 8)
      } else {
        var result = Number(str)
      }

      if (Number.isNaN(result)) {
        position--
        fail('Bad numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else if (!json5 && !str.match(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?(e[+-]?[0-9]+)?$/i)) {
        // additional restrictions imposed by json
        position--
        fail('Non-json numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else {
        return result
      }
    }

    // ex: -5982475.249875e+29384
    //     ^ skipping this
    if (chr === '-' || (chr === '+' && json5)) chr = input[position++]

    if (chr === 'N' && json5) {
      parseKeyword('NaN')
      return NaN
    }

    if (chr === 'I' && json5) {
      parseKeyword('Infinity')

      // returning +inf or -inf
      return to_num()
    }

    if (chr >= '1' && chr <= '9') {
      // ex: -5982475.249875e+29384
      //        ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // special case for leading zero: 0.123456
    if (chr === '0') {
      chr = input[position++]

      //             new syntax, "0o777"           old syntax, "0777"
      var is_octal = chr === 'o' || chr === 'O' || isOctDigit(chr)
      var is_hex = chr === 'x' || chr === 'X'

      if (json5 && (is_octal || is_hex)) {
        while (position < length
           &&  (is_hex ? isHexDigit : isOctDigit)( input[position] )
        ) position++

        var sign = 1
        if (input[start] === '-') {
          sign = -1
          start++
        } else if (input[start] === '+') {
          start++
        }

        return sign * to_num(is_octal)
      }
    }

    if (chr === '.') {
      // ex: -5982475.249875e+29384
      //                ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    if (chr === 'e' || chr === 'E') {
      chr = input[position++]
      if (chr === '-' || chr === '+') position++
      // ex: -5982475.249875e+29384
      //                       ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // we have char in the buffer, so count for it
    position--
    return to_num()
  }

  function parseIdentifier() {
    // rewind because we don't know first char
    position--

    var result = ''

    while (position < length) {
      var chr = input[position++]

      if (chr === '\\'
      &&  input[position] === 'u'
      &&  isHexDigit(input[position+1])
      &&  isHexDigit(input[position+2])
      &&  isHexDigit(input[position+3])
      &&  isHexDigit(input[position+4])
      ) {
        // UnicodeEscapeSequence
        chr = String.fromCharCode(parseInt(input.substr(position+1, 4), 16))
        position += 5
      }

      if (result.length) {
        // identifier started
        if (Uni.isIdentifierPart(chr)) {
          result += chr
        } else {
          position--
          return result
        }

      } else {
        if (Uni.isIdentifierStart(chr)) {
          result += chr
        } else {
          return undefined
        }
      }
    }

    fail()
  }

  function parseString(endChar) {
    // 7.8.4 of ES262 spec
    var result = ''

    while (position < length) {
      var chr = input[position++]

      if (chr === endChar) {
        return result

      } else if (chr === '\\') {
        if (position >= length) fail()
        chr = input[position++]

        if (unescapeMap[chr] && (json5 || (chr != 'v' && chr != "'"))) {
          result += unescapeMap[chr]

        } else if (json5 && isLineTerminator(chr)) {
          // line continuation
          newline(chr)

        } else if (chr === 'u' || (chr === 'x' && json5)) {
          // unicode/character escape sequence
          var off = chr === 'u' ? 4 : 2

          // validation for \uXXXX
          for (var i=0; i<off; i++) {
            if (position >= length) fail()
            if (!isHexDigit(input[position])) fail('Bad escape sequence')
            position++
          }

          result += String.fromCharCode(parseInt(input.substr(position-off, off), 16))
        } else if (json5 && isOctDigit(chr)) {
          if (chr < '4' && isOctDigit(input[position]) && isOctDigit(input[position+1])) {
            // three-digit octal
            var digits = 3
          } else if (isOctDigit(input[position])) {
            // two-digit octal
            var digits = 2
          } else {
            var digits = 1
          }
          position += digits - 1
          result += String.fromCharCode(parseInt(input.substr(position-digits, digits), 8))
          /*if (!isOctDigit(input[position])) {
            // \0 is allowed still
            result += '\0'
          } else {
            fail('Octal literals are not supported')
          }*/

        } else if (json5) {
          // \X -> x
          result += chr

        } else {
          position--
          fail()
        }

      } else if (isLineTerminator(chr)) {
        fail()

      } else {
        if (!json5 && chr.charCodeAt(0) < 32) {
          position--
          fail('Unexpected control character')
        }

        // SourceCharacter but not one of " or \ or LineTerminator
        result += chr
      }
    }

    fail()
  }

  skipWhiteSpace()
  var return_value = parseGeneric()
  if (return_value !== undefined || position < length) {
    skipWhiteSpace()

    if (position >= length) {
      if (typeof(options.reviver) === 'function') {
        return_value = options.reviver.call(null, '', return_value)
      }
      return return_value
    } else {
      fail()
    }

  } else {
    if (position) {
      fail('No data, only a whitespace')
    } else {
      fail('No data, empty input')
    }
  }
}

/*
 * parse(text, options)
 * or
 * parse(text, reviver)
 *
 * where:
 * text - string
 * options - object
 * reviver - function
 */
module.exports.parse = function parseJSON(input, options) {
  // support legacy functions
  if (typeof(options) === 'function') {
    options = {
      reviver: options
    }
  }

  if (input === undefined) {
    // parse(stringify(x)) should be equal x
    // with JSON functions it is not 'cause of undefined
    // so we're fixing it
    return undefined
  }

  // JSON.parse compat
  if (typeof(input) !== 'string') input = String(input)
  if (options == null) options = {}
  if (options.reserved_keys == null) options.reserved_keys = 'ignore'

  if (options.reserved_keys === 'throw' || options.reserved_keys === 'ignore') {
    if (options.null_prototype == null) {
      options.null_prototype = true
    }
  }

  try {
    return parse(input, options)
  } catch(err) {
    // jju is a recursive parser, so JSON.parse("{{{{{{{") could blow up the stack
    //
    // this catch is used to skip all those internal calls
    if (err instanceof SyntaxError && err.row != null && err.column != null) {
      var old_err = err
      err = SyntaxError(old_err.message)
      err.column = old_err.column
      err.row = old_err.row
    }
    throw err
  }
}

module.exports.tokenize = function tokenizeJSON(input, options) {
  if (options == null) options = {}

  options._tokenize = function(smth) {
    if (options._addstack) smth.stack.unshift.apply(smth.stack, options._addstack)
    tokens.push(smth)
  }

  var tokens = []
  tokens.data = module.exports.parse(input, options)
  return tokens
}


},{"./unicode":110}],110:[function(require,module,exports){

// This is autogenerated with esprima tools, see:
// https://github.com/ariya/esprima/blob/master/esprima.js
//
// PS: oh God, I hate Unicode

// ECMAScript 5.1/Unicode v6.3.0 NonAsciiIdentifierStart:

var Uni = module.exports

module.exports.isWhiteSpace = function isWhiteSpace(x) {
  // section 7.2, table 2
  return x === '\u0020'
      || x === '\u00A0'
      || x === '\uFEFF' // <-- this is not a Unicode WS, only a JS one
      || (x >= '\u0009' && x <= '\u000D') // 9 A B C D

      // + whitespace characters from unicode, category Zs
      || x === '\u1680'
      || x === '\u180E'
      || (x >= '\u2000' && x <= '\u200A') // 0 1 2 3 4 5 6 7 8 9 A
      || x === '\u2028'
      || x === '\u2029'
      || x === '\u202F'
      || x === '\u205F'
      || x === '\u3000'
}

module.exports.isWhiteSpaceJSON = function isWhiteSpaceJSON(x) {
  return x === '\u0020'
      || x === '\u0009'
      || x === '\u000A'
      || x === '\u000D'
}

module.exports.isLineTerminator = function isLineTerminator(x) {
  // ok, here is the part when JSON is wrong
  // section 7.3, table 3
  return x === '\u000A'
      || x === '\u000D'
      || x === '\u2028'
      || x === '\u2029'
}

module.exports.isLineTerminatorJSON = function isLineTerminatorJSON(x) {
  return x === '\u000A'
      || x === '\u000D'
}

module.exports.isIdentifierStart = function isIdentifierStart(x) {
  return x === '$'
      || x === '_'
      || (x >= 'A' && x <= 'Z')
      || (x >= 'a' && x <= 'z')
      || (x >= '\u0080' && Uni.NonAsciiIdentifierStart.test(x))
}

module.exports.isIdentifierPart = function isIdentifierPart(x) {
  return x === '$'
      || x === '_'
      || (x >= 'A' && x <= 'Z')
      || (x >= 'a' && x <= 'z')
      || (x >= '0' && x <= '9') // <-- addition to Start
      || (x >= '\u0080' && Uni.NonAsciiIdentifierPart.test(x))
}

module.exports.NonAsciiIdentifierStart = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/

// ECMAScript 5.1/Unicode v6.3.0 NonAsciiIdentifierPart:

module.exports.NonAsciiIdentifierPart = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/

},{}],111:[function(require,module,exports){
const assert = require('assert')

module.exports = match

// get url path section from a url
// strip querystrings / hashes
// strip protocol
// strip hostname and port (both ip and route)
// str -> str
function match (route) {
  assert.equal(typeof route, 'string')

  return route.trim()
    .replace(/[\?|#].*$/, '')
    .replace(/^(?:https?\:)\/\//, '')
    .replace(/^(?:[\w+(?:-\w+)+.])+(?:[\:0-9]{4,5})?/, '')
    .replace(/\/$/, '')
}

},{"assert":7}],112:[function(require,module,exports){
'use strict';

module.exports = typeof Promise === 'function' ? Promise : require('pinkie');

},{"pinkie":113}],113:[function(require,module,exports){
(function (global){
'use strict';

var PENDING = 'pending';
var SETTLED = 'settled';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';
var NOOP = function () {};
var isNode = typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';

var asyncSetTimer = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
var asyncQueue = [];
var asyncTimer;

function asyncFlush() {
	// run promise callbacks
	for (var i = 0; i < asyncQueue.length; i++) {
		asyncQueue[i][0](asyncQueue[i][1]);
	}

	// reset async asyncQueue
	asyncQueue = [];
	asyncTimer = false;
}

function asyncCall(callback, arg) {
	asyncQueue.push([callback, arg]);

	if (!asyncTimer) {
		asyncTimer = true;
		asyncSetTimer(asyncFlush, 0);
	}
}

function invokeResolver(resolver, promise) {
	function resolvePromise(value) {
		resolve(promise, value);
	}

	function rejectPromise(reason) {
		reject(promise, reason);
	}

	try {
		resolver(resolvePromise, rejectPromise);
	} catch (e) {
		rejectPromise(e);
	}
}

function invokeCallback(subscriber) {
	var owner = subscriber.owner;
	var settled = owner._state;
	var value = owner._data;
	var callback = subscriber[settled];
	var promise = subscriber.then;

	if (typeof callback === 'function') {
		settled = FULFILLED;
		try {
			value = callback(value);
		} catch (e) {
			reject(promise, e);
		}
	}

	if (!handleThenable(promise, value)) {
		if (settled === FULFILLED) {
			resolve(promise, value);
		}

		if (settled === REJECTED) {
			reject(promise, value);
		}
	}
}

function handleThenable(promise, value) {
	var resolved;

	try {
		if (promise === value) {
			throw new TypeError('A promises callback cannot return that same promise.');
		}

		if (value && (typeof value === 'function' || typeof value === 'object')) {
			// then should be retrieved only once
			var then = value.then;

			if (typeof then === 'function') {
				then.call(value, function (val) {
					if (!resolved) {
						resolved = true;

						if (value === val) {
							fulfill(promise, val);
						} else {
							resolve(promise, val);
						}
					}
				}, function (reason) {
					if (!resolved) {
						resolved = true;

						reject(promise, reason);
					}
				});

				return true;
			}
		}
	} catch (e) {
		if (!resolved) {
			reject(promise, e);
		}

		return true;
	}

	return false;
}

function resolve(promise, value) {
	if (promise === value || !handleThenable(promise, value)) {
		fulfill(promise, value);
	}
}

function fulfill(promise, value) {
	if (promise._state === PENDING) {
		promise._state = SETTLED;
		promise._data = value;

		asyncCall(publishFulfillment, promise);
	}
}

function reject(promise, reason) {
	if (promise._state === PENDING) {
		promise._state = SETTLED;
		promise._data = reason;

		asyncCall(publishRejection, promise);
	}
}

function publish(promise) {
	promise._then = promise._then.forEach(invokeCallback);
}

function publishFulfillment(promise) {
	promise._state = FULFILLED;
	publish(promise);
}

function publishRejection(promise) {
	promise._state = REJECTED;
	publish(promise);
	if (!promise._handled && isNode) {
		global.process.emit('unhandledRejection', promise._data, promise);
	}
}

function notifyRejectionHandled(promise) {
	global.process.emit('rejectionHandled', promise);
}

/**
 * @class
 */
function Promise(resolver) {
	if (typeof resolver !== 'function') {
		throw new TypeError('Promise resolver ' + resolver + ' is not a function');
	}

	if (this instanceof Promise === false) {
		throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
	}

	this._then = [];

	invokeResolver(resolver, this);
}

Promise.prototype = {
	constructor: Promise,

	_state: PENDING,
	_then: null,
	_data: undefined,
	_handled: false,

	then: function (onFulfillment, onRejection) {
		var subscriber = {
			owner: this,
			then: new this.constructor(NOOP),
			fulfilled: onFulfillment,
			rejected: onRejection
		};

		if ((onRejection || onFulfillment) && !this._handled) {
			this._handled = true;
			if (this._state === REJECTED && isNode) {
				asyncCall(notifyRejectionHandled, this);
			}
		}

		if (this._state === FULFILLED || this._state === REJECTED) {
			// already resolved, call callback async
			asyncCall(invokeCallback, subscriber);
		} else {
			// subscribe
			this._then.push(subscriber);
		}

		return subscriber.then;
	},

	catch: function (onRejection) {
		return this.then(null, onRejection);
	}
};

Promise.all = function (promises) {
	if (!Array.isArray(promises)) {
		throw new TypeError('You must pass an array to Promise.all().');
	}

	return new Promise(function (resolve, reject) {
		var results = [];
		var remaining = 0;

		function resolver(index) {
			remaining++;
			return function (value) {
				results[index] = value;
				if (!--remaining) {
					resolve(results);
				}
			};
		}

		for (var i = 0, promise; i < promises.length; i++) {
			promise = promises[i];

			if (promise && typeof promise.then === 'function') {
				promise.then(resolver(i), reject);
			} else {
				results[i] = promise;
			}
		}

		if (!remaining) {
			resolve(results);
		}
	});
};

Promise.race = function (promises) {
	if (!Array.isArray(promises)) {
		throw new TypeError('You must pass an array to Promise.race().');
	}

	return new Promise(function (resolve, reject) {
		for (var i = 0, promise; i < promises.length; i++) {
			promise = promises[i];

			if (promise && typeof promise.then === 'function') {
				promise.then(resolve, reject);
			} else {
				resolve(promise);
			}
		}
	});
};

Promise.resolve = function (value) {
	if (value && typeof value === 'object' && value.constructor === Promise) {
		return value;
	}

	return new Promise(function (resolve) {
		resolve(value);
	});
};

Promise.reject = function (reason) {
	return new Promise(function (resolve, reject) {
		reject(reason);
	});
};

module.exports = Promise;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],114:[function(require,module,exports){
'use strict';
module.exports = function (url) {
	if (typeof url !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof url);
	}

	url = url.trim();

	if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+:)?\/\/)/, 'http://');
};

},{}],115:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"_process":35,"dup":34}],116:[function(require,module,exports){
(function (Buffer){
'use strict';

var Writable = require('readable-stream').Writable;
var inherits = require('util').inherits;
var Promise = require('pinkie-promise');

function BufferStream() {
	Writable.call(this, { objectMode: true });
	this.buffer = [];
	this.length = 0;
}

inherits(BufferStream, Writable);
BufferStream.prototype._write = function(chunk, enc, next) {
	if (!Buffer.isBuffer(chunk)) {
		chunk = new Buffer(chunk);
	}

	this.buffer.push(chunk);
	this.length += chunk.length;
	next();
};

module.exports = function read(stream, options, cb) {
	if (!stream) {
		throw new Error('stream argument is required');
	}

	if (typeof options === 'function') {
		cb = options;
		options = {};
	}

	if (typeof options === 'string' || options === undefined || options === null) {
		options = { encoding: options };
	}

	if (options.encoding === undefined) { options.encoding = 'utf8'; }

	var promise;

	if (!cb) {
		var resolve, reject;
		promise = new Promise(function(_res, _rej) {
			resolve = _res;
			reject = _rej;
		});

		cb = function (err, data) {
			if (err) { return reject(err); }
			resolve(data);
		};
	}

	var sink = new BufferStream();

	sink.on('finish', function () {
		var data = Buffer.concat(this.buffer, this.length);

		if (options.encoding) {
			data = data.toString(options.encoding);
		}

		cb(null, data);
	});

	stream.once('error', cb);

	stream.pipe(sink);

	return promise;
}

}).call(this,require("buffer").Buffer)
},{"buffer":14,"pinkie-promise":112,"readable-stream":122,"util":57}],117:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./_stream_readable":119,"./_stream_writable":121,"core-util-is":67,"dup":40,"inherits":92,"process-nextick-args":115}],118:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./_stream_transform":120,"core-util-is":67,"dup":41,"inherits":92}],119:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./_stream_duplex":117,"_process":35,"buffer":14,"buffer-shims":63,"core-util-is":67,"dup":42,"events":17,"inherits":92,"isarray":99,"process-nextick-args":115,"string_decoder/":128,"util":9}],120:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"./_stream_duplex":117,"core-util-is":67,"dup":43,"inherits":92}],121:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./_stream_duplex":117,"_process":35,"buffer":14,"buffer-shims":63,"core-util-is":67,"dup":44,"events":17,"inherits":92,"process-nextick-args":115,"util-deprecate":131}],122:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./lib/_stream_duplex.js":117,"./lib/_stream_passthrough.js":118,"./lib/_stream_readable.js":119,"./lib/_stream_transform.js":120,"./lib/_stream_writable.js":121,"_process":35,"dup":45}],123:[function(require,module,exports){
const window = require('global/window')
const assert = require('assert')

module.exports = hash

// listen to window hashchange events
// and update router accordingly
// fn(cb) -> null
function hash (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')
  window.onhashchange = function (e) {
    cb(window.location.hash)
  }
}

},{"assert":7,"global/window":83}],124:[function(require,module,exports){
const document = require('global/document')
const window = require('global/window')
const assert = require('assert')

module.exports = history

// listen to html5 pushstate events
// and update router accordingly
// fn(str) -> null
function history (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')
  window.onpopstate = function () {
    cb(document.location.href)
  }
}

},{"assert":7,"global/document":82,"global/window":83}],125:[function(require,module,exports){
const window = require('global/window')
const assert = require('assert')

module.exports = href

// handle a click if is anchor tag with an href
// and url lives on the same domain. Replaces
// trailing '#' so empty links work as expected.
// fn(str) -> null
function href (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')

  window.onclick = function (e) {
    const node = (function traverse (node) {
      if (!node) return
      if (node.localName !== 'a') return traverse(node.parentNode)
      if (node.href === undefined) return traverse(node.parentNode)
      if (window.location.host !== node.host) return traverse(node.parentNode)
      return node
    })(e.target)

    if (!node) return

    e.preventDefault()
    const href = node.href.replace(/#$/, '')
    cb(href)
    window.history.pushState({}, null, href)
  }
}

},{"assert":7,"global/window":83}],126:[function(require,module,exports){
const pathname = require('pathname-match')
const wayfarer = require('wayfarer')
const assert = require('assert')

module.exports = sheetRouter

// Fast, modular client router
// fn(str, any[..], fn?) -> fn(str, any[..])
function sheetRouter (dft, createTree, createRoute) {
  createRoute = (createRoute ? createRoute(_createRoute) : _createRoute)

  if (!createTree) {
    createTree = dft
    dft = ''
  }

  assert.equal(typeof dft, 'string', 'sheet-router: dft must be a string')
  assert.equal(typeof createTree, 'function', 'sheet-router: createTree must be a function')
  assert.equal(typeof createRoute, 'function', 'sheet-router: createRoute must be a function')

  const router = wayfarer(dft)
  const tree = createTree(createRoute)

  // register tree in router
  ;(function walk (tree, route) {
    if (Array.isArray(tree[0])) {
      // walk over all routes at the root of the tree
      tree.forEach(function (node) {
        walk(node, route)
      })
    } else if (tree[1]) {
      // handle inline functions as args
      const innerRoute = tree[0]
        ? route.concat(tree[0]).join('/')
        : route.length ? route.join('/') : tree[0]
      router.on(innerRoute, tree[1])
      walk(tree[2], route.concat(tree[0]))
    } else if (Array.isArray(tree[2])) {
      // traverse and append route
      walk(tree[2], route.concat(tree[0]))
    } else {
      // register path in router
      const nwRoute = tree[0]
        ? route.concat(tree[0]).join('/')
        : route.length ? route.join('/') : tree[0]
      router.on(nwRoute, tree[2])
    }
  })(tree, [])

  // match a route on the router
  return function match (route) {
    assert.equal(typeof route, 'string', 'route must be a string')
    const args = [].slice.call(arguments)
    args[0] = pathname(args[0])
    return router.apply(null, args)
  }
}

// register regular route
function _createRoute (route, inline, child) {
  if (!child) {
    child = inline
    inline = null
  }
  assert.equal(typeof route, 'string', 'route must be a string')
  assert.ok(child, 'child exists')
  route = route.replace(/^\//, '')
  return [ route, inline, child ]
}

},{"assert":7,"pathname-match":111,"wayfarer":132}],127:[function(require,module,exports){
module.exports = shift

function shift (stream) {
  var rs = stream._readableState
  if (!rs) return null
  return rs.objectMode ? stream.read() : stream.read(getStateLength(rs))
}

function getStateLength (state) {
  if (state.buffer.length) {
    // Since node 6.3.0 state.buffer is a BufferList not an array
    if (state.buffer.head) {
      return state.buffer.head.data.length
    }

    return state.buffer[0].length
  }

  return state.length
}

},{}],128:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"buffer":14,"dup":51}],129:[function(require,module,exports){
'use strict';

module.exports = function (req, time) {
	if (req.timeoutTimer) { return req; }

	var host = req._headers ? (' to ' + req._headers.host) : '';

	req.timeoutTimer = setTimeout(function timeoutHandler() {
		req.abort();
		var e = new Error('Connection timed out on request' + host);
		e.code = 'ETIMEDOUT';
		req.emit('error', e);
	}, time);

	// Set additional timeout on socket - in case if remote
	// server freeze after sending headers
	req.setTimeout(time, function socketTimeoutHandler() {
		req.abort();
		var e = new Error('Socket timed out on request' + host);
		e.code = 'ESOCKETTIMEDOUT';
		req.emit('error', e);
	});

	function clear() {
		if (req.timeoutTimer) {
			clearTimeout(req.timeoutTimer);
			req.timeoutTimer = null;
		}
	}

	return req
		.on('response', clear)
		.on('error', clear);
};

},{}],130:[function(require,module,exports){
'use strict';
var url = require('url');
var prependHttp = require('prepend-http');

module.exports = function (x) {
	var withProtocol = prependHttp(x);
	var parsed = url.parse(withProtocol);

	if (withProtocol !== x) {
		parsed.protocol = null;
	}

	return parsed;
};

},{"prepend-http":114,"url":53}],131:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],132:[function(require,module,exports){
const assert = require('assert')
const trie = require('./trie')

module.exports = Wayfarer

// create a router
// str -> obj
function Wayfarer (dft) {
  if (!(this instanceof Wayfarer)) return new Wayfarer(dft)

  const _default = (dft || '').replace(/^\//, '')
  const _trie = trie()

  emit._trie = _trie
  emit.emit = emit
  emit.on = on
  emit._wayfarer = true

  return emit

  // define a route
  // (str, fn) -> obj
  function on (route, cb) {
    assert.equal(typeof route, 'string')
    assert.equal(typeof cb, 'function')

    route = route || '/'

    if (cb && cb._wayfarer && cb._trie) {
      _trie.mount(route, cb._trie.trie)
    } else {
      const node = _trie.create(route)
      node.cb = cb
    }

    return emit
  }

  // match and call a route
  // (str, obj?) -> null
  function emit (route) {
    assert.notEqual(route, undefined, "'route' must be defined")
    const args = Array.prototype.slice.apply(arguments)

    const node = _trie.match(route)
    if (node && node.cb) {
      args[0] = node.params
      return node.cb.apply(null, args)
    }

    const dft = _trie.match(_default)
    if (dft && dft.cb) {
      args[0] = dft.params
      return dft.cb.apply(null, args)
    }

    throw new Error("route '" + route + "' did not match")
  }
}

},{"./trie":133,"assert":7}],133:[function(require,module,exports){
const mutate = require('xtend/mutable')
const assert = require('assert')
const xtend = require('xtend')

module.exports = Trie

// create a new trie
// null -> obj
function Trie () {
  if (!(this instanceof Trie)) return new Trie()
  this.trie = { nodes: {} }
}

// create a node on the trie at route
// and return a node
// str -> null
Trie.prototype.create = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')
  // strip leading '/' and split routes
  const routes = route.replace(/^\//, '').split('/')
  return (function createNode (index, trie, routes) {
    const route = routes[index]

    if (route === undefined) return trie

    var node = null
    if (/^:/.test(route)) {
      // if node is a name match, set name and append to ':' node
      if (!trie.nodes['$$']) {
        node = { nodes: {} }
        trie.nodes['$$'] = node
      } else {
        node = trie.nodes['$$']
      }
      trie.name = route.replace(/^:/, '')
    } else if (!trie.nodes[route]) {
      node = { nodes: {} }
      trie.nodes[route] = node
    } else {
      node = trie.nodes[route]
    }

    // we must recurse deeper
    return createNode(index + 1, node, routes)
  })(0, this.trie, routes)
}

// match a route on the trie
// and return the node
// str -> obj
Trie.prototype.match = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')

  const routes = route.replace(/^\//, '').split('/')
  const params = {}

  var node = (function search (index, trie) {
    // either there's no match, or we're done searching
    if (trie === undefined) return undefined
    const route = routes[index]
    if (route === undefined) return trie

    if (trie.nodes[route]) {
      // match regular routes first
      return search(index + 1, trie.nodes[route])
    } else if (trie.name) {
      // match named routes
      params[trie.name] = route
      return search(index + 1, trie.nodes['$$'])
    } else {
      // no matches found
      return search(index + 1)
    }
  })(0, this.trie)

  if (!node) return undefined
  node = xtend(node)
  node.params = params
  return node
}

// mount a trie onto a node at route
// (str, obj) -> null
Trie.prototype.mount = function (route, trie) {
  assert.equal(typeof route, 'string', 'route should be a string')
  assert.equal(typeof trie, 'object', 'trie should be a object')

  const split = route.replace(/^\//, '').split('/')
  var node = null
  var key = null

  if (split.length === 1) {
    key = split[0]
    node = this.create(key)
  } else {
    const headArr = split.splice(0, split.length - 1)
    const head = headArr.join('/')
    key = split[0]
    node = this.create(head)
  }

  mutate(node.nodes, trie.nodes)
  if (trie.name) node.name = trie.name

  // delegate properties from '/' to the new node
  // '/' cannot be reached once mounted
  if (node.nodes['']) {
    Object.keys(node.nodes['']).forEach(function (key) {
      if (key === 'nodes') return
      node[key] = node.nodes[''][key]
    })
    mutate(node.nodes, node.nodes[''].nodes)
    delete node.nodes[''].nodes
  }
}

},{"assert":7,"xtend":135,"xtend/mutable":136}],134:[function(require,module,exports){
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}],135:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"dup":58}],136:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],137:[function(require,module,exports){
var bel = require('bel') // turns template tag into DOM elements
var morphdom = require('morphdom') // efficiently diffs + morphs two DOM elements
var defaultEvents = require('./update-events.js') // default events to be copied when dom elements update

module.exports = bel

// TODO move this + defaultEvents to a new module once we receive more feedback
module.exports.update = function (fromNode, toNode, opts) {
  if (!opts) opts = {}
  if (opts.events !== false) {
    if (!opts.onBeforeMorphEl) opts.onBeforeMorphEl = copier
  }

  return morphdom(fromNode, toNode, opts)

  // morphdom only copies attributes. we decided we also wanted to copy events
  // that can be set via attributes
  function copier (f, t) {
    // copy events:
    var events = opts.events || defaultEvents
    for (var i = 0; i < events.length; i++) {
      var ev = events[i]
      if (t[ev]) { // if new element has a whitelisted attribute
        f[ev] = t[ev] // update existing element
      } else if (f[ev]) { // if existing element has it and new one doesnt
        f[ev] = undefined // remove it from existing element
      }
    }
    // copy values for form elements
    if ((f.nodeName === 'INPUT' && f.type !== 'file') || f.nodeName === 'TEXTAREA' || f.nodeName === 'SELECT') {
      if (t.getAttribute('value') === null) t.value = f.value
    }
  }
}

},{"./update-events.js":138,"bel":62,"morphdom":101}],138:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}]},{},[6]);
