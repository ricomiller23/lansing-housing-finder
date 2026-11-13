import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/geo/geocode';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Address parameter required' }, { status: 400 });
  }

  const result = await geocodeAddress(address);
  if (!result) {
    return NextResponse.json({ error: 'Failed to geocode address' }, { status: 404 });
  }

  return NextResponse.json(result);
}
