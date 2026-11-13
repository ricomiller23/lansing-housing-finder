import { Commute, CommuteRoute } from '../providers/types';
import { getCachedCommute, setCachedCommute } from './cache';

export const WORK_LOCATION = {
  name: 'Central Office',
  address: '241 East Saginaw, East Lansing, MI 48824',
  lat: parseFloat(process.env.WORK_LAT || '42.7469328'),
  lng: parseFloat(process.env.WORK_LNG || '-84.4819344'),
  landmark: 'E Saginaw St (M-43) Corridor, East Lansing',
};

export function getGoogleMapsRouteUrl(originAddress?: string, originLat?: number, originLng?: number): string {
  const destination = encodeURIComponent(`${WORK_LOCATION.name}, ${WORK_LOCATION.address}`);
  let origin = '';
  if (originAddress && originAddress.trim().length > 0) {
    origin = encodeURIComponent(originAddress.trim());
  } else if (originLat && originLng) {
    origin = `${originLat},${originLng}`;
  } else {
    origin = 'East+Lansing,+MI';
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
}

export function getGoogleMapsEmbedUrl(originAddress?: string, originLat?: number, originLng?: number): string {
  const destination = encodeURIComponent(WORK_LOCATION.address);
  const origin = originAddress ? encodeURIComponent(originAddress) : `${originLat || 42.74},${originLng || -84.48}`;
  return `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&origin=${origin}&destination=${destination}&mode=driving`;
}

export function getPrimaryCorridor(lat: number, lng: number, city: string): string {
  const c = city.toLowerCase();
  if (c.includes('east lansing')) {
    if (lat > 42.75) return 'Abbott Rd / Lake Lansing Rd to E Saginaw';
    return 'E Saginaw St (M-43) Direct';
  }
  if (c.includes('okemos')) {
    return 'Marsh Rd / Grand River Ave (M-43) to Saginaw';
  }
  if (c.includes('haslett')) {
    return 'Lake Lansing Rd / Marsh Rd to E Saginaw';
  }
  if (c.includes('lansing')) {
    if (lat > 42.74) return 'E Saginaw St (M-43) Eastbound Arterial';
    return 'I-496 East to US-127 North to Saginaw Exit';
  }
  if (c.includes('dewitt')) {
    return 'US-127 South to E Saginaw St Exit';
  }
  if (c.includes('holt')) {
    return 'US-127 North to E Saginaw St Exit';
  }
  if (c.includes('grand ledge')) {
    return 'Saginaw Hwy (M-43) East / I-496 to US-127 N';
  }
  if (c.includes('mason')) {
    return 'US-127 North to Saginaw St Exit';
  }
  return 'E Saginaw St (M-43) Corridor';
}

function calculateHaversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fallback traffic-aware model based on Lansing & East Lansing road network
function estimateLansingTrafficCommute(straightMiles: number, originLat: number, originLng: number, city: string = 'East Lansing'): { morning: CommuteRoute; evening: CommuteRoute } {
  // Road network factor in Greater Lansing is typically 1.25x to 1.35x
  const drivingMiles = Math.round(straightMiles * 1.3 * 10) / 10;
  
  // Morning traffic model to 241 E Saginaw (arrival ~7:45 AM)
  let morningMinutes = Math.max(3, Math.round(drivingMiles * 1.7 + (drivingMiles > 8 ? 4 : 1)));
  let eveningMinutes = Math.max(4, Math.round(drivingMiles * 1.9 + (drivingMiles > 8 ? 5 : 2)));

  const c = city.toLowerCase();
  if (c.includes('east lansing')) {
    morningMinutes = Math.min(morningMinutes, 8);
    eveningMinutes = Math.min(eveningMinutes, 10);
  } else if (c.includes('okemos')) {
    morningMinutes = Math.min(morningMinutes, 14);
    eveningMinutes = Math.min(eveningMinutes, 16);
  } else if (c.includes('dewitt') || c.includes('holt')) {
    morningMinutes = Math.min(morningMinutes, 18);
    eveningMinutes = Math.min(eveningMinutes, 20);
  }

  const corridor = getPrimaryCorridor(originLat, originLng, city);

  return {
    morning: { minutes: morningMinutes, miles: drivingMiles, primaryCorridor: corridor },
    evening: { minutes: eveningMinutes, miles: drivingMiles, primaryCorridor: corridor },
  };
}

export async function computeCommute(originLat: number, originLng: number, originAddress?: string, city: string = 'East Lansing'): Promise<Commute> {
  const cached = getCachedCommute(originLat, originLng);
  if (cached) {
    if (!cached.googleMapsUrl) {
      cached.googleMapsUrl = getGoogleMapsRouteUrl(originAddress, originLat, originLng);
    }
    if (!cached.primaryCorridor) {
      cached.primaryCorridor = getPrimaryCorridor(originLat, originLng, city);
    }
    return cached;
  }

  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;
  const straightMiles = calculateHaversineMiles(originLat, originLng, WORK_LOCATION.lat, WORK_LOCATION.lng);
  const corridor = getPrimaryCorridor(originLat, originLng, city);
  const googleMapsUrl = getGoogleMapsRouteUrl(originAddress, originLat, originLng);

  if (!apiKey) {
    const estimated = estimateLansingTrafficCommute(straightMiles, originLat, originLng, city);
    const result: Commute = {
      morning: { ...estimated.morning, primaryCorridor: corridor, googleMapsUrl },
      evening: { ...estimated.evening, primaryCorridor: corridor, googleMapsUrl },
      computedAt: new Date().toISOString(),
      googleMapsUrl,
      primaryCorridor: corridor,
    };
    setCachedCommute(originLat, originLng, result);
    return result;
  }

  try {
    const url = 'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix';
    const payload = {
      origins: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: originLat,
                longitude: originLng,
              },
            },
          },
        },
      ],
      destinations: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: WORK_LOCATION.lat,
                longitude: WORK_LOCATION.lng,
              },
            },
          },
        },
      ],
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,condition',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.duration) {
        const seconds = parseInt(data[0].duration.replace('s', ''), 10);
        const meters = data[0].distanceMeters || (straightMiles * 1609.34);
        const minutes = Math.round(seconds / 60);
        const miles = Math.round((meters / 1609.34) * 10) / 10;

        const result: Commute = {
          morning: { minutes, miles, primaryCorridor: corridor, googleMapsUrl },
          evening: { minutes: Math.round(minutes * 1.1), miles, primaryCorridor: corridor, googleMapsUrl },
          computedAt: new Date().toISOString(),
          googleMapsUrl,
          primaryCorridor: corridor,
        };
        setCachedCommute(originLat, originLng, result);
        return result;
      }
    }
  } catch (err) {
    console.error('Routes API error, using Lansing traffic fallback:', err);
  }

  const fallback = estimateLansingTrafficCommute(straightMiles, originLat, originLng, city);
  const fallbackResult: Commute = {
    morning: { ...fallback.morning, primaryCorridor: corridor, googleMapsUrl },
    evening: { ...fallback.evening, primaryCorridor: corridor, googleMapsUrl },
    computedAt: new Date().toISOString(),
    googleMapsUrl,
    primaryCorridor: corridor,
  };
  setCachedCommute(originLat, originLng, fallbackResult);
  return fallbackResult;
}
