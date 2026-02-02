# Risk Register - MPS Building Management AI

**Last Updated:** 2026-02-02
**Risk Owner:** Product Owner
**Review Frequency:** Weekly during development, bi-weekly post-launch

---

## Risk Assessment Matrix

|              | **Low Impact (1)** | **Medium Impact (2)** | **High Impact (3)** |
|--------------|:------------------:|:---------------------:|:-------------------:|
| **High (3)** | 3 - Medium | 6 - High | 9 - Critical |
| **Medium (2)** | 2 - Low | 4 - Medium | 6 - High |
| **Low (1)** | 1 - Low | 2 - Low | 3 - Medium |

---

## Active Risks

### R1: LLM API Costs Exceed Budget
| Attribute | Value |
|-----------|-------|
| **ID** | R1 |
| **Category** | Financial |
| **Description** | Usage of Claude/OpenAI API for chat functionality may generate higher-than-expected costs, especially during peak usage or if responses require multiple API calls |
| **Likelihood** | Medium (2) |
| **Impact** | High (3) |
| **Risk Score** | 6 - High |
| **Trigger** | Monthly API costs exceed $X threshold |
| **Mitigation** | 1. Implement response caching for common queries<br>2. Set daily/monthly usage limits per user<br>3. Use smaller models for simple queries<br>4. Monitor costs in real-time dashboard |
| **Contingency** | Reduce AI features, implement rate limiting, or seek budget increase |
| **Owner** | Developer |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R2: UAT Reveals Major UX Issues
| Attribute | Value |
|-----------|-------|
| **ID** | R2 |
| **Category** | Quality |
| **Description** | User Acceptance Testing may uncover significant usability problems that require substantial rework, potentially delaying launch |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 - Medium |
| **Trigger** | >20% of UAT test cases fail due to UX issues |
| **Mitigation** | 1. Conduct early user feedback sessions (Week 2-3)<br>2. Follow existing UI patterns from working features<br>3. Build in buffer time for iteration<br>4. Prioritize critical path fixes |
| **Contingency** | Extend UAT phase, launch with known issues documented |
| **Owner** | Product Owner |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R3: Data Migration Complexity
| Attribute | Value |
|-----------|-------|
| **ID** | R3 |
| **Category** | Technical |
| **Description** | If existing data needs to be migrated or transformed, complexity may cause delays or data integrity issues |
| **Likelihood** | Low (1) |
| **Impact** | High (3) |
| **Risk Score** | 3 - Medium |
| **Trigger** | Migration script fails or data validation errors occur |
| **Mitigation** | 1. Document current data state thoroughly<br>2. Create reversible migration scripts<br>3. Test migrations in staging environment<br>4. Maintain full database backups |
| **Contingency** | Rollback to previous state, manual data correction |
| **Owner** | Developer |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R4: Security Vulnerabilities Discovered
| Attribute | Value |
|-----------|-------|
| **ID** | R4 |
| **Category** | Security |
| **Description** | Security review or penetration testing may reveal vulnerabilities in authentication, authorization, or data handling |
| **Likelihood** | Low (1) |
| **Impact** | Critical (4) |
| **Risk Score** | 4 - Medium |
| **Trigger** | Security scan reports high/critical vulnerabilities |
| **Mitigation** | 1. Follow Supabase RLS best practices<br>2. Conduct code review for security issues<br>3. Use parameterized queries only<br>4. Implement input validation<br>5. Regular dependency updates |
| **Contingency** | Delay launch until critical issues resolved, engage security consultant |
| **Owner** | Developer |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R5: Key Resource Unavailability
| Attribute | Value |
|-----------|-------|
| **ID** | R5 |
| **Category** | Resource |
| **Description** | Key team members may become unavailable due to illness, leave, or competing priorities |
| **Likelihood** | Low (1) |
| **Impact** | High (3) |
| **Risk Score** | 3 - Medium |
| **Trigger** | Key resource unavailable for >2 days during critical phase |
| **Mitigation** | 1. Cross-train team members<br>2. Document all processes and decisions<br>3. Identify backup resources<br>4. Keep stakeholders informed of dependencies |
| **Contingency** | Adjust timeline, bring in contractor support |
| **Owner** | Project Sponsor |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R6: Third-Party Service Outage
| Attribute | Value |
|-----------|-------|
| **ID** | R6 |
| **Category** | Technical |
| **Description** | Supabase, LLM API, or other third-party services may experience outages affecting application availability |
| **Likelihood** | Low (1) |
| **Impact** | Medium (2) |
| **Risk Score** | 2 - Low |
| **Trigger** | Third-party service unavailable for >1 hour |
| **Mitigation** | 1. Monitor third-party status pages<br>2. Implement graceful degradation<br>3. Cache critical data locally<br>4. Have communication plan for users |
| **Contingency** | Activate fallback messaging, wait for service restoration |
| **Owner** | Developer |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R7: Scope Creep
| Attribute | Value |
|-----------|-------|
| **ID** | R7 |
| **Category** | Management |
| **Description** | Additional features or changes requested during development may expand scope beyond MVP, causing delays |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 - Medium |
| **Trigger** | Change requests that impact timeline by >3 days |
| **Mitigation** | 1. Strict change control process<br>2. Clear MVP definition documented<br>3. "Nice to have" backlog for post-MVP<br>4. Regular scope reviews with stakeholders |
| **Contingency** | Defer new requests to Phase 2, negotiate timeline extension |
| **Owner** | Product Owner |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

### R8: Integration Issues with Supabase
| Attribute | Value |
|-----------|-------|
| **ID** | R8 |
| **Category** | Technical |
| **Description** | Complex queries, RLS policies, or edge functions may not work as expected, requiring workarounds |
| **Likelihood** | Low (1) |
| **Impact** | Medium (2) |
| **Risk Score** | 2 - Low |
| **Trigger** | Supabase feature doesn't support required functionality |
| **Mitigation** | 1. Prototype complex features early<br>2. Review Supabase documentation thoroughly<br>3. Test RLS policies in isolation<br>4. Have Supabase support contact ready |
| **Contingency** | Implement workaround, simplify requirements |
| **Owner** | Developer |
| **Status** | Open |
| **Date Identified** | 2026-02-02 |

---

## Risk Summary Dashboard

| Priority | Count | Risks |
|----------|-------|-------|
| Critical (7-9) | 0 | - |
| High (5-6) | 1 | R1 |
| Medium (3-4) | 5 | R2, R3, R4, R5, R7 |
| Low (1-2) | 2 | R6, R8 |

---

## Risk Review Log

| Date | Reviewer | Changes Made |
|------|----------|--------------|
| 2026-02-02 | Initial | Risk register created |
| | | |

---

## Closed Risks

*No risks closed yet*

---

*This document should be reviewed weekly during active development and updated as risks are identified, mitigated, or realized.*
