const fs = require('fs');
const frontmatter = require('./frontmatter');
const markdown = require('./markdown');

function parseMarkdownFile(filepath) {
  const txt = fs.readFileSync(filepath, 'utf8');
  const { meta, body } = frontmatter.extract(txt);
  const html = markdown.toHtml(body);
  return { meta, html, raw: body, source: filepath };
}

module.exports = { parseMarkdownFile };
