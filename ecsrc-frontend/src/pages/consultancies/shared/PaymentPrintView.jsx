// PATH: frontend/src/pages/consultancies/shared/PaymentPrintView.jsx

import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import BackButton from './BackButton';
import annaLogo from "../../../assets/anna-university-logo.png";

/* ---------------------------------------------------------------------- */
/*  Print-styled replica of the "Pay In Slip for Consultancy Assignments" */
/*  letter. Renders the already-approved payment.particulars — this is a  */
/*  record of what was decided, not a live calculator (that's            */
/*  PaymentEntryForm's job before submission).                            */
/* ---------------------------------------------------------------------- */

const styles = {
  screenWrap: { minHeight: '100%', padding: '0 4px', background: '#eceff3' },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 900, margin: '0 auto 18px', paddingTop: 18 },
  toolbarRight: { display: 'flex', gap: 10 },
  printBtn: { fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, padding: '9px 22px', borderRadius: 10, cursor: 'pointer', background: '#fff', color: '#334155', border: '1px solid rgba(30,41,59,0.15)' },
  downloadBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700, padding: '9px 22px', borderRadius: 10,
    cursor: 'pointer', border: 'none', background: 'linear-gradient(90deg, #db2777 0%, #be185d 100%)', color: '#fff',
    boxShadow: '0 8px 18px -6px #db277788',
  },
  downloadBtnDisabled: { opacity: 0.65, cursor: 'wait' },

  page: {
    position: 'relative', width: '210mm', minHeight: '297mm', margin: '0 auto 40px',
    background: '#fff', padding: '14mm 16mm 12mm', boxSizing: 'border-box',
    fontFamily: 'Georgia, "Times New Roman", serif', color: '#111',
    boxShadow: '0 6px 24px rgba(15,23,42,0.10)', border: '1px solid #d4d4d8',
  },
  watermark: {
    position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%) rotate(-28deg)',
    fontSize: 130, fontWeight: 800, color: 'rgba(120,120,120,0.08)', letterSpacing: 4,
    pointerEvents: 'none', userSelect: 'none', fontFamily: 'Arial, sans-serif', zIndex: 0,
  },
  pageContent: { position: 'relative', zIndex: 1 },

  headerRow: { display: 'flex', alignItems: 'flex-start', gap: 14, borderBottom: '2px solid #7c1f3f', paddingBottom: 10, marginBottom: 14 },
  logo: { width: 50, height: 50, objectFit: 'contain', flexShrink: 0 },
  headerTitle: { fontSize: 15, fontWeight: 700, color: '#7c1f3f', margin: 0 },
  headerSub: { fontSize: 12.5, fontStyle: 'italic', color: '#333', margin: '2px 0 0' },

  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, margin: '10px 0' },
  slipTitle: { textAlign: 'center', fontSize: 14.5, fontWeight: 700, textDecoration: 'underline', margin: '4px 0 14px' },
  workTitle: { textAlign: 'center', fontSize: 12.5, fontStyle: 'italic', margin: '0 0 18px' },

  dtTable: { width: '100%', borderCollapse: 'collapse', marginBottom: 18, fontSize: 12.5 },
  dtLabel: { padding: '2.5px 0', width: '20%', verticalAlign: 'top', color: '#222', fontWeight: 700 },
  dtColon: { padding: '2.5px 6px', width: 12, verticalAlign: 'top', color: '#222' },
  dtValue: { padding: '2.5px 0', verticalAlign: 'top', color: '#000' },

  twoColWrap: { display: 'flex', gap: 24, marginBottom: 18 },
  colHalf: { flex: 1, minWidth: 0 },
  colTitle: { fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', marginBottom: 6 },
  expTable: { width: '100%', borderCollapse: 'collapse', fontSize: 11.5 },
  expTh: { border: '1px solid #333', padding: '5px 7px', textAlign: 'left', fontWeight: 700, background: '#f4f4f5' },
  expThRight: { border: '1px solid #333', padding: '5px 7px', textAlign: 'right', fontWeight: 700, background: '#f4f4f5' },
  expTd: { border: '1px solid #333', padding: '5px 7px' },
  expTdRight: { border: '1px solid #333', padding: '5px 7px', textAlign: 'right' },
  totalTd: { border: '1px solid #333', padding: '5px 7px', fontWeight: 700 },
  totalTdRight: { border: '1px solid #333', padding: '5px 7px', fontWeight: 700, textAlign: 'right' },
  csrcNote: { fontSize: 10.5, fontStyle: 'italic', margin: '4px 0 0' },

  paymentTitle: { fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'underline', margin: '4px 0 8px' },

  sigRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, margin: '80px 0 30px' },

  recommendBox: { border: '1.5px solid #333', padding: '16px 18px', marginTop: 6 },
  recommendTitle: { fontSize: 12.5, fontWeight: 700, textDecoration: 'underline', textAlign: 'center', marginBottom: 22 },
  recommendRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 },
  recommendLine: { borderTop: '1px solid #333', paddingTop: 4, minWidth: 220, textAlign: 'center' },
  recommendNote: { fontSize: 11, fontStyle: 'italic', margin: '18px 0 10px' },
  remarksArea: { borderTop: '1px solid #999', minHeight: 40, fontSize: 12, paddingTop: 8 },

  pageFooter: { fontSize: 10, color: '#666', marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 8, fontStyle: 'italic', textAlign: 'center' },
};

const money = (n) => (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const DetailRow = ({ label, value }) => (
  <tr>
    <td style={styles.dtLabel}>{label}</td>
    <td style={styles.dtColon}>:</td>
    <td style={styles.dtValue}>{value || '—'}</td>
  </tr>
);

/**
 * record: a MOCK_FORMS entry with invoice.status === 'completed' and
 * payment.particulars populated (whether just-submitted or already approved).
 */
const PaymentPrintView = ({ record, onBack }) => {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { principal = {}, firm = {}, work = {} } = record.details || {};
  const p = record.payment?.particulars || {};

  const csrcNote1PercentOf3 = money(p.csrcRemunAmount);

  const handleDownloadPdf = () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);
    const opt = {
      margin: 0,
      filename: `Pay_In_Slip_${record.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(printRef.current).save()
      .then(() => setDownloading(false))
      .catch(() => setDownloading(false));
  };

  return (
    <div style={styles.screenWrap}>
      <div style={styles.toolbar} className="no-print">
        <BackButton label="Back to List" onClick={onBack} />
        <div style={styles.toolbarRight}>
          <button style={styles.printBtn} onClick={() => window.print()}>🖨 Print</button>
          <button
            style={{ ...styles.downloadBtn, ...(downloading ? styles.downloadBtnDisabled : {}) }}
            onClick={handleDownloadPdf}
            disabled={downloading}
          >
            {downloading ? 'Preparing PDF…' : '⬇ Download as PDF'}
          </button>
        </div>
      </div>

      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div ref={printRef} style={styles.page}>
        <div style={styles.watermark}>CSRC</div>
        <div style={styles.pageContent}>
          <div style={styles.headerRow}>
            <img src={annaLogo} alt="Anna University" style={styles.logo} />
            <div>
              <p style={styles.headerTitle}>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</p>
              <p style={styles.headerSub}>(Formerly known as Centre for Technology Development and Transfer)</p>
              <p style={styles.headerSub}>ANNA UNIVERSITY :: CHENNAI 600025</p>
            </div>
          </div>

          <div style={styles.metaRow}>
            <span>Consultancy Acceptance ID - {record.id}</span>
            <span>Date: {p.approvedOn || '—'}</span>
          </div>

          <h2 style={styles.slipTitle}>PAY IN SLIP FOR CONSULTANCY ASSIGNMENTS</h2>
          <p style={styles.workTitle}>&ldquo;{work.title || record.consultantTitle}&rdquo;</p>

          <table style={styles.dtTable}><tbody>
            <DetailRow label="Consultant Name" value={`${principal.name || '—'}, ${principal.designation || '—'}`} />
            <DetailRow label="Department" value={principal.department} />
            <DetailRow label="Campus" value={principal.campus} />
            <DetailRow label="Firm Name" value={firm.name} />
            <DetailRow label="Firm Address" value={firm.address} />
            <DetailRow label="Firm GST" value={firm.gst || 'No GST'} />
          </tbody></table>

          <div style={styles.twoColWrap}>
            <div style={styles.colHalf}>
              <div style={styles.colTitle}>Consultancy Charges</div>
              <table style={styles.expTable}>
                <thead>
                  <tr><th style={styles.expTh}>S.No</th><th style={styles.expTh}>Particulars</th><th style={styles.expThRight}>Amount (Rs.)</th></tr>
                </thead>
                <tbody>
                  <tr><td style={styles.expTd}>1</td><td style={styles.expTd}>Amount received</td><td style={styles.expTdRight}>{money(p.amountReceived)}</td></tr>
                  <tr><td style={styles.expTd}>2</td><td style={styles.expTd}>TDS Amount of the Firm</td><td style={styles.expTdRight}>{money(p.tds)}</td></tr>
                  <tr><td style={styles.totalTd} colSpan={2}>Total Consultancy Charges</td><td style={styles.totalTdRight}>{money(p.totalConsultancyCharges)}</td></tr>
                </tbody>
              </table>
            </div>

            <div style={styles.colHalf}>
              <div style={styles.colTitle}>Split up of the Consultancy Charge - Rs. {money(p.totalConsultancyCharges)}</div>
              <table style={styles.expTable}>
                <thead>
                  <tr><th style={styles.expTh}>S.No</th><th style={styles.expTh}>Particulars</th><th style={styles.expThRight}>Amount (Rs.)</th></tr>
                </thead>
                <tbody>
                  <tr><td style={styles.expTd}>1</td><td style={styles.expTd}>GST ({p.taxPercent || 0}%)</td><td style={styles.expTdRight}>{money(p.gstAmount)}</td></tr>
                  <tr><td style={styles.expTd}>2</td><td style={styles.expTd}>Overhead (30%)</td><td style={styles.expTdRight}>{money(p.overheadAmount)}</td></tr>
                  <tr>
                    <td style={styles.expTd}>3</td>
                    <td style={styles.expTd}>Consultant Remuneration including all expenditure ({p.csrcRemunEnabled ? '69' : '70'}%)</td>
                    <td style={styles.expTdRight}>{money(p.consultantRemunAmount)}</td>
                  </tr>
                </tbody>
              </table>
              {p.csrcRemunEnabled && (
                <p style={styles.csrcNote}>** 1% of item(3) for CSRC: Rs.{csrcNote1PercentOf3}</p>
              )}
            </div>
          </div>

          <p style={styles.paymentTitle}>Payment Details</p>
          <table style={styles.expTable}>
            <thead>
              <tr>
                <th style={styles.expTh}>S.No</th>
                <th style={styles.expTh}>Bank Name</th>
                <th style={styles.expTh}>Ref. No.</th>
                <th style={styles.expTh}>Payment Type</th>
                <th style={styles.expTh}>Date</th>
                <th style={styles.expThRight}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {(p.splitRows || []).map((row, i) => (
                <tr key={i}>
                  <td style={styles.expTd}>{i + 1}</td>
                  <td style={styles.expTd}>{row.bankName || '—'}</td>
                  <td style={styles.expTd}>{row.refNo || '—'}</td>
                  <td style={styles.expTd}>{row.paymentType || '—'}</td>
                  <td style={styles.expTd}>{row.refDate || '—'}</td>
                  <td style={styles.expTdRight}>{money(row.amount)}</td>
                </tr>
              ))}
              {(!p.splitRows || p.splitRows.length === 0) && (
                <tr><td style={styles.expTd} colSpan={6}>No payment particulars recorded.</td></tr>
              )}
            </tbody>
          </table>

          <div style={styles.sigRow}>
            <span>Signature of the Co-Consultants<br />with Date &amp; Seal</span>
            <span>Signature of the Principal Consultant<br />with Date &amp; seal</span>
          </div>

          <div style={styles.recommendBox}>
            <div style={styles.recommendTitle}>Recommended / Not Recommended</div>
            <div style={styles.recommendRow}>
              <span style={styles.recommendLine}>Date &amp; Seal</span>
              <span style={styles.recommendLine}>Signature of the HOD / DIRECTOR / DEAN</span>
            </div>
            <p style={styles.recommendNote}>*If not recommended, Please state the reason below</p>
            <div style={styles.remarksArea}>Remarks</div>
          </div>

          <p style={styles.pageFooter}>
            This is a system generated Consultancy Completion Report for Consultancy works by CSRC - {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPrintView;