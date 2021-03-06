const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
}
//map '==' depth to 'subsection', 'subsubsection', etc
const doSection = function(options) {
  options = Object.assign({}, defaults, options)
  let out = ''
  let num = 1
  //make the header
  if (options.headers === true && this.title()) {
    num = 1 + this.depth
    var vOpen = '\n'
    var vClose = '}'
    switch (num) {
      case 1:
        vOpen += '\\chapter{'
        break
      case 2:
        vOpen += '\\section{'
        break
      case 3:
        vOpen += '\\subsection{'
        break
      case 4:
        vOpen += '\\subsubsection{'
        break
      case 5:
        vOpen += '\\paragraph{'
        vClose = '} \\\\ \n'
        break
      case 6:
        vOpen += '\\subparagraph{'
        vClose = '} \\\\ \n'
        break
      default:
        vOpen +=
          '\n% section with depth=' + num + ' undefined - use subparagraph instead\n\\subparagraph{'
        vClose = '} \\\\ \n'
    }
    out += vOpen + this.title() + vClose
    out += '\n'
  }
  //put any images under the header
  if (options.images === true && this.images()) {
    out += this.images()
      .map(img => img.latex(options))
      .join('\n')
    //out += '\n';
  }
  //make a out tablew
  if (options.tables === true && this.tables()) {
    out += this.tables()
      .map(t => t.latex(options))
      .join('\n')
  }
  // //make a out bullet-list
  if (options.lists === true && this.lists()) {
    out += this.lists()
      .map(list => list.latex(options))
      .join('\n')
  }
  //finally, write the sentence text.
  if (options.paragraphs === true || options.sentences === true) {
    out += this.paragraphs()
      .map(s => s.latex(options))
      .join(' ')
    out += '\n'
  }
  // var title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;
  return out
}
module.exports = doSection
