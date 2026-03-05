# Task: Non-Code Requirements Audit & Action Plan

## Context
You are working on the F2K Housing Token Platform — a tokenised Australian housing investment fund. The platform build (smart contracts, investor portal, admin console) is being developed in parallel with legal, regulatory, security, and operational workstreams that exist outside the codebase.

## Your Job
1. Read ALL of the following files to understand the full project scope:
   - `docs/non-code-requirements.md` — the non-code requirements checklist
   - `docs/tasks/01-foundation.md` through `docs/tasks/06-security-ops.md` — the platform build specs
   - `CLAUDE.md` — project overview

2. Cross-reference the non-code requirements against:
   - The Labrys development proposal (the platform was scoped against this)
   - The F2K whitepaper (sections on regulatory framework, fund structure, build roadmap)
   - The migration snapshot (current state and open items)

3. Identify any GAPS — things mentioned in the whitepaper or Labrys proposal that are NOT covered in either the platform build specs OR the non-code requirements checklist. Flag anything we've missed.

4. Create a single, prioritised ACTION PLAN as a new file: `docs/action-plan.md`

## Action Plan Requirements

The action plan must have these sections:

### Section 1: Critical Path (blocks everything else)
Items that have the longest lead time or that everything else depends on. These must start immediately. For each item:
- What it is
- Who does it (Dennis, law firm, Labrys, other vendor)
- Estimated timeline
- Estimated cost
- What it blocks (what can't happen until this is done)
- Specific next action (not vague — e.g. "Email Hamilton Locke requesting AFSL scoping meeting" not "engage a law firm")

### Section 2: Parallel Workstreams
Items that can run alongside the platform build without blocking it. Group into:
- **Legal & Entity** — incorporation, trust deed, IM, agreements
- **Regulatory** — AFSL, AUSTRAC, AML/CTF
- **Vendor Selection** — custody, KYC production, market maker, fund admin
- **Board & Team** — recruitment priorities, which roles are needed first
- **Insurance** — what policies, when needed

For each item: what, who, when, cost, specific next action.

### Section 3: Platform Build Dependencies
Items from the non-code list that specifically depend on a platform build module being complete. Map each to the module it depends on:
- Module 4 complete → smart contract audit
- Module 5 complete → Labrys architecture review
- Module 6 complete → operational readiness sign-off
Show the dependency chain clearly.

### Section 4: Pre-Mainnet Checklist
A single yes/no checklist of EVERY item that must be complete before deploying to mainnet and accepting real investor funds. No item too small. Include both code and non-code items. This is the "go/no-go" gate.

### Section 5: Pre-Tranche-2 Checklist
Same format — everything that must be complete before opening Tranche 2 ($600M raise) to wholesale investors.

### Section 6: Budget Summary
Roll up all costs into a single table:
- Platform build costs (hosting, tooling)
- Legal costs
- Regulatory costs
- Audit costs
- Insurance costs
- Vendor costs
- Operational costs
- Contingency (15-20%)
- TOTAL

Show low/high range. This is the real $1M seed round budget allocation.

### Section 7: Timeline
A week-by-week or month-by-month Gantt-style view (text-based) showing:
- Platform build modules (10 weeks)
- Legal workstream
- Regulatory workstream
- Vendor workstream
- Audit workstream
- Go-live target date

### Section 8: Risk Register
Top 10 risks to the project, ranked by likelihood × impact:
- Risk description
- Likelihood (high/medium/low)
- Impact (high/medium/low)
- Mitigation
- Owner

## Output
Create `docs/action-plan.md` with all 8 sections. Be specific, not vague. Every action item must have a concrete next step, not "consider options" or "evaluate vendors."

## IMPORTANT
- Do NOT hallucinate costs or timelines. If you're uncertain about a specific cost (e.g., AFSL application fees), state the range you're confident in and flag it for Dennis to verify.
- Do NOT skip items because they seem minor. The pre-mainnet checklist must be exhaustive.
- Cross-reference the whitepaper Section 11 (Build Roadmap) against our actual build plan — flag any discrepancies in scope or timeline.
- Flag any items in the Labrys proposal that we've decided to build ourselves but that carry higher risk if done without professional review (beyond just the smart contracts).
