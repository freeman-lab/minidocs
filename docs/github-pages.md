# github pages

GitHub Pages doesn't support HTML5 pushstate, so you have two options:

##### 1. Generate the site with the minidocs cli

Build a minidocs site with the cli and the `--full-html` option:

```sh
minidocs path/to/docs/dir -c contents.json -o site --full-html
```

This creates an HTML file for each route of the site, so that on initial page load all content is sent from the server, and once the JS is loaded the minidocs app takes over all routing.

##### 2. Use hash routing with the JS module

To use hash routing, start the app with the `{ hash: true }` option in the `minidocs.start` method:

```js
var tree = app.start({ hash: true })
document.body.appendChild(tree)
```

##### Deploy with the `gh-pages` command

You can use the [`gh-pages`](https://www.npmjs.com/package/gh-pages) module to push the built site to the gh-pages branch of your repo.

> Note: if you're deploying a project at a basedir like username.github.io/project-name, you'll want to use the `--basedir /project-name` option

Install `gh-pages`:

```sh
npm install --save-dev gh-pages
```

Create a `deploy` npm script:

```js
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

Publish your site:

```sh
npm run deploy
```
