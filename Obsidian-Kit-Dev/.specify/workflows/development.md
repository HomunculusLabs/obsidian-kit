# Development Workflow

## Spec-Driven Development Process

### Phase 1: Constitution & Vision
**Command**: `/constitution`

1. **Establish Project Principles**
   - Define core values and decision framework
   - Set quality standards and best practices
   - Identify key constraints and requirements

2. **Document Vision**
   - Clear project goals and success criteria
   - Stakeholder alignment and expectations
   - Long-term roadmap and milestones

**Deliverables**: Updated `.specify/memory/constitution.md`

---

### Phase 2: Requirements Specification
**Command**: `/specify`

1. **Gather Requirements**
   - Functional requirements and user stories
   - Non-functional requirements (performance, security)
   - Constraints and dependencies

2. **Define Acceptance Criteria**
   - Clear definition of done
   - Success metrics and validation criteria
   - Quality gates and review processes

**Deliverables**: Complete `.specify/specs/requirements.md`

---

### Phase 3: Technical Planning
**Command**: `/plan`

1. **Architecture Design**
   - System architecture and component design
   - Technology stack selection
   - Integration patterns and data flow

2. **Implementation Strategy**
   - Development approach and methodology
   - Risk assessment and mitigation
   - Resource allocation and timeline

**Deliverables**: Detailed `.specify/specs/architecture.md`

---

### Phase 4: Task Breakdown
**Command**: `/tasks`

1. **Work Breakdown Structure**
   - Break features into 2-4 hour tasks
   - Define clear acceptance criteria per task
   - Identify dependencies and sequencing

2. **Task Management**
   - Create tasks in project management system
   - Assign priorities and estimates
   - Set up tracking and monitoring

**Deliverables**: Task files in `4 - Projects/` with proper metadata

---

### Phase 5: Implementation
**Command**: `/implement`

1. **Development Process**
   - Follow specifications and architecture
   - Implement features incrementally
   - Maintain documentation during development

2. **Quality Assurance**
   - Write tests alongside code
   - Perform continuous integration
   - Update documentation as needed

**Deliverables**: Working code + tests + documentation

---

### Phase 6: Review & Refinement
**Command**: `/review`

1. **Code Review**
   - Technical review for quality and standards
   - Architecture compliance check
   - Security and performance review

2. **Specification Review**
   - Validate implementation against specs
   - Update specifications based on learnings
   - Document design decisions

**Deliverables**: Reviewed code + updated specifications

## Continuous Activities

### Daily Workflow
- **Morning**: `/status` - Check project health and priorities
- **During work**: `/implement` - Focus on current tasks
- **End of day**: Update task progress and notes

### Weekly Workflow
- **Weekly review**: `/sync` - Synchronize project state
- **Retrospective**: `/learn` - Capture lessons learned
- **Planning**: `/tasks` - Update task queue and priorities

### Research & Learning
- **As needed**: `/research` - Investigate topics and gather information
- **Regular**: `/learn` - Document patterns and best practices
- **Ongoing**: Update source materials and knowledge base

## Quality Gates

### Specification Quality
- [ ] Requirements are clear and testable
- [ ] Architecture supports requirements
- [ ] Risks and assumptions are documented
- [ ] Stakeholder review completed

### Implementation Quality
- [ ] Code follows established standards
- [ ] Tests provide adequate coverage
- [ ] Documentation is current and accurate
- [ ] Performance meets requirements

### Process Quality
- [ ] Workflow steps followed consistently
- [ ] Regular status updates provided
- [ ] Lessons learned captured
- [ ] Knowledge base maintained

## Tool Integration

### Multi-Tool Support
This workflow works across different AI coding environments:

**Claude Code**:
- Use slash commands directly in chat
- Leverage file reading/writing capabilities
- Maintain context across sessions

**OpenCode**:
- Map commands to custom macros
- Use project context features
- Integrate with VS Code extensions

**Cursor**:
- Adapt commands for composer interface
- Use codebase-wide context
- Leverage AI pair programming

### Context Preservation
- All tools access same specification files
- Universal context maintained in `agents/universal-context.md`
- Consistent project state across environments

## Workflow Customization

### Project-Specific Adaptations
- Adjust phase timing based on project complexity
- Customize quality gates for specific requirements
- Adapt tool integration for team preferences

### Team Coordination
- Define handoff points between team members
- Establish communication protocols
- Set up shared review processes

---

*Development workflow based on spec-kit methodology*
*Optimized for multi-tool AI agent collaboration*