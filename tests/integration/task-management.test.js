const fs = require('fs-extra');
const path = require('path');
const UnifiedAPI = require('../../unified-api');

describe('Task Management Integration', () => {
  let testVault;
  let api;

  beforeEach(async () => {
    testVault = await createTestVault('task-integration-test');
    api = new UnifiedAPI(testVault);
    await api.initialize();
  });

  afterEach(async () => {
    await cleanupTestVault('task-integration-test');
  });

  describe('Task Creation Workflow', () => {
    test('should create task and update knowledge graph', async () => {
      const taskData = {
        title: 'Integration Test Task',
        description: 'Testing task creation with knowledge graph integration',
        status: 'todo',
        priority: 'high',
        assignee: 'Test User',
        tags: ['test', 'integration'],
        acceptanceCriteria: [
          'Task is created successfully',
          'Task appears in knowledge graph',
          'Task is searchable'
        ]
      };

      const result = await api.createTask(taskData);

      expect(result.success).toBe(true);
      expect(result.taskPath).toBeDefined();
      expect(await fs.pathExists(result.taskPath)).toBe(true);

      // Verify task content
      const content = await fs.readFile(result.taskPath, 'utf8');
      expect(content).toContain(taskData.title);
      expect(content).toContain(taskData.description);
      expect(content).toContain(taskData.status);

      // Verify knowledge graph was updated (event was emitted)
      const eventSpy = jest.fn();
      api.hub.on('task:created', eventSpy);
      
      await api.createTask({
        title: 'Second Test Task',
        description: 'Testing event emission'
      });

      expect(eventSpy).toHaveBeenCalled();
    });

    test('should update existing tasks', async () => {
      // Create initial task
      const createResult = await api.createTask({
        title: 'Update Test Task',
        status: 'todo',
        priority: 'medium'
      });

      // Update the task
      const updates = {
        status: 'in-progress',
        time_spent: 60,
        notes: 'Task updated during integration test'
      };

      const updateResult = await api.updateTask(createResult.taskPath, updates);

      expect(updateResult.success).toBe(true);

      // Verify updates were applied
      const updatedContent = await fs.readFile(createResult.taskPath, 'utf8');
      expect(updatedContent).toContain('status: "in-progress"');
      expect(updatedContent).toContain('time_spent: 60');
    });

    test('should handle task dependencies', async () => {
      // Create dependent tasks
      const task1 = await api.createTask({
        title: 'Prerequisite Task',
        status: 'todo'
      });

      const task2 = await api.createTask({
        title: 'Dependent Task',
        status: 'todo',
        dependencies: [task1.taskData.title]
      });

      // Verify dependency relationship
      const task2Content = await fs.readFile(task2.taskPath, 'utf8');
      expect(task2Content).toContain(task1.taskData.title);
    });
  });

  describe('Task Search and Discovery', () => {
    beforeEach(async () => {
      // Create test tasks for search
      await api.createTask({
        title: 'Frontend Development',
        description: 'Implement user interface components',
        tags: ['frontend', 'ui', 'react']
      });

      await api.createTask({
        title: 'Backend API',
        description: 'Develop REST API endpoints',
        tags: ['backend', 'api', 'nodejs']
      });

      await api.createTask({
        title: 'Database Design',
        description: 'Design database schema',
        tags: ['database', 'schema', 'postgresql']
      });
    });

    test('should search tasks by title', async () => {
      const searchResults = await api.searchTasks('Frontend');

      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].title).toContain('Frontend');
    });

    test('should search tasks by tags', async () => {
      const searchResults = await api.searchTasks('api');

      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].tags).toContain('api');
    });

    test('should filter tasks by status', async () => {
      const allTasks = await api.getAllTasks();
      const todoTasks = await api.getTasksByStatus('todo');

      expect(todoTasks.length).toBe(allTasks.length);
      expect(todoTasks.every(task => task.status === 'todo')).toBe(true);
    });
  });

  describe('Task Analytics', () => {
    test('should provide task statistics', async () => {
      // Create tasks with different statuses
      await api.createTask({ title: 'Task 1', status: 'todo' });
      await api.createTask({ title: 'Task 2', status: 'in-progress' });
      await api.createTask({ title: 'Task 3', status: 'done' });

      const analytics = await api.getTaskAnalytics();

      expect(analytics.total).toBe(3);
      expect(analytics.byStatus.todo).toBe(1);
      expect(analytics.byStatus['in-progress']).toBe(1);
      expect(analytics.byStatus.done).toBe(1);
    });

    test('should calculate time tracking metrics', async () => {
      await api.createTask({
        title: 'Time Tracked Task',
        time_estimate: 120,
        time_spent: 80
      });

      const analytics = await api.getTaskAnalytics();

      expect(analytics.totalEstimated).toBe(120);
      expect(analytics.totalSpent).toBe(80);
      expect(analytics.completionRate).toBeCloseTo(0.67, 2);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid task data', async () => {
      const invalidTask = {
        // Missing required title
        status: 'todo'
      };

      await expect(api.createTask(invalidTask))
        .rejects.toThrow();
    });

    test('should handle missing task files', async () => {
      const nonExistentPath = path.join(testVault, 'non-existent-task.md');

      await expect(api.updateTask(nonExistentPath, { status: 'done' }))
        .rejects.toThrow();
    });

    test('should handle corrupted task files', async () => {
      // Create task with invalid frontmatter
      const taskPath = path.join(testVault, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks', 'corrupted-task.md');
      await fs.ensureDir(path.dirname(taskPath));
      await fs.writeFile(taskPath, 'Invalid frontmatter\n---\ncontent');

      await expect(api.updateTask(taskPath, { status: 'done' }))
        .rejects.toThrow();
    });
  });
});