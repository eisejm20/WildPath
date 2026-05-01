import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const COUNTRIES = ['Kenya','Tanzania','Uganda','Rwanda','Botswana','South Africa','Namibia','Zimbabwe','Zambia','Multiple Countries']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December','Flexible']
const BUDGETS = ['Under $3,000','$3,000-$6,000','$6,000-$10,000','$10,000-$20,000','$20,000+']

const SAMPLES = [
  { id: 's1', name: 'Sarah M.', age_range: '30s', country: 'Tanzania', destinations: 'Serengeti, Ngorongoro', month: 'July', duration: 10, budget: '$6,000-$10,000', bio: 'First time in Africa, photographer looking to capture the wildebeest crossing. Looking to share costs with 1-2 others.' },
  { id: 's2', name: 'James K.', age_range: '40s', country: 'Uganda', destinations: 'Bwindi, Queen Elizabeth', month: 'September', duration: 8, budget: '$6,000-$10,000', bio: 'Third trip to Africa. Looking for someone to share a gorilla permit and split costs on a private vehicle.' },
  { id: 's3', name: 'Priya R.', age_range: '20s', country: 'Kenya', destinations: 'Maasai Mara, Amboseli', month: 'August', duration: 7, budget: '$3,000-$6,000', bio: 'Solo female traveller. Looking for other solo women or a small mixed group for a week in Kenya.' },
]

export default function SoloMatch() {
  const [listings, setListings] = useState(SAMPLES)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('All')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', age_range: '', email: '', country: '', destinations: '', month: '', duration: '7', budget: '', bio: '' })

  useEffect(function() {
    supabase.from('solo_listings').select('*').eq('status', 'active').order('created_at', { ascending: false }).then(function(result) {
      if (!result.error && result.data && result.data.length > 0) {
        setListings(result.data)
      }
    })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    supabase.from('solo_listings').insert([Object.assign({}, form, { status: 'active', created_at: new Date().toISOString() })]).then(function() {
      setSubmitted(true)
      setSubmitting(false)
    })
  }

  var filtered = filter === 'All' ? listings : listings.filter(function(l) { return l.country === filter })

  return React.createElement('div', { style: { minHeight: '100vh', background: '#FAF6EF', paddingTop: 68 } },
    React.createElement('div', { style: { background: 'linear-gradient(135deg, #2D4A2A, #4A7A44)', padding: '48px 24px 40px', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#A8D5A8', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' } }, 'Solo Travelers'),
      React.createElement('h1', { style: { fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 52px)', color: '#FAF6EF', marginBottom: 16, fontWeight: 300 } }, 'Find Your Safari Match'),
      React.createElement('p', { style: { fontSize: 16, color: 'rgba(250,246,239,0.75)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' } }, 'Share the experience. Split the cost. Connect with other solo travellers heading to the same destination.'),
      React.createElement('button', { onClick: function() { setShowForm(true) }, style: { background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', padding: '14px 32px', fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' } }, 'Post Your Trip \u2192')
    ),
    React.createElement('div', { style: { background: '#FFFFFF', borderBottom: '1px solid #F0E8DC', padding: '14px 24px', position: 'sticky', top: 68, zIndex: 50, overflowX: 'auto' } },
      React.createElement('div', { style: { display: 'flex', gap: 8, maxWidth: 1000, margin: '0 auto' } },
        ['All'].concat(COUNTRIES.slice(0,7)).map(function(c) {
          return React.createElement('button', { key: c, onClick: function() { setFilter(c) }, style: { padding: '8px 16px', borderRadius: '999px', fontSize: 13, border: '1.5px solid', cursor: 'pointer', flexShrink: 0, borderColor: filter === c ? '#C4915A' : '#F0E8DC', background: filter === c ? '#F5EBE0' : '#FFFFFF', fontWeight: filter === c ? 600 : 400, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' } }, c)
        })
      )
    ),
    React.createElement('div', { style: { maxWidth: 1000, margin: '0 auto', padding: '32px 24px' } },
      React.createElement('div', { style: { fontSize: 13, color: '#8B8070', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' } }, filtered.length + ' solo traveller' + (filtered.length !== 1 ? 's' : '') + ' looking for a match'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 } },
        filtered.map(function(listing) {
          return React.createElement('div', { key: listing.id, style: { background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(61,43,31,0.08)', border: '1px solid #F0E8DC' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                React.createElement('div', { style: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2D4A2A, #4A7A44)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 } }, '\uD83E\uDDCD'),
                React.createElement('div', null,
                  React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: '#3D2B1F', fontFamily: 'DM Sans, sans-serif' } }, listing.name),
                  listing.age_range && React.createElement('div', { style: { fontSize: 12, color: '#8B8070', fontFamily: 'DM Sans, sans-serif' } }, listing.age_range)
                )
              ),
              React.createElement('span', { style: { padding: '4px 10px', borderRadius: '999px', fontSize: 11, fontWeight: 600, background: '#F0F7F0', color: '#2D6A2D', border: '1px solid #A8D5A8' } }, listing.country)
            ),
            React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 } },
              listing.month && React.createElement('span', { style: { padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' } }, '\uD83D\uDCC5 ' + listing.month),
              listing.duration && React.createElement('span', { style: { padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' } }, '\uD83D\uDDD3\uFE0F ' + listing.duration + ' days'),
              listing.budget && React.createElement('span', { style: { padding: '4px 10px', borderRadius: '999px', fontSize: 11, background: '#F5EBE0', color: '#6B4C35', fontFamily: 'DM Sans, sans-serif' } }, '\uD83D\uDCB0 ' + listing.budget)
            ),
            listing.destinations && React.createElement('div', { style: { fontSize: 13, color: '#8B8070', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' } }, '\uD83D\uDCCD ' + listing.destinations),
            React.createElement('p', { style: { fontSize: 13, color: '#3D2B1F', lineHeight: 1.6, marginBottom: 16, fontFamily: 'DM Sans, sans-serif' } }, listing.bio),
            React.createElement('button', { onClick: function() { setShowForm(true) }, style: { width: '100%', padding: '10px', borderRadius: '999px', background: 'transparent', border: '1.5px solid #2D4A2A', color: '#2D4A2A', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 } }, 'Connect \u2192')
          )
        })
      )
    ),
    showForm && React.createElement('div', { style: { position: 'fixed', inset: 0, background: 'rgba(26,17,8,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }, onClick: function(e) { if (e.target === e.currentTarget) setShowForm(false) } },
      React.createElement('div', { style: { background: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 520, padding: 40, maxHeight: '90vh', overflowY: 'auto' } },
        submitted
          ? React.createElement('div', { style: { textAlign: 'center', padding: '20px 0' } },
              React.createElement('div', { style: { fontSize: 56, marginBottom: 20 } }, '\uD83C\uDF0D'),
              React.createElement('h3', { style: { fontFamily: 'Cormorant Garamond, serif', fontSize: 28, marginBottom: 12 } }, "You're on the board!"),
              React.createElement('p', { style: { fontSize: 14, color: '#8B8070', marginBottom: 24, lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' } }, 'Your trip has been posted. Other solo travellers can now connect with you.'),
              React.createElement('button', { onClick: function() { setShowForm(false); setSubmitted(false) }, style: { padding: '12px 28px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' } }, 'View the board')
            )
          : React.createElement('div', null,
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 } },
                React.createElement('h3', { style: { fontFamily: 'Cormorant Garamond, serif', fontSize: 26 } }, 'Post your trip'),
                React.createElement('button', { onClick: function() { setShowForm(false) }, style: { background: 'none', border: 'none', fontSize: 24, color: '#8B8070', cursor: 'pointer' } }, '\xD7')
              ),
              React.createElement('form', { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 16 } },
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
                  React.createElement('div', null,
                    React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'First Name *'),
                    React.createElement('input', { required: true, value: form.name, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { name: e.target.value }) }) }, placeholder: 'Sarah', style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' } })
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'Age Range'),
                    React.createElement('select', { value: form.age_range, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { age_range: e.target.value }) }) }, style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#FFFFFF' } },
                      React.createElement('option', { value: '' }, 'Select'),
                      ['20s','30s','40s','50s','60s+'].map(function(a) { return React.createElement('option', { key: a, value: a }, a) })
                    )
                  )
                ),
                React.createElement('div', null,
                  React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'Email (private) *'),
                  React.createElement('input', { required: true, type: 'email', value: form.email, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { email: e.target.value }) }) }, placeholder: 'you@example.com', style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' } })
                ),
                React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
                  React.createElement('div', null,
                    React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'Country *'),
                    React.createElement('select', { required: true, value: form.country, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { country: e.target.value }) }) }, style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#FFFFFF' } },
                      React.createElement('option', { value: '' }, 'Select'),
                      COUNTRIES.map(function(c) { return React.createElement('option', { key: c, value: c }, c) })
                    )
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'Travel Month *'),
                    React.createElement('select', { required: true, value: form.month, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { month: e.target.value }) }) }, style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#FFFFFF' } },
                      React.createElement('option', { value: '' }, 'Select'),
                      MONTHS.map(function(m) { return React.createElement('option', { key: m, value: m }, m) })
                    )
                  )
                ),
                React.createElement('div', null,
                  React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'Destinations'),
                  React.createElement('input', { value: form.destinations, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { destinations: e.target.value }) }) }, placeholder: 'e.g. Maasai Mara, Amboseli', style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' } })
                ),
                React.createElement('div', null,
                  React.createElement('label', { style: { fontSize: 12, fontWeight: 600, color: '#6B4C35', display: 'block', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' } }, 'About You & Your Trip *'),
                  React.createElement('textarea', { required: true, rows: 3, value: form.bio, onChange: function(e) { setForm(function(p) { return Object.assign({}, p, { bio: e.target.value }) }) }, placeholder: 'Tell other travellers about yourself and what you\'re looking for...', style: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #F0E8DC', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', resize: 'vertical' } })
                ),
                React.createElement('button', { type: 'submit', disabled: submitting, style: { padding: '13px', background: 'linear-gradient(135deg, #C4915A, #A87840)', color: '#FAF6EF', border: 'none', borderRadius: '999px', fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 } }, submitting ? 'Posting...' : 'Post My Trip \u2192')
              )
            )
      )
    )
  )
}
