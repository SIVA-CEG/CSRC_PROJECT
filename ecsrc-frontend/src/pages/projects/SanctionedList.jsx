import React, { useState, useEffect } from "react";
import "./SanctionedList.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
// ─── Data ────────────────────────────────────────────────

const FUNDING_AGENCIES = [
  "AICTE",
  "ANRF",
  "Anusandhan National Research Foundation",
  "ARG",
  "Aeronautics Research and Development Board",
  "Australia-India Cyber and Critical Technology Partnership Grant Round 4",
  "Biotechnology Industry Research Assistance Council (BIRAC)",
  "Central Council for Research in Unani Medicine (CCRUM)",
  "Central Power Research Institute",
  "Centre for Medical Electronics",
  "Centre for Research, Anna University",
  "Chennai Metropolitan Water Supply and Sewerage Board",
  "Chief Minister Research Grant (CMRG)",
  "CHIP to Startups",
  "CMR",
  "CMRG",
  "Council of Scientific and Industrial Research",
  "CSIR",
  "CSIR-ASPIRE",
  "CVRDE",
  "DBT",
  "DBT Network Project",
  "DBT-BIRAC",
  "DBT, Government of India",
  "Defence Research and Development Organisation",
  "Defence R&D Organisation",
  "Department of Biotechnology",
  "Department of Environment, Government of Tamil Nadu",
  "Department of Science and Technology",
  "Department of Science and Technology (DST)",
  "Department of Science and Technology (TIDE)",
  "Department of Science and Technology (WTC)",
  "Department of Science and Technology, New Delhi",
  "Department of Science and Technology, New Delhi (STW)",
  "Department of Telecommunications - Bharat 5G Labs",
  "Department of Telecommunications - USOF",
  "Dhaksha Unmanned Systems Pvt. Ltd.",
  "DHR",
  "Directorate General of Civil Aviation (DGCA)",
  "Directorate of Futuristic Technology Management, DRDO",
  "Directorate of Technical Education (DoTE)",
  "DRDL",
  "DRDO",
  "DST",
  "DST DAAD",
  "DST VAIBHAV Fellowship",
  "DST-FICCI",
  "DST-JSPS Joint Research Project",
  "EDALL Systems",
  "FSSAI",
  "Good Food Institute",
  "Google",
  "Government of India Ministry of Electronics and Information Technology",
  "MeitY R&D II Group",
  "Higher Education Financing Agency",
  "HEFA",
  "ICMR",
  "ICSSR",
  "IGSTC",
  "IIT Kanpur",
  "IKS",
  "IKS BGS Samvahan Karyakram",
  "IKS Division of MoE, New Delhi",
  "INAE",
  "INCOIS",
  "Indian Council of Agricultural Research",
  "Indian Council of Medical Research",
  "Indian Council of Medical Research (ICMR)",
  "Indian Council of Social Science Research (ICSSR)",
  "Indian Institute of Science",
  "Indian Space Research Organisation",
  "Indo-German Science & Technology Centre",
  "Indo-German Science & Technology Centre (IGSTC)",
  "Indo-U.S. Science and Technology Forum",
  "INSA",
  "Integrated Child Development Services",
  "Inter-University Accelerator Centre",
  "ISRO",
  "IUAC",
  "L&T",
  "Madras Fertilizers Limited (MFL)",
  "Masaero Innovations",
  "MathWorks",
  "MeitY",
  "Microsoft Academic Partnership Grant 2024",
  "Ministry of AYUSH, Government of India",
  "Ministry of Communications",
  "Ministry of Earth Sciences",
  "Ministry of Education (MoE)",
  "Ministry of Electronics and Information Technology",
  "Ministry of Electronics and Information Technology (MeitY)",
  "Ministry of Environment, Forest and Climate Change",
  "Ministry of Food Processing Industries",
  "Ministry of Jal Shakti",
  "Ministry of Mines",
  "Ministry of New and Renewable Energy",
  "Ministry of New and Renewable Energy (MNRE)",
  "Ministry of Panchayati Raj",
  "Ministry of Textiles",
  "Ministry of Water Resources",
  "MNRE",
  "MoFPI",
  "NABARD",
  "National Bank for Agriculture and Rural Development",
  "National Human Rights Commission",
  "National Institute of Urban Affairs (NIUA)",
  "National Medicinal Plants Board",
  "National Remote Sensing Centre (NRSC)",
  "National Technical Textile Mission",
  "NCERT",
  "NIOS, Ministry of Education",
  "NLC India Limited",
  "Norwegian Council of Research",
  "Office of Principal Accountant General (Audit-II), Odisha",
  "Petroleum Conservation and Research Association (PCRA)",
  "Power Grid Centre of Excellence in Cyber Security",
  "Principal Accountant General (Audit-II), Odisha",
  "Science and Engineering Research Board",
  "Science and Engineering Research Board, New Delhi",
  "Science and Engineering Research Board, New Delhi (Power)",
  "SERB",
  "SERB Overseas Visiting Doctoral Fellowship",
  "SERB POWER",
  "SERB-SURE",
  "Space Application Centre, Ahmedabad",
  "SPARC",
  "SPARC-UKIERI",
  "SREE PVF",
  "State Development Policy Council (SDPC)",
  "SURE",
  "Suzuki Innovation Centre",
  "Tamil Nadu Forest Department",
  "Tamil Nadu Forest Department - State Forest Research Institute",
  "Tamil Nadu Innovation Initiatives",
  "Tamil Nadu Innovation Initiatives (TANII)",
  "Tamil Nadu State Council for Higher Education",
  "Tamil Nadu State Council for Science and Technology",
  "Tamil Nadu State Land Use Research Board (TNSLURB)",
  "Tamil Nadu State Wetland Authority",
  "Tamil Virtual Academy",
  "Tamil Nadu Agricultural University",
  "Tamil Nadu Power Distribution Corporation Limited",
  "TANGEDCO",
  "TANII",
  "TANII State Planning Commission",
  "Technology Development Projects (TDP)",
  "TEXMiN",
  "TIH Foundation for IoT & IoE",
  "TIH-IoT",
  "TNPCB",
  "TNRPF",
  "TNSCST",
  "TNSCT",
  "UGC",
  "UGC-DAE CSR",
  "UK Aid",
  "UKIERI",
  "United Nations Children's Fund (UNICEF)",
  "University of Bath",
  "Welkinrim Technologies Pvt. Ltd., Chennai",
  "Wellcome Trust-India Alliance",
  "WISER",
  "Xagrotor Tek Private Limited",
].sort();

// ─── Helpers ─────────────────────────────────────────────
const fmt = (n) => {
  const num = parseFloat(n);
  return isNaN(num) || num === 0 ? "—" : num.toFixed(2);
};

const fmtINR = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num === 0) return "—";
  return num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
};

// Overhead is split as 5:4:4:2 of total overhead (15 parts)
const calcOverhead = (totalOverhead) => {
  const oh = parseFloat(totalOverhead) || 0;
  const reg5 = oh * (5 / 15);
  const dean4 = oh * (4 / 15);
  const csrc4 = oh * (4 / 15);
  const pdf2 = oh * (2 / 15);
  return { reg5, dean4, csrc4, pdf2, total: oh };
};

const calcInstTotal = (inst) => {
  const equipTotal = (inst.equipment || []).reduce(
    (sum, eq) => sum + Number(eq.amount || 0),
    0,
  );

  const manpower = (inst.manpowerList || []).reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0,
  );

  const consumables = parseFloat(inst.consumables) || 0;
  const travel = parseFloat(inst.travel) || 0;
  const contingency = parseFloat(inst.contingency) || 0;
  const ssrBudget = parseFloat(inst.ssrBudget) || 0;

  const nonRecurring = equipTotal;

  const recurring = manpower + consumables + travel + contingency + ssrBudget;

  const calculatedOverhead = (nonRecurring + recurring) * 0.15;

  const oh = calcOverhead(calculatedOverhead);

  const grandTotal = nonRecurring + recurring + oh.total;

  return {
    equipTotal,
    manpower,
    consumables,
    travel,
    contingency,
    ssrBudget,
    nonRecurring,
    recurring,
    ...oh,
    grandTotal,
  };
};

const emptyInstallment = (idx, installment = "") => ({
  installment,

  label: "",

  equipment: [
    {
      name: "",
      amount: "",
    },
  ],

  manpowerList: [
    {
      type: "",
      amount: "",
    },
  ],

  consumables: "",

  travel: "",

  contingency: "",

  overheadTotal: "",

  ssrBudget: "",

  nonRecurringTotal: "",
});

const formatDate = (d) => {
  if (!d) return "___________";
  const parts = d.split("-");
  if (parts.length !== 3) return d;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// ─── Report Generator (A4) ───────────────────────────────
const generateReport = (form, inst) => {
  const t = calcInstTotal(inst);

  const equipmentCount = inst.equipment?.filter((e) => e.name).length || 0;
  const manpowerCount = inst.manpowerList?.filter((m) => m.type).length || 0;
  console.log("PROJECT TITLE:", form.projectTitle);
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Request Sanctioned Project</title>

<style>
  @page {
    size: A4;
    margin: 12mm 12mm 12mm 12mm;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #e5e5e5;
    font-family: "Times New Roman", Times, serif;
    color: #000;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #fff;
    padding: 10mm;
    font-size: 12pt;
    line-height: 1.45;
  }

  @media print {
    html, body {
      background: #fff;
    }

    .page {
      width: auto;
      min-height: auto;
      margin: 0;
      padding: 0;
    }
  }

  .top-title {
    text-align: center;
    font-weight: bold;
    font-size: 13pt;
    text-decoration: underline;
    margin-bottom: 10px;
  }

  .right {
    text-align: right;
  }

  .ref-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .subject {
    margin-top: 16px;
    text-align: justify;
  }

  .subject-title {
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
  }

  .content {
    margin-top: 14px;
    text-align: justify;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 11.5pt;
  }

  th, td {
    border: 1px solid #000;
    padding: 1px 1px;
    vertical-align: top;
  }

  th {
    text-align: center;
    font-weight: bold;
  }

  .sl-col {
    width: 50px;
    text-align: center;
  }

  .amount-col {
    width: 150px;
    text-align: right;
    white-space: nowrap;
  }

  .group-row td {
    font-weight: bold;
  }

  .total-row td {
    font-weight: bold;
  }

  .indent {
    padding-left: 24px;
  }

  .signature {
    margin-top: 60px;
    text-align: right;
    font-weight: bold;
  }

  .to-section {
    margin-top: 2px;
  }

  .copy-section {
    margin-top: 2px;
  }

  .copy-section ol {
    margin-top: 4px;
  }
</style>
</head>

<body>
<div class="page">

  

  <div class="top-title">REQUEST SANCTIONED PROJECT</div>

  <div class="ref-line">
    <div><strong>Ref No:</strong> ${form.refNo || "___________"}</div>
  </div>

  <div class="ref-line">
    <div><strong>Proceeding No:</strong> ${form.proceedingNo || "___________"}</div>
    <div><strong>Date:</strong>
${new Date().toLocaleDateString("en-GB")}</div>
  </div>

  ${form.additionalRefs
    .filter((r) => r.text)
    .map(
      (r) => `
    <div class="ref-line">
      <div><strong>${r.text}</strong></div>
      <div>${r.date ? `<strong>Date:</strong> ${formatDate(r.date)}` : ""}</div>
    </div>
  `,
    )
    .join("")}

  <div class="subject">
    <strong>Sub:</strong>
    ${form.fundingAgency || "Funding Agency"} - Initiation of project
    <strong>${form.projectTitle || "Project Title"}</strong>
    under Principal Investigator
    <strong>${form.piName || "___________"}</strong>,
    ${form.piDept || "___________"},
    ${form.piCampus || "___________"} - Prior sanction approval - reg.
  </div>

  <div class="content">
    With reference to the above, you are permitted to initiate the project.
    The Principal Investigator of the project is
    <strong>${form.piName || "___________"}</strong>,
    <strong>${form.piDept || "___________"}</strong>,
    <strong>${form.piCampus || "___________"}</strong>.
    The head wise breakup for the <strong>${
      inst.installment ? `${inst.installment} Installment` : ""
    }</strong> sanctioned amount is given below.
  </div>

  <table>
    <thead>
      <tr>
        <th class="sl-col">Sl. No.</th>
        <th>Heads</th>
        <th class="amount-col">Amount ₹</th>
      </tr>
    </thead>

    <tbody>
    <td class="sl-col"><B>A</B></td>
        <td><B>Non-Recurring Heads</B></td>
        <td></td>
      <tr>
        <td class="sl-col">1</td>
        <td>
          Equipment
          ${
            equipmentCount > 0
              ? "<br/>" +
                inst.equipment
                  .filter((e) => e.name)
                  .map((e) => `&nbsp;&nbsp;&nbsp;• ${e.name}`)
                  .join("<br/>")
              : ""
          }
          <br/>
          <strong>No. of equipment types:</strong> ${equipmentCount}
        </td>
        <td class="amount-col">${fmtINR(t.equipTotal)}</td>
      </tr>

      <tr class="group-row">
        <td class="sl-col">B</td>
        <td>Recurring Heads</td>
        <td></td>
      </tr>

      <tr>
        <td class="sl-col">1</td>
        <td>
          Manpower
          ${
            manpowerCount > 0
              ? "<br/>" +
                inst.manpowerList
                  .filter((m) => m.type)
                  .map((m) => `&nbsp;&nbsp;&nbsp;• ${m.type}`)
                  .join("<br/>")
              : ""
          }
          <br/>
          <strong>No. of manpower types:</strong> ${manpowerCount}
        </td>
        <td class="amount-col">${fmtINR(t.manpower)}</td>
      </tr>

      <tr>
        <td class="sl-col">2</td>
        <td>Consumables & Accessories</td>
        <td class="amount-col">${fmtINR(t.consumables)}</td>
      </tr>

      <tr>
        <td class="sl-col">3</td>
        <td>Travel</td>
        <td class="amount-col">${fmtINR(t.travel)}</td>
      </tr>

      <tr>
        <td class="sl-col">4</td>
        <td>Contingency</td>
        <td class="amount-col">${fmtINR(t.contingency)}</td>
      </tr>

      <tr class="group-row">
        <td class="sl-col">C</td>
        <td>Overhead</td>
        <td class="amount-col">${fmtINR(t.total)}</td>
      </tr>

      <tr>
        <td class="sl-col">5</td>
        <td class="indent">The Registrar A/C, Chennai 5%</td>
        <td class="amount-col">${fmtINR(t.reg5)}</td>
      </tr>

      <tr>
        <td class="sl-col">6</td>
        <td class="indent">The Dean, Campus A/C 4%</td>
        <td class="amount-col">${fmtINR(t.dean4)}</td>
      </tr>

      <tr>
        <td class="sl-col">7</td>
        <td class="indent">CSRC Revenue, Chennai 4%</td>
        <td class="amount-col">${fmtINR(t.csrc4)}</td>
      </tr>

      <tr>
        <td class="sl-col">8</td>
        <td class="indent">The Principal Investigator PDF 2%</td>
        <td class="amount-col">${fmtINR(t.pdf2)}</td>
      </tr>

      <tr>
        <td class="sl-col"><B>D</B></td>
        <td><B>Scientific Social Responsibility Budget Detail</B></td>
        <td class="amount-col">${fmtINR(t.ssrBudget)}</td>
      </tr>

      <tr class="total-row">
        <td colspan="2" style="text-align:right;">Total</td>
        <td class="amount-col">${fmtINR(t.grandTotal)}</td>
      </tr>
    </tbody>
  </table>

  <div class="content">
    The items and consumables as detailed in your project may be purchased
    by following the University guidelines / rules in force at Anna University.
    The utilization of Contingency and Travel shall be as per the rules and
    regulations specified by Anna University.
  </div>

  <div class="signature">
    SIGNATURE
  </div>

</div>
</body>
</html>`;

  return html;
};

// ─── Search Input ────────────────────────────────────────
const SearchInput = ({ placeholder, value, onChange }) => (
  <div className="search-wrap">
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
    <input
      className="sanctioned-search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// ─── Tab 1: Sanctioned List ──────────────────────────────

const SanctionedProjectDetails = ({ project, details, onBack }) => {
  const [installmentUploads, setInstallmentUploads] = useState({});

  const handleInstallmentUpload = (idx, file) => {
    setInstallmentUploads((prev) => ({ ...prev, [idx]: file || null }));
  };
  const totalEquipment =
    details
      ?.filter((row) => row.equipment)
      .reduce((sum, row) => sum + Number(row.equipment_amount || 0), 0) || 0;

  const totalManpower =
    details
      ?.filter((row) => row.manpower_type)
      .reduce((sum, row) => sum + Number(row.manpower_amount || 0), 0) || 0;

  const recurringTotals =
    details?.reduce(
      (sum, row) =>
        sum +
        Number(row.consumables || 0) +
        Number(row.travel || 0) +
        Number(row.contingency || 0) +
        Number(row.total_overhead || 0),
      0,
    ) || 0;

  const totalSanctioned = totalEquipment + totalManpower + recurringTotals;

  const totalUtilized = 0;
  console.log("DETAILS", details?.[0]);
  const totalBalance = totalSanctioned - totalUtilized;
  return (
    <div className="sl-tab-content">
      <div className="sanctioned-detail-card">
        <div className="sanctioned-detail-top">
          <button className="sanctioned-page-btn" onClick={onBack}>
            ← Back
          </button>

          <div>
            <h2 className="sanctioned-detail-title">
              Project Sanction Details
            </h2>
            <p className="sanctioned-detail-sub">
              Project ID: {project.project_id}
            </p>
          </div>
        </div>
        {console.log(details)}
        <div className="sanctioned-detail-grid">
          <div>
            <span>Project Title</span>
            <strong>{details?.[0]?.project_title}</strong>
          </div>
          <div>
            <span>Project Period</span>
            <p>
              {details?.[0]?.project_start_date
                ? new Date(details[0].project_start_date).toLocaleDateString(
                    "en-GB",
                  )
                : "-"}
              {" to "}
              {details?.[0]?.project_end_date
                ? new Date(details[0].project_end_date).toLocaleDateString(
                    "en-GB",
                  )
                : "-"}
            </p>
          </div>
          <div>
            <span>Total Cost</span>
            <strong>₹ {fmtINR(details?.[0]?.total_amount || 0)}</strong>
          </div>
          <div>
            <span>Funding Agency</span>
            <strong>{details?.[0]?.funding_agency}</strong>
          </div>
          <div>
            <span>Principal Investigator</span>
            <strong>{details?.[0]?.full_name}</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{details?.[0]?.department}</strong>
          </div>
        </div>

        <div className="sanctioned-upload-options">
          <label className="sanctioned-upload-box">
            <span>Upload Letter from Funding Agency</span>
            {details?.[0]?.sanction_letter_path ? (
              <a
                href={`http://localhost:5000/${details[0].sanction_letter_path}`}
                target="_blank"
                rel="noreferrer"
              >
                View Letter
              </a>
            ) : (
              <p>Not Uploaded</p>
            )}
          </label>

          <label className="sanctioned-upload-box">
            <span>Upload Approval Letter from CSRC</span>

            {details?.[0]?.pdf_file ? (
              <a
                href={`http://localhost:5000${details[0].pdf_file}`}
                target="_blank"
                rel="noreferrer"
              >
                View Approval Letter
              </a>
            ) : (
              <p>Not Uploaded</p>
            )}
          </label>
        </div>

        {details
          ?.filter((inst) => inst.approval_status === "Approved")
          .map((inst, idx) => {
            const isSanctionRefUploaded = !!installmentUploads[idx];

            return (
              <div className="sanctioned-inst-card" key={idx}>
                <div className="sanctioned-inst-header">
                  <h3>
                    {inst.installment ? `${inst.installment} Installment` : ""}
                  </h3>
                  <span
                    className={
                      isSanctionRefUploaded ? "uploaded" : "not-uploaded"
                    }
                  >
                    {isSanctionRefUploaded ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>

                <div className="sanctioned-detail-grid small">
                  <div>
                    <span>Sanction Reference</span>
                    <strong>
                      {inst?.report_path
                        ? inst.report_path.split("\\").pop()
                        : "Not Uploaded"}
                    </strong>

                    {inst?.report_path && (
                      <a
                        href={`http://localhost:5000/${inst.report_path.replace(/\\/g, "/")}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: "10px" }}
                      >
                        View
                      </a>
                    )}
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>
                      {inst.installment_date
                        ? new Date(inst.installment_date).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </strong>
                  </div>
                  <div>
                    <span>Installment No.</span>
                    <strong>{inst.installment}</strong>
                  </div>
                  <div>
                    <span>Sanction Type</span>
                    <strong>{inst.sanctionType}</strong>
                  </div>
                  <div>
                    <span>CTDT</span>
                    <strong>{inst.ctdt}</strong>
                  </div>
                  <div>
                    <span>Sanction Ref</span>
                    <label className="sanctioned-inline-upload">
                      <strong>
                        {isSanctionRefUploaded
                          ? installmentUploads[idx].name
                          : "Upload"}
                      </strong>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleInstallmentUpload(idx, e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="table-scroll-wrap">
                  <table className="sanctioned-table sanctioned-detail-table">
                    <thead>
                      <tr>
                        <th>Sl. No.</th>
                        <th>Heads</th>
                        <th>Sanctioned Amount (₹)</th>
                        <th>Utilized Amount (₹)</th>
                        <th>Balance Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inst?.equipments?.map((eq, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{eq.equipment}</td>
                          <td>{fmtINR(eq.amount)}</td>
                          <td>0</td>
                          <td>{fmtINR(eq.amount)}</td>
                        </tr>
                      ))}
                      {inst?.manpowers?.map((mp, index) => (
                        <tr key={`mp-${index}`}>
                          <td>{index + 1}</td>
                          <td>{mp.manpower_type}</td>
                          <td>{fmtINR(mp.amount)}</td>
                          <td>0</td>
                          <td>{fmtINR(mp.amount)}</td>
                        </tr>
                      ))}

                      <tr>
                        <td>3</td>
                        <td>Consumables</td>
                        <td>{fmtINR(inst.consumables || 0)}</td>
                        <td>0</td>
                        <td>{fmtINR(inst.consumables || 0)}</td>
                      </tr>

                      <tr>
                        <td>4</td>
                        <td>Travel</td>
                        <td>{fmtINR(inst.travel || 0)}</td>
                        <td>0</td>
                        <td>{fmtINR(inst.travel || 0)}</td>
                      </tr>

                      <tr>
                        <td>5</td>
                        <td>Contingency</td>
                        <td>{fmtINR(inst.contingency || 0)}</td>
                        <td>0</td>
                        <td>{fmtINR(inst.contingency || 0)}</td>
                      </tr>

                      <tr>
                        <td>6</td>
                        <td>Overhead</td>
                        <td>{fmtINR(inst.total_overhead || 0)}</td>
                        <td>0</td>
                        <td>{fmtINR(inst.total_overhead || 0)}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>TOTAL</td>

                        <td>{fmtINR(totalSanctioned)}</td>

                        <td>{fmtINR(totalUtilized)}</td>

                        <td>{fmtINR(totalBalance)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const SanctionedListTab = () => {
  const [searchFile, setSearchFile] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectDetails, setProjectDetails] = useState(null);
  const recordsPerPage = 5;
  const [approvedProjects, setApprovedProjects] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/approvals/approved")
      .then((res) => {
        console.log("APPROVED PROJECTS", res.data);

        const formatted = res.data.map((item, index) => ({
          sl: index + 1,

          fileNo: item.project_id,

          title: item.project_title,

          cost: item.total_amount,

          ...item,
        }));

        setApprovedProjects(formatted);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFile, searchTitle]);
  const filtered = approvedProjects.filter(
    (d) =>
      (d.project_id + "").toLowerCase().includes(searchFile.toLowerCase()) &&
      (d.project_title || "").toLowerCase().includes(searchTitle.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;

  const paginatedData = filtered.slice(startIndex, startIndex + recordsPerPage);
  if (selectedProject) {
    return (
      <SanctionedProjectDetails
        project={selectedProject}
        details={projectDetails}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="sl-tab-content">
      <div className="sanctioned-table-card">
        <div className="sanctioned-table-header">
          <div className="header-left">
            <span className="sanctioned-table-title">Sanctioned Projects</span>
            <span className="sanctioned-count-badge">
              {filtered.length} of {approvedProjects.length} records
            </span>
          </div>
          <div className="sanctioned-search-wrap">
            <SearchInput
              placeholder="Search File No..."
              value={searchFile}
              onChange={(e) => setSearchFile(e.target.value)}
            />
            <SearchInput
              placeholder="Search Title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll-wrap">
          <table className="sanctioned-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>File No</th>
                <th>Project Title</th>
                <th>Total Cost (₹)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.sl}>
                    <td className="sl-num">
                      {startIndex + 1 + paginatedData.indexOf(item)}
                    </td>
                    <td className="file-no-cell">{item.project_id}</td>
                    <td className="title-cell">{item.project_title}</td>
                    <td className="sanctioned-cost-cell">
                      ₹ {item.total_amount}
                    </td>
                    <td>
                      <button
                        className="sanctioned-view-btn"
                        title="View details"
                        onClick={async () => {
                          try {
                            console.log("VIEW BUTTON CLICKED", item.project_id);

                            const res = await axios.get(
                              `http://localhost:5000/api/approvals/project-details/${item.project_id}`,
                            );

                            console.log("DETAIL RESPONSE", res.data);
                            setProjectDetails(res.data.projectDetails);
                            console.log("DETAILS LENGTH", res.data.length);
                            //console.log("DETAILS", res.data);
                            //setProjectDetails(res.data);

                            setSelectedProject(item);
                          } catch (err) {
                            console.log(err);
                          }
                        }}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="sanctioned-pagination">
          <button
            className="sanctioned-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            « First
          </button>

          <button
            className="sanctioned-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ‹ Prev
          </button>

          <span className="sanctioned-page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="sanctioned-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next ›
          </button>

          <button
            className="sanctioned-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Card ────────────────────────────────────────
const SectionCard = ({ icon, title, accent = "#00b4ff", children, action }) => (
  <div className="sl-section-card" style={{ "--accent": accent }}>
    <div className="sl-section-header">
      <div className="sl-section-icon">{icon}</div>
      <h3>{title}</h3>
      {action && <div className="sl-section-action">{action}</div>}
    </div>
    <div className="sl-section-body">{children}</div>
  </div>
);

// ─── Field ───────────────────────────────────────────────
const Field = ({ label, wide, children }) => (
  <div className={`sl-field${wide ? " sl-field-wide" : ""}`}>
    <label>{label}</label>
    {children}
  </div>
);

// ─── Tab 2: Request ──────────────────────────────────────
const RequestTab = ({ onSubmit }) => {
  const [form, setForm] = useState({
    projectTitle: "",
    selectedProjectTitle: "",
    fundingAgency: "",
    refNo: "",
    refDate: "",
    proceedingNo: "",
    proceedingDate: "",
    additionalRefs: [],
    piName: " ",
    piDept: " ",
    piCampus: " ",
    piDob: " ",
    piService: " ",
    piSuper: " ",
    assistants: [{ id: 1, name: "", role: "", amount: "" }],
    totalSanctioned: "",
    installments: [],
    toDean: "",
    installment: "",
    projectId: "",
    projectStartDate: "",
    projectEndDate: "",
    sanctionLetter: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const fetchProjectsByAgency = async (agency) => {
    console.log("AGENCY SENT:", agency);

    const user = JSON.parse(sessionStorage.getItem("user"));

    console.log("USER:", user);

    const res = await axios.get(
      "http://localhost:5000/api/projects/endorsements",
      {
        params: {
          fundingAgency: agency,
          userId: user.id,
        },
      },
    );

    console.log("RESPONSE:", res.data);

    setProjects(res.data);
  };
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const createPdf = async (inst, mode) => {
    const html = generateReport(form, inst);

    const temp = document.createElement("div");
    temp.innerHTML = html;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    temp.style.top = "0";
    temp.style.width = "210mm";
    document.body.appendChild(temp);

    const page = temp.querySelector(".page");

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    document.body.removeChild(temp);

    const fileName = `CSRC_Request_${
      inst.installment
        ? `${inst.installment} Installment`
        : "".replace(/\s/g, "_")
    }.pdf`;

    const pdfBlob = pdf.output("blob");

    const formData = new FormData();

    formData.append("report", pdfBlob, fileName);

    const uploadRes = await axios.post(
      "http://localhost:5000/api/reports/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const reportPath = uploadRes.data.path;

    console.log("REPORT PATH:", reportPath);

    if (mode === "preview") {
      const url = URL.createObjectURL(pdfBlob);

      window.open(url, "_blank");
    } else {
      pdf.save(fileName);
    }
    return reportPath;
  };

  const handlePreview = (inst) => {
    createPdf(inst, "preview");
  };

  const handleDownload = (inst) => {
    createPdf(inst, "download");
  };
  const user = JSON.parse(sessionStorage.getItem("user"));
  const handleSubmit = async () => {
    try {
      let createdProjectId;

      // Create/Get project first
      try {
        let uploadedFilePath = "";

        if (form.sanctionLetter) {
          const fd = new FormData();

          fd.append("file", form.sanctionLetter);
          console.log("Uploading file...");
          const uploadRes = await axios.post(
            "http://localhost:5000/api/upload/sanction-letter",
            fd,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          uploadedFilePath = uploadRes.data.filePath;
        }
        console.log("Creating project...");
        console.log("SSR BUDGET =", form.installments[0]?.ssrBudget);
        const projectRes = await axios.post(
          "http://localhost:5000/api/projects/create",
          {
            endorsement_id: Number(form.projectTitle),

            project_title: selectedProject?.full_project_title,

            funding_agency: selectedProject?.funding_agency,

            project_start_date: form.projectStartDate,

            project_end_date: form.projectEndDate,

            sanction_letter_path: uploadedFilePath,

            //ssr_budget: form.installments[0]?.ssrBudget || 0,
          },
        );

        createdProjectId = projectRes.data.project
          ? projectRes.data.project.id
          : projectRes.data.id;

        console.log("PROJECT ID:", createdProjectId);
      } catch (err) {
        if (err.response?.data?.project) {
          createdProjectId = err.response.data.project.id;
        } else {
          throw err;
        }
      }

      // Check installment status using REAL PROJECT ID
      const checkInstallment = await axios.get(
        `http://localhost:5000/api/projects/next-installment/${createdProjectId}`,
      );
      console.log("SELECTED PROJECT:", createdProjectId);
      //console.log("PROJECT.ID:", project.id);
      //console.log("PROJECT.PROJECT_ID:", project.project_id);
      //console.log("SELECTED PROJECT", projectRes);
      console.log("CHECK RESULT:", checkInstallment.data);

      if (checkInstallment.data.pendingExists) {
        alert(
          `${checkInstallment.data.nextInstallment} Installment request is already pending approval`,
        );
        return;
      }

      if (
        checkInstallment.data.nextInstallment !==
        form.installments[0].installment
      ) {
        alert(
          `Next allowed installment is ${checkInstallment.data.nextInstallment}`,
        );
        return;
      }

      const reportPath = await createPdf(form.installments[0], "download");

      setSubmitted(true);

      const installmentRes = await axios.post(
        "http://localhost:5000/api/installments/create",
        {
          project_id: createdProjectId,
          installment: form.installments[0]?.installment,
          report_path: reportPath,
        },
      );

      console.log("INSTALLMENT:", installmentRes.data);

      for (const eq of form.installments[0]?.equipment || []) {
        await axios.post("http://localhost:5000/api/non-recurring/create", {
          project_id: createdProjectId,
          installment_id: installmentRes.data.id,
          equipment: eq.name,
          amount: eq.amount,
        });
      }

      for (const m of form.installments[0]?.manpowerList || []) {
        await axios.post("http://localhost:5000/api/manpower/create", {
          project_id: createdProjectId,
          installment_id: installmentRes.data.id,
          manpower_type: m.type,
          amount: m.amount,
        });
      }

      await axios.post("http://localhost:5000/api/recurring/create", {
        project_id: createdProjectId,
        installment_id: installmentRes.data.id,
        consumables: form.installments[0]?.consumables || 0,
        travel: form.installments[0]?.travel || 0,
        contingency: form.installments[0]?.contingency || 0,
        ssr_budget: form.installments[0]?.ssrBudget || 0,
      });

      const t = calcInstTotal(form.installments[0]);

      await axios.post("http://localhost:5000/api/overhead/create", {
        project_id: createdProjectId,
        installment_id: installmentRes.data.id,
        total_overhead: t.total,
        registrar_ac: t.reg5,
        dean_ac: t.dean4,
        csrc_revenue_ac: t.csrc4,
        pi_pdf_ac: t.pdf2,
      });

      await axios.post("http://localhost:5000/api/approvals/create", {
        project_id: createdProjectId,
        installment_id: installmentRes.data.id,
        faculty_id: user.id,
        approval_status: "Pending",
      });

      onSubmit({
        form,
        submittedAt: new Date().toLocaleDateString("en-IN"),
      });
    } catch (err) {
      console.log(err);
      alert("Project creation failed");
    }
  };

  if (submitted)
    return (
      <div className="sl-submitted-banner">
        <div className="sl-submitted-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3>Request Submitted!</h3>
        <p>
          Your request has been forwarded to the CSRC Director. Monitor progress
          in the Approval Status tab.
        </p>
        <button className="sl-back-btn" onClick={() => setSubmitted(false)}>
          Submit Another Request
        </button>
      </div>
    );

  return (
    <div className="sl-request-form">
      {/* Project Info */}
      <SectionCard
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        }
        title="Project Information"
      >
        <div className="sl-fields-grid">
          <Field label="Project Title" wide>
            <select
              className="sl-input"
              value={form.projectTitle}
              onChange={(e) => {
                const project = projects.find(
                  (p) => p.id === Number(e.target.value),
                );

                setSelectedProject(project);

                upd("projectTitle", project.id);

                upd("selectedProjectTitle", project.full_project_title);

                if (project) {
                  upd("fundingAgency", project.funding_agency);

                  upd("totalAmount", project.total_amount || "");
                  upd("refNo", project.reference_number || "");

                  upd(
                    "refDate",
                    project.applied_on ? project.applied_on.split("T")[0] : "",
                  );

                  upd("piName", project.full_name || "");

                  upd("piDept", project.department || "");

                  upd("piCampus", project.campus || "");

                  upd(
                    "piDob",
                    project.dob
                      ? new Date(project.dob).toLocaleDateString("en-GB")
                      : "",
                  );

                  upd(
                    "piService",
                    project.dos
                      ? new Date(project.dos).toLocaleDateString("en-GB")
                      : "",
                  );

                  upd(
                    "piSuper",
                    project.superannuation_date
                      ? new Date(
                          project.superannuation_date,
                        ).toLocaleDateString("en-GB")
                      : "",
                  );
                  axios
                    .get(
                      `http://localhost:5000/api/projects/next-installment/${
                        project.project_id || 0
                      }`,
                    )

                    .then((res) => {
                      console.log("PROJECT OBJECT", project);
                      upd("installment", res.data.nextInstallment);

                      upd("projectId", project.project_id || project.id);

                      const firstInstallment = emptyInstallment(
                        0,
                        res.data.nextInstallment,
                      );

                      firstInstallment.nonRecurringTotal =
                        project.total_amount || 0;

                      upd("installments", [firstInstallment]);

                      console.log("INSTALLMENT:", res.data.nextInstallment);
                      console.log("TOTAL AMOUNT:", project.total_amount);
                    })

                    .catch((err) => {
                      console.log(err);
                    });
                }
              }}
            >
              <option value="">Select Project</option>

              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_project_title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Total Sanctioned Amount (₹)">
            <input
              className="sl-input"
              value={form.totalAmount || ""}
              readOnly
            />
          </Field>

          <Field label="Funding Agency">
            <select
              className="sl-input"
              value={form.fundingAgency}
              onChange={(e) => {
                upd("fundingAgency", e.target.value);

                fetchProjectsByAgency(e.target.value);
              }}
            >
              <option value="">Select Funding Agency</option>
              {FUNDING_AGENCIES.map((agency) => (
                <option key={agency} value={agency}>
                  {agency}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* References */}
      <SectionCard
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
        }
        title="References"
        accent="#a78bfa"
      >
        <div className="sl-fields-grid">
          <Field label="Ref No">
            <input
              className="sl-input"
              placeholder="-"
              value={form.refNo}
              readOnly
              onChange={(e) => upd("refNo", e.target.value)}
            />
          </Field>
          <Field label="Ref Date">
            <input
              className="sl-input"
              type="date"
              value={form.refDate}
              readOnly
              onChange={(e) => upd("refDate", e.target.value)}
            />
          </Field>
        </div>
        {form.installments?.[0]?.installment === "I" && (
          <>
            <div className="sl-fields-grid">
              <Field label="Project Start Date">
                <input
                  className="sl-input"
                  type="date"
                  value={form.projectStartDate}
                  onChange={(e) => upd("projectStartDate", e.target.value)}
                />
              </Field>
            </div>

            <div className="sl-fields-grid">
              <Field label="Project end Date">
                <input
                  className="sl-input"
                  type="date"
                  value={form.projectEndDate}
                  onChange={(e) => upd("projectEndDate", e.target.value)}
                />
              </Field>
            </div>

            <div className="sanctioned-form-group">
              <Field label="Sanction Approval Letter">
                <input
                  className="sl-input"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => upd("sanctionLetter", e.target.files[0])}
                />
              </Field>
            </div>
          </>
        )}
      </SectionCard>

      {/* PI Details */}
      <SectionCard
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        }
        title="Principal Investigator"
        accent="#34d399"
      >
        <div className="sl-pi-banner">
          <div className="sl-pi-main">
            <div className="sl-pi-avatar">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="sl-pi-info">
              <span className="sl-pi-name">{form.piName}</span>
              <span className="sl-pi-dept">
                {form.piDept} • {form.piCampus}
              </span>
            </div>
          </div>
          <div className="sl-pi-meta">
            <div className="sl-pi-meta-item">
              <span className="sl-meta-label">Date of Birth</span>
              <span className="sl-meta-value">{form.piDob}</span>
            </div>
            <div className="sl-pi-meta-item">
              <span className="sl-meta-label">Service Date</span>
              <span className="sl-meta-value">{form.piService}</span>
            </div>
            <div className="sl-pi-meta-item">
              <span className="sl-meta-label">Superannuation</span>
              <span className="sl-meta-value">{form.piSuper}</span>
            </div>
            <span className="sl-role-badge">PI</span>
          </div>
        </div>
      </SectionCard>

      {/* Installments */}
      <SectionCard
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        }
        title="Installments"
        accent="#fbbf24"
      >
        {(form.installments || []).map((inst, idx) => {
          const t = calcInstTotal(inst);
          const updInst = (k, v) => {
            const arr = [...form.installments];
            arr[idx] = { ...arr[idx], [k]: v };
            upd("installments", arr);
          };

          return (
            <div className="sl-installment-block" key={inst.id}>
              <div className="sl-inst-header">
                <div className="sl-inst-header-left">
                  <div className="sl-inst-num">{idx + 1}</div>
                  <input
                    className="sl-inst-label-input"
                    value={
                      inst.installment ? `${inst.installment} Installment` : ""
                    }
                    readOnly
                  />
                </div>
                <div className="sl-inst-actions-bar">
                  <button
                    className="sl-preview-btn"
                    onClick={() => handlePreview(inst)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </button>
                  <button
                    className="sl-dl-inst-btn"
                    onClick={() => handleDownload(inst)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  {(form.installments || []).length > 1 && (
                    <button
                      className="sl-del-btn sl-del-inst"
                      onClick={() =>
                        upd(
                          "installments",
                          form.installments.filter((_, j) => j !== idx),
                        )
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="sl-heads-wrap">
                <table className="sl-heads-table">
                  <thead>
                    <tr>
                      <th style={{ width: 52 }}>Sl.</th>
                      <th>Head of Account</th>
                      <th style={{ width: 160 }}>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* NON-RECURRING */}
                    <tr className="sl-head-group-row">
                      <td colSpan={3}>
                        <div className="sl-group-label">
                          <span className="sl-group-tag nr-tag">A</span>
                          Non-Recurring Heads
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">A</td>

                      <td>
                        <div className="sl-equipment-wrap">
                          <span className="sl-equip-label">Equipment</span>

                          {(inst.equipment || []).map((eq, ei) => (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                className="sl-table-input"
                                placeholder={`Item ${ei + 1} name`}
                                value={eq.name}
                                onChange={(e) => {
                                  const arr = [...inst.equipment];

                                  arr[ei] = {
                                    ...eq,
                                    name: e.target.value,
                                  };

                                  updInst("equipment", arr);
                                }}
                              />

                              <input
                                className="sl-table-input sl-amount-input"
                                style={{
                                  width: "140px",
                                }}
                                placeholder="Amount"
                                type="number"
                                value={eq.amount || ""}
                                onChange={(e) => {
                                  const arr = [...inst.equipment];

                                  arr[ei] = {
                                    ...eq,
                                    amount: e.target.value,
                                  };

                                  updInst("equipment", arr);
                                }}
                              />
                            </div>
                          ))}

                          <button
                            className="sl-add-row-btn sl-add-sm"
                            onClick={() =>
                              updInst("equipment", [
                                ...inst.equipment,

                                {
                                  id: Date.now(),
                                  name: "",
                                  amount: "",
                                },
                              ])
                            }
                          >
                            + Add Equipment
                          </button>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <div className="sl-calc-cell">
                            No. of items: {inst.equipment.length}
                          </div>

                          <input
                            className="sl-table-input sl-amount-input"
                            placeholder="Total amount"
                            type="number"
                            readOnly
                            value={(inst.equipment || []).reduce(
                              (sum, eq) => sum + Number(eq.amount || 0),

                              0,
                            )}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* RECURRING */}
                    <tr className="sl-head-group-row">
                      <td colSpan={3}>
                        <div className="sl-group-label">
                          <span className="sl-group-tag rec-tag">B</span>
                          Recurring Heads
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">1</td>
                      <td>
                        <div className="sl-equipment-wrap">
                          <span className="sl-equip-label">Manpower</span>

                          {(inst.manpowerList || []).map((m, mi) => (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                className="sl-table-input"
                                placeholder="Type of manpower"
                                value={m.type}
                                onChange={(e) => {
                                  const arr = [...inst.manpowerList];

                                  arr[mi] = {
                                    ...m,
                                    type: e.target.value,
                                  };

                                  updInst("manpowerList", arr);
                                }}
                              />

                              <input
                                className="sl-table-input sl-amount-input"
                                style={{
                                  width: "140px",
                                }}
                                placeholder="Amount"
                                type="number"
                                value={m.amount || ""}
                                onChange={(e) => {
                                  const arr = [...inst.manpowerList];

                                  arr[mi] = {
                                    ...m,
                                    amount: e.target.value,
                                  };

                                  updInst("manpowerList", arr);
                                }}
                              />
                            </div>
                          ))}

                          <button
                            className="sl-add-row-btn sl-add-sm"
                            onClick={() =>
                              updInst("manpowerList", [
                                ...inst.manpowerList,
                                { id: Date.now(), type: "" },
                              ])
                            }
                          >
                            + Add Manpower Type
                          </button>
                        </div>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <div className="sl-calc-cell">
                            No. of types: {inst.manpowerList.length}
                          </div>

                          <input
                            className="sl-table-input sl-amount-input"
                            placeholder="Total amount"
                            type="number"
                            value={(inst.manpowerList || []).reduce(
                              (sum, m) => sum + Number(m.amount || 0),

                              0,
                            )}
                            onChange={(e) =>
                              updInst("manpower", e.target.value)
                            }
                          />
                        </div>
                      </td>
                    </tr>

                    {[
                      {
                        key: "consumables",
                        label: "Consumables & Accessories",
                        num: 2,
                      },
                      { key: "travel", label: "Travel", num: 3 },
                      { key: "contingency", label: "Contingency", num: 4 },
                      {
                        key: "ssrBudget",
                        label: "SSR Budget",
                        num: 5,
                      },
                    ].map((row) => (
                      <tr key={row.key}>
                        <td className="sl-sl-cell">{row.num}</td>
                        <td>{row.label}</td>
                        <td>
                          <input
                            className="sl-table-input sl-amount-input"
                            placeholder="Enter amount"
                            type="number"
                            value={inst[row.key]}
                            onChange={(e) => updInst(row.key, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* OVERHEAD */}
                    <tr className="sl-head-group-row">
                      <td colSpan={3}>
                        <div className="sl-group-label">
                          <span className="sl-group-tag oh-tag">C</span>
                          Overhead
                          <span className="sl-oh-hint">
                            (15% total — split auto-calculated)
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr className="sl-oh-input-row">
                      <td></td>
                      <td>
                        <span className="sl-oh-entry-label">
                          Total Overhead Amount (₹)
                        </span>
                      </td>
                      <td>
                        <input
                          className="sl-table-input sl-amount-input sl-oh-input"
                          placeholder="Total overhead"
                          type="number"
                          readOnly
                          value={(() => {
                            const equipmentTotal = (
                              inst.equipment || []
                            ).reduce(
                              (sum, eq) => sum + Number(eq.amount || 0),
                              0,
                            );

                            const manpowerTotal = (
                              inst.manpowerList || []
                            ).reduce(
                              (sum, m) => sum + Number(m.amount || 0),
                              0,
                            );

                            const consumables = Number(inst.consumables || 0);

                            const travel = Number(inst.travel || 0);

                            const contingency = Number(inst.contingency || 0);

                            const ssrBudget = Number(inst.ssrBudget || 0);

                            const grandRecurring =
                              equipmentTotal +
                              manpowerTotal +
                              consumables +
                              travel +
                              contingency +
                              ssrBudget;

                            return (grandRecurring * 0.15).toFixed(2);
                          })()}
                        />
                      </td>
                    </tr>
                    {[
                      {
                        label: "Registrar A/C, Chennai",
                        pct: "5%",
                        val: t.reg5,
                      },
                      { label: "Dean, Campus A/C", pct: "4%", val: t.dean4 },
                      { label: "CSRC Revenue A/C", pct: "4%", val: t.csrc4 },
                      { label: "PI PDF A/C", pct: "2%", val: t.pdf2 },
                    ].map((row, ri) => (
                      <tr key={ri} className="sl-oh-split-row">
                        <td className="sl-sl-cell sl-roman">
                          {["i", "ii", "iii", "iv"][ri]}
                        </td>
                        <td className="sl-split-label">
                          {row.label}{" "}
                          <span className="sl-pct-badge">{row.pct}</span>
                        </td>
                        <td className="sl-calc-cell">₹ {fmt(row.val)}</td>
                      </tr>
                    ))}

                    {/* SSR BUDGET — SEPARATE SECTION */}

                    {/* SUMMARY ROW */}
                    <tr className="sl-head-group-row">
                      <td colSpan={3}>
                        <div className="sl-group-label">
                          <span className="sl-group-tag ssr-tag">D</span>
                          Project Summary
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">1</td>

                      <td>Non-Recurring Total</td>

                      <td className="sl-calc-cell">
                        ₹{" "}
                        {fmt(
                          (inst.equipment || []).reduce(
                            (sum, eq) => sum + Number(eq.amount || 0),

                            0,
                          ),
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">2</td>

                      <td>Recurring Total</td>

                      <td className="sl-calc-cell">
                        ₹{" "}
                        {fmt(
                          (inst.manpowerList || []).reduce(
                            (sum, m) => sum + Number(m.amount || 0),

                            0,
                          ) +
                            Number(inst.consumables || 0) +
                            Number(inst.travel || 0) +
                            Number(inst.contingency || 0),
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">3</td>

                      <td>Total</td>

                      <td className="sl-calc-cell">
                        ₹{" "}
                        {fmt(
                          (inst.equipment || []).reduce(
                            (sum, eq) => sum + Number(eq.amount || 0),

                            0,
                          ) +
                            (inst.manpowerList || []).reduce(
                              (sum, m) => sum + Number(m.amount || 0),

                              0,
                            ) +
                            Number(inst.consumables || 0) +
                            Number(inst.travel || 0) +
                            Number(inst.contingency || 0),
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">4</td>

                      <td>Overhead</td>

                      <td className="sl-calc-cell">
                        ₹ {fmt(Number(t.total || 0))}
                      </td>
                    </tr>

                    <tr>
                      <td className="sl-sl-cell">5</td>

                      <td>Grand Total</td>

                      <td className="sl-calc-cell">
                        ₹{" "}
                        {fmt(
                          (inst.equipment || []).reduce(
                            (sum, eq) => sum + Number(eq.amount || 0),

                            0,
                          ) +
                            (inst.manpowerList || []).reduce(
                              (sum, m) => sum + Number(m.amount || 0),

                              0,
                            ) +
                            Number(inst.consumables || 0) +
                            Number(inst.travel || 0) +
                            Number(inst.contingency || 0) +
                            t.total,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </SectionCard>

      {/* To Section */}
      <SectionCard
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        }
        title="REPORT GENERATION"
        accent="#f472b6"
      >
        {/* Quick report actions */}
        <div className="sl-report-actions-grid">
          <div className="sl-report-actions-title">Generate Reports</div>
          <div className="sl-report-chips">
            {(form.installments || []).map((inst, idx) => {
              const t = calcInstTotal(inst);
              return (
                <div key={inst.id} className="sl-report-chip">
                  <div className="sl-report-chip-info">
                    <span className="sl-report-chip-label">
                      {inst.installment
                        ? `${inst.installment} Installment`
                        : ""}
                    </span>
                    <span className="sl-report-chip-total">
                      ₹ {fmt(t.grandTotal)}
                    </span>
                  </div>
                  <div className="sl-report-chip-btns">
                    <button
                      className="sl-preview-btn"
                      onClick={() => handlePreview(inst)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ width: 13, height: 13 }}
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Preview
                    </button>
                    <button
                      className="sl-dl-inst-btn"
                      onClick={() => handleDownload(inst)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ width: 13, height: 13 }}
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Submit */}
      <div className="sl-form-actions">
        <button className="sl-submit-btn" onClick={handleSubmit}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Submit Request to CSRC Director
        </button>
      </div>
    </div>
  );
};

// ─── Tab 3: Approval Status ──────────────────────────────
const ApprovalTab = ({ submissions }) => {
  //const [selectedSub, setSelectedSub] = useState(null);
  //const [selectedInst, setSelectedInst] = useState(null);
  const [approvals, setApprovals] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/approvals/all")

      .then((res) => {
        console.log("APPROVALS", res.data);

        setApprovals(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (!approvals || approvals.length === 0) {
    return (
      <div className="sl-approval-empty">
        <div className="sl-approval-ring">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h3>No Requests Yet</h3>
        <p>
          Submit a request from the "Request Sanctioned Project" tab to track
          its approval status here.
        </p>
      </div>
    );
  }

  return (
    <div className="sl-approval-list">
      <div className="sl-approval-header">
        <h3 className="sl-approval-list-title">Submitted Requests</h3>
        <span className="sl-approval-count-badge">
          {approvals.length} submission{approvals.length > 1 ? "s" : ""}
        </span>
      </div>

      {approvals.map((sub, si) => (
        <div key={si} className="sl-approval-card">
          <div className="sl-approval-card-header">
            <div className="sl-approval-card-info">
              <span className="sl-approval-proj-title">
                {sub.project_title || "Untitled Project"}
              </span>
              <span className="sl-approval-meta">
                Submitted:
                {new Date(sub.created_at).toLocaleDateString("en-GB")}
                &nbsp;·&nbsp;
                {sub.installment} Installment
              </span>
            </div>
            <div
              className={`sl-approval-status-badge ${
                sub.approval_status === "Approved" ? "approved" : "pending"
              }`}
            >
              <span className="sl-status-dot" />
              {sub.approval_status}
            </div>
          </div>
          {console.log(sub)}
          <div className="sl-timeline">
            {[
              {
                label: "Request Submitted",
                date: sub.submittedAt,
                state: "done",
              },

              {
                label: sub.approval_status,

                date: sub.approval_status,

                state: sub.approval_status === "Approved" ? "done" : "active",
              },
            ].map((step, si2) => (
              <div key={si2} className={`sl-timeline-step ${step.state}`}>
                <div className="sl-step-dot" />
                <div className="sl-step-content">
                  <span className="sl-step-label">{step.label}</span>
                  <span className="sl-step-date">{step.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sl-approval-inst-section">
            <div className="sl-inst-select-label">Installments</div>
            <div className="sl-inst-chips">
              {(sub.installments || []).map((inst, ii) => (
                <button className="sl-inst-chip active">
                  {sub.installment} Installment
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────
const tabs = [
  {
    id: "list",
    label: "Sanctioned Projects",
    sublabel: "Browse records",
    color: "#a78bfa",
    glow: "#a78bfa30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 9l6 0M9 12l6 0M9 15l4 0" />
      </svg>
    ),
  },
  {
    id: "request",
    label: "Request Sanctioned Proceedings",
    sublabel: "Submit new request",
    color: "#00b4ff",
    glow: "#00b4ff30",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    id: "approval",
    label: "Approval Status",
    sublabel: "Track submissions",
    color: "#34d399",
    glow: "#34d39930",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const SanctionedList = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("list");
  const [submissions, setSubmissions] = useState([]);
  //const [approvals, setApprovals] = useState([]);
  const handleSubmit = (data) => {
    setSubmissions((prev) => [...prev, data]);
    setTimeout(() => setActiveTab("approval"), 1000);
  };

  return (
    <div className="sanctioned-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          <span onClick={() => onNavigate && onNavigate("home")}>Home</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 12, height: 12, opacity: 0.4 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span onClick={() => onNavigate && onNavigate("projects")}>
            My Projects
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 12, height: 12, opacity: 0.4 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="breadcrumb-current">Sanctioned Projects</span>
        </div>
        <div className="page-title-row">
          <h1 className="page-title">Sanctioned Projects</h1>
          <div className="page-title-meta">CSRC — Anna University</div>
        </div>
      </div>

      <div className="sl-tab-cards">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`sl-tab-card ${activeTab === tab.id ? "active" : ""}`}
            style={{ "--tab-color": tab.color, "--tab-glow": tab.glow }}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="sl-tab-card-icon">{tab.icon}</div>
            <div className="sl-tab-card-text">
              <span className="sl-tab-card-label">{tab.label}</span>
              <span className="sl-tab-card-sub">{tab.sublabel}</span>
            </div>
            {tab.id === "approval" && submissions.length > 0 && (
              <span className="sl-tab-badge">{submissions.length}</span>
            )}
            {activeTab === tab.id && <div className="sl-tab-active-bar" />}
          </div>
        ))}
      </div>

      <div className="sl-tab-body">
        {activeTab === "list" && <SanctionedListTab />}
        {activeTab === "request" && <RequestTab onSubmit={handleSubmit} />}
        {activeTab === "approval" && <ApprovalTab submissions={submissions} />}
      </div>
    </div>
  );
};

export default SanctionedList;
