import React, { useState, useMemo } from 'react';
import BackButton from './BackButton';
import { createAcceptanceForm, uploadFirmLetter } from './consultancyApi';

/* ---------------------------------------------------------------------- */
/*  Light, colourful internal-CSS theme (kept consistent with the rest    */
/*  of the app's glassmorphic look, but with the section header bars     */
/*  used on the real CSRC acceptance form for quick visual recognition). */
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
    fontFamily: 'DM Sans, sans-serif', fontSize: 26, fontWeight: 700,
    color: '#1e293b', margin: 0, letterSpacing: '-0.02em',
  },
  subtitle: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(30,41,59,0.55)',
    margin: '0 0 26px 0',
  },

  stepperWrap: {
    display: 'flex', alignItems: 'center', marginBottom: 30, width: '100%', flexWrap: 'wrap',
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
    borderRadius: 20, padding: 0, width: '100%', boxSizing: 'border-box',
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden',
  },
  banner: {
    background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
    color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 12.5,
    padding: '10px 22px', lineHeight: 1.5,
  },
  bannerStrong: { fontWeight: 700 },

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

  /* One field per row: label on the left, input fills the remaining width. */
  fieldRow: { width: '100%', marginBottom: 14 },
  field: {
    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%',
  },
  label: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 600,
    color: '#334155', flex: '0 0 320px', maxWidth: 320, lineHeight: 1.35,
    textAlign: 'left',
  },
  fieldControl: { flex: 1, minWidth: 0 },
  input: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
    textAlign: 'left',
  },
  inputRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
    textAlign: 'right',
  },
  inputReadonly: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#7c3aed',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.25)',
    background: 'rgba(124,58,237,0.06)', width: '100%', boxSizing: 'border-box',
    textAlign: 'left',
  },
  inputReadonlyRight: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#7c3aed',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(124,58,237,0.25)',
    background: 'rgba(124,58,237,0.06)', width: '100%', boxSizing: 'border-box',
    textAlign: 'right',
  },
  textarea: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', minHeight: 90, resize: 'vertical',
    width: '100%', boxSizing: 'border-box', textAlign: 'left',
  },
  select: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: '#1e293b',
    padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(30,41,59,0.14)',
    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box',
    textAlign: 'left',
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

  /* Side-by-side placement for Estimated Expenditure (left) and
     Approximate Consultancy Charges (right). Each column keeps its own
     single-field-per-row layout internally. */
  twoColWrap: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px',
    alignItems: 'start', width: '100%',
  },
  twoColCol: { minWidth: 0 },
};

/* label on the left, input control on the right — exactly one per row.
   labelWidth lets narrower contexts (e.g. two-column layout) shrink the
   label column so the input still has room to breathe. */
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

const emptyConsultant = { name: '', designation: 'Professor', campus: '', department: '', mobile: '' };

const emptyInstallmentDetails = {
  frequency: 'Monthly', month: '', installmentNo: '',
  proceedingsNo: '', proceedingsDate: '',
  totalAmount: '', releasedAmount: '',
};

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

  // Only relevant when installmentType === 'with'
  const [installmentDetails, setInstallmentDetails] = useState(emptyInstallmentDetails);
  const setInstallmentField = (key) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setInstallmentDetails((prev) => ({ ...prev, [key]: val }));
  };
  const installmentYetToRelease = Math.max(
    num(installmentDetails.totalAmount) - num(installmentDetails.releasedAmount), 0
  );

  const [splitCount, setSplitCount] = useState('');
  const [splitRows, setSplitRows] = useState([]);

  const [charges, setCharges] = useState({ tds: '', amountReceived: '', taxPercent: 18 });

  // Whether the 1% CSRC Remuneration is applied on top of the consultant's
  // share. Yes (default) => consultant gets ~69%, CSRC gets 1%.
  // No => consultant gets the full remaining ~70%, no separate CSRC line.
  const [csrcRemunEnabled, setCsrcRemunEnabled] = useState(true);

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

  const [firmLetterFile, setFirmLetterFile] = useState(null);

  // ---- derived totals ----
  const totalConsultancyCharges = num(charges.tds) + num(charges.amountReceived);
  const gstAmount = (totalConsultancyCharges * num(charges.taxPercent)) / 100;
  const overheadAmount = totalConsultancyCharges * 0.3;
  const consultantRemunAmount = Math.max(totalConsultancyCharges - gstAmount - overheadAmount, 0);
  const csrcRemunAmount = csrcRemunEnabled ? consultantRemunAmount * 0.01 : 0;
  const consultantRemunPercentLabel = csrcRemunEnabled ? '69' : '70';

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

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setSaveError('');

    const payload = {
      campus,
      installmentType,
      installmentDetails: installmentType === 'with'
        ? { ...installmentDetails, yetToRelease: installmentYetToRelease }
        : undefined,
      coConsult,
      firm,
      work,
      approx,
      expenditure,
      splitRows: work.workType === 'permission' ? splitRows : undefined,
      charges: work.workType === 'permission'
        ? { tds: charges.tds, amountReceived: charges.amountReceived, taxPercent: charges.taxPercent, csrcRemunEnabled }
        : undefined,
    };

    setSaving(true);
    try {
      const created = await createAcceptanceForm(payload);
      if (firmLetterFile) {
        try {
          await uploadFirmLetter(created.formCode, firmLetterFile);
        } catch (uploadErr) {
          // Form itself saved successfully — surface the upload failure but don't block navigation
          console.error('Firm letter upload failed:', uploadErr);
        }
      }
      onNavigate(parentKey);
    } catch (err) {
      setSaveError(err.message || 'Failed to save the acceptance form.');
    } finally {
      setSaving(false);
    }
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
          <button style={styles.addBtn} onClick={addConsultant}>+ ADD</button>
        </div>
      )}
    </div>
  );

  const StepFirm = () => (
    <div>
      <div style={styles.sectionHeader(accent)}>Firm Details</div>
      <Field label="Consultant Type">
        <select style={styles.select} value={firm.consultantType} onChange={setFirmField('consultantType')}>
          <option value="">--Select the Consultant type--</option>
          <option>Individual</option><option>Firm / Company</option><option>Government Body</option>
        </select>
      </Field>
      <Field label="G.S.T No">
        <input style={styles.input} value={firm.gst} onChange={setFirmField('gst')} />
      </Field>
      <Field label="Firm Name"><input style={styles.input} value={firm.firmName} onChange={setFirmField('firmName')} /></Field>
      <Field label="Email Id"><input style={styles.input} value={firm.email} onChange={setFirmField('email')} /></Field>
      <Field label="Sector">
        <select style={styles.select} value={firm.sector} onChange={setFirmField('sector')}>
          <option value="">--Select the Firm Sector--</option>
          <option>Public</option><option>Private</option><option>Government</option>
        </select>
      </Field>
      <Field label="Tan No"><input style={styles.input} value={firm.tan} onChange={setFirmField('tan')} /></Field>
      <Field label="Type">
        <select style={styles.select} value={firm.type} onChange={setFirmField('type')}>
          <option>National</option><option>International</option>
        </select>
      </Field>
      <Field label="Contact Person Name"><input style={styles.input} value={firm.contactName} onChange={setFirmField('contactName')} /></Field>
      <Field label="District"><input style={styles.input} value={firm.district} onChange={setFirmField('district')} /></Field>
      <Field label="Contact Person Designation"><input style={styles.input} value={firm.contactDesignation} onChange={setFirmField('contactDesignation')} /></Field>
      <Field label="State"><input style={styles.input} value={firm.state} onChange={setFirmField('state')} /></Field>
      <Field label="Contact Person Mobile No"><input style={styles.input} value={firm.contactMobile} onChange={setFirmField('contactMobile')} /></Field>
      <Field label="Pin Code"><input style={styles.input} value={firm.pinCode} onChange={setFirmField('pinCode')} /></Field>
      <Field label="Pan No"><input style={styles.input} value={firm.pan} onChange={setFirmField('pan')} /></Field>
      <Field label="Firm Address"><input style={styles.input} value={firm.firmAddress} onChange={setFirmField('firmAddress')} /></Field>
      <Field label="Upload Letter Reference (only pdf)">
        <input
          type="file" accept="application/pdf" style={styles.input}
          onChange={(e) => setFirmLetterFile(e.target.files?.[0] || null)}
        />
      </Field>
      <Field label="Letter Reference with date"><input style={styles.input} value={firm.letterRef} onChange={setFirmField('letterRef')} /></Field>
      <p style={styles.note}>If there is no GST number, submit the undertaking letter from the firm given in the CSRC downloads.</p>
    </div>
  );

  const StepWork = () => (
    <div>
      <div style={styles.sectionHeader(accent)}>Details of the Consultancy Work</div>
      <Field label="Consultancy Title"><input style={styles.input} value={work.title} onChange={setWorkField('title')} /></Field>
      <Field label="Total No. of hours likely to be spent"><input style={styles.inputRight} value={work.totalHours} onChange={setWorkField('totalHours')} /></Field>
      <Field label={`Abstract of the Work (Minimum 75 words is Compulsory) — Words: ${abstractWords}`}>
        <textarea style={styles.textarea} value={work.abstract} onChange={setWorkField('abstract')} />
      </Field>
      <Field label="Start Date"><input type="date" style={styles.input} value={work.startDate} onChange={setWorkField('startDate')} /></Field>
      <Field label="End Date"><input type="date" style={styles.input} value={work.endDate} onChange={setWorkField('endDate')} /></Field>
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
      <Field label="Equipment Name">
        <input style={styles.input} value={work.equipmentName} onChange={setWorkField('equipmentName')} disabled={work.hasEquipment !== 'yes'} />
      </Field>
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

      {installmentType === 'with' && (
        <div>
          <div style={styles.subHeader(accent)}>Installment Particulars</div>
          <Field label="Monthly / Yearly Installment">
            <select style={styles.select} value={installmentDetails.frequency} onChange={setInstallmentField('frequency')}>
              <option>Monthly</option><option>Yearly</option>
            </select>
          </Field>
          <Field label="Month">
            <input type="month" style={styles.input} value={installmentDetails.month} onChange={setInstallmentField('month')} />
          </Field>
          <Field label="Installment No.">
            <select style={styles.select} value={installmentDetails.installmentNo} onChange={setInstallmentField('installmentNo')}>
              <option value="">--Installment No.--</option>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="1st Installment CTDT Proceedings number">
            <input style={styles.input} value={installmentDetails.proceedingsNo} onChange={setInstallmentField('proceedingsNo')} />
          </Field>
          <Field label="1st Installment CTDT Proceedings Date">
            <input type="date" style={styles.input} value={installmentDetails.proceedingsDate} onChange={setInstallmentField('proceedingsDate')} />
          </Field>
          <Field label="Total Installment amount">
            <input type="number" style={styles.inputRight} value={installmentDetails.totalAmount} onChange={setInstallmentField('totalAmount')} />
          </Field>
          <Field label="Released Installment amount">
            <input type="number" style={styles.inputRight} value={installmentDetails.releasedAmount} onChange={setInstallmentField('releasedAmount')} />
          </Field>
          <Field label="Amount Yet to be released">
            <input style={styles.inputReadonlyRight} value={installmentYetToRelease.toFixed(2)} readOnly />
          </Field>
        </div>
      )}

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
                        <input type="number" style={styles.inputRight} value={row.amount} onChange={updateSplitRow(i, 'amount')} />
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
                      <input style={styles.inputReadonlyRight} value={splitTotal.toFixed(2)} readOnly />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={styles.note}>*Cheque or DD Amount Remittance date should not exceed 85 days.</p>
            </div>
          )}

          <div style={styles.subHeader(accent)}>Consultancy Charges</div>
          <Field label="TDS amount if paid by the firm"><input type="number" style={styles.inputRight} value={charges.tds} onChange={setChargesField('tds')} /></Field>
          <Field label="Amount received from the firm"><input type="number" style={styles.inputRight} value={charges.amountReceived} onChange={setChargesField('amountReceived')} /></Field>
          <Field label="TOTAL CONSULTANCY CHARGES">
            <input style={styles.inputReadonlyRight} value={totalConsultancyCharges.toFixed(2)} readOnly />
          </Field>

          <div style={styles.subHeader(accent)}>Split Up of the Total Consultancy Charges</div>
          <Field label="Tax (%)"><input type="number" style={styles.inputRight} value={charges.taxPercent} onChange={setChargesField('taxPercent')} /></Field>
          <Field label={`GST (${charges.taxPercent}%)`}><input style={styles.inputReadonlyRight} value={gstAmount.toFixed(2)} readOnly /></Field>
          <Field label="Overhead (30%)"><input style={styles.inputReadonlyRight} value={overheadAmount.toFixed(2)} readOnly /></Field>
          <Field label={`Consultant Remuneration incl. all expenditure (~${consultantRemunPercentLabel}%)`}>
            <input style={styles.inputReadonlyRight} value={consultantRemunAmount.toFixed(2)} readOnly />
          </Field>
          <Field label="Apply CSRC Remuneration (1% of Consultant Remuneration)?">
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
            <Field label="CSRC Remuneration (1% of Consultant Remuneration)">
              <input style={styles.inputReadonlyRight} value={csrcRemunAmount.toFixed(2)} readOnly />
            </Field>
          )}
        </>
      )}

      <div style={styles.twoColWrap}>
        {/* ---- LEFT: Estimated Expenditure for the Consultancy Charges ---- */}
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

        {/* ---- RIGHT: Approximate Consultancy Charges ---- */}
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
      </div>
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
            ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {saveError && (
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#ef4444' }}>{saveError}</span>
                )}
                <button style={{ ...styles.saveBtn, opacity: saving ? 0.65 : 1, cursor: saving ? 'wait' : 'pointer' }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : '✓ Save'}
                </button>
              </div>
            )
            : <button style={styles.navBtn(accent, true)} onClick={goNext}>Next →</button>}
        </div>
      </div>
    </div>
  );
};

export default AcceptanceFormWizard;