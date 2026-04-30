import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const SAMPLE = {
  id: 'sample1',
  business_name: 'Iron Mountain Safari Club',
  contact_name: 'Safari Expert',
  country: 'Kenya',
  destinations: 'Maasai Mara, Laikipia, Samburu, Amboseli',
  bio: 'Award-winning safari operator with deep roots in northern Kenya. Founded by a lifelong Africa traveller who has visited nine African countries personally. We specialise in walking safaris, predator tracking, and small-group experiences that go beyond the standard game drive. Our guides are among the most experienced in East Africa.',
  experience_types: ['Big Five Game Drive', 'Walking Safari', 'Photography Safari', 'Night Safari', 'Cultural Experience'],
  min_price: 450,
  max_price: 850,
  badge: 'Hidden Gem',
  years_operating: '5_10',
  website: 'ironmountainsafariclub.com',
}

export default function OperatorProfile() {
  const { id } = useParams()
  const [operator, setOperator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [enquiry, setEnquiry] = useState({ name: '', email: '', dates: '', guests: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        const { data } = await supabase.from('operators').select('*').eq('id', id).single()
        setOperator(data || SAMPLE)
      } catch {
        setOperator(SAMPLE)
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  const handleEnquiry = async (e) => {
    e.preventDefault()
    try {
      await supabase.from('enquiries').insert([{ operator_id: id, ...enquiry, sent_at: new Date().toISOString() }])
    } catch {}
    setSent(true)
  }

  if (loading) return <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center', color: 'var(--grey)' }}>Loading...</div>
  if (!operator) return <div style={{ minHeight: '100vh', paddingTop: 120, textAlign: 'center' }}>Operator not found. <Link to="/discover">Back to Discover</Link></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)', paddingTop: 68 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1A1108, #3D2B1F)', padding: '64px 24px 48px' }}>
        <div className="container">
          <Link to="/discover" style={{ fontSize: 13, color: 'rgba(250,246,239,0.5)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Back to Discover
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, flexShrink: 0 }}>
              🌍
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 42px)', color: '#FAF6EF', fontWeight: 300 }}>
                  {operator.business_name}
                </h1>
                <span style={{ padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, background: 'rgba(196,145,90,0.2)', color: '#E8B882', border: '1px solid rgba(196,145,90,0.3)' }}>
                  {operator.badge || 'Hidden Gem'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: 'rgba(250,246,239,0.6)' }}>📍 {operator.country}</span>
                <span style={{ fontSize: 14, color: 'rgba(250,246,239,0.6)' }}>🗺️ {operator.destinations}</span>
              </div>
            </div>
            <button onClick={() => setEnquiryOpen(true)} className="btn-primary" style={{ fontSize: 15, padding: '14px 28px', flexShrink: 0 }}>
              Enquire Now →
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>About</div>
            <p style={{ fontSize: 15, color: 'var(--earth)', lineHeight: 1.8 }}>{operator.bio}</p>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Safari Types</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(operator.experience_types || []).map((t, i) => (
                <span key={i} className="tag" style={{ fontSize: 13, padding: '8px 16px' }}>{t}</span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Destinations</div>
            <p style={{ fontSize: 15, color: 'var(--earth)', lineHeight: 1.8 }}>{operator.destinations}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 100 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid var(--ivory-dark)', marginBottom: 20 }}>
              <div style={{ fontSize: 36, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: 'var(--earth)' }}>
                ${operator.min_price}
              </div>
              <div style={{ fontSize: 13, color: 'var(--grey)' }}>per person per day, from</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {[['Commission', '7% — lowest in the industry'], ['Payment', 'Protected by escrow'], ['Response time', 'Typically within 24hrs']].map(([k, v], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--grey)' }}>{k}</span>
                  <span style={{ color: 'var(--earth)', fontWeight: 500, textAlign: 'right', maxWidth: 160 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setEnquiryOpen(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Send Enquiry
            </button>
          </div>

          <div style={{ background: 'var(--sand-pale)', borderRadius: 'var(--radius-md)', padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--earth-mid)', marginBottom: 8 }}>🔒 Secure Booking</div>
            <p style={{ fontSize: 13, color: 'var(--grey)', lineHeight: 1.6 }}>
              Your payment is held in escrow until your trip is confirmed. You're protected at every step.
            </p>
          </div>
        </div>
      </div>

      {/* Enquiry modal */}
      {enquiryOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,17,8,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) setEnquiryOpen(false) }}>
          <div className="card" style={{ width: '100%', maxWidth: 520, padding: 40, animation: 'fadeIn 0.3s ease', maxHeight: '90vh', overflowY: 'auto' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 12 }}>Enquiry sent!</h3>
                <p style={{ fontSize: 14, color: 'var(--grey)', marginBottom: 24 }}>
                  {operator.business_name} will be in touch within 24 hours. Your message has been delivered through WildPath.
                </p>
                <button onClick={() => { setEnquiryOpen(false); setSent(false); }} className="btn-primary" style={{ margin: '0 auto' }}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26 }}>Enquire about this safari</h3>
                  <button onClick={() => setEnquiryOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, color: 'var(--grey)', lineHeight: 1 }}>×</button>
                </div>
                <form onSubmit={handleEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Your Name *</label>
                      <input className="input-field" value={enquiry.name} onChange={e => setEnquiry(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Email *</label>
                      <input className="input-field" type="email" value={enquiry.email} onChange={e => setEnquiry(p => ({ ...p, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Travel Dates</label>
                      <input className="input-field" placeholder="e.g. July 2026" value={enquiry.dates} onChange={e => setEnquiry(p => ({ ...p, dates: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Number of Guests</label>
                      <input className="input-field" type="number" min="1" value={enquiry.guests} onChange={e => setEnquiry(p => ({ ...p, guests: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Message</label>
                    <textarea className="input-field" rows={4} value={enquiry.message} onChange={e => setEnquiry(p => ({ ...p, message: e.target.value }))} placeholder="Tell the operator about your ideal safari..." style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    Send Enquiry →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
