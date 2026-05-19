import React from 'react';
import './SectionCard.css';

const SectionCard = ({ title, description, icon, color, glow, tag, onClick }) => {
  const style = {
    '--card-color': color,
    '--card-glow': glow,
    '--card-icon-bg': `${color}18`,
  };

  return (
    <div className="section-card" style={style} onClick={onClick}>
      <div className="card-shimmer" />

      <div className="card-icon-wrap">
        {icon}
      </div>

      <div className="card-content">
        <div className="card-title">{title}</div>
        <div className="card-desc">{description}</div>
      </div>

      <span className="card-tag">{tag}</span>

      <div className="card-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  );
};

export default SectionCard;