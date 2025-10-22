# 🧠 Obsidian Kit

A CLI tool for setting up Obsidian vaults with AI agent integration, task management, and spec-driven development workflows.

## Features

- **🚀 One-Command Setup**: Initialize project vaults with proven structure
- **🤖 AI Agent Integration**: Single agent per project with MCP server support
- **📋 Task Management**: Built-in project management system with Dataview
- **📝 Spec-Driven Development**: Integrate with spec-kit methodology
- **⚡ Health Monitoring**: Track vault status and AI agent performance

## Quick Start

```bash
# Install Obsidian Kit manually
git clone https://github.com/HomunculusLabs/obsidian-kit.git
cd obsidian-kit
npm install
npm run install-global

# Create your first project
obsidian-kit init my-project
cd my-project

# Configure AI integration
obsidian-kit add-mcp --vault-name my-project

# Check everything is working
obsidian-kit status
```

## Vault Structure

```
project-vault/
├── 1 - Source Materials/     # Books, docs, references
│   ├── Books/
│   └── Documentation/
├── 2 - Daily Notes/          # Daily task overviews
│   └── Task Overview/
├── 3 - Templates/            # Project & task templates
│   ├── Project Management/
│   └── Tasks/
├── 4 - Projects/             # Main project management
│   ├── Tasks.base           # Task database
│   └── Project Management Dashboard.md
├── claude/                   # AI agent configuration
│   └── agents.md
├── .specify/                 # Spec-driven development
│   ├── memory/
│   └── specs/
└── mcp-config.json          # MCP server config
```

## Commands

### `obsidian-kit init [project-name]`
Initialize a new project vault with the complete structure and templates.

Options:
- `-d, --dir <directory>` - Target directory (default: current directory)
- `-f, --force` - Force initialization even if directory is not empty

### `obsidian-kit add-mcp`
Configure Obsidian MCP server for AI agent integration.

Options:
- `-k, --api-key <key>` - Obsidian REST API key
- `-v, --vault-name <name>` - Vault name

### `obsidian-kit status`
Show vault health and AI agent status.

Options:
- `-v, --verbose` - Show detailed status information

## Prerequisites

- **Node.js** 16+
- **Obsidian** with Local REST API plugin
- **Claude Desktop** (for AI agent integration)

## AI Agent Integration

Each vault includes a single AI agent configured for:

- **Project Management**: Task creation, tracking, and completion
- **Documentation**: Writing and maintaining project docs
- **Spec Development**: Creating and updating specifications
- **Research**: Synthesizing information from source materials

The agent operates through the Model Context Protocol (MCP), giving it read/write access to your vault while maintaining security and control.

## Project Management System

Built on proven Dataview-based task management:

- **Tasks.base**: Central task database with smart views
- **Project Dashboard**: Real-time project overview
- **Kanban Boards**: Visual task management
- **Health Monitoring**: Track progress and identify bottlenecks

## Spec-Driven Development

Integrates with spec-kit methodology:

- **Constitution**: Project principles and decision framework
- **Specifications**: Living documents that guide development
- **Memory**: Project context and historical decisions
- **Templates**: Standardized project structures

## Installation

### Manual Installation

```bash
git clone https://github.com/HomunculusLabs/obsidian-kit.git
cd obsidian-kit
npm install
./scripts/install.sh
```

### Development Setup

```bash
git clone https://github.com/HomunculusLabs/obsidian-kit.git
cd obsidian-kit
npm install
npm run dev init test-project
```

## Configuration

### Obsidian Setup

1. Install the **Local REST API** plugin
2. Generate an API key in plugin settings
3. Configure the plugin to run on port 27123

### Claude Desktop Setup

1. Run `obsidian-kit add-mcp` to configure MCP server
2. Restart Claude Desktop
3. The AI agent will have access to your vault

### Vault Health Monitoring

The `status` command provides insights into:

- **MCP Server**: Connection status and configuration
- **AI Agent**: Configuration and activity
- **Task Queue**: Pending, in-progress, and overdue tasks
- **Documentation**: Freshness and completeness
- **Plugin Status**: Required Obsidian plugins

## Templates

### Project Template
- Standard project structure with frontmatter
- Automatic milestone tracking
- Stakeholder management
- Resource linking

### Task Template
- Dataview-compatible frontmatter
- Effort estimation and tracking
- Dependency management
- Automated status updates

## Best Practices

### Project Organization
- Use the 4-folder structure consistently
- Keep source materials organized and linked
- Maintain project specifications in `.specify/`
- Regular health checks with `obsidian-kit status`

### AI Agent Workflow
- Let the agent handle routine documentation
- Use it for task breakdown and planning
- Have it synthesize research from source materials
- Regular review of agent-generated content

### Task Management
- Break work into manageable tasks (2-4 hours)
- Use clear acceptance criteria
- Set realistic due dates
- Review overdue tasks regularly

## Troubleshooting

### Common Issues

**Command not found**
```bash
# Check if ~/.obsidian-kit exists
ls ~/.obsidian-kit

# Restart terminal or source profile
source ~/.zshrc  # or ~/.bashrc
```

**MCP Server not connecting**
```bash
# Check Obsidian plugin status
obsidian-kit status -v

# Verify API key configuration
cat mcp-config.json
```

**Tasks not showing in Dataview**
- Ensure Tasks.base file exists in `4 - Projects/`
- Check that task files have proper frontmatter
- Verify Dataview plugin is installed and enabled

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 🐛 Issues: [GitHub Issues](https://github.com/HomunculusLabs/obsidian-kit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/HomunculusLabs/obsidian-kit/discussions)

---

*Built with ❤️ for the Obsidian and AI community*