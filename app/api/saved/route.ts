import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbSet, dbDelete } from '@/lib/db/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceToken = request.cookies.get('device_token')?.value || 'default-user';
  const saved = (await dbGet<string[]>(`saved:${deviceToken}`)) || [];
  const notes = (await dbGet<Record<string, string>>(`notes:${deviceToken}`)) || {};

  return NextResponse.json({ saved, notes });
}

export async function POST(request: NextRequest) {
  const deviceToken = request.cookies.get('device_token')?.value || 'default-user';
  const body = await request.json();
  const { listingId, action, note } = body; // action: 'favorite' | 'unfavorite' | 'note'

  const currentSaved = (await dbGet<string[]>(`saved:${deviceToken}`)) || [];
  const currentNotes = (await dbGet<Record<string, string>>(`notes:${deviceToken}`)) || {};

  if (action === 'favorite' && !currentSaved.includes(listingId)) {
    currentSaved.push(listingId);
    await dbSet(`saved:${deviceToken}`, currentSaved);
  } else if (action === 'unfavorite') {
    const updated = currentSaved.filter((id) => id !== listingId);
    await dbSet(`saved:${deviceToken}`, updated);
  }

  if (note !== undefined) {
    currentNotes[listingId] = note;
    await dbSet(`notes:${deviceToken}`, currentNotes);
  }

  return NextResponse.json({ saved: currentSaved, notes: currentNotes });
}
