import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(250,246,239,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(196,145,90,0.2)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68,
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C4915A, #3D2B1F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#FAF6EF', fontSize: 16 }}>🌍</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: '#3D2B1F', lineHeight: 1 }}>WildPath</div>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#C4915A', fontWeight: 500 }}>Africa Safari Network</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          <Link to="/discover" style={{ fontSize: 14, color: '#3D2B1F', fontWeight: 500, opacity: location.pathname === '/discover' ? 1 : 0.7, transition: 'opacity 0.2s' }}>
            Discover
          </Link>
          <Link to="/operators/join" style={{ fontSize: 14, color: '#3D2B1F', fontWeight: 500, opacity: location.pathname === '/operators/join' ? 1 : 0.7, transition: 'opacity 0.2s' }}>
            For Operators
          </Link>
          <Link to="/login" style={{ fontSize: 14, color: '#3D2B1F', fontWeight: 500, opacity: 0.7 }}>
            Sign In
          </Link>
          <Link to="/operators/join" className="btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>
            Join WildPath
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', padding: 8, display: 'none' }}
          className="mobile-menu-btn"
        >
          <div style={{ width: 22, height: 2, background: '#3D2B1F', marginBottom: 5, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#3D2B1F', marginBottom: 5, opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
          <div style={{ width: 22, height: 2, background: '#3D2B1F', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(250,246,239,0.98)', backdropFilter: 'blur(12px)',
          padding: '20px 24px 28px', borderTop: '1px solid rgba(196,145,90,0.2)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <Link to="/discover" style={{ fontSize: 16, color: '#3D2B1F', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>Discover Safaris</Link>
          <Link to="/operators/join" style={{ fontSize: 16, color: '#3D2B1F', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>For Operators</Link>
          <Link to="/login" style={{ fontSize: 16, color: '#3D2B1F', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>Sign In</Link>
          <Link to="/operators/join" className="btn-primary" style={{ textAlign: 'center', marginTop: 8 }}>Join WildPath</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
