# MiniStaticGenerator

A minimal, modular static site generator implemented in Node.js. Intended for educational use and small demo sites.

## Features
- Parse Markdown files with YAML-like front-matter
- Simple templating using placeholders and partials/includes
- Image/asset handling: copies referenced assets and rewrites paths
- CLI to build a site from `examples/` to `output/`
- Easy to extend (add templates, transform functions)

## Install & Run
```bash
git clone https://github.com/<your-username>/mini-static-generator.git
cd mini-static-generator
npm install
npm run build
```

# or

```
node index.js examples/site-config.json
```


## Project layout
See /templates, /examples, /lib for core code.

## Contributing
See docs/CONTRIBUTING.md.
