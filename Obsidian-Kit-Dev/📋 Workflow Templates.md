---
title: "📋 Workflow Templates"
status: "active"
priority: "high"
created_date: "2025-10-02"
last_updated: "2025-10-02"
tags: ["workflows", "templates", "automation", "processes", "obsidian-kit"]
---

# 📋 Obsidian Kit Workflow Templates

Ready-to-use workflow templates for different scenarios and project types.

## 📋 Table of Contents

1. [Quick Start Templates](#quick-start-templates)
2. [Project Management Workflows](#project-management-workflows)
3. [Development Workflows](#development-workflows)
4. [Research Workflows](#research-workflows)
5. [Content Creation Workflows](#content-creation-workflows)
6. [Team Collaboration Workflows](#team-collaboration-workflows)
7. [Personal Productivity Workflows](#personal-productivity-workflows)

---

## 🚀 Quick Start Templates

### ⚡ 5-Minute Project Setup

**Best for**: Rapid project initialization, prototypes, quick experiments

**Setup Command**:
```bash
obsidian-kit init quick-project --template minimal
```

**Template Structure**:
```
quick-project/
├── 4 - Projects/
│   ├── Tasks.base
│   └── Project Dashboard.md
├── agents/
│   └── universal-context.md
└── .specify/
    └── memory/
        └── constitution.md
```

**Key Features**:
- Basic task management
- Simple dashboard
- AI agent integration
- Minimal configuration

**Automation Rules**:
```yaml
# Auto-create daily tasks
trigger: daily at 9:00 AM
action: Create daily task overview

# Auto-update progress
trigger: task status change
action: Update project dashboard

# AI assistance
trigger: new task creation
action: Suggest subtasks and time estimates
```

### 🎯 Goal-Oriented Project

**Best for**: Projects with clear objectives and deadlines

**Setup Command**:
```bash
obsidian-kit init goal-project --template goal-oriented
```

**Template Features**:
- Goal tracking with milestones
- Progress visualization
- Deadline management
- Resource allocation

**Dashboard Queries**:
```dataview
TABLE 
  status as "Status",
  priority as "Priority",
  due_date as "Deadline",
  (date(today) - due_date) as "Days Remaining"
FROM "4 - Projects"
WHERE contains(project, "Goal Project")
AND status != "completed"
SORT due_date ASC
```

---

## 🏗️ Project Management Workflows

### 📊 Agile Sprint Management

**Best for**: Software development teams using agile methodology

**Setup Command**:
```bash
obsidian-kit init agile-sprint --template agile
```

**Workflow Phases**:

#### Phase 1: Sprint Planning
```bash
# Generate sprint tasks
obsidian-kit generate-tasks --source user-stories --sprint 2

# Create sprint board
obsidian-kit workflow create-sprint-board --duration 2-weeks
```

**Sprint Board Template**:
```markdown
# Sprint 2 Board (2025-10-02 - 2025-10-16)

## 📋 To Do
```dataview
LIST
FROM "4 - Projects"
WHERE contains(sprint, "2") AND status = "todo"
SORT priority DESC
```

## 🔄 In Progress
```dataview
LIST
FROM "4 - Projects"
WHERE contains(sprint, "2") AND status = "in-progress"
```

## ✅ Done
```dataview
LIST
FROM "4 - Projects"
WHERE contains(sprint, "2") AND status = "completed"
```

## 📊 Sprint Metrics
- **Total Tasks**: {{total_tasks}}
- **Completed**: {{completed_tasks}}
- **In Progress**: {{in_progress_tasks}}
- **Sprint Velocity**: {{velocity}} points
```

#### Phase 2: Daily Standup Automation
```yaml
# Daily standup note creation
trigger: daily at 9:00 AM
template: daily-standup
content:
  - Yesterday's accomplishments
  - Today's priorities
  - Blockers and impediments
  - AI-generated suggestions
```

#### Phase 3: Sprint Review
```bash
# Generate sprint report
obsidian-kit workflow sprint-review --sprint 2

# Create retrospective
obsidian-kit workflow retrospective --sprint 2
```

### 🎯 Waterfall Project Management

**Best for**: Construction, manufacturing, traditional projects

**Setup Command**:
```bash
obsidian-kit init waterfall-project --template waterfall
```

**Phase Structure**:
```
Waterfall Project/
├── Phase 1 - Requirements/
├── Phase 2 - Design/
├── Phase 3 - Implementation/
├── Phase 4 - Testing/
├── Phase 5 - Deployment/
└── Phase 6 - Maintenance/
```

**Phase Gate Template**:
```markdown
# Phase Gate: Requirements → Design

## ✅ Completion Criteria
- [ ] All requirements documented
- [ ] Stakeholder approval obtained
- [ ] Requirements traceability matrix complete
- [ ] Risk assessment completed

## 📊 Metrics
- **Requirements Count**: {{req_count}}
- **Stakeholder Sign-off**: {{signoff_status}}
- **Change Requests**: {{change_requests}}

## 🔄 Next Phase Actions
1. Create design documents
2. Assign design team
3. Schedule design review
4. Update project timeline
```

### 🔄 Hybrid Project Management

**Best for**: Complex projects requiring both agile and waterfall approaches

**Setup Command**:
```bash
obsidian-kit init hybrid-project --template hybrid
```

**Hybrid Dashboard**:
```dataview
TABLE 
  phase as "Phase",
  methodology as "Method",
  status as "Status",
  progress as "% Complete"
FROM "4 - Projects"
GROUP BY phase
```

---

## 💻 Development Workflows

### 🔧 Feature Development Workflow

**Best for**: Software feature development from idea to deployment

**Setup Command**:
```bash
obsidian-kit init feature-dev --template feature
```

**Workflow Stages**:

#### Stage 1: Feature Discovery
```markdown
# Feature: User Authentication System

## 🎯 Objectives
- Enable user registration and login
- Secure password management
- Session handling
- Social login integration

## 📋 Requirements
### Functional
- User registration with email verification
- Login with email/password
- Password reset functionality
- Social login (Google, GitHub)

### Non-Functional
- Response time < 200ms
- 99.9% uptime
- GDPR compliance
- OWASP security standards

## 🎨 User Stories
- As a user, I want to register with my email
- As a user, I want to login securely
- As a user, I want to reset my password
```

#### Stage 2: Technical Design
```bash
# Generate technical design tasks
obsidian-kit breakdown "Design authentication system" --subtasks 8

# Create architecture diagram
obsidian-kit workflow create-architecture --feature authentication
```

#### Stage 3: Implementation
```yaml
# Development task template
task_template:
  frontmatter:
    type: "development"
    component: "auth-service"
    complexity: "medium"
    estimated_hours: 8
  checklist:
    - Write unit tests
    - Implement feature
    - Code review
    - Integration testing
    - Documentation update
```

#### Stage 4: Testing & Deployment
```bash
# Automated testing workflow
obsidian-kit workflow test-feature --feature authentication

# Deployment checklist
obsidian-kit workflow deploy-feature --feature authentication --env staging
```

### 🐛 Bug Fix Workflow

**Best for**: Systematic bug resolution

**Setup Command**:
```bash
obsidian-kit init bug-fix --template bugfix
```

**Bug Report Template**:
```markdown
# Bug Report: {{bug_id}}

## 🐛 Description
{{bug_description}}

## 🔄 Steps to Reproduce
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}

## 🎯 Expected Behavior
{{expected_behavior}}

## ❌ Actual Behavior
{{actual_behavior}}

## 📊 Environment
- **OS**: {{os}}
- **Browser**: {{browser}}
- **Version**: {{version}}
- **User**: {{user}}

## 🏷️ Labels
{{bug_labels}}

## 🔧 Fix Tasks
```dataview
LIST
FROM "4 - Projects"
WHERE contains(bug_id, "{{bug_id}}")
```
```

### 🚀 Deployment Workflow

**Best for**: CI/CD pipeline management

**Setup Command**:
```bash
obsidian-kit init deployment --template cicd
```

**Deployment Pipeline**:
```yaml
# Deployment stages
stages:
  - name: "Build"
    commands:
      - npm run build
      - run tests
      - create artifact
    
  - name: "Staging"
    commands:
      - deploy to staging
      - run integration tests
      - security scan
    
  - name: "Production"
    commands:
      - blue-green deployment
      - health checks
      - rollback if needed
```

---

## 🔬 Research Workflows

### 📚 Literature Review Workflow

**Best for**: Academic research, systematic reviews

**Setup Command**:
```bash
obsidian-kit init literature-review --template research
```

**Research Process**:

#### Phase 1: Search Strategy
```markdown
# Literature Review: {{research_topic}}

## 🔍 Search Strategy
### Databases
- [ ] PubMed
- [ ] IEEE Xplore
- [ ] Google Scholar
- [ ] ACM Digital Library

### Keywords
- {{keyword_1}}
- {{keyword_2}}
- {{keyword_3}}

### Inclusion Criteria
- Published after {{year}}
- Peer-reviewed
- English language
- {{specific_criteria}}

### Exclusion Criteria
- {{exclusion_criteria}}
```

#### Phase 2: Paper Analysis
```bash
# Extract insights from papers
obsidian-kit research extract-insights --source papers/

# Generate literature matrix
obsidian-kit research create-matrix --topic "{{research_topic}}"
```

**Paper Analysis Template**:
```markdown
# Paper: {{paper_title}}

## 📊 Citation
{{citation}}

## 🎯 Research Question
{{research_question}}

## 📋 Methodology
{{methodology}}

## 📈 Key Findings
{{findings}}

## 💡 Insights
{{insights}}

## 🔗 Connections
- Related to: [[related_papers]]
- Contradicts: [[contradictory_papers]]
- Supports: [[supporting_papers]]

## 📝 Notes
{{personal_notes}}
```

#### Phase 3: Synthesis
```dataview
TABLE 
  authors as "Authors",
  year as "Year",
  methodology as "Method",
  key_finding as "Key Finding"
FROM "1 - Source Materials/Research"
WHERE contains(topic, "{{research_topic}}")
SORT year DESC
```

### 🧪 Experiment Workflow

**Best for**: Scientific experiments, data analysis

**Setup Command**:
```bash
obsidian-kit init experiment --template scientific
```

**Experiment Template**:
```markdown
# Experiment: {{experiment_name}}

## 🎯 Hypothesis
{{hypothesis}}

## 📋 Methodology
### Materials
- {{material_1}}
- {{material_2}}

### Procedure
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}

## 📊 Data Collection
### Variables
- **Independent**: {{independent_var}}
- **Dependent**: {{dependent_var}}
- **Controlled**: {{controlled_vars}}

### Measurements
{{measurement_plan}}

## 📈 Results
{{results}}

## 📊 Analysis
{{analysis}}

## 💡 Conclusions
{{conclusions}}
```

---

## ✍️ Content Creation Workflows

### 📝 Blog Post Workflow

**Best for**: Content creators, bloggers, marketers

**Setup Command**:
```bash
obsidian-kit init blog-content --template blog
```

**Content Pipeline**:

#### Stage 1: Idea Generation
```markdown
# Content Ideas: {{month}} {{year}}

## 💡 Topic Ideas
- {{idea_1}}
- {{idea_2}}
- {{idea_3}}

## 🎯 Target Keywords
- {{keyword_1}}
- {{keyword_2}}

## 👥 Target Audience
{{audience_description}}

## 📊 Content Calendar
```dataview
TABLE 
  title as "Title",
  status as "Status",
  publish_date as "Publish Date",
  author as "Author"
FROM "4 - Projects/Content"
WHERE type = "blog-post"
SORT publish_date ASC
```
```

#### Stage 2: Content Creation
```bash
# Generate blog post outline
obsidian-kit content outline --topic "{{topic}}" --type blog-post

# AI-assisted writing
obsidian-kit content write --topic "{{topic}}" --words 1500
```

**Blog Post Template**:
```markdown
# {{blog_title}}

## 🎯 SEO Metadata
- **Title**: {{seo_title}}
- **Description**: {{meta_description}}
- **Keywords**: {{keywords}}
- **Category**: {{category}}

## 📝 Outline
1. {{section_1}}
2. {{section_2}}
3. {{section_3}}

## ✍️ Content
{{content}}

## 📊 Performance
- **Views**: {{views}}
- **Engagement**: {{engagement}}
- **Shares**: {{shares}}
```

### 📖 Book Writing Workflow

**Best for**: Authors, technical writers

**Setup Command**:
```bash
obsidian-kit init book-project --template book
```

**Book Structure**:
```
Book Project/
├── Front Matter/
├── Chapters/
│   ├── Chapter 1/
│   ├── Chapter 2/
│   └── ...
├── Back Matter/
└── Resources/
```

**Chapter Template**:
```markdown
# Chapter {{chapter_number}}: {{chapter_title}}

## 🎯 Objectives
{{chapter_objectives}}

## 📋 Outline
{{chapter_outline}}

## ✍️ Content
{{chapter_content}}

## 📊 Word Count
{{current_count}} / {{target_count}}

## 🔄 Review Status
- [ ] First draft
- [ ] Self-edit
- [ ] Peer review
- [ ] Professional edit
- [ ] Final proofread
```

---

## 👥 Team Collaboration Workflows

### 🤝 Team Onboarding Workflow

**Best for**: New team member integration

**Setup Command**:
```bash
obsidian-kit init onboarding --template team
```

**Onboarding Checklist**:
```markdown
# Onboarding: {{new_member_name}}

## 📅 Week 1: Orientation
- [ ] Team introductions
- [ ] System access setup
- [ ] Project overview
- [ ] Tool training

## 📅 Week 2: Integration
- [ ] First task assignment
- [ ] Mentor pairing
- [ ] Process training
- [ ] Team meeting participation

## 📅 Week 3: Contribution
- [ ] Independent task work
- [ ] Code review participation
- [ ] Documentation contribution
- [ ] Team presentation

## 📅 Week 4: Full Integration
- [ ] Lead small feature
- [ ] Cross-team collaboration
- [ ] Process improvement suggestions
- [ ] 30-day review
```

### 📊 Meeting Management Workflow

**Best for**: Regular team meetings, client meetings

**Setup Command**:
```bash
obsidian-kit init meetings --template collaboration
```

**Meeting Template**:
```markdown
# Meeting: {{meeting_title}} - {{date}}

## 🎯 Objectives
{{meeting_objectives}}

## 👥 Attendees
- {{attendee_1}}
- {{attendee_2}}
- {{attendee_3}}

## 📋 Agenda
1. {{agenda_item_1}} ({{time_1}})
2. {{agenda_item_2}} ({{time_2}})
3. {{agenda_item_3}} ({{time_3}})

## 📝 Notes
{{meeting_notes}}

## ✅ Action Items
```dataview
TABLE 
  assignee as "Owner",
  due_date as "Due Date",
  status as "Status"
FROM "4 - Projects"
WHERE contains(meeting, "{{meeting_id}}")
```

## 🔄 Follow-up
- [ ] Send meeting notes
- [ ] Update action items
- [ ] Schedule next meeting
```

---

## 🎯 Personal Productivity Workflows

### 📅 Daily Planning Workflow

**Best for**: Personal productivity, time management

**Setup Command**:
```bash
obsidian-kit init daily-planning --template personal
```

**Daily Template**:
```markdown
# Daily Plan: {{date}}

## 🎯 Today's Focus
{{daily_focus}}

## 📋 Task List
### High Priority
- [ ] {{task_1}}
- [ ] {{task_2}}

### Medium Priority
- [ ] {{task_3}}
- [ ] {{task_4}}

### Low Priority
- [ ] {{task_5}}

## ⏰ Time Blocks
| Time | Activity |
|------|----------|
| 9:00-10:00 | {{activity_1}} |
| 10:00-12:00 | {{activity_2}} |
| 13:00-15:00 | {{activity_3}} |
| 15:00-17:00 | {{activity_4}} |

## 📔 Evening Review
- **Completed**: {{completed_tasks}}
- **Challenges**: {{challenges}}
- **Learnings**: {{learnings}}
- **Tomorrow's Focus**: {{tomorrow_focus}}
```

### 🎯 Goal Setting Workflow

**Best for**: Personal development, long-term planning

**Setup Command**:
```bash
obsidian-kit init goal-setting --template goals
```

**Goal Framework**:
```markdown
# {{goal_category}} Goals: {{year}}

## 🎯 Annual Goals
### {{goal_1}}
- **Why**: {{why_1}}
- **Metrics**: {{metrics_1}}
- **Timeline**: {{timeline_1}}
- **Milestones**: {{milestones_1}}

### {{goal_2}}
- **Why**: {{why_2}}
- **Metrics**: {{metrics_2}}
- **Timeline**: {{timeline_2}}
- **Milestones**: {{milestones_2}}

## 📊 Quarterly Review
### Q1 Progress
{{q1_progress}}

### Q2 Progress
{{q2_progress}}

### Q3 Progress
{{q3_progress}}

### Q4 Progress
{{q4_progress}}

## 🔄 Monthly Actions
```dataview
LIST
FROM "4 - Projects"
WHERE contains(goal_category, "{{goal_category}}")
AND due_date >= date(today) AND due_date <= date(today) + 30d
```
```

---

## 🔧 Customizing Templates

### Creating Custom Templates

1. **Copy existing template**:
```bash
cp -r templates/existing-template templates/my-template
```

2. **Modify template structure**:
```bash
# Edit template files
obsidian-kit template edit my-template
```

3. **Add custom automation**:
```yaml
# templates/my-template/config.yml
automation:
  - trigger: "task creation"
    action: "assign to team member"
  - trigger: "deadline approach"
    action: "send reminder"
```

4. **Register template**:
```bash
obsidian-kit template register my-template
```

### Template Variables

Use these variables in your templates:

**System Variables**:
- `{{date}}` - Current date
- `{{time}}` - Current time
- `{{user}}` - Current user
- `{{vault_name}}` - Vault name

**Project Variables**:
- `{{project_name}}` - Project name
- `{{project_type}}` - Project type
- `{{team_members}}` - Team list

**Dynamic Variables**:
- `{{task_count}}` - Number of tasks
- `{{completion_rate}}` - Completion percentage
- `{{days_remaining}}` - Days to deadline

---

## 🚀 Implementing Workflows

### Step 1: Choose Your Template

1. **Assess your needs** - What type of work are you doing?
2. **Review templates** - Find the closest match
3. **Consider customization** - Will you need modifications?

### Step 2: Initialize Project

```bash
# Basic initialization
obsidian-kit init project-name --template template-name

# With custom configuration
obsidian-kit init project-name \
  --template template-name \
  --config custom-config.json
```

### Step 3: Configure Automation

```bash
# Set up automation rules
obsidian-kit automation configure --file automation.yml

# Test automation
obsidian-kit automation test --rule daily-tasks
```

### Step 4: Customize and Iterate

1. **Use the workflow** for a week
2. **Gather feedback** from team members
3. **Adjust templates** as needed
4. **Add new automation** rules

---

## 📞 Template Support

**Need help with templates?**

- **Documentation**: [[👤 User Guide]]
- **Community**: [Template Discussions](https://github.com/t3rpz/obsidian-kit/discussions/categories/templates)
- **Issues**: [Report Template Problems](https://github.com/t3rpz/obsidian-kit/issues)
- **Contributions**: [Submit Templates](https://github.com/t3rpz/obsidian-kit/pulls)

**Share Your Templates**

Have you created a useful template? Share it with the community!

1. **Export template**: `obsidian-kit template export my-template`
2. **Submit to community**: Create a pull request
3. **Get featured**: Templates may be included in future releases

---

## 🔗 Related Resources

- [[🎯 Use Case Library]] - Real-world template applications
- [[🎓 Learning Paths]] - Learn to create custom templates
- [[💡 Best Practices Guide]] - Optimize your workflows
- [[🔄 Migration Guide]] - Import existing workflows

---

*Last updated: 2025-10-02 | Available templates: 25+*

**Need help implementing a template?** Check [[🔧 Troubleshooting Guide]] or join our [community discussions](https://github.com/t3rpz/obsidian-kit/discussions).