const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');
const inquirer = require('inquirer');

class TaskBreakdownEngine {
  constructor(vaultPath) {
    this.vaultPath = vaultPath;
    this.historicalData = [];
    this.taskPatterns = new Map();
    this.loadHistoricalData();
  }

  async loadHistoricalData() {
    try {
      const tasksPath = path.join(this.vaultPath, '4 - Projects');
      const taskFiles = await this.findTaskFiles(tasksPath);

      for (const filePath of taskFiles) {
        const content = await fs.readFile(filePath, 'utf8');
        const task = this.parseTaskFile(content, filePath);
        if (task) {
          this.historicalData.push(task);
          this.analyzeTaskPatterns(task);
        }
      }

      console.log(chalk.green(`✅ Loaded ${this.historicalData.length} historical tasks`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not load historical data: ${error.message}`));
    }
  }

  async findTaskFiles(dir) {
    const files = [];

    async function traverse(currentDir) {
      const items = await fs.readdir(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory() && item.includes('Tasks')) {
          const subItems = await fs.readdir(fullPath);
          for (const subItem of subItems) {
            if (subItem.endsWith('.md')) {
              files.push(path.join(fullPath, subItem));
            }
          }
        } else if (stat.isDirectory()) {
          await traverse(fullPath);
        }
      }
    }

    await traverse(dir);
    return files;
  }

  parseTaskFile(content, filePath) {
    try {
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontMatterMatch) return null;

      const frontMatter = yaml.parse(frontMatterMatch[1]);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : frontMatter.title || 'Unknown';

      return {
        title: frontMatter.title || title,
        status: frontMatter.status || 'todo',
        priority: frontMatter.priority || 'medium',
        time_estimate: frontMatter.time_estimate || 0,
        time_spent: frontMatter.time_spent || 0,
        project: frontMatter.project || '',
        tags: frontMatter.tags || [],
        subtasks: frontMatter.subtasks || [],
        dependencies: frontMatter.dependencies || [],
        created_date: frontMatter.created_date,
        completed_date: frontMatter.completed_date,
        description: this.extractDescription(content),
        filePath,
      };
    } catch (error) {
      return null;
    }
  }

  extractDescription(content) {
    const lines = content.split('\n');
    const descriptionStart = lines.findIndex(line => line.startsWith('# '));
    if (descriptionStart === -1) return '';

    let description = '';
    for (let i = descriptionStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('##') || line.startsWith('---')) break;
      description += line + '\n';
    }

    return description.trim();
  }

  analyzeTaskPatterns(task) {
    // Analyze patterns based on title, tags, and description
    const keywords = this.extractKeywords(task.title + ' ' + task.description);
    const complexity = this.estimateComplexity(task);

    keywords.forEach(keyword => {
      if (!this.taskPatterns.has(keyword)) {
        this.taskPatterns.set(keyword, []);
      }
      this.taskPatterns.get(keyword).push({
        complexity,
        actualTime: task.time_spent || task.time_estimate,
        subtaskCount: task.subtasks.length,
        status: task.status,
      });
    });
  }

  extractKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Filter out common words and keep meaningful keywords
    const commonWords = ['this', 'that', 'with', 'from', 'they', 'have', 'been', 'will', 'would', 'could', 'should'];
    return words.filter(word => !commonWords.includes(word));
  }

  estimateComplexity(task) {
    let complexity = 1;

    // Title complexity
    const titleWords = task.title.split(' ').length;
    complexity += Math.min(titleWords / 5, 2);

    // Description length
    const descWords = task.description.split(' ').length;
    complexity += Math.min(descWords / 50, 2);

    // Subtasks count
    complexity += Math.min(task.subtasks.length / 3, 2);

    // Dependencies
    complexity += Math.min(task.dependencies.length / 2, 1);

    // Priority weighting
    if (task.priority === 'high') complexity += 1;
    else if (task.priority === 'medium') complexity += 0.5;

    return Math.round(complexity * 10) / 10;
  }

  async breakdownTask(taskDescription, options = {}) {
    console.log(chalk.blue('🧠 Analyzing task for breakdown...'));

    const analysis = this.analyzeTask(taskDescription);
    const breakdown = await this.generateBreakdown(analysis, options);

    return {
      originalTask: taskDescription,
      analysis,
      breakdown,
      confidence: this.calculateConfidence(analysis),
      estimatedTotalTime: breakdown.reduce((sum, subtask) => sum + subtask.estimated_time, 0),
    };
  }

  analyzeTask(taskDescription) {
    const keywords = this.extractKeywords(taskDescription);
    const similarTasks = this.findSimilarTasks(keywords);
    const complexity = this.estimateComplexityFromDescription(taskDescription);

    return {
      keywords,
      similarTasks,
      complexity,
      suggestedSubtaskCount: this.calculateOptimalSubtaskCount(complexity),
      riskFactors: this.identifyRiskFactors(taskDescription),
    };
  }

  findSimilarTasks(keywords) {
    const similar = [];

    for (const [keyword, tasks] of this.taskPatterns) {
      if (keywords.includes(keyword)) {
        similar.push(...tasks);
      }
    }

    return similar.slice(0, 10); // Return top 10 similar tasks
  }

  estimateComplexityFromDescription(description) {
    let complexity = 1;

    // Length-based complexity
    const words = description.split(' ').length;
    complexity += Math.min(words / 30, 2);

    // Technical indicators
    const technicalTerms = ['implement', 'develop', 'create', 'build', 'design', 'integrate', 'configure', 'setup'];
    const technicalCount = technicalTerms.filter(term =>
      description.toLowerCase().includes(term),
    ).length;
    complexity += technicalCount * 0.5;

    // Multi-step indicators
    const multiStepTerms = ['and', 'then', 'after', 'followed by', 'next', 'finally'];
    const multiStepCount = multiStepTerms.filter(term =>
      description.toLowerCase().includes(term),
    ).length;
    complexity += multiStepCount * 0.3;

    return Math.round(complexity * 10) / 10;
  }

  calculateOptimalSubtaskCount(complexity) {
    if (complexity < 2) return 1;
    if (complexity < 3) return 2;
    if (complexity < 4) return 3;
    if (complexity < 5) return 4;
    return Math.min(Math.floor(complexity), 6);
  }

  identifyRiskFactors(description) {
    const risks = [];

    if (description.toLowerCase().includes('new') || description.toLowerCase().includes('unknown')) {
      risks.push('Unknown territory - may require research');
    }

    if (description.toLowerCase().includes('integrate') || description.toLowerCase().includes('connect')) {
      risks.push('Integration complexity - dependencies may be unclear');
    }

    if (description.toLowerCase().includes('large') || description.toLowerCase().includes('complex')) {
      risks.push('Scope may be larger than initially estimated');
    }

    if (description.toLowerCase().includes('external') || description.toLowerCase().includes('third-party')) {
      risks.push('External dependencies - potential blockers');
    }

    return risks;
  }

  async generateBreakdown(analysis, options) {
    const subtaskCount = options.subtaskCount || analysis.suggestedSubtaskCount;
    const breakdown = [];

    // Generate subtasks based on patterns and complexity
    if (analysis.complexity < 2) {
      // Simple task - create research and implementation phases
      breakdown.push({
        title: `Research and planning for ${analysis.keywords.slice(0, 2).join(' ')}`,
        description: 'Investigate requirements and plan approach',
        estimated_time: 60,
        priority: 'high',
        dependencies: [],
        type: 'planning',
      });

      breakdown.push({
        title: `Implement ${analysis.keywords.slice(0, 2).join(' ')}`,
        description: 'Execute the main implementation work',
        estimated_time: 120,
        priority: 'high',
        dependencies: [breakdown[0].title],
        type: 'implementation',
      });
    } else {
      // Complex task - break down into logical phases
      const phases = this.generatePhases(analysis, subtaskCount);

      phases.forEach((phase, index) => {
        const estimatedTime = this.estimatePhaseTime(phase, analysis);

        breakdown.push({
          title: phase.title,
          description: phase.description,
          estimated_time: estimatedTime,
          priority: this.calculatePhasePriority(phase, index, subtaskCount),
          dependencies: phase.dependencies,
          type: phase.type,
        });
      });
    }

    return breakdown;
  }

  generatePhases(analysis, subtaskCount) {
    const phases = [];
    const keywords = analysis.keywords;

    // Always start with research/planning for complex tasks
    phases.push({
      title: 'Research and analysis',
      description: `Investigate ${keywords.slice(0, 3).join(', ')} requirements and constraints`,
      dependencies: [],
      type: 'planning',
    });

    // Generate implementation phases based on complexity
    if (subtaskCount >= 3) {
      phases.push({
        title: 'Core implementation',
        description: `Implement main functionality for ${keywords.slice(0, 2).join(' ')}`,
        dependencies: [phases[0].title],
        type: 'implementation',
      });

      phases.push({
        title: 'Testing and refinement',
        description: 'Test implementation and refine based on results',
        dependencies: [phases[1].title],
        type: 'testing',
      });
    }

    // Add additional phases for very complex tasks
    if (subtaskCount >= 4) {
      phases.push({
        title: 'Integration and deployment',
        description: 'Integrate with existing systems and deploy',
        dependencies: [phases[2].title],
        type: 'deployment',
      });
    }

    if (subtaskCount >= 5) {
      phases.push({
        title: 'Documentation and cleanup',
        description: 'Document changes and clean up temporary files',
        dependencies: [phases[3].title],
        type: 'documentation',
      });
    }

    return phases.slice(0, subtaskCount);
  }

  estimatePhaseTime(phase, analysis) {
    const baseTime = {
      planning: 60,
      implementation: 120,
      testing: 90,
      deployment: 60,
      documentation: 45,
    };

    let time = baseTime[phase.type] || 90;

    // Adjust based on complexity
    time *= analysis.complexity / 3;

    // Adjust based on similar historical tasks
    const similarTasks = analysis.similarTasks.filter(task =>
      task.status === 'completed' && task.actualTime > 0,
    );

    if (similarTasks.length > 0) {
      const avgTime = similarTasks.reduce((sum, task) => sum + task.actualTime, 0) / similarTasks.length;
      time = (time + avgTime) / 2; // Average of estimated and historical
    }

    return Math.round(time / 15) * 15; // Round to nearest 15 minutes
  }

  calculatePhasePriority(phase, index, totalPhases) {
    if (index === 0) return 'high'; // First phase is always high priority
    if (index === totalPhases - 1) return 'medium'; // Last phase is medium
    return 'high'; // Middle phases are high
  }

  calculateConfidence(analysis) {
    let confidence = 0.5; // Base confidence

    // More similar tasks = higher confidence
    confidence += Math.min(analysis.similarTasks.length / 5, 0.3);

    // More keywords = higher confidence (better understanding)
    confidence += Math.min(analysis.keywords.length / 10, 0.1);

    // Lower complexity = higher confidence
    confidence += Math.max(0, (5 - analysis.complexity) / 10);

    return Math.round(Math.min(confidence, 0.95) * 100);
  }

  async createTaskFiles(breakdown, projectPath) {
    const createdFiles = [];

    for (const subtask of breakdown.breakdown) {
      const fileName = this.sanitizeFileName(subtask.title) + '.md';
      const filePath = path.join(projectPath, 'Tasks', fileName);

      // Ensure Tasks directory exists
      await fs.ensureDir(path.dirname(filePath));

      const taskContent = this.generateTaskFile(subtask, breakdown.originalTask);
      await fs.writeFile(filePath, taskContent, 'utf8');

      createdFiles.push(filePath);
    }

    return createdFiles;
  }

  sanitizeFileName(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  generateTaskFile(subtask, originalTask) {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + (subtask.estimated_time * 60 * 1000 * 2)).toISOString().split('T')[0];

    return `---
title: "${subtask.title}"
status: "todo"
priority: "${subtask.priority}"
project: "[[Task-Management-Intelligence]]"
assignee: "AI Agent"
due_date: "${dueDate}"
created_date: "${today}"
completed_date: ""
time_estimate: ${subtask.estimated_time}
time_spent: 0
dependencies: ${JSON.stringify(subtask.dependencies)}
subtasks: []
tags:
  - task
  - ai-generated
  - ${subtask.type}
---

# ${subtask.title}

## 🎯 Objective
${subtask.description}

## 📋 Acceptance Criteria
- [ ] Complete ${subtask.title.toLowerCase()}
- [ ] Verify all requirements are met
- [ ] Test functionality thoroughly
- [ ] Update documentation if needed

## 🔗 Dependencies
${subtask.dependencies.length > 0 ? subtask.dependencies.map(dep => `- [[${dep}]]`).join('\n') : 'No dependencies'}

## 📝 Notes
This task was automatically generated by the AI Task Breakdown system from: "${originalTask}"

Estimated time: ${Math.round(subtask.estimated_time / 60 * 10) / 10} hours
Priority: ${subtask.priority}
Type: ${subtask.type}
`;
  }
}

async function taskBreakdownCommand(taskDescription, options) {
  try {
    const vaultPath = process.cwd();

    if (!await fs.pathExists(path.join(vaultPath, '4 - Projects'))) {
      console.log(chalk.red('❌ Not in an Obsidian Kit vault. Make sure you\'re in a project directory.'));
      return;
    }

    const engine = new TaskBreakdownEngine(vaultPath);

    if (!taskDescription) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'taskDescription',
          message: 'Enter the task description to break down:',
          validate: input => input.length > 0 || 'Task description is required',
        },
        {
          type: 'number',
          name: 'subtaskCount',
          message: 'How many subtasks would you like? (optional)',
          default: 0,
        },
      ]);

      taskDescription = answers.taskDescription;
      options.subtaskCount = answers.subtaskCount || undefined;
    }

    console.log(chalk.blue(`\n🧠 Breaking down task: "${taskDescription}"\n`));

    const breakdown = await engine.breakdownTask(taskDescription, options);

    console.log(chalk.green('📊 Task Analysis:'));
    console.log(`   Complexity: ${breakdown.analysis.complexity}/5`);
    console.log(`   Keywords: ${breakdown.analysis.keywords.join(', ')}`);
    console.log(`   Similar tasks found: ${breakdown.analysis.similarTasks.length}`);
    console.log(`   Confidence: ${breakdown.confidence}%`);

    if (breakdown.analysis.riskFactors.length > 0) {
      console.log(chalk.yellow('⚠️  Risk Factors:'));
      breakdown.analysis.riskFactors.forEach(risk => {
        console.log(`   • ${risk}`);
      });
    }

    console.log(chalk.green('\n📋 Suggested Breakdown:'));
    breakdown.breakdown.forEach((subtask, index) => {
      console.log(`\n${index + 1}. ${chalk.cyan(subtask.title)}`);
      console.log(`   📝 ${subtask.description}`);
      console.log(`   ⏱️  ${Math.round(subtask.estimated_time / 60 * 10) / 10}h | 🚩 ${subtask.priority} | 🏷️ ${subtask.type}`);
      if (subtask.dependencies.length > 0) {
        console.log(`   🔗 Depends on: ${subtask.dependencies.join(', ')}`);
      }
    });

    console.log(chalk.green(`\n⏱️  Total estimated time: ${Math.round(breakdown.estimatedTotalTime / 60 * 10) / 10} hours`));

    if (!options.dryRun) {
      const { shouldCreate } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldCreate',
          message: 'Create these task files in the current project?',
          default: true,
        },
      ]);

      if (shouldCreate) {
        const projectPath = path.join(vaultPath, '4 - Projects', 'Task-Management-Intelligence');
        const createdFiles = await engine.createTaskFiles(breakdown, projectPath);

        console.log(chalk.green(`\n✅ Created ${createdFiles.length} task files:`));
        createdFiles.forEach(file => {
          console.log(`   📄 ${path.relative(vaultPath, file)}`);
        });

        console.log(chalk.blue('\n💡 Next steps:'));
        console.log('   1. Review the generated tasks in your Obsidian vault');
        console.log('   2. Adjust estimates and priorities as needed');
        console.log('   3. Start with the first task (research and planning)');
      }
    }

  } catch (error) {
    console.error(chalk.red('❌ Error during task breakdown:'), error.message);
  }
}

module.exports = taskBreakdownCommand;
