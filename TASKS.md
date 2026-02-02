# MPS Building Management AI - Project Tasks

**Project Start Date:** 2026-02-02
**Target Completion:** 2026-03-14 (6 weeks)

---

## Phase 1: Foundation
**Phase Start:** 2026-02-02
**Phase End:** 2026-02-08
**Phase Duration:** 5 days

### Milestone: M1 - Service Requests & Settings Complete

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 1.1 | Create service_requests database table and migrations | 2h | 2026-02-02 | 2026-02-02 | - | To Do |
| 1.2 | Implement RLS policies for service requests | 2h | 2026-02-02 | 2026-02-02 | 1.1 | To Do |
| 1.3 | Create TypeScript types for service requests | 1h | 2026-02-02 | 2026-02-02 | 1.1 | To Do |
| 1.4 | Build query functions (create, read, update) | 3h | 2026-02-03 | 2026-02-03 | 1.3 | To Do |
| 1.5 | Wire ServiceRequestList component to Supabase | 4h | 2026-02-03 | 2026-02-04 | 1.4 | To Do |
| 1.6 | Add status update functionality for technicians/admins | 3h | 2026-02-04 | 2026-02-04 | 1.5 | To Do |
| 1.7 | Add loading states and error handling | 2h | 2026-02-05 | 2026-02-05 | 1.6 | To Do |
| 1.8 | Implement Settings page persistence | 4h | 2026-02-05 | 2026-02-06 | - | To Do |
| 1.9 | Unit tests for service request functions | 3h | 2026-02-06 | 2026-02-06 | 1.4 | To Do |
| 1.10 | Phase 1 code review and bug fixes | 4h | 2026-02-07 | 2026-02-08 | 1.1-1.9 | To Do |

**Phase 1 Total Estimate:** 28 hours (3.5 days)

---

## Phase 2: Documents
**Phase Start:** 2026-02-09
**Phase End:** 2026-02-15
**Phase Duration:** 5 days

### Milestone: M2 - Document Management Complete

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 2.1 | Set up Supabase Storage bucket for documents | 2h | 2026-02-09 | 2026-02-09 | - | To Do |
| 2.2 | Create document metadata database table | 2h | 2026-02-09 | 2026-02-09 | - | To Do |
| 2.3 | Implement file upload component | 4h | 2026-02-10 | 2026-02-10 | 2.1 | To Do |
| 2.4 | Build document list with real data | 3h | 2026-02-10 | 2026-02-11 | 2.2 | To Do |
| 2.5 | Implement keyword search functionality | 4h | 2026-02-11 | 2026-02-12 | 2.4 | To Do |
| 2.6 | Add document preview modal | 3h | 2026-02-12 | 2026-02-12 | 2.4 | To Do |
| 2.7 | Add document download functionality | 2h | 2026-02-12 | 2026-02-13 | 2.4 | To Do |
| 2.8 | Connect to existing manual search infrastructure | 4h | 2026-02-13 | 2026-02-13 | 2.5 | To Do |
| 2.9 | Add loading states and error handling | 2h | 2026-02-14 | 2026-02-14 | 2.3-2.8 | To Do |
| 2.10 | Phase 2 code review and bug fixes | 4h | 2026-02-14 | 2026-02-15 | 2.1-2.9 | To Do |

**Phase 2 Total Estimate:** 30 hours (3.75 days)

---

## Phase 3: AI Integration
**Phase Start:** 2026-02-16
**Phase End:** 2026-02-22
**Phase Duration:** 5 days

### Milestone: M3 - AI Chat Operational

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 3.1 | Set up LLM API connection (Claude/OpenAI) | 3h | 2026-02-16 | 2026-02-16 | - | To Do |
| 3.2 | Create chat API endpoint/edge function | 4h | 2026-02-16 | 2026-02-17 | 3.1 | To Do |
| 3.3 | Implement RAG pipeline using manual content | 6h | 2026-02-17 | 2026-02-18 | 3.2, 2.8 | To Do |
| 3.4 | Connect chat interface to real AI responses | 4h | 2026-02-18 | 2026-02-19 | 3.3 | To Do |
| 3.5 | Add chat history persistence to database | 3h | 2026-02-19 | 2026-02-19 | 3.4 | To Do |
| 3.6 | Implement context-aware responses per building | 3h | 2026-02-20 | 2026-02-20 | 3.4 | To Do |
| 3.7 | Add source citation in AI responses | 2h | 2026-02-20 | 2026-02-20 | 3.4 | To Do |
| 3.8 | Add loading states and error handling | 2h | 2026-02-21 | 2026-02-21 | 3.4-3.7 | To Do |
| 3.9 | Phase 3 code review and bug fixes | 4h | 2026-02-21 | 2026-02-22 | 3.1-3.8 | To Do |

**Phase 3 Total Estimate:** 31 hours (3.9 days)

---

## Phase 4: Analytics
**Phase Start:** 2026-02-20
**Phase End:** 2026-02-26
**Phase Duration:** 5 days (overlaps with Phase 3)

### Milestone: M4 - Analytics Dashboard Complete

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 4.1 | Create analytics database queries | 3h | 2026-02-20 | 2026-02-20 | 1.10, 2.10 | To Do |
| 4.2 | Implement Recharts line/bar charts | 4h | 2026-02-21 | 2026-02-22 | 4.1 | To Do |
| 4.3 | Build service request metrics dashboard | 3h | 2026-02-22 | 2026-02-23 | 4.2 | To Do |
| 4.4 | Add chat usage analytics | 3h | 2026-02-23 | 2026-02-24 | 4.2, 3.5 | To Do |
| 4.5 | Create document access reports | 2h | 2026-02-24 | 2026-02-24 | 4.2 | To Do |
| 4.6 | Add date range filtering | 2h | 2026-02-25 | 2026-02-25 | 4.3-4.5 | To Do |
| 4.7 | Phase 4 code review and bug fixes | 3h | 2026-02-25 | 2026-02-26 | 4.1-4.6 | To Do |

**Phase 4 Total Estimate:** 20 hours (2.5 days)

---

## Phase 5: Polish & Testing
**Phase Start:** 2026-02-23
**Phase End:** 2026-02-28
**Phase Duration:** 4 days

### Milestone: M5 - Internal UAT Complete

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 5.1 | Add loading skeletons across all pages | 3h | 2026-02-23 | 2026-02-23 | - | To Do |
| 5.2 | Implement toast notifications for all actions | 2h | 2026-02-23 | 2026-02-24 | - | To Do |
| 5.3 | Fix responsive design issues | 4h | 2026-02-24 | 2026-02-25 | - | To Do |
| 5.4 | Performance optimization (lazy loading, caching) | 4h | 2026-02-25 | 2026-02-25 | - | To Do |
| 5.5 | Security review and fixes | 4h | 2026-02-26 | 2026-02-26 | 1-4 | To Do |
| 5.6 | Accessibility improvements (ARIA, keyboard nav) | 3h | 2026-02-26 | 2026-02-27 | - | To Do |
| 5.7 | Execute UAT test cases - Admin role | 4h | 2026-02-27 | 2026-02-27 | 5.1-5.6 | To Do |
| 5.8 | Execute UAT test cases - Technician role | 3h | 2026-02-27 | 2026-02-27 | 5.1-5.6 | To Do |
| 5.9 | Execute UAT test cases - Client role | 3h | 2026-02-28 | 2026-02-28 | 5.1-5.6 | To Do |
| 5.10 | UAT bug fixes | 6h | 2026-02-28 | 2026-02-28 | 5.7-5.9 | To Do |

**Phase 5 Total Estimate:** 36 hours (4.5 days)

---

## Phase 6: Marketing & Internal Rollout
**Phase Start:** 2026-03-01
**Phase End:** 2026-03-07
**Phase Duration:** 5 days

### Milestone: M6 - Marketing Ready
### Milestone: M7 - Internal Rollout Complete

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 6.1 | Create product overview one-pager | 3h | 2026-03-01 | 2026-03-01 | - | To Do |
| 6.2 | Write user guide - Admin role | 3h | 2026-03-01 | 2026-03-02 | - | To Do |
| 6.3 | Write user guide - Technician role | 2h | 2026-03-02 | 2026-03-02 | - | To Do |
| 6.4 | Write user guide - Client role | 2h | 2026-03-02 | 2026-03-02 | - | To Do |
| 6.5 | Record demo video (3-5 minutes) | 4h | 2026-03-03 | 2026-03-03 | 5.10 | To Do |
| 6.6 | Create FAQ document | 2h | 2026-03-03 | 2026-03-03 | - | To Do |
| 6.7 | Prepare training presentation | 3h | 2026-03-03 | 2026-03-04 | 6.2-6.4 | To Do |
| 6.8 | Deploy to production environment | 3h | 2026-03-04 | 2026-03-04 | 5.10 | To Do |
| 6.9 | Internal pilot (3-5 users) | 8h | 2026-03-04 | 2026-03-05 | 6.8 | To Do |
| 6.10 | Fix critical issues from pilot | 4h | 2026-03-05 | 2026-03-05 | 6.9 | To Do |
| 6.11 | Send internal launch announcement | 1h | 2026-03-06 | 2026-03-06 | 6.10 | To Do |
| 6.12 | Conduct training session - Technicians | 2h | 2026-03-06 | 2026-03-06 | 6.7 | To Do |
| 6.13 | Conduct training session - Admins | 2h | 2026-03-06 | 2026-03-06 | 6.7 | To Do |
| 6.14 | Monitor and support internal users | 8h | 2026-03-06 | 2026-03-07 | 6.11 | To Do |

**Phase 6 Total Estimate:** 47 hours (5.9 days)

---

## Phase 7: External Pilot & GA
**Phase Start:** 2026-03-08
**Phase End:** 2026-03-14
**Phase Duration:** 5 days

### Milestone: M8 - External Pilot Complete
### Milestone: M9 - General Availability

| Task ID | Task | Estimate | Start | End | Dependencies | Status |
|---------|------|----------|-------|-----|--------------|--------|
| 7.1 | Select and invite pilot clients (2-3) | 2h | 2026-03-08 | 2026-03-08 | 6.14 | To Do |
| 7.2 | Set up pilot client accounts and buildings | 3h | 2026-03-08 | 2026-03-08 | 7.1 | To Do |
| 7.3 | Conduct pilot client onboarding calls | 3h | 2026-03-09 | 2026-03-09 | 7.2 | To Do |
| 7.4 | Daily pilot support and monitoring | 8h | 2026-03-09 | 2026-03-11 | 7.3 | To Do |
| 7.5 | Collect pilot feedback (mid-week check-in) | 2h | 2026-03-11 | 2026-03-11 | 7.4 | To Do |
| 7.6 | Fix issues from pilot feedback | 6h | 2026-03-11 | 2026-03-12 | 7.5 | To Do |
| 7.7 | Collect final pilot feedback and NPS | 2h | 2026-03-12 | 2026-03-12 | 7.6 | To Do |
| 7.8 | Prepare GA announcement | 2h | 2026-03-13 | 2026-03-13 | 7.7 | To Do |
| 7.9 | Send GA announcement to all clients | 1h | 2026-03-14 | 2026-03-14 | 7.8 | To Do |
| 7.10 | GA launch and monitoring | 4h | 2026-03-14 | 2026-03-14 | 7.9 | To Do |

**Phase 7 Total Estimate:** 33 hours (4.1 days)

---

## Summary

| Phase | Start | End | Estimate | Tasks |
|-------|-------|-----|----------|-------|
| Phase 1: Foundation | 2026-02-02 | 2026-02-08 | 28h | 10 |
| Phase 2: Documents | 2026-02-09 | 2026-02-15 | 30h | 10 |
| Phase 3: AI Integration | 2026-02-16 | 2026-02-22 | 31h | 9 |
| Phase 4: Analytics | 2026-02-20 | 2026-02-26 | 20h | 7 |
| Phase 5: Polish & Testing | 2026-02-23 | 2026-02-28 | 36h | 10 |
| Phase 6: Marketing & Rollout | 2026-03-01 | 2026-03-07 | 47h | 14 |
| Phase 7: External Pilot & GA | 2026-03-08 | 2026-03-14 | 33h | 10 |
| **TOTAL** | **2026-02-02** | **2026-03-14** | **225h** | **70 tasks** |

---

## Task Status Legend
- **To Do** - Not started
- **In Progress** - Currently being worked on
- **In Review** - Awaiting code review
- **Testing** - In QA/UAT
- **Done** - Completed
- **Blocked** - Waiting on dependency or issue

---

*Last updated: 2026-02-02*
