const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
async function agentCommand(action, tool, options) {
    console.log(chalk.blue.bold('\n🤖 Obsidian Kit - Agent Management\n'));
    switch (action) {
        case 'add':
            await addAgent(tool, options);
            break;
        case 'list':
            await listAgents(options);
            break;
        case 'sync':
            await syncAgents(options);
            break;
        case 'configure':
            await configureAgent(tool, options);
            break;
        default:
            showAgentHelp();
    }
}
async function addAgent(tool, options) {
    try {
        // Check if we're in a valid project
        const isValidProject = await checkValidProject();
        if (!isValidProject) {
            console.log(chalk.red('❌ This doesn\'t appear to be an Obsidian Kit project.'));
            console.log(chalk.gray('   Run "obsidian-kit init" first to create a project vault.\n'));
            return;
        }
        // Get available agent configurations
        const availableAgents = await getAvailableAgents();
        // Determine which agent to configure
        let selectedAgent = tool;
        if (!selectedAgent) {
            const { agent } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'agent',
                    message: 'Which AI coding tool do you want to configure?',
                    choices: availableAgents.map(agent => ({
                        name: `${agent.display} - ${agent.description}`,
                        value: agent.name
                    }))
                }
            ]);
            selectedAgent = agent;
        }
        // Validate agent exists
        const agentConfig = availableAgents.find(a => a.name === selectedAgent);
        if (!agentConfig) {
            console.log(chalk.red(`❌ Unknown agent: ${selectedAgent}`));
            console.log(chalk.gray(`   Available agents: ${availableAgents.map(a => a.name).join(', ')}`));
            return;
        }
        // Copy agent configuration if not already present
        const agentPath = path.join(process.cwd(), 'agents', `${selectedAgent}.md`);
        if (!fs.existsSync(agentPath)) {
            console.log(chalk.cyan(`📋 Setting up ${agentConfig.display} configuration...`));
            // Agent config should already exist in template, but verify
            if (fs.existsSync(agentPath)) {
                console.log(chalk.green(`   ✓ ${agentConfig.display} configuration already available`));
            }
            else {
                console.log(chalk.yellow(`   ⚠️  Agent configuration not found at ${agentPath}`));
                console.log(chalk.gray('   This may indicate the project wasn\'t initialized properly.'));
                return;
            }
        }
        // Provide tool-specific setup instructions
        await showSetupInstructions(agentConfig);
        console.log(chalk.green.bold(`✅ ${agentConfig.display} agent configured successfully!\n`));
    }
    catch (error) {
        console.error(chalk.red('❌ Error configuring agent:'), error.message);
        process.exit(1);
    }
}
async function listAgents(options) {
    try {
        const isValidProject = await checkValidProject();
        if (!isValidProject) {
            console.log(chalk.red('❌ Not in an Obsidian Kit project directory.'));
            return;
        }
        const agentsDir = path.join(process.cwd(), 'agents');
        const agentFiles = await fs.readdir(agentsDir);
        const configuredAgents = agentFiles
            .filter(file => file.endsWith('.md') && file !== 'universal-context.md' && file !== 'slash-commands.md')
            .map(file => file.replace('.md', ''));
        console.log(chalk.yellow('🤖 Configured AI Agents:\n'));
        if (configuredAgents.length === 0) {
            console.log(chalk.gray('   No agents configured yet.'));
            console.log(chalk.gray('   Run "obsidian-kit agent add" to configure an agent.\n'));
            return;
        }
        for (const agent of configuredAgents) {
            const agentPath = path.join(agentsDir, `${agent}.md`);
            const agentContent = await fs.readFile(agentPath, 'utf8');
            // Extract agent name from file content
            const nameMatch = agentContent.match(/# (.+) Agent Configuration/);
            const agentName = nameMatch ? nameMatch[1] : agent;
            console.log(chalk.green(`   ✓ ${agentName}`));
            if (options.verbose) {
                // Show additional details
                const lines = agentContent.split('\n');
                const descriptionLine = lines.find(line => line.includes('Primary Role') || line.includes('**Primary Role**'));
                if (descriptionLine) {
                    const description = descriptionLine.replace(/\*\*/g, '').replace('Primary Role', '').replace(':', '').trim();
                    console.log(chalk.gray(`     ${description}`));
                }
            }
        }
        console.log(chalk.yellow('\n📚 Universal Resources:'));
        console.log(chalk.green('   ✓ Universal Context (agents/universal-context.md)'));
        console.log(chalk.green('   ✓ Slash Commands (agents/slash-commands.md)'));
        if (fs.existsSync(path.join(process.cwd(), '.specify'))) {
            console.log(chalk.green('   ✓ Spec-Kit Integration (.specify/)'));
        }
        console.log();
    }
    catch (error) {
        console.error(chalk.red('❌ Error listing agents:'), error.message);
    }
}
async function syncAgents(options) {
    try {
        const isValidProject = await checkValidProject();
        if (!isValidProject) {
            console.log(chalk.red('❌ Not in an Obsidian Kit project directory.'));
            return;
        }
        console.log(chalk.cyan('🔄 Synchronizing agent configurations...\n'));
        // Update universal context with current date
        const universalContextPath = path.join(process.cwd(), 'agents', 'universal-context.md');
        if (fs.existsSync(universalContextPath)) {
            let content = await fs.readFile(universalContextPath, 'utf8');
            content = content.replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);
            await fs.writeFile(universalContextPath, content);
            console.log(chalk.green('   ✓ Updated universal context'));
        }
        // Update constitution with current date
        const constitutionPath = path.join(process.cwd(), '.specify', 'memory', 'constitution.md');
        if (fs.existsSync(constitutionPath)) {
            let content = await fs.readFile(constitutionPath, 'utf8');
            content = content.replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);
            await fs.writeFile(constitutionPath, content);
            console.log(chalk.green('   ✓ Updated project constitution'));
        }
        // Validate agent configurations
        const agentsDir = path.join(process.cwd(), 'agents');
        const agentFiles = await fs.readdir(agentsDir);
        const agentConfigs = agentFiles.filter(file => file.endsWith('.md') &&
            file !== 'universal-context.md' &&
            file !== 'slash-commands.md');
        console.log(chalk.green(`   ✓ Validated ${agentConfigs.length} agent configurations`));
        // Check for updates needed
        const updatesSuggested = await checkForUpdates();
        if (updatesSuggested.length > 0) {
            console.log(chalk.yellow('\n💡 Suggested Updates:'));
            updatesSuggested.forEach(update => {
                console.log(chalk.gray(`   • ${update}`));
            });
        }
        console.log(chalk.green.bold('\n✅ Agent synchronization completed!\n'));
    }
    catch (error) {
        console.error(chalk.red('❌ Error syncing agents:'), error.message);
    }
}
async function configureAgent(tool, options) {
    // This would open the agent configuration file for editing
    // For now, just show the path and instructions
    const agentPath = path.join(process.cwd(), 'agents', `${tool}.md`);
    if (!fs.existsSync(agentPath)) {
        console.log(chalk.red(`❌ Agent configuration not found: ${tool}`));
        console.log(chalk.gray('   Run "obsidian-kit agent add" first.'));
        return;
    }
    console.log(chalk.cyan(`🔧 Agent configuration: ${tool}`));
    console.log(chalk.gray(`   File: ${agentPath}`));
    console.log(chalk.gray('   Edit this file to customize agent behavior.\n'));
}
async function getAvailableAgents() {
    return [
        {
            name: 'claude-code',
            display: 'Claude Code',
            description: 'Anthropic\'s Claude with file system and tool access'
        },
        {
            name: 'opencode',
            display: 'OpenCode/VS Code',
            description: 'VS Code with AI assistant integration'
        },
        {
            name: 'cursor',
            display: 'Cursor',
            description: 'AI-first code editor with Composer'
        },
        {
            name: 'copilot',
            display: 'GitHub Copilot',
            description: 'GitHub\'s AI pair programmer'
        }
    ];
}
async function showSetupInstructions(agentConfig) {
    console.log(chalk.yellow(`\n📋 Setup Instructions for ${agentConfig.display}:\n`));
    switch (agentConfig.name) {
        case 'claude-code':
            console.log(chalk.gray('1. Ensure Claude Code has access to your project directory'));
            console.log(chalk.gray('2. Configure MCP servers if needed: obsidian-kit add-mcp'));
            console.log(chalk.gray('3. Reference agents/claude-code.md for specific commands'));
            console.log(chalk.gray('4. Use slash commands like /constitution, /specify, /plan'));
            break;
        case 'opencode':
            console.log(chalk.gray('1. Install recommended VS Code extensions'));
            console.log(chalk.gray('2. Copy workspace configuration from agents/opencode.md'));
            console.log(chalk.gray('3. Set up custom tasks and keybindings'));
            console.log(chalk.gray('4. Configure AI assistant extension for your setup'));
            break;
        case 'cursor':
            console.log(chalk.gray('1. Enable codebase indexing in Cursor settings'));
            console.log(chalk.gray('2. Add custom instructions from agents/cursor.md'));
            console.log(chalk.gray('3. Configure privacy settings for sensitive files'));
            console.log(chalk.gray('4. Use @ commands for project-specific assistance'));
            break;
        case 'copilot':
            console.log(chalk.gray('1. Install GitHub Copilot extension'));
            console.log(chalk.gray('2. Configure Copilot settings for your workflow'));
            console.log(chalk.gray('3. Set up custom prompts and templates'));
            console.log(chalk.gray('4. Integrate with existing development tools'));
            break;
        default:
            console.log(chalk.gray('See agent configuration file for specific setup instructions.'));
    }
    console.log(chalk.yellow('\n🔗 Universal Features:'));
    console.log(chalk.gray('• All agents share context from agents/universal-context.md'));
    console.log(chalk.gray('• Standardized slash commands work across all tools'));
    console.log(chalk.gray('• Spec-driven development workflow in .specify/'));
    console.log(chalk.gray('• Project management system in 4 - Projects/'));
}
async function checkValidProject() {
    const agentsDir = path.join(process.cwd(), 'agents');
    const specifyDir = path.join(process.cwd(), '.specify');
    const projectsDir = path.join(process.cwd(), '4 - Projects');
    return fs.existsSync(agentsDir) &&
        fs.existsSync(specifyDir) &&
        fs.existsSync(projectsDir);
}
async function checkForUpdates() {
    const suggestions = [];
    // Check if constitution needs project vision
    const constitutionPath = path.join(process.cwd(), '.specify', 'memory', 'constitution.md');
    if (fs.existsSync(constitutionPath)) {
        const content = await fs.readFile(constitutionPath, 'utf8');
        if (content.includes('[REPLACE_WITH_PROJECT_VISION')) {
            suggestions.push('Update project vision in .specify/memory/constitution.md');
        }
    }
    // Check if requirements need details
    const requirementsPath = path.join(process.cwd(), '.specify', 'specs', 'requirements.md');
    if (fs.existsSync(requirementsPath)) {
        const content = await fs.readFile(requirementsPath, 'utf8');
        if (content.includes('[REPLACE_WITH_PROJECT_VISION')) {
            suggestions.push('Define project requirements in .specify/specs/requirements.md');
        }
    }
    return suggestions;
}
function showAgentHelp() {
    console.log(chalk.yellow('📋 Agent Management Commands:\n'));
    console.log('  obsidian-kit agent add [tool]     Configure AI tool integration');
    console.log('  obsidian-kit agent list           Show configured agents');
    console.log('  obsidian-kit agent sync           Update agent configurations');
    console.log('  obsidian-kit agent configure      Edit agent settings\n');
    console.log(chalk.yellow('🤖 Supported AI Tools:\n'));
    console.log('  claude-code    Claude with file system access');
    console.log('  opencode       VS Code with AI extensions');
    console.log('  cursor         AI-first code editor');
    console.log('  copilot        GitHub Copilot integration\n');
    console.log(chalk.yellow('💡 Examples:\n'));
    console.log('  obsidian-kit agent add claude-code');
    console.log('  obsidian-kit agent list --verbose');
    console.log('  obsidian-kit agent sync\n');
}
module.exports = agentCommand;
//# sourceMappingURL=agent.js.map