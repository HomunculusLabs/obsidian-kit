const fs = require('fs-extra');
const path = require('path');

// Global test setup
beforeAll(async () => {
  // Create test fixtures directory if it doesn't exist
  const fixturesDir = path.join(__dirname, 'fixtures');
  await fs.ensureDir(fixturesDir);
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.OBSIDIAN_KIT_TEST_MODE = 'true';
});

afterAll(async () => {
  // Cleanup test environment
  delete process.env.NODE_ENV;
  delete process.env.OBSIDIAN_KIT_TEST_MODE;
});

// Helper function to create temporary test directories
global.createTestVault = async (vaultName) => {
  const testVaultPath = path.join(__dirname, 'fixtures', vaultName);
  await fs.ensureDir(testVaultPath);
  
  // Create complete vault structure
  const basicStructure = [
    '4 - Projects',
    '3 - Templates',
    '.specify/memory',
    '.specify/specs',
    '.specify/workflows',
    'agents'
  ];
  
  for (const dir of basicStructure) {
    await fs.ensureDir(path.join(testVaultPath, dir));
  }
  
  // Create essential configuration files
  const mcpConfig = {
    server: {
      env: { OBSIDIAN_VAULT_NAME: vaultName }
    },
    claude_config_template: {
      mcpServers: {
        obsidian: {
          env: { OBSIDIAN_VAULT_NAME: vaultName }
        }
      }
    }
  };
  
  await fs.writeJson(path.join(testVaultPath, 'mcp-config.json'), mcpConfig, { spaces: 2 });
  
  // Create basic constitution file
  const constitution = `# ${vaultName} Constitution

## Vision
${vaultName} - Test vault for unit testing

## Created
${new Date().toISOString().split('T')[0]}
`;
  
  await fs.writeFile(path.join(testVaultPath, '.specify/memory/constitution.md'), constitution);
  
  return testVaultPath;
};

// Helper function to cleanup test vaults
global.cleanupTestVault = async (vaultName) => {
  const testVaultPath = path.join(__dirname, 'fixtures', vaultName);
  if (await fs.pathExists(testVaultPath)) {
    await fs.remove(testVaultPath);
  }
};

// Helper function to create test task files
global.createTestTask = async (vaultPath, taskData) => {
  const tasksDir = path.join(vaultPath, '4 - Projects', 'Obsidian-Kit-Dev', 'Tasks');
  await fs.ensureDir(tasksDir);
  
  const taskFileName = `${taskData.title.replace(/\s+/g, '-')}.md`;
  const taskPath = path.join(tasksDir, taskFileName);
  
  const taskContent = `---
title: "${taskData.title}"
status: "${taskData.status || 'todo'}"
priority: "${taskData.priority || 'medium'}"
project: "[[Obsidian-Kit-Dev]]"
assignee: "${taskData.assignee || 'Test User'}"
due_date: "${taskData.due_date || new Date().toISOString().split('T')[0]}"
created_date: "${new Date().toISOString().split('T')[0]}"
time_estimate: ${taskData.time_estimate || 30}
time_spent: ${taskData.time_spent || 0}
dependencies: ${JSON.stringify(taskData.dependencies || [])}
subtasks: ${JSON.stringify(taskData.subtasks || [])}
tags:
${taskData.tags ? taskData.tags.map(tag => `  - ${tag}`).join('\n') : '  - task'}
---

# ${taskData.title}

${taskData.description || 'Test task description'}

## Acceptance Criteria
${taskData.acceptanceCriteria ? taskData.acceptanceCriteria.map(criteria => `- [ ] ${criteria}`).join('\n') : '- [ ] Task completed successfully'}

## Notes
${taskData.notes || 'Created during testing.'}
`;
  
  await fs.writeFile(taskPath, taskContent);
  return taskPath;
};