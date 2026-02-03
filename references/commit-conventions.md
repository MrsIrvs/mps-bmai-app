# Commit Conventions

This guide explains how to write commit messages and name branches so that GitHub activity automatically syncs with ClickUp tasks.

---

## Finding Your ClickUp Task ID

Every ClickUp task has a unique ID. To find it:

1. **In ClickUp**: Open the task → Click the **...** menu → **Copy link**
   - The URL will look like: `https://app.clickup.com/t/869c0cja8`
   - The task ID is: `869c0cja8`

2. **In the task view**: The ID appears in the top-right corner of the task detail panel

3. **Quick copy**: Click the task ID to copy it directly

---

## Commit Message Format

### Basic Structure

```
<type>: <description> #<task-id>
```

### Examples

```bash
# Feature work
git commit -m "feat: Create service_requests database table #869c0cja8"

# Bug fix
git commit -m "fix: Resolve RLS policy for client role #869c0cja9"

# Documentation
git commit -m "docs: Add API documentation for chat endpoint #869c0cjb0"

# Refactoring
git commit -m "refactor: Extract query functions to separate module #869c0cjb1"

# Testing
git commit -m "test: Add unit tests for service request queries #869c0cjb2"

# Chores (build, config, etc.)
git commit -m "chore: Update dependencies #869c0cjb3"
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature or functionality | Adding a new component, API endpoint |
| `fix` | Bug fix | Fixing broken functionality |
| `docs` | Documentation only | README updates, code comments |
| `refactor` | Code change that doesn't fix a bug or add a feature | Restructuring code |
| `test` | Adding or updating tests | Unit tests, integration tests |
| `chore` | Maintenance tasks | Dependency updates, config changes |
| `style` | Code style changes | Formatting, whitespace |
| `perf` | Performance improvements | Optimization, caching |

### Multiple Tasks in One Commit

If a commit relates to multiple tasks:

```bash
git commit -m "feat: Add loading states to service requests and documents #869c0cja8 #869c0cjb4"
```

### Alternative Task ID Formats

All of these formats are recognized:

```bash
# Hash prefix (recommended)
git commit -m "feat: Create database table #869c0cja8"

# CU prefix
git commit -m "feat: Create database table CU-869c0cja8"

# Lowercase
git commit -m "feat: Create database table #869C0CJA8"
```

---

## Branch Naming

### Format

```
<type>/<task-id>-<short-description>
```

### Examples

```bash
# Feature branch
git checkout -b feat/869c0cja8-service-requests-table

# Bug fix branch
git checkout -b fix/869c0cja9-rls-policy-client

# Multiple related tasks
git checkout -b feat/phase-1-foundation
```

### Branch Types

| Prefix | Use Case |
|--------|----------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `refactor/` | Code refactoring |
| `docs/` | Documentation |
| `test/` | Test additions |
| `chore/` | Maintenance |

---

## Pull Request Titles

### Format

```
<type>: <description> #<task-id>
```

### Examples

```
feat: Implement service request CRUD operations #869c0cja8
fix: Correct date formatting in analytics dashboard #869c0cjb5
docs: Add user guide for admin role #869c0cjc1
```

### PR Description Template

```markdown
## Summary
Brief description of what this PR does.

## ClickUp Tasks
- #869c0cja8 - Create service_requests database table
- #869c0cja9 - Implement RLS policies

## Changes
- Added `service_requests` table migration
- Created TypeScript types
- Implemented query functions

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Tested all user roles (admin, technician, client)
```

---

## How the Sync Works

When you include task IDs in your commits and PRs, the GitHub-ClickUp sync will:

| Your Action | ClickUp Update |
|-------------|----------------|
| Create branch with task ID | Task → **In Progress** |
| Push commit with task ID | Task → **In Progress** + comment added |
| Open PR with task ID | Task → **In Review** + comment added |
| Merge PR with task ID | Task → **Complete** + comment added |

### Example Timeline

```
1. Start work:
   git checkout -b feat/869c0cja8-service-requests
   → ClickUp: Task status changes to "In Progress"

2. Make commits:
   git commit -m "feat: Add database migration #869c0cja8"
   → ClickUp: Comment added with commit link

3. Open PR:
   Title: "feat: Service requests implementation #869c0cja8"
   → ClickUp: Task status changes to "In Review"

4. Merge PR:
   → ClickUp: Task status changes to "Complete"
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    COMMIT MESSAGE FORMAT                     │
├─────────────────────────────────────────────────────────────┤
│  <type>: <description> #<task-id>                           │
│                                                             │
│  Types: feat | fix | docs | refactor | test | chore         │
│                                                             │
│  Example:                                                   │
│  feat: Create service_requests database table #869c0cja8    │
├─────────────────────────────────────────────────────────────┤
│                      BRANCH FORMAT                          │
├─────────────────────────────────────────────────────────────┤
│  <type>/<task-id>-<short-description>                       │
│                                                             │
│  Example:                                                   │
│  feat/869c0cja8-service-requests-table                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Tips

1. **Always include task IDs** - This keeps ClickUp automatically updated
2. **One task per commit** when possible - Makes tracking cleaner
3. **Use meaningful descriptions** - Future you will thank present you
4. **Keep commits atomic** - Each commit should do one thing well

---

## Need Help?

- **Can't find task ID?** Ask in the project Slack channel
- **Forgot to add task ID?** You can amend the commit: `git commit --amend`
- **Multiple tasks in one PR?** List all task IDs in the PR title and description

---

*This convention integrates with the ClickUp sync workflow. For questions, contact the project lead.*
