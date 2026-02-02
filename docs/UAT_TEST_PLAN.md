# UAT Test Plan - MPS Building Management AI

**Version:** 1.0
**Last Updated:** 2026-02-02
**Test Lead:** QA/Tester
**Planned UAT Start:** Week 4
**Planned UAT End:** Week 4-5

---

## 1. Test Objectives

- Validate all MVP features function correctly from end-user perspective
- Verify role-based access controls work as designed
- Confirm system meets business requirements
- Identify usability issues before production deployment
- Obtain stakeholder sign-off for go-live

---

## 2. Test Scope

### In Scope
- Service Requests (create, view, update status)
- Document Management (upload, search, view)
- AI Chat (queries, responses, source citations)
- Reports & Analytics (dashboard, metrics)
- Settings (preferences persistence)
- Authentication & Authorization (all three roles)

### Out of Scope
- Performance/load testing (separate effort)
- Security penetration testing (separate effort)
- Mobile device testing (post-MVP)
- Browser compatibility beyond Chrome/Firefox/Safari/Edge latest

---

## 3. Test Environment

| Component | Details |
|-----------|---------|
| Environment | Staging (mirrors production) |
| URL | TBD |
| Database | Supabase staging project |
| Test Data | Seeded with sample buildings, users, documents |

### Test Accounts

| Role | Email | Password | Buildings Access |
|------|-------|----------|------------------|
| Admin | admin.test@example.com | [secure] | All |
| Technician | tech.test@example.com | [secure] | NSW Region |
| Client (FM) | client.test@example.com | [secure] | Building A only |

---

## 4. Entry Criteria

- [ ] All development tasks marked complete
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] No open critical or high severity bugs
- [ ] Test environment deployed and accessible
- [ ] Test data seeded
- [ ] Test accounts created
- [ ] UAT testers briefed

---

## 5. Exit Criteria

- [ ] 100% of test cases executed
- [ ] >95% of test cases passed
- [ ] Zero critical defects open
- [ ] <3 high defects open (with documented workarounds)
- [ ] All medium/low defects logged in backlog
- [ ] Sign-off obtained from Product Owner
- [ ] Sign-off obtained from at least one stakeholder per role

---

## 6. Test Cases by Role

### 6.1 Admin Role Test Cases

#### Authentication & Access
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| A-001 | Admin login | 1. Navigate to login<br>2. Enter admin credentials<br>3. Click login | Successfully logged in, redirected to dashboard | |
| A-002 | Admin sees all navigation | 1. Login as admin<br>2. Check sidebar | All menu items visible: Chat, Documents, Service Requests, Buildings, Users, Reports, Settings | |
| A-003 | Admin can access any building | 1. Login as admin<br>2. Use building selector | Can select and view any building | |

#### User Management
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| A-010 | View all users | 1. Navigate to Users page | List of all users displayed | |
| A-011 | Create new user | 1. Click "Invite User"<br>2. Fill form<br>3. Submit | User created, invitation sent | |
| A-012 | Edit user role | 1. Select user<br>2. Change role<br>3. Save | Role updated successfully | |
| A-013 | Assign buildings to client | 1. Edit client user<br>2. Select buildings<br>3. Save | Buildings assigned, client can access them | |
| A-014 | Assign region to technician | 1. Edit technician<br>2. Select region<br>3. Save | Region assigned, tech sees regional buildings | |

#### Building Management
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| A-020 | View all buildings | 1. Navigate to Buildings page | All buildings listed | |
| A-021 | Create new building | 1. Click "Add Building"<br>2. Fill form<br>3. Save | Building created | |
| A-022 | Edit building | 1. Select building<br>2. Edit details<br>3. Save | Changes saved | |
| A-023 | Archive building | 1. Select building<br>2. Click archive | Building archived, hidden from active list | |

#### Service Requests (Admin View)
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| A-030 | View all service requests | 1. Navigate to Service Requests | All requests across all buildings visible | |
| A-031 | Filter by building | 1. Select building filter | Only requests for that building shown | |
| A-032 | Update request status | 1. Select request<br>2. Change status<br>3. Save | Status updated | |

#### Reports
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| A-040 | View reports dashboard | 1. Navigate to Reports | Dashboard with charts and metrics displayed | |
| A-041 | Metrics show real data | 1. Check metrics | Numbers match actual database counts | |

---

### 6.2 Technician Role Test Cases

#### Authentication & Access
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T-001 | Technician login | 1. Navigate to login<br>2. Enter tech credentials<br>3. Click login | Successfully logged in | |
| T-002 | Limited navigation | 1. Check sidebar | Only sees: Chat, Documents, Service Requests (no Users, Buildings, Settings) | |
| T-003 | Regional building access | 1. Use building selector | Only regional buildings available | |
| T-004 | Cannot access admin pages | 1. Try to navigate to /users or /buildings | Access denied or redirected | |

#### Service Requests (Technician View)
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T-010 | View regional requests | 1. Navigate to Service Requests | Only requests for regional buildings shown | |
| T-011 | Update request status | 1. Select request<br>2. Change to "In Progress"<br>3. Save | Status updated | |
| T-012 | Mark request resolved | 1. Select request<br>2. Change to "Resolved"<br>3. Save | Status updated, resolved_at timestamp set | |
| T-013 | Cannot create requests | 1. Check Service Requests page | No "Create Request" button visible | |

#### Documents
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T-020 | Search documents | 1. Enter search term<br>2. Submit | Relevant documents returned | |
| T-021 | View document | 1. Click on document<br>2. Click preview | Document preview opens | |
| T-022 | Download document | 1. Click download | Document downloads successfully | |

#### Chat
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| T-030 | Ask technical question | 1. Type question about equipment<br>2. Send | AI returns relevant response with sources | |
| T-031 | Context is building-specific | 1. Select building<br>2. Ask about that building | Response references correct building's documents | |

---

### 6.3 Client (FM) Role Test Cases

#### Authentication & Access
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| C-001 | Client login | 1. Navigate to login<br>2. Enter client credentials<br>3. Click login | Successfully logged in | |
| C-002 | Limited navigation | 1. Check sidebar | Only sees: Chat, Documents, Service Requests | |
| C-003 | Assigned building access | 1. Use building selector | Only assigned buildings available | |
| C-004 | Cannot access other buildings | 1. Try to select unassigned building | Building not in list | |

#### Service Requests (Client View)
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| C-010 | Create service request | 1. Click "Create Request"<br>2. Fill description<br>3. Select priority<br>4. Submit | Request created with "Pending" status | |
| C-011 | View own requests | 1. Navigate to Service Requests | Only own requests visible | |
| C-012 | Cannot update status | 1. View request | No status update controls visible | |
| C-013 | Request has correct building | 1. Create request<br>2. View request | Building auto-populated from selected building | |

#### Documents
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| C-020 | View building documents | 1. Navigate to Documents | Only documents for assigned buildings shown | |
| C-021 | Search documents | 1. Enter search term<br>2. Submit | Results filtered to assigned buildings | |

#### Chat
| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| C-030 | Ask question about building | 1. Type question<br>2. Send | AI returns relevant response | |
| C-031 | Response cites sources | 1. Ask detailed question | Response includes document/section references | |

---

## 7. Cross-Functional Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| X-001 | Role switching | 1. Login as admin<br>2. Change user role to technician<br>3. Logout/login as that user | New permissions take effect | |
| X-002 | Data isolation | 1. Create request as Client A<br>2. Login as Client B | Client B cannot see Client A's request | |
| X-003 | Real-time updates | 1. Open page in two browsers<br>2. Make change in one | Change reflected in other (if applicable) | |
| X-004 | Session timeout | 1. Login<br>2. Wait for session timeout | Gracefully redirected to login | |
| X-005 | Error handling | 1. Disconnect network<br>2. Try to submit form | User-friendly error message displayed | |

---

## 8. Defect Management

### Severity Definitions
| Severity | Definition | Example |
|----------|------------|---------|
| Critical | System unusable, no workaround | Cannot login, data loss |
| High | Major feature broken, workaround difficult | Cannot create service request |
| Medium | Feature impaired, workaround available | Search returns partial results |
| Low | Minor issue, cosmetic | Typo, alignment issue |

### Defect Workflow
1. Tester logs defect with steps to reproduce
2. Developer triages and assigns severity
3. Developer fixes and marks "Ready for Retest"
4. Tester verifies fix and closes defect

---

## 9. Sign-Off

### UAT Completion Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Admin Tester | | | |
| Technician Tester | | | |
| Client Tester | | | |

### Comments/Conditions

*Any conditions or known issues at time of sign-off:*

---

## 10. Appendix: Test Data Requirements

### Buildings
- Building A (Sydney) - assigned to test client
- Building B (Melbourne) - NSW region
- Building C (Brisbane) - NSW region
- Building D (Perth) - WA region

### Documents
- HVAC Manual - Building A
- Electrical Specs - Building A
- Fire Safety Manual - Building B
- General Operations - All buildings

### Service Requests
- 2-3 sample requests per building in various statuses

---

*This test plan should be reviewed and updated as features are completed.*
