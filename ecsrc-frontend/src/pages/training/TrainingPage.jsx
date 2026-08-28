import React from 'react';
import '../endorsements/EndorsementsPage.css';

const TrainingPage = () => (
  <div className="endorsements-page">
    <div className="page-header">
      <div className="page-breadcrumb">Home / <span>Training</span></div>
      <h1 className="page-title">Training</h1>
      <p className="page-subtitle">Training programs and certifications</p>
    </div>
    <div style={{
      background:'rgba(255,255,255,0.03)', border:'1px dashed rgba(255,255,255,0.1)',
      borderRadius:16, padding:'60px 40px', textAlign:'center', color:'rgba(255,255,255,0.3)',
      fontFamily:'DM Sans, sans-serif', fontSize:14
    }}>
      📚 Training module is under development. Check back soon.
    </div>
  </div>
);

export default TrainingPage;