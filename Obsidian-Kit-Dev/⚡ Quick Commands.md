---
title: "⚡ Quick Commands"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["commands", "cli", "reference", "cheatsheet", "obsidian-kit"]
---

# ⚡ Obsidian Kit Quick Commands

Complete CLI command reference with examples, options, and use cases for Obsidian Kit.

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Project Management](#project-management)
3. [Task Management](#task-management)
4. [AI Agent Commands](#ai-agent-commands)
5. [Workflow Commands](#workflow-commands)
6. [Knowledge & Search](#knowledge--search)
7. [Integration & Configuration](#integration--configuration)
8. [Development & Testing](#development--testing)
9. [Maintenance & Utilities](#maintenance--utilities)
10. [Advanced Usage](#advanced-usage)

---

## 🚀 Installation & Setup

### **Global Installation**
```bash
# Install globally
npm install -g obsidian-kit

# Verify installation
obsidian-kit --version

# Check system requirements
obsidian-kit doctor
```

### **Project Initialization**
```bash
# Basic project setup
obsidian-kit init my-project

# With custom directory
obsidian-kit init my-project --dir ~/projects

# With specific template
obsidian-kit init my-project --template agile

# Force overwrite existing directory
obsidian-kit init my-project --force

# Interactive setup
obsidian-kit init my-project --interactive
```

### **Development Setup**
```bash
# Clone repository
git clone https://github.com/t3rpz/obsidian-kit.git
cd obsidian-kit

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Install globally from source
npm run install-global
```

---

## 📊 Project Management

### **Project Status & Health**
```bash
# Check overall system status
obsidian-kit status

# Detailed status with JSON output
obsidian-kit status --verbose --json

# Check specific components
obsidian-kit status --section vault
obsidian-kit status --section agents
obsidian-kit status --section tasks

# Health check with recommendations
obsidian-kit doctor
```

### **Project Configuration**
```bash
# Show current configuration
obsidian-kit config --show

# Set configuration value
obsidian-kit config set features.task_management.enabled true

# Get configuration value
obsidian-kit config get features.task_management.enabled

# Reset configuration to defaults
obsidian-kit config reset

# Validate configuration
obsidian-kit config validate
```

### **Project Templates**
```bash
# List available templates
obsidian-kit templates list

# Show template details
obsidian-kit templates show agile

# Create project from template
obsidian-kit init my-project --template agile

# Create custom template
obsidian-kit templates create my-template --source ./my-project

# Export template
obsidian-kit templates export my-template --output my-template.zip
```

---

## ✅ Task Management

### **Task Creation & Breakdown**
```bash
# AI-powered task breakdown
obsidian-kit breakdown "Implement user authentication system"

# With specific number of subtasks
obsidian-kit breakdown "Design database schema" --subtasks 6

# With effort level
obsidian-kit breakdown "Write documentation" --effort high

# Dry run (preview without creating)
obsidian-kit breakdown "Plan sprint 2" --dry-run

# Output as JSON
obsidian-kit breakdown "Fix critical bugs" --output json
```

### **Task Validation & Quality**
```bash
# Validate specific task
obsidian-kit validate "4 - Projects/task.md"

# Validate all tasks
obsidian-kit validate --all

# With specific validation rules
obsidian-kit validate --rules completeness,acceptance-criteria

# Output validation report
obsidian-kit validate --output json --file validation-report.json
```

### **Automated Task Generation**
```bash
# Generate from specifications
obsidian-kit generate-tasks --source specification

# Generate from code changes
obsidian-kit generate-tasks --source git-diff

# Generate from user stories
obsidian-kit generate-tasks --source user-stories

# Limit number of tasks
obsidian-kit generate-tasks --limit 10

# Dry run preview
obsidian-kit generate-tasks --dry-run
```

### **Task Search & Query**
```bash
# Search tasks by keyword
obsidian-kit tasks search "authentication"

# Filter by status
obsidian-kit tasks list --status todo

# Filter by priority
obsidian-kit tasks list --priority high

# Filter by project
obsidian-kit tasks list --project "User Management"

# Filter by assignee
obsidian-kit tasks list --assignee "john.doe"

# Overdue tasks
obsidian-kit tasks list --overdue

# Due this week
obsidian-kit tasks list --due-this-week
```

---

## 🤖 AI Agent Commands

### **Agent Management**
```bash
# List configured agents
obsidian-kit agent list

# List with detailed information
obsidian-kit agent list --verbose

# List as JSON
obsidian-kit agent list --json

# Filter by agent type
obsidian-kit agent list --type claude-code
```

### **Agent Configuration**
```bash
# Add Claude Code agent
obsidian-kit agent add claude-code

# Add OpenCode agent
obsidian-kit agent add opencode

# Add with custom configuration
obsidian-kit agent add cursor --config ./custom-config.json

# Configure existing agent
obsidian-kit agent configure claude-code

# Reset agent configuration
obsidian-kit agent configure claude-code --reset
```

### **Agent Operations**
```bash
# Sync all agents
obsidian-kit agent sync --all

# Sync specific agent
obsidian-kit agent sync --type claude-code

# Force sync even if up-to-date
obsidian-kit agent sync --all --force

# Test agent connectivity
obsidian-kit agent test claude-code

# Get agent status
obsidian-kit agent status claude-code
```

### **Enhanced Agent Intelligence**
```bash
# Enhance agent with context
obsidian-kit enhanced-agent enhance --context "project-management"

# Analyze current project
obsidian-kit enhanced-agent analyze --project current

# Generate insights report
obsidian-kit enhanced-agent report --format json

# Update agent knowledge
obsidian-kit enhanced-agent learn --from "4 - Projects"

# Optimize agent performance
obsidian-kit enhanced-agent optimize --agent claude-code
```

---

## 🔄 Workflow Commands

### **Workflow Execution**
```bash
# Run spec-driven development workflow
obsidian-kit workflow spec-driven

# Interactive workflow mode
obsidian-kit workflow interactive

# Enhanced workflow with template
obsidian-kit workflow enhanced --template feature-development

# Dry run workflow
obsidian-kit workflow spec-driven --dry-run

# Continue interrupted workflow
obsidian-kit workflow continue --session-id abc123
```

### **Workflow Phases**
```bash
# Constitution phase
obsidian-kit workflow constitution

# Planning phase
obsidian-kit workflow planning

# Development phase
obsidian-kit workflow development

# Documentation phase
obsidian-kit workflow documentation

# Run specific phase with options
obsidian-kit workflow development --breakdown-depth 4
```

### **Workflow Templates**
```bash
# List workflow templates
obsidian-kit workflow templates list

# Show template details
obsidian-kit workflow templates show agile-sprint

# Create custom workflow
obsidian-kit workflow create my-workflow --phases planning,development,testing

# Execute custom workflow
obsidian-kit workflow execute my-workflow
```

### **Workflow State Management**
```bash
# Show workflow state
obsidian-kit workflow state

# Save workflow state
obsidian-kit workflow state save --checkpoint "before-testing"

# Restore workflow state
obsidian-kit workflow state restore --checkpoint "before-testing"

# List checkpoints
obsidian-kit workflow state list-checkpoints

# Clear workflow state
obsidian-kit workflow state clear
```

---

## 🔍 Knowledge & Search

### **Semantic Search**
```bash
# Basic semantic search
obsidian-kit semantic-search "AI task management"

# Search specific content type
obsidian-kit semantic-search "user authentication" --type tasks

# Search with limit
obsidian-kit semantic-search "database design" --limit 5

# Search with similarity threshold
obsidian-kit semantic-search "API documentation" --threshold 0.8

# Output as JSON
obsidian-kit semantic-search "project planning" --output json
```

### **Knowledge Graph Operations**
```bash
# Visualize knowledge graph
obsidian-kit knowledge-graph --visualize

# Query knowledge graph
obsidian-kit knowledge-graph --query "entities:AI"

# Find connections
obsidian-kit knowledge-graph --connections "task management"

# Generate insights
obsidian-kit knowledge-graph --insights

# Export graph data
obsidian-kit knowledge-graph --export --format json
```

### **Knowledge Extraction**
```bash
# Extract from specific file
obsidian-kit knowledge-extract "4 - Projects/project-overview.md"

# Extract from directory
obsidian-kit knowledge-extract --directory "4 - Projects"

# Extract with specific entities
obsidian-kit knowledge-extract --entities tasks,projects,people

# Batch extraction
obsidian-kit knowledge-extract --batch --source "4 - Projects"
```

### **Learning Capture**
```bash
# Analyze learning patterns
obsidian-kit learning-capture --analyze

# Generate recommendations
obsidian-kit learning-capture --recommend

# Create learning report
obsidian-kit learning-capture --report --format markdown

# Capture from specific period
obsidian-kit learning-capture --from "2025-09-01" --to "2025-09-30"
```

---

## 🔌 Integration & Configuration

### **MCP Server Setup**
```bash
# Add MCP server configuration
obsidian-kit add-mcp

# With custom API key
obsidian-kit add-mcp --api-key "your-api-key"

# With custom vault name
obsidian-kit add-mcp --vault-name "MyVault"

# With custom port
obsidian-kit add-mcp --port 27124

# With custom configuration file
obsidian-kit add-mcp --config ./custom-mcp.json
```

### **Plugin Management**
```bash
# List required plugins
obsidian-kit plugins list --required

# List installed plugins
obsidian-kit plugins list --installed

# Check plugin compatibility
obsidian-kit plugins check-compatibility

# Install missing plugins
obsidian-kit plugins install --missing

# Update plugins
obsidian-kit plugins update --all
```

### **Configuration Management**
```bash
# Show current configuration
obsidian-kit config show

# Export configuration
obsidian-kit config export --file obsidian-config.json

# Import configuration
obsidian-kit config import --file obsidian-config.json

# Merge configuration
obsidian-kit config merge --file additional-config.json

# Validate configuration
obsidian-kit config validate
```

---

## 🛠️ Development & Testing

### **Quality Checks**
```bash
# Run all quality checks
npm run check-quality

# Lint code
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format

# Check formatting
npm run format:check
```

### **Testing**
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run performance tests
npm run test:performance

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Comprehensive test suite
npm run test:comprehensive
```

### **Build & Deployment**
```bash
# Build project
npm run build

# Clean build artifacts
npm run clean

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Rollback deployment
npm run rollback --version 1.0.0

# List rollback history
npm run rollback:list

# Show rollback history
npm run rollback:history
```

---

## 🔧 Maintenance & Utilities

### **System Maintenance**
```bash
# Clean up temporary files
obsidian-kit cleanup --temp

# Archive completed tasks
obsidian-kit cleanup --archive-completed

# Optimize database
obsidian-kit optimize --database

# Rebuild search indices
obsidian-kit rebuild-index

# Clear cache
obsidian-kit clear-cache
```

### **Backup & Recovery**
```bash
# Create backup
obsidian-kit backup --full

# Incremental backup
obsidian-kit backup --incremental

# Backup specific directory
obsidian-kit backup --directory "4 - Projects"

# Restore from backup
obsidian-kit restore --backup-file backup-2025-10-02.zip

# List backups
obsidian-kit backup list
```

### **Performance Monitoring**
```bash
# Check performance metrics
obsidian-kit performance check

# Monitor in real-time
obsidian-kit performance monitor --real-time

# Generate performance report
obsidian-kit performance report --format html

# Benchmark system
obsidian-kit performance benchmark
```

### **Diagnostics**
```bash
# System diagnostics
obsidian-kit doctor

# Network diagnostics
obsidian-kit doctor --network

# Plugin diagnostics
obsidian-kit doctor --plugins

# Agent diagnostics
obsidian-kit doctor --agents

# Full diagnostic report
obsidian-kit doctor --full --output diagnostic-report.json
```

---

## 🎯 Advanced Usage

### **Command Chaining**
```bash
# Chain multiple commands
obsidian-kit breakdown "New feature" && obsidian-kit validate --all

# Pipeline operations
obsidian-kit generate-tasks --source specification | obsidian-kit validate --stdin

# Conditional execution
obsidian-kit status --json | jq '.vault.health == "healthy"' && obsidian-kit backup --full
```

### **Batch Operations**
```bash
# Batch task creation
for task in "Task 1" "Task 2" "Task 3"; do
  obsidian-kit breakdown "$task" --subtasks 2
done

# Batch validation
find "4 - Projects" -name "*.md" -exec obsidian-kit validate {} \;

# Batch processing
obsidian-kit batch --commands "validate,backup,cleanup" --project "MyProject"
```

### **Scripting & Automation**
```bash
# Create automation script
cat > automate.sh << 'EOF'
#!/bin/bash
obsidian-kit status
obsidian-kit validate --all
obsidian-kit backup --incremental
obsidian-kit cleanup --temp
EOF

# Make executable
chmod +x automate.sh

# Run automation
./automate.sh
```

### **Configuration Templates**
```bash
# Create configuration template
obsidian-kit config template create my-template

# Apply configuration template
obsidian-kit config template apply my-template

# List configuration templates
obsidian-kit config template list
```

---

## 📊 Command Output Formats

### **JSON Output**
```bash
# Most commands support --json flag
obsidian-kit status --json
obsidian-kit tasks list --output json
obsidian-kit agent list --json
```

### **Markdown Output**
```bash
# Generate markdown reports
obsidian-kit performance report --format markdown
obsidian-kit learning-capture --report --format markdown
```

### **CSV Output**
```bash
# Export data as CSV
obsidian-kit tasks list --output csv --file tasks.csv
obsidian-kit semantic-search "query" --output csv
```

### **HTML Output**
```bash
# Generate HTML reports
obsidian-kit performance report --format html --file report.html
obsidian-kit doctor --full --output html --file diagnostics.html
```

---

## 🔧 Environment Variables

### **Configuration**
```bash
# Set API key
export OBSIDIAN_API_KEY="your-api-key"

# Set vault path
export OBSIDIAN_VAULT_PATH="/path/to/vault"

# Set log level
export OBSIDIAN_LOG_LEVEL="debug"

# Set configuration file
export OBSIDIAN_CONFIG_FILE="./obsidian-config.json"
```

### **Development**
```bash
# Development mode
export OBSIDIAN_DEV=true

# Test environment
export OBSIDIAN_ENV=test

# Debug mode
export OBSIDIAN_DEBUG=true
```

---

## 📝 Command Aliases

### **Common Aliases**
```bash
# Create aliases for frequently used commands
alias ok='obsidian-kit'
alias ok-status='obsidian-kit status'
alias ok-tasks='obsidian-kit tasks list'
alias ok-search='obsidian-kit semantic-search'
alias ok-backup='obsidian-kit backup --full'
```

### **Shell Functions**
```bash
# Advanced shell function
ok-project() {
  local project_name=$1
  obsidian-kit init "$project_name" --template agile
  cd "$project_name"
  obsidian-kit agent add claude-code
  obsidian-kit status
}
```

---

## 🚨 Error Handling

### **Common Exit Codes**
- `0`: Success
- `1`: General error
- `2`: Invalid arguments
- `3`: File not found
- `4`: Permission denied
- `5`: Network error
- `6`: Configuration error

### **Troubleshooting Commands**
```bash
# Check system health
obsidian-kit doctor --full

# Validate configuration
obsidian-kit config validate

# Check logs
obsidian-kit logs --tail 50

# Reset to defaults
obsidian-kit config reset --force
```

---

## 📈 Performance Tips

### **Optimization Commands**
```bash
# Optimize performance
obsidian-kit optimize --all

# Clear cache for better performance
obsidian-kit clear-cache --all

# Rebuild indices for faster search
obsidian-kit rebuild-index --force
```

### **Monitoring**
```bash
# Monitor resource usage
obsidian-kit performance monitor --resources

# Check response times
obsidian-kit performance benchmark --response-time

# Generate performance report
obsidian-kit performance report --detailed
```

---

## 🔗 Quick Reference Card

### **Essential Commands**
```bash
obsidian-kit init <project>          # Initialize project
obsidian-kit status                  # Check system status
obsidian-kit breakdown <task>        # AI task breakdown
obsidian-kit validate --all          # Validate all tasks
obsidian-kit agent add <type>        # Add AI agent
obsidian-kit workflow spec-driven    # Run workflow
obsidian-kit semantic-search <query> # Semantic search
obsidian-kit backup --full           # Create backup
```

### **Common Options**
```bash
--help                              # Show help
--version                           # Show version
--verbose                           # Verbose output
--json                              # JSON output
--dry-run                           # Preview without execution
--force                             # Force operation
--config <file>                     # Custom config file
```

---

## 📞 Getting Help

### **Built-in Help**
```bash
# General help
obsidian-kit --help

# Command-specific help
obsidian-kit init --help
obsidian-kit breakdown --help
obsidian-kit agent --help
```

### **Community Support**
- GitHub Issues: [Report bugs and request features](https://github.com/t3rpz/obsidian-kit/issues)
- GitHub Discussions: [Community discussions](https://github.com/t3rpz/obsidian-kit/discussions)
- Documentation: [Full documentation](https://github.com/t3rpz/obsidian-kit)

---

*Last updated: 2025-10-02 | Commands: 100+ | Categories: 10*

**Need more help?** Check [[🔧 Troubleshooting Guide]] or [[❓ FAQ]] for common issues and solutions.