#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var includeFolder = require('include-folder')
var html = require('simple-html-index')
var browserify = require('browserify')
var minimist = require('minimist')
var cssdeps = require('style-deps')
var mkdir = require('mkdirp')
var rm = require('rimraf')
var debug = require('debug')('minidocs:cli')

var cwd = process.cwd().split('/')
var projectdir = cwd[cwd.length - 1]

var argv = minimist(process.argv.slice(2), {
  alias: {
    c: 'contents',
    o: 'output',
    t: 'title',
    l: 'logo',
    h: 'help'
  },
  default: {
    output: 'site',
    title: projectdir
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
  * --css              Optional stylesheet
  * --help, -h         Show this help message
`

var site = {}

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
var sourceDir = argv._[0]

if (sourceDir) {
  site.markdown = includeFolder(sourceDir)
} else {
  console.log('\nError:\nsource markdown directory is required')
  console.log(usage)
  process.exit()
}

/*
* Read the table of contents
*/
if (argv.contents) {
  site.contents = require('./' + argv.contents)
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
  debug('createOutputDir', argv.ouput)
  rm(argv.output, function (err) {
    if (err) return error(err)
    mkdir(argv.output, done)
  })
}

function buildJS () {
  var filepath = path.join(__dirname, argv.output, 'index.js')
  var minidocs = path.join(__dirname, 'index')
  var js = `require('${minidocs}')(${JSON.stringify(site)})`

  fs.writeFile(filepath, js, function (err) {
    if (err) return error(err)
    browserify(filepath)
      .transform('brfs')
      .bundle(function (err, src) {
        if (err) return error(err)
        var filepath = path.join(argv.output, 'bundle.js')
        fs.writeFile(filepath, src, function (err) {
          debug('bundle.js', filepath)
          if (err) return error(err)
        })
      })
  })
}

function buildHTML (done) {
  var filepath = path.join(argv.output, 'index.html')
  var write = fs.createWriteStream(filepath)
  var opts = {
    title: argv.title,
    entry: 'bundle.js',
    css: 'style.css'
  }
  debug('build html', filepath)
  var read = html(opts)
  read.pipe(write)
  read.on('end', done)
}

function buildCSS (done) {
  debug('buildCSS')
  var opts = {}
  var rootcss = path.join(__dirname, 'components', 'styles', 'index.css')

  function write (txt) {
    debug('write the css bundle')
    var csspath = path.join(argv.output, 'style.css')
    fs.writeFile(csspath, txt, done)
  }

  cssdeps(rootcss, opts, function (err, deps) {
    console.log('waaaaaaaaa')
    if (err) return error(err)
    if (argv.css) {
      fs.readFile(argv.css, 'utf8', function (err, src) {
        if (err) return error(err)
        deps += '\n' + src
        write(deps)
      })
    } else {
      write(deps)
    }
  })
}

function buildLogo () {
  var logopath = path.join(argv.output, site.logo)
  var writelogo = fs.createWriteStream(logopath)
  fs.createReadStream(argv.logo).pipe(writelogo)
}

function error (err) {
  console.log(err)
  process.exit(1)
}
