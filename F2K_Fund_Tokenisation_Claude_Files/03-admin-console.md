# Module 3: Admin Console

## Goal
F2K ops team manages investors, subscriptions, NAV, distributions, and reporting.

## Dependencies
- Module 1 + 2 complete

## Auth Model
Admin console uses separate Supabase Auth with role-based access.

Create `admin_users` table:
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'fund_manager', 'compliance', 'read_only')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

Admin console API routes use `SUPABASE_SERVICE_ROLE_KEY` (bypasses investor RLS).
Each API route checks `admin_users.role` for permission.

**Role permissions:**
| Action | super_admin | fund_manager | compliance | read_only |
|--------|:-----------:|:------------:|:----------:|:---------:|
| View investors | ✓ | ✓ | ✓ | ✓ |
| Approve KYC | ✓ | ✗ | ✓ | ✗ |
| Manage allowlist | ✓ | ✓ | ✓ | ✗ |
| Confirm subscriptions | ✓ | ✓ | ✗ | ✗ |
| Input/approve NAV | ✓ | ✓ | ✗ | ✗ |
| Create distributions | ✓ | ✓ | ✗ | ✗ |
| View audit log | ✓ | ✓ | ✓ | ✓ |
| Manage admin users | ✓ | ✗ | ✗ | ✗ |

## Pages to Build

### 3.1 Dashboard (`/`)
- Total AUM (sum of confirmed subscriptions)
- Active investors count
- Pending actions: KYC reviews, subscription confirmations, NAV approvals
- Recent activity feed (last 20 audit log entries)
- Fund health: current NAV, last distribution date, next distribution due

### 3.2 Investors (`/investors`)
- Table: name, email, wallet, KYC status, investor type, date registered
- Filters: KYC status, investor type, date range
- Search: by name, email, wallet address
- Click row → investor detail page

### 3.3 Investor Detail (`/investors/[id]`)
- Profile info (editable by compliance)
- KYC status + documents (link to Sumsub dashboard)
- Wallet address + allowlist status
- Subscription history
- Distribution history
- Action buttons: Override KYC status (compliance+), Add to allowlist, Add note
- Audit trail for this investor

### 3.4 Allowlist (`/allowlist`)
- Table: wallet address, investor name, status, added date, reviewed by
- Pending approvals at top
- Actions: approve, deny, revoke
- Each action creates audit log entry and (in Module 5) triggers on-chain identity registry update

### 3.5 Subscriptions (`/subscriptions`)
- Table: investor, amount, token price, tokens, status, date
- Pending confirmations highlighted
- Action: "Confirm USDC Received" → changes status to 'confirmed'
- Action: "Mint Tokens" → changes status to 'minted' (in Module 5 this triggers actual minting)
- Each action creates audit log

### 3.6 NAV Management (`/nav`)
**Input form:**
- NAV per token (numeric input)
- Total fund NAV (auto-calculated: NAV per token × total supply)
- Calculation date
- Supporting notes
- Submit → creates `nav_records` with status = 'draft'

**Approval workflow:**
- Draft NAV visible to fund managers
- "Approve" button (requires different user than submitter)
- Approved NAV shown on investor dashboards
- "Publish On-Chain" button (Module 5: triggers attestation contract)

**History:**
- Table of all NAV records: date, value, status, submitted by, approved by

### 3.7 Distributions (`/distributions`)
**Create distribution:**
1. Set total USDC amount for this quarter
2. System snapshots all token balances
3. Calculates each investor's share: `(their_balance / total_supply) × total_amount`
4. Shows preview table: investor, balance, share %, amount
5. "Approve" button (requires fund_manager or super_admin)
6. "Execute" button → marks each payment as 'sent' (Module 5: triggers on-chain distribution)

**Distribution detail (`/distributions/[id]`):**
- Summary: total amount, date, status
- Payment table: investor, amount, tx hash, status
- Reconciliation: total sent vs total approved

### 3.8 Reporting (`/reports`)
- **Investor Register:** CSV export of all investors + KYC status + holdings
- **Holdings Snapshot:** all investors + current token balance + NAV value at a given date
- **Distribution Report:** per-distribution breakdown of all payments
- **Audit Trail:** filterable export of all audit log entries
- All exports: CSV + basic PDF (server-side generation)

### 3.9 Audit Log (`/audit-log`)
- Table: timestamp, actor, action, entity, details
- Filters: actor, action type, entity type, date range
- Expandable rows showing full `details` JSON

### 3.10 Settings (`/settings`)
- Admin user management (super_admin only): invite, change role, deactivate
- Fund parameters display (read-only): fee rates, preferred return, min investment

## API Routes

```
apps/admin-console/src/app/api/
├── auth/callback/route.ts
├── investors/
│   ├── route.ts                  # GET list, with filters
│   └── [id]/
│       ├── route.ts              # GET detail, PATCH update
│       └── kyc-override/route.ts # POST override KYC status
├── allowlist/
│   ├── route.ts                  # GET list, POST add
│   └── [id]/route.ts             # PATCH approve/deny/revoke
├── subscriptions/
│   ├── route.ts                  # GET list
│   └── [id]/
│       ├── confirm/route.ts      # POST confirm USDC receipt
│       └── mint/route.ts         # POST mint tokens
├── nav/
│   ├── route.ts                  # GET list, POST create draft
│   └── [id]/
│       ├── approve/route.ts      # POST approve
│       └── publish/route.ts      # POST publish on-chain (Module 5)
├── distributions/
│   ├── route.ts                  # GET list, POST create
│   └── [id]/
│       ├── route.ts              # GET detail
│       ├── approve/route.ts      # POST approve
│       └── execute/route.ts      # POST execute payments
├── reports/
│   └── route.ts                  # GET with type param → CSV/PDF
├── audit-log/
│   └── route.ts                  # GET with filters
└── admin-users/
    └── route.ts                  # GET list, POST invite (super_admin)
```

**IMPORTANT:** Every mutating API route must:
1. Verify admin auth (check `admin_users` table)
2. Check role permissions
3. Create audit log entry with actor, action, entity, details
4. Use Supabase service_role client

## Shared Utility: Audit Logger

Create `packages/shared/src/audit.ts`:
```typescript
export interface AuditEntry {
  actor_id: string;
  actor_email: string;
  action: string;        // e.g. "kyc_override", "subscription_confirmed", "nav_approved"
  entity_type: string;   // e.g. "investor", "subscription", "nav_record"
  entity_id: string;
  details: Record<string, unknown>;
}
```

## Acceptance Criteria
- [ ] Admin can log in and see dashboard with fund overview
- [ ] Investor list with search, filter, and drill-down to detail
- [ ] KYC override works (compliance role)
- [ ] Allowlist approve/deny creates audit entry
- [ ] Subscription confirm + mint flow works end-to-end
- [ ] NAV input → approve workflow works (two different users)
- [ ] Distribution create → preview → approve → execute flow works
- [ ] All reports export as CSV
- [ ] Audit log captures every admin action
- [ ] Role-based access enforced (read_only can't mutate)
- [ ] `pnpm build` and `pnpm typecheck` pass

## Verification
```bash
pnpm --filter admin-console build
pnpm --filter admin-console typecheck
# Manual: create test investor via portal, then manage via admin console
# Manual: full NAV input → approve workflow
# Manual: full distribution create → execute workflow
# Manual: verify audit log has entries for all actions
# Manual: test role restrictions (read_only user can't approve)
```
