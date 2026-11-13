export interface CommunityOperator {
  name: string;
  filterKey: string;
  category: string;
  officialUrl: string;
  description: string;
  lansingCoverage: string;
  phone?: string;
  sourceType: 'reit_operator' | 'private_landlord' | 'mls_broker' | 'boutique_pm';
}

export const UPSCALE_COMMUNITIES: CommunityOperator[] = [
  {
    "name": "DTN Management — East Lansing & Meridian",
    "filterKey": "DTN Management",
    "category": "East Lansing Premier Operator",
    "officialUrl": "https://www.dtnmgt.com/",
    "description": "East Lansing and Meridian Township premier multifamily developer operating The Abbot, Newman Lofts, Autumn Ridge, Nemoke Trails, Hidden Tree, and River Walk with garage structures and pet-friendly policies.",
    "lansingCoverage": "East Lansing (48823, 48824), Okemos (48864), Haslett (48840), DeWitt (48820), Grand Ledge (48837)",
    "phone": "(517) 351-1800",
    "sourceType": "reit_operator"
  },
  {
    "name": "Gillespie Group — Lansing Urban Lofts",
    "filterKey": "Gillespie Group",
    "category": "Urban Loft Developer",
    "officialUrl": "https://gillespie-group.com/",
    "description": "Pioneering urban lofts and mid-rises in Downtown Lansing, Stadium District, and REO Town including Stadium District Lofts, Outfield Lofts, and Prudden Wheel Lofts with attached heated garages and pet wash stations.",
    "lansingCoverage": "Downtown Lansing (48933), Stadium District (48912), Old Town (48906)",
    "phone": "(517) 333-2150",
    "sourceType": "reit_operator"
  },
  {
    "name": "Eyde Development — Okemos & Lansing",
    "filterKey": "Eyde Development",
    "category": "Suburban Luxury Developer",
    "officialUrl": "https://eyde.com/",
    "description": "Master developer of Elevation Apartments at Central Park in Okemos, Capitol View, and Knapp’s Centre Lofts, offering modern residences with structured garage parking and trail connectivity.",
    "lansingCoverage": "Okemos (48864), Downtown Lansing (48933), and Meridian Township",
    "phone": "(517) 351-2480",
    "sourceType": "reit_operator"
  },
  {
    "name": "Continental Properties — Club Meridian & Sundance",
    "filterKey": "Continental Properties",
    "category": "Suburban Community Operator",
    "officialUrl": "https://www.continentalproperties.com/",
    "description": "Operates Club Meridian in Okemos, Aspen Lakes in Holt, and Sundance West with attached 2-car garage townhomes, dedicated dog runs, and resort pool amenities.",
    "lansingCoverage": "Okemos (48864), Holt (48842), Waverly (48917)",
    "phone": "(517) 349-8300",
    "sourceType": "reit_operator"
  },
  {
    "name": "Village Green — The Reserve at Okemos",
    "filterKey": "Village Green",
    "category": "Luxury Townhome Living",
    "officialUrl": "https://www.reserveatokemos.com/",
    "description": "Operates The Reserve at Okemos luxury townhome community featuring private attached 2-car garages, in-unit laundry, resort swimming pool, and pet-friendly policies welcoming 2 dogs.",
    "lansingCoverage": "Okemos (48864) near Jolly Rd & Okemos Rd",
    "phone": "(517) 347-7500",
    "sourceType": "reit_operator"
  },
  {
    "name": "Core Spaces — The Hub on Campus",
    "filterKey": "Core Spaces",
    "category": "Midtown East Lansing Mid-Rise",
    "officialUrl": "https://huboncampus.com/east-lansing/",
    "description": "Contemporary luxury mid-rise on Grand River Ave featuring access-controlled covered garage parking, rooftop terrace and pool, pet wash spa, and modern quartz finishes.",
    "lansingCoverage": "918 E Grand River Ave, East Lansing, MI 48823",
    "phone": "(517) 208-8888",
    "sourceType": "reit_operator"
  },
  {
    "name": "Chandler Crossings Communities",
    "filterKey": "Chandler",
    "category": "North East Lansing Master Plan",
    "officialUrl": "https://chandlercrossings.com/",
    "description": "Master-planned residential community along Chandler Rd featuring The Landings multi-level townhomes with attached 2-car garages, The Club, and The Village with private dog parks.",
    "lansingCoverage": "North East Lansing (48823) Chandler Rd corridor",
    "phone": "(517) 339-4000",
    "sourceType": "reit_operator"
  },
  {
    "name": "Monarch Investment & Management",
    "filterKey": "Monarch Investment",
    "category": "Regional Multifamily Operator",
    "officialUrl": "https://www.monarchinvestment.com/",
    "description": "National multifamily operator managing Castle Pointe in East Lansing, Prairie Creek in DeWitt, and Lake Lansing Parkside with 2 covered carport spaces and swimming pools.",
    "lansingCoverage": "East Lansing (48823), DeWitt (48820), Haslett (48840), West Lansing (48917)",
    "phone": "(517) 332-6800",
    "sourceType": "reit_operator"
  },
  {
    "name": "Edward Rose & Sons — Georgetown",
    "filterKey": "Edward Rose & Sons",
    "category": "Established Townhome Builder",
    "officialUrl": "https://www.edwardrose.com/",
    "description": "Established Michigan residential builder operating Georgetown Townhomes in Holt with attached 2-car private garages, in-unit laundry, and park-like grounds.",
    "lansingCoverage": "Holt / Delhi Township (48842)",
    "phone": "(517) 694-0689",
    "sourceType": "reit_operator"
  },
  {
    "name": "Peak Campus — SkyVue & 25 East",
    "filterKey": "Peak Campus",
    "category": "Modern Living Communities",
    "officialUrl": "https://liveskyvue.com/",
    "description": "Operates SkyVue along Michigan Ave and 25 East along Abbot Rd with covered structured parking, rooftop sky lounge, dog park, and fitness facilities.",
    "lansingCoverage": "Lansing (48912) and East Lansing (48823)",
    "phone": "(517) 325-9900",
    "sourceType": "reit_operator"
  },
  {
    "name": "Prime Housing Group",
    "filterKey": "Prime Housing Group",
    "category": "Boutique Residential Communities",
    "officialUrl": "https://primehousinggroup.com/",
    "description": "Boutique apartment and townhome management company operating Greenview Townhomes, Delta River Townhomes, Albert Meadow, and Delhi residences with garage parking.",
    "lansingCoverage": "East Lansing, Haslett, Holt, and Delta Township",
    "phone": "(517) 337-1133",
    "sourceType": "boutique_pm"
  },
  {
    "name": "Friedman Communities",
    "filterKey": "Friedman Communities",
    "category": "Midwest Property Management",
    "officialUrl": "https://www.friedmanrealestate.com/",
    "description": "Regional property manager operating Benson Hills in North East Lansing, Briarwood in Okemos, and Jefferson Manor in Mason with private garages and pet-friendly amenities.",
    "lansingCoverage": "East Lansing (48823), Okemos (48864), Mason (48854)",
    "phone": "(517) 339-1600",
    "sourceType": "reit_operator"
  }
];
