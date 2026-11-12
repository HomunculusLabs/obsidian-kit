---
title: "❓ FAQ"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["faq", "questions", "answers", "help"]
---

# ❓ Obsidian Kit Frequently Asked Questions

Common questions and answers about Obsidian Kit's features, usage, and troubleshooting.

## 📋 Table of Contents

1. [General Questions](#general-questions)
2. [Installation & Setup](#installation--setup)
3. [Task Management](#task-management)
4. [AI Agent Integration](#ai-agent-integration)
5. [Obsidian Integration](#obsidian-integration)
6. [Technical Questions](#technical-questions)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)
9. [Community & Support](#community--support)

---

## 🎯 General Questions

### Q: What makes Obsidian Kit different from other project management tools?

**A**: Obsidian Kit combines several unique capabilities:

1. **Knowledge Graph Integration**: Leverages Obsidian's powerful linking and graph capabilities to create a living knowledge base connected to your tasks
2. **AI-Powered Intelligence**: Multiple AI agents work together to provide contextual assistance, automate workflows, and generate insights
3. **Spec-Driven Development**: Built-in methodology for turning specifications into actionable tasks
4. **Local-First Approach**: Everything runs locally on your machine with full control over your data
5. **Extensible Architecture**: Plugin system and APIs for customization and integration

Unlike traditional tools that separate knowledge management from task management, Obsidian Kit unifies them in a single, interconnected system.

---

### Q: Can I use Obsidian Kit without AI agents?

**A**: Yes! All core features work without AI integration:

- ✅ Task management with Dataview
- ✅ Project structuring and organization
- ✅ Workflow automation
- ✅ Knowledge graph capabilities
- ✅ Documentation generation
- ✅ Health monitoring

AI agents enhance the experience but aren't required for core functionality. You can add them later if needed.

---

### Q: Is my data secure with Obsidian Kit?

**A**: Yes, Obsidian Kit is designed with security in mind:

1. **Local Storage**: All data is stored locally on your machine
2. **No Cloud Dependencies**: Core functionality works without internet
3. **Controlled AI Access**: AI agents only access what you explicitly configure through MCP
4. **Open Source**: Full transparency in code and operations
5. **API Key Control**: You manage all API keys and connections

AI agents only access files through the Model Context Protocol (MCP), which you configure and control.

---

### Q: What's the relationship between Obsidian Kit and Obsidian?

**A**: Obsidian Kit is built on top of Obsidian:

- **Obsidian**: The note-taking app with linking, graph view, and plugins
- **Obsidian Kit**: A CLI tool and system that creates structured vaults and adds AI-powered project management

Think of Obsidian as the foundation and Obsidian Kit as the specialized system built on that foundation for project management and AI integration.

---

## 🚀 Installation & Setup

### Q: What are the system requirements?

**A**: Minimum requirements:

- **Node.js**: Version 16 or higher (LTS recommended)
- **Obsidian**: Latest version with community plugins
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 500MB for Obsidian Kit + space for your vault

**Optional for AI features**:
- **Claude Desktop**: For AI agent integration
- **Internet Connection**: For AI API calls

---

### Q: How do I install Obsidian Kit?

**A**: Three installation methods:

**1. Automatic Installation (Recommended)**:
```bash
curl -sSL https://raw.githubusercontent.com/t3rpz/obsidian-kit/main/scripts/install.sh | bash
```

**2. NPM Installation**:
```bash
npm install -g obsidian-kit
```

**3. Manual Installation**:
```bash
git clone https://github.com/t3rpz/obsidian-kit.git
cd obsidian-kit
npm install
npm run build
npm run install-global
```

---

### Q: Which Obsidian plugins do I need?

**A**: Required plugins (install from Community Plugins):

1. **Local REST API**: For AI agent communication
2. **Dataview**: For task queries and database functionality
3. **Templater**: For template processing
4. **Tasks**: For enhanced task management

**Optional but recommended**:
- **Obsidian Git**: For version control
- **Calendar**: For date-based planning
- **Kanban**: For visual task management

---

### Q: How do I configure the Local REST API plugin?

**A**: Step-by-step configuration:

1. **Install Plugin**: Settings → Community Plugins → Local REST API
2. **Generate API Key**: Click "Generate API Key" in plugin settings
3. **Set Port**: Configure port to `27123` (default)
4. **Enable CORS**: Check "Allow CORS" for AI agent access
5. **Test Connection**: 
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:27123/
```

6. **Configure Obsidian Kit**:
```bash
obsidian-kit add-mcp --api-key YOUR_API_KEY --vault-name YOUR_VAULT_NAME
```

---

## 📋 Task Management

### Q: Why aren't my tasks showing in Dataview queries?

**A**: Common causes and solutions:

**1. Wrong Location**:
- Tasks must be in `4 - Projects/` folder
- Check: `ls -la "4 - Projects/Tasks.base"`

**2. Incorrect Frontmatter**:
```yaml
# ❌ Missing required fields
---
title: "Task"
status: "todo"
---

# ✅ Complete frontmatter
---
title: "Task Title"
status: "todo"
priority: "medium"
project: "Project Name"
created_date: "2025-10-02"
time_estimate: 3600
tags:
  - task
---
```

**3. Dataview Not Enabled**:
- Enable Dataview plugin
- Check "Enable JavaScript Queries"
- Restart Obsidian

**4. Query Syntax Error**:
```dataview
# ❌ Wrong syntax
FROM "4 - Projects" WHERE status = "todo"

# ✅ Correct syntax
FROM "4 - Projects" WHERE status = "todo"
```

---

### Q: How do I create effective tasks?

**A**: Follow these best practices:

**1. Clear, Specific Titles**:
```yaml
title: "Implement user authentication with JWT"  # ✅ Specific
title: "Auth stuff"  # ❌ Vague
```

**2. Proper Time Estimates**:
- Break tasks into 2-4 hour chunks
- Be realistic about complexity
- Include buffer time

**3. Clear Acceptance Criteria**:
```yaml
acceptance_criteria:
  - Users can register with email and password
  - Login works with valid credentials
  - Passwords are securely hashed
  - Session management implemented
```

**4. Appropriate Priorities**:
- `critical`: Blocks other work
- `high`: Important for timeline
- `medium`: Normal priority
- `low`: Nice to have

---

### Q: How do task dependencies work?

**A**: Task dependencies help manage workflow:

**1. Define Dependencies**:
```yaml
dependencies:
  - "Setup Database Schema"
  - "Design User Model"
```

**2. Dependency Types**:
- **Blocking**: Must be completed first
- **Related**: Similar work, can be parallel
- **Sequential**: Part of a sequence

**3. Visualize Dependencies**:
```dataview
TABLE 
  status,
  dependencies as "Depends On"
FROM "4 - Projects"
WHERE contains(dependencies, "Task Name")
```

**4. Manage Dependencies**:
- Use `obsidian-kit validate` to check for circular dependencies
- Update dependencies when tasks change
- Use dependency views for planning

---

### Q: How do I handle recurring tasks?

**A**: Several approaches for recurring tasks:

**1. Template-Based**:
- Create task template for recurring items
- Duplicate and update dates as needed

**2. Automated Generation**:
```bash
# Generate recurring tasks
obsidian-kit generate-tasks --source recurring
```

**3. Calendar Integration**:
- Use Obsidian Calendar plugin
- Link calendar events to tasks

**4. Custom Scripts**:
```javascript
// Example: Generate weekly review task
const weeklyReview = {
  title: "Weekly Review",
  status: "todo",
  priority: "medium",
  due_date: getNextFriday(),
  recurring: "weekly"
};
```

---

## 🤖 AI Agent Integration

### Q: Which AI agents are supported?

**A**: Currently supported agents:

**1. Claude Code**:
- Best for: Complex reasoning, documentation
- Model: Claude 3 Sonnet
- Strengths: Long-form content, technical writing

**2. OpenCode**:
- Best for: VS Code integration
- Strengths: Real-time assistance, code completion

**3. Cursor**:
- Best for: AI-assisted coding
- Strengths: Code generation, debugging

**4. GitHub Copilot**:
- Best for: GitHub integration
- Strengths: Code suggestions, PR assistance

**Adding Multiple Agents**:
```bash
obsidian-kit agent add claude-code
obsidian-kit agent add opencode
obsidian-kit agent add cursor
```

---

### Q: How do I improve AI agent responses?

**A**: Optimize AI agent performance:

**1. Update Universal Context**:
```markdown
# agents/universal-context.md

## Project Overview
- **Name**: Clear project name
- **Description**: Detailed project description
- **Goals**: Specific, measurable goals
- **Current Status**: Recent progress and blockers

## Team Structure
- **Roles**: Clear role definitions
- **Responsibilities**: Specific responsibilities
- **Communication**: How team communicates

## Current Priorities
- **Active Tasks**: Current important tasks
- **Deadlines**: Upcoming deadlines
- **Blockers**: Current impediments
```

**2. Use Specific Commands**:
```bash
# ❌ Vague
/help

# ✅ Specific
/help with breaking down user authentication task
```

**3. Provide Context**:
```bash
/research "microservices patterns" context: "e-commerce project, Node.js"
```

**4. Give Feedback**:
- Rate AI responses
- Correct misunderstandings
- Update context based on interactions

---

### Q: Can I use multiple AI agents simultaneously?

**A**: Yes! You can configure and use multiple agents:

**1. Add Multiple Agents**:
```bash
obsidian-kit agent add claude-code
obsidian-kit agent add opencode
obsidian-kit agent add cursor
```

**2. Switch Between Agents**:
```bash
# List available agents
obsidian-kit agent list

# Use specific agent for task
obsidian-kit agent use claude-code "complex documentation task"
obsidian-kit agent use cursor "code debugging task"
```

**3. Agent Specialization**:
- **Claude Code**: Documentation, architecture, planning
- **Cursor**: Code generation, debugging
- **OpenCode**: VS Code integration, real-time help
- **Copilot**: GitHub integration, code suggestions

**4. Unified Context**:
All agents share the same universal context, ensuring consistency across different AI tools.

---

### Q: How secure are AI agents with my data?

**A**: AI agent security features:

**1. Local Control**:
- All data stays on your machine
- AI agents access files through MCP only
- You control what agents can access

**2. MCP Security**:
- Model Context Protocol provides controlled access
- File permissions enforced
- Audit logging of all access

**3. API Key Management**:
- You control all API keys
- Keys stored locally in configuration
- Can rotate keys at any time

**4. Data Minimization**:
- Only relevant context sent to AI
- No data stored by AI providers
- Session-based interactions

**5. Transparency**:
- Open source code
- Clear documentation of data flow
- Community review of security practices

---

## 🔍 Obsidian Integration

### Q: Can I use Obsidian Kit with existing vaults?

**A**: Yes, you can add Obsidian Kit to existing vaults:

**1. Add Structure to Existing Vault**:
```bash
cd /path/to/your/existing-vault
obsidian-kit init . --force
```

**2. Manual Integration**:
- Create the 4-folder structure
- Add Tasks.base to `4 - Projects/`
- Copy agent configurations
- Set up MCP server

**3. Migrate Existing Content**:
- Organize existing notes into 4-folder structure
- Add frontmatter to task-like notes
- Update links and references

**4. Backup First**:
```bash
cp -r your-vault your-vault-backup
```

---

### Q: How does Obsidian Kit work with Obsidian Sync?

**A**: Obsidian Kit is fully compatible with Obsidian Sync:

**1. Sync Compatibility**:
- All Obsidian Kit files sync normally
- Configuration files included
- Agent configurations synced

**2. Considerations**:
- Large vaults may have sync delays
- AI agent configurations need to be set up per device
- MCP server configuration may need adjustment per device

**3. Best Practices**:
- Test sync after major changes
- Keep vault size reasonable
- Regular backups recommended

**4. Multi-Device Setup**:
```bash
# On each device
obsidian-kit add-mcp --api-key YOUR_KEY --vault-name VAULT_NAME
```

---

### Q: Which Obsidian plugins work best with Obsidian Kit?

**A**: Recommended plugin combinations:

**Core Required**:
- Local REST API (AI integration)
- Dataview (task queries)
- Templater (templates)
- Tasks (enhanced task management)

**Highly Recommended**:
- Obsidian Git (version control)
- Calendar (date planning)
- Kanban (visual task management)
- Quick Switcher (navigation)

**Optional Enhancements**:
- Advanced Tables (data presentation)
- Excalidraw (diagrams)
- Tag Wrangler (tag management)
- Folder Note (organization)

**Plugin Conflicts to Avoid**:
- Multiple task management plugins
- Conflicting hotkeys
- Heavy resource plugins in large vaults

---

## 🔧 Technical Questions

### Q: What programming languages does Obsidian Kit use?

**A**: Technology stack:

**1. Core System**:
- **Node.js**: Runtime environment
- **JavaScript**: Primary language
- **TypeScript**: Type safety (in development)

**2. CLI Interface**:
- **Commander.js**: Command parsing
- **Inquirer.js**: Interactive prompts
- **Chalk**: Terminal styling

**3. AI Integration**:
- **Model Context Protocol (MCP)**: AI agent communication
- **REST APIs**: AI service integration
- **WebSocket**: Real-time communication

**4. Data Processing**:
- **Markdown-it**: Markdown parsing
- **Gray-matter**: Frontmatter processing
- **YAML**: Configuration files

**5. Obsidian Integration**:
- **Local REST API**: Obsidian communication
- **Dataview**: Query processing
- **File System**: Local file management

---

### Q: How does the Model Context Protocol (MCP) work?

**A**: MCP enables secure AI agent integration:

**1. Architecture**:
```
AI Agent ←→ MCP Server ←→ Obsidian API ←→ Your Vault
```

**2. Security Features**:
- Controlled file access
- Permission enforcement
- Audit logging
- Session management

**3. Capabilities**:
- File reading and writing
- Directory listing
- Search functionality
- Metadata access

**4. Configuration**:
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "OBSIDIAN_API_KEY": "your-key",
        "OBSIDIAN_VAULT_NAME": "your-vault"
      }
    }
  }
}
```

---

### Q: Can I extend Obsidian Kit with custom functionality?

**A**: Yes, multiple extension points:

**1. Custom Commands**:
```javascript
// cli/commands/custom-command.js
module.exports = async function(args, options) {
  // Your custom logic
  return { success: true };
};
```

**2. Custom Agents**:
```javascript
// agents/custom-agent.js
class CustomAgent extends BaseAgent {
  async processCommand(command, args) {
    // Custom command handling
  }
}
```

**3. Custom Workflows**:
```javascript
// workflows/custom-workflow.js
class CustomWorkflow {
  async execute(options) {
    // Custom workflow logic
  }
}
```

**4. Plugin System**:
```javascript
// plugins/custom-plugin.js
module.exports = {
  name: 'custom-plugin',
  version: '1.0.0',
  initialize: async () => {
    // Plugin initialization
  },
  hooks: {
    'task:created': async (task) => {
      // Handle task creation
    }
  }
};
```

---

### Q: How does Obsidian Kit handle large vaults?

**A**: Performance optimization for large vaults:

**1. Efficient Indexing**:
- Incremental indexing
- Lazy loading of content
- Optimized search algorithms

**2. Memory Management**:
- Streaming file processing
- Garbage collection optimization
- Resource pooling

**3. Query Optimization**:
- Efficient Dataview queries
- Result caching
- Pagination for large result sets

**4. Best Practices**:
- Archive completed projects
- Use efficient queries
- Limit vault size when possible
- Regular maintenance

**5. Monitoring**:
```bash
# Monitor performance
obsidian-kit monitor start

# Generate performance report
obsidian-kit monitor report
```

---

## 🐛 Troubleshooting

### Q: Why isn't the MCP server connecting?

**A**: Common MCP connection issues:

**1. API Key Issues**:
```bash
# Check API key
cat mcp-config.json | grep OBSIDIAN_API_KEY

# Generate new key in Obsidian
# Settings → Community Plugins → Local REST API → Generate API Key
```

**2. Port Conflicts**:
```bash
# Check port usage
lsof -i :27123

# Use different port
obsidian-kit add-mcp --port 27124
```

**3. Obsidian Not Running**:
- Ensure Obsidian is open
- Check Local REST API is enabled
- Verify vault is open

**4. Configuration Errors**:
```bash
# Validate configuration
obsidian-kit config validate

# Reconfigure MCP
obsidian-kit add-mcp --api-key NEW_KEY --vault-name VAULT_NAME
```

---

### Q: Why are Dataview queries not working?

**A**: Dataview troubleshooting steps:

**1. Plugin Issues**:
- Enable Dataview plugin
- Check for plugin updates
- Restart Obsidian

**2. Query Syntax**:
```dataview
# ❌ Common errors
FROM "4 - Projects" WHERE status = "todo"  # Missing quotes
FROM "4 - Projects" WHERE status = todo    # Missing quotes

# ✅ Correct syntax
FROM "4 - Projects" WHERE status = "todo"
```

**3. File Location**:
- Tasks must be in `4 - Projects/`
- Check file permissions
- Verify file encoding (UTF-8)

**4. Index Issues**:
```bash
# Rebuild Dataview index
# Dataview settings → Rebuild Index
```

---

### Q: How do I reset Obsidian Kit configuration?

**A**: Reset procedures:

**1. Reset Configuration**:
```bash
# Reset to defaults
obsidian-kit config reset

# Reconfigure
obsidian-kit init . --force
```

**2. Clear Cache**:
```bash
# Clear Obsidian Kit cache
rm -rf ~/.obsidian-kit/cache/
```

**3. Reinstall Agents**:
```bash
# Remove all agents
obsidian-kit agent remove --all

# Re-add agents
obsidian-kit agent add claude-code
```

**4. Fresh Start**:
```bash
# Complete reset (backup first!)
cp -r your-vault your-vault-backup
rm -rf your-vault/.obsidian-kit/
obsidian-kit init your-vault
```

---

## 🚀 Advanced Features

### Q: How does the knowledge graph work?

**A**: Knowledge graph capabilities:

**1. Automatic Extraction**:
- Entities and relationships extracted from content
- Concept identification and linking
- Semantic relationship mapping

**2. Graph Visualization**:
- Interactive graph views
- Relationship exploration
- Cluster identification

**3. Knowledge Queries**:
```bash
# Find related concepts
obsidian-kit knowledge query --type related --entity "authentication"

# Get insights
obsidian-kit knowledge insights --project "My Project"
```

**4. Learning Integration**:
- Continuous learning from interactions
- Pattern recognition
- Insight generation

---

### Q: What is semantic search and how does it work?

**A**: Semantic search features:

**1. Vector Embeddings**:
- Text converted to numerical vectors
- Semantic similarity calculations
- Context-aware matching

**2. Natural Language Queries**:
```bash
# Natural language search
obsidian-kit search "tasks about user authentication"

# Context-aware search
obsidian-kit search "database issues" --context "project: Web App"
```

**3. Similarity Matching**:
- Find similar content
- Recommend related tasks
- Discover connections

**4. Continuous Improvement**:
- Learning from user feedback
- Query refinement
- Result optimization

---

### Q: How do I set up automated workflows?

**A**: Workflow automation setup:

**1. Define Workflow Phases**:
```yaml
# .specify/workflows/development.md
phases:
  - name: "planning"
    description: "Project planning phase"
    required: true
  - name: "development"
    description: "Implementation phase"
    depends_on: ["planning"]
```

**2. Configure Automation**:
```bash
# Execute workflow
obsidian-kit workflow planning

# Interactive execution
obsidian-kit workflow development --interactive
```

**3. Custom Automation**:
```javascript
// Custom workflow automation
class CustomAutomation {
  async execute() {
    // Generate tasks from specs
    const tasks = await this.generateTasks();
    
    // Validate tasks
    await this.validateTasks(tasks);
    
    // Notify team
    await this.notifyTeam(tasks);
  }
}
```

---

## 👥 Community & Support

### Q: Where can I get help with Obsidian Kit?

**A**: Multiple support channels:

**1. Documentation**:
- [[📚 Documentation Hub]] - Complete documentation
- [[📘 Getting Started Guide]] - Beginner guide
- [[🔧 Troubleshooting Guide]] - Common issues

**2. Community**:
- [GitHub Discussions](https://github.com/t3rpz/obsidian-kit/discussions) - Questions and discussions
- [Discord Community](https://discord.gg/obsidian-kit) - Real-time chat
- [Reddit r/ObsidianKit](https://reddit.com/r/obsidiankit) - Community discussions

**3. Issue Reporting**:
- [GitHub Issues](https://github.com/t3rpz/obsidian-kit/issues) - Bug reports and feature requests
- Include diagnostic output: `obsidian-kit doctor`
- Provide system information and steps to reproduce

**4. Professional Support**:
- Enterprise support available
- Priority issue resolution
- Custom integration assistance

---

### Q: How can I contribute to Obsidian Kit?

**A**: Multiple contribution opportunities:

**1. Code Contributions**:
- Fork the repository
- Create feature branches
- Submit pull requests
- Follow contribution guidelines

**2. Documentation**:
- Improve documentation
- Add tutorials
- Translate content
- Create examples

**3. Community**:
- Answer questions in discussions
- Help troubleshoot issues
- Share experiences
- Provide feedback

**4. Testing**:
- Report bugs
- Test new features
- Provide feedback
- Suggest improvements

**Getting Started**:
```bash
# Development setup
git clone https://github.com/t3rpz/obsidian-kit.git
cd obsidian-kit
npm install
npm run dev
```

---

### Q: Are there any meetups or events?

**A**: Community events and gatherings:

**1. Online Events**:
- Monthly community calls
- Workshop sessions
- AMA with maintainers
- Show and tell events

**2. Local Meetups**:
- Organize local Obsidian Kit meetups
- Share with community
- Join existing groups

**3. Conferences**:
- Present at relevant conferences
- Organize workshops
- Network with users

**4. Online Presence**:
- YouTube tutorials
- Blog posts
- Social media discussions
- Podcast appearances

**Stay Updated**:
- Follow GitHub repository
- Join Discord community
- Subscribe to newsletter
- Follow social media accounts

---

## 📈 Future Development

### Q: What's planned for future versions?

**A**: Roadmap highlights:

**Short Term (Next 3 months)**:
- Enhanced AI agent capabilities
- Improved performance optimization
- Additional plugin integrations
- Mobile responsiveness

**Medium Term (3-6 months)**:
- Web interface
- Advanced analytics
- Team collaboration features
- Cloud synchronization options

**Long Term (6+ months)**:
- Plugin marketplace
- Enterprise features
- Advanced AI integrations
- Cross-platform support

**Get Involved**:
- Vote on feature requests
- Participate in planning
- Contribute to development
- Provide feedback

---

### Q: How can I request new features?

**A**: Feature request process:

**1. Check Existing Requests**:
- Search GitHub issues
- Check discussions
- Review roadmap

**2. Submit Feature Request**:
- Use GitHub issue template
- Provide detailed description
- Include use cases
- Suggest implementation

**3. Gather Support**:
- Discuss with community
- Refine requirements
- Prioritize based on need

**4. Development**:
- Community contributions welcome
- Core team prioritization
- Regular releases

**Feature Request Template**:
```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Use Cases
Specific examples of usage

## Alternatives Considered
Other approaches evaluated

## Additional Context
Any other relevant information
```

---

*This FAQ is continuously updated. Last modified: 2025-10-02*

**Still have questions?** Join our [community discussions](https://github.com/t3rpz/obsidian-kit/discussions) or [open an issue](https://github.com/t3rpz/obsidian-kit/issues).