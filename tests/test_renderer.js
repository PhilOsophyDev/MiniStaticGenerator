const fs = require('fs');
const renderer = require('../lib/renderer');
const parser = require('../lib/parser');
const utils = require('../lib/utils');
const path = require('path');

utils.ensureDir('output');
const doc = parser.parseMarkdownFile('examples/content/post1.md');
const html = renderer.render(doc, {
  templatesDir: 'templates',
  outputDir: 'output',
  contentPath: 'examples/content',
  assetsDir: 'examples/assets'
});
fs.writeFileSync('output/test_output.html', html, 'utf8');
console.log('renderer test completed: output/test_output.html written');
