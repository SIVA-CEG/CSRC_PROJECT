import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import CSRCClaimBillForm from './CSRCClaimBillForm';

// ============================================================
// PDFRequest.jsx
// Professional Development Fund (PDF) claim module.
// Light themed, self-contained inline styles (const styles).
// Persists requests to localStorage so they survive refresh.
//
// Lifecycle of a request (status field):
//   pending             -> submitted by faculty, in the CSRC approval chain
//   sanctioned          -> assistant -> superintendent -> DD -> director
//                          chain complete; CSRC office is now preparing
//                          the physical Claim Bill
//   awaiting_signature  -> CSRC office has entered the bill-processing
//                          figures and generated the Claim Bill; faculty
//                          should download it, get the Director's wet
//                          signature, and hand the physical copy back
//                          to CSRC office
//   completed           -> CSRC office has registered the "FOR OFFICE USE
//                          ONLY" section after receiving the signed copy
//   rejected            -> rejected at some stage of the approval chain
// ============================================================

// ─── Sample data: projects owned by the logged-in faculty ───
// Replace with real API / context data later.
export const facultyProjects = [
  { id: 'p1', fileNo: '1234/CSRC-2/2025', title: 'ABCD', pdfAmount: 65000 },
  { id: 'p2', fileNo: '2433/CSRC-2/2020', title: 'Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application', pdfAmount: 128000 },
  { id: 'p3', fileNo: '721/CSRC-2/2013', title: 'Studies on Thermal Stability of Bulk Nano Structured Aluminium-Lithium (AA8090) Alloy Processed by Respective Corrugation and Straightening', pdfAmount: 42500 },
];

const REQUEST_TYPES = [
  { id: 'reimbursement', label: 'Reimbursement' },
  { id: 'vendor', label: 'Vendor Payment' },
  { id: 'advance', label: 'Advance Payment' },
];

const PURPOSE_CATEGORIES = [
  {
    id: 'travel',
    label: 'Travel',
    fields: [
      { key: 'fromDate', label: 'From Date', type: 'date' },
      { key: 'toDate', label: 'To Date', type: 'date' },
      { key: 'purpose', label: 'Purpose of Travel', type: 'textarea' },
    ],
  },
  {
    id: 'membership',
    label: 'Membership Fee',
    fields: [
      { key: 'professionalBody', label: 'Professional Body', type: 'text' },
      { key: 'purpose', label: 'Purpose', type: 'textarea' },
    ],
  },
  {
    id: 'nonconsumables',
    label: 'Purchase of Non-Consumables',
    fields: [
      { key: 'description', label: 'Description of Item(s)', type: 'textarea' },
    ],
  },
  {
    id: 'consumables',
    label: 'Purchase of Consumables',
    fields: [
      { key: 'description', label: 'Description of Item(s)', type: 'textarea' },
    ],
  },
  {
    id: 'registration',
    label: 'Registration Fee',
    fields: [
      { key: 'purpose', label: 'Purpose', type: 'textarea' },
    ],
  },
  {
    id: 'patent',
    label: 'Patent Filing Charges',
    fields: [
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  {
    id: 'others',
    label: 'Others',
    fields: [
      { key: 'otherType', label: 'Specify Type', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
];

const BANKS = [
  'State Bank of India', 'Indian Bank', 'Indian Overseas Bank', 'Canara Bank',
  'Bank of Baroda', 'Punjab National Bank', 'HDFC Bank', 'ICICI Bank',
  'Axis Bank', 'Union Bank of India', 'Other',
];

const LS_KEY = 'csrc_pdf_requests';

// ─── Helpers ──────────────────────────────────────────────
const fmtINR = (n) => {
  const num = parseFloat(n);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

const loadRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveRequests = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch (_) {}
};

// ─── Shared PDF balance calculation ──────────────────────
// Exported so the CSRC office-side approval page can auto-fetch
// the exact same balance figures shown here, instead of someone
// re-typing them into the proceedings letter by hand.
export function getPDFBalanceSummary(requests) {
  const totalPDF = facultyProjects.reduce((s, p) => s + p.pdfAmount, 0);
  const committedAmount = requests
    .filter(r => r.status === 'pending' || r.status === 'sanctioned' || r.status === 'awaiting_signature' || r.status === 'completed')
    .reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const availableBalance = Math.max(totalPDF - committedAmount, 0);
  return { totalPDF, committedAmount, availableBalance };
}

const emptyAccount = () => ({
  accountHolder: '',
  accountNumber: '',
  ifsc: '',
  bankName: '',
  branch: '',
});

// Bill-related fields needed for the physical CSRC Claim Bill,
// captured up front from the faculty member so the office side
// doesn't have to chase these down later.
const emptyBillDetails = () => ({
  supplyOrderNo: '',
  supplyOrderDate: '',
  itemDetails: '',
  invoiceNo: '',
  invoiceDate: '',
  firmName: '',
  payeeName: '',
});

const emptyForm = () => ({
  account: emptyAccount(),
  requestType: '',
  category: '',
  categoryFields: {},
  amount: '',
  billDetails: emptyBillDetails(),
  letterFile: null,
  supportingFiles: [],
});

// ============================================================
// Styles (light theme)
// ============================================================
const styles = {
  page: {
    background: '#f4f6fa',
    minHeight: '100vh',
    padding: '28px 32px 60px',
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    color: '#1e293b',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#64748b',
    marginBottom: 10,
  },
  crumbLink: { cursor: 'pointer' },
  crumbCurrent: { color: '#1e293b', fontWeight: 600 },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: 700, margin: 0, color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },

  tabBar: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid #e2e8f0',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tabBtn: (active) => ({
    padding: '10px 18px',
    fontSize: 14,
    fontWeight: 600,
    color: active ? '#2563eb' : '#64748b',
    background: 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
    cursor: 'pointer',
  }),

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: (accent) => ({
    background: '#fff',
    borderRadius: 14,
    padding: '18px 20px',
    boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
    borderLeft: `4px solid ${accent}`,
  }),
  summaryLabel: { fontSize: 12.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 },
  summaryValue: { fontSize: 22, fontWeight: 700, color: '#0f172a', marginTop: 6 },
  summaryHint: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #eef1f6',
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBody: { padding: '18px 20px' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5 },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    background: '#f8fafc',
    color: '#475569',
    fontWeight: 600,
    borderBottom: '1px solid #e2e8f0',
  },
  td: { padding: '12px 14px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'top' },
  tdAmount: { padding: '12px 14px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 600, color: '#0f172a' },
  totalRow: { background: '#f8fafc', fontWeight: 700 },

  requestBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  requestBtnDisabled: {
    background: '#cbd5e1',
    color: '#64748b',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  refreshBtn: {
    background: '#fff',
    color: '#334155',
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
  },

  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  fieldWide: { gridColumn: '1 / -1' },
  label: { fontSize: 12.5, fontWeight: 600, color: '#475569' },
  input: {
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13.5,
    color: '#0f172a',
    outline: 'none',
    background: '#fff',
  },
  textarea: {
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13.5,
    color: '#0f172a',
    outline: 'none',
    background: '#fff',
    minHeight: 70,
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13.5,
    color: '#0f172a',
    outline: 'none',
    background: '#fff',
  },

  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  radioPill: (active) => ({
    padding: '9px 16px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#475569',
  }),

  uploadBox: {
    border: '1.5px dashed #cbd5e1',
    borderRadius: 10,
    padding: '16px',
    textAlign: 'center',
    background: '#f8fafc',
    cursor: 'pointer',
    fontSize: 13,
    color: '#64748b',
  },
  fileChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#eff6ff',
    color: '#2563eb',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 12.5,
    fontWeight: 600,
    marginTop: 8,
    marginRight: 6,
  },
  removeX: { cursor: 'pointer', fontWeight: 700, marginLeft: 4 },

  errorText: { color: '#dc2626', fontSize: 12.5, marginTop: 4 },
  helperText: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    background: '#fff',
    color: '#475569',
    border: '1px solid #d8dee8',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitBtn: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
  },

  emptyState: {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#94a3b8',
  },

  statusBadge: (status) => {
    const map = {
      pending: { bg: '#fff7ed', color: '#c2410c', label: 'Under Review' },
      sanctioned: { bg: '#eff6ff', color: '#2563eb', label: 'Sanctioned — Bill Under Preparation' },
      awaiting_signature: { bg: '#fefce8', color: '#ca8a04', label: 'Claim Bill Ready — Needs Signature' },
      completed: { bg: '#f0fdf4', color: '#16a34a', label: 'Completed' },
      rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
    };
    const s = map[status] || map.pending;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: s.bg,
      color: s.color,
      borderRadius: 999,
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: 700,
    };
  },
  statusLabel: (status) => ({
    pending: 'Under Review',
    sanctioned: 'Sanctioned — Bill Under Preparation',
    awaiting_signature: 'Claim Bill Ready — Needs Signature',
    completed: 'Completed',
    rejected: 'Rejected',
  }[status] || 'Under Review'),

  requestCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
    padding: '16px 20px',
    marginBottom: 14,
  },
  requestTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  requestId: { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  requestMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  requestDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 10,
    marginTop: 10,
    fontSize: 12.5,
  },
  detailKey: { color: '#94a3b8', display: 'block' },
  detailVal: { color: '#1e293b', fontWeight: 600 },

  noticeBox: (tone) => ({
    marginTop: 12,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 12.5,
    background: tone === 'warn' ? '#fefce8' : '#f0fdf4',
    color: tone === 'warn' ? '#92400e' : '#166534',
    border: `1px solid ${tone === 'warn' ? '#fde68a' : '#bbf7d0'}`,
  }),

  downloadBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
  },
  viewBtn: {
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 12.5,
    fontWeight: 700,
    cursor: 'pointer',
  },

  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '40px 16px', overflowY: 'auto', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760,
    boxShadow: '0 20px 60px rgba(15,23,42,0.25)',
  },
  modalHeader: {
    padding: '18px 24px', borderBottom: '1px solid #eef1f6',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  modalTitle: { fontSize: 17, fontWeight: 700, color: '#0f172a' },
  modalClose: { cursor: 'pointer', fontSize: 20, color: '#94a3b8', border: 'none', background: 'none' },
  modalBody: { padding: '20px 24px', maxHeight: '70vh', overflowY: 'auto' },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.4 },

  billModalOverlay: {
    position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto',
  },
  billModal: {
    background: '#f8fafc', borderRadius: 16, width: 'min(880px, 96vw)',
    maxHeight: 'calc(100vh - 32px)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
  },
  billModalHeader: {
    padding: '16px 20px', background: '#1e293b', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
  },
  billModalTitle: { fontSize: 15, fontWeight: 700, color: '#fff' },
  billModalBody: { flex: 1, overflowY: 'auto', padding: '16px 20px' },
  billCloseBtn: { background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontWeight: 700, fontSize: 12 },
  billDownloadBtn: { background: '#16a34a', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontWeight: 700, fontSize: 12 },
};

// ─── Small reusable field ────────────────────────────────
const Field = ({ label, wide, error, children }) => (
  <div style={{ ...styles.field, ...(wide ? styles.fieldWide : {}) }}>
    <label style={styles.label}>{label}</label>
    {children}
    {error && <span style={styles.errorText}>{error}</span>}
  </div>
);

// ============================================================
// Request Form Modal
// ============================================================
const PDFRequestModal = ({ available, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});

  const updAccount = (k, v) => setForm(f => ({ ...f, account: { ...f.account, [k]: v } }));
  const updField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updCategoryField = (k, v) =>
    setForm(f => ({ ...f, categoryFields: { ...f.categoryFields, [k]: v } }));
  const updBillDetail = (k, v) =>
    setForm(f => ({ ...f, billDetails: { ...f.billDetails, [k]: v } }));

  const selectedCategory = PURPOSE_CATEGORIES.find(c => c.id === form.category);

  const handleLetterUpload = (file) => updField('letterFile', file || null);
  const handleSupportingUpload = (fileList) => {
    const files = Array.from(fileList || []);
    updField('supportingFiles', [...form.supportingFiles, ...files]);
  };
  const removeSupporting = (idx) =>
    updField('supportingFiles', form.supportingFiles.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!form.account.accountHolder) e.accountHolder = 'Required';
    if (!form.account.accountNumber) e.accountNumber = 'Required';
    if (!form.account.ifsc) e.ifsc = 'Required';
    if (!form.account.bankName) e.bankName = 'Required';
    if (!form.requestType) e.requestType = 'Select a request type';
    if (!form.category) e.category = 'Select a category';
    if (selectedCategory) {
      selectedCategory.fields.forEach(f => {
        if (!form.categoryFields[f.key]) e[f.key] = 'Required';
      });
    }
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount';
    else if (amt > available) e.amount = `Cannot exceed available PDF balance (₹ ${fmtINR(available)})`;
    if (!form.letterFile) e.letterFile = 'PDF request letter is required';
    // Bill details: the payee is always required since every claim
    // bill needs someone to pay; the rest (supply order / invoice /
    // firm) don't apply to every category (e.g. travel), so they
    // stay optional here and can be filled in later if needed.
    if (!form.billDetails.payeeName) e.payeeName = 'Required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>New PDF Request</span>
          <button style={styles.modalClose} onClick={onClose}>×</button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.helperText}>
            Available PDF balance: <strong>₹ {fmtINR(available)}</strong>
          </div>

          {/* Account Info */}
          <div style={{ ...styles.section, marginTop: 16 }}>
            <div style={styles.sectionTitle}>1. Account Information</div>
            <div style={styles.fieldGrid}>
              <Field label="Account Holder Name" error={errors.accountHolder}>
                <input style={styles.input} value={form.account.accountHolder}
                  onChange={e => updAccount('accountHolder', e.target.value)} />
              </Field>
              <Field label="Bank Account Number" error={errors.accountNumber}>
                <input style={styles.input} value={form.account.accountNumber}
                  onChange={e => updAccount('accountNumber', e.target.value)} />
              </Field>
              <Field label="IFSC Code" error={errors.ifsc}>
                <input style={styles.input} value={form.account.ifsc}
                  onChange={e => updAccount('ifsc', e.target.value.toUpperCase())} />
              </Field>
              <Field label="Bank Name" error={errors.bankName}>
                <select style={styles.select} value={form.account.bankName}
                  onChange={e => updAccount('bankName', e.target.value)}>
                  <option value="">Select Bank</option>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Branch">
                <input style={styles.input} value={form.account.branch}
                  onChange={e => updAccount('branch', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Request Type */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>2. Type of Request</div>
            <div style={styles.radioGroup}>
              {REQUEST_TYPES.map(t => (
                <div key={t.id} style={styles.radioPill(form.requestType === t.id)}
                  onClick={() => updField('requestType', t.id)}>
                  {t.label}
                </div>
              ))}
            </div>
            {errors.requestType && <div style={styles.errorText}>{errors.requestType}</div>}
          </div>

          {/* Purpose Category */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>3. Purpose of Claim</div>
            <div style={styles.radioGroup}>
              {PURPOSE_CATEGORIES.map(c => (
                <div key={c.id} style={styles.radioPill(form.category === c.id)}
                  onClick={() => { updField('category', c.id); updField('categoryFields', {}); }}>
                  {c.label}
                </div>
              ))}
            </div>
            {errors.category && <div style={styles.errorText}>{errors.category}</div>}

            {selectedCategory && (
              <div style={{ ...styles.fieldGrid, marginTop: 14 }}>
                {selectedCategory.fields.map(f => (
                  <Field key={f.key} label={f.label} wide={f.type === 'textarea'} error={errors[f.key]}>
                    {f.type === 'textarea' ? (
                      <textarea style={styles.textarea}
                        value={form.categoryFields[f.key] || ''}
                        onChange={e => updCategoryField(f.key, e.target.value)} />
                    ) : (
                      <input style={styles.input} type={f.type}
                        value={form.categoryFields[f.key] || ''}
                        onChange={e => updCategoryField(f.key, e.target.value)} />
                    )}
                  </Field>
                ))}
              </div>
            )}
          </div>

          {/* Amount */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>4. Amount Requested</div>
            <div style={styles.fieldGrid}>
              <Field label={`Amount (₹) — max ₹ ${fmtINR(available)}`} error={errors.amount}>
                <input style={styles.input} type="number" value={form.amount}
                  onChange={e => updField('amount', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Bill Details — feeds directly into the CSRC Claim Bill
              that gets generated after sanction */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>5. Bill Details (for the Claim Bill)</div>
            <div style={styles.fieldGrid}>
              <Field label="Supply Order No.">
                <input style={styles.input} value={form.billDetails.supplyOrderNo}
                  onChange={e => updBillDetail('supplyOrderNo', e.target.value)} />
              </Field>
              <Field label="Supply Order Date">
                <input style={styles.input} type="date" value={form.billDetails.supplyOrderDate}
                  onChange={e => updBillDetail('supplyOrderDate', e.target.value)} />
              </Field>
              <Field label="Item Details" wide>
                <textarea style={styles.textarea} value={form.billDetails.itemDetails}
                  onChange={e => updBillDetail('itemDetails', e.target.value)} />
              </Field>
              <Field label="Invoice No.">
                <input style={styles.input} value={form.billDetails.invoiceNo}
                  onChange={e => updBillDetail('invoiceNo', e.target.value)} />
              </Field>
              <Field label="Invoice Date">
                <input style={styles.input} type="date" value={form.billDetails.invoiceDate}
                  onChange={e => updBillDetail('invoiceDate', e.target.value)} />
              </Field>
              <Field label="Name of the Firm">
                <input style={styles.input} value={form.billDetails.firmName}
                  onChange={e => updBillDetail('firmName', e.target.value)} />
              </Field>
              <Field label="Name of the Payee" error={errors.payeeName}>
                <input style={styles.input} value={form.billDetails.payeeName}
                  onChange={e => updBillDetail('payeeName', e.target.value)} />
              </Field>
            </div>
            <div style={styles.helperText}>
              Supply Order / Invoice / Firm details apply mainly to purchases — leave blank if not applicable to your claim.
            </div>
          </div>

          {/* Uploads */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>6. Documents</div>
            <div style={styles.fieldGrid}>
              <Field label="PDF Request Letter" error={errors.letterFile}>
                <label style={styles.uploadBox}>
                  {form.letterFile ? 'Change File' : 'Click to Upload Letter'}
                  <input type="file" style={{ display: 'none' }}
                    onChange={e => handleLetterUpload(e.target.files[0])} />
                </label>
                {form.letterFile && (
                  <span style={styles.fileChip}>
                    {form.letterFile.name}
                    <span style={styles.removeX} onClick={() => updField('letterFile', null)}>×</span>
                  </span>
                )}
              </Field>

              <Field label="Supporting Documents (bills, tickets, receipts, etc.)">
                <label style={styles.uploadBox}>
                  Click to Upload (multiple allowed)
                  <input type="file" multiple style={{ display: 'none' }}
                    onChange={e => handleSupportingUpload(e.target.files)} />
                </label>
                <div>
                  {form.supportingFiles.map((f, i) => (
                    <span key={i} style={styles.fileChip}>
                      {f.name}
                      <span style={styles.removeX} onClick={() => removeSupporting(i)}>×</span>
                    </span>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={styles.submitBtn} onClick={handleSubmit}>Submit to CSRC</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Claim Bill preview / download modal
// ============================================================
const ClaimBillPreviewModal = ({ request, onClose }) => {
  const ref = useRef(null);

  const downloadPDF = () => {
    if (!ref.current) return;
    html2pdf().set({
      margin: 8,
      filename: `${request.billProcessingData?.csrcBillNo || request.id}-Claim-Bill.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(ref.current).save();
  };

  return (
    <div style={styles.billModalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.billModal}>
        <div style={styles.billModalHeader}>
          <span style={styles.billModalTitle}>Claim Bill — {request.id}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.billDownloadBtn} onClick={downloadPDF}>📄 Download PDF</button>
            <button style={styles.billCloseBtn} onClick={onClose}>✕ Close</button>
          </div>
        </div>
        <div style={styles.billModalBody}>
          {request.status === 'awaiting_signature' && (
            <div style={styles.noticeBox('warn')}>
              Download this Claim Bill, get it physically signed by the Director, and submit the signed
              physical copy back to the CSRC office to complete your claim.
            </div>
          )}
          <div ref={ref}>
            <CSRCClaimBillForm item={request} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main Page
// ============================================================
const PDFRequest = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview | requests
  const [requestsSubTab, setRequestsSubTab] = useState('pending'); // pending | inProcess | completed | rejected
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [billPreview, setBillPreview] = useState(null);

  const refresh = () => setRequests(loadRequests());

  useEffect(() => { refresh(); }, []);

  const { totalPDF, committedAmount, availableBalance } = getPDFBalanceSummary(requests);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const inProcessRequests = requests.filter(r => r.status === 'sanctioned' || r.status === 'awaiting_signature');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const handleSubmitRequest = (form) => {
    const newRequest = {
      id: `PDF-${Date.now()}`,
      account: form.account,
      requestType: REQUEST_TYPES.find(t => t.id === form.requestType)?.label || form.requestType,
      category: PURPOSE_CATEGORIES.find(c => c.id === form.category)?.label || form.category,
      categoryFields: form.categoryFields,
      billDetails: form.billDetails,
      amount: parseFloat(form.amount),
      letterFileName: form.letterFile ? form.letterFile.name : null,
      supportingFileNames: form.supportingFiles.map(f => f.name),
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('en-IN'),
    };
    const updated = [...requests, newRequest];
    setRequests(updated);
    saveRequests(updated);
    setShowModal(false);
    setActiveTab('requests');
    setRequestsSubTab('pending');
  };

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.crumbLink} onClick={() => onNavigate && onNavigate('home')}>Home</span>
        <span>›</span>
        <span style={styles.crumbLink} onClick={() => onNavigate && onNavigate('projects')}>My Projects</span>
        <span>›</span>
        <span style={styles.crumbCurrent}>PDF Requests</span>
      </div>

      <div style={styles.titleRow}>
        <div>
          <h1 style={styles.title}>Professional Development Fund (PDF)</h1>
          <div style={styles.subtitle}>Claim PDF amounts accrued across your sanctioned projects</div>
        </div>
        {availableBalance > 0 ? (
          <button style={styles.requestBtn} onClick={() => setShowModal(true)}>
            + Request PDF
          </button>
        ) : (
          <button style={styles.requestBtnDisabled} disabled>
            No Balance Available
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard('#2563eb')}>
          <div style={styles.summaryLabel}>Total PDF Amount</div>
          <div style={styles.summaryValue}>₹ {fmtINR(totalPDF)}</div>
          <div style={styles.summaryHint}>Across {facultyProjects.length} projects</div>
        </div>
        <div style={styles.summaryCard('#f59e0b')}>
          <div style={styles.summaryLabel}>Requested / In Process</div>
          <div style={styles.summaryValue}>₹ {fmtINR(committedAmount)}</div>
          <div style={styles.summaryHint}>{pendingRequests.length} under review · {inProcessRequests.length} in bill processing</div>
        </div>
        <div style={styles.summaryCard('#16a34a')}>
          <div style={styles.summaryLabel}>Available Balance</div>
          <div style={styles.summaryValue}>₹ {fmtINR(availableBalance)}</div>
          <div style={styles.summaryHint}>Can be claimed in a new request</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        <button style={styles.tabBtn(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>
          Project-wise PDF
        </button>
        <button style={styles.tabBtn(activeTab === 'requests')} onClick={() => setActiveTab('requests')}>
          My Requests {requests.length > 0 ? `(${requests.length})` : ''}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>Projects & PDF Amount</div>
          <div style={styles.cardBody}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>File No</th>
                  <th style={styles.th}>Project Title</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>PDF Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {facultyProjects.map(p => (
                  <tr key={p.id}>
                    <td style={styles.td}>{p.fileNo}</td>
                    <td style={styles.td}>{p.title}</td>
                    <td style={styles.tdAmount}>{fmtINR(p.pdfAmount)}</td>
                  </tr>
                ))}
                <tr style={styles.totalRow}>
                  <td style={styles.td} colSpan={2}>Total PDF Amount</td>
                  <td style={styles.tdAmount}>{fmtINR(totalPDF)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={styles.tabBar}>
              <button style={styles.tabBtn(requestsSubTab === 'pending')} onClick={() => setRequestsSubTab('pending')}>
                Under Review ({pendingRequests.length})
              </button>
              <button style={styles.tabBtn(requestsSubTab === 'inProcess')} onClick={() => setRequestsSubTab('inProcess')}>
                Bill Processing ({inProcessRequests.length})
              </button>
              <button style={styles.tabBtn(requestsSubTab === 'completed')} onClick={() => setRequestsSubTab('completed')}>
                Completed ({completedRequests.length})
              </button>
              <button style={styles.tabBtn(requestsSubTab === 'rejected')} onClick={() => setRequestsSubTab('rejected')}>
                Rejected ({rejectedRequests.length})
              </button>
            </div>
            <button style={styles.refreshBtn} onClick={refresh}>↻ Refresh Status</button>
          </div>

          {requestsSubTab === 'pending' && (
            pendingRequests.length === 0 ? (
              <div style={styles.card}><div style={styles.emptyState}>No requests currently under review.</div></div>
            ) : (
              pendingRequests.map(r => (
                <div key={r.id} style={styles.requestCard}>
                  <div style={styles.requestTopRow}>
                    <div>
                      <div style={styles.requestId}>{r.id} — {r.category}</div>
                      <div style={styles.requestMeta}>Submitted {r.submittedAt} · {r.requestType}</div>
                    </div>
                    <span style={styles.statusBadge('pending')}>● {styles.statusLabel('pending')}</span>
                  </div>
                  <div style={styles.requestDetailsGrid}>
                    <div><span style={styles.detailKey}>Amount</span><span style={styles.detailVal}>₹ {fmtINR(r.amount)}</span></div>
                    <div><span style={styles.detailKey}>Payee</span><span style={styles.detailVal}>{r.billDetails?.payeeName || '—'}</span></div>
                    <div><span style={styles.detailKey}>Bank</span><span style={styles.detailVal}>{r.account.bankName}</span></div>
                    <div><span style={styles.detailKey}>Letter</span><span style={styles.detailVal}>{r.letterFileName || '—'}</span></div>
                  </div>
                  <div style={styles.noticeBox('info')}>Awaiting approval from CSRC office (Assistant → Superintendent → Deputy Director → Director).</div>
                </div>
              ))
            )
          )}

          {requestsSubTab === 'inProcess' && (
            inProcessRequests.length === 0 ? (
              <div style={styles.card}><div style={styles.emptyState}>No requests currently in bill processing.</div></div>
            ) : (
              inProcessRequests.map(r => (
                <div key={r.id} style={styles.requestCard}>
                  <div style={styles.requestTopRow}>
                    <div>
                      <div style={styles.requestId}>{r.id} — {r.category}</div>
                      <div style={styles.requestMeta}>Sanctioned · {r.requestType}</div>
                    </div>
                    <span style={styles.statusBadge(r.status)}>● {styles.statusLabel(r.status)}</span>
                  </div>
                  <div style={styles.requestDetailsGrid}>
                    <div><span style={styles.detailKey}>Amount</span><span style={styles.detailVal}>₹ {fmtINR(r.amount)}</span></div>
                    <div><span style={styles.detailKey}>Payee</span><span style={styles.detailVal}>{r.billDetails?.payeeName || '—'}</span></div>
                  </div>
                  {r.status === 'sanctioned' && (
                    <div style={styles.noticeBox('info')}>Your PDF sanction is approved. CSRC office is preparing the Claim Bill for signature.</div>
                  )}
                  {r.status === 'awaiting_signature' && (
                    <>
                      <div style={styles.noticeBox('warn')}>
                        Claim Bill is ready. Download it, get the Director's physical signature, and return the signed copy to CSRC office.
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <button style={styles.downloadBtn} onClick={() => setBillPreview(r)}>📄 View / Download Claim Bill</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )
          )}

          {requestsSubTab === 'completed' && (
            completedRequests.length === 0 ? (
              <div style={styles.card}><div style={styles.emptyState}>No completed PDF claims yet.</div></div>
            ) : (
              completedRequests.map(r => (
                <div key={r.id} style={styles.requestCard}>
                  <div style={styles.requestTopRow}>
                    <div>
                      <div style={styles.requestId}>{r.id} — {r.category}</div>
                      <div style={styles.requestMeta}>Completed · {r.requestType}</div>
                    </div>
                    <span style={styles.statusBadge('completed')}>✓ {styles.statusLabel('completed')}</span>
                  </div>
                  <div style={styles.requestDetailsGrid}>
                    <div><span style={styles.detailKey}>Amount Paid</span><span style={styles.detailVal}>₹ {fmtINR(r.officeUseData?.paidRs || r.amount)}</span></div>
                    <div><span style={styles.detailKey}>Cheque No.</span><span style={styles.detailVal}>{r.officeUseData?.chequeNo || '—'}</span></div>
                    <div><span style={styles.detailKey}>Paid On</span><span style={styles.detailVal}>{r.officeUseData?.dated || '—'}</span></div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <button style={styles.viewBtn} onClick={() => setBillPreview(r)}>📄 View Final Claim Bill</button>
                  </div>
                </div>
              ))
            )
          )}

          {requestsSubTab === 'rejected' && (
            rejectedRequests.length === 0 ? (
              <div style={styles.card}><div style={styles.emptyState}>No rejected requests.</div></div>
            ) : (
              rejectedRequests.map(r => (
                <div key={r.id} style={styles.requestCard}>
                  <div style={styles.requestTopRow}>
                    <div>
                      <div style={styles.requestId}>{r.id} — {r.category}</div>
                      <div style={styles.requestMeta}>{r.requestType}</div>
                    </div>
                    <span style={styles.statusBadge('rejected')}>✕ {styles.statusLabel('rejected')}</span>
                  </div>
                </div>
              ))
            )
          )}
        </>
      )}

      {showModal && (
        <PDFRequestModal
          available={availableBalance}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitRequest}
        />
      )}

      {billPreview && (
        <ClaimBillPreviewModal request={billPreview} onClose={() => setBillPreview(null)} />
      )}
    </div>
  );
};

export default PDFRequest;