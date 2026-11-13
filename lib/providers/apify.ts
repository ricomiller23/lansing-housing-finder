import { Listing, ListingProvider, PropertyType } from './types';
import { extractFromText } from '../extract/regex';

export class ApifyProvider implements ListingProvider {
  name = 'Apify Rental Search';
  source = 'apify-zillow' as const;

  async fetchListings(params: {
    lat: number;
    lng: number;
    radiusMiles: number;
    limit?: number;
    city?: string;
    propertyTypes?: PropertyType[];
  }): Promise<Listing[]> {
    if (process.env.ENABLE_APIFY !== 'true' || !process.env.APIFY_TOKEN) {
      return [];
    }

    try {
      const token = process.env.APIFY_TOKEN;
      const targetCity = params.city && params.city !== 'all' ? `${params.city}, MI` : 'East Lansing, MI 48824';
      const res = await fetch(
        `https://api.apify.com/v2/acts/apify~zillow-scraper/run-sync-get-dataset-items?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            search: targetCity,
            category: 'rent',
            maxItems: params.limit || 40,
          }),
        }
      );

      if (!res.ok) {
        console.warn(`Apify actor returned ${res.status}`);
        return [];
      }

      const items = await res.json();
      if (!Array.isArray(items)) return [];

      const nowIso = new Date().toISOString();
      return items
        .filter((raw: any) => raw && (raw.detailUrl || raw.url) && Number(raw.unformattedPrice || raw.price) > 0)
        .map((raw: any, index: number): Listing => {
          const desc = String(raw.description || raw.statusText || '');
          const extraction = extractFromText(desc);
          const sourceUrl = String(raw.detailUrl || raw.url);
          const city = String(raw.addressCity || params.city || 'East Lansing');
          const line1 = String(raw.addressStreet || raw.address || 'Not yet sourced');
          const zip = String(raw.addressZipcode || '48824');
          const rawHomeType = String(raw.hdpData?.homeInfo?.homeType || '').toLowerCase();
          const propertyType: PropertyType = rawHomeType.includes('single')
            ? 'single_family'
            : rawHomeType.includes('town')
            ? 'townhome'
            : rawHomeType.includes('condo')
            ? 'condo'
            : 'apartment';

          return {
            id: `apify-zillow:${raw.zpid || index}`,
            provider: 'apify-zillow',
            url: sourceUrl,
            source_url: sourceUrl,
            retrieved_at: nowIso,
            address: {
              line1,
              city,
              state: 'MI',
              zip,
              lat: Number(raw.latLong?.latitude || params.lat),
              lng: Number(raw.latLong?.longitude || params.lng),
            },
            propertyType,
            communityName: raw.buildingName || undefined,
            operator: 'Zillow Rental Feed',
            sourceType: 'private_landlord',
            price: Number(raw.unformattedPrice || raw.price),
            beds: Number(raw.beds || 1),
            baths: Number(raw.baths || 1),
            sqft: raw.area ? Number(raw.area) : undefined,
            lastSeenAt: nowIso,
            photos: Array.isArray(raw.photos) && raw.photos.length > 0 ? raw.photos : raw.imgSrc ? [raw.imgSrc] : [],
            description: desc,
            petPolicy: extraction.petPolicy,
            parking: extraction.parking,
            amenities: extraction.amenities,
            fees: {},
            flags: extraction.flags,
          };
        });
    } catch (err) {
      console.error('Apify scraper error:', err);
      return [];
    }
  }
}
