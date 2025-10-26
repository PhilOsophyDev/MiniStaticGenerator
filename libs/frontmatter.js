// Very small front-matter extractor
function extract(text) {
  // Accepts leading ---\nkey: value\n---\ncontent
  const lines = text.split('\n');
  if(lines[0].trim() === '---') {
    let i = 1;
    const meta = {};
    for(; i<lines.length; i++) {
      const line = lines[i];
      if(line.trim() === '---') { i++; break; }
      const idx = line.indexOf(':');
      if(idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx+1).trim();
        meta[key] = val;
      }
    }
    const body = lines.slice(i).join('\n');
    return { meta, body };
  } else {
    return { meta: {}, body: text };
  }
}

module.exports = { extract };
