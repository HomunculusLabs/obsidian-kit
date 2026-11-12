const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const UnifiedAPI = require('../../unified-api');

describe('End-to-End Workflow Tests', () => {
  let testVault;
  let api;
  let originalCwd;

  beforeEach(async () => {
    testVault = await createTestVault('e2e-workflow-test');
    originalCwd = process.cwd();
    process.chdir(testVault);
    api = new UnifiedAPI(testVault);
    await api.initialize();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestVault('e2e-workflow-test');
  });

  describe('Complete Project Lifecycle', () => {
    test('should handle complete project workflow from init to completion', async () => {
      // 1. Initialize project (simulated)
      const projectData = {
        name: 'Test Project',
        description: 'End-to-end test project',
        vision: 'Create a comprehensive test of the entire system'
      };

      // 2. Create project specification
      const specPath = path.join(testVault, '.specify/specs/requirements.md');
      await fs.writeFile(specPath, `# ${projectData.name} Requirements

## Vision
${projectData.vision}

## Features
- Feature 1: Task Management
- Feature 2: Knowledge Graph
- Feature 3: Semantic Search

## Acceptance Criteria
- All features implemented
- Tests passing
- Documentation complete
`);

      // 3. Generate tasks from specification
      const tasks = [
        {
          title: 'Setup Project Infrastructure',
          description: 'Initialize project structure and dependencies',
          priority: 'high',
          estimatedTime: 120
        },
        {
          title: 'Implement Task Management',
          description: 'Create task creation, update, and tracking functionality',
          priority: 'high',
          estimatedTime: 240,
          dependencies: ['Setup Project Infrastructure']
        },
        {
          title: 'Build Knowledge Graph',
          description: 'Implement knowledge extraction and graph visualization',
          priority: 'medium',
          estimatedTime: 180,
          dependencies: ['Setup Project Infrastructure']
        },
        {
          title: 'Add Semantic Search',
          description: 'Implement semantic search capabilities',
          priority: 'medium',
          estimatedTime: 200,
          dependencies: ['Build Knowledge Graph']
        },
        {
          title: 'Write Documentation',
          description: 'Create comprehensive documentation',
          priority: 'low',
          estimatedTime: 60,
          dependencies: ['Implement Task Management', 'Build Knowledge Graph', 'Add Semantic Search']
        }
      ];

      // 4. Create all tasks
      const createdTasks = [];
      for (const taskData of tasks) {
        const result = await api.createTask(taskData);
        createdTasks.push(result);
        expect(result.success).toBe(true);
      }

      // 5. Simulate workflow progression
      // Start first task
      await api.updateTask(createdTasks[0].taskPath, {
        status: 'in-progress',
        time_spent: 30
      });

      // Complete first task
      await api.updateTask(createdTasks[0].taskPath, {
        status: 'done',
        time_spent: 120
      });

      // Start dependent tasks
      await api.updateTask(createdTasks[1].taskPath, {
        status: 'in-progress',
        time_spent: 60
      });

      await api.updateTask(createdTasks[2].taskPath, {
        status: 'in-progress',
        time_spent: 40
      });

      // 6. Verify project state
      const analytics = await api.getTaskAnalytics();
      expect(analytics.total).toBe(5);
      expect(analytics.byStatus.done).toBe(1);
      expect(analytics.byStatus['in-progress']).toBe(2);
      expect(analytics.byStatus.todo).toBe(2);

      // 7. Test search functionality
      const searchResults = await api.searchTasks('knowledge');
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].title).toContain('Knowledge Graph');

      // 8. Test knowledge graph integration
      const knowledgeGraph = await api.getKnowledgeGraph();
      expect(knowledgeGraph.nodes).toBeDefined();
      expect(knowledgeGraph.edges).toBeDefined();

      // 9. Complete all tasks
      for (let i = 1; i < createdTasks.length; i++) {
        await api.updateTask(createdTasks[i].taskPath, {
          status: 'done',
          time_spent: tasks[i].estimatedTime
        });
      }

      // 10. Verify project completion
      const finalAnalytics = await api.getTaskAnalytics();
      expect(finalAnalytics.byStatus.done).toBe(5);
      expect(finalAnalytics.byStatus.todo).toBe(0);
      expect(finalAnalytics.byStatus['in-progress']).toBe(0);
    });
  });

  describe('CLI Integration Workflow', () => {
    test('should handle CLI commands end-to-end', async () => {
      // Test CLI init command (simulated)
      const initResult = await simulateCLICommand(['init', 'cli-test-project', '--force']);
      expect(initResult.success).toBe(true);

      // Test CLI status command
      const statusResult = await simulateCLICommand(['status']);
      expect(statusResult.success).toBe(true);

      // Test CLI task creation
      const taskResult = await simulateCLICommand([
        'task-create',
        '--title', 'CLI Test Task',
        '--priority', 'high',
        '--description', 'Created via CLI'
      ]);
      expect(taskResult.success).toBe(true);

      // Verify task was created
      const tasks = await api.getAllTasks();
      const cliTask = tasks.find(task => task.title === 'CLI Test Task');
      expect(cliTask).toBeDefined();
      expect(cliTask.priority).toBe('high');
    });
  });

  describe('Multi-User Collaboration Simulation', () => {
    test('should handle multiple agents working on same project', async () => {
      // Simulate multiple AI agents working together
      const agents = ['claude-code', 'opencode', 'cursor'];
      const agentTasks = {};

      // Each agent creates tasks
      for (const agent of agents) {
        agentTasks[agent] = await api.createTask({
          title: `${agent} Integration Task`,
          description: `Task created by ${agent} agent`,
          assignee: agent,
          priority: 'medium',
          tags: [agent, 'integration']
        });
      }

      // Verify all tasks created
      const allTasks = await api.getAllTasks();
      expect(allTasks.length).toBe(agents.length);

      // Simulate agents updating their tasks
      for (const agent of agents) {
        await api.updateTask(agentTasks[agent].taskPath, {
          status: 'in-progress',
          time_spent: 30,
          notes: `Updated by ${agent} during collaboration`
        });
      }

      // Verify updates
      const updatedTasks = await api.getAllTasks();
      expect(updatedTasks.every(task => task.status === 'in-progress')).toBe(true);

      // Test agent coordination through events
      const coordinationEvents = [];
      api.hub.on('agent:task-update', (data) => {
        coordinationEvents.push(data);
      });

      // Simulate agent completing task and notifying others
      await api.updateTask(agentTasks[agents[0]].taskPath, {
        status: 'done',
        time_spent: 60
      });

      api.hub.emit('agent:task-update', {
        agent: agents[0],
        task: agentTasks[agents[0]].taskData,
        action: 'completed'
      });

      expect(coordinationEvents.length).toBeGreaterThan(0);
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should recover from component failures', async () => {
      // Create some tasks first
      await api.createTask({ title: 'Resilience Test Task 1' });
      await api.createTask({ title: 'Resilience Test Task 2' });

      // Simulate component failure
      const originalSearch = api.searchTasks;
      api.searchTasks = async () => {
        throw new Error('Search component temporarily unavailable');
      };

      // System should still function for other operations
      const newTask = await api.createTask({ title: 'Task During Failure' });
      expect(newTask.success).toBe(true);

      const allTasks = await api.getAllTasks();
      expect(allTasks.length).toBe(3);

      // Recover from failure
      api.searchTasks = originalSearch;

      // Verify search works again
      const searchResults = await api.searchTasks('Resilience');
      expect(searchResults.length).toBe(2);
    });

    test('should handle data corruption gracefully', async () => {
      // Create a task
      const task = await api.createTask({ title: 'Corruption Test Task' });
      
      // Corrupt the task file
      await fs.writeFile(task.taskPath, 'Corrupted content with no frontmatter');

      // System should handle corruption gracefully
      const allTasks = await api.getAllTasks();
      expect(allTasks.length).toBe(0); // Corrupted task should be filtered out

      // Should be able to create new tasks
      const newTask = await api.createTask({ title: 'Task After Corruption' });
      expect(newTask.success).toBe(true);
    });
  });
});

// Helper function to simulate CLI commands
async function simulateCLICommand(args) {
  return new Promise((resolve) => {
    const cliPath = path.join(__dirname, '../../cli/bin/obsidian-kit');
    const child = spawn('node', [cliPath, ...args], {
      stdio: 'pipe',
      cwd: process.cwd()
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output,
        error,
        exitCode: code
      });
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill();
      resolve({
        success: false,
        output,
        error: 'Command timed out',
        exitCode: -1
      });
    }, 30000);
  });
}