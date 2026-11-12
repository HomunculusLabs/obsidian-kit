---
title: "📘 Getting Started Guide"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["getting-started", "tutorial", "beginner", "obsidian-kit"]
---

# 📘 Getting Started Guide

Welcome to Obsidian Kit! This guide will help you get up and running with AI-powered project management in Obsidian.

## 🎯 What You'll Accomplish

By the end of this guide, you'll have:
- ✅ A fully configured Obsidian Kit vault
- ✅ AI agent integration set up
- ✅ Your first project created
- ✅ Task management system running
- ✅ Understanding of core workflows

## 🚀 5-Minute Quick Start

### Prerequisites Check

Before we begin, ensure you have:
- **Node.js 16+** installed
- **Obsidian** app installed
- **Claude Desktop** (for AI integration)

### Step 1: Install Obsidian Kit

```bash
# Install with one command
curl -sSL https://raw.githubusercontent.com/t3rpz/obsidian-kit/main/scripts/install.sh | bash
```

### Step 2: Create Your First Project

```bash
# Create a new project vault
obsidian-kit init my-first-project
cd my-first-project
```

### Step 3: Configure AI Agent

```bash
# Add Claude Code integration
obsidian-kit agent add claude-code
```

### Step 4: Set Up MCP Server

```bash
# Configure Obsidian integration
obsidian-kit add-mcp --api-key YOUR_API_KEY --vault-name my-first-project
```

### Step 5: Start Working

```bash
# Check everything is working
obsidian-kit status

# Start your first workflow
obsidian-kit workflow constitution
```

🎉 **Congratulations!** You now have a fully functional AI-powered project vault.

---

## 📋 Detailed Setup Guide

### 🔧 System Requirements

#### Required Software
- **Node.js**: Version 16 or higher (LTS recommended)
- **Obsidian**: Latest version with community plugins
- **Git**: For version control integration
- **Claude Desktop**: For AI agent integration (optional but recommended)

#### Obsidian Plugins Required
1. **Local REST API** - For AI agent communication
2. **Dataview** - For task management queries
3. **Templater** - For template processing
4. **Tasks** - For enhanced task management

#### Checking Prerequisites

```bash
# Check Node.js version
node --version  # Should be v16.x.x or higher

# Check npm version
npm --version   # Should be 8.x.x or higher

# Check Git version
git --version   # Should be 2.x.x or higher
```

### 📦 Installation Methods

#### Method 1: Automatic Installation (Recommended)

```bash
# One-command installation
curl -sSL https://raw.githubusercontent.com/t3rpz/obsidian-kit/main/scripts/install.sh | bash
```

This will:
- Download the latest version
- Install globally via npm
- Set up command-line tools
- Configure default settings

#### Method 2: Manual Installation

```bash
# Clone the repository
git clone https://github.com/t3rpz/obsidian-kit.git
cd obsidian-kit

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm run install-global
```

#### Method 3: NPM Package Installation

```bash
# Install from npm registry
npm install -g obsidian-kit

# Verify installation
obsidian-kit --version
```

### 🏗️ Creating Your First Vault

#### Basic Initialization

```bash
# Create a new project vault
obsidian-kit init my-project
```

This creates:
```
my-project/
├── 1 - Source Materials/
├── 2 - Daily Notes/
├── 3 - Templates/
├── 4 - Projects/
├── agents/
├── .specify/
└── mcp-config.json
```

#### Advanced Initialization Options

```bash
# Initialize in specific directory
obsidian-kit init my-project --dir ~/projects

# Force initialize in existing directory
obsidian-kit init . --force

# Initialize with custom template
obsidian-kit init my-project --template advanced
```

### 🔌 Obsidian Configuration

#### Step 1: Install Required Plugins

1. Open Obsidian
2. Go to **Settings → Community Plugins**
3. Browse and install:
   - **Local REST API**
   - **Dataview**
   - **Templater**
   - **Tasks**

#### Step 2: Configure Local REST API

1. Go to **Settings → Community Plugins → Local REST API**
2. Click **Generate API Key**
3. Set **Port** to `27123`
4. Enable **Allow CORS**
5. Copy the API key for the next step

#### Step 3: Configure Dataview

1. Go to **Settings → Community Plugins → Dataview**
2. Enable **Enable JavaScript Queries**
3. Set **Automatic Query Refresh** to your preference
4. Configure **Dataview Inline Queries** if needed

#### Step 4: Configure Templater

1. Go to **Settings → Community Plugins → Templater**
2. Set **Template Folder** to `3 - Templates`
3. Enable **Trigger Templater on new file creation**
4. Configure other settings as needed

### 🤖 AI Agent Setup

#### Claude Code Integration

```bash
# Add Claude Code agent
obsidian-kit agent add claude-code
```

This creates:
- `agents/claude-code.md` - Claude-specific configuration
- Updates `agents/universal-context.md` - Shared context
- Configures `agents/slash-commands.md` - Standard commands

#### Other AI Agents

```bash
# Add OpenCode (VS Code integration)
obsidian-kit agent add opencode

# Add Cursor AI
obsidian-kit agent add cursor

# Add GitHub Copilot
obsidian-kit agent add copilot
```

#### MCP Server Configuration

```bash
# Configure MCP server
obsidian-kit add-mcp \
  --api-key "your-obsidian-api-key" \
  --vault-name "your-vault-name"
```

This creates `mcp-config.json` with:
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

### 🎯 Your First Workflow

#### Step 1: Create Project Constitution

```bash
# Start with constitution phase
obsidian-kit workflow constitution
```

This creates:
- `.specify/memory/constitution.md` - Project principles
- `.specify/memory/decisions.md` - Decision log

#### Step 2: Project Planning

```bash
# Interactive planning phase
obsidian-kit workflow planning --interactive
```

This creates:
- `.specify/specs/requirements.md` - Project requirements
- `.specify/specs/architecture.md` - Technical architecture

#### Step 3: Generate Tasks

```bash
# Generate tasks from specifications
obsidian-kit generate-tasks

# Break down complex tasks
obsidian-kit breakdown "Implement user authentication" --subtasks 5
```

#### Step 4: Validate and Review

```bash
# Validate all tasks
obsidian-kit validate --all

# Check project status
obsidian-kit status --verbose
```

### 📊 Understanding Your Vault

#### Folder Structure

```
your-vault/
├── 1 - Source Materials/     # Research, docs, references
│   ├── Books/
│   └── Documentation/
├── 2 - Daily Notes/          # Daily task overviews
│   └── Task Overview/
├── 3 - Templates/            # Reusable templates
│   ├── Project Management/
│   └── Tasks/
├── 4 - Projects/             # Active projects
│   ├── Tasks.base           # Central task database
│   └── Project Management Dashboard.md
├── agents/                   # AI agent configurations
│   ├── claude-code.md
│   ├── opencode.md
│   ├── universal-context.md
│   └── slash-commands.md
└── .specify/                 # Specifications
    ├── memory/
    ├── specs/
    └── workflows/
```

#### Key Files

- **Tasks.base**: Central task database with Dataview queries
- **Project Management Dashboard.md**: Real-time project overview
- **universal-context.md**: Shared context for all AI agents
- **constitution.md**: Project principles and decision framework

### 🔄 Daily Workflow

#### Morning Routine

1. **Check Status**: `obsidian-kit status`
2. **Review Tasks**: Open Tasks.base and check today's items
3. **Daily Note**: Create daily note with task overview
4. **Plan Work**: Select tasks for today

#### Work Session

1. **Start Task**: Update task status to "in-progress"
2. **Use AI Agent**: Ask for help with `/help` command
3. **Track Time**: Update time spent on tasks
4. **Document Progress**: Take notes in daily notes

#### Evening Routine

1. **Update Tasks**: Mark completed items
2. **Daily Review**: Review progress and blockers
3. **Plan Tomorrow**: Select tasks for next day
4. **Sync**: `obsidian-kit agent sync`

### 🎯 Next Steps

#### Explore Features
- [[🤖 AI Agent Integration]] - Learn about AI capabilities
- [[📋 Task Management System]] - Master task management
- [[🔄 Workflow Automation]] - Automate your workflows
- [[🧠 Knowledge Graph System]] - Advanced knowledge management

#### Advanced Configuration
- [[⚙️ Configuration Guide]] - Customize your setup
- [[🔌 API Reference]] - Programmatic access
- [[🎓 Tutorial Collection]] - In-depth tutorials

#### Join the Community
- [GitHub Discussions](https://github.com/t3rpz/obsidian-kit/discussions)
- [Community Discord](https://discord.gg/obsidian-kit)
- [Reddit r/ObsidianKit](https://reddit.com/r/obsidiankit)

---

## 🔍 Verification Checklist

### Installation Verification ✅

- [ ] Obsidian Kit CLI installed: `obsidian-kit --version`
- [ ] Node.js version correct: `node --version`
- [ ] Required Obsidian plugins installed
- [ ] Local REST API configured with API key
- [ ] Dataview plugin enabled and working

### Project Setup Verification ✅

- [ ] Vault created with correct structure
- [ ] Tasks.base file exists and has queries
- [ ] Project Management Dashboard loads correctly
- [ ] Agent configuration files created
- [ ] MCP server configured

### AI Integration Verification ✅

- [ ] AI agent added: `obsidian-kit agent list`
- [ ] MCP server connection working
- [ ] Universal context configured
- [ ] Slash commands available
- [ ] Agent responds to basic commands

### Workflow Verification ✅

- [ ] Can create project constitution
- [ ] Can generate tasks from specs
- [ ] Can break down complex tasks
- [ ] Can validate task quality
- [ ] Status command shows correct information

---

## 🆘 Troubleshooting

### Common Issues

#### Command Not Found
```bash
# Check if obsidian-kit is in PATH
which obsidian-kit

# If not found, try reinstalling
npm install -g obsidian-kit

# Restart terminal
source ~/.zshrc  # or ~/.bashrc
```

#### MCP Server Not Connecting
```bash
# Check status
obsidian-kit status --verbose

# Verify API key
cat mcp-config.json

# Restart Claude Desktop
```

#### Tasks Not Showing in Dataview
1. Check Tasks.base exists in `4 - Projects/`
2. Verify task frontmatter format
3. Ensure Dataview plugin is enabled
4. Try refreshing Dataview queries

#### AI Agent Not Responding
1. Check agent configuration files
2. Verify MCP server is running
3. Restart Claude Desktop
4. Check API key validity

### Getting Help

- **Documentation**: [[🔧 Troubleshooting Guide]]
- **FAQ**: [[❓ FAQ]]
- **GitHub Issues**: [Report a problem](https://github.com/t3rpz/obsidian-kit/issues)
- **Community**: [Get help from community](https://github.com/t3rpz/obsidian-kit/discussions)

---

## 🎉 You're Ready!

You now have a fully functional Obsidian Kit vault with:
- ✅ AI-powered task management
- ✅ Automated workflows
- ✅ Knowledge graph integration
- ✅ Semantic search capabilities
- ✅ Health monitoring

**What's next?**
1. Explore [[📚 Tutorial Collection]] for advanced features
2. Customize your setup with [[🎯 Best Practices]]
3. Join the community and share your experience

Happy building with Obsidian Kit! 🚀

---

*Last updated: 2025-10-02 | Version: 1.0.0*