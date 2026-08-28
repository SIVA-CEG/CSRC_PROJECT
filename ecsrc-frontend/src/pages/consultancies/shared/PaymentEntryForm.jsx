// PATH: frontend/src/pages/consultancies/shared/PaymentEntryForm.jsx

import React, { useState } from 'react';
import BackButton from './BackButton';

/* ---------------------------------------------------------------------- */
/*  Payment-particulars form opened from PaymentStatus's "Add Payment"    */
/*  action. Reuses the same charges math as AcceptanceFormWizard's        */
/*  Charges step (TDS + Amount received -> GST/Overhead/Remuneration      */
/*  split, with the CSRC-Remuneration Yes/No toggle) plus the DD/Cheque/  */
/*  E-transfer split-up table.                                            */
/*                                                                         */
/*  Saving here marks the payment as approved/completed directly — this   */
/*  screen is only reachable from the CSRC office side. If a separate     */
/*  consultant-facing submission step is added later, insert an approval  */
/*  action between "Save" and payment.status === 'completed'.             */
/* ---------------------------------------------------------------------- */

const accent = '#db2777';

const styles = {
  page: { minHeight: '100%', padding: '0 4px', width: '100%', boxSizing: 'border-box' },
  breadcrumb: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(30,41,59,0.45)', marginBottom: 6 },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbActive: { color: 'rgba(30,41,59,0.85)', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 },
  title: { fontFamily: 'DM Sans, sans-serif', fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(30,41,59,0.55)', margin: '0 0 20px 0' },

  summaryBox: {
    background: 'rgba(219,39,119,0.06)', border: '1px solid rgba(219,39,119,0.22)',
    borderRadius: 14, padding: '16px 20px', marginBottom: 22, width: '100%', boxSizing: 'border-box',
  },
  summaryRow: { display: 'flex', gap: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 13, marginBottom: 4 },
  summaryLabel: { fontWeight: 700, color: '#9d174d', flex: '0 0 110px' },
  summaryValue: { color: '#1e293b' },

  card: {
    background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, width: '100%', boxSizing: 'border-box',
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden',
  },
  sectionBody: { padding: '26px 28px 30px', width: '100%', boxSizing: 'border-box' },
  sectionHeader: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff',
    background: `linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)`,
    padding: '10px 16px', borderRadius: 10, margin: '0 0 18px 0',
    letterSpacing: '0.02em', textTransform: 'uppercase',
  },
  subHeader: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: accent,
    margin: '22px 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.03em',
    borderBottom: `1px dashed ${accent}55`, paddingBottom: 6,
  },

  fieldRow: { width: '100%', marginBottom: 14 },
  field: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%' },
  label: { fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600, color: '#334155', flex: '0 0 320px', maxWidth: 320, lineHeight: 1.35 },
  fieldControl: { flex: 1, minWidth: 0 },
  input: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b', padding: '9px 12px',
    borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)', background: '#fff', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  inputRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b', padding: '9px 12px',
    borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)', background: '#fff', outline: 'none',
    width: '100%', boxSizing: 'border-box', textAlign: 'right',
  },
  inputReadonlyRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: accent, padding: '9px 12px',
    borderRadius: 9, border: `1px solid ${accent}4d`, background: `${accent}0f`,
    width: '100%', boxSizing: 'border-box', textAlign: 'right',
  },
  select: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b', padding: '9px 12px',
    borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)', background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  radioRow: { display: 'flex', gap: 22, alignItems: 'center' },
  radioLabel: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' },
  note: { fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'rgba(30,41,59,0.45)', fontStyle: 'italic', margin: '2px 0 16px 0' },

  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 10 },
  th: { fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, fontWeight: 700, color: accent, background: `${accent}14`, textAlign: 'left', padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.02em' },
  td: { padding: '6px 8px' },

  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 28px',
    borderTop: '1px solid rgba(30,41,59,0.08)', background: 'rgba(248,250,255,0.6)',
  },
  navBtn: { fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, padding: '10px 24px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${accent}55`, background: 'transparent', color: accent },
  saveBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, padding: '10px 26px', borderRadius: 10,
    cursor: 'pointer', border: 'none', background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)', color: '#fff',
    boxShadow: '0 8px 18px -6px #16a34a88',
  },
};

const Field = ({ label, children }) => (
  <div style={styles.fieldRow}>
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <div style={styles.fieldControl}>{children}</div>
    </div>
  </div>
);

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const emptySplitRow = { bankName: '', refNo: '', paymentType: '', refDate: '', amount: '' };

// campus: 'department' | 'center' — record: a MOCK_FORMS entry with invoice.status === 'completed'
const PaymentEntryForm = ({ record, campus, onBack, onSave }) => {
  const isDept = campus === 'department';

  const workTitle = record.consultantTitle || '—';
  const firmName = record.firmName || '—';

  const [splitCount, setSplitCount] = useState('');
  const [splitRows, setSplitRows] = useState([]);
  const [charges, setCharges] = useState({ tds: '', amountReceived: '', taxPercent: 18 });
  const [csrcRemunEnabled, setCsrcRemunEnabled] = useState(true);

  const handleSplitCountChange = (e) => {
    const n = parseInt(e.target.value, 10) || 0;
    setSplitCount(e.target.value);
    setSplitRows((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push({ ...emptySplitRow });
      return next;
    });
  };
  const updateSplitRow = (idx, field) => (e) => {
    const val = e.target.value;
    setSplitRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };
  const splitTotal = splitRows.reduce((sum, r) => sum + num(r.amount), 0);

  const setChargesField = (key) => (e) => setCharges((p) => ({ ...p, [key]: e.target.value }));

  const totalConsultancyCharges = num(charges.tds) + num(charges.amountReceived);
  const gstAmount = (totalConsultancyCharges * num(charges.taxPercent)) / 100;
  const overheadAmount = totalConsultancyCharges * 0.3;
  const consultantRemunAmount = Math.max(totalConsultancyCharges - gstAmount - overheadAmount, 0);
  const csrcRemunAmount = csrcRemunEnabled ? consultantRemunAmount * 0.01 : 0;
  const consultantRemunPercentLabel = csrcRemunEnabled ? '69' : '70';

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const particulars = {
      splitCount, splitRows, splitTotal,
      tds: num(charges.tds), amountReceived: num(charges.amountReceived), taxPercent: num(charges.taxPercent),
      totalConsultancyCharges, gstAmount, overheadAmount,
      csrcRemunEnabled, consultantRemunAmount, csrcRemunAmount,
    };
    setSaving(true);
    try {
      await onSave(particulars);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={onBack}>Payment Status</span> /{' '}
        <span style={styles.breadcrumbActive}>Add Payment — {record.id}</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={onBack} />
        <h1 style={styles.title}>Add Payment for the Consultancy ID: {record.id}</h1>
      </div>
      <p style={styles.subtitle}>{isDept ? 'Department' : 'Centre / Other Campuses'} consultancy</p>

      <div style={styles.summaryBox}>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Work Title</span><span style={styles.summaryValue}>{workTitle}</span></div>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Firm Name</span><span style={styles.summaryValue}>{firmName}</span></div>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Amount (Rs.)</span><span style={styles.summaryValue}>{Number(record.amount || 0).toLocaleString('en-IN')}</span></div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionBody}>
          <div style={styles.sectionHeader}>Payment Particulars</div>
          <Field label="DD / Cheque / E-transfer Details (Number of split up of total consultancy charges)">
            <select style={styles.select} value={splitCount} onChange={handleSplitCountChange}>
              <option value="">--No. of Split up of amount--</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>

          {splitRows.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>S.No</th>
                    <th style={styles.th}>Bank Name</th>
                    <th style={styles.th}>Ref. No.</th>
                    <th style={styles.th}>Payment Type</th>
                    <th style={styles.th}>Ref. Date</th>
                    <th style={styles.th}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {splitRows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...styles.td, fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: accent }}>{i + 1}</td>
                      <td style={styles.td}><input style={styles.input} placeholder="Bank Name" value={row.bankName} onChange={updateSplitRow(i, 'bankName')} /></td>
                      <td style={styles.td}><input style={styles.input} placeholder="Ref. No." value={row.refNo} onChange={updateSplitRow(i, 'refNo')} /></td>
                      <td style={styles.td}>
                        <select style={styles.select} value={row.paymentType} onChange={updateSplitRow(i, 'paymentType')}>
                          <option value="">--Payment type--</option>
                          <option>Cheque</option><option>DD</option><option>E-transfer</option>
                        </select>
                      </td>
                      <td style={styles.td}><input type="date" style={styles.input} value={row.refDate} onChange={updateSplitRow(i, 'refDate')} /></td>
                      <td style={styles.td}><input type="number" style={styles.inputRight} value={row.amount} onChange={updateSplitRow(i, 'amount')} /></td>
                    </tr>
                  ))}
                  <tr>
                    <td style={styles.td} colSpan={5}>
                      <div style={{ textAlign: 'right', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#334155', paddingRight: 10 }}>Total Amount</div>
                    </td>
                    <td style={styles.td}><input style={styles.inputReadonlyRight} value={splitTotal.toFixed(2)} readOnly /></td>
                  </tr>
                </tbody>
              </table>
              <p style={styles.note}>*Cheque or DD Amount Remittance date should not exceed 85 days.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
            <div>
              <div style={styles.sectionHeader}>Consultancy Charges</div>
              <Field label="TDS amount if paid by the firm">
                <input type="number" style={styles.inputRight} value={charges.tds} onChange={setChargesField('tds')} />
              </Field>
              <Field label="Amount received from the firm">
                <input type="number" style={styles.inputRight} value={charges.amountReceived} onChange={setChargesField('amountReceived')} />
              </Field>
              <Field label="TOTAL CONSULTANCY CHARGES">
                <input style={styles.inputReadonlyRight} value={totalConsultancyCharges.toFixed(2)} readOnly />
              </Field>
            </div>

            <div>
              <div style={styles.sectionHeader}>Split Up of the Total Consultancy Charges</div>
              <Field label="Tax (%)">
                <input type="number" style={styles.inputRight} value={charges.taxPercent} onChange={setChargesField('taxPercent')} />
              </Field>
              <Field label={`GST (${charges.taxPercent}%)`}>
                <input style={styles.inputReadonlyRight} value={gstAmount.toFixed(2)} readOnly />
              </Field>
              <Field label="Overhead (30%)">
                <input style={styles.inputReadonlyRight} value={overheadAmount.toFixed(2)} readOnly />
              </Field>
              <Field label={`Consultant Remuneration including all expenditure (${consultantRemunPercentLabel}%)`}>
                <input style={styles.inputReadonlyRight} value={isNaN(consultantRemunAmount) ? '' : consultantRemunAmount.toFixed(2)} readOnly />
              </Field>
              <Field label="CSRC Remuneration">
                <select
                  style={styles.select}
                  value={csrcRemunEnabled ? 'yes' : 'no'}
                  onChange={(e) => setCsrcRemunEnabled(e.target.value === 'yes')}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="CSRC Remuneration Amount">
                <input style={styles.inputReadonlyRight} value={csrcRemunAmount.toFixed(2)} readOnly />
              </Field>
              <p style={styles.note}>*1% of Consultant Remuneration</p>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.navBtn} onClick={onBack}>Cancel</button>
          <button style={{ ...styles.saveBtn, opacity: saving ? 0.65 : 1, cursor: saving ? 'wait' : 'pointer' }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : '✓ Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentEntryForm;