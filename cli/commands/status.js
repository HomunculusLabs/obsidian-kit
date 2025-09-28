const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const os = require('os');

async function statusCommand(options) {
  console.log(chalk.blue.bold('\n📊 Obsidian Kit - Vault Status\n'));

  try {
    const status = await getVaultStatus();
    displayStatus(status, options.verbose);
  } catch (error) {
    console.error(chalk.red('❌ Error checking vault status:'), error.message);
    process.exit(1);
  }
}

async function getVaultStatus() {
  const status = {
    isValidVault: false,
    vaultName: null,
    mcpConfigured: false,
    agentConfigured: false,
    claudeConfigured: false,
    pluginStatus: {},
    taskStats: {},
    healthScore: 0
  };

  // Check if this is a valid Obsidian Kit vault
  const mcpConfigPath = path.join(process.cwd(), 'mcp-config.json');
  const claudeDir = path.join(process.cwd(), 'claude');
  const projectsDir = path.join(process.cwd(), '4 - Projects');

  status.isValidVault = fs.existsSync(mcpConfigPath) &&
                       fs.existsSync(claudeDir) &&
                       fs.existsSync(projectsDir);

  if (!status.isValidVault) {
    return status;
  }

  // Get vault name
  if (fs.existsSync(mcpConfigPath)) {
    const mcpConfig = await fs.readJson(mcpConfigPath);
    status.vaultName = mcpConfig.server?.env?.OBSIDIAN_VAULT_NAME || path.basename(process.cwd());
    status.mcpConfigured = !!mcpConfig.server?.env?.OBSIDIAN_REST_API_KEY;
  }

  // Check agent configuration
  const agentConfigPath = path.join(claudeDir, 'agents.md');
  status.agentConfigured = fs.existsSync(agentConfigPath);

  // Check Claude Desktop configuration
  status.claudeConfigured = await checkClaudeDesktopConfig(status.vaultName);

  // Check plugin status
  status.pluginStatus = await checkPluginStatus();

  // Get task statistics
  status.taskStats = await getTaskStatistics();

  // Calculate health score
  status.healthScore = calculateHealthScore(status);

  return status;
}

async function checkClaudeDesktopConfig(vaultName) {
  const claudeConfigPath = getClaudeConfigPath();

  if (!claudeConfigPath || !fs.existsSync(claudeConfigPath)) {
    return false;
  }

  try {
    const claudeConfig = await fs.readJson(claudeConfigPath);
    const obsidianServer = claudeConfig.mcpServers?.obsidian;

    return obsidianServer &&
           obsidianServer.env?.OBSIDIAN_VAULT_NAME === vaultName;
  } catch {
    return false;
  }
}

function getClaudeConfigPath() {
  const platform = os.platform();

  if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library/Application Support/Claude/claude_desktop_config.json');
  } else if (platform === 'win32') {
    return path.join(os.homedir(), 'AppData/Roaming/Claude/claude_desktop_config.json');
  } else {
    return path.join(os.homedir(), '.config/Claude/claude_desktop_config.json');
  }
}

async function checkPluginStatus() {
  const obsidianDir = path.join(process.cwd(), '.obsidian');
  const pluginsDir = path.join(obsidianDir, 'plugins');
  const status = {};

  if (!fs.existsSync(pluginsDir)) {
    return status;
  }

  const requiredPlugins = ['dataview', 'templater-obsidian', 'obsidian-tasks-plugin'];

  for (const plugin of requiredPlugins) {
    const pluginPath = path.join(pluginsDir, plugin);
    status[plugin] = fs.existsSync(pluginPath);
  }

  return status;
}

async function getTaskStatistics() {
  const tasksBasePath = path.join(process.cwd(), '4 - Projects', 'Tasks.base');
  const stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  };

  if (!fs.existsSync(tasksBasePath)) {
    return stats;
  }

  // This is a simplified version - in a real implementation,
  // you'd parse the Tasks.base file or use the Dataview API
  try {
    const content = await fs.readFile(tasksBasePath, 'utf8');

    // Simple regex-based counting (this would be more sophisticated in practice)
    const taskLines = content.split('\n').filter(line => line.includes('status:'));
    stats.total = taskLines.length;

    stats.pending = taskLines.filter(line => line.includes('status: todo')).length;
    stats.inProgress = taskLines.filter(line => line.includes('status: in-progress')).length;
    stats.completed = taskLines.filter(line => line.includes('status: completed')).length;

    // Simple overdue calculation based on current date
    const today = new Date().toISOString().split('T')[0];
    stats.overdue = taskLines.filter(line =>
      line.includes('due_date:') &&
      line.includes(today) // This is simplified
    ).length;

  } catch (error) {
    // If we can't parse tasks, return empty stats
  }

  return stats;
}

function calculateHealthScore(status) {
  let score = 0;

  if (status.isValidVault) score += 20;
  if (status.mcpConfigured) score += 20;
  if (status.agentConfigured) score += 15;
  if (status.claudeConfigured) score += 20;

  // Plugin status (15 points total)
  const pluginCount = Object.values(status.pluginStatus).filter(Boolean).length;
  const totalPlugins = Object.keys(status.pluginStatus).length;
  if (totalPlugins > 0) {
    score += Math.round((pluginCount / totalPlugins) * 15);
  }

  // Task health (10 points)
  const { total, completed, overdue } = status.taskStats;
  if (total > 0) {
    const completionRate = completed / total;
    const overdueRate = overdue / total;
    score += Math.round((completionRate - overdueRate) * 10);
  } else {
    score += 5; // No tasks is neutral
  }

  return Math.max(0, Math.min(100, score));
}

function displayStatus(status, verbose) {
  if (!status.isValidVault) {
    console.log(chalk.red('❌ Not an Obsidian Kit project vault'));
    console.log(chalk.gray('   Run "obsidian-kit init" to create a project vault.\n'));
    return;
  }

  // Health overview
  const healthColor = status.healthScore >= 80 ? chalk.green :
                     status.healthScore >= 60 ? chalk.yellow : chalk.red;

  console.log(healthColor.bold(`🎯 Vault Health: ${status.healthScore}/100`));
  console.log(chalk.gray(`   Vault: ${status.vaultName}\n`));

  // Core systems status
  console.log(chalk.yellow('🔧 Core Systems:'));
  console.log(getStatusIcon(status.mcpConfigured) + ' MCP Server Configuration');
  console.log(getStatusIcon(status.agentConfigured) + ' AI Agent Configuration');
  console.log(getStatusIcon(status.claudeConfigured) + ' Claude Desktop Integration');

  // Plugin status
  console.log(chalk.yellow('\n🔌 Required Plugins:'));
  Object.entries(status.pluginStatus).forEach(([plugin, installed]) => {
    const name = plugin.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(getStatusIcon(installed) + ` ${name}`);
  });

  // Task statistics
  if (status.taskStats.total > 0) {
    console.log(chalk.yellow('\n📋 Task Overview:'));
    console.log(`   Total Tasks: ${status.taskStats.total}`);
    console.log(`   Pending: ${status.taskStats.pending}`);
    console.log(`   In Progress: ${status.taskStats.inProgress}`);
    console.log(`   Completed: ${status.taskStats.completed}`);
    if (status.taskStats.overdue > 0) {
      console.log(chalk.red(`   Overdue: ${status.taskStats.overdue}`));
    }
  }

  // Recommendations
  console.log(chalk.yellow('\n💡 Recommendations:'));
  if (!status.mcpConfigured) {
    console.log('   • Run: obsidian-kit add-mcp --vault-name ' + status.vaultName);
  }
  if (!status.claudeConfigured) {
    console.log('   • Configure Claude Desktop MCP server');
  }
  if (Object.values(status.pluginStatus).some(installed => !installed)) {
    console.log('   • Install missing Obsidian plugins');
  }
  if (status.taskStats.overdue > 0) {
    console.log('   • Review and update overdue tasks');
  }

  if (verbose) {
    console.log(chalk.gray('\n📊 Detailed Information:'));
    console.log(chalk.gray(`   Working Directory: ${process.cwd()}`));
    console.log(chalk.gray(`   Claude Config Path: ${getClaudeConfigPath()}`));
  }

  console.log();
}

function getStatusIcon(isOk) {
  return isOk ? chalk.green('   ✓') : chalk.red('   ✗');
}

module.exports = statusCommand;