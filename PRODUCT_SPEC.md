# Enzo - Crypto Card Rewards Platform

## Vision

A comprehensive crypto credit card management platform that combines card comparison, rewards optimization, and portfolio tracking - essentially "SaveSage for Crypto Cards".

---

## Core Concept

Enzo helps crypto enthusiasts:
1. **Compare** crypto credit/debit cards across features, rewards, and fees
2. **Track** rewards earned across all their crypto cards
3. **Optimize** spending to maximize crypto cashback and benefits
4. **Redeem** rewards intelligently with personalized guidance

---

## Target Users

- Crypto enthusiasts with multiple crypto cards
- Users looking to choose their first crypto card
- Active spenders wanting to maximize crypto rewards
- DeFi users interested in card staking benefits

---

## Feature Set

### 1. Card Comparison Engine

| Feature | Description |
|---------|-------------|
| Card Database | Comprehensive list of crypto cards (Coinbase, Crypto.com, Binance, Nexo, etc.) |
| Side-by-Side Compare | Compare up to 4 cards simultaneously |
| Filter & Sort | By rewards %, fees, supported crypto, staking requirements |
| Card Finder Quiz | Personalized recommendations based on spending habits |
| Real-time Updates | Track card benefit changes and new launches |

### 2. Rewards Tracker (SaveSage-inspired)

| Feature | Description |
|---------|-------------|
| Link Cards | Connect crypto card accounts via API/manual entry |
| Rewards Dashboard | See all earned rewards in one place |
| Portfolio Value | Track total crypto rewards value in USD/BTC/ETH |
| Earning History | Historical charts of rewards earned over time |
| Category Breakdown | See rewards by spending category |

### 3. Spending Optimizer

| Feature | Description |
|---------|-------------|
| Smart Recommendations | "Use Card X for groceries, Card Y for travel" |
| Reward Maximizer | Calculate optimal card usage per merchant category |
| Spending Analysis | Insights on where you're leaving rewards on the table |
| Goal Setting | Set crypto accumulation targets |

### 4. Redemption Guidance

| Feature | Description |
|---------|-------------|
| Best Time to Redeem | Alerts when reward tokens are at favorable prices |
| Swap Suggestions | Optimal paths to convert reward tokens |
| Tax Implications | Basic guidance on reward taxation |
| Staking Options | Where to stake reward tokens for additional yield |

### 5. Card Management

| Feature | Description |
|---------|-------------|
| My Cards | Personal card portfolio |
| Benefit Tracking | Track card perks (Spotify, Netflix, airport lounge) |
| Fee Alerts | Reminders for annual fees, staking requirements |
| Expiring Benefits | Notifications for expiring rewards/perks |

---

## Crypto Cards to Support (Initial)

### Tier 1 (Priority)
- Coinbase Card
- Crypto.com Visa (all tiers: Midnight Blue to Obsidian)
- Binance Card
- Gemini Credit Card
- BlockFi Credit Card (if active)

### Tier 2
- Nexo Card
- Wirex Card
- BitPay Card
- Fold Card
- Shakepay Card

### Tier 3 (Future)
- Regional cards
- New market entrants
- DeFi protocol cards

---

## Architecture

### Tech Stack

```
Frontend:
├── Next.js 16 (App Router)
├── TypeScript
├── Tailwind CSS v4
├── Framer Motion (animations)
└── Recharts/Tremor (data visualization)

Backend:
├── Supabase (Database + Auth)
├── PostgreSQL (via Supabase)
├── Edge Functions (Supabase)
└── Cron Jobs (reward price updates)

External APIs:
├── CoinGecko/CoinMarketCap (crypto prices)
├── Card issuer APIs (where available)
└── Plaid (optional - transaction data)

Deployment:
├── Vercel (Frontend)
└── Supabase Cloud (Backend)
```

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users
users (managed by Supabase Auth)

-- Crypto Cards Master Data
crypto_cards
├── id (uuid)
├── name (text)
├── issuer (text)
├── card_tier (text)
├── annual_fee (decimal)
├── rewards_rate (jsonb) -- { "default": 1, "dining": 3, "travel": 2 }
├── reward_token (text) -- BTC, CRO, XLM, etc.
├── staking_required (decimal)
├── benefits (jsonb)
├── image_url (text)
├── website_url (text)
├── is_active (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

-- User's Cards
user_cards
├── id (uuid)
├── user_id (uuid, FK)
├── card_id (uuid, FK)
├── nickname (text)
├── is_primary (boolean)
├── added_at (timestamp)
└── notes (text)

-- Rewards Tracking
user_rewards
├── id (uuid)
├── user_id (uuid, FK)
├── user_card_id (uuid, FK)
├── amount (decimal)
├── token (text)
├── usd_value_at_earn (decimal)
├── category (text)
├── description (text)
├── earned_at (timestamp)
└── created_at (timestamp)

-- Spending Categories
spending_categories
├── id (uuid)
├── name (text)
├── icon (text)
└── color (text)

-- Card Benefits
card_benefits
├── id (uuid)
├── card_id (uuid, FK)
├── benefit_name (text)
├── benefit_value (decimal)
├── frequency (text) -- monthly, annual, one-time
└── description (text)

-- Price Cache (for reward tokens)
token_prices
├── id (uuid)
├── token_symbol (text)
├── price_usd (decimal)
├── price_btc (decimal)
├── updated_at (timestamp)
└── UNIQUE(token_symbol)
```

### Application Routes

```
/                       # Landing page
/login                  # Login page
/signup                 # Signup page
/auth/callback          # OAuth callback

/dashboard              # Main user dashboard
/dashboard/rewards      # Rewards overview
/dashboard/spending     # Spending analysis

/cards                  # Browse all crypto cards
/cards/[id]             # Individual card details
/cards/compare          # Side-by-side comparison

/my-cards               # User's card portfolio
/my-cards/add           # Add a new card

/optimizer              # Spending optimizer
/recommendations        # Personalized card recommendations

/settings               # User settings
/settings/profile       # Profile management
/settings/notifications # Notification preferences
```

---

## UI/UX Design Principles

### Theme
- Dark mode primary (crypto aesthetic)
- Accent colors: Lime/Green (growth), Purple (premium)
- Glassmorphism effects for cards
- Smooth animations and micro-interactions

### Components Needed
- Card display component (3D tilt effect)
- Comparison table
- Rewards chart (line, bar, pie)
- Category spending breakdown
- Notification badges
- Search with filters
- Modal dialogs
- Toast notifications

---

## MVP Scope (Phase 1)

### Must Have
- [ ] User authentication (Email + Google)
- [ ] Crypto card database (10+ cards)
- [ ] Card listing with filters
- [ ] Card detail pages
- [ ] Side-by-side comparison (2-4 cards)
- [ ] Basic user dashboard
- [ ] Add cards to "My Cards"
- [ ] Manual reward entry

### Nice to Have
- [ ] Card finder quiz
- [ ] Rewards charts
- [ ] Dark/Light mode toggle
- [ ] Email notifications

### Future (Phase 2+)
- [ ] API integrations with card issuers
- [ ] Plaid integration for auto-tracking
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Community reviews/ratings
- [ ] Referral system

---

## Monetization Ideas

1. **Affiliate Links** - Earn commission on card signups
2. **Premium Tier** - Advanced analytics, API access
3. **Sponsored Listings** - Featured card placements
4. **Data Insights** - Anonymized market research (B2B)

---

## Competitive Advantage

| vs SaveSage | vs CryptoCard Vault |
|-------------|---------------------|
| Crypto-focused | Rewards tracking |
| DeFi integration | Spending optimization |
| Token price tracking | Personalized recommendations |
| Staking insights | Portfolio management |

---

## Success Metrics

- Monthly Active Users (MAU)
- Cards tracked per user
- Rewards value tracked (total USD)
- Card comparison sessions
- User retention (30-day, 90-day)
- Affiliate conversion rate

---

## Development Phases

### Phase 1: Foundation (Current)
- Auth system ✓
- Database setup
- Card database seeding
- Basic UI components

### Phase 2: Core Features
- Card listing & comparison
- User dashboard
- My Cards portfolio
- Manual rewards entry

### Phase 3: Intelligence
- Spending optimizer
- Recommendations engine
- Price tracking integration
- Notifications

### Phase 4: Scale
- API integrations
- Mobile app
- Community features
- Premium features

---

## Open Questions

1. Should we support non-US crypto cards initially?
2. Manual entry vs API integration priority?
3. Include DeFi cards (Gnosis, Argent)?
4. Tax reporting feature scope?
5. Social features (share portfolio, leaderboards)?

---

## Resources & References

- [SaveSage](https://savesage.club/) - Rewards tracking inspiration
- [CryptoCard Vault](https://crypto-card-aggregator.vercel.app/) - Comparison UI reference
- [Crypto.com Cards](https://crypto.com/cards) - Card tier structure
- [CoinGecko API](https://www.coingecko.com/api) - Price data
