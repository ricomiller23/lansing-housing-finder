# Architecture & Product Decisions: Irvine Housing Finder

This document logs all product, architectural, and algorithmic decisions made during development.

---

## 1. Baseline Residence Benchmark
- **Current Home Address**: The user typed `71009 E Lincoln Drive`. Verified via geocoding and public records that the exact street address is **7100 East Lincoln Drive, Scottsdale, AZ 85253** (The Lincoln Scottsdale, formerly Broadstone Lincoln).
- **Parity Threshold**: Default set to 70% match score.
- **Components**: Beds (2), Baths (2), Sqft (1,250), 2 covered parking spaces, in-unit washer/dryer, resort-style pool and fitness center, central A/C, gated entry.

## 2. Workplace & Commute Engine
- **Office Location**: Beach Cities Commercial Bank, 100 Progress, Suite 150, Irvine, CA 92618 (Innovation Office Park in Irvine Spectrum).
- **Coordinates**: `33.6770191° N, 117.7602022° W`.
- **Commute Windows**: Morning arrival departure set to 7:45 AM (incoming Irvine Spectrum peak corridor); Evening return departure set to 5:30 PM (outgoing peak).
- **Graceful Fallback**: When `GOOGLE_MAPS_SERVER_KEY` is not present, a traffic-aware South Orange County corridor heuristic is used (incorporating I-5, I-405, SR-133, and SR-241 road network factors) so that calculations never crash.

## 3. Data Providers Strategy
- **Provider Adapter Pattern**: Implemented `ListingProvider` interface returning normalized `Listing` objects.
- **RentCast API**: Configured as primary official data source with live long-term rental query endpoint. When no key is provided, an initial curated set of real luxury communities in Irvine Spectrum, Quail Hill, Great Park, Woodbridge, Tustin Legacy, and Newport Beach is loaded.
- **Apify Scrapers**: Isolated behind `ENABLE_APIFY=true` and `APIFY_TOKEN` to ensure compliance with website terms of service and zero runtime fragility.
- **Community Deep-Links**: Provided direct availability links for major master luxury operators (Irvine Company Apartments, Avalon, Camden, Greystar, Essex, Toll Brothers, Lincoln Property Company) to surface unlisted inventory.

## 4. Hard Constraints Handling
- **2 Small Dogs**: Dogs mode provides both "Confirmed Only" (explicitly verified 2 dogs allowed) and "Allow Unverified" (does not penalize unverified listings, but excludes "No Pets").
- **2 Cars Covered Parking**: Parking selector supports "2+ Covered Confirmed" vs "2+ Covered or Pending" vs "Any".
- **California AB 12 Law**: Integrated into the Cost Reality Modal, explaining that CA law (effective July 1, 2024) caps residential security deposits at a maximum of 1 month's rent.

## 5. Storage & Deployment
- **Cache & State**: Upstash Redis with automatic in-memory fallback for local development or unlinked environments.
- **Cron Jobs**: Configured via `vercel.json` for 2-hour listing refresh (`/api/cron/refresh`) and 1-hour email alerts (`/api/cron/alerts`).
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript Strict + Tailwind CSS v4 + Vitest.
