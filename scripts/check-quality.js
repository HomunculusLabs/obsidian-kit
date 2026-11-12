#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue.bold('🔍 Code Quality Check'));
console.log(chalk.gray('='.repeat(40)));

const checks = [
  {
    name: 'TypeScript Compilation',
    command: 'npm run typecheck',
    critical: true,
  },
  {
    name: 'ESLint',
    command: 'npm run lint:check',
    critical: true,
  },
  {
    name: 'Prettier Formatting',
    command: 'npm run format:check',
    critical: false,
  },
  {
    name: 'Unit Tests',
    command: 'npm test -- --testPathPattern=unit',
    critical: true,
  },
  {
    name: 'Integration Tests',
    command: 'npm test -- --testPathPattern=integration',
    critical: true,
  },
  {
    name: 'Test Coverage',
    command: 'npm run test:coverage',
    critical: false,
  },
];

let failedChecks = [];
let criticalFailures = [];

checks.forEach((check) => {
  console.log(chalk.blue(`\n🔧 Running: ${check.name}`));
  
  try {
    execSync(check.command, { 
      stdio: 'inherit', 
      cwd: path.resolve(__dirname, '..') 
    });
    console.log(chalk.green(`✅ ${check.name} passed`));
  } catch (error) {
    console.log(chalk.red(`❌ ${check.name} failed`));
    failedChecks.push(check.name);
    if (check.critical) {
      criticalFailures.push(check.name);
    }
  }
});

console.log(chalk.blue.bold('\n📊 Quality Check Summary'));
console.log(chalk.gray('='.repeat(40)));

if (failedChecks.length === 0) {
  console.log(chalk.green.bold('🎉 All checks passed!'));
  process.exit(0);
} else {
  console.log(chalk.red(`\n❌ ${failedChecks.length} check(s) failed:`));
  failedChecks.forEach(check => {
    const icon = criticalFailures.includes(check) ? '🔴' : '🟡';
    console.log(chalk.red(`  ${icon} ${check}`));
  });
  
  if (criticalFailures.length > 0) {
    console.log(chalk.red.bold(`\n🚨 ${criticalFailures.length} critical failure(s) must be fixed before merging.`));
    process.exit(1);
  } else {
    console.log(chalk.yellow('\n⚠️  Non-critical issues found. Consider fixing them before merging.'));
    process.exit(0);
  }
}