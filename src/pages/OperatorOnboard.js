import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const COUNTRIES = [
  'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Botswana',
  'South Africa', 'Namibia', 'Zimbabwe', 'Zambia', 'Ethiopia',
  'Mozambique', 'Malawi', 'Madagascar', 'Seychelles', 'Other'
]

const EXPERIENCE_TYPES = [
  'Big Five Game Drive', 'Walking Safari', 'Gorilla Trekking',
  'Chimpanzee Trekking', 'Hot Air Balloon', 'Canoe Safari',
  'Horseback Safari', 'Photography Safari', 'Bird Watching',
  'Night Safari', 'Cultural Experience', 'Marine Safari',
]

const STEPS = ['Your Business', 'Your Safaris', 'Your Story', 'Review']

export default function OperatorOnboard() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    // Step 1
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    country: '',
    years_operating: '',
    // Step 2
    experience_types: [],
    destinations: '',
    min_price: '',
    max_price: '',
    group_size_min: '',
    group_size_max: '',
    // Step 3
    bio: '',
    why_wildpath: '',
    website: '',
    safariBookings_url: '',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleExperience = (exp) => {
    setForm(prev => ({
      ...prev,
      experience_types: prev.experience_types.includes(exp)
        ? prev.experience_types.filter(e => e !== exp)
        : [...prev.experience_types, exp]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: dbError } = await supabase
        .from('operator_applications')
        .insert([{
          ...form,
          status: 'pending',
          applied_at: new Date().toISOString(),
        }])
      if (dbError) throw dbError
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px', background: 'var(--ivory)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🌍</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, color: 'var(--earth)', marginBottom: 16 }}>
          You're on the path.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--grey)', lineHeight: 1.7, marginBottom: 32 }}>
          Thank you, {form.contact_name}. We've received your application for <strong>{form.business_name}</strong> and will be in touch within 48 hours.
        </p>
        <div style={{ background: 'var(--sand-pale)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'left' }}>
          <div className="section-label" style={{ marginBottom: 12 }}>What happens next</div>
          {['Our team reviews your application', 'We verify your operator credentials', 'You receive your login and onboarding guide', 'Your profile goes live on WildPath'].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--sand)', color: 'var(--ivory)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 14, color: 'var(--earth)', lineHeight: 1.5 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory)', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Operator Application</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--earth)', marginBottom: 12, fontWeight: 300 }}>
            Join WildPath
          </h1>
          <p style={{ fontSize: 15, color: 'var(--grey)', lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
            7% flat commission. No lead fees. Priority visibility for smaller operators.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, gap: 0 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                  background: i <= step ? 'var(--sand)' : 'var(--ivory-dark)',
                  color: i <= step ? 'var(--ivory)' : 'var(--grey-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.3s ease',
                  border: i === step ? '2px solid var(--earth-mid)' : '2px solid transparent',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i <= step ? 'var(--earth)' : 'var(--grey-light)', fontWeight: i === step ? 500 : 400 }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 2, height: 2, background: i < step ? 'var(--sand)' : 'var(--ivory-dark)', transition: 'background 0.3s ease', marginBottom: 22 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: '40px 40px' }}>

          {/* STEP 1 */}
          {step === 0 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, marginBottom: 28 }}>Tell us about your business</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Business Name *</label>
                    <input className="input-field" value={form.business_name} onChange={e => update('business_name', e.target.value)} placeholder="Serengeti Wild Safaris" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Your Name *</label>
                    <input className="input-field" value={form.contact_name} onChange={e => update('contact_name', e.target.value)} placeholder="James Kimani" />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Email Address *</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="james@serengetiwild.com" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Phone / WhatsApp</label>
                    <input className="input-field" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+254 700 000000" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Primary Country *</label>
                    <select className="input-field" value={form.country} onChange={e => update('country', e.target.value)}>
                      <option value="">Select country</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Years Operating</label>
                  <select className="input-field" value={form.years_operating} onChange={e => update('years_operating', e.target.value)}>
                    <option value="">Select</option>
                    <option value="less_than_1">Less than 1 year</option>
                    <option value="1_3">1–3 years</option>
                    <option value="3_5">3–5 years</option>
                    <option value="5_10">5–10 years</option>
                    <option value="10_plus">10+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, marginBottom: 28 }}>What safaris do you offer?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 12 }}>Experience Types (select all that apply)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {EXPERIENCE_TYPES.map(exp => (
                      <button key={exp} onClick={() => toggleExperience(exp)} style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 13,
                        border: '1.5px solid',
                        borderColor: form.experience_types.includes(exp) ? 'var(--sand)' : 'var(--ivory-dark)',
                        background: form.experience_types.includes(exp) ? 'var(--sand-pale)' : 'transparent',
                        color: form.experience_types.includes(exp) ? 'var(--earth)' : 'var(--grey)',
                        transition: 'all 0.15s ease',
                      }}>
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Destinations / Parks</label>
                  <input className="input-field" value={form.destinations} onChange={e => update('destinations', e.target.value)} placeholder="Maasai Mara, Amboseli, Samburu..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Typical Price Range (USD per person)</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input className="input-field" type="number" value={form.min_price} onChange={e => update('min_price', e.target.value)} placeholder="From" />
                      <span style={{ color: 'var(--grey)', fontSize: 14 }}>to</span>
                      <input className="input-field" type="number" value={form.max_price} onChange={e => update('max_price', e.target.value)} placeholder="To" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Group Size</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input className="input-field" type="number" value={form.group_size_min} onChange={e => update('group_size_min', e.target.value)} placeholder="Min" />
                      <span style={{ color: 'var(--grey)', fontSize: 14 }}>to</span>
                      <input className="input-field" type="number" value={form.group_size_max} onChange={e => update('group_size_max', e.target.value)} placeholder="Max" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, marginBottom: 28 }}>Your story</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>About Your Company</label>
                  <textarea className="input-field" rows={4} value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell travelers about your company, your guides, your philosophy..." style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Why do you want to join WildPath?</label>
                  <textarea className="input-field" rows={3} value={form.why_wildpath} onChange={e => update('why_wildpath', e.target.value)} placeholder="What brought you here?" style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>Website (optional)</label>
                    <input className="input-field" value={form.website} onChange={e => update('website', e.target.value)} placeholder="www.yourcompany.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--earth-mid)', display: 'block', marginBottom: 6 }}>SafariBookings Profile (optional)</label>
                    <input className="input-field" value={form.safariBookings_url} onChange={e => update('safariBookings_url', e.target.value)} placeholder="safaribookings.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, marginBottom: 28 }}>Review your application</h3>
              {[
                { label: 'Business', items: [['Name', form.business_name], ['Contact', form.contact_name], ['Email', form.email], ['Country', form.country], ['Years operating', form.years_operating]] },
                { label: 'Safaris', items: [['Experience types', form.experience_types.join(', ') || '—'], ['Destinations', form.destinations || '—'], ['Price range', form.min_price && form.max_price ? `$${form.min_price}–$${form.max_price}` : '—']] },
                { label: 'Story', items: [['Bio', form.bio ? form.bio.substring(0, 100) + '...' : '—'], ['Website', form.website || '—']] },
              ].map((section, si) => (
                <div key={si} style={{ marginBottom: 24, background: 'var(--sand-pale)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                  <div className="section-label" style={{ marginBottom: 12 }}>{section.label}</div>
                  {section.items.map(([key, val], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, gap: 16 }}>
                      <span style={{ color: 'var(--grey)', flexShrink: 0 }}>{key}</span>
                      <span style={{ color: 'var(--earth)', textAlign: 'right' }}>{val || '—'}</span>
                    </div>
                  ))}
                </div>
              ))}
              {error && <div style={{ background: '#FFF0F0', border: '1px solid #FFCCCC', borderRadius: 'var(--radius-md)', padding: 16, fontSize: 14, color: 'var(--danger)', marginBottom: 16 }}>{error}</div>}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--ivory-dark)' }}>
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-secondary"
              style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}
            >
              ← Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{ minWidth: 160, justifyContent: 'center' }}>
                {loading ? 'Submitting...' : 'Submit Application →'}
              </button>
            )}
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
          {['7% flat commission', 'No lead fees', 'Priority visibility for small operators', 'Free to apply'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--grey)' }}>
              <span style={{ color: 'var(--forest-light)', fontSize: 14 }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
