import React, { useState } from 'react';
import './Sidebar.css';

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const navItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    id: 'endorsements',
    label: 'Endorsements',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    id: 'projects',
    label: 'My Projects',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v6M14.5 17h6" strokeLinecap="round"/></svg>,
    sub: [
      { id: 'proposals', label: 'Proposals' },
      { id: 'sanctioned', label: 'Sanctioned Projects' },
    ],
  },
  {
    id: 'consultancies',
    label: 'Consultancies',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-4 4h14l-4-4V3"/></svg>,
  },
  {
    id: 'training',
    label: 'Training',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  },
  {
    id: 'workshops',
    label: 'Workshops',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  },
];

const Sidebar = ({ activePage, onNavigate }) => {
  const [openSubs, setOpenSubs] = useState({ projects: true });

  const toggleSub = (id) => {
    setOpenSubs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">BP</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">Dr. S. Balasivanandha Prabu</span>
          <span className="sidebar-user-id">User ID: 62300</span>
        </div>
      </div>

      <span className="sidebar-section-label">Navigation</span>

      {navItems.map(item => (
        <React.Fragment key={item.id}>
          <div
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => {
              if (item.sub) toggleSub(item.id);
              else onNavigate(item.id);
            }}
          >
            {item.icon}
            <span className="sidebar-item-label">{item.label}</span>
            {item.sub && (
              <svg
                className={`sidebar-chevron ${openSubs[item.id] ? 'open' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            )}
          </div>

          {item.sub && (
            <div className={`sidebar-sub ${openSubs[item.id] ? 'open' : ''}`}>
              {item.sub.map(sub => (
                <div
                  key={sub.id}
                  className={`sidebar-subitem ${activePage === sub.id ? 'active' : ''}`}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span>{sub.label}</span>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}

      <div className="sidebar-divider" />
      <span className="sidebar-section-label">System</span>

      <div className="sidebar-item" onClick={() => onNavigate('home')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="sidebar-item-label">Home</span>
      </div>
    </aside>
  );
};

export default Sidebar;