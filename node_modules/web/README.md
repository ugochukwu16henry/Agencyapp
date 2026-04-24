## Agency App (Stage 1 + 2)

Production-ready Next.js platform for verified property workflows, admin approvals, agent subscriptions, and CRM metrics.

## Local Setup

```bash
cd apps/web
npm install
```

Set `DATABASE_URL` in `.env` to your Postgres/Supabase database, then run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Start the app:

```bash
npm run dev
```

## Seeded Accounts

- Admin: `admin@agencyapp.sl`
- Partner: `partner1@agencyapp.sl`
- Agent: `agent1@agencyapp.sl`

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Notes

- Billing webhook secrets:
  - `PAYSTACK_WEBHOOK_SECRET` (or `PAYSTACK_SECRET_KEY`)
  - `FLUTTERWAVE_WEBHOOK_SECRET` (or `FLW_SECRET_HASH`)
