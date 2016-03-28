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

require('../index')(contents, {logo: 'logo.svg'})