// PATH: frontend/src/pages/consultancies/shared/InvoicePrintView.jsx

import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import BackButton from './BackButton';
import annaLogo from "../../../assets/anna-university-logo.png";

/* ---------------------------------------------------------------------- */
/*  Print-styled replica of the CSRC "Proforma Invoice" letter. Before    */
/*  invoice.status === 'completed', the Invoice No. line stays as the     */
/*  placeholder text; once completed, invoice.invoiceNo prints instead.   */
/* ---------------------------------------------------------------------- */

const styles = {
  screenWrap: { minHeight: '100%', padding: '0 4px', background: '#eceff3' },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    maxWidth: 900, margin: '0 auto 18px', paddingTop: 18,
  },
  toolbarRight: { display: 'flex', gap: 10 },
  printBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '9px 22px', borderRadius: 10, cursor: 'pointer',
    background: '#fff', color: '#334155', border: '1px solid rgba(30,41,59,0.15)',
  },
  downloadBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '9px 22px', borderRadius: 10, cursor: 'pointer', border: 'none',
    background: 'linear-gradient(90deg, #0f766e 0%, #115e59 100%)', color: '#fff',
    boxShadow: '0 8px 18px -6px #0f766e88',
  },
  downloadBtnDisabled: { opacity: 0.65, cursor: 'wait' },

  page: {
    position: 'relative', width: '210mm', minHeight: '297mm', margin: '0 auto 40px',
    background: '#fff', padding: '16mm 16mm 14mm', boxSizing: 'border-box',
    fontFamily: 'Georgia, "Times New Roman", serif', color: '#111',
    boxShadow: '0 6px 24px rgba(15,23,42,0.10)', border: '1px solid #d4d4d8',
  },
  watermark: {
    position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%) rotate(-28deg)',
    fontSize: 130, fontWeight: 800, color: 'rgba(120,120,120,0.08)', letterSpacing: 4,
    pointerEvents: 'none', userSelect: 'none', fontFamily: 'Arial, sans-serif', zIndex: 0,
  },
  pageContent: { position: 'relative', zIndex: 1 },

  header: { textAlign: 'center', borderBottom: '2px solid #7c1f3f', paddingBottom: 10, marginBottom: 20 },
  headerLogo: { width: 54, height: 54, objectFit: 'contain', margin: '0 auto 6px' },
  headerTitle: { fontSize: 15, fontWeight: 700, color: '#7c1f3f', margin: 0, letterSpacing: 0.3 },
  headerSub: { fontSize: 12.5, fontStyle: 'italic', color: '#333', margin: '2px 0' },
  headerLine3: { fontSize: 12.5, fontWeight: 700, color: '#222', margin: '2px 0 0' },

  invoiceTitle: { textAlign: 'center', fontSize: 15, fontWeight: 700, textDecoration: 'underline', margin: '18px 0 20px' },

  dtTable: { width: '100%', borderCollapse: 'collapse', marginBottom: 18, fontSize: 12.5 },
  dtLabel: { padding: '2.5px 0', width: '26%', verticalAlign: 'top', color: '#222' },
  dtColon: { padding: '2.5px 6px', width: 12, verticalAlign: 'top', color: '#222' },
  dtValue: { padding: '2.5px 0', verticalAlign: 'top', color: '#000', fontWeight: 500 },

  toLabel: { fontSize: 12.5, fontWeight: 700, margin: '0 0 4px' },
  toBlock: { fontSize: 12.5, lineHeight: 1.6, marginBottom: 18 },

  expTable: { width: '100%', borderCollapse: 'collapse', margin: '6px 0 4px', fontSize: 12 },
  expTh: { border: '1px solid #333', padding: '6px 8px', textAlign: 'left', fontWeight: 700, background: '#f4f4f5' },
  expThRight: { border: '1px solid #333', padding: '6px 8px', textAlign: 'right', fontWeight: 700, background: '#f4f4f5' },
  expTd: { border: '1px solid #333', padding: '8px', lineHeight: 1.55 },
  expTdRight: { border: '1px solid #333', padding: '8px', textAlign: 'right', verticalAlign: 'top' },
  totalRow: { border: '1px solid #333', padding: '8px', fontWeight: 700 },
  totalRowRight: { border: '1px solid #333', padding: '8px', fontWeight: 700, textAlign: 'right' },

  wordsRow: { border: '1px solid #333', padding: '8px', fontWeight: 700, fontSize: 12 },

  accountTitle: { fontSize: 12.5, fontWeight: 700, textDecoration: 'underline', margin: '26px 0 8px' },
  accountLine: { fontSize: 12.5, lineHeight: 1.7, margin: 0 },

  signatureBlock: { textAlign: 'left', fontSize: 12.5, fontWeight: 700, marginTop: 90 },

  pageFooter: { fontSize: 10, color: '#666', marginTop: 40, borderTop: '1px solid #ccc', paddingTop: 8 },
  pageFooter2: { fontSize: 10, color: '#666', display: 'flex', justifyContent: 'space-between' },
};

const money = (n) => (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n) {
  if (n < 20) return ONES[n];
  return `${TENS[Math.floor(n / 10)]}${n % 10 ? ' ' + ONES[n % 10] : ''}`;
}
function threeDigits(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return `${h ? ONES[h] + ' Hundred' + (rest ? ' ' : '') : ''}${rest ? twoDigits(rest) : ''}`;
}
function numberToWordsINR(amount) {
  let n = Math.round(Number(amount) || 0);
  if (n === 0) return 'Zero';
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  const hundred = n;
  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return parts.join(' ').trim();
}

const DetailRow = ({ label, value }) => (
  <tr>
    <td style={styles.dtLabel}>{label}</td>
    <td style={styles.dtColon}>:</td>
    <td style={styles.dtValue}>{value || '—'}</td>
  </tr>
);

/**
 * record shape: an entry from MOCK_FORMS with details.work.workType === 'proforma'.
 * invoice.status === 'submitted' -> placeholder invoice number line.
 * invoice.status === 'completed' -> invoice.invoiceNo prints instead.
 */
const InvoicePrintView = ({ record, onBack }) => {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { principal = {}, firm = {}, work = {}, approx = {} } = record.details || {};
  const invoice = record.invoice || {};

  const totalCharges = Number(approx.totalCharges) || 0;
  const taxPercent = Number(approx.taxPercent) || 0;
  const gstAmount = (totalCharges * taxPercent) / 100;
  const grandTotal = totalCharges + gstAmount;

  const invoiceNoDisplay = invoice.status === 'completed' && invoice.invoiceNo
    ? invoice.invoiceNo
    : '-- WILL BE ISSUED AFTER APPROVAL FROM CSRC OFFICE --';

  const consultantLine = `Consultant name : ${principal.name || '—'}, ${principal.designation || '—'}, Department of ${principal.department || '—'}, ${principal.campus || '—'}`;

  const handleDownloadPdf = () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);
    const opt = {
      margin: 0,
      filename: `Proforma_Invoice_${record.id}.pdf`,
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
          <div style={styles.header}>
            <img src={annaLogo} alt="Anna University" style={styles.headerLogo} />
            <p style={styles.headerTitle}>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</p>
            <p style={styles.headerSub}>(Formerly known as Centre for Technology Development and Transfer)</p>
            <p style={styles.headerLine3}>ANNA UNIVERSITY, CHENNAI, TAMIL NADU - 600 025</p>
          </div>

          <h2 style={styles.invoiceTitle}>PROFORMA INVOICE</h2>

          <table style={styles.dtTable}><tbody>
            <DetailRow label="Invoice No." value={invoiceNoDisplay} />
            <DetailRow label="Legal Name of Business" value="REGISTRAR ANNA UNIVERSITY" />
            <DetailRow label="GST No" value="33AAALR0284R1ZK" />
            <DetailRow label="SAC code" value="998394" />
          </tbody></table>

          <p style={styles.toLabel}>To</p>
          <div style={styles.toBlock}>
            {firm.name || '—'}<br />
            {firm.address || '—'}<br />
            GST NO. {firm.gst || 'No GST'}
          </div>

          <table style={styles.expTable}>
            <thead>
              <tr>
                <th style={styles.expTh}>S.No</th>
                <th style={styles.expTh}>Description</th>
                <th style={styles.expThRight}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.expTd}>1</td>
                <td style={styles.expTd}>
                  Work title : &ldquo;{work.title || 'Untitled Consultancy Work'}&rdquo;<br />
                  {consultantLine}<br />
                  Firm Letter no &amp; Date: {firm.letterRef || '—'}
                </td>
                <td style={styles.expTdRight}>{money(totalCharges)}</td>
              </tr>
              <tr>
                <td style={styles.expTd}>2</td>
                <td style={styles.expTd}>GST @ {taxPercent}%</td>
                <td style={styles.expTdRight}>{money(gstAmount)}</td>
              </tr>
              <tr>
                <td style={styles.totalRow} colSpan={2}>Total amount including GST in Rs.</td>
                <td style={styles.totalRowRight}>{money(grandTotal)}</td>
              </tr>
              <tr>
                <td style={styles.wordsRow} colSpan={3}>
                  Rupees {numberToWordsINR(grandTotal)} Only
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={styles.accountTitle}>Account Details</h3>
          <p style={styles.accountLine}>Name of the Payee: Director, CSRC</p>
          <p style={styles.accountLine}>Bank: State Bank of India, Account Number: 37614464781</p>
          <p style={styles.accountLine}>Branch: Anna University, IFSC: SBIN0006463, MICR: 600002039</p>

          <p style={styles.signatureBlock}>CONSULTANT</p>

          <div style={styles.pageFooter}>
            <p style={{ margin: '0 0 4px', fontStyle: 'italic' }}>
              **This is a system generated Proforma Invoice for Consultancy works by CSRC - {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <div style={styles.pageFooter2}>
              <span>**CSRC, Kalanjiyam Building, III Floor, Ph: +91 -44 -2235 7929/7930; e-mail:- directorctdt@gmail.com, directorctdt@annauniv.edu</span>
              <span>Page 1/1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintView;