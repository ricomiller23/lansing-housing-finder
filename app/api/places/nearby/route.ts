import { NextRequest, NextResponse } from 'next/server';
import { getNearbyAmenities } from '@/lib/geo/places';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '33.6770191');
  const lng = parseFloat(searchParams.get('lng') || '-117.7602022');

  const amenities = await getNearbyAmenities(lat, lng);
  return NextResponse.json({ amenities });
}
