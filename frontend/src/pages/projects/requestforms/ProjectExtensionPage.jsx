import React, { useState, useRef } from "react";
import "./ProjectExtensionPage.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ─── Dummy project data ─────────────────────────────────── */
const DUMMY_PROJECTS = [
  {
    id: "P001",
    title: "Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2",
    pi: "Dr. S. Balasivanandha Prabu",
    department: "Department of Mechanical Engineering, CEG Campus",
    agency: "SERB",
    procNo: "2433/CTDT-2/2020, dated 10-12-2020",
    sanctionedDate: "10-12-2020",
    originalEndDate: "09-12-2023",
    duration: "3 Years",
    status: "Active",
  },
  {
    id: "P002",
    title: "Design and Development of Smart Sensor Networks for Structural Health Monitoring",
    pi: "Dr. K. Rajeswari",
    department: "Department of Electronics & Communication Engineering, CEG Campus",
    agency: "DST",
    procNo: "1892/CTDT-5/2021, dated 15-03-2021",
    sanctionedDate: "15-03-2021",
    originalEndDate: "14-03-2024",
    duration: "3 Years",
    status: "Active",
  },
  {
    id: "P003",
    title: "AI-driven Drug Discovery Framework for Tropical Disease Management",
    pi: "Dr. P. Anbalagan",
    department: "Department of Biotechnology, ACT Campus",
    agency: "DBT",
    procNo: "3011/CTDT-1/2022, dated 22-07-2022",
    sanctionedDate: "22-07-2022",
    originalEndDate: "21-07-2025",
    duration: "3 Years",
    status: "Active",
  },
  {
    id: "P004",
    title: "Renewable Energy Integration in Microgrids: Stability and Control",
    pi: "Dr. T. Vijayakumar",
    department: "Department of Electrical Engineering, CEG Campus",
    agency: "MNRE",
    procNo: "0774/CTDT-3/2020, dated 05-09-2020",
    sanctionedDate: "05-09-2020",
    originalEndDate: "04-09-2023",
    duration: "3 Years",
    status: "Completed",
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
const today = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// Parse dd-mm-yyyy to Date object
const parseDMY = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

// Format Date to dd-mm-yyyy
const formatDMY = (date) => {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

// Format Date to "DD Month YYYY" (long)
const formatLong = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Convert dd-mm-yyyy to yyyy-mm-dd for input[type=date]
const toInputDate = (dmyStr) => {
  if (!dmyStr) return "";
  const parts = dmyStr.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Compute human-readable duration between two dates
const durationBetween = (startStr, endDate) => {
  const start = parseDMY(startStr);
  if (!start || !endDate) return "";
  let months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  if (endDate.getDate() < start.getDate()) months -= 1;
  if (months <= 0) return "";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
  if (rem > 0) parts.push(`${rem} Month${rem > 1 ? "s" : ""}`);
  return "+" + parts.join(" ");
};

/* ─── Status Badge ────────────────────────────────────────── */
function StatusBadge({ status }) {
  return (
    <span className={`pe-status-badge ${status === "Active" ? "active" : "completed"}`}>
      <span className="pe-status-dot" />
      {status}
    </span>
  );
}

/* ─── Report Generator ────────────────────────────────────── */
function generateReport({ project, revisedEndDate, revisedEndDateLong, extensionLabel, reason }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Project Extension Request</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:12px;color:#000;background:#fff;}
.page{width:210mm;min-height:297mm;padding:20mm 22mm;position:relative;}
h2{font-size:14px;text-align:center;font-weight:bold;margin-bottom:2px;}
h3{font-size:12px;text-align:center;font-weight:bold;margin-bottom:12px;}
table{width:100%;border-collapse:collapse;margin:12px 0;}
th,td{border:1px solid #555;padding:6px 10px;font-size:11.5px;vertical-align:top;}
th{background:#f0f0f0;font-weight:bold;text-align:left;}
.info-table td{border:none;padding:4px 6px;vertical-align:top;}
.info-table td:first-child{font-weight:bold;width:230px;white-space:nowrap;}
p{margin:10px 0;text-align:justify;line-height:1.75;font-size:12px;}
.sig-row{display:flex;justify-content:space-between;margin-top:55px;}
.sig-box{text-align:center;width:40%;}
.sig-line{border-top:1px solid #000;padding-top:6px;font-size:11.5px;}
.to-block{margin-top:36px;font-size:12px;line-height:2;}
.print-btn{position:fixed;top:10px;right:10px;padding:9px 20px;background:#1a237e;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999;letter-spacing:.3px;}
@media print{.print-btn{display:none;}}
</style></head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
<h2>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h2>
<h2>ANNA UNIVERSITY, CHENNAI – 600 025</h2>
<h3 style="margin-top:12px;text-decoration:underline;">REQUEST FOR PROJECT EXTENSION</h3>

<table class="info-table" style="border:none;margin-top:4px;">
  <tr><td>Funding Agency</td><td>: ${project.agency}</td></tr>
  <tr><td>Project Title</td><td>: ${project.title}</td></tr>
  <tr><td>Principal Investigator</td><td>: ${project.pi}</td></tr>
  <tr><td>Department &amp; Campus</td><td>: ${project.department}</td></tr>
  <tr><td>CTDT Procs. No. &amp; Date</td><td>: ${project.procNo}</td></tr>
  <tr><td>Date of Sanction</td><td>: ${project.sanctionedDate}</td></tr>
  <tr><td>Original Project Duration</td><td>: ${project.duration}</td></tr>
  <tr><td>Original End Date</td><td>: ${project.originalEndDate}</td></tr>
  <tr><td>Extension Period</td><td>: <strong>${extensionLabel}</strong></td></tr>
  <tr><td>Proposed Revised End Date</td><td>: <strong>${revisedEndDateLong}</strong></td></tr>
  <tr><td>Date of Request</td><td>: ${today()}</td></tr>
</table>

<p style="margin-top:20px;">
  The Principal Investigator respectfully requests the Director, Centre for Sponsored Research and Consultancy,
  Anna University, Chennai – 600 025, to kindly consider and accord sanction for a <strong>no-cost extension</strong>
  of the above-mentioned project, thereby extending the project completion date from
  <strong>${project.originalEndDate}</strong> to <strong>${revisedEndDateLong}</strong>.
</p>

${reason ? `<h3 style="margin-top:22px;font-size:12px;text-align:left;">Reason for Extension</h3>
<p>${reason}</p>` : ""}

<p style="margin-top:20px;">
  It is certified that:
</p>
<ol style="font-size:12px;line-height:2;padding-left:22px;margin-top:6px;">
  <li>No additional funds are being requested along with this extension.</li>
  <li>The project objectives remain unchanged.</li>
  <li>The extension is essential to complete all deliverables and submit the final report.</li>
  <li>The funding agency has been / will be duly informed about this extension request.</li>
</ol>

<div class="sig-row">
  <div class="sig-box">
    <div class="sig-line">Signature of Principal Investigator</div>
    <div style="font-size:10.5px;margin-top:5px;">${project.pi}</div>
    <div style="font-size:10.5px;">${project.department}</div>
    <div style="font-size:10.5px;margin-top:4px;">Date: ________________</div>
  </div>
  <div class="sig-box">
    <div class="sig-line">Signature of Professor &amp; Head / Dean</div>
    <div style="font-size:10.5px;margin-top:5px;">Date: ________________</div>
  </div>
</div>

<div class="to-block">
  <div style="margin-top:44px;"><strong>To</strong></div>
  <div>The Director,</div>
  <div>Centre for Sponsored Research and Consultancy,</div>
  <div>Anna University, Chennai – 600 025.</div>
  <div style="margin-top:10px;"><strong>Encl:</strong> Project Extension Request Letter from Funding Agency (if applicable)</div>
  <div style="margin-top:6px;"><strong>Copy to:</strong> Project File / CTDT File</div>
</div>
</div></body></html>`;
}

/* ─── Main Component ──────────────────────────────────────── */
export default function ProjectExtensionPage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQ, setSearchQ] = useState("");

  // Step 2 fields
  const [revisedEndDateInput, setRevisedEndDateInput] = useState(""); // yyyy-mm-dd for input
  const [reason, setReason] = useState("");
  const [requestLetter, setRequestLetter] = useState(null);

  // Step 3 — approval status (simulated)
  const [approvalStatus] = useState({
    "P001": { status: "approved", date: "12-05-2024", remarks: "Extension approved as per funding agency request. Project to be completed by revised end date." },
    "P003": { status: "declined", date: "03-04-2024", remarks: "Insufficient justification provided. Please resubmit with detailed work completion status and agency letter." },
  });

  const STEPS = ["Select Project", "Extension Details", "Review & Submit"];

  const filteredProjects = DUMMY_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.pi.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.agency.toLowerCase().includes(searchQ.toLowerCase())
  );

  // Compute revised end date objects from input
  const revisedEndDateObj = revisedEndDateInput ? new Date(revisedEndDateInput) : null;
  const revisedEndDateDMY = revisedEndDateObj ? formatDMY(revisedEndDateObj) : "";
  const revisedEndDateLong = revisedEndDateObj ? formatLong(revisedEndDateObj) : "";

  // Compute extension label (e.g. "+6 Months") between original end and revised end
  const extensionLabel = selectedProject && revisedEndDateObj
    ? durationBetween(selectedProject.originalEndDate, revisedEndDateObj)
    : "";

  // Min date for date picker = day after original end date
  const minDateForPicker = selectedProject
    ? (() => {
        const d = parseDMY(selectedProject.originalEndDate);
        if (!d) return "";
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      })()
    : "";

  const goStep2 = () => {
    if (!selectedProject) return alert("Please select a project.");
    setStep(2);
  };

  const goStep3 = () => {
    if (!revisedEndDateInput) return alert("Please select a revised end date.");
    if (!revisedEndDateObj || (minDateForPicker && revisedEndDateInput < minDateForPicker))
      return alert("Revised end date must be after the original end date.");
    setStep(3);
  };

  const createPdf = async (mode) => {
  const html = generateReport({
    project: selectedProject,
    revisedEndDate: revisedEndDateDMY,
    revisedEndDateLong,
    extensionLabel,
    reason,
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

  const fileName = `extension_${selectedProject.id}_${revisedEndDateDMY.replace(/\//g, "-")}.pdf`;

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

  const projectApproval = selectedProject ? approvalStatus[selectedProject.id] : null;

  return (
    <div className="pe-page">
      {/* Header */}
      <div className="pe-header">
        <div className="page-breadcrumb">
          Home /{" "}
          <span onClick={() => onNavigate && onNavigate("projects")}>My Projects</span> /{" "}
          <span onClick={() => onNavigate && onNavigate("requestforms")}>Request Forms</span> /{" "}
          <span>Project Extension</span>
        </div>
        <h1 className="page-title">Project Extension Request</h1>
        <p className="page-subtitle">Apply for a no-cost timeline extension for your sponsored project</p>
      </div>

      {/* Step Bar */}
      <div className="pe-stepbar">
        {STEPS.map((s, i) => (
          <div key={i} className={`pe-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
            <div className="pe-step-circle">
              {step > i + 1 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (i + 1)}
            </div>
            <div className="pe-step-label">{s}</div>
            {i < STEPS.length - 1 && <div className="pe-step-line" />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Select Project ── */}
      {step === 1 && (
        <div className="pe-animate">
          <div className="pe-card">
            <div className="pe-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h8M8 17h5" /></svg>
              Select Project for Extension
            </div>

            {/* Search */}
            <div className="pe-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pe-search-icon">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="pe-search-input"
                placeholder="Search by project title, PI, or funding agency..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>

            {/* Project Cards */}
            <div className="pe-project-list">
              {filteredProjects.map((p) => {
                const approval = approvalStatus[p.id];
                return (
                  <div
                    key={p.id}
                    className={`pe-project-card ${selectedProject?.id === p.id ? "selected" : ""}`}
                    onClick={() => setSelectedProject(p)}
                  >
                    <div className="pe-project-card-top">
                      <div className="pe-project-id">{p.id}</div>
                      <div className="pe-project-badges">
                        <StatusBadge status={p.status} />
                        {approval && (
                          <span className={`pe-approval-pill ${approval.status}`}>
                            {approval.status === "approved" ? "✓ Approved" : "✗ Declined"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="pe-project-title">{p.title}</div>
                    <div className="pe-project-meta">
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {p.pi}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                        {p.department.split(",")[0]}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                        {p.agency}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        Ends: {p.originalEndDate}
                      </span>
                    </div>
                    {selectedProject?.id === p.id && (
                      <div className="pe-project-check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredProjects.length === 0 && (
                <div className="pe-empty">No projects found matching your search.</div>
              )}
            </div>
          </div>

          {/* Approval Status Panel (if project has prior result) */}
          {selectedProject && approvalStatus[selectedProject.id] && (
            <div className={`pe-card pe-approval-banner ${approvalStatus[selectedProject.id].status}`}>
              <div className="pe-approval-banner-icon">
                {approvalStatus[selectedProject.id].status === "approved" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                )}
              </div>
              <div className="pe-approval-banner-body">
                <div className="pe-approval-banner-title">
                  Extension {approvalStatus[selectedProject.id].status === "approved" ? "Approved" : "Declined"} — {approvalStatus[selectedProject.id].date}
                </div>
                <div className="pe-approval-banner-remarks">
                  {approvalStatus[selectedProject.id].remarks}
                </div>
              </div>
            </div>
          )}

          <div className="pe-actions">
            <button className="pe-btn pe-btn-primary" onClick={goStep2} disabled={!selectedProject}>
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Extension Details ── */}
      {step === 2 && (
        <div className="pe-animate">
          {/* Project summary strip */}
          <div className="pe-card pe-project-strip">
            <div className="pe-ps-label">Selected Project</div>
            <div className="pe-ps-title">{selectedProject.title}</div>
            <div className="pe-ps-meta">
              <span>{selectedProject.pi}</span>
              <span>·</span>
              <span>{selectedProject.agency}</span>
              <span>·</span>
              <span>Ends {selectedProject.originalEndDate}</span>
            </div>
          </div>

          <div className="pe-card">
            <div className="pe-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M12 14v4M10 16h4" /></svg>
              Extension Details
            </div>

            {/* Date Picker Row */}
            <div className="pe-field-row">
              <div className="pe-field">
                <label>Revised End Date</label>
                <div className="pe-date-picker-wrap">
                  <svg className="pe-date-picker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                  <input
                    type="date"
                    className="pe-date-input"
                    value={revisedEndDateInput}
                    min={minDateForPicker}
                    onChange={(e) => setRevisedEndDateInput(e.target.value)}
                  />
                </div>
                {selectedProject && (
                  <div className="pe-date-hint">
                    Original end date: <strong>{selectedProject.originalEndDate}</strong>
                  </div>
                )}
              </div>

              <div className="pe-field pe-field-info">
                <label>Extension Period</label>
                <div className="pe-date-display">
                  {revisedEndDateInput && extensionLabel ? (
                    <>
                      <span className="pe-date-val">{revisedEndDateLong}</span>
                      <span className="pe-date-pill">{extensionLabel}</span>
                    </>
                  ) : revisedEndDateInput ? (
                    <span className="pe-date-val">{revisedEndDateLong}</span>
                  ) : (
                    <span className="pe-date-placeholder">Select revised end date to calculate</span>
                  )}
                </div>
              </div>
            </div>

            {/* Reason — simple optional textarea */}
            <div className="pe-field">
              <label>
                Reason for Extension <span className="pe-optional">(Optional)</span>
              </label>
              <textarea
                className="pe-input pe-textarea"
                rows={4}
                placeholder="Briefly describe the reason for requesting this extension..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {/* Upload */}
            <div className="pe-field">
              <label>Extension Request Letter from Funding Agency <span className="pe-optional">(Optional)</span></label>
              <div className={`pe-file-upload ${requestLetter ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => { if (e.target.files[0]) setRequestLetter(e.target.files[0]); }}
                />
                <div className="pe-file-icon">
                  {requestLetter ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                  )}
                </div>
                <div className="pe-file-text">
                  <strong>{requestLetter ? requestLetter.name : "Click to upload request letter"}</strong>
                  {!requestLetter && <span className="pe-file-hint">PDF, DOC, DOCX, JPG, PNG accepted</span>}
                  {requestLetter && <span className="pe-file-hint">{(requestLetter.size / 1024).toFixed(1)} KB · Attached</span>}
                </div>
                {requestLetter && (
                  <button className="pe-file-remove" onClick={(e) => { e.stopPropagation(); setRequestLetter(null); }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pe-actions pe-actions-between">
            <button className="pe-btn pe-btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="pe-btn pe-btn-primary" onClick={goStep3}>
              Continue to Review
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && (
        <div className="pe-animate">
          <div className="pe-card">
            <div className="pe-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
              Extension Request Summary
            </div>

            {/* Timeline Visual */}
            <div className="pe-timeline-visual">
              <div className="pe-tl-block original">
                <div className="pe-tl-label">Sanctioned</div>
                <div className="pe-tl-date">{selectedProject.sanctionedDate}</div>
              </div>
              <div className="pe-tl-arrow">
                <div className="pe-tl-bar" />
                <div className="pe-tl-dur">{selectedProject.duration}</div>
              </div>
              <div className="pe-tl-block end">
                <div className="pe-tl-label">Original End</div>
                <div className="pe-tl-date">{selectedProject.originalEndDate}</div>
              </div>
              <div className="pe-tl-arrow ext">
                <div className="pe-tl-bar ext-bar" />
                <div className="pe-tl-dur ext-dur">{extensionLabel}</div>
              </div>
              <div className="pe-tl-block revised">
                <div className="pe-tl-label">Revised End</div>
                <div className="pe-tl-date">{revisedEndDateDMY}</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="pe-summary-grid">
              <div><span>Project ID</span><strong>{selectedProject.id}</strong></div>
              <div><span>Funding Agency</span><strong>{selectedProject.agency}</strong></div>
              <div><span>Principal Investigator</span><strong>{selectedProject.pi}</strong></div>
              <div><span>Department</span><strong>{selectedProject.department.split(",")[0]}</strong></div>
              <div><span>Original End Date</span><strong>{selectedProject.originalEndDate}</strong></div>
              <div><span>Extension Period</span><strong>{extensionLabel || "—"}</strong></div>
              <div><span>Revised End Date</span><strong className="pe-highlight">{revisedEndDateDMY}</strong></div>
              <div><span>Reason</span><strong>{reason || "Not specified"}</strong></div>
              <div><span>Request Letter</span><strong>{requestLetter ? requestLetter.name : "Not attached"}</strong></div>
            </div>

            {/* Approval Status if exists */}
            {projectApproval && (
              <>
                <div className="pe-card-subtitle">Director's Decision</div>
                <div className={`pe-decision-box ${projectApproval.status}`}>
                  <div className="pe-decision-header">
                    <div className={`pe-decision-icon ${projectApproval.status}`}>
                      {projectApproval.status === "approved" ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      )}
                    </div>
                    <div>
                      <div className="pe-decision-title">
                        {projectApproval.status === "approved" ? "Extension Approved" : "Extension Declined"}
                      </div>
                      <div className="pe-decision-date">Dated: {projectApproval.date}</div>
                    </div>
                  </div>
                  <div className="pe-decision-remarks">{projectApproval.remarks}</div>
                </div>
              </>
            )}

            {!projectApproval && (
              <div className="pe-pending-note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                This request will be submitted to the CSRC Director for review. You will be notified upon decision.
              </div>
            )}
          </div>

          <div className="pe-report-actions">
            <button className="pe-btn pe-btn-preview" onClick={handlePreview}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview Letter
            </button>
            <button className="pe-btn pe-btn-download" onClick={handleDownload}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Letter
            </button>
            <button className="pe-btn pe-btn-ghost" onClick={() => setStep(2)}>← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}