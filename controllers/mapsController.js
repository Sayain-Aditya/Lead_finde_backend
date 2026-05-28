const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// GET /geocode?city=Kanpur
const geocodeCity = async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "city query param is required" });

  try {
    const r = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: { address: `${city}, India`, key: GOOGLE_API_KEY },
    });
    const result = r.data.results?.[0];
    if (!result)
      return res.status(404).json({
        error: "City not found",
        googleStatus: r.data.status,
        errorMessage: r.data.error_message,
      });
    res.json(result.geometry.location);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /search?lat=&lng=&keyword=&radius=
const searchPlaces = async (req, res) => {
  const { lat, lng, keyword, radius = 8000 } = req.query;
  if (!lat || !lng || !keyword)
    return res.status(400).json({ error: "lat, lng and keyword are required" });

  try {
    let allResults = [];
    let pageToken = null;
    let pages = 0;

    do {
      const params = { location: `${lat},${lng}`, radius, keyword, key: GOOGLE_API_KEY };
      if (pageToken) params.pagetoken = pageToken;
      if (pageToken) await new Promise((r) => setTimeout(r, 2000));

      const r = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        { params }
      );

      if (r.data.status === "REQUEST_DENIED")
        return res.status(403).json({ error: "API key invalid or Places API not enabled." });

      allResults = [...allResults, ...(r.data.results || [])];
      pageToken = r.data.next_page_token || null;
      pages++;
    } while (pageToken && pages < 3);

    console.log(`✅ Found ${allResults.length} places for "${keyword}"`);
    res.json(allResults);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET /details?place_id=
const getPlaceDetails = async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: "place_id is required" });

  try {
    const r = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id,
        fields: "name,formatted_phone_number,website,formatted_address,rating",
        key: GOOGLE_API_KEY,
      },
    });
    res.json(r.data.result || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { geocodeCity, searchPlaces, getPlaceDetails };
