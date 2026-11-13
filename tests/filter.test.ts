import { describe, it, expect } from 'vitest';
import { applyFilters, normalizeCityAlias } from '../lib/providers';
import { getLansingLuxuryLiveListings } from '../lib/providers/rentcast';
import { Listing, SearchFilters } from '../lib/providers/types';

describe('Lansing Regional Multi-City & Commute Filter Suite', () => {
  const dummyListing: Listing = {
    id: 'test-el-1',
    provider: 'rentcast',
    url: 'https://www.dtnmgt.com/properties/the-abbot',
    source_url: 'https://www.dtnmgt.com/properties/the-abbot',
    gallery_url: 'https://www.dtnmgt.com/properties/the-abbot#gallery',
    retrieved_at: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    daysOnMarket: 2,
    address: {
      line1: '233 Abbot Rd',
      city: 'East Lansing',
      state: 'MI',
      zip: '48823',
      lat: 42.7362,
      lng: -84.4831,
    },
    price: 1980,
    beds: 1,
    baths: 1,
    sqft: 815,
    yearBuilt: 2021,
    propertyType: 'apartment',
    operator: 'DTN Management',
    sourceType: 'reit_operator',
    petPolicy: {
      dogsAllowed: true,
      twoDogsOk: 'yes',
      maxPets: 2,
      weightLimitLbs: 45,
    },
    parking: {
      coveredSpaces: 2,
      type: 'garage',
      coveredConfirmed: true,
      twoCarsCovered: 'yes',
    },
    amenities: {
      inUnitLaundry: true,
      ac: true,
    },
    photos: ['https://example.com/photo.jpg'],
    description: 'Luxury East Lansing apartment.',
    fees: { deposit: 1980 },
    commute: {
      morning: { minutes: 4, miles: 0.9, primaryCorridor: 'Abbott Rd to E Saginaw' },
      evening: { minutes: 5, miles: 0.9, primaryCorridor: 'Abbott Rd to E Saginaw' },
      computedAt: new Date().toISOString(),
    },
    flags: ['twoDogsConfirmed', 'twoCarsCoveredConfirmed'],
  };

  it('normalizes East Lansing and Okemos aliases', () => {
    expect(normalizeCityAlias('East Lansing')).toBe('East Lansing');
    expect(normalizeCityAlias('east lansing, mi')).toBe('East Lansing');
    expect(normalizeCityAlias('e lansing')).toBe('East Lansing');
    expect(normalizeCityAlias('48823')).toBe('East Lansing');
    expect(normalizeCityAlias('Okemos')).toBe('Okemos');
    expect(normalizeCityAlias('okemos, michigan')).toBe('Okemos');
  });

  it('matches East Lansing apartments via city filter and keyword search', () => {
    const viaCity = applyFilters([dummyListing], { cities: ['East Lansing'] });
    const viaQuery = applyFilters([dummyListing], { query: 'East Lansing' });

    expect(viaCity.map((l) => l.id)).toEqual(['test-el-1']);
    expect(viaQuery.map((l) => l.id)).toEqual(['test-el-1']);
  });

  it('ensures all Lansing live listings carry source_url, retrieved_at, and MI zip', () => {
    const rawDataset = getLansingLuxuryLiveListings();
    expect(rawDataset.length).toBeGreaterThan(10);
    for (const listing of rawDataset) {
      expect(listing.source_url).toBeTruthy();
      expect(listing.retrieved_at).toBeTruthy();
      expect(listing.address.state).toBe('MI');
      expect(listing.commute).toBeTruthy();
    }
  });

  it('filters by max drive minutes', () => {
    const filtered = applyFilters([dummyListing], { maxDriveMinutes: 10 });
    expect(filtered.length).toBe(1);

    const tooFar = applyFilters([dummyListing], { maxDriveMinutes: 2 });
    expect(tooFar.length).toBe(0);
  });
});
