var contents = {
  'overview': {
    'about': 'about.md'
  },
  'animals': {
    'furry': {
      'sheep': 'sheep.md'
    },
    'pink': {
      'pig': 'pig.md'
    }
  }
}

require('./index')({
  contents: contents,
})