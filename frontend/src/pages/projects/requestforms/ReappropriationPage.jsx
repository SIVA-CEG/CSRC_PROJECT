import React, { useState, useRef } from "react";
import "./ReappropriationPage.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ─── Static Data ──────────────────────────────────────────── */
const FUNDING_AGENCIES = [
  "AICTE","ANRF","Anusandhan National Research Foundation","ARG",
  "Aeronautics Research and Development Board","Biotechnology Industry Research Assistance Council (BIRAC)",
  "Central Council for Research in Unani Medicine (CCRUM)","Central Power Research Institute",
  "Centre for Medical Electronics","Centre for Research, Anna University",
  "Chennai Metropolitan Water Supply and Sewerage Board","Chief Minister Research Grant (CMRG)",
  "CHIP to Startups","CMR","CMRG","Council of Scientific and Industrial Research","CSIR","CSIR-ASPIRE",
  "CVRDE","DBT","DBT Network Project","DBT-BIRAC","DBT, Government of India",
  "Defence Research and Development Organisation","Defence R&D Organisation",
  "Department of Biotechnology","Department of Environment, Government of Tamil Nadu",
  "Department of Science and Technology","Department of Science and Technology (DST)",
  "Department of Science and Technology (TIDE)","Department of Science and Technology (WTC)",
  "Department of Science and Technology, New Delhi","Department of Telecommunications - Bharat 5G Labs",
  "Department of Telecommunications - USOF","DRDO","DST","EDALL Systems","FSSAI","Good Food Institute",
  "Google","HEFA","ICMR","ICSSR","IGSTC","IIT Kanpur","IKS","Indian Council of Agricultural Research",
  "Indian Council of Medical Research","Indian Council of Social Science Research (ICSSR)",
  "Indian Space Research Organisation","Indo-German Science & Technology Centre (IGSTC)",
  "INSA","ISRO","L&T","MeitY","Ministry of AYUSH, Government of India",
  "Ministry of Earth Sciences","Ministry of Education (MoE)",
  "Ministry of Electronics and Information Technology","Ministry of Environment, Forest and Climate Change",
  "Ministry of Food Processing Industries","Ministry of Jal Shakti","Ministry of Mines",
  "Ministry of New and Renewable Energy (MNRE)","MNRE","NABARD",
  "National Bank for Agriculture and Rural Development","NCERT",
  "NLC India Limited","Norwegian Council of Research","PCRA","SERB","SERB POWER","SERB-SURE",
  "Science and Engineering Research Board, New Delhi","SPARC","SURE","Tamil Nadu Forest Department",
  "Tamil Nadu Innovation Initiatives (TANII)","Tamil Nadu State Council for Science and Technology",
  "TANGEDCO","TANII","TNPCB","TNSCST","UGC","UGC-DAE CSR","UK Aid","UKIERI",
  "Wellcome Trust-India Alliance","Xagrotor Tek Private Limited",
  "Other (specify manually)",
].sort();

/* ─── Dummy project data keyed by agency+installment ── */
const DUMMY_PROJECTS = {
  default: {
    name: "Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2",
    pi: "Dr. S. Balasivanandha Prabu",
    department: "Department of Mechanical Engineering, CEG Campus",
    procNo: "2433/CTDT-2/2020, dated 10-12-2020",
    installmentTotal: 1200000,
    heads: {
  nonRecurring: [
    { label: "Equipment 1", amount: 450000 },
    { label: "Equipment 2", amount: 200000 },
    { label: "Equipment 3", amount: 150000 },
  ],
  recurring: [
    {
      label: "Manpower",
      subItems: [
        { name: "JRF Salary (1 JRF × 12 months)", amount: 370080 },
      ],
    },
    { label: "Consumables", amount: 80000 },
    { label: "Travel", amount: 40000 },
    { label: "Contingency", amount: 59920 },
    { label: "Other Recurring", amount: 30000 },
  ],
      overhead: [
        { label: "The Registrar A/C, Chennai 5%", amount: 60000 },
        { label: "The Dean, Campus A/C 4%",        amount: 48000 },
        { label: "CSRC Revenue, Chennai 4%",       amount: 48000 },
        { label: "The Principal Investigator PDF 2%", amount: 24000 },
      ],
      ssr: { label: "Scientific Social Responsibility Budget Detail", amount: 0 },
    },
  },
};

/* ─── Helpers ──────────────────────────────────────────────── */
const toINR = (n) =>
  n === undefined || n === null || n === ""
    ? "—"
    : `₹ ${Number(n).toLocaleString("en-IN")}`;

const sumHead = (head) => {
  if (head.subItems) return head.subItems.reduce((s, i) => s + (i.amount || 0), 0);
  return head.amount || 0;
};

/* SearchableSelect */
function SearchableSelect({ options, value, onChange, placeholder = "--Select--" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = options.filter((o) => o.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={`ra-ss ${open ? "ra-ss-open" : ""}`} ref={ref}>
      <div className="ra-ss-trigger" onClick={() => setOpen(!open)}>
        <span className={value ? "ra-ss-val" : "ra-ss-ph"}>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ra-ss-chevron">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </div>
      {open && (
        <div className="ra-ss-drop">
          <input className="ra-ss-search" placeholder="Search..." value={q}
            onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className={`ra-ss-opt ${!value ? "active" : ""}`}
            onClick={() => { onChange(""); setOpen(false); setQ(""); }}>--Select--</div>
          {filtered.map((o) => (
            <div key={o} className={`ra-ss-opt ${value === o ? "active" : ""}`}
              onClick={() => { onChange(o); setOpen(false); setQ(""); }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Head Breakdown Table ─────────────────────────────────── */
function HeadTable({ heads }) {
  const { nonRecurring, recurring, overhead, ssr } = heads;
  let sl = 0;
  const equipTotal = nonRecurring.reduce((s, h) => s + sumHead(h), 0);
  const mpTotal    = recurring.filter(h => h.label === "Manpower").reduce((s, h) => s + sumHead(h), 0);
  const ohTotal    = overhead.reduce((s, h) => s + sumHead(h), 0);
  const recOther   = recurring.filter(h => h.label !== "Manpower");

  const grand = equipTotal + mpTotal + recOther.reduce((s,h)=>s+sumHead(h),0) + ohTotal + (ssr.amount||0);

  return (
    <table className="ra-htable">
      <thead>
        <tr><th>Sl. No.</th><th>Heads</th><th>Amount ₹</th></tr>
      </thead>
      <tbody>
        {/* Non-Recurring */}
        <tr className="ra-ht-section"><td>A</td><td><strong>Non-Recurring Heads</strong></td><td></td></tr>
        {nonRecurring.map((h) => {
          sl++;
          return (
            <React.Fragment key={h.label}>
              <tr><td>{sl}</td><td>{h.label}{h.subItems && <div className="ra-ht-sub">No. of equipment types: {h.subItems.length}</div>}</td><td>{toINR(sumHead(h))}</td></tr>
              {h.subItems && h.subItems.map((si, i) => (
                <tr key={i} className="ra-ht-subrow"><td></td><td className="ra-ht-subitem">• {si.name}</td><td>{toINR(si.amount)}</td></tr>
              ))}
            </React.Fragment>
          );
        })}
        {/* Recurring */}
        <tr className="ra-ht-section"><td>B</td><td><strong>Recurring Heads</strong></td><td></td></tr>
        {recurring.map((h) => {
          sl++;
          return (
            <React.Fragment key={h.label}>
              <tr><td>{sl}</td><td>{h.label}{h.subItems && <div className="ra-ht-sub">No. of manpower types: {h.subItems.length}</div>}</td><td>{toINR(sumHead(h))}</td></tr>
              {h.subItems && h.subItems.map((si, i) => (
                <tr key={i} className="ra-ht-subrow"><td></td><td className="ra-ht-subitem">• {si.name}</td><td>{toINR(si.amount)}</td></tr>
              ))}
            </React.Fragment>
          );
        })}
        {/* Overhead */}
        <tr className="ra-ht-section"><td>C</td><td><strong>Overhead</strong></td><td>{toINR(ohTotal)}</td></tr>
        {overhead.map((h, i) => (
          <tr key={i}><td>{i + sl + 1}</td><td style={{paddingLeft:"28px"}}>{h.label}</td><td>{toINR(h.amount)}</td></tr>
        ))}
        {/* SSR */}
        <tr className="ra-ht-section"><td>D</td><td><strong>Scientific Social Responsibility Budget Detail</strong></td><td>{toINR(ssr.amount || 0)}</td></tr>
        <tr className="ra-ht-total"><td colSpan={2} style={{textAlign:"right"}}><strong>Total</strong></td><td><strong>{toINR(grand)}</strong></td></tr>
      </tbody>
    </table>
  );
}

/* ─── PDF Report Generator ──────────────────────────────────── */
function generateReport({ agency, projectName, installment, heads, reapRows, headType, projectData }) {
  const { nonRecurring, recurring, overhead, ssr } = heads;

  const buildOldRows = () => {
    let rows = "";
    let sl = 0;
    [...nonRecurring, ...recurring].forEach((h) => {
      sl++;
      rows += `<tr><td>${sl}</td><td>${h.label}</td><td>₹ ${sumHead(h).toLocaleString("en-IN")}</td></tr>`;
    });
    return rows;
  };

  // Compute updated amounts
  const allHeads = [...nonRecurring, ...recurring].map((h) => {
    let amt = sumHead(h);
    reapRows.forEach((r) => {
      if (r.from === h.label) amt -= parseFloat(r.amount) || 0;
      if (r.to   === h.label) amt += parseFloat(r.amount) || 0;
    });
    return { ...h, newAmt: amt };
  });

  const buildNewRows = () => {
    let rows = "";
    allHeads.forEach((h, i) => {
      rows += `<tr><td>${i + 1}</td><td>${h.label}</td><td>₹ ${h.newAmt.toLocaleString("en-IN")}</td></tr>`;
    });
    return rows;
  };

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Re-appropriation Request</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:11.5px;color:#000;background:#fff;}
.page{width:210mm;min-height:297mm;padding:20mm 22mm;page-break-after:always;position:relative;}
h2{font-size:13px;text-align:center;font-weight:bold;margin-bottom:2px;}
h3{font-size:12px;text-align:center;font-weight:bold;margin-bottom:14px;}
table{width:100%;border-collapse:collapse;margin:12px 0;}
th,td{border:1px solid #333;padding:5px 9px;font-size:11px;}
th{background:#f0f0f0;font-weight:bold;}
.right{text-align:right;}.center{text-align:center;}.bold{font-weight:bold;}
.info-table td{border:none;padding:3px 6px;vertical-align:top;}
.info-table td:first-child{font-weight:bold;width:220px;}
.sig-row{display:flex;justify-content:space-between;margin-top:50px;}
.sig-box{text-align:center;width:38%;}
.to-block{margin-top:30px;font-size:11.5px;line-height:1.9;}
p{margin:10px 0;text-align:justify;line-height:1.7;font-size:11.5px;}
.total-row td{font-weight:bold;}
.section-row td{background:#eee;font-weight:bold;}
.print-btn{position:fixed;top:10px;right:10px;padding:9px 18px;background:#1565c0;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999;}
@media print{.print-btn{display:none;}.page{page-break-after:always;}}
</style></head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>

<div class="page">
<h2>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h2>
<h2>ANNA UNIVERSITY, CHENNAI – 600 025</h2>
<h3 style="margin-top:10px;">REQUEST FOR RE-APPROPRIATION OF FUNDS</h3>

<table class="info-table" style="border:none;">
  <tr><td>Funding Agency</td><td>: ${agency}</td></tr>
  <tr><td>Project Title</td><td>: ${projectName}</td></tr>
  <tr><td>Principal Investigator</td><td>: ${projectData.pi}</td></tr>
  <tr><td>Department &amp; Campus</td><td>: ${projectData.department}</td></tr>
  <tr><td>CTDT Procs. No. &amp; Date</td><td>: ${projectData.procNo}</td></tr>
  <tr><td>Installment No.</td><td>: ${installment}</td></tr>
  <tr><td>Date</td><td>: ${today}</td></tr>
</table>

<p style="margin-top:18px;">
  The Principal Investigator humbly requests the Director, Centre for Sponsored Research and Consultancy,
  Anna University, Chennai – 600 025, to kindly accord sanction for the re-appropriation of funds under the
  <strong>${headType === "nonRecurring" ? "Non-Recurring" : "Recurring"} Heads</strong> of the above-mentioned
  project as detailed below. The re-appropriation is necessitated due to the revised requirement of funds across
  the sanctioned budget heads. The total sanctioned amount remains unchanged.
</p>

<h3 style="margin-top:22px;font-size:12px;">I. PREVIOUS HEAD-WISE BUDGET DISTRIBUTION (${headType === "nonRecurring" ? "Non-Recurring" : "Recurring"} Heads)</h3>
<table>
  <thead><tr><th>Sl. No.</th><th>Head</th><th>Sanctioned Amount (₹)</th></tr></thead>
  <tbody>${buildOldRows()}</tbody>
</table>

<h3 style="font-size:12px;">II. RE-APPROPRIATION DETAILS</h3>
<table>
  <thead><tr><th>Sl. No.</th><th>Re-appropriation From (Head)</th><th>Re-appropriation To (Head)</th><th>Amount (₹)</th></tr></thead>
  <tbody>
    ${reapRows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.from || "—"}</td><td>${r.to || "—"}</td><td>₹ ${parseFloat(r.amount || 0).toLocaleString("en-IN")}</td></tr>`).join("")}
  </tbody>
</table>

<h3 style="font-size:12px;">III. REVISED HEAD-WISE BUDGET DISTRIBUTION (After Re-appropriation)</h3>
<table>
  <thead><tr><th>Sl. No.</th><th>Head</th><th>Revised Amount (₹)</th></tr></thead>
  <tbody>${buildNewRows()}</tbody>
</table>

<p style="margin-top:20px;">
  It is certified that the above re-appropriation does not alter the total sanctioned amount and is strictly
  within the purview of the approved budget. The re-appropriation is required to meet the genuine project needs
  and will be utilized solely for the purpose of the project.
</p>

<div class="sig-row">
  <div class="sig-box">
    <div style="border-top:1px solid #000;padding-top:6px;">Signature of Principal Investigator</div>
    <div style="font-size:10px;margin-top:4px;">${projectData.pi}</div>
    <div style="font-size:10px;">${projectData.department}</div>
    <div style="font-size:10px;">Date: ________________</div>
  </div>
  <div class="sig-box">
    <div style="border-top:1px solid #000;padding-top:6px;">Signature of Professor &amp; Head/Dean</div>
    <div style="font-size:10px;margin-top:4px;">Date: ________________</div>
  </div>
</div>

<div class="to-block">
  <div style="margin-top:40px;"><strong>To</strong></div>
  <div>The Director,</div>
  <div>Centre for Sponsored Research and Consultancy,</div>
  <div>Anna University, Chennai – 600 025.</div>
  <div style="margin-top:10px;"><strong>Copy to:</strong> Bill / Stock file</div>
</div>
</div>
</body></html>`;
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ReappropriationPage({ onNavigate }) {
  const [step, setStep]           = useState(1); // 1=info, 2=heads, 3=reap, 4=preview
  const [agency, setAgency]       = useState("");
  const [agencyCustom, setAgencyCustom] = useState("");
  const [projectName, setProjectName] = useState("");
  const [installment, setInstallment] = useState("");
  const [headType, setHeadType]   = useState(""); // nonRecurring | recurring
  const [reapRows, setReapRows]   = useState([{ from: "", to: "", amount: "" }]);
  const [requestLetter, setRequestLetter] = useState(null);

  // Use dummy project data
  const projectData = DUMMY_PROJECTS.default;
  const heads = projectData.heads;

  const effectiveAgency = agency === "Other (specify manually)" ? agencyCustom : agency;

  // Heads available for reappropriation
  const availableHeads =
    headType === "recurring"
      ? [...heads.recurring.map((h) => h.label), "Other (type manually)"]
      : [];

  // Computed updated amounts
  const updatedHeads = [...heads.nonRecurring, ...heads.recurring].map((h) => {
    let amt = sumHead(h);
    reapRows.forEach((r) => {
      if (r.from === h.label) amt -= parseFloat(r.amount) || 0;
      if (r.to   === h.label) amt += parseFloat(r.amount) || 0;
    });
    return { label: h.label, original: sumHead(h), revised: amt };
  });

  /* Step 1 → 2 */
  const goStep2 = () => {
    if (!effectiveAgency) return alert("Please select a funding agency.");
    if (!projectName.trim()) return alert("Please enter the project name.");
    if (!installment.trim()) return alert("Please enter the installment number.");
    setStep(2);
  };

  /* Step 2 → 3 */
  const goStep3 = () => {
    if (!headType) return alert("Please select a head type.");
    setStep(3);
  };

  /* Step 3 → 4 */
  const goStep4 = () => {
    for (const r of reapRows) {
      if (!r.from || !r.to || !r.amount) return alert("Please fill all re-appropriation rows completely.");
      if (r.from === r.to) return alert("'From' and 'To' heads cannot be the same.");
    }
    setStep(4);
  };

  const addRow    = () => setReapRows([...reapRows, { from: "", to: "", amount: "" }]);
  const removeRow = (i) => setReapRows(reapRows.filter((_, idx) => idx !== i));
  const setRow    = (i, k, v) => { const r = [...reapRows]; r[i] = { ...r[i], [k]: v }; setReapRows(r); };

  const createPdf = async (mode) => {
  const html = generateReport({
    agency: effectiveAgency,
    projectName,
    installment,
    heads,
    reapRows,
    headType,
    projectData
  });

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
    backgroundColor: "#ffffff"
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

  const fileName = `reappropriation_${effectiveAgency
    .slice(0, 20)
    .replace(/\s/g, "_")}_inst${installment}.pdf`;

  if (mode === "preview") {
    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  } else {
    pdf.save(fileName);
  }
};

const handlePreview = () => {
  createPdf("preview");
};

const handleDownload = () => {
  createPdf("download");
};

  /* Step indicator */
  const STEPS = ["Project Info", "Head Distribution", "Re-appropriation", "Preview & Report"];

  return (
    <div className="ra-page">
      {/* Header */}
      <div className="ra-header">
        <div className="page-breadcrumb">
          Home /{" "}
          <span onClick={() => onNavigate && onNavigate("projects")}>My Projects</span> /{" "}
          <span onClick={() => onNavigate && onNavigate("requestforms")}>Request Forms</span> /{" "}
          <span>Re-appropriation</span>
        </div>
        <h1 className="page-title">Re-appropriation Request</h1>
        <p className="page-subtitle">Reallocate sanctioned funds between project budget heads</p>
      </div>

      {/* Step bar */}
      <div className="ra-stepbar">
        {STEPS.map((s, i) => (
          <div key={i} className={`ra-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
            <div className="ra-step-circle">
              {step > i + 1 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (i + 1)}
            </div>
            <div className="ra-step-label">{s}</div>
            {i < STEPS.length - 1 && <div className="ra-step-line" />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Project Info ── */}
      {step === 1 && (
        <div className="ra-card ra-animate">
          <div className="ra-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Project Information
          </div>

          <div className="ra-field">
            <label>Funding Agency</label>
            <SearchableSelect
              options={FUNDING_AGENCIES}
              value={agency}
              onChange={setAgency}
              placeholder="Select funding agency..."
            />
            {agency === "Other (specify manually)" && (
              <input className="ra-input ra-mt8" placeholder="Type funding agency name..."
                value={agencyCustom} onChange={(e) => setAgencyCustom(e.target.value)} />
            )}
          </div>

          <div className="ra-field-row">
            <div className="ra-field ra-field-grow">
              <label>Project Name / Title</label>
              <input className="ra-input" placeholder="Enter project title..."
                value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div className="ra-field ra-field-sm">
              <label>Installment No.</label>
              <input className="ra-input" placeholder="e.g. 1, 2, 3..."
                value={installment} onChange={(e) => setInstallment(e.target.value)} />
            </div>
          </div>

          <div className="ra-field">
            <label>Request Letter from the Funding Agency</label>
            <input
              className="ra-input ra-file-input"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => setRequestLetter(e.target.files[0])}
            />
            {requestLetter && (
              <div className="ra-file-name">Selected: {requestLetter.name}</div>
            )}
          </div>

          <div className="ra-actions">
            <button className="ra-btn ra-btn-primary" onClick={goStep2}>
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Head Distribution ── */}
      {step === 2 && (
        <div className="ra-animate">
          <div className="ra-card">
            <div className="ra-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              Installment Head-wise Distribution
            </div>
            <div className="ra-project-info">
              <span><strong>Project:</strong> {projectName}</span>
              <span><strong>Agency:</strong> {effectiveAgency}</span>
              <span><strong>Installment:</strong> {installment}</span>
            </div>
            <HeadTable heads={heads} />
          </div>

          <div className="ra-card ra-card-choose">
            <div className="ra-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
              Select Head Type for Re-appropriation
            </div>
            <p className="ra-choose-hint">Choose which category of heads you want to re-appropriate between. Overhead and SSR budget are not eligible.</p>
            <div className="ra-head-cards">
              <div
                className={`ra-head-card ${headType === "nonRecurring" ? "selected" : ""}`}
                onClick={() => setHeadType("nonRecurring")}
              >
                <div className="ra-hc-icon" style={{ "--hc": "#38bdf8" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                </div>
                <div className="ra-hc-label">Non-Recurring Heads</div>
                <div className="ra-hc-desc">Equipment and other one-time expenditures</div>
                <div className="ra-hc-items">
                  {heads.nonRecurring.map((h) => (
                    <span key={h.label} className="ra-hc-pill">{h.label}: {toINR(sumHead(h))}</span>
                  ))}
                </div>
                {headType === "nonRecurring" && (
                  <div className="ra-hc-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>

              <div
                className={`ra-head-card ${headType === "recurring" ? "selected" : ""}`}
                onClick={() => setHeadType("recurring")}
              >
                <div className="ra-hc-icon" style={{ "--hc": "#34d399" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
                </div>
                <div className="ra-hc-label">Recurring Heads</div>
                <div className="ra-hc-desc">Manpower, consumables, travel, contingency</div>
                <div className="ra-hc-items">
                  {heads.recurring.map((h) => (
                    <span key={h.label} className="ra-hc-pill">{h.label}: {toINR(sumHead(h))}</span>
                  ))}
                </div>
                {headType === "recurring" && (
                  <div className="ra-hc-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ra-actions ra-actions-between">
            <button className="ra-btn ra-btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="ra-btn ra-btn-primary" onClick={goStep3}>
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Re-appropriation Rows ── */}
      {step === 3 && (
        <div className="ra-animate">
          <div className="ra-card">
            <div className="ra-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
              Re-appropriation Details — {headType === "nonRecurring" ? "Non-Recurring" : "Recurring"} Heads
            </div>

            <div className="ra-reap-table">
              <div className="ra-reap-header">
                <span>Re-appropriation From (Head)</span>
                <span>Re-appropriation To (Head)</span>
                <span>Amount (₹)</span>
                <span></span>
              </div>
              {reapRows.map((row, i) => (
                <div className="ra-reap-row" key={i}>
                  {headType === "nonRecurring" ? (
                    <input
                      className="ra-input"
                      placeholder="From head..."
                      value={row.from}
                      onChange={(e) => setRow(i, "from", e.target.value)}
                    />
                  ) : (
                    <SearchableSelect
                      options={availableHeads}
                      value={row.from}
                      onChange={(v) => setRow(i, "from", v)}
                      placeholder="From head..."
                    />
                  )}

                  {headType === "nonRecurring" ? (
                    <input
                      className="ra-input"
                      placeholder="To head..."
                      value={row.to}
                      onChange={(e) => setRow(i, "to", e.target.value)}
                    />
                  ) : (
                    <SearchableSelect
                      options={availableHeads}
                      value={row.to}
                      onChange={(v) => setRow(i, "to", v)}
                      placeholder="To head..."
                    />
                  )}
                  <input
                    className="ra-input ra-input-amount"
                    type="number"
                    placeholder="Amount"
                    value={row.amount}
                    onChange={(e) => setRow(i, "amount", e.target.value)}
                  />
                  <button
                    className="ra-remove-btn"
                    onClick={() => removeRow(i)}
                    disabled={reapRows.length === 1}
                    title="Remove row"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>

            <button className="ra-add-row-btn" onClick={addRow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Row
            </button>
          </div>

          {/* Updated preview */}
          <div className="ra-card">
            <div className="ra-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Updated Budget After Re-appropriation
            </div>
            <table className="ra-htable ra-preview-table">
              <thead>
                <tr><th>Head</th><th>Original (₹)</th><th>Change</th><th>Revised (₹)</th></tr>
              </thead>
              <tbody>
                {updatedHeads.map((h) => {
                  const diff = h.revised - h.original;
                  return (
                    <tr key={h.label} className={headType === "nonRecurring"
                      ? heads.nonRecurring.find(x => x.label === h.label) ? "" : "ra-other-head"
                      : heads.recurring.find(x => x.label === h.label) ? "" : "ra-other-head"
                    }>
                      <td>{h.label}</td>
                      <td>{toINR(h.original)}</td>
                      <td className={diff > 0 ? "ra-pos" : diff < 0 ? "ra-neg" : ""}>
                        {diff > 0 ? `+${toINR(diff)}` : diff < 0 ? `-${toINR(Math.abs(diff))}` : "—"}
                      </td>
                      <td className={h.revised < 0 ? "ra-neg" : ""}>{toINR(h.revised)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {updatedHeads.some(h => h.revised < 0) && (
              <div className="ra-warning">⚠ One or more heads have a negative revised amount. Please adjust the re-appropriation values.</div>
            )}
          </div>

          <div className="ra-actions ra-actions-between">
            <button className="ra-btn ra-btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="ra-btn ra-btn-primary" onClick={goStep4}
              disabled={updatedHeads.some(h => h.revised < 0)}>
              Continue to Preview
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Preview & Report ── */}
      {step === 4 && (
        <div className="ra-animate">
          <div className="ra-card">
            <div className="ra-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Request Summary
            </div>
            <div className="ra-summary-grid">
              <div><span>Funding Agency</span><strong>{effectiveAgency}</strong></div>
              <div><span>Project Title</span><strong>{projectName}</strong></div>
              <div><span>PI</span><strong>{projectData.pi}</strong></div>
              <div><span>Installment No.</span><strong>{installment}</strong></div>
              <div><span>Head Type</span><strong>{headType === "nonRecurring" ? "Non-Recurring" : "Recurring"}</strong></div>
              <div><span>Re-appropriation Rows</span><strong>{reapRows.length}</strong></div>
            </div>

            <div className="ra-card-subtitle">Previous Distribution</div>
            <table className="ra-htable">
              <thead><tr><th>Sl.</th><th>Head</th><th>Original Amount (₹)</th></tr></thead>
              <tbody>
                {[...heads.nonRecurring, ...heads.recurring].map((h, i) => (
                  <tr key={i}><td>{i + 1}</td><td>{h.label}</td><td>{toINR(sumHead(h))}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="ra-card-subtitle">Re-appropriation Entries</div>
            <table className="ra-htable">
              <thead><tr><th>Sl.</th><th>From Head</th><th>To Head</th><th>Amount (₹)</th></tr></thead>
              <tbody>
                {reapRows.map((r, i) => (
                  <tr key={i}><td>{i + 1}</td><td>{r.from}</td><td>{r.to}</td><td>{toINR(parseFloat(r.amount))}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="ra-card-subtitle">Revised Distribution</div>
            <table className="ra-htable">
              <thead><tr><th>Sl.</th><th>Head</th><th>Original (₹)</th><th>Revised (₹)</th></tr></thead>
              <tbody>
                {updatedHeads.map((h, i) => (
                  <tr key={i}><td>{i + 1}</td><td>{h.label}</td><td>{toINR(h.original)}</td>
                    <td className={h.revised !== h.original ? "ra-revised" : ""}>{toINR(h.revised)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ra-report-actions">
            <button className="ra-btn ra-btn-preview" onClick={handlePreview}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Report
            </button>
            <button className="ra-btn ra-btn-download" onClick={handleDownload}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Report
            </button>
            <button className="ra-btn ra-btn-ghost" onClick={() => setStep(3)}>← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}