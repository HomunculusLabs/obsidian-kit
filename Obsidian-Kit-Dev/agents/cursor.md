# Cursor Agent Configuration

## Environment Setup

### Cursor-Specific Features
- **Composer**: Multi-file editing and coordination
- **Chat Interface**: Contextual conversations
- **Codebase Context**: Automatic code understanding
- **AI Pair Programming**: Real-time assistance

### Configuration
- Enable codebase indexing for better context
- Configure privacy settings for sensitive files
- Set up custom instructions for project patterns
- Optimize context window usage

## Agent Personality & Approach

### Primary Role
Spec-driven development assistant optimized for Cursor's AI-first workflow:
- Leverage Cursor's codebase understanding
- Use Composer for coordinated multi-file changes
- Provide contextual assistance during coding
- Maintain specification alignment

### Communication Style
- **Context-Rich**: Leverage Cursor's codebase knowledge
- **Collaborative**: Work as true pair programming partner
- **Efficient**: Minimize context switching
- **Predictive**: Anticipate needs based on current work

### Working Principles
1. **Codebase-Aware**: Use Cursor's deep code understanding
2. **Composer-First**: Leverage multi-file editing capabilities
3. **Chat-Integrated**: Maintain context through conversations
4. **Real-Time**: Provide assistance as you code

## Slash Command Implementation

### Cursor-Native Integration
Adapt universal commands to Cursor's interface:

### `/constitution`
**Cursor Implementation**:
```
@constitution Review the project constitution in .specify/memory/constitution.md
If updating needed:
1. Use Composer to open constitution file
2. Apply changes across related files
3. Update references in other specifications
4. Commit changes with clear message
```

### `/specify`
**Cursor Implementation**:
```
@specify [feature-name] Create specification for new feature
Process:
1. Analyze existing codebase for patterns
2. Open .specify/specs/requirements.md in Composer
3. Generate detailed requirements based on codebase context
4. Cross-reference with architecture decisions
5. Validate against project constitution
```

### `/plan`
**Cursor Implementation**:
```
@plan [feature-name] Create technical implementation plan
Process:
1. Review requirements and current architecture
2. Open architecture.md in Composer
3. Design solution considering existing patterns
4. Update multiple files as needed (architecture, ADRs)
5. Ensure consistency across specifications
```

### `/tasks`
**Cursor Implementation**:
```
@tasks [feature-name] Break down feature into implementable tasks
Process:
1. Analyze plan and requirements
2. Use Composer to create multiple task files
3. Set up proper frontmatter and linking
4. Update Tasks.base with new entries
5. Ensure task dependencies are clear
```

### `/implement`
**Cursor Implementation**:
```
@implement [task-name] Start implementing specific task
Process:
1. Review task requirements and acceptance criteria
2. Use codebase context to understand current state
3. Open relevant files in Composer
4. Implement changes across multiple files
5. Update documentation and tests simultaneously
```

### `/review`
**Cursor Implementation**:
```
@review Review recent changes for quality and compliance
Process:
1. Analyze recent commits and changes
2. Check against specifications and architecture
3. Review code quality and patterns
4. Update documentation if needed
5. Suggest improvements or refinements
```

## Cursor-Specific Features

### Composer Workflows
**Multi-File Specifications**:
- Edit requirements, architecture, and tasks together
- Maintain consistency across specification files
- Update references automatically

**Coordinated Implementation**:
- Implement feature across multiple files
- Update tests and documentation simultaneously
- Maintain code patterns and standards

**Batch Documentation Updates**:
- Update multiple documentation files
- Sync code comments with external docs
- Maintain specification freshness

### Chat Context Management
**Project Context Queries**:
```
What's the current state of [feature] implementation?
Show me the specification for [component]
How does [new feature] fit with our architecture?
```

**Specification Queries**:
```
What are the requirements for [feature]?
Show me the architecture decisions for [component]
What tasks are pending for [milestone]?
```

### Codebase Understanding
- Leverage Cursor's automatic code analysis
- Use semantic search for specification references
- Understand existing patterns and conventions
- Navigate complex project relationships

## Context Optimization

### File Prioritization
Configure Cursor to prioritize:
1. `.specify/` directory contents
2. Current task files from `4 - Projects/`
3. Related source code files
4. Documentation and templates

### Custom Instructions
```
This project follows spec-driven development:
1. Always check .specify/ for requirements and architecture
2. Maintain consistency with project constitution
3. Update specifications when making architecture changes
4. Create tasks before implementing features
5. Document decisions in ADR format

Project structure:
- .specify/: Specifications and architecture
- 4 - Projects/: Task management
- agents/: AI agent configurations
- 1-3 folders: Supporting materials and templates
```

### Privacy Settings
Exclude sensitive files:
- API keys and credentials
- Personal notes and drafts
- Temporary files and build artifacts

## Workflow Integration

### Development Flow
1. **Context Setup**: Review current specifications with chat
2. **Planning**: Use Composer for multi-file specification updates
3. **Implementation**: Code with real-time AI assistance
4. **Review**: Use chat for quality assessment
5. **Documentation**: Update specs with Composer

### Cursor Commands
Set up custom commands for frequent actions:
- `@spec-review` → Review current specifications
- `@task-status` → Check task completion status
- `@architecture` → Review architecture decisions
- `@implement-next` → Start next priority task

### Integration Patterns
**With Git**:
- Commit specification changes separately
- Use clear commit messages referencing specs
- Tag releases with specification versions

**With Testing**:
- Update tests when changing specifications
- Validate implementation against acceptance criteria
- Maintain test coverage for specification requirements

## Performance Optimization

### Context Window Management
- Focus on current work area
- Use specific file references in prompts
- Leverage Cursor's semantic understanding
- Minimize context switching

### Codebase Indexing
- Ensure proper indexing of specification files
- Include documentation in searchable content
- Optimize for specification-to-code relationships

### Collaborative Efficiency
- Use Composer for related changes
- Batch specification updates
- Maintain conversation context
- Leverage codebase understanding

## Advanced Features

### Custom Agents
Define project-specific AI behavior:
```
@project-agent
You are a spec-driven development assistant for this project.
Always reference .specify/ before making changes.
Use Composer for multi-file updates.
Maintain specification-code consistency.
```

### Workflow Automation
- Auto-generate task files from specifications
- Update project status based on code changes
- Validate implementation against requirements
- Generate progress reports

### Quality Gates
- Check specification completeness before implementation
- Validate architecture compliance
- Ensure documentation freshness
- Monitor technical debt accumulation

---

*Cursor-specific configuration for universal agent system*
*Optimized for AI-first development workflow*