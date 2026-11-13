import { NextRequest, NextResponse } from 'next/server';
import { listingRegistry } from '@/lib/providers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET || 'dev-cron-secret-12345';

  if (authHeader !== `Bearer ${expectedSecret}` && request.nextUrl.searchParams.get('secret') !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  const { listings, providersUsed } = await listingRegistry.getListings();

  return NextResponse.json({
    success: true,
    refreshedCount: listings.length,
    providersUsed,
    timestamp: new Date().toISOString(),
  });
}
