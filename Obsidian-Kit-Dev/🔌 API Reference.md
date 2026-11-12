---
title: "🔌 API Reference"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["api", "reference", "technical", "developers"]
---

# 🔌 Obsidian Kit API Reference

Complete technical documentation for Obsidian Kit's APIs, CLI commands, and integration points.

## 📋 Table of Contents

1. [CLI Commands API](#cli-commands-api)
2. [Configuration Files](#configuration-files)
3. [MCP Server API](#mcp-server-api)
4. [Agent Integration API](#agent-integration-api)
5. [Task Management API](#task-management-api)
6. [Workflow API](#workflow-api)
7. [Knowledge Graph API](#knowledge-graph-api)
8. [Semantic Search API](#semantic-search-api)
9. [Event System](#event-system)
10. [Extension Points](#extension-points)

---

## 🚀 CLI Commands API

### Project Management Commands

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
- `-t, --template <template>` (string): Template to use

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
- `-j, --json` (boolean): Output as JSON
- `-s, --section <section>` (string): Specific section to check

**Returns:**
- JSON object with status information
- Exit codes: 0 (healthy), 1 (warnings), 2 (errors)

**Status Object Structure:**
```json
{
  "vault": {
    "name": "string",
    "path": "string",
    "health": "healthy|warning|error",
    "last_scan": "2025-10-02T10:00:00Z"
  },
  "mcp": {
    "connected": boolean,
    "port": number,
    "api_key_configured": boolean,
    "last_check": "2025-10-02T10:00:00Z"
  },
  "agents": [
    {
      "name": "string",
      "type": "string",
      "configured": boolean,
      "last_sync": "2025-10-02T10:00:00Z",
      "status": "active|inactive|error"
    }
  ],
  "tasks": {
    "total": number,
    "completed": number,
    "in_progress": number,
    "overdue": number,
    "completion_rate": number
  },
  "plugins": {
    "required": ["string"],
    "installed": ["string"],
    "missing": ["string"],
    "outdated": ["string"]
  },
  "health": {
    "score": number,
    "issues": ["string"],
    "recommendations": ["string"]
  }
}
```

### AI Agent Commands

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
- `-c, --config <config>` (string): Custom configuration file
- `-f, --force` (boolean): Overwrite existing configuration

**Supported Tools:**
- `claude-code`: Claude Desktop integration
- `opencode`: VS Code/OpenCode integration
- `cursor`: Cursor AI integration
- `copilot`: GitHub Copilot integration

**Returns:**
- `0`: Successfully configured
- `1`: Invalid tool type
- `2`: Configuration error
- `3`: File permission error

##### `agent list`

Show configured agents.

**Signature:**
```bash
obsidian-kit agent list [options]
```

**Parameters:**
- `-v, --verbose` (boolean): Show detailed agent information
- `-j, --json` (boolean): Output as JSON
- `-t, --type <type>` (string): Filter by agent type

**Returns:**
- Array of agent objects with configuration details

##### `agent sync`

Update agent configurations with latest settings.

**Signature:**
```bash
obsidian-kit agent sync [options]
```

**Parameters:**
- `-a, --all` (boolean): Sync all agents
- `-t, --type <type>` (string): Sync specific agent type
- `-f, --force` (boolean): Force sync even if up-to-date

**Returns:**
- `0`: Sync successful
- `1`: Sync failed
- `2`: No changes needed

##### `agent configure [tool]`

Edit agent settings interactively.

**Signature:**
```bash
obsidian-kit agent configure [tool] [options]
```

**Parameters:**
- `tool` (string): AI tool to configure
- `-e, --editor <editor>` (string): Editor to use
- `-r, --reset` (boolean): Reset to default configuration

### Workflow Commands

#### `obsidian-kit workflow`

Execute spec-driven development workflows.

**Signature:**
```bash
obsidian-kit workflow [phase] [options]
```

**Parameters:**
- `phase` (string): Workflow phase
- `-i, --interactive` (boolean): Interactive mode with prompts
- `-d, --dry-run` (boolean): Preview without executing
- `-o, --output <format>` (string): Output format (markdown, json)

**Workflow Phases:**

##### `constitution`

Create project constitution and decision framework.

**Generated Files:**
- `.specify/memory/constitution.md`
- `.specify/memory/decisions.md`

**Configuration:**
```yaml
constitution:
  include_sections:
    - mission_vision
    - core_values
    - decision_framework
    - team_agreements
  template: "standard"
  interactive: true
```

##### `planning`

Project planning and requirements gathering.

**Generated Files:**
- `.specify/specs/requirements.md`
- `.specify/specs/architecture.md`

**Configuration:**
```yaml
planning:
  requirements_types:
    - functional
    - non_functional
    - technical
    - business
  architecture_views:
    - system
    - component
    - deployment
  stakeholders: ["product", "engineering", "design"]
```

##### `development`

Development workflow execution.

**Features:**
- Task generation from specifications
- Automated breakdown
- Progress tracking
- Quality checks

**Configuration:**
```yaml
development:
  task_generation:
    enabled: true
    source: "specifications"
    breakdown_depth: 3
  quality_checks:
    enabled: true
    types: ["validation", "linting", "testing"]
  progress_tracking:
    enabled: true
    metrics: ["completion", "velocity", "quality"]
```

##### `documentation`

Documentation workflow.

**Features:**
- Auto-generate API docs
- Update user guides
- Create changelogs

**Configuration:**
```yaml
documentation:
  auto_generate:
    api_docs: true
    user_guides: true
    changelogs: true
  sources:
    - code_comments
    - specifications
    - commit_messages
  output_formats: ["markdown", "html"]
```

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
- `-e, --effort <level>` (string): Effort level (low, medium, high)
- `-o, --output <format>` (string): Output format (markdown, json)

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
      "dependencies": ["string"],
      "acceptance_criteria": ["string"],
      "complexity": "low|medium|high"
    }
  ],
  "total_estimated_time": number,
  "complexity": "low|medium|high",
  "confidence": number,
  "recommendations": ["string"]
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
- `-r, --rules <rules>` (string): Validation rules to apply
- `-o, --output <format>` (string): Output format (text, json)

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
  "errors": [
    {
      "type": "string",
      "message": "string",
      "severity": "error|warning|info"
    }
  ],
  "warnings": ["string"],
  "suggestions": ["string"],
  "score": number,
  "metadata": {
    "validated_at": "2025-10-02T10:00:00Z",
    "rules_applied": ["string"]
  }
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
- `-s, --source <source>` (string): Source type
- `-f, --filter <filter>` (string): Filter criteria
- `-l, --limit <count>` (number): Maximum tasks to generate

**Sources:**
- `specification`: Project specifications
- `code`: Code changes (git diff)
- `user-story`: User stories and features
- `bug`: Bug reports and issues
- `meeting`: Meeting notes and action items

**Generated Task Structure:**
```yaml
---
title: "Generated Task Title"
status: "todo"
priority: "medium"
project: "Auto-generated"
source: "specification|code|user-story|bug"
auto_generated: true
created_date: "2025-10-02"
time_estimate: 3600
tags:
  - task
  - auto-generated
  - source-type
---
```

### Integration Commands

#### `obsidian-kit add-mcp`

Configure Obsidian MCP server for AI agent integration.

**Signature:**
```bash
obsidian-kit add-mcp [options]
```

**Parameters:**
- `-k, --api-key <key>` (string): Obsidian REST API key
- `-v, --vault-name <name>` (string): Vault name
- `-p, --port <port>` (number): Obsidian API port (default: 27123)
- `-u, --url <url>` (string): Obsidian API URL
- `-c, --config <config>` (string): Custom config file path

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
        "OBSIDIAN_PORT": "27123",
        "OBSIDIAN_URL": "http://localhost:27123"
      }
    }
  },
  "settings": {
    "auto_sync": true,
    "sync_interval": 300,
    "log_level": "info",
    "max_file_size": 10485760,
    "allowed_extensions": [".md", ".txt", ".json", ".yaml"]
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
      "args": ["path/to/mcp-server.js"],
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
    "log_level": "debug|info|warn|error",
    "max_file_size": number,
    "allowed_extensions": ["string"],
    "exclude_patterns": ["string"]
  }
}
```

#### `obsidian-kit.config.json`

Project-specific configuration.

**Structure:**
```json
{
  "project": {
    "name": "string",
    "version": "string",
    "description": "string"
  },
  "features": {
    "task_management": {
      "enabled": true,
      "auto_validation": true,
      "breakdown_depth": 3
    },
    "ai_agents": {
      "enabled": true,
      "default_agent": "claude-code",
      "auto_sync": true
    },
    "knowledge_graph": {
      "enabled": true,
      "auto_extraction": true,
      "visualization": true
    },
    "semantic_search": {
      "enabled": true,
      "indexing_interval": 3600,
      "similarity_threshold": 0.7
    }
  },
  "workflows": {
    "constitution": {
      "template": "standard",
      "sections": ["mission", "values", "decisions"]
    },
    "planning": {
      "requirements_template": "standard",
      "architecture_views": ["system", "component"]
    }
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
created_date: "2025-10-02"
last_updated: "2025-10-02"
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
created_date: "2025-10-02"
last_updated: "2025-10-02"
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

## Specialization
- System architecture
- Technical writing
- Problem decomposition
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
      "recursive": boolean,
      "include_hidden": boolean,
      "pattern": "string"
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
  ],
  "isError": false
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
      "path": "string",
      "encoding": "utf-8",
      "max_size": number
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
  ],
  "isError": false,
  "metadata": {
    "size": number,
    "last_modified": "2025-10-02T10:00:00Z",
    "encoding": "utf-8"
  }
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
      "content": "string",
      "create_directories": boolean,
      "backup": boolean
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
      "text": "File written successfully"
    }
  ],
  "isError": false,
  "metadata": {
    "bytes_written": number,
    "path": "string"
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
      "file_pattern": "string",
      "case_sensitive": boolean,
      "regex": boolean
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
      "text": "Search results..."
    }
  ],
  "isError": false,
  "metadata": {
    "matches": number,
    "files_searched": number
  }
}
```

#### `get_file_info`

Get file metadata.

**Request:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_file_info",
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
      "text": "File information..."
    }
  ],
  "isError": false,
  "metadata": {
    "size": number,
    "created": "2025-10-02T10:00:00Z",
    "modified": "2025-10-02T10:00:00Z",
    "type": "file|directory",
    "permissions": "rw-r--r--"
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
    this.capabilities = [];
    this.commands = new Map();
  }
  
  async initialize() {
    // Initialize agent
    await this.loadContext();
    await this.registerCommands();
    await this.connectServices();
  }
  
  async processCommand(command, args) {
    // Process slash commands
    if (this.commands.has(command)) {
      return await this.commands.get(command)(args);
    }
    return await this.handleUnknownCommand(command, args);
  }
  
  async generateResponse(prompt, context = {}) {
    // Generate AI response
    const fullContext = { ...this.context, ...context };
    return await this.model.generate(prompt, fullContext);
  }
  
  async updateContext(newContext) {
    // Update agent context
    this.context.merge(newContext);
    await this.saveContext();
  }
  
  async validateResponse(response) {
    // Validate AI response quality
    return this.validator.validate(response);
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
    this.maxTokens = 4000;
    this.capabilities = [
      'complex_reasoning',
      'long_form_content',
      'technical_documentation',
      'architecture_design'
    ];
  }
  
  async processCommand(command, args) {
    switch (command) {
      case '/status':
        return await this.getStatus();
      case '/tasks':
        return await this.getTasks();
      case '/research':
        return await this.research(args[0]);
      case '/plan':
        return await this.createPlan(args[0]);
      case '/help':
        return await this.getHelp();
      default:
        return await this.generateResponse(command, { args });
    }
  }
  
  async getStatus() {
    const status = await this.getProjectStatus();
    return this.formatStatus(status);
  }
  
  async getTasks() {
    const tasks = await this.loadTasks();
    return this.formatTasks(tasks);
  }
  
  async research(topic) {
    const context = await this.gatherContext(topic);
    const research = await this.generateResponse(
      `Research: ${topic}`,
      { context, type: 'research' }
    );
    return this.formatResearch(research);
  }
}
```

#### OpenCodeAgent

```javascript
class OpenCodeAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.vscode = new VSCodeAPI();
    this.capabilities = [
      'code_completion',
      'inline_suggestions',
      'debugging_assistance',
      'real_time_help'
    ];
  }
  
  async integrateWithVSCode() {
    // VS Code specific integration
    await this.vscode.registerCommands();
    await this.setupEventListeners();
    await this.configureSettings();
  }
  
  async processCodeChange(change) {
    const analysis = await this.analyzeChange(change);
    const suggestions = await this.generateSuggestions(analysis);
    return this.applySuggestions(suggestions);
  }
}
```

---

## 📊 Task Management API

### Task Object Structure

```typescript
interface Task {
  // Basic Information
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Project Context
  project: string;
  assignee?: string;
  tags: string[];
  
  // Timing
  created_date: string;
  due_date?: string;
  completed_date?: string;
  time_estimate: number; // in seconds
  time_spent: number;
  
  // Relationships
  dependencies: string[];
  subtasks: string[];
  parent_task?: string;
  
  // Quality
  acceptance_criteria?: string[];
  definition_of_done?: string[];
  
  // Metadata
  source?: string; // manual, auto-generated, specification, etc.
  auto_generated?: boolean;
  validated?: boolean;
  validation_score?: number;
  
  // Custom Fields
  custom_fields?: Record<string, any>;
}
```

### Task Manager API

```javascript
class TaskManager {
  constructor(config) {
    this.config = config;
    this.validator = new TaskValidator();
    this.breakdown = new TaskBreakdown();
    this.storage = new TaskStorage();
  }
  
  async createTask(taskData) {
    // Validate task data
    const validation = await this.validator.validate(taskData);
    if (!validation.valid) {
      throw new Error(`Task validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Create task with defaults
    const task = {
      ...taskData,
      created_date: new Date().toISOString(),
      status: taskData.status || 'todo',
      time_spent: 0,
      validated: true,
      validation_score: validation.score
    };
    
    // Save task
    const savedTask = await this.storage.save(task);
    
    // Emit events
    this.emit('task:created', savedTask);
    
    return savedTask;
  }
  
  async updateTask(taskId, updates) {
    const existingTask = await this.storage.get(taskId);
    if (!existingTask) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    // Validate updates
    const updatedTask = { ...existingTask, ...updates };
    const validation = await this.validator.validate(updatedTask);
    
    if (!validation.valid) {
      throw new Error(`Task validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Handle status changes
    if (updates.status === 'completed' && existingTask.status !== 'completed') {
      updatedTask.completed_date = new Date().toISOString();
    }
    
    // Save updated task
    const savedTask = await this.storage.save(updatedTask);
    
    // Emit events
    this.emit('task:updated', savedTask);
    
    return savedTask;
  }
  
  async deleteTask(taskId) {
    const task = await this.storage.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    // Check dependencies
    const dependents = await this.getDependents(taskId);
    if (dependents.length > 0) {
      throw new Error(`Cannot delete task with dependents: ${dependents.map(t => t.title).join(', ')}`);
    }
    
    // Delete task
    await this.storage.delete(taskId);
    
    // Emit events
    this.emit('task:deleted', task);
    
    return task;
  }
  
  async getTasks(filters = {}) {
    return await this.storage.query(filters);
  }
  
  async validateTask(task) {
    return await this.validator.validate(task);
  }
  
  async breakdownTask(taskId, options = {}) {
    const task = await this.storage.get(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    
    const breakdown = await this.breakdown.breakdown(task, options);
    
    // Create subtasks
    const subtasks = [];
    for (const subtaskData of breakdown.subtasks) {
      const subtask = await this.createTask({
        ...subtaskData,
        parent_task: taskId,
        project: task.project
      });
      subtasks.push(subtask);
    }
    
    // Update parent task
    await this.updateTask(taskId, {
      subtasks: subtasks.map(t => t.id)
    });
    
    return { parent: task, subtasks, breakdown };
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
  due_date as "Due Date",
  assignee as "Owner"
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

```dataview
TABLE 
  (length(filter(rows, (r) => r.status = "completed")) / length(rows)) * 100 as "% Complete",
  length(filter(rows, (r) => r.status = "in-progress")) as "In Progress",
  length(filter(rows, (r) => r.status = "todo")) as "To Do"
FROM "4 - Projects"
GROUP BY project
```

---

## 🔄 Workflow API

### Workflow Engine

```javascript
class WorkflowEngine {
  constructor(config) {
    this.config = config;
    this.phases = new Map();
    this.context = new WorkflowContext();
    this.logger = new WorkflowLogger();
  }
  
  async executePhase(phase, options = {}) {
    if (!this.phases.has(phase)) {
      throw new Error(`Unknown workflow phase: ${phase}`);
    }
    
    const phaseHandler = this.phases.get(phase);
    const context = { ...this.context, ...options };
    
    try {
      this.logger.info(`Starting workflow phase: ${phase}`);
      
      const result = await phaseHandler.execute(context);
      
      this.logger.info(`Completed workflow phase: ${phase}`);
      this.emit('phase:completed', { phase, result });
      
      return result;
    } catch (error) {
      this.logger.error(`Workflow phase failed: ${phase}`, error);
      this.emit('phase:failed', { phase, error });
      throw error;
    }
  }
  
  async executeConstitutionPhase(options) {
    const constitutionHandler = new ConstitutionHandler(this.config);
    
    // Create project constitution
    const constitution = await constitutionHandler.createConstitution({
      project_name: options.project_name,
      team: options.team,
      goals: options.goals
    });
    
    // Create decision framework
    const decisions = await constitutionHandler.createDecisionFramework({
      principles: constitution.principles,
      stakeholders: options.stakeholders
    });
    
    return {
      constitution,
      decisions,
      artifacts: [
        '.specify/memory/constitution.md',
        '.specify/memory/decisions.md'
      ]
    };
  }
  
  async executePlanningPhase(options) {
    const planningHandler = new PlanningHandler(this.config);
    
    // Gather requirements
    const requirements = await planningHandler.gatherRequirements({
      sources: options.sources || ['stakeholders', 'existing_docs'],
      template: options.requirements_template || 'standard'
    });
    
    // Design architecture
    const architecture = await planningHandler.designArchitecture({
      requirements: requirements,
      views: options.architecture_views || ['system', 'component'],
      constraints: options.constraints || {}
    });
    
    return {
      requirements,
      architecture,
      artifacts: [
        '.specify/specs/requirements.md',
        '.specify/specs/architecture.md'
      ]
    };
  }
  
  async executeDevelopmentPhase(options) {
    const developmentHandler = new DevelopmentHandler(this.config);
    
    // Generate tasks from specifications
    const tasks = await developmentHandler.generateTasks({
      specifications: options.specifications,
      breakdown_depth: options.breakdown_depth || 3
    });
    
    // Set up development environment
    const environment = await developmentHandler.setupEnvironment({
      tools: options.tools || [],
      integrations: options.integrations || []
    });
    
    // Configure quality checks
    const quality = await developmentHandler.configureQuality({
      checks: options.quality_checks || ['validation', 'linting', 'testing'],
      standards: options.standards || {}
    });
    
    return {
      tasks,
      environment,
      quality,
      artifacts: tasks.map(t => t.file_path)
    };
  }
  
  async executeDocumentationPhase(options) {
    const documentationHandler = new DocumentationHandler(this.config);
    
    // Generate API documentation
    const apiDocs = await documentationHandler.generateAPIDocs({
      source: options.source || 'code',
      format: options.format || 'markdown'
    });
    
    // Update user guides
    const userGuides = await documentationHandler.updateUserGuides({
      features: options.features || [],
      templates: options.templates || []
    });
    
    // Create changelog
    const changelog = await documentationHandler.createChangelog({
      period: options.period || 'since_last_release',
      format: options.changelog_format || 'markdown'
    });
    
    return {
      apiDocs,
      userGuides,
      changelog,
      artifacts: [
        'docs/api/',
        'docs/user-guide/',
        'CHANGELOG.md'
      ]
    };
  }
}
```

### Workflow Configuration

```yaml
# .specify/workflows/development.md
---
name: "Development Workflow"
version: "1.0"
description: "Standard development workflow for Obsidian Kit projects"

phases:
  - name: "constitution"
    description: "Create project constitution"
    required: true
    handler: "ConstitutionHandler"
    config:
      template: "standard"
      sections: ["mission", "values", "decisions"]
      
  - name: "planning"
    description: "Project planning and requirements"
    required: true
    depends_on: ["constitution"]
    handler: "PlanningHandler"
    config:
      requirements_template: "standard"
      architecture_views: ["system", "component"]
      
  - name: "development"
    description: "Implementation and development"
    required: true
    depends_on: ["planning"]
    handler: "DevelopmentHandler"
    config:
      task_generation: true
      quality_checks: ["validation", "linting", "testing"]
      
  - name: "documentation"
    description: "Documentation and knowledge capture"
    required: false
    depends_on: ["development"]
    handler: "DocumentationHandler"
    config:
      auto_generate: true
      formats: ["markdown", "html"]

hooks:
  before_phase:
    - "validate_context"
    - "backup_state"
  after_phase:
    - "update_progress"
    - "notify_stakeholders"
  on_error:
    - "log_error"
    - "notify_admin"

settings:
  parallel_execution: false
  retry_on_failure: true
  max_retries: 3
  timeout: 3600
---
```

---

## 🧠 Knowledge Graph API

### Knowledge Graph Manager

```javascript
class KnowledgeGraphManager {
  constructor(config) {
    this.config = config;
    this.extractor = new KnowledgeExtractor();
    this.query = new KnowledgeQuery();
    this.visualizer = new KnowledgeVisualizer();
    this.storage = new GraphStorage();
  }
  
  async extractKnowledge(content, metadata = {}) {
    const extraction = await this.extractor.extract(content, {
      ...metadata,
      timestamp: new Date().toISOString()
    });
    
    // Store extracted knowledge
    await this.storage.store(extraction);
    
    // Update graph
    await this.updateGraph(extraction);
    
    return extraction;
  }
  
  async queryGraph(query, options = {}) {
    return await this.query.query(query, {
      ...options,
      graph: await this.storage.loadGraph()
    });
  }
  
  async visualizeGraph(options = {}) {
    const graph = await this.storage.loadGraph();
    return await this.visualizer.visualize(graph, options);
  }
  
  async findConnections(entity, options = {}) {
    return await this.query.findConnections(entity, {
      depth: options.depth || 2,
      types: options.types || ['related', 'depends_on', 'similar_to']
    });
  }
  
  async getInsights(options = {}) {
    const graph = await this.storage.loadGraph();
    return await this.analyzer.analyze(graph, options);
  }
  
  private async updateGraph(extraction) {
    // Add new nodes and edges
    for (const entity of extraction.entities) {
      await this.storage.addNode(entity);
    }
    
    for (const relation of extraction.relations) {
      await this.storage.addEdge(relation);
    }
    
    // Update graph metrics
    await this.updateMetrics();
  }
  
  private async updateMetrics() {
    const graph = await this.storage.loadGraph();
    const metrics = {
      node_count: graph.nodes.length,
      edge_count: graph.edges.length,
      density: this.calculateDensity(graph),
      clusters: this.identifyClusters(graph)
    };
    
    await this.storage.storeMetrics(metrics);
  }
}
```

### Knowledge Extraction

```javascript
class KnowledgeExtractor {
  constructor(config) {
    this.config = config;
    this.nlp = new NLPProcessor();
    this.patterns = new PatternMatcher();
  }
  
  async extract(content, metadata) {
    const extraction = {
      metadata,
      entities: [],
      relations: [],
      concepts: [],
      insights: []
    };
    
    // Extract entities
    extraction.entities = await this.extractEntities(content);
    
    // Extract relations
    extraction.relations = await this.extractRelations(content, extraction.entities);
    
    // Extract concepts
    extraction.concepts = await this.extractConcepts(content);
    
    // Generate insights
    extraction.insights = await this.generateInsights(content, extraction);
    
    return extraction;
  }
  
  async extractEntities(content) {
    const entities = [];
    
    // Named entity recognition
    const namedEntities = await this.nlp.extractNamedEntities(content);
    entities.push(...namedEntities.map(e => ({
      type: 'named_entity',
      name: e.text,
      category: e.label,
      confidence: e.confidence
    })));
    
    // Task entities
    const taskEntities = await this.extractTaskEntities(content);
    entities.push(...taskEntities);
    
    // Project entities
    const projectEntities = await this.extractProjectEntities(content);
    entities.push(...projectEntities);
    
    return entities;
  }
  
  async extractRelations(content, entities) {
    const relations = [];
    
    // Dependency relations
    const dependencies = await this.extractDependencies(content);
    relations.push(...dependencies);
    
    // Similarity relations
    const similarities = await this.extractSimilarities(entities);
    relations.push(...similarities);
    
    // Temporal relations
    const temporal = await this.extractTemporalRelations(content);
    relations.push(...temporal);
    
    return relations;
  }
  
  async extractConcepts(content) {
    // Extract key concepts using topic modeling
    const topics = await this.nlp.extractTopics(content);
    
    return topics.map(topic => ({
      type: 'concept',
      name: topic.label,
      keywords: topic.keywords,
      weight: topic.weight,
      description: topic.description
    }));
  }
  
  async generateInsights(content, extraction) {
    const insights = [];
    
    // Pattern insights
    const patterns = await this.patterns.findPatterns(extraction);
    insights.push(...patterns.map(p => ({
      type: 'pattern',
      description: p.description,
      confidence: p.confidence,
      entities: p.entities
    })));
    
    // Connection insights
    const connections = await this.findHiddenConnections(extraction);
    insights.push(...connections);
    
    // Trend insights
    const trends = await this.analyzeTrends(extraction);
    insights.push(...trends);
    
    return insights;
  }
}
```

---

## 🔍 Semantic Search API

### Semantic Search Engine

```javascript
class SemanticSearchEngine {
  constructor(config) {
    this.config = config;
    this.indexer = new DocumentIndexer();
    this.embedder = new TextEmbedder();
    this.searcher = new VectorSearcher();
    this.reranker = new ResultReranker();
  }
  
  async indexDocument(document, metadata = {}) {
    // Generate embeddings
    const embeddings = await this.embedder.embed(document.content);
    
    // Extract features
    const features = await this.extractFeatures(document);
    
    // Create document record
    const record = {
      id: document.id,
      content: document.content,
      metadata: {
        ...metadata,
        indexed_at: new Date().toISOString(),
        features
      },
      embeddings,
      vectors: embeddings.vectors
    };
    
    // Add to index
    await this.indexer.add(record);
    
    return record;
  }
  
  async search(query, options = {}) {
    // Generate query embeddings
    const queryEmbeddings = await this.embedder.embed(query);
    
    // Vector search
    const candidates = await this.searcher.search(queryEmbeddings, {
      limit: options.limit || 10,
      threshold: options.threshold || 0.7,
      index: await this.indexer.loadIndex()
    });
    
    // Rerank results
    const results = await this.reranker.rerank(candidates, {
      query,
      queryEmbeddings,
      options
    });
    
    return results;
  }
  
  async findSimilar(documentId, options = {}) {
    const document = await this.indexer.get(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }
    
    return await this.search(document.content, {
      ...options,
      exclude_ids: [documentId],
      similarity_threshold: options.similarity_threshold || 0.8
    });
  }
  
  async recommend(query, context = {}) {
    // Enhanced search with context
    const contextualQuery = this.enhanceQuery(query, context);
    
    const results = await this.search(contextualQuery, {
      limit: 20,
      rerank: true,
      diversity: true
    });
    
    // Apply recommendation logic
    return this.applyRecommendationLogic(results, context);
  }
  
  private enhanceQuery(query, context) {
    let enhancedQuery = query;
    
    // Add context terms
    if (context.project) {
      enhancedQuery += ` ${context.project}`;
    }
    
    if (context.tags) {
      enhancedQuery += ` ${context.tags.join(' ')}`;
    }
    
    if (context.recent_queries) {
      enhancedQuery += ` ${context.recent_queries.slice(-3).join(' ')}`;
    }
    
    return enhancedQuery;
  }
  
  private applyRecommendationLogic(results, context) {
    // Filter based on context
    let filtered = results;
    
    if (context.exclude_completed) {
      filtered = filtered.filter(r => !r.metadata.completed);
    }
    
    if (context.priority) {
      filtered = filtered.filter(r => 
        r.metadata.priority === context.priority
      );
    }
    
    // Boost recent items
    filtered = filtered.map(result => ({
      ...result,
      score: result.score * this.getRecencyBoost(result.metadata)
    }));
    
    // Sort by final score
    return filtered.sort((a, b) => b.score - a.score);
  }
  
  private getRecencyBoost(metadata) {
    if (!metadata.created_date) return 1.0;
    
    const age = Date.now() - new Date(metadata.created_date).getTime();
    const daysOld = age / (1000 * 60 * 60 * 24);
    
    // Boost items less than 7 days old
    if (daysOld < 7) {
      return 1.2;
    } else if (daysOld < 30) {
      return 1.1;
    }
    
    return 1.0;
  }
}
```

### Search Configuration

```json
{
  "semantic_search": {
    "embedding_model": "text-embedding-ada-002",
    "vector_dimension": 1536,
    "index_type": "hnsw",
    "similarity_metric": "cosine",
    "indexing": {
      "batch_size": 100,
      "update_interval": 3600,
      "auto_reindex": true
    },
    "search": {
      "default_limit": 10,
      "max_limit": 100,
      "default_threshold": 0.7,
      "rerank": true,
      "diversification": true
    },
    "features": {
      "extract_keywords": true,
      "extract_entities": true,
      "extract_topics": true,
      "extract_sentiment": true
    }
  }
}
```

---

## 📡 Event System

### Event Types

```javascript
// Task events
const TASK_EVENTS = {
  CREATED: 'task:created',
  UPDATED: 'task:updated',
  COMPLETED: 'task:completed',
  DELETED: 'task:deleted',
  VALIDATED: 'task:validated',
  ASSIGNED: 'task:assigned'
};

// Project events
const PROJECT_EVENTS = {
  INITIALIZED: 'project:initialized',
  HEALTH_CHECK: 'project:health_check',
  MILESTONE_REACHED: 'project:milestone_reached',
  ARCHIVED: 'project:archived'
};

// Agent events
const AGENT_EVENTS = {
  CONFIGURED: 'agent:configured',
  SYNCED: 'agent:synced',
  COMMAND_EXECUTED: 'agent:command_executed',
  RESPONSE_GENERATED: 'agent:response_generated'
};

// Workflow events
const WORKFLOW_EVENTS = {
  STARTED: 'workflow:started',
  PHASE_STARTED: 'workflow:phase_started',
  PHASE_COMPLETED: 'workflow:phase_completed',
  COMPLETED: 'workflow:completed',
  FAILED: 'workflow:failed'
};

// System events
const SYSTEM_EVENTS = {
  STARTUP: 'system:startup',
  SHUTDOWN: 'system:shutdown',
  ERROR: 'system:error',
  WARNING: 'system:warning'
};
```

### Event Emitter API

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.middlewares = [];
    this.maxListeners = 100;
  }
  
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const listeners = this.events.get(event);
    if (listeners.length >= this.maxListeners) {
      console.warn(`Max listeners exceeded for event: ${event}`);
    }
    
    listeners.push(listener);
    return this;
  }
  
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    
    return this.on(event, onceWrapper);
  }
  
  off(event, listener) {
    if (!this.events.has(event)) {
      return this;
    }
    
    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    
    if (listeners.length === 0) {
      this.events.delete(event);
    }
    
    return this;
  }
  
  async emit(event, data) {
    // Apply middlewares
    for (const middleware of this.middlewares) {
      data = await middleware(event, data);
    }
    
    // Get listeners
    const listeners = this.events.get(event) || [];
    
    // Execute listeners
    const promises = listeners.map(listener => 
      this.safeExecute(listener, data)
    );
    
    await Promise.allSettled(promises);
    
    return this;
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }
  
  private async safeExecute(listener, data) {
    try {
      await listener(data);
    } catch (error) {
      console.error('Event listener error:', error);
      this.emit('system:error', { 
        type: 'listener_error', 
        error, 
        data 
      });
    }
  }
}
```

### Event Examples

```javascript
// Task management events
eventEmitter.on('task:created', (task) => {
  console.log(`New task created: ${task.title}`);
  
  // Update dashboard
  dashboard.updateTaskCount();
  
  // Notify assignee
  if (task.assignee) {
    notifications.notify(task.assignee, `New task assigned: ${task.title}`);
  }
});

eventEmitter.on('task:completed', (task) => {
  console.log(`Task completed: ${task.title}`);
  
  // Update progress
  progress.update(task.project, task);
  
  // Check dependencies
  taskManager.checkDependents(task.id);
  
  // Celebrate milestone
  if (task.is_milestone) {
    celebrations.celebrate('milestone', task);
  }
});

// Workflow events
eventEmitter.on('workflow:phase_completed', (data) => {
  console.log(`Workflow phase completed: ${data.phase}`);
  
  // Update progress
  progress.updateWorkflow(data.workflow, data.phase);
  
  // Notify stakeholders
  notifications.notifyStakeholders('phase_completed', data);
  
  // Auto-start next phase
  if (data.auto_continue) {
    workflowEngine.executeNextPhase(data.workflow);
  }
});

// Agent events
eventEmitter.on('agent:response_generated', (data) => {
  console.log(`Agent response generated: ${data.agent}`);
  
  // Log response
  logger.logAgentResponse(data);
  
  // Validate response
  validator.validateResponse(data.response);
  
  // Update context
  contextManager.updateContext(data.agent, data.context);
});
```

---

## 🔧 Extension Points

### Custom Commands

Create custom CLI commands:

```javascript
// cli/commands/custom-command.js
module.exports = async function(args, options) {
  const { logger, config } = this;
  
  try {
    logger.info('Executing custom command');
    
    // Your custom logic here
    const result = await processCustomCommand(args, options);
    
    logger.info('Custom command completed successfully');
    return result;
    
  } catch (error) {
    logger.error('Custom command failed:', error);
    throw error;
  }
};

function processCustomCommand(args, options) {
  // Implement your custom functionality
  return { success: true, data: 'Custom result' };
}
```

Register in `cli/bin/obsidian-kit`:

```javascript
const customCommand = require('../commands/custom-command');

program
  .command('custom')
  .description('Custom command description')
  .option('-f, --force', 'Force execution')
  .option('-o, --output <file>', 'Output file')
  .action(customCommand);
```

### Custom Agents

Create custom AI agents:

```javascript
// agents/custom-agent.js
const BaseAgent = require('../lib/agents/base-agent');

class CustomAgent extends BaseAgent {
  constructor(config) {
    super(config);
    this.name = 'custom-agent';
    this.capabilities = [
      'custom_capability_1',
      'custom_capability_2'
    ];
  }
  
  async initialize() {
    await super.initialize();
    
    // Custom initialization
    await this.loadCustomModels();
    await this.setupCustomIntegrations();
  }
  
  async processCommand(command, args) {
    switch (command) {
      case '/custom-command':
        return await this.handleCustomCommand(args);
      default:
        return await super.processCommand(command, args);
    }
  }
  
  async handleCustomCommand(args) {
    // Implement custom command logic
    return {
      response: 'Custom command response',
      data: args
    };
  }
  
  async loadCustomModels() {
    // Load custom ML models
  }
  
  async setupCustomIntegrations() {
    // Setup custom integrations
  }
}

module.exports = CustomAgent;
```

### Custom Workflows

Create custom workflow phases:

```javascript
// workflows/custom-workflow.js
class CustomWorkflow {
  constructor(config) {
    this.config = config;
    this.logger = new WorkflowLogger();
  }
  
  async execute(options) {
    this.logger.info('Starting custom workflow');
    
    try {
      // Custom workflow logic
      const result = await this.processCustomWorkflow(options);
      
      this.logger.info('Custom workflow completed');
      return result;
      
    } catch (error) {
      this.logger.error('Custom workflow failed:', error);
      throw error;
    }
  }
  
  async processCustomWorkflow(options) {
    // Implement your custom workflow
    return {
      status: 'completed',
      artifacts: ['custom-output.md'],
      metadata: options
    };
  }
}

module.exports = CustomWorkflow;
```

### Plugin System

```javascript
// lib/plugin-manager.js
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }
  
  async loadPlugin(pluginPath) {
    try {
      const plugin = require(pluginPath);
      
      // Validate plugin
      this.validatePlugin(plugin);
      
      // Initialize plugin
      await plugin.initialize();
      
      // Register plugin
      this.plugins.set(plugin.name, plugin);
      
      // Register hooks
      this.registerHooks(plugin);
      
      console.log(`Plugin loaded: ${plugin.name}`);
      
    } catch (error) {
      console.error(`Failed to load plugin: ${pluginPath}`, error);
      throw error;
    }
  }
  
  async unloadPlugin(pluginName) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }
    
    // Cleanup plugin
    if (plugin.cleanup) {
      await plugin.cleanup();
    }
    
    // Unregister hooks
    this.unregisterHooks(plugin);
    
    // Remove plugin
    this.plugins.delete(pluginName);
    
    console.log(`Plugin unloaded: ${pluginName}`);
  }
  
  async executeHook(hookName, data) {
    const hooks = this.hooks.get(hookName) || [];
    
    for (const hook of hooks) {
      try {
        data = await hook(data);
      } catch (error) {
        console.error(`Hook execution failed: ${hookName}`, error);
      }
    }
    
    return data;
  }
  
  validatePlugin(plugin) {
    const required = ['name', 'version', 'initialize'];
    
    for (const prop of required) {
      if (!plugin[prop]) {
        throw new Error(`Plugin missing required property: ${prop}`);
      }
    }
  }
  
  registerHooks(plugin) {
    if (plugin.hooks) {
      for (const [hookName, handler] of Object.entries(plugin.hooks)) {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        
        this.hooks.get(hookName).push(handler);
      }
    }
  }
  
  unregisterHooks(plugin) {
    if (plugin.hooks) {
      for (const hookName of Object.keys(plugin.hooks)) {
        const hooks = this.hooks.get(hookName);
        if (hooks) {
          const index = hooks.indexOf(plugin.hooks[hookName]);
          if (index > -1) {
            hooks.splice(index, 1);
          }
        }
      }
    }
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
| 6 | File not found |
| 7 | Invalid input |
| 8 | Timeout error |
| 9 | Rate limit exceeded |

### Error Objects

```javascript
class ObsidianKitError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ObsidianKitError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

class ValidationError extends ObsidianKitError {
  constructor(message, errors = []) {
    super(message, 5, { errors });
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class ConfigurationError extends ObsidianKitError {
  constructor(message, configPath) {
    super(message, 2, { configPath });
    this.name = 'ConfigurationError';
    this.configPath = configPath;
  }
}
```

### Error Handling Patterns

```javascript
// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  
  // Cleanup resources
  cleanup();
  
  // Exit gracefully
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

// Command error handling
async function executeCommand(command, args, options) {
  try {
    return await command(args, options);
  } catch (error) {
    if (error instanceof ObsidianKitError) {
      handleObsidianKitError(error);
    } else {
      handleGenericError(error);
    }
    throw error;
  }
}

function handleObsidianKitError(error) {
  switch (error.code) {
    case 2: // Configuration error
      console.error('Configuration error:', error.message);
      console.log('Check your configuration files');
      break;
    case 3: // Permission error
      console.error('Permission denied:', error.message);
      console.log('Check file and directory permissions');
      break;
    case 5: // Validation error
      console.error('Validation failed:', error.message);
      if (error.errors.length > 0) {
        console.log('Validation errors:');
        error.errors.forEach(err => console.log(`  - ${err}`));
      }
      break;
    default:
      console.error('Error:', error.message);
  }
}
```

---

## 🔍 Debugging

### Debug Mode

Enable debug logging:

```bash
# Environment variable
DEBUG=obsidian-kit:* obsidian-kit init test-project

# CLI option
obsidian-kit --debug init test-project

# Specific modules
DEBUG=obsidian-kit:cli,obsidian-kit:agents obsidian-kit status
```

### Log Levels

- `error`: Error messages only
- `warn`: Warnings and errors
- `info`: General information
- `debug`: Detailed debugging
- `trace`: Full trace information

### Log Files

Logs are stored in:
- `~/.obsidian-kit/logs/obsidian-kit.log`
- `~/.obsidian-kit/logs/error.log`
- `~/.obsidian-kit/logs/debug.log`

### Debug Commands

```bash
# Check system status
obsidian-kit status --verbose --debug

# Validate configuration
obsidian-kit config validate

# Test agent connection
obsidian-kit agent test claude-code

# Check MCP server
obsidian-kit mcp test

# Run diagnostics
obsidian-kit doctor
```

---

*This API reference covers all public interfaces. For internal implementation details, see the source code.*

**Last updated: 2025-10-02 | Version: 1.0.0**