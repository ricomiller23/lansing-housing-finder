import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbSet } from '@/lib/db/redis';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const AlertSchema = z.object({
  email: z.string().email(),
  maxRent: z.number().optional(),
  maxDriveMinutes: z.number().optional(),
  minBeds: z.number().optional(),
  twoDogsRequired: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = AlertSchema.parse(body);

    const alerts = (await dbGet<any[]>('active_alerts')) || [];
    alerts.push({
      ...parsed,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });

    await dbSet('active_alerts', alerts);
    return NextResponse.json({ success: true, message: 'Saved search alert registered' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid alert configuration' }, { status: 400 });
  }
}
