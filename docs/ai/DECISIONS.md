# RoastPage.ai — Decisions Log

> Architecture and design decisions inferred from the codebase.

## D-001: Next.js App Router
- **Choice**: App Router (not Pages Router)
- **Why (inferred)**: Modern Next.js pattern, supports React Server Components, Edge runtime for OG images

## D-002: Supabase as Database
- **Choice**: Supabase (hosted PostgreSQL) via `@supabase/supabase-js`
- **Why (inferred)**: Quick setup, free tier, built-in REST API

## D-003: USDT on Polygon for Payments
- **Choice**: Crypto payments (USDT on Polygon) instead of Stripe/traditional gateway
- **Why (inferred)**: No KYC requirements, global accessibility, low fees on Polygon
- **Trade-off**: Higher friction for users unfamiliar with crypto

## D-004: Thum.io for Screenshots
- **Choice**: External screenshot service (Thum.io) instead of Puppeteer/Playwright
- **Why (inferred)**: Serverless-friendly (no headless browser needed on Vercel)
- **Trade-off**: Dependency on third-party service, limited control over rendering

## D-005: Two-Tier AI Models
- **Choice**: gpt-4o-mini for free, gpt-4o for paid
- **Why (inferred)**: Cost optimization — cheaper model for free tier, better model for paying users

## D-006: No Authentication
- **Choice**: No user accounts, no auth
- **Why (inferred)**: Reduce friction for single-use tool, no need for persistent user state
- **Trade-off**: No user-linked history, no recurring revenue per user

## D-007: LocalStorage for History
- **Choice**: Client-side LocalStorage instead of server-side history
- **Why (inferred)**: No auth needed, simple implementation
- **Trade-off**: History lost on browser/device change
