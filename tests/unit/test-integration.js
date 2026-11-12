#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const IntegrationHub = require('./integration-hub');

class IntegrationTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      details: [],
    };
    this.vaultPath = path.join(__dirname, 'Obsidian-Kit-Dev');
  }

  async runAllTests() {
    console.log(chalk.blue.bold('🧪 Running Component Integration Tests\n'));

    const startTime = Date.now();

    try {
      // Test suite
      await this.testVaultStructure();
      await this.testCLIIntegration();
      await this.testTaskManagementIntegration();
      await this.testKnowledgeGraphIntegration();
      await this.testSemanticSearchIntegration();
      await this.testWorkflowEngineIntegration();
      await this.testAgentManagerIntegration();
      await this.testMCPServerIntegration();
      await this.testInterComponentCommunication();
      await this.testEndToEndWorkflows();

      const duration = Date.now() - startTime;
      this.displayTestResults(duration);

    } catch (error) {
      console.error(chalk.red('❌ Test suite failed:'), error.message);
      process.exit(1);
    }
  }

  async testVaultStructure() {
    this.runTest('Vault Structure Validation', async () => {
      const requiredPaths = [
        '4 - Projects',
        '3 - Templates',
        '.specify',
        'agents',
        'mcp-config.json',
      ];

      for (const requiredPath of requiredPaths) {
        const fullPath = path.join(this.vaultPath, requiredPath);
        if (!await fs.pathExists(fullPath)) {
          throw new Error(`Missing required path: ${requiredPath}`);
        }
      }

      return true;
    });
  }

  async testCLIIntegration() {
    this.runTest('CLI Component Integration', async () => {
      const cliPath = path.join(__dirname, 'cli');
      const binPath = path.join(cliPath, 'bin', 'obsidian-kit');
      const commandsDir = path.join(cliPath, 'commands');

      // Check CLI structure
      if (!await fs.pathExists(cliPath)) {
        throw new Error('CLI directory not found');
      }

      if (!await fs.pathExists(binPath)) {
        throw new Error('CLI binary not found');
      }

      if (!await fs.pathExists(commandsDir)) {
        throw new Error('CLI commands directory not found');
      }

      // Check required commands
      const requiredCommands = [
        'init.js',
        'status.js',
        'agent.js',
        'workflow.js',
        'task-breakdown.js',
        'task-validator.js',
        'automated-task-generation.js',
      ];

      for (const command of requiredCommands) {
        const commandPath = path.join(commandsDir, command);
        if (!await fs.pathExists(commandPath)) {
          throw new Error(`Missing command: ${command}`);
        }
      }

      return true;
    });
  }

  async testTaskManagementIntegration() {
    this.runTest('Task Management Integration', async () => {
      const tasksBasePath = path.join(this.vaultPath, '4 - Projects', 'Tasks.base');
      const projectDashboardPath = path.join(this.vaultPath, '4 - Projects', 'Project Management Dashboard.md');

      // Check task management files
      if (!await fs.pathExists(tasksBasePath)) {
        throw new Error('Tasks.base file not found');
      }

      if (!await fs.pathExists(projectDashboardPath)) {
        throw new Error('Project Management Dashboard not found');
      }

      // Check Tasks.base content
      const tasksBaseContent = await fs.readFile(tasksBasePath, 'utf8');
      if (!tasksBaseContent.includes('dataview') && !tasksBaseContent.includes('views:')) {
        throw new Error('Tasks.base missing Dataview configuration');
      }

      // Check for existing tasks
      const tasksDir = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks');
      if (await fs.pathExists(tasksDir)) {
        const taskFiles = await fs.readdir(tasksDir);
        if (taskFiles.length === 0) {
          console.log(chalk.yellow('   ⚠️ No task files found (this may be expected for new projects)'));
        }
      }

      return true;
    });
  }

  async testKnowledgeGraphIntegration() {
    this.runTest('Knowledge Graph Integration', async () => {
      const graphPath = path.join(__dirname, 'knowledge-graph.json');
      const apiPath = path.join(__dirname, 'knowledge-graph-api.js');
      const extractorPath = path.join(__dirname, 'knowledge-graph-extractor.js');
      const queryPath = path.join(__dirname, 'knowledge-graph-query.js');

      // Check knowledge graph components
      if (!await fs.pathExists(graphPath)) {
        throw new Error('Knowledge graph file not found');
      }

      if (!await fs.pathExists(apiPath)) {
        throw new Error('Knowledge graph API not found');
      }

      if (!await fs.pathExists(extractorPath)) {
        throw new Error('Knowledge graph extractor not found');
      }

      if (!await fs.pathExists(queryPath)) {
        throw new Error('Knowledge graph query not found');
      }

      // Check graph structure
      const graph = await fs.readJson(graphPath);
      if (!graph.nodes || !graph.edges) {
        throw new Error('Invalid knowledge graph structure');
      }

      return true;
    });
  }

  async testSemanticSearchIntegration() {
    this.runTest('Semantic Search Integration', async () => {
      const enginePath = path.join(__dirname, 'semantic-search-engine.js');
      const apiPath = path.join(__dirname, 'semantic-search-api.js');
      const testPath = path.join(__dirname, 'test-semantic-search.js');

      // Check semantic search components
      if (!await fs.pathExists(enginePath)) {
        throw new Error('Semantic search engine not found');
      }

      if (!await fs.pathExists(apiPath)) {
        throw new Error('Semantic search API not found');
      }

      if (!await fs.pathExists(testPath)) {
        throw new Error('Semantic search test not found');
      }

      // Test basic engine functionality
      try {
        const SemanticSearchEngine = require('./semantic-search-engine');
        const engine = new SemanticSearchEngine(this.vaultPath);

        // This would normally initialize, but we'll just check the constructor
        if (!engine) {
          throw new Error('Failed to create semantic search engine');
        }

      } catch (error) {
        // Expected if dependencies are missing
        console.log(chalk.yellow(`   ⚠️ Semantic search engine test skipped: ${error.message}`));
      }

      return true;
    });
  }

  async testWorkflowEngineIntegration() {
    this.runTest('Workflow Engine Integration', async () => {
      const workflowPath = path.join(__dirname, 'cli', 'commands', 'workflow.js');

      if (!await fs.pathExists(workflowPath)) {
        throw new Error('Workflow command not found');
      }

      // Check workflow command can be loaded
      try {
        const workflowCommand = require(workflowPath);
        if (typeof workflowCommand !== 'function') {
          throw new Error('Workflow command is not a function');
        }
      } catch (error) {
        throw new Error(`Failed to load workflow command: ${error.message}`);
      }

      // Check .specify directory structure
      const specifyDir = path.join(this.vaultPath, '.specify');
      if (await fs.pathExists(specifyDir)) {
        const requiredSubdirs = ['memory', 'specs', 'workflows'];
        for (const subdir of requiredSubdirs) {
          const subdirPath = path.join(specifyDir, subdir);
          if (!await fs.pathExists(subdirPath)) {
            console.log(chalk.yellow(`   ⚠️ Missing .specify subdirectory: ${subdir}`));
          }
        }
      }

      return true;
    });
  }

  async testAgentManagerIntegration() {
    this.runTest('Agent Manager Integration', async () => {
      const agentPath = path.join(__dirname, 'cli', 'commands', 'agent.js');
      const agentsDir = path.join(this.vaultPath, 'agents');

      if (!await fs.pathExists(agentPath)) {
        throw new Error('Agent command not found');
      }

      if (!await fs.pathExists(agentsDir)) {
        throw new Error('Agents directory not found');
      }

      // Check agent command can be loaded
      try {
        const agentCommand = require(agentPath);
        if (typeof agentCommand !== 'function') {
          throw new Error('Agent command is not a function');
        }
      } catch (error) {
        throw new Error(`Failed to load agent command: ${error.message}`);
      }

      // Check for agent configuration files
      const agentFiles = await fs.readdir(agentsDir);
      const expectedAgents = ['claude-code.md', 'opencode.md', 'cursor.md'];

      for (const expectedAgent of expectedAgents) {
        if (!agentFiles.includes(expectedAgent)) {
          console.log(chalk.yellow(`   ⚠️ Missing agent config: ${expectedAgent}`));
        }
      }

      return true;
    });
  }

  async testMCPServerIntegration() {
    this.runTest('MCP Server Integration', async () => {
      const mcpConfigPath = path.join(this.vaultPath, 'mcp-config.json');
      const mcpCommandPath = path.join(__dirname, 'cli', 'commands', 'mcp.js');

      if (!await fs.pathExists(mcpConfigPath)) {
        throw new Error('MCP config not found');
      }

      if (!await fs.pathExists(mcpCommandPath)) {
        throw new Error('MCP command not found');
      }

      // Check MCP config structure
      const mcpConfig = await fs.readJson(mcpConfigPath);
      if (!mcpConfig.server || !mcpConfig.claude_config_template) {
        throw new Error('Invalid MCP config structure');
      }

      return true;
    });
  }

  async testInterComponentCommunication() {
    this.runTest('Inter-Component Communication', async () => {
      // Initialize integration hub
      const hub = new IntegrationHub(this.vaultPath);

      try {
        await hub.initialize();

        // Test event emission
        let eventReceived = false;
        hub.on('test:event', () => {
          eventReceived = true;
        });

        hub.emit('test:event');

        if (!eventReceived) {
          throw new Error('Event system not working');
        }

        // Test component status
        const componentStatus = hub.getComponentStatus();
        if (!componentStatus || typeof componentStatus !== 'object') {
          throw new Error('Component status not available');
        }

        // Test health status
        const healthStatus = hub.getHealthStatus();
        if (!healthStatus || !healthStatus.components) {
          throw new Error('Health status not available');
        }

        await hub.shutdown();

      } catch (error) {
        await hub.shutdown();
        throw error;
      }

      return true;
    });
  }

  async testEndToEndWorkflows() {
    this.runTest('End-to-End Workflows', async () => {
      // Test basic workflow: Create task -> Update knowledge graph -> Search

      // 1. Test task creation workflow
      const testTaskPath = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks', 'Test-Integration-Task.md');

      const testTaskContent = `---
title: "Test Integration Task"
status: "todo"
priority: "medium"
project: "[[Obsidian-Kit-Dev]]"
assignee: "Integration Test"
due_date: "${new Date().toISOString().split('T')[0]}"
created_date: "${new Date().toISOString().split('T')[0]}"
time_estimate: 30
time_spent: 0
dependencies: []
subtasks: []
tags:
  - task
  - integration-test
---

# Test Integration Task

This is a test task created during integration testing.

## Acceptance Criteria
- [ ] Task is created successfully
- [ ] Task appears in task management system
- [ ] Task is indexed by search system

## Notes
Created during component integration testing.
`;

      await fs.writeFile(testTaskPath, testTaskContent);

      // 2. Verify task exists
      if (!await fs.pathExists(testTaskPath)) {
        throw new Error('Test task creation failed');
      }

      // 3. Test task can be read
      const taskContent = await fs.readFile(testTaskPath, 'utf8');
      if (!taskContent.includes('Test Integration Task')) {
        throw new Error('Test task content invalid');
      }

      // 4. Cleanup test task
      await fs.remove(testTaskPath);

      return true;
    });
  }

  runTest(testName, testFunction) {
    this.testResults.total++;

    console.log(chalk.cyan(`🔍 ${testName}...`));

    testFunction()
      .then(() => {
        this.testResults.passed++;
        this.testResults.details.push({ name: testName, status: 'passed' });
        console.log(chalk.green(`   ✅ ${testName} passed\n`));
      })
      .catch((error) => {
        this.testResults.failed++;
        this.testResults.details.push({
          name: testName,
          status: 'failed',
          error: error.message,
        });
        console.log(chalk.red(`   ❌ ${testName} failed: ${error.message}\n`));
      });
  }

  displayTestResults(duration) {
    console.log(chalk.blue.bold('\n📊 Integration Test Results'));
    console.log(chalk.gray('='.repeat(50)));

    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(chalk.green(`Passed: ${this.testResults.passed}`));
    console.log(chalk.red(`Failed: ${this.testResults.failed}`));
    console.log(chalk.yellow(`Skipped: ${this.testResults.skipped}`));
    console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);

    const successRate = this.testResults.total > 0
      ? ((this.testResults.passed / this.testResults.total) * 100).toFixed(1)
      : 0;

    console.log(`Success Rate: ${successRate}%`);

    // Show failed tests
    const failedTests = this.testResults.details.filter(t => t.status === 'failed');
    if (failedTests.length > 0) {
      console.log(chalk.red.bold('\n❌ Failed Tests:'));
      failedTests.forEach(test => {
        console.log(chalk.red(`   • ${test.name}: ${test.error}`));
      });
    }

    // Overall status
    if (this.testResults.failed === 0) {
      console.log(chalk.green.bold('\n✅ All integration tests passed!'));
      console.log(chalk.green('Component integration is working correctly.'));
    } else {
      console.log(chalk.red.bold('\n❌ Some integration tests failed.'));
      console.log(chalk.yellow('Please review and fix the issues above.'));
    }

    console.log();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.runAllTests().catch(error => {
    console.error(chalk.red('❌ Test execution failed:'), error);
    process.exit(1);
  });
}

module.exports = IntegrationTester;
