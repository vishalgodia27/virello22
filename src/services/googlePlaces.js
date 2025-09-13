const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

/**
 * Performs Google Places API Text Search (v1) and returns places.
 * Docs: https://developers.google.com/maps/documentation/places/web-service/search-text
 * @param {Object} params
 * @param {string} params.textQuery - Free-form text query.
 * @param {Object} [params.locationBias] - Optional biasing object, e.g. { circle: { center: { latitude, longitude }, radius: 5000 } }
 * @param {number} [params.maxResultCount=10] - Max number of places to return.
 * @returns {Promise<Array>} places array
 */
export async function searchPlacesText({ textQuery, locationBias, maxResultCount = 10 }) {
  if (!API_KEY) {
    throw new Error("Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in .env.local");
  }
  if (!textQuery || typeof textQuery !== "string") {
    throw new Error("textQuery is required and must be a string");
  }

  const url = "https://places.googleapis.com/v1/places:searchText";

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    // Request only fields we need to reduce payload size
    "X-Goog-FieldMask": [
      "places.id",
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.priceLevel",
      "places.rating",
      "places.userRatingCount",
      "places.internationalPhoneNumber",
      "places.websiteUri",
      "places.photos",
      "places.types"
    ].join(",")
  };

  const body = {
    textQuery,
    maxResultCount,
    locationBias
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Places Text Search failed: HTTP ${response.status} ${text}`);
  }

  const json = await response.json();
  return json?.places || [];
}

/**
 * Builds a public URL to fetch a photo for a place photo resource.
 * Each place photo has a name like: "places/AAA/photos/BBB".
 * Docs: https://developers.google.com/maps/documentation/places/web-service/photos
 * @param {string} photoName - Photo resource name from the Places response (places/.../photos/...).
 * @param {Object} [opts]
 * @param {number} [opts.maxWidthPx]
 * @param {number} [opts.maxHeightPx]
 * @returns {string} URL to the photo media.
 */
export function buildPlacePhotoUrl(photoName, { maxWidthPx, maxHeightPx } = {}) {
  if (!API_KEY) {
    throw new Error("Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in .env.local");
  }
  if (!photoName) return "";

  const base = `https://places.googleapis.com/v1/${photoName}/media`;
  const params = new URLSearchParams();
  params.set("key", API_KEY);
  if (maxWidthPx) params.set("maxWidthPx", String(maxWidthPx));
  if (maxHeightPx) params.set("maxHeightPx", String(maxHeightPx));

  return `${base}?${params.toString()}`;
}

/**
 * Convenience helper: search places and attach a 'photoUrl' if available.
 * @param {Object} args - same as searchPlacesText
 * @param {Object} [photoOpts]
 * @returns {Promise<Array>} places with photoUrl (if photos exist)
 */
export async function searchPlacesWithPhotos(args, photoOpts = { maxWidthPx: 800 }) {
  const places = await searchPlacesText(args);
  return places.map((p) => {
    const firstPhotoName = p?.photos?.[0]?.name;
    return {
      ...p,
      photoUrl: firstPhotoName ? buildPlacePhotoUrl(firstPhotoName, photoOpts) : ""
    };
  });
}


