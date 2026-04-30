import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setMessage('Signed in successfully.')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Check your email to confirm your account.')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', background: 'var(--ivory)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, color: 'var(--earth)', marginBottom: 8 }}>
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </div>
          <p style={{ fontSize: 14, color: 'var(--grey)' }}>
            {mode === 'signin' ? 'Sign in to your WildPath account' : 'Join the WildPath community'}
          </p>
        </div>

        <div className="card" style={{ padding: 40 }}>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div style={{ background: '#FFF0F0', border: '1px solid #FFCCCC', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--danger)' }}>{error}</div>}
            {message && <div style={{ background: '#F0FFF4', border: '1px solid #A8D5A8', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--forest)' }}>{message}</div>}
            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--ivory-dark)' }}>
            <span style={{ fontSize: 14, color: 'var(--grey)' }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--sand)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/operators/join" style={{ fontSize: 14, color: 'var(--grey)' }}>
            Are you an operator? <span style={{ color: 'var(--sand)', fontWeight: 500 }}>Apply here →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
