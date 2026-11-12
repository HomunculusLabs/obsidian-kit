const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

describe('CLI Integration Tests', () => {
  const testDir = path.join(__dirname, '..', 'fixtures', 'cli-test');
  const cliPath = path.join(__dirname, '..', '..', 'cli', 'bin', 'obsidian-kit');
  
  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });
  
  afterEach(async () => {
    await fs.remove(testDir);
  });
  
  describe('obsidian-kit --help', () => {
    it('should display help information', () => {
      const output = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });
      expect(output).toContain('Usage:');
      expect(output).toContain('Commands:');
      expect(output).toContain('Options:');
    });
  });
  
  describe('obsidian-kit --version', () => {
    it('should display version information', () => {
      const output = execSync(`node ${cliPath} --version`, { encoding: 'utf8' });
      expect(output).toMatch(/\d+\.\d+\.\d+/);
    });
  });
  
  describe('obsidian-kit init', () => {
    it('should initialize a new project vault', () => {
      const projectName = 'test-project';
      execSync(`node ${cliPath} init ${projectName}`, { encoding: 'utf8' });
      
      // Check if project directory was created
      expect(fs.existsSync(path.join(testDir, projectName))).toBe(true);
      
      // Check if essential files exist
      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(path.join(projectPath, '4 - Projects'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '3 - Templates'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'agents'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '.specify'))).toBe(true);
    });
    
    it('should create task database', () => {
      const projectName = 'test-project-tasks';
      execSync(`node ${cliPath} init ${projectName}`, { encoding: 'utf8' });
      
      const projectPath = path.join(testDir, projectName);
      const tasksBase = path.join(projectPath, '4 - Projects', 'Tasks.base');
      expect(fs.existsSync(tasksBase)).toBe(true);
    });
    
    it('should create agent configurations', () => {
      const projectName = 'test-project-agents';
      execSync(`node ${cliPath} init ${projectName}`, { encoding: 'utf8' });
      
      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(path.join(projectPath, 'agents', 'universal-context.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'agents', 'claude-code.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'agents', 'opencode.md'))).toBe(true);
    });
  });
  
  describe('obsidian-kit status', () => {
    beforeEach(() => {
      // Initialize a project for status testing
      execSync(`node ${cliPath} init status-test`, { encoding: 'utf8' });
      process.chdir(path.join(testDir, 'status-test'));
    });
    
    it('should display vault status', () => {
      const output = execSync(`node ${cliPath} status`, { encoding: 'utf8' });
      expect(output).toContain('Vault Status');
    });
  });
  
  describe('Error handling', () => {
    it('should handle invalid commands gracefully', () => {
      try {
        execSync(`node ${cliPath} invalid-command`, { encoding: 'utf8' });
      } catch (error) {
        expect(error.status).toBe(1);
        expect(error.stdout).toContain('error');
      }
    });
    
    it('should handle missing project directory', () => {
      try {
        execSync(`node ${cliPath} status`, { encoding: 'utf8' });
      } catch (error) {
        expect(error.status).toBe(1);
      }
    });
  });
});