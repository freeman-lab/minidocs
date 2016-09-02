#! /usr/bin/env node

var path = require('path')
var assert = require('assert')
var parsePath = require('parse-filepath')
var minimist = require('minimist')
var apply = require('async.applyeachseries')
var exit = require('exit')

var minidocs = require('../app')
var parseOptions = require('../lib/parse-options')
var createCSS = require('../lib/create-css')
var createHTML = require('../lib/create-html')
var createAssets = require('../lib/create-assets')
var createJS = require('../lib/create-js')
var createOutputDir = require('../lib/create-output-dir')
var createPushstateFile = require('../lib/create-pushstate-file')

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
    a: 'assets',
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
  var logoSource = path.resolve(cwd, argv.logo)
  var logo = path.parse(argv.logo).base
}

var state = {
  title: argv.title,
  logo: logo,
  logoSource: logoSource,
  contents: contentsPath,
  markdown: source,
  initial: argv.initial,
  basedir: argv.basedir,
  dir: cwd
}

var parsedState = parseOptions(state)
var app = minidocs(parsedState)

build({
  argv: argv,
  state: parsedState,
  outputDir: outputDir
}, function (err) {
  if (err) return error(err)
  exit()
})

function build (options) {
  assert.ok(options)
  assert.ok(options.outputDir)
  assert.ok(options.argv)
  assert.ok(options.state)

  var tasks = [
    createOutputDir,
    createJS,
    createCSS,
    createHTML,
    createAssets
  ]

  if (options.argv.pushstate) {
    tasks.push(createPushstateFile)
  }

  apply(tasks, app, options, function (err) {
    if (err) return error(err)
  })
}

function error (err, opts) {
  console.log(err)
  if (opts && opts.usage) usage(1)
}

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
    * --assets, -a       Directory of assets to be copied to the built site
    * --initial, -i      Page to use for root url
    * --pushstate, -p    Create a 200.html file for hosting services like surge.sh
    * --basedir, -b      Base directory of the site
    * --full-html, -f    Create HTML files for all routes. Useful for GitHub Pages. [false]
    * --help, -h         Show this help message
  `)
  exit(exitcode || 0)
}
