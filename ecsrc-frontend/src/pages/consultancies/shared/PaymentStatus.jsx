// PATH: frontend/src/pages/consultancies/shared/PaymentStatus.jsx

import React, { useEffect, useMemo, useState } from 'react';
import PaymentEntryForm from './PaymentEntryForm';
import PaymentPrintView from './PaymentPrintView';
import InvoicePrintView from './InvoicePrintView';
import AcceptanceFormPrintView from './AcceptanceFormPrintView';
import BackButton from './BackButton';
import { fetchPayments, savePayment, fetchAcceptanceFormDetail } from './consultancyApi';

/* ---------------------------------------------------------------------- */
/*  Only records where invoice.status === 'completed' ever appear here —  */
/*  that's the "all completed invoices feed the Submitted tab" rule.      */
/*  Submitted = invoice completed, payment not yet approved.              */
/*  Completed = payment.status === 'completed' (Pay-In Slip finalised).   */
/* ---------------------------------------------------------------------- */

const accent = '#db2777';

const styles = {
  page: { minHeight: '100%', padding: '0 4px' },
  breadcrumb: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(30,41,59,0.45)', marginBottom: 6 },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbActive: { color: 'rgba(30,41,59,0.85)', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 },
  title: { fontFamily: 'DM Sans, sans-serif', fontSize: 26, fontWeight: 700, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(30,41,59,0.55)', margin: '0 0 22px 0' },

  tabsRow: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  tab: (active) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    padding: '9px 18px', borderRadius: 999,
    border: active ? `1px solid ${accent}` : '1px solid rgba(30,41,59,0.12)',
    background: active ? accent : 'rgba(255,255,255,0.7)',
    color: active ? '#fff' : '#334155',
    boxShadow: active ? `0 8px 18px -6px ${accent}88` : 'none',
    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s ease',
  }),
  tabCount: (active) => ({
    fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '1px 8px',
    background: active ? 'rgba(255,255,255,0.25)' : 'rgba(30,41,59,0.08)',
    color: active ? '#fff' : '#475569',
  }),

  card: {
    background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20,
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden', width: '100%',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 900 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: accent,
    background: `${accent}14`, textAlign: 'left', padding: '12px 14px',
    textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap',
  },
  thRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: accent,
    background: `${accent}14`, textAlign: 'right', padding: '12px 14px',
    textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap',
  },
  td: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b', padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top' },
  tdRight: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b', padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top', textAlign: 'right' },
  idCell: { fontWeight: 700, color: accent },
  statusBadge: (meta) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
    color: meta.color, background: meta.bg, borderRadius: 999, padding: '4px 11px', display: 'inline-block',
  }),
  actionBtn: (bg) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
    background: bg, border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
    whiteSpace: 'nowrap', marginRight: 8, marginBottom: 6,
  }),
  emptyState: { fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'rgba(30,41,59,0.45)', padding: '50px 20px', textAlign: 'center' },
};

const STATUS_META = {
  submitted: { label: 'Submitted', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  completed: { label: 'Completed', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
};

const FILTERS = [
  { key: 'all', label: 'All Payments' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'completed', label: 'Completed' },
];

// campus: 'department' | 'center'
const PaymentStatus = ({ campus, onNavigate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [entryRecord, setEntryRecord] = useState(null);
  const [printRecord, setPrintRecord] = useState(null);
  const [invoiceRecord, setInvoiceRecord] = useState(null);
  const [acfRecord, setAcfRecord] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

  const paymentTabOf = (r) => (r.payment?.status === 'completed' ? 'completed' : 'submitted');

  const loadRecords = () => {
    setLoading(true);
    setLoadError('');
    fetchPayments(campus)
      .then(setRecords)
      .catch((err) => setLoadError(err.message || 'Failed to load payments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecords();
  }, [campus]);

  const counts = useMemo(() => ({
    all: records.length,
    submitted: records.filter((r) => paymentTabOf(r) === 'submitted').length,
    completed: records.filter((r) => paymentTabOf(r) === 'completed').length,
  }), [records]);

  const rows = useMemo(
    () => (filter === 'all' ? records : records.filter((r) => paymentTabOf(r) === filter)),
    [records, filter]
  );

  const handleSavePayment = async (particulars) => {
    try {
      await savePayment(entryRecord.id, particulars);
      setEntryRecord(null);
      loadRecords();
    } catch (err) {
      setLoadError(err.message || 'Failed to save payment.');
    }
  };
    const handleViewAcf = async (r) => {
    setViewLoading(true);
    try {
      const detail = await fetchAcceptanceFormDetail(r.id);
      setAcfRecord(detail);
    } catch (err) {
      setLoadError(err.message || 'Failed to load acceptance form.');
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewInvoice = async (r) => {
    setViewLoading(true);
    try {
      const detail = await fetchAcceptanceFormDetail(r.id);
      setInvoiceRecord(detail);
    } catch (err) {
      setLoadError(err.message || 'Failed to load invoice.');
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewSlip = async (r) => {
    setViewLoading(true);
    try {
      const detail = await fetchAcceptanceFormDetail(r.id);
      setPrintRecord(detail);
    } catch (err) {
      setLoadError(err.message || 'Failed to load payment slip.');
    } finally {
      setViewLoading(false);
    }
  };

  if (entryRecord) {
    return (
      <PaymentEntryForm
        record={entryRecord}
        campus={campus}
        onBack={() => setEntryRecord(null)}
        onSave={handleSavePayment}
      />
    );
  }
  if (printRecord) {
    return <PaymentPrintView record={printRecord} onBack={() => setPrintRecord(null)} />;
  }
  if (invoiceRecord) {
    return <InvoicePrintView record={invoiceRecord} onBack={() => setInvoiceRecord(null)} />;
  }
  if (acfRecord) {
    return <AcceptanceFormPrintView record={acfRecord} onBack={() => setAcfRecord(null)} />;
  }

  if (loading) {
    return <div style={styles.page}><p style={styles.subtitle}>Loading payments…</p></div>;
  }
  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate(parentKey)}>{parentLabel}</span> /{' '}
        <span style={styles.breadcrumbActive}>Payment Status</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate(parentKey)} />
        <h1 style={styles.title}>Payment Status</h1>
      </div>
      <p style={styles.subtitle}>Consultancies with an issued invoice — {isDept ? 'Department' : 'Centre / Other Campuses'}</p>
      {loadError && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>{loadError}</p>
      )}

      <div style={styles.tabsRow}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <div key={f.key} style={styles.tab(active)} onClick={() => setFilter(f.key)}>
              {f.label}
              <span style={styles.tabCount(active)}>{counts[f.key]}</span>
            </div>
          );
        })}
      </div>

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
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Acceptance Form</th>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const tab = paymentTabOf(r);
                const meta = STATUS_META[tab];
                return (
                  <tr key={r.id}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, ...styles.idCell }}>{r.id}</td>
                    <td style={{ ...styles.td, maxWidth: 280 }}>{r.consultantTitle || '—'}</td>
                    <td style={styles.td}>{r.firmName || '—'}</td>
                    <td style={styles.tdRight}>{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                    <td style={styles.td}><span style={styles.statusBadge(meta)}>{meta.label}</span></td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn('#334155')} onClick={() => handleViewAcf(r)}>📄 ACF</button>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn('#0f766e')} onClick={() => handleViewInvoice(r)}>🧾 Invoice</button>
                    </td>
                    <td style={styles.td}>
                      {tab === 'submitted' ? (
                        <button style={styles.actionBtn(accent)} onClick={() => setEntryRecord(r)}>+ Add Payment</button>
                      ) : (
                        <button style={styles.actionBtn('#16a34a')} onClick={() => handleViewSlip(r)}>📄 View Slip</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan={9}>
                    <div style={styles.emptyState}>No consultancies in this category yet.</div>
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

export default PaymentStatus;