# ClickUp Import Instructions for TASKS.md

These instructions explain how to parse and import the `TASKS.md` file into ClickUp.

---

## File Structure Overview

The `TASKS.md` file contains:
- **Project header** with start and target completion dates
- **7 Phases**, each containing a table of tasks
- **Project summary** table at the end

---

## How to Create the Project Structure

### 1. Create a List for Each Phase

Each `## Phase X:` section should become a **List** in ClickUp.

**Phase names:**
- Phase 1: Foundation
- Phase 2: Documents
- Phase 3: AI Integration
- Phase 4: Analytics
- Phase 5: Polish and Testing
- Phase 6: Marketing and Internal Rollout
- Phase 7: External Pilot and GA

### 2. Set List Dates

Each phase has metadata at the top:
```
**Phase Start:** YYYY-MM-DD
**Phase End:** YYYY-MM-DD
**Milestone:** [Milestone Name]
```

Use these to set the List's start and due dates.

---

## How to Create Tasks

### Task Table Columns

Each phase contains a table with these columns:

| Column | ClickUp Field | Description |
|--------|---------------|-------------|
| Task Title | Task Name | The name of the task |
| Description | Task Description | Detailed description of what to do |
| Estimate (h) | Time Estimate | Hours estimated (set as time estimate) |
| Start | Start Date | Task start date (YYYY-MM-DD format) |
| End | Due Date | Task due date (YYYY-MM-DD format) |
| Blocked By | Relationship | Tasks that must complete before this one (see below) |
| Status | Status | Task status (see status mapping below) |

### Status Mapping

Map the status values as follows:

| TASKS.md Status | ClickUp Status |
|-----------------|----------------|
| To Do | To Do (or Open) |
| In Progress | In Progress |
| In Review | In Review (or create custom) |
| Testing | Testing (or create custom) |
| Done | Complete |
| Blocked | Blocked (or On Hold) |

---

## How to Create Relationships (Dependencies)

The **"Blocked By"** column contains task dependencies. This maps to ClickUp's **"Waiting On"** relationship type.

### Rules for Parsing "Blocked By"

1. **If the value is `-`**: No dependencies, skip relationship creation

2. **If the value contains task titles**: Create a "Waiting On" relationship for each title listed

3. **Multiple dependencies**: Titles are separated by commas. Create a relationship for each one.

### Example

For this task row:
```
| Build query functions for service requests | Create functions for... | 3 | 2026-02-03 | 2026-02-03 | Create TypeScript types for service requests | To Do |
```

Create a **"Waiting On"** relationship where:
- **This task**: "Build query functions for service requests"
- **Is waiting on**: "Create TypeScript types for service requests"

### Cross-Phase Dependencies

Some tasks depend on tasks in other phases. For example:
```
| Implement RAG pipeline | Build retrieval... | 6 | 2026-02-17 | 2026-02-18 | Create chat API endpoint, Connect to manual search infrastructure | To Do |
```

This task in Phase 3 depends on:
- "Create chat API endpoint" (same phase)
- "Connect to manual search infrastructure" (from Phase 2)

Search across all Lists/Phases to find the blocking task by its exact title.

---

## Import Process - Step by Step

### Step 1: Create the Lists
1. Create a Folder called "MPS Building Management AI"
2. Create 7 Lists, one for each Phase
3. Set start/end dates on each List from the Phase metadata

### Step 2: Create All Tasks First (Without Relationships)
For each phase, create all tasks with:
- Task Name (from Task Title column)
- Description
- Time Estimate (from Estimate column, in hours)
- Start Date
- Due Date
- Status

### Step 3: Create Relationships
After ALL tasks exist across all phases:
1. Go through each task that has a "Blocked By" value (not "-")
2. For each task title in "Blocked By":
   - Search for the task by exact title
   - Create a "Waiting On" relationship linking to it

---

## Milestones

Each phase has a **Milestone** in the metadata:
```
**Milestone:** M1 - Service Requests & Settings Complete
```

You can either:
- Create a Milestone task at the end of each phase
- Or use ClickUp's Milestone feature if available
- Or add the milestone as a tag/label to the final task in each phase

---

## Summary Table (Optional)

The Project Summary table at the bottom provides totals:
- Total tasks per phase
- Total estimated hours per phase
- Phase date ranges

This can be used to verify the import was complete.

---

## Verification Checklist

After import, verify:
- [ ] 7 Lists created (one per phase)
- [ ] 70 total tasks created
- [ ] All tasks have start and due dates
- [ ] All tasks have time estimates
- [ ] All "Blocked By" relationships are created as "Waiting On"
- [ ] Tasks with `-` in Blocked By have no dependencies

---

## Notes

- Task titles must match **exactly** when creating relationships
- Some task titles are intentionally unique to avoid ambiguity (e.g., "Add loading states and error handling for service requests" vs "Add loading states and error handling for documents")
- All dates are in YYYY-MM-DD format
- Time estimates are in hours

---

*These instructions accompany TASKS.md in the mps-bmai-app repository.*
