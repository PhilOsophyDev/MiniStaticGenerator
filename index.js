const path = require('path');
const Generator = require('./generator');

// --- Enhancement 1: Handle command line arguments and provide help ---
const args = process.argv.slice(2);
const helpFlag = args.includes('--help') || args.includes('-h');

if (helpFlag) {
  console.log('Usage: node index.js [path/to/config.json]');
  console.log('\n  If no config path is provided, it defaults to examples/site-config.json.');
  process.exit(0);
}

// Determine the configuration file path
// Use path.resolve for robustness, ensuring the path is relative to the current working directory
const configPath = path.resolve(args[0] || 'examples/site-config.json');
// --- End Enhancement 1 ---

// --- Enhancement 2: Start timer for performance feedback ---
const startTime = process.hrtime();
// --- End Enhancement 2 ---

try {
  console.log(`\n📄 Starting site generation using config: ${configPath}`);
  
  const g = new Generator(configPath);
  g.build();

  // --- Enhancement 3: Calculate and display build time ---
  const endTime = process.hrtime(startTime);
  const duration = (endTime[0] + endTime[1] / 1e9).toFixed(2); 

  console.log(`\n🎉 Site generated successfully in **${g.outputDir}**`);
  console.log(`⏱️ Build finished in **${duration} seconds**`);
  // --- End Enhancement 3 ---

} catch (err) {
  // --- Enhancement 4: Detailed error logging and exit ---
  console.error('\n❌ **Build failed!**');
  console.error(`Error: ${err.message}`);
  // Log the stack trace for deeper debugging if not a simple file not found error
  if (err.code !== 'ENOENT') {
    console.error(err);
  }
  process.exit(1);
}
