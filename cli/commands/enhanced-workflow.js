const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const WorkflowStateManager = require('../workflow-state-manager');

class EnhancedWorkflowCommand {
  constructor() {
    this.stateManager = new WorkflowStateManager(process.cwd());
    this.spinner = null;
  }

  async execute(phase, options = {}) {
    console.log(chalk.blue.bold('\n🚀 Enhanced Workflow Management\n'));

    try {
      // Check if we're in a valid project
      const isValidProject = await this.checkValidProject();
      if (!isValidProject) {
        console.log(chalk.red('❌ This doesn\'t appear to be an Obsidian Kit project.'));
        console.log(chalk.gray('   Run "obsidian-kit init" first to create a project vault.\n'));
        return;
      }

      // Handle special commands
      if (phase === 'resume') {
        await this.resumeWorkflow();
        return;
      } else if (phase === 'templates') {
        await this.manageTemplates();
        return;
      } else if (phase === 'status') {
        await this.showWorkflowStatus();
        return;
      } else if (phase === 'history') {
        await this.showWorkflowHistory();
        return;
      }

      // Check for paused workflows
      const state = await this.stateManager.loadState();
      if (state.pausedWorkflows.length > 0 && phase !== 'menu') {
        const { resumeExisting } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'resumeExisting',
            message: `You have ${state.pausedWorkflows.length} paused workflow(s). Would you like to resume one?`,
            default: false,
          },
        ]);

        if (resumeExisting) {
          await this.resumeWorkflow();
          return;
        }
      }

      // Execute the requested phase with enhanced features
      await this.executePhase(phase, options);

    } catch (error) {
      console.error(chalk.red('❌ Error in enhanced workflow:'), error.message);
      if (this.spinner) {
        this.spinner.fail('Operation failed');
      }
      process.exit(1);
    }
  }

  async executePhase(phase, options) {
    const phases = {
      'constitution': () => this.enhancedConstitutionWorkflow(options),
      'specify': () => this.enhancedSpecifyWorkflow(options),
      'plan': () => this.enhancedPlanWorkflow(options),
      'tasks': () => this.enhancedTasksWorkflow(options),
      'review': () => this.enhancedReviewWorkflow(options),
      'spec-driven': () => this.enhancedSpecDrivenWorkflow(options),
      'menu': () => this.showInteractiveMenu(),
    };

    const phaseHandler = phases[phase];
    if (!phaseHandler) {
      console.log(chalk.red(`❌ Unknown workflow phase: ${phase}`));
      await this.showInteractiveMenu();
      return;
    }

    // Start phase with state management
    await this.stateManager.startPhase(phase, { options });
    await this.stateManager.addToHistory({ type: 'phase_start', phase, options });

    // Execute the phase
    await phaseHandler();

    // Mark phase as completed
    await this.stateManager.completePhase({ completedAt: new Date().toISOString() });
    await this.stateManager.addToHistory({ type: 'phase_complete', phase });
  }

  async enhancedConstitutionWorkflow(options) {
    console.log(chalk.cyan('📜 Enhanced Constitution Phase\n'));

    this.spinner = ora('Analyzing constitution status...').start();

    const constitutionPath = path.join(process.cwd(), '.specify', 'memory', 'constitution.md');

    if (!await fs.pathExists(constitutionPath)) {
      this.spinner.fail('Constitution file not found');
      console.log(chalk.red('❌ Constitution file not found.'));
      console.log(chalk.gray('   This project may not be properly initialized.'));
      return;
    }

    const constitution = await fs.readFile(constitutionPath, 'utf8');
    this.spinner.succeed('Constitution file loaded');

    // Interactive constitution enhancement
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do with the constitution?',
        choices: [
          { name: '📝 Review and edit project vision', value: 'vision' },
          { name: '🏗️  Define project principles', value: 'principles' },
          { name: '📊 Analyze constitution completeness', value: 'analyze' },
          { name: '⏸️  Pause and save progress', value: 'pause' },
          { name: '✅ Mark as complete', value: 'complete' },
        ],
      },
    ]);

    switch (action) {
    case 'vision':
      await this.editProjectVision(constitution, constitutionPath);
      break;
    case 'principles':
      await this.defineProjectPrinciples(constitution, constitutionPath);
      break;
    case 'analyze':
      await this.analyzeConstitution(constitution);
      break;
    case 'pause':
      await this.stateManager.pauseWorkflow('User requested pause during constitution phase');
      console.log(chalk.yellow('⏸️  Workflow paused. Use "obsidian-kit workflow resume" to continue.'));
      return;
    case 'complete':
      await this.stateManager.updatePhaseProgress(100, { status: 'completed' });
      console.log(chalk.green('✅ Constitution phase marked as complete!'));
      break;
    }

    // Show next steps
    await this.showNextSteps('constitution');
  }

  async enhancedSpecifyWorkflow(options) {
    console.log(chalk.cyan('📝 Enhanced Specify Phase\n'));

    this.spinner = ora('Loading specifications...').start();

    const requirementsPath = path.join(process.cwd(), '.specify', 'specs', 'requirements.md');

    if (!await fs.pathExists(requirementsPath)) {
      this.spinner.fail('Requirements file not found');
      console.log(chalk.red('❌ Requirements file not found.'));
      return;
    }

    const requirements = await fs.readFile(requirementsPath, 'utf8');
    this.spinner.succeed('Requirements loaded');

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to work on?',
        choices: [
          { name: '🎯 Define project requirements', value: 'requirements' },
          { name: '📋 Create acceptance criteria', value: 'acceptance' },
          { name: '🔗 Define dependencies', value: 'dependencies' },
          { name: '📊 Analyze requirements completeness', value: 'analyze' },
          { name: '⏸️  Pause and save progress', value: 'pause' },
          { name: '✅ Mark as complete', value: 'complete' },
        ],
      },
    ]);

    switch (action) {
    case 'requirements':
      await this.defineRequirements(requirements, requirementsPath);
      break;
    case 'acceptance':
      await this.defineAcceptanceCriteria(requirements, requirementsPath);
      break;
    case 'dependencies':
      await this.defineDependencies(requirements, requirementsPath);
      break;
    case 'analyze':
      await this.analyzeRequirements(requirements);
      break;
    case 'pause':
      await this.stateManager.pauseWorkflow('User requested pause during specify phase');
      console.log(chalk.yellow('⏸️  Workflow paused. Use "obsidian-kit workflow resume" to continue.'));
      return;
    case 'complete':
      await this.stateManager.updatePhaseProgress(100, { status: 'completed' });
      console.log(chalk.green('✅ Specify phase marked as complete!'));
      break;
    }

    await this.showNextSteps('specify');
  }

  async enhancedPlanWorkflow(options) {
    console.log(chalk.cyan('🏗️  Enhanced Plan Phase\n'));

    this.spinner = ora('Loading architecture...').start();

    const architecturePath = path.join(process.cwd(), '.specify', 'specs', 'architecture.md');

    if (!await fs.pathExists(architecturePath)) {
      this.spinner.fail('Architecture file not found');
      console.log(chalk.red('❌ Architecture file not found.'));
      return;
    }

    const architecture = await fs.readFile(architecturePath, 'utf8');
    this.spinner.succeed('Architecture loaded');

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to work on?',
        choices: [
          { name: '🔧 Define technology stack', value: 'techstack' },
          { name: '📐 Create architecture diagrams', value: 'diagrams' },
          { name: '📝 Document architecture decisions', value: 'decisions' },
          { name: '📊 Analyze architecture completeness', value: 'analyze' },
          { name: '⏸️  Pause and save progress', value: 'pause' },
          { name: '✅ Mark as complete', value: 'complete' },
        ],
      },
    ]);

    switch (action) {
    case 'techstack':
      await this.defineTechStack(architecture, architecturePath);
      break;
    case 'diagrams':
      await this.createArchitectureDiagrams(architecture, architecturePath);
      break;
    case 'decisions':
      await this.documentArchitectureDecisions(architecture, architecturePath);
      break;
    case 'analyze':
      await this.analyzeArchitecture(architecture);
      break;
    case 'pause':
      await this.stateManager.pauseWorkflow('User requested pause during plan phase');
      console.log(chalk.yellow('⏸️  Workflow paused. Use "obsidian-kit workflow resume" to continue.'));
      return;
    case 'complete':
      await this.stateManager.updatePhaseProgress(100, { status: 'completed' });
      console.log(chalk.green('✅ Plan phase marked as complete!'));
      break;
    }

    await this.showNextSteps('plan');
  }

  async enhancedTasksWorkflow(options) {
    console.log(chalk.cyan('✅ Enhanced Tasks Phase\n'));

    this.spinner = ora('Analyzing tasks...').start();

    const projectsDir = path.join(process.cwd(), '4 - Projects');
    const allTasks = await this.getAllTasks(projectsDir);

    this.spinner.succeed(`Found ${allTasks.length} tasks`);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do with tasks?',
        choices: [
          { name: '📊 View task analytics', value: 'analytics' },
          { name: '➕ Create new tasks', value: 'create' },
          { name: '✏️  Edit existing tasks', value: 'edit' },
          { name: '🔄 Update task statuses', value: 'update' },
          { name: '📈 Track progress', value: 'progress' },
          { name: '⏸️  Pause and save progress', value: 'pause' },
          { name: '✅ Mark phase complete', value: 'complete' },
        ],
      },
    ]);

    switch (action) {
    case 'analytics':
      await this.showTaskAnalytics(allTasks);
      break;
    case 'create':
      await this.createNewTasks();
      break;
    case 'edit':
      await this.editTasks(allTasks);
      break;
    case 'update':
      await this.updateTaskStatuses(allTasks);
      break;
    case 'progress':
      await this.trackProgress(allTasks);
      break;
    case 'pause':
      await this.stateManager.pauseWorkflow('User requested pause during tasks phase');
      console.log(chalk.yellow('⏸️  Workflow paused. Use "obsidian-kit workflow resume" to continue.'));
      return;
    case 'complete':
      await this.stateManager.updatePhaseProgress(100, { status: 'completed' });
      console.log(chalk.green('✅ Tasks phase marked as complete!'));
      break;
    }

    await this.showNextSteps('tasks');
  }

  async showInteractiveMenu() {
    console.log(chalk.yellow('🎯 Enhanced Workflow Menu\n'));

    const state = await this.stateManager.loadState();
    const stats = await this.stateManager.getStatistics();

    // Show current status
    if (state.currentPhase) {
      console.log(chalk.blue(`📍 Current Phase: ${state.currentPhase}`));
      const progress = state.phaseData[state.currentPhase]?.progress || 0;
      console.log(chalk.gray(`   Progress: ${progress}%`));
    }

    if (state.pausedWorkflows.length > 0) {
      console.log(chalk.yellow(`⏸️  Paused Workflows: ${state.pausedWorkflows.length}`));
    }

    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Start new workflow phase', value: 'phase' },
          { name: '▶️  Resume paused workflow', value: 'resume' },
          { name: '📊 View workflow status', value: 'status' },
          { name: '📚 View workflow history', value: 'history' },
          { name: '📋 Manage workflow templates', value: 'templates' },
          { name: '⚙️  Workflow settings', value: 'settings' },
          { name: '❌ Exit', value: 'exit' },
        ],
      },
    ]);

    switch (choice) {
    case 'phase':
      await this.selectPhase();
      break;
    case 'resume':
      await this.resumeWorkflow();
      break;
    case 'status':
      await this.showWorkflowStatus();
      break;
    case 'history':
      await this.showWorkflowHistory();
      break;
    case 'templates':
      await this.manageTemplates();
      break;
    case 'settings':
      await this.manageSettings();
      break;
    case 'exit':
      console.log(chalk.green('👋 Goodbye!'));
      return;
    }
  }

  async selectPhase() {
    const { phase } = await inquirer.prompt([
      {
        type: 'list',
        name: 'phase',
        message: 'Select a workflow phase:',
        choices: [
          { name: '📜 Constitution - Project principles and vision', value: 'constitution' },
          { name: '📝 Specify - Requirements and specifications', value: 'specify' },
          { name: '🏗️  Plan - Technical architecture and design', value: 'plan' },
          { name: '✅ Tasks - Implementation breakdown', value: 'tasks' },
          { name: '🔧 Spec-Driven - Automated implementation from specs', value: 'spec-driven' },
          { name: '🔍 Review - Progress and outcomes assessment', value: 'review' },
        ],
      },
    ]);

    await this.executePhase(phase);
  }

  async resumeWorkflow() {
    const state = await this.stateManager.loadState();

    if (state.pausedWorkflows.length === 0) {
      console.log(chalk.yellow('⚠️  No paused workflows found.'));
      return;
    }

    const { workflow } = await inquirer.prompt([
      {
        type: 'list',
        name: 'workflow',
        message: 'Select a workflow to resume:',
        choices: state.pausedWorkflows.map(w => ({
          name: `${w.phase} (paused ${new Date(w.pausedAt).toLocaleDateString()})`,
          value: w.phase,
        })),
      },
    ]);

    const resumedState = await this.stateManager.resumeWorkflow(workflow);
    if (resumedState) {
      console.log(chalk.green(`✅ Resumed workflow: ${workflow}`));
      await this.executePhase(workflow);
    } else {
      console.log(chalk.red('❌ Failed to resume workflow'));
    }
  }

  async showWorkflowStatus() {
    const stats = await this.stateManager.getStatistics();

    console.log(chalk.blue.bold('\n📊 Workflow Status\n'));

    console.log(chalk.cyan('Current Status:'));
    console.log(`   Current Phase: ${stats.currentPhase || 'None'}`);
    console.log(`   Phases Completed: ${stats.totalPhasesCompleted}`);
    console.log(`   Workflows Started: ${stats.totalWorkflowsStarted}`);
    console.log(`   Workflows Completed: ${stats.totalWorkflowsCompleted}`);

    if (stats.averagePhaseDuration > 0) {
      console.log(`   Average Phase Duration: ${stats.averagePhaseDuration} minutes`);
    }

    if (stats.mostUsedPhases.length > 0) {
      console.log(chalk.cyan('\nMost Used Phases:'));
      stats.mostUsedPhases.forEach((phase, index) => {
        console.log(`   ${index + 1}. ${phase.phase} (${phase.count} times)`);
      });
    }

    console.log(chalk.gray(`\nLast Activity: ${stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : 'Never'}`));
  }

  async showWorkflowHistory() {
    const history = await this.stateManager.getHistory();

    console.log(chalk.blue.bold('\n📚 Workflow History\n'));

    if (history.length === 0) {
      console.log(chalk.gray('No workflow history found.'));
      return;
    }

    // Group by date
    const grouped = {};
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });

    Object.entries(grouped).forEach(([date, entries]) => {
      console.log(chalk.cyan(`\n📅 ${date}:`));
      entries.forEach(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        const icon = entry.type === 'phase_start' ? '🚀' :
          entry.type === 'phase_complete' ? '✅' : '📝';
        console.log(`   ${time} ${icon} ${entry.phase || entry.type}`);
      });
    });
  }

  async manageTemplates() {
    const templates = await this.stateManager.listTemplates();

    console.log(chalk.blue.bold('\n📋 Workflow Templates\n'));

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📝 Create new template', value: 'create' },
          { name: '📖 List existing templates', value: 'list' },
          { name: '🔧 Use template', value: 'use' },
          { name: '🗑️  Delete template', value: 'delete' },
          { name: '⬅️  Back to menu', value: 'back' },
        ],
      },
    ]);

    switch (action) {
    case 'create':
      await this.createTemplate();
      break;
    case 'list':
      await this.listTemplates(templates);
      break;
    case 'use':
      await this.useTemplate(templates);
      break;
    case 'delete':
      await this.deleteTemplate(templates);
      break;
    case 'back':
      await this.showInteractiveMenu();
      break;
    }
  }

  // Helper methods
  async checkValidProject() {
    const agentsDir = path.join(process.cwd(), 'agents');
    const specifyDir = path.join(process.cwd(), '.specify');
    const projectsDir = path.join(process.cwd(), '4 - Projects');

    return await fs.pathExists(agentsDir) &&
           await fs.pathExists(specifyDir) &&
           await fs.pathExists(projectsDir);
  }

  async getAllTasks(projectsDir) {
    // Implementation from original workflow command
    const tasks = [];

    async function findTaskFiles(dir) {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory() && !item.name.startsWith('.')) {
          await findTaskFiles(fullPath);
        } else if (item.isFile() && item.name.endsWith('.md')) {
          try {
            const content = await fs.readFile(fullPath, 'utf8');

            if (content.includes('tags:') && content.includes('task') ||
                content.includes('title:') && content.includes('status:')) {

              const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
              if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const task = {
                  title: this.extractField(frontmatter, 'title') || path.basename(item.name, '.md'),
                  status: this.extractField(frontmatter, 'status') || 'todo',
                  priority: this.extractField(frontmatter, 'priority') || 'medium',
                  project: this.extractField(frontmatter, 'project') || '',
                  assignee: this.extractField(frontmatter, 'assignee') || 'me',
                  due_date: this.extractField(frontmatter, 'due_date') || '',
                  created_date: this.extractField(frontmatter, 'created_date') || '',
                  time_estimate: this.extractField(frontmatter, 'time_estimate') || 0,
                  time_spent: this.extractField(frontmatter, 'time_spent') || 0,
                  path: fullPath,
                };
                tasks.push(task);
              }
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    }

    await findTaskFiles(projectsDir);
    return tasks;
  }

  extractField(frontmatter, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*:\\s*["']?([^"'\n]+)["']?`);
    const match = frontmatter.match(regex);
    return match ? match[1].trim() : '';
  }

  async showNextSteps(currentPhase) {
    const nextPhases = {
      'constitution': 'specify',
      'specify': 'plan',
      'plan': 'tasks',
      'tasks': 'review',
      'review': null,
    };

    const next = nextPhases[currentPhase];
    if (next) {
      console.log(chalk.yellow('\n💡 Next Steps:'));
      console.log(`   • Proceed to ${next} phase: obsidian-kit workflow ${next}`);
      console.log('   • Or pause and continue later: obsidian-kit workflow pause\n');
    } else {
      console.log(chalk.green('\n🎉 Workflow Complete!'));
      console.log('   • Review your progress with: obsidian-kit workflow review');
      console.log('   • Start a new workflow cycle anytime\n');
    }
  }

  // Placeholder methods for enhanced features
  async editProjectVision(constitution, constitutionPath) {
    console.log(chalk.blue('📝 Editing project vision...'));
    // Implementation would go here
  }

  async defineProjectPrinciples(constitution, constitutionPath) {
    console.log(chalk.blue('🏗️  Defining project principles...'));
    // Implementation would go here
  }

  async analyzeConstitution(constitution) {
    console.log(chalk.blue('📊 Analyzing constitution...'));
    // Implementation would go here
  }

  async defineRequirements(requirements, requirementsPath) {
    console.log(chalk.blue('🎯 Defining requirements...'));
    // Implementation would go here
  }

  async defineAcceptanceCriteria(requirements, requirementsPath) {
    console.log(chalk.blue('📋 Defining acceptance criteria...'));
    // Implementation would go here
  }

  async defineDependencies(requirements, requirementsPath) {
    console.log(chalk.blue('🔗 Defining dependencies...'));
    // Implementation would go here
  }

  async analyzeRequirements(requirements) {
    console.log(chalk.blue('📊 Analyzing requirements...'));
    // Implementation would go here
  }

  async defineTechStack(architecture, architecturePath) {
    console.log(chalk.blue('🔧 Defining technology stack...'));
    // Implementation would go here
  }

  async createArchitectureDiagrams(architecture, architecturePath) {
    console.log(chalk.blue('📐 Creating architecture diagrams...'));
    // Implementation would go here
  }

  async documentArchitectureDecisions(architecture, architecturePath) {
    console.log(chalk.blue('📝 Documenting architecture decisions...'));
    // Implementation would go here
  }

  async analyzeArchitecture(architecture) {
    console.log(chalk.blue('📊 Analyzing architecture...'));
    // Implementation would go here
  }

  async showTaskAnalytics(allTasks) {
    console.log(chalk.blue('📊 Showing task analytics...'));
    // Implementation would go here
  }

  async createNewTasks() {
    console.log(chalk.blue('➕ Creating new tasks...'));
    // Implementation would go here
  }

  async editTasks(allTasks) {
    console.log(chalk.blue('✏️  Editing tasks...'));
    // Implementation would go here
  }

  async updateTaskStatuses(allTasks) {
    console.log(chalk.blue('🔄 Updating task statuses...'));
    // Implementation would go here
  }

  async trackProgress(allTasks) {
    console.log(chalk.blue('📈 Tracking progress...'));
    // Implementation would go here
  }

  async createTemplate() {
    console.log(chalk.blue('📝 Creating template...'));
    // Implementation would go here
  }

  async listTemplates(templates) {
    console.log(chalk.blue('📖 Listing templates...'));
    // Implementation would go here
  }

  async useTemplate(templates) {
    console.log(chalk.blue('🔧 Using template...'));
    // Implementation would go here
  }

  async deleteTemplate(templates) {
    console.log(chalk.blue('🗑️  Deleting template...'));
    // Implementation would go here
  }

  async manageSettings() {
    console.log(chalk.blue('⚙️  Managing settings...'));
    // Implementation would go here
  }
}

// Export the enhanced workflow command
module.exports = async function enhancedWorkflowCommand(phase, options) {
  const command = new EnhancedWorkflowCommand();
  await command.execute(phase, options);
};
