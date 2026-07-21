import React, { useState, useMemo } from 'react';
import BackButton from './BackButton';

/* ---------------------------------------------------------------------- */
/*  Light, colourful internal-CSS theme (kept consistent with the rest    */
/*  of the app's glassmorphic look, but with the section header bars     */
/*  used on the real CSRC acceptance form for quick visual recognition). */
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
    margin: '0 0 26px 0',
  },

  stepperWrap: {
    display: 'flex', alignItems: 'center', marginBottom: 30, maxWidth: 900, flexWrap: 'wrap',
  },
  stepItem: { display: 'flex', alignItems: 'center' },
  stepCircle: (active, done, accent) => ({
    width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700,
    background: done ? accent : active ? '#fff' : 'rgba(30,41,59,0.06)',
    color: done ? '#fff' : active ? accent : 'rgba(30,41,59,0.35)',
    border: active ? `2px solid ${accent}` : '2px solid transparent',
    boxShadow: done ? `0 4px 12px -2px ${accent}66` : 'none',
    transition: 'all 0.2s ease', flexShrink: 0,
  }),
  stepLabel: (active, done, accent) => ({
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, marginLeft: 8, marginRight: 14,
    fontWeight: active ? 700 : 500,
    color: active ? accent : done ? '#1e293b' : 'rgba(30,41,59,0.4)',
    whiteSpace: 'nowrap',
  }),
  stepLine: (done, accent) => ({
    width: 34, height: 2, marginRight: 14,
    background: done ? accent : 'rgba(30,41,59,0.12)',
    borderRadius: 2,
  }),

  card: {
    background: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)',
    borderRadius: 20, padding: 0, maxWidth: 980,
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden',
  },
  banner: {
    background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
    color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 12.5,
    padding: '10px 22px', lineHeight: 1.5,
  },
  bannerStrong: { fontWeight: 700 },

  sectionBody: { padding: '26px 28px 30px' },
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

  /* Two fields side by side; each field is itself a label-left / input-right row */
  row: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px', marginBottom: 14,
  },
  row3: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px 32px', marginBottom: 14,
  },
  /* Field: label on the left (fixed width), input control on the right (fills remaining space) */
  field: {
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  label: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600,
    color: '#334155', flex: '0 0 42%', maxWidth: '42%', lineHeight: 1.35,
  },
  fieldControl: { flex: 1, minWidth: 0 },
  input: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  inputReadonly: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#7c3aed',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.25)',
    background: 'rgba(124,58,237,0.06)', width: '100%', boxSizing: 'border-box',
  },
  textarea: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', minHeight: 90, resize: 'vertical',
    width: '100%', boxSizing: 'border-box',
  },
  select: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  radioRow: { display: 'flex', gap: 22, alignItems: 'center' },
  radioLabel: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#334155',
    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
  },

  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 10 },
  th: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, fontWeight: 700,
    color: '#7c3aed', background: 'rgba(124,58,237,0.08)', textAlign: 'left',
    padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.02em',
  },
  td: { padding: '6px 8px' },
  addBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 700, color: '#fff',
    background: '#16a34a', border: 'none', borderRadius: 8, padding: '8px 18px',
    cursor: 'pointer', marginTop: 4,
  },
  removeBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
    background: '#ef4444', border: 'none', borderRadius: 6, padding: '5px 9px', cursor: 'pointer',
  },

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
  note: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'rgba(30,41,59,0.45)',
    fontStyle: 'italic', margin: '2px 0 0 0',
  },
};

/* label on the left, input control on the right */
const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <div style={styles.fieldControl}>{children}</div>
  </div>
);

const num = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const emptyConsultant = { name: '', designation: 'Professor', campus: '', department: '', mobile: '' };

/* ---------------------------------------------------------------------- */

// campus: 'department' | 'center'
// Single wizard now handles both "with" and "without" installment via an
// in-form radio button — no separate installment-details step/route.
const AcceptanceFormWizard = ({ campus, onNavigate }) => {
  const isDept = campus === 'department';
  const parentKey = isDept ? 'department-consultancies' : 'center-consultancies';
  const parentLabel = isDept ? 'Department' : 'Centre / Other Campuses';

  const steps = ['Co-Consultant Details', 'Firm Details', 'Consultancy Work', 'Charges & Expenditure'];

  const [step, setStep] = useState(0);

  // 'without' | 'with' — chosen via radio button inside the Consultancy Work step
  const [installmentType, setInstallmentType] = useState('without');
  const accent = installmentType === 'with' ? '#f59e0b' : '#2563eb';

  // ---- form state, grouped by section ----
  const [coConsult, setCoConsult] = useState({ has: 'no', list: [] });
  const [draftConsultant, setDraftConsultant] = useState(emptyConsultant);

  const [firm, setFirm] = useState({
    consultantType: '', firmName: '', sector: '', type: 'National', district: '', state: '',
    pinCode: '', firmAddress: '', letterRef: '', gst: '', email: '', tan: '',
    contactName: '', contactDesignation: '', contactMobile: '', pan: '',
  });

  const [work, setWork] = useState({
    title: '', abstract: '', startDate: '', endDate: '', totalHours: '',
    hasEquipment: 'no', equipmentName: '', workType: '', // '' | 'proforma' | 'permission'
  });

  const [splitCount, setSplitCount] = useState('');
  const [splitRows, setSplitRows] = useState([]);

  const [charges, setCharges] = useState({ tds: '', amountReceived: '', taxPercent: 18 });

  const [expenditure, setExpenditure] = useState({
    manpower: '', travel: '', equipment: '', contingency: '', consumables: '',
    consultantRemuneration: '', deptStaffRemuneration: '', externalConsultant: '',
    subcontracting: '', hiringServices: '', otherCostDetails: '', otherCost: '',
  });

  const [approx, setApprox] = useState({ totalCharges: '', taxPercent: 18 });

  const abstractWords = useMemo(
    () => (work.abstract.trim() ? work.abstract.trim().split(/\s+/).length : 0),
    [work.abstract]
  );

  // ---- derived totals ----
  const totalConsultancyCharges = num(charges.tds) + num(charges.amountReceived);
  const gstAmount = (totalConsultancyCharges * num(charges.taxPercent)) / 100;
  const overheadAmount = totalConsultancyCharges * 0.3;
  const consultantRemunAmount = Math.max(totalConsultancyCharges - gstAmount - overheadAmount, 0);
  const csrcRemunAmount = consultantRemunAmount * 0.01;

  const totalEstimatedExpenditure = [
    'manpower', 'travel', 'equipment', 'contingency', 'consumables',
    'consultantRemuneration', 'deptStaffRemuneration', 'externalConsultant',
    'subcontracting', 'hiringServices', 'otherCost',
  ].reduce((sum, k) => sum + num(expenditure[k]), 0);

  const approxGst = (num(approx.totalCharges) * num(approx.taxPercent)) / 100;
  const approxOverhead = num(approx.totalCharges) * 0.3;
  const approxRemun = Math.max(num(approx.totalCharges) - approxGst - approxOverhead, 0);

  const splitTotal = splitRows.reduce((sum, r) => sum + num(r.amount), 0);

  // ---- helpers ----
  const set = (setter) => (key) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setter((prev) => ({ ...prev, [key]: val }));
  };
  const setFirmField = set(setFirm);
  const setWorkField = set(setWork);
  const setChargesField = set(setCharges);
  const setExpField = set(setExpenditure);
  const setApproxField = set(setApprox);

  const addConsultant = () => {
    if (!draftConsultant.name.trim()) return;
    setCoConsult((prev) => ({ ...prev, list: [...prev.list, draftConsultant] }));
    setDraftConsultant(emptyConsultant);
  };
  const removeConsultant = (idx) => {
    setCoConsult((prev) => ({ ...prev, list: prev.list.filter((_, i) => i !== idx) }));
  };

  const emptySplitRow = { bankName: '', refNo: '', paymentType: '', refDate: '', amount: '' };

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

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSave = () => {
    const payload = {
      campus, installmentType, coConsult, firm, work,
      splitCount, splitRows, splitTotal, charges, totalConsultancyCharges, gstAmount, overheadAmount,
      consultantRemunAmount, csrcRemunAmount, expenditure, totalEstimatedExpenditure,
      approx, approxGst, approxOverhead, approxRemun,
    };
    // TODO: wire up to backend submit endpoint
    console.log('Acceptance form payload', payload);
    onNavigate(parentKey);
  };

  /* ------------------------------- Steps -------------------------------- */

  const StepCoConsultant = () => (
    <div>
      <div style={styles.sectionHeader(accent)}>Co-Consultant Details</div>
      <Field label="Is there any Co-Consultant?">
        <div style={styles.radioRow}>
          <label style={styles.radioLabel}>
            <input type="radio" checked={coConsult.has === 'yes'}
              onChange={() => setCoConsult((p) => ({ ...p, has: 'yes' }))} /> Yes
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" checked={coConsult.has === 'no'}
              onChange={() => setCoConsult((p) => ({ ...p, has: 'no' }))} /> No
          </label>
        </div>
      </Field>

      {coConsult.has === 'yes' && (
        <div style={{ marginTop: 18 }}>
          {coConsult.list.length > 0 && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th><th style={styles.th}>Designation</th>
                  <th style={styles.th}>Campus / Institute</th><th style={styles.th}>Department</th>
                  <th style={styles.th}>Mobile No</th><th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coConsult.list.map((c, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{c.name}</td><td style={styles.td}>{c.designation}</td>
                    <td style={styles.td}>{c.campus}</td><td style={styles.td}>{c.department}</td>
                    <td style={styles.td}>{c.mobile}</td>
                    <td style={styles.td}><button style={styles.removeBtn} onClick={() => removeConsultant(i)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={styles.row3}>
            <Field label="Name">
              <input style={styles.input} value={draftConsultant.name}
                onChange={(e) => setDraftConsultant((p) => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="Designation">
              <select style={styles.select} value={draftConsultant.designation}
                onChange={(e) => setDraftConsultant((p) => ({ ...p, designation: e.target.value }))}>
                <option>Professor</option><option>Associate Professor</option>
                <option>Assistant Professor</option><option>Other</option>
              </select>
            </Field>
            <Field label="Mobile No">
              <input style={styles.input} value={draftConsultant.mobile}
                onChange={(e) => setDraftConsultant((p) => ({ ...p, mobile: e.target.value }))} />
            </Field>
          </div>
          <div style={styles.row}>
            <Field label="Campus / Institute">
              <select style={styles.select} value={draftConsultant.campus}
                onChange={(e) => setDraftConsultant((p) => ({ ...p, campus: e.target.value }))}>
                <option value="">--Campus--</option><option>CEG</option><option>ACT</option>
                <option>MIT</option><option>SAP</option>
              </select>
            </Field>
            <Field label="Department">
              <input style={styles.input} value={draftConsultant.department}
                onChange={(e) => setDraftConsultant((p) => ({ ...p, department: e.target.value }))} />
            </Field>
          </div>
          <button style={styles.addBtn} onClick={addConsultant}>+ ADD</button>
        </div>
      )}
    </div>
  );

  const StepFirm = () => (
    <div>
      <div style={styles.sectionHeader(accent)}>Firm Details</div>
      <div style={styles.row}>
        <Field label="Consultant Type">
          <select style={styles.select} value={firm.consultantType} onChange={setFirmField('consultantType')}>
            <option value="">--Select the Consultant type--</option>
            <option>Individual</option><option>Firm / Company</option><option>Government Body</option>
          </select>
        </Field>
        <Field label="G.S.T No">
          <input style={styles.input} value={firm.gst} onChange={setFirmField('gst')} />
        </Field>
      </div>
      <div style={styles.row}>
        <Field label="Firm Name"><input style={styles.input} value={firm.firmName} onChange={setFirmField('firmName')} /></Field>
        <Field label="Email Id"><input style={styles.input} value={firm.email} onChange={setFirmField('email')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Sector">
          <select style={styles.select} value={firm.sector} onChange={setFirmField('sector')}>
            <option value="">--Select the Firm Sector--</option>
            <option>Public</option><option>Private</option><option>Government</option>
          </select>
        </Field>
        <Field label="Tan No"><input style={styles.input} value={firm.tan} onChange={setFirmField('tan')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Type">
          <select style={styles.select} value={firm.type} onChange={setFirmField('type')}>
            <option>National</option><option>International</option>
          </select>
        </Field>
        <Field label="Contact Person Name"><input style={styles.input} value={firm.contactName} onChange={setFirmField('contactName')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="District"><input style={styles.input} value={firm.district} onChange={setFirmField('district')} /></Field>
        <Field label="Contact Person Designation"><input style={styles.input} value={firm.contactDesignation} onChange={setFirmField('contactDesignation')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="State"><input style={styles.input} value={firm.state} onChange={setFirmField('state')} /></Field>
        <Field label="Contact Person Mobile No"><input style={styles.input} value={firm.contactMobile} onChange={setFirmField('contactMobile')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Pin Code"><input style={styles.input} value={firm.pinCode} onChange={setFirmField('pinCode')} /></Field>
        <Field label="Pan No"><input style={styles.input} value={firm.pan} onChange={setFirmField('pan')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Firm Address"><input style={styles.input} value={firm.firmAddress} onChange={setFirmField('firmAddress')} /></Field>
        <Field label="Upload Letter Reference (only pdf)"><input type="file" accept="application/pdf" style={styles.input} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Letter Reference with date"><input style={styles.input} value={firm.letterRef} onChange={setFirmField('letterRef')} /></Field>
        <div />
      </div>
      <p style={styles.note}>If there is no GST number, submit the undertaking letter from the firm given in the CSRC downloads.</p>
    </div>
  );

  const StepWork = () => (
    <div>
      <div style={styles.sectionHeader(accent)}>Details of the Consultancy Work</div>
      <div style={styles.row}>
        <Field label="Consultancy Title"><input style={styles.input} value={work.title} onChange={setWorkField('title')} /></Field>
        <Field label="Total No. of hours likely to be spent"><input style={styles.input} value={work.totalHours} onChange={setWorkField('totalHours')} /></Field>
      </div>
      <Field label={`Abstract of the Work (Minimum 75 words is Compulsory) — Words: ${abstractWords}`}>
        <textarea style={styles.textarea} value={work.abstract} onChange={setWorkField('abstract')} />
      </Field>
      <div style={{ height: 16 }} />
      <div style={styles.row}>
        <Field label="Start Date"><input type="date" style={styles.input} value={work.startDate} onChange={setWorkField('startDate')} /></Field>
        <Field label="Is there any purchase of machineries involved?">
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input type="radio" checked={work.hasEquipment === 'yes'} onChange={() => setWork((p) => ({ ...p, hasEquipment: 'yes' }))} /> Yes
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" checked={work.hasEquipment === 'no'} onChange={() => setWork((p) => ({ ...p, hasEquipment: 'no' }))} /> No
            </label>
          </div>
        </Field>
      </div>
      <div style={styles.row}>
        <Field label="End Date"><input type="date" style={styles.input} value={work.endDate} onChange={setWorkField('endDate')} /></Field>
        <Field label="Equipment Name">
          <input style={styles.input} value={work.equipmentName} onChange={setWorkField('equipmentName')} disabled={work.hasEquipment !== 'yes'} />
        </Field>
      </div>
      <div style={styles.row}>
        <Field label="Type">
          <select style={styles.select} value={work.workType} onChange={setWorkField('workType')}>
            <option value="">--Permission Type--</option>
            <option value="proforma">Proforma Invoice</option>
            <option value="permission">Permission</option>
          </select>
        </Field>
        <Field label="Payment Terms">
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input type="radio" checked={installmentType === 'without'} onChange={() => setInstallmentType('without')} /> Without Installment
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" checked={installmentType === 'with'} onChange={() => setInstallmentType('with')} /> With Installment
            </label>
          </div>
        </Field>
      </div>
      <p style={styles.note}>
        Procurement of equipment should normally be avoided. If the work needs procurement, University
        procedure should be followed and it should be taken into the stock register — not handed to the client.
      </p>
      <p style={{ ...styles.note, marginTop: 10, color: accent, fontStyle: 'normal', fontWeight: 600 }}>
        {work.workType === 'proforma' && 'Proforma Invoice selected — only estimated / approximate charges will be collected on the next step.'}
        {work.workType === 'permission' && 'Permission selected — actual payment particulars and consultancy charges will be collected on the next step.'}
        {!work.workType && 'Select a type above to determine what appears on the Charges & Expenditure step.'}
      </p>
    </div>
  );

  const StepCharges = () => (
    <div>
      {work.workType === 'permission' && (
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
                      <td style={styles.td}>
                        <input style={styles.input} placeholder="Bank Name" value={row.bankName} onChange={updateSplitRow(i, 'bankName')} />
                      </td>
                      <td style={styles.td}>
                        <input style={styles.input} placeholder="Ref. No." value={row.refNo} onChange={updateSplitRow(i, 'refNo')} />
                      </td>
                      <td style={styles.td}>
                        <select style={styles.select} value={row.paymentType} onChange={updateSplitRow(i, 'paymentType')}>
                          <option value="">--Payment type--</option>
                          <option>Cheque</option><option>DD</option><option>E-transfer</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <input type="date" style={styles.input} value={row.refDate} onChange={updateSplitRow(i, 'refDate')} />
                      </td>
                      <td style={styles.td}>
                        <input type="number" style={styles.input} value={row.amount} onChange={updateSplitRow(i, 'amount')} />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={styles.td} colSpan={5}>
                      <div style={{ textAlign: 'right', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#334155', paddingRight: 10 }}>
                        Total Amount
                      </div>
                    </td>
                    <td style={styles.td}>
                      <input style={styles.inputReadonly} value={splitTotal.toFixed(2)} readOnly />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={styles.note}>*Cheque or DD Amount Remittance date should not exceed 85 days.</p>
            </div>
          )}

          <div style={styles.subHeader(accent)}>Consultancy Charges</div>
          <div style={styles.row}>
            <Field label="TDS amount if paid by the firm"><input type="number" style={styles.input} value={charges.tds} onChange={setChargesField('tds')} /></Field>
            <Field label="Amount received from the firm"><input type="number" style={styles.input} value={charges.amountReceived} onChange={setChargesField('amountReceived')} /></Field>
          </div>
          <Field label="TOTAL CONSULTANCY CHARGES">
            <input style={styles.inputReadonly} value={totalConsultancyCharges.toFixed(2)} readOnly />
          </Field>

          <div style={styles.subHeader(accent)}>Split Up of the Total Consultancy Charges</div>
          <div style={styles.row}>
            <Field label="Tax (%)"><input type="number" style={styles.input} value={charges.taxPercent} onChange={setChargesField('taxPercent')} /></Field>
            <Field label={`GST (${charges.taxPercent}%)`}><input style={styles.inputReadonly} value={gstAmount.toFixed(2)} readOnly /></Field>
          </div>
          <div style={styles.row}>
            <Field label="Overhead (30%)"><input style={styles.inputReadonly} value={overheadAmount.toFixed(2)} readOnly /></Field>
            <Field label="Consultant Remuneration incl. all expenditure (~69%)"><input style={styles.inputReadonly} value={consultantRemunAmount.toFixed(2)} readOnly /></Field>
          </div>
          <Field label="CSRC Remuneration (1% of Consultant Remuneration)">
            <input style={styles.inputReadonly} value={csrcRemunAmount.toFixed(2)} readOnly />
          </Field>
        </>
      )}

      <div style={styles.sectionHeader(accent)}>Approximate Consultancy Charges</div>
      <Field label="Approximate Total Consultancy Charges">
        <input type="number" style={styles.input} value={approx.totalCharges} onChange={setApproxField('totalCharges')} />
      </Field>

      <div style={styles.subHeader(accent)}>Split Up of the Total Consultancy Charges</div>
      <div style={styles.row}>
        <Field label="Tax (%)"><input type="number" style={styles.input} value={approx.taxPercent} onChange={setApproxField('taxPercent')} /></Field>
        <Field label={`Approximate GST (${approx.taxPercent}%)`}><input style={styles.inputReadonly} value={approxGst.toFixed(2)} readOnly /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Approximate Overhead (30%)"><input style={styles.inputReadonly} value={approxOverhead.toFixed(2)} readOnly /></Field>
        <Field label="Approximate Consultant Remuneration incl. all expenditure (~70%)"><input style={styles.inputReadonly} value={approxRemun.toFixed(2)} readOnly /></Field>
      </div>

      <div style={styles.sectionHeader(accent)}>Estimated Expenditure for the Consultancy Charges</div>
      <div style={styles.row}>
        <Field label="Manpower"><input type="number" style={styles.input} value={expenditure.manpower} onChange={setExpField('manpower')} /></Field>
        <Field label="Travel"><input type="number" style={styles.input} value={expenditure.travel} onChange={setExpField('travel')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Equipment"><input type="number" style={styles.input} value={expenditure.equipment} onChange={setExpField('equipment')} /></Field>
        <Field label="Contingency"><input type="number" style={styles.input} value={expenditure.contingency} onChange={setExpField('contingency')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Consumables"><input type="number" style={styles.input} value={expenditure.consumables} onChange={setExpField('consumables')} /></Field>
        <Field label="Consultant & Co-Consultant Remuneration"><input type="number" style={styles.input} value={expenditure.consultantRemuneration} onChange={setExpField('consultantRemuneration')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Dept. / Centre Staff Remuneration"><input type="number" style={styles.input} value={expenditure.deptStaffRemuneration} onChange={setExpField('deptStaffRemuneration')} /></Field>
        <Field label="External Consultant"><input type="number" style={styles.input} value={expenditure.externalConsultant} onChange={setExpField('externalConsultant')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Sub-contracting of part of the work"><input type="number" style={styles.input} value={expenditure.subcontracting} onChange={setExpField('subcontracting')} /></Field>
        <Field label="Hiring Services"><input type="number" style={styles.input} value={expenditure.hiringServices} onChange={setExpField('hiringServices')} /></Field>
      </div>
      <div style={styles.row}>
        <Field label="Other Cost (please provide details)"><input style={styles.input} placeholder="If others please specify" value={expenditure.otherCostDetails} onChange={setExpField('otherCostDetails')} /></Field>
        <Field label="Other Cost Amount"><input type="number" style={styles.input} value={expenditure.otherCost} onChange={setExpField('otherCost')} /></Field>
      </div>
      <Field label="TOTAL ESTIMATED EXPENDITURE">
        <input style={styles.inputReadonly} value={totalEstimatedExpenditure.toFixed(2)} readOnly />
      </Field>
    </div>
  );

  const stepContent = () => {
    const key = steps[step];
    if (key === 'Co-Consultant Details') return StepCoConsultant();
    if (key === 'Firm Details') return StepFirm();
    if (key === 'Consultancy Work') return StepWork();
    if (key === 'Charges & Expenditure') return StepCharges();
    return null;
  };

  const isLast = step === steps.length - 1;

  return (
    <div style={styles.page}>
      <div style={styles.breadcrumb}>
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('home')}>Home</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate('consultancies')}>Consultancies</span> /{' '}
        <span style={styles.breadcrumbLink} onClick={() => onNavigate(parentKey)}>{parentLabel}</span> /{' '}
        <span style={styles.breadcrumbActive}>New Acceptance Form</span>
      </div>
      <div style={styles.titleRow}>
        <BackButton onClick={() => onNavigate(parentKey)} />
        <h1 style={styles.title}>Form — New Acceptance Form</h1>
      </div>
      <p style={styles.subtitle}>
        {isDept ? 'Department' : 'Centre / Other Campuses'} consultancy · {installmentType === 'with' ? 'With installment' : 'Without installment'}
      </p>

      <div style={styles.stepperWrap}>
        {steps.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={label} style={styles.stepItem}>
              <div style={styles.stepCircle(active, done, accent)}>{done ? '✓' : i + 1}</div>
              <div style={styles.stepLabel(active, done, accent)}>{label}</div>
              {i < steps.length - 1 && <div style={styles.stepLine(done, accent)} />}
            </div>
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={styles.banner}>
          Hard copy of the consultancy acceptance form should be submitted along with{' '}
          <span style={styles.bannerStrong}>Required documents (Firm Letter, Cheque / DD / E-transfer, GST Letter, TDS Letter)</span>{' '}
          through proper channel to the CSRC office.
        </div>
        <div style={styles.sectionBody}>{stepContent()}</div>
        <div style={styles.footer}>
          <button style={styles.navBtn(accent, false)} onClick={step === 0 ? () => onNavigate(parentKey) : goBack}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {isLast
            ? <button style={styles.saveBtn} onClick={handleSave}>✓ Save</button>
            : <button style={styles.navBtn(accent, true)} onClick={goNext}>Next →</button>}
        </div>
      </div>
    </div>
  );
};

export default AcceptanceFormWizard;