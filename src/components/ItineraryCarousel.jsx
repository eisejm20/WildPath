// src/components/ItineraryCarousel.jsx
// ─────────────────────────────────────────────────────────────
// WildPath itinerary grid — Phase 2
// Instagram-style grid, tap to expand modal with full narrative
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const SVG_W = 292, SVG_H = 460, PAD = 1.5;

function buildMapUrl(days) {
  const geo = days.filter(d => d.lat && d.lon);
  if (!geo.length) return null;
  const lons = geo.map(d => d.lon), lats = geo.map(d => d.lat);
  const minLon = Math.min(...lons)-PAD, maxLon = Math.max(...lons)+PAD;
  const minLat = Math.min(...lats)-PAD, maxLat = Math.max(...lats)+PAD;
  const cLon = ((minLon+maxLon)/2).toFixed(5);
  const cLat = ((minLat+maxLat)/2).toFixed(5);
  const span = Math.max(maxLon-minLon, maxLat-minLat);
  const zoom = span>15?4:span>8?5:span>4?6:7;
  return { url:`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${cLon},${cLat},${zoom},0/584x920@2x?access_token=${MAPBOX_TOKEN}`, minLon, maxLon, minLat, maxLat };
}

function toSVG(lon, lat, b) {
  return { x:((lon-b.minLon)/(b.maxLon-b.minLon))*SVG_W, y:((b.maxLat-lat)/(b.maxLat-b.minLat))*SVG_H };
}

function curvedD(x1,y1,x2,y2) {
  const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1;
  const len=Math.sqrt(dx*dx+dy*dy)||1;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx-dy/len*len*0.18).toFixed(1)} ${(my+dx/len*len*0.18).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function GridCell({ day, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position:'relative', aspectRatio:'1', overflow:'hidden', cursor:'pointer' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, background: day.gradient || '#1a2a1a', transition:'transform 0.3s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}>
        {day.tags?.[0]?.split(' ')[0] || '🌿'}
      </div>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 60%)' }}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:8 }}>
        <div style={{ fontSize:9, fontWeight:500, color:'#C8975A', letterSpacing:'0.08em', textTransform:'uppercase' }}>Day {day.day_number}</div>
        <div style={{ fontSize:12, fontWeight:500, color:'#fff', lineHeight:1.2, marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{day.location}</div>
      </div>
    </div>
  );
}

function MapGridCell({ onClick }) {
  return (
    <div style={{ position:'relative', aspectRatio:'1', overflow:'hidden', cursor:'pointer', background:'#141f14' }} onClick={onClick}>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#C8975A" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
          <circle cx="24" cy="20" r="5" fill="#C8975A" opacity="0.9"/>
          <circle cx="14" cy="28" r="4" fill="#5DCAA5" opacity="0.8"/>
          <circle cx="34" cy="30" r="4" fill="#C8975A" opacity="0.7"/>
          <line x1="14" y1="28" x2="24" y2="20" stroke="#C8975A" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
          <line x1="24" y1="20" x2="34" y2="30" stroke="#C8975A" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"/>
          <line x1="34" y1="30" x2="14" y2="28" stroke="#5DCAA5" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
        </svg>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em' }}>Route map</span>
      </div>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 100%)' }}/>
    </div>
  );
}

function DayModal({ day, onClose, onEnquire }) {
  if (!day) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'#ffffff', borderRadius:16, width:'100%', maxWidth:440, overflow:'hidden', maxHeight:'88vh', display:'flex', flexDirection:'column' }}>

        {/* Image header */}
        <div style={{ height:210, position:'relative', flexShrink:0 }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, background: day.gradient || '#1a2a1a' }}>
            {day.tags?.[0]?.split(' ')[0] || '🌿'}
          </div>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)' }}/>
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, width:30, height:30, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'16px 18px' }}>
            <div style={{ fontSize:10, fontWeight:500, color:'#C8975A', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Day {day.day_number}</div>
            <div style={{ fontSize:22, fontWeight:500, color:'#fff', lineHeight:1.2 }}>{day.location}</div>
            {day.lodge && <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontStyle:'italic', marginTop:3 }}>{day.lodge}</div>}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ padding:'18px 18px 4px', overflowY:'auto', flex:1 }}>

          {/* Narrative description — the travel writer paragraph */}
          {day.description && (
            <p style={{ fontSize:14, color:'var(--color-text-primary)', lineHeight:1.8, marginBottom:16, fontStyle:'italic', borderLeft:'2px solid #C8975A', paddingLeft:12 }}>
              {day.description}
            </p>
          )}

          {/* Tags */}
          {day.tags?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
              {day.tags.map((t, i) => (
                <span key={i} style={{ background:'var(--color-background-secondary)', borderRadius:20, padding:'3px 10px', fontSize:11, color:'var(--color-text-secondary)' }}>{t}</span>
              ))}
            </div>
          )}

          {/* Activities — full evocative sentences */}
          {day.activities?.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
              {day.activities.map((act, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:'#C8975A', marginTop:8, flexShrink:0 }}/>
                  <span style={{ fontSize:13, color:'var(--color-text-primary)', lineHeight:1.65 }}>{act}</span>
                </div>
              ))}
            </div>
          )}

          {/* Meals */}
          {day.meals && (
            <div style={{ fontSize:12, color:'var(--color-text-tertiary)', paddingTop:12, paddingBottom:4, borderTop:'0.5px solid var(--color-border-tertiary)' }}>
              🍽 {day.meals}
            </div>
          )}
        </div>

        <button onClick={onEnquire} style={{ margin:'12px 18px 18px', padding:12, borderRadius:10, background:'#C8975A', color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', letterSpacing:'0.02em', flexShrink:0 }}>
          Enquire with an operator ↗
        </button>
      </div>
    </div>
  );
}

function MapModal({ days, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const mapData = buildMapUrl(days);
  const geo = days.filter(d => d.lat && d.lon);

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--color-background-primary)', borderRadius:16, width:'100%', maxWidth:440, overflow:'hidden', maxHeight:'92vh' }}>
        <div style={{ position:'relative', height:500, background:'#141f14' }}>
          {mapData && (
            <img src={mapData.url} alt="Route map" onLoad={() => setImgLoaded(true)}
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity: imgLoaded?1:0, transition:'opacity 0.5s' }}/>
          )}
          <svg width="100%" height="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ position:'absolute', inset:0 }}>
            {geo.map((day, i) => {
              if (i === 0 || !mapData) return null;
              const prev = geo[i-1];
              const p1 = toSVG(prev.lon, prev.lat, mapData);
              const p2 = toSVG(day.lon, day.lat, mapData);
              return (
                <path key={i} d={curvedD(p1.x,p1.y,p2.x,p2.y)} fill="none" stroke="#C8975A" strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" opacity="0.9">
                  <animate attributeName="stroke-dashoffset" from="0" to="-24" dur={`${1.6+i*0.2}s`} repeatCount="indefinite"/>
                </path>
              );
            })}
            {geo.map((day, i) => {
              if (!mapData) return null;
              const { x, y } = toSVG(day.lon, day.lat, mapData);
              const isLast = i === geo.length-1;
              const lRight = x < SVG_W*0.65;
              const lw = (day.location?.length||8)*6.5+16;
              return (
                <g key={i}>
                  {isLast && <circle cx={x} cy={y} r="16" fill="#C8975A" opacity="0.15"><animate attributeName="r" values="16;24;16" dur="2.2s" repeatCount="indefinite"/></circle>}
                  <circle cx={x} cy={y} r="13" fill="#C8975A" opacity="0.18"/>
                  <circle cx={x} cy={y} r="11" fill="#111" stroke="#C8975A" strokeWidth={isLast?2.5:2} opacity="0.96"/>
                  <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#C8975A" fontWeight="700" fontFamily="system-ui">{i+1}</text>
                  <rect x={lRight?x+15:x-15-lw} y={y-9} width={lw} height={16} rx="5" fill="rgba(0,0,0,0.72)"/>
                  <text x={lRight?x+23:x-7-lw} y={y+5} fontSize="9" fill="#fff" fontFamily="system-ui" fontWeight="500">{day.location}</text>
                </g>
              );
            })}
          </svg>
          <button onClick={onClose} style={{ position:'absolute', top:12, right:12, width:30, height:30, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'18px 18px 22px', background:'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)' }}>
            <div style={{ fontSize:10, fontWeight:500, color:'#C8975A', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6 }}>Full route</div>
            <div style={{ fontSize:20, fontWeight:500, color:'#fff', marginBottom:8 }}>
              {[...new Set(geo.map(d=>d.country).filter(Boolean))].join(' & ') || 'Africa'}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {geo.map((d,i) => (
                <span key={i} style={{ fontSize:11, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
                  {i>0 && <span style={{ opacity:0.4 }}>→</span>}
                  {d.location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryCarousel({ days, formData, itineraryId, onEnquire, onReset }) {
  const [activeDay, setActiveDay] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [liked, setLiked] = useState(false);

  const countries = [...new Set(days.map(d => d.country).filter(Boolean))];
  const destination = formData.destination || countries.join(' & ') || 'Africa';
  const geocoded = days.filter(d => d.lat && d.lon);

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>

      {/* Profile header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#C8975A,#2D4A2D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:500, color:'#fff', border:'1.5px solid #C8975A', flexShrink:0 }}>WP</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)' }}>wildpath.ai</div>
          <div style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{destination} · {days.length} days · AI itinerary</div>
        </div>
        <button onClick={onReset} style={{ fontSize:12, color:'var(--color-text-tertiary)', background:'none', border:'none', cursor:'pointer' }}>New plan ↺</button>
      </div>

      {/* Stats bar */}
      <div style={{ display:'flex', borderTop:'0.5px solid var(--color-border-tertiary)', borderBottom:'0.5px solid var(--color-border-tertiary)', marginBottom:3 }}>
        {[
          { num: days.length, label:'days' },
          { num: [...new Set(days.map(d=>d.location).filter(Boolean))].length, label:'destinations' },
          { num: countries.length||1, label:'countries' },
          { num: formData.budget||'—', label:'budget', gold:true },
        ].map((s,i,arr) => (
          <div key={i} style={{ flex:1, textAlign:'center', padding:'12px 0', borderRight: i<arr.length-1?'0.5px solid var(--color-border-tertiary)':'none' }}>
            <div style={{ fontSize:16, fontWeight:500, color: s.gold?'#C8975A':'var(--color-text-primary)' }}>{s.num}</div>
            <div style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
        {days.map(day => (
          <GridCell key={day.day_number} day={day} onClick={() => setActiveDay(day)}/>
        ))}
        <MapGridCell onClick={() => setShowMap(true)}/>
      </div>

      {/* Action bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <button onClick={() => setLiked(l=>!l)} style={{ fontSize:24, background:'none', border:'none', cursor:'pointer', color: liked?'#e0245e':'var(--color-text-primary)', padding:0 }}>
            {liked ? '❤' : '♡'}
          </button>
          <span style={{ fontSize:22, cursor:'pointer' }}>💬</span>
          <span style={{ fontSize:22, cursor:'pointer' }}>↪</span>
        </div>
        <span style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{days.length} days · {geocoded.length} locations mapped</span>
      </div>

      {/* Caption */}
      <div style={{ marginTop:10, marginBottom:16 }}>
        <span style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>wildpath.ai </span>
        <span style={{ fontSize:13, color:'var(--color-text-secondary)' }}>
          Your {days.length}-day {destination} safari. Tap any day to explore it in full.
        </span>
      </div>

      {/* Enquire CTA */}
      <button onClick={onEnquire} style={{ width:'100%', padding:13, borderRadius:12, background:'#C8975A', color:'#fff', fontSize:14, fontWeight:500, border:'none', cursor:'pointer', letterSpacing:'0.02em' }}>
        Enquire with an operator ↗
      </button>

      {activeDay && <DayModal day={activeDay} onClose={() => setActiveDay(null)} onEnquire={() => { setActiveDay(null); onEnquire(); }}/>}
      {showMap && <MapModal days={days} onClose={() => setShowMap(false)}/>}
    </div>
  );
}
