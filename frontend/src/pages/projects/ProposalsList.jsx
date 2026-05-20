import React from 'react';
import './ProposalsList.css';

const proposals = [
  { sl: 1, propId: 1407, appliedOn: '22-10-2024', scheme: 'Features of the electroplastic effect and its influence on the deformability of ultrafine-grained alloys based on titanium and aluminum', cost: '94,64,822.00' },
  { sl: 2, propId: 1414, appliedOn: '29-10-2024', scheme: 'Electroplastic effect and its influence on the deformability of ultrafine-grained titanium and aluminum alloys', cost: '96,94,592.00' },
];

const ProposalsList = ({ onNavigate }) => (
  <div className="proposals-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Proposals</span>
      </div>
      <h1 className="page-title">My Proposals</h1>
    </div>

    <div className="proposals-table-card">
      <div className="proposals-table-header">
        <div style={{ display:'flex', alignItems:'center' }}>
          <span className="proposals-table-title">Listing applied Project Proposals</span>
          <span className="proposals-count-badge">{proposals.length} records</span>
        </div>
        <button className="proposals-new-btn" onClick={() => alert('New Proposal form coming soon')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          NEW
        </button>
      </div>

      <table className="proposals-table">
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
              <td className="prop-id-cell">{item.propId}</td>
              <td className="date-cell">{item.appliedOn}</td>
              <td className="scheme-cell">{item.scheme}</td>
              <td className="cost-cell">{item.cost}</td>
              <td>
                <div className="proposals-action-btns">
                  <button className="proposals-action-btn view" title="View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button className="proposals-action-btn pdf" title="Download PDF">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </button>
                  <button className="proposals-action-btn endorse" title="Endorse">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="proposals-pagination">
        <button className="proposals-page-btn">First</button>
        <button className="proposals-page-btn">Prev</button>
        <span className="proposals-page-info">1 of 2 records</span>
        <button className="proposals-page-btn">Next</button>
        <button className="proposals-page-btn">Last</button>
      </div>
    </div>
  </div>
);

export default ProposalsList;