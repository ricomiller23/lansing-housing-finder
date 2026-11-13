import { Listing } from '../providers/types';

export function computeDogFriendly(listing: Listing, targetWeightLbs: number = 25): number {
  let score = 0;

  // 1. Pet confirmation (40 pts)
  if (listing.petPolicy.twoDogsOk === 'yes') {
    score += 40;
  } else if (listing.petPolicy.dogsAllowed === true) {
    score += 30;
  } else if (listing.petPolicy.dogsAllowed === 'unknown') {
    score += 15; // Unverified neutral
  } else {
    return 0; // Strict disqualifier if dogs allowed = false
  }

  // 2. Weight limit check (25 pts)
  if (listing.petPolicy.weightLimitLbs) {
    if (listing.petPolicy.weightLimitLbs >= targetWeightLbs) {
      score += 25;
    } else {
      score -= 20; // Explicit weight limit below our dogs
    }
  } else {
    score += 20; // No restrictive weight limit stated
  }

  // 3. Yard or outdoor amenities (20 pts)
  if (listing.amenities.fencedYard) {
    score += 20;
  } else if (listing.propertyType === 'single_family' || listing.propertyType === 'townhome') {
    score += 15;
  } else {
    score += 10;
  }

  // 4. Pet fees reasonableness (15 pts)
  if (listing.petPolicy.petRentMonthly !== undefined) {
    if (listing.petPolicy.petRentMonthly <= 50) score += 15;
    else if (listing.petPolicy.petRentMonthly <= 100) score += 10;
    else score += 5;
  } else {
    score += 10;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}
