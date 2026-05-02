// api/claude.js
// ─────────────────────────────────────────────────────────────
// SAFE MERGE — preserves your existing proxy exactly.
// Added: if req.body.formData exists, build the structured
// prompt automatically. Otherwise passes req.body straight
// through (backwards compatible with all existing calls).
// ─────────────────────────────────────────────────────────────

export const config = { api: { bodyParser: true } }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const key = process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_KEY || null

  if (!key) {
    return res.status(500).json({
      error: 'No API key found',
      available_vars: Object.keys(process.env).filter(k => k.includes('ANTHROP') || k.includes('REACT'))
    })
  }

  // ── NEW: if the request comes from the new ItineraryCarousel
  // flow it will include { formData }. Build the structured prompt.
  // All existing calls that send { model, messages, system, ... }
  // directly will skip this block entirely — no behaviour change.
  let body = req.body

  if (req.body.formData) {
    const f = req.body.formData
    body = {
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: "You are WildPath's Safari AI Assistant — the most knowledgeable safari planning expert in Africa. You understand that Africa is a continent of 54 countries, not a single destination, and multi-country itineraries are completely normal. Be specific — name actual parks, real lodges. Write in British English. Be warm and expert, like a knowledgeable friend who is Africa's best safari planner. You represent WildPath — Africa's premier safari network.",
      messages: [{
        role: 'user',
        content: buildStructuredPrompt(f)
      }]
    }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// ─────────────────────────────────────────────────────────────
// Builds the structured prompt the parser expects.
// Called only when req.body.formData is present.
// ─────────────────────────────────────────────────────────────
function buildStructuredPrompt(f) {
  const expLabels = (f.experiences || []).join(', ')
  const countryLabels = (f.countries || []).join(', ')

  return `Please create a personalised safari itinerary based on these details:

EXPERIENCES: ${expLabels}
COUNTRIES / DESTINATIONS: ${countryLabels || f.destination}
DURATION: ${f.duration} days
TRAVEL MONTH: ${f.month}
BUDGET: ${f.budget} per person
TRAVEL STYLE: ${f.travelStyle || 'luxury'}
GROUP: ${f.groupType || 'couple'} (${f.groupSize || f.travelers || '2'} people)
${f.specificRequests ? 'SPECIFIC REQUESTS: ' + f.specificRequests : ''}

CRITICAL FORMATTING RULES — follow exactly so the itinerary displays as visual cards:

Format every day like this:

**Day 1: [Location / Park Name]**
[One vivid sentence setting the scene.]
- [Specific activity 1]
- [Specific activity 2]
- [Specific activity 3]
Lodge: [Real lodge or camp name]
Meals: [e.g. Breakfast and dinner included]

**Day 2: [Location / Park Name]**
[Scene-setting sentence.]
- [Activity 1]
- [Activity 2]
Lodge: [Lodge name]
Meals: [Details]

Continue for all ${f.duration} days.

Rules:
- Every day heading must start with **Day N:** followed by the location name — no exceptions
- Include Lodge: on its own line every single day
- Be specific — real lodge names, real park names, real experiences
- Mention wildlife likely in ${f.month}
- If crossing countries, note the travel method (fly / drive / boat)
- Do not add any text before **Day 1**
- After all days, add a short "Tips & practicalities" section`
}
