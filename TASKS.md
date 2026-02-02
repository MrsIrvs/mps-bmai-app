# Project Name: MPS Building Management AI
**Project Start Date:** 2026-02-02
**Target Completion:** 2026-03-14

---

## Phase 1: Foundation
**Phase Start:** 2026-02-02
**Phase End:** 2026-02-08
**Milestone:** M1 - Service Requests & Settings Complete

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Create service_requests database table | Set up the main service_requests table with all required columns in Supabase | 2 | 2026-02-02 | 2026-02-02 | - | To Do |
| Implement RLS policies for service requests | Add row-level security policies for admin, technician, and client roles | 2 | 2026-02-02 | 2026-02-02 | Create service_requests database table | To Do |
| Create TypeScript types for service requests | Define TypeScript interfaces and types for service request objects | 1 | 2026-02-02 | 2026-02-02 | Create service_requests database table | To Do |
| Build query functions for service requests | Create functions for create, read, update operations using Supabase client | 3 | 2026-02-03 | 2026-02-03 | Create TypeScript types for service requests | To Do |
| Wire ServiceRequestList to Supabase | Connect the existing UI component to fetch and display real data | 4 | 2026-02-03 | 2026-02-04 | Build query functions for service requests | To Do |
| Add status update for technicians and admins | Implement dropdown/buttons for technicians and admins to change request status | 3 | 2026-02-04 | 2026-02-04 | Wire ServiceRequestList to Supabase | To Do |
| Add loading states and error handling for service requests | Implement loading skeletons and toast notifications for service requests | 2 | 2026-02-05 | 2026-02-05 | Add status update for technicians and admins | To Do |
| Implement Settings page persistence | Wire Settings form to save preferences to database | 4 | 2026-02-05 | 2026-02-06 | - | To Do |
| Write unit tests for service requests | Create tests for query functions and component logic | 3 | 2026-02-06 | 2026-02-06 | Build query functions for service requests | To Do |
| Phase 1 code review and bug fixes | Review all Phase 1 code and fix any issues found | 4 | 2026-02-07 | 2026-02-08 | Add loading states and error handling for service requests, Implement Settings page persistence, Write unit tests for service requests | To Do |

---

## Phase 2: Documents
**Phase Start:** 2026-02-09
**Phase End:** 2026-02-15
**Milestone:** M2 - Document Management Complete

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Set up Supabase Storage bucket | Create and configure storage bucket for document uploads | 2 | 2026-02-09 | 2026-02-09 | - | To Do |
| Create document metadata table | Set up database table to store document metadata and references | 2 | 2026-02-09 | 2026-02-09 | - | To Do |
| Implement file upload component | Build UI component for selecting and uploading files to Supabase Storage | 4 | 2026-02-10 | 2026-02-10 | Set up Supabase Storage bucket | To Do |
| Build document list with real data | Replace mock data with real Supabase queries in DocumentsPage | 3 | 2026-02-10 | 2026-02-11 | Create document metadata table | To Do |
| Implement keyword search for documents | Connect search input to database full-text search functionality | 4 | 2026-02-11 | 2026-02-12 | Build document list with real data | To Do |
| Add document preview modal | Create modal component to preview documents without downloading | 3 | 2026-02-12 | 2026-02-12 | Build document list with real data | To Do |
| Add document download functionality | Implement secure download functionality from Supabase Storage | 2 | 2026-02-12 | 2026-02-13 | Build document list with real data | To Do |
| Connect to manual search infrastructure | Integrate with existing manual_content and vector search tables | 4 | 2026-02-13 | 2026-02-13 | Implement keyword search for documents | To Do |
| Add loading states and error handling for documents | Implement loading skeletons and error toasts for documents | 2 | 2026-02-14 | 2026-02-14 | Implement file upload component, Add document preview modal, Add document download functionality, Connect to manual search infrastructure | To Do |
| Phase 2 code review and bug fixes | Review all Phase 2 code and fix any issues found | 4 | 2026-02-14 | 2026-02-15 | Add loading states and error handling for documents | To Do |

---

## Phase 3: AI Integration
**Phase Start:** 2026-02-16
**Phase End:** 2026-02-22
**Milestone:** M3 - AI Chat Operational

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Set up LLM API connection | Configure Claude or OpenAI API with environment variables and client | 3 | 2026-02-16 | 2026-02-16 | - | To Do |
| Create chat API endpoint | Build Supabase Edge Function to handle chat requests securely | 4 | 2026-02-16 | 2026-02-17 | Set up LLM API connection | To Do |
| Implement RAG pipeline | Build retrieval-augmented generation using manual content and embeddings | 6 | 2026-02-17 | 2026-02-18 | Create chat API endpoint, Connect to manual search infrastructure | To Do |
| Connect chat interface to AI | Replace simulated responses with real LLM API calls in ChatInterface | 4 | 2026-02-18 | 2026-02-19 | Implement RAG pipeline | To Do |
| Add chat history persistence | Store chat sessions and messages in database for continuity | 3 | 2026-02-19 | 2026-02-19 | Connect chat interface to AI | To Do |
| Implement building-aware context | Filter RAG results to selected building for relevant responses | 3 | 2026-02-20 | 2026-02-20 | Connect chat interface to AI | To Do |
| Add source citations in responses | Display document and section references in AI responses | 2 | 2026-02-20 | 2026-02-20 | Connect chat interface to AI | To Do |
| Add loading states and error handling for chat | Implement streaming indicators and error handling for chat | 2 | 2026-02-21 | 2026-02-21 | Add chat history persistence, Implement building-aware context, Add source citations in responses | To Do |
| Phase 3 code review and bug fixes | Review all Phase 3 code and fix any issues found | 4 | 2026-02-21 | 2026-02-22 | Add loading states and error handling for chat | To Do |

---

## Phase 4: Analytics
**Phase Start:** 2026-02-20
**Phase End:** 2026-02-26
**Milestone:** M4 - Analytics Dashboard Complete

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Create analytics database queries | Build SQL queries for metrics aggregation and reporting | 3 | 2026-02-20 | 2026-02-20 | Phase 1 code review and bug fixes, Phase 2 code review and bug fixes | To Do |
| Implement Recharts visualizations | Set up line and bar charts using Recharts library | 4 | 2026-02-21 | 2026-02-22 | Create analytics database queries | To Do |
| Build service request metrics dashboard | Create dashboard cards showing request counts by status and priority | 3 | 2026-02-22 | 2026-02-23 | Implement Recharts visualizations | To Do |
| Add chat usage analytics | Display chat session counts and query statistics | 3 | 2026-02-23 | 2026-02-24 | Implement Recharts visualizations, Add chat history persistence | To Do |
| Create document access reports | Show document view and download statistics | 2 | 2026-02-24 | 2026-02-24 | Implement Recharts visualizations | To Do |
| Add date range filtering for analytics | Implement date picker to filter analytics by time period | 2 | 2026-02-25 | 2026-02-25 | Build service request metrics dashboard, Add chat usage analytics, Create document access reports | To Do |
| Phase 4 code review and bug fixes | Review all Phase 4 code and fix any issues found | 3 | 2026-02-25 | 2026-02-26 | Add date range filtering for analytics | To Do |

---

## Phase 5: Polish and Testing
**Phase Start:** 2026-02-23
**Phase End:** 2026-02-28
**Milestone:** M5 - Internal UAT Complete

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Add loading skeletons across all pages | Implement consistent loading states for better UX | 3 | 2026-02-23 | 2026-02-23 | - | To Do |
| Implement toast notifications globally | Add success and error toasts for all user actions | 2 | 2026-02-23 | 2026-02-24 | - | To Do |
| Fix responsive design issues | Test and fix layout issues on tablet and mobile viewports | 4 | 2026-02-24 | 2026-02-25 | - | To Do |
| Performance optimization | Implement lazy loading, caching, and optimize bundle size | 4 | 2026-02-25 | 2026-02-25 | - | To Do |
| Security review and fixes | Audit RLS policies, validate inputs, check for vulnerabilities | 4 | 2026-02-26 | 2026-02-26 | Phase 1 code review and bug fixes, Phase 2 code review and bug fixes, Phase 3 code review and bug fixes, Phase 4 code review and bug fixes | To Do |
| Accessibility improvements | Add ARIA labels, keyboard navigation, and screen reader support | 3 | 2026-02-26 | 2026-02-27 | - | To Do |
| Execute UAT test cases for Admin role | Run all admin test cases from UAT plan and log defects | 4 | 2026-02-27 | 2026-02-27 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Do |
| Execute UAT test cases for Technician role | Run all technician test cases from UAT plan and log defects | 3 | 2026-02-27 | 2026-02-27 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Do |
| Execute UAT test cases for Client role | Run all client test cases from UAT plan and log defects | 3 | 2026-02-28 | 2026-02-28 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Do |
| UAT bug fixes | Fix all critical and high priority bugs found during UAT | 6 | 2026-02-28 | 2026-02-28 | Execute UAT test cases for Admin role, Execute UAT test cases for Technician role, Execute UAT test cases for Client role | To Do |

---

## Phase 6: Marketing and Internal Rollout
**Phase Start:** 2026-03-01
**Phase End:** 2026-03-07
**Milestone:** M6 - Marketing Ready, M7 - Internal Rollout Complete

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Create product overview one-pager | Write single-page summary of features and benefits | 3 | 2026-03-01 | 2026-03-01 | - | To Do |
| Write user guide for Admin role | Create documentation for admin users covering all features | 3 | 2026-03-01 | 2026-03-02 | - | To Do |
| Write user guide for Technician role | Create documentation for technician users | 2 | 2026-03-02 | 2026-03-02 | - | To Do |
| Write user guide for Client role | Create documentation for client/FM users | 2 | 2026-03-02 | 2026-03-02 | - | To Do |
| Record demo video | Create 3-5 minute walkthrough video of main features | 4 | 2026-03-03 | 2026-03-03 | UAT bug fixes | To Do |
| Create FAQ document | Compile frequently asked questions and answers | 2 | 2026-03-03 | 2026-03-03 | - | To Do |
| Prepare training presentation | Build slide deck for user training sessions | 3 | 2026-03-03 | 2026-03-04 | Write user guide for Admin role, Write user guide for Technician role, Write user guide for Client role | To Do |
| Deploy to production | Deploy application to production environment and verify | 3 | 2026-03-04 | 2026-03-04 | UAT bug fixes | To Do |
| Internal pilot with 3-5 users | Onboard pilot users and collect initial feedback | 8 | 2026-03-04 | 2026-03-05 | Deploy to production | To Do |
| Fix critical issues from pilot | Address any blocking issues found by pilot users | 4 | 2026-03-05 | 2026-03-05 | Internal pilot with 3-5 users | To Do |
| Send internal launch announcement | Email and Slack announcement to all internal users | 1 | 2026-03-06 | 2026-03-06 | Fix critical issues from pilot | To Do |
| Conduct training for Technicians | Run training session for technician users | 2 | 2026-03-06 | 2026-03-06 | Prepare training presentation | To Do |
| Conduct training for Admins | Run training session for admin users | 2 | 2026-03-06 | 2026-03-06 | Prepare training presentation | To Do |
| Monitor and support internal users | Provide support and track adoption metrics | 8 | 2026-03-06 | 2026-03-07 | Send internal launch announcement | To Do |

---

## Phase 7: External Pilot and GA
**Phase Start:** 2026-03-08
**Phase End:** 2026-03-14
**Milestone:** M8 - External Pilot Complete, M9 - General Availability

| Task Title | Description | Estimate (h) | Start | End | Blocked By | Status |
|-----------|-------------|--------------|-------|-----|------------|--------|
| Select and invite pilot clients | Identify 2-3 friendly clients and send pilot invitations | 2 | 2026-03-08 | 2026-03-08 | Monitor and support internal users | To Do |
| Set up pilot client accounts | Create accounts and configure building access for pilot clients | 3 | 2026-03-08 | 2026-03-08 | Select and invite pilot clients | To Do |
| Conduct pilot onboarding calls | Run 45-minute onboarding sessions with each pilot client | 3 | 2026-03-09 | 2026-03-09 | Set up pilot client accounts | To Do |
| Daily pilot support and monitoring | Monitor pilot usage and respond to support requests | 8 | 2026-03-09 | 2026-03-11 | Conduct pilot onboarding calls | To Do |
| Collect mid-week pilot feedback | Check in with pilot clients to gather early feedback | 2 | 2026-03-11 | 2026-03-11 | Daily pilot support and monitoring | To Do |
| Fix issues from pilot feedback | Address issues and suggestions from pilot clients | 6 | 2026-03-11 | 2026-03-12 | Collect mid-week pilot feedback | To Do |
| Collect final feedback and NPS | Gather final pilot feedback and Net Promoter Score | 2 | 2026-03-12 | 2026-03-12 | Fix issues from pilot feedback | To Do |
| Prepare GA announcement | Write announcement email and update marketing materials | 2 | 2026-03-13 | 2026-03-13 | Collect final feedback and NPS | To Do |
| Send GA announcement | Send general availability announcement to all clients | 1 | 2026-03-14 | 2026-03-14 | Prepare GA announcement | To Do |
| GA launch and monitoring | Monitor system during launch and respond to issues | 4 | 2026-03-14 | 2026-03-14 | Send GA announcement | To Do |

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
