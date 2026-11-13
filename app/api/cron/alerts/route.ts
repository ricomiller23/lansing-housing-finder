import { NextRequest, NextResponse } from 'next/server';
import { dbGet } from '@/lib/db/redis';
import { listingRegistry } from '@/lib/providers';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET || 'dev-cron-secret-12345';

  if (authHeader !== `Bearer ${expectedSecret}` && request.nextUrl.searchParams.get('secret') !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  const alerts = (await dbGet<any[]>('active_alerts')) || [];
  const { listings } = await listingRegistry.getListings();

  let emailsSent = 0;
  if (process.env.RESEND_API_KEY && alerts.length > 0) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (const alert of alerts) {
      const matches = listings.filter((l) => {
        if (alert.maxRent && l.price > alert.maxRent) return false;
        if (alert.twoDogsRequired && l.petPolicy.twoDogsOk === 'no') return false;
        return true;
      }).slice(0, 5);

      if (matches.length > 0) {
        try {
          await resend.emails.send({
            from: 'Irvine Housing Finder <alerts@theADUstore.com>',
            to: alert.email,
            subject: `[Irvine Housing] ${matches.length} New Matches Found Near Deb's Office`,
            html: `<h3>New Matches Found Near 100 Progress, Irvine</h3>
                   <ul>${matches.map((m) => `<li><strong>${m.communityName || m.address.line1}</strong> - $${m.price}/mo (${m.beds}bd/${m.baths}ba, ${m.commute?.morning.minutes} min commute)</li>`).join('')}</ul>`,
          });
          emailsSent++;
        } catch (e) {
          console.error('Failed to send alert email:', e);
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    alertsChecked: alerts.length,
    emailsSent,
    timestamp: new Date().toISOString(),
  });
}
