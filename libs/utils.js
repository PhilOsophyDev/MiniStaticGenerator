const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

function copyDir(srcDir, dstDir) {
  if(!fs.existsSync(srcDir)) return;
  ensureDir(dstDir);
  const entries = fs.readdirSync(srcDir);
  entries.forEach(e => {
    const s = path.join(srcDir, e);
    const d = path.join(dstDir, e);
    const st = fs.statSync(s);
    if(st.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  });
}

// Find asset references in rendered HTML (images) and copy them to output assets
function findImageSrcs(html) {
  const re = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
  const srcs = [];
  let m;
  while((m = re.exec(html)) !== null) srcs.push(m[1]);
  return srcs;
}

module.exports = { ensureDir, copyFile, copyDir, findImageSrcs };
