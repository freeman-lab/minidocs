# about

Hello! This is an introduction to an example site built with [`minidocs`](https://github.com/freeman-lab/minidocs).

## doing the how it works thing

### how it works

Just make a folder of markdown files, and specify an object describing the table of contents

```javascript
var contents = {
  'overview': {
    'about': 'about.md'
  },
  'animals': {
    'furry': {
      'sheep': 'sheep.md',
      'puppy': 'puppy.md'
    },
    'pink': {
      'pig': 'pig.md'
    }
  }
}
```

Then build the site with `require('minidocs')(contents, {logo: 'logo.svg'})`

<p><b>Have fun with minidocs!</b></p>
