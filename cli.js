#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var tmpdir = require('os-tmpdir')
var includeFolder = require('include-folder')
var html = require('simple-html-index')
var browserify = require('browserify')
var minimist = require('minimist')
var mkdir = require('mkdirp')
var rm = require('rimraf')

var cwd = process.cwd().split('/')

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
    title: cwd[cwd.length - 1]
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
  return console.log(usage)
}

/*
* Get source markdown directory
*/
var sourceDir = argv._[0]

if (sourceDir) {
  site.markdown = includeFolder(sourceDir)
} else {
  console.log('\nError:\nsource markdown directory is required')
  return console.log(usage)
}

/*
* Read the table of contents
*/
if (argv.contents) {
  site.contents = require('./'+argv.contents)
} else {
  console.log('\nError:\n--contents/-c option is required')
  return console.log(usage)
}

if (argv.logo) {
  site.logo = path.parse(argv.logo).base
}

var minidocs = path.join(__dirname, 'index')
var js = `require('${minidocs}')(${JSON.stringify(site.contents)}, ${JSON.stringify(site)})`

bundle(js, output)

function bundle (js, callback) {
  var filepath = path.join(tmpdir(), 'minidocs-index.js')
  fs.writeFile(filepath, js, function (err) {
    browserify(filepath)
      .transform('brfs')
      .transform('folderify')
      .bundle(callback)
  })
}

function output (err, src) {
  createOutputDir(function () {
    var filepath = path.join(argv.output, 'bundle.js')
    fs.writeFile(filepath, src, function (err) {
      if (argv.css) buildCSS()
      if (argv.logo) buildLogo()
      buildHTML()
    })
  })
}

function createOutputDir (callback) {
  rm(argv.output, function (err) {
    mkdir(argv.output, callback)
  })
}

function buildHTML () {
  var filepath = path.join(argv.output, 'index.html')
  var write = fs.createWriteStream(filepath)
  var opts = {
    title: argv.title,
    entry: 'bundle.js',
    css: argv.css ? 'theme.css' : null
  }
  html(opts).pipe(write)
}

function buildCSS () {
  var csspath = path.join(argv.output, 'theme.css')
  var writecss = fs.createWriteStream(csspath)
  fs.createReadStream(argv.css).pipe(writecss)
}

function buildLogo () {
  var logopath = path.join(argv.output, site.logo)
  var writelogo = fs.createWriteStream(logopath)
  fs.createReadStream(argv.logo).pipe(writelogo)
}
