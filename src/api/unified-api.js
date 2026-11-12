#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const IntegrationHub = require('./integration-hub');

class UnifiedAPI {
  constructor(vaultPath) {
    this.vaultPath = vaultPath;
    this.hub = new IntegrationHub(vaultPath);
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    await this.hub.initialize();
    this.isInitialized = true;
  }

  // Task Management API
  async createTask(taskData) {
    await this.initialize();

    const taskPath = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks', `${taskData.title.replace(/\s+/g, '-')}.md`);

    const taskContent = this.generateTaskContent(taskData);
    await fs.writeFile(taskPath, taskContent);

    // Notify other components
    this.hub.emit('task:created', taskData);

    return { success: true, taskPath, taskData };
  }

  async updateTask(taskPath, updates) {
    await this.initialize();

    const existingContent = await fs.readFile(taskPath, 'utf8');
    const taskData = this.parseTaskContent(existingContent);

    // Merge updates
    Object.assign(taskData, updates);

    const updatedContent = this.generateTaskContent(taskData);
    await fs.writeFile(taskPath, updatedContent);

    this.hub.emit('task:updated', taskData);

    return { success: true, taskData };
  }

  async searchTasks(query) {
    await this.initialize();

    const tasksDir = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks');

    if (!await fs.pathExists(tasksDir)) {
      return { results: [], total: 0 };
    }

    const taskFiles = await fs.readdir(tasksDir);
    const results = [];

    for (const file of taskFiles) {
      if (file.endsWith('.md')) {
        const filePath = path.join(tasksDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const taskData = this.parseTaskContent(content);

        // Simple search implementation
        if (this.matchesQuery(taskData, query)) {
          results.push({
            path: filePath,
            ...taskData,
          });
        }
      }
    }

    return { results, total: results.length };
  }

  // Knowledge Graph API
  async getKnowledgeGraph() {
    await this.initialize();

    const graphPath = path.join(__dirname, 'knowledge-graph.json');

    if (!await fs.pathExists(graphPath)) {
      return { nodes: [], edges: [] };
    }

    return await fs.readJson(graphPath);
  }

  async updateKnowledgeGraph(entityType, entityData) {
    await this.initialize();

    const graphPath = path.join(__dirname, 'knowledge-graph.json');
    let graph = { nodes: [], edges: [] };

    if (await fs.pathExists(graphPath)) {
      graph = await fs.readJson(graphPath);
    }

    // Add or update node
    const existingNodeIndex = graph.nodes.findIndex(node =>
      node.id === entityData.id || node.name === entityData.title,
    );

    const node = {
      id: entityData.id || entityData.title,
      name: entityData.title,
      type: entityType,
      ...entityData,
    };

    if (existingNodeIndex >= 0) {
      graph.nodes[existingNodeIndex] = node;
    } else {
      graph.nodes.push(node);
    }

    await fs.writeJson(graphPath, graph, { spaces: 2 });

    this.hub.emit('knowledge-graph:updated', { entityType, entityData });

    return { success: true, graph };
  }

  // Semantic Search API
  async semanticSearch(query, options = {}) {
    await this.initialize();

    try {
      const SemanticSearchEngine = require('./semantic-search-engine');
      const engine = new SemanticSearchEngine(this.vaultPath);
      await engine.initialize();

      const results = await engine.search(query, {
        maxResults: options.maxResults || 10,
        similarityThreshold: options.threshold || 0.3,
      });

      return results;

    } catch (error) {
      console.log(chalk.yellow(`⚠️ Semantic search unavailable: ${error.message}`));
      return { results: [], total: 0, error: error.message };
    }
  }

  // Workflow API
  async startWorkflow(workflowType, data = {}) {
    await this.initialize();

    const workflowId = `${workflowType}-${Date.now()}`;
    const workflow = {
      id: workflowId,
      type: workflowType,
      status: 'started',
      startTime: new Date().toISOString(),
      data,
    };

    this.hub.emit('workflow:started', workflow);

    // Execute workflow-specific logic
    switch (workflowType) {
    case 'spec-driven':
      return await this.executeSpecDrivenWorkflow(workflow);
    case 'task-breakdown':
      return await this.executeTaskBreakdownWorkflow(workflow);
    case 'project-review':
      return await this.executeProjectReviewWorkflow(workflow);
    default:
      throw new Error(`Unknown workflow type: ${workflowType}`);
    }
  }

  async executeSpecDrivenWorkflow(workflow) {
    console.log(chalk.cyan('🔄 Executing Spec-Driven Development Workflow...'));

    // Step 1: Analyze current specifications
    const specsDir = path.join(this.vaultPath, '.specify', 'specs');
    const specs = await this.analyzeSpecifications(specsDir);

    // Step 2: Generate tasks from specs
    const generatedTasks = await this.generateTasksFromSpecs(specs);

    // Step 3: Update knowledge graph
    for (const task of generatedTasks) {
      await this.updateKnowledgeGraph('task', task);
    }

    workflow.status = 'completed';
    workflow.endTime = new Date().toISOString();
    workflow.results = { specs, generatedTasks };

    this.hub.emit('workflow:completed', workflow);

    return workflow;
  }

  async executeTaskBreakdownWorkflow(workflow) {
    console.log(chalk.cyan('🔄 Executing Task Breakdown Workflow...'));

    const taskDescription = workflow.data.taskDescription;
    if (!taskDescription) {
      throw new Error('Task description is required for task breakdown workflow');
    }

    // Use the task breakdown command
    const taskBreakdownCommand = require('./cli/commands/task-breakdown');

    // This would normally integrate with the command
    const subtasks = await this.generateSubtasks(taskDescription);

    workflow.status = 'completed';
    workflow.endTime = new Date().toISOString();
    workflow.results = { subtasks };

    this.hub.emit('workflow:completed', workflow);

    return workflow;
  }

  async executeProjectReviewWorkflow(workflow) {
    console.log(chalk.cyan('🔄 Executing Project Review Workflow...'));

    // Analyze project health
    const health = this.hub.getHealthStatus();

    // Get task statistics
    const taskStats = await this.getProjectTaskStats();

    // Get knowledge graph insights
    const graph = await this.getKnowledgeGraph();

    workflow.status = 'completed';
    workflow.endTime = new Date().toISOString();
    workflow.results = { health, taskStats, graphInsights: graph };

    this.hub.emit('workflow:completed', workflow);

    return workflow;
  }

  // Agent Management API
  async configureAgent(agentType, config) {
    await this.initialize();

    const agentConfigPath = path.join(this.vaultPath, 'agents', `${agentType}.md`);

    const configContent = this.generateAgentConfig(agentType, config);
    await fs.writeFile(agentConfigPath, configContent);

    this.hub.emit('agent:configured', { agentType, config });

    return { success: true, agentType, configPath: agentConfigPath };
  }

  async getAgentStatus() {
    await this.initialize();

    const agentsDir = path.join(this.vaultPath, 'agents');
    const agents = [];

    if (await fs.pathExists(agentsDir)) {
      const agentFiles = await fs.readdir(agentsDir);

      for (const file of agentFiles) {
        if (file.endsWith('.md')) {
          const agentType = file.replace('.md', '');
          const configPath = path.join(agentsDir, file);
          const content = await fs.readFile(configPath, 'utf8');

          agents.push({
            type: agentType,
            configPath,
            configured: content.includes('configured: true'),
            content: content.substring(0, 200) + '...',
          });
        }
      }
    }

    return { agents };
  }

  // System Status API
  async getSystemStatus() {
    await this.initialize();

    const health = this.hub.getHealthStatus();
    const components = this.hub.getComponentStatus();
    const taskStats = await this.getProjectTaskStats();
    const agentStatus = await this.getAgentStatus();

    return {
      health,
      components,
      taskStats,
      agentStatus,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper methods
  generateTaskContent(taskData) {
    const frontmatter = {
      title: taskData.title,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      project: taskData.project || '[[Obsidian-Kit-Dev]]',
      assignee: taskData.assignee || 'AI Agent',
      due_date: taskData.due_date || new Date().toISOString().split('T')[0],
      created_date: taskData.created_date || new Date().toISOString().split('T')[0],
      time_estimate: taskData.time_estimate || 0,
      time_spent: taskData.time_spent || 0,
      dependencies: taskData.dependencies || [],
      subtasks: taskData.subtasks || [],
      tags: ['task', ...(taskData.tags || [])],
    };

    let content = '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        content += `${key}:\n`;
        for (const item of value) {
          content += `  - "${item}"\n`;
        }
      } else {
        content += `${key}: "${value}"\n`;
      }
    }
    content += '---\n\n';

    content += `# ${taskData.title}\n\n`;

    if (taskData.description) {
      content += `${taskData.description}\n\n`;
    }

    if (taskData.acceptanceCriteria && taskData.acceptanceCriteria.length > 0) {
      content += '## Acceptance Criteria\n';
      for (const criterion of taskData.acceptanceCriteria) {
        content += `- [ ] ${criterion}\n`;
      }
      content += '\n';
    }

    if (taskData.notes) {
      content += '## Notes\n';
      content += `${taskData.notes}\n\n`;
    }

    return content;
  }

  parseTaskContent(content) {
    const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);
    if (!frontmatterMatch) {
      return {};
    }

    const frontmatter = {};
    const lines = frontmatterMatch[1].split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        frontmatter[key] = value.replace(/^"|"$/g, '');
      }
    }

    return frontmatter;
  }

  matchesQuery(taskData, query) {
    const queryLower = query.toLowerCase();
    const searchText = [
      taskData.title,
      taskData.description,
      taskData.status,
      taskData.priority,
    ].join(' ').toLowerCase();

    return searchText.includes(queryLower);
  }

  async analyzeSpecifications(specsDir) {
    if (!await fs.pathExists(specsDir)) {
      return [];
    }

    const specs = [];
    const specFiles = await fs.readdir(specsDir);

    for (const file of specFiles) {
      if (file.endsWith('.md')) {
        const specPath = path.join(specsDir, file);
        const content = await fs.readFile(specPath, 'utf8');
        specs.push({ file, content });
      }
    }

    return specs;
  }

  async generateTasksFromSpecs(specs) {
    const tasks = [];

    for (const spec of specs) {
      // Simple task generation from specs
      const task = {
        title: `Implement ${spec.file.replace('.md', '')}`,
        description: `Task generated from specification: ${spec.file}`,
        status: 'todo',
        priority: 'medium',
        tags: ['spec-driven', 'generated'],
      };

      tasks.push(task);
    }

    return tasks;
  }

  async generateSubtasks(taskDescription) {
    // Simple subtask generation
    return [
      { title: 'Research requirements', status: 'todo' },
      { title: 'Design solution', status: 'todo' },
      { title: 'Implement core functionality', status: 'todo' },
      { title: 'Test and validate', status: 'todo' },
    ];
  }

  async getProjectTaskStats() {
    const tasksDir = path.join(this.vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks');

    if (!await fs.pathExists(tasksDir)) {
      return { total: 0, byStatus: {}, byPriority: {} };
    }

    const taskFiles = await fs.readdir(tasksDir);
    const stats = {
      total: taskFiles.filter(f => f.endsWith('.md')).length,
      byStatus: {},
      byPriority: {},
    };

    for (const file of taskFiles) {
      if (file.endsWith('.md')) {
        try {
          const content = await fs.readFile(path.join(tasksDir, file), 'utf8');
          const taskData = this.parseTaskContent(content);

          stats.byStatus[taskData.status] = (stats.byStatus[taskData.status] || 0) + 1;
          stats.byPriority[taskData.priority] = (stats.byPriority[taskData.priority] || 0) + 1;
        } catch (error) {
          // Skip invalid task files
        }
      }
    }

    return stats;
  }

  generateAgentConfig(agentType, config) {
    return `# ${agentType} Configuration

\`\`\`yaml
configured: true
type: "${agentType}"
version: "1.0.0"
created: "${new Date().toISOString()}"
\`\`\`

## Configuration

${config.description || `Configuration for ${agentType} agent.`}

## Capabilities

- Task management
- Documentation generation
- Code analysis
- Workflow automation

## Integration Status

✅ Configured with Obsidian Kit
✅ MCP integration available
✅ Workflow integration enabled

---
*Generated by Obsidian Kit Unified API*
`;
  }

  async shutdown() {
    if (this.isInitialized) {
      await this.hub.shutdown();
      this.isInitialized = false;
    }
  }
}

module.exports = UnifiedAPI;
