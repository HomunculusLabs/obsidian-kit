#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class AITaskManagementSystem {
  constructor(vaultPath) {
    this.vaultPath = vaultPath;
    this.projectsDir = path.join(vaultPath, '4 - Projects');
    this.tasks = [];
    this.analytics = {};
    this.recommendations = [];
    this.predictions = {};
  }

  // Main analysis and intelligence generation
  async analyzeAndGenerateInsights() {
    console.log(chalk.blue.bold('🧠 AI Task Management Intelligence System\n'));

    console.log(chalk.cyan('📊 Analyzing task data...'));
    await this.loadAllTasks();

    console.log(chalk.cyan('🔍 Generating analytics...'));
    await this.generateAnalytics();

    console.log(chalk.cyan('🤖 Creating AI recommendations...'));
    await this.generateRecommendations();

    console.log(chalk.cyan('🔮 Predicting outcomes...'));
    await this.generatePredictions();

    console.log(chalk.cyan('📋 Creating intelligent reports...'));
    await this.createIntelligentReports();

    console.log(chalk.green('✅ AI analysis complete!'));
    return {
      tasks: this.tasks.length,
      analytics: this.analytics,
      recommendations: this.recommendations,
      predictions: this.predictions,
    };
  }

  // Load all tasks from the vault
  async loadAllTasks() {
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

            if (content.includes('tags:') && content.includes('task') ||
                content.includes('title:') && content.includes('status:')) {

              const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
              if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const body = content.replace(/^---\n.*?\n---\n/s, '');

                const task = {
                  title: this.extractField(frontmatter, 'title') || path.basename(item.name, '.md'),
                  status: this.extractField(frontmatter, 'status') || 'todo',
                  priority: this.extractField(frontmatter, 'priority') || 'medium',
                  project: this.extractField(frontmatter, 'project') || '',
                  assignee: this.extractField(frontmatter, 'assignee') || 'unassigned',
                  due_date: this.extractField(frontmatter, 'due_date') || '',
                  created_date: this.extractField(frontmatter, 'created_date') || '',
                  completed_date: this.extractField(frontmatter, 'completed_date') || '',
                  time_estimate: parseInt(this.extractField(frontmatter, 'time_estimate')) || 0,
                  time_spent: parseInt(this.extractField(frontmatter, 'time_spent')) || 0,
                  dependencies: this.extractArrayField(frontmatter, 'dependencies') || [],
                  subtasks: this.extractArrayField(frontmatter, 'subtasks') || [],
                  tags: this.extractArrayField(frontmatter, 'tags') || [],
                  path: fullPath,
                  body: body.substring(0, 500), // First 500 chars for analysis
                  wordCount: body.split(/\s+/).length,
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

    if (await fs.pathExists(this.projectsDir)) {
      await findTaskFiles.call(this, this.projectsDir);
    }

    this.tasks = tasks;
    console.log(chalk.green(`   ✓ Loaded ${tasks.length} tasks`));
  }

  // Generate comprehensive analytics
  async generateAnalytics() {
    const analytics = {
      overview: {},
      productivity: {},
      predictions: {},
      patterns: {},
      recommendations: {},
    };

    // Overview analytics
    analytics.overview = {
      totalTasks: this.tasks.length,
      completedTasks: this.tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: this.tasks.filter(t => t.status === 'in-progress').length,
      todoTasks: this.tasks.filter(t => t.status === 'todo').length,
      blockedTasks: this.tasks.filter(t => t.status === 'blocked').length,
      completionRate: 0,
      averageTaskDuration: 0,
      totalEstimatedTime: this.tasks.reduce((sum, t) => sum + t.time_estimate, 0),
      totalActualTime: this.tasks.reduce((sum, t) => sum + t.time_spent, 0),
    };

    analytics.overview.completionRate =
      analytics.overview.totalTasks > 0 ?
        (analytics.overview.completedTasks / analytics.overview.totalTasks * 100).toFixed(1) : 0;

    // Productivity analytics
    const completedTasks = this.tasks.filter(t => t.status === 'completed' && t.created_date && t.completed_date);
    if (completedTasks.length > 0) {
      const durations = completedTasks.map(task => {
        const created = new Date(task.created_date);
        const completed = new Date(task.completed_date);
        return (completed - created) / (1000 * 60 * 60 * 24); // days
      });

      analytics.productivity = {
        averageTaskDuration: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1),
        fastestTask: Math.min(...durations).toFixed(1),
        slowestTask: Math.max(...durations).toFixed(1),
        tasksCompletedThisWeek: this.getTasksCompletedInPeriod(completedTasks, 7),
        tasksCompletedThisMonth: this.getTasksCompletedInPeriod(completedTasks, 30),
        productivityTrend: this.calculateProductivityTrend(completedTasks),
      };
    }

    // Priority analytics
    const priorityBreakdown = {
      high: this.tasks.filter(t => t.priority === 'high').length,
      medium: this.tasks.filter(t => t.priority === 'medium').length,
      low: this.tasks.filter(t => t.priority === 'low').length,
    };

    const priorityCompletion = {
      high: this.tasks.filter(t => t.priority === 'high' && t.status === 'completed').length,
      medium: this.tasks.filter(t => t.priority === 'medium' && t.status === 'completed').length,
      low: this.tasks.filter(t => t.priority === 'low' && t.status === 'completed').length,
    };

    analytics.priority = {
      breakdown: priorityBreakdown,
      completionRates: {
        high: priorityBreakdown.high > 0 ? (priorityCompletion.high / priorityBreakdown.high * 100).toFixed(1) : 0,
        medium: priorityBreakdown.medium > 0 ? (priorityCompletion.medium / priorityBreakdown.medium * 100).toFixed(1) : 0,
        low: priorityBreakdown.low > 0 ? (priorityCompletion.low / priorityBreakdown.low * 100).toFixed(1) : 0,
      },
    };

    // Project analytics
    const projectGroups = this.groupTasksByProject();
    analytics.projects = Object.entries(projectGroups).map(([project, tasks]) => ({
      name: project,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      completionRate: (tasks.filter(t => t.status === 'completed').length / tasks.length * 100).toFixed(1),
      averageTaskDuration: this.calculateAverageDuration(tasks),
      healthScore: this.calculateProjectHealth(tasks),
    }));

    // Time estimation accuracy
    const tasksWithEstimates = this.tasks.filter(t => t.time_estimate > 0 && t.time_spent > 0);
    if (tasksWithEstimates.length > 0) {
      const accuracy = tasksWithEstimates.map(task => {
        const accuracy = Math.min(task.time_spent / task.time_estimate, task.time_estimate / task.time_spent);
        return accuracy * 100;
      });

      analytics.estimationAccuracy = {
        average: (accuracy.reduce((a, b) => a + b, 0) / accuracy.length).toFixed(1),
        tasksAnalyzed: tasksWithEstimates.length,
        overestimationRate: tasksWithEstimates.filter(t => t.time_estimate > t.time_spent).length / tasksWithEstimates.length * 100,
        underestimationRate: tasksWithEstimates.filter(t => t.time_estimate < t.time_spent).length / tasksWithEstimates.length * 100,
      };
    }

    // Pattern analysis
    analytics.patterns = {
      mostProductiveDay: this.analyzeProductivityByDay(),
      taskComplexityDistribution: this.analyzeTaskComplexity(),
      commonBottlenecks: this.identifyBottlenecks(),
      dependencyChains: this.analyzeDependencyChains(),
    };

    this.analytics = analytics;
    console.log(chalk.green(`   ✓ Generated ${Object.keys(analytics).length} analytics categories`));
  }

  // Generate AI-powered recommendations
  async generateRecommendations() {
    const recommendations = [];

    // Task prioritization recommendations
    const highPriorityTodo = this.tasks.filter(t => t.status === 'todo' && t.priority === 'high');
    if (highPriorityTodo.length > 5) {
      recommendations.push({
        type: 'prioritization',
        priority: 'high',
        title: 'Too Many High-Priority Tasks',
        description: `You have ${highPriorityTodo.length} high-priority tasks. Consider re-evaluating priorities to focus on the most critical ones.`,
        action: 'Review and re-prioritize high-priority tasks',
        impact: 'high',
      });
    }

    // Overdue tasks
    const overdueTasks = this.tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    });

    if (overdueTasks.length > 0) {
      recommendations.push({
        type: 'deadline',
        priority: 'urgent',
        title: 'Overdue Tasks Detected',
        description: `You have ${overdueTasks.length} overdue tasks that need immediate attention.`,
        action: 'Focus on completing overdue tasks first',
        impact: 'critical',
        tasks: overdueTasks.map(t => t.title),
      });
    }

    // Estimation accuracy
    if (this.analytics.estimationAccuracy && this.analytics.estimationAccuracy.average < 70) {
      recommendations.push({
        type: 'estimation',
        priority: 'medium',
        title: 'Improve Time Estimation',
        description: `Your estimation accuracy is ${this.analytics.estimationAccuracy.average}%. Consider breaking down large tasks and tracking time more carefully.`,
        action: 'Use time tracking and break down complex tasks',
        impact: 'medium',
      });
    }

    // Project health
    const unhealthyProjects = this.analytics.projects.filter(p => p.healthScore < 70);
    if (unhealthyProjects.length > 0) {
      recommendations.push({
        type: 'project_health',
        priority: 'medium',
        title: 'Project Health Concerns',
        description: `${unhealthyProjects.length} project(s) have health scores below 70%. Review these projects for potential issues.`,
        action: 'Conduct project health reviews',
        impact: 'medium',
        projects: unhealthyProjects.map(p => p.name),
      });
    }

    // Productivity patterns
    if (this.analytics.patterns.mostProductiveDay) {
      recommendations.push({
        type: 'productivity',
        priority: 'low',
        title: 'Optimize Your Schedule',
        description: `Your most productive day is ${this.analytics.patterns.mostProductiveDay}. Schedule important tasks on this day.`,
        action: 'Align task scheduling with productivity patterns',
        impact: 'medium',
      });
    }

    // Task breakdown recommendations
    const complexTasks = this.tasks.filter(t => t.wordCount > 500 || t.time_estimate > 240);
    if (complexTasks.length > 0) {
      recommendations.push({
        type: 'task_breakdown',
        priority: 'medium',
        title: 'Break Down Complex Tasks',
        description: `You have ${complexTasks.length} complex tasks that should be broken down into smaller, manageable subtasks.`,
        action: 'Create subtasks for complex items',
        impact: 'high',
        tasks: complexTasks.map(t => t.title),
      });
    }

    // Dependency management
    const tasksWithManyDependencies = this.tasks.filter(t => t.dependencies.length > 3);
    if (tasksWithManyDependencies.length > 0) {
      recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        title: 'Simplify Dependencies',
        description: `${tasksWithManyDependencies.length} tasks have more than 3 dependencies, which may create bottlenecks.`,
        action: 'Review and simplify task dependencies',
        impact: 'medium',
      });
    }

    // Workload balance
    const assigneeWorkload = this.calculateAssigneeWorkload();
    const overloadedAssignees = Object.entries(assigneeWorkload).filter(([assignee, count]) =>
      assignee !== 'unassigned' && count > 10,
    );

    if (overloadedAssignees.length > 0) {
      recommendations.push({
        type: 'workload',
        priority: 'medium',
        title: 'Balance Workload',
        description: 'Some team members have too many assigned tasks. Consider redistributing workload.',
        action: 'Rebalance task assignments',
        impact: 'medium',
        assignees: overloadedAssignees.map(([assignee, count]) => `${assignee}: ${count} tasks`),
      });
    }

    this.recommendations = recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    console.log(chalk.green(`   ✓ Generated ${recommendations.length} AI recommendations`));
  }

  // Generate predictions
  async generatePredictions() {
    const predictions = {};

    // Predict completion dates
    const inProgressTasks = this.tasks.filter(t => t.status === 'in-progress');
    predictions.completionDates = inProgressTasks.map(task => {
      const predictedDate = this.predictTaskCompletion(task);
      return {
        task: task.title,
        currentProgress: this.estimateTaskProgress(task),
        predictedCompletion: predictedDate,
        confidence: this.calculatePredictionConfidence(task),
      };
    });

    // Predict project completion
    predictions.projectCompletion = this.analytics.projects.map(project => {
      const predictedDate = this.predictProjectCompletion(project);
      return {
        project: project.name,
        predictedCompletion: predictedDate,
        confidence: this.calculateProjectPredictionConfidence(project),
      };
    });

    // Predict resource needs
    predictions.resourceNeeds = this.predictResourceNeeds();

    // Predict risks
    predictions.risks = this.identifyPotentialRisks();

    // Predict bottlenecks
    predictions.bottlenecks = this.predictBottlenecks();

    this.predictions = predictions;
    console.log(chalk.green(`   ✓ Generated ${Object.keys(predictions).length} prediction categories`));
  }

  // Create intelligent reports
  async createIntelligentReports() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: this.createExecutiveSummary(),
      analytics: this.analytics,
      recommendations: this.recommendations,
      predictions: this.predictions,
      insights: this.generateKeyInsights(),
      actionItems: this.generateActionItems(),
    };

    // Save comprehensive report
    const reportPath = path.join(this.vaultPath, 'ai-task-management-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Create human-readable summary
    const summaryPath = path.join(this.vaultPath, 'task-management-summary.md');
    await this.createMarkdownSummary(summaryPath, report);

    console.log(chalk.green(`   ✓ Reports saved to ${reportPath} and ${summaryPath}`));
  }

  // Helper methods
  extractField(frontmatter, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*:\\s*["']?([^"'\n]+)["']?`);
    const match = frontmatter.match(regex);
    return match ? match[1].trim() : '';
  }

  extractArrayField(frontmatter, fieldName) {
    const regex = new RegExp(`${fieldName}\\s*:\\s*\\[(.*?)\\]`, 's');
    const match = frontmatter.match(regex);
    if (match) {
      return match[1].split(',').map(item => item.trim().replace(/"/g, ''));
    }
    return [];
  }

  groupTasksByProject() {
    const projects = {};
    this.tasks.forEach(task => {
      const project = task.project.replace(/\[\[|\]\]/g, '') || 'Unassigned';
      if (!projects[project]) {
        projects[project] = [];
      }
      projects[project].push(task);
    });
    return projects;
  }

  getTasksCompletedInPeriod(tasks, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return tasks.filter(task =>
      new Date(task.completed_date) >= cutoffDate,
    ).length;
  }

  calculateProductivityTrend(completedTasks) {
    if (completedTasks.length < 2) return 'insufficient_data';

    const recentTasks = completedTasks.slice(-10);
    const olderTasks = completedTasks.slice(-20, -10);

    if (olderTasks.length === 0) return 'insufficient_data';

    const recentAvg = recentTasks.reduce((sum, task) => {
      const duration = (new Date(task.completed_date) - new Date(task.created_date)) / (1000 * 60 * 60 * 24);
      return sum + duration;
    }, 0) / recentTasks.length;

    const olderAvg = olderTasks.reduce((sum, task) => {
      const duration = (new Date(task.completed_date) - new Date(task.created_date)) / (1000 * 60 * 60 * 24);
      return sum + duration;
    }, 0) / olderTasks.length;

    if (recentAvg < olderAvg * 0.9) return 'improving';
    if (recentAvg > olderAvg * 1.1) return 'declining';
    return 'stable';
  }

  calculateAverageDuration(tasks) {
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.created_date && t.completed_date);
    if (completedTasks.length === 0) return 0;

    const durations = completedTasks.map(task => {
      const created = new Date(task.created_date);
      const completed = new Date(task.completed_date);
      return (completed - created) / (1000 * 60 * 60 * 24);
    });

    return (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
  }

  calculateProjectHealth(tasks) {
    const completionRate = tasks.filter(t => t.status === 'completed').length / tasks.length;
    const overdueRate = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    }).length / tasks.length;

    const healthScore = (completionRate * 60) + ((1 - overdueRate) * 40);
    return Math.round(healthScore);
  }

  analyzeProductivityByDay() {
    const completedTasks = this.tasks.filter(t => t.status === 'completed' && t.completed_date);
    const dayCounts = {};

    completedTasks.forEach(task => {
      const day = new Date(task.completed_date).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const mostProductiveDay = Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0];
    return mostProductiveDay ? mostProductiveDay[0] : null;
  }

  analyzeTaskComplexity() {
    const complexity = {
      simple: this.tasks.filter(t => t.wordCount < 200).length,
      medium: this.tasks.filter(t => t.wordCount >= 200 && t.wordCount < 500).length,
      complex: this.tasks.filter(t => t.wordCount >= 500).length,
    };

    return complexity;
  }

  identifyBottlenecks() {
    // Simple bottleneck identification based on tasks with many dependencies
    const bottlenecks = this.tasks
      .filter(t => t.dependencies.length > 2)
      .map(t => ({
        task: t.title,
        dependencyCount: t.dependencies.length,
        impact: 'medium',
      }));

    return bottlenecks;
  }

  analyzeDependencyChains() {
    const chains = [];
    const visited = new Set();

    const findChain = (task, currentChain = []) => {
      if (visited.has(task.id)) return;
      visited.add(task.id);

      currentChain.push(task.title);

      if (task.dependencies.length === 0) {
        chains.push([...currentChain]);
      } else {
        task.dependencies.forEach(dep => {
          const depTask = this.tasks.find(t => t.title === dep);
          if (depTask) {
            findChain(depTask, [...currentChain]);
          }
        });
      }
    };

    this.tasks.forEach(task => {
      if (!visited.has(task.id)) {
        findChain(task);
      }
    });

    return chains.filter(chain => chain.length > 2);
  }

  calculateAssigneeWorkload() {
    const workload = {};
    this.tasks.forEach(task => {
      const assignee = task.assignee || 'unassigned';
      workload[assignee] = (workload[assignee] || 0) + 1;
    });
    return workload;
  }

  predictTaskCompletion(task) {
    // Simple prediction based on similar tasks
    const similarTasks = this.tasks.filter(t =>
      t.status === 'completed' &&
      t.priority === task.priority &&
      Math.abs(t.time_estimate - task.time_estimate) < 60,
    );

    if (similarTasks.length === 0) {
      // Default prediction based on estimate
      const daysFromNow = task.time_estimate / (8 * 60); // Assuming 8 hour work days
      const predictedDate = new Date();
      predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysFromNow));
      return predictedDate.toISOString().split('T')[0];
    }

    // Average duration of similar tasks
    const avgDuration = similarTasks.reduce((sum, t) => {
      const duration = (new Date(t.completed_date) - new Date(t.created_date)) / (1000 * 60 * 60 * 24);
      return sum + duration;
    }, 0) / similarTasks.length;

    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + Math.ceil(avgDuration));
    return predictedDate.toISOString().split('T')[0];
  }

  estimateTaskProgress(task) {
    if (task.status === 'completed') return 100;
    if (task.status === 'todo') return 0;
    if (task.status === 'in-progress') {
      // Simple progress estimation based on time spent vs estimate
      if (task.time_estimate > 0) {
        return Math.min((task.time_spent / task.time_estimate) * 100, 95);
      }
      return 50; // Default for in-progress without time data
    }
    return 0;
  }

  calculatePredictionConfidence(task) {
    let confidence = 50; // Base confidence

    if (task.time_estimate > 0) confidence += 20;
    if (task.time_spent > 0) confidence += 20;
    if (task.priority === 'high') confidence += 10;

    return Math.min(confidence, 90);
  }

  predictProjectCompletion(project) {
    const incompleteTasks = this.tasks.filter(t =>
      t.project.includes(project.name) && t.status !== 'completed',
    );

    if (incompleteTasks.length === 0) {
      return new Date().toISOString().split('T')[0];
    }

    const totalEstimate = incompleteTasks.reduce((sum, t) => sum + t.time_estimate, 0);
    const daysFromNow = totalEstimate / (8 * 60); // Assuming 8 hour work days

    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + Math.ceil(daysFromNow));
    return predictedDate.toISOString().split('T')[0];
  }

  calculateProjectPredictionConfidence(project) {
    const tasks = this.tasks.filter(t => t.project.includes(project.name));
    const tasksWithEstimates = tasks.filter(t => t.time_estimate > 0);

    let confidence = 30;
    if (tasksWithEstimates.length > 0) {
      confidence += (tasksWithEstimates.length / tasks.length) * 40;
    }
    if (project.completionRate > 50) {
      confidence += 20;
    }

    return Math.min(confidence, 85);
  }

  predictResourceNeeds() {
    const upcomingTasks = this.tasks.filter(t =>
      t.status === 'todo' &&
      (!t.due_date || new Date(t.due_date) > new Date()),
    );

    const totalEstimatedHours = upcomingTasks.reduce((sum, t) => sum + t.time_estimate, 0);
    const weeksNeeded = totalEstimatedHours / (8 * 5); // 8 hours/day, 5 days/week

    return {
      totalHours: totalEstimatedHours,
      estimatedWeeks: Math.ceil(weeksNeeded),
      recommendedTeamSize: Math.ceil(totalEstimatedHours / (8 * 5 * 4)), // 4 weeks
      criticalPath: this.identifyCriticalPath(),
    };
  }

  identifyPotentialRisks() {
    const risks = [];

    // Overdue tasks risk
    const overdueTasks = this.tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    });

    if (overdueTasks.length > 0) {
      risks.push({
        type: 'schedule',
        severity: 'high',
        description: `${overdueTasks.length} tasks are overdue`,
        mitigation: 'Review task priorities and reallocate resources',
      });
    }

    // Single point of failure risk
    const assigneeCounts = this.calculateAssigneeWorkload();
    const dominantAssignee = Object.entries(assigneeCounts).find(([assignee, count]) =>
      assignee !== 'unassigned' && count > this.tasks.length * 0.5,
    );

    if (dominantAssignee) {
      risks.push({
        type: 'resource',
        severity: 'medium',
        description: `${dominantAssignee[0]} is assigned to ${dominantAssignee[1]} tasks (${((dominantAssignee[1] / this.tasks.length) * 100).toFixed(1)}%)`,
        mitigation: 'Distribute tasks more evenly across team members',
      });
    }

    return risks;
  }

  predictBottlenecks() {
    const dependencyMap = {};

    this.tasks.forEach(task => {
      task.dependencies.forEach(dep => {
        if (!dependencyMap[dep]) {
          dependencyMap[dep] = [];
        }
        dependencyMap[dep].push(task.title);
      });
    });

    const bottlenecks = Object.entries(dependencyMap)
      .filter(([, dependents]) => dependents.length > 2)
      .map(([task, dependents]) => ({
        task,
        blockingCount: dependents.length,
        blockedTasks: dependents,
      }));

    return bottlenecks;
  }

  identifyCriticalPath() {
    // Simplified critical path identification
    const highPriorityTasks = this.tasks.filter(t =>
      t.priority === 'high' && t.status !== 'completed',
    );

    return highPriorityTasks
      .sort((a, b) => {
        const dateA = a.due_date ? new Date(a.due_date) : new Date('9999-12-31');
        const dateB = b.due_date ? new Date(b.due_date) : new Date('9999-12-31');
        return dateA - dateB;
      })
      .slice(0, 5)
      .map(t => t.title);
  }

  createExecutiveSummary() {
    return {
      totalTasks: this.tasks.length,
      completionRate: this.analytics.overview.completionRate,
      healthScore: this.calculateOverallHealthScore(),
      priorityIssues: this.recommendations.filter(r => r.priority === 'urgent' || r.priority === 'high').length,
      keyInsights: this.generateKeyInsights().slice(0, 3),
    };
  }

  calculateOverallHealthScore() {
    const completionScore = parseFloat(this.analytics.overview.completionRate);
    const estimationScore = this.analytics.estimationAccuracy ?
      parseFloat(this.analytics.estimationAccuracy.average) : 70;
    const projectHealthScore = this.analytics.projects.length > 0 ?
      this.analytics.projects.reduce((sum, p) => sum + p.healthScore, 0) / this.analytics.projects.length : 70;

    return Math.round((completionScore + estimationScore + projectHealthScore) / 3);
  }

  generateKeyInsights() {
    const insights = [];

    if (this.analytics.overview.completionRate > 80) {
      insights.push('Excellent completion rate - team is performing well');
    } else if (this.analytics.overview.completionRate < 50) {
      insights.push('Low completion rate - may need process improvement');
    }

    if (this.analytics.estimationAccuracy && this.analytics.estimationAccuracy.average > 80) {
      insights.push('Very accurate time estimation - planning is effective');
    } else if (this.analytics.estimationAccuracy && this.analytics.estimationAccuracy.average < 60) {
      insights.push('Poor estimation accuracy - consider breaking down tasks further');
    }

    const highPriorityCompletion = this.analytics.priority.completionRates.high;
    if (highPriorityCompletion > 90) {
      insights.push('High-priority tasks are being completed effectively');
    } else if (highPriorityCompletion < 60) {
      insights.push('High-priority tasks need attention - consider resource allocation');
    }

    return insights;
  }

  generateActionItems() {
    return this.recommendations
      .filter(r => r.priority === 'urgent' || r.priority === 'high')
      .slice(0, 5)
      .map(r => ({
        action: r.action,
        priority: r.priority,
        impact: r.impact,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
      }));
  }

  async createMarkdownSummary(summaryPath, report) {
    const markdown = `# AI Task Management Intelligence Report

*Generated on ${new Date(report.generatedAt).toLocaleDateString()}*

## 📊 Executive Summary

- **Total Tasks**: ${report.summary.totalTasks}
- **Completion Rate**: ${report.summary.completionRate}%
- **Overall Health Score**: ${report.summary.healthScore}/100
- **Priority Issues**: ${report.summary.priorityIssues}

### Key Insights
${report.summary.keyInsights.map(insight => `- ${insight}`).join('\n')}

## 🎯 Top Recommendations

${report.recommendations.slice(0, 5).map(rec => `
### ${rec.title} (${rec.priority})
**Description**: ${rec.description}
**Action**: ${rec.action}
**Impact**: ${rec.impact}
`).join('\n')}

## 📈 Analytics Overview

### Task Status Distribution
- **To Do**: ${report.analytics.overview.todoTasks}
- **In Progress**: ${report.analytics.overview.inProgressTasks}
- **Completed**: ${report.analytics.overview.completedTasks}
- **Blocked**: ${report.analytics.overview.blockedTasks}

### Priority Breakdown
- **High**: ${report.analytics.priority.breakdown.high} (${report.analytics.priority.completionRates.high}% completion)
- **Medium**: ${report.analytics.priority.breakdown.medium} (${report.analytics.priority.completionRates.medium}% completion)
- **Low**: ${report.analytics.priority.breakdown.low} (${report.analytics.priority.completionRates.low}% completion)

### Project Health
${report.analytics.projects.map(project => `
**${project.name}**: ${project.completionRate}% completion, Health Score: ${project.healthScore}/100
`).join('')}

## 🔮 Predictions

### Upcoming Completions
${report.predictions.completionDates.slice(0, 5).map(pred => `
- **${pred.task}**: Predicted completion ${pred.predictedCompletion} (${pred.confidence}% confidence)
`).join('')}

### Potential Risks
${report.predictions.risks.map(risk => `
- **${risk.type}** (${risk.severity}): ${risk.description}
  - *Mitigation*: ${risk.mitigation}
`).join('')}

## 📋 Immediate Action Items

${report.actionItems.map(item => `
- [ ] **${item.action}** (Priority: ${item.priority}, Due: ${item.dueDate})
`).join('')}

---

*This report was generated by the AI Task Management Intelligence System.*
`;

    await fs.writeFile(summaryPath, markdown);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const vaultPath = args.find(arg => !arg.startsWith('--')) || './Obsidian-Kit-Dev';

  if (args.includes('--help') || args.includes('-h')) {
    console.log('🧠 AI Task Management Intelligence System');
    console.log('\nUsage:');
    console.log('  node ai-task-management-system.js [vault-path] [options]');
    console.log('\nOptions:');
    console.log('  --help, -h    Show this help message');
    console.log('\nExample:');
    console.log('  node ai-task-management-system.js ./Obsidian-Kit-Dev');
    console.log('\nFeatures:');
    console.log('  • Comprehensive task analytics');
    console.log('  • AI-powered recommendations');
    console.log('  • Predictive insights');
    console.log('  • Risk identification');
    console.log('  • Resource optimization');
    return;
  }

  try {
    const system = new AITaskManagementSystem(vaultPath);
    const results = await system.analyzeAndGenerateInsights();

    console.log(chalk.green('\n🎉 Analysis Complete!'));
    console.log(chalk.blue(`📊 Analyzed ${results.tasks} tasks`));
    console.log(chalk.blue(`🤖 Generated ${results.recommendations.length} recommendations`));
    console.log(chalk.blue(`🔮 Created ${Object.keys(results.predictions).length} prediction models`));

  } catch (error) {
    console.error(chalk.red('❌ Analysis failed:'), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = AITaskManagementSystem;
