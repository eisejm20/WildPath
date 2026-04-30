import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const COUNTRIES = ['All', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Botswana', 'South Africa', 'Namibia', 'Zimbabwe', 'Zambia']
const DURATIONS = ['Any', '1–3 days', '4–7 days', '8–14 days', '14+ days']
const BUDGETS = ['Any', 'Under $1,000', '$1,000–$3,000', '$3,000–$7,000', '$7,000+']

// Sample data for when DB is empty
const SAMPLE_OPERATORS = [
  { id: 'sample1', business_name: 'Iron Mountain Safari Club', country: 'Kenya', destinations: 'Maasai Mara, Laikipia, Samburu', bio: 'Award-winning safari operator with deep roots in northern Kenya. Specialist in walking safaris and predator tracking. Founded by a lifelong Africa traveller.', experience_types: ['Big Five Game Drive', 'Walking Safari', 'Photography Safari'], min_price: 450, max_price: 850, badge: 'Hidden Gem' },
  { id: 'sample2', business_name: 'Serengeti Wild Expeditions', country: 'Tanzania', destinations: 'Serengeti, Ngorongoro, Tarangire', bio: 'Third-generation Tanzania guides specialising in the Great Migration circuit. Private mobile camps following the wildebeest year-round.', experience_types: ['Big Five Game Drive', 'Hot Air Balloon', 'Photography Safari'], min_price: 600, max_price: 1200, badge: 'Rising Star' },
  { id: 'sample3', business_name: 'Bwindi Forest Journeys', country: 'Uganda', destinations: 'Bwindi, Kibale, Queen Elizabeth', bio: 'Uganda specialists with an unbroken run of mountain gorilla permits since 2015. Small groups, deep forest experience.', experience_types: ['Gorilla Trekking', 'Chimpanzee Trekking', 'Bird Watching'], min_price: 800, max_price: 1500, badge: 'Hidden Gem' },
  { id: 'sample4', business_name: 'Okavango Mokoro Co.', country: 'Botswana', destinations: 'Okavango Delta, Moremi, Chobe', bio: 'Water-based safari specialists in the Okavango. Mokoro polers trained for generations in reading the delta. Seasonal camps moving with the floods.', experience_types: ['Canoe Safari', 'Walking Safari', 'Big Five Game Drive'], min_price: 750, max_price: 1800, badge: 'Established' },
  { id: 'sample5', business_name: 'Kalahari Tracking School', country: 'Botswana', destinations: 'Central Kalahari, Makgadikgadi', bio: 'The only operator running multi-day tracking courses with San bushmen in the Central Kalahari Game Reserve. Unique, unrepeatable.', experience_types: ['Walking Safari', 'Cultural Experience', 'Night Safari'], min_price: 350, max_price: 700, badge: 'Hidden Gem' },
  { id: 'sample6', business_name: 'Namibia Desert Nomads', country: 'Namibia', destinations: 'Damaraland, Sossusvlei, Etosha', bio: 'Self-drive and guided desert safaris across Namibia. Specialists in desert-adapted elephant tracking in Damaraland.', experience_types: ['Big Five Game Drive', 'Photography Safari', 'Walking Safari'], min_price: 300, max_price: 650, badge: 'Rising Star' },
]

const BADGE_COLORS = {
  'Hidden Gem': { bg: '#F0F7F0', color: '#2D6A2D', border: '#A8D5A8' },
  'Rising Star': { bg: '#FFF8F0', color: '#8B5A1A', border: '#E8B882' },
  'Established': { bg: '#F0F4FF', color: '#1A3A8B', border: '#A8B8E8' },
}

export default function Discover() {
  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchOperators() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('operators').select('*').eq('status', 'approved')
        if (error || !data || data.length === 0) {
          setOperators(SAMPLE_OPERATORS)
        } else {
          setOperators(data)
        }
      } catch {
        setOperators(SAMPLE_OPERATORS)
      }
      setLoading(false)
    }
    fetchOperators()
  }, [])

  const filtered = operators.filter(op => {
    const matchCountry = country === 'All' || op.country === country
    const matchSearch = !search || op.business_name.toLowerCase().includes(search.toLowerCase()) || op.destinations?.toLowerCase().includes(search.toLowerCase())
    return matchCountry && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)', paddingTop: 80 }}>

      {/* Search header */}
      <div style={{ background: 'linear-gradient(135deg, #3D2B1F, #6B4C35)', padding: '48px 24px' }}>
        <div className="container">
          <div className="section-label" style={{ color: '#E8B882', marginBottom: 12 }}>Discover</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#FAF6EF', marginBottom: 24, fontWeight: 300 }}>
            Find your safari
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, operators..."
              style={{
                flex: 1, minWidth: 240, padding: '14px 20px', borderRadius: 'var(--radius-full)',
                border: 'none', fontSize: 15, background: 'rgba(250,246,239,0.12)',
                color: '#FAF6EF', outline: 'none', backdropFilter: 'blur(8px)',
              }}
            />
            <button className="btn-primary" style={{ flexShrink: 0 }}>Search</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--ivory-dark)', padding: '16px 24px', position: 'sticky', top: 68, zIndex: 50 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setCountry(c)} style={{
                padding: '7px 18px', borderRadius: 'var(--radius-full)', fontSize: 13, flexShrink: 0,
                border: '1.5px solid',
                borderColor: country === c ? 'var(--sand)' : 'var(--ivory-dark)',
                background: country === c ? 'var(--sand-pale)' : 'transparent',
                color: country === c ? 'var(--earth)' : 'var(--grey)',
                fontWeight: country === c ? 500 : 400,
                transition: 'all 0.15s ease',
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ fontSize: 13, color: 'var(--grey)', marginBottom: 24 }}>
          {loading ? 'Loading...' : `${filtered.length} operator${filtered.length !== 1 ? 's' : ''} found`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 320, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }} className="loading-shimmer" />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map(op => {
              const badge = op.badge || 'Hidden Gem'
              const badgeStyle = BADGE_COLORS[badge] || BADGE_COLORS['Hidden Gem']
              return (
                <Link to={`/operators/${op.id}`} key={op.id} className="card" style={{ display: 'block', textDecoration: 'none' }}>
                  {/* Card image placeholder */}
                  <div style={{
                    height: 200,
                    background: `linear-gradient(135deg, #3D2B1F, #6B4C35)`,
                    display: 'flex', alignItems: 'flex-end', padding: 20, position: 'relative',
                  }}>
                    <div style={{ fontSize: 48, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', opacity: 0.3 }}>🌍</div>
                    <div style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600,
                      background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.border}`,
                    }}>
                      {badge}
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: 'var(--earth)', lineHeight: 1.2 }}>{op.business_name}</h3>
                      <span className="tag" style={{ flexShrink: 0, marginLeft: 8 }}>{op.country}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {op.bio}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {(op.experience_types || []).slice(0, 3).map((t, i) => (
                        <span key={i} className="tag" style={{ fontSize: 11 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--ivory-dark)' }}>
                      <div>
                        <span style={{ fontSize: 18, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: 'var(--earth)' }}>
                          ${op.min_price}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--grey)' }}> / person per day</span>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--sand)', fontWeight: 500 }}>View →</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
