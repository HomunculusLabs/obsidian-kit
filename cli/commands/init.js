const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { validateProjectName, validateDirectoryPath } = require('../utils/validation');

async function initCommand(projectName, options) {
  console.log(chalk.blue.bold('\n🧠 Obsidian Kit - Project Initialization\n'));

  try {
    // Determine project name and directory
    const name = projectName ? validateProjectName(projectName) : await promptForProjectName();
    const baseDir = options.dir ? validateDirectoryPath(options.dir) : process.cwd();
    const targetDir = path.join(baseDir, name);

  // Check if directory exists and is not empty
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0 && !options.force) {
    const shouldContinue = await confirmOverwrite(targetDir);
    if (!shouldContinue) {
      console.log(chalk.yellow('❌ Initialization cancelled.'));
      return;
    }
  }

  try {
    console.log(chalk.cyan(`📁 Creating project vault: ${name}`));
    console.log(chalk.gray(`   Target directory: ${targetDir}\n`));

    // Create target directory
    await fs.ensureDir(targetDir);

    // Copy vault template
    const templateDir = path.join(__dirname, '../../vault-template');
    await fs.copy(templateDir, targetDir);

    // Update project-specific files
    await updateProjectFiles(targetDir, name);

    console.log(chalk.green.bold('✅ Project vault created successfully!\n'));

    console.log(chalk.yellow('📋 Next Steps:'));
    console.log(`1. cd ${path.relative(process.cwd(), targetDir)}`);
    console.log('2. Open with Obsidian');
    console.log('3. Run: obsidian-kit add-mcp --vault-name ' + name);
    console.log('4. Start building your project!\n');

    console.log(chalk.gray('📚 Vault Structure:'));
    console.log('   1 - Source Materials/    # Books, docs, references');
    console.log('   2 - Daily Notes/         # Daily task overviews');
    console.log('   3 - Templates/           # Project & task templates');
    console.log('   4 - Projects/            # Main project management');
    console.log('   claude/                  # AI agent configuration');
    console.log('   .specify/                # Spec-driven development\n');

  } catch (error) {
    console.error(chalk.red('❌ Error creating project vault:'), error.message);
    process.exit(1);
  }
  } catch (validationError) {
    console.error(chalk.red('❌ Validation error:'), validationError.message);
    process.exit(1);
  }
}

async function promptForProjectName() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      validate: (input) => {
        try {
          validateProjectName(input);
          return true;
        } catch (error) {
          return error.message;
        }
      }
    }
  ]);
  return validateProjectName(name);
}

async function confirmOverwrite(targetDir) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Directory ${targetDir} is not empty. Continue anyway?`,
      default: false
    }
  ]);
  return confirm;
}

async function updateProjectFiles(targetDir, projectName) {
  // Update constitution with project name
  const constitutionPath = path.join(targetDir, '.specify/memory/constitution.md');
  if (fs.existsSync(constitutionPath)) {
    let content = await fs.readFile(constitutionPath, 'utf8');
    content = content.replace('[PROJECT_VISION_PLACEHOLDER - replace with specific project goals]',
                             `${projectName} - [Define your project vision here]`);
    content = content.replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);
    await fs.writeFile(constitutionPath, content);
  }

  // Update agent config with current date
  const agentConfigPath = path.join(targetDir, 'claude/agents.md');
  if (fs.existsSync(agentConfigPath)) {
    let content = await fs.readFile(agentConfigPath, 'utf8');
    content = content.replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);
    await fs.writeFile(agentConfigPath, content);
  }

  // Update MCP config with project name
  const mcpConfigPath = path.join(targetDir, 'mcp-config.json');
  if (fs.existsSync(mcpConfigPath)) {
    const mcpConfig = await fs.readJson(mcpConfigPath);
    mcpConfig.server.env.OBSIDIAN_VAULT_NAME = projectName;
    mcpConfig.claude_config_template.mcpServers.obsidian.env.OBSIDIAN_VAULT_NAME = projectName;
    await fs.writeJson(mcpConfigPath, mcpConfig, { spaces: 2 });
  }

  console.log(chalk.green('   ✓ Updated project configuration files'));
}

module.exports = initCommand;