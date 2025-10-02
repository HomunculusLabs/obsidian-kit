# Architecture Decision Records (ADRs)

## ADR-001: Universal Agent Configuration System
**Date**: {{date:YYYY-MM-DD}}
**Status**: Accepted

### Context
Need to support multiple AI coding environments (Claude Code, OpenCode, Cursor) with consistent project context and workflows.

### Decision
Implement universal agent configuration system with:
- Shared context across all AI tools
- Standardized slash commands following spec-kit methodology
- Tool-specific configuration files
- Common project structure and management system

### Consequences
**Positive**:
- Consistent development experience across tools
- Easy migration between AI environments
- Standardized workflow reduces context switching
- Spec-driven development enforces quality

**Negative**:
- Additional setup complexity
- Need to maintain multiple tool configurations
- Learning curve for new command system

### Implementation
- Universal context in `agents/universal-context.md`
- Tool-specific configs in `agents/[tool].md`
- Slash commands defined in `agents/slash-commands.md`
- Enhanced `.specify/` structure for spec-kit integration

---

## ADR-002: Spec-Kit Integration
**Date**: {{date:YYYY-MM-DD}}
**Status**: Accepted

### Context
Original Obsidian Kit was too Obsidian-specific. Need broader adoption of spec-driven development methodology.

### Decision
Integrate spec-kit principles and workflow:
- Constitution-first project setup
- Specification before implementation
- Multi-phase development process
- Quality gates at each phase

### Consequences
**Positive**:
- Better project outcomes through planning
- Reduced rework and technical debt
- Clear decision rationale documentation
- Improved team communication

**Negative**:
- Longer upfront planning time
- Requires discipline to follow process
- May feel heavy for small projects

### Implementation
- Enhanced `.specify/` structure
- Workflow definitions in `.specify/workflows/`
- Slash commands for each development phase
- Integration with existing project management

---

## ADR-003: [Future Decision Title]
**Date**: [Future Date]
**Status**: [Proposed|Accepted|Superseded]

### Context
[What led to this decision]

### Decision
[What was decided and why]

### Consequences
**Positive**:
- [List positive impacts]

**Negative**:
- [List negative impacts or trade-offs]

### Implementation
[How the decision will be implemented]

---

## Decision Guidelines

### When to Create an ADR
- Significant architectural decisions
- Technology stack choices
- Process or workflow changes
- Integration pattern selections
- Quality standard definitions

### ADR Template
```markdown
## ADR-XXX: [Decision Title]
**Date**: [YYYY-MM-DD]
**Status**: [Proposed|Accepted|Superseded]

### Context
[What led to this decision]

### Decision
[What was decided and why]

### Consequences
**Positive**:
- [List positive impacts]

**Negative**:
- [List negative impacts]

### Implementation
[How the decision will be implemented]
```

### Review Process
1. **Propose**: Create ADR in "Proposed" status
2. **Discuss**: Share with team for feedback
3. **Decide**: Update status to "Accepted" or revise
4. **Implement**: Execute the decision
5. **Review**: Periodically assess outcomes

---

*Architecture decisions following spec-kit ADR practices*
*Maintained by: AI Agent System*