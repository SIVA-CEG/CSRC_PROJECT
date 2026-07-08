import React, { useState } from 'react';
import './Sidebar.css';

const navItems = [
  {
    id: 'profile',
    label: 'Profile',
    icon: '👨‍🔬',
  },
  {
    id: 'endorsements',
    label: 'Endorsements',
    icon: '🏅',
  },
  {
    id: 'projects',
    label: 'My Projects',
    icon: '📁',
    sub: [
      { id: 'sanctioned', label: 'Sanctioned Projects' },
      { id: 'ctdt', label: 'CTDT Proceedings' },
      { id: 'projectstaff', label: 'Project Staff' },
      { id: 'requestforms', label: 'Request Forms' },
      { id: 'paymentclaims', label: 'Payment Claims' },
      { id: 'zbaslip', label: 'Claim Bills' },
      {
  id: 'statementofexpenditure',
  label: 'Statement Of Expenditure'
},
      {
  id: 'reports',
  label: 'Project Reports'
},
      {
  id: 'projecttransfer',
  label: 'Project Transfer'
},
    ],
  },
  {
    id: 'consultancies',
    label: 'Consultancies',
    icon: '💼',
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: '🧪',
  },
  {
    id: 'training',
    label: 'Training',
    icon: '🎓',
  },
  {
    id: 'workshops',
    label: 'Workshops',
    icon: '📅',
  },
];

const Sidebar = ({ activePage, onNavigate }) => {
  const [openSubs, setOpenSubs] = useState({ projects: true });

  const toggleSub = (id) =>
    setOpenSubs(prev => ({ ...prev, [id]: !prev[id] }));

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