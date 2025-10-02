# Universal Agent Context

This document provides shared context that all AI agents should understand regardless of the coding environment (Claude Code, OpenCode, Cursor, etc.).

## Project Structure

### 📁 Folder System
```
1 - Source Materials/    # Books, documentation, references
2 - Daily Notes/         # Daily task overviews and logs
3 - Templates/           # Project and task templates
4 - Projects/            # Main project management hub
agents/                  # Tool-specific agent configurations
.specify/                # Spec-driven development system
```

### 🎯 Project Management
- **Tasks Database**: `4 - Projects/Tasks.base` (Dataview-powered)
- **Project Dashboard**: Real-time project overview
- **Health Monitoring**: Track progress and identify bottlenecks
- **Template System**: Consistent project and task creation

## Operating Principles

### 1. Spec-First Development
- All features begin with clear specifications in `.specify/specs/`
- Specifications are living documents that evolve
- Implementation follows documented requirements
- Architecture decisions are recorded in `.specify/memory/`

### 2. Task-Driven Workflow
- Work is broken into manageable tasks (2-4 hours each)
- Tasks have clear acceptance criteria
- Dependencies are explicitly tracked
- Progress is visible through project dashboard

### 3. Knowledge Integration
- Source materials inform all decisions
- Documentation is maintained automatically
- Context is preserved across sessions
- Learning is captured and organized

### 4. Quality Standards
- Code changes require documentation updates
- Specifications must be reviewed before implementation
- Task completion includes verification steps
- All artifacts are linked and discoverable

## Agent Responsibilities

### Core Functions
1. **Project Management**: Create, update, track tasks
2. **Documentation**: Write and maintain project docs
3. **Specification Development**: Create and refine specs
4. **Code Review**: Provide technical guidance
5. **Research**: Synthesize information from source materials

### Communication Patterns
- **Daily**: Review task queue and priorities
- **Weekly**: Update project status and health
- **On-demand**: Technical assistance and problem-solving
- **Proactive**: Documentation improvements and maintenance

## Context Windows

### Always Available
- Project constitution from `.specify/memory/constitution.md`
- Current specifications from `.specify/specs/`
- Active tasks from `4 - Projects/Tasks.base`
- Project health from dashboard

### Reference Materials
- Source materials from `1 - Source Materials/`
- Templates from `3 - Templates/`
- Previous decisions from `.specify/memory/decisions.md`
- Workflow definitions from `.specify/workflows/`

## Success Metrics

### Project Health Indicators
- Task completion rate
- Specification freshness
- Documentation coverage
- Code quality metrics
- Dependency resolution

### Agent Effectiveness
- Accurate task breakdown
- Timely documentation updates
- Helpful technical guidance
- Proactive issue identification
- Context preservation

---

*Universal context established for all AI coding assistants*
*Last updated: {{date:YYYY-MM-DD}}*