const fs = require('fs');
const path = require('path');
const parser = require('./lib/parser');
const renderer = require('./lib/renderer');
const utils = require('./lib/utils');

class Generator {
  constructor(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // --- Configuration Enhancements ---
    // Define all directories with robust fallbacks
    this.templatesDir = this.config.templatesDir || 'templates';
    this.layoutsDir = this.config.layoutsDir || path.join(this.templatesDir, 'layouts'); 
    this.partialsDir = this.config.partialsDir || path.join(this.templatesDir, 'partials'); 
    
    this.contentDir = this.config.contentDir || 'examples/content';
    this.dataDir = this.config.dataDir || 'data'; // New: Directory for static site data
    
    this.assetsDir = this.config.assetsDir || 'examples/assets';
    this.staticDir = this.config.staticDir || 'static'; // New: Directory for static files to copy directly
    this.outputDir = this.config.outputDir || 'output';
    // --- End Configuration Enhancements ---
  }

  build() {
    // 1. Ensure output directory exists
    utils.ensureDir(this.outputDir);
    
    // 2. Copy static assets (those that need processing, like images/js/css)
    utils.copyDir(this.assetsDir, path.join(this.outputDir, 'assets'));

    // --- New: Copy entirely static files (like favicons, verification files) ---
    // If staticDir exists, copy its contents directly to the root of the output directory
    if (fs.existsSync(this.staticDir)) {
      utils.copyDir(this.staticDir, this.outputDir);
    }
    // --- End New Copy ---

    // 3. Process content files
    // Use path.resolve to ensure absolute paths for robustness
    const contentPath = path.resolve(this.contentDir); 
    const files = fs.readdirSync(contentPath).filter(f => f.endsWith('.md'));

    files.forEach(file => {
      const fullPath = path.join(contentPath, file);
      
      // Use parser for content and potential front matter
      const doc = parser.parseMarkdownFile(fullPath); 
      
      // --- Enhancement: Pass all necessary paths to the renderer ---
      const html = renderer.render(doc, {
        templatesDir: this.templatesDir,
        layoutsDir: this.layoutsDir,     // Added
        partialsDir: this.partialsDir,   // Added
        dataDir: this.dataDir,           // Added (though implementation would be in renderer)
        outputDir: this.outputDir,
        contentPath: this.contentDir,
        assetsDir: this.assetsDir
      });
      // --- End Enhancement ---

      // Determine output filename and write file
      const outname = file.replace(/\.md$/, '.html');
      fs.writeFileSync(path.join(this.outputDir, outname), html, 'utf8');
    });
  }
}

module.exports = Generator;
