# Rollout Plan - MPS Building Management AI

**Version:** 1.0
**Last Updated:** 2026-02-02
**Rollout Lead:** Product Owner
**Target Timeline:** Weeks 5-6

---

## 1. Rollout Strategy Overview

```
Week 5 (Days 1-3)     Week 5 (Days 4-7)     Week 6              Week 6+
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Phase A:       │   │  Phase B:       │   │  Phase C:       │   │  Phase D:       │
│  Internal Pilot │ → │  Full Internal  │ → │  External Pilot │ → │  General        │
│  (3-5 users)    │   │  (All internal) │   │  (2-3 clients)  │   │  Availability   │
└─────────────────┘   └─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## 2. Pre-Rollout Checklist

### Technical Readiness
- [ ] Production environment provisioned
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Domain DNS configured
- [ ] Supabase project in production mode
- [ ] LLM API keys configured with production limits
- [ ] Error monitoring enabled (e.g., Sentry)
- [ ] Analytics tracking configured
- [ ] Backup procedures tested

### Content Readiness
- [ ] User guides completed (per role)
- [ ] FAQ document prepared
- [ ] Training materials finalized
- [ ] Demo video recorded
- [ ] Support email/channel established

### Operational Readiness
- [ ] Support process documented
- [ ] Escalation path defined
- [ ] On-call schedule for launch week
- [ ] Rollback procedure documented and tested
- [ ] Communication templates prepared

---

## 3. Phase A: Internal Pilot (Week 5, Days 1-3)

### Objectives
- Validate production environment works correctly
- Get early feedback from power users
- Identify any issues before wider rollout

### Participants
| Name | Role | Building Access |
|------|------|-----------------|
| TBD | Admin | All |
| TBD | Technician | NSW Region |
| TBD | Client (FM) | Building A |

### Day 1 Checklist
- [ ] Deploy to production
- [ ] Smoke test all critical paths
- [ ] Create pilot user accounts
- [ ] Send pilot invitation emails
- [ ] Schedule onboarding call

### Day 1-3 Activities
| Day | Activity | Owner |
|-----|----------|-------|
| 1 | Deploy and smoke test | Developer |
| 1 | Onboard pilot users (30-min call) | Product Owner |
| 1-3 | Pilot users test features | Pilot Users |
| 2 | Collect initial feedback (Slack/email) | Product Owner |
| 3 | Fix any critical issues | Developer |
| 3 | Pilot retrospective call | Product Owner |

### Go/No-Go Criteria for Phase B
- [ ] No critical bugs reported
- [ ] Core workflows functional (service requests, documents, chat)
- [ ] Pilot user feedback is positive/neutral
- [ ] No data integrity issues

---

## 4. Phase B: Full Internal Rollout (Week 5, Days 4-7)

### Objectives
- Onboard all internal users
- Establish support processes
- Build internal expertise before client rollout

### Communication Plan
| Day | Communication | Audience | Channel |
|-----|---------------|----------|---------|
| Day 4 AM | Launch announcement | All internal | Email + Slack |
| Day 4 PM | Training session 1 | Technicians | Video call |
| Day 5 AM | Training session 2 | Admins | Video call |
| Day 5 | User guide distribution | All | Email |
| Day 7 | Week 1 survey | All | Survey link |

### Training Session Agenda (45 minutes)
1. Introduction and login (5 min)
2. Dashboard overview (5 min)
3. Service Requests walkthrough (10 min)
4. Documents and Search (10 min)
5. AI Chat demo (10 min)
6. Q&A (5 min)

### Support Setup
- **Primary Channel:** #mps-app-support (Slack)
- **Response SLA:** 4 hours during business hours
- **Escalation:** Developer for technical issues

### Day 4-7 Checklist
- [ ] Send launch announcement
- [ ] Conduct training sessions
- [ ] Monitor support channel actively
- [ ] Track user activation metrics
- [ ] Daily standup to review issues
- [ ] Fix high-priority issues same day

### Go/No-Go Criteria for Phase C
- [ ] >70% internal user activation
- [ ] No critical bugs open
- [ ] <5 high bugs open
- [ ] Positive feedback from majority of users
- [ ] Support processes working effectively

---

## 5. Phase C: External Pilot (Week 6)

### Objectives
- Validate with real client users
- Get external perspective on UX
- Build case studies for marketing

### Pilot Client Selection Criteria
- Existing good relationship
- Willing to provide feedback
- Representative use case
- Available for onboarding call

### Pilot Clients
| Organization | Contact | Buildings | Status |
|--------------|---------|-----------|--------|
| TBD | TBD | 1-2 | Invited |
| TBD | TBD | 1-2 | Invited |
| TBD | TBD | 1-2 | Invited |

### Onboarding Process (per client)
| Step | Activity | Owner | Duration |
|------|----------|-------|----------|
| 1 | Pilot invitation email | Product Owner | - |
| 2 | Account setup | Developer | 1 hour |
| 3 | Building/user configuration | Developer | 1 hour |
| 4 | Onboarding video call | Product Owner | 45 min |
| 5 | User guide sent | Product Owner | - |
| 6 | Week 1 check-in call | Product Owner | 30 min |
| 7 | Feedback survey | Product Owner | - |

### Pilot Communication Schedule
| Day | Communication | Method |
|-----|---------------|--------|
| Day 1 | Welcome + onboarding call | Video + Email |
| Day 3 | "How's it going?" check-in | Email |
| Day 5 | Week 1 feedback call | Video |
| Day 7 | Feedback survey | Survey link |

### Pilot Feedback Collection
- Daily monitoring of support requests
- Weekly check-in calls
- End-of-pilot survey
- NPS score collection

### Go/No-Go Criteria for Phase D
- [ ] All pilot clients successfully onboarded
- [ ] NPS score >20 from pilot clients
- [ ] No critical issues blocking client workflows
- [ ] Positive testimonials/quotes obtained
- [ ] Support volume manageable

---

## 6. Phase D: General Availability (Week 6+)

### Objectives
- Open to all clients
- Establish self-service onboarding
- Transition to BAU operations

### GA Readiness Checklist
- [ ] Self-service signup enabled (if applicable)
- [ ] Client onboarding documentation complete
- [ ] Support team trained and ready
- [ ] Monitoring dashboards active
- [ ] Marketing materials published
- [ ] Pricing/billing configured (if applicable)

### GA Launch Activities
| Activity | Owner | Timing |
|----------|-------|--------|
| GA announcement email | Marketing | Day 1 |
| Website/landing page update | Marketing | Day 1 |
| Social media announcement | Marketing | Day 1 |
| Client webinar invitation | Product Owner | Week 1 |
| Onboarding webinar (weekly) | Product Owner | Ongoing |

### Post-GA Monitoring
| Metric | Target | Frequency |
|--------|--------|-----------|
| New user signups | Track trend | Daily |
| User activation rate | >60% | Weekly |
| Support ticket volume | Monitor | Daily |
| System uptime | >99.5% | Continuous |
| Error rate | <1% | Continuous |

---

## 7. Rollback Procedure

### Triggers for Rollback
- Critical bug affecting >50% of users
- Data corruption or loss
- Security breach
- System completely unavailable

### Rollback Steps
1. **Decision** - Product Owner + Developer agree on rollback
2. **Communication** - Notify users of temporary downtime
3. **Execute** - Developer reverts deployment
4. **Verify** - Confirm previous version working
5. **Communicate** - Notify users of status
6. **Investigate** - Root cause analysis
7. **Fix** - Address issue before re-deployment

### Rollback Checklist
- [ ] Previous deployment version identified
- [ ] Database rollback script ready (if needed)
- [ ] Communication template prepared
- [ ] Stakeholders notified
- [ ] Post-rollback verification plan

---

## 8. Success Metrics

### Phase A (Internal Pilot) Success
| Metric | Target |
|--------|--------|
| Pilot users activated | 100% |
| Critical bugs | 0 |
| Pilot satisfaction | Positive |

### Phase B (Full Internal) Success
| Metric | Target |
|--------|--------|
| User activation | >70% |
| Training completion | >80% |
| Support tickets | <20 |

### Phase C (External Pilot) Success
| Metric | Target |
|--------|--------|
| Client NPS | >20 |
| Feature adoption | >50% using core features |
| Support tickets | <5 per client |

### Phase D (GA) Success
| Metric | Target |
|--------|--------|
| New client signups | Track growth |
| User retention (30-day) | >70% |
| Support satisfaction | >4/5 |

---

## 9. Contacts & Escalation

| Role | Name | Contact | Escalation Level |
|------|------|---------|------------------|
| Product Owner | TBD | TBD | L1 - Feature/UX issues |
| Developer | TBD | TBD | L2 - Technical issues |
| Project Sponsor | TBD | TBD | L3 - Critical decisions |

### On-Call Schedule (Launch Week)
| Day | Primary | Backup |
|-----|---------|--------|
| Mon | Developer | Product Owner |
| Tue | Developer | Product Owner |
| Wed | Developer | Product Owner |
| Thu | Developer | Product Owner |
| Fri | Developer | Product Owner |
| Sat | Developer (on-call) | - |
| Sun | Developer (on-call) | - |

---

## 10. Sign-Off

### Phase Approvals

| Phase | Approver | Signature | Date |
|-------|----------|-----------|------|
| Phase A Go | Product Owner | | |
| Phase B Go | Product Owner | | |
| Phase C Go | Project Sponsor | | |
| Phase D Go | Project Sponsor | | |

---

*This rollout plan should be updated as dates are confirmed and participants identified.*
