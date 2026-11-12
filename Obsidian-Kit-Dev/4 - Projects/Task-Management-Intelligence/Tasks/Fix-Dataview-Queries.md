---
title: "Fix Dataview Queries"
status: "completed"
priority: "high"
project: "[[Task-Management-Intelligence]]"
assignee: "AI Agent"
due_date: "2025-10-07"
created_date: "2025-10-01"
completed_date: "2025-10-01"
time_estimate: 120
time_spent: 90
dependencies: []
subtasks:
  - "Fix Tasks.base path references from 8 - Projects to 4 - Projects"
  - "Repair broken filters in task database"
  - "Fix formula calculations and references"
  - "Test all Dataview queries and views"
tags:
  - task
  - critical
  - dataview
  - bug-fix
---

# 🛠️ Fix Dataview Queries

## 🎯 Objective
Fix the critical Dataview query issues in Tasks.base that are preventing the entire task management system from functioning.

## 📋 Acceptance Criteria
- [ ] All path references changed from "8 - Projects" to "4 - Projects"
- [ ] Task filters working correctly and finding tasks
- [ ] All formulas calculating properly without errors
- [ ] All Dataview views (Todo List, Kanban, etc.) displaying data
- [ ] Status command showing accurate task statistics
- [ ] Project dashboards displaying real task data

## 🔧 Technical Implementation

### Phase 1: Path Reference Fixes
- Update all `file.path.contains("8 - Projects")` to `file.path.contains("4 - Projects")`
- Fix folder project calculations in formulas
- Update any hardcoded path references
- Verify all file links are correct

### Phase 2: Filter Repairs
- Fix task detection filters
- Repair status-based filtering
- Ensure date-based filters working
- Test tag-based filtering

### Phase 3: Formula Fixes
- Repair all formula calculations
- Fix status icon logic
- Fix priority and urgency calculations
- Ensure date arithmetic working

### Phase 4: View Testing
- Test Todo List view
- Test Kanban board views
- Test Tasks by Project view
- Test all table and card views

## 🚨 Critical Issues Found
- Tasks.base line 20: `file.path.contains("8 - Projects")` should be `"4 - Projects"`
- Status command parsing broken due to incorrect task detection
- Project dashboards showing empty data
- All task management functionality non-functional

## 📊 Success Metrics
- Dataview queries execute without errors
- Tasks appear correctly in all views
- Status command shows accurate statistics
- Project dashboards display real data
- Task creation and editing works properly

## 🔗 Dependencies
- Current Tasks.base file (needs repair)
- Dataview plugin (must be working)
- Task files (need to exist for testing)

## 📝 Notes
This is the most critical task - nothing else will work until these queries are fixed. The entire task management system is currently broken due to these path reference errors.

## 🧪 Testing Plan
1. Create sample task files in 4 - Projects
2. Test each Dataview view individually
3. Verify status command accuracy
4. Test project dashboard functionality
5. Validate task creation and editing workflow