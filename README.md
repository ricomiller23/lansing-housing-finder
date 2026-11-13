# Irvine Housing Finder (Live Rental & Commute Intelligence)

A live, dynamic web application designed to find the optimal luxury home near **Beach Cities Commercial Bank, 100 Progress, Suite 150, Irvine, CA 92618** (Innovation Office Park, Irvine Spectrum).

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **TanStack Query**, **Google Routes API**, and **Upstash Redis**.

---

## 1. Key Features

- **Deb's Commute Engine**: Real traffic-aware commute modeling to 100 Progress (morning 7:45 AM arrival & evening 5:30 PM departure).
- **The Lincoln Scottsdale Parity Guard**: Benchmarks every home against your Scottsdale residence (rent, beds, baths, sqft, luxury finishes) with 0-100% parity scoring.
- **Hard Criteria Verification**:
  - **2 Small Dogs**: Verifies pet limits, weight restrictions, pet rent, and pet deposits.
  - **2 Cars Covered Parking**: Tracks attached 2-car garages, carports, and assigned covered stalls.
- **Cost Reality Panel**: True all-in monthly out-of-pocket costs (Rent + Pet Rent x2 + Parking + Utilities + Insurance) + California AB 12 security deposit explanation.
- **Outreach Helper**: One-click pre-filled email and phone scripts tailored to verify exact unknown pet/parking policies.
- **Side-by-Side Compare Drawer**: Compare up to 4 homes across rent, commute, and amenities.
- **Direct Luxury Portals**: Deep-links to master luxury operators (Irvine Company, Avalon, Greystar, Camden, Essex, Lincoln Property Co).
- **CSV Export**: Instant export of all filtered results.

---

## 2. Environment Variables & API Key Acquisition

Create a `.env.local` file with the following variables:

```bash
# Workplace
WORK_ADDRESS="100 Progress, Suite 150, Irvine, CA 92618"
WORK_LAT=33.6770191
WORK_LNG=-117.7602022

# Baseline (The Lincoln Scottsdale)
BASELINE_ADDRESS="7100 E Lincoln Drive, Scottsdale, AZ 85253"
BASELINE_RENT=4200
BASELINE_BEDS=2
BASELINE_BATHS=2
BASELINE_SQFT=1250

# Providers
RENTCAST_API_KEY=                # Obtain at https://www.rentcast.io/api
ENABLE_APIFY=false               # Optional Apify scrapers
APIFY_TOKEN=

# Google Maps & Routes
GOOGLE_MAPS_SERVER_KEY=          # Google Routes API (computeRouteMatrix), Geocoding
NEXT_PUBLIC_GOOGLE_MAPS_KEY=     # Google Maps JavaScript API (HTTP referrer restricted)

# Storage & Alerts
UPSTASH_REDIS_REST_URL=          # Upstash Redis REST URL
UPSTASH_REDIS_REST_TOKEN=        # Upstash Redis REST Token
RESEND_API_KEY=                  # Resend API Key for email alerts
ALERT_EMAIL_TO=                  # Destination for saved search alerts
CRON_SECRET=                     # Secret token for Vercel Cron invocation

# Optional LLM Extraction
ANTHROPIC_API_KEY=               # Claude 3.5 Sonnet extraction key
```

### HTTP Referrer Restriction for Google Maps JS Key
To secure your `NEXT_PUBLIC_GOOGLE_MAPS_KEY`:
1. In the Google Cloud Console, go to **APIs & Services > Credentials**.
2. Select your public key.
3. Under **Application restrictions**, choose **Websites**.
4. Add website restrictions:
   - `http://localhost:3000/*`
   - `https://*.vercel.app/*`
   - `https://irvine-housing-finder.vercel.app/*`

---

## 3. Known Limitations

- **Zillow / Apartments.com Scraping**: No free official API exists; secondary coverage is isolated behind the optional Apify adapter.
- **Master Developer Lag**: Master luxury communities (such as Irvine Company Apartments) often keep their best inventory on their private portals. Use the direct portal links in the app to check real-time availability.
- **Commute Estimates**: Drive times reflect Google traffic models for typical weekday morning and evening rush hours; actual travel time may vary with weather or incidents.

---

## 4. Development & Testing

```bash
# Run development server
pnpm dev

# Run Vitest test suite
pnpm test

# Build for production
pnpm build
```
