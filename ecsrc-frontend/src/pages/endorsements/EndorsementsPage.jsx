import React from 'react';
import './EndorsementsPage.css';

const ChoiceCard = ({ title, desc, color, glow, icon, onClick }) => (
  <div
    className="choice-card"
    style={{ '--card-color': color, '--card-glow': glow, '--card-icon-bg': `${color}18` }}
    onClick={onClick}
  >
    <div className="choice-icon">{icon}</div>
    <div className="choice-title">{title}</div>
    <div className="choice-desc">{desc}</div>
    <div className="choice-arrow">
      Open
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

const EndorsementsPage = ({ onNavigate }) => {
  return (
    <div className="endorsements-page">
      <div className="page-header">
        <div className="page-breadcrumb">Home / <span>Endorsements</span></div>
        <h1 className="page-title">Endorsements</h1>
        <p className="page-subtitle">Manage your endorsement records and applications</p>
      </div>

      <div className="choice-grid">
        <ChoiceCard
          title="List of Endorsements"
          desc="View all your submitted endorsements, check status, download PDF certificates and view detailed records."
          color="#00b4ff"
          glow="rgba(0,180,255,0.3)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
          onClick={() => onNavigate('endorsements-list')}
        />
        <ChoiceCard
          title="New Endorsement"
          desc="Submit a new endorsement application. Fill in the required details and attach necessary documents."
          color="#34d399"
          glow="rgba(52,211,153,0.3)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
          onClick={() => onNavigate('endorsements-new')}
        />
      </div>
    </div>
  );
};

export default EndorsementsPage;