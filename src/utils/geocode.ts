const LOCAL_KEY = "geocodeCache";
let geocodeCache: Record<string, [number, number]> = JSON.parse(
  localStorage.getItem(LOCAL_KEY) || "{}"
);

export async function geocodeCity(
  city: string
): Promise<[number, number] | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    city
  )}`;

  try {
    if (geocodeCache[city]) return geocodeCache[city];

    const response = await fetch(url);
    const result = await response.json();

    if (result && result.length > 0 && result[0].lat && result[0].lon) {
      const coords: [number, number] = [
        parseFloat(result[0].lat),
        parseFloat(result[0].lon),
      ];
      geocodeCache[city] = coords;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(geocodeCache));
      console.log("Geocode coords for", city, ":", coords);
      return coords;
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
