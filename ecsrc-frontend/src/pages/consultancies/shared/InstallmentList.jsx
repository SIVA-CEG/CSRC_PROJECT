// PATH: frontend/src/pages/consultancies/shared/InstallmentList.jsx

import React, { useMemo, useEffect, useState } from 'react';
import BackButton from './BackButton';
import AddInstallmentForm from './AddInstallmentForm';
import { fetchInstallmentForms } from './consultancyApi';

/* ---------------------------------------------------------------------- */
/*  Landing page for the "Add Installment" card. Lists every acceptance   */
/*  form that was submitted with Payment Terms = "With Installment"       */
/*  (details.work.installmentType === 'with') and lets the office add /   */
/*  update the installment particulars for that consultancy — same        */
/*  visual language as AcceptanceFormStatus, so the two feel like one     */
/*  family of screens.                                                    */
/* ---------------------------------------------------------------------- */

const styles = {
  page: { minHeight: '100%', padding: '0 4px' },
  breadcrumb: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13,
    color: 'rgba(30,41,59,0.45)', marginBottom: 6,
  },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbActive: { color: 'rgba(30,41,59,0.85)', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 },
  title: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 26, fontWeight: 700,
    color: '#1e293b', margin: 0, letterSpacing: '-0.02em',
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(30,41,59,0.55)',
    margin: '0 0 22px 0',
  },

  card: {
    background: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
    overflow: 'hidden', width: '100%',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 820 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
    color: '#f59e0b', background: 'rgba(245,158,11,0.1)', textAlign: 'left',
    padding: '12px 14px', textTransform: 'uppercase', letterSpacing: '0.02em',
    whiteSpace: 'nowrap', position: 'sticky', top: 0,
  },
  thRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
    color: '#f59e0b', background: 'rgba(245,158,11,0.1)', textAlign: 'right',
    padding: '12px 14px', textTransform: 'uppercase', letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },
  td: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b',
    padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top',
  },
  tdRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b',
    padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top',
    textAlign: 'right',
  },
  idCell: { fontWeight: 700, color: '#f59e0b' },
  addBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)', border: 'none',
    borderRadius: 8, padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
    boxShadow: '0 6px 14px -4px #f59e0b88',
  },
  emptyState: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'rgba(30,41,59,0.45)',
    padding: '50px 20px', textAlign: 'center',
  },
};

// campus: 'department' | 'center'
const InstallmentList = ({ campus, onNavigate }) => {
  const [activeRecord, setActiveRecord] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

  const loadRows = () => {
    setLoading(true);
    setLoadError('');
    fetchInstallmentForms(campus)
      .then(setRows)
      .catch((err) => setLoadError(err.message || 'Failed to load installments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRows();
  }, [campus]);

  if (activeRecord) {
    return (
      <AddInstallmentForm
        record={activeRecord}
        campus={campus}
        onBack={() => setActiveRecord(null)}
        onSaved={() => { setActiveRecord(null); loadRows(); }}
      />
    );
  }
  if (loading) {
    return <div style={styles.page}><p style={styles.subtitle}>Loading installments…</p></div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate(parentKey)}>{parentLabel}</span> /{' '}
        <span style={styles.breadcrumbActive}>Add Installment</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate(parentKey)} />
        <h1 style={styles.title}>Add Installment</h1>
      </div>
      <p style={styles.subtitle}>
        Consultancies submitted with an installment-based payment plan — {isDept ? 'Department' : 'Centre / Other Campuses'}
      </p>
            {loadError && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{loadError}</p>
      )}

      <div style={styles.card}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Firm Name</th>
                <th style={styles.thRight}>Amount (Rs.)</th>
                <th style={styles.th}>Add</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={{ ...styles.td, ...styles.idCell }}>{r.id}</td>
                  <td style={styles.td}>{r.consultantTitle || '—'}</td>
                  <td style={styles.td}>{r.firmName || '—'}</td>
                  <td style={styles.tdRight}>{r.amount.toLocaleString('en-IN')}</td>
                  <td style={styles.td}>
                    <button style={styles.addBtn} onClick={() => setActiveRecord(r)}>+ Add</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan={6}>
                    <div style={styles.emptyState}>
                      No consultancies with an installment-based payment plan yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstallmentList;