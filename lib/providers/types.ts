import { z } from 'zod';

export const PropertyTypeSchema = z.enum(['apartment', 'single_family', 'townhome', 'condo']);
export type PropertyType = z.infer<typeof PropertyTypeSchema>;

export const ProviderSourceSchema = z.enum([
  'rentcast',
  'apify-zillow',
  'apify-apartments',
  'apify-realtor',
  'manual',
]);
export type ProviderSource = z.infer<typeof ProviderSourceSchema>;

export const SourceTypeSchema = z.enum([
  'reit_operator',
  'private_landlord',
  'mls_broker',
  'boutique_pm',
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const AddressSchema = z.object({
  line1: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  lat: z.number(),
  lng: z.number(),
});
export type Address = z.infer<typeof AddressSchema>;

export const PetPolicySchema = z.object({
  dogsAllowed: z.union([z.boolean(), z.literal('unknown')]),
  maxPets: z.number().optional(),
  weightLimitLbs: z.number().optional(),
  breedRestrictions: z.array(z.string()).optional(),
  petRentMonthly: z.number().optional(),
  petDepositTotal: z.number().optional(),
  twoDogsOk: z.enum(['yes', 'no', 'unknown']),
  sourceSnippet: z.string().optional(),
});
export type PetPolicy = z.infer<typeof PetPolicySchema>;

export const ParkingSchema = z.object({
  coveredSpaces: z.number().optional(),
  type: z.enum(['garage', 'carport', 'covered_assigned', 'street', 'open_lot', 'unknown']).optional(),
  coveredConfirmed: z.boolean(),
  twoCarsCovered: z.enum(['yes', 'no', 'unknown']),
  sourceSnippet: z.string().optional(),
});
export type Parking = z.infer<typeof ParkingSchema>;

export const AmenitiesSchema = z.object({
  inUnitLaundry: z.boolean().optional(),
  fencedYard: z.boolean().optional(),
  pool: z.boolean().optional(),
  gym: z.boolean().optional(),
  ac: z.boolean().optional(),
  dishwasher: z.boolean().optional(),
  evCharging: z.boolean().optional(),
  gated: z.boolean().optional(),
});
export type Amenities = z.infer<typeof AmenitiesSchema>;

export const FeesSchema = z.object({
  deposit: z.number().optional(),
  applicationFee: z.number().optional(),
  adminFee: z.number().optional(),
  parkingFee: z.number().optional(),
  utilitiesEstimate: z.number().optional(),
});
export type Fees = z.infer<typeof FeesSchema>;

export const CommuteRouteSchema = z.object({
  minutes: z.number(),
  miles: z.number(),
  primaryCorridor: z.string().optional(),
  googleMapsUrl: z.string().optional(),
});
export type CommuteRoute = z.infer<typeof CommuteRouteSchema>;

export const CommuteSchema = z.object({
  morning: CommuteRouteSchema,
  evening: CommuteRouteSchema,
  computedAt: z.string(),
  googleMapsUrl: z.string().optional(),
  primaryCorridor: z.string().optional(),
});
export type Commute = z.infer<typeof CommuteSchema>;

export const ScoresSchema = z.object({
  lincolnParity: z.number(),
  value: z.number(),
  dogFriendly: z.number(),
  overall: z.number(),
});
export type Scores = z.infer<typeof ScoresSchema>;

export const ListingSchema = z.object({
  id: z.string(),
  provider: ProviderSourceSchema,
  url: z.string(),
  source_url: z.string().optional(),
  gallery_url: z.string().optional(),
  retrieved_at: z.string().optional(),
  address: AddressSchema,
  propertyType: PropertyTypeSchema,
  communityName: z.string().optional(),
  operator: z.string().optional(),
  sourceType: SourceTypeSchema.optional(),
  price: z.number(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.number().optional(),
  yearBuilt: z.number().optional(),
  listedDate: z.string().optional(),
  daysOnMarket: z.number().optional(),
  lastSeenAt: z.string(),
  photos: z.array(z.string()),
  description: z.string().optional(),
  petPolicy: PetPolicySchema,
  parking: ParkingSchema,
  amenities: AmenitiesSchema,
  fees: FeesSchema,
  commute: CommuteSchema.optional(),
  scores: ScoresSchema.optional(),
  flags: z.array(z.string()),
});
export type Listing = z.infer<typeof ListingSchema>;

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  maxDriveMinutes?: number;
  maxDriveMiles?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  propertyTypes?: PropertyType[];
  coveredParkingMode?: 'confirmed' | 'lenient' | 'any';
  twoDogsMode?: 'strict' | 'lenient';
  dogWeightEachLbs?: number;
  amenities?: Partial<Record<keyof Amenities, boolean>>;
  minYearBuilt?: number;
  maxDaysOnMarket?: number;
  sortBy?: 'overall' | 'price_asc' | 'price_desc' | 'commute' | 'sqft' | 'newest' | 'price_sqft';
  useWorstCaseCommute?: boolean;
  minLincolnParity?: number;
  hideBelowParity?: boolean;
  cities?: string[];
  operators?: string[];
  sourceTypes?: SourceType[];
  query?: string;
}

export interface ListingProvider {
  name: string;
  source: ProviderSource;
  fetchListings(params: {
    lat: number;
    lng: number;
    radiusMiles: number;
    limit?: number;
    city?: string;
    propertyTypes?: PropertyType[];
  }): Promise<Listing[]>;
}
