# Standardized Slash Commands

These commands work consistently across all AI coding environments (Claude Code, OpenCode, Cursor, etc.) following spec-kit methodology.

## Core Workflow Commands

### `/constitution`
**Purpose**: Establish or review project principles and decision framework

**Usage**: `/constitution [review|update|create]`

**Function**:
- Review current project constitution
- Update principles based on new learnings
- Create constitution for new projects
- Ensure all decisions align with stated principles

**Output**: Updates `.specify/memory/constitution.md`

---

### `/specify`
**Purpose**: Define requirements and specifications for features or projects

**Usage**: `/specify [feature-name|review|refine]`

**Function**:
- Create detailed specifications for new features
- Review existing specifications for completeness
- Refine specifications based on implementation feedback
- Ensure specifications capture "what" before "how"

**Output**: Creates/updates files in `.specify/specs/`

---

### `/plan`
**Purpose**: Create technical implementation strategy from specifications

**Usage**: `/plan [feature-name|architecture|technical]`

**Function**:
- Transform specifications into technical plans
- Define architecture and implementation approach
- Identify dependencies and risks
- Create realistic timeline estimates

**Output**: Updates `.specify/specs/architecture.md` and creates implementation plan

---

### `/tasks`
**Purpose**: Generate actionable task breakdown from plans

**Usage**: `/tasks [feature-name|breakdown|estimate]`

**Function**:
- Break down plans into 2-4 hour tasks
- Define clear acceptance criteria
- Identify task dependencies
- Estimate effort and timeline

**Output**: Creates task files in `4 - Projects/` with proper frontmatter

---

### `/implement`
**Purpose**: Execute development tasks with context

**Usage**: `/implement [task-name|next|current]`

**Function**:
- Begin implementation of specific task
- Follow specifications and architecture
- Maintain documentation during development
- Update task status and progress

**Output**: Code changes + documentation updates + task status updates

---

### `/review`
**Purpose**: Code review and refinement process

**Usage**: `/review [code|docs|specs|architecture]`

**Function**:
- Review code for quality and standards
- Check documentation completeness
- Validate specifications accuracy
- Assess architectural decisions

**Output**: Review comments, improvement suggestions, and updates

## Project Management Commands

### `/status`
**Purpose**: Get current project health and status

**Usage**: `/status [detailed|summary|health]`

**Function**:
- Show task completion status
- Identify bottlenecks and blockers
- Report on specification freshness
- Highlight areas needing attention

---

### `/sync`
**Purpose**: Synchronize project state across tools

**Usage**: `/sync [tasks|specs|docs|all]`

**Function**:
- Update task database from various sources
- Sync specifications with implementation
- Ensure documentation is current
- Reconcile changes across environments

## Research and Learning Commands

### `/research`
**Purpose**: Investigate topics using source materials

**Usage**: `/research [topic|gather|synthesize]`

**Function**:
- Search through source materials
- Gather information on specific topics
- Synthesize findings into actionable insights
- Update knowledge base

**Output**: Research summaries in `1 - Source Materials/`

---

### `/learn`
**Purpose**: Extract lessons from project experience

**Usage**: `/learn [retrospective|patterns|decisions]`

**Function**:
- Capture lessons learned
- Identify reusable patterns
- Document decision rationale
- Update best practices

**Output**: Updates `.specify/memory/decisions.md`

## Tool Integration

### Command Adaptation
Each AI coding environment should adapt these commands to their native interface:

**Claude Code**: Use as direct commands in chat
**OpenCode**: Map to custom commands or macros
**Cursor**: Integrate with composer or chat interface
**Copilot**: Adapt to chat or inline suggestions

### Context Preservation
All commands should:
- Reference the universal context
- Update relevant project files
- Maintain consistency across sessions
- Preserve decision history

### Workflow Integration
Commands follow natural development flow:
1. `/constitution` → `/specify` → `/plan` → `/tasks` → `/implement` → `/review`
2. Use `/status` and `/sync` for project management
3. Use `/research` and `/learn` for knowledge building

---

*Standardized commands for spec-driven development across all AI tools*
*Based on spec-kit methodology*