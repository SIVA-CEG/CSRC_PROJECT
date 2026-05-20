import React from 'react';
import './PaymentClaimsPage.css';

const payCards = [
  {
    id: 'salary-claims',
    title: 'Salary Claims',
    desc: 'Submit salary payment claims for project staff members.',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="12" y1="1" x2="12" y2="5"/><line x1="14" y1="3" x2="10" y2="3"/></svg>,
  },
  {
    id: 'contingency-claims',
    title: 'Contingency Claims',
    desc: 'Submit contingency expense claims for project activities.',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
  },
  {
    id: 'equipment-claims',
    title: 'Equipment Claims',
    desc: 'File claims for equipment purchases and maintenance costs.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    id: 'overhead-claims',
    title: 'Overhead Claims',
    desc: 'Submit overhead and institutional charges claims.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.3)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-5 9 5v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/><polyline points="9 22 9 13 15 13 15 22"/></svg>,
  },
];

const PayCard = ({ title, desc, color, glow, icon, onClick }) => (
  <div
    className="pay-card"
    style={{ '--pay-color': color, '--pay-glow': glow, '--pay-icon-bg': `${color}18` }}
    onClick={onClick}
  >
    <div className="pay-card-shimmer" />
    <div className="pay-card-icon">{icon}</div>
    <div>
      <div className="pay-card-title">{title}</div>
      <div className="pay-card-desc">{desc}</div>
    </div>
    <div className="pay-card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

const PaymentClaimsPage = ({ onNavigate }) => (
  <div className="subpage">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Payment Claims</span>
      </div>
      <h1 className="page-title">Payment Claims</h1>
      <p className="page-subtitle">Manage and submit all payment claim requests</p>
    </div>
    <div className="pay-cards-grid">
      {payCards.map((c, i) => (
        <div key={c.id} className="pay-card-wrapper" style={{ animationDelay: `${i * 0.08}s` }}>
          <PayCard {...c} onClick={() => alert(`${c.title} — Coming Soon`)} />
        </div>
      ))}
    </div>
  </div>
);

export default PaymentClaimsPage;