const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const os = require('os');

async function mcpCommand(options) {
  console.log(chalk.blue.bold('\n🔗 Obsidian Kit - MCP Server Setup\n'));

  try {
    // Check if we're in a valid Obsidian Kit project
    const isValidProject = await checkValidProject();
    if (!isValidProject) {
      console.log(chalk.red('❌ This doesn\'t appear to be an Obsidian Kit project.'));
      console.log(chalk.gray('   Run "obsidian-kit init" first to create a project vault.\n'));
      return;
    }

    // Get MCP configuration
    const config = await getMCPConfiguration(options);

    // Update local MCP config file
    await updateLocalMCPConfig(config);

    // Install Obsidian MCP server if needed
    await installMCPServer();

    // Update Claude Desktop configuration
    await updateClaudeConfig(config);

    console.log(chalk.green.bold('✅ MCP server configuration completed!\n'));

    console.log(chalk.yellow('📋 Setup Summary:'));
    console.log(`   Vault Name: ${config.vaultName}`);
    console.log(`   API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'Not set'}`);
    console.log(`   MCP Server: Configured for Claude Desktop\n`);

    console.log(chalk.yellow('🔧 Required Manual Steps:'));
    console.log('1. Install Obsidian Local REST API plugin in Obsidian');
    console.log('2. Configure the plugin with your API key');
    console.log('3. Restart Claude Desktop app');
    console.log('4. Test the connection with: obsidian-kit status\n');

  } catch (error) {
    console.error(chalk.red('❌ Error configuring MCP server:'), error.message);
    process.exit(1);
  }
}

async function checkValidProject() {
  const mcpConfigPath = path.join(process.cwd(), 'mcp-config.json');
  const claudeConfigPath = path.join(process.cwd(), 'claude');

  return fs.existsSync(mcpConfigPath) && fs.existsSync(claudeConfigPath);
}

async function getMCPConfiguration(options) {
  const config = {};

  // Get vault name
  if (options.vaultName) {
    config.vaultName = options.vaultName;
  } else {
    // Try to get from existing config or prompt
    const mcpConfigPath = path.join(process.cwd(), 'mcp-config.json');
    if (fs.existsSync(mcpConfigPath)) {
      const existing = await fs.readJson(mcpConfigPath);
      config.vaultName = existing.server?.env?.OBSIDIAN_VAULT_NAME || path.basename(process.cwd());
    } else {
      config.vaultName = path.basename(process.cwd());
    }
  }

  // Get API key
  if (options.apiKey) {
    config.apiKey = options.apiKey;
  } else {
    const { apiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your Obsidian REST API key (or leave blank to set later):',
        mask: '*'
      }
    ]);
    config.apiKey = apiKey;
  }

  return config;
}

async function updateLocalMCPConfig(config) {
  const mcpConfigPath = path.join(process.cwd(), 'mcp-config.json');
  const mcpConfig = await fs.readJson(mcpConfigPath);

  // Update configuration
  mcpConfig.server.env.OBSIDIAN_VAULT_NAME = config.vaultName;
  if (config.apiKey) {
    mcpConfig.server.env.OBSIDIAN_REST_API_KEY = config.apiKey;
    mcpConfig.claude_config_template.mcpServers.obsidian.env.OBSIDIAN_REST_API_KEY = config.apiKey;
  }
  mcpConfig.claude_config_template.mcpServers.obsidian.env.OBSIDIAN_VAULT_NAME = config.vaultName;

  await fs.writeJson(mcpConfigPath, mcpConfig, { spaces: 2 });
  console.log(chalk.green('   ✓ Updated local MCP configuration'));
}

async function installMCPServer() {
  console.log(chalk.cyan('📦 Installing Obsidian MCP server...'));

  // For now, just show instructions. In a real implementation,
  // you might want to run npm install automatically
  console.log(chalk.gray('   To install manually: npm install -g @cyanheads/obsidian-mcp-server'));
  console.log(chalk.green('   ✓ MCP server installation noted'));
}

async function updateClaudeConfig(config) {
  const claudeConfigPath = getClaudeConfigPath();

  if (!claudeConfigPath) {
    console.log(chalk.yellow('⚠️  Could not locate Claude Desktop configuration.'));
    console.log(chalk.gray('   Please add the MCP server configuration manually.'));
    return;
  }

  try {
    let claudeConfig = {};
    if (fs.existsSync(claudeConfigPath)) {
      claudeConfig = await fs.readJson(claudeConfigPath);
    }

    // Initialize mcpServers if it doesn't exist
    if (!claudeConfig.mcpServers) {
      claudeConfig.mcpServers = {};
    }

    // Add obsidian server configuration
    claudeConfig.mcpServers.obsidian = {
      command: 'npx',
      args: ['@cyanheads/obsidian-mcp-server'],
      env: {
        OBSIDIAN_VAULT_NAME: config.vaultName
      }
    };

    if (config.apiKey) {
      claudeConfig.mcpServers.obsidian.env.OBSIDIAN_REST_API_KEY = config.apiKey;
    }

    await fs.writeJson(claudeConfigPath, claudeConfig, { spaces: 2 });
    console.log(chalk.green('   ✓ Updated Claude Desktop configuration'));

  } catch (error) {
    console.log(chalk.yellow('⚠️  Could not update Claude Desktop config automatically.'));
    console.log(chalk.gray('   Please add the configuration manually using mcp-config.json as reference.'));
  }
}

function getClaudeConfigPath() {
  const platform = os.platform();
  let configPath;

  if (platform === 'darwin') {
    configPath = path.join(os.homedir(), 'Library/Application Support/Claude/claude_desktop_config.json');
  } else if (platform === 'win32') {
    configPath = path.join(os.homedir(), 'AppData/Roaming/Claude/claude_desktop_config.json');
  } else {
    configPath = path.join(os.homedir(), '.config/Claude/claude_desktop_config.json');
  }

  return fs.existsSync(configPath) ? configPath : null;
}

module.exports = mcpCommand;