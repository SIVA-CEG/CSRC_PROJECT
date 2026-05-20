import React from 'react';
import './SanctionedList.css';

const sanctioned = [
  { sl: 1, fileNo: '1234/CSRC-2/2025', title: 'ABCD', cost: '1,00,000/-' },
  { sl: 2, fileNo: '2433/CSRC-2/2020', title: 'Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application', cost: '43,64,360/-' },
  { sl: 3, fileNo: '721/CSRC-2/2013',  title: 'Studies on Thermal Stability of Bulk Nano Structured Aluminium-Lithium (AA8090) Alloy Processed by Respective Corrugation and Straightening', cost: '19,28,000/-' },
];

const SanctionedList = ({ onNavigate }) => (
  <div className="sanctioned-page">
    <div className="page-header">
      <div className="page-breadcrumb">
        Home / <span onClick={() => onNavigate('projects')}>My Projects</span> / <span>Sanctioned Projects</span>
      </div>
      <h1 className="page-title">List of Sanctioned Projects</h1>
    </div>

    <div className="sanctioned-table-card">
      <div className="sanctioned-table-header">
        <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <span className="sanctioned-table-title">Sanctioned Projects</span>
          <span className="sanctioned-count-badge">{sanctioned.length} records</span>
        </div>
        <div className="sanctioned-search-wrap">
          <input className="sanctioned-search" placeholder="Search File No..." />
          <input className="sanctioned-search" placeholder="Search Title..." />
          <button className="sanctioned-new-btn" onClick={() => alert('Add new project coming soon')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Project
          </button>
        </div>
      </div>

      <table className="sanctioned-table">
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
              <td className="file-no-cell">{item.fileNo}</td>
              <td className="title-cell">{item.title}</td>
              <td className="sanctioned-cost-cell">{item.cost}</td>
              <td>
                <button className="sanctioned-view-btn" title="View">
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

      <div className="sanctioned-pagination">
        <button className="sanctioned-page-btn">First</button>
        <button className="sanctioned-page-btn">Prev</button>
        <span className="sanctioned-page-info">1 of 3 records</span>
        <button className="sanctioned-page-btn">Next</button>
        <button className="sanctioned-page-btn">Last</button>
      </div>
    </div>
  </div>
);

export default SanctionedList;