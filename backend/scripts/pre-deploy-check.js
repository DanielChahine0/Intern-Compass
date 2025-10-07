#!/usr/bin/env node

/**
 * Pre-deployment checklist script
 * Run this before deploying to catch common issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Pre-Deployment Checks...\n');

let hasErrors = false;
let warnings = 0;

// Check 1: Backend package.json
console.log('✓ Checking backend package.json...');
const backendPkg = require('../package.json');
if (!backendPkg.scripts.build) {
  console.error('  ❌ Missing "build" script in backend package.json');
  hasErrors = true;
}
if (!backendPkg.scripts.start) {
  console.error('  ❌ Missing "start" script in backend package.json');
  hasErrors = true;
}

// Check 2: Frontend package.json
console.log('✓ Checking frontend package.json...');
const frontendPkg = require('../../frontend/package.json');
if (!frontendPkg.scripts.build) {
  console.error('  ❌ Missing "build" script in frontend package.json');
  hasErrors = true;
}

// Check 3: TypeScript config
console.log('✓ Checking TypeScript configuration...');
if (!fs.existsSync(path.join(__dirname, '../tsconfig.json'))) {
  console.error('  ❌ Missing tsconfig.json in backend');
  hasErrors = true;
}

// Check 4: Required files
console.log('✓ Checking required files...');
const requiredFiles = [
  '../../render.yaml',
  '../../netlify.toml',
  '../../vercel.json',
  '../Dockerfile',
  '../src/database.ts',
  '../src/index.ts',
  '../../frontend/public/_redirects'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Missing ${file}`);
    warnings++;
  }
});

// Check 5: Database migrations
console.log('✓ Checking database migrations...');
const migrationFile = path.join(__dirname, '../src/db/migrations/001_enhanced_rag_schema.sql');
if (!fs.existsSync(migrationFile)) {
  console.error('  ❌ Missing database migration file');
  hasErrors = true;
}

// Check 6: Environment variable documentation
console.log('✓ Checking environment documentation...');
if (!fs.existsSync(path.join(__dirname, '../../DEPLOYMENT.md'))) {
  console.warn('  ⚠️  Missing DEPLOYMENT.md');
  warnings++;
}

// Check 7: .gitignore
console.log('✓ Checking .gitignore...');
const gitignorePath = path.join(__dirname, '../../.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignore.includes('.env')) {
    console.error('  ❌ .gitignore should include .env files');
    hasErrors = true;
  }
  if (!gitignore.includes('node_modules')) {
    console.error('  ❌ .gitignore should include node_modules');
    hasErrors = true;
  }
}

// Check 8: Build test
console.log('✓ Testing TypeScript build...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
  console.log('  ✅ Backend builds successfully');
} catch (error) {
  console.error('  ❌ Backend build failed');
  console.error(`  ${error.message}`);
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error(`\n❌ Pre-deployment check FAILED with errors`);
  console.error('   Please fix the errors above before deploying\n');
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`\n⚠️  Pre-deployment check passed with ${warnings} warning(s)`);
  console.warn('   Review warnings above\n');
  process.exit(0);
} else {
  console.log('\n✅ All pre-deployment checks passed!');
  console.log('   Your app is ready to deploy\n');
  process.exit(0);
}
