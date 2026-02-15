# RoastPage.ai — Project Overview

## What
AI-powered landing page analyzer that scores pages on conversion potential (0–100) and gives actionable feedback across 8 categories.

## Target User
Founders, marketers, indie hackers who want quick feedback on their landing pages before or after launch.

## Business Model
Freemium:
- **Free**: overall score + 2 categories
- **Pro ($9.99)**: all 8 categories with detailed fixes, rewrite examples, competitor insights
- **Promo codes**: LAUNCH2025 (10), ROASTME (5), PRODUCTHUNT (20), FRIEND (3) — in-memory tracking, resets on deploy

## Payment
USDT on Polygon, one-time per report, on-chain verification via transaction hash.

## Core Flow
1. User enters URL
2. App fetches screenshot (Thum.io) + extracts page text
3. OpenAI GPT-4 Vision analyzes the page
4. Report saved to Supabase, displayed to user
5. Paid unlock via USDT → on-chain verification → full report

## URLs / Domains
- Production domain: `roastpage-ai.com` (Vercel)
- Supabase project: `ohxqvvfrcolnyolmceua.supabase.co`

## Key Third-Party Services
| Service | Purpose |
|---------|---------|
| OpenAI (GPT-4o / GPT-4o-mini) | AI analysis |
| Supabase | Database (PostgreSQL) |
| Thum.io | Screenshot capture |
| Polygon RPC | Payment verification |
| Google Analytics (G-J77YBKV04K) | Analytics |
| Vercel | Hosting & deployment |
