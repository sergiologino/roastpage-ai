# RoastPage.ai — Current State

> Last updated: 2026-02-15

## Status: MVP deployed on Vercel

## What Works
- URL input and analysis via GPT-4 Vision
- Screenshot capture via Thum.io
- Report storage in Supabase
- Freemium model (2 free categories + paid unlock)
- USDT payment on Polygon with on-chain verification
- Report sharing with dynamic OG images
- LocalStorage-based history (last 50 reports)
- Promo code system (in-memory, 4 codes)
- Social sharing (Twitter, LinkedIn, Telegram, WhatsApp, Reddit)
- Google Analytics integration

## Known Issues / Limitations
- Promo code usage tracked in-memory — resets on every deploy/restart
- No rate limiting on API endpoints
- No authentication / user accounts
- Supabase uses anon key for all operations (no service role key separation)
- `useHistory.ts` in lib/ — possibly unused
- No error boundaries in React components

## Unknown / TBD
- **Testing**: no test framework configured, no tests exist. How to run tests? → TBD
- **CI/CD**: no pipeline configs found. Is there a CI/CD pipeline? → TBD
- **Monitoring**: no error tracking (Sentry, etc.) beyond GA. Intentional? → TBD
- **Supabase migrations**: no migration files found. Schema managed manually? → TBD
- **Custom domain**: `roastpage-ai.com` referenced in layout.tsx. Is DNS configured? → TBD

## Security Concerns
- `.env.local` contains real API keys — verify it's in `.gitignore`
- No rate limiting → potential abuse of OpenAI API
- Payment verification trusts user-submitted tx hash (but does verify on-chain)
