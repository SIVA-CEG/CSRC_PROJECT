import React from 'react';
import '../endorsements/EndorsementsPage.css';

const ConsultanciesPage = ({ onNavigate }) => (
  <div className="endorsements-page">
    <div className="page-header">
      <div className="page-breadcrumb">Home / <span>Consultancies</span></div>
      <h1 className="page-title">Consultancies</h1>
      <p className="page-subtitle">Industry consultancy engagements and records</p>
    </div>
    <div style={{
      background:'rgba(255,255,255,0.03)', border:'1px dashed rgba(255,255,255,0.1)',
      borderRadius:16, padding:'60px 40px', textAlign:'center', color:'rgba(255,255,255,0.3)',
      fontFamily:'DM Sans, sans-serif', fontSize:14
    }}>
      🔧 Consultancies module is under development. Check back soon.
    </div>
  </div>
);

export default ConsultanciesPage;