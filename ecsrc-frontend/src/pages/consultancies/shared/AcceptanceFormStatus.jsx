import React, { useMemo, useState, useEffect } from 'react';
import AcceptanceFormPrintView from './AcceptanceFormPrintView';
import BackButton from './BackButton';
import { fetchAcceptanceForms, fetchAcceptanceFormDetail, updateAcceptanceFormStatus, fileUrl } from './consultancyApi';

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

  tabsRow: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  tab: (active) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    padding: '9px 18px', borderRadius: 999,
    border: active ? '1px solid #0ea5e9' : '1px solid rgba(30,41,59,0.12)',
    background: active ? '#0ea5e9' : 'rgba(255,255,255,0.7)',
    color: active ? '#fff' : '#334155',
    boxShadow: active ? '0 8px 18px -6px #0ea5e988' : 'none',
    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s ease',
  }),
  tabCount: (active) => ({
    fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '1px 8px',
    background: active ? 'rgba(255,255,255,0.25)' : 'rgba(30,41,59,0.08)',
    color: active ? '#fff' : '#475569',
  }),

  card: {
    background: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20, boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
    overflow: 'hidden', width: '100%',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 980 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
    color: '#0ea5e9', background: 'rgba(14,165,233,0.08)', textAlign: 'left',
    padding: '12px 14px', textTransform: 'uppercase', letterSpacing: '0.02em',
    whiteSpace: 'nowrap', position: 'sticky', top: 0,
  },
  td: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#1e293b',
    padding: '13px 14px', borderTop: '1px solid rgba(30,41,59,0.06)', verticalAlign: 'top',
  },
  idCell: { fontWeight: 700, color: '#0ea5e9' },
  statusBadge: (meta) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700,
    color: meta.color, background: meta.bg, borderRadius: 999,
    padding: '4px 11px', display: 'inline-block',
  }),
  remarkNote: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#ef4444',
    marginTop: 4, maxWidth: 220, lineHeight: 1.4,
  },
  viewBtn: (accent) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
    background: accent, border: 'none', borderRadius: 8, padding: '8px 14px',
    cursor: 'pointer', whiteSpace: 'nowrap',
  }),
  emptyState: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'rgba(30,41,59,0.45)',
    padding: '50px 20px', textAlign: 'center',
  },

  modalBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 20,
  },
  modalCard: {
    background: '#fff', borderRadius: 18, width: 520, maxWidth: '100%',
    boxShadow: '0 24px 60px rgba(15,23,42,0.3)', overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid rgba(30,41,59,0.08)',
  },
  modalTitle: { fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 },
  modalClose: { cursor: 'pointer', border: 'none', background: 'transparent', fontSize: 18, color: 'rgba(30,41,59,0.4)' },
  modalBody: { padding: '26px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  fileIcon: {
    width: 64, height: 64, borderRadius: 14, background: 'rgba(14,165,233,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
  },
  fileName: { fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 600, color: '#1e293b' },
  filePlaceholderNote: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(30,41,59,0.5)',
    textAlign: 'center', lineHeight: 1.5,
  },
  modalFooter: {
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    padding: '14px 20px', borderTop: '1px solid rgba(30,41,59,0.08)', background: 'rgba(248,250,255,0.6)',
  },
  modalBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 700,
    padding: '9px 18px', borderRadius: 9, cursor: 'pointer', border: 'none',
    background: '#0ea5e9', color: '#fff',
  },
};

const STATUS_META = {
  submitted: { label: 'Submitted', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  accepted: { label: 'Accepted', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const FILTERS = [
  { key: 'all', label: 'All Forms' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

const FirmLetterModal = ({ record, onClose }) => (
  <div style={styles.modalBackdrop} onClick={onClose}>
    <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
      <div style={styles.modalHeader}>
        <h3 style={styles.modalTitle}>Firm Letter — {record.id}</h3>
        <button style={styles.modalClose} onClick={onClose}>✕</button>
      </div>
      <div style={styles.modalBody}>
        {record.firmLetterFile ? (
          <>
            <div style={styles.fileIcon}>📄</div>
            <div style={styles.fileName}>{record.firmLetterFile.split('/').pop()}</div>
            <a
            
              href={fileUrl(record.firmLetterFile)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 700,
                color: '#0ea5e9', textDecoration: 'none', marginTop: 4,
              }}
            >
              Open in new tab ↗
            </a>
          </>
        ) : (
          <>
            <div style={styles.fileIcon}>📄</div>
            <p style={styles.filePlaceholderNote}>No firm letter has been uploaded for this consultancy yet.</p>
          </>
        )}
      </div>
      <div style={styles.modalFooter}>
        <button style={styles.modalBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const ReviewModal = ({ record, action, remarks, setRemarks, saving, error, onClose, onConfirm }) => {
  const isAccept = action === 'accepted';
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{isAccept ? 'Accept' : 'Reject'} — {record.id}</h3>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#334155', marginBottom: 12, textAlign: 'left', alignSelf: 'flex-start' }}>
            {isAccept
              ? 'This will mark the acceptance form as Accepted.'
              : 'Please provide a reason for rejection — this will be shown to the consultant.'}
          </p>
          <textarea
            style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
              padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
              width: '100%', boxSizing: 'border-box', minHeight: 90, resize: 'vertical',
            }}
            placeholder={isAccept ? 'Optional remarks…' : 'Reason for rejection (required)…'}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          {error && <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#ef4444', marginTop: 8 }}>{error}</p>}
        </div>
        <div style={styles.modalFooter}>
          <button
            style={{ ...styles.modalBtn, background: 'transparent', color: '#334155', border: '1px solid rgba(30,41,59,0.15)' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{ ...styles.modalBtn, background: isAccept ? '#16a34a' : '#ef4444', opacity: saving || (!isAccept && !remarks.trim()) ? 0.6 : 1 }}
            onClick={onConfirm}
            disabled={saving || (!isAccept && !remarks.trim())}
          >
            {saving ? 'Saving…' : isAccept ? '✓ Confirm Accept' : '✕ Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AcceptanceFormStatus = ({ campus, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [printRecord, setPrintRecord] = useState(null);
  const [letterRecord, setLetterRecord] = useState(null);
  const [reviewRecord, setReviewRecord] = useState(null);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [printLoading, setPrintLoading] = useState(false);

  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    fetchAcceptanceForms(campus)
      .then((data) => { if (!cancelled) setForms(data); })
      .catch((err) => { if (!cancelled) setLoadError(err.message || 'Failed to load acceptance forms.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [campus]);

  const counts = useMemo(() => ({
    all: forms.length,
    submitted: forms.filter((f) => f.status === 'submitted').length,
    accepted: forms.filter((f) => f.status === 'accepted').length,
    rejected: forms.filter((f) => f.status === 'rejected').length,
  }), [forms]);

  const rows = useMemo(
    () => (filter === 'all' ? forms : forms.filter((f) => f.status === filter)),
    [forms, filter]
  );

  const handleViewAcceptanceForm = async (record) => {
    setPrintLoading(true);
    try {
      const detail = await fetchAcceptanceFormDetail(record.id);
      setPrintRecord(detail);
    } catch (err) {
      setLoadError(err.message || 'Failed to load the acceptance form.');
    } finally {
      setPrintLoading(false);
    }
  };

  const openReview = (record, action) => {
    setReviewRecord(record);
    setReviewAction(action);
    setReviewRemarks('');
    setReviewError('');
  };

  const submitReview = async () => {
    if (!reviewRecord || !reviewAction) return;
    setReviewSaving(true);
    setReviewError('');
    try {
      await updateAcceptanceFormStatus(reviewRecord.id, reviewAction, reviewRemarks);
      setReviewRecord(null);
      setReviewAction(null);
      setLoading(true);
      fetchAcceptanceForms(campus)
        .then(setForms)
        .catch((err) => setLoadError(err.message || 'Failed to reload forms.'))
        .finally(() => setLoading(false));
    } catch (err) {
      setReviewError(err.message || 'Failed to update status.');
    } finally {
      setReviewSaving(false);
    }
  };

  if (printRecord) {
    return <AcceptanceFormPrintView record={printRecord} onBack={() => setPrintRecord(null)} />;
  }
  if (loading) {
    return <div style={styles.page}><p style={styles.subtitle}>Loading acceptance forms…</p></div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate(parentKey)}>{parentLabel}</span> /{' '}
        <span style={styles.breadcrumbActive}>Acceptance Form Status</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate(parentKey)} />
        <h1 style={styles.title}>Acceptance Form Status</h1>
      </div>
      <p style={styles.subtitle}>Consultancy wise list of all submitted acceptance forms — {isDept ? 'Department' : 'Centre / Other Campuses'}</p>

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
                <th style={styles.th}>Firm Name</th>
                <th style={styles.th}>Consultant Title</th>
                <th style={styles.th}>Installment</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Firm Letter</th>
                <th style={styles.th}>Acceptance Form</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const meta = STATUS_META[r.status];
                return (
                  <tr key={r.id}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={{ ...styles.td, ...styles.idCell }}>{r.id}</td>
                    <td style={styles.td}>{r.firmName || '—'}</td>
                    <td style={styles.td}>{r.consultantTitle}</td>
                    <td style={styles.td}>{r.installment}</td>
                    <td style={styles.td}>{r.type}</td>
                    <td style={styles.td}>{r.amount.toLocaleString('en-IN')}</td>
                    <td style={styles.td}>{r.duration}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(meta)}>{meta.label}</span>
                      {r.status === 'rejected' && r.remarks && (
                        <div style={styles.remarkNote}>{r.remarks}</div>
                      )}
                      {r.status === 'submitted' && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button
                            style={{ ...styles.viewBtn('#16a34a'), padding: '6px 10px', fontSize: 11 }}
                            onClick={() => openReview(r, 'accepted')}
                          >
                            ✓ Accept
                          </button>
                          <button
                            style={{ ...styles.viewBtn('#ef4444'), padding: '6px 10px', fontSize: 11 }}
                            onClick={() => openReview(r, 'rejected')}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn('#0f766e')} onClick={() => setLetterRecord(r)}>👁 View</button>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn('#7c1f3f')} onClick={() => handleViewAcceptanceForm(r)} disabled={printLoading}>📄 View</button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan={11}>
                    <div style={styles.emptyState}>No forms in this category yet.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {letterRecord && <FirmLetterModal record={letterRecord} onClose={() => setLetterRecord(null)} />}
      {reviewRecord && (
        <ReviewModal
          record={reviewRecord}
          action={reviewAction}
          remarks={reviewRemarks}
          setRemarks={setReviewRemarks}
          saving={reviewSaving}
          error={reviewError}
          onClose={() => { setReviewRecord(null); setReviewAction(null); }}
          onConfirm={submitReview}
        />
      )}
    </div>
  );
};

export default AcceptanceFormStatus;