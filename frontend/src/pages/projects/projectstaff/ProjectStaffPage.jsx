import React from 'react';
import './ProjectStaffPage.css';

const subCards = [
  {
    id: 'staff-details',
    title: 'Project Staff Details',
    desc: 'View and manage all staff members assigned to your projects.',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: 'appointment-orders',
    title: 'Staff Appointment Orders',
    desc: 'Issue and track appointment orders for project staff members.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

const SubCard = ({ title, desc, color, glow, icon, onClick }) => (
  <div
    className="sub-card"
    style={{ '--sub-color': color, '--sub-glow': glow, '--sub-icon-bg': `${color}18` }}
    onClick={onClick}
  >
    <div className="sub-card-shimmer" />
    <div className="sub-card-icon">{icon}</div>
    <div>
      <div className="sub-card-title">{title}</div>
      <div className="sub-card-desc">{desc}</div>
    </div>
    <div className="sub-card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </div>
  </div>
);

const ProjectStaffPage = ({ onNavigate }) => (
  <div className="subpage">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Project Staff</span>
      </div>
      <h1 className="page-title">Project Staff</h1>
      <p className="page-subtitle">Manage staff assignments and appointment orders</p>
    </div>
    <div className="sub-cards-grid">
      {subCards.map(c => (
        <SubCard key={c.id} {...c} onClick={() => alert(`${c.title} — Coming Soon`)} />
      ))}
    </div>
  </div>
);

export default ProjectStaffPage;