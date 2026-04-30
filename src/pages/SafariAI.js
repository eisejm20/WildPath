import React, { useState, useRef, useEffect } from 'react'

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
  { id: 'u3k', label: 'Under $3,000' },
  { id: '3_6k', label: '$3,000 - $6,000' },
  { id: '6_10k', label: '$6,000 - $10,000' },
  { id: '10_20k', label: '$10,000 - $20,000' },
  { id: 'o20k', label: '$20,000+' },
]

const STEPS = ['Experiences', 'Destinations', 'Trip Details']

const SYSTEM_PROMPT = "You are WildPath's Safari AI Assistant — the most knowledgeable safari planning expert in Africa. You understand that Africa is a continent of 54 countries, not a single destination, and multi-country itineraries are completely normal. When creating itineraries: 1) Start with a brief overview of why this combination works and the best routing 2) Provide a clear day-by-day breakdown with specific parks, camps/lodges, and activities 3) Include internal flight connections with realistic durations 4) Give a realistic budget breakdown 5) Note 2-3 specific wildlife highlights based on travel month 6) End with 2 practical tips. Be specific — name actual parks, real lodges (Giraffe Manor, Bisate Lodge, Singita, andBeyond, etc.). Write in British English. Be warm and expert, like a knowledgeable friend who is Africa's best safari planner. You represent WildPath — Africa's premier safari network."

export default function SafariAI() {
  const [step, setStep] = useState(0)
  const [experiences, setExperiences] = useState([])
  const [countries, setCountries] = useState([])
  const [duration, setDuration] = useState(10)
  const [month, setMonth] = useState('Flexible')
  const [budget, setBudget] = useState('6_10k')
  const [travelStyle, setTravelStyle] = useState('luxury')
  const [groupType, setGroupType] = useState('couple')
  const [groupSize, setGroupSize] = useState('2')
  const [specificRequests, setSpecificRequests] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [followUp, setFollowUp] = useState('')
  const [itineraryGenerated, setItineraryGenerated] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function toggleItem(list, setList, id) {
    if (list.includes(id)) setList(list.filter(x => x !== id))
    else setList([...list, id])
  }

  function buildPrompt() {
    const expLabels = experiences.map(id => EXPERIENCES.find(e => e.id === id)).filter(Boolean).map(e => e.label).join(', ')
    const countryLabels = countries.map(id => COUNTRIES.find(c => c.id === id)).filter(Boolean).map(c => c.label + ' (' + c.note + ')').join(', ')
    const styleLabel = TRAVEL_STYLES.find(s => s.id === travelStyle) ? TRAVEL_STYLES.find(s => s.id === travelStyle).label : travelStyle
    const groupLabel = GROUP_TYPES.find(g => g.id === groupType) ? GROUP_TYPES.find(g => g.id === groupType).label : groupType
    const budgetLabel = BUDGET_RANGES.find(b => b.id === budget) ? BUDGET_RANGES.find(b => b.id === budget).label : budget

    return 'Please create a personalised safari itinerary based on these details:\n\nEXPERIENCES: ' + expLabels + '\nCOUNTRIES: ' + countryLabels + '\nDURATION: ' + duration + ' days\nTRAVEL MONTH: ' + month + '\nBUDGET: ' + budgetLabel + ' per person\nTRAVEL STYLE: ' + styleLabel + '\nGROUP: ' + groupLabel + ' (' + groupSize + ' people)\n' + (specificRequests ? 'SPECIFIC REQUESTS: ' + specificRequests : '') + '\n\nImportant: I understand Africa spans multiple countries and combining destinations like Uganda gorilla trekking with Kenya safari in one trip is completely normal. Please plan logical routing between destinations including internal flights where needed.'
  }

  async function generateItinerary() {
    setStep(3)
    setItineraryGenerated(false)
    setLoading(true)
    const prompt = buildPrompt()
    const newMessages = [{ role: 'user', content: prompt }]
    setMessages(newMessages)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2500,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      const text = data.content && data.content[0] ? data.content[0].text : 'Sorry, something went wrong.'
      const updated = [...newMessages, { role: 'assistant', content: text }]
      setMessages(updated)
      setItineraryGenerated(true)
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  async function sendFollowUp() {
    if (!followUp.trim() || loading) return
    const text = followUp.trim()
    setFollowUp('')
    setLoading(true)
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      })
      const data = await res.json()
      const text2 = data.content && data.content[0] ? data.content[0].text : 'Sorry, something went wrong.'
      setMessages([...newMessages, { role: 'assistant', content: text2 }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong.' }])
    }
    setLoading(false)
  }

  function reset() {
    setStep(0)
    setExperiences([])
    setCountries([])
    setDuration(10)
    setMonth('Flexible')
    setBudget('6_10k')
    setTravelStyle('luxury')
    setGroupType('couple')
    setGroupSize('2')
    setSpecificRequests('')
    setMessages([])
    setFollowUp('')
    setLoading(false)
    setItineraryGenerated(false)
  }

  const btnStyle = (active) => ({
    padding: '10px 14px', borderRadius: '8px', textAlign: 'left',
    border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s ease',
    borderColor: active ? '#C4915A' : '#F0E8DC',
    background: active ? '#F5EBE0' : '#FFFFFF',
    fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF', paddingTop: 68 }}>
      <div style={{ background: 'linear-gradient(135deg, #1A1108, #3D2B1F)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#E8B882', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Powered by Claude AI</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#FAF6EF', marginBottom: 16, fontWeight: 300 }}>Safari AI Planner</h1>
        <p style={{ fontSize: 16, color: 'rgba(250,246,239,0.7)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
          Tell us what you want and we will build a personalised, day-by-day African safari itinerary — including multi-country routing, lodge recommendations, and a full budget breakdown.
        </p>
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginTop: 32, maxWidth: 400, margin: '32px auto 0' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 6px', background: i <= step ? '#C4915A' : 'rgba(250,246,239,0.15)', color: i <= step ? '#1A1108' : 'rgba(250,246,239,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 11, color: i <= step ? '#E8B882' : 'rgba(250,246,239,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{s}</div>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 2, height: 2, background: i < step ? '#C4915A' : 'rgba(250,246,239,0.15)', marginBottom: 22 }} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 8 }}>What experiences do you want?</h2>
            <p style={{ fontSize: 14, color: '#8B8070', marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>Select everything that excites you — you can combine as many as you like across different countries.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {EXPERIENCES.map(exp => (
                <button key={exp.id} onClick={() => toggleItem(experiences, setExperiences, exp.id)} style={btnStyle(experiences.includes(exp.id))}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{exp.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: experiences.includes(exp.id) ? 600 : 400 }}>{exp.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 8 }}>Which countries interest you?</h2>
            <p style={{ fontSize: 14, color: '#8B8070', marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>Select multiple — combining countries in one trip is completely normal. We will plan the routing.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {COUNTRIES.map(c => (
                <button key={c.id} onClick={() => toggleItem(countries, setCountries, c.id)} style={btnStyle(countries.includes(c.id))}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{c.flag}</div>
                  <div style={{ fontSize: 13, fontWeight: countries.includes(c.id) ? 600 : 400 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: '#8B8070', marginTop: 2 }}>{c.note}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 4 }}>Trip details</h2>
              <p style={{ fontSize: 14, color: '#8B8070', fontFamily: 'DM Sans, sans-serif' }}>The more specific you are, the better your itinerary.</p>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Duration</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => setDuration(d)} style={{ padding: '8px 16px', borderRadius: '999px', fontSize: 13, cursor: 'pointer', border: '1.5px solid', borderColor: duration === d ? '#C4915A' : '#F0E8DC', background: duration === d ? '#F5EBE0' : '#FFFFFF', fontWeight: duration === d ? 600 : 400, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' }}>
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Travel Month</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MONTHS.map(m => (
                  <button key={m} onClick={() => setMonth(m)} style={{ padding: '8px 16px', borderRadius: '999px', fontSize: 13, cursor: 'pointer', border: '1.5px solid', borderColor: month === m ? '#C4915A' : '#F0E8DC', background: month === m ? '#F5EBE0' : '#FFFFFF', fontWeight: month === m ? 600 : 400, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Budget Per Person</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {BUDGET_RANGES.map(b => (
                  <button key={b.id} onClick={() => setBudget(b.id)} style={{ padding: '12px 14px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', border: '1.5px solid', borderColor: budget === b.id ? '#C4915A' : '#F0E8DC', background: budget === b.id ? '#F5EBE0' : '#FFFFFF', fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F' }}>
                    <div style={{ fontSize: 13, fontWeight: budget === b.id ? 600 : 400 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: '#8B8070' }}>per person</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Travel Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {TRAVEL_STYLES.map(s => (
                  <button key={s.id} onClick={() => setTravelStyle(s.id)} style={{ padding: '14px 12px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', border: '1.5px solid', borderColor: travelStyle === s.id ? '#C4915A' : '#F0E8DC', background: travelStyle === s.id ? '#F5EBE0' : '#FFFFFF', fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: travelStyle === s.id ? 600 : 400 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#8B8070' }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Travelling As</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {GROUP_TYPES.map(g => (
                  <button key={g.id} onClick={() => setGroupType(g.id)} style={{ padding: '14px 12px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: '1.5px solid', borderColor: groupType === g.id ? '#C4915A' : '#F0E8DC', background: groupType === g.id ? '#F5EBE0' : '#FFFFFF', fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{g.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: groupType === g.id ? 600 : 400 }}>{g.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Number of Travellers</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['1','2','3','4','5','6','7','8+'].map(n => (
                  <button key={n} onClick={() => setGroupSize(n)} style={{ width: 44, height: 44, borderRadius: '8px', fontSize: 14, cursor: 'pointer', border: '1.5px solid', borderColor: groupSize === n ? '#C4915A' : '#F0E8DC', background: groupSize === n ? '#F5EBE0' : '#FFFFFF', fontWeight: groupSize === n ? 600 : 400, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Specific Requests</div>
              <p style={{ fontSize: 13, color: '#8B8070', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>Any specific lodges or experiences? e.g. "I want to stay at Giraffe Manor" or "must include Victoria Falls"</p>
              <textarea value={specificRequests} onChange={e => setSpecificRequests(e.target.value)} rows={3} placeholder="e.g. I want to stay at Giraffe Manor in Nairobi and do a gorilla trek in Bwindi..." style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', resize: 'vertical', outline: 'none', background: '#FFFFFF' }} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {loading && messages.length <= 1 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 24 }}>🌍</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 12 }}>Building your itinerary...</h3>
                <p style={{ fontSize: 14, color: '#8B8070', fontFamily: 'DM Sans, sans-serif' }}>Our AI is planning your perfect African safari.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#C4915A', animation: 'bounce 1.2s infinite', animationDelay: (i * 0.2) + 's' }} />
                  ))}
                </div>
              </div>
            )}

            {messages.filter(m => m.role === 'assistant').map((msg, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: 32, fontSize: 15, lineHeight: 1.9, color: '#3D2B1F', whiteSpace: 'pre-wrap', boxShadow: '0 2px 8px rgba(61,43,31,0.08)', marginBottom: 24 }}>
                {msg.content}
              </div>
            ))}

            {loading && messages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, padding: 20, background: '#FFFFFF', borderRadius: '12px', marginBottom: 24 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#C4915A', animation: 'bounce 1.2s infinite', animationDelay: (i * 0.2) + 's' }} />
                ))}
              </div>
            )}

            <div ref={bottomRef} />

            {itineraryGenerated && !loading && (
              <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: 24, boxShadow: '0 2px 8px rgba(61,43,31,0.08)', marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6B4C35', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Refine your itinerary</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  {["Can we shorten it?", "Suggest cheaper lodges", "What are the internal flights?", "Add a beach extension"].map((q, i) => (
                    <button key={i} onClick={() => setFollowUp(q)} style={{ padding: '6px 14px', fontSize: 12, borderRadius: '999px', border: '1px solid #F0E8DC', background: '#FAF6EF', color: '#3D2B1F', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      {q}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={followUp} onChange={e => setFollowUp(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendFollowUp() }} placeholder="Ask anything about your itinerary..." style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none' }} />
                  <button onClick={sendFollowUp} disabled={!followUp.trim()} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: followUp.trim() ? 1 : 0.4 }}>
                    Ask
                  </button>
                </div>
              </div>
            )}

            {itineraryGenerated && (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={reset} style={{ padding: '12px 24px', background: 'transparent', color: '#3D2B1F', border: '1.5px solid #C4B8A8', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Plan a different safari
                </button>
                <a href="/discover" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Find an Operator on WildPath
                </a>
              </div>
            )}
          </div>
        )}

        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, paddingTop: 24, borderTop: '1px solid #F0E8DC' }}>
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 24px', background: 'transparent', color: '#3D2B1F', border: '1.5px solid #C4B8A8', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}>
              Back
            </button>
            <div style={{ fontSize: 13, color: '#8B8070', fontFamily: 'DM Sans, sans-serif' }}>
              {step === 0 && experiences.length + ' selected'}
              {step === 1 && countries.length + ' selected'}
            </div>
            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && experiences.length === 0 || step === 1 && countries.length === 0} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: (step === 0 && experiences.length === 0) || (step === 1 && countries.length === 0) ? 0.4 : 1 }}>
                Continue
              </button>
            ) : (
              <button onClick={generateItinerary} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Build My Itinerary
              </button>
            )}
          </div>
        )}
      </div>

      <style>{'@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }'}</style>
    </div>
  )
}
