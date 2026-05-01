import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const COUNTRIES = [
  'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Botswana',
  'South Africa', 'Namibia', 'Zimbabwe', 'Zambia', 'Ethiopia',
  'Mozambique', 'Madagascar', 'Multiple Countries'
]

const EXPERIENCE_TYPES = [
  'Big Five Game Drive', 'Gorilla Trekking', 'Great Migration',
  'Walking Safari', 'Photography Safari', 'Bird Watching',
  'Hot Air Balloon', 'Beach Extension', 'Cultural Experience',
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December', 'Flexible'
]

const BUDGETS = [
  'Under $3,000', '$3,000–$6,000', '$6,000–$10,000', '$10,000–$20,000', '$20,000+'
]

const SAMPLE_LISTINGS = [
  {
    id: 'sample1',
    name: 'Sarah M.',
    age_range: '30s',
    country: 'Tanzania',
    destinations: 'Serengeti, Ngorongoro',
    month: 'July',
    duration: 10,
    budget: '$6,000–$10,000',
    experience_types: ['Great Migration', 'Photography Safari'],
    bio: 'First time in Africa, photographer looking to capture the wildebeest crossing. Open to joining a small group or sharing costs with 1-2 others.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample2',
    name: 'James K.',
    age_range: '40s',
    country: 'Uganda',
    destinations: 'Bwindi, Queen Elizabeth',
    month: 'September',
    duration: 8,
    budget: '$6,000–$10,000',
    experience_types: ['Gorilla Trekking', 'Big Five Game Drive'],
    bio: 'Experienced safari traveller, third trip to Africa. Looking for someone to share a gorilla permit and split costs on a private vehicle.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample3',
    name: 'Priya R.',
    age_range: '20s',
    country: 'Kenya',
    destinations: 'Maasai Mara, Amboseli',
    month: 'August',
    duration: 7,
    budget: '$3,000–$6,000',
    experience_types: ['Big Five Game Drive', 'Cultural Experience'],
    bio: 'Solo female traveller, very sociable. Looking for other solo women or a small mixed group for a week in Kenya. Budget conscious but not cutting corners.',
    created_at: new Date().toISOString(),
  },
]

export default function SoloMatch() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({
    name: '', age_range: '', email: '',
    country: '', destinations: '', month: '', duration: '7',
    budget: '', experience_types: [], bio: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('solo_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      if (error || !data || data.length === 0) {
        setListings(SAMPLE_LISTINGS)
      } else {
        setListings(data)
      }
    } catch {
      setListings(SAMPLE_LISTINGS)
    }
    setLoading(false)
  }

  function toggleExp(exp) {
    setForm(prev => ({
      ...prev,
      experience_types: prev.experience_types.includes(exp)
        ? prev.experience_types.filter(e => e !== exp)
        : [...prev.experience_types, exp]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await supabase.from('solo_listings').insert([{
        ...form,
        status: 'active',
        created_at: new Date().toISOString()
      }])
    } catch {}
    setSubmitted(true)
    setSubmitting(false)
  }

  const filtered = filter === 'All' ? listings : listings.filter(l => l.country === filter)

  const btnStyle = (active) => ({
    padding: '8px 16px', borderRadius: '999px', fontSize: 13,
    border: '1.5px solid', cursor: 'pointer', transition: 'all 0.15s',
    borderColor: active ? '#C4915A' : '#F0E8DC',
    background: active ? '#F5EBE0' : '#FFFFFF',
    fontWeight: active ? 600 : 400, color: '#3D2B1F',
    fontFamily: 'DM Sans, sans-serif',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6EF', paddingTop: 68 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #2D4A2A, #4A7A44)', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#A8D5A8', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Solo Travelers</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#FAF6EF', marginBottom: 16, fontWeight: 300 }}>
          Find Your Safari Match
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(250,246,239,0.75)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
          Share the experience. Split the cost. Africa is better with the right people. Connect with other solo travellers heading to the same destination.
        </p>
        <button onClick={() => setShowForm(true)} style={{
          background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF',
          border: 'none', borderRadius: '999px', padding: '14px 32px',
          fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
        }}>
          Post Your Trip →
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0E8DC', padding: '14px 24px', position: 'sticky', top: 68, zIndex: 50 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {['All', ...COUNTRIES.slice(0, 8)].map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ ...btnStyle(filter === c), flexShrink: 0 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: 13, color: '#8B8070', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>
          {loading ? 'Loading...' : `${filtered.length} solo traveller${filtered.length !== 1 ? 's' : ''} looking for a match`}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 260, borderRadius: 16, background: '#F0E8DC' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(listing => (
              <div key={listing.id} style={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(61,43,31,0.08)', border: '1px solid #F0E8DC' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2D4A2A, #4A7A44)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      🧍
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' }}>{listing.name}</div>
                      {listing.age_range && <div style={{ fontSize: 12, color: '#8B8070', fontFamily: 'DM Sans, sans-serif' }}>{listing.age_range}</div>}
                    </div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: 11, fontWeight: 600, background: '#F0F7F0', color: '#2D6A2D', border: '1px solid #A8D5A8' }}>
                    {listing.country}
                  </span>
                </div>

                {/* Trip details */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' }}>
                    📅 {listing.month}
                  </span>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' }}>
                    🗓️ {listing.duration} days
                  </span>
                  <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' }}>
                    💰 {listing.budget}
                  </span>
                </div>

                {listing.destinations && (
                  <div style={{ fontSize: 13, color: '#8B8070', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>
                    📍 {listing.destinations}
                  </div>
                )}

                <p style={{ fontSize: 13, color: '#3D2B1F', lineHeight: 1.6, marginBottom: 16, fontFamily: 'DM Sans, sans-serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {listing.bio}
                </p>

                {(listing.experience_types || []).length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {listing.experience_types.slice(0, 3).map((t, i) => (
                      <span key={i} style={{ padding: '3px 10px', borderRadius: '999px', fontSize: 11, background: '#FAF6EF', color: '#8B8070', border: '1px solid #F0E8DC', fontFamily: 'DM Sans, sans-serif' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <button onClick={() => setShowForm(true)} style={{
                  width: '100%', padding: '10px', borderRadius: '999px',
                  background: 'transparent', border: '1.5px solid #2D4A2A',
                  color: '#2D4A2A', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                }}>
                  Connect →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Trip Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,17,8,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div style={{ background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 560, padding: 40, maxHeight: '90vh', overflowY: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🌍</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 12 }}>You're on the board!</h3>
                <p style={{ fontSize: 14, color: '#8B8070', marginBottom: 24, lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>
                  Your trip has been posted. Other solo travellers heading to the same destination will be able to connect with you.
                </p>
                <button onClick={() => { setShowForm(false); setSubmitted(false); fetchListings() }} style={{
                  padding: '12px 28px', background: 'linear-gradient(135deg, #C4915A, #A87840)',
                  color: '#FAF6EF', border: 'none', borderRadius: '999px',
                  fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>
                  View the board
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26 }}>Post your trip</h3>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: '#8B8070', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>First Name *</label>
                      <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Sarah" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Age Range</label>
                      <select value={form.age_range} onChange={e => setForm(p => ({ ...p, age_range: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select</option>
                        {['20s', '30s', '40s', '50s', '60s+'].map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Email (private — only shared when you connect) *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Country *</label>
                      <select required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Travel Month *</label>
                      <select required value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Duration (days)</label>
                      <input type="number" min="1" max="30" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Budget Per Person</label>
                      <select value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none', background: '#FFFFFF' }}>
                        <option value="">Select</option>
                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>Specific Destinations / Parks</label>
                    <input value={form.destinations} onChange={e => setForm(p => ({ ...p, destinations: e.target.value }))}
                      placeholder="e.g. Maasai Mara, Amboseli" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Experience Types</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {EXPERIENCE_TYPES.map(exp => (
                        <button key={exp} type="button" onClick={() => toggleExp(exp)} style={{
                          padding: '6px 14px', borderRadius: '999px', fontSize: 12, cursor: 'pointer',
                          border: '1.5px solid', transition: 'all 0.15s',
                          borderColor: form.experience_types.includes(exp) ? '#C4915A' : '#F0E8DC',
                          background: form.experience_types.includes(exp) ? '#F5EBE0' : '#FFFFFF',
                          fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F',
                        }}>
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>About You & Your Trip *</label>
                    <textarea required rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell other travellers about yourself and what you're looking for..." style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: '#3D2B1F', outline: 'none', resize: 'vertical' }} />
                  </div>

                  <button type="submit" disabled={submitting} style={{
                    padding: '13px', background: 'linear-gradient(135deg, #C4915A, #A87840)',
                    color: '#FAF6EF', border: 'none', borderRadius: '999px',
                    fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                  }}>
                    {submitting ? 'Posting...' : 'Post My Trip →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
