# 🔧 Obsidian Kit API Reference

This comprehensive API reference covers all CLI commands, configuration options, and integration points for Obsidian Kit.

## 📋 Table of Contents

1. [CLI Commands API](#cli-commands-api)
2. [Configuration Files](#configuration-files)
3. [MCP Server API](#mcp-server-api)
4. [Agent Integration API](#agent-integration-api)
5. [Task Management API](#task-management-api)
6. [Workflow API](#workflow-api)
7. [Event System](#event-system)
8. [Extension Points](#extension-points)

---

## 🚀 CLI Commands API

### Project Commands

#### `obsidian-kit init`

Initialize a new project vault with complete structure.

**Signature:**
```bash
obsidian-kit init [project-name] [options]
```

**Parameters:**
- `project-name` (string, optional): Name of the project
- `-d, --dir <directory>` (string): Target directory path
- `-f, --force` (boolean): Force initialization in non-empty directory

**Returns:**
- `0`: Success
- `1`: Error (directory exists without --force)
- `2`: Permission error
- `3`: Invalid directory path

**Example:**
```bash
obsidian-kit init my-project --dir ~/projects --force
```

#### `obsidian-kit status`

Display vault health and system status.

**Signature:**
```bash
obsidian-kit status [options]
```

**Parameters:**
- `-v, --verbose` (boolean): Show detailed information

**Returns:**
- JSON object with status information
- Exit codes: 0 (healthy), 1 (warnings), 2 (errors)

**Status Object Structure:**
```json
{
  "vault": {
    "name": "string",
    "path": "string",
    "health": "healthy|warning|error"
  },
  "mcp": {
    "connected": boolean,
    "port": number,
    "api_key_configured": boolean
  },
  "agents": [
    {
      "name": "string",
      "type": "string",
      "configured": boolean,
      "last_sync": "string"
    }
  ],
  "tasks": {
    "total": number,
    "completed": number,
    "in_progress": number,
    "overdue": number
  },
  "plugins": {
    "required": ["string"],
    "installed": ["string"],
    "missing": ["string"]
  }
}
```

### Agent Commands

#### `obsidian-kit agent`

Manage AI agent configurations.

**Subcommands:**

##### `agent add [tool]`

Configure AI tool integration.

**Signature:**
```bash
obsidian-kit agent add [tool] [options]
```

**Parameters:**
- `tool` (string): AI tool type (claude-code, opencode, cursor, copilot)

**Supported Tools:**
- `claude-code`: Claude Desktop integration
- `opencode`: VS Code/OpenCode integration
- `cursor`: Cursor AI integration
- `copilot`: GitHub Copilot integration

**Returns:**
- `0`: Successfully configured
- `1`: Invalid tool type
- `2`: Configuration error

##### `agent list`

Show configured agents.

**Signature:**
```bash
obsidian-kit agent list [options]
```

**Parameters:**
- `-v, --verbose` (boolean): Show detailed agent information

**Returns:**
- Array of agent objects with configuration details

##### `agent sync`

Update agent configurations.

**Signature:**
```bash
obsidian-kit agent sync [options]
```

**Returns:**
- `0`: Sync successful
- `1`: Sync failed

##### `agent configure [tool]`

Edit agent settings.

**Signature:**
```bash
obsidian-kit agent configure [tool] [options]
```

**Parameters:**
- `tool` (string): AI tool to configure

**Interactive Configuration:**
The command opens an interactive editor for agent configuration.

### Workflow Commands

#### `obsidian-kit workflow`

Execute spec-driven development workflows.

**Signature:**
```bash
obsidian-kit workflow [phase] [options]
```

**Parameters:**
- `phase` (string): Workflow phase
- `-i, --interactive` (boolean): Interactive mode

**Workflow Phases:**

##### `constitution`

Create project constitution and decision framework.

**Generated Files:**
- `.specify/memory/constitution.md`
- `.specify/memory/decisions.md`

##### `planning`

Project planning and requirements gathering.

**Generated Files:**
- `.specify/specs/requirements.md`
- `.specify/specs/architecture.md`

##### `development`

Development workflow execution.

**Features:**
- Task generation from specifications
- Automated breakdown
- Progress tracking

##### `documentation`

Documentation workflow.

**Features:**
- Auto-generate API docs
- Update user guides
- Create changelogs

### Task Management Commands

#### `obsidian-kit breakdown`

AI-powered task breakdown and estimation.

**Signature:**
```bash
obsidian-kit breakdown [task-description] [options]
```

**Parameters:**
- `task-description` (string): Task to break down
- `-d, --dry-run` (boolean): Preview without creating
- `-s, --subtasks <count>` (number): Number of subtasks

**Returns:**
- Task breakdown object with subtasks and estimates

**Breakdown Structure:**
```json
{
  "original_task": "string",
  "subtasks": [
    {
      "title": "string",
      "description": "string",
      "estimated_time": number,
      "priority": "string",
      "dependencies": ["string"]
    }
  ],
  "total_estimated_time": number,
  "complexity": "low|medium|high"
}
```

#### `obsidian-kit validate`

Validate task quality and completeness.

**Signature:**
```bash
obsidian-kit validate [task-file] [options]
```

**Parameters:**
- `task-file` (string): Path to task file
- `-a, --all` (boolean): Validate all tasks

**Validation Checks:**
- Frontmatter completeness
- Acceptance criteria clarity
- Time estimate reasonableness
- Dependency consistency
- Tag compliance

**Returns:**
```json
{
  "valid": boolean,
  "errors": ["string"],
  "warnings": ["string"],
  "suggestions": ["string"]
}
```

#### `obsidian-kit generate-tasks`

Generate tasks automatically from various sources.

**Signature:**
```bash
obsidian-kit generate-tasks [options]
```

**Parameters:**
- `-d, --dry-run` (boolean): Preview without creating

**Sources:**
- Project specifications
- Code changes (git diff)
- User stories
- Bug reports
- Meeting notes

**Generated Task Structure:**
```yaml
---
title: "Generated Task Title"
status: "todo"
priority: "medium"
project: "Auto-generated"
source: "specification|code|user-story|bug"
auto_generated: true
created_date: "YYYY-MM-DD"
time_estimate: 3600
tags:
  - task
  - auto-generated
---
```

### Integration Commands

#### `obsidian-kit add-mcp`

Configure Obsidian MCP server.

**Signature:**
```bash
obsidian-kit add-mcp [options]
```

**Parameters:**
- `-k, --api-key <key>` (string): Obsidian REST API key
- `-v, --vault-name <name>` (string): Vault name

**Configuration File:**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["path/to/mcp-server.js"],
      "env": {
        "OBSIDIAN_API_KEY": "your-api-key",
        "OBSIDIAN_VAULT_NAME": "your-vault-name",
        "OBSIDIAN_PORT": "27123"
      }
    }
  }
}
```

---

## 📁 Configuration Files

### Project Configuration

#### `mcp-config.json`

MCP server configuration for AI agent integration.

**Structure:**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["path/to/server.js"],
      "env": {
        "OBSIDIAN_API_KEY": "string",
        "OBSIDIAN_VAULT_NAME": "string",
        "OBSIDIAN_PORT": "number",
        "OBSIDIAN_URL": "string"
      }
    }
  },
  "settings": {
    "auto_sync": boolean,
    "sync_interval": number,
    "log_level": "debug|info|warn|error"
  }
}
```

#### `.specify/memory/constitution.md`

Project constitution and principles.

**Frontmatter:**
```yaml
---
title: "Project Constitution"
version: "1.0"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
status: "active"
tags:
  - constitution
  - governance
---
```

#### `.specify/specs/requirements.md`

Project requirements and specifications.

**Structure:**
```yaml
---
title: "Project Requirements"
version: "1.0"
status: "draft|review|approved"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
tags:
  - requirements
  - specification
---

## Functional Requirements
- User stories and features

## Non-Functional Requirements
- Performance, security, scalability

## Technical Requirements
- Technology stack, integrations
```

### Agent Configuration Files

#### `agents/claude-code.md`

Claude Code specific configuration.

**Structure:**
```markdown
# Claude Code Agent Configuration

## Model Settings
- Model: claude-3-sonnet
- Temperature: 0.7
- Max tokens: 4000

## Capabilities
- Complex reasoning
- Long-form content
- Code analysis
- Documentation

## Context
- Project overview
- Team structure
- Current priorities
```

#### `agents/universal-context.md`

Shared context for all AI agents.

**Structure:**
```markdown
# Universal Context

## Project Overview
- Name, description, goals

## Team Structure
- Roles, responsibilities

## Development Standards
- Coding standards
- Review process
- Deployment workflow

## Current Priorities
- Active projects
- Deadlines
- Blockers
```

#### `agents/slash-commands.md`

Standardized commands for all AI agents.

**Command Definitions:**
```markdown
# Slash Commands

## /status
Check project status and health

## /tasks
Show current task list

## /help
Get assistance and guidance

## /research [topic]
Research specific topics

## /plan [objective]
Create project plans
```

---

## 🔌 MCP Server API

### Server Configuration

The MCP server provides file system access to AI agents through the Model Context Protocol.

**Endpoints:**

#### `list_files`

List files in directory.

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "list_files",
    "arguments": {
      "path": "string",
      "recursive": boolean
    }
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "file1.md\nfile2.md\ndirectory/"
    }
  ]
}
```

#### `read_file`

Read file contents.

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "string"
    }
  }
}
```

**Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "File contents here..."
    }
  ]
}
```

#### `write_file`

Write content to file.

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "write_file",
    "arguments": {
      "path": "string",
      "content": "string"
    }
  }
}
```

#### `search_files`

Search for files containing text.

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_files",
    "arguments": {
      "query": "string",
      "path": "string",
      "file_pattern": "string"
    }
  }
}
```

---

## 🤖 Agent Integration API

### Agent Interface

All AI agents implement a common interface for integration.

**Base Agent Class:**
```javascript
class BaseAgent {
  constructor(config) {
    this.config = config;
    this.context = new Context();
  }
  
  async initialize() {
    // Initialize agent
  }
  
  async processCommand(command, args) {
    // Process slash commands
  }
  
  async generateResponse(prompt, context) {
    // Generate AI response
  }
  
  async updateContext(newContext) {
    // Update agent context
  }
}
```

### Agent Types

#### ClaudeCodeAgent

```javascript
class ClaudeCodeAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.model = 'claude-3-sonnet';
    this.temperature = 0.7;
  }
  
  async processCommand(command, args) {
    switch (command) {
      case '/status':
        return this.getStatus();
      case '/tasks':
        return this.getTasks();
      case '/research':
        return this.research(args[0]);
      default:
        return this.generateResponse(command, args);
    }
  }
}
```

#### OpenCodeAgent

```javascript
class OpenCodeAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.vscode = new VSCodeAPI();
  }
  
  async integrateWithVSCode() {
    // VS Code specific integration
  }
}
```

---

## 📊 Task Management API

### Task Object Structure

```typescript
interface Task {
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project: string;
  assignee?: string;
  due_date?: string;
  created_date: string;
  completed_date?: string;
  time_estimate: number; // in seconds
  time_spent: number;
  dependencies: string[];
  subtasks: string[];
  tags: string[];
  acceptance_criteria?: string[];
}
```

### Task Manager API

```javascript
class TaskManager {
  async createTask(taskData) {
    // Create new task
  }
  
  async updateTask(taskId, updates) {
    // Update existing task
  }
  
  async deleteTask(taskId) {
    // Delete task
  }
  
  async getTasks(filters = {}) {
    // Get filtered tasks
  }
  
  async validateTask(task) {
    // Validate task quality
  }
  
  async breakdownTask(taskId, options = {}) {
    // AI-powered task breakdown
  }
}
```

### Dataview Integration

Tasks are automatically integrated with Obsidian's Dataview plugin.

**Query Examples:**

```dataview
TABLE 
  status as "Status",
  priority as "Priority",
  due_date as "Due Date"
FROM "4 - Projects"
WHERE status != "completed"
SORT priority DESC, due_date ASC
```

```dataview
LIST
FROM "4 - Projects"
WHERE contains(assignee, "John Doe")
AND due_date < date(today) + dur(7 days)
```

---

## 🔄 Workflow API

### Workflow Engine

```javascript
class WorkflowEngine {
  async executePhase(phase, options = {}) {
    switch (phase) {
      case 'constitution':
        return this.executeConstitutionPhase(options);
      case 'planning':
        return this.executePlanningPhase(options);
      case 'development':
        return this.executeDevelopmentPhase(options);
      case 'documentation':
        return this.executeDocumentationPhase(options);
    }
  }
  
  async executeConstitutionPhase(options) {
    // Create project constitution
  }
  
  async executePlanningPhase(options) {
    // Project planning and requirements
  }
  
  async executeDevelopmentPhase(options) {
    // Development workflow
  }
  
  async executeDocumentationPhase(options) {
    // Documentation generation
  }
}
```

### Workflow Configuration

```yaml
# .specify/workflows/development.md
---
name: "Development Workflow"
version: "1.0"
phases:
  - name: "constitution"
    description: "Create project constitution"
    required: true
  - name: "planning"
    description: "Project planning"
    depends_on: ["constitution"]
  - name: "development"
    description: "Implementation"
    depends_on: ["planning"]
  - name: "documentation"
    description: "Documentation"
    depends_on: ["development"]
---
```

---

## 📡 Event System

### Event Types

```javascript
// Task events
TASK_CREATED = 'task:created'
TASK_UPDATED = 'task:updated'
TASK_COMPLETED = 'task:completed'
TASK_DELETED = 'task:deleted'

// Project events
PROJECT_INITIALIZED = 'project:initialized'
PROJECT_HEALTH_CHECK = 'project:health_check'

// Agent events
AGENT_CONFIGURED = 'agent:configured'
AGENT_SYNCED = 'agent:synced'

// Workflow events
WORKFLOW_STARTED = 'workflow:started'
WORKFLOW_COMPLETED = 'workflow:completed'
```

### Event Listener API

```javascript
class EventEmitter {
  on(event, listener) {
    // Register event listener
  }
  
  emit(event, data) {
    // Emit event
  }
  
  off(event, listener) {
    // Remove event listener
  }
}

// Usage
eventEmitter.on('task:created', (task) => {
  console.log(`New task created: ${task.title}`);
});
```

---

## 🔧 Extension Points

### Custom Commands

Create custom CLI commands:

```javascript
// cli/commands/custom-command.js
module.exports = async function(args, options) {
  console.log('Custom command executed');
  // Your custom logic here
};
```

Register in `cli/bin/obsidian-kit`:

```javascript
const customCommand = require('../commands/custom-command');

program
  .command('custom')
  .description('Custom command description')
  .action(customCommand);
```

### Custom Agents

Create custom AI agents:

```javascript
// agents/custom-agent.js
class CustomAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.name = 'custom-agent';
  }
  
  async processCommand(command, args) {
    // Custom command processing
  }
}

module.exports = CustomAgent;
```

### Custom Workflows

Create custom workflow phases:

```javascript
// workflows/custom-workflow.js
class CustomWorkflow {
  async execute(options) {
    // Custom workflow logic
  }
}

module.exports = CustomWorkflow;
```

### Plugin System

```javascript
class PluginManager {
  async loadPlugin(pluginPath) {
    // Load plugin
  }
  
  async unloadPlugin(pluginName) {
    // Unload plugin
  }
  
  async executeHook(hookName, data) {
    // Execute plugin hooks
  }
}
```

---

## 📝 Error Handling

### Error Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Permission error |
| 4 | Network error |
| 5 | Validation error |

### Error Objects

```javascript
class ObsidianKitError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ObsidianKitError';
    this.code = code;
    this.details = details;
  }
}
```

### Error Handling Patterns

```javascript
try {
  await obsidianKit.init('my-project');
} catch (error) {
  if (error.code === 3) {
    console.error('Permission denied. Check directory permissions.');
  } else {
    console.error('Initialization failed:', error.message);
  }
}
```

---

## 🔍 Debugging

### Debug Mode

Enable debug logging:

```bash
DEBUG=obsidian-kit:* obsidian-kit init test-project
```

### Log Levels

- `error`: Error messages only
- `warn`: Warnings and errors
- `info`: General information
- `debug`: Detailed debugging

### Log Files

Logs are stored in:
- `~/.obsidian-kit/logs/obsidian-kit.log`
- `~/.obsidian-kit/logs/error.log`

---

## 📚 Examples

### Complete Workflow Example

```bash
# 1. Initialize project
obsidian-kit init my-awesome-project
cd my-awesome-project

# 2. Configure AI agent
obsidian-kit agent add claude-code

# 3. Set up MCP
obsidian-kit add-mcp --api-key abc123 --vault-name my-awesome-project

# 4. Start constitution phase
obsidian-kit workflow constitution

# 5. Generate tasks from specs
obsidian-kit generate-tasks

# 6. Break down complex task
obsidian-kit breakdown "Implement user authentication" --subtasks 5

# 7. Validate all tasks
obsidian-kit validate --all

# 8. Check status
obsidian-kit status --verbose
```

### API Usage Example

```javascript
const ObsidianKit = require('obsidian-kit');

const kit = new ObsidianKit();

// Initialize project
await kit.init('my-project', { force: true });

// Configure agent
await kit.addAgent('claude-code');

// Generate tasks
const tasks = await kit.generateTasks({ dryRun: false });

// Validate tasks
const validation = await kit.validateTasks();

// Get status
const status = await kit.getStatus({ verbose: true });
```

---

*This API reference covers all public interfaces. For internal implementation details, see the source code.*