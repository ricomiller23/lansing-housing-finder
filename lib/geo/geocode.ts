export interface GeocodeResult {
  address: string;
  lat: number;
  lng: number;
}

export async function geocodeAddress(addressStr: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressStr)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results[0]?.geometry?.location) {
        return {
          address: data.results[0].formatted_address,
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
      }
    } catch (err) {
      console.error('Google Geocoding error:', err);
    }
  }

  // OpenStreetMap Nominatim fallback
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressStr)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'IrvineHousingFinder/1.0' } });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return {
        address: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error('Nominatim Geocoding error:', err);
  }

  return null;
}
