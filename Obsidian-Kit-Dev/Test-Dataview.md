# Test Dataview Queries

## Test 1: Basic Task Query
```dataview
TABLE 
  title,
  status,
  priority,
  due_date
FROM "4 - Projects"
WHERE contains(tags, "task")
LIMIT 5
```

## Test 2: Path Filter Test
```dataview
LIST
FROM "4 - Projects"
WHERE file.path.contains("4 - Projects") AND contains(tags, "task")
```

## Test 3: Task Status Breakdown
```dataview
TABLE 
  status,
  count(rows) as "Count"
FROM "4 - Projects"
WHERE contains(tags, "task")
GROUP BY status
```

## Test 4: Active Tasks
```dataview
TABLE 
  title,
  priority,
  due_date,
  project
FROM "4 - Projects"
WHERE contains(tags, "task") AND status != "completed"
SORT priority DESC, due_date ASC
LIMIT 10
```