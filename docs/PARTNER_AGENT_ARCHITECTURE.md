# Partner Sub-Agent Architecture

## Overview
The **Partner Sub-Agent** is the automated backend system designed to manage creator partnerships (Affiliate Marketing). It acts as a transparent tracking engine, ensuring that creators are accurately credited for user acquisition and automatically receive compensation insights.

This document outlines the architecture for tracking, reporting, and payouts.

## Core Responsibilities
1. **Acquisition Tracking:** Monitor when users download the app and sign up using a creator's unique identifier.
2. **Subscription State Syncing:** Track when those users upgrade to Compass, True North, or Zenith tiers.
3. **Automated Reporting:** Generate weekly insights on revenue performance and send them to the partners.

---

## Technical Implementation Plan

### Phase 1: Database & Tracking Layer
To ensure complete transparency, True North must capture the referral source at the exact moment of account creation.

**1. Unique Identifiers**
Creators will be issued both a **Unique Sign-up Link** (for Instagram stories/bios) and a **Promo Code** (for podcast shoutouts / verbal mentions). Both must resolve to the same Creator ID.

**2. Prisma Schema Updates**
```prisma
model Partner {
  id              String   @id @default(uuid())
  userId          String   @unique // Linked to their True North account
  promoCode       String   @unique // e.g. "JACKIE20"
  referralLink    String   @unique // e.g. "truenorth.app/join/jackie"
  commissionRate  Float    @default(0.10) // 10%
  createdAt       DateTime @default(now())
  
  referrals       User[]   @relation("PartnerReferrals")
}

// Update to existing User model
model User {
  ...
  referredById    String?  @map("referred_by_id")
  partner         Partner? @relation("PartnerReferrals", fields: [referredById], references: [id])
}
```

### Phase 2: The Agent Logic (API Layer)
The core "Sub-Agent" will be an internal service (`/api/partner-agent/analytics`) that performs the financial math safely on the server.

*   **Logic Flow:**
    1. Retrieve the Partner.
    2. Count all `Users` where `referredById == Partner.id`.
    3. Filter by `subscriptionTier` (`free`, `compass`, `truenorth`, `zenith`).
    4. Calculate the real Net Revenue (deducting the ~30% App Store Platform Fees).
    5. Aggregate the final 10% cut into a `total_pending_payout`.

### Phase 3: Weekly Automated Reporting (V1)
Before investing engineering hours into a full reactive UI dashboard, Version 1 will utilize a scheduled background CRON job.

*   **Execution:** A Github Action or Vercel CRON job triggers `POST /api/partner-agent/weekly-report` every Friday.
*   **Action:** The Sub-Agent queries the Analytics endpoint for every active partner, compiles a beautiful HTML email summarizing their weekly app installs and recurring revenue, and sends it out via Resend/SendGrid. This proves the "100% Transparency" pitch without requiring them to actively log in somewhere.

### Phase 4: Partner Dashboard (V2)
Once the Sub-Agent logic is solid and the program grows, we will build a graphical interface for creators to log in and self-serve their insights.

*   **Location:** `web/src/app/(partner-portal)/dashboard`
*   **Features:**
    *   Live charts of App Installs vs Paid Conversions.
    *   Historical payout ledgers.
    *   Custom slider calculators.
    *   Direct links to request M-Pesa / Bank transfers for queued payouts.
