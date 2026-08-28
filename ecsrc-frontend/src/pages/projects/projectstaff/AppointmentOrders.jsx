import React, { useState, useRef, useEffect } from "react";
import "./ProjectStaffPage.css";
import html2pdf from "html2pdf.js";
import axios from "axios";
import auLogo from "../../../assets/anna-university-logo.png";
// ── Sample data ──────────────────────────────────────────
const PROJECTS = [
  {
    id: "P1",
    code: "2433/CSRC-2/2020",
    name: "Development of Ti(C,N) based cermets",
  },
  { id: "P2", code: "721/CSRC-2/2013", name: "Advanced Materials Research" },
  { id: "P3", code: "1234/CSRC-2/2025", name: "Smart Manufacturing Project" },
];

const FACULTY = [
  {
    id: "F1",
    name: "Dr. S.Balasivanandha Prabu",
    role: "Principal Investigator",
    dept: "DEPARTMENT OF MECHANICAL ENGINEERING",
    inst: "COLLEGE OF ENGINEERING GUINDY CAMPUS\nANNA UNIVERSITY\nCHENNAI 600 025, INDIA.",
    headTitle: "Professor and Head",
    headDept:
      "Department of Mechanical Engineering\nCollege of Engineering, Guindy Campus,\nAnna University\nChennai – 600 025.",
    projectId: "P1",
  },
  {
    id: "F2",
    name: "Dr. P.T.V.Bhuvaneswari",
    role: "Principal Investigator",
    dept: "DEPARTMENT OF ELECTRONICS ENGINEERING",
    inst: "MIT CAMPUS, ANNA UNIVERSITY CHENNAI\nCHROMEPET, CHENNAI - 600 044",
    headTitle: "Prof. & Head",
    headDept:
      "Department of Electronics Engineering\nMIT Campus, Anna University\nChennai – 600 044.",
    projectId: "P2",
  },
  {
    id: "F3",
    name: "Dr. R.Anand",
    role: "Principal Investigator",
    dept: "DEPARTMENT OF COMPUTER SCIENCE",
    inst: "ANNA UNIVERSITY\nCHENNAI 600 025, INDIA.",
    headTitle: "Professor and Head",
    headDept:
      "Department of Computer Science\nAnna University\nChennai – 600 025.",
    projectId: "P3",
  },
];

const INIT_CONTRACTS = [
  {
    id: 138,
    projectId: "P1",
    facultyId: "F1",
    staffName: "Mr VENKADANATHAN J",
    designation: "Junior Research Fellow",
    contractFrom: "21-12-2022",
    contractTo: "30-11-2023",
    joinDueDate: "21-06-2023",
    status: "VERIFIED",
    extn: "New",
    proceedingNo: "CEG/MECH/SERB PROJECT/BSP/JRF/",
    proceedingDate: "20-06-2023",
    tenureFrom: "21-12-2022",
    tenureTo: "30-11-2023",
    fixedSalary: 31000,
    hra: 7440,
    documents: [
      {
        id: 1,
        name: "Advt.",
        date: "16-11-2023",
        file: "staff_file_616.pdf",
        status: "VERIFIED",
      },
      {
        id: 2,
        name: "Minutes",
        date: "16-11-2023",
        file: "staff_file_617.pdf",
        status: "VERIFIED",
      },
      {
        id: 3,
        name: "Appointment",
        date: "16-11-2023",
        file: "staff_file_618.pdf",
        status: "VERIFIED",
      },
      {
        id: 4,
        name: "Joining",
        date: "16-11-2023",
        file: "staff_file_619.pdf",
        status: "VERIFIED",
      },
      {
        id: 5,
        name: "Passbook",
        date: "16-11-2023",
        file: "staff_file_620.pdf",
        status: "VERIFIED",
      },
    ],
    extensions: [],
  },
  {
    id: 53,
    projectId: "P1",
    facultyId: "F1",
    staffName: "Mr VENKADANATHAN J",
    designation: "Junior Research Fellow",
    contractFrom: "21-12-2022",
    contractTo: "20-06-2023",
    joinDueDate: "21-12-2022",
    status: "VERIFIED",
    extn: "New",
    proceedingNo: "CEG/MECH/JRF/01",
    proceedingDate: "21-12-2022",
    tenureFrom: "21-12-2022",
    tenureTo: "20-06-2023",
    fixedSalary: 31000,
    hra: 7440,
    documents: [],
    extensions: [],
  },
  {
    id: 32,
    projectId: "P1",
    facultyId: "F1",
    staffName: "Mr VETRI VEL V",
    designation: "Junior Research Fellow",
    contractFrom: "05-07-2022",
    contractTo: "04-01-2023",
    joinDueDate: "05-07-2022",
    status: "VERIFIED",
    extn: "New",
    proceedingNo: "CEG/MECH/JRF/02",
    proceedingDate: "05-07-2022",
    tenureFrom: "05-07-2022",
    tenureTo: "04-01-2023",
    fixedSalary: 31000,
    hra: 7440,
    documents: [],
    extensions: [],
  },
  {
    id: 31,
    projectId: "P2",
    facultyId: "F2",
    staffName: "Ms PRIYA A",
    designation: "Project Assistant",
    contractFrom: "01-03-2023",
    contractTo: "28-02-2024",
    joinDueDate: "01-03-2023",
    status: "VERIFIED",
    extn: "New",
    proceedingNo: "MIT/ELEC/PA/01",
    proceedingDate: "01-03-2023",
    tenureFrom: "01-03-2023",
    tenureTo: "28-02-2024",
    fixedSalary: 25000,
    hra: 0,
    documents: [],
    extensions: [],
  },
];

const emptyContract = {
  staffName: "",
  appointmentOrderNo: "",
  appointmentOrderDate: "",
  contractFrom: "",
  contractTo: "",
  joinDueDate: "",
  fixedSalary: 0,
  hra: 0,
  minutesFile: null,
  advertisementFile: null,
};
const emptyExtension = {
  staffName: "",
  extnOrderNo: "",
  extnOrderDate: "",
  extnFrom: "",
  extnTo: "",
  rejoinDueDate: "",
  fixedSalary: 0,
  hra: 0,
  appraisalFile: null,
};

const TERMS_AND_CONDITIONS = [
  "The appointment is on a purely temporary basis for the period of six months from the date of joining and is liable to be terminated at any time without notice and without assigning any reason.",
  "The appointment shall not confer any right or privilege for a regular appointment in the University.",
  "The appointee is entitled for leave privileges as under:\n(A) All closed holidays of the University.\n(B) 12 days in a calendar year or proportionate days thereof. Leave should not be granted for more than 10 days at a stretch including holidays.\n(C) Un-expired leave shall not be carried forward from one calendar year to the next.\n(D) No encashment of leave is permissible.",
  "The appointee will be posted at any place or any village of the project site, at the discretion of the Head, {{DEPARTMENT}}.",
  "The appointee is entitled for TA/DA on travels undertaken by him/her as per rules.",
  "The nature of work duties shall be such as assigned from time to time by the Head, {{DEPARTMENT}} and authorities of the Anna University.",
  "Any loss caused to the university due to any act of omission or commission on the part of appointee shall be deducted from the monthly-consolidated pay, after notice.",
  "This contract may be renewed at the sole discretion of the Registrar for such period as he may think fit necessary depending upon the continuance of the project for a further period.",
  "On the expiry of the contract of efflux of time, or earlier, determined as aforesaid, the appointee shall handover all materials, records, documents in his/her possession/custody to such person / officer of the University nominated.",
];

const fmtDate = (d) => {
  if (!d) return "";

  const date = new Date(d);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
const fmtDateLong = (d) => {
  if (!d) return "";

  const date = new Date(d);

  const day = date.getDate();
  const year = date.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${day} ${months[date.getMonth()]} ${year}`;
};
const numToWords = (num) => {
  num = parseInt(num || 0);
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + convert(n % 10000000) : "")
    );
  };
  return convert(num);
};

const TermsPage = ({ faculty, project }) => (
  <div className="ps-report-sheet" style={{ marginTop: 5 }}>
    <div className="ps-report-header">
      <img src={auLogo} alt="Anna University" width="70" />
      <div className="ps-report-org">
        <div className="ps-report-dept">{faculty?.dept || ""}</div>
        <div className="ps-report-inst">{faculty?.inst || ""}</div>
      </div>
    </div>
    <div
      style={{
        textAlign: "center",
        margin: "16px 0 20px",
        borderBottom: "1px solid #ccc",
        paddingBottom: 12,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "underline",
          fontFamily: "Times New Roman, serif",
        }}
      >
        ANNEXURE
      </div>
      <div style={{ fontSize: 13, color: "#000", marginTop: 4 }}>
        Terms and Conditions of the Contract
      </div>
      {project && (
        <div style={{ fontSize: 12, color: "#000", marginTop: 4 }}>
          Project: {project?.title || ""}
        </div>
      )}
    </div>
    <ol
      style={{
        fontFamily: "Times New Roman, Georgia, serif",
        fontSize: 13.5,
        lineHeight: 1.8,
        color: "#222",
        paddingLeft: 22,
        margin: 0,
      }}
    >
      {TERMS_AND_CONDITIONS.map((term, i) => (
        <li key={i} style={{ marginBottom: 12, textAlign: "justify" }}>
          {term
            .replace("{{DEPARTMENT}}", faculty?.dept || "Department")
            .split("\n")
            .map((line, j) => (
              <span key={j}>
                {j > 0 && (
                  <>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </>
                )}
                {line}
              </span>
            ))}
        </li>
      ))}
    </ol>
    <div
      className="ps-report-signature-row"
      style={{ marginTop: 10, pageBreakInside: "avoid" }}
    >
      <div className="ps-report-sig-right">
        <div className="ps-report-sig-line">&nbsp;</div>
        <div>{faculty?.headTitle || "Professor and Head"}</div>
        <div style={{ fontSize: 12 }}>{faculty?.headDept || ""}</div>
      </div>
    </div>
  </div>
);

// ── Appointment Report (Print) ───────────────────────────
const AppointmentReport = ({ data, type, projectId, facultyId, onBack }) => {
  const [reportData, setReportData] = useState(null);
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    try {
      // If facultyId is something like "F001", this check will alert you immediately in the console logs
      if (typeof facultyId === "string" && facultyId.startsWith("F")) {
        console.error(
          "CRITICAL: Passing a Faculty alphanumeric code instead of a Staff primary key ID integer!",
        );
      }

      const url =
        type === "extension"
          ? `http://localhost:5000/api/project-staff/extension-report/${facultyId}`
          : `http://localhost:5000/api/project-staff/appointment-report/${facultyId}`;
      const res = await axios.get(url);
      setReportData(res.data);
    } catch (err) {
      console.log("REPORT ERROR =", err);
    }
  };

  const reportRef = useRef(null);
  const isNew = type === "new";
  if (!reportData) {
    return <div>Loading...</div>;
  }
  const faculty = {
    name: reportData.pi_name || "",
    dept: reportData.department || "",
    inst: reportData.campus || "",
    role: "Principal Investigator",
    headTitle: reportData.pi_designation || "Principal Investigator",
    headDept: reportData.department || "",
  };
  console.log("REPORT DATA =", reportData);
  const project = {
    title: reportData.project_title,
    sponsor: reportData.funding_agency,
    code: reportData.project_code || "",
  };

  const copi = null;
  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    try {
      await html2pdf()
        .from(element)
        .set({
          filename: "Appointment_Letter.pdf",
          pagebreak: { mode: ["avoid-all"] },
          margin: 0,
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            backgroundColor: "#ffffff",
            letterRendering: true,
            windowWidth: element.scrollWidth,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  const report = {
    ...data,
    staffName: reportData.staff_name,
    designation: reportData.designation,
    fixedSalary: reportData.fixed_salary,
    hra: reportData.hra,
    appointmentOrderNo: reportData.appointment_order_no,
    appointmentOrderDate: reportData.appointment_order_date,
    joinDueDate: reportData.joining_due_date,
    contractFrom: reportData.contract_period_from,
    contractTo: reportData.contract_period_upto,
    // extension-specific fields from DB:
    extnOrderNo: reportData.extension_order_no,
    extnOrderDate: reportData.extension_order_date,
    extnFrom: reportData.extension_from,
    extnTo: reportData.extension_upto,
    rejoinDueDate: reportData.rejoin_due_date,
  };
  return (
    <>
      <div className="ps-inner-header no-print">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">
            {isNew ? "Appointment Letter Preview" : "Extension Letter Preview"}
          </div>
          <div className="ps-inner-sub">
            Generated Report — Page 1: Letter · Page 2: Terms &amp; Conditions
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="ps-btn-primary orange" onClick={handleDownloadPDF}>
            Download PDF
          </button>
          <button className="ps-back-btn" onClick={onBack}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
      <div ref={reportRef}>
        <div className="ps-report-sheet">
          <div className="ps-report-header">
            <img src={auLogo} alt="Anna University" width="70" />
            <div className="ps-report-org">
              <div className="ps-report-dept">{reportData.department}</div>
              <div className="ps-report-inst">{faculty.inst}</div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "#000",
              margin: "2px 0",
            }}
          />
          <div className="ps-report-from">
            <div className="ps-report-from-name">{faculty.name}</div>
            <div className="ps-report-from-title">{faculty.headTitle}</div>
          </div>
          <div className="ps-report-meta-row">
            <div>
              <span className="ps-report-meta-label">Letter No: </span>
              <span className="ps-report-meta-val">
                {isNew ? report.appointmentOrderNo : report.extnOrderNo}
              </span>
            </div>
            <div>
              <span className="ps-report-meta-label">Date: </span>
              <span className="ps-report-meta-val">
                {fmtDate(
                  isNew ? report.appointmentOrderDate : report.extnOrderDate,
                )}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 1 }}>
            <strong>Sub:</strong>{" "}
            {isNew
              ? `Anna University – ${faculty.dept} – Contract appointment of ${report.staffName} under the research project – Order issued.`
              : `${faculty.inst || reportData.campus || "Anna University"} – ${faculty.dept} – Extension for the post of ${report.designation} – Issued – Reg.`}
          </div>
          <div
            style={{
              marginBottom: "1px",
              textAlign: "left",
              marginLeft: "10px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Ref:</div>
            <div
              style={{ marginTop: "1px", paddingLeft: "30px", lineHeight: 2 }}
            >
              <div>1. Ref.No.EEQ/2020/000620 dated 01.12.2020</div>
              {isNew && (
                <div>
                  2. CTDT Proceedings No.2433/CTDT-2/2020 dated 22.08.2022
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: "center", marginBottom: "1px" }}>
            ------------------------
          </div>
          <div className="ps-report-body">
            {isNew ? (
              <>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{report.staffName || "STAFF NAME"}</strong> is
                  appointed as{" "}
                  <strong>
                    {report.designation || "Junior Research Fellow"}
                  </strong>{" "}
                  in the <strong>{project?.sponsor || "SERB sponsored"}</strong>{" "}
                  research project entitled <strong>"{project?.title}"</strong>{" "}
                  in the <strong>{faculty.dept}</strong> at a consolidated
                  salary of{" "}
                  <strong>
                    Rs.
                    {parseInt(report.fixedSalary || 0).toLocaleString("en-IN")}
                    /-
                  </strong>{" "}
                  ({numToWords(parseInt(report.fixedSalary || 0))} only)
                  {Number(report.hra) > 0 && (
                    <>
                      {" + HRA Rs."}
                      <strong>
                        {Math.round(
                          (Number(report.fixedSalary || 0) *
                            Number(report.hra)) /
                            100,
                        ).toLocaleString("en-IN")}
                        /-
                      </strong>
                      {` (${numToWords(Math.round((Number(report.fixedSalary || 0) * Number(report.hra)) / 100))} only)`}
                    </>
                  )}{" "}
                  under the terms and conditions enclosed (Annexure).
                </p>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{report.staffName || "STAFF NAME"}</strong> is
                  directed to join duty on or before{" "}
                  <strong>{fmtDateLong(report.joinDueDate)}</strong> by
                  reporting to the Professor and Head, {faculty.dept}.
                </p>
                <p style={{ textAlign: "justify", lineHeight: 1.5 }}>
                  <strong>{report.staffName || "STAFF NAME"}</strong> is
                  directed to sign the duplicate copy of the order by accepting
                  the terms and conditions of the contract and forward the same
                  to the Principal Investigator.
                </p>
              </>
            ) : (
              <>
                <p>
                  Based on the performance of{" "}
                  <strong>{report.staffName}</strong> as a{" "}
                  {report.designation || "Project Staff"} under the project{" "}
                  {project?.title}, is given extension from{" "}
                  <strong>{fmtDateLong(report.extnFrom)}</strong> till{" "}
                  <strong>{fmtDateLong(report.extnTo)}</strong>.
                </p>
                <p>
                  Your appointment is on contract basis till the end of this
                  extension period under the Terms and Conditions enclosed
                  herewith. You will be paid a consolidated salary of Rs.
                  <strong>
                    {parseInt(report.fixedSalary || 0).toLocaleString("en-IN")}
                    /- (Rupees {numToWords(
                      parseInt(report.fixedSalary || 0),
                    )}{" "}
                    Only)
                  </strong>{" "}
                  per month during this period.
                </p>
                <p>
                  You are requested to report for duty from{" "}
                  <strong>{fmtDateLong(report.extnFrom)}</strong> to the
                  Principal Investigator. The re-joining due date is{" "}
                  <strong>{fmtDateLong(report.rejoinDueDate)}</strong>. If there
                  is no response within one week from the date of issue of this
                  order, the appointment will be cancelled automatically.
                </p>
                <p>
                  You are requested to sign the copy of this order by accepting
                  the <strong>Terms and Conditions of the contract</strong>, and
                  submit the same at the office of the Principal Investigator.
                </p>
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "1px",
              gap: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: "left",
                fontSize: 14,
                color: "#000",
                lineHeight: 1.8,
              }}
            >
              <div>
                <strong>Encl:</strong> Terms and Conditions
              </div>
              <div style={{ marginTop: 1 }}>
                <strong>To:</strong>
                <br />
                {report.staffName}
              </div>
              {copi && (
                <div style={{ marginTop: 10 }}>
                  <div>{copi.name}</div>
                  <div style={{ fontSize: 12, color: "#000" }}>{copi.role}</div>
                  {copi.dept.split("\n").map((line, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#000" }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
              {(data.copyTo?.length > 0 || project || faculty) && (
                <div style={{ marginTop: 12 }}>
                  <strong>Copy To:</strong>
                  {data.copyTo?.length > 0 ? (
                    data.copyTo.map((item, index) => (
                      <div key={index}>
                        {index + 1}. {item}
                      </div>
                    ))
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
            <div style={{ width: "320px", textAlign: "right", flexShrink: 0 }}>
              <div>
                <strong>{faculty.name}</strong>
              </div>
              <div>{faculty.role}</div>
              <div>{faculty.headTitle}</div>
              <div style={{ fontSize: 12 }}>{faculty.headDept || ""}</div>
            </div>
          </div>
        </div>
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
        <div className="ps-inner-title">
          Project Staff Appointment Related Documents
        </div>
        <div className="ps-inner-sub">
          {contract.staffName} — Contract #{contract.id}
        </div>
      </div>
      <button className="ps-back-btn" onClick={onBack}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
    </div>
    <div className="ps-form-panel">
      {contract.documents.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#9ca3af",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          No documents uploaded for this contract.
        </div>
      ) : (
        <table className="ps-doc-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Document</th>
              <th>Date</th>
              <th>Files</th>
              <th>Status</th>
              <th>File Input</th>
            </tr>
          </thead>
          <tbody>
            {contract.documents.map((doc, i) => (
              <tr key={doc.id}>
                <td
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    width: 60,
                  }}
                >
                  {i + 1}
                </td>
                <td style={{ fontWeight: 500, color: "#1f2937" }}>
                  {doc.name}
                </td>
                <td
                  style={{
                    color: "#6b7280",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {doc.date}
                </td>
                <td>
                  <button
                    className="ps-file-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    onClick={() => {}}
                  >
                    {doc.file}
                  </button>
                </td>
                <td>
                  <span className="ps-badge verified">
                    <span className="ps-badge-dot" />
                    {doc.status}
                  </span>
                </td>
                <td>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id={`file-${doc.id}`}
                  />
                  <label
                    htmlFor={`file-${doc.id}`}
                    className="ps-icon-btn doc"
                    style={{
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: 8,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 13, height: 13 }}
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
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
    proceedingNo: contract.proceedingNo || "",
    proceedingDate: contract.proceedingDate || "",
    joinDueDate: contract.joinDueDate || "",
    tenureFrom: contract.tenureFrom || "",
    tenureTo: contract.tenureTo || "",
    fixedSalary: contract.fixedSalary || 0,
    hra: contract.hra || 0,
  });
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Tenure editing...</div>
          <div className="ps-inner-sub">Master / Staff Tenure</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff details editing....</div>
        {contract.status === "VERIFIED" && (
          <div style={{ marginBottom: 16 }}>
            <span
              className="ps-info-tag success"
              style={{
                fontSize: 16,
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 10,
              }}
            >
              ✓ VERIFIED
            </span>
          </div>
        )}
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 1fr 160px 160px" }}
        >
          <div className="ps-field">
            <label>
              Proceeding No<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              value={form.proceedingNo}
              onChange={(e) => upd("proceedingNo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>Proceeding Date</label>
            <input
              className="ps-input"
              type="date"
              value={form.proceedingDate}
              onChange={(e) => upd("proceedingDate", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>Joining Due Date</label>
            <input
              className="ps-input"
              type="date"
              value={form.joinDueDate}
              onChange={(e) => upd("joinDueDate", e.target.value)}
            />
          </div>
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 160px 160px 160px" }}
        >
          <div className="ps-field">
            <label>Tenure From</label>
            <input
              className="ps-input"
              type="date"
              value={form.tenureFrom}
              onChange={(e) => upd("tenureFrom", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>Tenure Upto</label>
            <input
              className="ps-input"
              type="date"
              value={form.tenureTo}
              onChange={(e) => upd("tenureTo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Fixed Salary<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.fixedSalary}
              onChange={(e) => upd("fixedSalary", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              HRA<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.hra}
              onChange={(e) => upd("hra", e.target.value)}
            />
          </div>
        </div>
        <div className="ps-form-actions">
          <button
            className="ps-btn-primary orange"
            onClick={() => onSave(form)}
          >
            Update
          </button>
          <button className="ps-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

// ── Upload Button Helper ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
const UploadBtn = ({
  id,
  label,
  fileName,
  onUpload,
  accept = ".pdf,.doc,.docx,.jpg,.png",
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <input
      type="file"
      id={id}
      style={{ display: "none" }}
      onChange={onUpload}
      accept={accept}
    />
    <label
      htmlFor={id}
      className="ps-upload-label"
      style={{ cursor: "pointer", whiteSpace: "nowrap" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 13, height: 13 }}
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      {label}
    </label>
    {fileName && (
      <span
        style={{
          fontSize: 11,
          color: "#34d399",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 140,
        }}
      >
        ✓ {fileName}
      </span>
    )}
  </div>
);

// ── Submitted Appointments List — standalone card ────────
const SubmittedAppointmentsList = ({ items, onPreview }) => {
  const [open, setOpen] = useState(true);
  // Track local file selections per item
  const [fileSelections, setFileSelections] = useState({});
  // Track what's already saved in DB (fetched from items)
  const [savedDocs, setSavedDocs] = useState(() => {
    const map = {};
    items.forEach((item) => {
      map[item.id] = {
        appointment_letter_path: item.appointment_letter_path || null,
        joining_letter_path: item.joining_letter_path || null,
      };
    });
    return map;
  });

  if (!items || items.length === 0) return null;

  const handleFileSelect = (itemId, key, file) => {
    setFileSelections((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [key]: file },
    }));
  };

  const handleSaveDocs = async (itemId) => {
    const selected = fileSelections[itemId] || {};
    if (!selected.appointment_letter && !selected.joining_letter) {
      alert("Please select at least one file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("staffId", itemId);
      if (selected.appointment_letter) {
        formData.append("appointment_letter", selected.appointment_letter);
      }
      if (selected.joining_letter) {
        formData.append("joining_letter", selected.joining_letter);
      }

      await axios.post(
        "http://localhost:5000/api/project-staff/upload-docs",
        formData,
      );

      // Update savedDocs state so UI reflects what's now stored
      setSavedDocs((prev) => ({
        ...prev,
        [itemId]: {
          appointment_letter_path: selected.appointment_letter
            ? selected.appointment_letter.name
            : prev[itemId]?.appointment_letter_path,
          joining_letter_path: selected.joining_letter
            ? selected.joining_letter.name
            : prev[itemId]?.joining_letter_path,
        },
      }));

      // Clear local file selections for this item
      setFileSelections((prev) => ({ ...prev, [itemId]: {} }));

      alert("Documents saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const pendingCount = items.filter(
    (item) =>
      !savedDocs[item.id]?.appointment_letter_path ||
      !savedDocs[item.id]?.joining_letter_path,
  ).length;

  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(99,102,155,0.18)",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background:
              "linear-gradient(180deg, #fb923c 0%, rgba(251,146,60,0.1) 100%)",
            borderRadius: "3px 0 0 3px",
          }}
        />

        {/* Header */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
            border: "none",
            padding: "18px 22px 18px 26px",
            cursor: "pointer",
            borderBottom: open ? "1px solid rgba(251,146,60,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(251,146,60,0.12)",
                border: "1px solid rgba(251,146,60,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fb923c"
                strokeWidth="2"
                style={{ width: 18, height: 18 }}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1b2e",
                }}
              >
                Pending Uploads — New Appointments
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 3,
                }}
              >
                {items.length} order{items.length !== 1 ? "s" : ""} submitted
                {pendingCount > 0 && (
                  <span style={{ marginLeft: 8, color: "#fb923c" }}>
                    · {pendingCount} awaiting upload
                    {pendingCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pendingCount > 0 ? (
              <span
                style={{
                  background: "rgba(251,146,60,0.15)",
                  color: "#fb923c",
                  border: "1px solid rgba(251,146,60,0.3)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {pendingCount} pending
              </span>
            ) : (
              <span
                style={{
                  background: "rgba(52,211,153,0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.25)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                ✓ All uploaded
              </span>
            )}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              style={{
                width: 16,
                height: 16,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* Table */}
        {open && (
          <div style={{ overflowX: "auto", padding: "0 0 4px 0" }}>
            <table className="ps-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th className="ps-sl-num">Sl.</th>
                  <th>Staff Name</th>
                  <th>Order No</th>
                  <th>Contract From</th>
                  <th>Contract To</th>
                  <th>Salary</th>
                  <th>Report</th>
                  <th>Appointment Letter</th>
                  <th>Joining Letter</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const saved = savedDocs[item.id] || {};
                  const selected = fileSelections[item.id] || {};

                  return (
                    <tr key={item.id}>
                      <td className="ps-sl-num">{i + 1}</td>
                      <td className="ps-name-cell">{item.staff_name || "—"}</td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>
                        {item.appointment_order_no || "—"}
                      </td>
                      <td
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: "#6b7280",
                        }}
                      >
                        {fmtDate(item.contract_period_from) || "—"}
                      </td>
                      <td
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: "#6b7280",
                        }}
                      >
                        {fmtDate(item.contract_period_upto) || "—"}
                      </td>
                      <td style={{ color: "#374151" }}>
                        ₹
                        {parseInt(item.fixed_salary || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => onPreview(item)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            fontSize: 12,
                            borderRadius: 8,
                            whiteSpace: "nowrap",
                            background: "rgba(0,180,255,0.08)",
                            border: "1px solid rgba(0,180,255,0.22)",
                            color: "#00b4ff",
                            cursor: "pointer",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ width: 12, height: 12 }}
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Preview
                        </button>
                      </td>

                      {/* Appointment Letter */}
                      <td>
                        {saved.appointment_letter_path ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "#34d399",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              ✓ Uploaded
                            </span>
                            <label
                              htmlFor={`appt-${item.id}`}
                              style={{
                                fontSize: 11,
                                color: "#00b4ff",
                                cursor: "pointer",
                                fontFamily: "DM Sans, sans-serif",
                                textDecoration: "underline",
                              }}
                            >
                              Replace
                            </label>
                            <input
                              type="file"
                              id={`appt-${item.id}`}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) =>
                                handleFileSelect(
                                  item.id,
                                  "appointment_letter",
                                  e.target.files[0],
                                )
                              }
                            />
                            {selected.appointment_letter && (
                              <span style={{ fontSize: 10, color: "#fb923c" }}>
                                ↑ {selected.appointment_letter.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <input
                              type="file"
                              id={`appt-${item.id}`}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) =>
                                handleFileSelect(
                                  item.id,
                                  "appointment_letter",
                                  e.target.files[0],
                                )
                              }
                            />
                            <label
                              htmlFor={`appt-${item.id}`}
                              className="ps-upload-label"
                              style={{
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ width: 13, height: 13 }}
                              >
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              Appt. Letter
                            </label>
                            {selected.appointment_letter && (
                              <span style={{ fontSize: 10, color: "#fb923c" }}>
                                ↑ {selected.appointment_letter.name}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Joining Letter */}
                      <td>
                        {saved.joining_letter_path ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "#34d399",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              ✓ Uploaded
                            </span>
                            <label
                              htmlFor={`join-${item.id}`}
                              style={{
                                fontSize: 11,
                                color: "#00b4ff",
                                cursor: "pointer",
                                fontFamily: "DM Sans, sans-serif",
                                textDecoration: "underline",
                              }}
                            >
                              Replace
                            </label>
                            <input
                              type="file"
                              id={`join-${item.id}`}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) =>
                                handleFileSelect(
                                  item.id,
                                  "joining_letter",
                                  e.target.files[0],
                                )
                              }
                            />
                            {selected.joining_letter && (
                              <span style={{ fontSize: 10, color: "#fb923c" }}>
                                ↑ {selected.joining_letter.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                            }}
                          >
                            <input
                              type="file"
                              id={`join-${item.id}`}
                              style={{ display: "none" }}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) =>
                                handleFileSelect(
                                  item.id,
                                  "joining_letter",
                                  e.target.files[0],
                                )
                              }
                            />
                            <label
                              htmlFor={`join-${item.id}`}
                              className="ps-upload-label"
                              style={{
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ width: 13, height: 13 }}
                              >
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              Joining Letter
                            </label>
                            {selected.joining_letter && (
                              <span style={{ fontSize: 10, color: "#fb923c" }}>
                                ↑ {selected.joining_letter.name}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Save button */}
                      <td>
                        <button
                          onClick={() => handleSaveDocs(item.id)}
                          disabled={
                            !selected.appointment_letter &&
                            !selected.joining_letter
                          }
                          style={{
                            padding: "6px 14px",
                            fontSize: 12,
                            borderRadius: 8,
                            background:
                              selected.appointment_letter ||
                              selected.joining_letter
                                ? "rgba(52,211,153,0.15)"
                                : "#f3f4f6",
                            border:
                              selected.appointment_letter ||
                              selected.joining_letter
                                ? "1px solid rgba(52,211,153,0.3)"
                                : "1px solid #d1d5db",
                            color:
                              selected.appointment_letter ||
                              selected.joining_letter
                                ? "#34d399"
                                : "#9ca3af",
                            cursor:
                              selected.appointment_letter ||
                              selected.joining_letter
                                ? "pointer"
                                : "not-allowed",
                            fontFamily: "DM Sans, sans-serif",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, #fb923c, rgba(251,146,60,0.1))",
            borderRadius: "0 0 18px 18px",
          }}
        />
      </div>
    </div>
  );
};

// ── Submitted Extensions List — standalone card ──────────
const SubmittedExtensionsList = ({ items, onRefresh, onPreview }) => {
  const [open, setOpen] = useState(true);
  const [fileSelections, setFileSelections] = useState({});
  const [savedDocs, setSavedDocs] = useState(() => {
    const map = {};
    items.forEach((item) => {
      map[item.id] = {
        extension_letter_path: item.extension_letter_path || null,
        rejoining_letter_path: item.rejoining_letter_path || null,
        appraisal_path: item.appraisal_path || null,
      };
    });
    return map;
  });

  // Sync savedDocs when items prop updates
  useEffect(() => {
    setSavedDocs(() => {
      const map = {};
      items.forEach((item) => {
        map[item.id] = {
          extension_letter_path: item.extension_letter_path || null,
          rejoining_letter_path: item.rejoining_letter_path || null,
          appraisal_path: item.appraisal_path || null,
        };
      });
      return map;
    });
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleFileSelect = (itemId, key, file) => {
    setFileSelections((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [key]: file },
    }));
  };

  const handleSaveDocs = async (itemId) => {
    const selected = fileSelections[itemId] || {};
    if (!selected.extension_letter && !selected.rejoining_letter) {
      alert("Please select at least one file to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("extensionId", itemId);
      if (selected.extension_letter)
        formData.append("extension_letter", selected.extension_letter);
      if (selected.rejoining_letter)
        formData.append("rejoining_letter", selected.rejoining_letter);

      await axios.post(
        "http://localhost:5000/api/project-staff/extension/upload-docs",
        formData,
      );

      setSavedDocs((prev) => ({
        ...prev,
        [itemId]: {
          extension_letter_path: selected.extension_letter
            ? selected.extension_letter.name
            : prev[itemId]?.extension_letter_path,
          rejoining_letter_path: selected.rejoining_letter
            ? selected.rejoining_letter.name
            : prev[itemId]?.rejoining_letter_path,
          appraisal_path: prev[itemId]?.appraisal_path,
        },
      }));
      setFileSelections((prev) => ({ ...prev, [itemId]: {} }));
      alert("Documents saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  const pendingCount = items.filter(
    (item) =>
      !savedDocs[item.id]?.extension_letter_path ||
      !savedDocs[item.id]?.rejoining_letter_path,
  ).length;

  // Reusable cell renderer: shows ✓ Uploaded + Replace if saved, else upload button
  const DocCell = ({ itemId, savedPath, fileKey, label, color }) => {
    const saved = savedDocs[itemId] || {};
    const selected = fileSelections[itemId] || {};
    const inputId = `ext-${fileKey}-${itemId}`;
    return saved[savedPath] ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, color: "#34d399" }}>✓ Uploaded</span>
        <label
          htmlFor={inputId}
          style={{
            fontSize: 11,
            color: "#00b4ff",
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          Replace
        </label>
        <input
          type="file"
          id={inputId}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileSelect(itemId, fileKey, e.target.files[0])}
        />
        {selected[fileKey] && (
          <span style={{ fontSize: 10, color: "#fb923c" }}>
            ↑ {selected[fileKey].name}
          </span>
        )}
      </div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <input
          type="file"
          id={inputId}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => handleFileSelect(itemId, fileKey, e.target.files[0])}
        />
        <label
          htmlFor={inputId}
          className="ps-upload-label"
          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 13, height: 13 }}
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {label}
        </label>
        {selected[fileKey] && (
          <span style={{ fontSize: 10, color: "#fb923c" }}>
            ↑ {selected[fileKey].name}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(167,139,250,0.25)",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background:
              "linear-gradient(180deg, #a78bfa 0%, rgba(167,139,250,0.1) 100%)",
            borderRadius: "3px 0 0 3px",
          }}
        />

        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
            border: "none",
            padding: "18px 22px 18px 26px",
            cursor: "pointer",
            borderBottom: open ? "1px solid rgba(167,139,250,0.12)" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(167,139,250,0.12)",
                border: "1px solid rgba(167,139,250,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                style={{ width: 18, height: 18 }}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1b2e",
                }}
              >
                Pending Uploads — Extensions
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 3,
                }}
              >
                {items.length} extension{items.length !== 1 ? "s" : ""}{" "}
                submitted
                {pendingCount > 0 && (
                  <span style={{ marginLeft: 8, color: "#a78bfa" }}>
                    · {pendingCount} awaiting uploads
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {pendingCount > 0 ? (
              <span
                style={{
                  background: "rgba(167,139,250,0.15)",
                  color: "#a78bfa",
                  border: "1px solid rgba(167,139,250,0.3)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {pendingCount} pending
              </span>
            ) : (
              <span
                style={{
                  background: "rgba(52,211,153,0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.25)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                ✓ All uploaded
              </span>
            )}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              style={{
                width: 16,
                height: 16,
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {open && (
          <div style={{ overflowX: "auto", padding: "0 0 4px 0" }}>
            <table className="ps-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th className="ps-sl-num">Sl.</th>
                  <th>Staff Name</th>
                  <th>Order No</th>
                  <th>Extn From</th>
                  <th>Extn To</th>
                  <th>Salary</th>
                  <th>Report</th>
                  <th>Extn. Letter</th>
                  <th>Rejoining Letter</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const selected = fileSelections[item.id] || {};
                  const hasSelection =
                    selected.extension_letter || selected.rejoining_letter;
                  return (
                    <tr key={item.id}>
                      <td className="ps-sl-num">{i + 1}</td>
                      <td className="ps-name-cell">
                        {item.staff_name || item.staffName || "—"}
                      </td>
                      <td style={{ color: "#6b7280", fontSize: 12 }}>
                        {item.extension_order_no || "—"}
                      </td>
                      <td
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: "#6b7280",
                        }}
                      >
                        {fmtDate(item.extension_from) || "—"}
                      </td>
                      <td
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: "#6b7280",
                        }}
                      >
                        {fmtDate(item.extension_upto) || "—"}
                      </td>
                      <td style={{ color: "#374151" }}>
                        ₹
                        {parseInt(item.fixed_salary || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>

                      {/* Performance Appraisal — view only (uploaded at form time) */}
                      <td>
                        <button
                          onClick={() => onPreview && onPreview(item)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            fontSize: 12,
                            borderRadius: 8,
                            whiteSpace: "nowrap",
                            background: "rgba(0,180,255,0.08)",
                            border: "1px solid rgba(0,180,255,0.22)",
                            color: "#00b4ff",
                            cursor: "pointer",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ width: 12, height: 12 }}
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Preview
                        </button>
                      </td>

                      {/* Extension Letter */}
                      <td>
                        <DocCell
                          itemId={item.id}
                          savedPath="extension_letter_path"
                          fileKey="extension_letter"
                          label="Extn. Letter"
                        />
                      </td>

                      {/* Rejoining Letter */}
                      <td>
                        <DocCell
                          itemId={item.id}
                          savedPath="rejoining_letter_path"
                          fileKey="rejoining_letter"
                          label="Rejoin Letter"
                        />
                      </td>

                      {/* Save */}
                      <td>
                        <button
                          onClick={() => handleSaveDocs(item.id)}
                          disabled={!hasSelection}
                          style={{
                            padding: "6px 14px",
                            fontSize: 12,
                            borderRadius: 8,
                            whiteSpace: "nowrap",
                            background: hasSelection
                              ? "rgba(52,211,153,0.15)"
                              : "#f3f4f6",
                            border: hasSelection
                              ? "1px solid rgba(52,211,153,0.3)"
                              : "1px solid #d1d5db",
                            color: hasSelection ? "#34d399" : "#9ca3af",
                            cursor: hasSelection ? "pointer" : "not-allowed",
                            fontFamily: "DM Sans, sans-serif",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, #a78bfa, rgba(167,139,250,0.1))",
            borderRadius: "0 0 18px 18px",
          }}
        />
      </div>
    </div>
  );
};

// ── Extension Form ───────────────────────────────────────
// CHANGED: "Generate Extension Letter" → "Submit"
const ExtensionForm = ({ contract, projectId, facultyId, onSave, onBack }) => {
  const [form, setForm] = useState({
    ...emptyExtension,
    staffName: contract?.staff_name || contract?.staffName || "",
    designation: contract?.designation || "",
  });
  const [appraisalFileName, setAppraisalFileName] = useState("");
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAppraisalUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAppraisalFileName(file.name);
      upd("appraisalFile", file);
    }
  };

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Extension</div>
          <div className="ps-inner-sub">Master / Staff Tenure Extension</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        <div className="ps-form-section-label">
          Staff tenure extension details adding....
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 180px" }}
        >
          <div className="ps-field">
            <label>
              Extn Order No<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="Extension Order No"
              value={form.extnOrderNo}
              onChange={(e) => upd("extnOrderNo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Extn Order Date<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.extnOrderDate}
              onChange={(e) => upd("extnOrderDate", e.target.value)}
            />
          </div>
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 160px 160px" }}
        >
          <div className="ps-field">
            <label>
              Extn Period From<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.extnFrom}
              onChange={(e) => upd("extnFrom", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Extn Upto<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.extnTo}
              onChange={(e) => upd("extnTo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Re-Joining Due Date<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.rejoinDueDate}
              onChange={(e) => upd("rejoinDueDate", e.target.value)}
            />
          </div>
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 160px 1fr" }}
        >
          <div className="ps-field">
            <label>
              Fixed Salary<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.fixedSalary}
              onChange={(e) => upd("fixedSalary", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              HRA<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.hra}
              onChange={(e) => upd("hra", e.target.value)}
            />
          </div>
          <div
            className="ps-field"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <label style={{ minWidth: "180px", marginBottom: 0 }}>
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
              <span style={{ fontSize: 12, color: "#34d399" }}>
                ✓ {appraisalFileName}
              </span>
            )}
          </div>
        </div>
        <div className="ps-form-actions">
          {/* CHANGED: was "Generate Extension Letter", now "Submit" */}
          <button
            className="ps-btn-primary orange"
            onClick={() => onSave(form)}
          >
            Submit
          </button>
          <button className="ps-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

// ── New Contract Form ─────────────────────────────────────
// CHANGED: added Advertisement upload, replaced "Generate Appointment Letter" with "Submit"
const NewContractForm = ({
  projectId,
  facultyId,
  staffName,
  designation,
  onSave,
  onBack,
}) => {
  const [form, setForm] = useState({
    ...emptyContract,
    staffName: staffName || "",
  });
  const [minutesFileName, setMinutesFileName] = useState("");
  const [advertisementFileName, setAdvertisementFileName] = useState("");
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const project = PROJECTS.find((p) => p.id === projectId);
  const faculty =
    FACULTY.find((f) => f.id === facultyId) ||
    FACULTY.find((f) => f.projectId === projectId);

  const handleMinutesUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMinutesFileName(file.name);
      upd("minutesFile", file);
    }
  };

  const handleAdvertisementUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdvertisementFileName(file.name);
      upd("advertisementFile", file);
    }
  };

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">New Appointment</div>
          <div className="ps-inner-sub">
            {project
              ? `${project.code} — ${project.name}`
              : "Master / Staff Tenure"}
          </div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel">
        {faculty && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              padding: "12px 16px",
              background: "rgba(0,180,255,0.06)",
              borderRadius: 10,
              border: "1px solid rgba(0,180,255,0.15)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,180,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00b4ff"
                strokeWidth="2"
                style={{ width: 16, height: 16 }}
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {faculty.name}
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                {faculty.dept}
              </div>
            </div>
          </div>
        )}
        <div className="ps-form-section-label">
          Staff tenure details adding....
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 180px" }}
        >
          <div className="ps-field">
            <label>
              Appointment Order No<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="Letter / Proceeding No"
              value={form.appointmentOrderNo}
              onChange={(e) => upd("appointmentOrderNo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Appointment Order Date<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.appointmentOrderDate}
              onChange={(e) => upd("appointmentOrderDate", e.target.value)}
            />
          </div>
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 160px 160px" }}
        >
          <div className="ps-field">
            <label>
              Contract Period From<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.contractFrom}
              onChange={(e) => upd("contractFrom", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Contract Period Upto<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.contractTo}
              onChange={(e) => upd("contractTo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Joining Due Date<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="date"
              value={form.joinDueDate}
              onChange={(e) => upd("joinDueDate", e.target.value)}
            />
          </div>
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 160px" }}
        >
          <div className="ps-field">
            <label>
              Fixed Salary<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.fixedSalary}
              onChange={(e) => upd("fixedSalary", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              HRA<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              type="number"
              value={form.hra}
              onChange={(e) => upd("hra", e.target.value)}
            />
          </div>
        </div>

        {/* CHANGED: Two upload buttons side by side — Minutes of Meeting + Advertisement */}
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 8 }}
        >
          {/* Minutes of Meeting */}
          <div
            className="ps-field"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            <label style={{ minWidth: "200px", marginBottom: 0 }}>
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
                  maxWidth: "160px",
                }}
              >
                ✓ {minutesFileName}
              </span>
            )}
          </div>

          {/* CHANGED: NEW — Advertisement upload */}
          <div
            className="ps-field"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            <label style={{ minWidth: "140px", marginBottom: 0 }}>
              ADVERTISEMENT
            </label>
            <input
              type="file"
              id="advertisement-upload"
              style={{ display: "none" }}
              onChange={handleAdvertisementUpload}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <label htmlFor="advertisement-upload" className="ps-upload-label">
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
              Upload Advt.
            </label>
            {advertisementFileName && (
              <span
                style={{
                  fontSize: 12,
                  color: "#34d399",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                }}
              >
                ✓ {advertisementFileName}
              </span>
            )}
          </div>
        </div>

        <div className="ps-form-actions">
          {/* CHANGED: was "Generate Appointment Letter", now "Submit" */}
          <button
            className="ps-btn-primary orange"
            onClick={() => onSave({ ...form, facultyId })}
          >
            Submit
          </button>
          <button className="ps-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

// ── Faculty Staff Row per Project ────────────────────────
const FacultyStaffTable = ({
  contracts,
  projectId,
  onAddAppointment,
  onDocs,
  onAction,
  onExtn,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const projectFaculty = FACULTY.filter((f) => f.projectId === projectId);
  const project = PROJECTS.find((p) => p.id === projectId);
  const projectContracts = contracts.filter(
    (c) =>
      c.projectId === projectId &&
      c.staffName.toLowerCase().includes(search.toLowerCase()),
  );
  const paginated = projectContracts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );
  const total = projectContracts.length;

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Contract Details</div>
          <div className="ps-inner-sub">
            {project ? `${project.code} — ${project.name}` : ""}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: "#9ca3af",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="ps-input"
            style={{ paddingLeft: 32, width: 200 }}
            placeholder="Search staff name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.1px",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 14,
            paddingBottom: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Faculty / Principal Investigators
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projectFaculty.map((faculty) => (
            <div
              key={faculty.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 14,
                padding: "14px 20px",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(251,146,60,0.15)",
                    border: "1px solid rgba(99,102,155,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    style={{ width: 18, height: 18 }}
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1a1b2e",
                    }}
                  >
                    {faculty.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 12,
                      color: "#6b7280",
                      marginTop: 2,
                    }}
                  >
                    {faculty.role} ·{" "}
                    {faculty.dept.replace("DEPARTMENT OF ", "")}
                  </div>
                </div>
              </div>
              <button
                className="ps-btn-primary orange"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  fontSize: 13,
                }}
                onClick={() => onAddAppointment(faculty)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: 14, height: 14 }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="ps-table-card">
        {total === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
            }}
          >
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
                    <td className="ps-sl-num">
                      {(page - 1) * PER_PAGE + i + 1}
                    </td>
                    <td className="ps-name-cell">
                      {c.staffName} ({c.id})
                    </td>
                    <td>{c.designation}</td>
                    <td
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {c.contractFrom}
                    </td>
                    <td
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {c.contractTo}
                    </td>
                    <td
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {c.joinDueDate}
                    </td>
                    <td>
                      <button
                        className="ps-icon-btn doc"
                        title="View Documents"
                        onClick={() => onDocs(c)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </button>
                    </td>
                    <td>
                      <button
                        className="ps-icon-btn view"
                        title="View / Edit Tenure"
                        onClick={() => onAction(c)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                    <td>
                      <span
                        className={`ps-badge ${c.status === "VERIFIED" ? "verified" : "pending"}`}
                      >
                        <span className="ps-badge-dot" />
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="ps-icon-btn ext"
                        title="Add Extension"
                        onClick={() => onExtn(c)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="13 17 18 12 13 7" />
                          <polyline points="6 17 11 12 6 7" />
                        </svg>
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
            <span className="ps-page-info">
              {page} of {Math.max(1, Math.ceil(total / PER_PAGE))} pages —{" "}
              {total} records
            </span>
            <div className="ps-page-btns">
              <button
                className="ps-page-btn"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / PER_PAGE)}
              >
                Next
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage(Math.ceil(total / PER_PAGE))}
                disabled={page >= Math.ceil(total / PER_PAGE)}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ── Entry Cards ──────────────────────────────────────────
const EntryCards = ({ onNew, onExtension }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">Appointment Orders</div>
        <div className="ps-inner-sub">Master / Staff Appointment Orders</div>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 20,
        maxWidth: 700,
      }}
    >
      {/* New Appointment */}
      <div
        className="ps-sub-card"
        style={{
          "--sc": "#fb923c",
          "--sg": "rgba(251,146,60,0.15)",
        }}
        onClick={onNew}
      >
        <div className="ps-card-top">
          <div className="ps-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
        </div>

        <div className="ps-card-body">
          <div className="ps-card-title">New Appointment</div>
          <div className="ps-card-desc">
            Create new staff appointments and manage pending uploads.
          </div>
        </div>

        <div className="ps-card-glow-bar" />
      </div>

      {/* Extension */}
      <div
        className="ps-sub-card"
        style={{
          "--sc": "#a78bfa",
          "--sg": "rgba(167,139,250,0.15)",
        }}
        onClick={onExtension}
      >
        <div className="ps-card-top">
          <div className="ps-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </div>
        </div>

        <div className="ps-card-body">
          <div className="ps-card-title">Appointment Extension</div>
          <div className="ps-card-desc">
            Create staff extensions and manage pending uploads.
          </div>
        </div>

        <div className="ps-card-glow-bar" />
      </div>
    </div>
  </>
);

const NewAppointmentMenu = ({ onAddNew, onPendingUploads, onBack }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">New Appointment</div>
        <div className="ps-inner-sub">Choose an action</div>
      </div>

      <button className="ps-back-btn" onClick={onBack}>
        Back
      </button>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 20,
        maxWidth: 700,
      }}
    >
      <div className="ps-sub-card" onClick={onAddNew}>
        <div className="ps-card-body">
          <div className="ps-card-title">Add New Appointment</div>
          <div className="ps-card-desc">Create a fresh appointment order.</div>
        </div>
      </div>

      <div className="ps-sub-card" onClick={onPendingUploads}>
        <div className="ps-card-body">
          <div className="ps-card-title">Pending Uploads</div>
          <div className="ps-card-desc">
            Upload appointment and joining letters.
          </div>
        </div>
      </div>
    </div>
  </>
);

const ExtensionMenu = ({ onAddExtension, onPendingUploads, onBack }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">Appointment Extension</div>
        <div className="ps-inner-sub">Choose an action</div>
      </div>

      <button className="ps-back-btn" onClick={onBack}>
        Back
      </button>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 20,
        maxWidth: 700,
      }}
    >
      <div className="ps-sub-card" onClick={onAddExtension}>
        <div className="ps-card-body">
          <div className="ps-card-title">Add Extension</div>
          <div className="ps-card-desc">Create a new extension order.</div>
        </div>
      </div>

      <div className="ps-sub-card" onClick={onPendingUploads}>
        <div className="ps-card-body">
          <div className="ps-card-title">Pending Uploads</div>
          <div className="ps-card-desc">
            Upload extension and rejoining letters.
          </div>
        </div>
      </div>
    </div>
  </>
);

// ── New Appointment Flow ─────────────────────────────────
// CHANGED: added submittedContracts list shown below project selector
const NewAppointmentFlow = ({ onBack, onPreviewReport }) => {
  const [step, setStep] = useState("project");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  // CHANGED: state to hold all submitted contracts for the list
  const [faculty, setFaculty] = useState([]);
  useEffect(() => {
    if (selectedProject) {
      fetchFaculty(selectedProject);
    }
  }, [selectedProject]);

  const fetchFaculty = async (projectId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/project-staff/project/${projectId}`,
      );

      console.log("PROJECT FACULTY", res.data);

      setFaculty(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // const [submittedContracts, setSubmittedContracts] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects/eligible-staff-projects",
      );

      console.log("APPOINTMENT PROJECTS", res.data);

      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  if (step === "form" && selectedFaculty) {
    return (
      <NewContractForm
        projectId={selectedProject}
        facultyId={selectedFaculty.id}
        staffName={selectedFaculty.staff_name}
        designation={selectedFaculty.designation}
        onSave={async (form) => {
          try {
            const formData = new FormData();

            formData.append("staffId", selectedFaculty.id);

            formData.append("appointment_order_no", form.appointmentOrderNo);

            formData.append(
              "appointment_order_date",
              form.appointmentOrderDate,
            );

            formData.append("contract_period_from", form.contractFrom);

            formData.append("contract_period_upto", form.contractTo);

            console.log("FORM RECEIVED =", form);

            formData.append(
              "joining_due_date",
              form.joinDueDate || form.joining_due_date || "",
            );

            formData.append("fixed_salary", form.fixedSalary);

            formData.append("hra", form.hra);

            if (form.minutesFile) {
              formData.append("minutesFile", form.minutesFile);
            }

            await axios.post(
              "http://localhost:5000/api/project-staff/appointment",
              formData,
            );

            alert("Appointment Saved");

            setStep("project");
          } catch (err) {
            console.error(err);
          }
        }}
        onBack={() => setStep("faculty")}
      />
    );
  }

  if (step === "faculty") {
    const projectFaculty = faculty;
    const project = projects.find(
      (p) => Number(p.id) === Number(selectedProject),
    );
    return (
      <>
        <div className="ps-inner-header">
          <div className="ps-inner-title-wrap">
            <div className="ps-inner-title">Select Faculty</div>
            <div className="ps-inner-sub">
              {project ? project.project_title : ""}
            </div>
          </div>
          <button className="ps-back-btn" onClick={() => setStep("project")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 700,
          }}
        >
          {projectFaculty.map((faculty) => (
            <div
              key={faculty.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: 14,
                padding: "18px 22px",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(251,146,60,0.12)",
                    border: "1px solid rgba(251,146,60,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    style={{ width: 20, height: 20 }}
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#1a1b2e",
                    }}
                  >
                    {faculty.staff_name}
                  </div>
                  <div
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 12,
                      color: "#6b7280",
                      marginTop: 3,
                    }}
                  >
                    {faculty.designation}
                  </div>
                  <div
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 11,
                      color: "#9ca3af",
                      marginTop: 1,
                    }}
                  >
                    {faculty.department}
                  </div>
                </div>
              </div>
              <button
                className="ps-btn-primary orange"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  fontSize: 13,
                }}
                onClick={() => {
                  setSelectedFaculty(faculty);
                  setStep("form");
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: 14, height: 14 }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Appointment
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  // CHANGED: project selection step now also shows the submitted list below
  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">New Appointment</div>
          <div className="ps-inner-sub">Select project first</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
      <div className="ps-form-panel" style={{ maxWidth: 560 }}>
        <div className="ps-form-section-label">Choose Project</div>
        <div className="ps-field" style={{ marginBottom: 24 }}>
          <label>
            Project<span className="req">*</span>
          </label>
          <select
            className="ps-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select a Project --</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_title}
              </option>
            ))}
          </select>
        </div>
        <div
          className="ps-form-actions"
          style={{
            borderTop: "none",
            paddingTop: 0,
            marginTop: 0,
            justifyContent: "flex-start",
          }}
        >
          <button
            className="ps-btn-primary orange"
            disabled={!selectedProject}
            onClick={() => setStep("faculty")}
          >
            View Faculty →
          </button>
        </div>
      </div>

      {/* CHANGED: Submitted appointments list shown below project selector */}
    </>
  );
};

// ── Extension Project View ───────────────────────────────
// CHANGED: added submittedExtensions state and list shown below the contracts table
const ExtensionProjectView = ({
  contracts,
  onBack,
  onPreviewReport,
  submittedExtensions,
  setSubmittedExtensions,
}) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [showExtnForm, setShowExtnForm] = useState(false);
  const [targetContract, setTargetContract] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/project-staff/pending-appointments",
      );

      setPendingAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // CHANGED: submitted extensions list state
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects/eligible-staff-projects",
      );

      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleExtn = (c) => {
    setTargetContract(c);
    setShowExtnForm(true);
  };
  const [, setPendingExtensions] = useState([]);

  useEffect(() => {
    fetchPendingExtensions();
  }, []);

  const fetchPendingExtensions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/project-staff/pending-extensions",
      );
      setPendingExtensions(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  if (showExtnForm && targetContract) {
    return (
      <ExtensionForm
        contract={targetContract}
        projectId={targetContract.project_id || selectedProject}
        facultyId={targetContract.id}
        onSave={async (form) => {
          try {
            const formData = new FormData();
            formData.append("project_faculty_id", targetContract.id);
            formData.append(
              "project_id",
              targetContract.project_id || selectedProject,
            );
            formData.append("extension_order_no", form.extnOrderNo);
            formData.append("extension_order_date", form.extnOrderDate);
            formData.append("extension_from", form.extnFrom);
            formData.append("extension_upto", form.extnTo);
            formData.append("rejoin_due_date", form.rejoinDueDate || "");
            formData.append("fixed_salary", form.fixedSalary);
            formData.append("hra", form.hra);
            if (form.appraisalFile) {
              formData.append("appraisalFile", form.appraisalFile);
            }
            await axios.post(
              "http://localhost:5000/api/project-staff/extension/create",
              formData,
            );
            alert("Extension saved successfully.");
            setShowExtnForm(false);
          } catch (err) {
            console.error(err);
            alert("Failed to save extension.");
          }
        }}
        onBack={() => setShowExtnForm(false)}
      />
    );
  }

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Appointment Extension</div>
          <div className="ps-inner-sub">Select a project to view staff</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>
      <div className="ps-project-selector-bar" style={{ marginBottom: 24 }}>
        <div className="ps-project-selector-inner">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              width: 16,
              height: 16,
              color: "#6b7280",
              flexShrink: 0,
            }}
          >
            <path d="M3 7a2 2 0 012-2h4l2 3H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <label
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 13,
              color: "#6b7280",
              whiteSpace: "nowrap",
            }}
          >
            Select Project
          </label>
          <select
            className="ps-select"
            style={{ flex: 1, maxWidth: 420 }}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Choose a Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.project_title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedProject ? (
        <div className="ps-table-card">
          {pendingAppointments.filter(
            (c) => Number(c.project_id) === Number(selectedProject),
          ).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              No contracts found for this project.
            </div>
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
                  {pendingAppointments
                    .filter(
                      (c) => Number(c.project_id) === Number(selectedProject),
                    )
                    .map((c, i) => (
                      <tr key={c.id}>
                        <td className="ps-sl-num">{i + 1}</td>

                        <td className="ps-name-cell">{c.staff_name}</td>

                        <td>{c.designation}</td>

                        <td
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {fmtDate(c.contract_period_from) || "-"}
                        </td>

                        <td
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {fmtDate(c.contract_period_upto) || "-"}
                        </td>
                        <td>
                          <span
                            className={`ps-badge ${
                              c.status === "Appointed" ? "verified" : "pending"
                            }`}
                          >
                            <span className="ps-badge-dot" />
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="ps-icon-btn ext"
                            title="Add Extension"
                            onClick={() => handleExtn(c)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="13 17 18 12 13 7" />
                              <polyline points="6 17 11 12 6 7" />
                            </svg>
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
        <div
          className="ps-table-card"
          style={{ padding: "48px 20px", textAlign: "center" }}
        >
          <div
            style={{
              color: "#9ca3af",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
            }}
          >
            Please select a project to view staff contracts.
          </div>
        </div>
      )}
    </>
  );
};

// ── Main AppointmentOrders Component ─────────────────────
const AppointmentOrders = ({ onBack }) => {
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [view, setView] = useState("entry");
  const [target, setTarget] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState("new");
  const [reportProjectId, setReportProjectId] = useState("");
  const [reportFacultyId, setReportFacultyId] = useState("");
  const [listProjectId, setListProjectId] = useState("");
  // CHANGED: track where to return after viewing a report from the submitted list
  const [reportReturnView, setReportReturnView] = useState("entry");
  const [screen, setScreen] = useState("home");
  // const [submittedAppointments, setSubmittedAppointments] = useState([]);
  const [submittedExtensions, setSubmittedExtensions] = useState([
    {
      id: 1001,
      projectId: "P001",
      facultyId: "F001",
      staffName: "Dr. Siva Kumar",
      designation: "Project Associate",
      revisedEndDate: "31-12-2026",
      reason: "Additional experimental validation required",
      requestStatus: "Under Review",
      submittedDate: "04-06-2026",
    },
    {
      id: 1002,
      projectId: "P002",
      facultyId: "F002",
      staffName: "Dr. Priya",
      designation: "Research Assistant",
      revisedEndDate: "30-09-2026",
      reason: "Project deliverables pending",
      requestStatus: "Approved",
      submittedDate: "03-06-2026",
    },
  ]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/project-staff/pending-appointments",
      );

      console.log("PENDING", res.data);

      setPendingAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // CHANGED: handler called by both NewAppointmentFlow and ExtensionProjectView when Preview is clicked
  const handlePreviewReport = (data, type, pid, fid, returnView) => {
    setReportData(data);
    setReportType(type);
    setReportProjectId(pid);
    setReportFacultyId(fid || "");
    setReportReturnView(
      returnView || (type === "new" ? "new-flow" : "extn-flow"),
    );
    setView("report");
  };
  const [pendingExtensions, setPendingExtensions] = useState([]);

  const fetchPendingExtensions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/project-staff/pending-extensions",
      );
      setPendingExtensions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPendingExtensions();
  }, []);
  return (
    <div className="ps-inner">
      <div style={{ marginBottom: 20 }}>
        <button
          className="ps-back-btn"
          onClick={() => {
            if (view !== "entry") {
              setView("entry");
              setScreen("home");
            } else if (screen !== "home") {
              setScreen("home");
            } else {
              onBack();
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {view === "entry" ? "Project Staff" : "Appointment Orders"}
        </button>
      </div>

      {view === "entry" && screen === "home" && (
        <EntryCards
          onNew={() => setScreen("new-menu")}
          onExtension={() => setScreen("extension-menu")}
        />
      )}
      {view === "entry" && screen === "new-menu" && (
        <NewAppointmentMenu
          onAddNew={() => setView("new-flow")}
          onPendingUploads={() => setScreen("pending-new")}
          onBack={() => setScreen("home")}
        />
      )}

      {view === "entry" && screen === "extension-menu" && (
        <ExtensionMenu
          onAddExtension={() => setView("extn-flow")}
          onPendingUploads={() => setScreen("pending-extension")}
          onBack={() => setScreen("home")}
        />
      )}

      {view === "entry" && screen === "pending-new" && (
        <SubmittedAppointmentsList
          items={pendingAppointments}
          onPreview={(item) => {
            setReportData(item);
            setReportType("new");
            setReportProjectId(item.project_id);
            setReportFacultyId(item.id);
            setView("report");
          }}
        />
      )}

      {view === "entry" && screen === "pending-extension" && (
        <SubmittedExtensionsList
          items={pendingExtensions}
          onRefresh={fetchPendingExtensions}
          onPreview={(item) => {
            setReportFacultyId(item.id); // extension row id → hits /extension-report/:extensionId
            setReportType("extension");
            setReportReturnView("pending-extension");
            setView("report");
          }}
        />
      )}

      {/* CHANGED: NewAppointmentFlow now manages its own submitted list and calls onPreviewReport */}
      {view === "new-flow" && (
        <NewAppointmentFlow
          onBack={() => setView("entry")}
          onPreviewReport={(data, type, pid, fid) =>
            handlePreviewReport(data, type, pid, fid, "new-flow")
          }
        />
      )}

      {/* CHANGED: ExtensionProjectView now manages its own submitted list and calls onPreviewReport */}
      {view === "extn-flow" && (
        <ExtensionProjectView
          contracts={contracts}
          submittedExtensions={submittedExtensions}
          setSubmittedExtensions={setSubmittedExtensions}
          onBack={() => setView("entry")}
          onPreviewReport={(data, type, pid, fid) =>
            handlePreviewReport(data, type, pid, fid, "extn-flow")
          }
        />
      )}

      {view === "report" && reportData && (
        <AppointmentReport
          data={reportData}
          type={reportType}
          projectId={reportProjectId}
          facultyId={reportFacultyId}
          onBack={() => setView(reportReturnView)}
        />
      )}

      {view === "list" && (
        <FacultyStaffTable
          contracts={contracts}
          projectId={listProjectId}
          onAddAppointment={(staff) => {
            // Ensure staff.id represents the database integer primary key
            // corresponding to the `project_faculty_details` table id.
            setReportFacultyId(Number(staff.id));
            setView("report");
          }}
          onDocs={(c) => {
            setTarget(c);
            setView("docs");
          }}
          onAction={(c) => {
            setTarget(c);
            setView("action");
          }}
          onExtn={(c) => {
            setTarget(c);
            setListProjectId(c.projectId);
            setView("extn-flow");
          }}
        />
      )}
      {view === "docs" && target && (
        <DocumentViewer contract={target} onBack={() => setView("list")} />
      )}
      {view === "action" && target && (
        <TenureEdit
          contract={target}
          onSave={(form) => {
            setContracts((prev) =>
              prev.map((c) => (c.id === target.id ? { ...c, ...form } : c)),
            );
            setView("list");
          }}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
};

export default AppointmentOrders;
