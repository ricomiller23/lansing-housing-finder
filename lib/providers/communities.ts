export interface CommunityOperator {
  name: string;
  category: string;
  officialUrl: string;
  description: string;
  lansingCoverage: string;
  phone?: string;
  sourceType: 'reit_operator' | 'private_landlord' | 'mls_broker' | 'boutique_pm';
}

export const UPSCALE_COMMUNITIES: CommunityOperator[] = [
  {
    name: 'DTN Management — East Lansing & Meridian',
    category: 'East Lansing Premier Operator',
    officialUrl: 'https://www.dtnmgt.com/',
    description:
      'Premier multifamily and executive apartment developer in East Lansing and Okemos, operating The Abbot, Newman Lofts, Autumn Ridge, and Nemoke Trails with covered structured garages and pet-friendly policies.',
    lansingCoverage: 'East Lansing (48823, 48824), Okemos (48864), Haslett (48840), DeWitt (48820)',
    phone: '(517) 351-1800',
    sourceType: 'reit_operator',
  },
  {
    name: 'Gillespie Group — Lansing Urban Lofts',
    category: 'Urban Loft Developer',
    officialUrl: 'https://gillespie-group.com/',
    description:
      'Pioneering urban lofts and mid-rises in Downtown Lansing, Stadium District, and REO Town including Stadium District Lofts, Outfield Lofts, and Prudden Wheel Lofts featuring attached heated garages and dog washes.',
    lansingCoverage: 'Downtown Lansing (48933), Stadium District (48912), Old Town (48906)',
    phone: '(517) 333-2150',
    sourceType: 'reit_operator',
  },
  {
    name: 'Eyde Development — Okemos',
    category: 'Suburban Luxury Developer',
    officialUrl: 'https://eyde.com/',
    description:
      'Master developer of Elevation Apartments and Central Park commercial corridors in Okemos, offering modern residences with garage parking and nature trail integration.',
    lansingCoverage: 'Okemos (48864) and Meridian Township',
    phone: '(517) 351-2480',
    sourceType: 'reit_operator',
  },
  {
    name: 'Continental Properties — The Reserve at Okemos',
    category: 'Suburban Community Operator',
    officialUrl: 'https://www.continentalproperties.com/',
    description:
      'Operates The Reserve at Okemos luxury apartment homes with direct-access private garages, private dog parks, and upscale interior appointments.',
    lansingCoverage: 'Okemos (48864) near Jolly Rd & Okemos Rd',
    phone: '(517) 347-7500',
    sourceType: 'reit_operator',
  },
  {
    name: 'Hub on Campus — Core Spaces',
    category: 'Midtown East Lansing Community',
    officialUrl: 'https://huboncampus.com/east-lansing/',
    description:
      'Contemporary mid-rise residential community at Grand River & Bogue featuring access-controlled covered garage stalls, resort rooftop amenities, and pet washing spa.',
    lansingCoverage: '918 E Grand River Ave, East Lansing, MI 48823',
    phone: '(517) 208-8888',
    sourceType: 'reit_operator',
  },
  {
    name: 'Village Green / Club Meridian',
    category: 'Okemos Country Club Living',
    officialUrl: 'https://www.clubmeridianapartments.com/',
    description:
      'Resort-style 1-, 2-, and 3-bedroom apartment homes on Marsh Rd with attached 2-car garages, in-unit laundry, outdoor pool, tennis courts, and dedicated bark park.',
    lansingCoverage: '4190 Marsh Rd, Okemos, MI 48864',
    phone: '(517) 349-8300',
    sourceType: 'reit_operator',
  },
];
