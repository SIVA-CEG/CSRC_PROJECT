import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

// ============================================================
// CSRCClaimBillForm.jsx
// Self-contained: does NOT import from CSRCPDFSanctionLetter.jsx,
// so it can be dropped into any folder (faculty side or office
// side) without worrying about relative-path/folder placement.
// Renders the physical "CSRC CLAIM BILL" used for the post-sanction
// bill-processing stage:
//   - Faculty-entered bill details (supply order, invoice, firm,
//     payee) come from the original PDF request.
//   - Office-entered sanction fields (head of account, procs no,
//     director) come from officeFields, already collected during
//     the assistant -> superintendent -> DD -> director chain.
//   - Appropriation / amount-spent / balance figures come from
//     billProcessingData, entered by the assistant once the
//     sanction is complete.
//   - Everything up to and including "(UNDER RUPEES ... )" is
//     filled here; the "FOR CSRC OFFICE USE ONLY" block below stays
//     blank until officeUseData is supplied (after the physically
//     signed copy returns to CSRC office).
// Per instructions: "NAME OF THE ACCOUNT" is fixed to
// "CSRC REVENUE ACCOUNT" and the "Computer Code No." row is removed.
// ============================================================

// ─── Local copies of the number formatting helpers ───────────
// (kept in sync with CSRCPDFSanctionLetter.jsx's versions, but
// duplicated here so this file has no dependency on where that
// file lives in the project.)
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS[t] + (o ? ' ' + ONES[o] : '');
}
function threeDigits(n) {
  const h = Math.floor(n / 100), r = n % 100;
  return (h ? ONES[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? twoDigits(r) : '');
}
function numberToIndianWords(num) {
  let n = Math.round(Math.abs(parseFloat(num) || 0));
  if (n === 0) return 'Zero';
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;
  let parts = [];
  if (crore) parts.push(threeDigits(crore) + ' Crore');
  if (lakh) parts.push(threeDigits(lakh) + ' Lakh');
  if (thousand) parts.push(threeDigits(thousand) + ' Thousand');
  if (hundred) parts.push(threeDigits(hundred));
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}
function fmtINR(n) {
  const num = parseFloat(n) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
const amountInWords = (n) => `Rupees ${numberToIndianWords(n)} only`;

const S = {
  wrap: { background: '#e5e7eb', padding: '20px 8px' },
  page: {
    background: '#fff',
    width: '100%',
    maxWidth: '760px',
    margin: '0 auto',
    padding: '30px 40px 40px',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#1a1a1a',
    fontSize: '13px',
    lineHeight: 1.5,
    boxShadow: '0 0 0 1px #d8dee8',
  },
  center: { textAlign: 'center' },
  h1: { fontSize: 18, fontWeight: 700, textDecoration: 'underline', margin: '0 0 4px' },
  h2: { fontSize: 15, fontWeight: 700, textDecoration: 'underline', margin: '0 0 4px' },
  h3: { fontSize: 12.5, fontWeight: 700, textDecoration: 'underline', margin: '0 0 16px' },

  topRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 10, flexWrap: 'wrap', gap: 6 },
  checkboxRow: { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', margin: '10px 0 14px', fontSize: 12.5 },
  checkbox: { display: 'inline-flex', alignItems: 'center', gap: 5 },
  box: (checked) => ({
    width: 14, height: 14, border: '1.3px solid #1a1a1a', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, lineHeight: 1,
  }),

  line: { display: 'flex', gap: 8, margin: '7px 0', fontSize: 12.5 },
  lineLabel: { fontWeight: 700, minWidth: 190, flexShrink: 0 },
  lineVal: { borderBottom: '1px dotted #999', flex: 1, minHeight: 16, paddingBottom: 1 },

  twoColLine: { display: 'flex', gap: 8, margin: '7px 0', fontSize: 12.5, alignItems: 'flex-start' },
  twoColLabel: { fontWeight: 700, minWidth: 240, flexShrink: 0 },
  twoColVals: { display: 'flex', gap: 24, flex: 1 },
  amtCell: { display: 'flex', gap: 4, alignItems: 'baseline' },

  underRupees: { margin: '16px 0 4px', fontSize: 12.5, borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '6px 0' },

  certBlock: { margin: '18px 0 14px', fontSize: 12 },
  certTitle: { fontWeight: 700, marginBottom: 4 },

  advanceBox: { border: '1.3px solid #1a1a1a', padding: '10px 14px', width: '55%', fontSize: 12, marginBottom: 10 },
  advanceTitle: { fontWeight: 700, textDecoration: 'underline', marginBottom: 6 },
  signRow: { display: 'flex', justifyContent: 'space-between', marginTop: 30, fontSize: 12 },
  signCol: { textAlign: 'center', minWidth: 90 },

  officeUseWrap: { marginTop: 26, borderTop: '2px solid #1a1a1a', paddingTop: 12 },
  officeUseTitle: { textAlign: 'center', fontWeight: 700, fontSize: 13, textDecoration: 'underline', marginBottom: 12 },
  officeGrid: { display: 'flex', gap: 24 },
  officeCol: { flex: 1, fontSize: 12 },
  officeLine: { margin: '8px 0' },

  watermark: {
    position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%) rotate(-28deg)',
    fontSize: 54, fontWeight: 800, color: 'rgba(202,138,4,0.15)', letterSpacing: 6,
    pointerEvents: 'none', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap',
  },
};

const Box = ({ checked, label }) => (
  <span style={S.checkbox}>
    <span style={S.box(checked)}>{checked ? '✓' : ''}</span>
    <span>{label}</span>
  </span>
);

const downloadBtnStyle = {
  position: 'absolute', top: 12, right: 12,
  background: '#16a34a', color: '#fff', border: 'none',
  borderRadius: 8, padding: '8px 14px', fontSize: 12.5,
  fontWeight: 700, cursor: 'pointer', zIndex: 10,
};

// Map request type / category to which checkbox on the printed
// claim bill should be ticked.
function checkboxFlags(item) {
  const rt = item.requestType || '';
  return {
    advanceSettlement: false,
    advance: rt === 'Advance Payment',
    reimbursement: rt === 'Reimbursement',
    firm: rt === 'Vendor Payment',
    others: !['Advance Payment', 'Reimbursement', 'Vendor Payment'].includes(rt),
  };
}

export default function CSRCClaimBillForm({ item }) {
  const bd = item.billDetails || {};
  const bp = item.billProcessingData || {};
  const of = item.officeFields || {};
  const ou = item.officeUseData || null;
  const cb = checkboxFlags(item);
  const pageRef = useRef(null);

  const downloadPDF = () => {
    if (!pageRef.current) return;
    html2pdf().set({
      margin: 8,
      filename: `${bp.csrcBillNo || item.id}-Claim-Bill.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(pageRef.current).save();
  };

  const headOfAccount = [of.mhNo && `M.H.No. ${of.mhNo}`, of.head, of.subhead].filter(Boolean).join(' — ');

  return (
    <div style={{ position: 'relative', ...S.wrap }}>
      <button style={downloadBtnStyle} onClick={downloadPDF}>📄 Download PDF</button>
      <div ref={pageRef} style={{ position: 'relative', ...S.page }}>
        {!ou && <div style={S.watermark}>UNSIGNED</div>}

        <div style={S.center}>
          <div style={S.h1}>CSRC</div>
          <div style={S.h2}>CLAIM BILL</div>
          <div style={S.h3}>PAYABLE AT ANNA UNIVERSITY, CHENNAI - 600 025.</div>
        </div>

        <div style={S.topRow}>
          <span><strong>Month:</strong> {bp.month || '________'} {bp.year ? `20${bp.year}` : ''}</span>
          <span><strong>Contact No.:</strong> {bp.contactNo || '________________'}</span>
          <span><strong>CSRC Bill No.:</strong> {bp.csrcBillNo || '________________'}</span>
        </div>

        <div style={S.checkboxRow}>
          <Box checked={cb.advanceSettlement} label="Advance Settlement" />
          <Box checked={cb.advance} label="Advance" />
          <Box checked={cb.reimbursement} label="Reimbursement" />
          <Box checked={cb.firm} label="Firm" />
          <Box checked={cb.others} label="Others" />
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>NAME OF THE ACCOUNT</span>
          <span style={S.lineVal}>CSRC REVENUE ACCOUNT</span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>HEAD OF ACCOUNT<br />(Major Head, Sub Head,<br />Detailed Head)</span>
          <span style={S.lineVal}>{headOfAccount || '—'}</span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Project Period</span>
          <span style={S.lineVal}>{item.projectPeriod || '—'}</span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>DIRECTOR<br />PROCS. No. &amp; Date</span>
          <span style={S.lineVal}>
            {of.directorName ? of.directorName.toUpperCase() : '—'}
            {of.proceedingNo ? ` — Procs. No. ${of.proceedingNo}` : ''}
            {of.proceedingDate ? `, dated ${of.proceedingDate}` : ''}
          </span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Supply Order No. &amp; Date</span>
          <span style={S.lineVal}>
            {bd.supplyOrderNo || '—'}{bd.supplyOrderDate ? `, dated ${bd.supplyOrderDate}` : ''}
          </span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Item Details</span>
          <span style={S.lineVal}>{bd.itemDetails || '—'}</span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Invoice No. &amp; Date</span>
          <span style={S.lineVal}>
            {bd.invoiceNo || '—'}{bd.invoiceDate ? `, dated ${bd.invoiceDate}` : ''}
          </span>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Name of the Firm</span>
          <span style={S.lineVal}>{bd.firmName || '—'}</span>
        </div>

        <div style={S.twoColLine}>
          <span style={S.twoColLabel}>Amount Rs.</span>
          <div style={S.twoColVals}>
            <span>{fmtINR(item.amount)}</span>
            <span><strong>A/C. No.:</strong> {item.account?.accountNumber || '—'}</span>
          </div>
        </div>

        <div style={S.line}>
          <span style={S.lineLabel}>Name of the payee</span>
          <span style={S.lineVal}>{bd.payeeName || '—'}</span>
        </div>

        <div style={S.twoColLine}>
          <span style={S.twoColLabel}>Appropriation (B.E. / R.E.) 20{bp.year || '__'} - 20{bp.year ? Number(bp.year) + 1 : '__'}</span>
          <div style={S.twoColVals}>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.appropriation1 ? fmtINR(bp.appropriation1) : '________'}</span>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.appropriation2 ? fmtINR(bp.appropriation2) : '________'}</span>
          </div>
        </div>

        <div style={S.twoColLine}>
          <span style={S.twoColLabel}>Amount spent so far including this bill</span>
          <div style={S.twoColVals}>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.spent1 ? fmtINR(bp.spent1) : '________'}</span>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.spent2 ? fmtINR(bp.spent2) : '________'}</span>
          </div>
        </div>

        <div style={S.twoColLine}>
          <span style={S.twoColLabel}>Balance amount available</span>
          <div style={S.twoColVals}>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.balance1 ? fmtINR(bp.balance1) : '________'}</span>
            <span style={S.amtCell}><strong>Rs.:</strong> {bp.balance2 ? fmtINR(bp.balance2) : '________'}</span>
          </div>
        </div>

        <div style={S.underRupees}>
          (UNDER RUPEES {item.amount ? amountInWords(item.amount).toUpperCase() : '................................'})
        </div>

        <div style={S.certBlock}>
          <div style={S.certTitle}>CERTIFIED THAT</div>
          <div>1. THE AMOUNT CLAIMED IN THIS BILL HAS NOT BEEN DRAWN PREVIOUSLY</div>
          <div>2. THE CONTINGENT BILL IS PRE-RECEIPTED&nbsp;&nbsp;&nbsp;3. NO ADVANCE IS PENDING FOR SETTLEMENT</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={S.advanceBox}>
            <div style={S.advanceTitle}>IN CASE OF ADVANCE</div>
            <div>Entered in Advance Register</div>
            <div>in Page No. ..................  Sl. No. ..................</div>
            <div>in CSRC Office.</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontWeight: 700 }}>
              <span>Asst.</span><span>Supdt.</span><span>Director</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700 }}>
            DIRECTOR<br />(With Seal)
          </div>
        </div>

        {/* ── FOR CSRC OFFICE USE ONLY — blank until the physically signed
             copy is back with CSRC office and the assistant registers it ── */}
        <div style={S.officeUseWrap}>
          <div style={S.officeUseTitle}>FOR CSRC OFFICE USE ONLY</div>
          <div style={S.officeGrid}>
            <div style={S.officeCol}>
              <div style={S.officeLine}><strong>Appropriation Page No.:</strong> {ou?.appropriationPageNo || '..............................'}</div>
              <div style={S.officeLine}><strong>Entered in VDS</strong></div>
              <div style={S.officeLine}><strong>Folio No.:</strong> {ou?.vdsFolioNo || '.......................'} &nbsp; <strong>Year:</strong> 20{ou?.vdsYear || '__'} .. 20{ou?.vdsYear ? Number(ou.vdsYear) + 1 : '__'}</div>
              <div style={S.officeLine}><strong>Passed for and Pay Rs.:</strong> {ou?.passedForPayRs ? fmtINR(ou.passedForPayRs) : '..............................'}</div>
              <div style={S.officeLine}><strong>Rupees:</strong> {ou?.passedForPayRs ? amountInWords(ou.passedForPayRs) : '..............................................'}</div>
            </div>
            <div style={S.officeCol}>
              <div style={S.officeLine}><strong>Voucher No.:</strong> {ou?.voucherNo || '.......................'}</div>
              <div style={S.officeLine}><strong>Cash Book Page No.:</strong> {ou?.cashBookPageNo || '.......................'}</div>
              <div style={S.officeLine}><strong>Paid:</strong> Rs. {ou?.paidRs ? fmtINR(ou.paidRs) : '.......................'}</div>
              <div style={S.officeLine}><strong>Cheque No.:</strong> {ou?.chequeNo || '.......................'}</div>
              <div style={S.officeLine}><strong>Dated:</strong> {ou?.dated || '.......................'} &nbsp; <strong>for Rs.</strong> {ou?.paidRs ? fmtINR(ou.paidRs) : '.......................'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, fontWeight: 700, fontSize: 12 }}>
            <span>Asst.</span><span>Supdt.</span><span>DIR</span>
            <span style={{ marginLeft: 30 }}>Asst.</span><span>Supdt.</span><span>DIR</span>
          </div>
        </div>
      </div>
    </div>
  );
}