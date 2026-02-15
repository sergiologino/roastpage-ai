# RoastPage.ai — Architecture

## Tech Stack
- **Framework**: Next.js 14.2.21 (App Router)
- **Language**: TypeScript 5.7.2
- **UI**: React 18.3.1, Tailwind CSS 3.4.17, Framer Motion 11.15.0
- **Icons**: Lucide React
- **Toasts**: Sonner
- **IDs**: nanoid
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI SDK 4.77.0
- **Deployment**: Vercel

## Directory Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (metadata, GA, Sonner)
│   ├── page.tsx                # Homepage (URL input, features, pricing, FAQ)
│   ├── globals.css             # Global styles (dark theme, glassmorphism)
│   ├── history/page.tsx        # LocalStorage-based history
│   ├── report/[id]/page.tsx    # Report detail page
│   ├── share/[id]/             # Share pages (metadata + redirect)
│   └── api/
│       ├── roast/route.ts      # Main analysis endpoint (POST)
│       ├── report/[id]/route.ts# Get report (GET)
│       ├── payment/verify/route.ts # Payment verification (POST)
│       ├── health/route.ts     # Health check (GET)
│       └── og/route.tsx        # OG image generation (GET, Edge)
├── components/
│   ├── CategoryCard.tsx        # Category card with scores, issues, recommendations
│   ├── ScoreCircle.tsx         # SVG circular score visualization
│   ├── PaymentModal.tsx        # USDT payment flow
│   ├── LoadingAnimation.tsx    # Multi-stage loading indicator
│   └── ShareButtons.tsx        # Social sharing (Twitter, LinkedIn, TG, WA, Reddit)
└── lib/
    ├── prompts.ts              # AI system & user prompts (standard + pro)
    ├── store.ts                # Supabase CRUD operations
    ├── supabase.ts             # Supabase client init
    ├── types.ts                # TypeScript interfaces
    ├── useHistory.ts           # History hook (possibly unused)
    └── utils.ts                # URL validation, domain extraction, etc.
```

## Database Tables (Supabase)

### `reports`
| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | nanoid |
| url | string | Analyzed URL |
| screenshot_url | string? | Thum.io URL |
| overall_score | number | 0–100 |
| summary | string | AI summary |
| top_fixes | string[] | Array of top fixes |
| categories | json[] | RoastCategory objects |
| is_paid | boolean | Payment status |
| created_at | timestamp | Auto |

### `payments`
| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | nanoid |
| report_id | string (FK) | → reports.id |
| amount | number | 9.99 |
| currency | string | "USDT" |
| tx_hash | string | Polygon tx hash |
| status | string | pending/confirmed/failed |
| created_at | timestamp | Auto |

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/roast | Analyze URL → AI → save report |
| GET | /api/report/[id] | Get report (hides locked categories if !paid) |
| POST | /api/payment/verify | Verify USDT tx on Polygon |
| GET | /api/health | Health check |
| GET | /api/og | Dynamic OG image (Edge runtime) |

## AI Models
- **Free / Promo**: `gpt-4o-mini`, 3000 max tokens, low-detail image
- **Pro**: `gpt-4o`, 4096 max tokens, high-detail image

## Analysis Categories (8 total, weighted)
1. Headline & Value Proposition (20%)
2. Copywriting (15%)
3. Visual Design & Hierarchy (15%)
4. Call-to-Action (20%)
5. Social Proof & Trust (10%)
6. Mobile Experience (5%)
7. Psychology & Persuasion (10%)
8. Performance Signals (5%)

## Payment Flow
1. User clicks "Unlock Full Report"
2. PaymentModal shows wallet address
3. User sends USDT on Polygon
4. User pastes tx hash → POST /api/payment/verify
5. Backend: eth_getTransactionReceipt → verify USDT transfer to wallet
6. Report updated: is_paid = true

## Environment Variables
```
OPENAI_API_KEY            # OpenAI API key
SUPABASE_URL              # Supabase project URL
SUPABASE_ANON_KEY         # Supabase anon key
USDT_WALLET_ADDRESS       # Server-side wallet address
NEXT_PUBLIC_USDT_WALLET   # Client-side wallet address
```
