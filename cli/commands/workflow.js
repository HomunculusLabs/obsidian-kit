const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

async function workflowCommand(phase, options) {
  console.log(chalk.blue.bold('\n📋 Obsidian Kit - Workflow Management\n'));

  try {
    // Check if we're in a valid project
    const isValidProject = await checkValidProject();
    if (!isValidProject) {
      console.log(chalk.red('❌ This doesn\'t appear to be an Obsidian Kit project.'));
      console.log(chalk.gray('   Run "obsidian-kit init" first to create a project vault.\n'));
      return;
    }

    // Handle different workflow phases
    switch (phase) {
      case 'constitution':
        await constitutionWorkflow(options);
        break;
      case 'specify':
        await specifyWorkflow(options);
        break;
      case 'plan':
        await planWorkflow(options);
        break;
      case 'tasks':
        await tasksWorkflow(options);
        break;
      case 'status':
        await statusWorkflow(options);
        break;
      default:
        await showWorkflowMenu();
    }

  } catch (error) {
    console.error(chalk.red('❌ Error in workflow:'), error.message);
    process.exit(1);
  }
}

async function constitutionWorkflow(options) {
  console.log(chalk.cyan('📜 Constitution Phase - Project Principles\n'));

  const constitutionPath = path.join(process.cwd(), '.specify', 'memory', 'constitution.md');

  if (!fs.existsSync(constitutionPath)) {
    console.log(chalk.red('❌ Constitution file not found.'));
    console.log(chalk.gray('   This project may not be properly initialized.'));
    return;
  }

  // Read current constitution
  const constitution = await fs.readFile(constitutionPath, 'utf8');

  // Check if constitution needs updating
  if (constitution.includes('[REPLACE_WITH_PROJECT_VISION')) {
    console.log(chalk.yellow('⚠️  Constitution needs project vision definition.\n'));

    const { updateVision } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'updateVision',
        message: 'Would you like to define the project vision now?',
        default: true
      }
    ]);

    if (updateVision) {
      const { vision } = await inquirer.prompt([
        {
          type: 'input',
          name: 'vision',
          message: 'Enter your project vision:',
          validate: input => input.trim().length > 0 ? true : 'Vision cannot be empty'
        }
      ]);

      // Update constitution with vision
      const updatedConstitution = constitution
        .replace('[REPLACE_WITH_PROJECT_VISION - Define what this project aims to achieve]', vision.trim())
        .replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);

      await fs.writeFile(constitutionPath, updatedConstitution);
      console.log(chalk.green('   ✓ Updated project vision in constitution'));
    }
  }

  console.log(chalk.green('📜 Constitution Status:'));
  console.log(chalk.gray(`   File: ${constitutionPath}`));

  // Show constitution summary
  const lines = constitution.split('\n');
  const visionLine = lines.find(line => line.includes('Project Vision') || line.includes('## Project Vision'));
  if (visionLine) {
    const nextLine = lines[lines.indexOf(visionLine) + 1];
    if (nextLine && !nextLine.includes('[REPLACE_WITH_PROJECT_VISION')) {
      console.log(chalk.green('   ✓ Project vision defined'));
    } else {
      console.log(chalk.yellow('   ⚠️  Project vision needs definition'));
    }
  }

  console.log(chalk.yellow('\n💡 Next Steps:'));
  console.log('   • Review and refine project principles');
  console.log('   • Ensure all team members understand the vision');
  console.log('   • Proceed to specification phase: obsidian-kit workflow specify\n');
}

async function specifyWorkflow(options) {
  console.log(chalk.cyan('📝 Specify Phase - Requirements Definition\n'));

  const requirementsPath = path.join(process.cwd(), '.specify', 'specs', 'requirements.md');

  if (!fs.existsSync(requirementsPath)) {
    console.log(chalk.red('❌ Requirements file not found.'));
    return;
  }

  // Check requirements status
  const requirements = await fs.readFile(requirementsPath, 'utf8');
  const needsVision = requirements.includes('[REPLACE_WITH_PROJECT_VISION');

  console.log(chalk.green('📝 Requirements Status:'));
  console.log(chalk.gray(`   File: ${requirementsPath}`));

  if (needsVision) {
    console.log(chalk.yellow('   ⚠️  Requirements need project vision'));

    const { getFromConstitution } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'getFromConstitution',
        message: 'Copy vision from constitution?',
        default: true
      }
    ]);

    if (getFromConstitution) {
      // Get vision from constitution
      const constitutionPath = path.join(process.cwd(), '.specify', 'memory', 'constitution.md');
      if (fs.existsSync(constitutionPath)) {
        const constitution = await fs.readFile(constitutionPath, 'utf8');
        const visionMatch = constitution.match(/## Project Vision\s*\n(.+)/);

        if (visionMatch && !visionMatch[1].includes('[REPLACE_WITH_PROJECT_VISION')) {
          const vision = visionMatch[1].trim();
          const updatedRequirements = requirements
            .replace('[REPLACE_WITH_PROJECT_VISION - Define what this project aims to achieve]', vision)
            .replace('{{date:YYYY-MM-DD}}', new Date().toISOString().split('T')[0]);

          await fs.writeFile(requirementsPath, updatedRequirements);
          console.log(chalk.green('   ✓ Updated requirements with project vision'));
        }
      }
    }
  } else {
    console.log(chalk.green('   ✓ Requirements have project vision'));
  }

  // Check for other template placeholders
  const placeholders = (requirements.match(/\[Description\]/g) || []).length;
  if (placeholders > 0) {
    console.log(chalk.yellow(`   ⚠️  ${placeholders} requirement descriptions need completion`));
  } else {
    console.log(chalk.green('   ✓ Requirements appear complete'));
  }

  console.log(chalk.yellow('\n💡 Next Steps:'));
  console.log('   • Complete all requirement descriptions');
  console.log('   • Define clear acceptance criteria');
  console.log('   • Get stakeholder approval');
  console.log('   • Proceed to planning phase: obsidian-kit workflow plan\n');
}

async function planWorkflow(options) {
  console.log(chalk.cyan('🏗️  Plan Phase - Technical Architecture\n'));

  const architecturePath = path.join(process.cwd(), '.specify', 'specs', 'architecture.md');

  if (!fs.existsSync(architecturePath)) {
    console.log(chalk.red('❌ Architecture file not found.'));
    return;
  }

  console.log(chalk.green('🏗️  Architecture Status:'));
  console.log(chalk.gray(`   File: ${architecturePath}`));

  // Read and analyze architecture
  const architecture = await fs.readFile(architecturePath, 'utf8');

  // Check for common placeholders
  const needsStack = architecture.includes('[e.g.,');
  const needsDiagram = architecture.includes('[INSERT_ARCHITECTURE_DIAGRAM');

  if (needsStack) {
    console.log(chalk.yellow('   ⚠️  Technology stack needs definition'));
  } else {
    console.log(chalk.green('   ✓ Technology stack defined'));
  }

  if (needsDiagram) {
    console.log(chalk.yellow('   ⚠️  Architecture diagram needed'));
  } else {
    console.log(chalk.green('   ✓ Architecture documented'));
  }

  // Check for ADRs
  const adrCount = (architecture.match(/### ADR-\d+/g) || []).length;
  console.log(chalk.green(`   ✓ ${adrCount} architecture decisions recorded`));

  console.log(chalk.yellow('\n💡 Next Steps:'));
  console.log('   • Complete technology stack selection');
  console.log('   • Create architecture diagrams');
  console.log('   • Document key architecture decisions');
  console.log('   • Proceed to task breakdown: obsidian-kit workflow tasks\n');
}

async function tasksWorkflow(options) {
  console.log(chalk.cyan('✅ Tasks Phase - Implementation Breakdown\n'));

  const projectsDir = path.join(process.cwd(), '4 - Projects');
  const tasksBasePath = path.join(projectsDir, 'Tasks.base');

  if (!fs.existsSync(tasksBasePath)) {
    console.log(chalk.red('❌ Tasks.base file not found.'));
    return;
  }

  // Analyze current tasks
  const tasksBase = await fs.readFile(tasksBasePath, 'utf8');
  const taskFiles = await fs.readdir(projectsDir, { withFileTypes: true });

  // Count task files
  const taskFileCount = taskFiles
    .filter(dirent => dirent.isFile() && dirent.name.startsWith('Task - ') && dirent.name.endsWith('.md'))
    .length;

  console.log(chalk.green('✅ Task Status:'));
  console.log(chalk.gray(`   Tasks Database: ${tasksBasePath}`));
  console.log(chalk.green(`   ✓ ${taskFileCount} task files found`));

  // Parse task status from Tasks.base (simplified)
  const statusLines = tasksBase.split('\n').filter(line => line.includes('status:'));
  const todoCount = statusLines.filter(line => line.includes('status: todo')).length;
  const inProgressCount = statusLines.filter(line => line.includes('status: in-progress')).length;
  const completedCount = statusLines.filter(line => line.includes('status: completed')).length;

  console.log(chalk.green(`   ✓ ${todoCount} pending tasks`));
  console.log(chalk.green(`   ✓ ${inProgressCount} in-progress tasks`));
  console.log(chalk.green(`   ✓ ${completedCount} completed tasks`));

  if (todoCount === 0 && inProgressCount === 0) {
    console.log(chalk.yellow('   ⚠️  No pending tasks - consider creating implementation tasks'));
  }

  console.log(chalk.yellow('\n💡 Next Steps:'));
  console.log('   • Break down features into 2-4 hour tasks');
  console.log('   • Define clear acceptance criteria for each task');
  console.log('   • Set up task dependencies and priorities');
  console.log('   • Begin implementation with your preferred AI tool\n');
}

async function statusWorkflow(options) {
  console.log(chalk.cyan('📊 Workflow Status - Project Health Check\n'));

  // Check each phase
  const phases = [
    { name: 'Constitution', file: '.specify/memory/constitution.md', check: checkConstitution },
    { name: 'Requirements', file: '.specify/specs/requirements.md', check: checkRequirements },
    { name: 'Architecture', file: '.specify/specs/architecture.md', check: checkArchitecture },
    { name: 'Tasks', file: '4 - Projects/Tasks.base', check: checkTasks }
  ];

  let overallHealth = 0;

  for (const phase of phases) {
    const filePath = path.join(process.cwd(), phase.file);
    const exists = fs.existsSync(filePath);

    console.log(chalk.yellow(`📋 ${phase.name} Phase:`));

    if (!exists) {
      console.log(chalk.red('   ❌ File not found'));
      continue;
    }

    const health = await phase.check(filePath);
    overallHealth += health.score;

    console.log(health.score >= 80 ? chalk.green('   ✅ Complete') :
                health.score >= 60 ? chalk.yellow('   ⚠️  Needs attention') :
                chalk.red('   ❌ Incomplete'));

    if (health.issues.length > 0) {
      health.issues.forEach(issue => {
        console.log(chalk.gray(`     • ${issue}`));
      });
    }
    console.log();
  }

  // Overall health
  const avgHealth = overallHealth / phases.length;
  const healthColor = avgHealth >= 80 ? chalk.green :
                     avgHealth >= 60 ? chalk.yellow : chalk.red;

  console.log(healthColor.bold(`🎯 Overall Project Health: ${Math.round(avgHealth)}/100\n`));

  // Recommendations
  console.log(chalk.yellow('💡 Recommendations:'));
  if (avgHealth < 60) {
    console.log(chalk.gray('   • Focus on completing missing phases'));
    console.log(chalk.gray('   • Use workflow commands to guide development'));
  } else if (avgHealth < 80) {
    console.log(chalk.gray('   • Address incomplete sections'));
    console.log(chalk.gray('   • Ensure all placeholders are filled'));
  } else {
    console.log(chalk.gray('   • Project is ready for implementation'));
    console.log(chalk.gray('   • Consider starting with highest priority tasks'));
  }
  console.log();
}

async function checkConstitution(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  let score = 100;

  if (content.includes('[REPLACE_WITH_PROJECT_VISION')) {
    issues.push('Project vision needs definition');
    score -= 40;
  }

  if (content.includes('{{date:YYYY-MM-DD}}')) {
    issues.push('Date placeholders need updating');
    score -= 20;
  }

  return { score: Math.max(0, score), issues };
}

async function checkRequirements(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  let score = 100;

  if (content.includes('[REPLACE_WITH_PROJECT_VISION')) {
    issues.push('Project vision needs definition');
    score -= 30;
  }

  const placeholderCount = (content.match(/\[Description\]/g) || []).length;
  if (placeholderCount > 0) {
    issues.push(`${placeholderCount} requirement descriptions need completion`);
    score -= placeholderCount * 10;
  }

  return { score: Math.max(0, score), issues };
}

async function checkArchitecture(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  let score = 100;

  if (content.includes('[INSERT_ARCHITECTURE_DIAGRAM')) {
    issues.push('Architecture diagram needed');
    score -= 30;
  }

  if (content.includes('[e.g.,')) {
    issues.push('Technology stack needs definition');
    score -= 30;
  }

  const adrCount = (content.match(/### ADR-\d+/g) || []).length;
  if (adrCount === 0) {
    issues.push('No architecture decisions recorded');
    score -= 20;
  }

  return { score: Math.max(0, score), issues };
}

async function checkTasks(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  let score = 100;

  const statusLines = content.split('\n').filter(line => line.includes('status:'));
  const totalTasks = statusLines.length;

  if (totalTasks === 0) {
    issues.push('No tasks defined');
    score = 0;
  } else {
    const todoCount = statusLines.filter(line => line.includes('status: todo')).length;
    const completedCount = statusLines.filter(line => line.includes('status: completed')).length;

    if (todoCount === 0 && completedCount === 0) {
      issues.push('Tasks may need status updates');
      score -= 20;
    }
  }

  return { score: Math.max(0, score), issues };
}

async function showWorkflowMenu() {
  console.log(chalk.yellow('📋 Available Workflow Phases:\n'));

  const { phase } = await inquirer.prompt([
    {
      type: 'list',
      name: 'phase',
      message: 'Which workflow phase would you like to work on?',
      choices: [
        { name: '📜 Constitution - Project principles and vision', value: 'constitution' },
        { name: '📝 Specify - Requirements and specifications', value: 'specify' },
        { name: '🏗️  Plan - Technical architecture and design', value: 'plan' },
        { name: '✅ Tasks - Implementation breakdown', value: 'tasks' },
        { name: '📊 Status - Project health check', value: 'status' }
      ]
    }
  ]);

  // Execute selected phase
  await workflowCommand(phase, {});
}

async function checkValidProject() {
  const agentsDir = path.join(process.cwd(), 'agents');
  const specifyDir = path.join(process.cwd(), '.specify');
  const projectsDir = path.join(process.cwd(), '4 - Projects');

  return fs.existsSync(agentsDir) &&
         fs.existsSync(specifyDir) &&
         fs.existsSync(projectsDir);
}

module.exports = workflowCommand;