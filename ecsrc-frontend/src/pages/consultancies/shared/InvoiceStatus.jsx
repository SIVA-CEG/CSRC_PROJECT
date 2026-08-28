// PATH: frontend/src/pages/consultancies/shared/InvoiceStatus.jsx
import React, { useEffect, useMemo, useState } from 'react';
import InvoicePrintView from './InvoicePrintView';
import AcceptanceFormPrintView from './AcceptanceFormPrintView';
import BackButton from './BackButton';
import { fetchInvoices, markInvoiceCompleted, fetchAcceptanceFormDetail } from './consultancyApi';

/* ---------------------------------------------------------------------- */
/*  Only records with details.work.workType === 'proforma' show up here.  */
/*  Submitted = invoice.status === 'submitted' (placeholder invoice no.). */
/*  Completed = invoice.status === 'completed' (real invoice no. issued,  */
/*  record then becomes eligible for the Payment Status "Submitted" tab). */
/*                                                                         */
/*  "Mark Completed" is a local mock action — wire it to the real backend */
/*  once office-login review is available; the actual invoice number      */
/*  should come from that workflow, not be typed in here.                 */
/* ---------------------------------------------------------------------- */

const accent = '#0f766e';

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
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 980 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: accent,
    background: 'rgba(15,118,110,0.08)', textAlign: 'left', padding: '12px 14px',
    textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap',
  },
  td: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b', padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top' },
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

  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20 },
  modalCard: { background: '#fff', borderRadius: 18, width: 440, maxWidth: '100%', boxShadow: '0 24px 60px rgba(15,23,42,0.3)', overflow: 'hidden' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(30,41,59,0.08)' },
  modalTitle: { fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 },
  modalClose: { cursor: 'pointer', border: 'none', background: 'transparent', fontSize: 18, color: 'rgba(30,41,59,0.4)' },
  modalBody: { padding: '20px 20px 6px' },
  modalLabel: { fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 8, display: 'block' },
  modalInput: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b', padding: '9px 12px',
    borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)', background: '#fff', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  modalNote: { fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'rgba(30,41,59,0.5)', margin: '8px 0 0' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 20px', borderTop: '1px solid rgba(30,41,59,0.08)', background: 'rgba(248,250,255,0.6)' },
  modalBtnGhost: { fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 700, padding: '9px 18px', borderRadius: 9, cursor: 'pointer', border: '1px solid rgba(30,41,59,0.15)', background: 'transparent', color: '#334155' },
  modalBtnFilled: { fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 700, padding: '9px 18px', borderRadius: 9, cursor: 'pointer', border: 'none', background: accent, color: '#fff' },
};

const STATUS_META = {
  submitted: { label: 'Submitted', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  completed: { label: 'Completed', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
};

const FILTERS = [
  { key: 'all', label: 'All Invoices' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'completed', label: 'Completed' },
];

const MarkCompletedModal = ({ record, onClose, onConfirm }) => {
  const [invoiceNo, setInvoiceNo] = useState('');
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Issue Invoice — {record.id}</h3>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <label style={styles.modalLabel}>Invoice Number</label>
          <input
            style={styles.modalInput} value={invoiceNo} placeholder="e.g. CSRC/INV/2026/0143"
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
          <p style={styles.modalNote}>
            This replaces the &ldquo;WILL BE ISSUED AFTER APPROVAL FROM CSRC OFFICE&rdquo; line on
            the printed invoice and moves the record to the Completed tab.
          </p>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.modalBtnGhost} onClick={onClose}>Cancel</button>
          <button
            style={styles.modalBtnFilled}
            disabled={!invoiceNo.trim()}
            onClick={() => onConfirm(invoiceNo.trim())}
          >
            ✓ Mark Completed
          </button>
        </div>
      </div>
    </div>
  );
};

// campus: 'department' | 'center'
const InvoiceStatus = ({ campus, onNavigate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('all');
  const [printRecord, setPrintRecord] = useState(null);
  const [acfRecord, setAcfRecord] = useState(null);
  const [completingRecord, setCompletingRecord] = useState(null);

  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

    const [viewLoading, setViewLoading] = useState(false);

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
      setPrintRecord(detail);
    } catch (err) {
      setLoadError(err.message || 'Failed to load invoice.');
    } finally {
      setViewLoading(false);
    }
  };

  const loadRecords = () => {
    setLoading(true);
    setLoadError('');
    fetchInvoices(campus)
      .then(setRecords)
      .catch((err) => setLoadError(err.message || 'Failed to load invoices.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecords();
  }, [campus]);

  const counts = useMemo(() => ({
    all: records.length,
    submitted: records.filter((f) => f.invoice?.status === 'submitted').length,
    completed: records.filter((f) => f.invoice?.status === 'completed').length,
  }), [records]);

  const rows = useMemo(
    () => (filter === 'all' ? records : records.filter((f) => f.invoice?.status === filter)),
    [records, filter]
  );

  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState('');

  const handleMarkCompleted = async (invoiceNo) => {
    setCompleting(true);
    setCompleteError('');
    try {
      await markInvoiceCompleted(completingRecord.id, invoiceNo);
      setCompletingRecord(null);
      loadRecords();
    } catch (err) {
      setCompleteError(err.message || 'Failed to mark invoice completed.');
    } finally {
      setCompleting(false);
    }
  };

  if (printRecord) {
    return <InvoicePrintView record={printRecord} onBack={() => setPrintRecord(null)} />;
  }
  if (acfRecord) {
    return <AcceptanceFormPrintView record={acfRecord} onBack={() => setAcfRecord(null)} />;
  }

  if (loading) {
    return <div style={styles.page}><p style={styles.subtitle}>Loading invoices…</p></div>;
  }
  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate(parentKey)}>{parentLabel}</span> /{' '}
        <span style={styles.breadcrumbActive}>Invoice Status</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate(parentKey)} />
        <h1 style={styles.title}>Invoice Status</h1>
      </div>
      <p style={styles.subtitle}>Proforma-invoice consultancies — {isDept ? 'Department' : 'Centre / Other Campuses'}</p>
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
                <th style={styles.th}>Acceptance ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Firm Name</th>
                <th style={styles.th}>Approx. Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Acceptance Form</th>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const meta = STATUS_META[r.invoice.status];
                return (
                  <tr key={r.id}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, ...styles.idCell }}>{r.id}</td>
                    <td style={{ ...styles.td, maxWidth: 320 }}>{r.consultantTitle || '—'}</td>
                    <td style={styles.td}>{r.firmName || '—'}</td>
                    <td style={styles.td}>{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                    <td style={styles.td}><span style={styles.statusBadge(meta)}>{meta.label}</span></td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn('#334155')} onClick={() => handleViewAcf(r)}>📄 View ACF</button>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn(accent)} onClick={() => handleViewInvoice(r)}>🧾 View</button>
                    </td>
                    <td style={styles.td}>
                      {r.invoice.status === 'submitted' && (
                        <button style={styles.actionBtn('#16a34a')} onClick={() => setCompletingRecord(r)}>✓ Mark Completed</button>
                      )}
                      {r.invoice.status === 'completed' && (
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'rgba(30,41,59,0.45)' }}>
                          {r.invoice.invoiceNo}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan={9}>
                    <div style={styles.emptyState}>No invoices in this category yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {completingRecord && (
        <MarkCompletedModal
          record={completingRecord}
          onClose={() => setCompletingRecord(null)}
          onConfirm={handleMarkCompleted}
        />
      )}
    </div>
  );
};

export default InvoiceStatus;