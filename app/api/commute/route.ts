import { NextRequest, NextResponse } from 'next/server';
import { computeCommute } from '@/lib/commute/routes';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const CommuteRequestSchema = z.object({
  origins: z.array(
    z.object({
      id: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CommuteRequestSchema.parse(body);

    const results = await Promise.all(
      parsed.origins.map(async (origin) => {
        const commute = await computeCommute(origin.lat, origin.lng);
        return {
          id: origin.id,
          lat: origin.lat,
          lng: origin.lng,
          commute,
        };
      })
    );

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid commute request' }, { status: 400 });
  }
}
