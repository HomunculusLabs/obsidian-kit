#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue.bold('🔄 Obsidian Kit Rollback'));
console.log(chalk.gray('='.repeat(50)));

function getAvailableVersions() {
  try {
    const versions = execSync('npm view obsidian-kit versions --json', {
      encoding: 'utf8',
    });
    return JSON.parse(versions).reverse(); // Show newest first
  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not fetch versions from NPM'));
    return [];
  }
}

function getCurrentVersion() {
  try {
    const version = execSync('obsidian-kit --version', {
      encoding: 'utf8',
    });
    return version.trim();
  } catch (error) {
    return 'unknown';
  }
}

function rollbackToVersion(targetVersion) {
  console.log(chalk.blue(`\n🔄 Rolling back to version ${targetVersion}`));

  try {
    // Uninstall current version
    console.log(chalk.blue('📦 Uninstalling current version...'));
    execSync('npm uninstall -g obsidian-kit', { stdio: 'inherit' });

    // Install target version
    console.log(chalk.blue(`📦 Installing obsidian-kit@${targetVersion}...`));
    execSync(`npm install -g obsidian-kit@${targetVersion}`, { stdio: 'inherit' });

    // Verify installation
    console.log(chalk.blue('🔍 Verifying installation...'));
    const newVersion = execSync('obsidian-kit --version', {
      encoding: 'utf8',
    }).trim();

    if (newVersion === targetVersion) {
      console.log(chalk.green(`✅ Successfully rolled back to version ${targetVersion}`));
      return true;
    } else {
      console.log(chalk.red(`❌ Version mismatch. Expected ${targetVersion}, got ${newVersion}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Rollback failed: ${error.message}`));
    return false;
  }
}

function createRollbackLog(fromVersion, toVersion, success) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    fromVersion,
    toVersion,
    success,
    user: process.env.USER || 'unknown',
  };

  const logDir = 'deploy-backups/rollback-logs';
  fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, 'rollback-history.json');
  let logs = [];

  if (fs.existsSync(logFile)) {
    logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  }

  logs.push(logEntry);

  // Keep only last 50 entries
  if (logs.length > 50) {
    logs = logs.slice(-50);
  }

  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

function showRollbackHistory() {
  const logFile = 'deploy-backups/rollback-logs/rollback-history.json';

  if (!fs.existsSync(logFile)) {
    console.log(chalk.yellow('No rollback history found'));
    return;
  }

  const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));

  console.log(chalk.blue('\n📜 Rollback History'));
  console.log(chalk.gray('-'.repeat(50)));

  logs.reverse().forEach(log => {
    const status = log.success ? '✅' : '❌';
    const date = new Date(log.timestamp).toLocaleString();
    console.log(`${status} ${date} - ${log.fromVersion} → ${log.toVersion} (${log.user})`);
  });
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'history') {
    showRollbackHistory();
    return;
  }

  const currentVersion = getCurrentVersion();
  console.log(chalk.blue(`Current version: ${currentVersion}`));

  if (command === 'list' || !command) {
    const versions = getAvailableVersions();

    if (versions.length === 0) {
      console.log(chalk.red('No versions available for rollback'));
      process.exit(1);
    }

    console.log(chalk.blue('\n📋 Available versions:'));
    versions.forEach((version, index) => {
      const isCurrent = version === currentVersion;
      const marker = isCurrent ? ' (current)' : '';
      console.log(`  ${index + 1}. ${version}${marker}`);
    });

    if (!command) {
      console.log(chalk.blue('\nUsage:'));
      console.log('  node scripts/rollback.js <version>  # Rollback to specific version');
      console.log('  node scripts/rollback.js list       # Show available versions');
      console.log('  node scripts/rollback.js history    # Show rollback history');
    }

    return;
  }

  // Check if the target version exists
  const versions = getAvailableVersions();
  if (!versions.includes(command)) {
    console.log(chalk.red(`❌ Version ${command} not found`));
    console.log(chalk.blue('Available versions:'));
    versions.forEach(v => console.log(`  - ${v}`));
    process.exit(1);
  }

  // Perform rollback
  const success = rollbackToVersion(command);

  // Log the rollback
  createRollbackLog(currentVersion, command, success);

  if (success) {
    console.log(chalk.green.bold('\n🎉 Rollback completed successfully!'));
    console.log(chalk.gray('='.repeat(50)));
  } else {
    console.log(chalk.red.bold('\n💥 Rollback failed!'));
    console.log(chalk.gray('='.repeat(50)));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  rollbackToVersion,
  getAvailableVersions,
  getCurrentVersion,
};
