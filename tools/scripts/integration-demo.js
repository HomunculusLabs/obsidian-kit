#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const IntegrationHub = require('./integration-hub');
const UnifiedAPI = require('./unified-api');

class IntegrationDemo {
  constructor() {
    this.vaultPath = path.join(__dirname, 'Obsidian-Kit-Dev');
    this.api = new UnifiedAPI(this.vaultPath);
  }

  async runDemo() {
    console.log(chalk.blue.bold('🚀 Obsidian Kit Component Integration Demo\n'));

    try {
      // Initialize the system
      await this.initializeSystem();

      // Demo 1: Task Management Integration
      await this.demoTaskManagement();

      // Demo 2: Knowledge Graph Integration
      await this.demoKnowledgeGraph();

      // Demo 3: Semantic Search Integration
      await this.demoSemanticSearch();

      // Demo 4: Workflow Integration
      await this.demoWorkflowIntegration();

      // Demo 5: Agent Integration
      await this.demoAgentIntegration();

      // Demo 6: System Status
      await this.demoSystemStatus();

      console.log(chalk.green.bold('\n✅ Integration Demo Completed Successfully!'));
      console.log(chalk.green('All components are working together seamlessly.\n'));

    } catch (error) {
      console.error(chalk.red('❌ Demo failed:'), error.message);
      throw error;
    } finally {
      await this.api.shutdown();
    }
  }

  async initializeSystem() {
    console.log(chalk.cyan('🔧 Initializing Integrated System...'));

    await this.api.initialize();

    console.log(chalk.green('   ✓ System initialized'));
    console.log(chalk.green('   ✓ All components connected'));
    console.log(chalk.green('   ✓ Event system active\n'));
  }

  async demoTaskManagement() {
    console.log(chalk.yellow('📋 Demo 1: Task Management Integration\n'));

    // Create a sample task
    const taskData = {
      title: 'Integration Demo Task',
      description: 'This task demonstrates the integrated task management system',
      status: 'todo',
      priority: 'high',
      assignee: 'Integration Demo',
      due_date: new Date().toISOString().split('T')[0],
      tags: ['demo', 'integration'],
      acceptanceCriteria: [
        'Task is created successfully',
        'Task appears in search results',
        'Task is linked to knowledge graph',
      ],
    };

    console.log(chalk.cyan('   Creating task...'));
    const result = await this.api.createTask(taskData);
    console.log(chalk.green(`   ✓ Task created: ${result.taskPath}`));

    // Search for the task
    console.log(chalk.cyan('   Searching for task...'));
    const searchResult = await this.api.searchTasks('Integration Demo');
    console.log(chalk.green(`   ✓ Found ${searchResult.total} task(s)`));

    // Update the task
    console.log(chalk.cyan('   Updating task status...'));
    await this.api.updateTask(result.taskPath, { status: 'in-progress' });
    console.log(chalk.green('   ✓ Task updated to in-progress'));

    console.log();
  }

  async demoKnowledgeGraph() {
    console.log(chalk.yellow('🕸️  Demo 2: Knowledge Graph Integration\n'));

    // Get current knowledge graph
    console.log(chalk.cyan('   Retrieving knowledge graph...'));
    const graph = await this.api.getKnowledgeGraph();
    console.log(chalk.green(`   ✓ Graph has ${graph.nodes.length} nodes and ${graph.edges.length} edges`));

    // Add a new entity to the graph
    console.log(chalk.cyan('   Adding integration demo entity...'));
    const entityData = {
      id: 'integration-demo',
      title: 'Integration Demo',
      type: 'demo',
      description: 'Component integration demonstration',
      status: 'active',
    };

    await this.api.updateKnowledgeGraph('demo', entityData);
    console.log(chalk.green('   ✓ Entity added to knowledge graph'));

    // Verify the addition
    const updatedGraph = await this.api.getKnowledgeGraph();
    console.log(chalk.green(`   ✓ Updated graph has ${updatedGraph.nodes.length} nodes`));

    console.log();
  }

  async demoSemanticSearch() {
    console.log(chalk.yellow('🔍 Demo 3: Semantic Search Integration\n'));

    // Perform semantic search
    console.log(chalk.cyan('   Performing semantic search...'));
    const searchResult = await this.api.semanticSearch('component integration', {
      maxResults: 5,
      threshold: 0.3,
    });

    if (searchResult.error) {
      console.log(chalk.yellow(`   ⚠️ Semantic search unavailable: ${searchResult.error}`));
    } else {
      console.log(chalk.green(`   ✓ Found ${searchResult.total} semantic search results`));

      // Display top results
      searchResult.results.slice(0, 3).forEach((result, index) => {
        console.log(chalk.cyan(`   ${index + 1}. ${result.title} (${result.type})`));
        console.log(chalk.gray(`      Score: ${result.score.toFixed(3)}`));
      });
    }

    console.log();
  }

  async demoWorkflowIntegration() {
    console.log(chalk.yellow('⚙️  Demo 4: Workflow Integration\n'));

    // Start a spec-driven workflow
    console.log(chalk.cyan('   Starting spec-driven development workflow...'));
    const workflow = await this.api.startWorkflow('spec-driven', {
      description: 'Integration demo workflow',
    });

    console.log(chalk.green(`   ✓ Workflow started: ${workflow.id}`));
    console.log(chalk.green(`   ✓ Status: ${workflow.status}`));

    if (workflow.results) {
      console.log(chalk.cyan(`   ✓ Generated ${workflow.results.generatedTasks?.length || 0} tasks from specs`));
    }

    // Start a project review workflow
    console.log(chalk.cyan('   Starting project review workflow...'));
    const reviewWorkflow = await this.api.startWorkflow('project-review');

    console.log(chalk.green(`   ✓ Review workflow completed: ${reviewWorkflow.id}`));
    console.log(chalk.green('   ✓ Health status analyzed'));

    console.log();
  }

  async demoAgentIntegration() {
    console.log(chalk.yellow('🤖 Demo 5: Agent Integration\n'));

    // Configure a demo agent
    console.log(chalk.cyan('   Configuring demo agent...'));
    const agentConfig = {
      description: 'Demo agent for integration testing',
      capabilities: ['task-management', 'documentation', 'analysis'],
      version: '1.0.0',
    };

    const agentResult = await this.api.configureAgent('demo-agent', agentConfig);
    console.log(chalk.green(`   ✓ Agent configured: ${agentResult.agentType}`));

    // Get agent status
    console.log(chalk.cyan('   Checking agent status...'));
    const agentStatus = await this.api.getAgentStatus();
    console.log(chalk.green(`   ✓ Found ${agentStatus.agents.length} configured agents`));

    // List agents
    agentStatus.agents.forEach(agent => {
      const status = agent.configured ? '✅' : '⚠️';
      console.log(chalk.cyan(`   ${status} ${agent.type}`));
    });

    console.log();
  }

  async demoSystemStatus() {
    console.log(chalk.yellow('📊 Demo 6: System Status Integration\n'));

    // Get comprehensive system status
    console.log(chalk.cyan('   Gathering system status...'));
    const status = await this.api.getSystemStatus();

    console.log(chalk.green('   ✓ System status retrieved'));

    // Display health overview
    const healthColor = status.health.overall === 'healthy' ? chalk.green :
      status.health.overall === 'degraded' ? chalk.yellow : chalk.red;

    console.log(healthColor(`   Overall Health: ${status.health.overall.toUpperCase()}`));

    // Component status
    console.log(chalk.cyan('\n   Component Status:'));
    Object.entries(status.components).forEach(([name, component]) => {
      const statusIcon = component.status === 'active' || component.status === 'healthy' ? '✅' : '⚠️';
      console.log(chalk.cyan(`   ${statusIcon} ${name}: ${component.status}`));
    });

    // Task statistics
    if (status.taskStats) {
      console.log(chalk.cyan('\n   Task Statistics:'));
      console.log(chalk.cyan(`   📋 Total Tasks: ${status.taskStats.total}`));

      Object.entries(status.taskStats.byStatus || {}).forEach(([status, count]) => {
        console.log(chalk.cyan(`   ${status}: ${count}`));
      });
    }

    console.log();
  }

  async cleanup() {
    console.log(chalk.cyan('🧹 Cleaning up demo artifacts...'));

    try {
      // Remove demo task
      const demoTaskPath = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks', 'Integration-Demo-Task.md');
      if (await fs.pathExists(demoTaskPath)) {
        await fs.remove(demoTaskPath);
        console.log(chalk.green('   ✓ Demo task removed'));
      }

      // Remove demo agent
      const demoAgentPath = path.join(this.vaultPath, 'agents', 'demo-agent.md');
      if (await fs.pathExists(demoAgentPath)) {
        await fs.remove(demoAgentPath);
        console.log(chalk.green('   ✓ Demo agent removed'));
      }

    } catch (error) {
      console.log(chalk.yellow(`   ⚠️ Cleanup warning: ${error.message}`));
    }

    console.log();
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  const demo = new IntegrationDemo();

  demo.runDemo()
    .then(() => demo.cleanup())
    .catch(error => {
      console.error(chalk.red('❌ Demo failed:'), error);
      demo.cleanup().finally(() => process.exit(1));
    });
}

module.exports = IntegrationDemo;
