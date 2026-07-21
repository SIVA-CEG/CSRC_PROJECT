import React, { useMemo, useState } from 'react';
import AcceptanceFormPrintView from './AcceptanceFormPrintView';
import BackButton from './BackButton';

/* ---------------------------------------------------------------------- */
/*  NOTE ON BACKEND INTEGRATION                                           */
/*  The four filter tabs and per-row status are driven by `status` on     */
/*  each record ('submitted' | 'accepted' | 'rejected'). Right now this   */
/*  is mock data. Once the office login is wired in, `status`/`remarks`   */
/*  should come from the review action performed there — the UI below    */
/*  doesn't need to change, only the data source.                        */
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
    overflow: 'hidden', maxWidth: 1180,
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

  /* Firm letter modal */
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

/* ---- mock data — replace with an API call once the backend is ready ---- */
const MOCK_FORMS = [
  {
    id: '1819C1472', firmName: '', consultantTitle: 'jiooj', installment: 'Single',
    type: 'Prior Permission', amount: 657650, duration: '2018-04-01 to 2018-04-05',
    status: 'submitted', firmLetterFile: 'firm-letter-1819C1472.pdf',
    details: {
      principal: { name: 'Dr. A. Ravindran', designation: 'Professor', department: 'Mechanical Engineering', campus: 'CEG', contactNo: '9876500011', email: 'ravindran@annauniv.edu' },
      firm: { name: 'Jiooj Pvt Ltd', pan: 'AAAAJ1234K', gst: '33AAAAJ1234K1Z1', letterRef: 'JJ/2018/014 dt. 28.03.2018', contactName: 'S. Kumar', contactNo: '9944400011', address: 'Guindy, Chennai' },
      work: { title: 'jiooj', abstract: 'Abstract of the proposed consultancy work covering scope, deliverables and methodology.', startDate: '2018-04-01', endDate: '2018-04-05', totalHours: 40, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 200000, travel: 40000, equipment: 0, contingency: 15000, consumables: 10000, consultantRemuneration: 300000, deptStaffRemuneration: 20000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 657650, taxPercent: 18 },
    },
  },
  {
    id: '1819C2480', firmName: '', consultantTitle: 'gdshfdh', installment: 'Multiple / 1',
    type: 'Prior Permission', amount: 456395, duration: '2019-01-03 to 2019-01-03',
    status: 'accepted', firmLetterFile: 'firm-letter-1819C2480.pdf',
    details: {
      principal: { name: 'Dr. M. Priya', designation: 'Associate Professor', department: 'Civil Engineering', campus: 'CEG', contactNo: '9876500022', email: 'priya@annauniv.edu' },
      firm: { name: 'GDS Infra Pvt Ltd', pan: 'AAAAG5678K', gst: '33AAAAG5678K1Z2', letterRef: 'GDS/2019/002 dt. 02.01.2019', contactName: 'R. Meena', contactNo: '9944400022', address: 'Ambattur, Chennai' },
      work: { title: 'gdshfdh', abstract: 'Structural feasibility review and site assessment for the proposed facility.', startDate: '2019-01-03', endDate: '2019-01-03', totalHours: 60, hasEquipment: 'no', workType: 'permission', installmentType: 'with', installmentCount: 1 },
      expenditure: { manpower: 150000, travel: 25000, equipment: 0, contingency: 20000, consumables: 5000, consultantRemuneration: 220000, deptStaffRemuneration: 15000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 456395, taxPercent: 18 },
    },
  },
  {
    id: '1819C2522', firmName: '', consultantTitle: 'DEMO', installment: 'Single',
    type: 'Postfacto Permission', amount: 25000, duration: '2019-01-19 to 2019-01-31',
    status: 'rejected', remarks: 'GST certificate not attached — please resubmit with the required document.',
    firmLetterFile: 'firm-letter-1819C2522.pdf',
    details: {
      principal: { name: 'Dr. S. Kannan', designation: 'Assistant Professor', department: 'Electronics & Communication Engineering', campus: 'CEG', contactNo: '9876500033', email: 'kannan@annauniv.edu' },
      firm: { name: 'Demo Solutions', pan: 'AAAAD9999K', gst: '', letterRef: 'DEMO/2019/1', contactName: 'V. Raj', contactNo: '9944400033', address: 'T. Nagar, Chennai' },
      work: { title: 'DEMO', abstract: 'Sample demo consultancy record used for testing the workflow.', startDate: '2019-01-19', endDate: '2019-01-31', totalHours: 10, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 10000, travel: 5000, equipment: 0, contingency: 2000, consumables: 1000, consultantRemuneration: 5000, deptStaffRemuneration: 2000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 25000, taxPercent: 18 },
    },
  },
  {
    id: '1920C3398', firmName: 'SAL Pvt. Ltd', consultantTitle: 'Technical appraisal for MBR Sewage treatment plant of 100KLD', installment: 'Single',
    type: 'Permission', amount: 500000, duration: '2019-11-25 to 2019-11-25',
    status: 'accepted', firmLetterFile: 'firm-letter-1920C3398.pdf',
    details: {
      principal: { name: 'Dr. N. Suresh', designation: 'Professor', department: 'Civil Engineering', campus: 'CEG', contactNo: '9876500044', email: 'suresh@annauniv.edu' },
      firm: { name: 'SAL Pvt. Ltd', pan: 'AAAAS4321K', gst: '33AAAAS4321K1Z3', letterRef: 'SAL/2019/031 dt. 20.11.2019', contactName: 'K. Iyer', contactNo: '9944400044', address: 'Guindy, Chennai' },
      work: { title: 'Technical appraisal for MBR Sewage treatment plant of 100KLD', abstract: 'Technical evaluation of the proposed MBR-based sewage treatment plant design, capacity, and compliance.', startDate: '2019-11-25', endDate: '2019-11-25', totalHours: 30, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 180000, travel: 30000, equipment: 0, contingency: 25000, consumables: 5000, consultantRemuneration: 220000, deptStaffRemuneration: 15000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 500000, taxPercent: 18 },
    },
  },
  {
    id: '1920C3436', firmName: '43', consultantTitle: '4343', installment: 'Single',
    type: 'Prior Permission', amount: 11800, duration: '2019-12-16 to 2019-12-08',
    status: 'submitted', firmLetterFile: 'firm-letter-1920C3436.pdf',
    details: {
      principal: { name: 'Dr. T. Bala', designation: 'Assistant Professor', department: 'Information Technology', campus: 'CEG', contactNo: '9876500055', email: 'bala@annauniv.edu' },
      firm: { name: '43', pan: '', gst: '', letterRef: '', contactName: '', contactNo: '', address: '' },
      work: { title: '4343', abstract: 'Placeholder abstract text for test record 1920C3436.', startDate: '2019-12-16', endDate: '2019-12-08', totalHours: 5, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 4000, travel: 1000, equipment: 0, contingency: 500, consumables: 300, consultantRemuneration: 5000, deptStaffRemuneration: 500, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 11800, taxPercent: 18 },
    },
  },
];
/* -------------------------------------------------------------------- */

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
        <div style={styles.fileIcon}>📄</div>
        <div style={styles.fileName}>{record.firmLetterFile}</div>
        <p style={styles.filePlaceholderNote}>
          This will preview the actual uploaded firm-letter file once file storage is
          connected — inline for PDFs, or as an image for scanned letters.
        </p>
      </div>
      <div style={styles.modalFooter}>
        <button style={styles.modalBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

// campus: 'department' | 'center'
const AcceptanceFormStatus = ({ campus, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [printRecord, setPrintRecord] = useState(null);
  const [letterRecord, setLetterRecord] = useState(null);

  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

  const counts = useMemo(() => ({
    all: MOCK_FORMS.length,
    submitted: MOCK_FORMS.filter((f) => f.status === 'submitted').length,
    accepted: MOCK_FORMS.filter((f) => f.status === 'accepted').length,
    rejected: MOCK_FORMS.filter((f) => f.status === 'rejected').length,
  }), []);

  const rows = useMemo(
    () => (filter === 'all' ? MOCK_FORMS : MOCK_FORMS.filter((f) => f.status === filter)),
    [filter]
  );

  if (printRecord) {
    return <AcceptanceFormPrintView record={printRecord} onBack={() => setPrintRecord(null)} />;
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
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn('#0f766e')} onClick={() => setLetterRecord(r)}>👁 View</button>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn('#7c1f3f')} onClick={() => setPrintRecord(r)}>📄 View</button>
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
    </div>
  );
};

export default AcceptanceFormStatus;