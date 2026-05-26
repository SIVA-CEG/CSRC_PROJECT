import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ── inline styles to avoid external CSS dependency in preview ──────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;600&display=swap');

.slip-page { animation: slipFade 0.45s ease both; }
@keyframes slipFade { from { opacity:0;transform:translateY(18px); } to { opacity:1;transform:translateY(0); } }

.slip-table-card,.slip-card {
  background:rgba(255,255,255,0.028);
  border:1px solid rgba(255,255,255,0.075);
  border-radius:20px;
  padding:22px;
  margin-bottom:24px;
  box-shadow:0 20px 45px rgba(0,0,0,0.18);
}
.slip-table-card h2,.slip-card h2 {
  font-family:'Syne',sans-serif;
  color:rgba(255,255,255,0.88);
  font-size:18px;
  margin:0 0 20px;
}
.slip-table-wrap { overflow-x:auto; }
.slip-table-card table { width:100%;border-collapse:collapse;min-width:850px; }
.slip-table-card th {
  background:rgba(56,189,248,0.08);
  color:rgba(255,255,255,0.48);
  font-family:'Syne',sans-serif;
  font-size:11px;text-transform:uppercase;letter-spacing:1px;
  padding:14px;text-align:left;white-space:nowrap;
}
.slip-table-card td {
  border-bottom:1px solid rgba(255,255,255,0.045);
  padding:14px;color:rgba(255,255,255,0.72);
  font-family:'DM Sans',sans-serif;font-size:13px;white-space:nowrap;
}
.slip-table-card tr:hover td { background:rgba(56,189,248,0.045); }

.slip-view-btn {
  border:1px solid rgba(167,139,250,0.3);
  background:rgba(167,139,250,0.11);
  color:#a78bfa;border-radius:10px;
  padding:8px 13px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;transition:0.2s;
}
.slip-view-btn:hover { background:rgba(167,139,250,0.22);transform:scale(1.04); }

.settled-btn {
  border:1px solid rgba(251,191,36,0.3);
  background:rgba(251,191,36,0.11);
  color:#fbbf24;border-radius:10px;
  padding:8px 13px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;transition:0.2s;
  margin-left:8px;
}
.settled-btn:hover { background:rgba(251,191,36,0.22);transform:scale(1.04); }

.slip-input {
  width:100%;background:rgba(255,255,255,0.055);
  border:1px solid rgba(255,255,255,0.09);
  border-radius:12px;padding:12px 14px;
  color:rgba(255,255,255,0.86);
  font-family:'DM Sans',sans-serif;font-size:14px;
  outline:none;transition:0.2s;box-sizing:border-box;
}
.slip-input:focus {
  border-color:rgba(56,189,248,0.65);
  background:rgba(56,189,248,0.06);
  box-shadow:0 0 0 3px rgba(56,189,248,0.11);
}
.slip-input option { background:#111827;color:#fff; }

.claim-project-info {
  display:flex;gap:18px;flex-wrap:wrap;margin-bottom:24px;
  color:rgba(255,255,255,0.65);font-family:'DM Sans',sans-serif;font-size:13px;
}
.claim-head-wrapper { display:flex;flex-direction:column;gap:22px; }
.claim-section {
  border:1px solid rgba(255,255,255,0.075);
  background:rgba(255,255,255,0.025);
  border-radius:18px;overflow:hidden;
}
.claim-section-title {
  display:flex;align-items:center;gap:12px;
  padding:14px 18px;
  background:rgba(56,189,248,0.08);
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.claim-section-title span {
  width:24px;height:24px;border-radius:7px;
  display:grid;place-items:center;
  background:rgba(56,189,248,0.15);color:#38bdf8;
  font-family:'Syne',sans-serif;font-size:12px;font-weight:800;
}
.claim-section-title h3 { margin:0;color:rgba(255,255,255,0.82);font-family:'Syne',sans-serif;font-size:15px; }

.claim-row {
  display:grid;grid-template-columns:50px 1fr 420px;
  align-items:center;gap:16px;padding:15px 18px;
  border-bottom:1px solid rgba(255,255,255,0.045);
}
.claim-row:last-child { border-bottom:none; }
.claim-index { color:rgba(255,255,255,0.45);font-family:'Syne',sans-serif;font-weight:700; }
.claim-head-name { color:rgba(255,255,255,0.72);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600; }
.claim-input-group { display:grid;grid-template-columns:1fr 1fr;gap:12px; }

.slip-submit-row { display:flex;justify-content:flex-end;margin-top:22px; }
.slip-submit-row button {
  border:none;border-radius:14px;padding:13px 32px;
  background:linear-gradient(135deg,#22c55e,#16a34a);
  color:#fff;font-family:'Syne',sans-serif;font-weight:800;
  cursor:pointer;box-shadow:0 10px 25px rgba(34,197,94,0.25);
}

/* ── Success overlay ── */
.claim-success-overlay {
  position:fixed;inset:0;z-index:99999;
  background:rgba(2,6,23,0.72);backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;
  animation:claimOverlayFade 0.3s ease;
}
.claim-success-box {
  width:min(420px,90vw);padding:38px 30px;border-radius:26px;
  background:linear-gradient(145deg,rgba(15,23,42,0.98),rgba(8,47,73,0.94));
  border:1px solid rgba(56,189,248,0.25);
  box-shadow:0 30px 80px rgba(0,0,0,0.45);text-align:center;
  animation:claimSuccessPop 0.55s cubic-bezier(0.2,1.4,0.4,1);
}
.claim-success-check {
  width:86px;height:86px;margin:0 auto 18px;border-radius:50%;
  display:grid;place-items:center;
  background:linear-gradient(135deg,#22c55e,#16a34a);color:white;
  font-size:48px;font-weight:900;
  box-shadow:0 0 0 12px rgba(34,197,94,0.12);
  animation:claimCheckPulse 1.2s ease infinite;
}
.claim-success-box h2 { margin:0 0 8px;color:#fff;font-family:'Syne',sans-serif;font-size:24px; }
.claim-success-box p { margin:0;color:rgba(255,255,255,0.62);font-family:'DM Sans',sans-serif;font-size:14px; }
@keyframes claimOverlayFade { from{opacity:0} to{opacity:1} }
@keyframes claimSuccessPop { from{opacity:0;transform:scale(0.75) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes claimCheckPulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.35)} 70%{box-shadow:0 0 0 18px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }

/* ── Settled Bills Modal ── */
.settled-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 120px 24px 24px;
  animation: claimOverlayFade 0.28s ease;
}

.settled-modal {
  width: min(1200px, 96vw);
  max-height: calc(100vh - 145px);
  background: linear-gradient(160deg, #0d1b2e 0%, #0b1622 100%);
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.55);
  animation: claimSuccessPop 0.4s cubic-bezier(0.2, 1.2, 0.4, 1);
}

.settled-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  background: rgba(56, 189, 248, 0.09);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}

.settled-modal-head h2 {
  margin: 0;
  font-family: 'Syne', sans-serif;
  color: #fff;
  font-size: 17px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.settled-modal-head h2 span {
  background: rgba(251, 191, 36, 0.18);
  color: #fbbf24;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.settled-modal-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.modal-report-btn {
  border: 1px solid rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border-radius: 11px;
  padding: 9px 16px;
  cursor: pointer;
  font-family: 'Syne', sans-serif;
  font-size: 12px;
  font-weight: 800;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-report-btn:hover {
  background: rgba(34, 197, 94, 0.22);
  transform: translateY(-1px);
}

.modal-close-btn {
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 11px;
  padding: 9px 14px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  transition: 0.2s;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.settled-modal-body {
  overflow-y: auto;
  padding: 24px;
  flex: 1;
}

/* project tabs */
.settled-tabs { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px; }
.settled-tab {
  border:1px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.55);
  border-radius:10px;padding:8px 14px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:13px;transition:0.2s;
}
.settled-tab.active {
  border-color:rgba(251,191,36,0.45);
  background:rgba(251,191,36,0.1);color:#fbbf24;
}

/* summary strip */
.settled-summary {
  display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px;
}
.settled-summary-card {
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
  border-radius:14px;padding:16px 18px;
}
.settled-summary-card p {
  margin:0 0 4px;font-family:'DM Sans',sans-serif;
  font-size:11px;text-transform:uppercase;letter-spacing:0.9px;color:rgba(255,255,255,0.38);
}
.settled-summary-card h4 { margin:0;font-family:'Syne',sans-serif;font-size:20px;color:#fff; }
.settled-summary-card h4.green { color:#22c55e; }
.settled-summary-card h4.yellow { color:#fbbf24; }

/* bills table */
.bills-table-wrap { overflow-x:auto;border-radius:14px;border:1px solid rgba(255,255,255,0.07); }
.bills-table { width:100%;border-collapse:collapse;min-width:900px; }
.bills-table th {
  background:rgba(255,255,255,0.04);
  color:rgba(255,255,255,0.42);
  font-family:'Syne',sans-serif;font-size:10px;
  text-transform:uppercase;letter-spacing:1px;
  padding:13px 16px;text-align:left;white-space:nowrap;
}
.bills-table td {
  padding:13px 16px;
  color:rgba(255,255,255,0.72);
  font-family:'DM Sans',sans-serif;font-size:13px;
  border-bottom:1px solid rgba(255,255,255,0.04);
  white-space:nowrap;
}
.bills-table tr:last-child td { border-bottom:none; }
.bills-table tr:hover td { background:rgba(56,189,248,0.04); }

.ref-badge {
  background:rgba(56,189,248,0.1);color:#38bdf8;
  border:1px solid rgba(56,189,248,0.25);
  padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;
  font-family:'Syne',sans-serif;
}
.head-badge {
  background:rgba(167,139,250,0.1);color:#a78bfa;
  border:1px solid rgba(167,139,250,0.25);
  padding:3px 9px;border-radius:999px;font-size:11px;
  font-family:'DM Sans',sans-serif;
}
.section-badge {
  background:rgba(251,191,36,0.1);color:#fbbf24;
  border:1px solid rgba(251,191,36,0.25);
  padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;
  font-family:'Syne',sans-serif;
}
.amount-cell { color:#22c55e;font-family:'Syne',sans-serif;font-weight:800;font-size:14px; }

.bill-action-group { display:flex;gap:6px; }
.preview-bill-btn {
  border:1px solid rgba(56,189,248,0.3);
  background:rgba(56,189,248,0.08);color:#38bdf8;
  border-radius:8px;padding:5px 10px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:11px;transition:0.2s;
}
.preview-bill-btn:hover { background:rgba(56,189,248,0.18); }
.download-bill-btn {
  border:1px solid rgba(34,197,94,0.3);
  background:rgba(34,197,94,0.08);color:#22c55e;
  border-radius:8px;padding:5px 10px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:11px;transition:0.2s;
}
.download-bill-btn:hover { background:rgba(34,197,94,0.18); }
.no-file-text { color:rgba(255,255,255,0.28);font-size:12px;font-style:italic; }

.empty-bills {
  text-align:center;padding:48px 24px;
  color:rgba(255,255,255,0.3);font-family:'DM Sans',sans-serif;font-size:14px;
}
.empty-bills .empty-icon { font-size:40px;margin-bottom:12px; }

/* ── PDF / Bill Preview Modal ── */
.pdf-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 24px 24px;
  animation: claimOverlayFade 0.2s ease;
}

.pdf-preview-box {
  width: min(900px, 96vw);
  height: calc(100vh - 145px);
  background: #111827;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.7);
}

.pdf-preview-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  gap: 12px;
  flex-wrap: wrap;
}

.pdf-preview-head span {
  color: rgba(255, 255, 255, 0.75);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
}

.pdf-preview-head div {
  display: flex;
  gap: 8px;
}

.pdf-preview-head a,
.pdf-preview-head button {
  border-radius: 9px;
  padding: 7px 13px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.pdf-preview-head a {
  background: #38bdf8;
  color: #001018;
  border: none;
}

.pdf-preview-head button {
  background: #ef4444;
  color: #fff;
  border: none;
}

.pdf-preview-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #fff;
}
`;

// ── Data ───────────────────────────────────────────────────────────────────
const projects = [
  { id:"ZBA001", title:"AI Based Research Project",       pi:"Dr. Kumar", department:"IT",  sanctionedAmount:500000 },
  { id:"ZBA002", title:"IoT Smart Monitoring System",     pi:"Dr. Priya",  department:"CSE", sanctionedAmount:350000 },
];

const heads = [
  { section:"A", title:"Non-Recurring Heads", options:["Equipment 1","Equipment 2","Equipment 3"] },
  { section:"B", title:"Recurring Heads",     options:["Manpower","Consumables & Accessories","Travel","Contingency"] },
];

function fmt(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function refNo(pid, idx) { return `${pid}-CLM${String(idx).padStart(3,"0")}`; }
function today() { return new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }

// ── Component ──────────────────────────────────────────────────────────────
const ZBASlipPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [claimData, setClaimData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [billsStore, setBillsStore] = useState({});
  const [settledProject, setSettledProject] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const reportRef = useRef();

  const handleChange = (head, field, value) => {
    setClaimData(prev => ({ ...prev, [head]: { ...prev[head], [field]: value } }));
  };

  const handleSubmit = () => {
    if (!selectedProject) return;
    const pid = selectedProject.id;
    const existingClaims = billsStore[pid] || [];
    const newClaims = [];

    heads.forEach(group => {
      const data = claimData[group.title];
      if (data?.selectedHead && data?.amount) {
        const idx = existingClaims.length + newClaims.length + 1;
        let fileURL = null;
        if (data.bill) {
          fileURL = URL.createObjectURL(data.bill);
        }
        newClaims.push({
          ref:     refNo(pid, idx),
          date:    today(),
          section: group.section,
          title:   group.title,
          head:    data.selectedHead,
          amount:  Number(data.amount),
          fileName: data.bill ? data.bill.name : null,
          fileURL,
        });
      }
    });

    if (newClaims.length === 0) { alert("Please fill at least one head."); return; }

    setBillsStore(prev => ({
      ...prev,
      [pid]: [...(prev[pid] || []), ...newClaims],
    }));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProject(null);
      setClaimData({});
    }, 2200);
  };

  // ── Report generation (plain HTML printed) ──────────────────────────────
  const generateReport = (project) => {
    const bills = billsStore[project.id] || [];
    const total = bills.reduce((s, b) => s + b.amount, 0);
    const sanctioned = project.sanctionedAmount;

    const rows = bills.map(b => `
      <tr>
        <td>${b.ref}</td>
        <td>${b.date}</td>
        <td><span class="sec">${b.section}</span></td>
        <td>${b.title}</td>
        <td>${b.head}</td>
        <td class="amt">₹${b.amount.toLocaleString("en-IN")}</td>
        <td>${b.fileName || "—"}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Bill Report – ${project.id}</title>
<style>
  body{margin:0;padding:32px;font-family:'Segoe UI',sans-serif;background:#fff;color:#111;}
  h1{font-size:22px;margin:0 0 4px;}
  .sub{color:#555;font-size:13px;margin-bottom:28px;}
  .meta{display:flex;gap:24px;margin-bottom:22px;font-size:13px;}
  .meta span{background:#f0f4ff;padding:6px 12px;border-radius:6px;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{background:#0f172a;color:#fff;padding:11px 13px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;}
  td{padding:10px 13px;border-bottom:1px solid #e2e8f0;}
  tr:nth-child(even) td{background:#f8fafc;}
  .sec{background:#ede9fe;color:#6d28d9;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;}
  .amt{color:#15803d;font-weight:700;}
  .summary{margin-top:24px;display:flex;gap:18px;}
  .scard{border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;min-width:160px;}
  .scard label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:4px;}
  .scard strong{font-size:19px;}
  .scard.green strong{color:#16a34a;}
  .scard.red strong{color:#dc2626;}
  footer{margin-top:32px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;}
</style>
</head>
<body>
<h1>Project Bill Report</h1>
<div class="sub">Generated on ${today()} &nbsp;|&nbsp; Confidential Document</div>
<div class="meta">
  <span><b>Project ID:</b> ${project.id}</span>
  <span><b>Title:</b> ${project.title}</span>
  <span><b>PI:</b> ${project.pi}</span>
  <span><b>Dept:</b> ${project.department}</span>
</div>
<table>
  <thead><tr><th>Ref No.</th><th>Date</th><th>Section</th><th>Head Category</th><th>Item / Head</th><th>Amount</th><th>Bill File</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:24px;color:#999;">No claims recorded</td></tr>'}</tbody>
</table>
<div class="summary">
  <div class="scard"><label>Total Claims</label><strong>${bills.length}</strong></div>
  <div class="scard green"><label>Total Claimed</label><strong>₹${total.toLocaleString("en-IN")}</strong></div>
  <div class="scard"><label>Sanctioned</label><strong>₹${sanctioned.toLocaleString("en-IN")}</strong></div>
  <div class="scard ${total > sanctioned ? "red" : "green"}"><label>Balance</label><strong>₹${(sanctioned-total).toLocaleString("en-IN")}</strong></div>
</div>
<footer>This is a system-generated report. Individual bill files are archived separately.</footer>
</body></html>`;
    return html;
  };

  const createReportPDF = async (project, mode = "preview") => {
  const bills = billsStore[project.id] || [];
  const total = bills.reduce((s, b) => s + b.amount, 0);

  const reportElement = document.createElement("div");
  reportElement.style.width = "1000px";
  reportElement.style.padding = "30px";
  reportElement.style.background = "#ffffff";
  reportElement.style.color = "#111827";
  reportElement.style.fontFamily = "Arial, sans-serif";
  reportElement.innerHTML = `
    <h2 style="margin:0 0 6px;">Project Bill Report</h2>
    <p style="margin:0 0 20px;color:#555;">Generated on ${today()}</p>

    <div style="margin-bottom:20px;font-size:14px;">
      <b>Project ID:</b> ${project.id}<br/>
      <b>Title:</b> ${project.title}<br/>
      <b>PI:</b> ${project.pi}<br/>
      <b>Department:</b> ${project.department}
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#0f172a;color:white;">
          <th style="padding:10px;border:1px solid #ddd;">Ref No</th>
          <th style="padding:10px;border:1px solid #ddd;">Date</th>
          <th style="padding:10px;border:1px solid #ddd;">Section</th>
          <th style="padding:10px;border:1px solid #ddd;">Head</th>
          <th style="padding:10px;border:1px solid #ddd;">Item</th>
          <th style="padding:10px;border:1px solid #ddd;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${
          bills.length
            ? bills.map(b => `
              <tr>
                <td style="padding:9px;border:1px solid #ddd;">${b.ref}</td>
                <td style="padding:9px;border:1px solid #ddd;">${b.date}</td>
                <td style="padding:9px;border:1px solid #ddd;">${b.section}</td>
                <td style="padding:9px;border:1px solid #ddd;">${b.title}</td>
                <td style="padding:9px;border:1px solid #ddd;">${b.head}</td>
                <td style="padding:9px;border:1px solid #ddd;">₹${b.amount.toLocaleString("en-IN")}</td>
              </tr>
            `).join("")
            : `<tr><td colspan="6" style="padding:20px;text-align:center;border:1px solid #ddd;">No claims found</td></tr>`
        }
      </tbody>
    </table>

    <div style="margin-top:22px;font-size:15px;">
      <b>Total Claims:</b> ${bills.length}<br/>
      <b>Total Claimed:</b> ₹${total.toLocaleString("en-IN")}<br/>
      <b>Balance Remaining:</b> ₹${(project.sanctionedAmount - total).toLocaleString("en-IN")}
    </div>
  `;

  document.body.appendChild(reportElement);

  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  document.body.removeChild(reportElement);

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  const fileName = `Bill_Report_${project.id}.pdf`;

  if (mode === "download") {
    pdf.save(fileName);
  } else {
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfPreview({ name: fileName, url: pdfUrl });
  }
};

const handlePreviewReport = (project) => {
  createReportPDF(project, "preview");
};

const handleDownloadReport = (project) => {
  createReportPDF(project, "download");
};

  // settled modal bills for active tab
  const activeProject = activeTab
    ? projects.find(p => p.id === activeTab)
    : settledProject;
  const activeBills = activeProject ? (billsStore[activeProject.id] || []) : [];
  const totalClaimed = activeBills.reduce((s,b)=>s+b.amount,0);

  return (
    <>
      <style>{css}</style>
      <div className="slip-page">

        {/* ── Projects table ── */}
        <div className="slip-table-card">
          <h2>ZBA Slip Projects</h2>
          <div className="slip-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project ID</th><th>Project Title</th><th>PI Name</th>
                  <th>Department</th><th>Sanctioned Amount</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.title}</td>
                    <td>{project.pi}</td>
                    <td>{project.department}</td>
                    <td>{fmt(project.sanctionedAmount)}</td>
                    <td style={{display:"flex",gap:0}}>
                      <button className="slip-view-btn"
                        onClick={() => { setSelectedProject(project); setClaimData({}); }}>
                        Update Claim
                      </button>
                      <button className="settled-btn"
                        onClick={() => {
                          setSettledProject(project);
                          setActiveTab(project.id);
                        }}>
                        📋 Settled Bills
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Update Claim form ── */}
        {selectedProject && (
          <div className="slip-card">
            <h2>Update Claim — {selectedProject.title}</h2>
            <div className="claim-project-info">
              <span>Project ID: <b>{selectedProject.id}</b></span>
              <span>PI: <b>{selectedProject.pi}</b></span>
              <span>Department: <b>{selectedProject.department}</b></span>
              <span>Sanctioned: <b>{fmt(selectedProject.sanctionedAmount)}</b></span>
            </div>

            <div className="claim-head-wrapper">
              {heads.map(group => (
                <div className="claim-section" key={group.section}>
                  <div className="claim-section-title">
                    <span>{group.section}</span>
                    <h3>{group.title}</h3>
                  </div>
                  <div className="claim-row">
                    <div className="claim-index">1</div>
                    <div className="claim-head-name">
                      <select className="slip-input"
                        value={claimData[group.title]?.selectedHead || ""}
                        onChange={e => handleChange(group.title,"selectedHead",e.target.value)}>
                        <option value="">Select Head</option>
                        {group.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="claim-input-group">
                      <input type="number" className="slip-input" placeholder="Enter amount"
                        value={claimData[group.title]?.amount || ""}
                        onChange={e => handleChange(group.title,"amount",e.target.value)}
                        disabled={!claimData[group.title]?.selectedHead}/>
                      <input type="file" accept=".pdf,image/*" className="slip-input"
                        onChange={e => handleChange(group.title,"bill",e.target.files[0])}
                        disabled={!claimData[group.title]?.selectedHead}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="slip-submit-row">
              <button onClick={handleSubmit}>Submit Claim</button>
            </div>
          </div>
        )}

        {/* ── Success overlay ── */}
        {showSuccess && (
          <div className="claim-success-overlay">
            <div className="claim-success-box">
              <div className="claim-success-check">✓</div>
              <h2>Claim Submitted</h2>
              <p>Your claim has been recorded successfully</p>
            </div>
          </div>
        )}

        {/* ── Settled Bills Modal ── */}
        {settledProject && (
          <div className="settled-modal-overlay" onClick={e => { if(e.target===e.currentTarget) setSettledProject(null); }}>
            <div className="settled-modal">

              {/* head */}
              <div className="settled-modal-head">
                <h2>
                  📋 Settled Bills
                  <span>{activeProject?.title}</span>
                </h2>
                <div className="settled-modal-actions">
                  <button className="modal-report-btn"
                    onClick={() => handlePreviewReport(activeProject)}>
                    👁 Preview Report
                  </button>
                  <button className="modal-report-btn"
                    style={{borderColor:"rgba(56,189,248,0.35)",background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}
                    onClick={() => handleDownloadReport(activeProject)}>
                    ⬇ Download Report
                  </button>
                  <button className="modal-close-btn" onClick={() => setSettledProject(null)}>✕ Close</button>
                </div>
              </div>

              <div className="settled-modal-body">

                {/* project tabs */}
                <div className="settled-tabs">
                  {projects.map(p => (
                    <button key={p.id}
                      className={`settled-tab ${activeTab===p.id ? "active" : ""}`}
                      onClick={() => setActiveTab(p.id)}>
                      {p.id} — {p.title}
                      {(billsStore[p.id]||[]).length > 0 &&
                        <span style={{marginLeft:6,background:"rgba(251,191,36,0.2)",color:"#fbbf24",
                          borderRadius:"999px",padding:"1px 7px",fontSize:"10px",fontWeight:700}}>
                          {(billsStore[p.id]||[]).length}
                        </span>}
                    </button>
                  ))}
                </div>

                {/* summary strip */}
                {activeProject && (
                  <div className="settled-summary">
                    <div className="settled-summary-card">
                      <p>Total Claims</p>
                      <h4>{activeBills.length}</h4>
                    </div>
                    <div className="settled-summary-card">
                      <p>Total Claimed</p>
                      <h4 className="green">{fmt(totalClaimed)}</h4>
                    </div>
                    <div className="settled-summary-card">
                      <p>Balance Remaining</p>
                      <h4 className="yellow">{fmt(activeProject.sanctionedAmount - totalClaimed)}</h4>
                    </div>
                  </div>
                )}

                {/* bills table */}
                {activeBills.length === 0 ? (
                  <div className="empty-bills">
                    <div className="empty-icon">🗂️</div>
                    No settled bills found for this project.<br/>Submit a claim to see history here.
                  </div>
                ) : (
                  <div className="bills-table-wrap">
                    <table className="bills-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Reference No.</th>
                          <th>Date</th>
                          <th>Section</th>
                          <th>Head Category</th>
                          <th>Item / Equipment</th>
                          <th>Amount</th>
                          <th>Bill File</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBills.map((bill, i) => (
                          <tr key={bill.ref}>
                            <td style={{color:"rgba(255,255,255,0.35)",fontWeight:700}}>{i+1}</td>
                            <td><span className="ref-badge">{bill.ref}</span></td>
                            <td>{bill.date}</td>
                            <td><span className="section-badge">{bill.section}</span></td>
                            <td><span className="head-badge">{bill.title}</span></td>
                            <td>{bill.head}</td>
                            <td className="amount-cell">{fmt(bill.amount)}</td>
                            <td>
                              {bill.fileURL ? (
                                <div className="bill-action-group">
                                  <button className="preview-bill-btn"
                                    onClick={() => setPdfPreview({ name:bill.fileName, url:bill.fileURL })}>
                                    👁 Preview
                                  </button>
                                  <a className="download-bill-btn"
                                    href={bill.fileURL} download={bill.fileName}
                                    style={{textDecoration:"none",display:"inline-flex",alignItems:"center"}}>
                                    ⬇ Download
                                  </a>
                                </div>
                              ) : (
                                <span className="no-file-text">No file uploaded</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PDF / Bill preview mini-modal ── */}
        {pdfPreview && (
          <div className="pdf-preview-overlay" onClick={e => { if(e.target===e.currentTarget) setPdfPreview(null); }}>
            <div className="pdf-preview-box">
              <div className="pdf-preview-head">
                <span>{pdfPreview.name}</span>
                <div>
                  <a href={pdfPreview.url} download={pdfPreview.name}>⬇ Download</a>
                  <button onClick={() => setPdfPreview(null)}>✕ Close</button>
                </div>
              </div>
              {pdfPreview.name?.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/) ? (
  <img
    src={pdfPreview.url}
    alt={pdfPreview.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      background: "#fff"
    }}
  />
) : (
  <iframe
    className="pdf-preview-frame"
    src={pdfPreview.url}
    title={pdfPreview.name}
  />
)}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ZBASlipPage;