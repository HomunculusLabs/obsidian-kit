#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

console.log(chalk.blue.bold('🚀 Obsidian Kit Deployment'));
console.log(chalk.gray('='.repeat(50)));

const config = {
  production: {
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    publishCommand: 'npm publish',
    registry: 'https://registry.npmjs.org',
  },
  staging: {
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    publishCommand: 'npm publish --tag beta',
    registry: 'https://registry.npmjs.org',
  },
};

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function checkPreDeploymentRequirements() {
  console.log(chalk.blue('\n🔍 Pre-deployment checks'));

  const checks = [
    {
      name: 'Clean working directory',
      check: () => {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.trim() === '';
      },
    },
    {
      name: 'Node.js version compatibility',
      check: () => {
        const nodeVersion = process.version;
        return semver.satisfies(nodeVersion, '>=16.0.0');
      },
    },
    {
      name: 'Dependencies installed',
      check: () => {
        return fs.existsSync('node_modules');
      },
    },
    {
      name: 'Build artifacts clean',
      check: () => {
        return !fs.existsSync('dist') || fs.readdirSync('dist').length === 0;
      },
    },
  ];

  let allPassed = true;
  checks.forEach(({ name, check }) => {
    try {
      const passed = check();
      if (passed) {
        console.log(chalk.green(`  ✓ ${name}`));
      } else {
        console.log(chalk.red(`  ❌ ${name}`));
        allPassed = false;
      }
    } catch (error) {
      console.log(chalk.red(`  ❌ ${name} - ${error.message}`));
      allPassed = false;
    }
  });

  if (!allPassed) {
    console.log(chalk.red('\n❌ Pre-deployment checks failed'));
    process.exit(1);
  }
}

function runQualityChecks() {
  console.log(chalk.blue('\n🔍 Running quality checks'));

  try {
    execSync('node scripts/check-quality.js', { stdio: 'inherit' });
    console.log(chalk.green('✅ Quality checks passed'));
  } catch (error) {
    console.log(chalk.red('❌ Quality checks failed'));
    process.exit(1);
  }
}

function buildProject() {
  console.log(chalk.blue('\n🔨 Building project'));

  try {
    execSync('npm run clean', { stdio: 'inherit' });
    execSync('npm run build', { stdio: 'inherit' });
    console.log(chalk.green('✅ Build completed'));
  } catch (error) {
    console.log(chalk.red('❌ Build failed'));
    process.exit(1);
  }
}

function runTests() {
  console.log(chalk.blue('\n🧪 Running tests'));

  try {
    execSync('npm test', { stdio: 'inherit' });
    console.log(chalk.green('✅ All tests passed'));
  } catch (error) {
    console.log(chalk.red('❌ Tests failed'));
    process.exit(1);
  }
}

function createDeploymentArtifacts() {
  console.log(chalk.blue('\n📦 Creating deployment artifacts'));

  try {
    // Create package for distribution
    execSync('npm pack', { stdio: 'inherit' });

    // Create checksum
    const packageFiles = fs.readdirSync('.').filter(f => f.endsWith('.tgz'));
    const packageFile = packageFiles[0];

    if (packageFile) {
      const crypto = require('crypto');
      const fileBuffer = fs.readFileSync(packageFile);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(fileBuffer);
      const checksum = hashSum.digest('hex');

      fs.writeFileSync(`${packageFile}.sha256`, checksum);
      console.log(chalk.green(`✅ Created ${packageFile} with checksum`));
    }
  } catch (error) {
    console.log(chalk.red('❌ Artifact creation failed'));
    process.exit(1);
  }
}

function deployToEnvironment(environment) {
  console.log(chalk.blue(`\n🚀 Deploying to ${environment}`));

  const envConfig = config[environment];
  if (!envConfig) {
    console.log(chalk.red(`❌ Unknown environment: ${environment}`));
    process.exit(1);
  }

  try {
    if (environment === 'production') {
      // Additional production checks
      const version = getCurrentVersion();
      if (version.includes('-') || version.includes('alpha') || version.includes('beta')) {
        throw new Error('Production releases must have stable version numbers (no pre-release tags)');
      }

      // Check if tag already exists
      try {
        execSync(`git tag -l v${version}`, { encoding: 'utf8' });
        throw new Error(`Tag v${version} already exists`);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          // Tag doesn't exist, which is good
        } else {
          throw error;
        }
      }
    }

    // Publish to NPM
    execSync(envConfig.publishCommand, { stdio: 'inherit' });

    // Create and push git tag
    const version = getCurrentVersion();
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });

    console.log(chalk.green(`✅ Deployed to ${environment}`));
  } catch (error) {
    console.log(chalk.red(`❌ Deployment to ${environment} failed: ${error.message}`));
    process.exit(1);
  }
}

function createRollbackBackup() {
  console.log(chalk.blue('\n💾 Creating rollback backup'));

  const version = getCurrentVersion();
  const backupDir = `deploy-backups/${version}-${Date.now()}`;

  try {
    fs.mkdirSync(backupDir, { recursive: true });

    // Backup current package.json
    fs.copyFileSync('package.json', path.join(backupDir, 'package.json'));

    // Backup built artifacts
    if (fs.existsSync('dist')) {
      fs.cpSync('dist', path.join(backupDir, 'dist'), { recursive: true });
    }

    // Create rollback script
    const rollbackScript = `#!/bin/bash
# Rollback script for version ${version}
echo "🔄 Rolling back from version ${version}"

# Uninstall current version
npm uninstall -g obsidian-kit

# Install previous version (you need to specify the version)
# npm install -g obsidian-kit@PREVIOUS_VERSION

echo "✅ Rollback completed"
`;

    fs.writeFileSync(path.join(backupDir, 'rollback.sh'), rollbackScript);
    fs.chmodSync(path.join(backupDir, 'rollback.sh'), '755');

    console.log(chalk.green(`✅ Rollback backup created at ${backupDir}`));
  } catch (error) {
    console.log(chalk.yellow(`⚠️  Warning: Could not create rollback backup: ${error.message}`));
  }
}

function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'staging';

  if (!['staging', 'production'].includes(environment)) {
    console.log(chalk.red('❌ Environment must be "staging" or "production"'));
    process.exit(1);
  }

  console.log(chalk.blue('📋 Deployment Configuration:'));
  console.log(`  Environment: ${environment}`);
  console.log(`  Version: ${getCurrentVersion()}`);
  console.log(`  Node.js: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);

  try {
    checkPreDeploymentRequirements();
    runQualityChecks();
    buildProject();
    runTests();
    createDeploymentArtifacts();
    createRollbackBackup();
    deployToEnvironment(environment);

    console.log(chalk.green.bold('\n🎉 Deployment completed successfully!'));
    console.log(chalk.gray('='.repeat(50)));

    if (environment === 'production') {
      console.log(chalk.blue('📊 Production deployment summary:'));
      console.log(`  • Version ${getCurrentVersion()} published to NPM`);
      console.log(`  • Git tag v${getCurrentVersion()} created and pushed`);
      console.log('  • Rollback backup available');
    }

  } catch (error) {
    console.log(chalk.red.bold('\n💥 Deployment failed!'));
    console.log(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  deployToEnvironment,
  checkPreDeploymentRequirements,
  runQualityChecks,
  buildProject,
  runTests,
};
