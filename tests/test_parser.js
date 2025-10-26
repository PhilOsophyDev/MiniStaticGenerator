const parser = require('../lib/parser');
const assert = require('assert');

const doc = parser.parseMarkdownFile('examples/content/post1.md');
assert(doc.meta.title === 'Hello World', 'Title should parse');
assert(doc.html.includes('<p>This is a sample post'), 'HTML body expected');
console.log('parser tests passed');
