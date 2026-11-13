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
  {
    "id": "rentcast:the-abbot-1bed",
    "name": "The Abbot Luxury Mid-Rise",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "233 Abbot Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7362,
      "lng": -84.4831
    },
    "propertyType": "apartment",
    "price": 1980,
    "beds": 1,
    "baths": 1,
    "sqft": 815,
    "yearBuilt": 2021,
    "daysOnMarket": 3,
    "url": "https://www.dtnmgt.com/properties/the-abbot",
    "galleryUrl": "https://www.dtnmgt.com/properties/the-abbot#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Prime downtown East Lansing luxury directly on Abbot Rd. Features 2 reserved covered parking stalls in heated garage, pet friendly welcoming up to 2 small dogs, in-unit washer and dryer, central A/C, and 24/7 fitness club.",
    "commute": {
      "morning": {
        "minutes": 4,
        "miles": 0.9
      },
      "evening": {
        "minutes": 5,
        "miles": 0.9
      }
    }
  },
  {
    "id": "rentcast:the-abbot-2bed",
    "name": "The Abbot Executive 2-Bedroom",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "233 Abbot Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7362,
      "lng": -84.4831
    },
    "propertyType": "apartment",
    "price": 2550,
    "beds": 2,
    "baths": 2,
    "sqft": 1220,
    "yearBuilt": 2021,
    "daysOnMarket": 4,
    "url": "https://www.dtnmgt.com/properties/the-abbot",
    "galleryUrl": "https://www.dtnmgt.com/properties/the-abbot#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Spacious executive corner flat with floor-to-ceiling windows. Includes heated garage parking for 2 cars, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, quartz counters, and private balcony.",
    "commute": {
      "morning": {
        "minutes": 4,
        "miles": 0.9
      },
      "evening": {
        "minutes": 5,
        "miles": 0.9
      }
    }
  },
  {
    "id": "rentcast:newman-lofts-1bed",
    "name": "Newman Lofts Boutique",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "200 Albert Ave",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7358,
      "lng": -84.4815
    },
    "propertyType": "apartment",
    "price": 2150,
    "beds": 1,
    "baths": 1.5,
    "sqft": 940,
    "yearBuilt": 2020,
    "daysOnMarket": 2,
    "url": "https://www.dtnmgt.com/properties/newman-lofts",
    "galleryUrl": "https://www.dtnmgt.com/properties/newman-lofts#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Active adult boutique building in downtown East Lansing. Features 2 reserved covered parking stalls in indoor structure, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and direct elevator access.",
    "commute": {
      "morning": {
        "minutes": 5,
        "miles": 1.1
      },
      "evening": {
        "minutes": 5,
        "miles": 1.1
      }
    }
  },
  {
    "id": "rentcast:hub-on-campus-2bed",
    "name": "The Hub East Lansing",
    "operator": "Core Spaces",
    "sourceType": "reit_operator",
    "address": {
      "line1": "918 E Grand River Ave",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7345,
      "lng": -84.4735
    },
    "propertyType": "apartment",
    "price": 2420,
    "beds": 2,
    "baths": 2,
    "sqft": 1050,
    "yearBuilt": 2019,
    "daysOnMarket": 6,
    "url": "https://huboncampus.com/east-lansing/",
    "galleryUrl": "https://huboncampus.com/east-lansing/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Luxury mid-rise directly on Grand River Ave. Includes 2 covered parking spaces in secured parking garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, rooftop pool and sundeck.",
    "commute": {
      "morning": {
        "minutes": 5,
        "miles": 1.2
      },
      "evening": {
        "minutes": 6,
        "miles": 1.2
      }
    }
  },
  {
    "id": "rentcast:landings-chandler-3bed",
    "name": "The Landings Townhomes",
    "operator": "Landings at Chandler Crossing",
    "sourceType": "reit_operator",
    "address": {
      "line1": "16878 Chandler Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7725,
      "lng": -84.4921
    },
    "propertyType": "townhome",
    "price": 2195,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1650,
    "yearBuilt": 2016,
    "daysOnMarket": 1,
    "url": "https://chandlercrossings.com/the-landings/",
    "galleryUrl": "https://chandlercrossings.com/the-landings/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Multi-level townhome living with attached 2-car garage. Welcomes up to 2 dogs with private dog park, in-unit washer and dryer, central air conditioning, private patio, and 24-hour clubhouse.",
    "commute": {
      "morning": {
        "minutes": 7,
        "miles": 2.8
      },
      "evening": {
        "minutes": 8,
        "miles": 2.8
      }
    }
  },
  {
    "id": "rentcast:landings-chandler-2bed",
    "name": "The Landings 2-Bedroom Townhome",
    "operator": "Landings at Chandler Crossing",
    "sourceType": "reit_operator",
    "address": {
      "line1": "16878 Chandler Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7725,
      "lng": -84.4921
    },
    "propertyType": "townhome",
    "price": 1750,
    "beds": 2,
    "baths": 2,
    "sqft": 1280,
    "yearBuilt": 2016,
    "daysOnMarket": 5,
    "url": "https://chandlercrossings.com/the-landings/",
    "galleryUrl": "https://chandlercrossings.com/the-landings/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Modern open townhome with attached 2-car garage. Pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and full community fitness amenities.",
    "commute": {
      "morning": {
        "minutes": 7,
        "miles": 2.8
      },
      "evening": {
        "minutes": 8,
        "miles": 2.8
      }
    }
  },
  {
    "id": "rentcast:club-chandler-2bed",
    "name": "The Club at Chandler Crossing",
    "operator": "Chandler Crossings",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3839 Hunsaker Dr",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7712,
      "lng": -84.4945
    },
    "propertyType": "apartment",
    "price": 1495,
    "beds": 2,
    "baths": 2,
    "sqft": 1040,
    "yearBuilt": 2012,
    "daysOnMarket": 4,
    "url": "https://chandlercrossings.com/the-club/",
    "galleryUrl": "https://chandlercrossings.com/the-club/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Peaceful north East Lansing setting. Offers 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and indoor basketball court.",
    "commute": {
      "morning": {
        "minutes": 7,
        "miles": 3
      },
      "evening": {
        "minutes": 8,
        "miles": 3
      }
    }
  },
  {
    "id": "rentcast:village-chandler-2bed",
    "name": "The Village at Chandler Crossing",
    "operator": "Chandler Crossings",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3838 Hunsaker Dr",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7708,
      "lng": -84.4938
    },
    "propertyType": "apartment",
    "price": 1380,
    "beds": 2,
    "baths": 2,
    "sqft": 980,
    "yearBuilt": 2011,
    "daysOnMarket": 7,
    "url": "https://chandlercrossings.com/the-village/",
    "galleryUrl": "https://chandlercrossings.com/the-village/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Renovated apartment home with 2 covered carport spaces. Pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and on-site dog park.",
    "commute": {
      "morning": {
        "minutes": 7,
        "miles": 3.1
      },
      "evening": {
        "minutes": 8,
        "miles": 3.1
      }
    }
  },
  {
    "id": "rentcast:castle-pointe-2bed",
    "name": "Castle Pointe Apartments",
    "operator": "Monarch Investment and Management Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3075 Endenhall Way",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7612,
      "lng": -84.4754
    },
    "propertyType": "apartment",
    "price": 1625,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1020,
    "yearBuilt": 2008,
    "daysOnMarket": 5,
    "url": "https://www.castlepointeapts.com/",
    "galleryUrl": "https://www.castlepointeapts.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Tucked into wooded landscape off Lake Lansing Rd. Includes 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and heated indoor swimming pool.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.9
      },
      "evening": {
        "minutes": 7,
        "miles": 2.9
      }
    }
  },
  {
    "id": "rentcast:castle-pointe-1bed",
    "name": "Castle Pointe 1-Bedroom",
    "operator": "Monarch Investment and Management Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3075 Endenhall Way",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7612,
      "lng": -84.4754
    },
    "propertyType": "apartment",
    "price": 1325,
    "beds": 1,
    "baths": 1,
    "sqft": 780,
    "yearBuilt": 2008,
    "daysOnMarket": 3,
    "url": "https://www.castlepointeapts.com/",
    "galleryUrl": "https://www.castlepointeapts.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Bright 1-bedroom home with private balcony. Features 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and clubhouse.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.9
      },
      "evening": {
        "minutes": 7,
        "miles": 2.9
      }
    }
  },
  {
    "id": "rentcast:hidden-tree-2bed",
    "name": "Hidden Tree Apartments",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "410 W Lake Lansing Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7538,
      "lng": -84.4889
    },
    "propertyType": "apartment",
    "price": 1540,
    "beds": 2,
    "baths": 2,
    "sqft": 1050,
    "yearBuilt": 2004,
    "daysOnMarket": 8,
    "url": "https://www.dtnmgt.com/properties/hidden-tree",
    "galleryUrl": "https://www.dtnmgt.com/properties/hidden-tree#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Quiet East Lansing residential setting near Abbott and Lake Lansing. Includes 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and patio.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.2
      },
      "evening": {
        "minutes": 7,
        "miles": 2.2
      }
    }
  },
  {
    "id": "rentcast:hidden-tree-1bed",
    "name": "Hidden Tree Garden 1-Bedroom",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "410 W Lake Lansing Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7538,
      "lng": -84.4889
    },
    "propertyType": "apartment",
    "price": 1290,
    "beds": 1,
    "baths": 1,
    "sqft": 750,
    "yearBuilt": 2004,
    "daysOnMarket": 2,
    "url": "https://www.dtnmgt.com/properties/hidden-tree",
    "galleryUrl": "https://www.dtnmgt.com/properties/hidden-tree#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Renovated 1-bedroom flat with tranquil wooded views. Includes 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and pool access.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.2
      },
      "evening": {
        "minutes": 7,
        "miles": 2.2
      }
    }
  },
  {
    "id": "rentcast:benson-hills-2bed",
    "name": "Benson Hills Apartments",
    "operator": "Friedman Communities",
    "sourceType": "reit_operator",
    "address": {
      "line1": "1400 Benson Cir",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7745,
      "lng": -84.4789
    },
    "propertyType": "apartment",
    "price": 1610,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1040,
    "yearBuilt": 2010,
    "daysOnMarket": 2,
    "url": "https://www.bensonhillsapartments.com/",
    "galleryUrl": "https://www.bensonhillsapartments.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Spacious north East Lansing apartment home. Features 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and private patio.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 3.1
      },
      "evening": {
        "minutes": 9,
        "miles": 3.1
      }
    }
  },
  {
    "id": "rentcast:25-east-2bed",
    "name": "25 East Luxury Apartments",
    "operator": "Peak Campus",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2501 Abbot Rd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7582,
      "lng": -84.4842
    },
    "propertyType": "apartment",
    "price": 1420,
    "beds": 2,
    "baths": 2,
    "sqft": 990,
    "yearBuilt": 2014,
    "daysOnMarket": 6,
    "url": "https://25eastliving.com/",
    "galleryUrl": "https://25eastliving.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Conveniently situated right along Abbot Road. Features 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, private bark park, and pool.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.1
      },
      "evening": {
        "minutes": 7,
        "miles": 2.1
      }
    }
  },
  {
    "id": "rentcast:lodges-east-lansing-2bed",
    "name": "The Lodges of East Lansing",
    "operator": "The Preiss Company",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2700 Hannah Blvd",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7154,
      "lng": -84.4695
    },
    "propertyType": "apartment",
    "price": 1695,
    "beds": 2,
    "baths": 2,
    "sqft": 1110,
    "yearBuilt": 2015,
    "daysOnMarket": 3,
    "url": "https://lodgesofeastlansing.com/",
    "galleryUrl": "https://lodgesofeastlansing.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Lodge-inspired master plan community. Offers attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and outdoor fire pit lounge.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 3.2
      },
      "evening": {
        "minutes": 9,
        "miles": 3.2
      }
    }
  },
  {
    "id": "rentcast:burnt-tree-2bed",
    "name": "Burnt Tree Apartment Homes",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2300 Burcham Dr",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7395,
      "lng": -84.4552
    },
    "propertyType": "apartment",
    "price": 1510,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1010,
    "yearBuilt": 2006,
    "daysOnMarket": 5,
    "url": "https://www.dtnmgt.com/properties/burnt-tree",
    "galleryUrl": "https://www.dtnmgt.com/properties/burnt-tree#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Nestled off Burcham Dr near Patriarche Park. Offers 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and large walk-in closets.",
    "commute": {
      "morning": {
        "minutes": 7,
        "miles": 2.4
      },
      "evening": {
        "minutes": 8,
        "miles": 2.4
      }
    }
  },
  {
    "id": "rentcast:albert-meadow-2bed",
    "name": "Albert Meadow Residences",
    "operator": "Prime Housing Group",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "835 Albert Ave",
      "city": "East Lansing",
      "state": "MI",
      "zip": "48823",
      "lat": 42.7365,
      "lng": -84.4748
    },
    "propertyType": "apartment",
    "price": 1650,
    "beds": 2,
    "baths": 1,
    "sqft": 920,
    "yearBuilt": 2013,
    "daysOnMarket": 4,
    "url": "https://primehousinggroup.com/albert-meadow",
    "galleryUrl": "https://primehousinggroup.com/albert-meadow#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Charming boutique community near East Lansing library. Includes 2 covered parking spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and balcony.",
    "commute": {
      "morning": {
        "minutes": 5,
        "miles": 1
      },
      "evening": {
        "minutes": 5,
        "miles": 1
      }
    }
  },
  {
    "id": "rentcast:trappers-cove-2bed",
    "name": "Trappers Cove Townhomes",
    "operator": "Morgan Communities",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3001 Trappers Cove Trl",
      "city": "Lansing",
      "state": "MI",
      "zip": "48910",
      "lat": 42.6985,
      "lng": -84.5124
    },
    "propertyType": "townhome",
    "price": 1460,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1150,
    "yearBuilt": 2007,
    "daysOnMarket": 7,
    "url": "https://www.trapperscove.com/",
    "galleryUrl": "https://www.trapperscove.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Townhome with private patio and lake views. Features 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and lighted tennis courts.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 3.5
      },
      "evening": {
        "minutes": 9,
        "miles": 3.5
      }
    }
  },
  {
    "id": "rentcast:club-meridian-2bed",
    "name": "Club Meridian Apartments",
    "operator": "Continental Properties",
    "sourceType": "reit_operator",
    "address": {
      "line1": "4340 Spicewood Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7121,
      "lng": -84.4158
    },
    "propertyType": "apartment",
    "price": 1845,
    "beds": 2,
    "baths": 2,
    "sqft": 1140,
    "yearBuilt": 2017,
    "daysOnMarket": 4,
    "url": "https://www.clubmeridianapartments.com/",
    "galleryUrl": "https://www.clubmeridianapartments.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Upscale Okemos community with resort amenities. Includes attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, swimming pool, and private patio.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 4.6
      },
      "evening": {
        "minutes": 10,
        "miles": 4.6
      }
    }
  },
  {
    "id": "rentcast:club-meridian-3bed",
    "name": "Club Meridian 3-Bed Executive",
    "operator": "Continental Properties",
    "sourceType": "reit_operator",
    "address": {
      "line1": "4340 Spicewood Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7121,
      "lng": -84.4158
    },
    "propertyType": "townhome",
    "price": 2295,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1580,
    "yearBuilt": 2017,
    "daysOnMarket": 2,
    "url": "https://www.clubmeridianapartments.com/",
    "galleryUrl": "https://www.clubmeridianapartments.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Spacious 3-bedroom luxury residence. Features attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, gourmet kitchen, and private deck.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 4.6
      },
      "evening": {
        "minutes": 10,
        "miles": 4.6
      }
    }
  },
  {
    "id": "rentcast:reserve-at-okemos-3bed",
    "name": "The Reserve at Okemos Townhome",
    "operator": "Village Green",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2230 Reserve Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.6954,
      "lng": -84.4285
    },
    "propertyType": "townhome",
    "price": 2495,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1820,
    "yearBuilt": 2019,
    "daysOnMarket": 3,
    "url": "https://www.reserveatokemos.com/",
    "galleryUrl": "https://www.reserveatokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Luxury multi-story townhome in prestigious Okemos location. Offers attached 2-car garage, pet friendly welcoming 2 small dogs, private patio, in-unit washer/dryer, central air conditioning, and clubhouse pool.",
    "commute": {
      "morning": {
        "minutes": 10,
        "miles": 4.9
      },
      "evening": {
        "minutes": 12,
        "miles": 4.9
      }
    }
  },
  {
    "id": "rentcast:reserve-at-okemos-2bed",
    "name": "The Reserve at Okemos 2-Bedroom",
    "operator": "Village Green",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2230 Reserve Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.6954,
      "lng": -84.4285
    },
    "propertyType": "townhome",
    "price": 2150,
    "beds": 2,
    "baths": 2,
    "sqft": 1410,
    "yearBuilt": 2019,
    "daysOnMarket": 5,
    "url": "https://www.reserveatokemos.com/",
    "galleryUrl": "https://www.reserveatokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Two-bedroom townhome with high-end designer finishes. Features attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and fitness center.",
    "commute": {
      "morning": {
        "minutes": 10,
        "miles": 4.9
      },
      "evening": {
        "minutes": 12,
        "miles": 4.9
      }
    }
  },
  {
    "id": "rentcast:elevation-okemos-1bed",
    "name": "Elevation Apartments at Central Park",
    "operator": "Eyde Development",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2175 Central Park Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7215,
      "lng": -84.4215
    },
    "propertyType": "apartment",
    "price": 1720,
    "beds": 1,
    "baths": 1,
    "sqft": 890,
    "yearBuilt": 2022,
    "daysOnMarket": 4,
    "url": "https://elevationokemos.com/",
    "galleryUrl": "https://elevationokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Ultra-modern construction at Central Park in Okemos. Includes 2 covered parking spaces in private garage structure, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and EV chargers.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 5.1
      },
      "evening": {
        "minutes": 11,
        "miles": 5.1
      }
    }
  },
  {
    "id": "rentcast:elevation-okemos-2bed",
    "name": "Elevation 2-Bed Executive Suite",
    "operator": "Eyde Development",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2175 Central Park Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7215,
      "lng": -84.4215
    },
    "propertyType": "apartment",
    "price": 2190,
    "beds": 2,
    "baths": 2,
    "sqft": 1260,
    "yearBuilt": 2022,
    "daysOnMarket": 1,
    "url": "https://elevationokemos.com/",
    "galleryUrl": "https://elevationokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Premier 2-bedroom executive layout at Elevation. Offers 2 covered parking spaces in secure garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, pet spa, and golf simulator.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 5.1
      },
      "evening": {
        "minutes": 11,
        "miles": 5.1
      }
    }
  },
  {
    "id": "rentcast:timberlake-2bed",
    "name": "Timberlake Apartments",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2255 Club Meridian Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7135,
      "lng": -84.4172
    },
    "propertyType": "apartment",
    "price": 1520,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1020,
    "yearBuilt": 2011,
    "daysOnMarket": 6,
    "url": "https://www.dtnmgt.com/properties/timberlake",
    "galleryUrl": "https://www.dtnmgt.com/properties/timberlake#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Scenic apartment community overlooking protected wetlands. Includes 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and pool.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 4.4
      },
      "evening": {
        "minutes": 10,
        "miles": 4.4
      }
    }
  },
  {
    "id": "rentcast:the-oaks-okemos-2bed",
    "name": "The Oaks at Okemos",
    "operator": "Morgan Communities",
    "sourceType": "reit_operator",
    "address": {
      "line1": "4600 Arbor Dr",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7085,
      "lng": -84.4095
    },
    "propertyType": "apartment",
    "price": 1640,
    "beds": 2,
    "baths": 2,
    "sqft": 1120,
    "yearBuilt": 2013,
    "daysOnMarket": 5,
    "url": "https://www.theoaksokemos.com/",
    "galleryUrl": "https://www.theoaksokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Upscale residential community with direct trail connectivity. Includes 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and private balcony.",
    "commute": {
      "morning": {
        "minutes": 10,
        "miles": 4.8
      },
      "evening": {
        "minutes": 11,
        "miles": 4.8
      }
    }
  },
  {
    "id": "rentcast:briarwood-okemos-2bed",
    "name": "Briarwood of Okemos",
    "operator": "Friedman Communities",
    "sourceType": "reit_operator",
    "address": {
      "line1": "1900 Hamilton Rd",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7012,
      "lng": -84.4251
    },
    "propertyType": "condo",
    "price": 1480,
    "beds": 2,
    "baths": 2,
    "sqft": 1080,
    "yearBuilt": 2009,
    "daysOnMarket": 8,
    "url": "https://www.briarwoodokemos.com/",
    "galleryUrl": "https://www.briarwoodokemos.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Quiet condominium neighborhood in top Okemos school district. Features private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and fireplace.",
    "commute": {
      "morning": {
        "minutes": 11,
        "miles": 5.5
      },
      "evening": {
        "minutes": 12,
        "miles": 5.5
      }
    }
  },
  {
    "id": "rentcast:berrytree-okemos-2bed",
    "name": "Berrytree Apartment Homes",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3491 Okemos Rd",
      "city": "Okemos",
      "state": "MI",
      "zip": "48864",
      "lat": 42.7245,
      "lng": -84.4325
    },
    "propertyType": "apartment",
    "price": 1495,
    "beds": 2,
    "baths": 1.5,
    "sqft": 990,
    "yearBuilt": 2007,
    "daysOnMarket": 3,
    "url": "https://www.dtnmgt.com/properties/berrytree",
    "galleryUrl": "https://www.dtnmgt.com/properties/berrytree#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Conveniently located at Okemos Rd and Grand River. Features 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, tennis courts, and pool.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 4.2
      },
      "evening": {
        "minutes": 10,
        "miles": 4.2
      }
    }
  },
  {
    "id": "rentcast:nemoke-trails-2bed",
    "name": "Nemoke Trails Apartments",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "5498 Nemoke Dr",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7385,
      "lng": -84.4095
    },
    "propertyType": "apartment",
    "price": 1560,
    "beds": 2,
    "baths": 2,
    "sqft": 1080,
    "yearBuilt": 2006,
    "daysOnMarket": 3,
    "url": "https://www.dtnmgt.com/properties/nemoke-trails",
    "galleryUrl": "https://www.dtnmgt.com/properties/nemoke-trails#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Wooded Haslett lakeside community near Lake Lansing parks. Features 2-car covered carports, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and private deck.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.8
      },
      "evening": {
        "minutes": 10,
        "miles": 3.8
      }
    }
  },
  {
    "id": "rentcast:nemoke-trails-1bed",
    "name": "Nemoke Trails 1-Bedroom",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "5498 Nemoke Dr",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7385,
      "lng": -84.4095
    },
    "propertyType": "apartment",
    "price": 1295,
    "beds": 1,
    "baths": 1,
    "sqft": 760,
    "yearBuilt": 2006,
    "daysOnMarket": 5,
    "url": "https://www.dtnmgt.com/properties/nemoke-trails",
    "galleryUrl": "https://www.dtnmgt.com/properties/nemoke-trails#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Cozy 1-bedroom retreat with scenic nature view. Features 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and fitness room.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.8
      },
      "evening": {
        "minutes": 10,
        "miles": 3.8
      }
    }
  },
  {
    "id": "rentcast:woodside-meadows-2bed",
    "name": "Woodside Meadows Residences",
    "operator": "Boutique Properties Lansing",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1820 Lake Lansing Rd",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7485,
      "lng": -84.4025
    },
    "propertyType": "condo",
    "price": 1620,
    "beds": 2,
    "baths": 2,
    "sqft": 1150,
    "yearBuilt": 2014,
    "daysOnMarket": 2,
    "url": "https://www.hasletthomes.com/woodside-meadows",
    "galleryUrl": "https://www.hasletthomes.com/woodside-meadows#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Private condominium setting close to Lake Lansing beach. Includes private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and deck.",
    "commute": {
      "morning": {
        "minutes": 10,
        "miles": 4.2
      },
      "evening": {
        "minutes": 11,
        "miles": 4.2
      }
    }
  },
  {
    "id": "rentcast:lake-lansing-apts-2bed",
    "name": "Lake Lansing Parkside Apartments",
    "operator": "Monarch Investment",
    "sourceType": "reit_operator",
    "address": {
      "line1": "6125 Lake Lansing Rd",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7521,
      "lng": -84.3985
    },
    "propertyType": "apartment",
    "price": 1440,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1010,
    "yearBuilt": 2011,
    "daysOnMarket": 6,
    "url": "https://www.lakelansingapts.com/",
    "galleryUrl": "https://www.lakelansingapts.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Steps from Lake Lansing South Park and boat launch. Offers 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and community garden.",
    "commute": {
      "morning": {
        "minutes": 10,
        "miles": 4.5
      },
      "evening": {
        "minutes": 11,
        "miles": 4.5
      }
    }
  },
  {
    "id": "rentcast:greenview-townhomes-2bed",
    "name": "Greenview Townhomes",
    "operator": "Prime Housing Group",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1410 Lake Lansing Rd",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7462,
      "lng": -84.3915
    },
    "propertyType": "townhome",
    "price": 1680,
    "beds": 2,
    "baths": 2,
    "sqft": 1250,
    "yearBuilt": 2018,
    "daysOnMarket": 4,
    "url": "https://greenviewtownhomes.com/",
    "galleryUrl": "https://greenviewtownhomes.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Two-story luxury townhome with attached 2-car garage. Pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, granite island, and private patio.",
    "commute": {
      "morning": {
        "minutes": 11,
        "miles": 4.8
      },
      "evening": {
        "minutes": 12,
        "miles": 4.8
      }
    }
  },
  {
    "id": "rentcast:haslett-arms-2bed",
    "name": "Haslett Arms Residences",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "1555 Haslett Rd",
      "city": "Haslett",
      "state": "MI",
      "zip": "48840",
      "lat": 42.7352,
      "lng": -84.4052
    },
    "propertyType": "apartment",
    "price": 1380,
    "beds": 2,
    "baths": 1,
    "sqft": 940,
    "yearBuilt": 2008,
    "daysOnMarket": 7,
    "url": "https://www.dtnmgt.com/properties/haslett-arms",
    "galleryUrl": "https://www.dtnmgt.com/properties/haslett-arms#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Peaceful community in Haslett school district. Features 2 covered carport spaces, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and large storage rooms.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.9
      },
      "evening": {
        "minutes": 10,
        "miles": 3.9
      }
    }
  },
  {
    "id": "rentcast:stadium-district-2bed",
    "name": "Stadium District Lofts",
    "operator": "Gillespie Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "505 E Michigan Ave",
      "city": "Lansing",
      "state": "MI",
      "zip": "48912",
      "lat": 42.7335,
      "lng": -84.5458
    },
    "propertyType": "apartment",
    "price": 1950,
    "beds": 2,
    "baths": 2,
    "sqft": 1180,
    "yearBuilt": 2018,
    "daysOnMarket": 1,
    "url": "https://gillespie-group.com/properties/stadium-district/",
    "galleryUrl": "https://gillespie-group.com/properties/stadium-district/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Premier urban living overlooking Jackson Field ballpark. Includes 2 covered parking spaces in attached garage structure, pet friendly welcoming 2 small dogs with dog wash station, in-unit washer and dryer, central A/C, and rooftop patio.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.6
      },
      "evening": {
        "minutes": 11,
        "miles": 3.6
      }
    }
  },
  {
    "id": "rentcast:stadium-district-1bed",
    "name": "Stadium District 1-Bed Loft",
    "operator": "Gillespie Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "505 E Michigan Ave",
      "city": "Lansing",
      "state": "MI",
      "zip": "48912",
      "lat": 42.7335,
      "lng": -84.5458
    },
    "propertyType": "apartment",
    "price": 1520,
    "beds": 1,
    "baths": 1,
    "sqft": 820,
    "yearBuilt": 2018,
    "daysOnMarket": 3,
    "url": "https://gillespie-group.com/properties/stadium-district/",
    "galleryUrl": "https://gillespie-group.com/properties/stadium-district/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Modern industrial loft with soaring ceilings and downtown views. Offers 2 covered parking spaces in attached garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, and central air conditioning.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.6
      },
      "evening": {
        "minutes": 11,
        "miles": 3.6
      }
    }
  },
  {
    "id": "rentcast:prudden-wheel-lofts-2bed",
    "name": "Prudden Wheel Historic Lofts",
    "operator": "Gillespie Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "700 May St",
      "city": "Lansing",
      "state": "MI",
      "zip": "48906",
      "lat": 42.7425,
      "lng": -84.5462
    },
    "propertyType": "apartment",
    "price": 1875,
    "beds": 2,
    "baths": 2,
    "sqft": 1240,
    "yearBuilt": 2017,
    "daysOnMarket": 4,
    "url": "https://gillespie-group.com/properties/prudden-wheel-lofts/",
    "galleryUrl": "https://gillespie-group.com/properties/prudden-wheel-lofts/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Historic wheel factory converted into high-ceiling timber lofts. Features heated garage parking for 2 cars, pet friendly welcoming 2 small dogs with dedicated dog run, in-unit washer and dryer, central A/C, and fitness center.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 4.2
      },
      "evening": {
        "minutes": 10,
        "miles": 4.2
      }
    }
  },
  {
    "id": "rentcast:prudden-wheel-lofts-1bed",
    "name": "Prudden Wheel 1-Bed Loft",
    "operator": "Gillespie Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "700 May St",
      "city": "Lansing",
      "state": "MI",
      "zip": "48906",
      "lat": 42.7425,
      "lng": -84.5462
    },
    "propertyType": "apartment",
    "price": 1490,
    "beds": 1,
    "baths": 1,
    "sqft": 880,
    "yearBuilt": 2017,
    "daysOnMarket": 2,
    "url": "https://gillespie-group.com/properties/prudden-wheel-lofts/",
    "galleryUrl": "https://gillespie-group.com/properties/prudden-wheel-lofts/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Exposed brick timber loft with polished concrete floors. Includes heated garage parking for 2 cars, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, and central air conditioning.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 4.2
      },
      "evening": {
        "minutes": 10,
        "miles": 4.2
      }
    }
  },
  {
    "id": "rentcast:metroplace-2bed",
    "name": "Metroplace Luxury Downtown",
    "operator": "Ferguson Development",
    "sourceType": "reit_operator",
    "address": {
      "line1": "301 S Washington Sq",
      "city": "Lansing",
      "state": "MI",
      "zip": "48933",
      "lat": 42.7312,
      "lng": -84.5535
    },
    "propertyType": "apartment",
    "price": 1820,
    "beds": 2,
    "baths": 2,
    "sqft": 1110,
    "yearBuilt": 2019,
    "daysOnMarket": 3,
    "url": "https://metroplacelansing.com/",
    "galleryUrl": "https://metroplacelansing.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "In the heart of downtown Lansing steps from the Capitol building. Features 2 reserved covered parking stalls in connected structure, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and resident lounge.",
    "commute": {
      "morning": {
        "minutes": 11,
        "miles": 4.5
      },
      "evening": {
        "minutes": 13,
        "miles": 4.5
      }
    }
  },
  {
    "id": "rentcast:outfield-lofts-2bed",
    "name": "Outfield Lofts",
    "operator": "Gillespie Group",
    "sourceType": "reit_operator",
    "address": {
      "line1": "505 E Michigan Ave",
      "city": "Lansing",
      "state": "MI",
      "zip": "48912",
      "lat": 42.7335,
      "lng": -84.5458
    },
    "propertyType": "apartment",
    "price": 1920,
    "beds": 2,
    "baths": 2,
    "sqft": 1160,
    "yearBuilt": 2018,
    "daysOnMarket": 2,
    "url": "https://gillespie-group.com/properties/outfield-lofts/",
    "galleryUrl": "https://gillespie-group.com/properties/outfield-lofts/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Panoramic views of the minor league ballpark outfield. Includes 2 covered parking spaces in attached garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and clubhouse.",
    "commute": {
      "morning": {
        "minutes": 9,
        "miles": 3.6
      },
      "evening": {
        "minutes": 11,
        "miles": 3.6
      }
    }
  },
  {
    "id": "rentcast:motor-wheel-lofts-2bed",
    "name": "Motor Wheel Lofts",
    "operator": "Kincaid Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "707 Prudden St",
      "city": "Lansing",
      "state": "MI",
      "zip": "48906",
      "lat": 42.7431,
      "lng": -84.5445
    },
    "propertyType": "condo",
    "price": 1850,
    "beds": 2,
    "baths": 2,
    "sqft": 1320,
    "yearBuilt": 2016,
    "daysOnMarket": 5,
    "url": "https://motorwheellofts.com/",
    "galleryUrl": "https://motorwheellofts.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Spectacular landmark building with massive 18-foot ceilings. Features private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and direct park access.",
    "commute": {
      "morning": {
        "minutes": 8,
        "miles": 4.1
      },
      "evening": {
        "minutes": 10,
        "miles": 4.1
      }
    }
  },
  {
    "id": "rentcast:skyvue-2bed",
    "name": "SkyVue Luxury Apartments",
    "operator": "Peak Campus",
    "sourceType": "reit_operator",
    "address": {
      "line1": "3165 E Michigan Ave",
      "city": "Lansing",
      "state": "MI",
      "zip": "48912",
      "lat": 42.7328,
      "lng": -84.5025
    },
    "propertyType": "apartment",
    "price": 1790,
    "beds": 2,
    "baths": 2,
    "sqft": 1090,
    "yearBuilt": 2017,
    "daysOnMarket": 3,
    "url": "https://liveskyvue.com/",
    "galleryUrl": "https://liveskyvue.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Convenient corridor linking East Lansing and Lansing along Michigan Ave. Includes 2 covered parking spaces in parking garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and elevated outdoor terrace.",
    "commute": {
      "morning": {
        "minutes": 6,
        "miles": 2.4
      },
      "evening": {
        "minutes": 7,
        "miles": 2.4
      }
    }
  },
  {
    "id": "rentcast:capitol-view-2bed",
    "name": "Capitol View Residences",
    "operator": "Eyde Development",
    "sourceType": "reit_operator",
    "address": {
      "line1": "110 S Chestnut St",
      "city": "Lansing",
      "state": "MI",
      "zip": "48933",
      "lat": 42.7325,
      "lng": -84.5612
    },
    "propertyType": "apartment",
    "price": 1580,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1050,
    "yearBuilt": 2015,
    "daysOnMarket": 6,
    "url": "https://eyde.com/properties/capitol-view",
    "galleryUrl": "https://eyde.com/properties/capitol-view#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Direct views of the Michigan State Capitol dome. Features 2 covered parking spaces in attached garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and fitness studio.",
    "commute": {
      "morning": {
        "minutes": 12,
        "miles": 4.8
      },
      "evening": {
        "minutes": 14,
        "miles": 4.8
      }
    }
  },
  {
    "id": "rentcast:knapps-centre-2bed",
    "name": "Knapp’s Centre Lofts",
    "operator": "Eyde Development",
    "sourceType": "reit_operator",
    "address": {
      "line1": "300 S Washington Sq",
      "city": "Lansing",
      "state": "MI",
      "zip": "48933",
      "lat": 42.7315,
      "lng": -84.5531
    },
    "propertyType": "apartment",
    "price": 1890,
    "beds": 2,
    "baths": 2,
    "sqft": 1210,
    "yearBuilt": 2016,
    "daysOnMarket": 4,
    "url": "https://eyde.com/properties/knapps-centre",
    "galleryUrl": "https://eyde.com/properties/knapps-centre#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Art Deco historic landmark completely transformed into premier downtown residences. Features 2 reserved covered parking stalls, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and atrium.",
    "commute": {
      "morning": {
        "minutes": 11,
        "miles": 4.6
      },
      "evening": {
        "minutes": 13,
        "miles": 4.6
      }
    }
  },
  {
    "id": "rentcast:autumn-ridge-dewitt-2bed",
    "name": "Autumn Ridge Executive Townhomes",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "12800 Autumn Ridge Dr",
      "city": "DeWitt",
      "state": "MI",
      "zip": "48820",
      "lat": 42.8254,
      "lng": -84.5745
    },
    "propertyType": "townhome",
    "price": 1950,
    "beds": 2,
    "baths": 2,
    "sqft": 1380,
    "yearBuilt": 2019,
    "daysOnMarket": 2,
    "url": "https://www.dtnmgt.com/properties/autumn-ridge",
    "galleryUrl": "https://www.dtnmgt.com/properties/autumn-ridge#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Top-rated DeWitt school district community. Features attached 2-car garage, pet friendly welcoming up to 2 dogs, private balcony, in-unit washer and dryer, central air conditioning, and community walking trail access.",
    "commute": {
      "morning": {
        "minutes": 15,
        "miles": 9.8
      },
      "evening": {
        "minutes": 17,
        "miles": 9.8
      }
    }
  },
  {
    "id": "rentcast:autumn-ridge-dewitt-3bed",
    "name": "Autumn Ridge 3-Bedroom Townhome",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "12800 Autumn Ridge Dr",
      "city": "DeWitt",
      "state": "MI",
      "zip": "48820",
      "lat": 42.8254,
      "lng": -84.5745
    },
    "propertyType": "townhome",
    "price": 2350,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1740,
    "yearBuilt": 2019,
    "daysOnMarket": 1,
    "url": "https://www.dtnmgt.com/properties/autumn-ridge",
    "galleryUrl": "https://www.dtnmgt.com/properties/autumn-ridge#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Expansive 3-bedroom residence with private wooded lawn. Offers attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and finished basement.",
    "commute": {
      "morning": {
        "minutes": 15,
        "miles": 9.8
      },
      "evening": {
        "minutes": 17,
        "miles": 9.8
      }
    }
  },
  {
    "id": "rentcast:prairie-creek-dewitt-2bed",
    "name": "Prairie Creek Apartments",
    "operator": "Monarch Investment",
    "sourceType": "reit_operator",
    "address": {
      "line1": "11400 Prairie Creek Dr",
      "city": "DeWitt",
      "state": "MI",
      "zip": "48820",
      "lat": 42.8195,
      "lng": -84.5685
    },
    "propertyType": "apartment",
    "price": 1520,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1040,
    "yearBuilt": 2012,
    "daysOnMarket": 5,
    "url": "https://www.prairiecreekdewitt.com/",
    "galleryUrl": "https://www.prairiecreekdewitt.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Scenic suburban enclave in DeWitt township. Features 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and outdoor swimming pool.",
    "commute": {
      "morning": {
        "minutes": 16,
        "miles": 10.2
      },
      "evening": {
        "minutes": 18,
        "miles": 10.2
      }
    }
  },
  {
    "id": "rentcast:rivers-edge-dewitt-2bed",
    "name": "River’s Edge Townhomes",
    "operator": "Boutique Properties Lansing",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1200 S Bridge St",
      "city": "DeWitt",
      "state": "MI",
      "zip": "48820",
      "lat": 42.8285,
      "lng": -84.5712
    },
    "propertyType": "townhome",
    "price": 1750,
    "beds": 2,
    "baths": 2,
    "sqft": 1290,
    "yearBuilt": 2016,
    "daysOnMarket": 4,
    "url": "https://dewittriversedge.com/",
    "galleryUrl": "https://dewittriversedge.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Charming townhome right along the Looking Glass River. Features attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and stone patio.",
    "commute": {
      "morning": {
        "minutes": 17,
        "miles": 11
      },
      "evening": {
        "minutes": 19,
        "miles": 11
      }
    }
  },
  {
    "id": "rentcast:georgetown-holt-2bed",
    "name": "Georgetown Townhomes",
    "operator": "Edward Rose & Sons",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2385 Cedar Park Dr",
      "city": "Holt",
      "state": "MI",
      "zip": "48842",
      "lat": 42.6358,
      "lng": -84.5215
    },
    "propertyType": "townhome",
    "price": 1590,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1210,
    "yearBuilt": 2012,
    "daysOnMarket": 6,
    "url": "https://www.edwardrose.com/communities/georgetown/",
    "galleryUrl": "https://www.edwardrose.com/communities/georgetown/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Tranquil South Lansing setting in Delhi Township. Offers attached 2-car garage, pet friendly welcoming 2 small dogs, private patio, in-unit washer/dryer, central air conditioning, and lush landscaping.",
    "commute": {
      "morning": {
        "minutes": 15,
        "miles": 11.2
      },
      "evening": {
        "minutes": 17,
        "miles": 11.2
      }
    }
  },
  {
    "id": "rentcast:georgetown-holt-3bed",
    "name": "Georgetown 3-Bed Townhome",
    "operator": "Edward Rose & Sons",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2385 Cedar Park Dr",
      "city": "Holt",
      "state": "MI",
      "zip": "48842",
      "lat": 42.6358,
      "lng": -84.5215
    },
    "propertyType": "townhome",
    "price": 1890,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1540,
    "yearBuilt": 2012,
    "daysOnMarket": 2,
    "url": "https://www.edwardrose.com/communities/georgetown/",
    "galleryUrl": "https://www.edwardrose.com/communities/georgetown/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Three-bedroom family townhome with direct backyard lawn. Features attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and large storage rooms.",
    "commute": {
      "morning": {
        "minutes": 15,
        "miles": 11.2
      },
      "evening": {
        "minutes": 17,
        "miles": 11.2
      }
    }
  },
  {
    "id": "rentcast:aspen-lakes-holt-2bed",
    "name": "Aspen Lakes Estates",
    "operator": "Continental Properties",
    "sourceType": "reit_operator",
    "address": {
      "line1": "2200 Aspen Lakes Dr",
      "city": "Holt",
      "state": "MI",
      "zip": "48842",
      "lat": 42.6415,
      "lng": -84.5312
    },
    "propertyType": "apartment",
    "price": 1680,
    "beds": 2,
    "baths": 2,
    "sqft": 1160,
    "yearBuilt": 2015,
    "daysOnMarket": 4,
    "url": "https://www.aspenlakesapts.com/",
    "galleryUrl": "https://www.aspenlakesapts.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Private gated lakefront community in Holt. Features private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, swimming pool, and lake trails.",
    "commute": {
      "morning": {
        "minutes": 16,
        "miles": 12.1
      },
      "evening": {
        "minutes": 18,
        "miles": 12.1
      }
    }
  },
  {
    "id": "rentcast:delhi-luxury-townhomes-2bed",
    "name": "Delhi Luxury Townhomes",
    "operator": "Prime Housing Group",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1980 Aurelius Rd",
      "city": "Holt",
      "state": "MI",
      "zip": "48842",
      "lat": 42.6435,
      "lng": -84.5152
    },
    "propertyType": "townhome",
    "price": 1620,
    "beds": 2,
    "baths": 2,
    "sqft": 1230,
    "yearBuilt": 2017,
    "daysOnMarket": 3,
    "url": "https://delhitownhomes.com/",
    "galleryUrl": "https://delhitownhomes.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Executive townhomes along Aurelius corridor. Includes attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and private lawn.",
    "commute": {
      "morning": {
        "minutes": 16,
        "miles": 11.8
      },
      "evening": {
        "minutes": 18,
        "miles": 11.8
      }
    }
  },
  {
    "id": "rentcast:river-walk-grand-ledge-2bed",
    "name": "River Walk Apartments & Townhomes",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "100 River Walk Dr",
      "city": "Grand Ledge",
      "state": "MI",
      "zip": "48837",
      "lat": 42.7585,
      "lng": -84.7452
    },
    "propertyType": "townhome",
    "price": 1780,
    "beds": 2,
    "baths": 2,
    "sqft": 1260,
    "yearBuilt": 2017,
    "daysOnMarket": 5,
    "url": "https://www.dtnmgt.com/properties/river-walk",
    "galleryUrl": "https://www.dtnmgt.com/properties/river-walk#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Picturesque Grand Ledge setting along the Grand River bluffs. Features attached 2-car garage, pet friendly welcoming 2 small dogs, private balcony, in-unit washer/dryer, central air conditioning, and open kitchen.",
    "commute": {
      "morning": {
        "minutes": 19,
        "miles": 14.1
      },
      "evening": {
        "minutes": 22,
        "miles": 14.1
      }
    }
  },
  {
    "id": "rentcast:river-walk-grand-ledge-3bed",
    "name": "River Walk 3-Bed Townhome",
    "operator": "DTN Management",
    "sourceType": "reit_operator",
    "address": {
      "line1": "100 River Walk Dr",
      "city": "Grand Ledge",
      "state": "MI",
      "zip": "48837",
      "lat": 42.7585,
      "lng": -84.7452
    },
    "propertyType": "townhome",
    "price": 2150,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1680,
    "yearBuilt": 2017,
    "daysOnMarket": 2,
    "url": "https://www.dtnmgt.com/properties/river-walk",
    "galleryUrl": "https://www.dtnmgt.com/properties/river-walk#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Luxury 3-bedroom townhome with river bluff views. Features attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and large deck.",
    "commute": {
      "morning": {
        "minutes": 19,
        "miles": 14.1
      },
      "evening": {
        "minutes": 22,
        "miles": 14.1
      }
    }
  },
  {
    "id": "rentcast:sundance-west-waverly-2bed",
    "name": "Sundance West Townhomes",
    "operator": "Continental Properties",
    "sourceType": "reit_operator",
    "address": {
      "line1": "6500 St Joseph Hwy",
      "city": "Lansing",
      "state": "MI",
      "zip": "48917",
      "lat": 42.7212,
      "lng": -84.6512
    },
    "propertyType": "townhome",
    "price": 1560,
    "beds": 2,
    "baths": 2,
    "sqft": 1190,
    "yearBuilt": 2014,
    "daysOnMarket": 4,
    "url": "https://sundancewest.com/",
    "galleryUrl": "https://sundancewest.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "West Lansing community near Delta Township commercial district. Includes attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and pool.",
    "commute": {
      "morning": {
        "minutes": 14,
        "miles": 9.2
      },
      "evening": {
        "minutes": 16,
        "miles": 9.2
      }
    }
  },
  {
    "id": "rentcast:canal-2-west-2bed",
    "name": "Canal 2 West Apartments",
    "operator": "Monarch Investment",
    "sourceType": "reit_operator",
    "address": {
      "line1": "601 N Canal Rd",
      "city": "Lansing",
      "state": "MI",
      "zip": "48917",
      "lat": 42.7412,
      "lng": -84.6652
    },
    "propertyType": "apartment",
    "price": 1495,
    "beds": 2,
    "baths": 2,
    "sqft": 1080,
    "yearBuilt": 2015,
    "daysOnMarket": 3,
    "url": "https://canal2west.com/",
    "galleryUrl": "https://canal2west.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Direct access to I-496 and Saginaw Hwy. Offers 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central air conditioning, and clubhouse.",
    "commute": {
      "morning": {
        "minutes": 15,
        "miles": 10.1
      },
      "evening": {
        "minutes": 17,
        "miles": 10.1
      }
    }
  },
  {
    "id": "rentcast:delta-river-townhomes-2bed",
    "name": "Delta River Townhomes",
    "operator": "Prime Housing Group",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "7200 Delta River Dr",
      "city": "Lansing",
      "state": "MI",
      "zip": "48906",
      "lat": 42.7685,
      "lng": -84.6585
    },
    "propertyType": "townhome",
    "price": 1620,
    "beds": 2,
    "baths": 2,
    "sqft": 1240,
    "yearBuilt": 2016,
    "daysOnMarket": 6,
    "url": "https://deltarivertownhomes.com/",
    "galleryUrl": "https://deltarivertownhomes.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Scenic river corridor townhome in Delta Township. Includes private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central A/C, and large yard.",
    "commute": {
      "morning": {
        "minutes": 13,
        "miles": 8.6
      },
      "evening": {
        "minutes": 15,
        "miles": 8.6
      }
    }
  },
  {
    "id": "rentcast:rayner-ponds-mason-2bed",
    "name": "Rayner Ponds Townhomes",
    "operator": "Boutique Properties Lansing",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1200 Rayner Ponds Dr",
      "city": "Mason",
      "state": "MI",
      "zip": "48854",
      "lat": 42.5854,
      "lng": -84.4412
    },
    "propertyType": "townhome",
    "price": 1650,
    "beds": 2,
    "baths": 2,
    "sqft": 1290,
    "yearBuilt": 2018,
    "daysOnMarket": 3,
    "url": "https://raynerponds.com/",
    "galleryUrl": "https://raynerponds.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Picturesque Ingham County seat location with direct pond frontage. Features attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and deck.",
    "commute": {
      "morning": {
        "minutes": 17,
        "miles": 13.5
      },
      "evening": {
        "minutes": 19,
        "miles": 13.5
      }
    }
  },
  {
    "id": "rentcast:rayner-ponds-mason-3bed",
    "name": "Rayner Ponds 3-Bed Executive",
    "operator": "Boutique Properties Lansing",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "1200 Rayner Ponds Dr",
      "city": "Mason",
      "state": "MI",
      "zip": "48854",
      "lat": 42.5854,
      "lng": -84.4412
    },
    "propertyType": "townhome",
    "price": 1950,
    "beds": 3,
    "baths": 2.5,
    "sqft": 1650,
    "yearBuilt": 2018,
    "daysOnMarket": 1,
    "url": "https://raynerponds.com/",
    "galleryUrl": "https://raynerponds.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Spacious three-bedroom townhome with luxury finishes. Offers attached 2-car garage, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and water views.",
    "commute": {
      "morning": {
        "minutes": 17,
        "miles": 13.5
      },
      "evening": {
        "minutes": 19,
        "miles": 13.5
      }
    }
  },
  {
    "id": "rentcast:jefferson-manor-mason-2bed",
    "name": "Jefferson Manor Residences",
    "operator": "Friedman Communities",
    "sourceType": "reit_operator",
    "address": {
      "line1": "800 S Jefferson St",
      "city": "Mason",
      "state": "MI",
      "zip": "48854",
      "lat": 42.5762,
      "lng": -84.4435
    },
    "propertyType": "apartment",
    "price": 1440,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1040,
    "yearBuilt": 2013,
    "daysOnMarket": 5,
    "url": "https://jeffersonmanormason.com/",
    "galleryUrl": "https://jeffersonmanormason.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Quiet historic Mason neighborhood setting. Features private 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and garden patio.",
    "commute": {
      "morning": {
        "minutes": 17,
        "miles": 13.2
      },
      "evening": {
        "minutes": 19,
        "miles": 13.2
      }
    }
  },
  {
    "id": "rentcast:park-lake-bath-2bed",
    "name": "Park Lake Townhomes",
    "operator": "Boutique Properties Lansing",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "14500 Webster Rd",
      "city": "Bath",
      "state": "MI",
      "zip": "48808",
      "lat": 42.8125,
      "lng": -84.4525
    },
    "propertyType": "townhome",
    "price": 1580,
    "beds": 2,
    "baths": 2,
    "sqft": 1220,
    "yearBuilt": 2017,
    "daysOnMarket": 2,
    "url": "https://parklakebath.com/",
    "galleryUrl": "https://parklakebath.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Country tranquility minutes from East Lansing and Hawk Hollow golf courses. Features attached 2-car garage, pet friendly welcoming 2 small dogs, in-unit washer and dryer, central air conditioning, and deck.",
    "commute": {
      "morning": {
        "minutes": 12,
        "miles": 7.8
      },
      "evening": {
        "minutes": 13,
        "miles": 7.8
      }
    }
  },
  {
    "id": "rentcast:rosewood-bath-2bed",
    "name": "Rosewood Residences",
    "operator": "Prime Housing Group",
    "sourceType": "boutique_pm",
    "address": {
      "line1": "13800 Main St",
      "city": "Bath",
      "state": "MI",
      "zip": "48808",
      "lat": 42.8195,
      "lng": -84.4485
    },
    "propertyType": "apartment",
    "price": 1420,
    "beds": 2,
    "baths": 1.5,
    "sqft": 1010,
    "yearBuilt": 2014,
    "daysOnMarket": 6,
    "url": "https://rosewoodbath.com/",
    "galleryUrl": "https://rosewoodbath.com/#gallery",
    "photos": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    "desc": "Peaceful community right off Webster Rd in Bath Township. Offers 2 covered carport spaces, pet friendly welcoming up to 2 dogs, in-unit washer and dryer, central A/C, and large lawn.",
    "commute": {
      "morning": {
        "minutes": 13,
        "miles": 8.2
      },
      "evening": {
        "minutes": 14,
        "miles": 8.2
      }
    }
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
      propertyType: item.propertyType as PropertyType,
      communityName: item.name,
      operator: item.operator,
      sourceType: item.sourceType as SourceType,
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
