// src/components/ItineraryCarousel.jsx
// ─────────────────────────────────────────────────────────────
// WildPath itinerary carousel — Phase 2
// Slides: Cover → Day 1 → Day N → Route Map
// ─────────────────────────────────────────────────────────────

import { useState, useRef } from 'react';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN ||
  'pk.eyJ1Ijoid2lsZHBhdGgiLCJhIjoiY21vbm1kajJuMGV3MjJwb21jamZsdWY2dCJ9.GR8n4zLnQnWWGWyisXvPeQ';

const SVG_W = 292, SVG_H = 460;
const PAD   = 1.5;

// ── Map helpers ───────────────────────────────────────────────

function buildMapUrl(days) {
  const geocoded = days.filter(d => d.lat && d.lon);
  if (geocoded.length === 0) return null;
  const lons  = geocoded.map(d => d.lon);
  const lats  = geocoded.map(d => d.lat);
  const minLon = Math.min(...lons) - PAD, maxLon = Math.max(...lons) + PAD;
  const minLat = Math.min(...lats) - PAD, maxLat = Math.max(...lats) + PAD;
  const cLon  = ((minLon + maxLon) / 2).toFixed(5);
  const cLat  = ((minLat + maxLat) / 2).toFixed(5);
  const span  = Math.max(maxLon - minLon, maxLat - minLat);
  const zoom  = span > 15 ? 4 : span > 8 ? 5 : span > 4 ? 6 : 7;
  return {
    url:    `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${cLon},${cLat},${zoom},0/584x920@2x?access_token=${MAPBOX_TOKEN}`,
    minLon, maxLon, minLat, maxLat,
  };
}

function toSVG(lon, lat, bounds) {
  const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * SVG_W;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * SVG_H;
  return { x, y };
}

function curvedD(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(mx - dy / len * len * 0.18).toFixed(1)} ${(my + dx / len * len * 0.18).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

// ── Card components ───────────────────────────────────────────

function CoverCard({ formData, days }) {
  const countries = [...new Set(days.map(d => d.country).filter(Boolean))];
  const destination = formData.destination || days[0]?.location || 'Africa';
  return (
    <div style={cardShell}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg,#0a1a0a 0%,#1a3a1a 35%,#2D4A2D 60%,#8B6914 100%)',
      }}/>
      <div style={{ position:'absolute', inset:0, opacity:0.06,
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.3) 2px,rgba(255,255,255,0.3) 3px),repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.1) 8px,rgba(255,255,255,0.1) 9px)'
      }}/>
      <div style={cardVignette}/>
      <div style={{ position:'absolute', top:24, left:22, fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.4)', letterSpacing:'0.18em' }}>WILDPATH</div>
      <div style={{ position:'absolute', top:0, left:0, right:0, bottom:'38%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:72, opacity:0.85 }}>🌍</div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'24px 24px 28px' }}>
        <div style={eyebrowStyle}>AI itinerary · {countries.join(' & ') || destination}</div>
        <div style={{ fontSize:28, fontWeight:500, color:'#fff', lineHeight:1.15, marginBottom:8 }}>{destination}</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:18 }}>
          {days.length} days · {formData.travelers} travelers{formData.budget ? ` · ${formData.budget}` : ''}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {[...new Set(days.map(d => d.location).filter(Boolean))].slice(0,4).map((loc, i) => (
            <span key={i} style={coverPill}>{loc}</span>
          ))}
          {formData.month && <span style={coverPill}>{formData.month}</span>}
        </div>
      </div>
      <div style={{ position:'absolute', bottom:28, right:22, display:'flex', gap:5, opacity:0.4, alignItems:'center' }}>
        <span style={{ fontSize:10, color:'#fff', letterSpacing:'0.05em' }}>swipe to explore</span>
        <span style={{ color:'#fff', fontSize:12 }}>→</span>
      </div>
    </div>
  );
}

function DayCard({ day }) {
  return (
    <div style={{ ...cardShell, background: day.gradient || '#1a2a1a' }}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, opacity:0.25 }}>
        {day.tags?.[0]?.split(' ')[0] || '🌿'}
      </div>
      <div style={cardVignette}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px 20px 24px' }}>
        <div style={eyebrowStyle}>Day {day.day_number}</div>
        <div style={{ fontSize:22, fontWeight:500, color:'#fff', lineHeight:1.2, marginBottom:4 }}>{day.location}</div>
        {day.lodge && <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontStyle:'italic', marginBottom:14 }}>{day.lodge}</div>}
        {day.tags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
            {day.tags.map((t, i) => (
              <span key={i} style={tagStyle}>{t}</span>
            ))}
          </div>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {(day.activities || []).slice(0, 3).map((act, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
              <div style={{ width:4, height:4, borderRadius:'50%', background:'#C8975A', marginTop:6, flexShrink:0 }}/>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.82)', lineHeight:1.45 }}>{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapCard({ days }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const mapData = buildMapUrl(days);
  const geocoded = days.filter(d => d.lat && d.lon);
  const bounds = mapData;

  return (
    <div style={{ ...cardShell, background: '#141f14' }}>
      {mapData && (
        <img
          src={mapData.url}
          alt="Route map"
          onLoad={() => setImgLoaded(true)}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity: imgLoaded ? 1 : 0, transition:'opacity 0.5s' }}
        />
      )}
      {/* SVG overlay */}
      <svg width="100%" height="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ position:'absolute', inset:0 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* Paths between consecutive geocoded stops */}
        {geocoded.map((day, i) => {
          if (i === 0) return null;
          const prev = geocoded[i - 1];
          const p1 = toSVG(prev.lon, prev.lat, bounds);
          const p2 = toSVG(day.lon, day.lat, bounds);
          const color = day.country !== prev.country ? '#5DCAA5' : '#C8975A';
          return (
            <path key={i} d={curvedD(p1.x, p1.y, p2.x, p2.y)}
              fill="none" stroke={color} strokeWidth="2"
              strokeDasharray="7 5" strokeLinecap="round" opacity="0.9">
              <animate attributeName="stroke-dashoffset" from="0" to="-24"
                dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite"/>
            </path>
          );
        })}
        {/* Stop markers */}
        {geocoded.map((day, i) => {
          const { x, y } = toSVG(day.lon, day.lat, bounds);
          const isLast = i === geocoded.length - 1;
          const color = '#C8975A';
          const labelRight = x < SVG_W * 0.65;
          const labelW = (day.location?.length || 8) * 6.5 + 16;
          const lx = labelRight ? x + 15 : x - 15 - labelW;
          return (
            <g key={i}>
              {isLast && (
                <circle cx={x} cy={y} r="16" fill={color} opacity="0.15">
                  <animate attributeName="r" values="16;24;16" dur="2.2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.15;0.04;0.15" dur="2.2s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={x} cy={y} r="13" fill={color} opacity="0.18"/>
              <circle cx={x} cy={y} r="11" fill="#111" stroke={color} strokeWidth={isLast ? 2.5 : 2} opacity="0.96"/>
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fill={color} fontWeight="700" fontFamily="system-ui">
                {i + 1}
              </text>
              <rect x={lx} y={y - 9} width={labelW} height={16} rx="5" fill="rgba(0,0,0,0.72)"/>
              <text x={lx + 8} y={y + 5} fontSize="9" fill="#fff" fontFamily="system-ui" fontWeight="500">
                {day.location}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={cardVignette}/>
      <div style={{ position:'absolute', top:12, left:12, background:'rgba(0,0,0,0.58)', borderRadius:8, padding:'7px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
          <svg width="18" height="4"><line x1="0" y1="2" x2="18" y2="2" stroke="#C8975A" strokeWidth="2" strokeDasharray="5 3"/></svg>
          <span style={{ fontSize:8, color:'rgba(255,255,255,0.75)' }}>Kenya route</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <svg width="18" height="4"><line x1="0" y1="2" x2="18" y2="2" stroke="#5DCAA5" strokeWidth="2" strokeDasharray="5 3"/></svg>
          <span style={{ fontSize:8, color:'rgba(255,255,255,0.75)' }}>Extension</span>
        </div>
      </div>
      <div style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.5)', borderRadius:6, padding:'4px 8px', fontSize:8, color:'rgba(255,255,255,0.45)', letterSpacing:'0.1em' }}>WILDPATH</div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'18px 18px 22px' }}>
        <div style={eyebrowStyle}>Full route · {days.length} days</div>
        <div style={{ fontSize:22, fontWeight:500, color:'#fff', lineHeight:1.2, marginBottom:3 }}>
          {[...new Set(days.map(d => d.country).filter(Boolean))].join(' & ') || 'Africa'}
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>
          {geocoded.length} stops · fly-in safari
        </div>
        <div style={{ display:'flex', alignItems:'center', flexWrap:'nowrap', overflow:'hidden' }}>
          {geocoded.map((d, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#C8975A', flexShrink:0 }}/>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.82)', margin:'0 5px', whiteSpace:'nowrap' }}>{d.location}</span>
              {i < geocoded.length - 1 && <div style={{ width:12, height:1, background:'rgba(255,255,255,0.3)', flexShrink:0 }}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main carousel ─────────────────────────────────────────────

export default function ItineraryCarousel({ days, formData, itineraryId, onEnquire, onReset }) {
  const [cur, setCur]     = useState(0);
  const [liked, setLiked] = useState(false);
  const startX            = useRef(null);
  const isDragging        = useRef(false);

  // Slides: cover + days + map
  const totalSlides = days.length + 2; // cover + N days + map

  function getTransform(slideIndex, dragFrac = 0) {
    const offset = slideIndex - cur;
    const drag   = Math.max(-1, Math.min(1, dragFrac));
    if (offset < -1 || offset > 3) return null;

    const rots   = [0, 4, 8, 12];
    const txs    = [0, 14, 24, 32];
    const tys    = [0, 10, 18, 24];
    const scales = [1, 0.94, 0.88, 0.82];
    const zs     = [100, 90, 80, 70];

    if (offset < 0) {
      return { transform:`translateX(${drag*-180}px) translateY(${Math.abs(drag)*30}px) rotate(${drag*-18}deg) scale(${1-Math.abs(drag)*0.08})`, zIndex:drag<0?200:50, opacity:1-Math.abs(drag)*0.5 };
    }
    const i = Math.min(offset, 3);
    if (offset === 0) {
      return { transform:`translateX(${drag*-180}px) translateY(${Math.abs(drag)*20}px) rotate(${drag*-18}deg) scale(${scales[0]-Math.abs(drag)*0.06})`, zIndex:zs[0], opacity:1 };
    }
    const f = Math.max(0, drag);
    const rot = rots[i] - f*(rots[i]-rots[Math.max(i-1,0)]);
    const tx  = txs[i]  - f*(txs[i]-txs[Math.max(i-1,0)]);
    const ty  = tys[i]  - f*(tys[i]-tys[Math.max(i-1,0)]);
    const sc  = scales[i] + f*(scales[Math.max(i-1,0)]-scales[i]);
    return { transform:`translateX(${tx}px) translateY(${-ty}px) rotate(${rot}deg) scale(${sc})`, zIndex:zs[i], opacity:offset===3?0.6+f*0.2:1 };
  }

  function applyDrag(dragFrac) {
    document.querySelectorAll('.wp-slide').forEach((el, i) => {
      const t = getTransform(i, dragFrac);
      if (!t) { el.style.opacity=0; el.style.pointerEvents='none'; return; }
      el.style.transform = t.transform;
      el.style.zIndex    = t.zIndex;
      el.style.opacity   = t.opacity;
      el.style.pointerEvents = i===cur?'auto':'none';
      el.style.transition = 'none';
    });
  }

  function goTo(i) {
    const next = Math.max(0, Math.min(totalSlides-1, i));
    setCur(next);
    setTimeout(() => {
      document.querySelectorAll('.wp-slide').forEach((el, idx) => {
        const t = getTransform(idx, 0);
        el.style.transition = 'transform 0.45s cubic-bezier(.4,0,.2,1), opacity 0.45s ease';
        if (!t) { el.style.opacity=0; el.style.pointerEvents='none'; return; }
        el.style.transform = t.transform;
        el.style.zIndex    = t.zIndex;
        el.style.opacity   = t.opacity;
        el.style.pointerEvents = idx===next?'auto':'none';
      });
    }, 0);
  }

  function onPointerDown(e) {
    startX.current    = e.clientX;
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 3) applyDrag(-(dx/220));
  }
  function onPointerUp(e) {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - startX.current;
    if (dx < -50 && cur < totalSlides-1) goTo(cur+1);
    else if (dx > 50 && cur > 0) goTo(cur-1);
    else goTo(cur);
  }

  const counterLabel = cur === 0
    ? `Cover · ${days.length} days`
    : cur === totalSlides - 1
    ? `${totalSlides} / ${totalSlides} · route map`
    : `Day ${days[cur-1]?.day_number} · ${days.length} days`;

  return (
    <div style={{ maxWidth: 340, margin: '0 auto' }}>

      {/* Top row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, padding:'0 4px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#C8975A,#2D4A2D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:500, color:'#fff', border:'1.5px solid #C8975A' }}>WP</div>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>wildpath.ai</div>
            <div style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{formData.destination} · {days.length} days</div>
          </div>
        </div>
        <button onClick={onReset} style={{ fontSize:11, color:'var(--color-text-tertiary)', background:'none', border:'none', cursor:'pointer' }}>New plan ↺</button>
      </div>

      {/* Progress bar */}
      <div style={{ display:'flex', gap:4, marginBottom:20, padding:'0 2px' }}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} style={{ height:2, flex:1, borderRadius:2, background: i<=cur ? '#C8975A' : 'var(--color-border-tertiary)', transition:'background 0.3s' }}/>
        ))}
      </div>

      {/* Stage */}
      <div
        style={{ position:'relative', height:460, display:'flex', alignItems:'center', justifyContent:'center', perspective:900, cursor:'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Cover */}
        <div className="wp-slide" style={{ ...slideBase, ...getTransform(0) }}>
          <CoverCard formData={formData} days={days}/>
        </div>
        {/* Day cards */}
        {days.map((day, i) => (
          <div key={day.day_number} className="wp-slide" style={{ ...slideBase, ...getTransform(i+1) }}>
            <DayCard day={day}/>
          </div>
        ))}
        {/* Map card */}
        <div className="wp-slide" style={{ ...slideBase, ...getTransform(totalSlides-1) }}>
          <MapCard days={days}/>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:18, padding:'0 4px' }}>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <button onClick={() => setLiked(l => !l)} style={{ fontSize:22, background:'none', border:'none', cursor:'pointer', color: liked ? '#e0245e' : 'var(--color-text-primary)', transition:'transform 0.15s' }}>
            {liked ? '❤' : '♡'}
          </button>
          <span style={{ fontSize:22, cursor:'pointer' }}>💬</span>
          <span style={{ fontSize:22, cursor:'pointer' }}>↪</span>
        </div>
        <span style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>{counterLabel}</span>
      </div>

      {/* Caption */}
      <div style={{ marginTop:12, padding:'0 4px' }}>
        <span style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)' }}>wildpath.ai</span>
        <div style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.55, marginTop:2 }}>
          {cur === 0
            ? `Your ${days.length}-day ${formData.destination} safari. Swipe to explore each day.`
            : cur === totalSlides-1
            ? 'The full route. Tap enquire to connect with an operator.'
            : days[cur-1]?.caption || `Day ${days[cur-1]?.day_number} — ${days[cur-1]?.location}`}
        </div>
      </div>

      {/* Enquire CTA */}
      <button
        onClick={onEnquire}
        style={{ marginTop:14, width:'100%', padding:12, borderRadius:12, background:'#C8975A', color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', letterSpacing:'0.03em' }}
      >
        Enquire with an operator ↗
      </button>

    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────

const cardShell = {
  width:292, height:460, borderRadius:20, overflow:'hidden',
  position:'relative', userSelect:'none',
};

const slideBase = {
  position:'absolute', transformOrigin:'center bottom',
  willChange:'transform', transition:'transform 0.45s cubic-bezier(.4,0,.2,1), opacity 0.45s ease',
};

const cardVignette = {
  position:'absolute', inset:0,
  background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.15) 45%,transparent 70%)',
};

const eyebrowStyle = {
  fontSize:10, fontWeight:500, color:'#C8975A',
  letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6,
};

const tagStyle = {
  background:'rgba(255,255,255,0.13)',
  border:'0.5px solid rgba(255,255,255,0.18)',
  borderRadius:20, padding:'3px 9px', fontSize:10,
  color:'rgba(255,255,255,0.85)',
};

const coverPill = {
  background:'rgba(255,255,255,0.1)',
  border:'0.5px solid rgba(255,255,255,0.2)',
  borderRadius:20, padding:'4px 11px',
  fontSize:11, color:'rgba(255,255,255,0.8)',
};
