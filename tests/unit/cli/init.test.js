const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

// Mock inquirer to prevent interactive prompts
jest.mock('inquirer');

describe('CLI Init Command', () => {
  let testDir;
  let originalCwd;
  let initCommand;

  beforeEach(async () => {
    testDir = await createTestVault('init-test');
    originalCwd = process.cwd();
    
    // Mock inquirer prompts
    inquirer.prompt = jest.fn();
    
    // Import after setting up mocks
    initCommand = require('../../../cli/commands/init');
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestVault('init-test');
    
    // Reset module cache
    delete require.cache[require.resolve('../../../cli/commands/init')];
  });

  describe('Project Initialization', () => {
    test('should create a new project vault with basic structure', async () => {
      const projectName = 'test-project';
      const targetDir = path.join(testDir, projectName);

      await initCommand(projectName, { dir: testDir });

      // Verify directory was created
      expect(await fs.pathExists(targetDir)).toBe(true);

      // Verify basic structure
      const expectedPaths = [
        '4 - Projects',
        '3 - Templates',
        '.specify/memory',
        '.specify/specs',
        '.specify/workflows',
        'agents',
        'mcp-config.json'
      ];

      for (const expectedPath of expectedPaths) {
        const fullPath = path.join(targetDir, expectedPath);
        expect(await fs.pathExists(fullPath)).toBe(true);
      }
    });

    test('should update project-specific files with project name', async () => {
      const projectName = 'my-awesome-project';
      const targetDir = path.join(testDir, projectName);

      await initCommand(projectName, { dir: testDir });

      // Check constitution file
      const constitutionPath = path.join(targetDir, '.specify/memory/constitution.md');
      const constitutionContent = await fs.readFile(constitutionPath, 'utf8');
      expect(constitutionContent).toContain(projectName);

      // Check MCP config
      const mcpConfigPath = path.join(targetDir, 'mcp-config.json');
      const mcpConfig = await fs.readJson(mcpConfigPath);
      expect(mcpConfig.server.env.OBSIDIAN_VAULT_NAME).toBe(projectName);
      expect(mcpConfig.claude_config_template.mcpServers.obsidian.env.OBSIDIAN_VAULT_NAME).toBe(projectName);
    });

    test('should handle existing directory with force option', async () => {
      const projectName = 'existing-project';
      const targetDir = path.join(testDir, projectName);

      // Create existing directory with content
      await fs.ensureDir(targetDir);
      await fs.writeFile(path.join(targetDir, 'existing-file.txt'), 'test content');

      await initCommand(projectName, { dir: testDir, force: true });

      // Verify vault structure was created
      expect(await fs.pathExists(path.join(targetDir, '4 - Projects'))).toBe(true);
      expect(await fs.pathExists(path.join(targetDir, 'existing-file.txt'))).toBe(true);
    });

    test('should validate project name format', async () => {
      // This test would need to mock inquirer to test validation
      // For now, we'll test the function directly with valid names
      const validNames = ['test-project', 'test_project', 'test123', 'Test Project'];
      
      for (const name of validNames) {
        const targetDir = path.join(testDir, name);
        await initCommand(name, { dir: testDir });
        expect(await fs.pathExists(targetDir)).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle file system errors gracefully', async () => {
      // Test with invalid path (should fail gracefully)
      const invalidPath = '/invalid/path/that/does/not/exist';
      
      // Mock process.exit to prevent test from exiting
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      
      try {
        await initCommand('test', { dir: invalidPath });
      } catch (error) {
        // Expected to throw
      }
      
      expect(mockExit).toHaveBeenCalledWith(1);
      mockExit.mockRestore();
    });
  });

  describe('Template Copying', () => {
    test('should copy all template files correctly', async () => {
      const projectName = 'template-test';
      const targetDir = path.join(testDir, projectName);

      await initCommand(projectName, { dir: testDir });

      // Verify key template files exist
      const templateFiles = [
        '.obsidian/core-plugins.json',
        '.obsidian/community-plugins.json',
        '.obsidian/appearance.json',
        '3 - Templates/Project Management/project.md',
        '3 - Templates/Tasks/Task.md',
        '4 - Projects/Project Management Dashboard.md',
        '4 - Projects/Tasks.base'
      ];

      for (const file of templateFiles) {
        const filePath = path.join(targetDir, file);
        expect(await fs.pathExists(filePath)).toBe(true);
      }
    });
  });
});