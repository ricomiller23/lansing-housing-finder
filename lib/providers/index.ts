import { Listing, ListingProvider, SearchFilters } from './types';
import { RentCastProvider } from './rentcast';
import { ApifyProvider } from './apify';
import { WORK_LOCATION, computeCommute } from '../commute/routes';
import { computeScores } from '../scoring';

export const EAST_LANSING_CENTER = {
  lat: 42.7469328,
  lng: -84.4819344,
};

export function normalizeCityAlias(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/,\s*(mi|michigan)\b/g, '')
    .replace(/\b(michigan|mi)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned === 'east lansing' || cleaned === 'e lansing' || cleaned === 'el' || cleaned === '48823' || cleaned === '48824') {
    return 'East Lansing';
  }
  if (cleaned === 'lansing' || cleaned === 'downtown lansing' || cleaned === '48933' || cleaned === '48912' || cleaned === '48906') {
    return 'Lansing';
  }
  if (cleaned === 'okemos' || cleaned === 'meridian' || cleaned === 'meridian township' || cleaned === '48864') {
    return 'Okemos';
  }
  if (cleaned === 'haslett' || cleaned === 'lake lansing' || cleaned === '48840') {
    return 'Haslett';
  }
  if (cleaned === 'dewitt' || cleaned === 'de witt' || cleaned === '48820') {
    return 'DeWitt';
  }
  if (cleaned === 'holt' || cleaned === 'delhi' || cleaned === '48842') {
    return 'Holt';
  }
  if (cleaned === 'grand ledge' || cleaned === 'gl' || cleaned === '48837') {
    return 'Grand Ledge';
  }
  if (cleaned === 'mason' || cleaned === '48854') {
    return 'Mason';
  }
  return input.trim();
}

export class ListingRegistry {
  private providers: ListingProvider[] = [];

  constructor() {
    this.providers.push(new RentCastProvider());
    if (process.env.ENABLE_APIFY === 'true') {
      this.providers.push(new ApifyProvider());
    }
  }

  // Deduplicate listings across providers by normalized address + beds + price
  public deduplicate(listings: Listing[]): Listing[] {
    const seen = new Map<string, Listing>();

    for (const listing of listings) {
      const cleanAddress = listing.address.line1
        .toLowerCase()
        .replace(/(?:unit|apt|suite|ste|#)\s*[a-z0-9-]+/gi, '')
        .replace(/[^a-z0-9]/g, '');

      const communitySlug = (listing.communityName || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      const key = `${cleanAddress}:${communitySlug}:${listing.beds}:${Math.round(listing.price / 50)}`;

      if (!seen.has(key)) {
        seen.set(key, { ...listing });
      } else {
        const existing = seen.get(key)!;
        if (listing.photos.length > existing.photos.length) {
          existing.photos = Array.from(new Set([...existing.photos, ...listing.photos]));
        }
        if (!existing.parking.coveredConfirmed && listing.parking.coveredConfirmed) {
          existing.parking = listing.parking;
        }
        if (existing.petPolicy.twoDogsOk === 'unknown' && listing.petPolicy.twoDogsOk !== 'unknown') {
          existing.petPolicy = listing.petPolicy;
        }
      }
    }

    return Array.from(seen.values());
  }

  public async getListings(filters?: SearchFilters): Promise<{ listings: Listing[]; providersUsed: string[] }> {
    const providersUsed: string[] = [];
    const allListings: Listing[] = [];

    const normalizedCities = filters?.cities?.map(normalizeCityAlias);
    const primaryCity =
      normalizedCities && normalizedCities.length === 1 && normalizedCities[0] !== 'all'
        ? normalizedCities[0]
        : filters?.query
        ? normalizeCityAlias(filters.query)
        : undefined;

    const lat = WORK_LOCATION.lat;
    const lng = WORK_LOCATION.lng;
    const radiusMiles = filters?.maxDriveMiles || 25;

    for (const provider of this.providers) {
      try {
        const results = await provider.fetchListings({
          lat,
          lng,
          radiusMiles,
          limit: 150,
          city: primaryCity,
          propertyTypes: filters?.propertyTypes,
        });
        allListings.push(...results);
        providersUsed.push(provider.name);
      } catch (err) {
        console.error(`Error in provider ${provider.name}:`, err);
      }
    }

    const deduped = this.deduplicate(allListings);

    const enriched = await Promise.all(
      deduped.map(async (item) => {
        if (!item.commute) {
          const fullAddr = `${item.address.line1}, ${item.address.city}, MI ${item.address.zip}`;
          item.commute = await computeCommute(item.address.lat, item.address.lng, fullAddr, item.address.city);
        }
        if (!item.source_url) {
          item.source_url = item.url;
        }
        if (!item.retrieved_at) {
          item.retrieved_at = item.lastSeenAt;
        }
        item.scores = computeScores(item);
        return item;
      })
    );

    const filtered = this.applyFilters(enriched, filters);

    return {
      listings: filtered,
      providersUsed: Array.from(new Set(providersUsed)),
    };
  }

  public applyFilters(listings: Listing[], filters?: SearchFilters): Listing[] {
    if (!filters) return listings;

    return listings
      .filter((item) => {
        if (filters.minPrice !== undefined && item.price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && item.price > filters.maxPrice) return false;

        if (item.commute) {
          const commuteTime = filters.useWorstCaseCommute !== false
            ? Math.max(item.commute.morning.minutes, item.commute.evening.minutes)
            : item.commute.morning.minutes;

          if (filters.maxDriveMinutes !== undefined && commuteTime > filters.maxDriveMinutes) return false;

          const driveMiles = Math.max(item.commute.morning.miles, item.commute.evening.miles);
          if (filters.maxDriveMiles !== undefined && driveMiles > filters.maxDriveMiles) return false;
        }

        if (filters.minBeds !== undefined && item.beds < filters.minBeds) return false;
        if (filters.minBaths !== undefined && item.baths < filters.minBaths) return false;
        if (filters.minSqft !== undefined && item.sqft && item.sqft < filters.minSqft) return false;

        if (filters.cities && filters.cities.length > 0 && !filters.cities.includes('all')) {
          const matchesCity = filters.cities.some((c) => {
            const norm = normalizeCityAlias(c).toLowerCase();
            return (
              item.address.city.toLowerCase().includes(norm) ||
              item.address.zip.toLowerCase() === norm
            );
          });
          if (!matchesCity) return false;
        }

        if (filters.query && filters.query.trim().length > 0) {
          const rawQ = filters.query.trim().toLowerCase();
          const normCityQ = normalizeCityAlias(filters.query).toLowerCase();
          const haystack = [
            item.communityName || '',
            item.operator || '',
            item.address.line1,
            item.address.city,
            item.address.zip,
            item.propertyType.replace('_', ' '),
          ]
            .join(' ')
            .toLowerCase();

          const matchesRaw = haystack.includes(rawQ);
          const matchesNormCity = item.address.city.toLowerCase().includes(normCityQ);
          if (!matchesRaw && !matchesNormCity) return false;
        }

        if (filters.operators && filters.operators.length > 0 && !filters.operators.includes('all')) {
          const matchesOp = filters.operators.some((op) =>
            item.operator?.toLowerCase().includes(op.toLowerCase())
          );
          if (!matchesOp) return false;
        }

        if (filters.sourceTypes && filters.sourceTypes.length > 0 && !filters.sourceTypes.includes('all' as any)) {
          if (!item.sourceType || !filters.sourceTypes.includes(item.sourceType)) {
            return false;
          }
        }

        if (filters.propertyTypes && filters.propertyTypes.length > 0) {
          if (!filters.propertyTypes.includes(item.propertyType)) return false;
        }

        if (filters.coveredParkingMode === 'confirmed') {
          if (item.parking.twoCarsCovered !== 'yes') return false;
        } else if (filters.coveredParkingMode === 'lenient') {
          if (item.parking.twoCarsCovered === 'no') return false;
        }

        if (filters.twoDogsMode === 'strict') {
          if (item.petPolicy.twoDogsOk !== 'yes') return false;
        } else {
          if (item.petPolicy.twoDogsOk === 'no' || item.petPolicy.dogsAllowed === false) return false;
        }

        if (filters.amenities) {
          for (const [key, req] of Object.entries(filters.amenities)) {
            if (req && !(item.amenities as any)[key]) return false;
          }
        }

        if (filters.minYearBuilt !== undefined && item.yearBuilt && item.yearBuilt < filters.minYearBuilt) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const sortBy = filters.sortBy || 'overall';
        if (sortBy === 'overall') return (b.scores?.overall || 0) - (a.scores?.overall || 0);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'sqft') return (b.sqft || 0) - (a.sqft || 0);
        if (sortBy === 'newest') return (b.yearBuilt || 0) - (a.yearBuilt || 0);
        if (sortBy === 'commute') {
          const commA = Math.max(a.commute?.morning.minutes || 99, a.commute?.evening.minutes || 99);
          const commB = Math.max(b.commute?.morning.minutes || 99, b.commute?.evening.minutes || 99);
          return commA - commB;
        }
        if (sortBy === 'price_sqft') {
          const sqftA = a.sqft ? a.price / a.sqft : 999;
          const sqftB = b.sqft ? b.price / b.sqft : 999;
          return sqftA - sqftB;
        }
        return 0;
      });
  }
}

export const listingRegistry = new ListingRegistry();

export function applyFilters(listings: Listing[], filters?: SearchFilters): Listing[] {
  return listingRegistry.applyFilters(listings, filters);
}
