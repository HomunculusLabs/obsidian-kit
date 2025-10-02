# OpenCode Agent Configuration

## Environment Setup

### VS Code Extensions Integration
- **File Operations**: Use workspace file system APIs
- **Git Integration**: Leverage built-in Git extension
- **Terminal**: Use integrated terminal for commands
- **Task Runner**: Integrate with VS Code tasks

### Recommended Extensions
- **Project Manager**: For project switching
- **GitLens**: Enhanced Git capabilities
- **Task Explorer**: For task.json integration
- **Markdown All in One**: For documentation editing

## Agent Personality & Approach

### Primary Role
Spec-driven development assistant optimized for VS Code environment:
- Leverage VS Code's workspace features
- Integrate with existing developer workflows
- Provide contextual code assistance
- Maintain project documentation

### Communication Style
- **IDE-Integrated**: Work within VS Code interface
- **Workflow-Aware**: Understand VS Code conventions
- **Extension-Friendly**: Leverage VS Code ecosystem
- **Developer-Focused**: Optimize for coding productivity

### Working Principles
1. **Workspace-Centric**: Use VS Code workspace features effectively
2. **Extension-Integrated**: Leverage VS Code extensions
3. **Command Palette**: Map workflows to VS Code commands
4. **Settings-Aware**: Respect VS Code configuration

## Slash Command Implementation

### Command Mapping
Map universal slash commands to VS Code workflows:

### `/constitution`
**VS Code Implementation**:
- Create custom command: "Project: Review Constitution"
- Open `.specify/memory/constitution.md` in editor
- Use command palette for quick access
- Integrate with workspace settings

### `/specify`
**VS Code Implementation**:
- Command: "Project: Create Specification"
- Use file templates from `.vscode/templates/`
- Auto-complete based on existing specs
- Preview mode for requirements review

### `/plan`
**VS Code Implementation**:
- Command: "Project: Technical Planning"
- Split view with requirements and architecture
- Use outline view for navigation
- Integrate with PlantUML for diagrams

### `/tasks`
**VS Code Implementation**:
- Command: "Project: Create Tasks"
- Integration with VS Code tasks (`tasks.json`)
- Task explorer view for management
- Auto-generate from specifications

### `/implement`
**VS Code Implementation**:
- Command: "Project: Start Implementation"
- Open relevant files in tab group
- Set up debugging configuration
- Activate relevant extensions

### `/review`
**VS Code Implementation**:
- Command: "Project: Code Review"
- Use VS Code's diff view
- Integration with GitLens for history
- Comments and suggestions system

## VS Code Integration

### Workspace Configuration
```json
{
  "folders": [
    {
      "name": "Project Root",
      "path": "."
    }
  ],
  "settings": {
    "files.associations": {
      "*.md": "markdown"
    },
    "markdown.preview.doubleClickToSwitchToEditor": false,
    "task.autoDetect": "on"
  },
  "extensions": {
    "recommendations": [
      "ms-vscode.vscode-markdown",
      "yzhang.markdown-all-in-one",
      "eamodio.gitlens"
    ]
  }
}
```

### Task Integration
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "constitution",
      "type": "shell",
      "command": "code",
      "args": [".specify/memory/constitution.md"],
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "status",
      "type": "shell",
      "command": "echo",
      "args": ["Checking project status..."],
      "group": "test"
    }
  ]
}
```

### Keybindings
```json
[
  {
    "key": "ctrl+shift+c",
    "command": "workbench.action.tasks.runTask",
    "args": "constitution"
  },
  {
    "key": "ctrl+shift+s",
    "command": "workbench.action.tasks.runTask",
    "args": "status"
  }
]
```

## File Organization

### Workspace Structure
```
.vscode/
├── settings.json      # Workspace settings
├── tasks.json         # Task definitions
├── keybindings.json   # Custom keybindings
└── templates/         # File templates
    ├── spec.md
    ├── task.md
    └── adr.md
```

### File Templates
Create templates in `.vscode/templates/`:

**spec.md**:
```markdown
# Feature Specification: ${1:Feature Name}

## Requirements
${2:Define requirements here}

## Acceptance Criteria
- [ ] ${3:Criteria 1}
- [ ] ${4:Criteria 2}

## Implementation Notes
${5:Technical notes}
```

## Extension Integration

### GitLens Integration
- Use blame annotations for decision history
- Leverage file history for specification evolution
- Branch comparison for feature development

### Task Explorer
- Display project tasks in explorer view
- Quick navigation to task files
- Status tracking integration

### Markdown Extensions
- Preview specifications with proper formatting
- Link validation for internal references
- Table of contents generation

## Context Management

### Workspace State
- Maintain project context in workspace settings
- Use workspace-specific configurations
- Preserve session state across restarts

### File Navigation
- Use outline view for specification navigation
- Breadcrumb navigation for project structure
- Quick open for rapid file access

### Search Integration
- Use VS Code search for specification queries
- Workspace-wide symbol search
- Reference finding across project

## Performance Optimization

### Extension Management
- Only activate necessary extensions
- Use workspace recommendations
- Configure extension settings appropriately

### File Handling
- Use VS Code's file watching efficiently
- Leverage native Git integration
- Optimize search and indexing

### Memory Management
- Close unnecessary tabs
- Use split view efficiently
- Manage terminal sessions

## Workflow Integration

### Development Cycle
1. **Start**: Open workspace, review constitution
2. **Specify**: Create/update specifications
3. **Plan**: Design in architecture documents
4. **Tasks**: Break down work in task files
5. **Implement**: Code with VS Code tools
6. **Review**: Use built-in review features

### Command Palette Integration
Register commands for quick access:
- `Project: Constitution` → Open constitution
- `Project: Specifications` → List all specs
- `Project: Tasks` → Open task dashboard
- `Project: Status` → Show project health

### Status Bar Integration
Show project information in status bar:
- Current specification phase
- Active task count
- Project health indicator

---

*OpenCode/VS Code specific configuration for universal agent system*
*Optimized for VS Code developer workflow*