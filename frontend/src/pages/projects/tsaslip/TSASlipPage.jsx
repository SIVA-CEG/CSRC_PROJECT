import React from 'react';
import '../../endorsements/EndorsementsPage.css';

const TSASlipPage = ({ onNavigate }) => (
  <div className="endorsements-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>TSA(H) Slip</span>
      </div>
      <h1 className="page-title">TSA(H) Slip</h1>
      <p className="page-subtitle">Treasury Single Account (Head) slip management</p>
    </div>
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '60px 40px',
      textAlign: 'center',
      color: 'rgba(255,255,255,0.3)',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: 14
    }}>
      🏛️ TSA(H) Slip module is under development.
    </div>
  </div>
);

export default TSASlipPage;