import { describe, it, expect } from 'vitest';
import { computeLincolnParity, DEFAULT_BASELINE } from '../lib/scoring/lincoln';
import { computeDogFriendly } from '../lib/scoring/dog';
import { computeValue } from '../lib/scoring/value';
import { computeScores } from '../lib/scoring';
import { Listing } from '../lib/providers/types';

describe('Scoring Suite', () => {
  const sampleListing: Listing = {
    id: 'test-1',
    provider: 'rentcast',
    url: 'https://example.com',
    address: { line1: '100 Spectrum Center Dr', city: 'Irvine', state: 'CA', zip: '92618', lat: 33.65, lng: -117.75 },
    propertyType: 'apartment',
    price: 4400,
    beds: 2,
    baths: 2,
    sqft: 1300,
    yearBuilt: 2019,
    lastSeenAt: new Date().toISOString(),
    photos: [],
    petPolicy: { dogsAllowed: true, twoDogsOk: 'yes', weightLimitLbs: 35 },
    parking: { coveredSpaces: 2, coveredConfirmed: true, twoCarsCovered: 'yes' },
    amenities: { inUnitLaundry: true, ac: true, pool: true, gym: true, gated: true },
    fees: {},
    flags: [],
  };

  it('computes high Lincoln Parity for an upscale 2-bed with 2-car garage and full amenities', () => {
    const score = computeLincolnParity(sampleListing, DEFAULT_BASELINE);
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it('computes dog friendly score when 2 dogs are confirmed', () => {
    const score = computeDogFriendly(sampleListing, 25);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('penalizes dog friendly score if dogs are strictly forbidden', () => {
    const noPetsListing = {
      ...sampleListing,
      petPolicy: { dogsAllowed: false, twoDogsOk: 'no' as const },
    };
    const score = computeDogFriendly(noPetsListing);
    expect(score).toBe(0);
  });

  it('computes overall weighted composite score', () => {
    const scores = computeScores(sampleListing);
    expect(scores.overall).toBeGreaterThanOrEqual(75);
    expect(scores.lincolnParity).toBeGreaterThan(0);
  });
});
