---
title: "🔧 Quick Reference Guide"
status: "active"
priority: "high"
project: "Obsidian-Kit-Dev"
created_date: "2025-10-02"
tags:
  - reference
  - commands
  - quick-start
  - cheatsheet
---

# 🔧 Quick Reference Guide

## 🚀 Essential Commands

### 📋 Task Management
```bash
# AI-powered task breakdown
obsidian-kit breakdown "Implement new feature" --subtasks 4

# Validate task quality
obsidian-kit validate --all

# Generate tasks from specifications
obsidian-kit generate-tasks --dry-run

# Check system status
obsidian-kit status
```

### ⚙️ Workflow Automation
```bash
# Spec-driven development
obsidian-kit workflow spec-driven

# Interactive workflow mode
obsidian-kit workflow interactive

# Enhanced workflow with templates
obsidian-kit workflow enhanced --template "feature-development"
```

### 🔍 Knowledge & Search
```bash
# Semantic search
obsidian-kit semantic-search "AI task management" --type tasks

# Knowledge graph operations
obsidian-kit knowledge-graph --visualize
obsidian-kit knowledge-graph --query "entities:AI"

# Learning capture
obsidian-kit learning-capture --analyze --recommend
```

### 🤖 AI & Intelligence
```bash
# Enhanced agent operations
obsidian-kit enhanced-agent enhance --context "project-management"
obsidian-kit enhanced-agent analyze --project "current"
obsidian-kit enhanced-agent report --format json

# AI task management insights
obsidian-kit ai-tasks --insights --predict
```

### 🛠️ Development & Deployment
```bash
# Setup development environment
npm run dev-setup

# Quality checks
npm run check-quality

# Run tests
npm test
npm run test:coverage

# Deployment
npm run deploy:staging
npm run deploy:production
npm run rollback --version 1.0.0
```

---

## 📊 File Structure Reference

```
Obsidian-Kit-Dev/
├── 📚 Documentation Hub.md          # Main documentation index
├── 🔧 Quick Reference Guide.md       # This file
├── 📊 Project Status Dashboard.md   # Current project status
├── 1 - Inbox/                       # Quick capture and notes
├── 2 - Areas/                       # Life areas and categories
├── 3 - Templates/                   # Note and task templates
├── 4 - Projects/                    # Active projects
│   ├── Task-Management-Intelligence/
│   ├── Workflow-Automation/
│   ├── Knowledge-Integration/
│   └── Obsidian-Kit-Dev/
├── 5 - Resources/                   # Reference materials
├── 6 - Archive/                     # Completed projects
├── 7 - Daily Notes/                 # Daily journal entries
├── 8 - Reviews/                     # Weekly/monthly reviews
└── 9 - System/                      # Meta-system and configuration
```

---

## 🎯 Task Templates

### 📋 Standard Task Template
```yaml
---
title: "Task Title"
status: "todo"  # todo, in-progress, review, completed, cancelled
priority: "medium"  # low, medium, high, critical
project: "[[Project Name]]"
assignee: "me"
due_date: "YYYY-MM-DD"
created_date: "YYYY-MM-DD"
completed_date: ""
time_estimate: 120  # minutes
time_spent: 0
dependencies: []
subtasks: []
tags:
  - task
---
```

### 🚀 Feature Task Template
```yaml
---
title: "Implement [Feature Name]"
status: "todo"
priority: "high"
project: "[[Project Name]]"
time_estimate: 240
dependencies:
  - "[[Prerequisite Task]]"
subtasks:
  - "Research and design"
  - "Core implementation"
  - "Testing and validation"
  - "Documentation"
tags:
  - task
  - feature
  - development
---
```

---

## 🔍 Search Patterns

### 📝 Dataview Queries
```dataview
TABLE 
  status as "Status",
  priority as "Priority", 
  due_date as "Due Date"
FROM #task 
WHERE status != "completed"
SORT priority DESC, due_date ASC
```

### 🏷️ Tag-Based Search
- `#task` - All tasks
- `#project` - Project-related items
- `#idea` - Ideas and brainstorming
- `#reference` - Reference materials
- `#meeting` - Meeting notes

### 🔗 Link-Based Navigation
- `[[Project Name]]` - Jump to project
- `[[Person Name]]` - View person-related items
- `[[Technology Name]]` - Find tech-related content

---

## ⚡ Quick Workflows

### 🆕 New Project Setup
1. Create project folder in `4 - Projects/`
2. Copy project template from `3 - Templates/Project Management/`
3. Create project dashboard and task list
4. Set up project-specific tags and areas
5. Link to relevant resources and people

### 📅 Daily Planning
1. Open today's daily note in `7 - Daily Notes/`
2. Check `📊 Project Status Dashboard` for priorities
3. Review `[[🔧 Quick Reference Guide]]` for commands
4. Plan tasks using `obsidian-kit breakdown`
5. Track progress throughout the day

### 📊 Weekly Review
1. Check `obsidian-kit status` for system health
2. Review completed tasks and lessons learned
3. Update project dashboards with progress
4. Plan next week's priorities
5. Run `obsidian-kit learning-capture --analyze`

---

## 🛠️ Troubleshooting

### 🔧 Common Issues

#### Tasks not showing in views
```bash
# Check Dataview queries
obsidian-kit validate --dataview

# Rebuild task index
obsidian-kit rebuild-index
```

#### CLI commands not working
```bash
# Check installation
obsidian-kit --version

# Reinstall if needed
npm install -g obsidian-kit

# Check environment
npm run check-quality
```

#### Search not finding results
```bash
# Rebuild search index
obsidian-kit semantic-search --rebuild

# Check knowledge graph
obsidian-kit knowledge-graph --status
```

### 📞 Getting Help
- [[🔧 Troubleshooting Guide]] - Detailed solutions
- [[❓ FAQ]] - Common questions
- [[📚 Tutorial Collection]] - Step-by-step guides
- GitHub Issues - Report bugs and request features

---

## 🎯 Keyboard Shortcuts

### 📝 Obsidian Shortcuts
- `Ctrl/Cmd + N` - New note
- `Ctrl/Cmd + O` - Open file
- `Ctrl/Cmd + Shift + F` - Search
- `Ctrl/Cmd + G` - Graph view
- `Ctrl/Cmd + E` - Edit/Read mode

### 🔧 Command Palette
- `Ctrl/Cmd + P` - Open command palette
- Type "Obsidian Kit" to see available commands
- Use arrow keys to navigate, Enter to select

---

## 📈 Performance Tips

### ⚡ Optimization
- Keep daily notes concise (< 500 words)
- Use tags consistently for better search
- Archive completed projects regularly
- Run `obsidian-kit status` weekly for health checks

### 🗄️ Maintenance
```bash
# Weekly maintenance
obsidian-kit cleanup --archive-completed
obsidian-kit optimize --rebuild-indices
obsidian-kit backup --full
```

---

## 🔗 Quick Links

### 📚 Essential Documentation
- [[📚 Documentation Hub]] - All documentation
- [[📘 Getting Started Guide]] - New user guide
- [[👤 User Guide]] - Comprehensive manual
- [[🔌 API Reference]] - Technical documentation

### 🎯 Active Projects
- [[Task-Management-Intelligence]] - AI task management
- [[Workflow-Automation]] - Automated workflows
- [[Knowledge-Integration]] - Knowledge graphs and search
- [[Obsidian-Kit-Dev]] - System development

### 🛠️ System Tools
- [[Tasks.base]] - Task database configuration
- [[Project Management Dashboard]] - Project overview
- [[Test-Dataview]] - Dataview testing ground

---

*Last updated: 2025-10-02 | Version: v2.0.0-alpha*