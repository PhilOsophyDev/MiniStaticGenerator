const fs = require('fs');
const path = require('path');
const parser = require('./lib/parser');
const renderer = require('./lib/renderer');
const utils = require('./lib/utils');

class Generator {
  constructor(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    // fallback options
    this.templatesDir = this.config.templatesDir || 'templates';
    this.contentDir = this.config.contentDir || 'examples/content';
    this.assetsDir = this.config.assetsDir || 'examples/assets';
    this.outputDir = this.config.outputDir || 'output';
  }

  build() {
    // ensure output
    utils.ensureDir(this.outputDir);
    // copy static assets (base)
    utils.copyDir(this.assetsDir, path.join(this.outputDir, 'assets'));

    const files = fs.readdirSync(this.contentDir).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const full = path.join(this.contentDir, file);
      const doc = parser.parseMarkdownFile(full);
      // render with templates; renderer handles partials/includes and asset copying
      const html = renderer.render(doc, {
        templatesDir: this.templatesDir,
        outputDir: this.outputDir,
        contentPath: this.contentDir,
        assetsDir: this.assetsDir
      });
      const outname = file.replace(/\.md$/, '.html');
      fs.writeFileSync(path.join(this.outputDir, outname), html, 'utf8');
    });
  }
}

module.exports = Generator;
