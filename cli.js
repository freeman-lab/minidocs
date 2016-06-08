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
var minidocs = require('./index')

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
    h: 'help'
  },
  default: {
    output: 'site',
    title: projectdir
  }
})

var outputDir: path.resolve(cwd, argv.output)

if (argv.help) {
  usage()
}

if (argv._[0]) {
  var source = path.resolve(cwd, argv._[0])
  var markdown = read.sync(source, { extensions: false })
} else {
  error('\nError:\nsource markdown directory is required', { usage: true })
}

if (argv.contents) {
  var contents = path.resolve(process.cwd(), argv.contents)
} else {
  error('\nError:\n--contents/-c option is required', { usage: true })
}

if (argv.logo) {
  site.logo = path.parse(argv.logo).base
}

site.title = argv.title

var state = {
  title: 'minidocs',
  logo: null,
  contents: require(contents),
  markdown: markdown
}

var app = minidocs(state)

var routes = ['/']
var keys = Object.keys(state.markdown)
var routes = routes.concat(keys.map(function (key) {
  return `/${key}`
}))

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
    * --help, -h         Show this help message
  `)
  exit(exitcode || 0)
}

function error (err, opts) {
  console.log(err)
  if (opts.usage) usage(1)
}

function createOutputDir (done) {
  debug('createOutputDir', outputDir)
  rm(outputDir, function (err) {
    if (err) return error(err)
    mkdir(outputDir, done)
  })
}

function buildHTML () {
  routes.forEach(function (route) {
    var page = minidocs.toString(route, state)
    var html = createHTML({ title: route, body: page })
    var dirpath = path.join(outputDir, route)
    var filepath = path.join(dirpath, 'index.html')
    mkdir(dirpath, function (err) {
      fs.writeFile(filepath, html, function (err) {
        if (err) console.log(err)
      })
    })
  })
}

function buildJS () {
  var filepath = path.join(outputDir, 'index.js')
  var js = `require('minidocs')(${JSON.stringify(state)})`

  fs.writeFile(filepath, js, function (err) {
    if (err) return error(err)
    browserify(filepath)
      .transform('brfs')
      .bundle(function (err, src) {
        if (err) return error(err)
        var filepath = path.join(outputDir, 'bundle.js')
        fs.writeFile(filepath, src, function (err) {
          debug('bundle.js', filepath)
          if (err) return error(err)
        })
      })
  })
}

function buildCSS (done) {
  debug('buildCSS')

  function write (txt) {
    debug('write the css bundle')
    var csspath = path.join(outputDir, 'style.css')
    fs.writeFile(csspath, txt, done)
  }

  if (argv.css) {
    fs.readFile(argv.css, 'utf8', function (err, src) {
      if (err) return error(err)
      write(src)
    })
  } else {
    done()
  }
}

function buildLogo () {
  var logopath = path.join(site.outputDir, site.logo)
  var writelogo = fs.createWriteStream(logopath)
  fs.createReadStream(argv.logo).pipe(writelogo)
}

createOutputDir(function () {
  debug('createOutputDir')
  if (argv.logo) buildLogo()
  buildCSS(function () {
    buildHTML(function () {
      buildJS()
    })
  })
})
