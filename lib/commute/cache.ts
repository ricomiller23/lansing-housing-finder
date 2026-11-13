import { CommuteRoute } from '../providers/types';

export interface CachedCommute {
  morning: CommuteRoute;
  evening: CommuteRoute;
  computedAt: string;
  googleMapsUrl?: string;
  primaryCorridor?: string;
}

const memoryCommuteCache = new Map<string, { data: CachedCommute; expiresAt: number }>();

export function getCommuteCacheKey(lat: number, lng: number): string {
  const roundedLat = lat.toFixed(4);
  const roundedLng = lng.toFixed(4);
  return `commute:${roundedLat},${roundedLng}`;
}

export function getCachedCommute(lat: number, lng: number): CachedCommute | null {
  const key = getCommuteCacheKey(lat, lng);
  const item = memoryCommuteCache.get(key);
  if (item && item.expiresAt > Date.now()) {
    return item.data;
  }
  return null;
}

export function setCachedCommute(lat: number, lng: number, data: CachedCommute): void {
  const key = getCommuteCacheKey(lat, lng);
  // Cache for 24 hours
  memoryCommuteCache.set(key, {
    data,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
}
