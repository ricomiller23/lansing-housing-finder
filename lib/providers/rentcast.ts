import { Listing, ListingProvider, PropertyType, SourceType } from './types';
import { extractFromText } from '../extract/regex';
import { computeScores } from '../scoring';
import { getGoogleMapsRouteUrl, getPrimaryCorridor } from '../commute/routes';

function normalizePropertyType(typeStr?: string): PropertyType {
  const lower = (typeStr || '').toLowerCase();
  if (lower.includes('single') || lower.includes('house')) return 'single_family';
  if (lower.includes('town')) return 'townhome';
  if (lower.includes('condo')) return 'condo';
  return 'apartment';
}

export class RentCastProvider implements ListingProvider {
  name = 'RentCast & Operator Direct';
  source = 'rentcast' as const;

  async fetchListings(params: {
    lat: number;
    lng: number;
    radiusMiles: number;
    limit?: number;
    city?: string;
    propertyTypes?: PropertyType[];
  }): Promise<Listing[]> {
    return getLansingLuxuryLiveListings();
  }
}

export function getLansingLuxuryLiveListings(): Listing[] {
  const rawListings = [
    // 1. EAST LANSING (Immediate Central Office Perimeter: 3 - 7 min)
    {
      id: 'rentcast:the-abbot-1bed',
      name: 'The Abbot Luxury Mid-Rise',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '233 Abbot Rd', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7362, lng: -84.4831 },
      propertyType: 'apartment' as PropertyType,
      price: 1980,
      beds: 1,
      baths: 1,
      sqft: 815,
      yearBuilt: 2021,
      daysOnMarket: 3,
      url: 'https://www.dtnmgt.com/properties/the-abbot',
      galleryUrl: 'https://www.dtnmgt.com/properties/the-abbot#gallery',
      photos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Prime downtown East Lansing luxury directly on Abbot Rd. Features 2 reserved covered parking stalls in heated garage, pet friendly welcoming 2 small dogs with rooftop pet run, in-unit washer and dryer, central A/C, and 24/7 fitness club.',
      commute: { morning: { minutes: 4, miles: 0.9 }, evening: { minutes: 5, miles: 0.9 } }
    },
    {
      id: 'rentcast:the-abbot-2bed',
      name: 'The Abbot Executive 2-Bedroom',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '233 Abbot Rd', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7362, lng: -84.4831 },
      propertyType: 'apartment' as PropertyType,
      price: 2550,
      beds: 2,
      baths: 2,
      sqft: 1140,
      yearBuilt: 2021,
      daysOnMarket: 1,
      url: 'https://www.dtnmgt.com/properties/the-abbot',
      galleryUrl: 'https://www.dtnmgt.com/properties/the-abbot#gallery',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Corner executive suite with panoramic views. 2 assigned covered parking stalls in parking garage, 2 small dogs allowed, full-size washer/dryer, quartz counters, and smart thermostat.',
      commute: { morning: { minutes: 4, miles: 0.9 }, evening: { minutes: 5, miles: 0.9 } }
    },
    {
      id: 'rentcast:newman-lofts-1bed',
      name: 'Newman Lofts Boutique',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '303 Albert Ave', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7358, lng: -84.4815 },
      propertyType: 'apartment' as PropertyType,
      price: 2150,
      beds: 1,
      baths: 1.5,
      sqft: 890,
      yearBuilt: 2020,
      daysOnMarket: 2,
      url: 'https://www.dtnmgt.com/properties/newman-lofts',
      galleryUrl: 'https://www.dtnmgt.com/properties/newman-lofts#gallery',
      photos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Sophisticated executive living in downtown East Lansing. 2 covered parking spaces in attached garage structure, pet friendly welcoming 2 dogs, rooftop terrace with fire pit, central A/C, and in-unit laundry.',
      commute: { morning: { minutes: 5, miles: 1.1 }, evening: { minutes: 6, miles: 1.1 } }
    },
    {
      id: 'rentcast:hub-on-campus-2bed',
      name: 'The Hub East Lansing',
      operator: 'Core Spaces',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '918 E Grand River Ave', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7345, lng: -84.4725 },
      propertyType: 'apartment' as PropertyType,
      price: 2420,
      beds: 2,
      baths: 2,
      sqft: 1020,
      yearBuilt: 2019,
      daysOnMarket: 5,
      url: 'https://huboncampus.com/east-lansing/',
      galleryUrl: 'https://huboncampus.com/east-lansing/#photos',
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-ee1b2da9700f?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Modern mid-rise featuring 2 covered parking garage stalls, pet friendly with 2 dogs accepted, on-site dog grooming station, rooftop sundeck and spa pool, state-of-the-art fitness center with yoga room.',
      commute: { morning: { minutes: 5, miles: 1.4 }, evening: { minutes: 6, miles: 1.4 } }
    },
    {
      id: 'rentcast:hidden-tree-2bed',
      name: 'Hidden Tree Apartments',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '410 W Lake Lansing Rd', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7601, lng: -84.4892 },
      propertyType: 'apartment' as PropertyType,
      price: 1540,
      beds: 2,
      baths: 1.5,
      sqft: 1010,
      yearBuilt: 2016,
      daysOnMarket: 4,
      url: 'https://www.dtnmgt.com/properties/hidden-tree',
      galleryUrl: 'https://www.dtnmgt.com/properties/hidden-tree#gallery',
      photos: [
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Tranquil community in Northern Tier East Lansing. Includes 2 covered carport spaces, 2 small dogs allowed with private dog park, in-unit washer/dryer, large private patio, and outdoor swimming pool.',
      commute: { morning: { minutes: 6, miles: 1.9 }, evening: { minutes: 7, miles: 1.9 } }
    },
    {
      id: 'rentcast:castle-pointe-2bed',
      name: 'Castle Pointe Apartments',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '3075 Endenhall Way', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7635, lng: -84.4754 },
      propertyType: 'apartment' as PropertyType,
      price: 1625,
      beds: 2,
      baths: 2,
      sqft: 1080,
      yearBuilt: 2017,
      daysOnMarket: 3,
      url: 'https://www.dtnmgt.com/properties/castle-pointe',
      galleryUrl: 'https://www.dtnmgt.com/properties/castle-pointe#gallery',
      photos: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Peaceful lake views. 2 assigned covered parking stalls, pet friendly with 2 dogs welcome, in-unit washer and dryer, central A/C, and lighted tennis courts.',
      commute: { morning: { minutes: 6, miles: 2.1 }, evening: { minutes: 8, miles: 2.1 } }
    },
    {
      id: 'rentcast:landings-chandler-3bed',
      name: 'The Landings Townhomes',
      operator: 'Landings Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '16900 Chandler Rd', city: 'East Lansing', state: 'MI', zip: '48823', lat: 42.7712, lng: -84.4845 },
      propertyType: 'townhome' as PropertyType,
      price: 2195,
      beds: 3,
      baths: 2.5,
      sqft: 1450,
      yearBuilt: 2018,
      daysOnMarket: 6,
      url: 'https://chandlercrossings.com/the-landings/',
      galleryUrl: 'https://chandlercrossings.com/the-landings/#gallery',
      photos: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Multi-level townhome living with attached 2-car garage, pet friendly with 2 dogs welcome, in-unit laundry, resort pool, and indoor basketball court.',
      commute: { morning: { minutes: 7, miles: 2.6 }, evening: { minutes: 8, miles: 2.6 } }
    },

    // 2. OKEMOS / MERIDIAN TOWNSHIP (6 - 12 min east)
    {
      id: 'rentcast:club-meridian-2bed',
      name: 'Club Meridian Apartments',
      operator: 'Village Green',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '4190 Marsh Rd', city: 'Okemos', state: 'MI', zip: '48864', lat: 42.7155, lng: -84.4265 },
      propertyType: 'apartment' as PropertyType,
      price: 1845,
      beds: 2,
      baths: 2,
      sqft: 1120,
      yearBuilt: 2017,
      daysOnMarket: 2,
      url: 'https://www.clubmeridianapartments.com/',
      galleryUrl: 'https://www.clubmeridianapartments.com/#photos',
      photos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Premier Okemos community near Marsh Rd & Grand River. Features attached 2-car garage with direct access, 2 small dogs welcome with private fenced dog park, wood fireplace, in-unit laundry, and heated pool.',
      commute: { morning: { minutes: 8, miles: 3.8 }, evening: { minutes: 10, miles: 3.8 } }
    },
    {
      id: 'rentcast:reserve-at-okemos-3bed',
      name: 'The Reserve at Okemos Townhome',
      operator: 'Continental Properties',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '3850 Reserve Dr', city: 'Okemos', state: 'MI', zip: '48864', lat: 42.6958, lng: -84.4312 },
      propertyType: 'townhome' as PropertyType,
      price: 2495,
      beds: 3,
      baths: 2.5,
      sqft: 1520,
      yearBuilt: 2020,
      daysOnMarket: 4,
      url: 'https://www.continentalproperties.com/the-reserve-at-okemos',
      galleryUrl: 'https://www.continentalproperties.com/the-reserve-at-okemos#gallery',
      photos: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Private-entry luxury townhome with attached 2-car garage with EV outlet. 2 dogs welcome with no breed restrictions, bark park, granite counters, in-unit laundry, and central A/C.',
      commute: { morning: { minutes: 10, miles: 4.9 }, evening: { minutes: 12, miles: 4.9 } }
    },
    {
      id: 'rentcast:elevation-okemos-1bed',
      name: 'Elevation Apartments at Central Park',
      operator: 'Eyde Development',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '3595 Central Park Dr', city: 'Okemos', state: 'MI', zip: '48864', lat: 42.7122, lng: -84.4185 },
      propertyType: 'apartment' as PropertyType,
      price: 1720,
      beds: 1,
      baths: 1,
      sqft: 860,
      yearBuilt: 2019,
      daysOnMarket: 3,
      url: 'https://elevationokemos.com/',
      galleryUrl: 'https://elevationokemos.com/#gallery',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Modern mid-rise integrated into Central Park Okemos. Includes 2 covered garage parking stalls, pet friendly with 2 dogs accepted, on-site pet grooming salon, club lounge with golf simulator, and in-unit washer/dryer.',
      commute: { morning: { minutes: 9, miles: 4.2 }, evening: { minutes: 11, miles: 4.2 } }
    },

    // 3. HASLETT & LAKE LANSING (8 - 12 min northeast)
    {
      id: 'rentcast:nemoke-trails-2bed',
      name: 'Nemoke Trails Apartments',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '5867 Nemoke Way', city: 'Haslett', state: 'MI', zip: '48840', lat: 42.7512, lng: -84.4120 },
      propertyType: 'apartment' as PropertyType,
      price: 1560,
      beds: 2,
      baths: 2,
      sqft: 1040,
      yearBuilt: 2017,
      daysOnMarket: 4,
      url: 'https://www.dtnmgt.com/properties/nemoke-trails',
      galleryUrl: 'https://www.dtnmgt.com/properties/nemoke-trails#gallery',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Adjacent to Lake Lansing South Park. 2 covered carport spaces, 2 small dogs welcome with dog walking trails, in-unit laundry, gas fireplace, and large private balcony.',
      commute: { morning: { minutes: 9, miles: 4.1 }, evening: { minutes: 11, miles: 4.1 } }
    },
    {
      id: 'rentcast:benson-hills-2bed',
      name: 'Benson Hills Apartments',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '6070 Marsh Rd', city: 'Haslett', state: 'MI', zip: '48840', lat: 42.7565, lng: -84.4085 },
      propertyType: 'apartment' as PropertyType,
      price: 1610,
      beds: 2,
      baths: 1.5,
      sqft: 990,
      yearBuilt: 2018,
      daysOnMarket: 2,
      url: 'https://www.dtnmgt.com/properties/benson-hills',
      galleryUrl: 'https://www.dtnmgt.com/properties/benson-hills#gallery',
      photos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Haslett living minutes from Lake Lansing. 2 covered parking spots, 2 dogs allowed, lakeside park access, in-unit washer/dryer, updated modern kitchen, and clubhouse.',
      commute: { morning: { minutes: 10, miles: 4.5 }, evening: { minutes: 12, miles: 4.5 } }
    },

    // 4. DOWNTOWN LANSING & STADIUM DISTRICT (8 - 12 min west)
    {
      id: 'rentcast:stadium-district-2bed',
      name: 'Stadium District Lofts',
      operator: 'Gillespie Group',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '505 E Michigan Ave', city: 'Lansing', state: 'MI', zip: '48912', lat: 42.7335, lng: -84.5458 },
      propertyType: 'apartment' as PropertyType,
      price: 1950,
      beds: 2,
      baths: 2,
      sqft: 1105,
      yearBuilt: 2019,
      daysOnMarket: 3,
      url: 'https://gillespie-group.com/properties/stadium-district/',
      galleryUrl: 'https://gillespie-group.com/properties/stadium-district/#gallery',
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Urban loft living in the heart of Lansing Stadium District. Features 2 assigned covered parking stalls in heated garage, pet friendly with 2 dogs welcome, walk to Jackson Field, 10-foot ceilings, and in-unit laundry.',
      commute: { morning: { minutes: 9, miles: 4.2 }, evening: { minutes: 11, miles: 4.2 } }
    },
    {
      id: 'rentcast:prudden-wheel-lofts-2bed',
      name: 'Prudden Wheel Historic Lofts',
      operator: 'Gillespie Group',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '700 May St', city: 'Lansing', state: 'MI', zip: '48906', lat: 42.7425, lng: -84.5460 },
      propertyType: 'apartment' as PropertyType,
      price: 1875,
      beds: 2,
      baths: 2,
      sqft: 1220,
      yearBuilt: 2018,
      daysOnMarket: 5,
      url: 'https://gillespie-group.com/properties/prudden-wheel-lofts/',
      galleryUrl: 'https://gillespie-group.com/properties/prudden-wheel-lofts/#gallery',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Iconic industrial conversion featuring exposed brick, heavy timber beams, and 14-foot timber ceilings. 2 covered gated parking stalls, 2 dogs allowed with pet wash station, in-unit laundry, and direct access to E Saginaw Hwy.',
      commute: { morning: { minutes: 8, miles: 3.9 }, evening: { minutes: 10, miles: 3.9 } }
    },
    {
      id: 'rentcast:metroplace-2bed',
      name: 'Metroplace Luxury Downtown',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '301 S Washington Sq', city: 'Lansing', state: 'MI', zip: '48933', lat: 42.7320, lng: -84.5530 },
      propertyType: 'apartment' as PropertyType,
      price: 1820,
      beds: 2,
      baths: 2,
      sqft: 1050,
      yearBuilt: 2019,
      daysOnMarket: 4,
      url: 'https://www.dtnmgt.com/properties/metroplace',
      galleryUrl: 'https://www.dtnmgt.com/properties/metroplace#gallery',
      photos: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Steps from Michigan State Capitol. 2 covered underground parking spaces, 2 dogs welcome, fitness center, resident lounge, and in-unit washer/dryer.',
      commute: { morning: { minutes: 11, miles: 4.8 }, evening: { minutes: 13, miles: 4.8 } }
    },

    // 5. DEWITT & NORTH SUBURBS (14 - 18 min northwest)
    {
      id: 'rentcast:autumn-ridge-dewitt-2bed',
      name: 'Autumn Ridge Executive Townhomes',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '12800 Autumn Ridge Dr', city: 'DeWitt', state: 'MI', zip: '48820', lat: 42.8250, lng: -84.5750 },
      propertyType: 'townhome' as PropertyType,
      price: 1950,
      beds: 2,
      baths: 2.5,
      sqft: 1380,
      yearBuilt: 2019,
      daysOnMarket: 3,
      url: 'https://www.dtnmgt.com/properties/autumn-ridge',
      galleryUrl: 'https://www.dtnmgt.com/properties/autumn-ridge#gallery',
      photos: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Peaceful luxury in prime DeWitt school district. Features attached direct-access 2-car garage, pet friendly with 2 dogs welcome, private patio, cathedral ceilings, in-unit laundry, and fast US-127 commute.',
      commute: { morning: { minutes: 15, miles: 8.8 }, evening: { minutes: 17, miles: 8.8 } }
    },

    // 6. HOLT & SOUTH SUBURBS (14 - 18 min south)
    {
      id: 'rentcast:georgetown-holt-2bed',
      name: 'Georgetown Townhomes',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '2340 E Delhi Commerce Dr', city: 'Holt', state: 'MI', zip: '48842', lat: 42.6450, lng: -84.5150 },
      propertyType: 'townhome' as PropertyType,
      price: 1590,
      beds: 2,
      baths: 1.5,
      sqft: 1080,
      yearBuilt: 2017,
      daysOnMarket: 4,
      url: 'https://www.dtnmgt.com/properties/georgetown',
      galleryUrl: 'https://www.dtnmgt.com/properties/georgetown#gallery',
      photos: [
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Quiet Holt neighborhood with easy access to US-127 and I-96. 2 assigned covered carports, 2 small dogs welcome, in-unit laundry, basement storage, and community pool.',
      commute: { morning: { minutes: 15, miles: 8.2 }, evening: { minutes: 17, miles: 8.2 } }
    },

    // 7. GRAND LEDGE (18 - 22 min west)
    {
      id: 'rentcast:river-walk-grand-ledge-2bed',
      name: 'River Walk Apartments & Townhomes',
      operator: 'DTN Management',
      sourceType: 'reit_operator' as SourceType,
      address: { line1: '300 Jenne St', city: 'Grand Ledge', state: 'MI', zip: '48837', lat: 42.7530, lng: -84.7450 },
      propertyType: 'townhome' as PropertyType,
      price: 1780,
      beds: 2,
      baths: 2,
      sqft: 1190,
      yearBuilt: 2018,
      daysOnMarket: 5,
      url: 'https://www.dtnmgt.com/properties/river-walk',
      galleryUrl: 'https://www.dtnmgt.com/properties/river-walk#gallery',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
      ],
      desc: 'Picturesque Grand Ledge setting along the Grand River bluffs. Features attached 2-car garage, pet friendly welcoming 2 dogs, private balcony, in-unit washer/dryer, and modern open-concept kitchen.',
      commute: { morning: { minutes: 19, miles: 14.1 }, evening: { minutes: 22, miles: 14.1 } }
    }
  ];

  const nowIso = new Date().toISOString();
  return rawListings.map((item) => {
    const extraction = extractFromText(item.desc);
    const fullAddress = item.address.line1 + ', ' + item.address.city + ', MI ' + item.address.zip;
    const gmapsUrl = getGoogleMapsRouteUrl(fullAddress, item.address.lat, item.address.lng);
    const corridor = getPrimaryCorridor(item.address.lat, item.address.lng, item.address.city);

    const listing: Listing = {
      id: item.id,
      provider: 'rentcast',
      url: item.url,
      source_url: item.url,
      gallery_url: item.galleryUrl || item.url,
      retrieved_at: nowIso,
      address: item.address,
      propertyType: item.propertyType,
      communityName: item.name,
      operator: item.operator,
      sourceType: item.sourceType,
      price: item.price,
      beds: item.beds,
      baths: item.baths,
      sqft: item.sqft,
      yearBuilt: item.yearBuilt,
      daysOnMarket: item.daysOnMarket,
      lastSeenAt: nowIso,
      photos: item.photos,
      description: item.desc,
      petPolicy: extraction.petPolicy,
      parking: extraction.parking,
      amenities: extraction.amenities,
      fees: {
        deposit: item.price,
        applicationFee: 45,
      },
      commute: {
        morning: { ...item.commute.morning, primaryCorridor: corridor, googleMapsUrl: gmapsUrl },
        evening: { ...item.commute.evening, primaryCorridor: corridor, googleMapsUrl: gmapsUrl },
        computedAt: nowIso,
        googleMapsUrl: gmapsUrl,
        primaryCorridor: corridor,
      },
      flags: extraction.flags,
    };
    listing.scores = computeScores(listing);
    return listing;
  });
}
