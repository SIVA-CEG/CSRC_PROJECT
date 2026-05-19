import React from 'react';
import '../endorsements/EndorsementsPage.css';

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

const ProjectsPage = ({ onNavigate }) => (
  <div className="endorsements-page">
    <div className="page-header">
      <div className="page-breadcrumb">Home / <span>My Projects</span></div>
      <h1 className="page-title">My Projects</h1>
      <p className="page-subtitle">Manage your project proposals and sanctioned projects</p>
    </div>
    <div className="choice-grid">
      <ChoiceCard
        title="Project Proposals"
        desc="View all submitted project proposals, track endorsement status, and apply for new funding schemes."
        color="#00b4ff"
        glow="rgba(0,180,255,0.3)"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
        onClick={() => onNavigate('proposals')}
      />
      <ChoiceCard
        title="Sanctioned Projects"
        desc="Access all approved and sanctioned projects, view project details, staff, and payment claims."
        color="#a78bfa"
        glow="rgba(167,139,250,0.3)"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>}
        onClick={() => onNavigate('sanctioned')}
      />
    </div>
  </div>
);

export default ProjectsPage;