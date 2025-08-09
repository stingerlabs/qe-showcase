// runner.js (CommonJS)
const fs = require('fs');
const path = require('path');
const newman = require('newman');

const collectionPath = process.env.COLLECTION || path.resolve(__dirname, 'collections/posts.postman_collection.json');
const environmentPath = process.env.ENV || path.resolve(__dirname, 'environments/posts-env.postman_environment.json');
const testsPath = path.resolve(__dirname, 'tests/posts.test.js');

console.log('▶ Using:');
console.log('  collection =', collectionPath);
console.log('  environment =', environmentPath);
console.log('  tests =', testsPath);

// Load JSONs with clear error messages
function readJson(p) {
  try {
    const txt = fs.readFileSync(p, 'utf8');
    return JSON.parse(txt);
  } catch (e) {
    console.error('✖ Failed to read/parse', p, '\n', e);
    process.exit(1);
  }
}

const collection = readJson(collectionPath);
const environment = readJson(environmentPath);

// Load external tests
let ext;
try {
  ext = require(testsPath);
  console.log('✅ Loaded external tests');
} catch (e) {
  console.error('✖ Failed to load tests file', testsPath, '\n', e);
  process.exit(1);
}

console.log('▶ Starting Newman…');
newman
  .run({ collection, environment, reporters: 'cli' }, (err) => {
    if (err) {
      console.error('✖ Newman run error:', err);
      process.exit(1);
    }
  })
  .on('beforeRequest', (err, args) => {
    if (!err && ext.beforeRequest) ext.beforeRequest(args);
  })
  .on('request', (err, args) => {
    if (err) {
      console.error('✖ Request error:', err);
      process.exitCode = 1;
      return;
    }
    if (ext.onRequest) ext.onRequest(args);
  })
  .on('start', () => console.log('… running'))
  .on('done', (err, summary) => {
    if (err) {
      console.error('✖ Run failed:', err);
      process.exit(1);
    }
    const failures = summary.run.failures || [];
    if (failures.length) {
      console.error(`\n❌ ${failures.length} failure(s).`);
      process.exit(1);
    } else {
      console.log('\n✅ All external tests passed.');
    }
  });
