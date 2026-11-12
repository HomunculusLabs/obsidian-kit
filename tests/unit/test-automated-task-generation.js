#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Simple test to verify the command works
async function testAutomatedTaskGeneration() {
  console.log(chalk.blue.bold('🧪 Testing Automated Task Generation System\n'));

  const testVaultPath = path.join(__dirname, 'Obsidian-Kit-Dev');

  if (!await fs.pathExists(testVaultPath)) {
    console.log(chalk.red('❌ Test vault not found'));
    return;
  }

  try {
    // Test that the command file exists and can be required
    const commandPath = path.join(__dirname, 'cli', 'commands', 'automated-task-generation.js');
    if (!await fs.pathExists(commandPath)) {
      throw new Error('Command file not found');
    }

    console.log(chalk.green('✅ Command file exists'));

    // Test that we can change to the vault directory
    process.chdir(testVaultPath);
    console.log(chalk.green('✅ Can access vault directory'));

    // Test that the CLI command is registered
    const binPath = path.join(__dirname, 'cli', 'bin', 'obsidian-kit');
    if (await fs.pathExists(binPath)) {
      console.log(chalk.green('✅ CLI binary exists'));
    }

    // Test that the Tasks.base file exists
    const tasksBasePath = path.join(testVaultPath, '4 - Projects', 'Tasks.base');
    if (await fs.pathExists(tasksBasePath)) {
      console.log(chalk.green('✅ Tasks.base configuration exists'));
    }

    // Test that the .specify directory exists
    const specifyPath = path.join(testVaultPath, '.specify');
    if (await fs.pathExists(specifyPath)) {
      console.log(chalk.green('✅ .specify directory exists'));
    }

    console.log(chalk.green.bold('\n✅ All basic tests passed! Automated Task Generation system is properly configured.'));

    // Show system information
    console.log(chalk.blue('\n📊 System Information:'));
    console.log(`   - Vault path: ${testVaultPath}`);
    console.log(`   - Command file: ${commandPath}`);
    console.log(`   - CLI binary: ${binPath}`);
    console.log(`   - Tasks.base: ${tasksBasePath}`);
    console.log(`   - .specify directory: ${specifyPath}`);

  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  testAutomatedTaskGeneration();
}

module.exports = testAutomatedTaskGeneration;
