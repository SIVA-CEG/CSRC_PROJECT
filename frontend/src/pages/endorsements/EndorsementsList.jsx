import React from 'react';
import './EndorsementsList.css';

const endorsements = [
  { sl: 1, propId: 'END-001', appliedOn: '10-01-2025', scheme: 'SERB — Core Research Grant for Advanced Materials Study', cost: '12,50,000', status: 'approved' },
  { sl: 2, propId: 'END-002', appliedOn: '22-03-2025', scheme: 'DST — FIST Infrastructure Development Grant', cost: '8,75,000', status: 'pending' },
  { sl: 3, propId: 'END-003', appliedOn: '05-05-2025', scheme: 'CSIR — Young Scientist Research Award Scheme', cost: '5,00,000', status: 'approved' },
];

const EndorsementsList = ({ onNavigate }) => {
  const handleDownloadPDF = (item) => {
    alert(`Downloading PDF for ${item.propId}...`);
  };

  return (
    <div className="endorsements-list-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home / <span onClick={() => onNavigate('endorsements')}>Endorsements</span> / <span>List</span>
        </div>
        <h1 className="page-title">List of Endorsements</h1>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="table-card-title">Listing applied Endorsements</span>
            <span className="table-count-badge">{endorsements.length} records</span>
          </div>
          <button className="new-btn" onClick={() => onNavigate('endorsements-new')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14}}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            NEW
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Endorsement ID</th>
              <th>Applied On</th>
              <th>Scheme</th>
              <th>Cost (Rs.)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {endorsements.map(item => (
              <tr key={item.sl}>
                <td>{item.sl}</td>
                <td style={{color:'#00b4ff', fontWeight:500}}>{item.propId}</td>
                <td>{item.appliedOn}</td>
                <td style={{maxWidth:320}}>{item.scheme}</td>
                <td>{item.cost}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn view" title="View">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button className="action-btn pdf" title="Download PDF" onClick={() => handleDownloadPDF(item)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="12" y1="18" x2="12" y2="12"/>
                        <line x1="9" y1="15" x2="15" y2="15"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-pagination">
          <button className="page-btn">First</button>
          <button className="page-btn">Prev</button>
          <span className="page-info">1 of 1 records</span>
          <button className="page-btn">Next</button>
          <button className="page-btn">Last</button>
        </div>
      </div>
    </div>
  );
};

export default EndorsementsList;