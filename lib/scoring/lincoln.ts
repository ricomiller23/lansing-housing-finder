import { Listing } from '../providers/types';

export interface BaselineProfile {
  address: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  coveredParkingSpaces: number;
  inUnitLaundry: boolean;
  pool: boolean;
  gym: boolean;
  ac: boolean;
  gated: boolean;
}

export const DEFAULT_BASELINE: BaselineProfile = {
  address: '7100 E Lincoln Drive, Scottsdale, AZ 85253 (The Lincoln Scottsdale)',
  rent: 3400,
  beds: 1,
  baths: 1,
  sqft: 900,
  coveredParkingSpaces: 2,
  inUnitLaundry: true,
  pool: true,
  gym: true,
  ac: true,
  gated: true,
};

export function computeLincolnParity(listing: Listing, baseline: BaselineProfile = DEFAULT_BASELINE): number {
  let score = 0;

  // 1. Beds & Baths (25 pts)
  if (listing.beds >= baseline.beds && listing.baths >= baseline.baths) {
    score += 25;
  } else if (listing.beds >= baseline.beds) {
    score += 18;
  } else {
    score += 8;
  }

  // 2. Square Footage (20 pts)
  if (listing.sqft) {
    const sqftRatio = listing.sqft / baseline.sqft;
    if (sqftRatio >= 1.0) {
      score += 20;
    } else if (sqftRatio >= 0.85) {
      score += 15;
    } else if (sqftRatio >= 0.7) {
      score += 10;
    }
  } else {
    score += 12; // Neutral if unknown
  }

  // 3. Covered Parking (20 pts) - Critical requirement: 2 cars covered
  if (listing.parking.twoCarsCovered === 'yes') {
    score += 20;
  } else if (listing.parking.coveredConfirmed) {
    score += 12;
  } else if (listing.parking.twoCarsCovered === 'unknown') {
    score += 6;
  }

  // 4. Amenities Match (25 pts): W/D (10), A/C (5), Pool/Gym (5), Gated (5)
  if (listing.amenities.inUnitLaundry) score += 10;
  if (listing.amenities.ac !== false) score += 5;
  if (listing.amenities.pool || listing.amenities.gym) score += 5;
  if (listing.amenities.gated) score += 5;

  // 5. Year Built / Quality Tier (10 pts)
  if (listing.yearBuilt && listing.yearBuilt >= 2015) {
    score += 10;
  } else if (listing.yearBuilt && listing.yearBuilt >= 2005) {
    score += 8;
  } else {
    score += 5;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}
