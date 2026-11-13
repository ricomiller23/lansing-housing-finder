import { NextRequest, NextResponse } from 'next/server';
import { listingRegistry, normalizeCityAlias } from '@/lib/providers';
import { SearchFilters, PropertyType, SourceType } from '@/lib/providers/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined;
    const maxDriveMinutes = searchParams.get('maxDriveMinutes') ? parseInt(searchParams.get('maxDriveMinutes')!, 10) : undefined;
    const maxDriveMiles = searchParams.get('maxDriveMiles') ? parseInt(searchParams.get('maxDriveMiles')!, 10) : undefined;
    const minBeds = searchParams.get('minBeds') ? parseInt(searchParams.get('minBeds')!, 10) : undefined;
    const minBaths = searchParams.get('minBaths') ? parseFloat(searchParams.get('minBaths')!) : undefined;
    const minSqft = searchParams.get('minSqft') ? parseInt(searchParams.get('minSqft')!, 10) : undefined;
    const coveredParkingMode = (searchParams.get('coveredParkingMode') as any) || 'lenient';
    const twoDogsMode = (searchParams.get('twoDogsMode') as any) || 'lenient';
    const sortBy = (searchParams.get('sortBy') as any) || 'overall';
    const hideBelowParity = searchParams.get('hideBelowParity') === 'true';
    const minLincolnParity = searchParams.get('minLincolnParity') ? parseInt(searchParams.get('minLincolnParity')!, 10) : 70;
    const useWorstCaseCommute = searchParams.get('useWorstCaseCommute') !== 'false';

    const citiesParam = searchParams.get('cities');
    const cities = citiesParam
      ? citiesParam
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .map((c) => (c.toLowerCase() === 'all' ? 'all' : normalizeCityAlias(c)))
      : undefined;

    const propTypesParam = searchParams.get('propertyTypes');
    const propertyTypes = propTypesParam
      ? (propTypesParam.split(',').map((p) => p.trim()).filter(Boolean) as PropertyType[])
      : undefined;

    const sourceTypesParam = searchParams.get('sourceTypes');
    const sourceTypes = sourceTypesParam
      ? (sourceTypesParam.split(',').map((s) => s.trim()).filter(Boolean) as SourceType[])
      : undefined;

    const operatorsParam = searchParams.get('operators');
    const operators = operatorsParam
      ? operatorsParam.split(',').map((o) => o.trim()).filter(Boolean)
      : undefined;

    const query = searchParams.get('q') || searchParams.get('query') || undefined;

    const filters: SearchFilters = {
      minPrice,
      maxPrice,
      maxDriveMinutes,
      maxDriveMiles,
      minBeds,
      minBaths,
      minSqft,
      propertyTypes,
      coveredParkingMode,
      twoDogsMode,
      sortBy,
      hideBelowParity,
      minLincolnParity,
      useWorstCaseCommute,
      cities,
      sourceTypes,
      operators,
      query,
    };

    const { listings, providersUsed } = await listingRegistry.getListings(filters);

    return NextResponse.json({
      listings,
      meta: {
        total: listings.length,
        fetchedAt: new Date().toISOString(),
        providers: providersUsed,
        activeCities: cities || ['all'],
        activePropertyTypes: propertyTypes || ['all'],
        cacheHit: true,
      },
    });
  } catch (err: any) {
    console.error('Listings API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
