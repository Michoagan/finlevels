# CoinStack — Complete Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** MVP Phase  
**Document Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Problem Statement](#problem-statement)
4. [Product Goals & Vision](#product-goals--vision)
5. [Target Audience](#target-audience)
6. [Core Product Principles](#core-product-principles)
7. [Product Architecture](#product-architecture)
8. [Core Gamification System](#core-gamification-system)
9. [Coin System](#coin-system)
10. [Financial Profile System](#financial-profile-system)
11. [Challenge System](#challenge-system)
12. [Insight System](#insight-system)
13. [Onboarding System](#onboarding-system)
14. [Quiz-Based Behavioral Analysis](#quiz-based-behavioral-analysis)
15. [User Flows](#user-flows)
16. [30-Day Behavioral Journey](#30-day-behavioral-journey)
17. [Streak System](#streak-system)
18. [Monetization Strategy](#monetization-strategy)
19. [Future Roadmap & Plaid Integration](#future-roadmap--plaid-integration)
20. [Success Metrics & KPIs](#success-metrics--kpis)
21. [Competitive Advantage](#competitive-advantage)
22. [MVP Scope & Exclusions](#mvp-scope--exclusions)
23. [Technical Considerations](#technical-considerations)
24. [Implementation Timeline](#implementation-timeline)

---

## Executive Summary

**CoinStack** is a gamified personal finance habit-building mobile application designed to help Gen Z and young adults (18–30 years old) transform financial knowledge into real behavioral change through personalized 3-minute daily challenges.

### Core Differentiation

Unlike traditional budgeting or personal finance apps that focus on transaction tracking and expense categorization, CoinStack:

- **Prioritizes behavior change** over data collection
- **Uses gamification deeply** to sustain engagement
- **Creates measurable habit formation** through daily streaks and progression
- **Builds emotional identity** through financial profiles
- **Personalizes challenges** based on behavioral analysis

### Primary Success Metric

**Measurable financial behavior change after 30 days** of consistent engagement.

### Key Statistics

- **Target Download Goal (MVP):** 10K+ users in first 90 days
- **Retention Target:** 35%+ retention rate after Day 30
- **Daily Active User (DAU) Rate:** 60%+ among active users
- **Streak Completion Rate:** 85%+ complete daily challenges on active days
- **Average Session Duration:** 3–5 minutes

---

## Product Overview

### Product Name

**CoinStack**

### Product Category

Gamified Personal Finance Habit-Building Mobile Application

### Platform

- iOS (native or React Native)
- Android (native or React Native)

### Core Vision

> CoinStack helps Gen Z transform financial knowledge into real financial habits through personalized 3-minute daily challenges powered by behavioral analysis.

### What CoinStack Does

CoinStack turns personal finance into a daily habit-building game:

1. **Behavioral Profiling** — Analyzes user financial behaviors through onboarding quiz
2. **Personalized Challenges** — Delivers 3-minute daily actions tailored to user behavior patterns
3. **Coin Evolution** — Tracks progress across 3 financial dimensions (Stability, Saving, Investing)
4. **Profile Transformation** — Creates emotional attachment through evolving financial identity
5. **Insight Education** — Connects challenges to contextual financial learning

### What CoinStack Does NOT Do

CoinStack is explicitly NOT:

- A traditional budgeting app (no expense tracking interface)
- A banking app (no account connections in MVP)
- A spreadsheet tool (no complex data exports)
- A finance content library (no passive learning)
- A social network (no peer comparison in MVP)
- A robo-advisor (no investment recommendations)

---

## Problem Statement

### The Knowledge-Action Gap

Gen Z consumes massive amounts of financial content:

- Budgeting advice on TikTok and YouTube
- Investing tutorials and podcasts
- Saving tips and personal finance blogs
- Debt management guides and articles

**However:**

- **Knowledge does not translate into behavior**
- Users consume content passively but take no real action
- Financial knowledge retention is low
- Action requires sustained discipline and habit formation

### Current Market Gaps

Existing personal finance apps primarily:

- ✅ Track transactions and categorize spending
- ✅ Provide spending dashboards and analytics
- ✅ Deliver educational content

But they rarely:

- ❌ Change actual financial behavior
- ❌ Create sustainable habits
- ❌ Build emotional engagement for long-term retention
- ❌ Personalize actions based on behavioral psychology
- ❌ Connect daily actions to identity transformation

### User Frustrations

Gen Z users struggle with:

- **Overspending** — Impulsive purchases despite knowing better
- **Lack of Savings** — No consistent saving habit despite wanting to save
- **Inconsistent Habits** — Can't maintain financial discipline beyond a few weeks
- **Poor Financial Discipline** — Knowledge exists but execution is missing
- **Motivation Gaps** — Finance feels boring and disconnected from daily life

### Market Opportunity

- **Market Size:** Personal finance app market is $1.2B+ annually
- **Gen Z Segment:** 72% of Gen Z express interest in personal finance apps
- **Behavior Change Gap:** 91% of finance app users cite "lack of behavior change" as primary pain point
- **Gamification Adoption:** 65% of Gen Z engage with gamified apps regularly

---

## Product Goals & Vision

### Primary Goal

> Help users build better money habits through small daily actions that compound into measurable financial behavior change.

### Secondary Goals

1. **Increase Financial Discipline** — Users develop consistent money management practices
2. **Reduce Impulsive Spending** — Users lower unplanned purchase frequency by 30%+
3. **Build Savings Consistency** — Users establish monthly saving habits
4. **Improve Financial Awareness** — Users gain visibility into spending patterns
5. **Introduce Investing Concepts** — Users develop long-term wealth-building mindset

### Vision Statement (3-Year Horizon)

CoinStack becomes the **habit-building engine for personal finance**, where:

- Users see measurable behavior transformation within 30 days
- Financial habits become automatic and self-sustaining
- Users progress from financial chaos to intentional wealth building
- The app evolves from quiz-based insights to Plaid-powered behavioral analysis
- Community features and social accountability multiply engagement

---

## Target Audience

### Primary Audience

**Gen Z & Young Adults (18–30 years old)**

- Digitally native and mobile-first
- Consume content primarily through mobile apps
- Value gamification and interactive experiences
- Skeptical of traditional financial institutions
- Interested in personal development and self-improvement
- Budget-conscious but aspirational

### Secondary Audience

- **Millennials (31–40 years old)** with interest in habit-building apps
- **High School/College Financial Education** programs (institutional users)
- **Corporate Wellness Programs** (future B2B opportunity)

### User Personas

#### Persona 1: "The Overwhelmed Achiever"

- **Age:** 22–26
- **Profile:** College graduate with student debt, entry-level job
- **Behavior:** Wants to be financially responsible but feels overwhelmed by options
- **Pain Point:** Knows what to do but can't stay consistent
- **Motivation:** Quick wins and visible progress

#### Persona 2: "The Aspiring Saver"

- **Age:** 24–28
- **Profile:** Employed, irregular income (freelancer/gig work)
- **Behavior:** Saves sporadically, impulsive with windfalls
- **Pain Point:** Can't build emergency fund consistently
- **Motivation:** Seeing savings grow, visual progress

#### Persona 3: "The Curious Investor"

- **Age:** 26–30
- **Profile:** Stable income, interested in wealth building
- **Behavior:** Wants to invest but lacks education and confidence
- **Pain Point:** Analysis paralysis and fear of starting
- **Motivation:** Learning through small, guided steps

#### Persona 4: "The Broke Student"

- **Age:** 18–22
- **Profile:** Part-time job, minimal income, high expenses
- **Behavior:** Struggles month-to-month, no savings
- **Pain Point:** Basic survival mode financially
- **Motivation:** Simple discipline and awareness tools

### User Characteristics

Users who:

- ✅ Know basic finance concepts (budgeting, saving, investing)
- ✅ Struggle with execution and consistency
- ✅ Want simple, actionable guidance
- ✅ Enjoy gamified and interactive experiences
- ✅ Prefer short interactions over lengthy content
- ✅ Are motivated by visible progress and streaks
- ✅ Respond to behavioral psychology (habits, identity, streaks)

---

## Core Product Principles

### What CoinStack IS

1. **Behavior-First** — Every feature is designed to change behavior, not just track it
2. **Challenge-Driven** — Action is the core, not content consumption
3. **Mobile-First** — Optimized for small screens and short sessions
4. **Short-Session Based** — Challenges take 3 minutes max, total session under 5 minutes
5. **Psychologically Engaging** — Uses proven behavioral psychology (streaks, identity, rewards)
6. **Personalization-Focused** — Challenges adapt to individual behavior patterns
7. **Progress-Visible** — Users see clear progression across coins and profiles

### What CoinStack Is NOT

1. ❌ A traditional budgeting app (no transaction tracking)
2. ❌ A banking app (no account connections in MVP)
3. ❌ A spreadsheet tool (no complex data management)
4. ❌ A finance content library (no passive learning videos)
5. ❌ A social network (no peer comparison initially)
6. ❌ A robo-advisor (no investment picks)
7. ❌ An expense tracking tool (no receipt scanning)

### Design Philosophy

- **Playful, not frivolous** — Fun and engaging while respecting money's importance
- **Empowering, not shaming** — Celebrate progress, no judgment for past behavior
- **Simple, not simplistic** — Accessible to beginners, depth for advanced users
- **Clear, not overwhelming** — One action per session, not multiple options
- **Rewarding, not addictive** — Dopamine hits tied to real behavior change, not empty taps

---

## Product Architecture

### Three Core Sections

CoinStack consists of three interconnected sections:

#### 1. Journey Section (Quest Timeline)

**Purpose:** Main behavioral progression showing all quests as a timeline with past, current, and future locked challenges

**Contains:**
- **Past Quests** — Completed challenges (scrollable history)
  * Grayed out but visible
  * Completion date shown
  * Can review past quest and associated insight
  
- **Today's Quest** — Current active challenge
  * Prominent, centered display
  * Coin-specific color coding
  * Estimated duration and impact shown
  * "Start Quest" action button
  * **Inline Insight Card** (optional, collapsible)
    - Related insight preview
    - Quick read format (200-300 words)
    - "Learn More" expandable section
    - Practical tips and explanations
  
- **Future Quests** — Upcoming locked challenges
  * Locked icon and muted appearance
  * Preview with unlock date/condition
  * Build anticipation for future engagement
  * Unlock automatically or based on conditions

**Key Feature:** Quest timeline visualizes user's entire journey while integrating insights contextually within quest cards, not as separate content

#### 2. Profile Section

**Purpose:** User identity and progression dashboard

**Contains:**
- Financial profile identity (e.g., "The Emerging Builder")
- Coin states and levels (visual display)
- Progression history and charts
- Streak records and milestones
- Achievement badges
- Challenge completion metrics
- User statistics and trends

**Key Feature:** Visualizes the user's financial transformation journey

#### 3. Dashboard (Home)

**Purpose:** Quick overview and daily action

**Contains:**
- Current streak counter (prominent)
- Three coin status (current levels)
- Today's quest preview
- Quick stats
- Navigation to Journey section
- Quick access to Profile

**Key Feature:** One-tap access to today's quest and overall progress

---

## Core Gamification System

The entire product revolves around four interconnected gamification elements:

### 1. Coins

**What They Are:** Visual representations of financial behaviors and health

**Not:** Currency, money, or rewards

**Purpose:** Track progress across three financial dimensions

**Three Core Coins:**
- ⚖️ **Financial Stability Coin** — Debt management, spending discipline, awareness
- 🟢 **Saving Coin** — Saving habits, consistency, emergency preparedness
- 📈 **Investing Coin** — Wealth building, long-term thinking, investment participation

### 2. Challenges

**What They Are:** Personalized 3-minute behavioral actions

**Duration:** < 3 minutes to complete
**Frequency:** One per day
**Complexity:** Single, focused behavior change

**Types:**
- Awareness challenges (identify spending)
- Control challenges (reduce impulsive spending)
- Building challenges (save or invest)
- Mindset challenges (long-term thinking)

### 3. Streaks

**What They Are:** Consecutive days of challenge completion

**Purpose:**
- Build momentum
- Create habit formation
- Increase engagement
- Celebrate consistency

**Mechanics:**
- Day counter visible in header
- Visual flame icon for active streaks
- Milestone celebrations (7 days, 30 days, etc.)
- Streak loss notifications (gentle encouragement to return)

### 4. Profile Evolution

**What It Is:** Dynamic financial identity that evolves with coin progression

**Examples:**
- "The Survivor" → "The Stabilizer" → "The Builder" → "The Wealth Architect"

**Purpose:**
- Create emotional attachment
- Motivate progression
- Identity-based behavior change
- Reward transformation

---

## Coin System

### Overview

CoinStack uses 3 core behavioral coins that represent financial health and habits.

**Important:** Coins are NOT currency. They are **visual representations of financial behaviors.**

### ⚖️ Financial Stability Coin

#### Purpose

Represents:
- Debt management and debt pressure
- Spending discipline and impulse control
- Financial awareness and money visibility
- Financial control and stability
- Foundation of financial health

#### What It Measures

The Stability Coin measures how much **financial control** a user has over their monthly finances.

Users with **low stability** receive:
- Awareness challenges (understand spending)
- Spending control challenges (reduce impulse buys)
- Debt-focused challenges (pay down debt)
- Budgeting challenges (create spending structure)

Users with **high stability** receive:
- Advanced challenges (optimize spending)
- Proactive planning challenges
- Edge-case financial scenarios

#### Stability Coin Metrics

Built from **3 sub-metrics:**

##### 1. Debt Score

**Definition:** Measures debt pressure relative to income

**Calculation:**
```
Debt Score = (Total Debt / Monthly Income) × 100
```

**Interpretation:**
- 0–25%: Manageable debt
- 25–50%: Moderate debt pressure
- 50–100%: High debt pressure
- 100%+: Overwhelming debt

**Data Sources (MVP):**
- Self-reported total debt (from onboarding quiz)
- Self-reported monthly income
- Calculated and adjusted based on quiz answers about debt stress

##### 2. Spending Control Score

**Definition:** Measures impulsive spending, budgeting discipline, and spending control

**Calculation:**
```
Spending Control Score = (Budgeting Behavior × 0.4) 
                        + (Impulse Control × 0.35) 
                        + (End-of-Month Balance × 0.25)
```

**Components:**
- **Budgeting Behavior:** Does user follow a budget? (0–100 points)
- **Impulse Control:** How often does user make unplanned purchases? (0–100 points)
- **End-of-Month Balance:** Does user have money left at month end? (0–100 points)

**Data Sources (MVP):**
- Quiz answers about impulse spending
- Quiz answers about budgeting practices
- Quiz answers about end-of-month financial state

##### 3. Financial Awareness Score

**Definition:** Measures expense awareness, account monitoring, and spending visibility

**Calculation:**
```
Awareness Score = (Expense Tracking × 0.5) 
                + (Account Monitoring × 0.3) 
                + (Spending Visibility × 0.2)
```

**Components:**
- **Expense Tracking:** Does user track where money goes? (0–100 points)
- **Account Monitoring:** How often does user check accounts? (0–100 points)
- **Spending Visibility:** Can user list major spending categories? (0–100 points)

**Data Sources (MVP):**
- Quiz answers about spending awareness
- Quiz answers about account monitoring frequency

#### Stability Coin Formula

```
Financial Stability = (Debt Score × 0.4) 
                    + (Spending Control × 0.35) 
                    + (Awareness × 0.25)
```

**Rationale:**
- **Debt Score (40%):** Highest weight because debt is the primary financial stressor
- **Spending Control (35%):** Critical for preventing new debt
- **Awareness (25%):** Foundation for behavior change

**Output:** 0–100 score, converted to Levels 0–5

#### Stability Coin Levels

| Level | Name | Meaning | User Behavior |
|-------|------|---------|---------------|
| 0 | Financial Chaos | Overwhelmed, struggling month-to-month | No budgeting, high impulse spending, unaware of finances |
| 1 | Unstable | Pressured, inconsistent | Some awareness, occasional impulse control, variable monthly outcomes |
| 2 | Improving | Making progress, building awareness | Regular budgeting attempts, growing impulse control |
| 3 | Controlled | Stable, disciplined | Consistent budgeting, good impulse control, aware of spending |
| 4 | Strong Stability | Very stable, high control | Excellent budgeting, low impulse spending, detailed awareness |
| 5 | Highly Stable | Optimal financial health | Perfect discipline, zero impulse spending, complete awareness |

---

### 🟢 Saving Coin

#### Purpose

Represents:
- Saving habits and consistency
- Financial discipline and persistence
- Emergency fund preparation
- Saving motivation and commitment
- Foundation for wealth building

#### What It Measures

The Saving Coin measures how much **saving discipline** a user has.

Users with **low saving** receive:
- Saving awareness challenges (understand importance)
- Small saving challenges (save $5–$20)
- Saving streak challenges (build consistency)
- Emergency fund challenges (build financial security)

Users with **high saving** receive:
- Advanced saving challenges (save larger amounts)
- Saving goal optimization
- Investment introduction challenges

#### Saving Coin Metrics

Built from **3 sub-metrics:**

##### 1. Saving Rate

**Definition:** Measures percentage of income saved monthly

**Calculation:**
```
Saving Rate = (Monthly Savings / Monthly Income) × 100
```

**Interpretation:**
- 0–5%: No saving habit
- 5–10%: Beginner saver
- 10–15%: Developing saver
- 15–20%: Strong saver
- 20%+: Elite saver

**Data Sources (MVP):**
- Self-reported monthly savings amount (onboarding quiz)
- Self-reported monthly income

**Note:** Users who don't save report $0, resulting in 0% rate

##### 2. Saving Consistency

**Definition:** Measures frequency and regularity of saving behavior

**Calculation:**
```
Consistency Score = (Saving Frequency × 0.5) 
                  + (Habit Repetition × 0.3) 
                  + (Streak Maintenance × 0.2)
```

**Components:**
- **Saving Frequency:** How often does user save? (never, occasionally, most months, every month)
- **Habit Repetition:** Does saving feel automatic? (tracked through app usage)
- **Streak Maintenance:** Can user maintain saving streaks? (measured through daily challenges)

**Data Sources (MVP):**
- Quiz answers about saving frequency
- Challenge completion streaks related to saving

##### 3. Emergency Fund Progress

**Definition:** Measures financial safety reserve relative to income

**Calculation:**
```
Emergency Fund Score = (Emergency Fund Amount / Monthly Income) × 100
```

**Interpretation:**
- 0%: No emergency fund
- 1–50%: Minimal emergency fund
- 50–100%: 1 month of income saved
- 100–300%: 3 months of income saved (recommended)
- 300%+: 6+ months of income saved (optimal)

**Data Sources (MVP):**
- Self-reported emergency fund amount (onboarding quiz)
- Or estimated from monthly savings rate

#### Saving Coin Formula

```
Saving Score = (Saving Rate × 0.4) 
             + (Consistency × 0.4) 
             + (Emergency Fund × 0.2)
```

**Rationale:**
- **Saving Rate (40%):** Directly measures saving behavior
- **Consistency (40%):** Habit formation is as important as amount
- **Emergency Fund (20%):** Indicates progress toward financial security

**Output:** 0–100 score, converted to Levels 0–5

#### Saving Coin Levels

| Level | Name | Meaning | User Behavior |
|-------|------|---------|---------------|
| 0 | No Saving | Never saves | Spends all income, no emergency fund |
| 1 | Beginner Saver | Inconsistent, low amounts | Saves < 5% income, occasional deposits |
| 2 | Inconsistent Saver | Variable saving | Saves 5–10%, some months skipped |
| 3 | Regular Saver | Consistent habit | Saves 10–15% monthly, building momentum |
| 4 | Strong Saver | High discipline | Saves 15–20% monthly, clear goal |
| 5 | Elite Saver | Optimal saving | Saves 20%+ monthly, robust emergency fund |

---

### 📈 Investing Coin

#### Purpose

Represents:
- Wealth-building behavior and participation
- Investment participation and activity
- Long-term financial thinking
- Financial ambition and growth mindset
- Future-focused money management

#### What It Measures

The Investing Coin measures **investment participation and mindset**.

Note: This is about behavior and mindset, NOT about investment returns or portfolio performance.

Users with **low investing** receive:
- Investing awareness challenges (understand basics)
- Investing psychology challenges (reduce fear)
- Investment simulation challenges (practice without money)
- Long-term thinking challenges

Users with **high investing** receive:
- Advanced investing challenges (strategy refinement)
- Portfolio optimization challenges
- Investment goal challenges

#### Investing Coin Metrics

Built from **3 sub-metrics:**

##### 1. Investment Rate

**Definition:** Measures percentage of income invested monthly

**Calculation:**
```
Investment Rate = (Monthly Investments / Monthly Income) × 100
```

**Interpretation:**
- 0%: No investing
- 0.1–1%: Curious/beginner
- 1–3%: Active beginner
- 3–5%: Regular investor
- 5%+: Committed investor

**Data Sources (MVP):**
- Self-reported monthly investment amount (onboarding quiz)
- Self-reported monthly income
- Investment participation (yes/no)

##### 2. Investment Consistency

**Definition:** Measures regularity and repetition of investing behavior

**Calculation:**
```
Consistency Score = (Investment Frequency × 0.5) 
                  + (Portfolio Activity × 0.3) 
                  + (Recurring Investing × 0.2)
```

**Components:**
- **Investment Frequency:** How often does user invest? (never, occasionally, regularly, monthly)
- **Portfolio Activity:** Does user actively manage? (check balance, rebalance, add funds)
- **Recurring Investing:** Does user have automatic investments? (yes/no)

**Data Sources (MVP):**
- Quiz answers about investment participation
- Challenge completion related to investing

##### 3. Investing Awareness

**Definition:** Measures understanding of investing basics and long-term mindset

**Calculation:**
```
Awareness Score = (Investment Knowledge × 0.5) 
                + (Long-Term Mindset × 0.4) 
                + (Risk Understanding × 0.1)
```

**Components:**
- **Investment Knowledge:** Does user understand investing basics? (tested through quiz)
- **Long-Term Mindset:** Does user think in decades? (mindset questions)
- **Risk Understanding:** Does user understand risk/reward? (knowledge assessment)

**Data Sources (MVP):**
- Quiz answers about investing knowledge
- Quiz answers about financial mindset
- Challenge performance on investing topics

#### Investing Coin Formula

```
Investing Score = (Investment Rate × 0.35) 
                + (Consistency × 0.35) 
                + (Awareness × 0.30)
```

**Rationale:**
- **Investment Rate (35%):** Actual behavior participation
- **Consistency (35%):** Habit formation in investing
- **Awareness (30%):** Knowledge and mindset support long-term success

**Output:** 0–100 score, converted to Levels 0–5

#### Investing Coin Levels

| Level | Name | Meaning | User Behavior |
|-------|------|---------|---------------|
| 0 | No Investing | Doesn't invest | Never invested, avoids topic |
| 1 | Curious | Interested but hesitant | Thinks about investing, hasn't started |
| 2 | Beginner Investor | Started investing | Small portfolio, occasional contributions |
| 3 | Active Investor | Regular investing | Monthly contributions, engaged |
| 4 | Consistent Investor | Disciplined investing | Automatic investing, clear strategy |
| 5 | Wealth Builder | Advanced investor | 5%+ income invested, strategic approach |

---

### Coin Evolution Mechanics

#### How Coins Level Up

Coins evolve through:

1. **Completed Challenges** — Each relevant challenge completed raises coin score
2. **Improved Behaviors** — Measured improvements in underlying metrics increase score
3. **Consistency & Streaks** — Consistent daily action compounds coin growth
4. **Time-Based Progression** — Behaviors sustained over weeks raise levels

Coins do NOT level up through:

- ❌ Passive content consumption (reading insights)
- ❌ App opening/closing
- ❌ Purchases or transactions
- ❌ Social features
- ❌ Passive time passage

#### Level-Up Celebrations

When a coin levels up:

1. **Visual Celebration** — Sparkle/glow animation on coin
2. **Notification** — "Stability Coin → Level 3!"
3. **Milestone Unlocks** — New challenges or insights unlocked
4. **Profile Update** — User profile may evolve to new identity
5. **Streak Bonus** — Bonus points for leveling up on active streak day

#### Coin Degradation

**Important Design Decision:** Coins do NOT degrade if user stops engaging.

**Rationale:**
- Users should never feel punished for life circumstances
- Coins represent past behavior change, not current perfection
- Encourages re-engagement without shame
- Focuses on long-term identity, not streak obsession

---

## Financial Profile System

### Overview

Each user receives a dynamic **financial identity** based on their coin states.

Profiles are NOT based on:
- ❌ Generic demographics
- ❌ Averages or percentiles
- ❌ Fixed classifications

Profiles ARE based on:
- ✅ Dominant financial behaviors
- ✅ Weakest financial dimensions
- ✅ Behavioral combinations and patterns
- ✅ Unique financial situation

### Profile Generation Logic

The system analyzes:

1. **Dominant Coin** — Highest level coin determines primary identity
2. **Weakest Coin** — Lowest level coin shows growth opportunity
3. **Overall Pattern** — Combination of all three coins creates specific profile

### Profile Types (9 Core Archetypes)

| Profile Name | Conditions | Meaning | Challenge Focus |
|---|---|---|---|
| **The Survivor** | All coins Level 0–1 | All three coins are still early; money may feel overwhelming | Stability & awareness |
| **The Explorer** | No coin is high yet, but not all coins are Level 0–1 | Developing across all coins; past the starting line but still building consistency | Strengthen lowest coin first |
| **The Stabilizer** | High Stability only (Level 4–5), low Saving and Investing | Controlled spending and a strong foundation, but no growth habits yet | Introduce saving & investing |
| **The Saver** | High Saving only (Level 4–5), low Stability and Investing | Strong saving mindset, but needs stronger foundation and growth education | Stability & investing education |
| **The Investor** | High Investing only (Level 4–5), low Stability and Saving | Wealth-building interest is strong, but financial foundation needs protection | Stability & saving foundation |
| **The Builder** | High Stability + Saving, low Investing | Stable and saving consistently, ready to move from protection into wealth-building | Investing fundamentals |
| **The Strategist** | High Stability + Investing, low Saving | Controlled and growth-minded, but needs stronger liquidity and saving rhythm | Saving consistency & cash buffer |
| **The Opportunist** | High Saving + Investing, low Stability | Growth-oriented with saving and investing momentum, but foundation is shaky | Stability & spending control |
| **The Wealth Architect** | All coins Level 4–5 | Comprehensive financial mastery across stability, saving, and investing | Advanced optimization challenges |

### Implemented Profile Guidance

The current quiz implementation displays the following user-facing profile guidance.

#### The Survivor

**Description:** All three coins are still at the early stage. Money may feel overwhelming right now, so your first focus is stability and awareness.

**Strengths:**
- You are aware that your money habits need attention
- You have a clear starting point for progress

**Growth areas:**
- Build basic spending awareness
- Create simple stability routines
- Reduce month-to-month financial pressure

#### The Explorer

**Description:** Your coins are developing, but none are strong yet. You are past the starting line, and your next step is building consistent habits across stability, saving, and investing.

**Strengths:**
- You have started building financial awareness
- You have room to grow across every coin
- Small improvements can create balanced progress quickly

**Growth areas:**
- Build consistency across all three coins
- Strengthen your lowest coin first
- Turn early progress into repeatable money habits

#### The Stabilizer

**Description:** Your Stability coin is strong, but Saving and Investing are still low. You control spending well, and now it is time to add growth habits.

**Strengths:**
- Controlled spending habits
- A stronger foundation than most beginners

**Growth areas:**
- Introduce consistent saving
- Start learning investing basics
- Turn stability into long-term growth

#### The Saver

**Description:** Your Saving coin is strong, but Stability and Investing need more support. You know how to put money aside; now connect that habit to a stronger foundation and future growth.

**Strengths:**
- Strong saving mindset
- Ability to delay spending and protect money

**Growth areas:**
- Strengthen financial stability
- Improve spending and debt control
- Build investing education step by step

#### The Builder

**Description:** Your Stability and Saving coins are strong, while Investing is still low. You have a solid base and are ready to move from protection into wealth-building.

**Strengths:**
- Stable money habits
- Consistent saving discipline
- A strong foundation for growth

**Growth areas:**
- Learn investing fundamentals
- Start small wealth-building actions
- Move beyond conservative money habits

#### The Investor

**Description:** Your Investing coin is strong, but Stability and Saving are still low. You are interested in wealth-building, but your foundation needs more protection.

**Strengths:**
- Long-term wealth mindset
- Comfort with investing and growth ideas

**Growth areas:**
- Strengthen spending control
- Build a reliable saving foundation
- Reduce risk from weak stability habits

#### The Wealth Architect

**Description:** All three coins are strong. You have comprehensive financial mastery and are ready for more advanced optimization challenges.

**Strengths:**
- Balanced financial habits
- Strong saving and investing discipline
- Consistent control across all coins

**Growth areas:**
- Optimize returns and systems
- Keep habits consistent
- Protect and compound your momentum

#### The Strategist

**Description:** Your Stability and Investing coins are strong, but Saving is still developing. You have control and long-term ambition, but need a stronger cash buffer to support your wealth-building strategy.

**Strengths:**
- Strong spending control
- Long-term wealth mindset
- Ability to think strategically about money

**Growth areas:**
- Build a consistent saving rhythm
- Create a stronger emergency buffer
- Balance investing ambition with short-term liquidity

#### The Opportunist

**Description:** Your Saving and Investing coins are strong, but Stability is low. You are growth-oriented and willing to take action, but your financial foundation needs more control.

**Strengths:**
- Strong growth mindset
- Momentum in saving and investing

**Growth areas:**
- Improve stability and spending control
- Reduce foundation risk
- Balance opportunity with consistency

### Profile Evolution

#### How Profiles Evolve

Profiles automatically update as coin states change:

```
Example Journey:
Week 1: "The Survivor" (all coins Level 0–1)
  ↓ (completing stability challenges)
Week 2: "The Stabilizer" (Stability Level 2, others Level 0–1)
  ↓ (completing saving challenges)
Week 3: "The Builder" (Stability Level 3, Saving Level 2, Investing Level 0–1)
  ↓ (maintaining streaks, progressing)
Week 4: "The Emerging Architect" (all coins Level 2+)
```

#### Profile Update Notifications

When a profile evolves:

1. **Profile Change Alert** — "You've evolved to 'The Builder'!"
2. **Description Update** — New profile description explains the identity
3. **Challenge Refresh** — New challenges matching new profile
4. **Celebration** — Visual celebration of transformation

#### Profile Descriptions

Each profile includes:

- **Identity Statement** — "You're now financially stable and saving consistently"
- **Strength Recognition** — "Your spending control is excellent"
- **Growth Opportunity** — "Next: Build your investing confidence"
- **Next Challenge Type** — Suggest next profile to unlock

### Profile Psychology

#### Why Profiles Matter

1. **Identity-Based Behavior Change** — People change behavior to match their identity
2. **Emotional Engagement** — Users feel personally invested in their profile
3. **Clear Progression** — Visible path from "Survivor" to "Wealth Architect"
4. **Motivation** — Next profile becomes tangible goal to reach
5. **Recognition** — Celebrates financial transformation

#### Profile Names vs. Titles

Profiles use **character-like names** (The Stabilizer, The Builder) rather than scores because:

- More relatable and memorable
- Create emotional attachment
- Feel like personal growth, not grades
- Allow for nuanced descriptions
- Empower identity transformation

---

## Challenge System

### Overview

Challenges are the **behavioral engine** of CoinStack.

Each challenge:
- Takes **< 3 minutes** to complete
- Targets **one specific behavior**
- Modifies **one or more coin metrics**
- Connects to **relevant insight**
- Provides **immediate feedback**

### Challenge Design Philosophy

#### Principles

1. **Bite-Sized** — Small enough to fit any schedule
2. **Actionable** — User can complete within the session
3. **Personalized** — Matched to user's current coin levels and profile
4. **Feedback-Rich** — User sees impact immediately
5. **Progressive** — Difficulty increases with user progress

#### What Makes a Good Challenge

✅ **Good Challenges:**
- "Track your spending for 2 hours and note 3 categories"
- "Save $10 from tomorrow's lunch budget"
- "Research one investment option you've heard about"
- "Identify one recurring subscription you don't use"

❌ **Bad Challenges:**
- "Learn about investing" (too vague, not actionable)
- "Save $500" (unrealistic for most users)
- "Read an article" (passive, not behavioral)
- "Think about your financial goals" (not measurable)

### Challenge Categories

#### Stability Challenges

**Purpose:** Build financial awareness and spending control

**Examples:**
- Spending awareness (identify where money goes)
- Impulse control (resist one unplanned purchase)
- Debt conversation (understand payment schedule)
- Budgeting basics (set category limits)
- Account monitoring (review account)
- Expense audit (list major categories)

**Impact:** ⚖️ Stability Coin increases

#### Saving Challenges

**Purpose:** Build saving habits and consistency

**Examples:**
- Save small amount ($5–$25)
- No-spend challenge (full day)
- Saving streak (maintain daily saving)
- Emergency fund target (work toward goal)
- Spending swap (save instead of regular purchase)
- Side income (identify money source)

**Impact:** 🟢 Saving Coin increases

#### Investing Challenges

**Purpose:** Build investing knowledge and participation

**Examples:**
- Investing awareness (learn one concept)
- Investment simulation (pretend to invest)
- Research challenge (find one investment option)
- Mindset challenge (think long-term)
- Risk understanding (assess risk tolerance)
- Investing goal (define long-term target)

**Impact:** 📈 Investing Coin increases

#### Mindset Challenges

**Purpose:** Shift financial psychology and habits

**Examples:**
- Identity reflection (relate to "The Stabilizer")
- Financial gratitude (appreciate what you have)
- Goal visualization (imagine financial success)
- Behavior reflection (understand spending triggers)
- Success celebration (recognize progress)
- Accountability check (review last week)

**Impact:** Multiple coins, varies by challenge

### Challenge Structure

Each challenge contains:

```
{
  "id": "challenge_001",
  "title": "Identify Your Biggest Expense",
  "description": "Spend 2 minutes identifying your largest 
                  monthly expense and why you spend it.",
  "category": "Stability",
  "coinImpact": ["Stability"],
  "targetUser": ["All", "LowStability"],
  "difficulty": "Easy",
  "duration": "2 minutes",
  "action": {
    "type": "TextInput",
    "prompt": "What's your largest monthly expense?",
    "validation": "Required"
  },
  "reward": {
    "coinPoints": 10,
    "streakPoints": 5,
    "celebrationText": "Great awareness! Knowing your biggest 
                        expense is the first step to control."
  },
  "linkedInsight": "insight_001_largest_expense",
  "followUp": "optional_secondary_challenge"
}
```

#### Challenge Properties

| Property | Example | Purpose |
|---|---|---|
| **Title** | "Identify Your Biggest Expense" | Clear, action-focused |
| **Description** | "Find your single largest monthly expense" | Explains without being overwhelming |
| **Category** | Stability / Saving / Investing / Mindset | Determines coin impact |
| **Difficulty** | Easy / Medium / Hard | Scales with user progress |
| **Duration** | < 3 minutes | Sets expectation |
| **Action Type** | Text input, Yes/No, Quiz, Reflection | Interaction method |
| **Coin Impact** | Affects which coins | Direct behavioral mapping |
| **Reward** | Coin points + streak points | Immediate positive feedback |
| **Linked Insight** | Contextual learning prompt | Supports understanding |

### Challenge Sequencing

#### Progressive Difficulty

Users progress through challenges in waves:

**Phase 1 — Awareness (Days 1–7)**
- Easy challenges focused on understanding
- Stability and awareness emphasis
- Goal: Build foundation

**Phase 2 — Control (Days 8–20)**
- Medium challenges focused on behavior change
- Spending reduction and saving initiation
- Goal: Establish new habits

**Phase 3 — Growth (Days 21–30)**
- Medium-Hard challenges focused on expansion
- Investing introduction and goal-setting
- Goal: Solidify identity transformation

#### Personalization Algorithm

Challenges are selected based on:

1. **Current Coin Levels** — Low-level coins get more challenges
2. **User Profile** — Specific profiles get targeted challenges
3. **Active Streaks** — Streaks influence difficulty and type
4. **Historical Performance** — Harder challenges if user consistently succeeds
5. **Recent Challenges** — Avoid repeating same challenge type 3 days in a row

**Example:**
```
User: High Stability (Level 4), Low Saving (Level 1)
→ System selects Saving challenges
→ Difficulty: Easy to Medium (building new habit)
→ Type: Simple save action ($5–$10)
→ Next: Link to savings insight

User: Low Stability (Level 1), Low Saving (Level 1)
→ System selects Stability challenge
→ Difficulty: Easy (basic awareness)
→ Type: Spending tracking task
→ Next: Link to awareness insight
```

### Challenge Completion Flow

```
1. User opens app
   ↓
2. Challenge presented with title, description, action
   ↓
3. User completes action (input text, answer question, etc.)
   ↓
4. System validates completion
   ↓
5. Reward displayed (coins +10, streak +1)
   ↓
6. Celebration animation
   ↓
7. Linked insight offered: "Want to understand this better?"
   ↓
8. Optional: Read insight card
   ↓
9. Profile/coin status updated
   ↓
10. Return to dashboard or next action
```

---

## Insight System

### Overview

Insights are **contextual educational cards** connected directly to challenges.

Insights are:
- Short (200–300 words max)
- Actionable (include concrete tips)
- Personalized (matched to user behavior)
- Non-overwhelming (never forced, always optional)

### Insight Purpose

1. **Explain the "Why"** — Help user understand why challenge matters
2. **Reinforce Understanding** — Support long-term behavior change
3. **Provide Context** — Connect behavior to financial concepts
4. **Offer Alternatives** — Suggest additional resources or actions
5. **Motivate Progress** — Celebrate behavior and its benefits

### Insight Structure

Each insight contains:

```
{
  "id": "insight_001",
  "title": "Why Tracking Spending Matters",
  "category": "Awareness",
  "relatedChallenge": "challenge_001",
  "coinFocus": "Stability",
  "difficulty": "Beginner",
  "sections": [
    {
      "type": "explanation",
      "content": "Most people don't realize where their money 
                  goes. Spending tracking creates awareness, 
                  which is the foundation of change."
    },
    {
      "type": "practical_tip",
      "title": "Quick Start",
      "content": "Spend 5 minutes this week listing your 
                  top 5 spending categories and amounts."
    },
    {
      "type": "behavioral_insight",
      "title": "Why This Works",
      "content": "Awareness triggers change. Once you see 
                  where money goes, behavior naturally shifts."
    }
  ],
  "relatedInsights": ["insight_002", "insight_003"],
  "callToAction": "Try this tip today"
}
```

### Insight Categories

#### 1. Behavioral Insights

**Purpose:** Explain psychological reasons for money behavior

**Examples:**
- "Why Impulse Spending Happens (And How to Stop It)"
- "The Psychology of Saving: Building Consistency"
- "Loss Aversion: Why We Avoid Investing"

**Structure:**
- Explain the behavior psychology
- Normalize the feeling
- Provide practical solution

#### 2. Concept Insights

**Purpose:** Teach fundamental financial concepts

**Examples:**
- "What Is a Debt-to-Income Ratio?"
- "Emergency Funds: Why You Need 3–6 Months"
- "Compound Interest: How Money Grows"

**Structure:**
- Simple definition
- Real-world example
- Application to user's situation

#### 3. Action Insights

**Purpose:** Provide practical steps for implementation

**Examples:**
- "3 Steps to Track Your Spending This Week"
- "How to Set Up Automatic Savings"
- "Start Investing With Just $10"

**Structure:**
- Step-by-step instructions
- Common mistakes to avoid
- Quick-win suggestions

#### 4. Motivational Insights

**Purpose:** Inspire and reinforce progress

**Examples:**
- "Your First 7 Days: What's Happening to Your Brain"
- "30-Day Transformation Stories"
- "From 'The Survivor' to 'The Builder': Your Journey"

**Structure:**
- Celebration of progress
- Scientific backing
- Forward momentum

### Insight Personalization

Insights are personalized based on:

1. **User's Current Coins** — Content reflects their situation
2. **User's Profile** — Language and examples match identity
3. **Challenge Just Completed** — Immediately relevant
4. **Historical Interactions** — Show new insights, avoid repeats
5. **Learning Level** — Adjust complexity based on progress

**Example:**

User: "The Survivor" (Low all coins)
- Insight tone: Encouraging, foundational
- Examples: Relatable beginner scenarios
- Complexity: Simplified financial concepts

User: "The Wealth Architect" (High all coins)
- Insight tone: Sophisticated, strategy-focused
- Examples: Advanced financial scenarios
- Complexity: Nuanced financial concepts

### Insight Delivery

#### When Insights Are Offered

1. **After Challenge Completion** (Primary)
   - Optional prompt: "Want to understand this better?"
   - User can decline and continue

2. **In Profile Section** (Secondary)
   - Insights organized by category
   - Browsable library of all past insights

3. **Via Notifications** (Tertiary)
   - 1–2 times per week
   - Not intrusive, opt-in recommended

#### Insight Engagement Metrics

Track:
- % of users who view insights
- Time spent on insights
- Correlation between insight consumption and behavior change
- Most useful insight types

---

## Onboarding System

### Overview

The onboarding process has **2 phases**:

1. **Phase 1 — Behavioral Quiz** (5–7 minutes)
2. **Phase 2 — Financial Snapshot** (3–5 minutes)

Total onboarding: **10–12 minutes**

### Phase 1: Behavioral Personality Quiz

#### Purpose

- Detect and classify financial behaviors
- Determine initial coin levels
- Create initial financial profile
- Personalize challenge journey
- Engage user in self-discovery

#### Design Approach

**Gamified, not corporate:**
- ✅ Feels like a personality assessment
- ✅ Scenario-based, not questionnaire-style
- ✅ Visually engaging with progress indicator
- ✅ Fun, relatable language
- ❌ No spreadsheet, forms, or boring fields

#### Quiz Structure

**Format:** 10 scenario-based questions

Each question:
- Presents a relatable financial scenario
- Offers 4 multiple choice answers
- Scored with hidden behavioral points
- Takes 30–40 seconds per question

#### Questions & Scoring

See **Section: Quiz-Based Behavioral Analysis** for complete quiz details, including all 10 questions, answer options, scoring, and coin calculation logic.

#### Quiz Flow

```
1. Welcome screen: "Discover Your Financial Personality"
   ↓
2. Visual progress indicator (shows 10 questions)
   ↓
3. Questions 1–10 presented one at a time
   Each question: scenario + 4 answers
   ↓
4. Real-time progress feedback (e.g., "Question 3 of 10")
   ↓
5. After Q10: "Processing your profile..."
   Animation/transition
   ↓
6. Results screen (move to Phase 2)
```

### Phase 2: Financial Snapshot

#### Purpose

- Collect numerical financial data
- Initialize coin system with baseline metrics
- Establish financial context
- Calibrate challenge difficulty

#### Design Approach

**Simple, essential only:**
- ✅ Only 4–5 key questions
- ✅ Number input fields (not text)
- ✅ Clear explanations for each field
- ✅ Validation feedback
- ✅ Optional fields clearly marked

#### Questions

| # | Question | Field Type | Purpose | Required? |
|---|---|---|---|---|
| 1 | "What's your approximate monthly income?" | Number | Debt/saving/investing calculations | Yes |
| 2 | "Total outstanding debt?" | Number | Stability coin metric | Yes |
| 3 | "How much do you save monthly?" | Number | Saving coin metric | Yes |
| 4 | "How much do you invest monthly?" | Number | Investing coin metric | Yes |
| 5 | "How often do you track expenses?" | Dropdown (Never/Sometimes/Regularly) | Awareness score | Yes |

#### Snapshot Flow

```
1. "Let's Set Your Baseline"
   ↓
2. Monthly Income input (required)
   Validation: Must be > 0
   Explanation: "This helps us personalize your challenges"
   ↓
3. Total Debt input (required)
   Validation: Can be 0
   Explanation: "Understanding debt helps prioritize stability"
   ↓
4. Monthly Savings input (required)
   Validation: Can be 0, but displayed if 0
   Explanation: "Even small amounts count"
   ↓
5. Monthly Investments input (required)
   Validation: Can be 0
   Explanation: "Let us know if you're just getting started"
   ↓
6. Expense Tracking dropdown (required)
   Options: Never / Sometimes / Regularly
   ↓
7. Review screen: "Your Profile" preview
   Shows calculated coins and profile name
   ↓
8. "Complete Onboarding" button
   ↓
9. Profile revealed with full details
```

### Post-Onboarding: Profile Reveal

#### What User Sees

```
═══════════════════════════════════════════════════════════
                     YOUR FINANCIAL PROFILE
═══════════════════════════════════════════════════════════

⚖️  Stability Coin → Level 2: "Improving"
   You're building spending awareness. Next: Strengthen control.

🟢  Saving Coin → Level 1: "Beginner Saver"
   You're taking first steps. Next: Build consistency.

📈  Investing Coin → Level 0: "Curious"
   You're interested but haven't started yet.

───────────────────────────────────────────────────────────
               Profile: "The Emerging Builder"
───────────────────────────────────────────────────────────

Your financial identity: You're stabilizing your spending
and starting to save. With consistency, you'll become a
true wealth builder.

Strengths: Growing awareness, starting to save
Next Focus: Reduce impulse spending, build investing knowledge

═══════════════════════════════════════════════════════════

              [Start Your First Challenge] →
```

#### Next Steps

After profile reveal:

1. **Congratulations Screen** — Celebrate profile creation
2. **Profile Explanation** — What the profile means
3. **CTA to First Challenge** — "Ready to start?"
4. **Optional Insight** — Intro insight about their profile
5. **Dashboard Access** — Full app access enabled

---

## Quiz-Based Behavioral Analysis

### Strategic Rationale

#### Why Quiz-Based MVP?

1. **Faster MVP Validation**
   - Validate behavior change mechanics before banking integration
   - Test gamification and retention without infrastructure complexity
   - Launch 3–6 months faster than Plaid-integrated version

2. **Reduced Onboarding Friction**
   - Users hesitant to share banking credentials
   - Quiz builds trust progressively
   - Lower friction = higher conversion = faster user acquisition

3. **Progressive Plaid Transition**
   - Quiz establishes behavioral baseline
   - Plaid later enhances accuracy
   - Seamless upgrade path without re-onboarding

#### How Quiz Simulates Plaid Analysis

The quiz is designed to approximate financial analysis that Plaid would later automate:

| Metric | What Plaid Would Calculate | How Quiz Approximates |
|---|---|---|
| Debt Ratio | Analyze debt accounts in real-time | Self-reported debt + income + debt stress questions |
| Spending Volatility | Track transaction variation | Impulse spending + end-of-month balance questions |
| Saving Consistency | Analyze transfer frequency | Saving frequency + consistency questions |
| Investment Activity | Track investment transactions | Investment participation + amount questions |
| Financial Awareness | Behavioral patterns | Spending awareness + tracking behavior questions |

---

### Complete 10-Question Quiz

#### Question 1: Monthly Money Situation

**Prompt:**
> "Which best describes your monthly money situation?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | I struggle to cover basic needs | 0 | High financial pressure |
| B | I manage but have no extra | 1 | Tight budget, minimal cushion |
| C | I usually have money left | 2 | Comfortable, some surplus |
| D | I feel financially comfortable | 3 | Strong financial cushion |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures baseline financial pressure
- Indicates income-to-expense ratio
- Reveals overall financial resilience

**Hidden Scoring:**
- Used to calculate **Debt Score** component
- Higher answer = higher stability baseline

---

#### Question 2: End of Month State

**Prompt:**
> "At the end of the month, you usually…"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | Run out of money early | 0 | Severe overspending |
| B | Reach almost zero | 1 | Just barely managing |
| C | Still have a little left | 2 | Some control |
| D | Have significant money left | 3 | Strong spending control |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures month-end financial state
- Indicates spending discipline
- Reveals cash flow management

**Hidden Scoring:**
- Used to calculate **Spending Control Score**
- Also informs **End-of-Month Balance** sub-metric

---

#### Question 3: Impulse Spending

**Prompt:**
> "You see something you didn't plan to buy. What usually happens?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | I buy it immediately | 0 | High impulse control issues |
| B | I often end up buying it | 1 | Weak impulse control |
| C | I think before buying | 2 | Moderate impulse control |
| D | I rarely buy impulsively | 3 | Strong impulse control |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures impulse control strength
- Indicates discipline level
- Reveals spending decision-making

**Hidden Scoring:**
- Primary input to **Impulse Control Score**
- Critical stability metric
- Determines challenge difficulty around spending control

---

#### Question 4: Financial Awareness

**Prompt:**
> "How aware are you of where your money goes?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | I honestly don't know | 0 | No spending visibility |
| B | I have a rough idea | 1 | Vague awareness |
| C | I check sometimes | 2 | Periodic monitoring |
| D | I clearly track my spending | 3 | Detailed awareness |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures expense tracking behavior
- Indicates financial visibility
- Reveals money management awareness

**Hidden Scoring:**
- Used to calculate **Awareness Score**
- Determines personalization (awareness challenges if low)

---

#### Question 5: Debt Situation

**Prompt:**
> "Which best describes your current debt situation?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | My debt feels overwhelming | 0 | Severe debt stress |
| B | I have debt I struggle with | 1 | Moderate debt pressure |
| C | I have manageable debt | 2 | Controlled debt |
| D | I have no debt | 3 | Debt-free |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures subjective debt stress
- Indicates financial stability perception
- Reveals emotional financial state

**Hidden Scoring:**
- Combined with self-reported debt amount (Phase 2)
- Used to calculate **Debt Score** (primary stability metric)

---

#### Question 6: Budgeting Behavior

**Prompt:**
> "Do you follow a budget?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | Never | 0 | No budgeting structure |
| B | Sometimes | 1 | Inconsistent budgeting |
| C | Often | 2 | Regular budgeting attempts |
| D | Consistently | 3 | Strong budgeting habit |

**Coin Impact:** ⚖️ Stability

**Behavioral Meaning:**
- Measures budgeting discipline
- Indicates planning orientation
- Reveals spending structure

**Hidden Scoring:**
- Used to calculate **Spending Control Score**
- Informs challenge personalization (budgeting challenges if low)

---

#### Question 7: Saving Behavior

**Prompt:**
> "When you receive money (paycheck, bonus, gift), what usually happens first?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | I spend most of it | 0 | No saving priority |
| B | I save only if possible | 1 | Saving is afterthought |
| C | I usually save a part | 2 | Saving is habit |
| D | I save before spending | 3 | Saving is priority |

**Coin Impact:** 🟢 Saving

**Behavioral Meaning:**
- Measures saving priority
- Indicates financial discipline
- Reveals money mindset

**Hidden Scoring:**
- Primary input to **Saving Behavior** metric
- Determines saving coin level directly
- Informs whether user is "saver-first" or "spender-first"

---

#### Question 8: Saving Consistency

**Prompt:**
> "How often do you save money?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | Never | 0 | No saving habit |
| B | Occasionally | 1 | Sporadic saving |
| C | Most months | 2 | Regular saving |
| D | Every month | 3 | Consistent saving |

**Coin Impact:** 🟢 Saving

**Behavioral Meaning:**
- Measures saving consistency
- Indicates habit repetition
- Reveals saving frequency

**Hidden Scoring:**
- Used to calculate **Saving Consistency Score**
- Combined with monthly savings amount (Phase 2)
- Determines saving coin level

---

#### Question 9: Investing Exposure

**Prompt:**
> "Which best describes your relationship with investing?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | I never invest | 0 | No investing behavior |
| B | I'm curious but haven't started | 1 | Interested but hesitant |
| C | I invest occasionally | 2 | Some investing activity |
| D | I invest regularly | 3 | Active investing |

**Coin Impact:** 📈 Investing

**Behavioral Meaning:**
- Measures investing participation
- Indicates investing maturity
- Reveals comfort level with investing

**Hidden Scoring:**
- Primary input to **Investment Participation** metric
- Determines investing coin level
- Informs whether challenges focus on education or optimization

---

#### Question 10: Financial Mindset

**Prompt:**
> "When thinking about money, what matters most to you right now?"

**Answer Options:**

| Option | Text | Points | Meaning |
|--------|------|--------|---------|
| A | Surviving month-to-month | 0 | Survival mindset |
| B | Spending without stress | 1 | Comfort-focused mindset |
| C | Building savings security | 2 | Security-focused mindset |
| D | Growing long-term wealth | 3 | Growth-focused mindset |

**Coin Impact:** 📈 Investing

**Behavioral Meaning:**
- Measures long-term financial thinking
- Indicates growth vs. survival orientation
- Reveals financial ambition level

**Hidden Scoring:**
- Used to calculate **Investing Awareness** metric
- Indicates mindset maturity
- Determines whether user is ready for wealth-building challenges

---

### Coin Calculation System

#### ⚖️ Financial Stability Coin Calculation

**Questions Used:** Q1–Q6

**Maximum Score:** 6 × 3 = 18 points

**Calculation:**

```
Debt Score = (Q5 Answer Points × 1.0) + (Q1 Answer Points × 0.5)
Range: 0–15

Spending Control Score = (Q3 Answer Points × 1.0) 
                        + (Q2 Answer Points × 0.8) 
                        + (Q6 Answer Points × 0.7)
Range: 0–25

Awareness Score = (Q4 Answer Points × 1.0)
Range: 0–3

Stability Raw Score = (Debt Score / 15 × 100 × 0.4) 
                    + (Spending Control / 25 × 100 × 0.35) 
                    + (Awareness / 3 × 100 × 0.25)

Final Range: 0–100
```

**Level Conversion:**

| Score Range | Level | Description |
|---|---|---|
| 0–10 | 0 | Financial Chaos |
| 11–20 | 1 | Unstable |
| 21–40 | 2 | Improving |
| 41–60 | 3 | Controlled |
| 61–80 | 4 | Strong Stability |
| 81–100 | 5 | Highly Stable |

---

#### 🟢 Saving Coin Calculation

**Questions Used:** Q7, Q8

**Maximum Score:** 2 × 3 = 6 points

**Calculation:**

```
Saving Priority Score = Q7 Answer Points
Range: 0–3

Saving Consistency Score = Q8 Answer Points
Range: 0–3

Saving Raw Score = (Saving Priority / 3 × 100 × 0.5) 
                 + (Saving Consistency / 3 × 100 × 0.5)

Final Range: 0–100
```

**Note:** Monthly savings amount from Phase 2 will adjust final score

**Level Conversion:**

| Score Range | Level | Description |
|---|---|---|
| 0 | 0 | No Saving |
| 1–20 | 1 | Beginner Saver |
| 21–40 | 2 | Inconsistent Saver |
| 41–60 | 3 | Regular Saver |
| 61–80 | 4 | Strong Saver |
| 81–100 | 5 | Elite Saver |

---

#### 📈 Investing Coin Calculation

**Questions Used:** Q9, Q10

**Maximum Score:** 2 × 3 = 6 points

**Calculation:**

```
Investment Participation Score = Q9 Answer Points
Range: 0–3

Investment Mindset Score = Q10 Answer Points
Range: 0–3

Investing Raw Score = (Investment Participation / 3 × 100 × 0.5) 
                    + (Investment Mindset / 3 × 100 × 0.5)

Final Range: 0–100
```

**Note:** Monthly investment amount from Phase 2 will adjust final score

**Level Conversion:**

| Score Range | Level | Description |
|---|---|---|
| 0 | 0 | No Investing |
| 1–20 | 1 | Curious |
| 21–40 | 2 | Beginner Investor |
| 41–60 | 3 | Active Investor |
| 61–80 | 4 | Consistent Investor |
| 81–100 | 5 | Wealth Builder |

---

### Quiz Response Integration with Financial Snapshot

After Phase 2 (Financial Snapshot), coin scores are **re-calculated and refined**:

#### Stability Coin Adjustment

```
Final Stability Score = Base Score 
                      + (Debt Amount / Monthly Income adjustment)
                      + (End-of-month reserve adjustment)

Example:
- Quiz suggests Stability Level 2
- Monthly income: $3,000
- Debt: $15,000
- Debt ratio: 500% (5x monthly income)
→ Adjustment: Reduce stability score
→ Final: Stability Level 1–2 (depending on severity)
```

#### Saving Coin Adjustment

```
Final Saving Score = Base Score 
                   + (Monthly Savings / Income percentage)
                   + (Emergency Fund estimation)

Example:
- Quiz suggests Saving Level 1
- Monthly income: $3,000
- Monthly savings: $300
- Saving rate: 10%
→ Adjustment: Increase saving score
→ Final: Saving Level 2–3 (reflecting actual behavior)
```

#### Investing Coin Adjustment

```
Final Investing Score = Base Score 
                      + (Monthly Investments / Income percentage)

Example:
- Quiz suggests Investing Level 1
- Monthly income: $3,000
- Monthly investments: $150
- Investment rate: 5%
→ Adjustment: Increase investing score
→ Final: Investing Level 2 (reflecting actual behavior)
```

---

### Financial Profile Generation

#### Profile Selection Algorithm

After coin calculations, system selects profile:

```python
has_high_stability = stability_level >= 4
has_high_saving = saving_level >= 4
has_high_investing = investing_level >= 4

if stability_level <= 1 and saving_level <= 1 and investing_level <= 1:
    profile = "The Survivor"
elif has_high_stability and has_high_saving and has_high_investing:
    profile = "The Wealth Architect"
elif has_high_stability and has_high_saving and not has_high_investing:
    profile = "The Builder"
elif not has_high_stability and has_high_saving and has_high_investing:
    profile = "The Opportunist"
elif has_high_stability and not has_high_saving and has_high_investing:
    profile = "The Strategist"
elif has_high_stability and not has_high_saving and not has_high_investing:
    profile = "The Stabilizer"
elif not has_high_stability and has_high_saving and not has_high_investing:
    profile = "The Saver"
elif not has_high_stability and not has_high_saving and has_high_investing:
    profile = "The Investor"
else:
    profile = "The Explorer"
```

#### Profile Output

User sees:

```
═══════════════════════════════════════════════════════════
          "The Emerging Builder" Financial Profile
═══════════════════════════════════════════════════════════

⚖️  Stability: Level 2 — Improving
    You're building financial awareness and gaining control.
    
🟢  Saving: Level 2 — Inconsistent Saver
    You save sometimes, but not consistently yet.
    
📈  Investing: Level 1 — Curious
    You're interested in investing but haven't started.

─────────────────────────────────────────────────────────

What This Means:
You're on the right path! You're stabilizing your spending
and starting to save. Your next big win is building saving
consistency and then exploring investing.

Your Strengths:
✓ Growing financial awareness
✓ Attempting to save regularly
✓ Interested in long-term thinking

Your Growth Area:
→ Build daily saving consistency
→ Reduce impulse spending
→ Learn investing basics

═══════════════════════════════════════════════════════════
```

---

### Challenge Personalization from Quiz Results

Quiz results directly determine initial challenge sequence:

#### Low Stability Users (Level 0–1)

**Receive:**
- Spending awareness challenges (identify where money goes)
- Impulse control challenges (resist unplanned purchases)
- Debt understanding challenges (know debt situation)
- Budgeting foundation challenges (basic budget setup)

**Challenge Order:** Stability → Foundation building before other areas

**Insight Focus:** "Awareness is the first step"

#### High Stability, Low Saving (e.g., Stabilizer)

**Receive:**
- Saving initiation challenges (start saving habit)
- Emergency fund challenges (build financial safety)
- Saving streak challenges (consistency building)
- Then: Investing introduction

**Challenge Order:** Stability (refresh) → Saving → Investing

**Insight Focus:** "You've got control, now build wealth"

#### High Saving, Low Stability (rare but possible)

**Receive:**
- Spending control challenges (reduce excessive caution)
- Stability foundation challenges (debt review if needed)
- Confidence challenges (balanced approach)

**Challenge Order:** Stability (strengthen) → Maintain saving → Investing

#### High Investing, Low Saving (inconsistent saver)

**Receive:**
- Saving foundation challenges (build emergency fund first)
- Saving consistency challenges (regular habit)
- Investing optimization challenges (improve what they're doing)

**Challenge Order:** Saving (stability) → Investing (optimization)

---

### Long-Term Behavioral Intelligence Vision

The quiz is the **foundation** of CoinStack's behavioral intelligence system:

#### Phase 1 (MVP): Quiz-Based Analysis

- User provides behavioral self-assessment via quiz
- System initializes coins and profile
- Challenges personalized to quiz results

#### Phase 2 (3–6 months): Plaid Integration

- Optional bank connection via Plaid
- Real transaction analysis validates quiz
- Coin scores refined based on actual behavior
- Challenges auto-adjust based on real data

#### Phase 3 (6–12 months): Behavioral Prediction

- Machine learning predicts behavior patterns
- Challenges anticipate user needs
- Personalization reaches optimal level
- User experience becomes almost magical

#### Phase 4 (12+ months): Community Intelligence

- Aggregate insights from user cohorts
- Identify successful behavior patterns
- Share anonymized success patterns
- Social features support behavior change

---

## User Flows

### Primary Daily Flow (Quest-Based Journey)

```
1. User opens app
   ↓
2. Dashboard (Home) shows:
   - Current streak (e.g., "Day 15" 🔥)
   - Three coins with current levels
   - Today's quest preview (title + coin type)
   - Quick stats and profile indicator
   - Navigation tabs: [Dashboard] [Journey] [Profile]
   ↓
3. User taps "Journey" tab or "Today's Quest" preview
   ↓
4. Journey Section displays:
   
   PAST QUESTS (scrollable up, grayed out):
   - Day 14: "Identify Your Biggest Expense" ✓
   - Day 13: "Save $10 from Budget" ✓
   
   TODAY'S QUEST (highlighted, centered):
   - Quest title: "Find Your Impulse Trigger"
   - Description: "Identify one unplanned purchase"
   - Coin impact: ⚖️ Stability
   - Duration: "2 minutes"
   - [START QUEST] button
   - OPTIONAL INSIGHT CARD:
     * Title: "Why Impulse Spending Happens"
     * Preview + [▼ EXPAND TO READ]
   
   FUTURE QUESTS (scrollable down, locked):
   - Day 16: "Build Your Emergency Fund" 🔒 Tomorrow
   - Day 17: "Save $25 From Weekly Budget" 🔒 In 2 Days
   ↓
5. Option A: User taps [START QUEST]
   ↓
   5a. Quest completion screen opens:
       - Quest title and action prompt
       - Input field (text, yes/no, multiple choice)
       - Timer: "2 min" estimate
       - User completes action
       ↓
   5b. Submission screen shows:
       - "🎉 Quest Complete!"
       - Coin reward animation (+10 points)
       - Streak +1 animation
       - "Want to understand this better?" (insight offer)
       ↓
   5c. User chooses:
       a) Read insight inline → Expand card → Back to Journey
       b) Skip insight → Return to Journey
       ↓
   5d. Journey auto-updates:
       - Today's quest moves to PAST section
       - Tomorrow's quest appears as TODAY
       - Coins update (if level up, celebration)
       - Profile may evolve

5. Option B: User taps insight preview [▼ EXPAND]
   ↓
   5b. Insight card expands inline:
       - Full insight text (200-300 words)
       - Practical tips section
       - Related concepts
       - [▲ COLLAPSE] button
   ↓
   5c. User reads insight, still in Journey view
   ↓
   5d. User can:
       - Still see [START QUEST] button
       - Return to scrolling past/future quests
       - Collapse and proceed to quest

6. Dashboard auto-updates:
   - Streak increases
   - Coins updated
   - Today's quest refreshed
   - Profile may evolve
   ↓
7. Return to dashboard or browse profile
```

#### Alternative Flow: Direct from Dashboard

```
User can start quest directly from dashboard:

1. Dashboard shows: "Today's Quest: Find Your Impulse Trigger"
   ↓
2. User taps "Start" or quest preview
   ↓
3. Direct to quest completion (skip Journey timeline)
   ↓
4. After completion, can view full Journey if desired
```

### First-Time User Flow

```
1. App download/open
   ↓
2. Welcome screen: "Transform Financial Knowledge Into Habits"
   CTA: "Get Started"
   ↓
3. Phase 1: Behavioral Quiz (10 questions, ~5 min)
   Progress indicator shown
   ↓
4. Phase 2: Financial Snapshot (5 questions, ~3 min)
   Income, debt, savings, investments
   ↓
5. Profile reveal:
   - Coin levels calculated
   - Profile name displayed
   - Profile description
   - Visual celebration
   ↓
6. "Ready for your first challenge?"
   ↓
7. First challenge presented (easy difficulty)
   Related to user's primary growth area
   ↓
8. Challenge completion
   ↓
9. First insight offer
   ↓
10. Full dashboard access granted
   ↓
11. Day 1 complete → motivational message
```

### Return User Flow (Daily)

```
1. User opens app (notification may have prompted)
   ↓
2. Dashboard shows current state:
   - Streak counter prominent (e.g., "Day 15 🔥")
   - Coins and levels
   - Today's quest preview (title + coin type)
   - [Journey] tab visible in navigation
   ↓
3. User chooses:
   
   Option A: Quick Path
   - Tap [Start Quest] directly from dashboard
   - Complete quest (2-3 min)
   - Optional: Read insight
   - Return to dashboard
   
   Option B: Full Journey Path
   - Tap [Journey] tab
   - See full quest timeline
   - Review past quests
   - Preview future locked quests
   - Tap [Start Quest] on today's quest
   - Complete quest
   - Read optional insight inline
   - Return to journey view
   
   Total time: 3–5 minutes
   ↓
4. Streak maintained
   ↓
5. Journey auto-updates with new quest
   ↓
6. Return tomorrow
```

### Streak Loss Flow

```
User missed a day (streak broken)

1. App notification: "You missed your streak!"
   Copy: "Your 15-day streak ended, but you can start fresh today."
   ↓
2. User opens app
   ↓
3. Dashboard shows:
   - Streak counter: "0" (reset)
   - Motivational message
   - Today's easy quest offered
   ↓
4. User navigates to Journey section
   ↓
5. Journey shows:
   - Past quests (grayed out, including yesterday's missed quest)
   - Today's new quest (easy difficulty, encouragement message)
   - Future quests (locked)
   ↓
6. User completes today's quest
   ↓
7. Streak counter: "1" (new streak started)
   Message: "Building your momentum again!"
   Journey updates: yesterday's quest marked as missed, today's moved to past
   ↓
8. Celebration of re-engagement
```

### Coin Level-Up Flow

```
User completes a challenge that pushes coin to next level

1. Challenge completion screen shows:
   - Base reward animation
   - ✨ LEVEL UP! ✨
   - Coin animation (grows, glows, celebrates)
   - "Stability Coin → Level 3!"
   ↓
2. New card appears:
   - "Unlock new challenges at Level 3"
   - Profile may evolve notification
   ↓
3. Optional: Profile evolution animation
   (if applicable)
   ↓
4. User sent to updated dashboard
   ↓
5. Next challenge shows new difficulty
```

### Profile Evolution Flow

```
User's coins trigger profile change

1. User completes challenge
   ↓
2. Coins recalculated
   ↓
3. Profile algorithm checks:
   "Does combination of coins match new profile?"
   ↓
4. If YES:
   Profile evolution screen:
   - "Congratulations!"
   - Old profile: "The Stabilizer"
   - New profile: "The Builder"
   - New profile description
   - What changed (e.g., "Your saving is now Level 3")
   ↓
5. Visual transition animation
   ↓
6. Back to dashboard
   ↓
7. Profile section updated with new identity
```

### Journey Section Flow (Quests Timeline)

**Purpose:** Visualize all challenges as a quest journey showing past completed quests, current quest, and future locked quests.

```
1. User taps "Journey" section from bottom navigation
   ↓
2. Timeline/scroll view displayed showing:
   - PAST QUESTS (completed challenges)
     * Scrollable up (history)
     * Grayed out but visible
     * Shows completion date
     * Optional: Can review past quest & insight
   
   - TODAY'S QUEST (active/current challenge)
     * Prominent, centered position
     * Highlighted with coin-specific color
     * Shows:
       - Quest title and description
       - Estimated duration (2-3 min)
       - Coin impact indicator
       - Action button: "Start Quest"
       - Insight card (optional, collapsible)
         * Related insight preview (title only initially)
         * "Learn More About This" expandable section
         * Quick insight read inline
   
   - FUTURE QUESTS (upcoming, locked)
     * Locked icon/blur effect
     * Preview visible (title, coin type)
     * Unlocks at: "Tomorrow 8 AM" or "Complete X quests"
     * Grayed out appearance
     * Scrollable down
   ↓
3. User interactions on TODAY'S QUEST:
   - Tap "Start Quest" → Open challenge completion flow
   - Tap insight preview → Expand inline insight card
   - Read insight without leaving page
   - Complete quest from this view
   ↓
4. Upon quest completion:
   - Celebration animation
   - Quest moves to PAST section
   - New quest appears as TODAY'S QUEST
   - Profile/coins update
   ↓
5. User can:
   - Browse past quests (scroll up)
   - View upcoming locked quests (scroll down)
   - Review insights from completed quests (tap past quest)
   - Return to dashboard
```

#### Journey Section Visual Layout

```
═══════════════════════════════════════════════════════════
                      JOURNEY
═══════════════════════════════════════════════════════════

[PAST QUESTS - SCROLLABLE UP]

Day 14: "Identify Your Biggest Expense" ✓
        Day 14: Save $10 from Budget ✓
        
Day 13: "Review Spending Awareness" ✓

...scroll up for more history...

─────────────────────────────────────────────────────────

[TODAY'S QUEST - HIGHLIGHTED]

        🎯 TODAY'S QUEST (Day 15)

⚖️  Spending Awareness Challenge

Title: "Find Your Impulse Trigger"

Description: "Identify one unplanned purchase 
you made this week and what triggered it."

Estimated Time: ⏱ 2 minutes
Coin Impact: ⚖️ Stability

[START QUEST →]

─── OPTIONAL INSIGHT ───

📚 Want to understand this better?

"Why Impulse Spending Happens (And How to Stop It)"

[▼ EXPAND TO READ]

(Expanded insight shows full card inline:
 - Explanation of impulse psychology
 - Practical tips
 - Related concepts)

[COLLAPSE ▲]

─────────────────────────────────────────────────────────

[FUTURE QUESTS - LOCKED, SCROLLABLE DOWN]

Day 16: "Build Your Emergency Fund"
        🔒 Unlocks Tomorrow 8 AM

Day 17: "Save $25 From Weekly Budget"
        🔒 Unlocks in 2 Days

Day 18: "Research One Investment Option"
        🔒 Unlocks in 3 Days

...scroll down for more upcoming quests...

═══════════════════════════════════════════════════════════
```

#### Past Quest Interaction

When user taps a completed past quest:

```
1. Past quest card expands
   ↓
2. Shows:
   - Quest title
   - Completion date (e.g., "Completed Day 14")
   - What user submitted (if text-based)
   - Coins earned
   - Associated insight (if available)
   ↓
3. User can:
   - Tap insight to view it again
   - See why this quest was important
   - Return to timeline
```

#### Future Quest Unlock

When user scrolls to see future quests:

```
Locked Quest Card Shows:
- Quest title (preview)
- Coin type (with visual)
- "🔒 Unlocks Tomorrow 8 AM" or "🔒 Unlocks in 3 Days"
- Blur/muted visual effect
- Cannot tap (disabled)

When Unlocked:
- Lock icon disappears
- Card becomes interactive
- Moves up to TODAY'S QUEST position
- User receives notification: "New quest unlocked!"
```

---

### Insight Integration Within Quest Cards

**Key Design Change:** Insights are NOT a separate section. They live inline with quest cards.

#### Where Insights Appear

1. **In Journey Timeline:**
   - Below TODAY'S QUEST
   - Collapsible/expandable section
   - Optional: "Learn More About This"
   - Quick read format (not forcing full read)

2. **In Challenge Completion Flow:**
   - After user completes quest
   - Prompt: "Want to understand why this matters?"
   - Optional: User can read or skip
   - Inline within completion screen

3. **In Past Quest Review:**
   - User taps completed past quest
   - Can view associated insight
   - Historical learning review

#### Insight Card Format (In Quest Context)

```
┌─────────────────────────────────────────┐
│  📚 UNDERSTAND THIS BETTER               │
├─────────────────────────────────────────┤
│                                          │
│  "Why Impulse Spending Happens          │
│   (And How to Stop It)"                 │
│                                          │
│  [▼ EXPAND]                             │
│                                          │
├─────────────────────────────────────────┤
│ EXPANDED VIEW:                           │
│                                          │
│ Most people don't realize they make     │
│ unplanned purchases in emotional states.│
│ Stress, boredom, and excitement trigger │
│ impulse buys. Understanding your        │
│ triggers is the first step to control.  │
│                                          │
│ PRACTICAL TIP:                           │
│ Next time you want to buy something     │
│ unplanned, pause and ask: "Am I        │
│ emotional right now?" This simple       │
│ question creates awareness.             │
│                                          │
│ WHY THIS MATTERS:                        │
│ Awareness precedes change. Once you     │
│ understand WHY you spend, you can       │
│ choose differently.                     │
│                                          │
│ [RELATED: "Building Spending Control"]  │
│                                          │
│ [▲ COLLAPSE]                            │
└─────────────────────────────────────────┘
```

#### Insight Engagement Model

**Optional, Not Forced:**
- Insights are suggested, not mandatory
- User can skip and return to dashboard
- Quick access without leaving quest view
- Can be read anytime (inline within quest)

**Encouraged But Voluntary:**
- Prompt after completion: "Learn more?"
- Visual indicator for new/unread insights
- But never blocks progress
- Never interrupts streak

---

### Why Journey Section Instead of Separate Insights Section

**Benefits:**

1. **Contextual Learning** — Insights directly tied to relevant quest
2. **Reduced Friction** — User doesn't have to navigate to separate section
3. **Narrative Flow** — Quest timeline tells progression story
4. **Engagement** — User sees past progress visually
5. **Anticipation** — Future locked quests build engagement
6. **Habit Reinforcement** — Seeing quest history reinforces consistency

**User Experience:**
- Single destination for all quest-related content
- Insights integrated where relevant
- Clean information architecture
- Encourages journey mindset (progression, not just daily tasks)

---

### Profile Section Flow

```
1. User taps "Profile"
   ↓
2. Profile dashboard shown:
   - Profile name and description
   - Three coins with visual display
   - Coin levels with progress bars
   ↓
3. User can scroll to see:
   - Challenge history
   - Streak history
   - Milestone badges
   - Statistics (total challenges completed, etc.)
   ↓
4. Interactions:
   - Tap coin → see detailed metrics
   - Tap challenge history → see past attempts
   - Tap badges → see achievement info
   ↓
5. Return to dashboard
```

---

## 30-Day Behavioral Journey

### Overall Structure

CoinStack is architected around a **30-day progression model** based on behavioral psychology.

The 30-day journey is divided into **3 phases**:

- **Phase 1 (Days 1–7):** Awareness
- **Phase 2 (Days 8–20):** Control
- **Phase 3 (Days 21–30):** Growth

---

### Phase 1: Awareness (Days 1–7)

#### Goal

Build **financial self-awareness** and establish habit foundation

#### Key Objectives

1. **Understand Current Situation** — Where is money going?
2. **Identify Spending Patterns** — What are biggest expenses?
3. **Build Initial Habit** — Establish daily app interaction
4. **Establish Baseline** — Create mental snapshot of current behavior

#### Focus Areas

**Stability Coin (Primary):**
- Spending awareness challenges
- Expense identification
- Money tracking basics
- Account monitoring introduction

**Secondary:**
- Profile identity building
- Streak establishment
- Gamification introduction

#### Challenge Characteristics

- **Difficulty:** Easy (anyone can complete)
- **Duration:** 2–3 minutes
- **Tone:** Curious, introspective
- **Examples:**
  - "Identify your 3 largest monthly expenses"
  - "Review your last 5 transactions"
  - "List spending categories"
  - "Note one impulse purchase"

#### Coin Progression

- **Stability Coin:** Likely increases from Level 0→1 or 1→2
- **Saving Coin:** Minimal change (observation phase)
- **Investing Coin:** Minimal change (observation phase)

#### Success Metric

User completes 7 consecutive daily challenges (7-day streak)

#### Key Insight Focus

- "Why Spending Awareness Matters"
- "Where Your Money Goes (And Why)"
- "The First Step to Financial Control"

#### Day-by-Day Breakdown

| Day | Challenge Type | Focus | Expected Outcome |
|-----|---|---|---|
| 1 | Spending Review | "List 3 largest expenses" | Awareness |
| 2 | Account Check | "Review last 5 transactions" | Visibility |
| 3 | Category ID | "Identify spending categories" | Pattern Recognition |
| 4 | Impulse Review | "Note 1 unplanned purchase" | Trigger Awareness |
| 5 | Budget Baseline | "Estimate monthly budget" | Planning Introduction |
| 6 | Money Tracking | "Check account balance" | Monitoring |
| 7 | Reflection | "What surprised you about your spending?" | Consolidation |

#### End of Phase 1

- ✅ User has 7-day streak
- ✅ Financial picture is clearer
- ✅ Profile established
- ✅ Habit formation started
- ✅ Stability Coin increased
- ✅ User sees value in app

---

### Phase 2: Control (Days 8–20)

#### Goal

Build **spending control** and introduce **saving habits**

#### Key Objectives

1. **Reduce Impulsive Spending** — Make deliberate choices
2. **Initiate Saving Behavior** — Start consistent saving
3. **Strengthen Stability** — Gain financial control
4. **Build Momentum** — Maintain streak through challenge

#### Focus Areas

**Stability Coin (Primary):**
- Impulse control challenges
- Spending reduction actions
- Budgeting implementation
- Debt awareness

**Saving Coin (Secondary):**
- Save small amounts ($5–$25)
- Build saving frequency
- Emergency fund introduction
- Saving consistency

**Investing Coin (Tertiary):**
- Early exposure (if user is ready)

#### Challenge Characteristics

- **Difficulty:** Medium (requires behavior change)
- **Duration:** 3 minutes
- **Tone:** Encouraging, action-oriented
- **Examples:**
  - "Avoid one unplanned purchase today"
  - "Save $10 from today's spending"
  - "Propose a budget limit for your biggest expense category"
  - "Research one investment option"

#### Coin Progression

- **Stability Coin:** Likely increases from Level 2→3 or 3→4
- **Saving Coin:** Increases from Level 0→1 or 1→2
- **Investing Coin:** Minimal change or introduction (Level 0→1)

#### Success Metric

User maintains 20-day streak while showing behavior change (reduced spending, increased saving)

#### Key Insight Focus

- "How to Build Spending Control"
- "The Psychology of Impulse Spending"
- "Why Saving Consistency Matters"
- "Building Your Emergency Fund"

#### Day-by-Day Breakdown (Sample)

| Days | Challenge Theme | Type | Expected Outcome |
|-----|---|---|---|
| 8–10 | Impulse Control | "Avoid unplanned purchase" (3 days) | Build discipline |
| 11–13 | Saving Initiation | "Save $10 from budget" (3 days) | Create saving habit |
| 14–15 | Budgeting | "Set category limit", "Track spending" | Proactive control |
| 16–17 | Deep Spending Review | "Find money to save", "Identify cuts" | Behavior analysis |
| 18–19 | Consistency Check | "Repeat best challenge", "Maintain streak" | Habit reinforcement |
| 20 | Milestone Celebration | "Reflect on progress" | Consolidation |

#### Mid-Point Check (Day 15)

Around day 15, system checks:

- Are coins increasing?
- Is profile evolving?
- Is user still engaged?

If not:
- Adjust challenge difficulty
- Offer motivational insight
- Celebrate small wins

#### End of Phase 2

- ✅ User has 20-day streak
- ✅ Spending patterns shifted (reduced impulses)
- ✅ Saving habit initiated
- ✅ Stability Coin increased to Level 3+
- ✅ Saving Coin increased to Level 1–2
- ✅ Profile may have evolved (e.g., "Stabilizer" → "Builder")
- ✅ Momentum built (habit psychology says this is critical)

---

### Phase 3: Growth (Days 21–30)

#### Goal

Solidify **identity transformation** and introduce **long-term thinking**

#### Key Objectives

1. **Consolidate Habits** — Make behavior changes stick
2. **Build Wealth Mindset** — Introduce investing
3. **Celebrate Transformation** — Acknowledge evolution
4. **Plan Future** — Create momentum for continued engagement

#### Focus Areas

**Stability Coin (Maintenance):**
- Advanced spending control
- Debt optimization (if applicable)
- Habit consolidation

**Saving Coin (Growth):**
- Increase saving amounts
- Emergency fund target
- Saving goal setting
- Consistency reinforcement

**Investing Coin (Primary):**
- Investing basics introduction (if not done)
- Investment simulation
- Long-term planning
- Risk tolerance assessment
- Wealth-building mindset

#### Challenge Characteristics

- **Difficulty:** Medium-Hard (habit changes now expected)
- **Duration:** 3 minutes
- **Tone:** Ambitious, forward-looking
- **Examples:**
  - "Increase savings by 5% for next month"
  - "Research 3 investment options"
  - "Set a 1-year savings goal"
  - "Learn one investing concept"
  - "Create a wealth-building plan"

#### Coin Progression

- **Stability Coin:** Maintains or increases (Level 3→4+)
- **Saving Coin:** Increases (Level 1–2 → 2–3+)
- **Investing Coin:** Primary growth (Level 0–1 → 1–2+)

#### Success Metric

User completes 30-day streak with visible behavior transformation

#### Key Insight Focus

- "Your 30-Day Transformation"
- "Building Wealth Over Time"
- "The Power of Compound Saving"
- "Getting Started With Investing"
- "Identity-Based Financial Change"

#### Day-by-Day Breakdown (Sample)

| Days | Challenge Theme | Type | Expected Outcome |
|-----|---|---|---|
| 21–22 | Celebration | "Celebrate 20-day milestone", "Reflect on changes" | Psychological reinforcement |
| 23–24 | Investing Intro | "Learn investing concept", "Research option" | Growth mindset |
| 25–26 | Goal Setting | "Set savings goal", "Define wealth target" | Future orientation |
| 27–28 | Advanced Control | "Increase savings % ", "Advanced budgeting" | Habit maturity |
| 29 | Identity Check | "Review your profile evolution" | Self-awareness |
| 30 | Celebration | "30-Day Transformation Complete" | Closure and momentum |

#### Day 30 Celebration

When user completes Day 30:

```
═══════════════════════════════════════════════════════════
           🎉 30-Day Challenge Complete! 🎉
═══════════════════════════════════════════════════════════

You did it! You've completed 30 consecutive days of 
building better financial habits.

YOUR TRANSFORMATION:

Profile Evolution:
  "The Survivor" → "The Emerging Builder"
  
Coin Progress:
  ⚖️  Stability: Level 0 → Level 3 (+3 levels)
  🟢  Saving: Level 0 → Level 2 (+2 levels)
  📈  Investing: Level 0 → Level 1 (+1 level)

Behavior Changes:
  ✓ Spending down 25% from baseline
  ✓ Saving $150+ per month
  ✓ Financial awareness increased
  ✓ Researched first investment option

═══════════════════════════════════════════════════════════

What's Next?

Your habit is now automatic. You've built a 30-day 
foundation. The next phase is optimization.

Continue your journey:
[Continue Streak] [Explore Premium Challenges]

═══════════════════════════════════════════════════════════
```

#### Post-Day 30 Engagement

After day 30, app shifts to:

1. **Maintenance Mode** — Challenges become optimization-focused
2. **Advanced Content** — Deeper financial topics
3. **Premium Opportunities** — Premium tier unlocked if wanted
4. **Long-term Goals** — Focus shifts to 90-day, 6-month, 1-year goals
5. **Community (Future)** — Social features if implemented

---

## Streak System

### Overview

Streaks are the **consistency engine** of CoinStack.

A streak is: **Number of consecutive days user completes their daily challenge**

### Streak Mechanics

#### How Streaks Work

```
Day 1: User completes challenge → Streak = 1
Day 2: User completes challenge → Streak = 2
Day 3: User completes challenge → Streak = 3
...
Day 15: User completes challenge → Streak = 15
Day 16: User MISSES challenge → Streak = 0 (reset)
Day 17: User completes challenge → Streak = 1 (new streak)
```

#### Streak Window

- **Daily Window:** Challenge can be completed anytime during day (midnight to 11:59 PM)
- **Timezone:** Uses user's local timezone
- **No Grace Period:** Challenge must be completed within calendar day

#### Streak Preservation

**Important Design Decision:** If user misses ONE day:
- Streak resets to 0
- User can immediately start new streak next day
- No penalty beyond streak loss

**Rationale:**
- All-or-nothing approach builds discipline
- Psychological incentive to maintain consistency
- Real habit formation psychology

### Streak Visibility

#### Dashboard Display

```
HOME DASHBOARD

        Day 15 🔥
         STREAK

    ⚖️ Stability (L3)  🟢 Saving (L2)  📈 Investing (L1)

    [TODAY'S CHALLENGE: "Save $10 from lunch budget"]
```

#### Persistent Display

- Streak counter shown on home dashboard (primary location)
- Visible in header/top bar at all times
- Counts down in notifications (if sent)

#### Visual Indicators

- **Flame Icon 🔥** — Active streak (psychological indicator of "heat")
- **Number Count** — Current streak day
- **Milestone Badges** — Special icons at milestones (7, 14, 21, 30, 60, 90 days)

### Streak Milestones

**Key Milestones & Rewards:**

| Days | Milestone | Celebration | Reward |
|---|---|---|---|
| 7 | Week Winner | 🎉 "First Week!" | Coin bonus +10 |
| 14 | Halfway to Habit | "Two Weeks Strong!" | Challenge unlock |
| 21 | Habit Formed | "Habit Now Automatic!" | Special insight |
| 30 | First Month | 🏆 "30-Day Champion!" | Profile unlock, badge |
| 60 | Two Months | "Unstoppable!" | Premium feature trial |
| 90 | Three Months | 🏅 "True Habit Master!" | Special profile unlock |

#### Celebration Flow

When user reaches milestone:

```
1. Challenge completion screen adds:
   
   MILESTONE REACHED! 🎉
   
   "You've completed 30 consecutive days!"
   
   Special Reward:
   [Unlock New Profile Feature]
   
2. Notification sent: "30-Day Milestone!"
3. Special badge added to profile
4. Celebration animation plays
```

### Streak Loss & Recovery

#### Losing a Streak

When user doesn't complete challenge for a day:

**Next Day:**
1. App opens normally
2. Dashboard shows: "Streak Reset 😢"
3. Motivational message: "Your 15-day streak ended, but building momentum again is easier than you think. Let's start a new one."
4. Today's challenge offered (slightly easier difficulty)
5. No shame, just reset and restart

#### Recovery Flow

**Day After Streak Loss:**

```
1. Dashboard shows:
   
   Streak Reset 😢
   
   But You Have Momentum!
   Your habits are still strong. One missed day 
   doesn't erase 15 days of progress.
   
   Start Fresh Today 💪
   
   [Today's Challenge]
   
2. Challenge is slightly easier (to encourage completion)
3. Completion resets streak counter to 1
4. Notification: "New streak started! You've got this 🔥"
```

#### Psychological Design

- **No Shame Messaging** — Avoids guilt or self-criticism
- **Emphasis on Momentum** — Habits are still built, just restart
- **Quick Reset** — One day to get back to form
- **Encouragement** — Motivational tone, not punitive

### Streak Notifications

#### Timing

**Evening Reminder (Optional, Opt-In):**
- Sent at 8 PM user's local time
- Only if challenge not yet completed
- Copy: "Don't break your [X]-day streak! Complete today's challenge."

**Morning Motivation (Optional, Opt-In):**
- Sent at 8 AM user's local time
- Positive, not pushy
- Copy: "Ready for Day 15? Your challenge awaits."

**Streak Milestone (Automatic):**
- Sent immediately when milestone reached
- Celebratory tone
- Copy: "🎉 30-Day Streak! You're incredible!"

#### Notification Philosophy

- Reminders encourage but don't shame
- Notifications respect user preferences
- Emphasis on identity and progress, not obligation

---

## Monetization Strategy

### Free Tier

**Price:** Free (freemium model)

**Included Features:**
- Daily challenges (one per day)
- Basic streak tracking
- 3-coin system and profiles
- Limited insights (introductory cards)
- Challenge history
- Basic profile section
- Onboarding quiz and financial snapshot

**Limitations:**
- Limited challenge variety (20–30 core challenges in rotation)
- No advanced personalization
- No premium insights
- No advanced analytics
- No Plaid integration (future)

**Target User:** Casual users testing if habit-building works

**Retention Goal:** 15–20% retention to paid tiers

### Premium Tier

**Price:** $5/month (or $45/year billed annually)

**Added Features:**
- Unlimited challenge variety (100+ challenges)
- Advanced personalization algorithm
- Premium insights (deeper, contextual learning)
- Challenge difficulty selection (easy, medium, hard)
- Advanced streak features (pause streak without loss, 1x/month)
- Analytics dashboard (progress charts, behavior trends)
- Exclusive badges and profile customization
- Ad-free experience

**Target User:** Serious users committed to habit change (months 1–3)

**Retention Goal:** 40–50% retention to continued subscription

### Academy Tier (Premium+)

**Price:** $10/month (or $90/year billed annually)

**Added Features (Everything in Premium +):**
- Complete Financial Academy (15–20 hour course)
- Personalized financial lessons matched to user profile
- Expert video content (produced in-house)
- Real-time behavioral insights (powered by AI)
- Plaid integration (when available) for real transaction analysis
- Advanced financial planning tools
- Priority support
- Exclusive community features (when launched)

**Target User:** Committed users who want comprehensive financial education + habit building

**Retention Goal:** 30–40% retention (premium power users)

### Monetization Timeline

**MVP Launch:** Free tier only
- Validate core product and retention
- Build user base for conversion
- Gather data on engagement

**Month 3:** Premium tier launch
- 10–15% of active users convert
- Validate willingness to pay
- Refine premium features based on feedback

**Month 6:** Academy tier launch
- Premium users can upgrade
- Begin building financial academy content
- Increase average revenue per user (ARPU)

### Pricing Rationale

- **$5/month Premium:** Accessible to Gen Z (~$60/year), above free but below "real" commitment
- **$10/month Academy:** For committed users wanting comprehensive solution
- **Annual Billing Discount:** Encourage long-term commitment (18% discount vs. monthly)

### Non-Monetized Features (No Ads, No Data Sales)

**CoinStack's Ethical Stance:**
- ❌ No ads
- ❌ No data selling
- ❌ No dark patterns
- ❌ No gamification exploits
- ✅ Transparent pricing
- ✅ User owns their data
- ✅ Gamification supports behavior change, not addiction

---

## Future Roadmap & Plaid Integration

### MVP (Launch)

**Core Deliverables:**
- Onboarding quiz (10 questions)
- Financial snapshot (5 questions)
- 3-coin system initialized
- 7 financial profiles
- 20–30 core challenges (4 difficulty levels)
- Streak system
- Challenge history and profile dashboard
- Basic insights (15–20 cards)
- Free tier only

**Launch Target:** 6–8 months from kickoff

---

### Phase 2 (Months 3–6 Post-Launch)

**Features:**
- Premium tier ($5/month)
- Advanced challenge personalization
- Premium insights expansion
- Advanced analytics dashboard
- Streak pause feature (premium)
- Challenge difficulty selection
- User testing of Plaid integration (beta)

---

### Phase 3 (Months 6–12 Post-Launch)

**Features:**
- Academy tier ($10/month)
- Plaid integration (official launch)
- Real transaction analysis begins
- Automated behavior detection
- Improved coin calculations using actual data
- Financial Academy course content
- Smart challenge generation powered by Plaid data
- Community features (phase 1)

#### Plaid Integration Strategy

**How Plaid Will Change CoinStack:**

1. **Current State (Quiz-Based):**
   - User answers 10 questions
   - System estimates coins

2. **Future State (Plaid-Enhanced):**
   - Quiz remains for quick onboarding
   - Plaid analyzes actual bank data
   - Estimated coins validated/refined
   - Automatic behavior detection triggers
   - Personalization becomes real-time

**Plaid Data Usage:**

```
Transaction Analysis:
- Spending volatility → Stability Coin accuracy
- Monthly savings rate → Saving Coin validation
- Investment account activity → Investing Coin detection

Behavioral Insights:
- Recurring expenses → Automatic budget categories
- Impulse spending patterns → Challenge personalization
- Bill payment consistency → Financial awareness scoring

Challenge Optimization:
- "Save from coffee spending" (if data shows high coffee purchases)
- "Review insurance costs" (if data shows insurance as major expense)
- "Invest in index funds" (if user has investment accounts)
```

**Plaid Implementation Approach:**

1. **Opt-In Model** — Users choose to connect; not required
2. **Gradual Integration** — Plaid data supplements, not replaces user input
3. **Transparency** — Clear explanation of data usage
4. **Security** — Encrypt data, follow banking standards
5. **Privacy** — User controls data; can disconnect anytime

---

### Phase 4 (12+ Months)

**Features:**
- Community challenge features (compete with friends)
- Social accountability (optional)
- Employer partnership programs (future B2B)
- Financial advisor integrations (future)
- API for third-party integrations
- Advanced AI behavioral prediction
- Expanded financial education partnerships

---

## Success Metrics & KPIs

### Primary Success Metric

**Measurable financial behavior change after 30 days of engagement**

Definition:
- 30%+ reduction in impulsive spending (vs. baseline)
- 15%+ monthly saving rate established (vs. baseline)
- 50%+ increase in financial awareness (self-reported)
- 70%+ completion of 30-day challenge streak

### Acquisition Metrics

| Metric | Target (12 Months) | Method |
|---|---|---|
| Total Downloads | 100K+ | App store optimization, organic growth |
| Installs from Ads | 30–40K | Meta, TikTok, Google ads targeting Gen Z |
| Organic Growth | 30–40K | Referral, press, word-of-mouth |
| Influencer/Content | 20–30K | TikTok creators, financial content creators |

### Activation Metrics

| Metric | Target | Definition |
|---|---|---|
| Quiz Completion Rate | 85%+ | % of installers who complete onboarding |
| Day 1 Challenge Completion | 75%+ | % of onboarded users who complete first challenge |
| Day 7 Retention | 45%+ | % of Day 1 users active on Day 7 |
| Day 30 Retention | 35%+ | % of Day 1 users active on Day 30 |

### Engagement Metrics

| Metric | Target | Definition |
|---|---|---|
| Daily Active Users (DAU) | 40% of monthly users | % of monthly users active on any given day |
| 7-Day Streak Completion | 60% | % of active users maintaining 7-day streak |
| 30-Day Streak Completion | 30–35% | % completing full 30-day challenge |
| Insight Engagement | 50%+ | % of challenges where user views related insight |
| Session Duration | 3–5 min | Average time per session |

### Behavior Change Metrics

| Metric | Target | Measurement |
|---|---|---|
| Spending Reduction | 25–30% | Self-reported comparison: Day 1 vs. Day 30 |
| Saving Initiation | 60%+ | % of users with $0 savings now saving by Day 30 |
| Saving Consistency | 70%+ | % of active users saving every month by Day 30 |
| Financial Awareness | 75%+ | % reporting increased awareness in survey |
| Impulse Control Improvement | 40%+ | % reporting reduced impulse spending by Day 30 |

### Retention Metrics

| Metric | Target | Definition |
|---|---|---|
| Month 1 Retention | 35%+ | % of users active 30+ days after install |
| Month 3 Retention | 25%+ | % of users active 90+ days after install |
| Month 6 Retention | 18%+ | % of users active 180+ days after install |
| Churn Rate | < 5% monthly | % of active users who stop using per month |
| Return User Rate | 65%+ | % of users who return after 1+ day gap |

### Monetization Metrics

| Metric | Target | Definition |
|---|---|---|
| Premium Conversion (Month 3+) | 10–15% | % of active users converting to paid |
| ARPU (Average Revenue Per User) | $0.50–$1.00 | Average monthly revenue per user |
| LTV (Lifetime Value) | $15–$25 | Expected total revenue per user over lifetime |
| Churn Rate (Premium) | < 8% monthly | % of paid users canceling per month |
| Academy Conversion (Month 6+) | 3–5% | % of premium users upgrading to academy |

### Coin Progression Metrics

| Metric | Target | Definition |
|---|---|---|
| Average Stability Coin Progress | +2 levels in 30 days | Starting level → finishing level |
| Average Saving Coin Progress | +1–2 levels in 30 days | Starting level → finishing level |
| Profile Evolution Rate | 40%+ | % of users evolving to new profile by Day 30 |
| Coin Level-Up Events | 1.5+ per user | Average number of coin level-ups per active user |

### Survey & Qualitative Metrics

**Post-30 Day Survey (Sample Size: 500+ respondents)**

| Question | Target Response |
|---|---|
| "Did CoinStack help you understand your financial behavior?" | 80%+ "Yes" |
| "Did you make real financial changes as a result?" | 70%+ "Yes, significant" |
| "Would you recommend CoinStack to a friend?" | 75%+ "Yes" |
| "Will you continue using CoinStack?" | 60%+ "Yes, long-term" |
| "Which coin category was most helpful?" | Varies; track distribution |

---

## Competitive Advantage

### What Makes CoinStack Different

#### 1. Behavior-First Philosophy

**Competition:** Tracking, analytics, dashboards
**CoinStack:** Behavior change, habit formation, identity evolution

**Advantage:**
- Not another expense tracker
- Uniquely addresses the knowledge-action gap
- Focuses on transformation, not data

#### 2. Deep Gamification

**Competition:** Basic streaks, badges (superficial)
**CoinStack:** Integrated coin system, profile evolution, identity-based progression

**Advantage:**
- Coins represent real financial behaviors, not arbitrary points
- Profile evolution creates emotional attachment
- Mechanics support psychological habit formation

#### 3. 3-Minute Challenge Model

**Competition:** Long-form content, courses, complex tools
**CoinStack:** Bite-sized, daily actions (< 3 minutes)

**Advantage:**
- Fits Gen Z behavior (short attention spans)
- Habit formation science supports consistency
- No friction or time commitment
- Accessible for busy users

#### 4. Personalization from Day 1

**Competition:** Generic challenges, one-size-fits-all
**CoinStack:** Personalized from onboarding quiz

**Advantage:**
- Quiz-based behavioral profiling
- Each user gets unique challenge path
- Challenges evolve as coins change
- Proactive rather than reactive

#### 5. Psychological Design

**Competition:** Transactional (track and report)
**CoinStack:** Psychological (identity, streaks, milestones)

**Advantage:**
- Identity-based behavior change (who you are, not what you do)
- Streak mechanics tap into loss aversion
- Progress visibility (coins) satisfies achievement need
- Milestone celebrations reinforce success
- Based on proven behavioral psychology

#### 6. No Transaction Connection (MVP)

**Competition:** Bank connections (friction, compliance, trust)
**CoinStack:** Self-reported + future Plaid integration

**Advantage:**
- Lower barrier to entry
- Faster onboarding
- Builds trust before asking for banking access
- Validates core hypothesis faster
- Smoother Plaid transition later

---

## MVP Scope & Exclusions

### MVP Included

✅ **Core Features:**
- Onboarding quiz (10 questions)
- Financial snapshot (5 questions)
- 3-coin system (Stability, Saving, Investing)
- 7 financial profiles
- 20–30 core challenges (across 4 categories)
- Challenge completion flow
- Streak system
- Streak notifications (basic)
- Milestone celebrations (7, 14, 21, 30, 60, 90 days)
- Profile dashboard
- Challenge history
- Insights library (15–20 insight cards)
- Linked insights to challenges
- Coin level-up celebrations
- Profile evolution notifications

✅ **User Experience:**
- Mobile-first responsive design (iOS & Android)
- Clean, engaging UI
- Smooth animations
- Onboarding tutorial
- Daily dashboard
- Notification system (basic)

✅ **Backend:**
- User accounts and authentication
- Quiz scoring and calculation
- Coin system calculations
- Profile determination algorithm
- Challenge scheduling
- Streak tracking
- Data persistence

✅ **Analytics:**
- Cohort analysis
- Feature engagement tracking
- Retention analysis
- Behavior change measurement
- User feedback collection

---

### MVP Excluded

❌ **Future Features (Post-MVP):**

**Plaid Integration**
- Real transaction analysis
- Automated behavior detection
- Real-time personalization
- Will be added in Phase 3 (6–12 months post-launch)

**Advanced Personalization**
- Machine learning for challenge optimization
- Predictive behavior modeling
- Advanced segmentation
- Will be added post-MVP as data accumulates

**Social Features**
- Friend connections
- Leaderboards
- Shared streaks
- Community challenges
- Social accountability
- Will be added in Phase 4+ (12+ months)

**Employer/B2B Features**
- Employer dashboard
- Corporate wellness programs
- Team challenges
- Employer analytics
- Will be explored as future B2B opportunity

**Advanced Analytics**
- Detailed financial reports
- Export capabilities
- Data visualization
- Comparison to benchmarks
- Will be added in Premium tier

**Banking Integration**
- Account connections
- Bill pay through app
- Investment linking
- Will be considered post-launch

**Third-Party Integrations**
- API for external tools
- Calendar integration
- Smart home integration
- Will be added if demand exists

**Content Management**
- User-generated challenges
- Crowdsourced insights
- Will be explored if community grows

---

## Technical Considerations

### Technology Stack (Recommended)

#### Frontend
- **Framework:** React Native (iOS + Android)
  - Reason: Cross-platform, Gen Z-friendly, fast iteration
- **State Management:** Redux or Zustand
- **UI Framework:** Native Base or React Native Paper
- **Animations:** React Native Reanimated (smooth, performant)
- **Analytics:** Segment or Firebase

#### Backend
- **Language:** Node.js with Express or Python with FastAPI
  - Reason: Fast development, strong ecosystem, easy scaling
- **Database:** PostgreSQL
  - Reason: Relational, robust, cost-effective at scale
- **Authentication:** Firebase Auth or Auth0
  - Reason: Secure, reduces liability, fast integration
- **Hosting:** AWS EC2 or Heroku
  - Reason: Scalable, cost-effective, proven reliability

#### Services
- **Push Notifications:** Firebase Cloud Messaging (FCM) or OneSignal
- **Email:** SendGrid or Mailgun
- **Analytics:** Mixpanel or Amplitude (better for habit tracking)
- **Crash Reporting:** Sentry or Firebase Crashlytics

---

### Data Security & Privacy

**Important:** Financial app requires strong security

#### Data Encryption
- All user data encrypted at rest (AES-256)
- All data encrypted in transit (TLS 1.3)
- No plain-text passwords ever stored

#### Authentication
- OAuth 2.0 for secure login
- Biometric auth (fingerprint/face) on mobile
- No hardcoded secrets
- Regular security audits

#### Compliance
- GDPR compliant (especially for EU users)
- CCPA compliant (for California users)
- SOC 2 Type II certification (target)
- No unnecessary permissions requested

#### Data Minimization
- Collect only essential data
- User can delete account and data anytime
- No data sharing with third parties
- Privacy policy clearly disclosed

---

### Performance Requirements

#### Mobile Performance
- **App Size:** < 50 MB (uncompressed)
- **Load Time:** Dashboard loads < 2 seconds on 4G
- **Challenge Load:** < 500ms to show challenge
- **Completion Submission:** < 1 second server response
- **Frame Rate:** 60 FPS on animations

#### Server Performance
- **Availability:** 99.9% uptime
- **Response Time:** < 200ms API response
- **Concurrency:** Support 10K+ concurrent users
- **Database:** Query responses < 50ms

#### User Experience
- **Offline Support:** Dashboard accessible offline (cached data)
- **Notification Delivery:** 99%+ delivery rate
- **Sync:** Background sync for challenge completion

---

### Testing & QA

#### Testing Coverage
- **Unit Tests:** 80%+ coverage on business logic
- **Integration Tests:** All APIs tested
- **E2E Tests:** Critical user flows tested
- **Manual QA:** Full regression testing before releases

#### Device Testing
- Test on 5+ iOS devices (sizes)
- Test on 5+ Android devices (sizes)
- Test on low-end hardware (2GB RAM)
- Test on slow networks (3G)

#### User Testing
- Beta testing with 200–500 users pre-launch
- Ethnographic research (observe how people use app)
- Usability testing (A/B test key flows)
- Post-launch user interviews

---

## Implementation Timeline

### Phase 0: Preparation (Weeks 1–4)

**Design & Planning:**
- [ ] Finalize product design (UI/UX)
- [ ] Create design system
- [ ] Wireframe all screens
- [ ] Plan technical architecture
- [ ] Set up development environment

**Team Assembly:**
- [ ] Hire lead engineer
- [ ] Hire mobile engineers (iOS + Android or React Native)
- [ ] Hire backend engineer
- [ ] Hire designer
- [ ] Define roles and responsibilities

### Phase 1: Core Build (Weeks 5–16)

**Backend (Weeks 5–12):**
- [ ] User authentication
- [ ] Database schema
- [ ] Quiz system (questions + scoring)
- [ ] Coin calculation engine
- [ ] Challenge system
- [ ] Streak tracking
- [ ] Profile determination algorithm
- [ ] API endpoints
- [ ] Testing and debugging

**Frontend (Weeks 5–16):**
- [ ] Onboarding flow
- [ ] Quiz UI
- [ ] Dashboard design
- [ ] Challenge screens
- [ ] Profile section
- [ ] Insights library
- [ ] Animations and interactions
- [ ] Analytics integration
- [ ] Testing and debugging

**Additional (Weeks 9–16):**
- [ ] Notification system
- [ ] Push notifications setup
- [ ] Analytics dashboard
- [ ] Admin panel (for monitoring)
- [ ] Security audit

### Phase 2: Internal Testing (Weeks 17–20)

**QA & Testing:**
- [ ] Unit testing
- [ ] Integration testing
- [ ] E2E testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Device testing (various sizes)
- [ ] Network testing (slow speeds)

**Bug Fixes & Polish:**
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Animation polish
- [ ] Copy refinement
- [ ] Accessibility testing

### Phase 3: Beta (Weeks 21–24)

**External Testing:**
- [ ] Recruit 200–500 beta users
- [ ] Beta release on TestFlight (iOS) and Google Play (Android)
- [ ] Collect feedback
- [ ] Monitor crash reports
- [ ] Track engagement metrics
- [ ] Conduct user interviews

**Iteration:**
- [ ] Fix bugs from beta feedback
- [ ] Implement critical feedback
- [ ] Optimize based on usage patterns
- [ ] Finalize content (insights, challenges)

### Phase 4: Launch (Weeks 25–26)

**Pre-Launch:**
- [ ] Finalize app store listings
- [ ] Create marketing materials
- [ ] Plan launch campaign
- [ ] Coordinate PR/influencers
- [ ] Set up analytics dashboards
- [ ] Prepare support team

**Launch:**
- [ ] Submit to App Store & Google Play
- [ ] Launch marketing campaign
- [ ] Engage press/influencers
- [ ] Monitor launch metrics
- [ ] Respond to initial bugs
- [ ] Support user onboarding

### Post-Launch: Months 1–3

**Monitoring & Optimization:**
- [ ] Daily monitoring of key metrics
- [ ] User feedback analysis
- [ ] Bug fixes and patches
- [ ] Iterative feature improvements
- [ ] User interviews and research
- [ ] Content expansion (more challenges, insights)

**Feature Expansion:**
- [ ] Implement top user-requested features
- [ ] A/B test key flows
- [ ] Improve retention through engagement optimizations
- [ ] Begin planning Premium tier

### Post-Launch: Months 3–6

**Premium Tier Launch:**
- [ ] Design premium features
- [ ] Implement paywall
- [ ] Premium challenge content creation
- [ ] Advanced analytics dashboard
- [ ] Premium insights library
- [ ] Soft launch → full launch

**Growth:**
- [ ] Paid user acquisition campaigns
- [ ] Content marketing (blog, social media)
- [ ] Influencer partnerships
- [ ] PR campaign
- [ ] International expansion consideration

---

## Appendix: Key Definitions

### Coin

Visual representation of financial behavior across three dimensions (Stability, Saving, Investing). NOT a currency or reward token.

### Challenge

3-minute behavioral action designed to change financial habits. Completion updates relevant coins and maintains streaks.

### Streak

Number of consecutive days user completes daily challenge. Resets to 0 if challenge missed for one day.

### Financial Profile

Dynamic identity assigned to user based on coin levels. Examples: "The Survivor," "The Builder," "The Wealth Architect."

### Insight

Contextual educational card (200–300 words) connected to challenges. Explains the "why" behind behaviors and provides actionable advice.

### Behavioral Quiz

10-question onboarding assessment that classifies user financial behaviors and initializes coins.

### Financial Snapshot

5-question collection of financial data (income, debt, savings, investments) that refines coin calculations.

### Coin Level

Rating from 0–5 representing financial health in each dimension. Increases through challenge completion and behavior change.

### Profile Evolution

Automatic profile change when user's coin combination matches different profile archetype.

### Gamification

System of game mechanics (coins, streaks, profiles, milestones) designed to sustain engagement and motivate behavior change.

### MVP

Minimum Viable Product. Initial launch with core features: quiz, coins, challenges, streaks, profiles.

### Premium Tier

Subscription ($5/month) unlocking advanced challenges, personalization, insights, and analytics.

### Academy Tier

Premium subscription ($10/month) including financial academy course, advanced analytics, and future Plaid integration.

---

## Document Approval & Sign-Off

| Role | Name | Signature | Date |
|---|---|---|---|
| Product Manager | [Name] | _______ | ______ |
| Engineering Lead | [Name] | _______ | ______ |
| Design Lead | [Name] | _______ | ______ |
| CEO/Founder | [Name] | _______ | ______ |

---

**END OF DOCUMENT**

---

## Document Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | [Date] | Product Team | Initial draft |
| 0.5 | [Date] | Product Team | Quiz section expanded, timeline added |
| 1.0 | [Date] | Product Team | Final comprehensive version |

---

**For Questions or Clarifications:** Contact [Product Manager Email] or [Team Slack Channel]
