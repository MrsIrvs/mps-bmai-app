# MPS Building Management AI - MVP Project Plan

**Project Name:** MPS Building Management AI Application
**Version:** 1.1
**Last Updated:** 2026-02-02
**Status:** In Planning
**Timeline:** 2026-02-02 to 2026-03-14 (6 weeks)
**Total Tasks:** 70 tasks, 225 hours estimated

---

## 1. Project Charter

### 1.1 Vision
Deliver an AI-powered building management platform that enables facility managers, technicians, and administrators to efficiently manage O&M documentation, service requests, and building operations through intelligent search and streamlined workflows.

### 1.2 Objectives
- [ ] Complete MVP functionality for all core features
- [ ] Achieve successful UAT sign-off from all user roles
- [ ] Deploy to production with internal users
- [ ] Onboard 2-3 external pilot clients
- [ ] Establish baseline KPIs for ongoing measurement

### 1.3 Success Criteria
| Metric | Target |
|--------|--------|
| User adoption (internal) | 80% of target users active within 2 weeks |
| Service request resolution | < 24 hours average for high priority |
| Chat query success rate | > 70% helpful responses |
| System uptime | > 99.5% |
| UAT defect rate | < 5 critical/high bugs at launch |

### 1.4 Stakeholders
| Role | Responsibilities |
|------|------------------|
| Project Sponsor | Budget approval, strategic decisions, go-live authorization |
| Product Owner | Requirements definition, prioritization, UAT acceptance |
| Developer(s) | Technical implementation, code review, deployment |
| QA/Tester | Test execution, defect reporting, quality assurance |
| Project Stakeholders | Feedback, UAT participation, training |

### 1.5 Constraints
- **Timeline:** 6 weeks (2026-02-02 to 2026-03-14)
- **Budget:** TBD
- **Technical:** Must integrate with existing Supabase infrastructure
- **Compliance:** Data must remain in approved regions

---

## 2. Scope Statement

### 2.1 In Scope - MVP Features

| Feature | Current State | MVP Requirements | Priority |
|---------|---------------|------------------|----------|
| **Service Requests** | UI only, mock data | Full CRUD, status workflow, photo upload | P1 |
| **Documents** | Mock data, no upload | File upload to Supabase Storage, search | P1 |
| **Chat/AI Assistant** | Simulated responses | Real LLM integration with RAG | P1 |
| **Reports/Analytics** | Hardcoded stats | Real database queries, Recharts | P2 |
| **Settings** | No persistence | Save preferences to database | P2 |
| **User Management** | Working | Maintain current functionality | P3 |
| **Buildings** | Working | Maintain current functionality | P3 |

### 2.2 Out of Scope (Post-MVP)
- Mobile native applications
- Offline functionality
- Advanced AI features (predictive maintenance)
- Integration with external BMS systems
- Multi-language support

### 2.3 User Roles
| Role | Access Level | Key Functions |
|------|--------------|---------------|
| **Admin** | Full system access | User management, all buildings, reports, settings |
| **Technician** | Regional access | Service requests (view/update), documents, chat |
| **Client (FM)** | Building-specific | Service requests (create/view), assigned buildings, chat |

---

## 3. Work Breakdown Structure (WBS)

### Phase 1: Foundation (2026-02-02 to 2026-02-08)
**Milestone:** M1 - Service Requests & Settings Complete

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 1.1 | Create service_requests database table | Set up the main service_requests table with all required columns in Supabase | 2 |
| 1.2 | Implement RLS policies for service requests | Add row-level security policies for admin, technician, and client roles | 2 |
| 1.3 | Create TypeScript types for service requests | Define TypeScript interfaces and types for service request objects | 1 |
| 1.4 | Build query functions for service requests | Create functions for create, read, update operations using Supabase client | 3 |
| 1.5 | Wire ServiceRequestList to Supabase | Connect the existing UI component to fetch and display real data | 4 |
| 1.6 | Add status update for technicians and admins | Implement dropdown/buttons for technicians and admins to change request status | 3 |
| 1.7 | Add loading states and error handling for service requests | Implement loading skeletons and toast notifications for service requests | 2 |
| 1.8 | Implement Settings page persistence | Wire Settings form to save preferences to database | 4 |
| 1.9 | Write unit tests for service requests | Create tests for query functions and component logic | 3 |
| 1.10 | Phase 1 code review and bug fixes | Review all Phase 1 code and fix any issues found | 4 |

**Phase 1 Total:** 10 tasks, 28 hours

### Phase 2: Documents (2026-02-09 to 2026-02-15)
**Milestone:** M2 - Document Management Complete

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 2.1 | Set up Supabase Storage bucket | Create and configure storage bucket for document uploads | 2 |
| 2.2 | Create document metadata table | Set up database table to store document metadata and references | 2 |
| 2.3 | Implement file upload component | Build UI component for selecting and uploading files to Supabase Storage | 4 |
| 2.4 | Build document list with real data | Replace mock data with real Supabase queries in DocumentsPage | 3 |
| 2.5 | Implement keyword search for documents | Connect search input to database full-text search functionality | 4 |
| 2.6 | Add document preview modal | Create modal component to preview documents without downloading | 3 |
| 2.7 | Add document download functionality | Implement secure download functionality from Supabase Storage | 2 |
| 2.8 | Connect to manual search infrastructure | Integrate with existing manual_content and vector search tables | 4 |
| 2.9 | Add loading states and error handling for documents | Implement loading skeletons and error toasts for documents | 2 |
| 2.10 | Phase 2 code review and bug fixes | Review all Phase 2 code and fix any issues found | 4 |

**Phase 2 Total:** 10 tasks, 30 hours

### Phase 3: AI Integration (2026-02-16 to 2026-02-22)
**Milestone:** M3 - AI Chat Operational

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 3.1 | Set up LLM API connection | Configure Claude or OpenAI API with environment variables and client | 3 |
| 3.2 | Create chat API endpoint | Build Supabase Edge Function to handle chat requests securely | 4 |
| 3.3 | Implement RAG pipeline | Build retrieval-augmented generation using manual content and embeddings | 6 |
| 3.4 | Connect chat interface to AI | Replace simulated responses with real LLM API calls in ChatInterface | 4 |
| 3.5 | Add chat history persistence | Store chat sessions and messages in database for continuity | 3 |
| 3.6 | Implement building-aware context | Filter RAG results to selected building for relevant responses | 3 |
| 3.7 | Add source citations in responses | Display document and section references in AI responses | 2 |
| 3.8 | Add loading states and error handling for chat | Implement streaming indicators and error handling for chat | 2 |
| 3.9 | Phase 3 code review and bug fixes | Review all Phase 3 code and fix any issues found | 4 |

**Phase 3 Total:** 9 tasks, 31 hours

### Phase 4: Analytics (2026-02-20 to 2026-02-26)
**Milestone:** M4 - Analytics Dashboard Complete

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 4.1 | Create analytics database queries | Build SQL queries for metrics aggregation and reporting | 3 |
| 4.2 | Implement Recharts visualizations | Set up line and bar charts using Recharts library | 4 |
| 4.3 | Build service request metrics dashboard | Create dashboard cards showing request counts by status and priority | 3 |
| 4.4 | Add chat usage analytics | Display chat session counts and query statistics | 3 |
| 4.5 | Create document access reports | Show document view and download statistics | 2 |
| 4.6 | Add date range filtering for analytics | Implement date picker to filter analytics by time period | 2 |
| 4.7 | Phase 4 code review and bug fixes | Review all Phase 4 code and fix any issues found | 3 |

**Phase 4 Total:** 7 tasks, 20 hours

### Phase 5: Polish and Testing (2026-02-23 to 2026-02-28)
**Milestone:** M5 - Internal UAT Complete

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 5.1 | Add loading skeletons across all pages | Implement consistent loading states for better UX | 3 |
| 5.2 | Implement toast notifications globally | Add success and error toasts for all user actions | 2 |
| 5.3 | Fix responsive design issues | Test and fix layout issues on tablet and mobile viewports | 4 |
| 5.4 | Performance optimization | Implement lazy loading, caching, and optimize bundle size | 4 |
| 5.5 | Security review and fixes | Audit RLS policies, validate inputs, check for vulnerabilities | 4 |
| 5.6 | Accessibility improvements | Add ARIA labels, keyboard navigation, and screen reader support | 3 |
| 5.7 | Execute UAT test cases for Admin role | Run all admin test cases from UAT plan and log defects | 4 |
| 5.8 | Execute UAT test cases for Technician role | Run all technician test cases from UAT plan and log defects | 3 |
| 5.9 | Execute UAT test cases for Client role | Run all client test cases from UAT plan and log defects | 3 |
| 5.10 | UAT bug fixes | Fix all critical and high priority bugs found during UAT | 6 |

**Phase 5 Total:** 10 tasks, 36 hours

### Phase 6: Marketing and Internal Rollout (2026-03-01 to 2026-03-07)
**Milestone:** M6 - Marketing Ready, M7 - Internal Rollout Complete

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 6.1 | Create product overview one-pager | Write single-page summary of features and benefits | 3 |
| 6.2 | Write user guide for Admin role | Create documentation for admin users covering all features | 3 |
| 6.3 | Write user guide for Technician role | Create documentation for technician users | 2 |
| 6.4 | Write user guide for Client role | Create documentation for client/FM users | 2 |
| 6.5 | Record demo video | Create 3-5 minute walkthrough video of main features | 4 |
| 6.6 | Create FAQ document | Compile frequently asked questions and answers | 2 |
| 6.7 | Prepare training presentation | Build slide deck for user training sessions | 3 |
| 6.8 | Deploy to production | Deploy application to production environment and verify | 3 |
| 6.9 | Internal pilot with 3-5 users | Onboard pilot users and collect initial feedback | 8 |
| 6.10 | Fix critical issues from pilot | Address any blocking issues found by pilot users | 4 |
| 6.11 | Send internal launch announcement | Email and Slack announcement to all internal users | 1 |
| 6.12 | Conduct training for Technicians | Run training session for technician users | 2 |
| 6.13 | Conduct training for Admins | Run training session for admin users | 2 |
| 6.14 | Monitor and support internal users | Provide support and track adoption metrics | 8 |

**Phase 6 Total:** 14 tasks, 47 hours

### Phase 7: External Pilot and GA (2026-03-08 to 2026-03-14)
**Milestone:** M8 - External Pilot Complete, M9 - General Availability

| # | Task | Description | Est (h) |
|---|------|-------------|---------|
| 7.1 | Select and invite pilot clients | Identify 2-3 friendly clients and send pilot invitations | 2 |
| 7.2 | Set up pilot client accounts | Create accounts and configure building access for pilot clients | 3 |
| 7.3 | Conduct pilot onboarding calls | Run 45-minute onboarding sessions with each pilot client | 3 |
| 7.4 | Daily pilot support and monitoring | Monitor pilot usage and respond to support requests | 8 |
| 7.5 | Collect mid-week pilot feedback | Check in with pilot clients to gather early feedback | 2 |
| 7.6 | Fix issues from pilot feedback | Address issues and suggestions from pilot clients | 6 |
| 7.7 | Collect final feedback and NPS | Gather final pilot feedback and Net Promoter Score | 2 |
| 7.8 | Prepare GA announcement | Write announcement email and update marketing materials | 2 |
| 7.9 | Send GA announcement | Send general availability announcement to all clients | 1 |
| 7.10 | GA launch and monitoring | Monitor system during launch and respond to issues | 4 |

**Phase 7 Total:** 10 tasks, 33 hours

---

### Project Summary

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

## 4. Milestones & Timeline

**Project Start:** 2026-02-02
**Target Completion:** 2026-03-14

| Dates | Milestone | Deliverables | Exit Criteria |
|-------|-----------|--------------|---------------|
| Feb 02-08 | **M1: Service Requests & Settings Complete** | Service Requests functional, Settings persistence | All Phase 1 tasks complete and reviewed |
| Feb 09-15 | **M2: Document Management Complete** | File upload, search, preview working | Documents can be uploaded, searched, downloaded |
| Feb 16-22 | **M3: AI Chat Operational** | Chat connected to real LLM with RAG | Chat returns relevant responses from manuals |
| Feb 20-26 | **M4: Analytics Dashboard Complete** | Real metrics displayed in Reports | Dashboard shows live data with charts |
| Feb 23-28 | **M5: Internal UAT Complete** | All critical bugs fixed | UAT sign-off from Product Owner |
| Mar 01-07 | **M6: Marketing Ready** | Training materials, demo video, user guides | Marketing materials approved |
| Mar 01-07 | **M7: Internal Rollout Complete** | Production deployment, internal users trained | Internal users onboarded and supported |
| Mar 08-14 | **M8: External Pilot Complete** | 2-3 pilot clients onboarded | Pilot feedback collected, NPS > 20 |
| Mar 14+ | **M9: General Availability** | Public launch | GA criteria met |

### Gantt Chart
```
Feb 02-08: [████████ Phase 1: Foundation ████████]
Feb 09-15: [████████ Phase 2: Documents █████████]
Feb 16-22: [████████ Phase 3: AI Integration █████]
Feb 20-26:       [████████ Phase 4: Analytics ████]
Feb 23-28:             [████ Phase 5: Polish/UAT ██]
Mar 01-07: [████ Phase 6: Marketing & Internal ████]
Mar 08-14: [████ Phase 7: External Pilot & GA █████]
```

*Note: Phases 4-5 overlap with Phase 3 as some analytics work can begin after Phase 2.*

---

## 5. Risk Register

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|------|------------|--------|-------|------------|-------|--------|
| R1 | LLM API costs exceed budget | Medium | High | 6 | Set usage limits, implement caching, monitor costs | Developer | Open |
| R2 | UAT reveals major UX issues | Medium | Medium | 4 | Early user feedback sessions, iterative fixes | Product Owner | Open |
| R3 | Data migration complexity | Low | High | 3 | Staged migration, rollback plan, backup strategy | Developer | Open |
| R4 | Security vulnerabilities discovered | Low | Critical | 4 | Security review, penetration testing, code audit | Developer | Open |
| R5 | Key resource unavailability | Low | High | 3 | Cross-training, documentation, contingency plan | Project Sponsor | Open |
| R6 | Third-party service outage | Low | Medium | 2 | Fallback mechanisms, status monitoring | Developer | Open |
| R7 | Scope creep | Medium | Medium | 4 | Strict change control, MVP focus | Product Owner | Open |
| R8 | Integration issues with Supabase | Low | Medium | 2 | Early testing, Supabase support contact | Developer | Open |

*Scoring: Likelihood (1-3) x Impact (1-3)*

See [docs/RISK_REGISTER.md](docs/RISK_REGISTER.md) for detailed risk tracking.

---

## 6. RACI Matrix

| Activity | Sponsor | Product Owner | Developer | QA | Stakeholders |
|----------|:-------:|:-------------:|:---------:|:--:|:------------:|
| Requirements Definition | I | A/R | C | C | C |
| Architecture Design | I | C | A/R | C | I |
| Development | I | A | R | C | I |
| Code Review | I | I | R | C | I |
| Unit Testing | I | I | R | C | I |
| Integration Testing | I | A | R | R | I |
| UAT Execution | I | A | C | R | R |
| UAT Sign-off | A | R | C | C | C |
| Deployment | I | A | R | C | I |
| Go-Live Approval | A | R | C | C | C |
| Training Development | I | A | R | C | C |
| Training Delivery | I | A | C | I | R |
| Post-Launch Support | I | A | R | C | I |

**Legend:** R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## 7. UAT Test Plan Summary

### 7.1 Test Scope by Role

**Admin Role Testing:**
- User management (create, edit, delete, role assignment)
- Building management (full CRUD)
- Access to all service requests across buildings
- Full reports and analytics access
- System settings management

**Technician Role Testing:**
- Service request status updates
- Access to regional buildings only
- Document search and viewing
- Chat queries for technical information
- Cannot access user management or settings

**Client (FM) Role Testing:**
- Create new service requests
- View own service requests only
- Access assigned buildings only
- Chat queries for building-specific info
- Cannot update service request status

See [docs/UAT_TEST_PLAN.md](docs/UAT_TEST_PLAN.md) for detailed test cases.

### 7.2 UAT Entry Criteria
- [ ] All development complete
- [ ] Unit tests passing (>80% coverage)
- [ ] No critical/high defects open
- [ ] Test environment deployed
- [ ] Test data prepared

### 7.3 UAT Exit Criteria
- [ ] All test cases executed
- [ ] >95% test cases passed
- [ ] No critical defects open
- [ ] <3 high defects open (with workarounds)
- [ ] Sign-off from Product Owner

---

## 8. Marketing & Communications Plan

### 8.1 Internal Communications
| Week | Activity | Audience | Channel |
|------|----------|----------|---------|
| 4 | MVP Preview | Leadership | Demo meeting |
| 5 | Training Sessions | All internal users | Video call + docs |
| 5 | Launch Announcement | Company-wide | Email + Slack |
| 6 | Feedback Collection | Internal users | Survey |

### 8.2 External Communications
| Week | Activity | Audience | Channel |
|------|----------|----------|---------|
| 5 | Pilot Invitation | Select clients | Personal email |
| 6 | Onboarding Sessions | Pilot clients | Video call |
| 6+ | Case Study Development | Marketing | Internal |
| 7+ | GA Announcement | All clients | Email campaign |

### 8.3 Marketing Materials Needed
- [ ] Product overview one-pager
- [ ] Feature highlights document
- [ ] User guide (by role)
- [ ] Demo video (3-5 minutes)
- [ ] FAQ document
- [ ] Training presentation

---

## 9. Rollout Plan

### Phase A: Internal Pilot (Week 5, Days 1-3)
**Participants:** 2-3 technicians, 1 admin
- [ ] Deploy to production environment
- [ ] Onboard pilot users
- [ ] Collect feedback daily
- [ ] Fix critical issues immediately

### Phase B: Full Internal Rollout (Week 5, Days 4-7)
**Participants:** All internal technicians and admins
- [ ] Announce to all internal users
- [ ] Conduct training sessions
- [ ] Monitor for issues
- [ ] Support desk ready

### Phase C: External Pilot (Week 6)
**Participants:** 2-3 friendly client organizations
- [ ] Select pilot clients
- [ ] Onboarding calls scheduled
- [ ] Dedicated support contact
- [ ] Weekly check-ins

### Phase D: General Availability (Week 6+)
- [ ] All clients invited
- [ ] Self-service onboarding available
- [ ] Documentation complete
- [ ] Support processes in place

See [docs/ROLLOUT_PLAN.md](docs/ROLLOUT_PLAN.md) for detailed checklists.

---

## 10. Success Metrics & KPIs

### 10.1 Launch Metrics (Week 6)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Internal user activation | 80% | Users who logged in |
| Service requests created | 10+ | Database count |
| Chat queries | 50+ | Log analysis |
| Documents uploaded | 5+ | Storage count |
| Critical bugs | 0 | Issue tracker |

### 10.2 Ongoing KPIs (Monthly)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users | Growing 10% MoM | Analytics |
| Service request resolution time | < 24 hours (high priority) | Database query |
| Chat satisfaction rate | > 70% helpful | User feedback |
| System uptime | > 99.5% | Monitoring |
| NPS Score | > 30 | Quarterly survey |

---

## 11. Dependencies & Assumptions

### Dependencies
- Supabase infrastructure operational
- LLM API access (Claude or OpenAI)
- Team availability per RACI matrix
- Test data available for UAT

### Assumptions
- No major changes to existing authentication system
- Supabase Storage adequate for document needs
- LLM API costs within acceptable range
- Users have modern browsers (Chrome, Firefox, Safari, Edge)

---

## 12. Change Control

All scope changes must be:
1. Documented in writing
2. Impact assessed (timeline, budget, resources)
3. Approved by Product Owner
4. Approved by Project Sponsor (if timeline/budget impact)

**Change Request Template:**
- Description of change
- Reason for change
- Impact assessment
- Recommendation
- Approval signatures

---

## Appendices

- [Risk Register (Detailed)](docs/RISK_REGISTER.md)
- [UAT Test Plan (Detailed)](docs/UAT_TEST_PLAN.md)
- [Rollout Plan (Detailed)](docs/ROLLOUT_PLAN.md)

---

*Document Control: This is a living document. Updates should be tracked with version numbers and dates.*
