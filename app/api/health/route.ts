import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasRentcast = Boolean(process.env.RENTCAST_API_KEY);
  const hasGoogleServer = Boolean(process.env.GOOGLE_MAPS_SERVER_KEY);
  const hasGoogleClient = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: {
      rentcast: {
        configured: hasRentcast,
        status: hasRentcast ? 'active_live_api' : 'curated_luxury_spectrum_active',
      },
      apify: {
        configured: process.env.ENABLE_APIFY === 'true',
        status: process.env.ENABLE_APIFY === 'true' ? 'enabled' : 'disabled_default',
      },
      googleRoutes: {
        configured: hasGoogleServer,
        status: hasGoogleServer ? 'live_routes_api' : 'traffic_aware_oc_model_active',
      },
      googleMapsJs: {
        configured: hasGoogleClient,
        status: hasGoogleClient ? 'active' : 'interactive_canvas_fallback',
      },
      redisCache: {
        configured: hasUpstash,
        status: hasUpstash ? 'connected' : 'in_memory_lru_active',
      },
      resendEmail: {
        configured: hasResend,
        status: hasResend ? 'ready' : 'mock_logging_active',
      },
      anthropicLLM: {
        configured: hasAnthropic,
        status: hasAnthropic ? 'active' : 'deterministic_regex_extractor_active',
      },
    },
  });
}
