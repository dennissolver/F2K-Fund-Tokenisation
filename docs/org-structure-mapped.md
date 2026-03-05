# F2K Complete Org Structure — Mapped to Legal Entities

## AI-Native Principle

Every entity below is designed AI-native: AI handles document drafting, compliance monitoring, NAV calculation, specification matching, tender response generation, logistics optimisation, and reporting. Human roles focus on relationships, judgement calls, regulatory sign-offs, and physical site presence. This keeps headcount at roughly 40% of what a traditional fund + development company would need.

---

## The Full Picture

```
BOARD OF DIRECTORS (shared governance across all entities)
├── Chair — Aboriginal & First Nations Housing Leader
├── Independent Director — Financial Services / AFSL experience
├── Independent Director — Construction / Manufacturing
├── Executive Director — Dennis McMahon (National Programme Director)
└── Executive Director — Uwe Jacobs (Finance Director)
    │
    ├── Aboriginal Advisory Sub-Committee
    └── Audit & Risk Sub-Committee


PEAK ENTITY: F2K HOUSING TRUSTEE PTY LTD ◄── FILL FIRST
│   AFSL holder. Holds all fund assets. Fiduciary duty.
│   ────────────────────────────────────────────────────
│   Dennis McMahon — Director, Responsible Manager #1
│   [HIRE] Responsible Manager #2 — AFSL-experienced (regulatory req)
│   [HIRE] Compliance Officer — AML/CTF, AFSL conditions (can be PT consultant initially)
│   [AI-ASSISTED] Fund Administrator — outsource to Apex Group / Citco
│   [AI-ASSISTED] Fund Accountant — outsource initially, AI does 80% of NAV calc + reconciliation
│
│
├── F2K HOUSING MANAGEMENT PTY LTD (Investment Manager) ◄── FILL SECOND
│   │   Investment decisions, manufacturer financing, asset allocation.
│   │   Appointed by Trustee via IMA.
│   │   ──────────────────────────────────────────────────────────
│   │   Dennis McMahon — Director, National Programme Director
│   │   Uwe Jacobs — Finance Director
│   │   [HIRE] Head of Social Housing — THE critical hire (see below)
│   │   [AI-ASSISTED] Contributions Committee — approves non-crypto asset stakes
│   │   [AI-ASSISTED] Manufacturer Accreditation Panel
│   │
│   │
│   ├── DEVELOPMENT DIVISION (existing V1.0 portfolio)
│   │   │   WA, TAS, QLD commercial + residential projects
│   │   │   ──────────────────────────────────────────────
│   │   ├── State Programme Director — WA ($180-220k, existing)
│   │   ├── State Programme Director — TAS ($180-220k, existing)
│   │   ├── State Programme Director — QLD ($180-220k, existing)
│   │   │   │
│   │   │   ├── Project Managers × 5-7 ($140-180k ea, existing)
│   │   │   └── Site Supervisors × 6-8 ($100-130k ea, existing)
│   │   │
│   │   └── [AI] Project reporting, schedule tracking, cost forecasting
│   │
│   │
│   └── SOCIAL HOUSING DIVISION (new — Central Integrator)
│       │   Government social housing delivery across all states.
│       │   $70B+ addressable market.
│       │   ──────────────────────────────────────────────────
│       │   [HIRE] Head of Social Housing ($220-260k) ◄── FIRST COMMITMENT
│       │   [HIRE] Manufacturer Relations Manager ($150-180k)
│       │   [HIRE] Compliance & QA Manager ($140-170k)
│       │   [HIRE — Yr2] Government Procurement Manager ($130-160k)
│       │   │
│       │   ├── State PDs for VIC/SA/NT — as contract volume justifies
│       │   ├── Project Managers (SH) × 2-4 — as contracts won
│       │   └── Site Supervisors (SH) × 3-6 — 1 per active site
│       │
│       └── [AI] Specification compliance matching, tender drafting,
│           manufacturer-to-project matching, logistics optimisation
│
│
├── F2K OPERATING PTY LTD (Platform & Technology) ◄── FILL THIRD
│   │   Runs the tokenisation platform, KYC, admin ops.
│   │   Operational liability ring-fenced from fund assets.
│   │   ──────────────────────────────────────────────────
│   │   Dennis McMahon — Director
│   │   [AI-NATIVE] Platform is self-operating:
│   │       - AI monitors KYC queue, flags anomalies
│   │       - AI calculates NAV weekly, human approves
│   │       - AI generates distribution calculations, human executes
│   │       - AI monitors on-chain activity, alerts on anomalies
│   │       - AI generates compliance reports on demand
│   │
│   │   [HIRE — Yr2] Platform Operations Manager — when investor count >200
│   │   [OUTSOURCE] Penetration testing, smart contract audits
│   │   [OUTSOURCE] KYC provider (Sumsub)
│   │   [OUTSOURCE] Digital asset custody (Fireblocks/BitGo)
│   │
│   └── Platform Infrastructure
│       ├── Investor Portal (Next.js / Vercel)
│       ├── Admin Console (Next.js / Vercel)
│       ├── Supabase (DB, Auth, RLS)
│       ├── Smart Contracts (Ethereum)
│       │   ├── F2K-HT Token (ERC-3643)
│       │   ├── F2KSubscription
│       │   ├── F2KNavAttestation
│       │   └── F2KDistribution
│       └── Gnosis Safe (3-of-5 Multisig Treasury)
│
│
├── SPV 1 PTY LTD — e.g. "F2K WA Modular Housing SPV No. 1"
│   │   Ring-fenced per project. No dedicated staff.
│   │   Managed by Investment Manager + relevant State PD.
│   │   ──────────────────────────────────────────────────
│   │   Directors: Dennis + 1 Independent
│   │   [AI] Asset valuation tracking, lien management, reporting
│   │   Site Supervisor assigned from state pool (cost recovered from project fees)
│   │
│   └── Assets: manufacturer loan, property lien, equipment lease
│
├── SPV 2 PTY LTD — e.g. "F2K NT Aboriginal Housing SPV No. 2"
│   │   Same structure. Different geography/project.
│   │   ──────────────────────────────────────────────────
│   │   Directors: Dennis + 1 Independent
│   │   Site Supervisor assigned from state pool
│   │
│   └── Assets: government contract, land lease, manufacturer note
│
└── SPV N... (one per project, created as needed)
```

---

## Cascade Hiring Order

### Wave 1: IMMEDIATE (Months 1-3) — "Fund Can Operate"

These roles are either regulatory requirements or gate everything else.

| Priority | Role | Entity | Why First | Cost |
|----------|------|--------|-----------|------|
| 1 | **Responsible Manager #2** | Trustee | AFSL requires min. 2 RMs. Cannot lodge application without this. | $0 (board appointment) or $80-120k salary |
| 2 | **Compliance Officer** | Trustee | AML/CTF program, AFSL conditions, AUSTRAC. Start as PT consultant. | $24-48k/yr (consultant) |
| 3 | **Head of Social Housing** | Investment Manager | The pivotal hire. Builds government relationships, manufacturer network, wins contracts. Everything in Social Housing Division flows from this person. | $220-260k |
| 4 | **Independent Director (Financial Services)** | Board | AFSL application strength. Provides RM #2 if dual-hatted. | Board fees |
| 5 | **Chair (Aboriginal & First Nations)** | Board | Credibility for NT/WA Aboriginal housing programs. Government stakeholder trust. | Board fees |

**Wave 1 cost: ~$350-500k/yr (or less if RM#2 and Chair are board-fee-only)**

### Wave 2: MONTHS 4-9 — "Fund Can Deliver"

Once Head of Social Housing is in, they recruit their team and win the first contracts.

| Priority | Role | Entity | Why Now | Cost |
|----------|------|--------|---------|------|
| 6 | **Manufacturer Relations Manager** | Investment Manager (SH Div) | Pre-qualify Australian + Asian manufacturers against NCC and state specs. Core of the integrator model. | $150-180k |
| 7 | **Compliance & QA Manager** | Investment Manager (SH Div) | State specification mastery (WA DHW 12-doc suite, NCC, etc.). Makes F2K indispensable. | $140-170k |
| 8 | **Independent Director (Construction)** | Board | Fills board to 4 directors. Construction/manufacturing expertise. | Board fees |
| 9 | **Fund Administrator** | Trustee (outsourced) | NAV calculation, unit registry, tax reporting. Outsource to Apex/Citco. | $36-96k/yr |

**Wave 2 cumulative cost: ~$700k-1.0M/yr**

### Wave 3: MONTHS 10-18 — "Fund Can Scale"

First contracts won, revenue coming in, project fees recover field staff costs.

| Priority | Role | Entity | Why Now | Cost |
|----------|------|--------|---------|------|
| 10 | **Government Procurement Manager** | Investment Manager (SH Div) | Split from Head of SH as tender pipeline grows. | $130-160k |
| 11 | **State PDs for VIC/SA/NT** | Investment Manager (SH Div) | As social housing contracts won in new states. | $180-220k ea |
| 12 | **Additional Site Supervisors** | SPVs (cost-recovered) | 1 per active site. Paid from project management fees. | $100-130k ea |
| 13 | **Platform Operations Manager** | Operating Co | When investor count >200 and manual oversight needed. | $120-150k |

**Wave 3 is largely self-funding from project management fees (10-15% of construction value).**

---

## AI-Native Headcount vs Traditional

| Function | Traditional Headcount | F2K AI-Native Headcount | AI Handles |
|----------|----------------------|------------------------|------------|
| Fund admin & NAV | 2-3 staff | 0 (outsourced + AI calc) | NAV calculation, reconciliation, reporting |
| Compliance & AML | 2-3 staff | 1 (PT consultant) | Transaction monitoring, sanctions screening, report generation |
| Platform ops | 3-5 staff | 0 (self-operating platform) | KYC queue, distribution calc, audit logs, monitoring |
| Tender writing | 2-3 staff | 0 (AI-assisted by Head of SH) | Draft generation, specification matching, compliance checklists |
| Financial reporting | 2-3 staff | 1 (Finance Director) | Automated reporting, margin tracking, FX monitoring |
| Project cost tracking | 1 per project | 0 (AI per project) | Cost forecasting, schedule variance, milestone tracking |
| **Total saved** | **~12-17 roles** | **Replaced by AI** | **~$1.5-2.5M/yr saved** |

---

## Year 1 vs Year 2 Total Payroll

| | Year 1 | Year 2 |
|---|--------|--------|
| **National overhead** | $1.1-1.3M | $1.25-1.5M |
| **State/project (Development)** | $1.26-1.86M | $1.26-1.86M |
| **Social housing field staff** | $0.3-0.6M | $0.8-1.2M |
| **TOTAL** | **$2.7-3.8M** | **$3.3-4.6M** |
| **Headcount** | **~20-28** | **~25-37** |

---

## Summary: What to Do Monday Morning

1. **Appoint RM #2** — either recruit or dual-hat a board director with AFSL experience
2. **Engage compliance consultant** — part-time, starts on AML/CTF program immediately
3. **Begin Head of Social Housing search** — this person builds the revenue engine
4. **Recruit 2 independent directors** — financial services + construction backgrounds
5. **Begin Chair outreach** — Aboriginal housing organisations (AHURI, NAAJA, APO NT)

Everything else cascades from these five actions. The platform runs itself. The SPVs are shells until projects land. The Social Housing Division only scales as contracts are won. The cost recovery model means field staff pay for themselves from project fees.
