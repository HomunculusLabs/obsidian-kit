const fs = require('fs-extra');
const path = require('path');

// Mock process.exit to prevent tests from exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('CLI Status Command', () => {
  let testVault;
  let originalCwd;
  let statusCommand;

  beforeEach(async () => {
    testVault = await createTestVault('status-test');
    originalCwd = process.cwd();
    process.chdir(testVault);
    
    // Clear mock calls
    mockExit.mockClear();
    
    // Import after setting up test environment
    statusCommand = require('../../../cli/commands/status');
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestVault('status-test');
    
    // Reset module cache
    delete require.cache[require.resolve('../../../cli/commands/status')];
  });

  describe('Vault Status Reporting', () => {
    test('should report basic vault structure', async () => {
      // Create some test content
      await createTestTask(testVault, {
        title: 'Test Task',
        status: 'todo',
        priority: 'high'
      });

      // Mock console.log to capture output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await statusCommand({ verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('📊 Obsidian Kit Vault Status')
      );

      consoleSpy.mockRestore();
    });

    test('should detect missing components', async () => {
      // Remove a required component
      await fs.remove(path.join(testVault, 'agents'));

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await statusCommand({ verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌')
      );

      consoleSpy.mockRestore();
    });

    test('should count tasks and projects', async () => {
      // Create multiple test tasks
      await createTestTask(testVault, { title: 'Task 1', status: 'todo' });
      await createTestTask(testVault, { title: 'Task 2', status: 'in-progress' });
      await createTestTask(testVault, { title: 'Task 3', status: 'done' });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await statusCommand({ verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Tasks:')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Component Health Checks', () => {
    test('should check MCP configuration', async () => {
      const mcpConfig = {
        server: {
          env: { OBSIDIAN_VAULT_NAME: 'test-vault' }
        },
        claude_config_template: {
          mcpServers: {
            obsidian: {
              env: { OBSIDIAN_VAULT_NAME: 'test-vault' }
            }
          }
        }
      };

      await fs.writeJson(path.join(testVault, 'mcp-config.json'), mcpConfig);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await statusCommand({ verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅')
      );

      consoleSpy.mockRestore();
    });

    test('should validate agent configurations', async () => {
      const agentConfig = `---
name: "Test Agent"
version: "1.0.0"
description: "Test agent for unit testing"
---

# Test Agent Configuration
`;

      await fs.writeFile(path.join(testVault, 'agents', 'test-agent.md'), agentConfig);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await statusCommand({ verbose: false });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Agents:')
      );

      consoleSpy.mockRestore();
    });
  });
});