# MPS Building Management AI - MVP Project Plan

**Project Name:** MPS Building Management AI Application
**Version:** 1.0
**Last Updated:** 2026-02-02
**Status:** In Planning

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
- **Timeline:** 4-6 weeks to MVP launch
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

### Phase 1: Foundation (Week 1)
- [ ] **1.1** Create `service_requests` database table and migrations
- [ ] **1.2** Implement RLS policies for service requests
- [ ] **1.3** Create TypeScript types for service requests
- [ ] **1.4** Build query functions (create, read, update)
- [ ] **1.5** Wire ServiceRequestList component to Supabase
- [ ] **1.6** Add status update functionality for technicians/admins
- [ ] **1.7** Implement Settings page persistence
- [ ] **1.8** Unit tests for service request functions

### Phase 2: Documents (Week 2)
- [ ] **2.1** Set up Supabase Storage bucket for documents
- [ ] **2.2** Implement file upload component
- [ ] **2.3** Create document metadata storage
- [ ] **2.4** Build document list with real data
- [ ] **2.5** Implement keyword search functionality
- [ ] **2.6** Add document preview/download
- [ ] **2.7** Connect to existing manual search infrastructure

### Phase 3: AI Integration (Week 3)
- [ ] **3.1** Set up LLM API connection (Claude/OpenAI)
- [ ] **3.2** Implement RAG pipeline using manual content
- [ ] **3.3** Connect chat interface to real AI responses
- [ ] **3.4** Add chat history persistence
- [ ] **3.5** Implement context-aware responses per building
- [ ] **3.6** Add source citation in responses

### Phase 4: Analytics (Week 3-4)
- [ ] **4.1** Create analytics database queries
- [ ] **4.2** Implement Recharts visualizations
- [ ] **4.3** Build service request metrics dashboard
- [ ] **4.4** Add chat usage analytics
- [ ] **4.5** Create document access reports

### Phase 5: Polish & Testing (Week 4)
- [ ] **5.1** Add loading states and skeletons
- [ ] **5.2** Implement error handling and toasts
- [ ] **5.3** Fix responsive design issues
- [ ] **5.4** Performance optimization
- [ ] **5.5** Security review and fixes
- [ ] **5.6** Accessibility improvements

---

## 4. Milestones & Timeline

| Week | Milestone | Deliverables | Exit Criteria |
|------|-----------|--------------|---------------|
| 1 | **M1: Foundation Complete** | Service Requests functional, Settings persistence | All P1 service request features working |
| 2 | **M2: Documents Complete** | File upload, search, preview working | Documents can be uploaded and searched |
| 3 | **M3: AI Integration Complete** | Chat connected to real LLM with RAG | Chat returns relevant responses from manuals |
| 3-4 | **M4: Analytics Complete** | Real metrics displayed in Reports | Dashboard shows live data |
| 4 | **M5: Internal UAT Complete** | All critical bugs fixed | UAT sign-off from Product Owner |
| 5 | **M6: Marketing Ready** | Training materials, demo environment | Marketing team approved |
| 5 | **M7: Internal Rollout** | Production deployment for internal users | Internal users onboarded |
| 6 | **M8: External Pilot** | 2-3 pilot clients onboarded | Pilot feedback collected |
| 6+ | **M9: General Availability** | Public launch | GA criteria met |

### Gantt Chart (Simplified)
```
Week 1: [████ Phase 1: Foundation ████]
Week 2: [████ Phase 2: Documents █████]
Week 3: [████ Phase 3: AI ████][██ Phase 4 ██]
Week 4: [Phase 4][████ Phase 5: Polish ████][UAT]
Week 5: [Marketing][████ Internal Rollout ████]
Week 6: [████ External Pilot ████████████]
```

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
