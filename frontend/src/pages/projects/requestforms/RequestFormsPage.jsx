import React, { useState } from 'react';
import './RequestFormsPage.css';
import ReappropriationPage from './ReappropriationPage';
import ProjectExtensionPage from './ProjectExtensionPage';

const reqCards = [
  {
    id: 'new-installments',
    title: 'New Installments',
    desc: 'Apply for new project fund installment releases.',
    color: '#00b4ff',
    glow: 'rgba(0,180,255,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  },
  {
    id: 'advance-sanction',
    title: 'Advance Sanction',
    desc: 'Request advance sanction for project expenditures.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    id: 'reimbursements',
    title: 'Reimbursements',
    desc: 'Submit reimbursement requests for project expenses.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  },
  {
    id: 'travel',
    title: 'Travel',
    desc: 'Apply for travel grants and reimbursements for project work.',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  },
  {
    id: 'permissions',
    title: 'Permissions',
    desc: 'Request permissions for project-related activities and events.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  },
  {
    id: 'reappropriation',
    title: 'Re-appropriation',
    desc: 'Submit requests for budget re-appropriation between heads.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  },
  {
    id: 'project-extension',
    title: 'Project Extension',
    desc: 'Apply for project timeline extensions with justification.',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14v4M10 16h4"/></svg>,
  },
];

const ReqCard = ({ title, desc, color, glow, icon, onClick }) => (
  <div
    className="req-card"
    style={{ '--req-color': color, '--req-glow': glow, '--req-icon-bg': `${color}18` }}
    onClick={onClick}
  >
    <div className="req-card-shimmer" />
    <div className="req-card-icon">{icon}</div>
    <div>
      <div className="req-card-title">{title}</div>
      <div className="req-card-desc">{desc}</div>
    </div>
    <div className="req-card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

const RequestFormsPage = ({ onNavigate }) => {
  const [subPage, setSubPage] = useState(null);

  if (subPage === 'reappropriation') {
    return <ReappropriationPage onNavigate={(target) => {
      if (target === 'requestforms') setSubPage(null);
      else if (onNavigate) onNavigate(target);
    }} />;
  }
  if (subPage === 'project-extension') {
  return <ProjectExtensionPage onNavigate={(t) => { if (t === 'requestforms') setSubPage(null); else onNavigate?.(t); }} />;
}

  const handleCardClick = (id) => {
  if (id === 'reappropriation') {
    setSubPage('reappropriation');
    return;
  }

  if (id === 'project-extension') {
    setSubPage('project-extension');
    return;
  }

  alert(`${reqCards.find(c => c.id === id)?.title} — Coming Soon`);
};

  return (
    <div className="subpage">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Request Forms</span>
        </div>
        <h1 className="page-title">Request Forms</h1>
        <p className="page-subtitle">Submit and track all project-related requests</p>
      </div>
      <div className="req-cards-grid">
        {reqCards.map((c, i) => (
          <div key={c.id} className="req-card-wrapper" style={{ animationDelay: `${i * 0.07}s` }}>
            <ReqCard {...c} onClick={() => handleCardClick(c.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestFormsPage;