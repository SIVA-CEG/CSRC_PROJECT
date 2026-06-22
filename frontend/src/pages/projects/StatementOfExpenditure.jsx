import React, { useState, useRef, useEffect } from "react";
import "./StatementOfExpenditure.css";

// ── Static lookup data (trimmed to key entries for demo; replace with full arrays) ──

const fundingAgencyOptions = [
  { text: "Additional Director General of Police Operations, Chennai {ADGPO}", value: "ADGPO" },
  { text: "Anusandhan National Research Foundation (ANRF)", value: "ANRF" },
  { text: "Department of Science and Technology, New Delhi {DST}", value: "DST" },
  { text: "Science and Engineering Research Board, New Delhi {SERB}", value: "SERB" },
  { text: "Chief Minister Research Grant, Directorate of Technical Education{CMRG}", value: "CMRG" },
  { text: "Indian Space Research Organization {ISRO}", value: "ISRO" },
  { text: "Department of Biotechnology, New Delhi {DBT}", value: "DBT" },
  { text: "Ministry of Electronics & Information Technology, New Delhi {MeitY}", value: "MeitY" },
];

const projectSchemeOptions = [
  { text: "Core Research Grant {CRG}", value: "CRG" },
  { text: "CHIEF MINISTER'S RESEARCH GRANT (CMRG)", value: "CMRG" },
  { text: "Early Career Research Award {ECRA}", value: "ECRA" },
  { text: "INSPIRE Faculty Fellowship", value: "INSPIRE" },
  { text: "SERB Project", value: "SERB" },
  { text: "Major Research Project {MRP}", value: "MRP" },
  { text: "Research Promotion Scheme {RPS}", value: "RPS" },
];

const agencyTypeOptions = [
  { text: "Central", value: "C" },
  { text: "State", value: "S" },
  { text: "Private", value: "P" },
  { text: "Individual", value: "I" },
];

const departmentOptions = [
  { text: "Department of Information Science And Technology", value: "20" },
  { text: "Department of Computer Science and Engineering", value: "14" },
  { text: "Department of Electronics And Communication Engineering", value: "17" },
  { text: "Department of Mechanical Engineering", value: "24" },
  { text: "Department of Civil Engineering", value: "13" },
  { text: "Centre for Sponsored Research and Consultancy", value: "51" },
  { text: "Department of Electrical And Electronics Engineering", value: "16" },
  { text: "Department of Chemical Engineering", value: "12" },
];

const campusOptions = [
  { text: "CEG Campus", value: "1" },
  { text: "ACT Campus", value: "2" },
  { text: "MIT Campus", value: "3" },
  { text: "Bharathidasan Institute of Technology (BIT) Campus", value: "5" },
];

const facultyOptions = [
  { text: "Senthil Kumar. K.", value: "1" },
  { text: "Amudha. T.", value: "23" },
  { text: "Velraj. R.", value: "65" },
  { text: "Arulchelvan. S.", value: "8" },
  { text: "Balasubramanian. N.", value: "3" },
  { text: "Jayavel. R.", value: "22" },
  { text: "Iniyan. S.", value: "52" },
  { text: "Mythili. C.", value: "2" },
];

// ── Demo project database ──

const projectDatabase = [
  {
    id: "P001",
    fileNo: "607/CTDT-2/2022",
    title: "Development of AI-based Traffic Monitoring System",
    pi: "Senthil Kumar. K.",
    piFacultyId: "1",
    designation: "Professor",
    department: "Department of Information Science And Technology",
    departmentId: "20",
    campus: "MIT Campus",
    campusId: "3",
    fundingAgencyId: "ADGPO",
    fundingAgency: "Additional Director General of Police Operations, Chennai {ADGPO}",
    schemeId: "MRP",
    scheme: "Major Research Project {MRP}",
    agencyType: "C",
    sanctionDate: "2022-08-09",
    durationYears: 3,
    totalSanctionedAmount: 1140000,
    sanctionedHeads: {
      nonRecurring: [
        {
          label: "Equipment",
          amount: 500000,
          items: [
            { name: "High Performance Workstation", amount: 300000 },
            { name: "GPU Server", amount: 200000 },
          ],
        },
      ],
      recurring: [
        {
          label: "Manpower",
          amount: 300000,
          items: [
            { name: "Project Associate-I", amount: 200000 },
            { name: "Junior Research Fellow", amount: 100000 },
          ],
        },
        { label: "Consumables & Accessories", amount: 150000, items: [] },
        { label: "Travel", amount: 50000, items: [] },
        { label: "Contingency", amount: 25000, items: [] },
      ],
      overhead: 120000,
      overheadBreakdown: [
        { label: "i) The Registrar A/C, Chennai 5%", amount: 40000 },
        { label: "ii) CSRC Revenue, Chennai 4%", amount: 32000 },
        { label: "iii) The Dean, Campus A/C 4%", amount: 32000 },
        { label: "iv) The Principal Investigator PDF 2%", amount: 16000 },
      ],
      ssr: 30000,
    },
    yearlyData: [
      {
        year: "I Year",
        period: "09/08/2022 to 31/03/2023",
        grantReceived: 500000,
        expenditure: 500000,
      },
      {
        year: "II Year",
        period: "01/04/2023 to 31/03/2024",
        grantReceived: 380000,
        expenditure: 380000,
      },
      {
        year: "III Year",
        period: "01/04/2024 to 31/03/2025",
        grantReceived: 260000,
        expenditure: 260000,
      },
    ],
  },
  {
    id: "P002",
    fileNo: "CMRG/2025/014",
    title: "Renewable Energy Integration in Smart Grid Networks",
    pi: "Iniyan. S.",
    piFacultyId: "52",
    designation: "Professor",
    department: "Department of Electrical And Electronics Engineering",
    departmentId: "16",
    campus: "CEG Campus",
    campusId: "1",
    fundingAgencyId: "CMRG",
    fundingAgency: "Chief Minister Research Grant, Directorate of Technical Education{CMRG}",
    schemeId: "CMRG",
    scheme: "CHIEF MINISTER'S RESEARCH GRANT (CMRG)",
    agencyType: "S",
    sanctionDate: "2023-04-01",
    durationYears: 2,
    totalSanctionedAmount: 2500000,
    sanctionedHeads: {
      nonRecurring: [
        {
          label: "Equipment",
          amount: 1200000,
          items: [
            { name: "Solar Simulation Setup", amount: 700000 },
            { name: "Power Analyser", amount: 500000 },
          ],
        },
      ],
      recurring: [
        {
          label: "Manpower",
          amount: 600000,
          items: [
            { name: "Project Associate-II", amount: 360000 },
            { name: "Junior Research Fellow", amount: 240000 },
          ],
        },
        { label: "Consumables & Accessories", amount: 300000, items: [] },
        { label: "Travel", amount: 100000, items: [] },
        { label: "Contingency", amount: 50000, items: [] },
      ],
      overhead: 200000,
      overheadBreakdown: [
        { label: "i) The Registrar A/C, Chennai 5%", amount: 80000 },
        { label: "ii) CSRC Revenue, Chennai 4%", amount: 64000 },
        { label: "iii) The Dean, Campus A/C 4%", amount: 32000 },
        { label: "iv) The Principal Investigator PDF 2%", amount: 24000 },
      ],
      ssr: 50000,
    },
    yearlyData: [
      {
        year: "I Year",
        period: "01/04/2023 to 31/03/2024",
        grantReceived: 1500000,
        expenditure: 1450000,
      },
      {
        year: "II Year",
        period: "01/04/2024 to 31/03/2025",
        grantReceived: 1000000,
        expenditure: 980000,
      },
    ],
  },
  {
    id: "P003",
    fileNo: "DST/SERB/2021/CRG/089",
    title: "Nanostructured Materials for Water Purification",
    pi: "Jayavel. R.",
    piFacultyId: "22",
    designation: "Professor",
    department: "Department of Chemical Engineering",
    departmentId: "12",
    campus: "CEG Campus",
    campusId: "1",
    fundingAgencyId: "SERB",
    fundingAgency: "Science and Engineering Research Board, New Delhi {SERB}",
    schemeId: "CRG",
    scheme: "Core Research Grant {CRG}",
    agencyType: "C",
    sanctionDate: "2021-01-15",
    durationYears: 3,
    totalSanctionedAmount: 4200000,
    sanctionedHeads: {
      nonRecurring: [
        {
          label: "Equipment",
          amount: 1800000,
          items: [
            { name: "Scanning Electron Microscope (SEM)", amount: 1200000 },
            { name: "UV-Vis Spectrophotometer", amount: 600000 },
          ],
        },
      ],
      recurring: [
        {
          label: "Manpower",
          amount: 1200000,
          items: [
            { name: "Senior Research Fellow", amount: 720000 },
            { name: "Junior Research Fellow", amount: 480000 },
          ],
        },
        { label: "Consumables & Accessories", amount: 600000, items: [] },
        { label: "Travel", amount: 200000, items: [] },
        { label: "Contingency", amount: 100000, items: [] },
      ],
      overhead: 252000,
      overheadBreakdown: [
        { label: "i) The Registrar A/C, Chennai 5%", amount: 105000 },
        { label: "ii) CSRC Revenue, Chennai 4%", amount: 84000 },
        { label: "iii) The Dean, Campus A/C 4%", amount: 42000 },
        { label: "iv) The Principal Investigator PDF 2%", amount: 21000 },
      ],
      ssr: 48000,
    },
    yearlyData: [
      {
        year: "I Year",
        period: "15/01/2021 to 31/03/2022",
        grantReceived: 1800000,
        expenditure: 1750000,
      },
      {
        year: "II Year",
        period: "01/04/2022 to 31/03/2023",
        grantReceived: 1400000,
        expenditure: 1350000,
      },
      {
        year: "III Year",
        period: "01/04/2023 to 31/03/2024",
        grantReceived: 1000000,
        expenditure: 960000,
      },
    ],
  },
];

// ── Helpers ──

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ordinal = ["I", "II", "III", "IV", "V", "VI"];

// ── Sub-components ──

function FilterPanel({ filters, onChange, onSearch, onClear }) {
  const field = (name, label, options) => (
    <div className="soe-field">
      <label className="soe-label">{label}</label>
      <select
        className="soe-select"
        name={name}
        value={filters[name]}
        onChange={onChange}
      >
        <option value="">All</option>
        {options.map((o, i) => (
          <option key={i} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="soe-filter-card">
      <div className="soe-filter-header">
        <span className="soe-filter-icon">⚙</span>
        <h2>Project Selection Filters</h2>
      </div>

      <div className="soe-filter-grid">
        {field("fundingAgency", "Funding Agency", fundingAgencyOptions)}
        {field("projectScheme", "Project Scheme", projectSchemeOptions)}
        {field("agencyType", "Agency Type", agencyTypeOptions)}
        {field("faculty", "Faculty / PI", facultyOptions)}
        {field("department", "Department", departmentOptions)}
        {field("campus", "Campus", campusOptions)}
      </div>

      <div className="soe-date-section">
        {[
          ["creditFrom", "creditTo", "Credit Date"],
          ["endFrom", "endTo", "Project End Date"],
          ["sanctionFrom", "sanctionTo", "Project Sanction Date"],
        ].map(([from, to, label]) => (
          <div key={label} className="soe-date-row">
            <span className="soe-date-label">{label}</span>
            <input
              className="soe-date-input"
              type="date"
              name={from}
              value={filters[from]}
              onChange={onChange}
            />
            <span className="soe-date-sep">to</span>
            <input
              className="soe-date-input"
              type="date"
              name={to}
              value={filters[to]}
              onChange={onChange}
            />
          </div>
        ))}
      </div>

      <div className="soe-btn-row">
        <button className="soe-btn-search" onClick={onSearch}>
          Search Projects
        </button>
        <button className="soe-btn-clear" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

function ProjectSelector({ projects, selectedId, onSelect }) {
  if (!projects.length) return null;

  return (
    <div className="soe-project-list">
      <h3 className="soe-section-title">
        {projects.length} project{projects.length !== 1 ? "s" : ""} found — select to generate SoE
      </h3>
      <div className="soe-project-cards">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`soe-project-card ${selectedId === p.id ? "selected" : ""}`}
            onClick={() => onSelect(p.id)}
          >
            <div className="soe-proj-file">{p.fileNo}</div>
            <div className="soe-proj-title">{p.title}</div>
            <div className="soe-proj-meta">
              <span>{p.pi}</span>
              <span className="soe-dot">·</span>
              <span>{p.department.replace("Department of ", "")}</span>
              <span className="soe-dot">·</span>
              <span>{p.campus}</span>
            </div>
            <div className="soe-proj-agency">{p.fundingAgency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── html2pdf loader (loads script once from CDN) ──
function useHtml2Pdf() {
  const [ready, setReady] = useState(!!window.html2pdf);
  useEffect(() => {
    if (window.html2pdf) { setReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

// ── Inline PDF styles injected into the cloned DOM node ──
const PDF_STYLES = `
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10pt; color: #000; margin: 0; }
  .soe-doc-title { text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 4px; }
  .soe-doc-sub { text-align: center; font-size: 9pt; font-style: italic; margin-bottom: 14px; color: #333; }
  .soe-table, .soe-budget-table { border-collapse: collapse; width: 100%; margin-bottom: 24px; font-size: 8.5pt; }
  .soe-table th, .soe-table td,
  .soe-budget-table th, .soe-budget-table td { border: 1px solid #555; padding: 4px 6px; vertical-align: top; }
  .soe-table th, .soe-budget-table th { background: #dde4f0; font-weight: bold; text-align: center; }
  .soe-section-row td { background: #e8ecf5; font-weight: bold; }
  .soe-grand-row td { background: #dde4f0; font-weight: bold; border-top: 2px solid #333; }
  .soe-budget-section td { background: #f0ede8; font-weight: bold; }
  .soe-budget-grand td { background: #dde4f0; font-weight: bold; border-top: 2px solid #333; }
  .soe-total-cell { background: #f0f4fc; font-weight: 600; }
  .soe-budget-sub { display: flex; justify-content: space-between; font-size: 8pt; color: #333; padding-left: 10px; margin-top: 2px; }
  .soe-budget-sub-amt { font-weight: 500; min-width: 80px; text-align: right; }
  .soe-budget-count { font-size: 7.5pt; color: #666; font-style: italic; margin-top: 3px; padding-left: 4px; }
  .soe-sub-item { font-size: 7.5pt; color: #444; padding-left: 8px; margin-top: 1px; }
  .soe-year-label { display: block; font-size: 8pt; font-weight: bold; }
  .soe-year-period { display: block; font-size: 7pt; color: #444; }
  .soe-signature { text-align: right; font-size: 10pt; font-weight: bold; margin-top: 32px; padding-right: 4px; }
  .soe-budget-title { text-align: center; font-size: 12pt; font-weight: bold; margin: 28px 0 4px; padding-top: 20px; border-top: 1px dashed #aaa; }
  .text-right { text-align: right !important; }
  .text-center { text-align: center !important; }
  .soe-doc-actions { display: none !important; }
`;

function SoEDocument({ project }) {
  const printRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const html2pdfReady = useHtml2Pdf();

  const { yearlyData, sanctionedHeads: sh } = project;
  const years = yearlyData.length;

  const totalGrantReceived = yearlyData.reduce((s, y) => s + y.grantReceived, 0);
  const totalExpenditure = yearlyData.reduce((s, y) => s + y.expenditure, 0);
  const balance = totalGrantReceived - totalExpenditure;

  const fyPeriod = `${yearlyData[0].period.split(" ")[0]} to ${yearlyData[years - 1].period.split(" ").pop()}`;

  // Build sanctioned head rows (kept for rendering)
  const nrTotal = sh.nonRecurring.reduce((s, h) => s + h.amount, 0);
  const rTotal = sh.recurring.reduce((s, h) => s + h.amount, 0);
  const grandTotal = nrTotal + rTotal + sh.overhead + sh.ssr;

  // ── Build a clean printable DOM node ──
  const buildPrintNode = () => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "width:100%;padding:0;margin:0;background:#fff;";

    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.textContent = PDF_STYLES;
    wrapper.appendChild(styleEl);

    // Clone the document content
    const clone = printRef.current.cloneNode(true);
    // Hide action buttons inside clone
    clone.querySelectorAll(".soe-doc-actions").forEach((el) => el.remove());
    wrapper.appendChild(clone);
    return wrapper;
  };

  const html2pdfOptions = (filename) => ({
    margin: [10, 10, 10, 10],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    pagebreak: { mode: ["avoid-all", "css"] },
  });

  const handleDownload = async () => {
    if (!html2pdfReady) return;
    setGenerating(true);
    try {
      const node = buildPrintNode();
      document.body.appendChild(node);
      await window.html2pdf()
        .set(html2pdfOptions(`SoE_${project.fileNo.replace(/\//g, "-")}.pdf`))
        .from(node)
        .save();
      document.body.removeChild(node);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = async () => {
    if (!html2pdfReady) return;
    setGenerating(true);
    try {
      const node = buildPrintNode();
      document.body.appendChild(node);
      const pdfBlob = await window.html2pdf()
        .set(html2pdfOptions(`SoE_${project.fileNo.replace(/\//g, "-")}.pdf`))
        .from(node)
        .outputPdf("blob");
      document.body.removeChild(node);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      setShowPreview(true);
    } finally {
      setGenerating(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      {/* ── Preview Modal ── */}
      {showPreview && previewUrl && (
        <div className="soe-modal-overlay" onClick={closePreview}>
          <div className="soe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="soe-modal-header">
              <span>Preview — {project.fileNo}</span>
              <div className="soe-modal-actions">
                <button
                  className="soe-btn-dl-modal"
                  onClick={handleDownload}
                  disabled={generating}
                >
                  ⬇ Download PDF
                </button>
                <button className="soe-modal-close" onClick={closePreview}>✕</button>
              </div>
            </div>
            <iframe
              src={previewUrl}
              className="soe-preview-iframe"
              title="SoE Preview"
            />
          </div>
        </div>
      )}

    <div className="soe-document-wrapper">
      <div className="soe-doc-actions">
        <button
          className="soe-btn-preview"
          onClick={handlePreview}
          disabled={!html2pdfReady || generating}
        >
          {generating ? "⏳ Generating…" : "👁 Preview PDF"}
        </button>
        <button
          className="soe-btn-print"
          onClick={handleDownload}
          disabled={!html2pdfReady || generating}
        >
          {generating ? "⏳ Generating…" : "⬇ Download PDF"}
        </button>
      </div>

      <div className="soe-document" ref={printRef}>

        {/* ── SoE Table ── */}
        <div className="soe-doc-title">Statement of Expenditure (SoE)</div>
        <div className="soe-doc-sub">
          (Showing grants received and the Expenditure incurred during the period from {fyPeriod})
        </div>

        <table className="soe-table">
          <thead>
            <tr>
              <th rowSpan={2} className="soe-th-sl">Sl. No.</th>
              <th rowSpan={2} className="soe-th-heads">Sanctioned Heads</th>
              {yearlyData.map((y, i) => (
                <th key={i} colSpan={1} className="soe-th-year">
                  Grant Received<br />
                  <span className="soe-year-label">{ordinal[i]} Year</span><br />
                  <span className="soe-year-period">{y.period}</span>
                </th>
              ))}
              <th className="soe-th-total">Total Grant<br />Received Rs.</th>
              {yearlyData.map((y, i) => (
                <th key={i} className="soe-th-year">
                  Expenditure<br />
                  <span className="soe-year-label">{ordinal[i]} Year</span><br />
                  <span className="soe-year-period">{y.period}</span>
                </th>
              ))}
              <th className="soe-th-total">Total<br />Expenditure Rs.</th>
              <th className="soe-th-balance">Balance<br />Amount Rs.</th>
            </tr>
          </thead>
          <tbody>
            {/* Non-Recurring */}
            <tr className="soe-section-row">
              <td colSpan={3 + years * 2} className="soe-section-label">
                A. Non-Recurring Heads
              </td>
            </tr>
            {sh.nonRecurring.map((h, hi) => {
              const yr = splitAcrossYears(h.amount, yearlyData, "grantReceived", totalGrantReceived);
              const ye = splitAcrossYears(h.amount, yearlyData, "expenditure", totalExpenditure);
              const hBal = yr.reduce((s, v) => s + v, 0) - ye.reduce((s, v) => s + v, 0);
              return (
                <tr key={hi} className="soe-data-row">
                  <td className="text-center">{hi + 1}</td>
                  <td>
                    {h.label}
                    {h.items.map((it, ii) => (
                      <div key={ii} className="soe-sub-item">• {it.name}</div>
                    ))}
                  </td>
                  {yr.map((v, i) => <td key={i} className="text-right">{fmt(v)}</td>)}
                  <td className="text-right soe-total-cell">{fmt(yr.reduce((s, v) => s + v, 0))}</td>
                  {ye.map((v, i) => <td key={i} className="text-right">{fmt(v)}</td>)}
                  <td className="text-right soe-total-cell">{fmt(ye.reduce((s, v) => s + v, 0))}</td>
                  <td className="text-right">{hBal === 0 ? "-" : fmt(hBal)}</td>
                </tr>
              );
            })}

            {/* Recurring */}
            <tr className="soe-section-row">
              <td colSpan={3 + years * 2} className="soe-section-label">
                B. Recurring Heads
              </td>
            </tr>
            {sh.recurring.map((h, hi) => {
              const yr = splitAcrossYears(h.amount, yearlyData, "grantReceived", totalGrantReceived);
              const ye = splitAcrossYears(h.amount, yearlyData, "expenditure", totalExpenditure);
              const hBal = yr.reduce((s, v) => s + v, 0) - ye.reduce((s, v) => s + v, 0);
              return (
                <tr key={hi} className="soe-data-row">
                  <td className="text-center">{hi + 1}</td>
                  <td>
                    {h.label}
                    {h.items.map((it, ii) => (
                      <div key={ii} className="soe-sub-item">• {it.name}</div>
                    ))}
                  </td>
                  {yr.map((v, i) => <td key={i} className="text-right">{fmt(v)}</td>)}
                  <td className="text-right soe-total-cell">{fmt(yr.reduce((s, v) => s + v, 0))}</td>
                  {ye.map((v, i) => <td key={i} className="text-right">{fmt(v)}</td>)}
                  <td className="text-right soe-total-cell">{fmt(ye.reduce((s, v) => s + v, 0))}</td>
                  <td className="text-right">{hBal === 0 ? "-" : fmt(hBal)}</td>
                </tr>
              );
            })}

            {/* Grand Total */}
            <tr className="soe-grand-row">
              <td colSpan={2} className="text-center"><strong>Grand Total</strong></td>
              {yearlyData.map((y, i) => (
                <td key={i} className="text-right"><strong>{fmt(y.grantReceived)}</strong></td>
              ))}
              <td className="text-right soe-total-cell"><strong>{fmt(totalGrantReceived)}</strong></td>
              {yearlyData.map((y, i) => (
                <td key={i} className="text-right"><strong>{fmt(y.expenditure)}</strong></td>
              ))}
              <td className="text-right soe-total-cell"><strong>{fmt(totalExpenditure)}</strong></td>
              <td className="text-right"><strong>{balance === 0 ? "-" : fmt(balance)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="soe-signature">Director, CSRC</div>

        {/* ── Budget / Sanctioned Heads Table ── */}
        <div className="soe-budget-title">Head of Account — Sanctioned Budget</div>
        <div className="soe-doc-sub">Project File No: {project.fileNo} &nbsp;|&nbsp; PI: {project.pi}</div>

        <table className="soe-budget-table">
          <thead>
            <tr>
              <th className="soe-bth-sl">Sl. No.</th>
              <th>Head of Account</th>
              <th className="soe-bth-amt">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {/* Non-Recurring */}
            <tr className="soe-budget-section">
              <td><strong>A</strong></td>
              <td colSpan={2}>
                <strong>Non-Recurring Heads (₹ {fmt(sh.nonRecurring.reduce((s, h) => s + h.amount, 0))})</strong>
              </td>
            </tr>
            {sh.nonRecurring.map((h, i) => (
              <tr key={i} className="soe-budget-row">
                <td className="text-center">{i + 1}</td>
                <td>
                  {h.label}
                  {h.items.map((it, ii) => (
                    <div key={ii} className="soe-budget-sub">
                      • {it.name}
                      <span className="soe-budget-sub-amt">₹ {fmt(it.amount)}</span>
                    </div>
                  ))}
                  {h.items.length > 0 && (
                    <div className="soe-budget-count">No. of equipment types: {h.items.length}</div>
                  )}
                </td>
                <td className="text-right">{fmt(h.amount)}</td>
              </tr>
            ))}

            {/* Recurring */}
            <tr className="soe-budget-section">
              <td><strong>B</strong></td>
              <td colSpan={2}>
                <strong>Recurring Heads (₹ {fmt(sh.recurring.reduce((s, h) => s + h.amount, 0))})</strong>
              </td>
            </tr>
            {sh.recurring.map((h, i) => (
              <tr key={i} className="soe-budget-row">
                <td className="text-center">{i + 1}</td>
                <td>
                  {h.label}
                  {h.items.map((it, ii) => (
                    <div key={ii} className="soe-budget-sub">
                      • {it.name}
                      <span className="soe-budget-sub-amt">₹ {fmt(it.amount)}</span>
                    </div>
                  ))}
                  {h.items.length > 0 && (
                    <div className="soe-budget-count">No. of manpower types: {h.items.length}</div>
                  )}
                </td>
                <td className="text-right">{fmt(h.amount)}</td>
              </tr>
            ))}

            {/* Overhead */}
            <tr className="soe-budget-section">
              <td><strong>C</strong></td>
              <td colSpan={2}>
                <strong>Overhead (₹ {fmt(sh.overhead)})</strong>
              </td>
            </tr>
            {sh.overheadBreakdown.map((o, i) => (
              <tr key={i} className="soe-budget-row">
                <td className="text-center">{i + 5}</td>
                <td style={{ paddingLeft: "24px" }}>{o.label}</td>
                <td className="text-right">{fmt(o.amount)}</td>
              </tr>
            ))}

            {/* SSR */}
            <tr className="soe-budget-row">
              <td className="text-center"><strong>D</strong></td>
              <td>Scientific Social Responsibility Budget Detail</td>
              <td className="text-right">{fmt(sh.ssr)}</td>
            </tr>

            {/* Grand Total */}
            <tr className="soe-budget-grand">
              <td colSpan={2} className="text-right"><strong>Total Amount</strong></td>
              <td className="text-right"><strong>{fmt(grandTotal)}</strong></td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
    </>
  );
}

// Proportionally split a head's amount across years based on grant distribution
function splitAcrossYears(headAmount, yearlyData, key, total) {
  if (total === 0) return yearlyData.map(() => 0);
  return yearlyData.map((y) => Math.round((y[key] / total) * headAmount));
}

// ── Main Component ──

export default function StatementOfExpenditure() {
  const [filters, setFilters] = useState({
    fundingAgency: "",
    projectScheme: "",
    agencyType: "",
    faculty: "",
    department: "",
    campus: "",
    creditFrom: "", creditTo: "",
    endFrom: "", endTo: "",
    sanctionFrom: "", sanctionTo: "",
  });
  const [results, setResults] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = () => {
    const filtered = projectDatabase.filter((p) => {
      if (filters.fundingAgency && p.fundingAgencyId !== filters.fundingAgency) return false;
      if (filters.projectScheme && p.schemeId !== filters.projectScheme) return false;
      if (filters.agencyType && p.agencyType !== filters.agencyType) return false;
      if (filters.faculty && p.piFacultyId !== filters.faculty) return false;
      if (filters.department && p.departmentId !== filters.department) return false;
      if (filters.campus && p.campusId !== filters.campus) return false;
      if (filters.sanctionFrom && p.sanctionDate < filters.sanctionFrom) return false;
      if (filters.sanctionTo && p.sanctionDate > filters.sanctionTo) return false;
      return true;
    });
    setResults(filtered);
    setSelectedProjectId(null);
  };

  const handleClear = () => {
    setFilters({
      fundingAgency: "", projectScheme: "", agencyType: "", faculty: "",
      department: "", campus: "", creditFrom: "", creditTo: "",
      endFrom: "", endTo: "", sanctionFrom: "", sanctionTo: "",
    });
    setResults(null);
    setSelectedProjectId(null);
  };

  const selectedProject = results?.find((p) => p.id === selectedProjectId);

  return (
    <div className="soe-page">
      <div className="soe-page-header">
        <h1>Statement of Expenditure</h1>
        <p>Select a project to generate the SoE document with year-wise grant and expenditure breakdown</p>
      </div>

      <FilterPanel
        filters={filters}
        onChange={handleChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {results !== null && (
        <>
          <ProjectSelector
            projects={results}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />

          {results.length === 0 && (
            <div className="soe-empty">No projects found matching the selected filters.</div>
          )}
        </>
      )}

      {selectedProject && <SoEDocument project={selectedProject} />}
    </div>
  );
}