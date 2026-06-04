import React, { useState, useRef } from 'react';
import './ProjectStaffPage.css';
import html2pdf from "html2pdf.js";

// ── Sample data ──────────────────────────────────────────
const PROJECTS = [
  { id: 'P1', code: '2433/CSRC-2/2020', name: 'Development of Ti(C,N) based cermets' },
  { id: 'P2', code: '721/CSRC-2/2013', name: 'Advanced Materials Research' },
  { id: 'P3', code: '1234/CSRC-2/2025', name: 'Smart Manufacturing Project' },
];

// Faculty/PI data with department info
const FACULTY = [
  {
    id: 'F1', name: 'Dr. S.Balasivanandha Prabu', role: 'Principal Investigator',
    dept: 'DEPARTMENT OF MECHANICAL ENGINEERING',
    inst: 'COLLEGE OF ENGINEERING GUINDY CAMPUS\nANNA UNIVERSITY\nCHENNAI 600 025, INDIA.',
    headTitle: 'Professor and Head',
    headDept: 'Department of Mechanical Engineering\nCollege of Engineering, Guindy Campus,\nAnna University\nChennai – 600 025.',
    projectId: 'P1',
  },
  {
    id: 'F2', name: 'Dr. P.T.V.Bhuvaneswari', role: 'Principal Investigator',
    dept: 'DEPARTMENT OF ELECTRONICS ENGINEERING',
    inst: 'MIT CAMPUS, ANNA UNIVERSITY CHENNAI\nCHROMEPET, CHENNAI - 600 044',
    headTitle: 'Prof. & Head',
    headDept: 'Department of Electronics Engineering\nMIT Campus, Anna University\nChennai – 600 044.',
    projectId: 'P2',
  },
  {
    id: 'F3', name: 'Dr. R.Anand', role: 'Principal Investigator',
    dept: 'DEPARTMENT OF COMPUTER SCIENCE',
    inst: 'ANNA UNIVERSITY\nCHENNAI 600 025, INDIA.',
    headTitle: 'Professor and Head',
    headDept: 'Department of Computer Science\nAnna University\nChennai – 600 025.',
    projectId: 'P3',
  },
];

// Co-PI data
const CO_PI = {
  'P1': { name: 'Dr. K.Kottilingam', role: 'Co-Principal Investigator', dept: 'Assistant Professor\nDepartment of Computer Technology\nMIT Campus, Anna University.' },
  'P2': { name: 'Dr. K.Kottilingam', role: 'Co-Principal Investigator', dept: 'Assistant Professor\nDepartment of Computer Technology\nMIT Campus, Anna University.' },
  'P3': null,
};

const INIT_CONTRACTS = [
  { id: 138, projectId: 'P1', facultyId: 'F1', staffName: 'Mr VENKADANATHAN J', designation: 'Junior Research Fellow', contractFrom: '21-12-2022', contractTo: '30-11-2023', joinDueDate: '21-06-2023', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/SERB PROJECT/BSP/JRF/', proceedingDate: '20-06-2023', tenureFrom: '21-12-2022', tenureTo: '30-11-2023', fixedSalary: 31000, hra: 7440, documents: [
    { id: 1, name: 'Advt.', date: '16-11-2023', file: 'staff_file_616.pdf', status: 'VERIFIED' },
    { id: 2, name: 'Minutes', date: '16-11-2023', file: 'staff_file_617.pdf', status: 'VERIFIED' },
    { id: 3, name: 'Appointment', date: '16-11-2023', file: 'staff_file_618.pdf', status: 'VERIFIED' },
    { id: 4, name: 'Joining', date: '16-11-2023', file: 'staff_file_619.pdf', status: 'VERIFIED' },
    { id: 5, name: 'Passbook', date: '16-11-2023', file: 'staff_file_620.pdf', status: 'VERIFIED' },
  ], extensions: [] },
  { id: 53, projectId: 'P1', facultyId: 'F1', staffName: 'Mr VENKADANATHAN J', designation: 'Junior Research Fellow', contractFrom: '21-12-2022', contractTo: '20-06-2023', joinDueDate: '21-12-2022', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/01', proceedingDate: '21-12-2022', tenureFrom: '21-12-2022', tenureTo: '20-06-2023', fixedSalary: 31000, hra: 7440, documents: [], extensions: [] },
  { id: 32, projectId: 'P1', facultyId: 'F1', staffName: 'Mr VETRI VEL V', designation: 'Junior Research Fellow', contractFrom: '05-07-2022', contractTo: '04-01-2023', joinDueDate: '05-07-2022', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/02', proceedingDate: '05-07-2022', tenureFrom: '05-07-2022', tenureTo: '04-01-2023', fixedSalary: 31000, hra: 7440, documents: [], extensions: [] },
  { id: 31, projectId: 'P2', facultyId: 'F2', staffName: 'Ms PRIYA A', designation: 'Project Assistant', contractFrom: '01-03-2023', contractTo: '28-02-2024', joinDueDate: '01-03-2023', status: 'VERIFIED', extn: 'New', proceedingNo: 'MIT/ELEC/PA/01', proceedingDate: '01-03-2023', tenureFrom: '01-03-2023', tenureTo: '28-02-2024', fixedSalary: 25000, hra: 0, documents: [], extensions: [] },
];

const emptyContract = { staffName: '', appointmentOrderNo: '', appointmentOrderDate: '', contractFrom: '', contractTo: '', joinDueDate: '', fixedSalary: 0, hra: 0, minutesFile: null };
const emptyExtension = { staffName: '', extnOrderNo: '', extnOrderDate: '', extnFrom: '', extnTo: '', rejoinDueDate: '', fixedSalary: 0, hra: 0, appraisalFile: null };

// ── Terms and Conditions ─────────────────────────────────
const TERMS_AND_CONDITIONS = [
  'The appointment is on a purely temporary basis for the period of six months from the date of joining and is liable to be terminated at any time without notice and without assigning any reason.',
  'The appointment shall not confer any right or privilege for a regular appointment in the University.',
  'The appointee is entitled for leave privileges as under:\n(A) All closed holidays of the University.\n(B) 12 days in a calendar year or proportionate days thereof. Leave should not be granted for more than 10 days at a stretch including holidays.\n(C) Un-expired leave shall not be carried forward from one calendar year to the next.\n(D) No encashment of leave is permissible.',
  'The appointee will be posted at any place or any village of the project site, at the discretion of the Head, Department of Mechanical Engineering.',
  'The appointee is entitled for TA/DA on travels undertaken by him/her as per rules.',
  'The nature of work duties shall be such as assigned from time to time by the Head, Department of Mechanical Engineering and authorities of the Anna University.',
  'Any loss caused to the university due to any act of omission or commission on the part of appointee shall be deducted from the monthly-consolidated pay, after notice.',
  'This contract may be renewed at the sole discretion of the Registrar for such period as he may think fit necessary depending upon the continuance of the project for a further period.',
  'On the expiry of the contract of efflux of time, or earlier, determined as aforesaid, the appointee shall handover all materials, records, documents in his/her possession/custody to such person / officer of the University nominated.',
];

// ── Utility: format date ─────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '';
  if (d.includes('-') && d.length === 10 && d[4] === '-') {
    const [y, m, day] = d.split('-');
    return `${parseInt(day)}-${parseInt(m)}-${y}`;
  }
  return d;
};
const fmtDateLong = (d) => {
  if (!d) return '';
  if (d.includes('-') && d.length === 10 && d[4] === '-') {
    const [y, m, day] = d.split('-');
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
  }
  return d;
};
const numToWords = (num) => {
  num = parseInt(num || 0);
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  return convert(num);
};

// ── Anna University Logo ────────────────────────────────
const AULogo = ({ size = 70 }) => (
  <div style={{
    width: size, height: size, borderRadius: '5%',
    border: '2px solid #c8a951', display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', background: '#fff', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  }}>
    <img src={"src/assets/anna-university-logo.png"} alt="Anna University Logo"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  </div>
);

// ── Terms & Conditions Page ──────────────────────────────
const TermsPage = ({ faculty, project }) => (
  <div className="ps-report-sheet" style={{ marginTop: 5 }}>
    <div className="ps-report-header">
      <AULogo size={70} />
      <div className="ps-report-org">
        <div className="ps-report-dept">{faculty?.dept || 'DEPARTMENT OF MECHANICAL ENGINEERING'}</div>
        {(faculty?.inst || '').split('\n').map((line, i) => <div key={i} className="ps-report-inst">{line}</div>)}
      </div>
    </div>
    <div style={{ textAlign: 'center', margin: '16px 0 20px', borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 14, textDecoration: 'underline', fontFamily: 'Times New Roman, serif' }}>ANNEXURE</div>
      <div style={{ fontSize: 13, color: '#000', marginTop: 4 }}>Terms and Conditions of the Contract</div>
      {project && (
        <div style={{ fontSize: 12, color: '#000', marginTop: 4 }}>Project: {project.code} — {project.name}</div>
      )}
    </div>
    <ol style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: 13.5, lineHeight: 1.8, color: '#222', paddingLeft: 22, margin: 0 }}>
      {TERMS_AND_CONDITIONS.map((term, i) => (
        <li key={i} style={{ marginBottom: 12, textAlign: 'justify' }}>
          {term.split('\n').map((line, j) => (
            <span key={j}>{j > 0 && <><br />&nbsp;&nbsp;&nbsp;&nbsp;</>}{line}</span>
          ))}
        </li>
      ))}
    </ol>
    <div className="ps-report-signature-row" style={{ marginTop: 10, pageBreakInside: "avoid" }}>
      <div className="ps-report-sig-right">
        <div className="ps-report-sig-line">&nbsp;</div>
        <div>{faculty?.headTitle || 'Professor and Head'}</div>
        {(faculty?.headDept || '').split('\n').map((line, i) => <div key={i} style={{ fontSize: 12 }}>{line}</div>)}
      </div>
    </div>
  </div>
);

// ── Appointment Report (Print) ───────────────────────────
const AppointmentReport = ({ data, type, projectId, facultyId, onBack }) => {
  const faculty = FACULTY.find(f => f.id === facultyId) || FACULTY.find(f => f.projectId === projectId) || FACULTY[0];
  const project = PROJECTS.find(p => p.id === projectId);
  const isNew = type === 'new';
  const copi = CO_PI[projectId];
  const reportRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) { console.log("Report not found"); return; }
    try {
      await html2pdf().from(element).set({
        filename: "Appointment_Letter.pdf",
        pagebreak: { mode: ['avoid-all'] },
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff", letterRendering: true, windowWidth: element.scrollWidth },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }).save();
    } catch (err) { console.error("PDF Export Error:", err); }
  };

  return (
    <>
      <div className="ps-inner-header no-print">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">{isNew ? 'Appointment Letter Preview' : 'Extension Letter Preview'}</div>
          <div className="ps-inner-sub">Generated Report — Page 1: Letter · Page 2: Terms &amp; Conditions</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="ps-btn-primary orange" onClick={handleDownloadPDF}>Download PDF</button>
          <button className="ps-back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
        </div>
      </div>
      <div ref={reportRef}>
        {/* PAGE 1 — Letter */}
        <div className="ps-report-sheet">
          <div className="ps-report-header">
            <AULogo size={70} />
            <div className="ps-report-org">
              <div className="ps-report-dept">{faculty.dept}</div>
              {faculty.inst.split('\n').map((line, i) => <div key={i} className="ps-report-inst">{line}</div>)}
            </div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "#000", margin: "2px 0" }} />
          <div className="ps-report-from">
            <div className="ps-report-from-name">{faculty.name}</div>
            <div className="ps-report-from-title">{faculty.headTitle}</div>
          </div>
          <div className="ps-report-meta-row">
            <div>
              <span className="ps-report-meta-label">Letter No: </span>
              <span className="ps-report-meta-val">{isNew ? data.appointmentOrderNo : data.extnOrderNo}</span>
            </div>
            <div>
              <span className="ps-report-meta-label">Date: </span>
              <span className="ps-report-meta-val">{fmtDate(isNew ? data.appointmentOrderDate : data.extnOrderDate)}</span>
            </div>
          </div>
          <div style={{ marginBottom: 1 }}>
            <strong>Sub:</strong>{" "}
            {isNew
              ? `Anna University – ${faculty.dept} – Contract appointment of ${data.staffName} under the research project – Order issued.`
              : `MIT – ${faculty.dept} – Extension for the post of ${data.designation} – Issued – Reg.`}
          </div>
          <div style={{ marginBottom: "1px", textAlign: "left", marginLeft: "10px" }}>
            <div style={{ fontWeight: "bold" }}>Ref:</div>
            <div style={{ marginTop: "1px", paddingLeft: "30px", lineHeight: 2 }}>
              <div>1. Ref.No.EEQ/2020/000620 dated 01.12.2020</div>
              {isNew && <div>2. CTDT Proceedings No.2433/CTDT-2/2020 dated 22.08.2022</div>}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "1px" }}>------------------------</div>
          <div className="ps-report-body">
            {isNew ? (
              <>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{data.staffName || "STAFF NAME"}</strong>{" "}is appointed as{" "}
                  <strong>{data.designation || "Junior Research Fellow"}</strong>{" "}in the{" "}
                  <strong>{project?.sponsor || "SERB sponsored"}</strong>{" "}research project entitled{" "}
                  <strong>"{project?.title}"</strong>{" "}in the{" "}
                  <strong>{faculty.dept}</strong>{" "}at a consolidated salary of{" "}
                  <strong>Rs.{parseInt(data.fixedSalary || 0).toLocaleString("en-IN")}/-</strong>
                  {" "}({numToWords(parseInt(data.fixedSalary || 0))}{" "}only)
                  {Number(data.hra) > 0 && (
                    <>{" + "}<strong>{Math.round((Number(data.hra) * 100) / Number(data.fixedSalary || 1))}% HRA</strong></>
                  )}
                  {" "}under the terms and conditions enclosed (Annexure).
                </p>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{data.staffName || "STAFF NAME"}</strong> is directed to join duty on or before <strong>{fmtDateLong(data.joinDueDate)}</strong> by reporting to the Professor and Head, {faculty.dept}.
                </p>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{data.staffName || "STAFF NAME"}</strong> is directed to sign the duplicate copy of the order by accepting the terms and conditions of the contract and forward the same to the Principal Investigator.
                </p>
              </>
            ) : (
              <>
                <p>
                  Based on the performance of <strong>{data.staffName}</strong> as a {data.designation || 'Project Staff'} under the project {project?.code}, is given extension from <strong>{fmtDateLong(data.extnFrom)}</strong> till <strong>{fmtDateLong(data.extnTo)}</strong>.
                </p>
                <p>
                  Your appointment is on contract basis till the end of this extension period under the Terms and Conditions enclosed herewith. You will be paid a consolidated salary of Rs.<strong>{parseInt(data.fixedSalary).toLocaleString('en-IN')}/- (Rupees {numToWords(parseInt(data.fixedSalary))} Only)</strong> per month during this period.
                </p>
                <p>
                  You are requested to report for duty from <strong>{fmtDateLong(data.extnFrom)}</strong> to the Principal Investigator. The re-joining due date is <strong>{fmtDateLong(data.rejoinDueDate)}</strong>. If there is no response within one week from the date of issue of this order, the appointment will be cancelled automatically.
                </p>
                <p>
                  You are requested to sign the copy of this order by accepting the <strong>Terms and Conditions of the contract</strong>, and submit the same at the office of the Principal Investigator.
                </p>
              </>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "1px", gap: "20px" }}>
            {/* LEFT SIDE */}
            <div style={{ flex: 1, textAlign: "left", fontSize: 14, color: "#000", lineHeight: 1.8 }}>
              <div><strong>Encl:</strong> Terms and Conditions</div>
              <div style={{ marginTop: 1 }}>
                <strong>To:</strong><br />{data.staffName}
              </div>
              {copi && (
                <div style={{ marginTop: 10 }}>
                  <div>{copi.name}</div>
                  <div style={{ fontSize: 12, color: "#000" }}>{copi.role}</div>
                  {copi.dept.split("\n").map((line, i) => <div key={i} style={{ fontSize: 12, color: "#000" }}>{line}</div>)}
                </div>
              )}
              {(data.copyTo?.length > 0 || project || faculty) && (
                <div style={{ marginTop: 12 }}>
                  <strong>Copy To:</strong>
                  {data.copyTo?.length > 0 ? (
                    data.copyTo.map((item, index) => <div key={index}>{index + 1}. {item}</div>)
                  ) : (
                    <>
                      <div>1. The Head, {faculty.dept}</div>
                      <div>2. Principal Investigator, {project?.code}</div>
                      <div>3. Project File</div>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* RIGHT SIDE */}
            <div style={{ width: "320px", textAlign: "right", flexShrink: 0 }}>
              <div><strong>{faculty.name}</strong></div>
              <div>{faculty.role}</div>
              <div>{faculty.headTitle}</div>
              {faculty.headDept.split("\n").map((line, i) => <div key={i} style={{ fontSize: 12 }}>{line}</div>)}
            </div>
          </div>
        </div>
        {/* PAGE 2 — Terms & Conditions */}
        <TermsPage faculty={faculty} project={project} />
      </div>
    </>
  );
};

// ── Document Viewer ──────────────────────────────────────
const DocumentViewer = ({ contract, onBack }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">Project Staff Appointment Related Documents</div>
        <div className="ps-inner-sub">{contract.staffName} — Contract #{contract.id}</div>
      </div>
      <button className="ps-back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
    </div>
    <div className="ps-form-panel">
      {contract.documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
          No documents uploaded for this contract.
        </div>
      ) : (
        <table className="ps-doc-table">
          <thead>
            <tr><th>Sl. No.</th><th>Document</th><th>Date</th><th>Files</th><th>Status</th><th>File Input</th></tr>
          </thead>
          <tbody>
            {contract.documents.map((doc, i) => (
              <tr key={doc.id}>
                <td style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', width: 60 }}>{i + 1}</td>
                <td style={{ fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{doc.name}</td>
                <td style={{ color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>{doc.date}</td>
                <td><a href="#" className="ps-file-link">{doc.file}</a></td>
                <td><span className="ps-badge verified"><span className="ps-badge-dot"/>{doc.status}</span></td>
                <td>
                  <input type="file" style={{ display: 'none' }} id={`file-${doc.id}`} />
                  <label htmlFor={`file-${doc.id}`} className="ps-icon-btn doc" style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
);

// ── Tenure Edit ──────────────────────────────────────────
const TenureEdit = ({ contract, onSave, onBack }) => {
  const [form, setForm] = useState({
    staffName: contract.staffName,
    proceedingNo: contract.proceedingNo || '',
    proceedingDate: contract.proceedingDate || '',
    joinDueDate: contract.joinDueDate || '',
    tenureFrom: contract.tenureFrom || '',
    tenureTo: contract.tenureTo || '',
    fixedSalary: contract.fixedSalary || 0,
    hra: contract.hra || 0,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Tenure editing...</div>
          <div className="ps-inner-sub">Master / Staff Tenure</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff details editing....</div>
        {contract.status === 'VERIFIED' && (
          <div style={{ marginBottom: 16 }}>
            <span className="ps-info-tag success" style={{ fontSize: 16, fontWeight: 700, padding: '8px 18px', borderRadius: 10 }}>✓ VERIFIED</span>
          </div>
        )}
        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 1fr 160px 160px' }}>
          <div className="ps-field">
            <label>Proceeding No<span className="req">*</span></label>
            <input className="ps-input" value={form.proceedingNo} onChange={e => upd('proceedingNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Proceeding Date</label>
            <input className="ps-input" type="date" value={form.proceedingDate} onChange={e => upd('proceedingDate', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Joining Due Date</label>
            <input className="ps-input" type="date" value={form.joinDueDate} onChange={e => upd('joinDueDate', e.target.value)} />
          </div>
        </div>
        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px 160px' }}>
          <div className="ps-field"><label>Tenure From</label><input className="ps-input" type="date" value={form.tenureFrom} onChange={e => upd('tenureFrom', e.target.value)} /></div>
          <div className="ps-field"><label>Tenure Upto</label><input className="ps-input" type="date" value={form.tenureTo} onChange={e => upd('tenureTo', e.target.value)} /></div>
          <div className="ps-field"><label>Fixed Salary<span className="req">*</span></label><input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} /></div>
          <div className="ps-field"><label>HRA<span className="req">*</span></label><input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} /></div>
        </div>
        <div className="ps-form-actions">
          <button className="ps-btn-primary orange" onClick={() => onSave(form)}>Update</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── Extension Form ───────────────────────────────────────
// CHANGED: removed STAFF_NAMES_FOR_PROJECT + staffName dropdown; staffName is auto-populated from contract prop
const ExtensionForm = ({ contract, projectId, facultyId, onSave, onBack }) => {
  const [form, setForm] = useState({ ...emptyExtension, staffName: contract?.staffName || '', designation: contract?.designation || '' });
  const [appraisalFileName, setAppraisalFileName] = useState('');
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAppraisalUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setAppraisalFileName(file.name); upd('appraisalFile', file); }
  };

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Extension</div>
          <div className="ps-inner-sub">Master / Staff Tenure Extension</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff tenure extension details adding....</div>

        {/* CHANGED: 2-col grid, no staff name field */}
        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 180px' }}>
          <div className="ps-field">
            <label>Extn Order No<span className="req">*</span></label>
            <input className="ps-input" placeholder="Extension Order No" value={form.extnOrderNo} onChange={e => upd('extnOrderNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Extn Order Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnOrderDate} onChange={e => upd('extnOrderDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Extn Period From<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnFrom} onChange={e => upd('extnFrom', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Extn Upto<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnTo} onChange={e => upd('extnTo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Re-Joining Due Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.rejoinDueDate} onChange={e => upd('rejoinDueDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 1fr' }}>
          <div className="ps-field">
            <label>Fixed Salary<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>HRA<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} />
          </div>
          {/* CHANGED: file input moved outside flex div so label sits cleanly above upload button */}
          <div
  className="ps-field"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "30px"
  }}
>
  <label
    style={{
      minWidth: "180px",
      marginBottom: 0
    }}
  >
    Performance Appraisal
  </label>

  <input
    type="file"
    id="appraisal-upload"
    style={{ display: "none" }}
    onChange={handleAppraisalUpload}
    accept=".pdf,.doc,.docx,.jpg,.png"
  />

  <label htmlFor="appraisal-upload" className="ps-upload-label">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: 14, height: 14 }}
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
    Upload Appraisal
  </label>

  {appraisalFileName && (
    <span
      style={{
        fontSize: 12,
        color: "#34d399",
      }}
    >
      ✓ {appraisalFileName}
    </span>
  )}
</div>
        </div>

        <div className="ps-form-actions">
          <button className="ps-btn-primary orange" onClick={() => onSave(form)}>Generate Extension Letter</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── New Contract Form ─────────────────────────────────────
// CHANGED: removed staffName input field; staffName is auto-populated from prop
const NewContractForm = ({ projectId, facultyId, staffName, designation, onSave, onBack }) => {
  const [form, setForm] = useState({ ...emptyContract, staffName: staffName || '' });
  const [minutesFileName, setMinutesFileName] = useState('');
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const project = PROJECTS.find(p => p.id === projectId);
  const faculty = FACULTY.find(f => f.id === facultyId) || FACULTY.find(f => f.projectId === projectId);

  const handleMinutesUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setMinutesFileName(file.name); upd('minutesFile', file); }
  };

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">New Appointment</div>
          <div className="ps-inner-sub">{project ? `${project.code} — ${project.name}` : 'Master / Staff Tenure'}</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        {faculty && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', background: 'rgba(0,180,255,0.06)', borderRadius: 10, border: '1px solid rgba(0,180,255,0.15)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,180,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#00b4ff" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{faculty.name}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{faculty.dept}</div>
            </div>
          </div>
        )}
        <div className="ps-form-section-label">Staff tenure details adding....</div>

        {/* CHANGED: 2-col grid, no staff name field */}
        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 180px' }}>
          <div className="ps-field">
            <label>Appointment Order No<span className="req">*</span></label>
            <input className="ps-input" placeholder="Letter / Proceeding No" value={form.appointmentOrderNo} onChange={e => upd('appointmentOrderNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Appointment Order Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.appointmentOrderDate} onChange={e => upd('appointmentOrderDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Contract Period From<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.contractFrom} onChange={e => upd('contractFrom', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Contract Period Upto<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.contractTo} onChange={e => upd('contractTo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Joining Due Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.joinDueDate} onChange={e => upd('joinDueDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 1fr' }}>
          <div className="ps-field">
            <label>Fixed Salary<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>HRA<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} />
          </div>
          {/* CHANGED: file input moved outside flex div so label sits cleanly above upload button */}
          <div
  className="ps-field"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "30px"
  }}
>
  <label
    style={{
      minWidth: "220px",
      marginBottom: 0
    }}
  >
    MINUTES OF THE MEETING
  </label>

  <input
    type="file"
    id="minutes-upload"
    style={{ display: "none" }}
    onChange={handleMinutesUpload}
    accept=".pdf,.doc,.docx,.jpg,.png"
  />

  <label htmlFor="minutes-upload" className="ps-upload-label">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: 14, height: 14 }}
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
    Upload Minutes
  </label>

  {minutesFileName && (
    <span
      style={{
        fontSize: 12,
        color: "#34d399",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "200px"
      }}
    >
      ✓ {minutesFileName}
    </span>
  )}
</div>
        </div>

        <div className="ps-form-actions">
          <button className="ps-btn-primary orange" onClick={() => onSave({ ...form, facultyId })}>Generate Appointment Letter</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── Faculty Staff Row per Project ────────────────────────
const FacultyStaffTable = ({ contracts, projectId, onAddAppointment, onDocs, onAction, onExtn }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const projectFaculty = FACULTY.filter(f => f.projectId === projectId);
  const project = PROJECTS.find(p => p.id === projectId);
  const projectContracts = contracts.filter(c => c.projectId === projectId && c.staffName.toLowerCase().includes(search.toLowerCase()));
  const paginated = projectContracts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const total = projectContracts.length;

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Contract Details</div>
          <div className="ps-inner-sub">{project ? `${project.code} — ${project.name}` : ''}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input className="ps-input" style={{ paddingLeft: 32, width: 200 }} placeholder="Search staff name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Faculty Cards */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '1.1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          Faculty / Principal Investigators
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projectFaculty.map(faculty => (
            <div key={faculty.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '14px 20px', flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{faculty.name}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{faculty.role} · {faculty.dept.replace('DEPARTMENT OF ', '')}</div>
                </div>
              </div>
              <button
                className="ps-btn-primary orange"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', fontSize: 13 }}
                onClick={() => onAddAppointment(faculty)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contracts table */}
      <div className="ps-table-card">
        {total === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
            No appointment orders for this project yet.
          </div>
        ) : (
          <div className="ps-table-wrap">
            <table className="ps-table">
              <thead>
                <tr>
                  <th className="ps-sl-num">Sl. No.</th>
                  <th>Staff Name</th>
                  <th>Designation</th>
                  <th>Contract From</th>
                  <th>Contract To</th>
                  <th>Joining Due Date</th>
                  <th>Documents</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>Extn</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c, i) => (
                  <tr key={c.id}>
                    <td className="ps-sl-num">{(page - 1) * PER_PAGE + i + 1}</td>
                    <td className="ps-name-cell">{c.staffName} ({c.id})</td>
                    <td>{c.designation}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractFrom}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractTo}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.joinDueDate}</td>
                    <td>
                      <button className="ps-icon-btn doc" title="View Documents" onClick={() => onDocs(c)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </button>
                    </td>
                    <td>
                      <button className="ps-icon-btn view" title="View / Edit Tenure" onClick={() => onAction(c)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                    <td>
                      <span className={`ps-badge ${c.status === 'VERIFIED' ? 'verified' : 'pending'}`}>
                        <span className="ps-badge-dot"/>{c.status}
                      </span>
                    </td>
                    <td>
                      <button className="ps-icon-btn ext" title="Add Extension" onClick={() => onExtn(c)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && (
          <div className="ps-pagination">
            <span className="ps-page-info">{page} of {Math.max(1, Math.ceil(total / PER_PAGE))} pages — {total} records</span>
            <div className="ps-page-btns">
              <button className="ps-page-btn" onClick={() => setPage(1)} disabled={page === 1}>First</button>
              <button className="ps-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <button className="ps-page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / PER_PAGE)}>Next</button>
              <button className="ps-page-btn" onClick={() => setPage(Math.ceil(total / PER_PAGE))} disabled={page >= Math.ceil(total / PER_PAGE)}>Last</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ── Entry Cards (New Appointment / Extension) ────────────
const EntryCards = ({ onNew, onExtension }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">Appointment Orders</div>
        <div className="ps-inner-sub">Master / Staff Appointment Orders</div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 700 }}>
      <div className="ps-sub-card" style={{ '--sc': '#fb923c', '--sg': 'rgba(251,146,60,0.15)' }} onClick={onNew}>
        <div className="ps-card-top">
          <div className="ps-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg></div>
          <div className="ps-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></div>
        </div>
        <div className="ps-card-body">
          <div className="ps-card-title">New Appointment</div>
          <div className="ps-card-desc">Issue a fresh contract appointment letter for a new project staff member. Generates an official appointment order.</div>
        </div>
        <div className="ps-card-glow-bar"/>
      </div>
      <div className="ps-sub-card" style={{ '--sc': '#a78bfa', '--sg': 'rgba(167,139,250,0.15)' }} onClick={onExtension}>
        <div className="ps-card-top">
          <div className="ps-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg></div>
          <div className="ps-card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></div>
        </div>
        <div className="ps-card-body">
          <div className="ps-card-title">Appointment Extension</div>
          <div className="ps-card-desc">Extend an existing staff member's contract period. Browse by project and generate an official extension letter.</div>
        </div>
        <div className="ps-card-glow-bar"/>
      </div>
    </div>
  </>
);

// ── New Appointment Flow (project select → faculty list → form) ──
const NewAppointmentFlow = ({ onSaveWithProject, onBack }) => {
  const [step, setStep] = useState('project');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  if (step === 'form' && selectedFaculty) {
    return (
      <NewContractForm
        projectId={selectedProject}
        facultyId={selectedFaculty.id}
        staffName=""
        onSave={(form) => onSaveWithProject(form, selectedProject, selectedFaculty.id)}
        onBack={() => setStep('faculty')}
      />
    );
  }

  if (step === 'faculty') {
    const projectFaculty = FACULTY.filter(f => f.projectId === selectedProject);
    const project = PROJECTS.find(p => p.id === selectedProject);
    return (
      <>
        <div className="ps-inner-header">
          <div className="ps-inner-title-wrap">
            <div className="ps-inner-title">Select Faculty</div>
            <div className="ps-inner-sub">{project ? `${project.code} — ${project.name}` : ''}</div>
          </div>
          <button className="ps-back-btn" onClick={() => setStep('project')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700 }}>
          {projectFaculty.map(faculty => (
            <div key={faculty.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '18px 22px', flexWrap: 'wrap', gap: 12, transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" style={{ width: 20, height: 20 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{faculty.name}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{faculty.role}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{faculty.dept}</div>
                </div>
              </div>
              <button
                className="ps-btn-primary orange"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13 }}
                onClick={() => { setSelectedFaculty(faculty); setStep('form'); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Appointment
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">New Appointment</div>
          <div className="ps-inner-sub">Select project first</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel" style={{ maxWidth: 560 }}>
        <div className="ps-form-section-label">Choose Project</div>
        <div className="ps-field" style={{ marginBottom: 24 }}>
          <label>Project<span className="req">*</span></label>
          <select className="ps-select" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select a Project --</option>
            {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
          </select>
        </div>
        <div className="ps-form-actions" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0, justifyContent: 'flex-start' }}>
          <button className="ps-btn-primary orange" disabled={!selectedProject} onClick={() => setStep('faculty')}>
            View Faculty →
          </button>
        </div>
      </div>
    </>
  );
};

// ── Extension Project View ───────────────────────────────
const ExtensionProjectView = ({ contracts, onExtn, onBack }) => {
  const [selectedProject, setSelectedProject] = useState('');
  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Appointment Extension</div>
          <div className="ps-inner-sub">Select a project to view staff</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>
      <div className="ps-project-selector-bar" style={{ marginBottom: 24 }}>
        <div className="ps-project-selector-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}><path d="M3 7a2 2 0 012-2h4l2 3H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>
          <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>Select Project</label>
          <select className="ps-select" style={{ flex: 1, maxWidth: 420 }} value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Choose a Project --</option>
            {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
          </select>
        </div>
      </div>
      {selectedProject ? (
        <div className="ps-table-card">
          {contracts.filter(c => c.projectId === selectedProject).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans, sans-serif' }}>No contracts found for this project.</div>
          ) : (
            <div className="ps-table-wrap">
              <table className="ps-table">
                <thead>
                  <tr>
                    <th className="ps-sl-num">Sl.</th>
                    <th>Staff Name</th>
                    <th>Designation</th>
                    <th>Contract From</th>
                    <th>Contract To</th>
                    <th>Status</th>
                    <th>Extension</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.filter(c => c.projectId === selectedProject).map((c, i) => (
                    <tr key={c.id}>
                      <td className="ps-sl-num">{i + 1}</td>
                      <td className="ps-name-cell">{c.staffName}</td>
                      <td>{c.designation}</td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractFrom}</td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractTo}</td>
                      <td><span className={`ps-badge ${c.status === 'VERIFIED' ? 'verified' : 'pending'}`}><span className="ps-badge-dot"/>{c.status}</span></td>
                      <td>
                        <button className="ps-icon-btn ext" title="Add Extension" onClick={() => onExtn(c, selectedProject)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="ps-table-card" style={{ padding: '48px 20px', textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Please select a project to view staff contracts.</div>
        </div>
      )}
    </>
  );
};

// ── Main AppointmentOrders Component ─────────────────────
const AppointmentOrders = ({ onBack }) => {
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [view, setView] = useState('entry');
  const [target, setTarget] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('new');
  const [reportProjectId, setReportProjectId] = useState('');
  const [reportFacultyId, setReportFacultyId] = useState('');
  const [listProjectId, setListProjectId] = useState('');

  return (
    <div className="ps-inner">
      <div style={{ marginBottom: 20 }}>
        <button className="ps-back-btn" onClick={view === 'entry' ? onBack : () => setView('entry')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          {view === 'entry' ? 'Project Staff' : 'Appointment Orders'}
        </button>
      </div>

      {view === 'entry' && (
        <EntryCards onNew={() => setView('new-flow')} onExtension={() => setView('extn-flow')} />
      )}

      {view === 'new-flow' && (
        <NewAppointmentFlow
          onBack={() => setView('entry')}
          onSaveWithProject={(form, pid, fid) => {
            const newC = {
              ...form, id: Date.now(), projectId: pid, facultyId: fid,
              designation: 'Junior Research Fellow',
              status: 'VERIFIED', extn: 'New', documents: [], extensions: [],
              proceedingNo: form.appointmentOrderNo, proceedingDate: form.appointmentOrderDate,
              tenureFrom: form.contractFrom, tenureTo: form.contractTo,
            };
            setContracts(prev => [newC, ...prev]);
            setReportData({ ...newC, staffName: newC.staffName });
            setReportType('new');
            setReportProjectId(pid);
            setReportFacultyId(fid);
            setView('report');
          }}
        />
      )}

      {view === 'extn-flow' && (
        <ExtensionProjectView
          contracts={contracts}
          onBack={() => setView('entry')}
          onExtn={(c, pid) => { setTarget(c); setListProjectId(pid || c.projectId); setView('extn-form'); }}
        />
      )}

      {view === 'extn-form' && target && (
        <ExtensionForm
          contract={target}
          projectId={target.projectId || listProjectId}
          facultyId={target.facultyId}
          onSave={(form) => {
            setContracts(prev => prev.map(c => c.id === target.id ? { ...c, extensions: [...(c.extensions || []), form] } : c));
            setReportData({ ...form, designation: target?.designation });
            setReportType('extn');
            setReportProjectId(target?.projectId || listProjectId);
            setReportFacultyId(target?.facultyId || '');
            setView('report');
          }}
          onBack={() => setView('extn-flow')}
        />
      )}

      {view === 'report' && reportData && (
        <AppointmentReport
          data={reportData}
          type={reportType}
          projectId={reportProjectId}
          facultyId={reportFacultyId}
          onBack={() => setView('entry')}
        />
      )}

      {view === 'list' && (
        <FacultyStaffTable
          contracts={contracts}
          projectId={listProjectId}
          onAddAppointment={(faculty) => { setReportFacultyId(faculty.id); setView('new-flow'); }}
          onDocs={c => { setTarget(c); setView('docs'); }}
          onAction={c => { setTarget(c); setView('action'); }}
          onExtn={c => { setTarget(c); setView('extn-form'); }}
        />
      )}
      {view === 'docs' && target && (
        <DocumentViewer contract={target} onBack={() => setView('list')} />
      )}
      {view === 'action' && target && (
        <TenureEdit
          contract={target}
          onSave={(form) => {
            setContracts(prev => prev.map(c => c.id === target.id ? { ...c, ...form } : c));
            setView('list');
          }}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
};

export default AppointmentOrders;  