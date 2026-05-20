import React from 'react';
import '../endorsements/EndorsementsPage.css';
import './ProjectsPage.css';

const cards = [
  {
    id: 'proposals',
    title: 'Project Proposals',
    desc: 'View and submit project proposals for funding schemes.',
    color: '#00b4ff',
    glow: 'rgba(0,180,255,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    id: 'sanctioned',
    title: 'Sanctioned Projects',
    desc: 'Access all approved and sanctioned projects.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    id: 'ctdt',
    title: 'CTDT Proceedings',
    desc: 'View and manage CTDT committee proceedings and records.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  },
  {
    id: 'projectstaff',
    title: 'Project Staff',
    desc: 'Manage project staff details and appointment orders.',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    id: 'requestforms',
    title: 'Request Forms',
    desc: 'Submit installments, sanctions, reimbursements, travel and more.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
  },
  {
    id: 'paymentclaims',
    title: 'Payment Claims',
    desc: 'Manage and track all payment claim submissions.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4M14 15h4"/></svg>,
  },
  {
    id: 'zbaslip',
    title: 'ZBA Slip',
    desc: 'Generate and manage Zero Balance Account slips.',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  },
  {
    id: 'tsaslip',
    title: 'TSA(H) Slip',
    desc: 'Manage Treasury Single Account (Head) slip submissions.',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  },
  {
    id: 'cmrgslip',
    title: 'CMRG Slip',
    desc: 'Handle Contingency Meeting & Research Grant slip records.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  },
];

const ProjectCard = ({ title, desc, color, glow, icon, onClick }) => (
  <div
    className="proj-card"
    style={{ '--card-color': color, '--card-glow': glow, '--card-icon-bg': `${color}18` }}
    onClick={onClick}
  >
    <div className="proj-card-shimmer" />
    <div className="proj-card-icon">{icon}</div>
    <div className="proj-card-content">
      <div className="proj-card-title">{title}</div>
      <div className="proj-card-desc">{desc}</div>
    </div>
    <div className="proj-card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

const ProjectsPage = ({ onNavigate }) => (
  <div className="projects-main-page">
    <div className="page-header">
      <div className="page-breadcrumb">Home / <span>My Projects</span></div>
      <h1 className="page-title">My Projects</h1>
      <p className="page-subtitle">Select a section to manage your project activities</p>
    </div>
    <div className="proj-cards-grid">
      {cards.map((c, i) => (
        <div key={c.id} className="proj-card-wrapper" style={{ animationDelay: `${i * 0.07}s` }}>
          <ProjectCard {...c} onClick={() => onNavigate(c.id)} />
        </div>
      ))}
    </div>
  </div>
);

export default ProjectsPage;