# using minidocs as a command-line tool

Just specify the location of your markdown files, the table of contents, the output location, and build the site

```
minidocs docs/ --contents contents.json --output site/
```

The folder `site` will now contain the `html` `js` and `css` for your site.

## Options

```
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
```
