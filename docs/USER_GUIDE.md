# 📚 Obsidian Kit User Guide

Welcome to the comprehensive user guide for Obsidian Kit! This guide will help you master all features and capabilities of this powerful AI-powered project management system.

## 🎯 Table of Contents

1. [Getting Started](#getting-started)
2. [Installation & Setup](#installation--setup)
3. [Core Concepts](#core-concepts)
4. [CLI Commands Reference](#cli-commands-reference)
5. [AI Agent Integration](#ai-agent-integration)
6. [Project Management](#project-management)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## 🚀 Getting Started

### What is Obsidian Kit?

Obsidian Kit is a universal CLI tool that creates AI-powered project vaults in Obsidian with integrated task management, spec-driven development workflows, and multi-agent support.

### Key Features

- **🏗️ One-Command Vault Setup**: Initialize complete project structures instantly
- **🤖 Universal AI Integration**: Support for Claude Code, OpenCode, Cursor, and Copilot
- **📋 Intelligent Task Management**: Automated task creation, breakdown, and validation
- **📝 Spec-Driven Development**: Full specification-based workflow management
- **⚡ Real-time Health Monitoring**: Track project health and progress
- **🔄 Standardized Workflows**: Consistent processes across all AI tools

### Quick Start (5 Minutes)

```bash
# 1. Install Obsidian Kit
curl -sSL https://raw.githubusercontent.com/username/obsidian-kit/main/scripts/install.sh | bash

# 2. Create your first project
obsidian-kit init my-project
cd my-project

# 3. Configure your AI tool
obsidian-kit agent add claude-code

# 4. Start development
obsidian-kit workflow constitution

# 5. Check status
obsidian-kit status
```

---

## 🛠️ Installation & Setup

### System Requirements

- **Node.js** 16+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **Obsidian** with Local REST API plugin
- **Claude Desktop** (for AI agent integration)
- **Git** 2+

### Installation Methods

#### Method 1: Automatic Installation (Recommended)

```bash
curl -sSL https://raw.githubusercontent.com/username/obsidian-kit/main/scripts/install.sh | bash
```

#### Method 2: Manual Installation

```bash
git clone https://github.com/username/obsidian-kit.git
cd obsidian-kit
npm install
npm run build
npm run install-global
```

#### Method 3: NPM Installation

```bash
npm install -g obsidian-kit
```

### Obsidian Setup

1. **Install Required Plugins**:
   - Local REST API
   - Dataview
   - Templater
   - Tasks

2. **Configure Local REST API**:
   - Go to Settings → Community Plugins → Local REST API
   - Generate an API key
   - Set port to 27123
   - Enable "Allow CORS"

3. **Configure Dataview**:
   - Enable Dataview plugin
   - Set automatic query refresh

### Claude Desktop Setup

1. Install Claude Desktop from [anthropic.com](https://anthropic.com)

2. Configure MCP server:
```bash
obsidian-kit add-mcp --api-key YOUR_API_KEY --vault-name YOUR_VAULT_NAME
```

3. Restart Claude Desktop

---

## 🧠 Core Concepts

### Vault Structure

Every Obsidian Kit project follows a standardized 4-folder structure:

```
project-vault/
├── 1 - Source Materials/     # Research, references, documentation
├── 2 - Daily Notes/          # Daily task overviews and progress
├── 3 - Templates/            # Reusable templates
├── 4 - Projects/             # Active projects and tasks
├── agents/                   # AI agent configurations
└── .specify/                 # Specifications and workflows
```

### Spec-Driven Development

The `.specify/` directory contains:

- **memory/**: Project constitution and decisions
- **specs/**: Requirements and architecture
- **workflows/**: Development processes

### Task Management System

Built on Dataview with intelligent features:

- **Tasks.base**: Central task database
- **Automated breakdown**: AI-powered task decomposition
- **Validation**: Quality checks for task completeness
- **Health monitoring**: Progress tracking and alerts

### AI Agent Integration

Multiple AI tools supported through standardized configurations:

- **Claude Code**: Advanced reasoning and documentation
- **OpenCode**: VS Code integration
- **Cursor**: AI-assisted coding
- **Copilot**: GitHub's AI assistant

---

## 📋 CLI Commands Reference

### Project Management Commands

#### `obsidian-kit init [project-name]`
Initialize a new project vault with complete structure.

**Options:**
- `-d, --dir <directory>`: Target directory (default: current)
- `-f, --force`: Force initialization in non-empty directory

**Examples:**
```bash
# Basic initialization
obsidian-kit init my-project

# Initialize in specific directory
obsidian-kit init my-project --dir ~/projects

# Force initialize in existing directory
obsidian-kit init . --force
```

#### `obsidian-kit status`
Show vault health and system status.

**Options:**
- `-v, --verbose`: Show detailed information

**Output includes:**
- MCP server status
- AI agent configurations
- Task queue overview
- Plugin status
- System health

### AI Agent Commands

#### `obsidian-kit agent add [tool]`
Configure AI tool integration.

**Supported tools:**
- `claude-code`
- `opencode`
- `cursor`
- `copilot`

**Examples:**
```bash
# Add Claude Code integration
obsidian-kit agent add claude-code

# Add OpenCode integration
obsidian-kit agent add opencode
```

#### `obsidian-kit agent list`
Show configured AI agents.

**Options:**
- `-v, --verbose`: Detailed agent information

#### `obsidian-kit agent sync`
Update agent configurations with latest settings.

#### `obsidian-kit agent configure [tool]`
Edit specific agent settings.

### Workflow Commands

#### `obsidian-kit workflow [phase]`
Execute spec-driven development workflows.

**Phases:**
- `constitution`: Create project constitution
- `planning`: Project planning phase
- `development`: Development workflow
- `documentation`: Documentation workflow

**Options:**
- `-i, --interactive`: Interactive mode with prompts

**Examples:**
```bash
# Start with constitution
obsidian-kit workflow constitution

# Interactive planning
obsidian-kit workflow planning --interactive
```

### Task Management Commands

#### `obsidian-kit breakdown [task-description]`
AI-powered task breakdown and estimation.

**Options:**
- `-d, --dry-run`: Show breakdown without creating files
- `-s, --subtasks <count>`: Number of subtasks to generate

**Examples:**
```bash
# Break down a complex task
obsidian-kit breakdown "Implement user authentication system"

# Dry run to preview
obsidian-kit breakdown "Build API endpoints" --dry-run

# Generate specific number of subtasks
obsidian-kit breakdown "Create dashboard" --subtasks 5
```

#### `obsidian-kit validate [task-file]`
Validate task quality and completeness.

**Options:**
- `-a, --all`: Validate all tasks in vault

**Validation checks:**
- Frontmatter completeness
- Acceptance criteria clarity
- Time estimate reasonableness
- Dependency consistency

#### `obsidian-kit generate-tasks`
Generate tasks automatically from specifications and patterns.

**Options:**
- `-d, --dry-run`: Preview generated tasks

**Sources:**
- Project specifications
- Code changes
- User stories
- Bug reports

### Integration Commands

#### `obsidian-kit add-mcp`
Configure Obsidian MCP server for AI integration.

**Options:**
- `-k, --api-key <key>`: Obsidian REST API key
- `-v, --vault-name <name>`: Vault name

**Example:**
```bash
obsidian-kit add-mcp --api-key abc123 --vault-name my-project
```

---

## 🤖 AI Agent Integration

### Supported AI Tools

#### Claude Code
- **Best for**: Complex reasoning, documentation, architecture
- **Features**: Advanced context understanding, long-form content
- **Setup**: `obsidian-kit agent add claude-code`

#### OpenCode
- **Best for**: VS Code integration, real-time assistance
- **Features**: Code completion, inline suggestions
- **Setup**: `obsidian-kit agent add opencode`

#### Cursor
- **Best for**: AI-assisted coding, debugging
- **Features**: Code generation, error fixing
- **Setup**: `obsidian-kit agent add cursor`

#### Copilot
- **Best for**: GitHub integration, code suggestions
- **Features**: Context-aware suggestions, PR assistance
- **Setup**: `obsidian-kit agent add copilot`

### Agent Configuration Files

Each agent has a configuration file in `agents/`:

- `claude-code.md`: Claude-specific settings
- `opencode.md`: VS Code integration
- `cursor.md`: Cursor AI configuration
- `universal-context.md`: Shared context for all agents
- `slash-commands.md`: Standardized commands

### Universal Context

The `universal-context.md` file provides shared information:

- Project overview
- Team structure
- Development standards
- Current priorities
- Key decisions

### Slash Commands

Standardized commands work across all AI tools:

- `/status`: Check project status
- `/tasks`: Show current tasks
- `/help`: Get assistance
- `/research`: Research specific topics
- `/plan`: Create project plans

---

## 📊 Project Management

### Task Creation Workflow

1. **Generate Tasks**: Use `obsidian-kit generate-tasks`
2. **Break Down Complex Tasks**: Use `obsidian-kit breakdown`
3. **Validate Quality**: Use `obsidian-kit validate`
4. **Track Progress**: Monitor via Tasks.base
5. **Update Status**: Regular status checks

### Task Template Structure

Each task follows this template:

```yaml
---
title: "Task Title"
status: "todo|in-progress|review|completed"
priority: "low|medium|high|critical"
project: "Project Name"
assignee: "Assignee"
due_date: "YYYY-MM-DD"
created_date: "YYYY-MM-DD"
completed_date: ""
time_estimate: 3600
time_spent: 0
dependencies: []
subtasks: []
tags:
  - task
  - feature
---
```

### Project Dashboard

The `Project Management Dashboard.md` provides:

- Real-time task overview
- Progress charts
- Team workload
- Milestone tracking
- Health metrics

### Dataview Queries

Automated queries show:

```dataview
TABLE 
  status as "Status",
  priority as "Priority",
  due_date as "Due Date"
FROM "4 - Projects"
WHERE status != "completed"
SORT priority DESC, due_date ASC
```

### Health Monitoring

Regular health checks include:

- Task completion rates
- Overdue items
- Team workload balance
- Documentation freshness
- Integration status

---

## 🚀 Advanced Features

### Automated Task Generation

The system can automatically generate tasks from:

- **Specifications**: Parse requirements documents
- **Code Changes**: Analyze git commits
- **User Stories**: Extract from feature requests
- **Bug Reports**: Create fix tasks

**Usage:**
```bash
# Generate from all sources
obsidian-kit generate-tasks

# Preview before creating
obsidian-kit generate-tasks --dry-run
```

### Task Validation Engine

Comprehensive validation checks:

- **Frontmatter Validation**: Required fields present
- **Quality Checks**: Clear acceptance criteria
- **Dependency Analysis**: Circular dependency detection
- **Time Estimate Validation**: Reasonable effort estimates

### Knowledge Graph Integration

Advanced knowledge management:

- **Semantic Search**: Find related tasks and documents
- **Learning Capture**: Track insights and decisions
- **Knowledge Extraction**: Auto-generate summaries
- **Visual Analytics**: Interactive knowledge graphs

### Workflow Automation

Automated workflows include:

- **Spec-Driven Development**: From spec to implementation
- **Documentation Updates**: Auto-update related docs
- **Task Dependencies**: Automatic status updates
- **Health Alerts**: Proactive notifications

---

## 🔧 Troubleshooting

### Common Issues

#### Command Not Found
```bash
# Check installation
which obsidian-kit

# Reinstall if needed
npm install -g obsidian-kit

# Restart terminal
source ~/.zshrc  # or ~/.bashrc
```

#### MCP Server Connection Issues
```bash
# Check status
obsidian-kit status --verbose

# Verify API key
cat mcp-config.json

# Restart Obsidian and Claude Desktop
```

#### Tasks Not Showing in Dataview
1. Verify Tasks.base exists in `4 - Projects/`
2. Check task frontmatter format
3. Ensure Dataview plugin is enabled
4. Refresh Dataview queries

#### AI Agent Not Responding
1. Check agent configuration files
2. Verify MCP server is running
3. Restart Claude Desktop
4. Check API key validity

### Debug Mode

Enable verbose logging:
```bash
# Verbose status
obsidian-kit status --verbose

# Debug commands
DEBUG=obsidian-kit:* obsidian-kit init test-project
```

### Log Files

Check logs for troubleshooting:
- `~/.obsidian-kit/logs/`
- Obsidian console (Ctrl+Shift+I)
- Claude Desktop logs

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community support and questions
- **Documentation**: Comprehensive guides and API reference

---

## 💡 Best Practices

### Project Organization

1. **Consistent Structure**: Follow the 4-folder layout
2. **Regular Cleanup**: Archive completed projects
3. **Link Everything**: Use Obsidian's linking features
4. **Tag Consistently**: Standardize tag usage

### Task Management

1. **Break Down Work**: Keep tasks under 4 hours
2. **Clear Acceptance Criteria**: Define done clearly
3. **Regular Updates**: Update status daily
4. **Dependency Management**: Track task relationships

### AI Agent Usage

1. **Provide Context**: Use universal context files
2. **Standard Commands**: Use slash commands consistently
3. **Review Output**: Validate AI-generated content
4. **Iterate**: Refine prompts and configurations

### Documentation

1. **Living Documents**: Keep specs current
2. **Auto-Generation**: Use AI for routine updates
3. **Version Control**: Track document changes
4. **Accessibility**: Make docs easy to find

### Team Collaboration

1. **Shared Standards**: Agree on conventions
2. **Regular Syncs**: Use status commands in meetings
3. **Knowledge Sharing**: Use agents for information synthesis
4. **Continuous Improvement**: Regularly review processes

---

## ❓ FAQ

### General Questions

**Q: What makes Obsidian Kit different from other project management tools?**
A: Obsidian Kit combines the power of Obsidian's knowledge graph with AI agents and spec-driven development, creating a unified environment for both thinking and doing.

**Q: Can I use Obsidian Kit without AI agents?**
A: Yes! All core features work without AI integration. Agents enhance but aren't required.

**Q: Is my data secure?**
A: Yes. Everything runs locally on your machine. AI agents only access what you explicitly configure through MCP.

### Technical Questions

**Q: What Node.js version is required?**
A: Node.js 16 or higher. We recommend using the latest LTS version.

**Q: Can I use Obsidian Kit with other vaults?**
A: Yes, but you'll get the best experience with vaults created using `obsidian-kit init`.

**Q: How do I migrate existing projects?**
A: Use `obsidian-kit init . --force` in existing vaults to add the structure.

### Integration Questions

**Q: Can I use multiple AI agents simultaneously?**
A: Yes! You can configure multiple agents and switch between them as needed.

**Q: Does Obsidian Kit work with Obsidian Sync?**
A: Yes, Obsidian Kit is fully compatible with Obsidian Sync and other plugins.

**Q: Can I customize the templates?**
A: Absolutely! Templates in `3 - Templates/` can be customized to your needs.

### Troubleshooting Questions

**Q: Why aren't my tasks appearing in Dataview?**
A: Check that tasks are in `4 - Projects/` and have proper frontmatter. Try refreshing Dataview.

**Q: How do I reset my configuration?**
A: Delete `~/.obsidian-kit/` and re-run the installation script.

**Q: What if I forget my API key?**
A: Generate a new one in Obsidian's Local REST API plugin settings and re-run `obsidian-kit add-mcp`.

---

## 📖 Additional Resources

### Documentation
- [API Reference](./API_REFERENCE.md)
- [Developer Guide](../DEVELOPMENT.md)
- [Quick Start](../QUICK_START.md)

### Community
- [GitHub Discussions](https://github.com/username/obsidian-kit/discussions)
- [Discord Community](https://discord.gg/obsidian-kit)
- [Reddit r/ObsidianKit](https://reddit.com/r/obsidiankit)

### Tutorials
- [Video Tutorial Series](https://youtube.com/obsidian-kit)
- [Interactive Workshop](https://workshop.obsidian-kit.com)
- [Example Projects](https://github.com/username/obsidian-kit-examples)

### Templates & Examples
- [Project Templates](https://github.com/username/obsidian-kit-templates)
- [Agent Configurations](https://github.com/username/obsidian-kit-agents)
- [Workflow Examples](https://github.com/username/obsidian-kit-workflows)

---

## 🎉 Next Steps

1. **Join the Community**: Connect with other users
2. **Explore Examples**: See real-world implementations
3. **Customize Your Setup**: Tailor to your workflow
4. **Share Your Experience**: Help others learn

---

*Happy building with Obsidian Kit! 🚀*