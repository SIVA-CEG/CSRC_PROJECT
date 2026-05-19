import React from 'react';
import '../endorsements/EndorsementsList.css';

const sanctioned = [
  { sl: 1, fileNo: '1234/CSRC-2/2025', title: 'ABCD', cost: '1,00,000/-' },
  { sl: 2, fileNo: '2433/CSRC-2/2020', title: 'Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application', cost: '43,64,360/-' },
  { sl: 3, fileNo: '721/CSRC-2/2013', title: 'Studies on Thermal Stability of Bulk Nano Structured Aluminium-Lithium (AA8090) Alloy Processed by Respective Corrugation and Straightening', cost: '19,28,000/-' },
];

const SanctionedList = ({ onNavigate }) => (
  <div className="endorsements-list-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Sanctioned Projects</span>
      </div>
      <h1 className="page-title">List of Sanctioned Projects</h1>
    </div>

    <div className="table-card">
      <div className="table-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="table-card-title">Sanctioned Projects</span>
          <span className="table-count-badge">{sanctioned.length} records</span>
        </div>
        <button className="new-btn" onClick={() => alert('Add new project coming soon')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:14,height:14}}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add new Project
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>File No</th>
            <th>Project Title</th>
            <th>Total Project Cost (Rs.)</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {sanctioned.map(item => (
            <tr key={item.sl}>
              <td>{item.sl}</td>
              <td style={{color:'#a78bfa',fontWeight:500,whiteSpace:'nowrap'}}>{item.fileNo}</td>
              <td style={{maxWidth:360, lineHeight:1.5}}>{item.title}</td>
              <td style={{whiteSpace:'nowrap'}}>{item.cost}</td>
              <td>
                <button className="action-btn view" title="View">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-pagination">
        <button className="page-btn">First</button>
        <button className="page-btn">Prev</button>
        <span className="page-info">1 of 3 records</span>
        <button className="page-btn">Next</button>
        <button className="page-btn">Last</button>
      </div>
    </div>
  </div>
);

export default SanctionedList;