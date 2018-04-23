const parse = require('./index');
const toMarkdown = require('../output/markdown');
const toHtml = require('../output/html');
const defaults = require('../lib/defaults');
// const Image = require('../section/image/Image');

//
const Document = function(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);
};

const methods = {
  isRedirect : function() {
    return this.data.type === 'redirect';
  },
  isDisambiguation : function() {
    return this.data.type === 'disambiguation';
  },
  // redirectTo : function() {
  //   return p
  // },
  // disambigpages : function() {
  //   return p
  // },
  categories : function(n) {
    if (n !== undefined) {
      return this.data.categories[n];
    }
    return this.data.categories || [];
  },
  sections : function(n) {
    let arr = this.data.sections || [];
    //grab a specific section, by its title
    if (typeof n === 'string') {
      let str = n.toLowerCase().trim();
      return arr.find((s) => {
        return s.title.toLowerCase() === str;
      });
    }
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  sentences : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.sentences().forEach((s) => {
        arr.push(s);
      });
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  images : function(n) {
    let arr = [];
    //grab image from infobox, first
    this.infoboxes().forEach((info) => {
      if (info.data.image) {
        arr.push(info.data.image.data);
      }
    });
    this.sections().forEach((sec) => {
      sec.images().forEach((img) => {
        arr.push(img);
      });
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  links : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      sec.links().forEach((l) => {
        arr.push(l);
      });
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  tables : function(n) {
    let arr = [];
    this.sections().forEach((sec) => {
      if (sec.tables()) {
        sec.tables().forEach((t) => {
          arr.push(t);
        });
      }
    });
    if (n !== undefined) {
      return arr[n];
    }
    return arr;
  },
  citations : function(n) {
    if (n !== undefined) {
      return this.data.citations[n];
    }
    return this.data.citations || [];
  },
  infoboxes : function(n) {
    if (n !== undefined) {
      return this.data.infoboxes[n];
    }
    return this.data.infoboxes || [];
  },
  coordinates : function(n) {
    if (n !== undefined) {
      return this.data.coordinates[n];
    }
    return this.data.coordinates || [];
  },
  toPlaintext : function(options) {
    options = Object.assign(defaults, options || {});
    let arr = this.sections().map(sec => sec.toPlaintext(options));
    return arr.join('\n\n');
  },
  toMarkdown : function(options) {
    options = Object.assign(defaults, options || {});
    return toMarkdown(this, options);
  },
  toHtml : function(options) {
    options = Object.assign(defaults, options || {});
    return toHtml(this, options);
  }
};

Object.keys(methods).forEach((k) => {
  Document.prototype[k] = methods[k];
});
//alias this one
Document.prototype.toHTML = Document.prototype.toHtml;
Document.prototype.isDisambig = Document.prototype.isDisambiguation;

module.exports = Document;
