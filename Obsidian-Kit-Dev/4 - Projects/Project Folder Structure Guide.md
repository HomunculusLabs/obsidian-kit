# Project Folder Structure Guide

## 📁 Recommended Structure

```
4 - Projects/
├── Projects.base                    # Main projects database
├── Tasks.base                       # Main tasks database
├── Project Management Dashboard.md  # Central dashboard
├── Project Management Schema.md     # Schema documentation
├── Project Management Setup Guide.md
├── Project Folder Structure Guide.md (this file)
│
├── ProjectName1/                    # Individual project folder
│   ├── ProjectName1.md             # Main project file
│   ├── ProjectName1 Dashboard.md   # Project-specific dashboard
│   ├── Tasks/                      # Project tasks folder
│   │   ├── Task - Feature A.md
│   │   ├── Task - Bug Fix B.md
│   │   └── Task - Enhancement C.md
│   ├── Resources/                  # Project resources (optional)
│   │   ├── Documentation/
│   │   ├── Assets/
│   │   └── References/
│   └── Archive/                    # Completed items (optional)
│
├── ProjectName2/
│   ├── ProjectName2.md
│   ├── ProjectName2 Dashboard.md
│   └── Tasks/
│       ├── Task - Setup.md
│       └── Task - Implementation.md
│
└── _Templates/                     # Project templates (optional)
    ├── New Project Template.md
    └── New Task Template.md
```

## 🎯 Current Structure (RuniverseAI Example)

```
4 - Projects/
├── Projects.base
├── Tasks.base
├── Project Management Dashboard.md
├── Project Management Schema.md
├── Project Management Setup Guide.md
│
└── RuniverseAI/
    ├── RuniverseAI.md              # Main project file
    ├── RuniverseAI Dashboard.md    # Project dashboard
    └── Tasks/                      # All RuniverseAI tasks
        ├── Task - Get Llama.CPP working.md
        ├── Task - Twitter icon changed.md
        ├── Task - Biomes reviewed.md
        ├── Task - Travel system.md
        ├── Task - Map Seeded.md
        └── Task - Skills Refined.md
```

## 📋 Folder Organization Rules

### Project Folders
- **Name format**: `ProjectName` (no spaces in folder names work best)
- **Location**: Direct subfolder of `/4 - Projects/`
- **Contents**:
  - Main project file (`ProjectName.md`)
  - Project dashboard (`ProjectName Dashboard.md`)
  - `Tasks/` subfolder for all project tasks

### Task Files
- **Location**: Always in `/4 - Projects/ProjectName/Tasks/`
- **Name format**: `Task - Description.md`
- **Linking**: Use `project: "[[ProjectName]]"` in frontmatter

### Supporting Folders (Optional)
- **Resources/**: Documentation, assets, references
- **Archive/**: Completed tasks and old materials
- **_Templates/**: Project-specific templates

## 🔗 Linking and Navigation

### Project to Tasks
In your project file, reference tasks:
```markdown
## Current Tasks
- [[Task - Feature Implementation]]
- [[Task - Bug Fixes]]
```

### Tasks to Project
In task frontmatter:
```yaml
project: "[[RuniverseAI]]"
```

### Cross-Project References
```markdown
Related to: [[OtherProject/Task - Similar Feature]]
```

## 📊 Database Views

### Tasks by Project Folder
The Tasks.base now includes a "Tasks by Project Folder" view that automatically groups tasks by their parent project folder.

### Project-Specific Filtering
Filter tasks for a specific project:
```base
filters:
  and:
    - file.hasTag("task")
    - file.path.contains("RuniverseAI")
```

## 🚀 Quick Setup for New Projects

### 1. Create Project Folder
```bash
mkdir "4 - Projects/NewProject"
mkdir "4 - Projects/NewProject/Tasks"
```

### 2. Create Main Project File
Use the `project` template and save as `NewProject.md`

### 3. Create Project Dashboard
Copy and modify an existing project dashboard

### 4. Add Tasks
Use task templates and save in the `Tasks/` subfolder

## 💡 Benefits of This Structure

### Organization
- **Clear hierarchy**: Projects contain their tasks
- **Easy navigation**: Logical folder structure
- **Scalable**: Add projects without cluttering

### Database Integration
- **Auto-grouping**: Tasks grouped by project folder
- **Filtered views**: See tasks for specific projects
- **Relationship tracking**: Clear project-task relationships

### Workflow
- **Focused work**: Project dashboards show only relevant tasks
- **Easy maintenance**: Archive completed projects as units
- **Template reuse**: Copy project folders for similar projects

---
*Structure guide created: 2025-09-27*