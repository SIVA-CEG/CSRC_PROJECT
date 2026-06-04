import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ═══════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

/* ── Animations ── */
.slip-page { animation: slipFade 0.45s ease both; }
@keyframes slipFade { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes modalPop { from{opacity:0;transform:scale(0.88) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes overlayFade { from{opacity:0} to{opacity:1} }
@keyframes checkPulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 70%{box-shadow:0 0 0 18px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
@keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

/* ── Base Cards ── */
.slip-table-card, .slip-card {
  background: rgba(255,255,255,0.028);
  border: 1px solid rgba(255,255,255,0.075);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 24px;
  box-shadow: 0 20px 45px rgba(0,0,0,0.18);
}
.slip-table-card h2, .slip-card h2 {
  font-family: 'Syne', sans-serif;
  color: rgba(255,255,255,0.88);
  font-size: 18px;
  margin: 0 0 20px;
}
.slip-table-wrap { overflow-x: auto; }
.slip-table-card table { width:100%; border-collapse:collapse; min-width:750px; }
.slip-table-card th {
  background: rgba(56,189,248,0.08);
  color: rgba(255,255,255,0.48);
  font-family: 'Syne', sans-serif;
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
  padding: 14px; text-align: left; white-space: nowrap;
}
.slip-table-card td {
  border-bottom: 1px solid rgba(255,255,255,0.045);
  padding: 14px; color: rgba(255,255,255,0.72);
  font-family: 'DM Sans', sans-serif; font-size: 13px; white-space: nowrap;
}
.slip-table-card tr:hover td { background: rgba(56,189,248,0.04); }

/* ── Inputs ── */
.slip-input {
  width: 100%; background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px; padding: 11px 14px;
  color: rgba(255,255,255,0.86);
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: 0.2s; box-sizing: border-box;
}
.slip-input:focus {
  border-color: rgba(56,189,248,0.65);
  background: rgba(56,189,248,0.06);
  box-shadow: 0 0 0 3px rgba(56,189,248,0.11);
}
.slip-input:disabled { opacity: 0.4; cursor: not-allowed; }
.slip-input option { background: #111827; color: #fff; }

/* ── Buttons ── */
.slip-view-btn {
  border: 1px solid rgba(167,139,250,0.3);
  background: rgba(167,139,250,0.11);
  color: #a78bfa; border-radius: 10px;
  padding: 8px 14px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
  transition: 0.2s; white-space: nowrap;
}
.slip-view-btn:hover { background: rgba(167,139,250,0.22); transform: scale(1.04); }

.settled-btn {
  border: 1px solid rgba(251,191,36,0.3);
  background: rgba(251,191,36,0.11);
  color: #fbbf24; border-radius: 10px;
  padding: 8px 14px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
  transition: 0.2s; margin-left: 8px; white-space: nowrap;
}
.settled-btn:hover { background: rgba(251,191,36,0.22); transform: scale(1.04); }

/* ── Head Type Selection Cards ── */
.head-type-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
  margin-top: 8px;
}
.head-type-card {
  border-radius: 18px; padding: 28px 24px;
  cursor: pointer; transition: all 0.25s;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  text-align: center; position: relative; overflow: hidden;
}
.head-type-card::before {
  content: ''; position: absolute; inset: 0;
  background: inherit; opacity: 0.06; transition: 0.25s;
}
.head-type-card:hover { transform: translateY(-4px); }
.head-type-card:hover::before { opacity: 0.12; }
.head-type-card.non-recurring {
  background: linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.04));
  border: 1px solid rgba(56,189,248,0.25);
}
.head-type-card.non-recurring:hover { border-color: rgba(56,189,248,0.55); box-shadow: 0 12px 36px rgba(56,189,248,0.15); }
.head-type-card.recurring {
  background: linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04));
  border: 1px solid rgba(167,139,250,0.25);
}
.head-type-card.recurring:hover { border-color: rgba(167,139,250,0.55); box-shadow: 0 12px 36px rgba(167,139,250,0.15); }
.head-type-card .hc-icon { font-size: 40px; }
.head-type-card .hc-title {
  font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800;
  color: rgba(255,255,255,0.9);
}
.head-type-card .hc-sub {
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: rgba(255,255,255,0.45); line-height: 1.5;
}
.head-type-card .hc-arr {
  font-size: 20px; margin-top: 4px;
  color: rgba(255,255,255,0.3);
}

/* ── Breadcrumb nav ── */
.claim-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: rgba(255,255,255,0.45); margin-bottom: 20px; flex-wrap: wrap;
}
.claim-breadcrumb .bc-link {
  color: #38bdf8; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px;
}
.claim-breadcrumb .bc-sep { color: rgba(255,255,255,0.2); }
.claim-breadcrumb .bc-cur { color: rgba(255,255,255,0.7); font-weight: 600; }

/* ── Back button ── */
.back-btn {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.55); border-radius: 10px;
  padding: 8px 16px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  transition: 0.2s; display: inline-flex; align-items: center; gap: 6px;
  margin-bottom: 18px;
}
.back-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }

/* ── Non-Recurring form ── */
.nr-form-grid {
  display: grid; gap: 18px;
}
.nr-field { display: flex; flex-direction: column; gap: 7px; }
.nr-field label {
  font-family: 'Syne', sans-serif; font-size: 11px;
  text-transform: uppercase; letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
}
.nr-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nr-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

/* ── Submit row ── */
.slip-submit-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
.submit-btn {
  border: none; border-radius: 14px; padding: 13px 32px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; font-family: 'Syne', sans-serif; font-weight: 800;
  cursor: pointer; box-shadow: 0 10px 25px rgba(34,197,94,0.25);
  font-size: 14px; transition: 0.2s;
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(34,197,94,0.35); }

/* ── Recurring sub-head cards ── */
.rec-head-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px; margin-top: 8px;
}
.rec-head-card {
  border-radius: 16px; padding: 20px 16px;
  cursor: pointer; transition: all 0.22s;
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; text-align: center;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}
.rec-head-card:hover {
  transform: translateY(-3px);
  border-color: rgba(167,139,250,0.4);
  background: rgba(167,139,250,0.08);
  box-shadow: 0 10px 28px rgba(167,139,250,0.12);
}
.rec-head-card .rhc-icon { font-size: 32px; }
.rec-head-card .rhc-title {
  font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
  color: rgba(255,255,255,0.82); line-height: 1.3;
}

/* ── Under Review ── */
.review-tabs {
  display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap;
}
.review-tab {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.5);
  border-radius: 10px; padding: 8px 16px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px; transition: 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.review-tab.active-under {
  border-color: rgba(251,191,36,0.4);
  background: rgba(251,191,36,0.08); color: #fbbf24;
}
.review-tab.active-approved {
  border-color: rgba(34,197,94,0.4);
  background: rgba(34,197,94,0.08); color: #22c55e;
}
.review-tab-count {
  background: rgba(255,255,255,0.12);
  border-radius: 999px; padding: 1px 7px;
  font-size: 11px; font-weight: 700;
}

.review-table { width: 100%; border-collapse: collapse; }
.review-table th {
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.38);
  font-family: 'Syne', sans-serif; font-size: 10px;
  text-transform: uppercase; letter-spacing: 1px;
  padding: 12px 14px; text-align: left; white-space: nowrap;
}
.review-table td {
  padding: 13px 14px; color: rgba(255,255,255,0.7);
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  white-space: nowrap;
}
.review-table tr:last-child td { border-bottom: none; }
.review-table tr:hover td { background: rgba(255,255,255,0.02); }

.status-badge-review {
  background: rgba(251,191,36,0.12); color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.3);
  padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif;
}
.status-badge-approved {
  background: rgba(34,197,94,0.12); color: #22c55e;
  border: 1px solid rgba(34,197,94,0.3);
  padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif;
}
.type-badge {
  background: rgba(56,189,248,0.1); color: #38bdf8;
  border: 1px solid rgba(56,189,248,0.2);
  padding: 3px 9px; border-radius: 999px;
  font-size: 11px; font-family: 'Syne', sans-serif; font-weight: 700;
}
.head-badge-purple {
  background: rgba(167,139,250,0.1); color: #a78bfa;
  border: 1px solid rgba(167,139,250,0.2);
  padding: 3px 9px; border-radius: 999px;
  font-size: 11px; font-family: 'DM Sans', sans-serif;
}
.amount-cell { color: #22c55e; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; }

.review-action-group { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.preview-btn {
  border: 1px solid rgba(56,189,248,0.3); background: rgba(56,189,248,0.08);
  color: #38bdf8; border-radius: 8px; padding: 6px 11px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; transition: 0.2s;
}
.preview-btn:hover { background: rgba(56,189,248,0.18); }
.download-btn {
  border: 1px solid rgba(34,197,94,0.3); background: rgba(34,197,94,0.08);
  color: #22c55e; border-radius: 8px; padding: 6px 11px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; transition: 0.2s;
}
.download-btn:hover { background: rgba(34,197,94,0.18); }
.approve-btn {
  border: 1px solid rgba(251,191,36,0.35); background: rgba(251,191,36,0.1);
  color: #fbbf24; border-radius: 8px; padding: 6px 11px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; transition: 0.2s;
}
.approve-btn:hover { background: rgba(251,191,36,0.2); }

/* ── Success Overlay ── */
.success-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(2,6,23,0.72); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  animation: overlayFade 0.3s ease;
}
.success-box {
  width: min(400px,90vw); padding: 38px 30px; border-radius: 26px;
  background: linear-gradient(145deg, rgba(15,23,42,0.98), rgba(8,47,73,0.94));
  border: 1px solid rgba(56,189,248,0.25);
  box-shadow: 0 30px 80px rgba(0,0,0,0.45); text-align: center;
  animation: modalPop 0.55s cubic-bezier(0.2,1.4,0.4,1);
}
.success-check {
  width: 80px; height: 80px; margin: 0 auto 18px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(135deg,#22c55e,#16a34a); color: white;
  font-size: 42px; font-weight: 900;
  animation: checkPulse 1.2s ease infinite;
}
.success-box h2 { margin:0 0 8px; color:#fff; font-family:'Syne',sans-serif; font-size:22px; }
.success-box p { margin:0; color:rgba(255,255,255,0.6); font-family:'DM Sans',sans-serif; font-size:14px; }

/* ── PDF Preview Modal ── */
.pdf-preview-overlay {
  position: fixed; inset: 0; z-index: 1000000;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 16px 24px; animation: overlayFade 0.2s ease;
}
.pdf-preview-box {
  width: min(900px,96vw); height: calc(100vh - 32px);
  background: #111827; border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden; display: flex; flex-direction: column;
  box-shadow: 0 40px 100px rgba(0,0,0,0.7);
}
.pdf-preview-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 18px; background: #0f172a;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0; gap: 10px; flex-wrap: wrap;
}
.pdf-preview-head span { color:rgba(255,255,255,0.7); font-family:'DM Sans',sans-serif; font-size:13px; }
.pdf-preview-head div { display:flex; gap:8px; }
.pdf-preview-head a, .pdf-preview-head button {
  border-radius: 9px; padding: 7px 13px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
  text-decoration: none;
}
.pdf-preview-head a { background:#38bdf8; color:#001018; border:none; }
.pdf-preview-head button { background:#ef4444; color:#fff; border:none; }
.pdf-preview-frame { flex:1; width:100%; border:none; background:#fff; }

/* ── Settled Bills Modal ── */
.settled-modal-overlay {
  position: fixed; inset: 0; z-index: 999999;
  background: rgba(2,6,23,0.78); backdrop-filter: blur(12px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 80px 24px 24px; animation: overlayFade 0.28s ease;
}
.settled-modal {
  width: min(1200px,96vw); max-height: calc(100vh - 104px);
  background: linear-gradient(160deg, #0d1b2e 0%, #0b1622 100%);
  border: 1px solid rgba(56,189,248,0.18);
  border-radius: 24px; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 40px 100px rgba(0,0,0,0.55);
  animation: modalPop 0.4s cubic-bezier(0.2,1.2,0.4,1);
}
.settled-modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; background: rgba(56,189,248,0.08);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0; flex-wrap: wrap; gap: 12px;
}
.settled-modal-head h2 {
  margin:0; font-family:'Syne',sans-serif; color:#fff; font-size:16px;
  display:flex; align-items:center; gap:8px; flex-wrap:wrap;
}
.settled-modal-head h2 span {
  background:rgba(251,191,36,0.18); color:#fbbf24;
  font-size:11px; padding:3px 9px; border-radius:999px;
  border:1px solid rgba(251,191,36,0.3);
}
.settled-modal-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.modal-close-btn {
  border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.1);
  color:#ef4444; border-radius:10px; padding:8px 14px; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; transition:0.2s;
}
.modal-close-btn:hover { background:rgba(239,68,68,0.2); }
.settled-modal-body { overflow-y:auto; padding:22px; flex:1; }

/* settled project tabs */
.settled-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
.settled-tab {
  border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
  color:rgba(255,255,255,0.5); border-radius:10px; padding:7px 14px;
  cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; transition:0.2s;
}
.settled-tab.active { border-color:rgba(251,191,36,0.45); background:rgba(251,191,36,0.1); color:#fbbf24; }
.settled-summary {
  display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px;
}
.settled-summary-card {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
  border-radius:14px; padding:14px 16px;
}
.settled-summary-card p {
  margin:0 0 4px; font-family:'DM Sans',sans-serif;
  font-size:11px; text-transform:uppercase; letter-spacing:0.9px; color:rgba(255,255,255,0.35);
}
.settled-summary-card h4 { margin:0; font-family:'Syne',sans-serif; font-size:18px; color:#fff; }
.settled-summary-card h4.green { color:#22c55e; }
.settled-summary-card h4.yellow { color:#fbbf24; }
.bills-table-wrap { overflow-x:auto; border-radius:14px; border:1px solid rgba(255,255,255,0.07); }
.bills-table { width:100%; border-collapse:collapse; min-width:800px; }
.bills-table th {
  background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.38);
  font-family:'Syne',sans-serif; font-size:10px;
  text-transform:uppercase; letter-spacing:1px;
  padding:12px 14px; text-align:left; white-space:nowrap;
}
.bills-table td {
  padding:12px 14px; color:rgba(255,255,255,0.7);
  font-family:'DM Sans',sans-serif; font-size:13px;
  border-bottom:1px solid rgba(255,255,255,0.04); white-space:nowrap;
}
.bills-table tr:last-child td { border-bottom:none; }
.bills-table tr:hover td { background:rgba(56,189,248,0.03); }
.ref-badge {
  background:rgba(56,189,248,0.1); color:#38bdf8;
  border:1px solid rgba(56,189,248,0.25);
  padding:3px 8px; border-radius:999px; font-size:11px; font-weight:700;
  font-family:'Syne',sans-serif;
}
.bill-action-group { display:flex; gap:5px; }
.preview-bill-btn {
  border:1px solid rgba(56,189,248,0.3); background:rgba(56,189,248,0.08);
  color:#38bdf8; border-radius:7px; padding:5px 9px; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-size:11px; transition:0.2s;
}
.preview-bill-btn:hover { background:rgba(56,189,248,0.18); }
.download-bill-btn {
  border:1px solid rgba(34,197,94,0.3); background:rgba(34,197,94,0.08);
  color:#22c55e; border-radius:7px; padding:5px 9px; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-size:11px; transition:0.2s; text-decoration:none;
  display:inline-flex; align-items:center;
}
.download-bill-btn:hover { background:rgba(34,197,94,0.18); }
.no-file-text { color:rgba(255,255,255,0.28); font-size:12px; font-style:italic; }
.empty-bills {
  text-align:center; padding:40px 24px;
  color:rgba(255,255,255,0.3); font-family:'DM Sans',sans-serif; font-size:14px;
}
.empty-bills .empty-icon { font-size:36px; margin-bottom:10px; }

/* ── Manpower (SSC) embed styles — original light theme ── */
.ssc-page {
  padding: 24px;
  background: #f4f6f8;
  border-radius: 16px;
  box-sizing: border-box;
  animation: slideIn 0.35s ease;
}
.ssc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ssc-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 600;
  font-family: sans-serif;
}
.ssc-breadcrumb { font-size: 13px; color: #6b7280; font-family: sans-serif; }
.ssc-bc-link { color: #0284c7; cursor: pointer; font-weight: 500; }

.ssc-table-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  overflow: hidden;
  margin-bottom: 16px;
}
.ssc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ssc-table thead tr, .ssc-table tfoot tr { background: #2e7d32; color: #ffffff; }
.ssc-table th { padding: 13px 14px; text-align: left; font-weight: 600; white-space: nowrap; font-family: sans-serif; }
.ssc-table td { padding: 11px 14px; border-bottom: 1px solid #e5e7eb; color: #374151; font-family: sans-serif; }
.ssc-table tbody tr:hover { background: #f3f4f6; }
.ssc-amount { text-align: right; color: #15803d !important; font-weight: 700; }

.ssc-actions { display: flex; gap: 6px; }
.ssc-action-btn {
  border: none; background: transparent; cursor: pointer;
  font-size: 15px; padding: 4px 7px; border-radius: 5px; transition: background 0.15s ease;
}
.ssc-action-btn:hover { background: #e5e7eb; transform: none; opacity: 1; }
.ssc-edit { color: #f97316; background: #fff3ed !important; border-radius: 6px !important; }
.ssc-view { color: #0284c7; background: #e0f2fe !important; border-radius: 6px !important; }
.ssc-redo { color: #ef4444; background: #fee2e2 !important; border-radius: 6px !important; font-size: 18px; }

.ssc-list-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 16px; flex-wrap: wrap; gap: 12px;
}
.ssc-pagination { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.ssc-pagination button {
  border: 1px solid #d1d5db; background: #ffffff; padding: 6px 11px;
  cursor: pointer; border-radius: 5px; font-size: 12px; color: #000000; transition: all 0.15s ease;
}
.ssc-pagination button:hover { background: #f3f4f6; border-color: #9ca3af; transform: none; opacity: 1; }
.ssc-pagination span { color: #6b7280; }

.ssc-btn {
  padding: 9px 22px; border: none; border-radius: 6px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px;
  font-family: sans-serif;
}
.ssc-btn:hover { transform: translateY(-1px); opacity: 0.9; }
.ssc-btn-new, .ssc-btn-primary { background: #00acc1; color: #ffffff; box-shadow: none; }
.ssc-btn-find { background: #388e3c; color: #ffffff; }
.ssc-btn-back { background: #e53935; color: #ffffff; border: none; }
.ssc-btn-outline { background: #ffffff; color: #374151; border: 1px solid #d1d5db; }
.ssc-btn-outline:hover { background: #f3f4f6; }

.ssc-form-card {
  background: #ffffff; border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  padding: 24px; margin-bottom: 16px; border: none;
}
.ssc-form-subtitle { color: #6b7280; font-size: 13px; margin-bottom: 16px; font-family: sans-serif; }
.ssc-staff-info-row { display: flex; align-items: flex-start; gap: 40px; margin-bottom: 16px; flex-wrap: wrap; }
.ssc-find-row { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 4px; flex-wrap: wrap; }
.ssc-field { display: flex; flex-direction: column; gap: 6px; min-width: 260px; }
.ssc-field label { font-size: 13px; font-weight: 600; color: #374151; font-family: sans-serif; text-transform: none; letter-spacing: normal; }
.ssc-static-select {
  border: 1px solid #d1d5db; border-radius: 6px; padding: 9px 11px;
  font-size: 14px; background: #f9fafb; color: #374151;
}
.ssc-info-block {
  font-size: 13px; line-height: 1.8; color: #374151;
  background: transparent; border: none; padding: 0; border-radius: 0;
}

.ssc-rows-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.ssc-rows-table th {
  background: #2e7d32; color: #ffffff; padding: 11px 12px;
  font-size: 13px; text-align: left; white-space: nowrap; font-family: sans-serif;
}
.ssc-rows-table-new th {
  background: #f9fafb !important; color: #1976d2 !important;
  font-weight: 600; border: 1px solid #e5e7eb;
}
.ssc-rows-table td { border: 1px solid #e5e7eb; padding: 7px 8px; }

.ssc-input {
  width: 100%; border: 1px solid #d1d5db; border-radius: 5px;
  padding: 8px 9px; font-size: 14px; outline: none;
  box-sizing: border-box; color: #111827; background: #ffffff; transition: all 0.15s ease;
}
.ssc-input:focus { border-color: #00acc1; box-shadow: 0 0 0 3px rgba(0,172,193,0.15); }

.ssc-ss-wrap { position: relative; min-width: 260px; }
.ssc-ss-trigger {
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #d1d5db; border-radius: 6px; padding: 9px 11px;
  font-size: 14px; cursor: pointer; background: #ffffff;
  min-height: 38px; color: #111827; transition: all 0.15s ease;
}
.ssc-ss-trigger:hover { border-color: #00acc1; }
.ssc-placeholder { color: #9ca3af; }
.ssc-ss-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #ffffff; border: 1px solid #d1d5db; border-radius: 6px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.15); z-index: 1000;
  max-height: 220px; overflow-y: auto;
}
.ssc-ss-search {
  display: block; width: 100%; padding: 9px 11px;
  border: none; border-bottom: 1px solid #e5e7eb;
  font-size: 14px; outline: none; box-sizing: border-box;
  background: #ffffff; color: #111827;
}
.ssc-ss-option { padding: 10px 12px; font-size: 14px; cursor: pointer; color: #374151; }
.ssc-ss-option:hover { background: #f3f4f6; }
.ssc-ss-selected { background: #00acc1 !important; color: #ffffff !important; }

.ssc-row-actions { display: flex; gap: 8px; margin-top: 10px; }
.ssc-form-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.ssc-form-footer { display: flex; gap: 10px; margin-top: 4px; }
.ssc-report-actions { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.ssc-report-preview {
  background: #ffffff; border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08); overflow: hidden; border: none;
}
.ssc-iframe { width: 100%; height: 85vh; border: none; background: #fff; }

/* ── Dummy Recurring Form ── */
.dummy-form-grid { display:grid; gap:16px; margin-top:4px; }
.dummy-form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.dummy-form-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
.dummy-field { display:flex; flex-direction:column; gap:6px; }
.dummy-field label { font-family:'Syne',sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.38); }
.dummy-note {
  background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.2);
  border-radius:12px; padding:12px 16px; margin-top:8px;
  font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(251,191,36,0.8);
}
`;

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: "ZBA001",
    title: "AI Based Research Project",
    pi: "Dr. Kumar",
    department: "IT",
    sanctionedAmount: 500000,
    equipment: ["High Performance GPU Server", "Deep Learning Workstation", "Network Switch"],
  },
  {
    id: "ZBA002",
    title: "IoT Smart Monitoring System",
    pi: "Dr. Priya",
    department: "CSE",
    sanctionedAmount: 350000,
    equipment: ["Raspberry Pi Cluster", "Arduino Sensors Kit", "Industrial Router"],
  },
];

const STAFF_LIST = [
  {
    id: 1,
    name: "J VENKADANATHAN",
    salutation: "Mr",
    designation: "Junior Research Fellow",
    mobile: "9751006781",
    email: "vnathan.98@gmail.com",
    joiningOrderNo: "CEG/MECH/SERB PROJECT/BSP/JRF/2023/1, dated 20-06-2023",
    bank: "STATE BANK OF INDIA",
    accountNo: "20162590992",
    ifsc: "SBIN0011071",
    appointmentFrom: "21-12-2022",
    appointmentTo: "30-11-2023",
    salaryPerMonth: 38440,
    fixedSalary: "Rs.31,000/-",
    hra: "Rs.7,440/-",
    projectTitle: "M.H.No.10.1.121—Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application",
    fundingAgency: "Science and Engineering Research Board, New Delhi {SERB}",
    projectPeriod: "From 05-12-2020 to 04-12-2023",
    procNo: "2433/CTDT-2/2020, dated 10-12-2020",
    expHead: "Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)",
    department: "Department of Mechanical Engineering, CEG Campus",
    pi: "Dr. S. Balasivanandha Prabu, Professor",
    departmentForSanction: "Department of Mechanical Engineering",
    campus: "CEG Campus",
  },
  {
    id: 2,
    name: "V VETRI VEL",
    salutation: "Mr",
    designation: "Junior Research Fellow",
    mobile: "9000000001",
    email: "vetri@gmail.com",
    joiningOrderNo: "CEG/MECH/JRF/2022/5",
    bank: "STATE BANK OF INDIA",
    accountNo: "31000000001",
    ifsc: "SBIN0001234",
    appointmentFrom: "01-07-2022",
    appointmentTo: "30-06-2024",
    salaryPerMonth: 38440,
    fixedSalary: "Rs.31,000/-",
    hra: "Rs.7,440/-",
    projectTitle: "Sample Project B",
    fundingAgency: "DST",
    projectPeriod: "From 01-07-2022 to 30-06-2025",
    procNo: "DST/2022/001",
    expHead: "Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)",
    department: "Department of Mechanical Engineering, CEG Campus",
    pi: "Dr. Sample PI, Professor",
    departmentForSanction: "Department of Mechanical Engineering",
    campus: "CEG Campus",
  },
];

const SAMPLE_CLAIMS = [
  { id: 1, staffId: 1, salaryFrom: "14-05-2023", salaryTo: "20-07-2023", clDays: 0.0, lopDays: 0.0, claimDays: 68, claimAmount: 85560.0, rows: [{ from: "14-05-2023", upto: "31-05-2023", cl: 0.0, lop: 0.0 }, { from: "01-06-2023", upto: "30-06-2023", cl: 0.0, lop: 0.0 }, { from: "01-07-2023", upto: "20-07-2023", cl: 0.0, lop: 0.0 }] },
  { id: 2, staffId: 1, salaryFrom: "01-04-2023", salaryTo: "30-04-2023", clDays: 1.0, lopDays: 0.0, claimDays: 30, claimAmount: 38440.0, rows: [{ from: "01-04-2023", upto: "30-04-2023", cl: 1.0, lop: 0.0 }] },
];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
function fmt(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function today() { return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function todayDMY() { return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-"); }
function parseDateStr(str) { if (!str) return null; const [d, m, y] = str.split("-"); return new Date(+y, +m - 1, +d); }
function daysBetween(from, upto) { const a = parseDateStr(from), b = parseDateStr(upto); if (!a || !b) return 0; return Math.round((b - a) / 86400000) + 1; }
function calcNetSalary(from, upto, salaryPerMonth, cl, lop) { const days = daysBetween(from, upto); if (!days) return 0; const dailyRate = salaryPerMonth / 30; return Math.round(dailyRate * days - lop * dailyRate); }
function fmtAmt(n) { return n.toLocaleString("en-IN", { minimumFractionDigits: 2 }); }
function toIndianWords(num) {
  const a = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const b = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function words(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n/10)] + (n%10 ? " "+a[n%10] : "");
    if (n < 1000) return a[Math.floor(n/100)] + " hundred" + (n%100 ? " "+words(n%100) : "");
    if (n < 100000) return words(Math.floor(n/1000)) + " thousand" + (n%1000 ? " "+words(n%1000) : "");
    if (n < 10000000) return words(Math.floor(n/100000)) + " lakh" + (n%100000 ? " "+words(n%100000) : "");
    return words(Math.floor(n/10000000)) + " crore" + (n%10000000 ? " "+words(n%10000000) : "");
  }
  if (!num) return "zero";
  const w = words(Math.floor(num));
  return w.charAt(0).toUpperCase() + w.slice(1) + " only";
}

/* ─── Manpower PDF ── */
function generateManpowerPDF(claim, staff) {
  const td = todayDMY();
  const totalClaim = claim.rows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, staff.salaryPerMonth, r.cl, r.lop), 0);
  const monthRows = claim.rows.map((r, i) => {
    const d = parseDateStr(r.from);
    const mY = d ? d.toLocaleString("en-IN", { month: "long", year: "numeric" }) : "";
    return `<tr><td>${i+1}</td><td>${mY}</td><td>CL</td><td>18</td><td>${r.cl}</td><td>${18-r.cl}</td></tr>`;
  }).join("");
  const sanctionRows = claim.rows.map((r, i) => {
    const net = calcNetSalary(r.from, r.upto, staff.salaryPerMonth, r.cl, r.lop);
    return `<tr><td>${i+1}</td><td>${r.from}</td><td>${r.upto}</td><td>${r.cl}</td><td>${r.lop}</td><td>0</td><td>${fmtAmt(net)}/-</td></tr>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Salary Claim - ${staff.name}</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:11px;background:#fff;color:#000;}
.page{width:210mm;min-height:297mm;padding:18mm 20mm;page-break-after:always;position:relative;}.page:last-child{page-break-after:avoid;}
h3{font-size:12px;text-align:center;font-weight:bold;}h4{font-size:11px;text-align:center;font-weight:bold;}
table{width:100%;border-collapse:collapse;margin:10px 0;}table,th,td{border:1px solid #000;}th,td{padding:4px 8px;}
th{background:#f0f0f0;font-weight:bold;}.center{text-align:center;}.right{text-align:right;}.bold{font-weight:bold;}
.section-label{background:#e0e0e0;font-weight:bold;}.no-border td,.no-border th{border:none;}
.sig-area{display:flex;justify-content:space-between;margin-top:40px;}.sig-box{text-align:center;width:40%;}
.office-section{border:1px solid #000;margin-top:20px;padding:10px;}.office-row{display:flex;gap:40px;}
.office-col{flex:1;}.underline{display:inline-block;border-bottom:1px solid #000;min-width:100px;}
.cert-text{font-size:10px;margin:12px 0;}.sig-row{display:flex;justify-content:space-between;margin-top:30px;font-weight:bold;}
.print-btn{position:fixed;top:10px;right:10px;padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999;}
@media print{.print-btn{display:none;}.page{page-break-after:always;}}</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
  <div class="center bold" style="margin-bottom:4px">CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</div>
  <div class="center bold">ANNA UNIVERSITY, CHENNAI 600 025</div>
  <div class="center bold" style="margin:6px 0">REQUEST FOR SALARY CLAIM IN PROJECT FUND</div>
  <div class="center bold">FOR THE PERIOD FROM ${claim.salaryFrom} TO ${claim.salaryTo}</div>
  <div class="right" style="margin-top:8px">Date: <strong>${td}</strong></div>
  <table style="margin-top:12px">
    <tr><td colspan="2" class="section-label bold">PROJECT DETAILS</td></tr>
    <tr><td style="width:35%">Project Title</td><td>${staff.projectTitle}</td></tr>
    <tr><td>Funding Agency</td><td>${staff.fundingAgency}</td></tr>
    <tr><td>Project Period</td><td>${staff.projectPeriod}</td></tr>
    <tr><td>CTDT Procs. No. & Date</td><td>${staff.procNo}</td></tr>
    <tr><td>Exp. Head</td><td>${staff.expHead}</td></tr>
    <tr><td>Department & Campus</td><td>${staff.department}</td></tr>
    <tr><td colspan="2" class="section-label bold">PI DETAILS</td></tr>
    <tr><td>Name</td><td>${staff.pi}</td></tr>
    <tr><td colspan="2" class="section-label bold">CLAIMANT DETAILS</td></tr>
    <tr><td>Name</td><td>${staff.salutation} ${staff.name}, ${staff.designation}</td></tr>
    <tr><td>Mobile/Email</td><td>${staff.mobile} / ${staff.email}</td></tr>
    <tr><td>Tenure Period</td><td>From ${staff.appointmentFrom} To ${staff.appointmentTo}</td></tr>
    <tr><td>Joining Order No.</td><td>${staff.joiningOrderNo}</td></tr>
    <tr><td>Bank Name</td><td>${staff.bank}</td></tr>
    <tr><td>Account Number</td><td>${staff.accountNo}</td></tr>
    <tr><td>IFSC Code</td><td>${staff.ifsc}</td></tr>
    <tr><td>Claiming period</td><td>${claim.salaryFrom} to ${claim.salaryTo}</td></tr>
    <tr><td>Fixed Salary+HRA</td><td>Rs.${fmtAmt(staff.salaryPerMonth)}/- per month [Salary: ${staff.fixedSalary} &amp; HRA: ${staff.hra}]</td></tr>
    <tr><td>Number of days eligible</td><td>${claim.claimDays}</td></tr>
    <tr><td>Deductions, if any</td><td>Rs.0/-</td></tr>
    <tr><td>Total Amount claimed</td><td class="bold">Rs.${fmtAmt(totalClaim)}/- (Rupees ${toIndianWords(totalClaim)})</td></tr>
  </table>
  <p class="cert-text">Certified that the claim made in this bill was not drawn by me earlier, if any excess claim is noticed later, I will refund it and also Certified that I am not occupying the hostel room.</p>
  <div class="right" style="margin-top:20px">Stamped Acquittance with Signature</div>
  <p class="cert-text" style="margin-top:30px">Certified that the claim is in order and may be admitted.</p>
  <div class="sig-area"><div class="sig-box"><div>SIGNATURE OF</div><div class="bold">THE PRINCIPAL INVESTIGATOR</div></div><div class="sig-box"><div class="bold">PROFESSOR AND HEAD/DEAN</div></div></div>
  <div class="office-section"><div class="bold center" style="margin-bottom:8px">FOR CTDT OFFICE ONLY</div>
    <div class="office-row"><div class="office-col"><div>Entered in Appropriation Register</div><div>Folio No. <span class="underline">&nbsp;&nbsp;&nbsp;</span> Year 20&nbsp;-20&nbsp;</div><div style="margin-top:6px">Passed for and Pay Rs. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div>Rupees <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div></div>
    <div class="office-col"><div>Voucher No.</div><div>Paid</div><div>Cheque No. <span class="underline">&nbsp;&nbsp;&nbsp;</span>/Neft. Dt.</div><div>Dated <span class="underline">&nbsp;&nbsp;&nbsp;</span> for Rs. <span class="underline">&nbsp;&nbsp;&nbsp;</span></div></div></div>
    <div class="sig-row"><span>ASST.&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;DIRECTOR</span><span>ASST.&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;DIRECTOR</span></div></div>
</div>
<div class="page">
  <div class="center bold" style="margin-bottom:8px">LEAVE PARTICULARS</div>
  <div>CTDT Procs. No. ${staff.procNo}</div>
  <div style="margin:6px 0">Name with Designation: <strong>${staff.salutation} ${staff.name}, ${staff.designation}</strong></div>
  <div>Tenure period: <strong>From ${staff.appointmentFrom} To ${staff.appointmentTo}</strong> &nbsp; Eligible Total CL Days: 18 days</div>
  <table style="margin-top:12px"><thead><tr><th>Sl.No.</th><th>Month &amp; Year</th><th>Leave Type</th><th>Eligible Days</th><th>Availed</th><th>Balance CL</th></tr></thead><tbody>${monthRows}</tbody></table>
  <p class="cert-text" style="margin-top:20px">Certified that the leave is granted as per leave eligibility maintained in the leave register.</p>
  <div class="sig-area" style="margin-top:60px"><div class="sig-box"><div>SIGNATURE OF</div><div class="bold">THE PRINCIPAL INVESTIGATOR</div></div><div class="sig-box"><div class="bold">PROFESSOR AND HEAD/DEAN</div></div></div>
</div>
<div class="page">
  <div class="center bold">DEPARTMENT OF MECHANICAL ENGINEERING</div>
  <div class="center bold">CEG CAMPUS, ANNA UNIVERSITY, CHENNAI-600 025.</div>
  <div style="display:flex;justify-content:space-between;margin:12px 0"><div>PROCEEDINGS NO: ${staff.procNo}</div><div>Dated: <strong>${td}</strong></div></div>
  <table class="no-border" style="margin-bottom:8px"><tr><td style="width:60px;vertical-align:top;">SUB:</td><td>R&amp;D Project – <strong>${staff.projectTitle}</strong> - Sanction - Accorded</td></tr><tr><td style="vertical-align:top;">REF:</td><td>Salary Claim bill, enclosed.</td></tr></table>
  <div class="center bold">*****</div>
  <p style="margin:14px 0;text-align:justify">Sanction is hereby accorded for the payment of <strong>Rs.${fmtAmt(totalClaim)}/- (Rupees ${toIndianWords(totalClaim)})</strong> to Project staff towards salary for the period from <strong>${claim.salaryFrom} to ${claim.salaryTo}</strong> as detailed below:</p>
  <table><thead><tr><th>Sl.No.</th><th>Period From</th><th>Period To</th><th>CL Days</th><th>LOP Days</th><th>LOP Amount</th><th>Net Salary</th></tr></thead><tbody>${sanctionRows}<tr><td colspan="6" class="right bold">TOTAL CLAIM</td><td class="bold">${fmtAmt(totalClaim)}/-</td></tr></tbody></table>
  <p style="margin-top:14px">The payment may be made to <strong>${staff.salutation} ${staff.name}, ${staff.designation}</strong></p>
  <p style="margin-top:12px;text-align:justify">The expenditure is debitable under the heads <strong>${staff.expHead}</strong>. Necessary entry has been made in the Project Sanction Register vide Page No. _______ Sl. No. _______.</p>
  <div class="right bold" style="margin-top:30px">PROFESSOR AND HEAD</div>
  <div style="margin-top:20px"><div>To</div><div>${staff.pi}</div><div>${staff.departmentForSanction}</div><div>${staff.campus}, Anna University</div><br/><div class="bold">Copy to:</div><div>Bill / Stock file</div></div>
</div></body></html>`;
}

/* ─── NR Report HTML ── */
function generateNRReportHTML(claim, project) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>NR Claim – ${project.id}</title>
<style>body{margin:0;padding:32px;font-family:'Segoe UI',sans-serif;background:#fff;color:#111;}
h1{font-size:22px;margin:0 0 4px;}.sub{color:#555;font-size:13px;margin-bottom:28px;}
.meta{display:flex;gap:24px;margin-bottom:22px;font-size:13px;flex-wrap:wrap;}
.meta span{background:#f0f4ff;padding:6px 12px;border-radius:6px;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{background:#0f172a;color:#fff;padding:11px 13px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;}
td{padding:10px 13px;border-bottom:1px solid #e2e8f0;}
tr:nth-child(even) td{background:#f8fafc;}
.amt{color:#15803d;font-weight:700;}
.summary{margin-top:24px;display:flex;gap:18px;flex-wrap:wrap;}
.scard{border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;min-width:160px;}
.scard label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;color:#888;margin-bottom:4px;}
.scard strong{font-size:19px;}.scard.green strong{color:#16a34a;}
footer{margin-top:32px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;}
.print-btn{position:fixed;top:10px;right:10px;padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;}
@media print{.print-btn{display:none;}}</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<h1>Non-Recurring Claim Report</h1>
<div class="sub">Generated on ${today()} &nbsp;|&nbsp; Confidential Document</div>
<div class="meta">
  <span><b>Project ID:</b> ${project.id}</span>
  <span><b>Title:</b> ${project.title}</span>
  <span><b>PI:</b> ${project.pi}</span>
  <span><b>Dept:</b> ${project.department}</span>
</div>
<table>
  <thead><tr><th>Equipment</th><th>Vendor/Supplier</th><th>Invoice No.</th><th>Invoice Date</th><th>Amount</th><th>Remarks</th></tr></thead>
  <tbody>
    <tr>
      <td>${claim.equipment}</td>
      <td>${claim.vendor || "—"}</td>
      <td>${claim.invoiceNo || "—"}</td>
      <td>${claim.invoiceDate || "—"}</td>
      <td class="amt">₹${Number(claim.amount).toLocaleString("en-IN")}</td>
      <td>${claim.remarks || "—"}</td>
    </tr>
  </tbody>
</table>
<div class="summary">
  <div class="scard green"><label>Claimed Amount</label><strong>₹${Number(claim.amount).toLocaleString("en-IN")}</strong></div>
  <div class="scard"><label>Sanctioned Total</label><strong>₹${Number(project.sanctionedAmount).toLocaleString("en-IN")}</strong></div>
</div>
<footer>This is a system-generated report. Individual bill files are archived separately.</footer>
</body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════
   SUB COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* ── Manpower (full SSC) ── */
function ManpowerPage({ onBack }) {
  const [claims, setClaims] = useState(SAMPLE_CLAIMS);
  const [view, setView] = useState("list");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [nextId, setNextId] = useState(SAMPLE_CLAIMS.length + 1);
  const [newStaff, setNewStaff] = useState(null);
  const [newStaffSearch, setNewStaffSearch] = useState("");
  const [newRows, setNewRows] = useState([{ from: "", upto: "", cl: "", lop: "" }]);
  const [staffDropOpen, setStaffDropOpen] = useState(false);

  const getStaff = (id) => STAFF_LIST.find((s) => s.id === id);

  const createPdf = async (claim, staff, mode) => {
    const html = generateManpowerPDF(claim, staff);
    const temp = document.createElement("div");
    temp.innerHTML = html; temp.style.cssText = "position:fixed;left:-9999px;top:0;width:210mm;";
    document.body.appendChild(temp);
    const pages = temp.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pw = 210; const ph = (canvas.height * pw) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pw, Math.min(ph, 297));
    }
    document.body.removeChild(temp);
    const fileName = `claim_${staff.name.replace(/\s/g, "_")}.pdf`;
    if (mode === "preview") { const url = URL.createObjectURL(pdf.output("blob")); window.open(url, "_blank"); }
    else pdf.save(fileName);
  };

  if (view === "list") return (
    <div className="ssc-page">
      <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
      <div className="ssc-header">
        <h2>Staff Salary Claims — Manpower</h2>
        <div className="ssc-breadcrumb"><span className="ssc-bc-link">ZBA</span> › Recurring › Manpower</div>
      </div>
      <div className="ssc-table-card">
        <div style={{ overflowX: "auto" }}>
          <table className="ssc-table">
            <thead><tr><th>Sl.</th><th>Name</th><th>Designation</th><th>Salary From</th><th>Salary To</th><th>CL</th><th>LOP</th><th>Days</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {claims.map((c, i) => {
                const s = getStaff(c.staffId);
                return (
                  <tr key={c.id}>
                    <td>{i + 1}</td><td>{s?.name}</td><td>{s?.designation}</td>
                    <td>{c.salaryFrom}</td><td>{c.salaryTo}</td>
                    <td>{c.clDays.toFixed(1)}</td><td>{c.lopDays.toFixed(1)}</td>
                    <td>{c.claimDays}</td>
                    <td className="ssc-amount">{fmtAmt(c.claimAmount)}</td>
                    <td>
                      <div className="ssc-actions">
                        <button className="ssc-action-btn ssc-edit" onClick={() => { setSelectedClaim(c); setView("edit"); }}>✏️</button>
                        <button className="ssc-action-btn ssc-view" onClick={() => { setSelectedClaim(c); setView("report"); }}>👁</button>
                        <button className="ssc-action-btn ssc-redo" onClick={() => { if (window.confirm("Reset this claim?")) setClaims(claims.filter(x => x.id !== c.id)); }}>↺</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ssc-list-footer">
        <div className="ssc-pagination">
          <button>First</button><button>Prev</button>
          <span>{claims.length} records</span>
          <button>Next</button><button>Last</button>
        </div>
        <button className="ssc-btn ssc-btn-new" onClick={() => { setNewStaff(null); setNewRows([{ from: "", upto: "", cl: "", lop: "" }]); setView("new"); }}>+ New Salary Claim</button>
      </div>
    </div>
  );

  if (view === "report" && selectedClaim) {
    const staff = getStaff(selectedClaim.staffId);
    const html = generateManpowerPDF(selectedClaim, staff);
    return (
      <div className="ssc-page">
        <div className="ssc-header"><h2>Salary Claim Report — {staff.name}</h2></div>
        <div className="ssc-report-actions">
          <button className="ssc-btn ssc-btn-primary" onClick={() => createPdf(selectedClaim, staff, "preview")}>👁 Preview PDF</button>
          <button className="ssc-btn ssc-btn-outline" onClick={() => createPdf(selectedClaim, staff, "download")}>⬇ Download PDF</button>
          <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>← Back</button>
        </div>
        <div className="ssc-report-preview"><iframe srcDoc={html} title="Report" className="ssc-iframe" /></div>
      </div>
    );
  }

  if (view === "edit" && selectedClaim) {
    const staff = getStaff(selectedClaim.staffId);
    const editRows = selectedClaim.rows;
    const handleUpdate = () => {
      const totalDays = editRows.reduce((s, r) => s + daysBetween(r.from, r.upto), 0);
      const totalCL = editRows.reduce((s, r) => s + (parseFloat(r.cl) || 0), 0);
      const totalLOP = editRows.reduce((s, r) => s + (parseFloat(r.lop) || 0), 0);
      const totalAmt = editRows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, staff.salaryPerMonth, parseFloat(r.cl) || 0, parseFloat(r.lop) || 0), 0);
      setClaims(claims.map(c => c.id === selectedClaim.id ? { ...selectedClaim, clDays: totalCL, lopDays: totalLOP, claimDays: totalDays, claimAmount: totalAmt, rows: editRows } : c));
      setView("list");
    };
    return (
      <div className="ssc-page">
        <div className="ssc-header"><h2>Edit Salary Claim</h2></div>
        <div className="ssc-form-card">
          <div className="ssc-form-subtitle">Editing claim for {staff.salutation} {staff.name}</div>
          <div className="ssc-info-block" style={{ marginBottom: 16 }}>
            <div><strong>Appointment:</strong> {staff.appointmentFrom} to {staff.appointmentTo}</div>
            <div><strong>Total CL availed:</strong> {selectedClaim.clDays}</div>
          </div>
          <table className="ssc-rows-table">
            <thead><tr><th>Claim from</th><th>Upto</th><th>CL</th><th>LOP</th></tr></thead>
            <tbody>
              {editRows.map((row, i) => (
                <tr key={i}>
                  <td><input type="text" className="ssc-input" value={row.from} onChange={e => { const r = [...editRows]; r[i] = { ...r[i], from: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="text" className="ssc-input" value={row.upto} onChange={e => { const r = [...editRows]; r[i] = { ...r[i], upto: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="number" step="0.1" className="ssc-input" value={row.cl} onChange={e => { const r = [...editRows]; r[i] = { ...r[i], cl: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="number" step="0.1" className="ssc-input" value={row.lop} onChange={e => { const r = [...editRows]; r[i] = { ...r[i], lop: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ssc-form-btns"><button className="ssc-btn ssc-btn-primary" onClick={handleUpdate}>Update</button></div>
        </div>
        <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>← Back</button>
      </div>
    );
  }

  if (view === "new") {
    const filtered = STAFF_LIST.filter(s => s.name.toLowerCase().includes(newStaffSearch.toLowerCase()));
    const lastClaim = claims.filter(c => c.staffId === newStaff?.id).sort((a, b) => b.id - a.id)[0];
    const addRow = () => setNewRows([...newRows, { from: "", upto: "", cl: "", lop: "" }]);
    const deleteRow = () => { if (newRows.length > 1) setNewRows(newRows.slice(0, -1)); };
    const setRow = (i, k, v) => { const r = [...newRows]; r[i] = { ...r[i], [k]: v }; setNewRows(r); };
    const handleAdd = () => {
      if (!newStaff) return alert("Please select a staff member.");
      for (const r of newRows) { if (!r.from || !r.upto) return alert("Fill all date fields."); }
      const totalDays = newRows.reduce((s, r) => s + daysBetween(r.from, r.upto), 0);
      const totalCL = newRows.reduce((s, r) => s + (parseFloat(r.cl) || 0), 0);
      const totalLOP = newRows.reduce((s, r) => s + (parseFloat(r.lop) || 0), 0);
      const totalAmt = newRows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, newStaff.salaryPerMonth, parseFloat(r.cl) || 0, parseFloat(r.lop) || 0), 0);
      setClaims([...claims, { id: nextId, staffId: newStaff.id, salaryFrom: newRows[0].from, salaryTo: newRows[newRows.length-1].upto, clDays: totalCL, lopDays: totalLOP, claimDays: totalDays, claimAmount: totalAmt, rows: newRows.map(r => ({ from: r.from, upto: r.upto, cl: parseFloat(r.cl)||0, lop: parseFloat(r.lop)||0 })) }]);
      setNextId(nextId + 1);
      setView("list");
    };
    return (
      <div className="ssc-page">
        <div className="ssc-header"><h2>New Salary Claim</h2></div>
        <div className="ssc-form-card">
          <div className="ssc-form-subtitle">Claim details adding....</div>
          <div className="ssc-find-row">
            <div className="ssc-field">
              <label>Staff Name</label>
              <div className="ssc-ss-wrap">
                <div className="ssc-ss-trigger" onClick={() => setStaffDropOpen(!staffDropOpen)}>
                  <span className={newStaff ? "" : "ssc-placeholder"}>{newStaff ? `${newStaff.salutation} ${newStaff.name}` : "--Select--"}</span>
                  <span>▾</span>
                </div>
                {staffDropOpen && (
                  <div className="ssc-ss-dropdown">
                    <input className="ssc-ss-search" placeholder="Search..." value={newStaffSearch} onChange={e => setNewStaffSearch(e.target.value)} autoFocus />
                    <div className={`ssc-ss-option ${!newStaff ? "ssc-ss-selected" : ""}`} onClick={() => { setNewStaff(null); setStaffDropOpen(false); }}>--Select--</div>
                    {filtered.map(s => (
                      <div key={s.id} className={`ssc-ss-option ${newStaff?.id === s.id ? "ssc-ss-selected" : ""}`} onClick={() => { setNewStaff(s); setStaffDropOpen(false); setNewStaffSearch(""); }}>{s.salutation} {s.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className="ssc-btn ssc-btn-find">Find</button>
          </div>
          {newStaff && (
            <>
              <div className="ssc-info-block" style={{ margin: "12px 0" }}>
                <div><strong>Appointment:</strong> {newStaff.appointmentFrom} to {newStaff.appointmentTo}</div>
                <div><strong>Salary claimed upto:</strong> {lastClaim?.salaryTo || "Not claimed yet"}</div>
                <div><strong>Total CL availed:</strong> {claims.filter(c => c.staffId === newStaff.id).reduce((s, c) => s + c.clDays, 0)}</div>
              </div>
              <table className="ssc-rows-table ssc-rows-table-new">
                <thead><tr><th style={{ color: "#38bdf8" }}>Claim from</th><th style={{ color: "#38bdf8" }}>Upto</th><th style={{ color: "#38bdf8" }}>CL</th><th style={{ color: "#38bdf8" }}>LOP</th></tr></thead>
                <tbody>
                  {newRows.map((row, i) => (
                    <tr key={i}>
                      <td><input type="date" className="ssc-input" value={row.from ? row.from.split("-").reverse().join("-") : ""} onChange={e => { const p = e.target.value.split("-"); setRow(i, "from", p.reverse().join("-")); }} /></td>
                      <td><input type="date" className="ssc-input" value={row.upto ? row.upto.split("-").reverse().join("-") : ""} onChange={e => { const p = e.target.value.split("-"); setRow(i, "upto", p.reverse().join("-")); }} /></td>
                      <td><input type="number" step="0.1" placeholder="CL" className="ssc-input" value={row.cl} onChange={e => setRow(i, "cl", e.target.value)} /></td>
                      <td><input type="number" step="0.1" placeholder="LOP" className="ssc-input" value={row.lop} onChange={e => setRow(i, "lop", e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ssc-row-actions">
                <button className="ssc-btn ssc-btn-outline" onClick={addRow}>+ Add Row</button>
                <button className="ssc-btn ssc-btn-outline" onClick={deleteRow}>− Delete Row</button>
              </div>
              <div className="ssc-form-btns"><button className="ssc-btn ssc-btn-primary" onClick={handleAdd}>Add</button></div>
            </>
          )}
        </div>
        <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>← Back</button>
      </div>
    );
  }
  return null;
}

/* ── Dummy Recurring Sub-head form ── */
function DummyRecurringForm({ headName, icon, fields, onSubmit, onBack }) {
  const [data, setData] = useState({});
  const set = (k, v) => setData(prev => ({ ...prev, [k]: v }));
  return (
    <div className="slip-card" style={{ animation: "slideIn 0.3s ease" }}>
      <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
      <h2>{icon} {headName} — Claim Entry</h2>
      <div className="dummy-note">
        ℹ️ Detailed fields for {headName} will be configured. Below are placeholder fields.
      </div>
      <div className="dummy-form-grid" style={{ marginTop: 20 }}>
        {fields.map((f, i) => (
          <div key={i} className={f.span === 2 ? "dummy-form-row-2" : f.span === 3 ? "dummy-form-row-3" : ""}>
            {f.span ? f.items.map((item, j) => (
              <div key={j} className="dummy-field">
                <label>{item.label}</label>
                {item.type === "select" ? (
                  <select className="slip-input" value={data[item.key] || ""} onChange={e => set(item.key, e.target.value)}>
                    <option value="">-- Select --</option>
                    {(item.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : item.type === "file" ? (
                  <input type="file" className="slip-input" accept=".pdf,image/*" onChange={e => set(item.key, e.target.files[0])} />
                ) : item.type === "textarea" ? (
                  <textarea className="slip-input" rows={3} placeholder={item.placeholder || ""} value={data[item.key] || ""} onChange={e => set(item.key, e.target.value)} style={{ resize: "vertical" }} />
                ) : (
                  <input type={item.type || "text"} className="slip-input" placeholder={item.placeholder || ""} value={data[item.key] || ""} onChange={e => set(item.key, e.target.value)} />
                )}
              </div>
            )) : (
              <div className="dummy-field">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea className="slip-input" rows={3} placeholder={f.placeholder || ""} value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)} style={{ resize: "vertical" }} />
                ) : f.type === "file" ? (
                  <input type="file" className="slip-input" accept=".pdf,image/*" onChange={e => set(f.key, e.target.files[0])} />
                ) : f.type === "select" ? (
                  <select className="slip-input" value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)}>
                    <option value="">-- Select --</option>
                    {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type || "text"} className="slip-input" placeholder={f.placeholder || ""} value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="slip-submit-row">
        <button className="submit-btn" onClick={() => onSubmit(data, headName)}>Submit Claim</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RECURRING HEAD FIELD CONFIGS
═══════════════════════════════════════════════════════════════════ */
const CONSUMABLES_FIELDS = [
  { span: 2, items: [{ key: "itemName", label: "Item / Material Name", placeholder: "e.g. Chemicals, Lab supplies..." }, { key: "quantity", label: "Quantity", type: "number", placeholder: "Quantity" }] },
  { span: 2, items: [{ key: "unitCost", label: "Unit Cost (₹)", type: "number", placeholder: "0.00" }, { key: "totalCost", label: "Total Cost (₹)", type: "number", placeholder: "0.00" }] },
  { key: "vendor", label: "Vendor / Supplier Name", placeholder: "Supplier name" },
  { span: 2, items: [{ key: "invoiceNo", label: "Invoice Number", placeholder: "INV-XXXX" }, { key: "invoiceDate", label: "Invoice Date", type: "date" }] },
  { key: "purpose", label: "Purpose / Description", type: "textarea", placeholder: "Describe the usage purpose..." },
  { key: "billFile", label: "Upload Bill / Invoice", type: "file" },
];

const TRAVEL_FIELDS = [
  { span: 2, items: [{ key: "travellerName", label: "Traveller Name", placeholder: "Full name" }, { key: "designation", label: "Designation", placeholder: "JRF / SRF / PI..." }] },
  { span: 3, items: [{ key: "origin", label: "From (Origin)", placeholder: "City / Place" }, { key: "destination", label: "To (Destination)", placeholder: "City / Place" }, { key: "travelDate", label: "Travel Date", type: "date" }] },
  { span: 2, items: [{ key: "mode", label: "Mode of Transport", type: "select", options: ["Air", "Train", "Bus", "Taxi / Auto", "Own Vehicle", "Other"] }, { key: "purpose", label: "Purpose of Travel", placeholder: "Conference / Field work / Meeting..." }] },
  { span: 2, items: [{ key: "fare", label: "Fare / Ticket Amount (₹)", type: "number", placeholder: "0.00" }, { key: "da", label: "Daily Allowance (₹)", type: "number", placeholder: "0.00" }] },
  { key: "remarks", label: "Remarks", type: "textarea", placeholder: "Additional notes..." },
  { key: "ticketFile", label: "Upload Ticket / Receipt", type: "file" },
];

const CONTINGENCY_FIELDS = [
  { span: 2, items: [{ key: "expenseHead", label: "Expense Head", placeholder: "e.g. Postage, Printing, Stationery..." }, { key: "amount", label: "Amount (₹)", type: "number", placeholder: "0.00" }] },
  { key: "description", label: "Description of Expense", type: "textarea", placeholder: "Describe the contingency expense..." },
  { span: 2, items: [{ key: "receiptNo", label: "Receipt / Voucher No.", placeholder: "REC-XXXX" }, { key: "receiptDate", label: "Receipt Date", type: "date" }] },
  { key: "remarks", label: "Remarks / Justification", type: "textarea", placeholder: "Why this expense was necessary..." },
  { key: "receiptFile", label: "Upload Receipt", type: "file" },
];

const OTHER_EXPENSES_FIELDS = [
  { span: 2, items: [{ key: "expenseType", label: "Expense Type / Category", placeholder: "e.g. Publication, Patent filing..." }, { key: "amount", label: "Amount (₹)", type: "number", placeholder: "0.00" }] },
  { key: "payee", label: "Payee / Organisation", placeholder: "Name of payee" },
  { span: 2, items: [{ key: "billNo", label: "Bill / Reference No.", placeholder: "REF-XXXX" }, { key: "billDate", label: "Bill Date", type: "date" }] },
  { key: "justification", label: "Justification / Description", type: "textarea", placeholder: "Provide justification for this expense..." },
  { key: "supportFile", label: "Supporting Document", type: "file" },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ZBASlipPage() {
  /* ── navigation state ── */
  // screen: "projects" | "headType" | "nonRecurring" | "recurring" | "recurringHead" | "underReview" | "settledBills" | "manpower"
  const [screen, setScreen] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [recurringHead, setRecurringHead] = useState(null);

  /* ── Non-Recurring form state ── */
  const [nrData, setNrData] = useState({});

  /* ── Claims store: { projectId: [{ id, type, head, amount, status:"review"|"approved", date, reportHTML, ... }] } ── */
  const [claimsStore, setClaimsStore] = useState({});

  /* ── Under Review tab ── */
  const [reviewTab, setReviewTab] = useState("review");

  /* ── Settled Bills ── */
  const [settledProject, setSettledProject] = useState(null);
  const [settledTab, setSettledTab] = useState(null);

  /* ── Success overlay ── */
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── PDF preview ── */
  const [pdfPreview, setPdfPreview] = useState(null);

  const projectClaims = (pid) => claimsStore[pid] || [];
  const allClaims = selectedProject ? projectClaims(selectedProject.id) : [];
  const reviewClaims = allClaims.filter(c => c.status === "review");
  const approvedClaims = allClaims.filter(c => c.status === "approved");

  /* ─── helpers ─── */
  const pushClaim = (pid, claim) => {
    setClaimsStore(prev => ({ ...prev, [pid]: [...(prev[pid] || []), claim] }));
  };

  const approveClaim = (pid, cid) => {
    setClaimsStore(prev => ({
      ...prev,
      [pid]: (prev[pid] || []).map(c => c.id === cid ? { ...c, status: "approved" } : c),
    }));
  };

  const showSuccessFor = (ms = 2200) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), ms);
  };

  /* ─── NR Submit ─── */
  const handleNRSubmit = () => {
    if (!nrData.equipment || !nrData.amount) { alert("Please select equipment and enter amount."); return; }
    const id = Date.now();
    const reportHTML = generateNRReportHTML({ ...nrData }, selectedProject);
    pushClaim(selectedProject.id, {
      id, type: "Non-Recurring", head: nrData.equipment,
      amount: Number(nrData.amount), date: today(),
      status: "review", reportHTML,
      vendor: nrData.vendor, invoiceNo: nrData.invoiceNo,
      invoiceDate: nrData.invoiceDate, remarks: nrData.remarks,
      fileURL: nrData.bill ? URL.createObjectURL(nrData.bill) : null,
      fileName: nrData.bill ? nrData.bill.name : null,
    });
    setNrData({});
    showSuccessFor();
    setTimeout(() => setScreen("underReview"), 2200);
  };

  /* ─── Recurring dummy submit ─── */
  const handleRecurringSubmit = (data, headName) => {
    const id = Date.now();
    const amount = Number(data.amount || data.totalCost || data.fare || 0);
    pushClaim(selectedProject.id, {
      id, type: "Recurring", head: headName,
      amount, date: today(), status: "review",
      reportHTML: `<html><body style="font-family:sans-serif;padding:32px"><h2>${headName} Claim</h2><p>Project: ${selectedProject.title}</p><p>Amount: ₹${amount.toLocaleString("en-IN")}</p><p>Date: ${today()}</p></body></html>`,
      fileURL: null, fileName: null,
    });
    showSuccessFor();
    setTimeout(() => setScreen("underReview"), 2200);
  };

  /* ─── NR PDF generation ─── */
  const generateReportPDF = async (claim, mode = "preview") => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:-9999px;top:0;width:900px;padding:30px;background:#fff;font-family:Arial,sans-serif;";
    el.innerHTML = claim.reportHTML.replace(/<button[^>]*>.*?<\/button>/g, "").replace(/<style[^>]*>.*?<\/style>/g, "");
    document.body.appendChild(el);
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    document.body.removeChild(el);
    const pdf = new jsPDF("p", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const ph = (canvas.height * pw) / canvas.width;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, ph);
    const fn = `Claim_${claim.head.replace(/\s/g, "_")}.pdf`;
    if (mode === "download") pdf.save(fn);
    else { const url = URL.createObjectURL(pdf.output("blob")); setPdfPreview({ name: fn, url }); }
  };

  /* ═══════ RENDER SCREENS ═══════ */

  /* ── Projects Table ── */
  const renderProjects = () => (
    <div className="slip-table-card">
      <h2>ZBA Slip — Projects</h2>
      <div className="slip-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project ID</th><th>Project Title</th><th>PI</th>
              <th>Dept.</th><th>Sanctioned</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.pi}</td>
                <td>{p.department}</td>
                <td>{fmt(p.sanctionedAmount)}</td>
                <td style={{ display: "flex", gap: 0 }}>
                  <button className="slip-view-btn" onClick={() => { setSelectedProject(p); setScreen("headType"); }}>
                    Update Claim
                  </button>
                  <button className="settled-btn" onClick={() => { setSettledProject(p); setSettledTab(p.id); }}>
                    📋 Settled Bills
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── Head Type Selection ── */
  const renderHeadType = () => (
    <div className="slip-card" style={{ animation: "slideIn 0.3s ease" }}>
      <div className="claim-breadcrumb">
        <span className="bc-link" onClick={() => setScreen("projects")}>Projects</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Update Claim — {selectedProject.title}</span>
      </div>
      <h2>Select Head Type</h2>
      <div className="head-type-grid">
        <div className="head-type-card non-recurring" onClick={() => setScreen("nonRecurring")}>
          <div className="hc-icon">🔧</div>
          <div className="hc-title">Non-Recurring</div>
          <div className="hc-sub">Equipment purchases, one-time capital expenditure items</div>
          <div className="hc-arr">→</div>
        </div>
        <div className="head-type-card recurring" onClick={() => setScreen("recurring")}>
          <div className="hc-icon">🔄</div>
          <div className="hc-title">Recurring</div>
          <div className="hc-sub">Manpower, consumables, travel, contingency & other expenses</div>
          <div className="hc-arr">→</div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button className="back-btn" onClick={() => setScreen("projects")}>← Back to Projects</button>
        <button className="settled-btn" style={{ marginLeft: 0 }} onClick={() => setScreen("underReview")}>
          📋 Under Review ({reviewClaims.length})
        </button>
      </div>
    </div>
  );

  /* ── Non-Recurring Form ── */
  const renderNonRecurring = () => (
    <div className="slip-card" style={{ animation: "slideIn 0.3s ease" }}>
      <div className="claim-breadcrumb">
        <span className="bc-link" onClick={() => setScreen("projects")}>Projects</span>
        <span className="bc-sep">›</span>
        <span className="bc-link" onClick={() => setScreen("headType")}>Update Claim</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Non-Recurring</span>
      </div>
      <h2>🔧 Non-Recurring Head — Equipment Entry</h2>

      <div className="nr-form-grid">
        <div className="nr-field">
          <label>Equipment / Item</label>
          <select className="slip-input" value={nrData.equipment || ""} onChange={e => setNrData(p => ({ ...p, equipment: e.target.value }))}>
            <option value="">-- Select Equipment --</option>
            {selectedProject.equipment.map(eq => <option key={eq} value={eq}>{eq}</option>)}
          </select>
        </div>

        <div className="nr-row-2">
          <div className="nr-field">
            <label>Amount (₹)</label>
            <input type="number" className="slip-input" placeholder="Enter amount" value={nrData.amount || ""} disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, amount: e.target.value }))} />
          </div>
          <div className="nr-field">
            <label>Vendor / Supplier</label>
            <input type="text" className="slip-input" placeholder="Supplier name" value={nrData.vendor || ""} disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, vendor: e.target.value }))} />
          </div>
        </div>

        <div className="nr-row-3">
          <div className="nr-field">
            <label>Invoice Number</label>
            <input type="text" className="slip-input" placeholder="INV-XXXX" value={nrData.invoiceNo || ""} disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, invoiceNo: e.target.value }))} />
          </div>
          <div className="nr-field">
            <label>Invoice Date</label>
            <input type="date" className="slip-input" value={nrData.invoiceDate || ""} disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, invoiceDate: e.target.value }))} />
          </div>
          <div className="nr-field">
            <label>Upload Bill</label>
            <input type="file" accept=".pdf,image/*" className="slip-input" disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, bill: e.target.files[0] }))} />
          </div>
        </div>

        <div className="nr-field">
          <label>Further Details / Remarks</label>
          <textarea className="slip-input" rows={3} placeholder="Enter additional details..." value={nrData.remarks || ""} disabled={!nrData.equipment} onChange={e => setNrData(p => ({ ...p, remarks: e.target.value }))} style={{ resize: "vertical" }} />
        </div>
      </div>

      <div className="slip-submit-row">
        <button className="back-btn" onClick={() => setScreen("headType")}>← Back</button>
        <button className="submit-btn" onClick={handleNRSubmit}>Submit Claim →</button>
      </div>
    </div>
  );

  /* ── Recurring Head Selection ── */
  const RECURRING_HEADS = [
    { key: "manpower", label: "Manpower", icon: "👥", sub: "Salary claims for JRF/SRF/RA" },
    { key: "consumables", label: "Consumables & Accessories", icon: "🧪", sub: "Lab materials, chemicals, supplies" },
    { key: "travel", label: "Travel", icon: "✈️", sub: "Conference, field work, official visits" },
    { key: "contingency", label: "Contingency", icon: "📦", sub: "Postage, printing, stationery, misc" },
    { key: "otherExpenses", label: "Other Expenses", icon: "💰", sub: "Publications, patents, other misc." },
  ];

  const renderRecurring = () => (
    <div className="slip-card" style={{ animation: "slideIn 0.3s ease" }}>
      <div className="claim-breadcrumb">
        <span className="bc-link" onClick={() => setScreen("projects")}>Projects</span>
        <span className="bc-sep">›</span>
        <span className="bc-link" onClick={() => setScreen("headType")}>Update Claim</span>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Recurring</span>
      </div>
      <h2>🔄 Recurring Heads</h2>
      <div className="rec-head-grid">
        {RECURRING_HEADS.map(h => (
          <div key={h.key} className="rec-head-card" onClick={() => { setRecurringHead(h.key); setScreen("recurringHead"); }}>
            <div className="rhc-icon">{h.icon}</div>
            <div className="rhc-title">{h.label}</div>
            <div className="hc-sub" style={{ fontSize: 11 }}>{h.sub}</div>
          </div>
        ))}
      </div>
      <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setScreen("headType")}>← Back</button>
    </div>
  );

  /* ── Recurring Head Detail ── */
  const renderRecurringHead = () => {
    const headCfg = RECURRING_HEADS.find(h => h.key === recurringHead);
    if (recurringHead === "manpower") {
      return <ManpowerPage onBack={() => setScreen("recurring")} />;
    }
    let fields = [];
    if (recurringHead === "consumables") fields = CONSUMABLES_FIELDS;
    else if (recurringHead === "travel") fields = TRAVEL_FIELDS;
    else if (recurringHead === "contingency") fields = CONTINGENCY_FIELDS;
    else if (recurringHead === "otherExpenses") fields = OTHER_EXPENSES_FIELDS;

    return (
      <DummyRecurringForm
        headName={headCfg.label}
        icon={headCfg.icon}
        fields={fields}
        onSubmit={handleRecurringSubmit}
        onBack={() => setScreen("recurring")}
      />
    );
  };

  /* ── Under Review ── */
  const renderUnderReview = () => {
    const displayClaims = reviewTab === "review" ? reviewClaims : approvedClaims;
    return (
      <div className="slip-card" style={{ animation: "slideIn 0.3s ease" }}>
        <div className="claim-breadcrumb">
          <span className="bc-link" onClick={() => setScreen("projects")}>Projects</span>
          <span className="bc-sep">›</span>
          <span className="bc-link" onClick={() => setScreen("headType")}>Update Claim</span>
          <span className="bc-sep">›</span>
          <span className="bc-cur">Review & Approval</span>
        </div>
        <h2>📋 Claims — {selectedProject.title}</h2>

        <div className="review-tabs">
          <button className={`review-tab ${reviewTab === "review" ? "active-under" : ""}`} onClick={() => setReviewTab("review")}>
            ⏳ Under Review <span className="review-tab-count">{reviewClaims.length}</span>
          </button>
          <button className={`review-tab ${reviewTab === "approved" ? "active-approved" : ""}`} onClick={() => setReviewTab("approved")}>
            ✅ Approved <span className="review-tab-count">{approvedClaims.length}</span>
          </button>
        </div>

        {displayClaims.length === 0 ? (
          <div className="empty-bills">
            <div className="empty-icon">{reviewTab === "review" ? "⏳" : "✅"}</div>
            {reviewTab === "review" ? "No claims under review." : "No approved claims yet."}
          </div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="review-table">
              <thead>
                <tr>
                  <th>#</th><th>Date</th><th>Type</th><th>Head</th>
                  <th>Amount</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayClaims.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>{i + 1}</td>
                    <td>{c.date}</td>
                    <td><span className="type-badge">{c.type}</span></td>
                    <td><span className="head-badge-purple">{c.head}</span></td>
                    <td className="amount-cell">{fmt(c.amount)}</td>
                    <td>
                      {c.status === "review"
                        ? <span className="status-badge-review">Under Review</span>
                        : <span className="status-badge-approved">✓ Approved</span>}
                    </td>
                    <td>
                      <div className="review-action-group">
                        <button className="preview-btn" onClick={() => setPdfPreview({ name: `${c.head}_report.html`, url: null, html: c.reportHTML })}>👁 Preview</button>
                        <button className="download-btn" onClick={() => generateReportPDF(c, "download")}>⬇ Download</button>
                        {c.status === "review" && (
                          <button className="approve-btn" onClick={() => approveClaim(selectedProject.id, c.id)}>✓ Approve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="back-btn" style={{ marginTop: 16 }} onClick={() => setScreen("headType")}>← Back to Claim Selection</button>
      </div>
    );
  };

  /* ── Settled Bills Modal ── */
  const renderSettledModal = () => {
    const activeProj = PROJECTS.find(p => p.id === settledTab);
    const activeClaims = projectClaims(settledTab).filter(c => c.status === "approved");
    const total = activeClaims.reduce((s, c) => s + c.amount, 0);
    return (
      <div className="settled-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSettledProject(null); }}>
        <div className="settled-modal">
          <div className="settled-modal-head">
            <h2>📋 Settled Bills <span>{activeProj?.title}</span></h2>
            <div className="settled-modal-actions">
              <button className="modal-close-btn" onClick={() => setSettledProject(null)}>✕ Close</button>
            </div>
          </div>
          <div className="settled-modal-body">
            <div className="settled-tabs">
              {PROJECTS.map(p => (
                <button key={p.id} className={`settled-tab ${settledTab === p.id ? "active" : ""}`} onClick={() => setSettledTab(p.id)}>
                  {p.id} — {p.title}
                  {projectClaims(p.id).filter(c => c.status === "approved").length > 0 &&
                    <span style={{ marginLeft: 6, background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 999, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                      {projectClaims(p.id).filter(c => c.status === "approved").length}
                    </span>}
                </button>
              ))}
            </div>
            <div className="settled-summary">
              <div className="settled-summary-card"><p>Total Approved</p><h4>{activeClaims.length}</h4></div>
              <div className="settled-summary-card"><p>Total Claimed</p><h4 className="green">{fmt(total)}</h4></div>
              <div className="settled-summary-card"><p>Balance Remaining</p><h4 className="yellow">{fmt((activeProj?.sanctionedAmount || 0) - total)}</h4></div>
            </div>
            {activeClaims.length === 0 ? (
              <div className="empty-bills"><div className="empty-icon">📭</div>No settled bills found.</div>
            ) : (
              <div className="bills-table-wrap">
                <table className="bills-table">
                  <thead><tr><th>#</th><th>Date</th><th>Type</th><th>Head</th><th>Amount</th><th>Status</th><th>Report</th></tr></thead>
                  <tbody>
                    {activeClaims.map((c, i) => (
                      <tr key={c.id}>
                        <td style={{ color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>{i + 1}</td>
                        <td>{c.date}</td>
                        <td><span className="type-badge">{c.type}</span></td>
                        <td><span className="head-badge-purple">{c.head}</span></td>
                        <td className="amount-cell">{fmt(c.amount)}</td>
                        <td><span className="status-badge-approved">✓ Approved</span></td>
                        <td>
                          <div className="bill-action-group">
                            <button className="preview-bill-btn" onClick={() => setPdfPreview({ name: `${c.head}.html`, url: null, html: c.reportHTML })}>👁 Preview</button>
                            <button className="download-bill-btn" onClick={() => generateReportPDF(c, "download")}>⬇ Download</button>
                          </div>
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
    );
  };

  /* ═══════ MAIN RETURN ═══════ */
  return (
    <>
      <style>{css}</style>
      <div className="slip-page">
        {/* Always show projects table at top */}
        {renderProjects()}

        {/* Contextual screens */}
        {screen === "headType" && renderHeadType()}
        {screen === "nonRecurring" && renderNonRecurring()}
        {screen === "recurring" && renderRecurring()}
        {screen === "recurringHead" && renderRecurringHead()}
        {screen === "underReview" && renderUnderReview()}

        {/* Settled Bills Modal */}
        {settledProject && renderSettledModal()}

        {/* Success Overlay */}
        {showSuccess && (
          <div className="success-overlay">
            <div className="success-box">
              <div className="success-check">✓</div>
              <h2>Claim Submitted</h2>
              <p>Your claim has been sent for review</p>
            </div>
          </div>
        )}

        {/* PDF/HTML Preview Modal */}
        {pdfPreview && (
          <div className="pdf-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPdfPreview(null); }}>
            <div className="pdf-preview-box">
              <div className="pdf-preview-head">
                <span>{pdfPreview.name}</span>
                <div>
                  {pdfPreview.url && <a href={pdfPreview.url} download={pdfPreview.name}>⬇ Download</a>}
                  <button onClick={() => setPdfPreview(null)}>✕ Close</button>
                </div>
              </div>
              {pdfPreview.html ? (
                <iframe className="pdf-preview-frame" srcDoc={pdfPreview.html} title={pdfPreview.name} />
              ) : pdfPreview.name?.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                <img src={pdfPreview.url} alt={pdfPreview.name} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
              ) : (
                <iframe className="pdf-preview-frame" src={pdfPreview.url} title={pdfPreview.name} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}