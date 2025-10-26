#!/usr/bin/env node
const { spawnSync } = require('child_process');
const args = process.argv.slice(2);
const cfg = args[0] || 'examples/site-config.json';
const res = spawnSync('node', ['index.js', cfg], { stdio: 'inherit' });
process.exit(res.status);
