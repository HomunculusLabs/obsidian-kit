const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');
const chalk = require('chalk');

class TaskQualityValidator {
  constructor(vaultPath) {
    this.vaultPath = vaultPath;
    this.validationRules = this.initializeValidationRules();
  }

  initializeValidationRules() {
    return {
      required: {
        title: { weight: 20, message: 'Task title is required' },
        status: { weight: 15, message: 'Task status is required' },
        priority: { weight: 10, message: 'Task priority is required' },
        project: { weight: 10, message: 'Task project assignment is required' },
      },
      quality: {
        descriptionLength: {
          weight: 15,
          min: 50,
          max: 1000,
          message: 'Description should be between 50-1000 characters',
        },
        acceptanceCriteria: {
          weight: 20,
          min: 3,
          message: 'Should have at least 3 acceptance criteria',
        },
        timeEstimate: {
          weight: 10,
          min: 15,
          max: 480,
          message: 'Time estimate should be between 15 minutes and 8 hours',
        },
        dependencies: {
          weight: 5,
          message: 'Dependencies should be clearly identified',
        },
        tags: {
          weight: 5,
          min: 1,
          message: 'Should have at least one relevant tag',
        },
      },
      best_practices: {
        smartTitle: {
          weight: 10,
          message: 'Title should be clear and action-oriented',
        },
        measurableOutcomes: {
          weight: 15,
          message: 'Acceptance criteria should be measurable',
        },
        realisticScope: {
          weight: 10,
          message: 'Task scope should be realistic for time estimate',
        },
      },
    };
  }

  async validateTask(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const task = this.parseTaskFile(content, filePath);

      if (!task) {
        return {
          score: 0,
          issues: ['Could not parse task file'],
          suggestions: ['Check file format and frontmatter'],
          status: 'error',
        };
      }

      const validation = this.performValidation(task, content);

      return {
        score: validation.score,
        grade: this.calculateGrade(validation.score),
        issues: validation.issues,
        suggestions: validation.suggestions,
        strengths: validation.strengths,
        status: validation.score >= 70 ? 'pass' : 'fail',
        task,
      };

    } catch (error) {
      return {
        score: 0,
        issues: [`Error reading file: ${error.message}`],
        suggestions: ['Check file permissions and format'],
        status: 'error',
      };
    }
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
        acceptanceCriteria: this.extractAcceptanceCriteria(content),
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
      if (line.startsWith('##')) break;
      description += line + '\n';
    }

    return description.trim();
  }

  extractAcceptanceCriteria(content) {
    const acMatch = content.match(/##\s*[📋]?[Aa]cceptance\s+[Cc]riteria\n([\s\S]*?)(?=\n##|\n---|$)/);
    if (!acMatch) return [];

    const criteriaText = acMatch[1];
    const criteria = [];

    criteriaText.split('\n').forEach(line => {
      const cleaned = line.replace(/^[\s\-\*\[\]x✓]/, '').trim();
      if (cleaned && !cleaned.startsWith('##')) {
        criteria.push(cleaned);
      }
    });

    return criteria;
  }

  performValidation(task, content) {
    const result = {
      score: 0,
      maxScore: 100,
      issues: [],
      suggestions: [],
      strengths: [],
    };

    // Required fields validation
    for (const [field, rule] of Object.entries(this.validationRules.required)) {
      if (!task[field] || (Array.isArray(task[field]) && task[field].length === 0)) {
        result.issues.push(rule.message);
        result.suggestions.push(`Add ${field} to the task`);
      } else {
        result.score += rule.weight;
        result.strengths.push(`${field} is properly defined`);
      }
    }

    // Quality validation
    for (const [ruleName, rule] of Object.entries(this.validationRules.quality)) {
      const validation = this.validateQualityRule(ruleName, rule, task, content);
      if (validation.passed) {
        result.score += rule.weight;
        result.strengths.push(validation.message);
      } else {
        result.issues.push(rule.message);
        result.suggestions.push(validation.suggestion);
      }
    }

    // Best practices validation
    for (const [ruleName, rule] of Object.entries(this.validationRules.best_practices)) {
      const validation = this.validateBestPractice(ruleName, rule, task, content);
      if (validation.passed) {
        result.score += rule.weight;
        result.strengths.push(validation.message);
      } else {
        result.issues.push(rule.message);
        result.suggestions.push(validation.suggestion);
      }
    }

    return result;
  }

  validateQualityRule(ruleName, rule, task, content) {
    switch (ruleName) {
    case 'descriptionLength':
      const descLength = task.description.length;
      if (descLength >= rule.min && descLength <= rule.max) {
        return { passed: true, message: 'Description length is appropriate' };
      }
      return {
        passed: false,
        suggestion: descLength < rule.min ?
          'Add more detail to the description (at least 50 characters)' :
          'Consider breaking this into smaller tasks or condensing the description',
      };

    case 'acceptanceCriteria':
      if (task.acceptanceCriteria.length >= rule.min) {
        return { passed: true, message: `Has ${task.acceptanceCriteria.length} acceptance criteria` };
      }
      return {
        passed: false,
        suggestion: `Add at least ${rule.min - task.acceptanceCriteria.length} more acceptance criteria`,
      };

    case 'timeEstimate':
      if (task.time_estimate >= rule.min && task.time_estimate <= rule.max) {
        return { passed: true, message: 'Time estimate is reasonable' };
      }
      return {
        passed: false,
        suggestion: task.time_estimate < rule.min ?
          'Increase time estimate (minimum 15 minutes)' :
          'Consider breaking this into smaller tasks or reduce estimate',
      };

    case 'dependencies':
      // Check if dependencies are properly referenced
      const hasDeps = task.dependencies && task.dependencies.length > 0;
      const mentionsDeps = content.toLowerCase().includes('depend') ||
                                   content.toLowerCase().includes('blocked by') ||
                                   content.toLowerCase().includes('requires');

      if (hasDeps || !mentionsDeps) {
        return { passed: true, message: hasDeps ? 'Dependencies are clearly identified' : 'No dependencies needed' };
      }
      return {
        passed: false,
        suggestion: 'Add dependencies section or clarify if no dependencies exist',
      };

    case 'tags':
      if (task.tags && task.tags.length >= rule.min) {
        return { passed: true, message: `Has ${task.tags.length} relevant tags` };
      }
      return {
        passed: false,
        suggestion: 'Add at least one relevant tag for better categorization',
      };

    default:
      return { passed: true, message: 'Validation passed' };
    }
  }

  validateBestPractice(ruleName, rule, task, content) {
    switch (ruleName) {
    case 'smartTitle':
      const titleWords = task.title.split(' ');
      const hasActionVerb = /^(Implement|Create|Build|Design|Fix|Update|Add|Remove|Test|Document|Review|Refactor)/.test(task.title);
      const isSpecific = titleWords.length >= 3 && titleWords.length <= 10;

      if (hasActionVerb && isSpecific) {
        return { passed: true, message: 'Title is clear, specific, and action-oriented' };
      }
      return {
        passed: false,
        suggestion: hasActionVerb ?
          'Make title more specific (add context and details)' :
          'Start title with an action verb (Implement, Create, Fix, etc.)',
      };

    case 'measurableOutcomes':
      const measurableCriteria = task.acceptanceCriteria.filter(ac =>
        /(test|verify|confirm|ensure|check|validate|complete|implement)/i.test(ac),
      ).length;

      if (measurableCriteria >= task.acceptanceCriteria.length * 0.7) {
        return { passed: true, message: 'Most acceptance criteria are measurable' };
      }
      return {
        passed: false,
        suggestion: 'Rewrite acceptance criteria to be more measurable and testable',
      };

    case 'realisticScope':
      // Check if scope matches time estimate
      const complexityIndicators = [
        task.description.length > 500,
        task.acceptanceCriteria.length > 5,
        task.subtasks && task.subtasks.length > 3,
        task.dependencies && task.dependencies.length > 2,
      ].filter(Boolean).length;

      const estimatedHours = task.time_estimate / 60;
      const isRealistic = complexityIndicators <= estimatedHours * 2;

      if (isRealistic) {
        return { passed: true, message: 'Task scope appears realistic for time estimate' };
      }
      return {
        passed: false,
        suggestion: complexityIndicators > estimatedHours * 2 ?
          'Consider increasing time estimate or breaking into smaller tasks' :
          'Time estimate might be too high for the task scope',
      };

    default:
      return { passed: true, message: 'Best practice validation passed' };
    }
  }

  calculateGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
  }

  async validateAllTasks() {
    const tasksPath = path.join(this.vaultPath, '4 - Projects');
    const taskFiles = await this.findTaskFiles(tasksPath);

    const results = [];

    for (const filePath of taskFiles) {
      const validation = await this.validateTask(filePath);
      validation.filePath = filePath;
      results.push(validation);
    }

    return results;
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

  generateQualityReport(results) {
    const totalTasks = results.length;
    const passingTasks = results.filter(r => r.status === 'pass').length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalTasks;

    const report = {
      summary: {
        totalTasks,
        passingTasks,
        failingTasks: totalTasks - passingTasks,
        averageScore: Math.round(averageScore),
        qualityGrade: this.calculateGrade(averageScore),
      },
      commonIssues: this.identifyCommonIssues(results),
      topTasks: results
        .filter(r => r.score >= 80)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
      needsImprovement: results
        .filter(r => r.score < 70)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5),
    };

    return report;
  }

  identifyCommonIssues(results) {
    const issueCount = {};

    results.forEach(result => {
      result.issues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    return Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));
  }
}

async function taskValidatorCommand(filePath, options) {
  try {
    const vaultPath = process.cwd();

    if (!await fs.pathExists(path.join(vaultPath, '4 - Projects'))) {
      console.log(chalk.red('❌ Not in an Obsidian Kit vault. Make sure you\'re in a project directory.'));
      return;
    }

    const validator = new TaskQualityValidator(vaultPath);

    if (filePath) {
      // Validate single task
      console.log(chalk.blue(`🔍 Validating task: ${filePath}\n`));

      const validation = await validator.validateTask(filePath);

      console.log(chalk.bold(`📊 Quality Score: ${validation.score}/100 (${validation.grade})`));
      console.log(chalk.bold(`🎯 Status: ${validation.status === 'pass' ? chalk.green('PASS') : chalk.red('FAIL')}\n`));

      if (validation.strengths.length > 0) {
        console.log(chalk.green('✅ Strengths:'));
        validation.strengths.forEach(strength => {
          console.log(`   • ${strength}`);
        });
        console.log('');
      }

      if (validation.issues.length > 0) {
        console.log(chalk.red('❌ Issues:'));
        validation.issues.forEach(issue => {
          console.log(`   • ${issue}`);
        });
        console.log('');
      }

      if (validation.suggestions.length > 0) {
        console.log(chalk.yellow('💡 Suggestions:'));
        validation.suggestions.forEach(suggestion => {
          console.log(`   • ${suggestion}`);
        });
      }

    } else {
      // Validate all tasks
      console.log(chalk.blue('🔍 Validating all tasks in vault...\n'));

      const results = await validator.validateAllTasks();
      const report = validator.generateQualityReport(results);

      console.log(chalk.bold('📊 Quality Report Summary:'));
      console.log(`   Total Tasks: ${report.summary.totalTasks}`);
      console.log(`   Passing: ${chalk.green(report.summary.passingTasks)}`);
      console.log(`   Failing: ${chalk.red(report.summary.failingTasks)}`);
      console.log(`   Average Score: ${report.summary.averageScore}/100 (${report.summary.qualityGrade})\n`);

      if (report.commonIssues.length > 0) {
        console.log(chalk.yellow('🔥 Most Common Issues:'));
        report.commonIssues.forEach(({ issue, count }) => {
          console.log(`   • ${issue} (${count} tasks)`);
        });
        console.log('');
      }

      if (report.topTasks.length > 0) {
        console.log(chalk.green('🏆 Top Quality Tasks:'));
        report.topTasks.forEach(task => {
          const fileName = path.basename(task.filePath);
          console.log(`   • ${fileName} (${task.score}/100)`);
        });
        console.log('');
      }

      if (report.needsImprovement.length > 0) {
        console.log(chalk.red('⚠️  Tasks Needing Improvement:'));
        report.needsImprovement.forEach(task => {
          const fileName = path.basename(task.filePath);
          console.log(`   • ${fileName} (${task.score}/100)`);
        });
      }
    }

  } catch (error) {
    console.error(chalk.red('❌ Error during validation:'), error.message);
  }
}

module.exports = taskValidatorCommand;
