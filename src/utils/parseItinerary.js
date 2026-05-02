// src/utils/parseItinerary.js
// ─────────────────────────────────────────────────────────────
// Converts raw Claude itinerary text → structured day objects
// then geocodes each location via Mapbox
// ─────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN ||
  'pk.eyJ1Ijoid2lsZHBhdGgiLCJhIjoiY21vbm1kejJuMGV3MjJwb21jamZsdWY2dCJ9.GR8n4zLnQnWWGWyisXvPeQ';

const WILDLIFE_TAGS = {
  lion:      '🦁 Big cats',
  leopard:   '🐆 Leopard',
  cheetah:   '🐆 Cheetah',
  elephant:  '🐘 Elephants',
  rhino:     '🦏 Rhino',
  hippo:     '🦛 Hippo',
  giraffe:   '🦒 Giraffe',
  zebra:     '🦓 Zebra',
  gorilla:   '🦍 Gorillas',
  chimp:     '🐒 Chimps',
  buffalo:   '🐃 Buffalo',
  balloon:   '🎈 Balloon safari',
  cultural:  '🚶 Cultural visit',
  maasai:    '🚶 Maasai',
  village:   '🏘 Village visit',
  sundowner: '🌅 Sundowner',
  dinner:    '🍽 Bush dinner',
  breakfast: '🍳 Bush breakfast',
  champagne: '🥂 Champagne',
};

const GRADIENTS = {
  nairobi:    'linear-gradient(160deg,#0d1f0d,#2D4A2D,#5C7A3E)',
  mara:       'linear-gradient(160deg,#1a1200,#3d2e00,#8B6914)',
  masai:      'linear-gradient(160deg,#1a1200,#3d2e00,#8B6914)',
  serengeti:  'linear-gradient(160deg,#1a1400,#4a3800,#A07820)',
  amboseli:   'linear-gradient(160deg,#0d1a00,#1f3d00,#4a6e1a)',
  kruger:     'linear-gradient(160deg,#1a0d00,#3d1f00,#7a4a00)',
  okavango:   'linear-gradient(160deg,#001a12,#003d28,#1a7a50)',
  bwindi:     'linear-gradient(160deg,#0a1a0a,#1a3a1a,#2D5A2D)',
  entebbe:    'linear-gradient(160deg,#001020,#002040,#0a4a6a)',
  zanzibar:   'linear-gradient(160deg,#001a2a,#003a5a,#C8975A)',
  default:    'linear-gradient(160deg,#1a2a1a,#2D4A2D,#8B6914)',
};

function getGradient(location) {
  if (!location) return GRADIENTS.default;
  const l = location.toLowerCase();
  for (const [key, grad] of Object.entries(GRADIENTS)) {
    if (l.includes(key)) return grad;
  }
  return GRADIENTS.default;
}

function extractTags(text) {
  if (!text) return [];
  const l = text.toLowerCase();
  return Object.entries(WILDLIFE_TAGS)
    .filter(([key]) => l.includes(key))
    .map(([, tag]) => tag)
    .slice(0, 4);
}

function extractTravelMode(text) {
  if (!text) return 'flight';
  const l = text.toLowerCase();
  if (l.includes('drive') || l.includes('road') || l.includes('vehicle')) return 'drive';
  if (l.includes('boat') || l.includes('mokoro') || l.includes('canoe')) return 'boat';
  return 'flight';
}

// ─────────────────────────────────────────────────────────────
// CORE PARSER
// ─────────────────────────────────────────────────────────────
export function parseItineraryText(rawText) {
  if (!rawText) return [];

  const dayRegex = /(?:^|\n)\s*(?:\*{1,2})?(?:#{1,3}\s*)?day\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*[:\-–]?\s*([^\n*#]*)/gi;
  const wordToNum = { one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10 };

  const matches = [];
  let match;
  while ((match = dayRegex.exec(rawText)) !== null) {
    const numStr = match[1].toLowerCase();
    const dayNum = isNaN(numStr) ? (wordToNum[numStr] || matches.length + 1) : parseInt(numStr);
    matches.push({ dayNum, title: match[2].replace(/\*+/g, '').trim(), index: match.index });
  }

  if (matches.length === 0) return [];

  return matches.map((m, i) => {
    const blockEnd = i < matches.length - 1 ? matches[i + 1].index : rawText.length;
    const block = rawText.slice(m.index, blockEnd);
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

    // Description — lines after the heading that are NOT bullets, lodge, or meals
    // Capture up to 3 non-bullet lines as the narrative paragraph
    const descriptionLines = lines
      .slice(1) // skip the Day N: heading line
      .filter(l =>
        !/^\s*[-•*\d\.]\s+/.test(l) &&
        !/^lodge:/i.test(l) &&
        !/^meals:/i.test(l) &&
        !/^\*\*day/i.test(l) &&
        l.length > 20
      )
      .slice(0, 3)
    const description = descriptionLines.join(' ').replace(/\*+/g, '').trim() || null

    // Activities
    const activities = lines
      .filter(l => /^\s*[-•*\d\.]\s+/.test(l))
      .map(l => l.replace(/^\s*[-•*\d\.]+\s*/, '').replace(/\*+/g, '').trim())
      .filter(Boolean)
      .slice(0, 4)

    // Lodge
    const lodgeMatch = block.match(/(?:lodge|camp|hotel|stay|overnight|accommodation|staying at)[:\s]+([^.\n,*]+)/i)
    const lodge = lodgeMatch?.[1]?.replace(/\*+/g, '').trim() || null

    // Meals
    const mealMatch = block.match(/meals?[:\s]+([^\n*]+)/i)
    const meals = mealMatch?.[1]?.replace(/\*+/g, '').trim() || null

    const travelMode = extractTravelMode(block)
    const tags = extractTags(block)
    const location = m.title ||
      block.match(/(?:in|at|to|arrive|arriving at)\s+([A-Z][a-zA-Z\s]{3,30})/)?.[1]?.trim() ||
      `Day ${m.dayNum}`

    const blockLower = block.toLowerCase()
    const countryHints = { kenya:1,tanzania:1,uganda:1,botswana:1,zimbabwe:1,zambia:1,'south africa':1,namibia:1,rwanda:1 }
    const country = Object.keys(countryHints).find(c => blockLower.includes(c)) || null

    return {
      day_number:  m.dayNum,
      location:    location.replace(/^(the\s+)?/i, '').trim(),
      country,
      lodge,
      activities,
      description, // ← narrative paragraph
      tags,
      meals,
      travel_mode: travelMode,
      gradient:    getGradient(location),
      caption:     description, // alias for backward compat
      lat:         null,
      lon:         null,
    }
  })
}

// ─────────────────────────────────────────────────────────────
// GEOCODING
// Calls Mapbox Geocoding API for each day location
// Returns days array with lat/lon populated
// ─────────────────────────────────────────────────────────────
export async function geocodeDay(day) {
  if (!day.location) return day;
  try {
    const query = encodeURIComponent(`${day.location}${day.country ? ', ' + day.country : ''}, Africa`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&limit=1&types=place,region,poi`;
    const res = await fetch(url);
    const data = await res.json();
    const feature = data.features?.[0];
    if (feature) {
      return {
        ...day,
        lon: feature.center[0],
        lat: feature.center[1],
      };
    }
  } catch (e) {
    console.warn(`Geocoding failed for ${day.location}:`, e);
  }
  return day;
}

export async function geocodeAllDays(days) {
  return Promise.all(days.map(geocodeDay));
}

// ─────────────────────────────────────────────────────────────
// MAP BOUNDS
// Calculate center + zoom from geocoded days
// ─────────────────────────────────────────────────────────────
export function calculateMapBounds(days) {
  const geocoded = days.filter(d => d.lat && d.lon);
  if (geocoded.length === 0) return { centerLon: 36, centerLat: -2, zoom: 5 };

  const lons = geocoded.map(d => d.lon);
  const lats = geocoded.map(d => d.lat);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const spanLon = maxLon - minLon;
  const spanLat = maxLat - minLat;

  // Rough zoom from span
  const maxSpan = Math.max(spanLon, spanLat);
  const zoom = maxSpan > 15 ? 4 : maxSpan > 8 ? 5 : maxSpan > 4 ? 6 : 7;

  return {
    centerLon: +((minLon + maxLon) / 2).toFixed(5),
    centerLat: +((minLat + maxLat) / 2).toFixed(5),
    zoom,
  };
}

// ─────────────────────────────────────────────────────────────
// SUPABASE SAVE
// Saves itinerary + days in one transaction
// Call after geocoding is complete
// ─────────────────────────────────────────────────────────────
export async function saveItinerary(supabase, { formData, rawText, days }) {
  const bounds = calculateMapBounds(days);

  const countries = [...new Set(days.map(d => d.country).filter(Boolean))];
  const title = days[0]?.location
    ? `${days[0].location}${days.length > 3 ? ' & more' : ''}`
    : formData.destination;

  // 1. Insert itinerary row
  const { data: itinerary, error: iErr } = await supabase
    .from('itineraries')
    .insert({
      title,
      destination:      formData.destination,
      countries:        countries.length ? countries : [formData.destination],
      duration_days:    days.length,
      travelers:        parseInt(formData.travelers) || null,
      budget:           formData.budget,
      travel_month:     formData.month,
      interests:        formData.interests,
      raw_text:         rawText,
      map_center_lon:   bounds.centerLon,
      map_center_lat:   bounds.centerLat,
      map_zoom:         bounds.zoom,
    })
    .select()
    .single();

  if (iErr) throw iErr;

  // 2. Insert all days
  const dayRows = days.map(d => ({
    itinerary_id: itinerary.id,
    day_number:   d.day_number,
    location:     d.location,
    country:      d.country,
    lodge:        d.lodge,
    activities:   d.activities,
    tags:         d.tags,
    meals:        d.meals,
    travel_mode:  d.travel_mode,
    lat:          d.lat,
    lon:          d.lon,
    gradient:     d.gradient,
    caption:      d.caption,
  }));

  const { error: dErr } = await supabase
    .from('itinerary_days')
    .insert(dayRows);

  if (dErr) throw dErr;

  return itinerary;
}
