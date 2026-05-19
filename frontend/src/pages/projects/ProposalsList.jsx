import React from 'react';
import '../endorsements/EndorsementsList.css';

const proposals = [
  { sl: 1, propId: 1407, appliedOn: '22-10-2024', scheme: 'Features of the electroplastic effect and its influence on the deformability of ultrafine-grained alloys based on titanium and aluminum', cost: '94,64,822.00' },
  { sl: 2, propId: 1414, appliedOn: '29-10-2024', scheme: 'Electroplastic effect and its influence on the deformability of ultrafine-grained titanium and aluminum alloys', cost: '96,94,592.00' },
];

const ProposalsList = ({ onNavigate }) => (
  <div className="endorsements-list-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Proposals</span>
      </div>
      <h1 className="page-title">My Proposals</h1>
    </div>

    <div className="table-card">
      <div className="table-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="table-card-title">Listing applied Project Proposals</span>
          <span className="table-count-badge">{proposals.length} records</span>
        </div>
        <button className="new-btn" onClick={() => alert('New Proposal form coming soon')}>
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
            <th>Prop. ID</th>
            <th>Applied On</th>
            <th>Scheme</th>
            <th>Cost (Rs.)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(item => (
            <tr key={item.sl}>
              <td>{item.sl}</td>
              <td style={{color:'#00b4ff',fontWeight:500}}>{item.propId}</td>
              <td style={{whiteSpace:'nowrap'}}>{item.appliedOn}</td>
              <td style={{maxWidth:380, lineHeight:1.5}}>{item.scheme}</td>
              <td style={{whiteSpace:'nowrap'}}>{item.cost}</td>
              <td>
                <div className="action-btns">
                  <button className="action-btn view" title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button className="action-btn pdf" title="Download PDF">
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
        <span className="page-info">1 of 2 records</span>
        <button className="page-btn">Next</button>
        <button className="page-btn">Last</button>
      </div>
    </div>
  </div>
);

export default ProposalsList;