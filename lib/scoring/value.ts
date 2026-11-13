import { Listing } from '../providers/types';

// Irvine / South OC luxury median $/sqft baseline: ~$3.60/sqft
const LOCAL_MEDIAN_PER_SQFT = 3.6;

export function computeValue(listing: Listing): number {
  let score = 50; // default baseline

  if (listing.sqft && listing.sqft > 0 && listing.price > 0) {
    const pricePerSqft = listing.price / listing.sqft;
    // Lower price per sqft gives higher value score
    const ratio = pricePerSqft / LOCAL_MEDIAN_PER_SQFT;
    if (ratio <= 0.8) score = 95;
    else if (ratio <= 0.9) score = 85;
    else if (ratio <= 1.0) score = 75;
    else if (ratio <= 1.15) score = 65;
    else if (ratio <= 1.3) score = 50;
    else score = 35;
  } else {
    // Score based on absolute rent tiers in Irvine
    if (listing.price < 3500) score = 80;
    else if (listing.price <= 4800) score = 70;
    else if (listing.price <= 6000) score = 55;
    else score = 40;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}
