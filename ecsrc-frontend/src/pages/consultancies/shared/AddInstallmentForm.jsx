// PATH: frontend/src/pages/consultancies/shared/AddInstallmentForm.jsx

import React, { useState } from 'react';
import BackButton from './BackButton';
import { addInstallment } from './consultancyApi';

/* ---------------------------------------------------------------------- */
/*  Detail form opened from InstallmentList's "+ Add" action. Mirrors the */
/*  field set of the legacy "Add Installment" screen (Firm/Individual     */
/*  Details → Installment Particulars → Permission Type → conditional     */
/*  charges section) but rebuilt with this app's own visual language:     */
/*  gradient section headers, one field per row, right-aligned rupee      */
/*  figures, and a Yes/No toggle for CSRC Remuneration instead of a       */
/*  dropdown — consistent with AcceptanceFormWizard's Charges step.       */
/* ---------------------------------------------------------------------- */

const styles = {
  page: { minHeight: '100%', padding: '0 4px', width: '100%', boxSizing: 'border-box' },
  breadcrumb: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13,
    color: 'rgba(30,41,59,0.45)', marginBottom: 6,
  },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbActive: { color: 'rgba(30,41,59,0.85)', fontWeight: 600 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 },
  title: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 24, fontWeight: 700,
    color: '#1e293b', margin: 0, letterSpacing: '-0.02em',
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(30,41,59,0.55)',
    margin: '0 0 20px 0',
  },

  summaryBox: {
    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: 14, padding: '16px 20px', marginBottom: 22, width: '100%', boxSizing: 'border-box',
  },
  summaryRow: { display: 'flex', gap: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 13, marginBottom: 4 },
  summaryLabel: { fontWeight: 700, color: '#92400e', flex: '0 0 140px' },
  summaryValue: { color: '#1e293b' },

  card: {
    background: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20, width: '100%', boxSizing: 'border-box',
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden',
  },
  sectionBody: { padding: '26px 28px 30px', width: '100%', boxSizing: 'border-box' },
  sectionHeader: (accent) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700,
    color: '#fff', background: `linear-gradient(90deg, ${accent} 0%, ${accent}cc 100%)`,
    padding: '10px 16px', borderRadius: 10, margin: '0 0 18px 0',
    letterSpacing: '0.02em', textTransform: 'uppercase',
  }),
  subHeader: (accent) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700,
    color: accent, margin: '22px 0 12px 0', textTransform: 'uppercase',
    letterSpacing: '0.03em', borderBottom: `1px dashed ${accent}55`, paddingBottom: 6,
  }),

  fieldRow: { width: '100%', marginBottom: 14 },
  field: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%' },
  label: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600,
    color: '#334155', flex: '0 0 320px', maxWidth: 320, lineHeight: 1.35, textAlign: 'left',
  },
  fieldControl: { flex: 1, minWidth: 0 },
  input: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'left',
  },
  inputRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'right',
  },
  inputReadonly: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#f59e0b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(245,158,11,0.3)',
    background: 'rgba(245,158,11,0.06)', width: '100%', boxSizing: 'border-box', textAlign: 'left',
  },
  inputReadonlyRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#f59e0b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(245,158,11,0.3)',
    background: 'rgba(245,158,11,0.06)', width: '100%', boxSizing: 'border-box', textAlign: 'right',
  },
  select: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'left',
  },
  radioRow: { display: 'flex', gap: 22, alignItems: 'center' },
  radioLabel: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#334155',
    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
  },
  note: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'rgba(30,41,59,0.45)',
    fontStyle: 'italic', margin: '2px 0 16px 0',
  },

  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 10 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, fontWeight: 700,
    color: '#f59e0b', background: 'rgba(245,158,11,0.08)', textAlign: 'left',
    padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.02em',
  },
  td: { padding: '6px 8px' },

  twoColWrap: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px',
    alignItems: 'start', width: '100%',
  },
  twoColCol: { minWidth: 0 },

  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 28px', borderTop: '1px solid rgba(30,41,59,0.08)',
    background: 'rgba(248,250,255,0.6)',
  },
  navBtn: (accent, filled) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
    border: filled ? 'none' : `1px solid ${accent}55`,
    background: filled ? accent : 'transparent',
    color: filled ? '#fff' : accent,
    boxShadow: filled ? `0 8px 18px -6px ${accent}88` : 'none',
  }),
  saveBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '10px 26px', borderRadius: 10, cursor: 'pointer', border: 'none',
    background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)', color: '#fff',
    boxShadow: '0 8px 18px -6px #16a34a88',
  },
};

const accent = '#f59e0b'; // amber — matches "with installment" accent used elsewhere in the app

/* label on the left, input control on the right — one field per row.
   labelWidth lets the two-column charges section shrink the label so the
   input still has room. */
const Field = ({ label, children, labelWidth }) => (
  <div style={styles.fieldRow}>
    <div style={styles.field}>
      <label style={labelWidth ? { ...styles.label, flexBasis: labelWidth, maxWidth: labelWidth } : styles.label}>
        {label}
      </label>
      <div style={styles.fieldControl}>{children}</div>
    </div>
  </div>
);

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const emptySplitRow = { bankName: '', refNo: '', paymentType: '', refDate: '', amount: '' };

// campus: 'department' | 'center' — record: an entry from mockAcceptanceForms with installmentType === 'with'
const AddInstallmentForm = ({ record, campus, onBack, onSaved }) => {
  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';

  const workTitle = record.details?.work?.title || record.consultantTitle;
  const firmName = record.details?.firm?.name || record.firmName || '—';

  // ---- Firm / Individual Details ----
  const [firmLetterRef, setFirmLetterRef] = useState('');
  const [firmLetterFileName, setFirmLetterFileName] = useState('');

  // ---- Installment Particulars ----
  const [installment, setInstallment] = useState({
    frequency: 'Monthly', month: '', installmentNo: '', totalAmount: '', releasedAmount: '',
  });
  const setInstallmentField = (key) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setInstallment((prev) => ({ ...prev, [key]: val }));
  };
  const yetToRelease = Math.max(num(installment.totalAmount) - num(installment.releasedAmount), 0);

  // ---- Permission Type ----
  const [permissionType, setPermissionType] = useState(''); // '' | 'proforma' | 'permission'

  // ---- Payment Particulars (permission only) ----
  const [splitCount, setSplitCount] = useState('');
  const [splitRows, setSplitRows] = useState([]);
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

  // ---- Consultancy Charges (permission only) ----
  const [charges, setCharges] = useState({ tds: '', amountReceived: '', taxPercent: 18 });
  const setChargesField = (key) => (e) => setCharges((p) => ({ ...p, [key]: e.target.value }));
  const [csrcRemunEnabled, setCsrcRemunEnabled] = useState(true);

  const totalConsultancyCharges = num(charges.tds) + num(charges.amountReceived);
  const gstAmount = (totalConsultancyCharges * num(charges.taxPercent)) / 100;
  const overheadAmount = totalConsultancyCharges * 0.3;
  const consultantRemunAmount = Math.max(totalConsultancyCharges - gstAmount - overheadAmount, 0);
  const csrcRemunAmount = csrcRemunEnabled ? consultantRemunAmount * 0.01 : 0;
  const consultantRemunPercentLabel = csrcRemunEnabled ? '69' : '70';

  // ---- Approximate Consultancy Charges (proforma only) ----
  const [approx, setApprox] = useState({ totalCharges: '', taxPercent: 18 });
  const setApproxField = (key) => (e) => setApprox((p) => ({ ...p, [key]: e.target.value }));
  const approxGst = (num(approx.totalCharges) * num(approx.taxPercent)) / 100;
  const approxOverhead = num(approx.totalCharges) * 0.3;
  const approxRemun = Math.max(num(approx.totalCharges) - approxGst - approxOverhead, 0);

  // ---- Estimated Expenditure (both proforma & permission) ----
  const [expenditure, setExpenditure] = useState({
    manpower: '', travel: '', equipment: '', contingency: '', consumables: '',
    consultantRemuneration: '', deptStaffRemuneration: '', externalConsultant: '',
    subcontracting: '', hiringServices: '', otherCostDetails: '', otherCost: '',
  });
  const setExpField = (key) => (e) => setExpenditure((p) => ({ ...p, [key]: e.target.value }));
  const totalEstimatedExpenditure = [
    'manpower', 'travel', 'equipment', 'contingency', 'consumables',
    'consultantRemuneration', 'deptStaffRemuneration', 'externalConsultant',
    'subcontracting', 'hiringServices', 'otherCost',
  ].reduce((sum, k) => sum + num(expenditure[k]), 0);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setSaveError('');

    const payload = {
      firmLetterRef,
      installment: { ...installment, yetToRelease },
      permissionType,
      ...(permissionType === 'permission' && {
        splitRows,
        charges: { tds: charges.tds, amountReceived: charges.amountReceived, taxPercent: charges.taxPercent, csrcRemunEnabled },
      }),
      ...(permissionType === 'proforma' && { approx }),
      expenditure,
    };

    setSaving(true);
    try {
      await addInstallment(record.id, payload);
      if (onSaved) onSaved();
      else onBack();
    } catch (err) {
      setSaveError(err.message || 'Failed to save the installment.');
    } finally {
      setSaving(false);
    }
  };

  const EstimatedExpenditureColumn = () => (
    <div style={styles.twoColCol}>
      <div style={styles.sectionHeader(accent)}>Estimated Expenditure for the Consultancy Charges</div>
      <Field labelWidth={180} label="Manpower"><input type="number" style={styles.inputRight} value={expenditure.manpower} onChange={setExpField('manpower')} /></Field>
      <Field labelWidth={180} label="Travel"><input type="number" style={styles.inputRight} value={expenditure.travel} onChange={setExpField('travel')} /></Field>
      <Field labelWidth={180} label="Equipment"><input type="number" style={styles.inputRight} value={expenditure.equipment} onChange={setExpField('equipment')} /></Field>
      <Field labelWidth={180} label="Contingency"><input type="number" style={styles.inputRight} value={expenditure.contingency} onChange={setExpField('contingency')} /></Field>
      <Field labelWidth={180} label="Consumables"><input type="number" style={styles.inputRight} value={expenditure.consumables} onChange={setExpField('consumables')} /></Field>
      <Field labelWidth={180} label="Consultant & Co-Consultant Remuneration"><input type="number" style={styles.inputRight} value={expenditure.consultantRemuneration} onChange={setExpField('consultantRemuneration')} /></Field>
      <Field labelWidth={180} label="Dept. / Centre Staff Remuneration"><input type="number" style={styles.inputRight} value={expenditure.deptStaffRemuneration} onChange={setExpField('deptStaffRemuneration')} /></Field>
      <Field labelWidth={180} label="External Consultant"><input type="number" style={styles.inputRight} value={expenditure.externalConsultant} onChange={setExpField('externalConsultant')} /></Field>
      <Field labelWidth={180} label="Sub-contracting of part of the work"><input type="number" style={styles.inputRight} value={expenditure.subcontracting} onChange={setExpField('subcontracting')} /></Field>
      <Field labelWidth={180} label="Hiring Services"><input type="number" style={styles.inputRight} value={expenditure.hiringServices} onChange={setExpField('hiringServices')} /></Field>
      <Field labelWidth={180} label="Other Cost (please provide details)"><input style={styles.input} placeholder="If others please specify" value={expenditure.otherCostDetails} onChange={setExpField('otherCostDetails')} /></Field>
      <Field labelWidth={180} label="Other Cost Amount"><input type="number" style={styles.inputRight} value={expenditure.otherCost} onChange={setExpField('otherCost')} /></Field>
      <Field labelWidth={180} label="TOTAL ESTIMATED EXPENDITURE">
        <input style={styles.inputReadonlyRight} value={totalEstimatedExpenditure.toFixed(2)} readOnly />
      </Field>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={onBack}>Add Installment</span> /{' '}
        <span style={styles.breadcrumbActive}>{record.id}</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={onBack} />
        <h1 style={styles.title}>Add Installment for the Consultancy ID: {record.id}</h1>
      </div>
      <p style={styles.subtitle}>{isDept ? 'Department' : 'Centre / Other Campuses'} consultancy</p>

      <div style={styles.summaryBox}>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Work Title</span><span style={styles.summaryValue}>{workTitle}</span></div>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Firm Name</span><span style={styles.summaryValue}>{firmName}</span></div>
        <div style={styles.summaryRow}><span style={styles.summaryLabel}>Amount (Rs.)</span><span style={styles.summaryValue}>{record.amount.toLocaleString('en-IN')}</span></div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionBody}>

          <div style={styles.sectionHeader(accent)}>Firm / Individual Details</div>
          <Field label="Firm Letter Reference with date">
            <input style={styles.input} value={firmLetterRef} onChange={(e) => setFirmLetterRef(e.target.value)} />
          </Field>
          <Field label="Upload Firm Letter">
            <input
              type="file" accept="application/pdf" style={styles.input}
              onChange={(e) => setFirmLetterFileName(e.target.files?.[0]?.name || '')}
            />
          </Field>

          <div style={styles.sectionHeader(accent)}>Installment Particulars</div>
          <Field label="Monthly / Yearly Installment">
            <select style={styles.select} value={installment.frequency} onChange={setInstallmentField('frequency')}>
              <option>Monthly</option><option>Yearly</option>
            </select>
          </Field>
          <Field label="Month">
            <input type="month" style={styles.input} value={installment.month} onChange={setInstallmentField('month')} />
          </Field>
          <Field label="Installment No.">
            <select style={styles.select} value={installment.installmentNo} onChange={setInstallmentField('installmentNo')}>
              <option value="">--Installment No.--</option>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Total Installment amount">
            <input type="number" style={styles.inputRight} value={installment.totalAmount} onChange={setInstallmentField('totalAmount')} />
          </Field>
          <Field label="Released Installment amount">
            <input type="number" style={styles.inputRight} value={installment.releasedAmount} onChange={setInstallmentField('releasedAmount')} />
          </Field>
          <Field label="Amount Yet to be released">
            <input style={styles.inputReadonlyRight} value={yetToRelease.toFixed(2)} readOnly />
          </Field>

          <div style={styles.sectionHeader(accent)}>Permission Type</div>
          <Field label="Permission Type">
            <select style={styles.select} value={permissionType} onChange={(e) => setPermissionType(e.target.value)}>
              <option value="">--Permission Type--</option>
              <option value="proforma">Proforma Invoice</option>
              <option value="permission">Permission</option>
            </select>
          </Field>

          {!permissionType && (
            <p style={styles.note}>Select a permission type above to enter the consultancy charges.</p>
          )}

          {permissionType === 'proforma' && (
            <div style={styles.twoColWrap}>
              <div style={styles.twoColCol}>
                <div style={styles.sectionHeader(accent)}>Approximate Consultancy Charges</div>
                <Field labelWidth={180} label="Approximate Total Consultancy Charges">
                  <input type="number" style={styles.inputRight} value={approx.totalCharges} onChange={setApproxField('totalCharges')} />
                </Field>
                <div style={styles.subHeader(accent)}>Split Up of the Total Consultancy Charges</div>
                <Field labelWidth={180} label="Tax (%)"><input type="number" style={styles.inputRight} value={approx.taxPercent} onChange={setApproxField('taxPercent')} /></Field>
                <Field labelWidth={180} label={`Approximate GST (${approx.taxPercent}%)`}><input style={styles.inputReadonlyRight} value={approxGst.toFixed(2)} readOnly /></Field>
                <Field labelWidth={180} label="Approximate Overhead (30%)"><input style={styles.inputReadonlyRight} value={approxOverhead.toFixed(2)} readOnly /></Field>
                <Field labelWidth={180} label="Approximate Consultant Remuneration incl. all expenditure (~70%)"><input style={styles.inputReadonlyRight} value={approxRemun.toFixed(2)} readOnly /></Field>
              </div>
              <EstimatedExpenditureColumn />
            </div>
          )}

          {permissionType === 'permission' && (
            <>
              <div style={styles.sectionHeader(accent)}>Payment Particulars</div>
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
                          <div style={{ textAlign: 'right', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#334155', paddingRight: 10 }}>
                            Total Amount
                          </div>
                        </td>
                        <td style={styles.td}><input style={styles.inputReadonlyRight} value={splitTotal.toFixed(2)} readOnly /></td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={styles.note}>*Cheque or DD Amount Remittance date should not exceed 85 days.</p>
                </div>
              )}

              <div style={styles.twoColWrap}>
                <div style={styles.twoColCol}>
                  <div style={styles.sectionHeader(accent)}>Consultancy Charges</div>
                  <Field labelWidth={180} label="TDS amount if paid by the firm"><input type="number" style={styles.inputRight} value={charges.tds} onChange={setChargesField('tds')} /></Field>
                  <Field labelWidth={180} label="Amount received from the firm"><input type="number" style={styles.inputRight} value={charges.amountReceived} onChange={setChargesField('amountReceived')} /></Field>
                  <Field labelWidth={180} label="TOTAL CONSULTANCY CHARGES"><input style={styles.inputReadonlyRight} value={totalConsultancyCharges.toFixed(2)} readOnly /></Field>

                  <div style={styles.subHeader(accent)}>Split Up of the Total Consultancy Charges</div>
                  <Field labelWidth={180} label="Tax (%)"><input type="number" style={styles.inputRight} value={charges.taxPercent} onChange={setChargesField('taxPercent')} /></Field>
                  <Field labelWidth={180} label={`GST (${charges.taxPercent}%)`}><input style={styles.inputReadonlyRight} value={gstAmount.toFixed(2)} readOnly /></Field>
                  <Field labelWidth={180} label="Overhead (30%)"><input style={styles.inputReadonlyRight} value={overheadAmount.toFixed(2)} readOnly /></Field>
                  <Field labelWidth={180} label={`Consultant Remuneration incl. all expenditure (~${consultantRemunPercentLabel}%)`}>
                    <input style={styles.inputReadonlyRight} value={consultantRemunAmount.toFixed(2)} readOnly />
                  </Field>
                  <Field labelWidth={180} label="Apply CSRC Remuneration (1% of Consultant Remuneration)?">
                    <div style={styles.radioRow}>
                      <label style={styles.radioLabel}>
                        <input type="radio" checked={csrcRemunEnabled} onChange={() => setCsrcRemunEnabled(true)} /> Yes
                      </label>
                      <label style={styles.radioLabel}>
                        <input type="radio" checked={!csrcRemunEnabled} onChange={() => setCsrcRemunEnabled(false)} /> No
                      </label>
                    </div>
                  </Field>
                  {csrcRemunEnabled && (
                    <Field labelWidth={180} label="CSRC Remuneration (1% of Consultant Remuneration)">
                      <input style={styles.inputReadonlyRight} value={csrcRemunAmount.toFixed(2)} readOnly />
                    </Field>
                  )}
                </div>
                <EstimatedExpenditureColumn />
              </div>
            </>
          )}

        </div>
                <div style={styles.footer}>
          <button style={styles.navBtn(accent, false)} onClick={onBack}>Cancel</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {saveError && (
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#ef4444' }}>{saveError}</span>
            )}
            <button style={{ ...styles.saveBtn, opacity: saving ? 0.65 : 1, cursor: saving ? 'wait' : 'pointer' }} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '✓ Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstallmentForm;