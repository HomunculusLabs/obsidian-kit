#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('🚀 Obsidian Kit Development Environment Setup'));
console.log(chalk.gray('='.repeat(50)));

const projectDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(projectDir, 'package.json');

function checkCommand(command, name) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    console.log(chalk.green(`✓ ${name} is installed`));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ ${name} is not installed`));
    return false;
  }
}

function runCommand(command, description) {
  console.log(chalk.blue(`\n📦 ${description}...`));
  try {
    execSync(command, { stdio: 'inherit', cwd: projectDir });
    console.log(chalk.green(`✓ ${description} completed`));
  } catch (error) {
    console.log(chalk.red(`✗ ${description} failed`));
    process.exit(1);
  }
}

function createDevConfig() {
  console.log(chalk.blue('\n🔧 Creating development configuration...'));
  
  const vsCodeDir = path.join(projectDir, '.vscode');
  if (!fs.existsSync(vsCodeDir)) {
    fs.mkdirSync(vsCodeDir, { recursive: true });
  }
  
  const vsCodeSettings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true,
    },
    'typescript.preferences.importModuleSpecifier': 'relative',
    'files.exclude': {
      '**/node_modules': true,
      '**/dist': true,
      '**/.git': true,
    },
  };
  
  fs.writeFileSync(
    path.join(vsCodeDir, 'settings.json'),
    JSON.stringify(vsCodeSettings, null, 2)
  );
  
  const vsCodeExtensions = {
    'recommendations': [
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
      'ms-vscode.vscode-typescript-next',
      'bradlc.vscode-tailwindcss',
      'ms-vscode.vscode-json',
    ],
  };
  
  fs.writeFileSync(
    path.join(vsCodeDir, 'extensions.json'),
    JSON.stringify(vsCodeExtensions, null, 2)
  );
  
  console.log(chalk.green('✓ VS Code configuration created'));
}

function createGitHooks() {
  console.log(chalk.blue('\n🪝 Setting up Git hooks...'));
  
  try {
    execSync('npx husky install', { stdio: 'inherit', cwd: projectDir });
    console.log(chalk.green('✓ Git hooks installed'));
  } catch (error) {
    console.log(chalk.yellow('⚠ Git hooks setup failed (husky may not be installed)'));
  }
}

function verifySetup() {
  console.log(chalk.blue('\n🔍 Verifying setup...'));
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    '.eslintrc.js',
    '.prettierrc',
    '.gitignore',
  ];
  
  const requiredDirs = [
    'cli',
    'scripts',
    'tests',
  ];
  
  let allGood = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(projectDir, file))) {
      console.log(chalk.green(`✓ ${file} exists`));
    } else {
      console.log(chalk.red(`✗ ${file} missing`));
      allGood = false;
    }
  });
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(path.join(projectDir, dir))) {
      console.log(chalk.green(`✓ ${dir}/ exists`));
    } else {
      console.log(chalk.red(`✗ ${dir}/ missing`));
      allGood = false;
    }
  });
  
  return allGood;
}

function showNextSteps() {
  console.log(chalk.blue.bold('\n🎯 Setup Complete! Next Steps:'));
  console.log('');
  console.log(chalk.cyan('Development Commands:'));
  console.log('  npm run dev              # Run CLI in development mode');
  console.log('  npm run build            # Build the project');
  console.log('  npm run test             # Run tests');
  console.log('  npm run test:watch       # Run tests in watch mode');
  console.log('  npm run lint             # Lint and fix code');
  console.log('  npm run typecheck        # Type checking');
  console.log('  npm run format           # Format code');
  console.log('');
  console.log(chalk.cyan('Testing:'));
  console.log('  npm run test:coverage    # Run tests with coverage');
  console.log('  npm run precommit        # Run pre-commit checks');
  console.log('');
  console.log(chalk.cyan('Workflow:'));
  console.log('  1. Create a feature branch');
  console.log('  2. Make your changes');
  console.log('  3. Run tests and linting');
  console.log('  4. Commit your changes');
  console.log('  5. Push and create a PR');
  console.log('');
  console.log(chalk.green('Happy coding! 🚀'));
}

async function main() {
  console.log(chalk.blue('Checking prerequisites...'));
  
  const hasNode = checkCommand('node', 'Node.js');
  const hasNpm = checkCommand('npm', 'npm');
  const hasGit = checkCommand('git', 'Git');
  
  if (!hasNode || !hasNpm || !hasGit) {
    console.log(chalk.red('\n❌ Please install the missing prerequisites and try again.'));
    process.exit(1);
  }
  
  runCommand('npm install', 'Installing dependencies');
  
  createDevConfig();
  createGitHooks();
  
  runCommand('npm run build', 'Building project');
  runCommand('npm run lint:check', 'Checking code style');
  runCommand('npm run typecheck', 'Type checking');
  runCommand('npm test', 'Running tests');
  
  const isSetupValid = verifySetup();
  
  if (isSetupValid) {
    console.log(chalk.green.bold('\n✅ Development environment setup completed successfully!'));
    showNextSteps();
  } else {
    console.log(chalk.red.bold('\n❌ Setup verification failed. Please check the errors above.'));
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Setup failed:'), error);
    process.exit(1);
  });
}

module.exports = { main, verifySetup };