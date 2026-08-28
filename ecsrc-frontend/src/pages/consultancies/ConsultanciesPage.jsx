import React, { useState } from 'react';

const styles = {
  page: {
    minHeight: '100%',
    padding: '0 4px',
  },
  breadcrumb: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    color: 'rgba(30,41,59,0.45)',
    marginBottom: 6,
  },
  breadcrumbActive: {
    color: 'rgba(30,41,59,0.85)',
    fontWeight: 600,
  },
  title: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 28,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 6px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 14.5,
    color: 'rgba(30,41,59,0.55)',
    margin: '0 0 36px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    width: '100%',
  },
  card: (accent, hovered) => ({
    position: 'relative',
    background: hovered
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: hovered
      ? `1px solid ${accent}55`
      : '1px solid rgba(255,255,255,0.6)',
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
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
    pointerEvents: 'none',
  }),
  iconWrap: (accent) => ({
    width: 52,
    height: 52,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: `0 8px 20px -6px ${accent}88`,
  }),
  cardTitle: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 17,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 6px 0',
  },
  cardDesc: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 13,
    color: 'rgba(30,41,59,0.5)',
    margin: 0,
    lineHeight: 1.5,
  },
  arrow: (accent, hovered) => ({
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: hovered ? accent : 'rgba(30,41,59,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    key: 'department-consultancies',
    accent: '#6366f1',
    title: 'Department Consultancies',
    desc: 'CEG & SAP colleges — consultancy engagements handled at the department level.',
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
      </>
    ),
  },
  {
    key: 'center-consultancies',
    accent: '#f97316',
    title: 'Centre / Other Campuses',
    desc: 'Consultancy engagements coordinated at the centre / other-campus level.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
      </>
    ),
  },
];

const ConsultanciesPage = ({ onNavigate }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home</span> / <span style={styles.breadcrumbActive}>Consultancies</span>
      </div>
      <h1 style={styles.title}>Consultancies</h1>
      <p style={styles.subtitle}>Industry consultancy engagements and records</p>

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

export default ConsultanciesPage;