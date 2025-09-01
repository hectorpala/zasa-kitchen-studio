export default async function handler(req, res) {
  // Solo GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Cache 12 horas
  res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');

  try {
    const PLACE_ID = 'ChIJaeFvFXtVYXsRCt0LqoLgqgE';
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!API_KEY) {
      console.error('Google Places API key not found');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const fields = 'rating,user_ratings_total,reviews';
    const language = req.query.language || 'es';
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=${fields}&language=${language}&key=${API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Google Places API error:', response.status);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google Places API status:', data.status);
      return res.status(500).json({ error: 'API request failed' });
    }

    const result = data.result;
    const reviews = (result.reviews || []).slice(0, 5).map(review => ({
      author: review.author_name,
      profileUrl: review.author_url,
      rating: review.rating,
      time: review.time,
      text: review.text,
      relativeTime: review.relative_time_description
    }));

    return res.status(200).json({
      rating: result.rating || 0,
      reviewCount: result.user_ratings_total || 0,
      reviews: reviews,
      googleUrl: `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}