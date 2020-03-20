const patterns = require('./templates')
// 1-1 template mapping
const mapping = {
  //place
  coord: 'Place',
  'weather box': 'Place',

  //person
  persondata: 'Person',
  writer: 'Person',
  'ted speaker': 'Person',
  taxonbar: 'Thing/Organism',
  wikispecies: 'Thing/Organism',
  animalia: 'Thing/Organism',
  chordata: 'Thing/Organism',
  cnidaria: 'Thing/Organism',
  porifera: 'Thing/Organism',
  epicaridea: 'Thing/Organism',
  mammals: 'Thing/Organism',
  phlyctaeniidae: 'Thing/Organism',
  carnivora: 'Thing/Organism',
  clade: 'Thing/Organism',
  'life on earth': 'Thing/Organism',
  'orders of insects': 'Thing/Organism',
  coleoptera: 'Thing/Organism',
  'insects in culture': 'Thing/Organism',
  'living things in culture': 'Thing/Organism',
  'eukaryota classification': 'Thing/Organism',
  animalia: 'Thing/Organism'
}

const topk = function(arr) {
  let obj = {}
  arr.forEach(a => {
    obj[a] = obj[a] || 0
    obj[a] += 1
  })
  let res = Object.keys(obj).map(k => [k, obj[k]])
  return res.sort((a, b) => (a[1] > b[1] ? -1 : 0))
}

const matchPatterns = function(title) {
  let types = Object.keys(patterns)
  for (let i = 0; i < types.length; i++) {
    const key = types[i]
    for (let o = 0; o < patterns[key].length; o++) {
      const reg = patterns[key][o]
      if (reg.test(title) === true) {
        return key
      }
    }
  }
}

const byTemplate = function(doc) {
  let templates = doc.templates()
  let found = []
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (mapping.hasOwnProperty(title)) {
      found.push(mapping[title])
    } else {
      // try regex-list on it
      let type = matchPatterns(title)
      if (type) {
        found.push(type)
      }
    }
  }
  let top = topk(found)[0]
  if (top && top[0]) {
    return top[0]
  }
  return null
}

module.exports = byTemplate
