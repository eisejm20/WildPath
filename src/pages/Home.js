import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const STATS = [
  { value: '14', label: 'African Countries' },
  { value: '7%', label: 'Flat Commission' },
  { value: '$0', label: 'Lead Fees' },
  { value: '∞', label: 'Possibilities' },
]

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Discover & Book',
    desc: 'Browse curated safari itineraries from verified operators across 14 African countries. Filter by destination, duration, budget, and experience type.',
  },
  {
    icon: '🤖',
    title: 'AI Safari Planner',
    desc: 'Our Safari AI builds a personalised itinerary based on your dates, budget, interests, and travel style. In minutes, not weeks.',
  },
  {
    icon: '🔒',
    title: 'Protected Payments',
    desc: 'Your money is held in escrow until your trip is confirmed. No more wiring thousands of dollars and hoping for the best.',
  },
  {
    icon: '📱',
    title: 'Offline Mobile App',
    desc: 'Full itineraries, a 240-species wildlife guide, lodge details, and visa info — all available without internet. Built for the bush.',
  },
  {
    icon: '👥',
    title: 'Solo Match',
    desc: 'Travelling alone? Find other solo travelers heading to the same destination and share the experience — and the cost.',
  },
  {
    icon: '✨',
    title: 'Hidden Gems',
    desc: 'Smaller operators get priority visibility. The best safari experiences are not always the most famous ones.',
  },
]

export default function Home() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { width, height } = el.getBoundingClientRect()
      const x = (clientX / width - 0.5) * 20
      const y = (clientY / height - 0.5) * 20
      el.style.backgroundPosition = `${50 + x * 0.3}% ${50 + y * 0.3}%`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div>
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          background: `
            linear-gradient(to bottom, rgba(26,17,8,0.55) 0%, rgba(26,17,8,0.3) 50%, rgba(26,17,8,0.7) 100%),
            url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80') center/cover no-repeat
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          transition: 'background-position 0.1s ease',
        }}
      >
        <div style={{ animation: 'fadeIn 0.8s ease forwards' }}>
          <div className="section-label" style={{ color: '#E8B882', marginBottom: 20 }}>
            Africa Safari Network
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(48px, 8vw, 88px)',
            fontWeight: 300,
            color: '#FAF6EF',
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 800,
          }}>
            Every Safari.<br />
            <em style={{ fontStyle: 'italic', color: '#E8B882' }}>Every Story.</em>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(250,246,239,0.8)',
            maxWidth: 560,
            lineHeight: 1.7,
            marginBottom: 40,
            fontWeight: 300,
          }}>
            The platform that connects travelers with Africa's finest safari operators. 
            Discover, plan, book, and pay — all in one place, with every payment protected.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/discover" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
              Explore Safaris →
            </Link>
            <Link to="/operators/join" className="btn-secondary" style={{
              color: '#FAF6EF', borderColor: 'rgba(250,246,239,0.5)', fontSize: 15, padding: '14px 32px'
            }}>
              I'm an Operator
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(61,43,31,0.85)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(196,145,90,0.3)',
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: 800, width: '100%',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '20px 24px',
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(196,145,90,0.2)' : 'none', padding: '0 16px' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: '#E8B882', fontWeight: 600, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(250,246,239,0.6)', marginTop: 4, letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '96px 24px', background: '#FAF6EF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>The Platform</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: '#3D2B1F', marginBottom: 16 }}>
              Built for how safari actually works
            </h2>
            <p style={{ fontSize: 16, color: '#8B8070', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Not a directory. Not a travel blog. A fully integrated platform where discovery leads directly to booking.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ padding: 32 }}
                onMouseEnter={e => e.currentTarget.style.borderBottom = '3px solid var(--sand)'}
                onMouseLeave={e => e.currentTarget.style.borderBottom = 'none'}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, marginBottom: 10, color: '#3D2B1F' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#8B8070', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operator CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #3D2B1F 0%, #6B4C35 100%)',
        padding: '96px 24px',
        textAlign: 'center',
      }}>
        <div className="container">
          <div className="section-label" style={{ color: '#E8B882', marginBottom: 20 }}>For Operators</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 4vw, 52px)', color: '#FAF6EF', marginBottom: 20, fontWeight: 300 }}>
            Keep more of what you earn
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(250,246,239,0.7)', maxWidth: 520, margin: '0 auto 16px', lineHeight: 1.7 }}>
            7% flat commission. No lead fees. No pay-to-play visibility. 
            Smaller operators get homepage priority — because the best safari 
            experiences deserve to be found.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(250,246,239,0.5)', marginBottom: 40 }}>
            On a $500k/year operation, WildPath saves you up to $75,000 compared to TripAdvisor.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/operators/join" style={{
              background: 'linear-gradient(135deg, #C4915A, #E8B882)',
              color: '#3D2B1F', border: 'none', borderRadius: '9999px',
              padding: '14px 36px', fontSize: 15, fontWeight: 600,
              display: 'inline-block',
            }}>
              Join as an Operator →
            </Link>
            <a href="#how-it-works" style={{
              color: '#E8B882', border: '1.5px solid rgba(232,184,130,0.4)',
              borderRadius: '9999px', padding: '14px 32px', fontSize: 15,
              display: 'inline-block',
            }}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1A1108', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: '#C4915A', marginBottom: 8 }}>WildPath</div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(250,246,239,0.3)', textTransform: 'uppercase' }}>Africa Safari Network</div>
        <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(250,246,239,0.2)' }}>© 2026 WildPath. All rights reserved.</div>
      </footer>
    </div>
  )
}
