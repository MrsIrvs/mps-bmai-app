# Project Name: MPS Building Management AI
**Project Start Date:** 2026-02-02
**Target Completion:** 2026-03-14

---

## Phase 1: Foundation
**Phase Start:** 2026-02-02
**Phase End:** 2026-02-08
**Milestone:** M1 - Service Requests & Settings Complete

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 1.1 | Create service_requests database table | Set up the main service_requests table with all required columns in Supabase | 2 | 2026-02-02 | 2026-02-02 | - | To Do |
| 1.2 | Implement RLS policies for service requests | Add row-level security policies for admin, technician, and client roles | 2 | 2026-02-02 | 2026-02-02 | 1.1 | To Do |
| 1.3 | Create TypeScript types for service requests | Define TypeScript interfaces and types for service request objects | 1 | 2026-02-02 | 2026-02-02 | 1.1 | To Do |
| 1.4 | Build query functions for service requests | Create functions for create, read, update operations using Supabase client | 3 | 2026-02-03 | 2026-02-03 | 1.3 | To Do |
| 1.5 | Wire ServiceRequestList to Supabase | Connect the existing UI component to fetch and display real data | 4 | 2026-02-03 | 2026-02-04 | 1.4 | To Do |
| 1.6 | Add status update for technicians and admins | Implement dropdown/buttons for technicians and admins to change request status | 3 | 2026-02-04 | 2026-02-04 | 1.5 | To Do |
| 1.7 | Add loading states and error handling | Implement loading skeletons and toast notifications for service requests | 2 | 2026-02-05 | 2026-02-05 | 1.6 | To Do |
| 1.8 | Implement Settings page persistence | Wire Settings form to save preferences to database | 4 | 2026-02-05 | 2026-02-06 | - | To Do |
| 1.9 | Write unit tests for service requests | Create tests for query functions and component logic | 3 | 2026-02-06 | 2026-02-06 | 1.4 | To Do |
| 1.10 | Phase 1 code review and bug fixes | Review all Phase 1 code and fix any issues found | 4 | 2026-02-07 | 2026-02-08 | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 | To Do |

---

## Phase 2: Documents
**Phase Start:** 2026-02-09
**Phase End:** 2026-02-15
**Milestone:** M2 - Document Management Complete

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 2.1 | Set up Supabase Storage bucket | Create and configure storage bucket for document uploads | 2 | 2026-02-09 | 2026-02-09 | - | To Do |
| 2.2 | Create document metadata table | Set up database table to store document metadata and references | 2 | 2026-02-09 | 2026-02-09 | - | To Do |
| 2.3 | Implement file upload component | Build UI component for selecting and uploading files to Supabase Storage | 4 | 2026-02-10 | 2026-02-10 | 2.1 | To Do |
| 2.4 | Build document list with real data | Replace mock data with real Supabase queries in DocumentsPage | 3 | 2026-02-10 | 2026-02-11 | 2.2 | To Do |
| 2.5 | Implement keyword search | Connect search input to database full-text search functionality | 4 | 2026-02-11 | 2026-02-12 | 2.4 | To Do |
| 2.6 | Add document preview modal | Create modal component to preview documents without downloading | 3 | 2026-02-12 | 2026-02-12 | 2.4 | To Do |
| 2.7 | Add document download | Implement secure download functionality from Supabase Storage | 2 | 2026-02-12 | 2026-02-13 | 2.4 | To Do |
| 2.8 | Connect to manual search infrastructure | Integrate with existing manual_content and vector search tables | 4 | 2026-02-13 | 2026-02-13 | 2.5 | To Do |
| 2.9 | Add loading states and error handling | Implement loading skeletons and error toasts for documents | 2 | 2026-02-14 | 2026-02-14 | 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 | To Do |
| 2.10 | Phase 2 code review and bug fixes | Review all Phase 2 code and fix any issues found | 4 | 2026-02-14 | 2026-02-15 | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 | To Do |

---

## Phase 3: AI Integration
**Phase Start:** 2026-02-16
**Phase End:** 2026-02-22
**Milestone:** M3 - AI Chat Operational

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 3.1 | Set up LLM API connection | Configure Claude or OpenAI API with environment variables and client | 3 | 2026-02-16 | 2026-02-16 | - | To Do |
| 3.2 | Create chat API endpoint | Build Supabase Edge Function to handle chat requests securely | 4 | 2026-02-16 | 2026-02-17 | 3.1 | To Do |
| 3.3 | Implement RAG pipeline | Build retrieval-augmented generation using manual content and embeddings | 6 | 2026-02-17 | 2026-02-18 | 3.2, 2.8 | To Do |
| 3.4 | Connect chat interface to AI | Replace simulated responses with real LLM API calls in ChatInterface | 4 | 2026-02-18 | 2026-02-19 | 3.3 | To Do |
| 3.5 | Add chat history persistence | Store chat sessions and messages in database for continuity | 3 | 2026-02-19 | 2026-02-19 | 3.4 | To Do |
| 3.6 | Implement building-aware context | Filter RAG results to selected building for relevant responses | 3 | 2026-02-20 | 2026-02-20 | 3.4 | To Do |
| 3.7 | Add source citations in responses | Display document and section references in AI responses | 2 | 2026-02-20 | 2026-02-20 | 3.4 | To Do |
| 3.8 | Add loading states and error handling | Implement streaming indicators and error handling for chat | 2 | 2026-02-21 | 2026-02-21 | 3.4, 3.5, 3.6, 3.7 | To Do |
| 3.9 | Phase 3 code review and bug fixes | Review all Phase 3 code and fix any issues found | 4 | 2026-02-21 | 2026-02-22 | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8 | To Do |

---

## Phase 4: Analytics
**Phase Start:** 2026-02-20
**Phase End:** 2026-02-26
**Milestone:** M4 - Analytics Dashboard Complete

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 4.1 | Create analytics database queries | Build SQL queries for metrics aggregation and reporting | 3 | 2026-02-20 | 2026-02-20 | 1.10, 2.10 | To Do |
| 4.2 | Implement Recharts visualizations | Set up line and bar charts using Recharts library | 4 | 2026-02-21 | 2026-02-22 | 4.1 | To Do |
| 4.3 | Build service request metrics | Create dashboard cards showing request counts by status and priority | 3 | 2026-02-22 | 2026-02-23 | 4.2 | To Do |
| 4.4 | Add chat usage analytics | Display chat session counts and query statistics | 3 | 2026-02-23 | 2026-02-24 | 4.2, 3.5 | To Do |
| 4.5 | Create document access reports | Show document view and download statistics | 2 | 2026-02-24 | 2026-02-24 | 4.2 | To Do |
| 4.6 | Add date range filtering | Implement date picker to filter analytics by time period | 2 | 2026-02-25 | 2026-02-25 | 4.3, 4.4, 4.5 | To Do |
| 4.7 | Phase 4 code review and bug fixes | Review all Phase 4 code and fix any issues found | 3 | 2026-02-25 | 2026-02-26 | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 | To Do |

---

## Phase 5: Polish and Testing
**Phase Start:** 2026-02-23
**Phase End:** 2026-02-28
**Milestone:** M5 - Internal UAT Complete

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 5.1 | Add loading skeletons across all pages | Implement consistent loading states for better UX | 3 | 2026-02-23 | 2026-02-23 | - | To Do |
| 5.2 | Implement toast notifications | Add success and error toasts for all user actions | 2 | 2026-02-23 | 2026-02-24 | - | To Do |
| 5.3 | Fix responsive design issues | Test and fix layout issues on tablet and mobile viewports | 4 | 2026-02-24 | 2026-02-25 | - | To Do |
| 5.4 | Performance optimization | Implement lazy loading, caching, and optimize bundle size | 4 | 2026-02-25 | 2026-02-25 | - | To Do |
| 5.5 | Security review and fixes | Audit RLS policies, validate inputs, check for vulnerabilities | 4 | 2026-02-26 | 2026-02-26 | 1.10, 2.10, 3.9, 4.7 | To Do |
| 5.6 | Accessibility improvements | Add ARIA labels, keyboard navigation, and screen reader support | 3 | 2026-02-26 | 2026-02-27 | - | To Do |
| 5.7 | Execute UAT test cases for Admin role | Run all admin test cases from UAT plan and log defects | 4 | 2026-02-27 | 2026-02-27 | 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 | To Do |
| 5.8 | Execute UAT test cases for Technician role | Run all technician test cases from UAT plan and log defects | 3 | 2026-02-27 | 2026-02-27 | 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 | To Do |
| 5.9 | Execute UAT test cases for Client role | Run all client test cases from UAT plan and log defects | 3 | 2026-02-28 | 2026-02-28 | 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 | To Do |
| 5.10 | UAT bug fixes | Fix all critical and high priority bugs found during UAT | 6 | 2026-02-28 | 2026-02-28 | 5.7, 5.8, 5.9 | To Do |

---

## Phase 6: Marketing and Internal Rollout
**Phase Start:** 2026-03-01
**Phase End:** 2026-03-07
**Milestone:** M6 - Marketing Ready, M7 - Internal Rollout Complete

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 6.1 | Create product overview one-pager | Write single-page summary of features and benefits | 3 | 2026-03-01 | 2026-03-01 | - | To Do |
| 6.2 | Write user guide for Admin role | Create documentation for admin users covering all features | 3 | 2026-03-01 | 2026-03-02 | - | To Do |
| 6.3 | Write user guide for Technician role | Create documentation for technician users | 2 | 2026-03-02 | 2026-03-02 | - | To Do |
| 6.4 | Write user guide for Client role | Create documentation for client/FM users | 2 | 2026-03-02 | 2026-03-02 | - | To Do |
| 6.5 | Record demo video | Create 3-5 minute walkthrough video of main features | 4 | 2026-03-03 | 2026-03-03 | 5.10 | To Do |
| 6.6 | Create FAQ document | Compile frequently asked questions and answers | 2 | 2026-03-03 | 2026-03-03 | - | To Do |
| 6.7 | Prepare training presentation | Build slide deck for user training sessions | 3 | 2026-03-03 | 2026-03-04 | 6.2, 6.3, 6.4 | To Do |
| 6.8 | Deploy to production | Deploy application to production environment and verify | 3 | 2026-03-04 | 2026-03-04 | 5.10 | To Do |
| 6.9 | Internal pilot with 3-5 users | Onboard pilot users and collect initial feedback | 8 | 2026-03-04 | 2026-03-05 | 6.8 | To Do |
| 6.10 | Fix critical issues from pilot | Address any blocking issues found by pilot users | 4 | 2026-03-05 | 2026-03-05 | 6.9 | To Do |
| 6.11 | Send internal launch announcement | Email and Slack announcement to all internal users | 1 | 2026-03-06 | 2026-03-06 | 6.10 | To Do |
| 6.12 | Conduct training for Technicians | Run training session for technician users | 2 | 2026-03-06 | 2026-03-06 | 6.7 | To Do |
| 6.13 | Conduct training for Admins | Run training session for admin users | 2 | 2026-03-06 | 2026-03-06 | 6.7 | To Do |
| 6.14 | Monitor and support internal users | Provide support and track adoption metrics | 8 | 2026-03-06 | 2026-03-07 | 6.11 | To Do |

---

## Phase 7: External Pilot and GA
**Phase Start:** 2026-03-08
**Phase End:** 2026-03-14
**Milestone:** M8 - External Pilot Complete, M9 - General Availability

| Task ID | Task Title | Description | Estimate (h) | Start | End | Dependencies | Status |
|---------|-----------|-------------|--------------|-------|-----|--------------|--------|
| 7.1 | Select and invite pilot clients | Identify 2-3 friendly clients and send pilot invitations | 2 | 2026-03-08 | 2026-03-08 | 6.14 | To Do |
| 7.2 | Set up pilot client accounts | Create accounts and configure building access for pilot clients | 3 | 2026-03-08 | 2026-03-08 | 7.1 | To Do |
| 7.3 | Conduct pilot onboarding calls | Run 45-minute onboarding sessions with each pilot client | 3 | 2026-03-09 | 2026-03-09 | 7.2 | To Do |
| 7.4 | Daily pilot support and monitoring | Monitor pilot usage and respond to support requests | 8 | 2026-03-09 | 2026-03-11 | 7.3 | To Do |
| 7.5 | Collect mid-week pilot feedback | Check in with pilot clients to gather early feedback | 2 | 2026-03-11 | 2026-03-11 | 7.4 | To Do |
| 7.6 | Fix issues from pilot feedback | Address issues and suggestions from pilot clients | 6 | 2026-03-11 | 2026-03-12 | 7.5 | To Do |
| 7.7 | Collect final feedback and NPS | Gather final pilot feedback and Net Promoter Score | 2 | 2026-03-12 | 2026-03-12 | 7.6 | To Do |
| 7.8 | Prepare GA announcement | Write announcement email and update marketing materials | 2 | 2026-03-13 | 2026-03-13 | 7.7 | To Do |
| 7.9 | Send GA announcement | Send general availability announcement to all clients | 1 | 2026-03-14 | 2026-03-14 | 7.8 | To Do |
| 7.10 | GA launch and monitoring | Monitor system during launch and respond to issues | 4 | 2026-03-14 | 2026-03-14 | 7.9 | To Do |

---

## Status Legend
- **To Do** - Not started
- **In Progress** - Work started
- **In Review** - Awaiting review
- **Testing** - In QA/UAT
- **Done** - Completed
- **Blocked** - Waiting on dependency or issue

---

## Project Summary

| Phase | Tasks | Estimate (h) | Start | End |
|-------|-------|--------------|-------|-----|
| Phase 1: Foundation | 10 | 28 | 2026-02-02 | 2026-02-08 |
| Phase 2: Documents | 10 | 30 | 2026-02-09 | 2026-02-15 |
| Phase 3: AI Integration | 9 | 31 | 2026-02-16 | 2026-02-22 |
| Phase 4: Analytics | 7 | 20 | 2026-02-20 | 2026-02-26 |
| Phase 5: Polish and Testing | 10 | 36 | 2026-02-23 | 2026-02-28 |
| Phase 6: Marketing and Internal Rollout | 14 | 47 | 2026-03-01 | 2026-03-07 |
| Phase 7: External Pilot and GA | 10 | 33 | 2026-03-08 | 2026-03-14 |
| **Total** | **70** | **225** | **2026-02-02** | **2026-03-14** |

---

*Last updated: 2026-02-02*
