-- Seed script for crypto cards
-- Run this in Supabase SQL Editor

-- Clear existing cards (optional - comment out if you want to keep existing)
-- DELETE FROM crypto_cards;

-- Insert crypto cards
INSERT INTO crypto_cards (name, issuer, card_tier, annual_fee, rewards_rate, reward_token, staking_required, benefits, image_url, website_url, description, is_active)
VALUES

-- Crypto.com Cards
(
  'Crypto.com Midnight Blue',
  'Crypto.com',
  'Midnight Blue',
  0,
  '{"default": 1}',
  'CRO',
  0,
  '["1% back on all purchases", "No staking required", "Free Spotify rebate (with higher tiers)"]',
  'https://crypto.com/images/cards/midnight_blue.png',
  'https://crypto.com/cards',
  'Entry-level crypto card with no staking requirement. Perfect for beginners wanting to earn crypto on everyday purchases.',
  true
),
(
  'Crypto.com Ruby Steel',
  'Crypto.com',
  'Ruby Steel',
  0,
  '{"default": 2}',
  'CRO',
  400,
  '["2% back on all purchases", "Free Spotify rebate ($12.99/month)", "Metal card"]',
  'https://crypto.com/images/cards/ruby_steel.png',
  'https://crypto.com/cards',
  'Popular mid-tier card with Spotify rebate. Requires $400 CRO stake for full benefits.',
  true
),
(
  'Crypto.com Jade Green',
  'Crypto.com',
  'Jade Green',
  0,
  '{"default": 3}',
  'CRO',
  4000,
  '["3% back on all purchases", "Free Spotify rebate", "Free Netflix rebate ($13.99/month)", "Airport lounge access", "4% staking rewards"]',
  'https://crypto.com/images/cards/jade_green.png',
  'https://crypto.com/cards',
  'Premium tier with Netflix and Spotify rebates plus airport lounge access. Requires $4,000 CRO stake.',
  true
),
(
  'Crypto.com Icy White',
  'Crypto.com',
  'Icy White',
  0,
  '{"default": 5}',
  'CRO',
  40000,
  '["5% back on all purchases", "Free Spotify rebate", "Free Netflix rebate", "Free Amazon Prime rebate", "Airport lounge + guest", "8% staking rewards", "Exclusive Icy White metal card"]',
  'https://crypto.com/images/cards/icy_white.png',
  'https://crypto.com/cards',
  'High-tier card with 5% cashback and extensive perks including Amazon Prime. Requires $40,000 CRO stake.',
  true
),
(
  'Crypto.com Obsidian',
  'Crypto.com',
  'Obsidian',
  0,
  '{"default": 8}',
  'CRO',
  400000,
  '["8% back on all purchases", "All streaming rebates", "Airport lounge + guest", "Private jet partnership", "Exclusive concierge", "10% staking rewards"]',
  'https://crypto.com/images/cards/obsidian.png',
  'https://crypto.com/cards',
  'The ultimate crypto card with 8% cashback and exclusive luxury perks. Requires $400,000 CRO stake.',
  true
),

-- Coinbase Card
(
  'Coinbase Card',
  'Coinbase',
  NULL,
  0,
  '{"default": 4, "stellar": 4, "graph": 4, "dogecoin": 1, "bitcoin": 1}',
  'BTC/ETH/XLM',
  0,
  '["Up to 4% back in crypto", "Choose your reward crypto", "No annual fee", "Spend any crypto in your Coinbase account", "Virtual and physical card available"]',
  'https://images.coinbase.com/card.png',
  'https://www.coinbase.com/card',
  'Spend crypto anywhere Visa is accepted. Earn up to 4% back in rewards - choose from BTC, ETH, DOGE, or other cryptos.',
  true
),

-- Binance Card
(
  'Binance Card',
  'Binance',
  NULL,
  0,
  '{"default": 8}',
  'BNB',
  0,
  '["Up to 8% cashback in BNB", "Zero fees", "Supported in 200+ countries", "Real-time crypto to fiat conversion", "Virtual and physical card"]',
  'https://binance.com/card.png',
  'https://www.binance.com/en/cards',
  'Spend your Binance crypto anywhere. Cashback rate depends on BNB holdings - up to 8% for top tier holders.',
  true
),

-- Gemini Credit Card
(
  'Gemini Credit Card',
  'Gemini',
  NULL,
  0,
  '{"default": 1, "dining": 3, "groceries": 2}',
  'BTC/ETH/40+ cryptos',
  0,
  '["3% on dining", "2% on groceries", "1% on everything else", "No annual fee", "Choose from 40+ cryptos", "Real credit card (builds credit)"]',
  'https://gemini.com/creditcard.png',
  'https://www.gemini.com/credit-card',
  'A real credit card that earns crypto rewards. Build credit while earning Bitcoin, Ethereum, or 40+ other cryptos.',
  true
),

-- Nexo Card
(
  'Nexo Card',
  'Nexo',
  NULL,
  0,
  '{"default": 2}',
  'BTC/NEXO',
  0,
  '["Up to 2% crypto cashback", "Spend without selling crypto", "Credit line against your holdings", "No monthly or annual fees", "90% LTV credit line"]',
  'https://nexo.io/card.png',
  'https://nexo.io/nexo-card',
  'Borrow against your crypto and spend without selling. Get up to 2% back in BTC or NEXO tokens.',
  true
),

-- BitPay Card
(
  'BitPay Card',
  'BitPay',
  NULL,
  0,
  '{"default": 0}',
  'None',
  0,
  '["Convert crypto to USD instantly", "Use anywhere Mastercard accepted", "Apple Pay & Google Pay support", "No conversion fees", "Supports BTC, ETH, and more"]',
  'https://bitpay.com/card.png',
  'https://bitpay.com/card/',
  'Convert your Bitcoin and crypto to dollars instantly. Spend anywhere Mastercard is accepted.',
  true
),

-- Fold Card
(
  'Fold Card',
  'Fold',
  NULL,
  0,
  '{"default": 1}',
  'BTC',
  0,
  '["Earn Bitcoin on every purchase", "Spin the wheel for bonus sats", "No credit check required", "Debit card (not credit)", "Stack sats daily"]',
  'https://foldapp.com/card.png',
  'https://foldapp.com/',
  'Stack sats with every swipe. Earn Bitcoin rewards plus spin the wheel for bonus Bitcoin prizes.',
  true
),

-- Wirex Card
(
  'Wirex Card',
  'Wirex',
  NULL,
  0,
  '{"default": 2}',
  'WXT/BTC',
  0,
  '["Up to 2% Cryptoback", "Zero fees on card spending", "Multi-currency support", "In-app crypto exchange", "150+ countries supported"]',
  'https://wirex.com/card.png',
  'https://wirexapp.com/card',
  'Spend crypto or fiat seamlessly. Earn up to 2% Cryptoback rewards in WXT or Bitcoin.',
  true
),

-- BlockFi Card (Note: BlockFi went bankrupt but keeping for reference)
(
  'BlockFi Rewards Credit Card',
  'BlockFi',
  NULL,
  0,
  '{"default": 1.5, "stablecoin": 2}',
  'BTC',
  0,
  '["1.5% back in Bitcoin", "2% on stablecoin purchases", "No annual fee", "3.5% first 90 days (up to $100)", "Real credit card"]',
  'https://blockfi.com/card.png',
  'https://blockfi.com/credit-card',
  'Earn unlimited 1.5% back in Bitcoin on every purchase. Note: BlockFi services may be limited.',
  false
),

-- Plutus Card
(
  'Plutus Card',
  'Plutus',
  'Starter',
  0,
  '{"default": 3}',
  'PLU',
  0,
  '["3% crypto rewards", "Free Netflix perk", "Free Spotify perk", "No monthly fee (Starter)", "Available in Europe"]',
  'https://plutus.it/card.png',
  'https://plutus.it/',
  'European crypto card with up to 3% back in PLU tokens. Includes free streaming perks on higher tiers.',
  true
),

-- Baanx Card
(
  'Baanx Crypto Card',
  'Baanx',
  NULL,
  0,
  '{"default": 1}',
  'BXX',
  0,
  '["Spend crypto instantly", "White-label crypto card platform", "Multi-asset support", "Global availability", "B2B and B2C solutions"]',
  'https://baanx.com/card.png',
  'https://www.baanx.com/',
  'Spend your crypto assets anywhere cards are accepted. Baanx provides crypto card infrastructure globally.',
  true
);

-- Verify insertion
SELECT name, issuer, reward_token, rewards_rate->>'default' as rewards_pct, annual_fee
FROM crypto_cards
ORDER BY issuer, name;
