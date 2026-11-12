#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const EventEmitter = require('events');

class IntegrationHub extends EventEmitter {
  constructor(vaultPath) {
    super();
    this.vaultPath = vaultPath;
    this.components = {
      cli: null,
      knowledgeGraph: null,
      semanticSearch: null,
      taskManagement: null,
      workflowEngine: null,
      agentManager: null,
      mcpServer: null,
    };
    this.isInitialized = false;
    this.healthStatus = {
      overall: 'unknown',
      components: {},
      lastCheck: null,
    };
  }

  async initialize() {
    console.log(chalk.blue.bold('🔧 Initializing Component Integration Hub...\n'));

    try {
      // Validate vault structure
      await this.validateVaultStructure();

      // Initialize components in dependency order
      await this.initializeCLI();
      await this.initializeTaskManagement();
      await this.initializeKnowledgeGraph();
      await this.initializeSemanticSearch();
      await this.initializeWorkflowEngine();
      await this.initializeAgentManager();
      await this.initializeMCPServer();

      // Setup inter-component communication
      await this.setupComponentCommunication();

      // Run initial health check
      await this.performHealthCheck();

      this.isInitialized = true;
      console.log(chalk.green.bold('✅ Component Integration Hub initialized successfully!\n'));

      this.emit('initialized');

    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize Integration Hub:'), error.message);
      throw error;
    }
  }

  async validateVaultStructure() {
    console.log(chalk.cyan('📁 Validating vault structure...'));

    const requiredPaths = [
      '4 - Projects',
      '3 - Templates',
      '.specify',
      'agents',
      'mcp-config.json',
    ];

    const missing = [];
    for (const requiredPath of requiredPaths) {
      const fullPath = path.join(this.vaultPath, requiredPath);
      if (!await fs.pathExists(fullPath)) {
        missing.push(requiredPath);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required vault structure: ${missing.join(', ')}`);
    }

    console.log(chalk.green('   ✓ Vault structure validated'));
  }

  async initializeCLI() {
    console.log(chalk.cyan('🖥️  Initializing CLI component...'));

    const cliPath = path.join(__dirname, 'cli');
    if (!await fs.pathExists(cliPath)) {
      throw new Error('CLI component not found');
    }

    this.components.cli = {
      path: cliPath,
      commands: await this.loadCLICommands(),
      status: 'active',
    };

    console.log(chalk.green('   ✓ CLI component initialized'));
  }

  async initializeTaskManagement() {
    console.log(chalk.cyan('📋 Initializing Task Management component...'));

    const tasksBasePath = path.join(this.vaultPath, '4 - Projects', 'Tasks.base');
    const projectDashboardPath = path.join(this.vaultPath, '4 - Projects', 'Project Management Dashboard.md');

    // Ensure Tasks.base exists
    if (!await fs.pathExists(tasksBasePath)) {
      await this.createDefaultTasksBase();
    }

    this.components.taskManagement = {
      tasksBasePath,
      projectDashboardPath,
      status: 'active',
      stats: await this.getTaskStats(),
    };

    console.log(chalk.green('   ✓ Task Management component initialized'));
  }

  async initializeKnowledgeGraph() {
    console.log(chalk.cyan('🕸️  Initializing Knowledge Graph component...'));

    const graphPath = path.join(__dirname, 'knowledge-graph.json');
    const apiPath = path.join(__dirname, 'knowledge-graph-api.js');

    if (!await fs.pathExists(graphPath)) {
      await this.generateInitialKnowledgeGraph();
    }

    this.components.knowledgeGraph = {
      graphPath,
      apiPath,
      status: await fs.pathExists(apiPath) ? 'active' : 'inactive',
      nodeCount: await this.getGraphNodeCount(),
    };

    console.log(chalk.green('   ✓ Knowledge Graph component initialized'));
  }

  async initializeSemanticSearch() {
    console.log(chalk.cyan('🔍 Initializing Semantic Search component...'));

    const enginePath = path.join(__dirname, 'semantic-search-engine.js');
    const apiPath = path.join(__dirname, 'semantic-search-api.js');

    this.components.semanticSearch = {
      enginePath,
      apiPath,
      status: 'inactive', // Will be activated on demand
      indexSize: 0,
    };

    console.log(chalk.green('   ✓ Semantic Search component initialized'));
  }

  async initializeWorkflowEngine() {
    console.log(chalk.cyan('⚙️  Initializing Workflow Engine component...'));

    const workflowPath = path.join(__dirname, 'cli', 'commands', 'workflow.js');

    this.components.workflowEngine = {
      workflowPath,
      activeWorkflows: [],
      status: await fs.pathExists(workflowPath) ? 'active' : 'inactive',
    };

    console.log(chalk.green('   ✓ Workflow Engine component initialized'));
  }

  async initializeAgentManager() {
    console.log(chalk.cyan('🤖 Initializing Agent Manager component...'));

    const agentPath = path.join(__dirname, 'cli', 'commands', 'agent.js');
    const agentsDir = path.join(this.vaultPath, 'agents');

    this.components.agentManager = {
      agentPath,
      agentsDir,
      configuredAgents: await this.getConfiguredAgents(),
      status: await fs.pathExists(agentPath) ? 'active' : 'inactive',
    };

    console.log(chalk.green('   ✓ Agent Manager component initialized'));
  }

  async initializeMCPServer() {
    console.log(chalk.cyan('🌐 Initializing MCP Server component...'));

    const mcpConfigPath = path.join(this.vaultPath, 'mcp-config.json');

    this.components.mcpServer = {
      configPath: mcpConfigPath,
      status: await fs.pathExists(mcpConfigPath) ? 'configured' : 'unconfigured',
    };

    console.log(chalk.green('   ✓ MCP Server component initialized'));
  }

  async setupComponentCommunication() {
    console.log(chalk.cyan('🔗 Setting up inter-component communication...'));

    // Setup event handlers for cross-component integration
    this.on('task:created', async (task) => {
      await this.updateKnowledgeGraph('task', task);
      await this.updateSemanticIndex('task', task);
    });

    this.on('task:updated', async (task) => {
      await this.updateKnowledgeGraph('task', task);
      await this.updateSemanticIndex('task', task);
    });

    this.on('workflow:started', async (workflow) => {
      await this.logActivity('workflow', 'started', workflow);
    });

    this.on('agent:configured', async (agent) => {
      await this.updateKnowledgeGraph('agent', agent);
    });

    console.log(chalk.green('   ✓ Inter-component communication established'));
  }

  async loadCLICommands() {
    const commandsDir = path.join(__dirname, 'cli', 'commands');
    const commands = [];

    if (await fs.pathExists(commandsDir)) {
      const files = await fs.readdir(commandsDir);
      for (const file of files) {
        if (file.endsWith('.js')) {
          commands.push(file.replace('.js', ''));
        }
      }
    }

    return commands;
  }

  async createDefaultTasksBase() {
    const tasksBasePath = path.join(this.vaultPath, '4 - Projects', 'Tasks.base');
    const defaultContent = `# Tasks Database

\`\`\`dataview
TABLE 
  status as "Status",
  priority as "Priority", 
  due_date as "Due Date",
  assignee as "Assignee",
  time_estimate as "Estimate"
FROM "4 - Projects"
WHERE contains(file.path, "Tasks") AND !contains(file.name, "Tasks.base")
SORT due_date ASC, priority DESC
\`\`\`

## Task Views

### 🔥 High Priority Tasks
\`\`\`dataview
LIST
FROM "4 - Projects"
WHERE contains(file.path, "Tasks") AND priority = "high" AND status != "completed"
SORT due_date ASC
\`\`\`

### 📅 Due This Week
\`\`\`dataview
LIST
FROM "4 - Projects"
WHERE contains(file.path, "Tasks") AND due_date <= date(today) + dur(7 days) AND status != "completed"
SORT due_date ASC
\`\`\`

### 🚧 In Progress
\`\`\`dataview
LIST
FROM "4 - Projects"
WHERE contains(file.path, "Tasks") AND status = "in-progress"
SORT due_date ASC
\`\`\`
`;

    await fs.writeFile(tasksBasePath, defaultContent);
  }

  async generateInitialKnowledgeGraph() {
    const graphPath = path.join(__dirname, 'knowledge-graph.json');
    const initialGraph = {
      nodes: [],
      edges: [],
      metadata: {
        generated: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    await fs.writeJson(graphPath, initialGraph, { spaces: 2 });
  }

  async getTaskStats() {
    const tasksBasePath = path.join(this.vaultPath, '4 - Projects', 'Tasks.base');

    if (!await fs.pathExists(tasksBasePath)) {
      return { total: 0, pending: 0, inProgress: 0, completed: 0 };
    }

    // Simplified stats - in real implementation would parse Tasks.base
    return { total: 0, pending: 0, inProgress: 0, completed: 0 };
  }

  async getGraphNodeCount() {
    const graphPath = path.join(__dirname, 'knowledge-graph.json');

    if (!await fs.pathExists(graphPath)) {
      return 0;
    }

    try {
      const graph = await fs.readJson(graphPath);
      return graph.nodes ? graph.nodes.length : 0;
    } catch {
      return 0;
    }
  }

  async getConfiguredAgents() {
    const agentsDir = path.join(this.vaultPath, 'agents');

    if (!await fs.pathExists(agentsDir)) {
      return [];
    }

    const files = await fs.readdir(agentsDir);
    return files.filter(file => file.endsWith('.md')).map(file => file.replace('.md', ''));
  }

  async performHealthCheck() {
    console.log(chalk.cyan('🏥 Performing system health check...'));

    const health = {
      overall: 'healthy',
      components: {},
      issues: [],
      lastCheck: new Date().toISOString(),
    };

    // Check each component
    for (const [name, component] of Object.entries(this.components)) {
      const componentHealth = await this.checkComponentHealth(name, component);
      health.components[name] = componentHealth;

      if (componentHealth.status !== 'healthy') {
        health.overall = 'degraded';
        health.issues.push(...componentHealth.issues);
      }
    }

    this.healthStatus = health;
    this.displayHealthStatus(health);

    console.log(chalk.green('   ✓ Health check completed'));
  }

  async checkComponentHealth(name, component) {
    const health = {
      status: 'healthy',
      issues: [],
    };

    if (!component) {
      health.status = 'missing';
      health.issues.push(`${name} component not found`);
      return health;
    }

    if (component.status === 'inactive' || component.status === 'unconfigured') {
      health.status = 'warning';
      health.issues.push(`${name} component is ${component.status}`);
    }

    return health;
  }

  displayHealthStatus(health) {
    console.log(chalk.blue.bold('\n📊 System Health Status:'));
    console.log(`Overall: ${health.overall === 'healthy' ? chalk.green('✅ Healthy') : chalk.yellow('⚠️ Degraded')}`);

    for (const [name, component] of Object.entries(health.components)) {
      const status = component.status === 'healthy' ? chalk.green('✅') : chalk.yellow('⚠️');
      console.log(`  ${status} ${name}: ${component.status}`);
    }

    if (health.issues.length > 0) {
      console.log(chalk.yellow('\n⚠️ Issues:'));
      health.issues.forEach(issue => console.log(`   • ${issue}`));
    }

    console.log();
  }

  async updateKnowledgeGraph(type, data) {
    if (this.components.knowledgeGraph.status !== 'active') {
      return;
    }

    // Implementation would update the knowledge graph with new data
    console.log(chalk.gray(`   Updating knowledge graph with ${type} data`));
  }

  async updateSemanticIndex(type, data) {
    if (this.components.semanticSearch.status !== 'active') {
      return;
    }

    // Implementation would update semantic search index
    console.log(chalk.gray(`   Updating semantic search index with ${type} data`));
  }

  async logActivity(type, action, data) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      action,
      data,
    };

    console.log(chalk.gray(`   Activity logged: ${type}:${action}`));
  }

  async shutdown() {
    console.log(chalk.cyan('🔄 Shutting down Integration Hub...'));

    // Cleanup components
    for (const [name, component] of Object.entries(this.components)) {
      if (component.status === 'active') {
        component.status = 'stopped';
      }
    }

    this.isInitialized = false;
    console.log(chalk.green('✅ Integration Hub shutdown complete'));
  }

  getComponentStatus() {
    return this.components;
  }

  getHealthStatus() {
    return this.healthStatus;
  }
}

module.exports = IntegrationHub;
