import React, { useState } from 'react';

const styles = {
  wrap: {
    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    width: 'fit-content',
  },
  circle: (hovered) => ({
    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid rgba(30,41,59,0.18)',
    background: hovered ? 'rgba(30,41,59,0.06)' : 'rgba(255,255,255,0.7)',
    transition: 'all 0.15s ease',
  }),
};

/**
 * Circular back-arrow used at the top of every page in the consultancy /
 * acceptance-form flow, right next to the page title — so there's always a
 * one-click way back to the previous screen, at every stage.
 *
 * label: optional text next to the arrow (omit for icon-only)
 * onClick: navigation handler, e.g. () => onNavigate(parentKey)
 */
const BackButton = ({ label, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={styles.wrap}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.circle(hovered)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </span>
      {label && (
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#334155' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default BackButton;