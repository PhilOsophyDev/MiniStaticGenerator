const path = require('path');
const Generator = require('./generator');

const args = process.argv.slice(2);
const configPath = args[0] || 'examples/site-config.json';

try {
  const g = new Generator(configPath);
  g.build();
  console.log('Site generated successfully in ./output');
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}