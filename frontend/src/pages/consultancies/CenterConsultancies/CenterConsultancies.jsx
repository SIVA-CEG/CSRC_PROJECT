import React, { useState } from 'react';
import BackButton from '../shared/BackButton';

const styles = {
  page: { minHeight: '100%', padding: '0 4px' },
  breadcrumb: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13,
    color: 'rgba(30,41,59,0.45)', marginBottom: 6,
  },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbActive: { color: 'rgba(30,41,59,0.85)', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 },
  title: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 28, fontWeight: 700,
    color: '#1e293b', margin: 0, letterSpacing: '-0.02em',
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 14.5,
    color: 'rgba(30,41,59,0.55)', margin: '0 0 36px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24, maxWidth: 860,
  },
  card: (accent, hovered) => ({
    position: 'relative',
    background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: hovered ? `1px solid ${accent}55` : '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: '32px 28px',
    cursor: 'pointer',
    transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: hovered
      ? `0 20px 40px -12px ${accent}33, 0 0 0 1px ${accent}22`
      : '0 4px 16px rgba(15,23,42,0.05)',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    overflow: 'hidden',
  }),
  cardGlow: (accent) => ({
    position: 'absolute', top: -40, right: -40, width: 140, height: 140,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
    pointerEvents: 'none',
  }),
  iconWrap: (accent) => ({
    width: 52, height: 52, borderRadius: 14,
    background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, boxShadow: `0 8px 20px -6px ${accent}88`,
  }),
  cardTitle: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 17, fontWeight: 700,
    color: '#1e293b', margin: '0 0 6px 0',
  },
  cardDesc: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13,
    color: 'rgba(30,41,59,0.5)', margin: 0, lineHeight: 1.5,
  },
  arrow: (accent, hovered) => ({
    position: 'absolute', bottom: 28, right: 28, width: 32, height: 32,
    borderRadius: '50%',
    background: hovered ? accent : 'rgba(30,41,59,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.28s ease',
    transform: hovered ? 'translateX(2px)' : 'translateX(0)',
  }),
};

const Icon = ({ path, color = '#fff' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const ArrowIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const cards = [
  {
    key: 'center-consultancy-acceptance',
    accent: '#0ea5e9',
    title: 'Acceptance Form Generation',
    desc: 'Generate the consultancy acceptance form for a centre / other-campus engagement.',
    icon: (
      <>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
  {
    key: 'center-consultancy-status',
    accent: '#7c3aed',
    title: 'Acceptance Form Status',
    desc: 'View all submitted acceptance forms — filter by submitted, accepted, or rejected.',
    icon: (
      <>
        <path d="M4 6h16M4 12h16M4 18h10" />
      </>
    ),
  },
];

const CenterConsultancies = ({ onNavigate }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbActive}>Centre / Other Campuses</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate('consultancies')} />
        <h1 style={styles.title}>Centre / Other Campuses</h1>
      </div>
      <p style={styles.subtitle}>Consultancy engagement actions for centres and other campuses</p>

      <div style={styles.grid}>
        {cards.map((c) => {
          const isHovered = hovered === c.key;
          return (
            <div
              key={c.key}
              style={styles.card(c.accent, isHovered)}
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNavigate(c.key)}
            >
              <div style={styles.cardGlow(c.accent)} />
              <div style={styles.iconWrap(c.accent)}>
                <Icon path={c.icon} />
              </div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <p style={styles.cardDesc}>{c.desc}</p>
              <div style={styles.arrow(c.accent, isHovered)}>
                <ArrowIcon color={isHovered ? '#fff' : c.accent} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CenterConsultancies;