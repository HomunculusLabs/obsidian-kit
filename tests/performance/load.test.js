const fs = require('fs-extra');
const path = require('path');
const UnifiedAPI = require('../../unified-api');
const PerformanceMonitor = require('../../performance-monitor');

describe('Performance and Load Tests', () => {
  let testVault;
  let api;
  let monitor;

  beforeEach(async () => {
    testVault = await createTestVault('performance-test');
    api = new UnifiedAPI(testVault);
    await api.initialize();
    monitor = new PerformanceMonitor();
    monitor.startMonitoring();
  });

  afterEach(async () => {
    if (monitor) {
      monitor.stopMonitoring();
    }
    await cleanupTestVault('performance-test');
  });

  describe('Task Creation Performance', () => {
    test('should handle bulk task creation efficiently', async () => {
      const taskCount = 100;
      const startTime = Date.now();

      // Create many tasks
      const tasks = [];
      for (let i = 0; i < taskCount; i++) {
        tasks.push({
          title: `Performance Test Task ${i}`,
          description: `Task number ${i} for performance testing`,
          priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
          tags: [`tag-${i % 10}`, 'performance-test']
        });
      }

      const results = await Promise.all(
        tasks.map(task => api.createTask(task))
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify all tasks were created
      expect(results.every(result => result.success)).toBe(true);

      // Performance assertion (should complete within reasonable time)
      expect(duration).toBeLessThan(10000); // 10 seconds for 100 tasks

      // Calculate average time per task
      const avgTimePerTask = duration / taskCount;
      console.log(`Average time per task: ${avgTimePerTask.toFixed(2)}ms`);
      expect(avgTimePerTask).toBeLessThan(100); // Less than 100ms per task

      // Verify system can handle the load
      const allTasks = await api.getAllTasks();
      expect(allTasks.length).toBe(taskCount);
    });

    test('should maintain performance with concurrent operations', async () => {
      const concurrentOperations = 50;
      const startTime = Date.now();

      // Perform concurrent task operations
      const operations = [];
      
      for (let i = 0; i < concurrentOperations; i++) {
        operations.push(api.createTask({
          title: `Concurrent Task ${i}`,
          description: `Task created concurrently`
        }));
      }

      const results = await Promise.all(operations);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success)).toBe(true);
      expect(duration).toBeLessThan(15000); // 15 seconds for 50 concurrent operations

      console.log(`Concurrent operations completed in ${duration}ms`);
    });
  });

  describe('Search Performance', () => {
    beforeEach(async () => {
      // Create a large dataset for search testing
      const taskCount = 200;
      const tasks = [];

      for (let i = 0; i < taskCount; i++) {
        tasks.push({
          title: `Search Test Task ${i}`,
          description: `Description for search testing with keywords: ${['frontend', 'backend', 'database', 'api', 'ui', 'ux', 'testing', 'deployment'][i % 8]}`,
          tags: [`tag-${i % 20}`, 'search-test', ['frontend', 'backend', 'database', 'api', 'ui', 'ux', 'testing', 'deployment'][i % 8]]
        });
      }

      await Promise.all(tasks.map(task => api.createTask(task)));
    });

    test('should perform searches quickly with large dataset', async () => {
      const searchQueries = ['frontend', 'backend', 'database', 'api', 'testing'];
      const searchTimes = [];

      for (const query of searchQueries) {
        const startTime = Date.now();
        const results = await api.searchTasks(query);
        const endTime = Date.now();
        
        searchTimes.push(endTime - startTime);
        expect(results.length).toBeGreaterThan(0);
      }

      const avgSearchTime = searchTimes.reduce((a, b) => a + b, 0) / searchTimes.length;
      console.log(`Average search time: ${avgSearchTime.toFixed(2)}ms`);
      expect(avgSearchTime).toBeLessThan(500); // Less than 500ms average search time
    });

    test('should handle complex searches efficiently', async () => {
      const complexQueries = [
        'frontend AND ui',
        'backend OR database',
        'testing AND deployment',
        'api NOT frontend'
      ];

      const searchTimes = [];
      
      for (const query of complexQueries) {
        const startTime = Date.now();
        const results = await api.searchTasks(query);
        const endTime = Date.now();
        
        searchTimes.push(endTime - startTime);
        console.log(`Complex query "${query}" returned ${results.length} results in ${endTime - startTime}ms`);
      }

      const maxSearchTime = Math.max(...searchTimes);
      expect(maxSearchTime).toBeLessThan(1000); // Less than 1 second for complex queries
    });
  });

  describe('Memory Usage', () => {
    test('should not leak memory during extended operations', async () => {
      const initialMemory = process.memoryUsage();
      const iterations = 10;
      const tasksPerIteration = 20;

      for (let iteration = 0; iteration < iterations; iteration++) {
        // Create tasks
        const tasks = [];
        for (let i = 0; i < tasksPerIteration; i++) {
          tasks.push({
            title: `Memory Test Task ${iteration}-${i}`,
            description: `Task for memory testing iteration ${iteration}`
          });
        }

        await Promise.all(tasks.map(task => api.createTask(task)));

        // Perform searches
        await api.searchTasks(`Memory Test ${iteration}`);

        // Update tasks
        const allTasks = await api.getAllTasks();
        for (const task of allTasks.slice(-tasksPerIteration)) {
          await api.updateTask(task.path, {
            time_spent: Math.floor(Math.random() * 60)
          });
        }

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

      console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);
      
      // Memory increase should be reasonable (less than 50MB for this test)
      expect(memoryIncreaseMB).toBeLessThan(50);
    });
  });

  describe('Stress Testing', () => {
    test('should handle high-frequency operations without degradation', async () => {
      const operationCount = 500;
      const operationTimes = [];
      let successfulOperations = 0;

      for (let i = 0; i < operationCount; i++) {
        const startTime = Date.now();
        
        try {
          // Mix of different operations
          if (i % 4 === 0) {
            await api.createTask({
              title: `Stress Test Task ${i}`,
              description: `High frequency operation ${i}`
            });
          } else if (i % 4 === 1) {
            await api.searchTasks(`Stress Test ${i % 10}`);
          } else if (i % 4 === 2) {
            const tasks = await api.getAllTasks();
            if (tasks.length > 0) {
              const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
              await api.updateTask(randomTask.path, {
                time_spent: Math.floor(Math.random() * 120)
              });
            }
          } else {
            await api.getTaskAnalytics();
          }
          
          successfulOperations++;
        } catch (error) {
          console.error(`Operation ${i} failed:`, error.message);
        }

        const endTime = Date.now();
        operationTimes.push(endTime - startTime);
      }

      const successRate = (successfulOperations / operationCount) * 100;
      const avgOperationTime = operationTimes.reduce((a, b) => a + b, 0) / operationTimes.length;
      const maxOperationTime = Math.max(...operationTimes);

      console.log(`Success rate: ${successRate.toFixed(2)}%`);
      console.log(`Average operation time: ${avgOperationTime.toFixed(2)}ms`);
      console.log(`Max operation time: ${maxOperationTime}ms`);

      expect(successRate).toBeGreaterThan(95); // At least 95% success rate
      expect(avgOperationTime).toBeLessThan(200); // Average under 200ms
      expect(maxOperationTime).toBeLessThan(2000); // No operation over 2 seconds
    });

    test('should maintain responsiveness under load', async () => {
      // Create background load
      const backgroundLoad = [];
      for (let i = 0; i < 50; i++) {
        backgroundLoad.push(
          api.createTask({
            title: `Background Task ${i}`,
            description: 'Running in background'
          })
        );
      }

      // While background load is running, perform critical operations
      const criticalOperationPromises = [];
      
      for (let i = 0; i < 10; i++) {
        criticalOperationPromises.push(
          (async () => {
            const startTime = Date.now();
            await api.searchTasks(`Critical ${i}`);
            return Date.now() - startTime;
          })()
        );
      }

      // Wait for all operations to complete
      const [, ...criticalTimes] = await Promise.all([
        Promise.all(backgroundLoad),
        ...criticalOperationPromises
      ]);

      const avgCriticalTime = criticalTimes.reduce((a, b) => a + b, 0) / criticalTimes.length;
      
      console.log(`Critical operations average time: ${avgCriticalTime.toFixed(2)}ms`);
      expect(avgCriticalTime).toBeLessThan(1000); // Critical operations under 1 second
    });
  });

  describe('Resource Limits', () => {
    test('should handle large task content efficiently', async () => {
      const largeContent = 'x'.repeat(10000); // 10KB of content
      const startTime = Date.now();

      const result = await api.createTask({
        title: 'Large Content Task',
        description: largeContent,
        notes: largeContent
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(1000); // Should handle large content quickly

      // Verify content can be retrieved
      const task = await api.getTask(result.taskPath);
      expect(task.description.length).toBe(10000);
    });

    test('should handle many small tasks efficiently', async () => {
      const taskCount = 1000;
      const startTime = Date.now();

      const tasks = [];
      for (let i = 0; i < taskCount; i++) {
        tasks.push({
          title: `Small Task ${i}`,
          description: `Small description ${i}`
        });
      }

      await Promise.all(tasks.map(task => api.createTask(task)));

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Created ${taskCount} small tasks in ${duration}ms`);
      expect(duration).toBeLessThan(30000); // Should complete within 30 seconds

      // Verify all tasks are accessible
      const allTasks = await api.getAllTasks();
      expect(allTasks.length).toBe(taskCount);
    });
  });
});