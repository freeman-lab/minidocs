#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var includeFolder = require('include-folder')
var html = require('simple-html-index')
var browserify = require('browserify')
var minimist = require('minimist')
var mkdir = require('mkdirp')
var rm = require('rimraf')
var debug = require('debug')('minidocs:cli')

var cwd = process.cwd()
var cwdArr = cwd.split('/')
var projectdir = cwdArr[cwdArr.length - 1]

var argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'contents',
    o: 'output',
    t: 'title',
    l: 'logo',
    s: 'css',
    p: 'pushstate',
    h: 'help'
  },
  default: {
    output: 'site',
    title: projectdir,
    pushstate: true
  }
})

var usage = `
Usage:
  minidocs {sourceDir} -c {contents.json} -o {buildDir}

Options:
  * --contents, -c     JSON file that defines the table of contents
  * --output, -o       Directory for built site [site]
  * --title, -t        Project name [name of current directory]
  * --logo, -l         Project logo
  * --css, -s          Optional stylesheet
  * --pushstate, -p    Use HTML5 pushstate [true]
  * --help, -h         Show this help message
`

var site = {
  outputDir: path.resolve(cwd, argv.output),
  pushstate: argv.pushstate
}

/*
* Show help text
*/
if (argv.help) {
  console.log(usage)
  process.exit()
}

/*
* Get source markdown directory
*/
if (argv._[0]) {
  var source = path.resolve(cwd, argv._[0])
  site.markdown = includeFolder(source)
} else {
  console.log('\nError:\nsource markdown directory is required')
  console.log(usage)
  process.exit()
}

/*
* Read the table of contents
*/
if (argv.contents) {
  var contents = path.resolve(process.cwd(), argv.contents)
  site.contents = require(contents)
} else {
  console.log('\nError:\n--contents/-c option is required')
  console.log(usage)
  process.exit()
}

/*
* Get the project logo if provided
*/
if (argv.logo) {
  site.logo = path.parse(argv.logo).base
}

/*
* Add the title
*/
site.title = argv.title

createOutputDir(function () {
  debug('createOutputDir')
  if (argv.logo) buildLogo()
  buildCSS(function () {
    buildHTML(function () {
      buildJS()
    })
  })
})

function createOutputDir (done) {
  debug('createOutputDir', site.outputDir)
  rm(site.outputDir, function (err) {
    if (err) return error(err)
    mkdir(site.outputDir, done)
  })
}

function buildJS () {
  var filepath = path.join(site.outputDir, 'index.js')
  var js = `require('minidocs')(${JSON.stringify(site)})`

  fs.writeFile(filepath, js, function (err) {
    if (err) return error(err)
    browserify(filepath)
      .transform('brfs')
      .bundle(function (err, src) {
        if (err) return error(err)
        var filepath = path.join(site.outputDir, 'bundle.js')
        fs.writeFile(filepath, src, function (err) {
          debug('bundle.js', filepath)
          if (err) return error(err)
        })
      })
  })
}

function buildHTML (done) {
  var filepath = path.join(site.outputDir, 'index.html')
  var write = fs.createWriteStream(filepath)
  var opts = {
    title: argv.title,
    entry: 'bundle.js',
    css: argv.css ? 'style.css' : null
  }
  debug('build html', filepath)
  var read = html(opts)
  read.pipe(write)
  read.on('end', done)
}

function buildCSS (done) {
  debug('buildCSS')

  function write (txt) {
    debug('write the css bundle')
    var csspath = path.join(site.outputDir, 'style.css')
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

function error (err) {
  console.log(err)
  process.exit(1)
}
