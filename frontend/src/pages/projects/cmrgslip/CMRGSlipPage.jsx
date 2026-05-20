import React from 'react';
import '../../endorsements/EndorsementsPage.css';

const CMRGSlipPage = ({ onNavigate }) => (
  <div className="endorsements-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>CMRG Slip</span>
      </div>
      <h1 className="page-title">CMRG Slip</h1>
      <p className="page-subtitle">Contingency Meeting & Research Grant slip</p>
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
      📑 CMRG Slip module is under development.
    </div>
  </div>
);

export default CMRGSlipPage;