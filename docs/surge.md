# surge.sh

[surge.sh](https://surge.sh) supports HTML5 pushstate if you have a 200.html file in your built site. You can either create that file yourself when using minidocs as a JS module, or you can build the site with the minidocs cli tool and the `--pushstate` option:

```sh
minidocs docs/ -c contents.json --pushstate -o site/
```

##### Deploy with the `surge` command

You can use the [`surge`](https://www.npmjs.com/package/surge) module to push the built site to the [surge.sh service](https://surge.sh).

Install `surge`:

```sh
npm install --save-dev surge
```

Create a `deploy` npm script:

```js
"scripts": {
  "deploy": "surge dist"
}
```

Publish your site:

```sh
npm run deploy
```
