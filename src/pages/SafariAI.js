import React, { useState, useRef, useEffect } from 'react'

// ── DATA ─────────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  { id: 'big5', label: 'Big Five Game Drive', icon: '🦁' },
  { id: 'gorilla', label: 'Gorilla Trekking', icon: '🦍' },
  { id: 'chimp', label: 'Chimpanzee Trekking', icon: '🐒' },
  { id: 'migration', label: 'Great Migration', icon: '🐃' },
  { id: 'balloon', label: 'Hot Air Balloon', icon: '🎈' },
  { id: 'walking', label: 'Walking Safari', icon: '🥾' },
  { id: 'canoe', label: 'Canoe / Water Safari', icon: '🛶' },
  { id: 'photography', label: 'Photography Safari', icon: '📷' },
  { id: 'birding', label: 'Bird Watching', icon: '🦅' },
  { id: 'night', label: 'Night Game Drive', icon: '🌙' },
  { id: 'beach', label: 'Beach Extension', icon: '🏖️' },
  { id: 'cultural', label: 'Cultural Experiences', icon: '🏘️' },
  { id: 'luxury', label: 'Luxury Lodge Stay', icon: '✨' },
  { id: 'conservation', label: 'Conservation Experience', icon: '🌿' },
]

const COUNTRIES = [
  { id: 'kenya', label: 'Kenya', flag: '🇰🇪', note: 'Maasai Mara, Amboseli, Samburu' },
  { id: 'tanzania', label: 'Tanzania', flag: '🇹🇿', note: 'Serengeti, Ngorongoro, Zanzibar' },
  { id: 'uganda', label: 'Uganda', flag: '🇺🇬', note: 'Gorillas, Chimps, Queen Elizabeth' },
  { id: 'rwanda', label: 'Rwanda', flag: '🇷🇼', note: 'Gorillas, Golden Monkeys' },
  { id: 'botswana', label: 'Botswana', flag: '🇧🇼', note: 'Okavango, Chobe, Kalahari' },
  { id: 'southafrica', label: 'South Africa', flag: '🇿🇦', note: 'Kruger, Cape Town, Garden Route' },
  { id: 'namibia', label: 'Namibia', flag: '🇳🇦', note: 'Etosha, Sossusvlei, Skeleton Coast' },
  { id: 'zimbabwe', label: 'Zimbabwe', flag: '🇿🇼', note: 'Hwange, Mana Pools, Victoria Falls' },
  { id: 'zambia', label: 'Zambia', flag: '🇿🇲', note: 'South Luangwa, Lower Zambezi' },
  { id: 'ethiopia', label: 'Ethiopia', flag: '🇪🇹', note: 'Simien Mountains, Bale Mountains' },
  { id: 'mozambique', label: 'Mozambique', flag: '🇲🇿', note: 'Gorongosa, Bazaruto Islands' },
  { id: 'madagascar', label: 'Madagascar', flag: '🇲🇬', note: 'Lemurs, Rainforests, Beaches' },
]

const TRAVEL_STYLES = [
  { id: 'budget', label: 'Budget', desc: 'Camping & basic lodges', icon: '🎒' },
  { id: 'midrange', label: 'Mid-Range', desc: 'Comfortable lodges', icon: '🏡' },
  { id: 'luxury', label: 'Luxury', desc: 'Premium camps & lodges', icon: '⭐' },
  { id: 'ultralux', label: 'Ultra Luxury', desc: 'The very best in Africa', icon: '💎' },
]

const GROUP_TYPES = [
  { id: 'solo', label: 'Solo', icon: '🧍' },
  { id: 'couple', label: 'Couple', icon: '👫' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: 'Friends Group', icon: '👥' },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December','Flexible']

const DURATIONS = [5,6,7,8,9,10,11,12,14,16,18,21]

const BUDGET_RANGES = [
  { id: 'u3k', label: 'Under $3,000', desc: 'per person' },
  { id: '3_6k', label: '$3,000–$6,000', desc: 'per person' },
  { id: '6_10k', label: '$6,000–$10,000', desc: 'per person' },
  { id: '10_20k', label: '$10,000–$20,000', desc: 'per person' },
  { id: 'o20k', label: '$20,000+', desc: 'per person' },
]

const STEPS = ['Experiences', 'Destinations', 'Trip Details', 'Your Itinerary']

// ── HELPERS ──────────────────────────────────────────────────────────────────

function buildPrompt(form) {
  const experiences = form.experiences.map(id => EXPERIENCES.find(e => e.id === id)?.label).join(', ')
  const countries = form.countries.map(id => {
    const c = COUNTRIES.find(c => c.id === id)
    return c ? `${c.label} (${c.note})` : id
  }).join(', ')
  const style = TRAVEL_STYLES.find(s => s.id === form.travelStyle)?.label || form.travelStyle
  const group = GROUP_TYPES.find(g => g.id === form.groupType)?.label || form.groupType
  const budget = BUDGET_RANGES.find(b => b.id === form.budget)?.label || form.budget

  return `Please create a personalised safari itinerary for me based on these details:

EXPERIENCES I WANT: ${experiences}
COUNTRIES / REGIONS: ${countries}
DURATION: ${form.duration} days
TRAVEL MONTH: ${form.month}
BUDGET: ${budget} per person
TRAVEL STYLE: ${style}
GROUP TYPE: ${group} (${form.groupSize} people)
${form.specificRequests ? `SPECIFIC REQUESTS / DREAM EXPERIENCES: ${form.specificRequests}` : ''}

Important context: I understand Africa spans multiple countries and that combining destinations like Uganda gorilla trekking with Kenya's Maasai Mara in one trip is completely normal. Please plan the most logical routing between destinations, including internal flights where needed, and be specific about which parks, camps, and lodges you recommend. Include realistic travel times between locations.`
}

async function askClaude(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: `You are WildPath's Safari AI Assistant — the most knowledgeable safari planning expert in Africa. You have deep expertise across all major African safari destinations and understand that Africa is a continent of 54 countries, not a single destination.

Key expertise:
- Multi-country African itineraries and logical routing between them
- Seasonal considerations for each park and destination  
- Internal flight connections (Nairobi to Entebbe, Arusha to Kigali, etc.)
- Specific lodge and camp recommendations at every price point
- Wildlife seasonal calendars (calving, migration, gorilla habituation year-round, etc.)
- Realistic travel times and logistics between destinations
- Budget breakdowns including park fees, internal flights, accommodation

When creating itineraries:
1. Start with a brief overview explaining why this combination works and the best routing
2. Provide a clear day-by-day breakdown with specific parks, camps/lodges, and activities
3. Include internal flight connections with realistic durations
4. Give a realistic budget breakdown including accommodation, internal flights, park fees, and transfers
5. Note 2-3 specific wildlife highlights they can expect based on their travel month
6. End with 2 practical tips specific to their trip

Be specific — name actual parks, real lodges (Giraffe Manor, Bisate Lodge, Singita, andBeyond, etc.), and concrete experiences. Be warm and expert. Write in British English. Format clearly but conversationally — like a knowledgeable friend who happens to be Africa's best safari planner.

You represent WildPath — Africa's premier safari network.`,
      messages,
    }),
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  const data = await response.json()
  return data.content?.find(b => b.type === 'text')?.text || ''
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function MultiSelect({ options, selected, onToggle, columns = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt.id)
        return (
          <button key={opt.id} onClick={() => onToggle(opt.id)} style={{
            padding: '12px 14px', borderRadius: 'var(--radius-md)', textAlign: 'left',
            border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s ease',
            borderColor: isSelected ? 'var(--sand)' : 'var(--ivory-dark)',
            background: isSelected ? 'var(--sand-pale)' : 'var(--white)',
            fontFamily: 'var(--font-body)',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon || opt.flag}</div>
            <div style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, color: 'var(--earth)' }}>{opt.label}</div>
            {opt.note && <div style={{ fontSize: 11, color: 'var(--grey)', marginTop: 2 }}>{opt.note}</div>}
            {opt.desc && <div style={{ fontSize: 11, color: 'var(--grey)', marginTop: 2 }}>{opt.desc}</div>}
          </button>
        )
      })}
    </div>
  )
}

function SingleSelect({ options, selected, onSelect, columns = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
      {options.map(opt => {
        const isSelected = selected === opt.id
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)} style={{
            padding: '14px 16px', borderRadius: 'var(--radius-md)', textAlign: 'left',
            border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s ease',
            borderColor: isSelected ? 'var(--sand)' : 'var(--ivory-dark)',
            background: isSelected ? 'var(--sand-pale)' : 'var(--white)',
            fontFamily: 'var(--font-body)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{opt.icon}</div>
            <div style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: 'var(--earth)' }}>{opt.label}</div>
            {opt.desc && <div style={{ fontSize: 12, color: 'var(--grey)', marginTop: 2 }}>{opt.desc}</div>}
          </button>
        )
      })}
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function SafariAI() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    experiences: [],
    countries: [],
    duration: 10,
    month: 'Flexible',
    budget: '6_10k',
    travelStyle: 'luxury',
    groupType: 'couple',
    groupSize: '2',
    specificRequests: '',
  })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const toggle = (field, id) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter(x => x !== id) : [...prev[field], id]
    }))
  }

  const canProceed = () => {
    if (step === 0) return form.experiences.length > 0
    if (step === 1) return form.countries.length > 0
    if (step === 2) return form.budget && form.travelStyle && form.groupType
    return true
  }

  const generateItinerary = async () => {
    setStep(3)
    setLoading(true)
    const prompt = buildPrompt(form)
    const newMessages = [{ role: 'user', content: prompt }]
    try {
      const reply = await askClaude(newMessages)
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong — please try again.' }])
    }
    setLoading(false)
  }

  const sendFollowUp = async () => {
    if (!followUp.trim() || loading) return
    const text = followUp.trim()
    setFollowUp('')
    setLoading(true)
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    try {
      const reply = await askClaude(newMessages)
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong — please try again.' }])
    }
    setLoading(false)
  }

  const reset = () => {
    setStep(0)
    setMessages([])
    setFollowUp('')
    setLoading(false)
    setForm({ experiences: [], countries: [], duration: 10, month: 'Flexible', budget: '6_10k', travelStyle: 'luxury', groupType: 'couple', groupSize: '2', specificRequests: '' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)', paddingTop: 68 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A1108, #3D2B1F)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div className="section-label" style={{ color: '#E8B882', marginBottom: 12 }}>Powered by Claude AI</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#FAF6EF', marginBottom: 16, fontWeight: 300 }}>
          Safari AI Planner
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(250,246,239,0.7)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Tell us what you want and we'll build a personalised, day-by-day African safari itinerary — including multi-country routing, lodge recommendations, and a full budget breakdown.
        </p>

        {/* Step indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginTop: 32, maxWidth: 480, margin: '32px auto 0' }}>
            {STEPS.slice(0, 3).map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px',
                    background: i <= step ? 'var(--sand)' : 'rgba(250,246,239,0.2)',
                    color: i <= step ? '#1A1108' : 'rgba(250,246,239,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 11, color: i <= step ? '#E8B882' : 'rgba(250,246,239,0.4)' }}>{s}</div>
                </div>
                {i < 2 && <div style={{ flex: 2, height: 2, background: i < step ? 'var(--sand)' : 'rgba(250,246,239,0.15)', marginBottom: 22, transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── STEP 0: EXPERIENCES ── */}
        {step === 0 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 8 }}>What experiences do you want?</h2>
            <p style={{ fontSize: 14, color: 'var(--grey)', marginBottom: 28 }}>Select everything that excites you — you can combine as many as you like across different countries.</p>
            <MultiSelect options={EXPERIENCES} selected={form.experiences} onToggle={id => toggle('experiences', id)} columns={3} />
          </div>
        )}

        {/* ── STEP 1: DESTINATIONS ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 8 }}>Which countries interest you?</h2>
            <p style={{ fontSize: 14, color: 'var(--grey)', marginBottom: 28 }}>Select multiple — combining countries in one trip is completely normal in Africa. We'll plan the routing for you.</p>
            <MultiSelect options={COUNTRIES} selected={form.countries} onToggle={id => toggle('countries', id)} columns={3} />
          </div>
        )}

        {/* ── STEP 2: TRIP DETAILS ── */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: 36 }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 8 }}>Trip details</h2>
              <p style={{ fontSize: 14, color: 'var(--grey)' }}>The more specific you are, the better your itinerary will be.</p>
            </div>

            {/* Duration */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Duration</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setForm(p => ({ ...p, duration: d }))} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 14, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.15s',
                    borderColor: form.duration === d ? 'var(--sand)' : 'var(--ivory-dark)',
                    background: form.duration === d ? 'var(--sand-pale)' : 'var(--white)',
                    fontWeight: form.duration === d ? 600 : 400, color: 'var(--earth)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Month */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Travel Month</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MONTHS.map(m => (
                  <button key={m} onClick={() => setForm(p => ({ ...p, month: m }))} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 13, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.15s',
                    borderColor: form.month === m ? 'var(--sand)' : 'var(--ivory-dark)',
                    background: form.month === m ? 'var(--sand-pale)' : 'var(--white)',
                    fontWeight: form.month === m ? 600 : 400, color: 'var(--earth)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Budget Per Person</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {BUDGET_RANGES.map(b => (
                  <button key={b.id} onClick={() => setForm(p => ({ ...p, budget: b.id }))} style={{
                    padding: '14px 16px', borderRadius: 'var(--radius-md)', textAlign: 'left', cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.15s',
                    borderColor: form.budget === b.id ? 'var(--sand)' : 'var(--ivory-dark)',
                    background: form.budget === b.id ? 'var(--sand-pale)' : 'var(--white)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: form.budget === b.id ? 600 : 400, color: 'var(--earth)' }}>{b.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--grey)' }}>{b.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Travel Style</div>
              <SingleSelect options={TRAVEL_STYLES} selected={form.travelStyle} onSelect={id => setForm(p => ({ ...p, travelStyle: id }))} columns={4} />
            </div>

            {/* Group Type */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Travelling As</div>
              <SingleSelect options={GROUP_TYPES} selected={form.groupType} onSelect={id => setForm(p => ({ ...p, groupType: id }))} columns={4} />
            </div>

            {/* Group Size */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Number of Travellers</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1','2','3','4','5','6','7','8+'].map(n => (
                  <button key={n} onClick={() => setForm(p => ({ ...p, groupSize: n }))} style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)', fontSize: 14, cursor: 'pointer',
                    border: '1.5px solid', transition: 'all 0.15s',
                    borderColor: form.groupSize === n ? 'var(--sand)' : 'var(--ivory-dark)',
                    background: form.groupSize === n ? 'var(--sand-pale)' : 'var(--white)',
                    fontWeight: form.groupSize === n ? 600 : 400, color: 'var(--earth)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Requests */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Specific Requests or Dream Experiences</div>
              <p style={{ fontSize: 13, color: 'var(--grey)', marginBottom: 12 }}>Any specific lodges, parks, or experiences you have in mind? (e.g. "I want to stay at Giraffe Manor" or "must include Victoria Falls")</p>
              <textarea className="input-field" rows={3} value={form.specificRequests} onChange={e => setForm(p => ({ ...p, specificRequests: e.target.value }))} placeholder="e.g. I want to stay at Giraffe Manor in Nairobi and do a gorilla trek in Bwindi..." style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* ── STEP 3: ITINERARY ── */}
        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {loading && messages.length <= 1 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 24 }}>🌍</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 12 }}>Building your itinerary...</h3>
                <p style={{ fontSize: 14, color: 'var(--grey)' }}>Our AI is planning your perfect African safari.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--sand)', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Trip summary chips */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '16px 20px', background: 'var(--sand-pale)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(196,145,90,0.3)' }}>
                  <span className="tag">🗓️ {form.duration} days</span>
                  <span className="tag">📅 {form.month}</span>
                  <span className="tag">💰 {BUDGET_RANGES.find(b => b.id === form.budget)?.label}</span>
                  <span className="tag">✨ {TRAVEL_STYLES.find(s => s.id === form.travelStyle)?.label}</span>
                  <span className="tag">👥 {form.groupSize} {GROUP_TYPES.find(g => g.id === form.groupType)?.label}</span>
                  {form.countries.map(id => <span key={id} className="tag">{COUNTRIES.find(c => c.id === id)?.flag} {COUNTRIES.find(c => c.id === id)?.label}</span>)}
                </div>

                {/* Messages */}
                {messages.filter(m => m.role === 'assistant').map((msg, i) => (
                  <div key={i} className="card" style={{ padding: 32, fontSize: 15, lineHeight: 1.9, color: 'var(--earth)', whiteSpace: 'pre-wrap', animation: 'fadeIn 0.4s ease' }}>
                    {msg.content}
                  </div>
                ))}

                {/* Loading follow-up */}
                {loading && (
                  <div style={{ display: 'flex', gap: 8, padding: 20, background: 'var(--white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sand)', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />

                {/* Follow-up questions */}
                {!loading && (
                  <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 12 }}>Refine your itinerary</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      {["Can we shorten it to fewer days?", "What if we add a beach extension?", "Can you suggest cheaper lodge alternatives?", "What's the best internal flight routing?"].map((q, i) => (
                        <button key={i} onClick={() => { setFollowUp(q); }} style={{ padding: '6px 14px', fontSize: 12, borderRadius: 'var(--radius-full)', border: '1px solid var(--ivory-dark)', background: 'var(--ivory)', color: 'var(--earth)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          {q}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input className="input-field" value={followUp} onChange={e => setFollowUp(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendFollowUp()} placeholder="Ask anything about your itinerary..." style={{ flex: 1 }} />
                      <button onClick={sendFollowUp} disabled={!followUp.trim()} className="btn-primary" style={{ flexShrink: 0, opacity: followUp.trim() ? 1 : 0.5 }}>Ask →</button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', paddingTop: 8 }}>
                  <button onClick={reset} className="btn-secondary">Plan a different safari</button>
                  <a href="/operators/join" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    Book with a WildPath Operator →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NAVIGATION ── */}
        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--ivory-dark)' }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : null} className="btn-secondary" style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}>
              ← Back
            </button>
            <div style={{ fontSize: 13, color: 'var(--grey)' }}>
              {step === 0 && `${form.experiences.length} experience${form.experiences.length !== 1 ? 's' : ''} selected`}
              {step === 1 && `${form.countries.length} countr${form.countries.length !== 1 ? 'ies' : 'y'} selected`}
            </div>
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary" disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.4 }}>
                Continue →
              </button>
            ) : (
              <button onClick={generateItinerary} className="btn-primary" disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.4, minWidth: 180, justifyContent: 'center' }}>
                🌍 Build My Itinerary
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
