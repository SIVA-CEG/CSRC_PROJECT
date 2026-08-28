import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import BackButton from './BackButton';
import annaLogo from "../../../assets/anna-university-logo.png";

/* ---------------------------------------------------------------------- */
/*  Print-styled replica of the official CSRC "Consultancy Acceptance     */
/*  Form" — monochrome, serif, letterhead layout, paginated to exactly    */
/*  match the physical 3-page form. Exportable as a true A4 PDF via       */
/*  html2pdf.js, and printable directly from the browser.                 */
/* ---------------------------------------------------------------------- */

const styles = {
  screenWrap: { minHeight: '100%', padding: '0 4px', background: '#eceff3' },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    maxWidth: 900, margin: '0 auto 18px', paddingTop: 18,
  },
  toolbarRight: { display: 'flex', gap: 10 },
  backBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
    border: '1px solid rgba(30,41,59,0.15)', background: 'transparent', color: '#334155',
  },
  printBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '9px 22px', borderRadius: 10, cursor: 'pointer', border: 'none',
    background: '#fff', color: '#334155', border1: 'none',
    border: '1px solid rgba(30,41,59,0.15)',
  },
  downloadBtn: {
    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 700,
    padding: '9px 22px', borderRadius: 10, cursor: 'pointer', border: 'none',
    background: 'linear-gradient(90deg, #7c1f3f 0%, #b91c4c 100%)', color: '#fff',
    boxShadow: '0 8px 18px -6px #7c1f3f88',
  },
  downloadBtnDisabled: { opacity: 0.65, cursor: 'wait' },

  pagesWrap: { maxWidth: 900, margin: '0 auto 40px', display: 'flex', flexDirection: 'column', gap: 24 },

  /* ---- A4 page shell (also the unit html2pdf paginates on) ---- */
  page: {
    position: 'relative', width: '210mm', minHeight: '297mm', margin: '0 auto',
    background: '#fff', padding: '14mm 16mm 12mm', boxSizing: 'border-box',
    fontFamily: 'Georgia, "Times New Roman", serif', color: '#111',
    boxShadow: '0 6px 24px rgba(15,23,42,0.10)', border: '1px solid #d4d4d8',
    overflow: 'hidden', breakAfter: 'page', pageBreakAfter: 'always',
  },
  watermark: {
    position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%) rotate(-28deg)',
    fontSize: 130, fontWeight: 800, color: 'rgba(120,120,120,0.08)', letterSpacing: 4,
    pointerEvents: 'none', userSelect: 'none', fontFamily: 'Arial, sans-serif', zIndex: 0,
  },
  pageContent: { position: 'relative', zIndex: 1 },

  /* ---- repeated header block ---- */
  letterheadRow: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    borderBottom: '2px solid #7c1f3f', paddingBottom: 10, marginBottom: 18,
  },
  letterheadLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  logo: { width: 58, height: 58, objectFit: 'contain', flexShrink: 0 },
  letterheadTitle: { fontSize: 15, fontWeight: 700, color: '#7c1f3f', margin: 0, letterSpacing: 0.3 },
  letterheadSub: { fontSize: 12.5, fontStyle: 'italic', color: '#333', margin: '2px 0 3px' },
  formRefLine: { fontSize: 11.5, color: '#222', margin: 0, fontWeight: 700 },
  dateBox: { fontSize: 11.5, color: '#222', whiteSpace: 'nowrap', paddingTop: 2 },

  workTitle: {
    textAlign: 'center', fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
    margin: '0 0 20px', lineHeight: 1.4,
  },

  sectionTitle: {
    fontSize: 12, fontWeight: 700, textTransform: 'uppercase', textDecoration: 'underline',
    margin: '18px 0 8px', color: '#111',
  },
  dtTable: { width: '100%', borderCollapse: 'collapse', marginBottom: 4, fontSize: 12 },
  dtLabel: { padding: '2.5px 0', width: '38%', verticalAlign: 'top', color: '#222' },
  dtColon: { padding: '2.5px 6px', width: 12, verticalAlign: 'top', color: '#222' },
  dtValue: { padding: '2.5px 0', verticalAlign: 'top', color: '#000', fontWeight: 500 },

  expTable: { width: '100%', borderCollapse: 'collapse', margin: '6px 0 14px', fontSize: 12 },
  expTh: { border: '1px solid #333', padding: '5px 8px', textAlign: 'left', fontWeight: 700, background: '#f4f4f5' },
  expThRight: { border: '1px solid #333', padding: '5px 8px', textAlign: 'right', fontWeight: 700, background: '#f4f4f5' },
  expTd: { border: '1px solid #333', padding: '5px 8px' },
  expTdRight: { border: '1px solid #333', padding: '5px 8px', textAlign: 'right' },
  expTotalTd: { border: '1px solid #333', padding: '5px 8px', fontWeight: 700 },
  expTotalTdRight: { border: '1px solid #333', padding: '5px 8px', fontWeight: 700, textAlign: 'right' },

  abstractText: { fontSize: 12, lineHeight: 1.65, textAlign: 'justify', margin: '4px 0 10px' },

  undertaking: { fontSize: 11.5, lineHeight: 1.6, textAlign: 'justify', margin: '18px 0 34px' },
  signatureBlock: { textAlign: 'right', fontSize: 12, fontWeight: 700, marginBottom: 6 },

  pageFooter: { textAlign: 'center', fontSize: 10.5, color: '#666', position: 'absolute', bottom: '10mm', left: 0, right: 0 },

  recommendBox: { border: '1.5px solid #333', padding: '16px 18px', marginTop: 6 },
  recommendTitle: { fontSize: 12.5, fontWeight: 700, textDecoration: 'underline', textAlign: 'center', marginBottom: 22 },
  recommendRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 },
  recommendLine: { borderTop: '1px solid #333', paddingTop: 4, minWidth: 220, textAlign: 'center' },
  recommendNote: { fontSize: 11, fontStyle: 'italic', margin: '18px 0 10px' },
  remarksArea: { borderTop: '1px solid #999', minHeight: 60, fontSize: 12, paddingTop: 8, whiteSpace: 'pre-wrap' },
};

const DetailRow = ({ label, value }) => (
  <tr>
    <td style={styles.dtLabel}>{label}</td>
    <td style={styles.dtColon}>:</td>
    <td style={styles.dtValue}>{value || '—'}</td>
  </tr>
);

const Section = ({ title, children }) => (
  <div>
    <div style={styles.sectionTitle}>{title}</div>
    {children}
  </div>
);

const money = (n) => (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

/* Repeated on every page */
const PageHeader = ({ record }) => (
  <div style={styles.letterheadRow}>
    <div style={styles.letterheadLeft}>
      <img src={annaLogo} alt="Anna University" style={styles.logo} />
      <div>
        <p style={styles.letterheadTitle}>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</p>
        <p style={styles.letterheadSub}>Anna University</p>
        <p style={styles.formRefLine}>CONSULTANCY ACCEPTANCE FORM - {record.id}</p>
      </div>
    </div>
    <div style={styles.dateBox}>Date: {record.submittedOn || '—'}</div>
  </div>
);

/**
 * record shape (produced from the acceptance-form wizard payload + list metadata):
 * {
 *   id, status, remarks,
 *   principal: { name, designation, department, campus, contactNo, email },
 *   firm: { name, pan, gst, letterRef, contactName, contactNo, address },
 *   work: { title, abstract, startDate, endDate, totalHours, hasEquipment, equipmentName, workType, installmentType, installmentCount },
 *   expenditure: { manpower, travel, equipment, contingency, consumables, consultantRemuneration,
 *                  deptStaffRemuneration, externalConsultant, subcontracting, hiringServices,
 *                  otherCostDetails, otherCost },
 *   approx: { totalCharges, taxPercent },
 * }
 */
const AcceptanceFormPrintView = ({ record, onBack }) => {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const { principal = {}, firm = {}, work = {}, expenditure = {}, approx = {} } = record.details || {};

  const mainExpRows = [
    ['Manpower', expenditure.manpower],
    ['Travel', expenditure.travel],
    ['Equipment', expenditure.equipment],
    ['Contingency', expenditure.contingency],
    ['Consumables', expenditure.consumables],
    ['Consultant & Co-Consultant Remuneration', expenditure.consultantRemuneration],
    ['Dept. / Centre Staff Remuneration', expenditure.deptStaffRemuneration],
    ['External Consultant', expenditure.externalConsultant],
    ['Sub-Contract of the part of the work', expenditure.subcontracting],
    ['Hiring Services', expenditure.hiringServices],
  ];

  const otherRow = expenditure.otherCost
    ? [`Other Cost${expenditure.otherCostDetails ? ` (${expenditure.otherCostDetails})` : ''}`, expenditure.otherCost]
    : null;

  const allExpRows = otherRow ? [...mainExpRows, otherRow] : mainExpRows;
  const totalExpenditure = allExpRows.reduce((sum, [, v]) => sum + (Number(v) || 0), 0);

  const approxTotal = Number(approx.totalCharges) || 0;
  const approxTax = Number(approx.taxPercent) || 0;
  const approxGst = (approxTotal * approxTax) / 100;
  const approxOverhead = approxTotal * 0.3;

  const permissionTypeLabel = work.workType === 'proforma' ? 'Proforma Invoice'
    : work.workType === 'permission' ? 'Permission' : '—';

  const installmentLabel = work.installmentType === 'with'
    ? `Installment / Multiple${work.installmentCount ? ` / ${work.installmentCount}` : ''}`
    : 'Single';

  const durationLabel = work.startDate && work.endDate ? `${work.startDate} to ${work.endDate}` : '—';

  const handleDownloadPdf = () => {
    if (!printRef.current || downloading) return;
    setDownloading(true);
    const opt = {
      margin: 0,
      filename: `Consultancy_Acceptance_Form_${record.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
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
          .acceptance-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div ref={printRef} style={styles.pagesWrap}>

        {/* ---------------- PAGE 1 ---------------- */}
        <div className="acceptance-page" style={styles.page}>
          <div style={styles.watermark}>CSRC</div>
          <div style={styles.pageContent}>
            <PageHeader record={record} />

            <h2 style={styles.workTitle}>&ldquo;{work.title || 'Untitled Consultancy Work'}&rdquo;</h2>

            <Section title="Principal Consultant Details">
              <table style={styles.dtTable}><tbody>
                <DetailRow label="Principal Consultant Name" value={principal.name} />
                <DetailRow label="Designation" value={principal.designation} />
                <DetailRow label="Department" value={principal.department} />
                <DetailRow label="Campus" value={principal.campus} />
                <DetailRow label="Contact No" value={principal.contactNo} />
                <DetailRow label="Email ID" value={principal.email} />
              </tbody></table>
            </Section>

            <Section title="Firm Details">
              <table style={styles.dtTable}><tbody>
                <DetailRow label="Name" value={firm.name} />
                <DetailRow label="Pan no" value={firm.pan} />
                <DetailRow label="GST No" value={firm.gst} />
                <DetailRow label="Firm Letter Reference No" value={firm.letterRef} />
                <DetailRow label="Contact Person Name" value={firm.contactName} />
                <DetailRow label="Contact No" value={firm.contactNo} />
                <DetailRow label="Address" value={firm.address} />
              </tbody></table>
            </Section>

            <Section title="Consultancy Work Details">
              <table style={styles.dtTable}><tbody>
                <DetailRow label="Duration of the work" value={durationLabel} />
                <DetailRow label="Permission Type" value={permissionTypeLabel} />
                <DetailRow label="Total No. of hours likely to be spent" value={work.totalHours} />
                <DetailRow label="Is there any purchase of machineries involved (Y/N)" value={work.hasEquipment === 'yes' ? `Yes (${work.equipmentName || 'unspecified'})` : 'No'} />
                <DetailRow label="Payment Terms / Installment No" value={installmentLabel} />
              </tbody></table>
            </Section>

            <Section title="Estimated Expenditure Details">
              <table style={styles.expTable}>
                <thead>
                  <tr>
                    <th style={styles.expTh}>S.No</th>
                    <th style={styles.expTh}>Particulars</th>
                    <th style={styles.expThRight}>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {mainExpRows.map(([label, val], i) => (
                    <tr key={label}>
                      <td style={styles.expTd}>{i + 1}</td>
                      <td style={styles.expTd}>{label}</td>
                      <td style={styles.expTdRight}>{money(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          </div>
          <div style={styles.pageFooter}>Page 1 of 3</div>
        </div>

        {/* ---------------- PAGE 2 ---------------- */}
        <div className="acceptance-page" style={styles.page}>
          <div style={styles.watermark}>CSRC</div>
          <div style={styles.pageContent}>
            <PageHeader record={record} />

            <table style={styles.expTable}>
              <tbody>
                {otherRow && (
                  <tr>
                    <td style={styles.expTd}>{mainExpRows.length + 1}</td>
                    <td style={styles.expTd}>{otherRow[0]}</td>
                    <td style={styles.expTdRight}>{money(otherRow[1])}</td>
                  </tr>
                )}
                <tr>
                  <td style={styles.expTotalTd} colSpan={2}>Total Estimated Expenditure</td>
                  <td style={styles.expTotalTdRight}>{money(totalExpenditure)}</td>
                </tr>
              </tbody>
            </table>

            <Section title="Approximate Consultancy Expenditure Details">
              <table style={styles.dtTable}><tbody>
                <DetailRow label="Total Approximate Consultancy Charges" value={money(approxTotal)} />
                <DetailRow label={`GST (${approxTax}%)`} value={money(approxGst)} />
                <DetailRow label="Overhead (30%)" value={money(approxOverhead)} />
              </tbody></table>
            </Section>

            <Section title="Abstract of the Work (Minimum 250 words)">
              <p style={styles.abstractText}>{work.abstract || '—'}</p>
            </Section>

            <p style={styles.undertaking}>
              This is to certify that I/We have adequate competence / knowledge / facilities in the proposed area of
              Consultancy works. I/We are the sole responsible for the successful execution of the work and for any
              Legal / Financial / Social / any other implications if any arises during the execution of the work or in
              the future related to the completed work.
            </p>

            <p style={styles.signatureBlock}>Signature of the Principal Consultant<br />with Date &amp; seal</p>
          </div>
          <div style={styles.pageFooter}>Page 2 of 3</div>
        </div>

        {/* ---------------- PAGE 3 ---------------- */}
        <div className="acceptance-page" style={{ ...styles.page, pageBreakAfter: 'auto', breakAfter: 'auto' }}>
          <div style={styles.watermark}>CSRC</div>
          <div style={styles.pageContent}>
            <PageHeader record={record} />

            <div style={styles.recommendBox}>
              <div style={styles.recommendTitle}>Recommended / Not Recommended</div>
              <div style={styles.recommendRow}>
                <span style={styles.recommendLine}>Date &amp; Seal</span>
                <span style={styles.recommendLine}>Signature of the HOD / DIRECTOR / DEAN</span>
              </div>
              <p style={styles.recommendNote}>*If not recommended, Please state the reason below</p>
              <div style={styles.remarksArea}>Remarks{'\n'}{record.status === 'rejected' ? (record.remarks || '') : ''}</div>
            </div>
          </div>
          <div style={styles.pageFooter}>Page 3 of 3</div>
        </div>

      </div>
    </div>
  );
};

export default AcceptanceFormPrintView;