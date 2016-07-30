#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var read = require('read-directory')
var parsePath = require('parse-filepath')
var createHTML = require('create-html')
var browserify = require('browserify')
var minimist = require('minimist')
var mkdir = require('mkdirp')
var rm = require('rimraf')
var exit = require('exit')

var debug = require('debug')('minidocs')
var minidocs = require('./app')
var parseOptions = require('./lib/parse-options')

var cwd = process.cwd()
var cwdParsed = parsePath(cwd)
var projectdir = cwdParsed.name
var argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'contents',
    o: 'output',
    t: 'title',
    l: 'logo',
    s: 'css',
    i: 'initial',
    p: 'pushstate',
    b: 'basedir',
    f: 'full-html',
    h: 'help'
  },
  default: {
    output: 'site',
    title: projectdir,
    basedir: '',
    'full-html': false
  }
})

var outputDir = path.resolve(cwd, argv.output)

if (argv.help) {
  usage()
}

if (argv._[0]) {
  var source = path.resolve(cwd, argv._[0])
} else {
  error('\nError:\nsource markdown directory is required', { usage: true })
}

if (argv.contents) {
  var contentsPath = path.resolve(cwd, argv.contents)
} else {
  error('\nError:\n--contents/-c option is required', { usage: true })
}

if (argv.logo) {
  var logo = path.parse(argv.logo).base
}

var state = {
  title: argv.title,
  logo: logo,
  contents: contentsPath,
  markdown: source,
  initial: argv.initial,
  basedir: argv.basedir,
  dir: cwd
}

var parsedState = parseOptions(state)
var app = minidocs(parsedState)

function usage (exitcode) {
  console.log(`
  Usage:
    minidocs {sourceDir} -c {contents.json} -o {buildDir}

  Options:
    * --contents, -c     JSON file that defines the table of contents
    * --output, -o       Directory for built site [site]
    * --title, -t        Project name [name of current directory]
    * --logo, -l         Project logo
    * --css, -s          Optional stylesheet
    * --initial, -i      Page to use for root url
    * --pushstate, -p    Create a 200.html file for hosting services like surge.sh
    * --basedir, -b      Base directory of the site
    * --full-html, -f    Create HTML files for all routes. Useful for GitHub Pages. [false]
    * --help, -h         Show this help message
  `)
  exit(exitcode || 0)
}

function error (err, opts) {
  console.log(err)
  if (opts && opts.usage) usage(1)
}

function createOutputDir (done) {
  debug('createOutputDir', outputDir)
  rm(outputDir, function (err) {
    if (err) return error(err)
    mkdir(outputDir, done)
  })
}

function buildHTML (done) {
  function createFile (route, filepath, done) {
    var page = app.toString(parsedState.basedir + route, parsedState)

    var html = createHTML({
      title: state.title,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      body: page,
      script: argv.basedir + '/bundle.js',
      css: argv.basedir + '/bundle.css'
    })

    fs.writeFile(filepath, html, function (err) {
      if (err) error(err)
      done()
    })
  }

  if (argv['full-html']) {
    Object.keys(parsedState.routes).forEach(function (key) {
      var route = parsedState.routes[key]
      var filepath = path.join(outputDir, key + '.html')
      parsedState.current = key === 'index' ? parsedState.initial : key
      createFile(route, filepath, done)
    })
  } else {
    var filepath = path.join(outputDir, 'index.html')
    parsedState.current = parsedState.initial
    createFile('/', filepath, done)
  }
}

function buildJS (done) {
  var filepath = path.join(outputDir, 'index.js')

  var customStylePath = argv.css ? path.join(cwd, argv.css) : null
  var customStyle = argv.css ? `css('${customStylePath}', { global: true })` : ''

  var js = `
  var css = require('sheetify')
  var minidocs = require('minidocs')
  var app = minidocs(${JSON.stringify(parsedState)})
  ${customStyle}
  app.start('#choo-root')
  `

  fs.writeFile(filepath, js, function (err) {
    if (err) return error(err)
    browserify(filepath, { paths: [path.join(__dirname, 'node_modules')] })
      .transform(require('sheetify/transform'))
      .plugin(require('css-extract'), { out: path.join(outputDir, 'bundle.css') })
      .bundle(function (err, src) {
        if (err) return error(err)
        var filepath = path.join(outputDir, 'bundle.js')
        fs.writeFile(filepath, src, function (err) {
          debug('bundle.js', filepath)
          if (err) return error(err)
          done()
        })
      })
  })
}

function createLogo () {
  var logopath = path.join(outputDir, logo)
  var writelogo = fs.createWriteStream(logopath)
  fs.createReadStream(argv.logo).pipe(writelogo)
}

createOutputDir(function () {
  debug('createOutputDir')

  buildJS(function () {
    buildHTML(function () {
      if (argv.logo) createLogo()
      if (argv.pushstate) createPushstateFile()
    })
  })
})

function createPushstateFile (done) {
  var page = app.toString(parsedState.basedir + '/', parsedState)
  var pushstatefile = path.join(outputDir, '200.html')

  var html = createHTML({
    title: state.title,
    body: page,
    script: argv.basedir + '/bundle.js',
    css: argv.basedir + '/bundle.css'
  })

  fs.writeFile(pushstatefile, html, function (err) {
    if (err) return error(err)
  })
}
