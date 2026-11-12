const fs = require('fs-extra');
const path = require('path');
const IntegrationHub = require('../../../src/core/integration-hub');

describe('IntegrationHub', () => {
  let testVault;
  let hub;

  beforeEach(async () => {
    testVault = await createTestVault('integration-hub-test');
    hub = new IntegrationHub(testVault);
  });

  afterEach(async () => {
    if (hub && hub.isInitialized) {
      await hub.shutdown();
    }
    await cleanupTestVault('integration-hub-test');
  });

  describe('Initialization', () => {
    test('should initialize successfully with valid vault', async () => {
      await expect(hub.initialize()).resolves.not.toThrow();
      expect(hub.isInitialized).toBe(true);
    });

    test('should validate vault structure during initialization', async () => {
      // Remove required directory
      await fs.remove(path.join(testVault, '.specify'));
      
      await expect(hub.initialize()).rejects.toThrow();
    });

    test('should initialize components in correct order', async () => {
      const initOrder = [];
      
      // Mock component initialization methods to track order
      const originalMethods = {
        initializeCLI: hub.initializeCLI.bind(hub),
        initializeTaskManagement: hub.initializeTaskManagement.bind(hub),
        initializeKnowledgeGraph: hub.initializeKnowledgeGraph.bind(hub),
        initializeSemanticSearch: hub.initializeSemanticSearch.bind(hub),
        initializeWorkflowEngine: hub.initializeWorkflowEngine.bind(hub),
        initializeAgentManager: hub.initializeAgentManager.bind(hub),
        initializeMCPServer: hub.initializeMCPServer.bind(hub)
      };

      hub.initializeCLI = async () => {
        initOrder.push('CLI');
        return originalMethods.initializeCLI();
      };
      hub.initializeTaskManagement = async () => {
        initOrder.push('TaskManagement');
        return originalMethods.initializeTaskManagement();
      };
      hub.initializeKnowledgeGraph = async () => {
        initOrder.push('KnowledgeGraph');
        return originalMethods.initializeKnowledgeGraph();
      };
      hub.initializeSemanticSearch = async () => {
        initOrder.push('SemanticSearch');
        return originalMethods.initializeSemanticSearch();
      };
      hub.initializeWorkflowEngine = async () => {
        initOrder.push('WorkflowEngine');
        return originalMethods.initializeWorkflowEngine();
      };
      hub.initializeAgentManager = async () => {
        initOrder.push('AgentManager');
        return originalMethods.initializeAgentManager();
      };
      hub.initializeMCPServer = async () => {
        initOrder.push('MCPServer');
        return originalMethods.initializeMCPServer();
      };

      await hub.initialize();

      expect(initOrder).toEqual([
        'CLI',
        'TaskManagement',
        'KnowledgeGraph',
        'SemanticSearch',
        'WorkflowEngine',
        'AgentManager',
        'MCPServer'
      ]);
    });
  });

  describe('Event System', () => {
    beforeEach(async () => {
      await hub.initialize();
    });

    test('should emit and receive events', async () => {
      let eventReceived = false;
      let eventData = null;

      hub.on('test:event', (data) => {
        eventReceived = true;
        eventData = data;
      });

      hub.emit('test:event', { test: 'data' });

      expect(eventReceived).toBe(true);
      expect(eventData).toEqual({ test: 'data' });
    });

    test('should handle multiple listeners', async () => {
      const results = [];

      hub.on('test:multi', () => results.push('listener1'));
      hub.on('test:multi', () => results.push('listener2'));
      hub.on('test:multi', () => results.push('listener3'));

      hub.emit('test:multi');

      expect(results).toEqual(['listener1', 'listener2', 'listener3']);
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(async () => {
      await hub.initialize();
    });

    test('should provide component status', () => {
      const status = hub.getComponentStatus();

      expect(status).toHaveProperty('components');
      expect(status.components).toHaveProperty('cli');
      expect(status.components).toHaveProperty('knowledgeGraph');
      expect(status.components).toHaveProperty('semanticSearch');
    });

    test('should provide overall health status', () => {
      const health = hub.getHealthStatus();

      expect(health).toHaveProperty('overall');
      expect(health).toHaveProperty('components');
      expect(health).toHaveProperty('lastCheck');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.overall);
    });

    test('should detect component failures', async () => {
      // Simulate component failure
      hub.components.cli = { status: 'error', error: 'Test error' };

      const health = hub.getHealthStatus();

      expect(health.overall).toBe('degraded');
      expect(health.components.cli.status).toBe('error');
    });
  });

  describe('Component Communication', () => {
    beforeEach(async () => {
      await hub.initialize();
    });

    test('should setup inter-component communication', async () => {
      // Test that components can communicate through the hub
      let communicationReceived = false;

      hub.on('task:created', () => {
        communicationReceived = true;
      });

      // Simulate task creation
      hub.emit('task:created', { title: 'Test Task' });

      expect(communicationReceived).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle initialization errors gracefully', async () => {
      // Create invalid vault
      const invalidVault = path.join(__dirname, '../../fixtures/invalid-vault');
      await fs.ensureDir(invalidVault);

      const invalidHub = new IntegrationHub(invalidVault);

      await expect(invalidHub.initialize()).rejects.toThrow();

      await fs.remove(invalidVault);
    });

    test('should handle component initialization failures', async () => {
      // Mock a component to fail initialization
      const originalInit = hub.initializeCLI;
      hub.initializeCLI = async () => {
        throw new Error('Component initialization failed');
      };

      await expect(hub.initialize()).rejects.toThrow('Component initialization failed');
      expect(hub.isInitialized).toBe(false);
    });
  });

  describe('Shutdown', () => {
    test('should shutdown cleanly', async () => {
      await hub.initialize();
      expect(hub.isInitialized).toBe(true);

      await hub.shutdown();
      expect(hub.isInitialized).toBe(false);
    });

    test('should handle shutdown when not initialized', async () => {
      await expect(hub.shutdown()).resolves.not.toThrow();
    });
  });
});