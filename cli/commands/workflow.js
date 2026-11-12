const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

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
    case 'review':
      await reviewWorkflow(options);
      break;
    case 'spec-driven':
      await specDrivenWorkflow(options);
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
        default: true,
      },
    ]);

    if (updateVision) {
      const { vision } = await inquirer.prompt([
        {
          type: 'input',
          name: 'vision',
          message: 'Enter your project vision:',
          validate: input => input.trim().length > 0 ? true : 'Vision cannot be empty',
        },
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
        default: true,
      },
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

  // Get all task files from project directories
  const allTasks = await getAllTasks(projectsDir);

  console.log(chalk.green('✅ Task Status:'));
  console.log(chalk.gray(`   Tasks Database: ${tasksBasePath}`));
  console.log(chalk.green(`   ✓ ${allTasks.length} total tasks found`));

  // Analyze task distribution
  const statusCounts = {
    'todo': 0,
    'in-progress': 0,
    'completed': 0,
    'blocked': 0,
    'review': 0,
  };

  const priorityCounts = {
    'high': 0,
    'medium': 0,
    'low': 0,
  };

  let overdueTasks = 0;
  let dueToday = 0;
  let dueSoon = 0;

  allTasks.forEach(task => {
    statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;

    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

      if (dueDate < today && task.status !== 'completed') {
        overdueTasks++;
      } else if (dueDate.toDateString() === today.toDateString()) {
        dueToday++;
      } else if (dueDate <= threeDaysFromNow && task.status !== 'completed') {
        dueSoon++;
      }
    }
  });

  // Display status breakdown
  console.log(chalk.blue('\n📊 Status Breakdown:'));
  Object.entries(statusCounts).forEach(([status, count]) => {
    if (count > 0) {
      const icon = status === 'completed' ? '✅' :
        status === 'in-progress' ? '🟡' :
          status === 'blocked' ? '🚫' :
            status === 'review' ? '👁️' : '⚪';
      console.log(`   ${icon} ${status}: ${count}`);
    }
  });

  // Display priority breakdown
  console.log(chalk.blue('\n🚩 Priority Breakdown:'));
  Object.entries(priorityCounts).forEach(([priority, count]) => {
    if (count > 0) {
      const icon = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
      console.log(`   ${icon} ${priority}: ${count}`);
    }
  });

  // Display urgency information
  if (overdueTasks > 0 || dueToday > 0 || dueSoon > 0) {
    console.log(chalk.blue('\n⏰ Urgency Alert:'));
    if (overdueTasks > 0) console.log(chalk.red(`   🚨 ${overdueTasks} overdue tasks`));
    if (dueToday > 0) console.log(chalk.yellow(`   🔥 ${dueToday} tasks due today`));
    if (dueSoon > 0) console.log(chalk.hex('#FFA500')(`   ⚡ ${dueSoon} tasks due soon`));
  }

  // Show top priority tasks
  const topTasks = allTasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      const aScore = priorityScore[a.priority] || 0;
      const bScore = priorityScore[b.priority] || 0;
      return bScore - aScore;
    })
    .slice(0, 5);

  if (topTasks.length > 0) {
    console.log(chalk.blue('\n🎯 Top Priority Tasks:'));
    topTasks.forEach((task, index) => {
      const priorityIcon = task.priority === 'high' ? '🔴' :
        task.priority === 'medium' ? '🟡' : '🟢';
      const project = task.project ? task.project.replace(/\[\[|\]\]/g, '') : 'Unassigned';
      console.log(`   ${index + 1}. ${priorityIcon} ${task.title} (${project})`);
    });
  }

  // Offer task creation if needed
  if (statusCounts['todo'] === 0 && statusCounts['in-progress'] === 0) {
    console.log(chalk.yellow('\n⚠️  No active tasks found.'));

    const { createTasks } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createTasks',
        message: 'Would you like to create implementation tasks from your specifications?',
        default: true,
      },
    ]);

    if (createTasks) {
      await generateTasksFromSpecs();
    }
  }

  console.log(chalk.yellow('\n💡 Next Steps:'));
  console.log('   • Focus on overdue and high-priority tasks first');
  console.log('   • Break down large tasks into smaller 2-4 hour chunks');
  console.log('   • Update task status as you progress');
  console.log('   • Use your preferred AI tool for implementation\n');
}

async function reviewWorkflow(options) {
  console.log(chalk.cyan('🔍 Review Phase - Progress and Outcomes\n'));

  const projectsDir = path.join(process.cwd(), '4 - Projects');
  const specifyDir = path.join(process.cwd(), '.specify');

  // Get all tasks for review
  const allTasks = await getAllTasks(projectsDir);
  const completedTasks = allTasks.filter(task => task.status === 'completed');
  const inProgressTasks = allTasks.filter(task => task.status === 'in-progress');

  console.log(chalk.green('🔍 Review Summary:'));
  console.log(chalk.gray(`   Total Tasks: ${allTasks.length}`));
  console.log(chalk.green(`   ✓ Completed: ${completedTasks.length}`));
  console.log(chalk.yellow(`   🟡 In Progress: ${inProgressTasks.length}`));

  if (completedTasks.length > 0) {
    console.log(chalk.blue('\n✅ Recently Completed Tasks:'));
    completedTasks.slice(-5).forEach((task, index) => {
      const project = task.project ? task.project.replace(/\[\[|\]\]/g, '') : 'Unassigned';
      console.log(`   ${index + 1}. ✅ ${task.title} (${project})`);

      if (task.completed_date) {
        const completed = new Date(task.completed_date);
        const created = new Date(task.created_date);
        const duration = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
        console.log(chalk.gray(`      Completed in ${duration} days`));
      }
    });
  }

  // Check specification completion
  const constitutionPath = path.join(specifyDir, 'memory', 'constitution.md');
  const requirementsPath = path.join(specifyDir, 'specs', 'requirements.md');
  const architecturePath = path.join(specifyDir, 'specs', 'architecture.md');

  console.log(chalk.blue('\n📋 Specification Review:'));

  const specFiles = [
    { name: 'Constitution', path: constitutionPath },
    { name: 'Requirements', path: requirementsPath },
    { name: 'Architecture', path: architecturePath },
  ];

  for (const spec of specFiles) {
    if (fs.existsSync(spec.path)) {
      const content = await fs.readFile(spec.path, 'utf8');
      const placeholders = (content.match(/\[REPLACE_WITH_|\[INSERT_|\[Description\]/g) || []).length;

      if (placeholders === 0) {
        console.log(chalk.green(`   ✅ ${spec.name}: Complete`));
      } else {
        console.log(chalk.yellow(`   ⚠️  ${spec.name}: ${placeholders} items pending`));
      }
    } else {
      console.log(chalk.red(`   ❌ ${spec.name}: Not found`));
    }
  }

  // Project health assessment
  const completionRate = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;
  const healthColor = completionRate >= 80 ? chalk.green :
    completionRate >= 60 ? chalk.yellow : chalk.red;

  console.log(healthColor(`\n🎯 Project Completion: ${Math.round(completionRate)}%`));

  // Recommendations
  console.log(chalk.yellow('\n💡 Review Recommendations:'));

  if (completionRate >= 80) {
    console.log(chalk.gray('   • Project nearing completion - prepare for deployment'));
    console.log(chalk.gray('   • Conduct final testing and quality assurance'));
    console.log(chalk.gray('   • Update documentation and prepare release notes'));
  } else if (completionRate >= 60) {
    console.log(chalk.gray('   • Good progress - focus on remaining high-priority tasks'));
    console.log(chalk.gray('   • Address any blockers or dependencies'));
    console.log(chalk.gray('   • Plan next development iteration'));
  } else {
    console.log(chalk.gray('   • Early stage - ensure specifications are complete'));
    console.log(chalk.gray('   • Focus on foundational tasks and infrastructure'));
    console.log(chalk.gray('   • Consider adjusting scope or timeline if needed'));
  }

  if (inProgressTasks.length > 3) {
    console.log(chalk.gray('   • Consider focusing on completing current tasks before starting new ones'));
  }

  console.log(chalk.yellow('\n🔄 Next Actions:'));
  console.log('   • Update task statuses based on current progress');
  console.log('   • Address any incomplete specifications');
  console.log('   • Plan next development cycle');
  console.log('   • Schedule stakeholder review if needed\n');
}

async function statusWorkflow(options) {
  console.log(chalk.cyan('📊 Workflow Status - Project Health Check\n'));

  // Check each phase
  const phases = [
    { name: 'Constitution', file: '.specify/memory/constitution.md', check: checkConstitution },
    { name: 'Requirements', file: '.specify/specs/requirements.md', check: checkRequirements },
    { name: 'Architecture', file: '.specify/specs/architecture.md', check: checkArchitecture },
    { name: 'Tasks', file: '4 - Projects/Tasks.base', check: checkTasks },
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
        { name: '🔧 Spec-Driven - Automated implementation from specs', value: 'spec-driven' },
        { name: '🔍 Review - Progress and outcomes assessment', value: 'review' },
        { name: '📊 Status - Project health check', value: 'status' },
      ],
    },
  ]);

  // Execute selected phase
  await workflowCommand(phase, {});
}

async function getAllTasks(projectsDir) {
  const tasks = [];

  // Recursively find all task files
  async function findTaskFiles(dir) {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory() && !item.name.startsWith('.')) {
        await findTaskFiles(fullPath);
      } else if (item.isFile() && item.name.endsWith('.md')) {
        try {
          const content = await fs.readFile(fullPath, 'utf8');

          // Check if it's a task file (has task frontmatter or tag)
          if (content.includes('tags:') && content.includes('task') ||
              content.includes('title:') && content.includes('status:')) {

            // Parse frontmatter
            const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
            if (frontmatterMatch) {
              const frontmatter = frontmatterMatch[1];
              const task = {
                title: extractField(frontmatter, 'title') || path.basename(item.name, '.md'),
                status: extractField(frontmatter, 'status') || 'todo',
                priority: extractField(frontmatter, 'priority') || 'medium',
                project: extractField(frontmatter, 'project') || '',
                assignee: extractField(frontmatter, 'assignee') || 'me',
                due_date: extractField(frontmatter, 'due_date') || '',
                created_date: extractField(frontmatter, 'created_date') || '',
                time_estimate: extractField(frontmatter, 'time_estimate') || 0,
                time_spent: extractField(frontmatter, 'time_spent') || 0,
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

function extractField(frontmatter, fieldName) {
  const regex = new RegExp(`${fieldName}\\s*:\\s*["']?([^"'\n]+)["']?`);
  const match = frontmatter.match(regex);
  return match ? match[1].trim() : '';
}

async function generateTasksFromSpecs() {
  console.log(chalk.cyan('\n🔧 Generating Tasks from Specifications...\n'));

  const specsDir = path.join(process.cwd(), '.specify', 'specs');
  const projectsDir = path.join(process.cwd(), '4 - Projects');

  if (!fs.existsSync(specsDir)) {
    console.log(chalk.red('❌ Specifications directory not found.'));
    return;
  }

  // Get current project name
  const currentProject = path.basename(process.cwd());

  // Create project directory if it doesn't exist
  const projectDir = path.join(projectsDir, currentProject);
  const tasksDir = path.join(projectDir, 'Tasks');

  await fs.ensureDir(tasksDir);

  // Generate sample tasks based on common development phases
  const sampleTasks = [
    {
      title: 'Setup Development Environment',
      priority: 'high',
      estimate: 60,
      description: 'Configure local development environment with all necessary tools and dependencies',
    },
    {
      title: 'Implement Core Features',
      priority: 'high',
      estimate: 240,
      description: 'Build the main functionality as defined in specifications',
    },
    {
      title: 'Write Unit Tests',
      priority: 'medium',
      estimate: 180,
      description: 'Create comprehensive test suite for core functionality',
    },
    {
      title: 'Documentation',
      priority: 'medium',
      estimate: 120,
      description: 'Write user documentation and API documentation',
    },
    {
      title: 'Code Review and Refactoring',
      priority: 'low',
      estimate: 90,
      description: 'Review code quality and refactor as needed',
    },
  ];

  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  for (let i = 0; i < sampleTasks.length; i++) {
    const task = sampleTasks[i];
    const fileName = `Task - ${task.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}.md`;
    const filePath = path.join(tasksDir, fileName);

    const taskContent = `---
title: "${task.title}"
status: "todo"
priority: "${task.priority}"
project: "[[${currentProject}]]"
assignee: "me"
due_date: "${dueDate}"
created_date: "${today}"
completed_date: ""
time_estimate: ${task.estimate}
time_spent: 0
dependencies: []
subtasks: []
tags:
  - task
  - generated
---

# 🔧 ${task.title}

## 🎯 Objective
${task.description}

## 📋 Acceptance Criteria
- [ ] Task completed according to specifications
- [ ] Code reviewed and approved
- [ ] Tests passing
- [ ] Documentation updated

## 🔧 Implementation Notes
Generated from workflow specification phase.

## 📊 Success Metrics
- Functionality works as expected
- Code quality standards met
- Performance requirements satisfied

## 🔗 Dependencies
- Previous tasks in workflow
- Required tools and environment

## 📝 Notes
This task was auto-generated from the workflow specification phase.
`;

    await fs.writeFile(filePath, taskContent);
    console.log(chalk.green(`   ✓ Created task: ${task.title}`));
  }

  console.log(chalk.green(`\n✅ Generated ${sampleTasks.length} tasks for ${currentProject}`));
  console.log(chalk.yellow('💡 Review and customize the tasks as needed\n'));
}

async function specDrivenWorkflow(options) {
  console.log(chalk.cyan('🔧 Spec-Driven Development - Automated Implementation\n'));

  const specifyDir = path.join(process.cwd(), '.specify');
  const specsDir = path.join(specifyDir, 'specs');
  const projectsDir = path.join(process.cwd(), '4 - Projects');

  // Check if specifications exist
  if (!fs.existsSync(specsDir)) {
    console.log(chalk.red('❌ Specifications directory not found.'));
    console.log(chalk.gray('   Run "obsidian-kit workflow specify" first to create specifications.\n'));
    return;
  }

  // Analyze specifications
  console.log(chalk.blue('📊 Analyzing Specifications...\n'));
  const specAnalysis = await analyzeSpecifications(specsDir);

  if (specAnalysis.completeness < 60) {
    console.log(chalk.yellow('⚠️  Specifications are incomplete.'));
    console.log(chalk.gray(`   Overall completeness: ${specAnalysis.completeness}%\n`));

    const { proceedAnyway } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceedAnyway',
        message: 'Proceed with task generation anyway?',
        default: false,
      },
    ]);

    if (!proceedAnyway) {
      console.log(chalk.yellow('💡 Complete specifications first using workflow commands.\n'));
      return;
    }
  }

  // Show spec analysis results
  console.log(chalk.green('📋 Specification Analysis:'));
  console.log(chalk.gray(`   Requirements completeness: ${specAnalysis.requirements.completeness}%`));
  console.log(chalk.gray(`   Architecture completeness: ${specAnalysis.architecture.completeness}%`));
  console.log(chalk.gray(`   Overall spec quality: ${specAnalysis.completeness}%\n`));

  // Generate implementation plan
  console.log(chalk.blue('🏗️  Generating Implementation Plan...\n'));
  const implementationPlan = await generateImplementationPlan(specAnalysis);

  console.log(chalk.green('📝 Implementation Plan Generated:'));
  console.log(chalk.gray(`   Total tasks: ${implementationPlan.tasks.length}`));
  console.log(chalk.gray(`   Estimated effort: ${implementationPlan.totalEstimate} hours`));
  console.log(chalk.gray(`   Phases: ${implementationPlan.phases.length}\n`));

  // Show task breakdown
  console.log(chalk.blue('🎯 Task Breakdown by Phase:'));
  implementationPlan.phases.forEach((phase, index) => {
    console.log(chalk.cyan(`\n   Phase ${index + 1}: ${phase.name}`));
    phase.tasks.forEach((task, taskIndex) => {
      const priorityIcon = task.priority === 'high' ? '🔴' :
        task.priority === 'medium' ? '🟡' : '🟢';
      console.log(`     ${taskIndex + 1}. ${priorityIcon} ${task.title} (${task.estimate}h)`);
    });
  });

  // Confirm task generation
  const { confirmGeneration } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmGeneration',
      message: '\nGenerate these tasks in your project?',
      default: true,
    },
  ]);

  if (confirmGeneration) {
    await generateSpecDrivenTasks(implementationPlan, projectsDir);
    console.log(chalk.green('\n✅ Spec-driven development tasks created successfully!'));
    console.log(chalk.yellow('💡 Next Steps:'));
    console.log('   • Review generated tasks in your project directory');
    console.log('   • Start with high-priority tasks first');
    console.log('   • Update task status as you progress');
    console.log('   • Use "obsidian-kit workflow tasks" to track progress\n');
  } else {
    console.log(chalk.yellow('\n❌ Task generation cancelled.\n'));
  }
}

async function analyzeSpecifications(specsDir) {
  const requirementsPath = path.join(specsDir, 'requirements.md');
  const architecturePath = path.join(specsDir, 'architecture.md');

  const analysis = {
    requirements: { completeness: 0, issues: [], features: [] },
    architecture: { completeness: 0, issues: [], components: [] },
    completeness: 0,
  };

  // Analyze requirements
  if (fs.existsSync(requirementsPath)) {
    const requirements = await fs.readFile(requirementsPath, 'utf8');

    // Check for placeholders
    const placeholders = (requirements.match(/\[Define|\[Description\]|\[Metric|\[List/g) || []).length;
    analysis.requirements.issues.push(`${placeholders} requirement items need completion`);

    // Extract features
    const featureMatches = requirements.match(/- \[ \] Enhanced.*?$/gm) || [];
    analysis.requirements.features = featureMatches.map(f => f.replace(/- \[ \] /, '').trim());

    // Calculate completeness
    analysis.requirements.completeness = Math.max(0, 100 - (placeholders * 5));
  } else {
    analysis.requirements.issues.push('Requirements file not found');
    analysis.requirements.completeness = 0;
  }

  // Analyze architecture
  if (fs.existsSync(architecturePath)) {
    const architecture = await fs.readFile(architecturePath, 'utf8');

    // Check for placeholders
    const placeholders = (architecture.match(/\[Pattern|\[Method|\[Strategy|\[Improvement/g) || []).length;
    analysis.architecture.issues.push(`${placeholders} architecture items need completion`);

    // Extract components
    const componentMatches = architecture.match(/\d+\. \*\*.*?\*\*: .*?$/gm) || [];
    analysis.architecture.components = componentMatches.map(c => c.replace(/\d+\. \*\*|\*\*:|$/g, '').trim());

    // Calculate completeness
    analysis.architecture.completeness = Math.max(0, 100 - (placeholders * 5));
  } else {
    analysis.architecture.issues.push('Architecture file not found');
    analysis.architecture.completeness = 0;
  }

  // Overall completeness
  analysis.completeness = Math.round((analysis.requirements.completeness + analysis.architecture.completeness) / 2);

  return analysis;
}

async function generateImplementationPlan(specAnalysis) {
  const phases = [];
  const allTasks = [];
  let totalEstimate = 0;

  // Phase 1: Foundation & Setup
  const foundationTasks = [
    {
      title: 'Setup Development Environment',
      description: 'Configure local development environment with required tools and dependencies',
      priority: 'high',
      estimate: 30,
      phase: 'Foundation',
    },
    {
      title: 'Initialize Project Structure',
      description: 'Create project directory structure and configuration files',
      priority: 'high',
      estimate: 20,
      phase: 'Foundation',
    },
  ];

  // Phase 2: Core Implementation
  const coreTasks = specAnalysis.requirements.features.map((feature, index) => ({
    title: `Implement ${feature}`,
    description: `Build the ${feature.toLowerCase()} as defined in requirements`,
    priority: index < 2 ? 'high' : 'medium',
    estimate: 40 + (index * 10),
    phase: 'Core Implementation',
  }));

  // Phase 3: Integration & Testing
  const integrationTasks = [
    {
      title: 'Component Integration',
      description: 'Integrate all implemented components and ensure they work together',
      priority: 'high',
      estimate: 60,
      phase: 'Integration',
    },
    {
      title: 'Write Comprehensive Tests',
      description: 'Create unit tests, integration tests, and end-to-end tests',
      priority: 'medium',
      estimate: 80,
      phase: 'Integration',
    },
    {
      title: 'Performance Testing',
      description: 'Test system performance and optimize bottlenecks',
      priority: 'medium',
      estimate: 40,
      phase: 'Integration',
    },
  ];

  // Phase 4: Documentation & Deployment
  const documentationTasks = [
    {
      title: 'Write User Documentation',
      description: 'Create comprehensive user guides and API documentation',
      priority: 'medium',
      estimate: 50,
      phase: 'Documentation',
    },
    {
      title: 'Prepare Deployment',
      description: 'Setup deployment pipeline and production configuration',
      priority: 'low',
      estimate: 30,
      phase: 'Documentation',
    },
  ];

  // Combine all tasks
  const allPhaseTasks = [...foundationTasks, ...coreTasks, ...integrationTasks, ...documentationTasks];

  // Group by phase
  const phasesMap = {};
  allPhaseTasks.forEach(task => {
    if (!phasesMap[task.phase]) {
      phasesMap[task.phase] = {
        name: task.phase,
        tasks: [],
      };
    }
    phasesMap[task.phase].tasks.push(task);
    totalEstimate += task.estimate;
  });

  phases.push(...Object.values(phasesMap));
  allTasks.push(...allPhaseTasks);

  return {
    phases,
    tasks: allTasks,
    totalEstimate,
  };
}

async function generateSpecDrivenTasks(implementationPlan, projectsDir) {
  const currentProject = path.basename(process.cwd());
  const projectDir = path.join(projectsDir, currentProject);
  const tasksDir = path.join(projectDir, 'Tasks');

  await fs.ensureDir(tasksDir);

  const today = new Date().toISOString().split('T')[0];
  const phaseDelays = {
    'Foundation': 0,
    'Core Implementation': 3,
    'Integration': 10,
    'Documentation': 18,
  };

  for (const phase of implementationPlan.phases) {
    for (let i = 0; i < phase.tasks.length; i++) {
      const task = phase.tasks[i];
      const fileName = `Task - ${task.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}.md`;
      const filePath = path.join(tasksDir, fileName);

      const daysFromStart = phaseDelays[task.phase] + (i * 2);
      const dueDate = new Date(Date.now() + daysFromStart * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const taskContent = `---
title: "${task.title}"
status: "todo"
priority: "${task.priority}"
project: "[[${currentProject}]]"
assignee: "AI Agent"
due_date: "${dueDate}"
created_date: "${today}"
completed_date: ""
time_estimate: ${task.estimate * 60}
time_spent: 0
dependencies: []
subtasks: []
tags:
  - task
  - spec-driven
  - ${task.phase.toLowerCase().replace(/\s+/g, '-')}
---

# 🔧 ${task.title}

## 🎯 Objective
${task.description}

## 📋 Acceptance Criteria
- [ ] Implementation follows specification requirements
- [ ] Code meets quality standards
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Integration with existing components works

## 🔧 Implementation Details
Generated from spec-driven development workflow based on project specifications.

### Phase: ${task.phase}
### Priority: ${task.priority}
### Estimated Time: ${task.estimate} hours

## 📊 Success Metrics
- Functionality implemented as specified
- Code quality standards maintained
- Performance requirements met
- Integration tests passing

## 🔗 Dependencies
- Previous tasks in ${task.phase} phase
- Required components and services
- External dependencies and APIs

## 📝 Notes
This task was automatically generated from project specifications using the spec-driven development workflow.

## 🧪 Testing Plan
- Unit tests for core functionality
- Integration tests with related components
- Manual testing of user workflows
- Performance validation if applicable

---

*Generated by Obsidian Kit Spec-Driven Development*
*Phase: ${task.phase}*
`;

      await fs.writeFile(filePath, taskContent);
      console.log(chalk.green(`   ✓ Created: ${task.title}`));
    }
  }
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
