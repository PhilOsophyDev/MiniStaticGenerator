const fs = require('fs');
const path = require('path');
const utils = require('./utils');

/**
 * Rendering rules:
 * - layout.html is the base template with {{content}} placeholder
 * - templates can contain partial includes: {{> partials/header.html}} or {{> partials/footer.html}}
 * - placeholders for metadata: {{title}} will be replaced from meta
 * - when rendering HTML content, image srcs that are local (relative) are copied into output/assets and rewritten
 */

function loadTemplate(templatesDir, name) {
  const p = path.join(templatesDir, name);
  if(!fs.existsSync(p)) throw new Error('Template not found: ' + p);
  return fs.readFileSync(p, 'utf8');
}

function resolvePartials(tmpl, templatesDir, seen = new Set()) {
  return tmpl.replace(/{{>\s*([^}]+)\s*}}/g, (m, inc) => {
    const incPath = inc.trim();
    if(seen.has(incPath)) return '';
    seen.add(incPath);
    const content = loadTemplate(templatesDir, incPath);
    return resolvePartials(content, templatesDir, seen);
  });
}


function applyPlaceholders(tmpl, meta, content) {
  let out = tmpl.replace(/{{\s*content\s*}}/g, content);
  // simple meta placeholders e.g. {{title}}
  out = out.replace(/{{\s*([^}\s]+)\s*}}/g, (m, key) => {
    if(key === 'content') return content;
    return meta[key] || '';
  });
  return out;
}

function rewriteAndCopyAssets(html, options) {
  const srcs = utils.findImageSrcs(html);
  let out = html;
  srcs.forEach(src => {
    if(src.startsWith('http://') || src.startsWith('https://')) return;
    let candidate = path.join(options.contentPath, src);
    if(!fs.existsSync(candidate)) {
      candidate = path.join(options.assetsDir, src);
    }
    if(fs.existsSync(candidate)) {
      const destRel = path.posix.join('assets', path.basename(src));
      const destFull = path.join(options.outputDir, destRel);
      utils.copyFile(candidate, destFull);
      out = out.split(src).join(destRel);
    }
  });
  return out;
}

function render(doc, opts = {}) {
  const templatesDir = opts.templatesDir || 'templates';
  const outputDir = opts.outputDir || 'output';
  const contentPath = opts.contentPath || 'examples/content';
  const assetsDir = opts.assetsDir || 'examples/assets';
  const layout = loadTemplate(templatesDir, 'layout.html');
  // ensure partials resolved in post template too
  const postTmplRaw = loadTemplate(templatesDir, 'post.html');
  const postTmpl = resolvePartials(postTmplRaw, templatesDir);
  const filled = applyPlaceholders(postTmpl, doc.meta, doc.html);
  // place content into layout
  const layoutResolved = resolvePartials(layout, templatesDir);
  let final = applyPlaceholders(layoutResolved, doc.meta, filled);
  // rewrite image links and copy assets
  final = rewriteAndCopyAssets(final, { outputDir, contentPath, assetsDir });
  return final;
}

module.exports = { render };
