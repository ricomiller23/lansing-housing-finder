import { describe, it, expect } from 'vitest';
import { ListingRegistry } from '../lib/providers';
import { Listing } from '../lib/providers/types';

describe('Deduplication & Registry Suite', () => {
  const registry = new ListingRegistry();

  const itemA: Listing = {
    id: 'rentcast:1',
    provider: 'rentcast',
    url: 'https://example.com/1',
    address: { line1: '100 Promenade', city: 'Irvine', state: 'CA', zip: '92618', lat: 33.65, lng: -117.75 },
    propertyType: 'apartment',
    price: 4350,
    beds: 2,
    baths: 2,
    lastSeenAt: new Date().toISOString(),
    photos: ['p1.jpg'],
    petPolicy: { dogsAllowed: 'unknown', twoDogsOk: 'unknown' },
    parking: { coveredConfirmed: false, twoCarsCovered: 'unknown' },
    amenities: {},
    fees: {},
    flags: [],
  };

  const itemB: Listing = {
    id: 'apify-zillow:2',
    provider: 'apify-zillow',
    url: 'https://example.com/2',
    address: { line1: '100 Promenade, Unit 201', city: 'Irvine', state: 'CA', zip: '92618', lat: 33.65, lng: -117.75 },
    propertyType: 'apartment',
    price: 4350,
    beds: 2,
    baths: 2,
    lastSeenAt: new Date().toISOString(),
    photos: ['p1.jpg', 'p2.jpg'],
    petPolicy: { dogsAllowed: true, twoDogsOk: 'yes' },
    parking: { coveredConfirmed: true, twoCarsCovered: 'yes' },
    amenities: {},
    fees: {},
    flags: [],
  };

  it('merges duplicate listings by address and price proximity', () => {
    const deduped = registry.deduplicate([itemA, itemB]);
    expect(deduped.length).toBe(1);
    expect(deduped[0].parking.twoCarsCovered).toBe('yes');
    expect(deduped[0].photos.length).toBe(2);
  });
});
