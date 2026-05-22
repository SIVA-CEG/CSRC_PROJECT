import React, { useState } from 'react';
import './ProjectStaffPage.css';
import StaffDetails from './StaffDetails';
import AppointmentOrders from './AppointmentOrders';

const subCards = [
  {
    id: 'staff-details',
    title: 'Project Staff Details',
    desc: 'View, add and manage all staff members assigned to your projects.',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.28)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    stat: 'Staff Members',
  },
  {
    id: 'appointment-orders',
    title: 'Staff Appointment Orders',
    desc: 'Issue and manage appointment orders, contracts and extensions.',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.28)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    stat: 'Active Contracts',
  },
];

const ProjectStaffPage = ({ onNavigate }) => {
  const [activePage, setActivePage] = useState(null);

  if (activePage === 'staff-details') {
    return <StaffDetails onBack={() => setActivePage(null)} onNavigate={onNavigate} />;
  }
  if (activePage === 'appointment-orders') {
    return <AppointmentOrders onBack={() => setActivePage(null)} onNavigate={onNavigate} />;
  }

  return (
    <div className="ps-subpage">
      <div className="ps-page-header">
        <div className="ps-breadcrumb">
          <span onClick={() => onNavigate && onNavigate('home')}>Home</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span onClick={() => onNavigate && onNavigate('projects')}>My Projects</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span className="ps-crumb-active">Project Staff</span>
        </div>
        <div className="ps-title-row">
          <h1 className="ps-page-title">Project Staff</h1>
          <p className="ps-page-sub">Manage staff assignments, appointments and contracts</p>
        </div>
      </div>

      <div className="ps-sub-cards-grid">
        {subCards.map((c, i) => (
          <div
            key={c.id}
            className="ps-sub-card"
            style={{ '--sc': c.color, '--sg': c.glow, animationDelay: `${i * 0.1}s` }}
            onClick={() => setActivePage(c.id)}
          >
            <div className="ps-card-top">
              <div className="ps-card-icon">{c.icon}</div>
              <div className="ps-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
            <div className="ps-card-body">
              <div className="ps-card-title">{c.title}</div>
              <div className="ps-card-desc">{c.desc}</div>
            </div>
            <div className="ps-card-glow-bar" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStaffPage;