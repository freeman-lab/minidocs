var contents = {
  'overview': {
    'about': 'about-file.md'
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

require('./index')({
  contents: contents,
  logo: 'logo.svg'
})