const marked = require('marked');

function toHtml(md) {
  // marked default converter
  return marked(md);
}

module.exports = { toHtml };
