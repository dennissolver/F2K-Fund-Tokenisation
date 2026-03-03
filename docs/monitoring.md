# Monitoring & Alerts

## Vercel (Both Apps)

- Enable **Analytics** in Vercel project settings for Core Web Vitals tracking
- Enable **Speed Insights** for real-time performance monitoring
- Set up **deployment notifications** via Slack or email

## Supabase

- **Auth alerts**: Monitor failed login attempts via Supabase Dashboard → Auth → Logs
- **Database alerts**: Set up email notifications for high DB usage via Project Settings → Integrations
- **RLS audit**: Periodically run: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;`

## Blockchain Monitoring

### Development (Sepolia)
- **Etherscan**: Watch contract addresses for events
  - `https://sepolia.etherscan.io/address/<contract_address>#events`
- Set up Etherscan email notifications for contract events

### Production Recommendations
- **Tenderly**: Real-time alerting on contract events, failed transactions, and state changes
- **Alchemy Notify**: Webhook-based event monitoring for:
  - Token transfers
  - Large subscriptions
  - Distribution executions
  - NAV publications
- **OpenZeppelin Defender**: Automated monitoring + transaction management for Safe multisig

## Key Metrics to Monitor

| Metric | Source | Alert Threshold |
|--------|--------|----------------|
| Failed login attempts | Supabase Auth | >10/hour per IP |
| API error rate | Vercel Analytics | >5% |
| Subscription failures | Audit log | Any failure |
| Distribution execution time | Audit log | >5 minutes |
| Gas price | Alchemy | >50 gwei (mainnet) |
| Safe pending transactions | Safe API | >3 pending |
