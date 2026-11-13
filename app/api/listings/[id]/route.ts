import { NextRequest, NextResponse } from 'next/server';
import { listingRegistry } from '@/lib/providers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);

  const { listings } = await listingRegistry.getListings();
  const found = listings.find((item) => item.id === decodedId || item.id.endsWith(decodedId));

  if (!found) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json({ listing: found });
}
