# Project Name: MPS Building Management AI
**Project Start Date:** 2026-02-02
**Target Completion:** 2026-03-14

---

## Feature Legend

| Feature | Description |
|---------|-------------|
| Service Requests | Client-initiated maintenance requests to service providers |
| Settings | User preferences and configuration persistence |
| Documents | File upload, search, preview, and download |
| AI Chat | LLM integration with RAG for building-specific Q&A |
| Analytics | Reports, dashboards, and metrics visualization |
| Cross-cutting | UX polish, security, testing (spans all features) |
| Marketing | User guides, training materials, documentation |
| Rollout | Deployment, pilots, and launch activities |

---

## Phase 1: Foundation
**Phase Start:** 2026-02-02
**Phase End:** 2026-02-08
**Milestone:** M1 - Service Requests & Settings Complete

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Create service_requests database table | Service Requests | Set up the main service_requests table with all required columns in Supabase | 2 | 2026-02-02 | 2026-02-02 | - | To Be Done |
| Implement RLS policies for service requests | Service Requests | Add row-level security policies for admin, technician, and client roles | 2 | 2026-02-02 | 2026-02-02 | Create service_requests database table | To Be Done |
| Create TypeScript types for service requests | Service Requests | Define TypeScript interfaces and types for service request objects | 1 | 2026-02-02 | 2026-02-02 | Create service_requests database table | To Be Done |
| Build query functions for service requests | Service Requests | Create functions for create, read, update operations using Supabase client | 3 | 2026-02-03 | 2026-02-03 | Create TypeScript types for service requests | To Be Done |
| Wire ServiceRequestList to Supabase | Service Requests | Connect the existing UI component to fetch and display real data | 4 | 2026-02-03 | 2026-02-04 | Build query functions for service requests | To Be Done |
| Add status update for technicians and admins | Service Requests | Implement dropdown/buttons for technicians and admins to change request status | 3 | 2026-02-04 | 2026-02-04 | Wire ServiceRequestList to Supabase | To Be Done |
| Add loading states and error handling for service requests | Service Requests | Implement loading skeletons and toast notifications for service requests | 2 | 2026-02-05 | 2026-02-05 | Add status update for technicians and admins | To Be Done |
| Implement Settings page persistence | Settings | Wire Settings form to save preferences to database | 4 | 2026-02-05 | 2026-02-06 | - | To Be Done |
| Write unit tests for service requests | Service Requests | Create tests for query functions and component logic | 3 | 2026-02-06 | 2026-02-06 | Build query functions for service requests | To Be Done |
| Phase 1 code review and bug fixes | Cross-cutting | Review all Phase 1 code and fix any issues found | 4 | 2026-02-07 | 2026-02-08 | Add loading states and error handling for service requests, Implement Settings page persistence, Write unit tests for service requests | To Be Done |

---

## Phase 2: Documents
**Phase Start:** 2026-02-09
**Phase End:** 2026-02-15
**Milestone:** M2 - Document Management Complete

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Set up Supabase Storage bucket | Documents | Create and configure storage bucket for document uploads | 2 | 2026-02-09 | 2026-02-09 | - | To Be Done |
| Create document metadata table | Documents | Set up database table to store document metadata and references | 2 | 2026-02-09 | 2026-02-09 | - | To Be Done |
| Implement file upload component | Documents | Build UI component for selecting and uploading files to Supabase Storage | 4 | 2026-02-10 | 2026-02-10 | Set up Supabase Storage bucket | To Be Done |
| Build document list with real data | Documents | Replace mock data with real Supabase queries in DocumentsPage | 3 | 2026-02-10 | 2026-02-11 | Create document metadata table | To Be Done |
| Implement keyword search for documents | Documents | Connect search input to database full-text search functionality | 4 | 2026-02-11 | 2026-02-12 | Build document list with real data | To Be Done |
| Add document preview modal | Documents | Create modal component to preview documents without downloading | 3 | 2026-02-12 | 2026-02-12 | Build document list with real data | To Be Done |
| Add document download functionality | Documents | Implement secure download functionality from Supabase Storage | 2 | 2026-02-12 | 2026-02-13 | Build document list with real data | To Be Done |
| Connect to manual search infrastructure | Documents | Integrate with existing manual_content and vector search tables | 4 | 2026-02-13 | 2026-02-13 | Implement keyword search for documents | To Be Done |
| Add loading states and error handling for documents | Documents | Implement loading skeletons and error toasts for documents | 2 | 2026-02-14 | 2026-02-14 | Implement file upload component, Add document preview modal, Add document download functionality, Connect to manual search infrastructure | To Be Done |
| Phase 2 code review and bug fixes | Cross-cutting | Review all Phase 2 code and fix any issues found | 4 | 2026-02-14 | 2026-02-15 | Add loading states and error handling for documents | To Be Done |

---

## Phase 3: AI Integration
**Phase Start:** 2026-02-16
**Phase End:** 2026-02-22
**Milestone:** M3 - AI Chat Operational

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Set up LLM API connection | AI Chat | Configure Claude or OpenAI API with environment variables and client | 3 | 2026-02-16 | 2026-02-16 | - | To Be Done |
| Create chat API endpoint | AI Chat | Build Supabase Edge Function to handle chat requests securely | 4 | 2026-02-16 | 2026-02-17 | Set up LLM API connection | To Be Done |
| Implement RAG pipeline | AI Chat | Build retrieval-augmented generation using manual content and embeddings | 6 | 2026-02-17 | 2026-02-18 | Create chat API endpoint, Connect to manual search infrastructure | To Be Done |
| Connect chat interface to AI | AI Chat | Replace simulated responses with real LLM API calls in ChatInterface | 4 | 2026-02-18 | 2026-02-19 | Implement RAG pipeline | To Be Done |
| Add chat history persistence | AI Chat | Store chat sessions and messages in database for continuity | 3 | 2026-02-19 | 2026-02-19 | Connect chat interface to AI | To Be Done |
| Implement building-aware context | AI Chat | Filter RAG results to selected building for relevant responses | 3 | 2026-02-20 | 2026-02-20 | Connect chat interface to AI | To Be Done |
| Add source citations in responses | AI Chat | Display document and section references in AI responses | 2 | 2026-02-20 | 2026-02-20 | Connect chat interface to AI | To Be Done |
| Add loading states and error handling for chat | AI Chat | Implement streaming indicators and error handling for chat | 2 | 2026-02-21 | 2026-02-21 | Add chat history persistence, Implement building-aware context, Add source citations in responses | To Be Done |
| Phase 3 code review and bug fixes | Cross-cutting | Review all Phase 3 code and fix any issues found | 4 | 2026-02-21 | 2026-02-22 | Add loading states and error handling for chat | To Be Done |

---

## Phase 4: Analytics
**Phase Start:** 2026-02-20
**Phase End:** 2026-02-26
**Milestone:** M4 - Analytics Dashboard Complete

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Create analytics database queries | Analytics | Build SQL queries for metrics aggregation and reporting | 3 | 2026-02-20 | 2026-02-20 | Phase 1 code review and bug fixes, Phase 2 code review and bug fixes | To Be Done |
| Implement Recharts visualizations | Analytics | Set up line and bar charts using Recharts library | 4 | 2026-02-21 | 2026-02-22 | Create analytics database queries | To Be Done |
| Build service request metrics dashboard | Analytics | Create dashboard cards showing request counts by status and priority | 3 | 2026-02-22 | 2026-02-23 | Implement Recharts visualizations | To Be Done |
| Add chat usage analytics | Analytics | Display chat session counts and query statistics | 3 | 2026-02-23 | 2026-02-24 | Implement Recharts visualizations, Add chat history persistence | To Be Done |
| Create document access reports | Analytics | Show document view and download statistics | 2 | 2026-02-24 | 2026-02-24 | Implement Recharts visualizations | To Be Done |
| Add date range filtering for analytics | Analytics | Implement date picker to filter analytics by time period | 2 | 2026-02-25 | 2026-02-25 | Build service request metrics dashboard, Add chat usage analytics, Create document access reports | To Be Done |
| Phase 4 code review and bug fixes | Cross-cutting | Review all Phase 4 code and fix any issues found | 3 | 2026-02-25 | 2026-02-26 | Add date range filtering for analytics | To Be Done |

---

## Phase 5: Polish and Testing
**Phase Start:** 2026-02-23
**Phase End:** 2026-02-28
**Milestone:** M5 - Internal UAT Complete

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Add loading skeletons across all pages | Cross-cutting | Implement consistent loading states for better UX | 3 | 2026-02-23 | 2026-02-23 | - | To Be Done |
| Implement toast notifications globally | Cross-cutting | Add success and error toasts for all user actions | 2 | 2026-02-23 | 2026-02-24 | - | To Be Done |
| Fix responsive design issues | Cross-cutting | Test and fix layout issues on tablet and mobile viewports | 4 | 2026-02-24 | 2026-02-25 | - | To Be Done |
| Performance optimization | Cross-cutting | Implement lazy loading, caching, and optimize bundle size | 4 | 2026-02-25 | 2026-02-25 | - | To Be Done |
| Security review and fixes | Cross-cutting | Audit RLS policies, validate inputs, check for vulnerabilities | 4 | 2026-02-26 | 2026-02-26 | Phase 1 code review and bug fixes, Phase 2 code review and bug fixes, Phase 3 code review and bug fixes, Phase 4 code review and bug fixes | To Be Done |
| Accessibility improvements | Cross-cutting | Add ARIA labels, keyboard navigation, and screen reader support | 3 | 2026-02-26 | 2026-02-27 | - | To Be Done |
| Execute UAT test cases for Admin role | Cross-cutting | Run all admin test cases from UAT plan and log defects | 4 | 2026-02-27 | 2026-02-27 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Be Done |
| Execute UAT test cases for Technician role | Cross-cutting | Run all technician test cases from UAT plan and log defects | 3 | 2026-02-27 | 2026-02-27 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Be Done |
| Execute UAT test cases for Client role | Cross-cutting | Run all client test cases from UAT plan and log defects | 3 | 2026-02-28 | 2026-02-28 | Add loading skeletons across all pages, Implement toast notifications globally, Fix responsive design issues, Performance optimization, Security review and fixes, Accessibility improvements | To Be Done |
| UAT bug fixes | Cross-cutting | Fix all critical and high priority bugs found during UAT | 6 | 2026-02-28 | 2026-02-28 | Execute UAT test cases for Admin role, Execute UAT test cases for Technician role, Execute UAT test cases for Client role | To Be Done |

---

## Phase 6: Marketing and Internal Rollout
**Phase Start:** 2026-03-01
**Phase End:** 2026-03-07
**Milestone:** M6 - Marketing Ready, M7 - Internal Rollout Complete

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Create product overview one-pager | Marketing | Write single-page summary of features and benefits | 3 | 2026-03-01 | 2026-03-01 | - | To Be Done |
| Write user guide for Admin role | Marketing | Create documentation for admin users covering all features | 3 | 2026-03-01 | 2026-03-02 | - | To Be Done |
| Write user guide for Technician role | Marketing | Create documentation for technician users | 2 | 2026-03-02 | 2026-03-02 | - | To Be Done |
| Write user guide for Client role | Marketing | Create documentation for client/FM users | 2 | 2026-03-02 | 2026-03-02 | - | To Be Done |
| Record demo video | Marketing | Create 3-5 minute walkthrough video of main features | 4 | 2026-03-03 | 2026-03-03 | UAT bug fixes | To Be Done |
| Create FAQ document | Marketing | Compile frequently asked questions and answers | 2 | 2026-03-03 | 2026-03-03 | - | To Be Done |
| Prepare training presentation | Marketing | Build slide deck for user training sessions | 3 | 2026-03-03 | 2026-03-04 | Write user guide for Admin role, Write user guide for Technician role, Write user guide for Client role | To Be Done |
| Deploy to production | Rollout | Deploy application to production environment and verify | 3 | 2026-03-04 | 2026-03-04 | UAT bug fixes | To Be Done |
| Internal pilot with 3-5 users | Rollout | Onboard pilot users and collect initial feedback | 8 | 2026-03-04 | 2026-03-05 | Deploy to production | To Be Done |
| Fix critical issues from pilot | Rollout | Address any blocking issues found by pilot users | 4 | 2026-03-05 | 2026-03-05 | Internal pilot with 3-5 users | To Be Done |
| Send internal launch announcement | Rollout | Email and Slack announcement to all internal users | 1 | 2026-03-06 | 2026-03-06 | Fix critical issues from pilot | To Be Done |
| Conduct training for Technicians | Marketing | Run training session for technician users | 2 | 2026-03-06 | 2026-03-06 | Prepare training presentation | To Be Done |
| Conduct training for Admins | Marketing | Run training session for admin users | 2 | 2026-03-06 | 2026-03-06 | Prepare training presentation | To Be Done |
| Monitor and support internal users | Rollout | Provide support and track adoption metrics | 8 | 2026-03-06 | 2026-03-07 | Send internal launch announcement | To Be Done |

---

## Phase 7: External Pilot and GA
**Phase Start:** 2026-03-08
**Phase End:** 2026-03-14
**Milestone:** M8 - External Pilot Complete, M9 - General Availability

| Task Title | Feature | Description | Estimate (h) | Start | End | Blocked By | Status |
|------------|---------|-------------|--------------|-------|-----|------------|--------|
| Select and invite pilot clients | Rollout | Identify 2-3 friendly clients and send pilot invitations | 2 | 2026-03-08 | 2026-03-08 | Monitor and support internal users | To Be Done |
| Set up pilot client accounts | Rollout | Create accounts and configure building access for pilot clients | 3 | 2026-03-08 | 2026-03-08 | Select and invite pilot clients | To Be Done |
| Conduct pilot onboarding calls | Rollout | Run 45-minute onboarding sessions with each pilot client | 3 | 2026-03-09 | 2026-03-09 | Set up pilot client accounts | To Be Done |
| Daily pilot support and monitoring | Rollout | Monitor pilot usage and respond to support requests | 8 | 2026-03-09 | 2026-03-11 | Conduct pilot onboarding calls | To Be Done |
| Collect mid-week pilot feedback | Rollout | Check in with pilot clients to gather early feedback | 2 | 2026-03-11 | 2026-03-11 | Daily pilot support and monitoring | To Be Done |
| Fix issues from pilot feedback | Rollout | Address issues and suggestions from pilot clients | 6 | 2026-03-11 | 2026-03-12 | Collect mid-week pilot feedback | To Be Done |
| Collect final feedback and NPS | Rollout | Gather final pilot feedback and Net Promoter Score | 2 | 2026-03-12 | 2026-03-12 | Fix issues from pilot feedback | To Be Done |
| Prepare GA announcement | Marketing | Write announcement email and update marketing materials | 2 | 2026-03-13 | 2026-03-13 | Collect final feedback and NPS | To Be Done |
| Send GA announcement | Marketing | Send general availability announcement to all clients | 1 | 2026-03-14 | 2026-03-14 | Prepare GA announcement | To Be Done |
| GA launch and monitoring | Rollout | Monitor system during launch and respond to issues | 4 | 2026-03-14 | 2026-03-14 | Send GA announcement | To Be Done |

---

## Status Legend
- **To Be Done** - Not started
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

## Tasks by Feature

| Feature | Task Count | Total Hours |
|---------|------------|-------------|
| Service Requests | 9 | 22 |
| Settings | 1 | 4 |
| Documents | 9 | 26 |
| AI Chat | 8 | 27 |
| Analytics | 6 | 17 |
| Cross-cutting | 17 | 56 |
| Marketing | 11 | 28 |
| Rollout | 9 | 45 |
| **Total** | **70** | **225** |

---

*Last updated: 2026-02-03*
