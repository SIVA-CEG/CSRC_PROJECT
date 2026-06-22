import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ═══════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

.slip-page { animation: slipFade 0.45s ease both; }
@keyframes slipFade { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
@keyframes modalPop { from{opacity:0;transform:scale(0.88) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes overlayFade { from{opacity:0} to{opacity:1} }
@keyframes checkPulse { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.35)} 70%{box-shadow:0 0 0 18px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }
@keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

.slip-table-card, .slip-card {
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.95);
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 24px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1);
}
.slip-table-card h2, .slip-card h2 {
  font-family: 'Syne', sans-serif;
  color: rgba(20,30,70,0.86);
  font-size: 18px;
  margin: 0 0 20px;
}
.slip-table-wrap { overflow-x: auto; }
.slip-table-card table { width:100%; border-collapse:collapse; min-width:750px; }
.slip-table-card th {
  background: rgba(2,132,199,0.07);
  color: rgba(20,30,70,0.5);
  font-family: 'Syne', sans-serif;
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
  padding: 14px; text-align: left; white-space: nowrap;
}
.slip-table-card td {
  border-bottom: 1px solid rgba(0,100,220,0.07);
  padding: 14px; color: rgba(20,30,70,0.74);
  font-family: 'DM Sans', sans-serif; font-size: 13px; white-space: nowrap;
}
.slip-table-card tr:hover td { background: rgba(2,132,199,0.045); }

.slip-input {
  width: 100%; background: rgba(0,100,220,0.04);
  border: 1px solid rgba(0,100,220,0.12);
  border-radius: 12px; padding: 11px 14px;
  color: rgba(20,30,70,0.86);
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: 0.2s; box-sizing: border-box;
}
.slip-input:focus {
  border-color: rgba(2,132,199,0.55);
  background: rgba(2,132,199,0.05);
  box-shadow: 0 0 0 3px rgba(2,132,199,0.1);
}
.slip-input:disabled { opacity: 0.4; cursor: not-allowed; }
.slip-input option { background: #fff; color: #111827; }

.slip-view-btn {
  border: 1px solid rgba(124,58,237,0.25);
  background: rgba(124,58,237,0.08);
  color: #6d28d9; border-radius: 10px;
  padding: 8px 14px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
  transition: 0.2s; white-space: nowrap;
}
.slip-view-btn:hover { background: rgba(124,58,237,0.16); transform: scale(1.04); }

.settled-btn {
  border: 1px solid rgba(217,119,6,0.28);
  background: rgba(217,119,6,0.08);
  color: #b45309; border-radius: 10px;
  padding: 8px 14px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
  transition: 0.2s; margin-left: 8px; white-space: nowrap;
}
.settled-btn:hover { background: rgba(217,119,6,0.18); transform: scale(1.04); }

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
.head-type-card:hover { transform: translateY(-4px); }
.head-type-card.non-recurring {
  background: linear-gradient(135deg, rgba(2,132,199,0.1), rgba(2,132,199,0.03));
  border: 1px solid rgba(2,132,199,0.22);
}
.head-type-card.non-recurring:hover { border-color: rgba(2,132,199,0.5); box-shadow: 0 12px 36px rgba(2,132,199,0.12); }
.head-type-card.recurring {
  background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.03));
  border: 1px solid rgba(124,58,237,0.22);
}
.head-type-card.recurring:hover { border-color: rgba(124,58,237,0.5); box-shadow: 0 12px 36px rgba(124,58,237,0.12); }
.head-type-card .hc-icon { font-size: 40px; }
.head-type-card .hc-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: rgba(20,30,70,0.9); }
.head-type-card .hc-sub { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(20,30,70,0.45); line-height: 1.5; }
.head-type-card .hc-arr { font-size: 20px; margin-top: 4px; color: rgba(20,30,70,0.3); }

.claim-breadcrumb {
  display: flex; align-items: center; gap: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  color: rgba(20,30,70,0.45); margin-bottom: 20px; flex-wrap: wrap;
}
.claim-breadcrumb .bc-link { color: #0284c7; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.claim-breadcrumb .bc-sep { color: rgba(20,30,70,0.22); }
.claim-breadcrumb .bc-cur { color: rgba(20,30,70,0.72); font-weight: 600; }

.back-btn {
  border: 1px solid rgba(0,100,220,0.13);
  background: rgba(0,100,220,0.05);
  color: rgba(20,30,70,0.58); border-radius: 10px;
  padding: 8px 16px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  transition: 0.2s; display: inline-flex; align-items: center; gap: 6px;
  margin-bottom: 18px;
}
.back-btn:hover { background: rgba(0,100,220,0.1); color: rgba(20,30,70,0.85); }

.nr-form-grid { display:grid; gap:18px; }
.nr-field { display: flex; flex-direction: column; gap: 7px; }
.nr-field label { font-family: 'Syne', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(20,30,70,0.42); }
.nr-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nr-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

.slip-submit-row { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
.submit-btn {
  border: none; border-radius: 14px; padding: 13px 32px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; font-family: 'Syne', sans-serif; font-weight: 800;
  cursor: pointer; box-shadow: 0 10px 25px rgba(34,197,94,0.22);
  font-size: 14px; transition: 0.2s;
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(34,197,94,0.3); }

.rec-head-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px; margin-top: 8px;
}
.rec-head-card {
  border-radius: 16px; padding: 20px 16px;
  cursor: pointer; transition: all 0.22s;
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; text-align: center;
  border: 1px solid rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.72);
  box-shadow: 0 3px 14px rgba(0,0,0,0.05);
}
.rec-head-card:hover { transform: translateY(-3px); border-color: rgba(124,58,237,0.35); background: rgba(124,58,237,0.06); box-shadow: 0 10px 28px rgba(124,58,237,0.1); }
.rec-head-card .rhc-icon { font-size: 32px; }
.rec-head-card .rhc-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: rgba(20,30,70,0.82); line-height: 1.3; }

.review-tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.review-tab {
  border: 1px solid rgba(0,100,220,0.12);
  background: rgba(0,100,220,0.04);
  color: rgba(20,30,70,0.52);
  border-radius: 10px; padding: 8px 16px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: 13px; transition: 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.review-tab.active-under { border-color: rgba(217,119,6,0.38); background: rgba(217,119,6,0.09); color: #b45309; }
.review-tab.active-approved { border-color: rgba(34,197,94,0.38); background: rgba(34,197,94,0.09); color: #16a34a; }
.review-tab-count { background: rgba(0,100,220,0.1); border-radius: 999px; padding: 1px 7px; font-size: 11px; font-weight: 700; }

.review-table { width: 100%; border-collapse: collapse; }
.review-table th { background: rgba(0,100,220,0.04); color: rgba(20,30,70,0.4); font-family: 'Syne', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; padding: 12px 14px; text-align: left; white-space: nowrap; }
.review-table td { padding: 13px 14px; color: rgba(20,30,70,0.72); font-family: 'DM Sans', sans-serif; font-size: 13px; border-bottom: 1px solid rgba(0,100,220,0.06); white-space: nowrap; }
.review-table tr:last-child td { border-bottom: none; }
.review-table tr:hover td { background: rgba(0,100,220,0.025); }

.status-badge-review { background: rgba(217,119,6,0.1); color: #b45309; border: 1px solid rgba(217,119,6,0.28); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif; }
.status-badge-approved { background: rgba(34,197,94,0.1); color: #16a34a; border: 1px solid rgba(34,197,94,0.28); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif; }
.type-badge { background: rgba(2,132,199,0.09); color: #0284c7; border: 1px solid rgba(2,132,199,0.2); padding: 3px 9px; border-radius: 999px; font-size: 11px; font-family: 'Syne', sans-serif; font-weight: 700; }
.head-badge-purple { background: rgba(124,58,237,0.08); color: #6d28d9; border: 1px solid rgba(124,58,237,0.2); padding: 3px 9px; border-radius: 999px; font-size: 11px; font-family: 'DM Sans', sans-serif; }
.amount-cell { color: #16a34a; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; }

.review-action-group { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.preview-btn { border: 1px solid rgba(2,132,199,0.25); background: rgba(2,132,199,0.07); color: #0284c7; border-radius: 8px; padding: 6px 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; transition: 0.2s; }
.preview-btn:hover { background: rgba(2,132,199,0.16); }
.download-btn { border: 1px solid rgba(34,197,94,0.25); background: rgba(34,197,94,0.07); color: #16a34a; border-radius: 8px; padding: 6px 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; transition: 0.2s; }
.download-btn:hover { background: rgba(34,197,94,0.16); }
.approve-btn { border: 1px solid rgba(217,119,6,0.32); background: rgba(217,119,6,0.09); color: #b45309; border-radius: 8px; padding: 6px 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; transition: 0.2s; }
.approve-btn:hover { background: rgba(217,119,6,0.18); }

.success-overlay { position: fixed; inset: 0; z-index: 99999; background: rgba(15,23,42,0.45); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; animation: overlayFade 0.3s ease; }
.success-box { width: min(400px,90vw); padding: 38px 30px; border-radius: 26px; background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(239,246,255,0.96)); border: 1px solid rgba(2,132,199,0.2); box-shadow: 0 30px 80px rgba(0,0,0,0.14); text-align: center; animation: modalPop 0.55s cubic-bezier(0.2,1.4,0.4,1); }
.success-check { width: 80px; height: 80px; margin: 0 auto 18px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg,#22c55e,#16a34a); color: white; font-size: 42px; font-weight: 900; animation: checkPulse 1.2s ease infinite; }
.success-box h2 { margin:0 0 8px; color:#111827; font-family:'Syne',sans-serif; font-size:22px; }
.success-box p { margin:0; color:rgba(20,30,70,0.6); font-family:'DM Sans',sans-serif; font-size:14px; }

.pdf-preview-overlay { position: fixed; inset: 0; z-index: 1000000; background: rgba(15,23,42,0.55); display: flex; align-items: flex-start; justify-content: center; padding: 16px 24px; animation: overlayFade 0.2s ease; }
.pdf-preview-box { width: min(900px,96vw); height: calc(100vh - 32px); background: #ffffff; border-radius: 18px; border: 1px solid rgba(0,100,220,0.1); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 40px 100px rgba(0,0,0,0.2); }
.pdf-preview-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #ffffff; border-bottom: 1px solid rgba(0,100,220,0.08); flex-shrink: 0; gap: 10px; flex-wrap: wrap; }
.pdf-preview-head span { color:rgba(20,30,70,0.72); font-family:'DM Sans',sans-serif; font-size:13px; }
.pdf-preview-head div { display:flex; gap:8px; }
.pdf-preview-head a, .pdf-preview-head button { border-radius: 9px; padding: 7px 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; text-decoration: none; }
.pdf-preview-head a { background:#0284c7; color:#fff; border:none; }
.pdf-preview-head button { background:#ef4444; color:#fff; border:none; }
.pdf-preview-frame { flex:1; width:100%; border:none; background:#fff; }

.settled-modal-overlay { position: fixed; inset: 0; z-index: 999999; background: rgba(15,23,42,0.5); backdrop-filter: blur(12px); display: flex; align-items: flex-start; justify-content: center; padding: 80px 24px 24px; animation: overlayFade 0.28s ease; }
.settled-modal { width: min(1200px,96vw); max-height: calc(100vh - 104px); background: rgba(255,255,255,0.88); border: 1px solid rgba(2,132,199,0.16); border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 40px 100px rgba(0,0,0,0.16); animation: modalPop 0.4s cubic-bezier(0.2,1.2,0.4,1); }
.settled-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; background: rgba(2,132,199,0.07); border-bottom: 1px solid rgba(0,100,220,0.08); flex-shrink: 0; flex-wrap: wrap; gap: 12px; }
.settled-modal-head h2 { margin:0; font-family:'Syne',sans-serif; color:#111827; font-size:16px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.settled-modal-head h2 span { background:rgba(217,119,6,0.14); color:#b45309; font-size:11px; padding:3px 9px; border-radius:999px; border:1px solid rgba(217,119,6,0.28); }
.settled-modal-actions { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.modal-close-btn { border:1px solid rgba(239,68,68,0.25); background:rgba(239,68,68,0.08); color:#dc2626; border-radius:10px; padding:8px 14px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; transition:0.2s; }
.modal-close-btn:hover { background:rgba(239,68,68,0.16); }
.settled-modal-body { overflow-y:auto; padding:22px; flex:1; }

.settled-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
.settled-tab { border:1px solid rgba(0,100,220,0.12); background:rgba(0,100,220,0.04); color:rgba(20,30,70,0.52); border-radius:10px; padding:7px 14px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; transition:0.2s; }
.settled-tab.active { border-color:rgba(217,119,6,0.4); background:rgba(217,119,6,0.09); color:#b45309; }
.settled-summary { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
.settled-summary-card { background:rgba(255,255,255,0.7); border:1px solid rgba(0,100,220,0.08); border-radius:14px; padding:14px 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.settled-summary-card p { margin:0 0 4px; font-family:'DM Sans',sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:0.9px; color:rgba(20,30,70,0.4); }
.settled-summary-card h4 { margin:0; font-family:'Syne',sans-serif; font-size:18px; color:#111827; }
.settled-summary-card h4.green { color:#16a34a; }
.settled-summary-card h4.yellow { color:#b45309; }
.bills-table-wrap { overflow-x:auto; border-radius:14px; border:1px solid rgba(0,100,220,0.08); }
.bills-table { width:100%; border-collapse:collapse; min-width:800px; }
.bills-table th { background:rgba(0,100,220,0.04); color:rgba(20,30,70,0.4); font-family:'Syne',sans-serif; font-size:10px; text-transform:uppercase; letter-spacing:1px; padding:12px 14px; text-align:left; white-space:nowrap; }
.bills-table td { padding:12px 14px; color:rgba(20,30,70,0.72); font-family:'DM Sans',sans-serif; font-size:13px; border-bottom:1px solid rgba(0,100,220,0.06); white-space:nowrap; }
.bills-table tr:last-child td { border-bottom:none; }
.bills-table tr:hover td { background:rgba(2,132,199,0.035); }
.bill-action-group { display:flex; gap:5px; }
.preview-bill-btn { border:1px solid rgba(2,132,199,0.25); background:rgba(2,132,199,0.07); color:#0284c7; border-radius:7px; padding:5px 9px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; transition:0.2s; }
.preview-bill-btn:hover { background:rgba(2,132,199,0.16); }
.download-bill-btn { border:1px solid rgba(34,197,94,0.25); background:rgba(34,197,94,0.07); color:#16a34a; border-radius:7px; padding:5px 9px; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; transition:0.2s; text-decoration:none; display:inline-flex; align-items:center; }
.download-bill-btn:hover { background:rgba(34,197,94,0.16); }
.empty-bills { text-align:center; padding:40px 24px; color:rgba(20,30,70,0.35); font-family:'DM Sans',sans-serif; font-size:14px; }
.empty-bills .empty-icon { font-size:36px; margin-bottom:10px; }

/* SSC styles */
.ssc-page { padding: 24px; background: #f4f6f8; border-radius: 16px; box-sizing: border-box; animation: slideIn 0.35s ease; }
.ssc-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.ssc-header h2 { margin: 0; font-size: 24px; color: #1f2937; font-weight: 600; font-family: sans-serif; }
.ssc-breadcrumb { font-size: 13px; color: #6b7280; font-family: sans-serif; }
.ssc-bc-link { color: #0284c7; cursor: pointer; font-weight: 500; }
.ssc-table-card { background: #ffffff; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 16px; }
.ssc-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ssc-table thead tr, .ssc-table tfoot tr { background: #2e7d32; color: #ffffff; }
.ssc-table th { padding: 13px 14px; text-align: left; font-weight: 600; white-space: nowrap; font-family: sans-serif; }
.ssc-table td { padding: 11px 14px; border-bottom: 1px solid #e5e7eb; color: #374151; font-family: sans-serif; }
.ssc-table tbody tr:hover { background: #f3f4f6; }
.ssc-amount { text-align: right; color: #15803d !important; font-weight: 700; }
.ssc-actions { display: flex; gap: 6px; }
.ssc-action-btn { border: none; background: transparent; cursor: pointer; font-size: 15px; padding: 4px 7px; border-radius: 5px; transition: background 0.15s ease; }
.ssc-action-btn:hover { background: #e5e7eb; }
.ssc-edit { color: #f97316; background: #fff3ed !important; border-radius: 6px !important; }
.ssc-view { color: #0284c7; background: #e0f2fe !important; border-radius: 6px !important; }
.ssc-redo { color: #ef4444; background: #fee2e2 !important; border-radius: 6px !important; font-size: 18px; }
.ssc-list-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 12px; }
.ssc-pagination { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.ssc-pagination button { border: 1px solid #d1d5db; background: #ffffff; padding: 6px 11px; cursor: pointer; border-radius: 5px; font-size: 12px; color: #000000; transition: all 0.15s ease; }
.ssc-pagination button:hover { background: #f3f4f6; }
.ssc-pagination span { color: #6b7280; }
.ssc-btn { padding: 9px 22px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; font-family: sans-serif; }
.ssc-btn:hover { transform: translateY(-1px); opacity: 0.9; }
.ssc-btn-new, .ssc-btn-primary { background: #00acc1; color: #ffffff; }
.ssc-btn-find { background: #388e3c; color: #ffffff; }
.ssc-btn-back { background: #e53935; color: #ffffff; border: none; }
.ssc-btn-outline { background: #ffffff; color: #374151; border: 1px solid #d1d5db; }
.ssc-btn-outline:hover { background: #f3f4f6; }
.ssc-form-card { background: #ffffff; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); padding: 24px; margin-bottom: 16px; border: none; }
.ssc-form-subtitle { color: #6b7280; font-size: 13px; margin-bottom: 16px; font-family: sans-serif; }
.ssc-find-row { display: flex; align-items: flex-end; gap: 16px; margin-bottom: 4px; flex-wrap: wrap; }
.ssc-field { display: flex; flex-direction: column; gap: 6px; min-width: 260px; }
.ssc-field label { font-size: 13px; font-weight: 600; color: #374151; font-family: sans-serif; text-transform: none; letter-spacing: normal; }
.ssc-info-block { font-size: 13px; line-height: 1.8; color: #374151; }
.ssc-rows-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
.ssc-rows-table th { background: #2e7d32; color: #ffffff; padding: 11px 12px; font-size: 13px; text-align: left; white-space: nowrap; font-family: sans-serif; }
.ssc-rows-table-new th { background: #f9fafb !important; color: #1976d2 !important; font-weight: 600; border: 1px solid #e5e7eb; }
.ssc-rows-table td { border: 1px solid #e5e7eb; padding: 7px 8px; }
.ssc-input { width: 100%; border: 1px solid #d1d5db; border-radius: 5px; padding: 8px 9px; font-size: 14px; outline: none; box-sizing: border-box; color: #111827; background: #ffffff; transition: all 0.15s ease; }
.ssc-input:focus { border-color: #00acc1; box-shadow: 0 0 0 3px rgba(0,172,193,0.15); }
.ssc-ss-wrap { position: relative; min-width: 260px; }
.ssc-ss-trigger { display: flex; align-items: center; justify-content: space-between; border: 1px solid #d1d5db; border-radius: 6px; padding: 9px 11px; font-size: 14px; cursor: pointer; background: #ffffff; min-height: 38px; color: #111827; }
.ssc-ss-trigger:hover { border-color: #00acc1; }
.ssc-placeholder { color: #9ca3af; }
.ssc-ss-dropdown { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; box-shadow: 0 8px 22px rgba(0,0,0,0.15); z-index: 1000; max-height: 220px; overflow-y: auto; }
.ssc-ss-search { display: block; width: 100%; padding: 9px 11px; border: none; border-bottom: 1px solid #e5e7eb; font-size: 14px; outline: none; box-sizing: border-box; }
.ssc-ss-option { padding: 10px 12px; font-size: 14px; cursor: pointer; color: #374151; }
.ssc-ss-option:hover { background: #f3f4f6; }
.ssc-ss-selected { background: #00acc1 !important; color: #ffffff !important; }
.ssc-row-actions { display: flex; gap: 8px; margin-top: 10px; }
.ssc-form-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.ssc-report-actions { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.ssc-report-preview { background: #ffffff; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); overflow: hidden; }
.ssc-iframe { width: 100%; height: 85vh; border: none; background: #fff; }

.dummy-form-grid { display:grid; gap:16px; margin-top:4px; }
.dummy-form-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.dummy-form-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
.dummy-field { display:flex; flex-direction:column; gap:6px; }
.dummy-field label { font-family:'Syne',sans-serif; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(20,30,70,0.42); }
.dummy-note { background:rgba(217,119,6,0.06); border:1px solid rgba(217,119,6,0.18); border-radius:12px; padding:12px 16px; margin-top:8px; font-family:'DM Sans',sans-serif; font-size:13px; color:#b45309; }
`;

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: "ZBA001",
    title: "AI Based Research Project",
    pi: "Dr. Kumar",
    piDesignation: "Associate Professor",
    department: "IT",
    departmentFull: "Department of Information Technology",
    campus: "CEG Campus",
    sanctionedAmount: 500000,
    scheme: "CMRG",
    projectNo: "CMRG2023IT04001",
    csrcProcNo: "4717/CSRC-2/TNPFTS/2024",
    csrcProcDate: "05.12.2024",
    budgetAllotment: 500000,
    amountIncurredSoFar: 120000,
    equipment: ["High Performance GPU Server", "Deep Learning Workstation", "Network Switch"],
  },
  {
    id: "ZBA002",
    title: "IoT Smart Monitoring System",
    pi: "Dr. Priya",
    piDesignation: "Professor",
    department: "CSE",
    departmentFull: "Department of Computer Science and Engineering",
    campus: "CEG Campus",
    sanctionedAmount: 350000,
    scheme: "SERB",
    projectNo: "SERB2023CSE04002",
    csrcProcNo: "4800/CSRC-2/TNPFTS/2024",
    csrcProcDate: "10.01.2025",
    budgetAllotment: 350000,
    amountIncurredSoFar: 80000,
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

/* ═══════════════════════════════════════════════════════════════════
   COVER PAGE GENERATOR — "REQUEST FOR CLAIM IN PROJECT FUND"
   Generates a cover page that looks like the manpower page but
   adapted for each head type.
═══════════════════════════════════════════════════════════════════ */

/* ── Shared header / footer HTML used by ALL cover pages ── */
function coverPageShell({ headingLine, subLine, dateStr, projectRows, piRows, claimantSectionTitle, claimantRows, certBlock, sigBlock, officeBlock }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Claim Cover Page</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:11px;background:#f0f0f0;color:#000;padding:24px 0;}
.page{width:210mm;min-height:297mm;padding:16mm 18mm 16mm 18mm;page-break-after:always;
  position:relative;background:#fff;margin:0 auto 24px auto;
  box-shadow:0 2px 12px rgba(0,0,0,0.15);}
.page:last-child{page-break-after:avoid;margin-bottom:0;}
@media print{body{background:#fff;padding:0;}.page{box-shadow:none;margin:0;}.print-btn{display:none;}}
.print-btn{position:fixed;top:10px;right:10px;padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999;}

h3{font-size:12px;text-align:center;font-weight:bold;margin:2px 0;}
.date-right{text-align:right;margin:8px 0 6px;font-size:11px;}
.date-right strong{font-size:11px;}

/* Main table */
table.main-tbl{width:100%;border-collapse:collapse;margin:10px 0;}
table.main-tbl,table.main-tbl th,table.main-tbl td{border:1px solid #000;}
table.main-tbl th{padding:5px 8px;font-weight:bold;text-align:left;font-size:11px;}
table.main-tbl td{padding:5px 8px;font-size:11px;vertical-align:top;}
table.main-tbl td:first-child{width:38%;white-space:nowrap;}
.section-label{background:#d0d0d0 !important;font-weight:bold !important;text-align:center !important;}
.bold{font-weight:bold;}
.center{text-align:center;}
.right{text-align:right;}

/* Cert text */
.cert-text{font-size:10px;margin:10px 0;line-height:1.6;}
.cert-text.indent{text-indent:0;}

/* Sig area */
.sig-area{display:flex;justify-content:space-between;margin-top:30px;}
.sig-box{text-align:center;width:42%;}
.sig-box .sig-role{font-size:11px;}
.sig-box .sig-bold{font-weight:bold;font-size:11px;}

/* Office box */
.office-box{border:1px solid #000;margin-top:18px;padding:8px 10px;}
.office-title{text-align:center;font-weight:bold;font-size:11px;margin-bottom:6px;}
.office-cols{display:flex;gap:30px;}
.office-col{flex:1;font-size:10.5px;line-height:1.8;}
.underline{display:inline-block;border-bottom:1px solid #000;min-width:80px;}
.sig-row-office{display:flex;justify-content:space-between;margin-top:20px;font-weight:bold;font-size:10.5px;}
</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
  <h3>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h3>
  <h3>ANNA UNIVERSITY, CHENNAI 600 025</h3>
  <h3>${headingLine}</h3>
  ${subLine ? `<h3>${subLine}</h3>` : ""}
  <div class="date-right">Date: <strong>${dateStr}</strong></div>

  <table class="main-tbl">
    <tr><th colspan="2" class="section-label">PROJECT DETAILS</th></tr>
    ${projectRows}
    <tr><th colspan="2" class="section-label">PI DETAILS</th></tr>
    ${piRows}
    <tr><th colspan="2" class="section-label">${claimantSectionTitle}</th></tr>
    ${claimantRows}
  </table>

  ${certBlock}
  ${sigBlock}
  ${officeBlock}
</div>
</body></html>`;
}

/* ── Common project + PI rows (same for all heads) ── */
function buildProjectRows(project, expHead, procNo, period) {
  return `
    <tr><td>Project Title</td><td>${project.title}</td></tr>
    <tr><td>Funding Agency / Scheme</td><td>${project.scheme}</td></tr>
    <tr><td>Project Period</td><td>${period || "As per sanction order"}</td></tr>
    <tr><td>CSRC Procs. No. &amp; Date</td><td>${project.csrcProcNo}, dated ${project.csrcProcDate}</td></tr>
    <tr><td>Project No.</td><td>${project.projectNo}</td></tr>
    <tr><td>Exp. Head</td><td>${expHead}</td></tr>
    <tr><td>Department &amp; Campus</td><td>${project.departmentFull}, ${project.campus}</td></tr>
  `;
}

function buildPIRows(project) {
  return `
    <tr><td>Name</td><td>${project.pi}, ${project.piDesignation}</td></tr>
    <tr><td>Department</td><td>${project.departmentFull}, ${project.campus}, Anna University</td></tr>
  `;
}

/* Standard sig + office blocks */
const STD_SIG_BLOCK = `
  <div class="sig-area">
    <div class="sig-box"><div class="sig-role">SIGNATURE OF</div><div class="sig-bold">THE PRINCIPAL INVESTIGATOR</div></div>
    <div class="sig-box"><div class="sig-bold">PROFESSOR AND HEAD/DEAN</div></div>
  </div>`;

const STD_OFFICE_BLOCK = `
  <div class="office-box">
    <div class="office-title">FOR CTDT OFFICE ONLY</div>
    <div class="office-cols">
      <div class="office-col">
        <div>Entered in Appropriation Register</div>
        <div>Folio No. <span class="underline">&nbsp;&nbsp;&nbsp;</span> Year 20&nbsp;-20&nbsp;</div>
        <div style="margin-top:4px">Passed for and Pay Rs. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
        <div>Rupees <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
      </div>
      <div class="office-col">
        <div>Voucher No.</div>
        <div>Paid</div>
        <div>Cheque No. <span class="underline">&nbsp;&nbsp;&nbsp;</span>/Neft. Dt.</div>
        <div>Dated <span class="underline">&nbsp;&nbsp;&nbsp;</span> for Rs. <span class="underline">&nbsp;&nbsp;&nbsp;</span></div>
      </div>
    </div>
    <div class="sig-row-office"><span>ASST.&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;DIRECTOR</span><span>ASST.&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;DIRECTOR</span></div>
  </div>`;

/* ════════════════════════════════════
   COVER PAGE: MANPOWER
════════════════════════════════════ */
function generateManpowerCoverPage(claim, staff, project) {
  const td = todayDMY();
  const totalClaim = claim.rows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, staff.salaryPerMonth, r.cl, r.lop), 0);

  const projectRows = buildProjectRows(
    project,
    staff.expHead,
    staff.procNo,
    staff.projectPeriod
  );
  const piRows = buildPIRows(project);

  const claimantRows = `
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
  `;

  const certBlock = `
    <p class="cert-text">Certified that the claim made in this bill was not drawn by me earlier, if any excess claim is noticed later, I will refund it and also Certified that I am not occupying the hostel room.</p>
    <div style="text-align:right;margin-top:18px;font-size:11px;">Stamped Acquittance with Signature</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR SALARY CLAIM IN PROJECT FUND",
    subLine: `FOR THE PERIOD FROM ${claim.salaryFrom} TO ${claim.salaryTo}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "CLAIMANT DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ════════════════════════════════════
   COVER PAGE: CONSUMABLES
════════════════════════════════════ */
function generateConsumablesCoverPage(formData, project) {
  const td = todayDMY();
  const amount = Number(formData.amount || 0);
  const expHead = `Recurring – Consumables & Accessories`;

  const projectRows = buildProjectRows(project, expHead, project.csrcProcNo, "As per sanction order");
  const piRows = buildPIRows(project);

  const claimantRows = `
    <tr><td>Proceeding No.</td><td>${formData.proceedingNo || "—"}</td></tr>
    <tr><td>Division / Lab</td><td>${formData.divisionLabel || "—"}</td></tr>
    <tr><td>Item / Material</td><td>${formData.itemDescription || "Consumables & Accessories"}</td></tr>
    <tr><td>Vendor Name (M/s.)</td><td>${formData.vendorName || "—"}</td></tr>
    <tr><td>Vendor Address</td><td>${formData.vendorAddress || "—"} ${formData.vendorCity ? "– " + formData.vendorCity : ""}</td></tr>
    <tr><td>Financial Year</td><td>${formData.financialYear || "—"}</td></tr>
    <tr><td>M.H. No.</td><td>${formData.mhNo || "—"}</td></tr>
    <tr><td>Sanctioning Authority</td><td>${formData.sanctioningAuthority || "—"}</td></tr>
    <tr><td>Sanction Reg. Page No. / Sl. No.</td><td>${formData.sanctionPageNo || "—"} / ${formData.sanctionSlNo || "—"}</td></tr>
    <tr><td>Amount Claimed</td><td class="bold">Rs.${fmtAmt(amount)}/- (Rupees ${toIndianWords(amount)})</td></tr>
  `;

  const certBlock = `
    <p class="cert-text">Certified that the claim made in this bill is in order and the items purchased are required for the project work. The expenditure is within the sanctioned budget.</p>
    <div style="text-align:right;margin-top:18px;font-size:11px;">Signature of the Claimant / PI</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR CONSUMABLES CLAIM IN PROJECT FUND",
    subLine: `FOR THE PURCHASE OF ${(formData.itemDescription || "CONSUMABLES").toUpperCase()}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "EXPENDITURE DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ════════════════════════════════════
   COVER PAGE: TRAVEL
════════════════════════════════════ */
function generateTravelCoverPage(formData, project) {
  const td = todayDMY();
  const amount = Number(formData.amount || 0);
  const expHead = `Recurring – Travel (TA/DA)`;

  const projectRows = buildProjectRows(project, expHead, project.csrcProcNo, "As per sanction order");
  const piRows = buildPIRows(project);

  const totalKm = (formData.startKm && formData.endKm)
    ? `${Number(formData.endKm) - Number(formData.startKm)} Km`
    : "—";

  const claimantRows = `
    <tr><td>Proceeding No.</td><td>${formData.proceedingNo || "—"}</td></tr>
    <tr><td>Division / Lab</td><td>${formData.divisionLabel || "—"}</td></tr>
    <tr><td>Payee Name</td><td>${formData.payeeName || "—"}</td></tr>
    <tr><td>Mode of Travel</td><td>${formData.modeOfTravel || "—"}${formData.vehicleNo ? ` (${formData.vehicleNo})` : ""}</td></tr>
    <tr><td>Travel Date</td><td>${formData.travelDate || "—"}${formData.duration ? ` (${formData.duration})` : ""}</td></tr>
    <tr><td>From</td><td>${formData.fromPlace || "—"}</td></tr>
    <tr><td>To (Destination)</td><td>${formData.toPlace || "—"}</td></tr>
    <tr><td>Purpose of Travel</td><td>${formData.purpose || "—"}</td></tr>
    <tr><td>Odometer Reading</td><td>Start: ${formData.startKm || "—"} &nbsp;|&nbsp; End: ${formData.endKm || "—"} &nbsp;|&nbsp; Total: ${totalKm}</td></tr>
    <tr><td>Head of Account</td><td>${formData.headOfAccount || "Travel"}</td></tr>
    <tr><td>Financial Year</td><td>${formData.financialYear || "—"}</td></tr>
    <tr><td>Sanction Reg. Page No. / Sl. No.</td><td>${formData.sanctionPageNo || "—"} / ${formData.sanctionSlNo || "—"}</td></tr>
    <tr><td>Total Amount Claimed</td><td class="bold">Rs.${fmtAmt(amount)}/- (Rupees ${toIndianWords(amount)})</td></tr>
  `;

  const certBlock = `
    <p class="cert-text">Certified that the travel was undertaken for official project work and the amount claimed is correct. The travel was necessary for the successful completion of the project.</p>
    ${formData.startKm && formData.endKm ? `<p class="cert-text">Starting reading: ${formData.startKm} &nbsp;&nbsp; Closing reading: ${formData.endKm} &nbsp;&nbsp; Total: ${totalKm}</p>` : ""}
    <div style="text-align:right;margin-top:18px;font-size:11px;">Signature of the Traveller / PI</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR TRAVEL CLAIM IN PROJECT FUND",
    subLine: `JOURNEY FROM ${(formData.fromPlace || "—").toUpperCase()} TO ${(formData.toPlace || "—").toUpperCase()} ON ${formData.travelDate || "—"}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "TRAVEL DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ════════════════════════════════════
   COVER PAGE: CONTINGENCY
════════════════════════════════════ */
function generateContingencyCoverPage(formData, project) {
  const td = todayDMY();
  const amount = Number(formData.amount || 0);
  const expHead = `Recurring – Contingency`;

  const projectRows = buildProjectRows(project, expHead, project.csrcProcNo, "As per sanction order");
  const piRows = buildPIRows(project);

  const claimantRows = `
    <tr><td>Proceeding No.</td><td>${formData.proceedingNo || "—"}</td></tr>
    <tr><td>Division / Lab</td><td>${formData.divisionLabel || "—"}</td></tr>
    <tr><td>Item / Description</td><td>${formData.itemDescription || "Contingency items"}</td></tr>
    <tr><td>Sanctioning Authority</td><td>${formData.sanctioningAuthority || "—"}</td></tr>
    <tr><td>M.H. No.</td><td>${formData.mhNo || "—"}</td></tr>
    <tr><td>Financial Year</td><td>${formData.financialYear || "—"}</td></tr>
    <tr><td>Sanction Reg. Page No. / Sl. No.</td><td>${formData.sanctionPageNo || "—"} / ${formData.sanctionSlNo || "—"}</td></tr>
    <tr><td>Amount Claimed</td><td class="bold">Rs.${fmtAmt(amount)}/- (Rupees ${toIndianWords(amount)})</td></tr>
  `;

  const certBlock = `
    <p class="cert-text">Certified that the claim made in this bill is in order and the items/services are required for the project work. The expenditure is within the sanctioned budget for Contingency head.</p>
    <div style="text-align:right;margin-top:18px;font-size:11px;">Signature of the Claimant / PI</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR CONTINGENCY CLAIM IN PROJECT FUND",
    subLine: `FOR ${(formData.itemDescription || "CONTINGENCY ITEMS").toUpperCase()}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "EXPENDITURE DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ════════════════════════════════════
   COVER PAGE: OTHER EXPENSES
════════════════════════════════════ */
function generateOtherExpensesCoverPage(formData, project) {
  const td = todayDMY();
  const amount = Number(formData.amount || 0);
  const expHead = `Recurring – Other Expenses`;

  const projectRows = buildProjectRows(project, expHead, project.csrcProcNo, "As per sanction order");
  const piRows = buildPIRows(project);

  const claimantRows = `
    <tr><td>Proceeding No.</td><td>${formData.proceedingNo || "—"}</td></tr>
    <tr><td>Division / Lab</td><td>${formData.divisionLabel || "—"}</td></tr>
    <tr><td>Purchase of (What?)</td><td>${formData.purchaseOf || "—"}</td></tr>
    <tr><td>Vendor / Payee (M/s.)</td><td>${formData.vendorName || "—"}${formData.vendorCity ? " – " + formData.vendorCity : ""}</td></tr>
    <tr><td>Sanctioning Authority</td><td>${formData.sanctioningAuthority || "—"}</td></tr>
    <tr><td>M.H. No.</td><td>${formData.mhNo || "—"}</td></tr>
    <tr><td>Financial Year</td><td>${formData.financialYear || "—"}</td></tr>
    <tr><td>Sanction Reg. Page No. / Sl. No.</td><td>${formData.sanctionPageNo || "—"} / ${formData.sanctionSlNo || "—"}</td></tr>
    <tr><td>Amount Claimed</td><td class="bold">Rs.${fmtAmt(amount)}/- (Rupees ${toIndianWords(amount)})</td></tr>
  `;

  const certBlock = `
    <p class="cert-text">Certified that the claim made in this bill is in order and the expenditure is necessary for the project work. The amount is within the sanctioned budget for Other Expenses head.</p>
    <div style="text-align:right;margin-top:18px;font-size:11px;">Signature of the Claimant / PI</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR OTHER EXPENSES CLAIM IN PROJECT FUND",
    subLine: `FOR ${(formData.purchaseOf || "OTHER EXPENSES").toUpperCase()}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "EXPENDITURE DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ════════════════════════════════════
   COVER PAGE: NON-RECURRING (EQUIPMENT)
════════════════════════════════════ */
function generateNonRecurringCoverPage(formData, project) {
  const td = todayDMY();
  const amount = Number(formData.amount || 0);
  const expHead = `Non-Recurring – Equipment / Instrument`;

  const projectRows = buildProjectRows(project, expHead, project.csrcProcNo, "As per sanction order");
  const piRows = buildPIRows(project);

  const claimantRows = `
    <tr><td>Proceeding No. (Proc.No.)</td><td>${formData.proceedingNo || "—"}</td></tr>
    <tr><td>HOD Name</td><td>${formData.hodName || "—"}</td></tr>
    <tr><td>Division / Lab</td><td>${formData.divisionLabel || "—"}</td></tr>
    <tr><td>Equipment Name</td><td>${formData.equipmentName || "—"}</td></tr>
    <tr><td>Vendor / Supplier (M/s.)</td><td>${formData.vendorName || "—"}</td></tr>
    <tr><td>Sanctioning Authority</td><td>${formData.sanctioningAuthority || "—"}</td></tr>
    <tr><td>M.H. No.</td><td>${formData.mhNo || "—"}</td></tr>
    <tr><td>Financial Year</td><td>${formData.financialYear || "—"}</td></tr>
    <tr><td>Sanction Reg. Page No. / Sl. No.</td><td>${formData.sanctionPageNo || "—"} / ${formData.sanctionSlNo || "—"}</td></tr>
    <tr><td>Amount Claimed</td><td class="bold">Rs.${fmtAmt(amount)}/- (Rupees ${toIndianWords(amount)})</td></tr>
  `;

  const certBlock = `
    <p class="cert-text">Certified that the claim made in this bill is in order. The equipment purchased is required for the project work and has been entered in the stock register. The expenditure is within the sanctioned Non-Recurring budget.</p>
    <div style="text-align:right;margin-top:18px;font-size:11px;">Signature of the PI</div>
    <p class="cert-text" style="margin-top:28px;">Certified that the claim is in order and may be admitted.</p>
  `;

  return coverPageShell({
    headingLine: "REQUEST FOR EQUIPMENT CLAIM IN PROJECT FUND",
    subLine: `FOR PROCUREMENT OF ${(formData.equipmentName || "EQUIPMENT").toUpperCase()}`,
    dateStr: td,
    projectRows,
    piRows,
    claimantSectionTitle: "PROCUREMENT DETAILS",
    claimantRows,
    certBlock,
    sigBlock: STD_SIG_BLOCK,
    officeBlock: STD_OFFICE_BLOCK,
  });
}

/* ═══════════════════════════════════════════════════════════════════
   COMBINED HTML: Cover page + Proceedings page
   Wraps both HTML documents' <body> content into a single document
   so they print as consecutive pages.
═══════════════════════════════════════════════════════════════════ */
function combineCoverAndProceedings(coverHTML, proceedingsHTML) {
  // Extract body content from the proceedings HTML
  const bodyMatch = proceedingsHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const procBody = bodyMatch ? bodyMatch[1] : proceedingsHTML;

  // Remove print button from proceedings body since cover already has one
  const cleanProcBody = procBody.replace(/<button[^>]*print-btn[^>]*>.*?<\/button>/gi, "");

  // Extract styles from proceedings
  const styleMatch = proceedingsHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const procStyles = styleMatch ? styleMatch.join("\n") : "";

  // Extract body content from cover HTML
  const coverBodyMatch = coverHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const coverBody = coverBodyMatch ? coverBodyMatch[1] : coverHTML;
  const cleanCoverBody = coverBody.replace(/<button[^>]*print-btn[^>]*>.*?<\/button>/gi, "");

  // Extract styles from cover
  const coverStyleMatch = coverHTML.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const coverStyles = coverStyleMatch ? coverStyleMatch.join("\n") : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Claim Report</title>
${coverStyles}
${procStyles}
<style>
@media print { .print-btn { display: none !important; } }
.print-btn { position:fixed;top:10px;right:10px;padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999; }
</style>
</head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
${cleanCoverBody}
${cleanProcBody}
</body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════
   EXISTING PDF GENERATORS (unchanged — kept as-is)
═══════════════════════════════════════════════════════════════════ */
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

  // Pages 2 & 3 of the manpower report (leave particulars + sanction)
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Salary Claim Pages 2-3</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:11px;background:#f0f0f0;color:#000;margin:0;padding:24px 0;}
.page{width:210mm;min-height:297mm;padding:18mm 20mm;page-break-after:always;position:relative;background:#fff;margin:0 auto 24px auto;box-shadow:0 2px 12px rgba(0,0,0,0.15);}
.page:last-child{page-break-after:avoid;margin-bottom:0;}
@media print{body{background:#fff;padding:0;}.page{box-shadow:none;margin:0;}}
h3{font-size:12px;text-align:center;font-weight:bold;}h4{font-size:11px;text-align:center;font-weight:bold;}
table{width:100%;border-collapse:collapse;margin:10px 0;}table,th,td{border:1px solid #000;}th,td{padding:4px 8px;}
th{background:#f0f0f0;font-weight:bold;}.center{text-align:center;}.right{text-align:right;}.bold{font-weight:bold;}
.section-label{background:#e0e0e0;font-weight:bold;}.no-border td,.no-border th{border:none;}
.sig-area{display:flex;justify-content:space-between;margin-top:40px;}.sig-box{text-align:center;width:40%;}
.office-section{border:1px solid #000;margin-top:20px;padding:10px;}.office-row{display:flex;gap:40px;}
.office-col{flex:1;}.underline{display:inline-block;border-bottom:1px solid #000;min-width:100px;}
.cert-text{font-size:10px;margin:12px 0;}.sig-row{display:flex;justify-content:space-between;margin-top:30px;font-weight:bold;}
</style></head><body>
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
</style></head><body>
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
      <td>${claim.equipment || claim.equipmentName || "—"}</td>
      <td>${claim.vendor || claim.vendorName || "—"}</td>
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

function generateConsumablesPDF(formData, project) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  const balance = project.budgetAllotment - (project.amountIncurredSoFar + Number(formData.amount));
  const amountIncludingThis = project.amountIncurredSoFar + Number(formData.amount);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Consumables Proceedings</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:18px;background:#fff;color:#000;padding:0;}
.page{width:210mm;min-height:297mm;padding:22mm 22mm 22mm 22mm;background:#fff;}
@media print{.print-btn{display:none;}}
.hdr-wrap{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.hdr-logo{width:80px;height:80px;flex-shrink:0;}
.hdr-text{text-align:center;flex:1;}
.hdr-text .dept{font-size:16px;font-weight:bold;}
.hdr-text .college{font-size:16px;font-weight:bold;}
.hdr-text .univ{font-size:16px;font-weight:bold;}
.meta-row{display:flex;justify-content:space-between;margin-top:4px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #000;font-size:18px;}
.proc-line{display:flex;justify-content:space-between;margin:5px 0;font-size:18px;}
.sub-ref-table{width:100%;border-collapse:collapse;margin:5px 0;}
.sub-ref-table td{padding:3px 0;vertical-align:top;font-size:18px;}
.sub-ref-table td:first-child{width:50px;font-weight:bold;}
.stars{text-align:center;margin:3px 0;font-size:13px;font-weight:bold;}
p.para{text-align:justify;line-height:1.6;margin:8px 0;font-size:18px;}
p.para.indent{text-indent:20px;}
.committed-section{width:80%;margin:10px auto;font-size:18px;}
.commit-header{display:grid;grid-template-columns:20px 1fr 180px;margin-bottom:8px;}
.committed-title{text-align:center;font-weight:bold;}
.commit-row{display:grid;grid-template-columns:20px 1fr 180px;margin:8px 0;}
.commit-amount{text-align:center;}
.sanction-reg{font-size:18px;margin:12px 0;}
.underline-box{display:inline-block;border-bottom:1px solid #000;min-width:60px;}
.hod-sig{text-align:right;font-weight:bold;font-size:15px;margin-top:45px;margin-bottom:8px;}
.to-section{font-size:18px;line-height:1.4;}
.copy-section{font-size:18px;margin-top:12px;}
</style></head><body>
<div class="page">
  <div class="hdr-wrap">
    <img class="hdr-logo" src="src/assets/anna-university-logo.png" alt="AU Logo" onerror="this.style.display='none'" />
    <div class="hdr-text">
      <div class="dept">DEPARTMENT OF ${project.departmentFull.replace("Department of","").trim().toUpperCase()}</div>
      <div class="college">COLLEGE OF ENGINEERING, GUINDY</div>
      <div class="univ">ANNA UNIVERSITY, CHENNAI – 25</div>
    </div>
  </div>
  <div class="meta-row"><strong>Professor &amp; Head</strong><span>Phone: 2235 7744</span></div>
  <div class="proc-line"><span>Proceeding No. ${formData.proceedingNo}</span><span>Date: ${td}</span></div>
  <table class="sub-ref-table">
    <tr><td>Sub:</td><td>${project.departmentFull.replace("Department of","").trim()} – ${formData.divisionLabel || "R&AC"} – ${project.scheme} - Purchase of Consumables – Sanction Accorded – Reg.</td></tr>
    <tr><td>Ref:</td><td>CSRC Proc. No: ${project.csrcProcNo} &nbsp; dated: ${project.csrcProcDate}</td></tr>
  </table>
  <div class="stars">*****</div>
  <p class="para indent">The ${formData.sanctioningAuthority || "Director of Technical Education (DoTE), Chennai"} has sanctioned a project titled "<strong>${project.title}</strong>" at a total cost of Rs.${Number(project.sanctionedAmount).toLocaleString("en-IN")}/- under ${project.scheme} Scheme – Project No. ${project.projectNo} to <strong>${project.pi}, ${project.piDesignation}</strong>, ${project.departmentFull}, ${project.campus}, Anna University, Chennai.</p>
  <p class="para indent">Sanction is hereby accorded to incur an expenditure not exceeding a sum of <strong>Rs. ${Number(formData.amount).toLocaleString("en-IN")} /- (Rupees ${toIndianWords(Number(formData.amount))})</strong> to <strong>M/s. ${formData.vendorName}</strong>, ${formData.vendorAddress} towards the purchase of ${formData.itemDescription || "chemicals"} in connection with the project work.</p>
  <p class="para" style="text-align:center;">The Payment may be made to <strong><u>M/s. ${formData.vendorName} ${formData.vendorCity ? "– " + formData.vendorCity : ""}</u></strong></p>
  <p class="para indent">The expenditure is debitable under the Head of Account "M. H. No.${formData.mhNo || "16.1.17"} – ${formData.sanctioningAuthority || "Directorate of Technical Education (DoTE), Chennai"}, Project – "<strong>${project.title}</strong>" - Recurring - Consumables for the year ${formData.financialYear || "2025 – 26"}.</p>
  <div class="committed-section">
    <div class="commit-header"><span></span><span></span><span class="committed-title">Committed</span></div>
    <div class="commit-row"><span style="font-size:22px;">•</span><span>Budget Allotment in BE/RE</span><span class="commit-amount">Rs. ${Number(project.budgetAllotment).toLocaleString("en-IN")}/-</span></div>
    <div class="commit-row"><span style="font-size:22px;">•</span><span>Amount incurred so far<br>(Including this proceeding)</span><span class="commit-amount">Rs. ${Number(amountIncludingThis).toLocaleString("en-IN")}/-</span></div>
    <div class="commit-row"><span></span><span>Balance amount available</span><span class="commit-amount">Rs. ${Number(balance).toLocaleString("en-IN")}/-</span></div>
  </div>
  <p class="sanction-reg">The sanction amount has been entered in Sanction Register Vide Page No. <span class="underline-box">&nbsp;${formData.sanctionPageNo || "______"}&nbsp;</span> &nbsp; Sl. No. <span class="underline-box">&nbsp;${formData.sanctionSlNo || "______"}&nbsp;</span> &nbsp; Vol. &nbsp;&nbsp;&nbsp; for the year ${formData.financialYear || "2025 - 26"}.</p>
  <div class="hod-sig">HOD (${project.department.toUpperCase()})</div>
  <div class="to-section"><div>To</div><div>${project.pi},</div><div>${project.piDesignation},</div><div>${formData.divisionLabel ? formData.divisionLabel + " Division," : ""}</div><div>${project.departmentFull},</div><div>Chennai – 600 025</div></div>
  <div class="copy-section">Copy to: Bill</div>
</div></body></html>`;
}

function generateOtherExpensesPDF(formData, project) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  const balance = project.budgetAllotment - (project.amountIncurredSoFar + Number(formData.amount));
  const amountIncludingThis = project.amountIncurredSoFar + Number(formData.amount);
  const purchaseOf = formData.purchaseOf || "other items";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Other Expenses Proceedings</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:18px;background:#fff;color:#000;}
.page{width:210mm;min-height:297mm;padding:22mm 22mm 22mm 22mm;background:#fff;}
@media print{.print-btn{display:none;}}
.hdr-wrap{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.hdr-logo{width:80px;height:80px;flex-shrink:0;}
.hdr-text{text-align:center;flex:1;}
.hdr-text .dept{font-size:16px;font-weight:bold;}
.hdr-text .college{font-size:16px;font-weight:bold;}
.hdr-text .univ{font-size:16px;font-weight:bold;}
.meta-row{display:flex;justify-content:space-between;margin-top:4px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #000;font-size:18px;}
.proc-line{display:flex;justify-content:space-between;margin:5px 0;font-size:18px;}
.sub-ref-table{width:100%;border-collapse:collapse;margin:5px 0;}
.sub-ref-table td{padding:3px 0;vertical-align:top;font-size:18px;}
.sub-ref-table td:first-child{width:50px;font-weight:bold;}
.stars{text-align:center;margin:3px 0;font-size:13px;font-weight:bold;}
p.para{text-align:justify;line-height:1.6;margin:8px 0;font-size:18px;}
p.para.indent{text-indent:20px;}
.committed-section{width:80%;margin:10px auto;font-size:18px;}
.commit-header{display:grid;grid-template-columns:20px 1fr 180px;margin-bottom:8px;}
.committed-title{text-align:center;font-weight:bold;}
.commit-row{display:grid;grid-template-columns:20px 1fr 180px;margin:8px 0;}
.commit-amount{text-align:center;}
.sanction-reg{font-size:18px;margin:12px 0;}
.underline-box{display:inline-block;border-bottom:1px solid #000;min-width:60px;}
.hod-sig{text-align:right;font-weight:bold;font-size:15px;margin-top:45px;margin-bottom:8px;}
.to-section{font-size:18px;line-height:1.4;}
.copy-section{font-size:18px;margin-top:12px;}
</style></head><body>
<div class="page">
  <div class="hdr-wrap"><img class="hdr-logo" src="src/assets/anna-university-logo.png" alt="AU Logo" onerror="this.style.display='none'" /><div class="hdr-text"><div class="dept">DEPARTMENT OF ${project.departmentFull.replace("Department of","").trim().toUpperCase()}</div><div class="college">COLLEGE OF ENGINEERING, GUINDY</div><div class="univ">ANNA UNIVERSITY, CHENNAI – 25</div></div></div>
  <div class="meta-row"><strong>Professor &amp; Head</strong><span>Phone: 2235 7744</span></div>
  <div class="proc-line"><span>Proceeding No. ${formData.proceedingNo}</span><span>Date: ${td}</span></div>
  <table class="sub-ref-table"><tr><td>Sub:</td><td>${project.departmentFull.replace("Department of","").trim()} – ${formData.divisionLabel || "R&AC"} – ${project.scheme} - Purchase of ${purchaseOf} – Sanction Accorded – Reg.</td></tr><tr><td>Ref:</td><td>CSRC Proc. No: ${project.csrcProcNo} &nbsp; dated: ${project.csrcProcDate}</td></tr></table>
  <div class="stars">*****</div>
  <p class="para indent">The ${formData.sanctioningAuthority || "Director of Technical Education (DoTE), Chennai"} has sanctioned a project titled "<strong>${project.title}</strong>" at a total cost of Rs.${Number(project.sanctionedAmount).toLocaleString("en-IN")}/- under ${project.scheme} Scheme – Project No. ${project.projectNo} to <strong>${project.pi}, ${project.piDesignation}</strong>, ${project.departmentFull}, ${project.campus}, Anna University, Chennai.</p>
  <p class="para indent">Sanction is hereby accorded to incur an expenditure not exceeding a sum of <strong>Rs. ${Number(formData.amount).toLocaleString("en-IN")} /- (Rupees ${toIndianWords(Number(formData.amount))})</strong> towards the purchase of ${purchaseOf} in connection with the project work.</p>
  <p class="para" style="text-align:center;">The Payment may be made to <strong><u>M/s. ${formData.vendorName || "______"} ${formData.vendorCity ? "– " + formData.vendorCity : ""}</u></strong></p>
  <p class="para indent">The expenditure is debitable under the Head of Account "M. H. No.${formData.mhNo || "16.1.17"} – ${formData.sanctioningAuthority || "Directorate of Technical Education (DoTE), Chennai"}, Project – "<strong>${project.title}</strong>" - Other Expenses for the year ${formData.financialYear || "2025 – 26"}.</p>
  <div class="committed-section"><div class="commit-header"><span></span><span></span><span class="committed-title">Committed</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Budget Allotment in BE/RE</span><span class="commit-amount">Rs. ${Number(project.budgetAllotment).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Amount incurred so far<br>(Including this proceeding)</span><span class="commit-amount">Rs. ${Number(amountIncludingThis).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span></span><span>Balance amount available</span><span class="commit-amount">Rs. ${Number(balance).toLocaleString("en-IN")}/-</span></div></div>
  <p class="sanction-reg">The sanction amount has been entered in Sanction Register Vide Page No. <span class="underline-box">&nbsp;${formData.sanctionPageNo || "______"}&nbsp;</span> &nbsp; Sl. No. <span class="underline-box">&nbsp;${formData.sanctionSlNo || "______"}&nbsp;</span> &nbsp; Vol. &nbsp;&nbsp;&nbsp; for the year ${formData.financialYear || "2025 - 26"}.</p>
  <div class="hod-sig">HOD (${project.department.toUpperCase()})</div>
  <div class="to-section"><div>To</div><div>${project.pi},</div><div>${project.piDesignation},</div><div>${formData.divisionLabel ? formData.divisionLabel + " Division," : ""}</div><div>${project.departmentFull},</div><div>Chennai – 600 025</div></div>
  <div class="copy-section">Copy to: Bill</div>
</div></body></html>`;
}

function generateTravelPDF(formData, project) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  const balance = project.budgetAllotment - (project.amountIncurredSoFar + Number(formData.amount));
  const amountIncludingThis = project.amountIncurredSoFar + Number(formData.amount);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Travel Proceedings</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:18px;background:#fff;color:#000;}
.page{width:210mm;min-height:297mm;padding:22mm 22mm 22mm 22mm;background:#fff;}
@media print{.print-btn{display:none;}}
.hdr-wrap{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.hdr-logo{width:80px;height:80px;flex-shrink:0;}
.hdr-text{text-align:center;flex:1;}
.hdr-text .dept,.hdr-text .college,.hdr-text .univ{font-size:16px;font-weight:bold;}
.meta-row{display:flex;justify-content:space-between;margin-top:4px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #000;font-size:18px;}
.proc-line{display:flex;justify-content:space-between;margin:5px 0;font-size:18px;}
.sub-ref-table{width:100%;border-collapse:collapse;margin:5px 0;}
.sub-ref-table td{padding:3px 0;vertical-align:top;font-size:18px;}
.sub-ref-table td:first-child{width:50px;font-weight:bold;}
.stars{text-align:center;margin:3px 0;font-size:13px;font-weight:bold;}
p.para{text-align:justify;line-height:1.6;margin:8px 0;font-size:18px;}
p.para.indent{text-indent:20px;}
.committed-section{width:80%;margin:10px auto;font-size:18px;}
.commit-header{display:grid;grid-template-columns:20px 1fr 180px;margin-bottom:8px;}
.committed-title{text-align:center;font-weight:bold;}
.commit-row{display:grid;grid-template-columns:20px 1fr 180px;margin:8px 0;}
.commit-amount{text-align:center;}
.underline-box{display:inline-block;border-bottom:1px solid #000;min-width:60px;}
.cert-block{font-size:18px;margin:18px 0;text-align:justify;line-height:1.6;}
.cert-title{font-weight:bold;text-decoration:underline;margin-bottom:6px;}
.hod-sig{text-align:right;font-weight:bold;font-size:15px;margin-top:45px;margin-bottom:8px;}
.to-section{font-size:18px;line-height:1.4;}
</style></head><body>
<div class="page">
  <div class="hdr-wrap"><img class="hdr-logo" src="src/assets/anna-university-logo.png" alt="AU Logo" onerror="this.style.display='none'" /><div class="hdr-text"><div class="dept">DEPARTMENT OF ${project.departmentFull.replace("Department of","").trim().toUpperCase()}</div><div class="college">COLLEGE OF ENGINEERING, GUINDY</div><div class="univ">ANNA UNIVERSITY, CHENNAI – 25</div></div></div>
  <div class="meta-row"><strong>Professor &amp; Head</strong><span>Phone: 2235 7744</span></div>
  <div class="proc-line"><span>Proceeding No. ${formData.proceedingNo}</span><span>Date: ${td}</span></div>
  <table class="sub-ref-table"><tr><td>Sub:</td><td>${project.departmentFull.replace("Department of","").trim()} – ${formData.divisionLabel || project.scheme} - Towards travelling expenses – Amount sanctioned – Reg.</td></tr><tr><td>Ref:</td><td>CSRC Proc. No: ${project.csrcProcNo} &nbsp; dated: ${project.csrcProcDate}</td></tr></table>
  <div class="stars">*****</div>
  <p class="para indent">Sanction is hereby accorded for an amount of <strong>Rs.${Number(formData.amount).toLocaleString("en-IN")}/- (Rupees ${toIndianWords(Number(formData.amount))})</strong> towards travelling allowance by ${formData.modeOfTravel || "own car"}${formData.vehicleNo ? ` (No.${formData.vehicleNo})` : ""} and DA charges on <strong>${formData.travelDate}${formData.duration ? ` (${formData.duration})` : ""}</strong> from <strong>${formData.fromPlace || "Chennai"}</strong> to <strong>${formData.toPlace}</strong> and return back to ${formData.fromPlace || "Chennai"} in connection with ${formData.purpose || "field work"} under ${project.scheme} project no.${project.projectNo} entitled "<strong>${project.title}</strong>".</p>
  <p class="para indent">The Neft transfer made in favour of "<strong>${formData.payeeName}</strong>".</p>
  <p class="para indent">Necessary entries have been made in the Sanction register vide Page no. <span style="border-bottom:1px solid #000;display:inline-block;min-width:40px;">&nbsp;${formData.sanctionPageNo || ""}&nbsp;</span> Sl no. <span style="border-bottom:1px solid #000;display:inline-block;min-width:40px;">&nbsp;${formData.sanctionSlNo || ""}&nbsp;</span></p>
  <p class="para indent">This expenditure is debitable under the Head of Account – "<strong>${formData.headOfAccount || "Travel"}</strong>".</p>
  <div class="committed-section"><div class="commit-header"><span></span><span></span><span class="committed-title">Committed</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Budget Allotment in BE/RE</span><span class="commit-amount">Rs. ${Number(project.budgetAllotment).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Amount incurred so far<br>(Including this proceeding)</span><span class="commit-amount">Rs. ${Number(amountIncludingThis).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span></span><span>Balance amount available</span><span class="commit-amount">Rs. ${Number(balance).toLocaleString("en-IN")}/-</span></div></div>
  <div class="hod-sig">DIRECTOR<br/>Centre for Sponsored Research and Consultancy<br/>Anna University, Chennai – 600 025.</div>
  <div class="to-section"><div>To</div><div>The Bill</div></div>
  <div class="cert-block"><div class="cert-title">Certificate</div>It is certified that the amount paid towards travelling allowance by ${formData.modeOfTravel || "own car"} and DA charges in connection with ${formData.purpose || "field work"} under ${project.scheme} project.${formData.startKm && formData.endKm ? `<br/>Starting reading: ${formData.startKm} &nbsp;&nbsp; Closing reading: ${formData.endKm} &nbsp;&nbsp; Total: <strong>${Number(formData.endKm) - Number(formData.startKm)} Km.</strong>` : ""}</div>
  <div class="hod-sig">DIRECTOR<br/>Centre for Sponsored Research and Consultancy<br/>Anna University, Chennai – 600 025.</div>
</div></body></html>`;
}

function generateContingencyPDF(formData, project) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  const balance = project.budgetAllotment - (project.amountIncurredSoFar + Number(formData.amount));
  const amountIncludingThis = project.amountIncurredSoFar + Number(formData.amount);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Contingency Proceedings</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:18px;background:#fff;color:#000;}
.page{width:210mm;min-height:297mm;padding:22mm 22mm 22mm 22mm;background:#fff;}
@media print{.print-btn{display:none;}}
.hdr-wrap{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.hdr-logo{width:80px;height:80px;flex-shrink:0;}
.hdr-text{text-align:center;flex:1;}
.hdr-text .dept,.hdr-text .college,.hdr-text .univ{font-size:16px;font-weight:bold;}
.meta-row{display:flex;justify-content:space-between;margin-top:4px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #000;font-size:18px;}
.proc-line{display:flex;justify-content:space-between;margin:5px 0;font-size:18px;}
.sub-ref-table{width:100%;border-collapse:collapse;margin:5px 0;}
.sub-ref-table td{padding:3px 0;vertical-align:top;font-size:18px;}
.sub-ref-table td:first-child{width:50px;font-weight:bold;}
.stars{text-align:center;margin:3px 0;font-size:13px;font-weight:bold;}
p.para{text-align:justify;line-height:1.6;margin:8px 0;font-size:18px;}
p.para.indent{text-indent:20px;}
.committed-section{width:80%;margin:10px auto;font-size:18px;}
.commit-header{display:grid;grid-template-columns:20px 1fr 180px;margin-bottom:8px;}
.committed-title{text-align:center;font-weight:bold;}
.commit-row{display:grid;grid-template-columns:20px 1fr 180px;margin:8px 0;}
.commit-amount{text-align:center;}
.underline-box{display:inline-block;border-bottom:1px solid #000;min-width:60px;}
.hod-sig{text-align:right;font-weight:bold;font-size:15px;margin-top:45px;margin-bottom:8px;}
.to-section{font-size:18px;line-height:1.4;}
.copy-section{font-size:18px;margin-top:12px;}
</style></head><body>
<div class="page">
  <div class="hdr-wrap"><img class="hdr-logo" src="src/assets/anna-university-logo.png" alt="AU Logo" onerror="this.style.display='none'" /><div class="hdr-text"><div class="dept">DEPARTMENT OF ${project.departmentFull.replace("Department of","").trim().toUpperCase()}</div><div class="college">COLLEGE OF ENGINEERING, GUINDY</div><div class="univ">ANNA UNIVERSITY, CHENNAI – 25</div></div></div>
  <div class="meta-row"><strong>Professor &amp; Head</strong><span>Phone: 2235 7744</span></div>
  <div class="proc-line"><span>Proceeding No. ${formData.proceedingNo}</span><span>Date: ${td}</span></div>
  <table class="sub-ref-table"><tr><td>Sub:</td><td>${project.departmentFull.replace("Department of","").trim()} – ${formData.divisionLabel || "R&AC"} – ${project.scheme} - Purchase of ${formData.itemDescription || "contingency items"} – Sanction Accorded – Reg.</td></tr><tr><td>Ref:</td><td>CSRC Proc. No: ${project.csrcProcNo} &nbsp; dated: ${project.csrcProcDate}</td></tr></table>
  <div class="stars">*****</div>
  <p class="para indent">The ${formData.sanctioningAuthority || "Director of Technical Education (DoTE), Chennai"} has sanctioned a project titled "<strong>${project.title}</strong>" at a total cost of Rs.${Number(project.sanctionedAmount).toLocaleString("en-IN")}/- under ${project.scheme} Scheme – Project No. ${project.projectNo} to <strong>${project.pi}, ${project.piDesignation}</strong>, ${project.departmentFull}, ${project.campus}, Anna University, Chennai.</p>
  <p class="para indent">Sanction is hereby accorded to incur an expenditure not exceeding a sum of <strong>Rs. ${Number(formData.amount).toLocaleString("en-IN")} /- (Rupees ${toIndianWords(Number(formData.amount))})</strong> towards the purchase of ${formData.itemDescription || "contingency items"} in connection with the project work.</p>
  <p class="para indent">The expenditure is debitable under the Head of Account "M. H. No.${formData.mhNo || "16.1.17"} – ${formData.sanctioningAuthority || "Directorate of Technical Education (DoTE), Chennai"}, Project – "<strong>${project.title}</strong>" - Recurring - Contingency for the year ${formData.financialYear || "2025 – 26"}.</p>
  <div class="committed-section"><div class="commit-header"><span></span><span></span><span class="committed-title">Committed</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Budget Allotment in BE/RE</span><span class="commit-amount">Rs. ${Number(project.budgetAllotment).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span style="font-size:22px;">•</span><span>Amount incurred so far<br>(Including this proceeding)</span><span class="commit-amount">Rs. ${Number(amountIncludingThis).toLocaleString("en-IN")}/-</span></div><div class="commit-row"><span></span><span>Balance amount available</span><span class="commit-amount">Rs. ${Number(balance).toLocaleString("en-IN")}/-</span></div></div>
  <p style="font-size:18px;margin:12px 0;">The sanction amount has been entered in Sanction Register Vide Page No. <span class="underline-box">&nbsp;${formData.sanctionPageNo || "______"}&nbsp;</span> &nbsp; Sl. No. <span class="underline-box">&nbsp;${formData.sanctionSlNo || "______"}&nbsp;</span> &nbsp; Vol. &nbsp;&nbsp;&nbsp; for the year ${formData.financialYear || "2025 - 26"}.</p>
  <div class="hod-sig">HOD (${project.department.toUpperCase()})</div>
  <div class="to-section"><div>To</div><div>${project.pi},</div><div>${project.piDesignation},</div><div>${formData.divisionLabel ? formData.divisionLabel + " Division," : ""}</div><div>${project.departmentFull},</div><div>Chennai – 600 025</div></div>
  <div class="copy-section">Copy to: Bill</div>
</div></body></html>`;
}

function generateNonRecurringPDF(formData, project) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  const balance = project.budgetAllotment - (project.amountIncurredSoFar + Number(formData.amount));
  const amountIncludingThis = project.amountIncurredSoFar + Number(formData.amount);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Equipment Proceedings</title>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:"Times New Roman",serif;font-size:18px;background:#fff;color:#000;}
.page{width:210mm;min-height:297mm;padding:22mm 22mm 22mm 22mm;background:#fff;}
@media print{.print-btn{display:none;}}
.hdr-wrap{display:flex;align-items:center;gap:12px;margin-bottom:4px;}
.hdr-logo{width:80px;height:80px;flex-shrink:0;}
.hdr-text{text-align:center;flex:1;}
.hdr-text .dept,.hdr-text .college,.hdr-text .univ{font-size:16px;font-weight:bold;}
.hod-name{font-size:18px;font-weight:bold;margin-top:6px;}
.meta-row{display:flex;justify-content:space-between;margin-top:2px;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #000;font-size:18px;}
.proc-line{display:flex;justify-content:space-between;margin:5px 0;font-size:18px;}
.sub-ref-table{width:100%;border-collapse:collapse;margin:5px 0;}
.sub-ref-table td{padding:3px 0;vertical-align:top;font-size:18px;}
.sub-ref-table td:first-child{width:50px;font-weight:bold;}
.stars{text-align:center;margin:3px 0;font-size:13px;font-weight:bold;}
p.para{text-align:justify;line-height:1.6;margin:8px 0;font-size:18px;}
p.para.indent{text-indent:20px;}
.bullet-section{margin:14px 0 10px 0;font-size:18px;}
.bullet-row{display:flex;align-items:flex-start;margin:10px 0;}
.bullet-dot{margin-right:12px;font-size:22px;line-height:1;}
.bullet-label{flex:1;}
.bullet-dots{display:inline-block;border-bottom:1px solid #000;width:220px;margin-left:8px;vertical-align:bottom;}
.underline-box{display:inline-block;border-bottom:1px solid #000;min-width:60px;}
.hod-sig{text-align:right;font-weight:bold;font-size:18px;margin-top:45px;margin-bottom:8px;}
.to-section{font-size:18px;line-height:1.6;}
.copy-section{font-size:18px;margin-top:10px;}
</style></head><body>
<div class="page">
  <div class="hdr-wrap"><img class="hdr-logo" src="src/assets/anna-university-logo.png" alt="AU Logo" onerror="this.style.display='none'" /><div class="hdr-text"><div class="dept">DEPARTMENT OF ${project.departmentFull.replace("Department of","").trim().toUpperCase()}</div><div class="college">COLLEGE OF ENGINEERING, GUINDY</div><div class="univ">ANNA UNIVERSITY, CHENNAI – 25</div></div></div>
  <div class="hod-name">${formData.hodName || ""}</div>
  <div class="meta-row"><strong>Professor &amp; Head</strong><span>Phone: 2235 7744</span></div>
  <div class="proc-line"><span>Proc.No. ${formData.proceedingNo}</span><span>Date: ${td}</span></div>
  <table class="sub-ref-table"><tr><td>Sub:</td><td>${project.departmentFull.replace("Department of","").trim()} – ${formData.divisionLabel || "R&AC"} – ${project.scheme} - Purchase of ${formData.equipmentName || "Equipment"} – Sanction Accorded – Reg.</td></tr><tr><td>Ref:</td><td>CSRC Proc. No: ${project.csrcProcNo} &nbsp; dated: ${project.csrcProcDate}</td></tr></table>
  <div class="stars">*****</div>
  <p class="para indent">The ${formData.sanctioningAuthority || "Director of Technical Education (DoTE), Chennai"} has sanctioned a project titled "<strong>${project.title}</strong>" at a total cost of Rs.${Number(project.sanctionedAmount).toLocaleString("en-IN")}/- under ${project.scheme} Scheme – Project No. ${project.projectNo} to <strong>${project.pi}, ${project.piDesignation}</strong>, ${project.departmentFull}, ${project.campus}, Anna University, Chennai.</p>
  <p class="para indent">Sanction is hereby accorded to incur an expenditure not exceeding a sum of <strong>Rs.${Number(formData.amount).toLocaleString("en-IN")}/-. (Rupees ${toIndianWords(Number(formData.amount))})</strong> towards the procurement of "<strong>${formData.equipmentName || "Equipment"}</strong>" in connection with the project work.</p>
  <p class="para" style="text-align:center;">The Payment may be made in favour of <strong><u>M/s. ${formData.vendorName || "______"}</u></strong></p>
  <p class="para indent">The expenditure is debitable under the Head of Account "M. H. No.${formData.mhNo || "16.1.17"} – ${formData.sanctioningAuthority || "Directorate of Technical Education (DoTE), Chennai"}, Project – "<strong>${project.title}</strong>" - Non-Recurring for the year ${formData.financialYear || "2025 – 26"}.</p>
  <div class="bullet-section">
    <div class="bullet-row"><span class="bullet-dot">•</span><span class="bullet-label">Budget Allotment in BE/RE <span class="bullet-dots"></span></span></div>
    <div class="bullet-row"><span class="bullet-dot">•</span><span class="bullet-label">Amount incurred so far<br>&nbsp;&nbsp;&nbsp;(Including this proceeding) <span class="bullet-dots"></span></span></div>
    <div class="bullet-row"><span class="bullet-dot" style="visibility:hidden;">•</span><span class="bullet-label">Balance amount available <span class="bullet-dots"></span></span></div>
  </div>
  <p style="font-size:18px;margin:12px 0;">The sanction amount has been entered in Sanction Register Vide Page No. <span class="underline-box">&nbsp;${formData.sanctionPageNo || "______"}&nbsp;</span> &nbsp; Sl. No. <span class="underline-box">&nbsp;${formData.sanctionSlNo || "______"}&nbsp;</span> for the year ${formData.financialYear || "2025 - 26"}.</p>
  <div class="hod-sig">HOD (${project.department.toUpperCase()})</div>
  <div class="to-section"><div>To</div><div>The Professor and Head,</div><div>${formData.divisionLabel ? formData.divisionLabel + " Division," : ""}</div><div>${project.departmentFull},</div><div>Chennai – 600 025</div></div>
  <div class="copy-section">Copy to: Bill</div>
</div></body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════
   buildCombinedReport — CENTRAL FUNCTION
   Called from every head's onSubmit, returns combined HTML
═══════════════════════════════════════════════════════════════════ */
function buildCombinedReport(headKey, formData, project, claimData, staff) {
  let coverHTML = "";
  let proceedingsHTML = "";

  switch (headKey) {
    case "manpower": {
      coverHTML = generateManpowerCoverPage(claimData, staff, project);
      proceedingsHTML = generateManpowerPDF(claimData, staff);
      break;
    }
    case "consumables": {
      coverHTML = generateConsumablesCoverPage(formData, project);
      proceedingsHTML = generateConsumablesPDF(formData, project);
      break;
    }
    case "travel": {
      coverHTML = generateTravelCoverPage(formData, project);
      proceedingsHTML = generateTravelPDF(formData, project);
      break;
    }
    case "contingency": {
      coverHTML = generateContingencyCoverPage(formData, project);
      proceedingsHTML = generateContingencyPDF(formData, project);
      break;
    }
    case "otherExpenses": {
      coverHTML = generateOtherExpensesCoverPage(formData, project);
      proceedingsHTML = generateOtherExpensesPDF(formData, project);
      break;
    }
    case "nonRecurring": {
      coverHTML = generateNonRecurringCoverPage(formData, project);
      proceedingsHTML = generateNonRecurringPDF(formData, project);
      break;
    }
    default:
      coverHTML = "<html><body><p>Cover page not available.</p></body></html>";
      proceedingsHTML = formData._reportHTML || "<html><body><p>Proceedings not available.</p></body></html>";
  }

  return combineCoverAndProceedings(coverHTML, proceedingsHTML);
}

/* ═══════════════════════════════════════════════════════════════════
   SUB COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* ── shared formCSS for all claim pages ── */
const FORM_CSS = `
  .cons-page { padding: 0; }
  .cons-header { margin-bottom: 24px; }
  .cons-header h2 { font-family: 'Syne', sans-serif; font-size: 20px; color: #111827; margin: 0 0 6px; }
  .cons-header p { font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(20,30,70,0.45); margin: 0; }
  .cons-section { background: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.95); border-radius: 16px; overflow: hidden; margin-bottom: 18px; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 3px 18px rgba(0,0,0,0.05); }
  .cons-section-head { display: flex; align-items: center; gap: 10px; padding: 13px 18px; background: rgba(2,132,199,0.06); border-bottom: 1px solid rgba(0,100,220,0.07); }
  .cons-section-head .cs-badge { width: 26px; height: 26px; border-radius: 8px; background: rgba(2,132,199,0.15); color: #0284c7; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; display: grid; place-items: center; }
  .cons-section-head h3 { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: rgba(20,30,70,0.8); margin: 0; text-transform: uppercase; letter-spacing: 0.8px; }
  .cons-section-body { padding: 18px; }
  .cons-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .cons-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .cons-field { display: flex; flex-direction: column; gap: 7px; }
  .cons-field label { font-family: 'Syne', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 1.1px; color: rgba(20,30,70,0.42); display: flex; align-items: center; gap: 5px; }
  .cons-field label .req { color: #dc2626; font-size: 12px; }
  .cons-field label .src-badge { font-size: 9px; padding: 2px 6px; border-radius: 999px; font-weight: 700; letter-spacing: 0.5px; }
  .src-fetch { background: rgba(2,132,199,0.1); color: #0284c7; border: 1px solid rgba(2,132,199,0.22); }
  .src-enter { background: rgba(124,58,237,0.09); color: #6d28d9; border: 1px solid rgba(124,58,237,0.22); }
  .src-auto { background: rgba(34,197,94,0.09); color: #16a34a; border: 1px solid rgba(34,197,94,0.18); }
  .cons-static { background: rgba(2,132,199,0.04); border: 1px solid rgba(2,132,199,0.12); border-radius: 10px; padding: 10px 14px; color: rgba(20,30,70,0.68); font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.5; }
  .cons-static strong { color: rgba(20,30,70,0.88); }
  .balance-bar { background: rgba(255,255,255,0.7); border: 1px solid rgba(0,100,220,0.08); border-radius: 14px; padding: 16px 20px; margin-top: 4px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
  .bal-item { text-align: center; }
  .bal-item .bal-label { font-family: 'Syne', sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: rgba(20,30,70,0.4); margin-bottom: 6px; }
  .bal-item .bal-val { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; }
  .bal-item .bal-val.green { color: #16a34a; }
  .bal-item .bal-val.yellow { color: #b45309; }
  .bal-item .bal-val.blue { color: #0284c7; }
  .bal-item .bal-val.red { color: #dc2626; }
  .cons-action-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
  .cons-action-left { display: flex; gap: 10px; }
  .cons-preview-btn { border: 1px solid rgba(2,132,199,0.3); background: rgba(2,132,199,0.08); color: #0284c7; border-radius: 12px; padding: 11px 22px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; transition: 0.2s; display: flex; align-items: center; gap: 7px; }
  .cons-preview-btn:hover { background: rgba(2,132,199,0.16); transform: translateY(-1px); }
  .cons-download-btn { border: 1px solid rgba(34,197,94,0.3); background: rgba(34,197,94,0.08); color: #16a34a; border-radius: 12px; padding: 11px 22px; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; transition: 0.2s; display: flex; align-items: center; gap: 7px; }
  .cons-download-btn:hover { background: rgba(34,197,94,0.16); transform: translateY(-1px); }
  .cons-submit-btn { border: none; border-radius: 12px; padding: 12px 28px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; font-family: 'Syne', sans-serif; font-weight: 800; cursor: pointer; font-size: 14px; transition: 0.2s; box-shadow: 0 8px 22px rgba(34,197,94,0.22); display: flex; align-items: center; gap: 7px; }
  .cons-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(34,197,94,0.3); }
  .cons-preview-overlay { position: fixed; inset: 0; z-index: 2000000; background: rgba(15,23,42,0.6); display: flex; align-items: flex-start; justify-content: center; padding: 14px 20px; }
  .cons-preview-box { width: min(920px,96vw); height: calc(100vh - 28px); background: #ffffff; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(0,100,220,0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.2); }
  .cons-preview-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; background: #ffffff; border-bottom: 1px solid rgba(0,100,220,0.08); flex-shrink: 0; }
  .cons-preview-head span { color: rgba(20,30,70,0.72); font-family: 'DM Sans',sans-serif; font-size: 13px; }
  .cons-preview-head div { display: flex; gap: 8px; }
  .cons-preview-head button { border: none; border-radius: 8px; padding: 7px 14px; cursor: pointer; font-family: 'DM Sans',sans-serif; font-size: 12px; font-weight: 700; }
  .cons-preview-head .btn-dl { background: #22c55e; color: #fff; }
  .cons-preview-head .btn-cl { background: #ef4444; color: #fff; }
  .cons-preview-iframe { flex: 1; width: 100%; border: none; background: #fff; }
  @media (max-width: 768px) { .cons-grid-2, .cons-grid-3 { grid-template-columns: 1fr; } .balance-bar { grid-template-columns: 1fr; } }
`;

/* ─── Shared Project Detail Section (fetched) ─── */
function ProjectDetailSection({ project }) {
  const td = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");
  return (
    <div className="cons-section">
      <div className="cons-section-head">
        <div className="cs-badge">1</div>
        <h3>Project Details</h3>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(20,30,70,0.35)", fontFamily: "DM Sans, sans-serif" }}>Auto-fetched from project profile</span>
      </div>
      <div className="cons-section-body">
        <div className="cons-grid-2" style={{ gap: 14 }}>
          <div className="cons-field"><label>Project Title <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static"><strong>{project.title}</strong></div></div>
          <div className="cons-field"><label>Project No. <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static">{project.projectNo}</div></div>
          <div className="cons-field"><label>PI Name & Designation <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static"><strong>{project.pi}</strong>, {project.piDesignation}</div></div>
          <div className="cons-field"><label>Scheme <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static">{project.scheme}</div></div>
          <div className="cons-field"><label>Department <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static">{project.departmentFull}, {project.campus}</div></div>
          <div className="cons-field"><label>CSRC Proceedings Ref <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static">{project.csrcProcNo} dated {project.csrcProcDate}</div></div>
          <div className="cons-field"><label>Total Sanctioned Cost <span className="src-badge src-fetch">Fetched</span></label><div className="cons-static">Rs. {Number(project.sanctionedAmount).toLocaleString("en-IN")}/-</div></div>
          <div className="cons-field"><label>Date <span className="src-badge src-auto">Auto</span></label><div className="cons-static">{td}</div></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Balance Bar ─── */
function BalanceBar({ project, amount }) {
  const incl = project.amountIncurredSoFar + Number(amount || 0);
  const balance = project.budgetAllotment - incl;
  return (
    <div className="balance-bar">
      <div className="bal-item"><div className="bal-label">Budget Allotment (BE/RE)</div><div className="bal-val blue">₹{Number(project.budgetAllotment).toLocaleString("en-IN")}</div></div>
      <div className="bal-item"><div className="bal-label">Incurred (incl. this)</div><div className="bal-val yellow">₹{incl.toLocaleString("en-IN")}</div></div>
      <div className="bal-item"><div className="bal-label">Balance Available</div><div className={`bal-val ${balance >= 0 ? "green" : "red"}`}>₹{Math.abs(balance).toLocaleString("en-IN")}{balance < 0 ? " (Over)" : ""}</div></div>
    </div>
  );
}

/* ─── Shared Proceeding+Sanction Section ─── */
function ProceedingSection({ data, set, sectionNo = 2 }) {
  return (
    <div className="cons-section">
      <div className="cons-section-head">
        <div className="cs-badge">{sectionNo}</div>
        <h3>Proceeding Details</h3>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(20,30,70,0.35)", fontFamily: "DM Sans, sans-serif" }}>To be entered by user</span>
      </div>
      <div className="cons-section-body">
        <div className="cons-grid-2" style={{ gap: 16 }}>
          <div className="cons-field"><label>Proceeding No. <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 08 / RAC /CMRG/ 2025-26" value={data.proceedingNo || ""} onChange={e => set("proceedingNo", e.target.value)} /></div>
          <div className="cons-field"><label>Division / Lab Label <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. R&AC, Thermal..." value={data.divisionLabel || ""} onChange={e => set("divisionLabel", e.target.value)} /></div>
          <div className="cons-field"><label>Sanctioning Authority <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Director of Technical Education (DoTE), Chennai" value={data.sanctioningAuthority || ""} onChange={e => set("sanctioningAuthority", e.target.value)} /></div>
          <div className="cons-field"><label>M.H. No. <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 16.1.17" value={data.mhNo || ""} onChange={e => set("mhNo", e.target.value)} /></div>
          <div className="cons-field"><label>Financial Year <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 2025 – 26" value={data.financialYear || ""} onChange={e => set("financialYear", e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}

function SanctionRegSection({ data, set, sectionNo }) {
  return (
    <div className="cons-section">
      <div className="cons-section-head">
        <div className="cs-badge" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}>{sectionNo}</div>
        <h3>Sanction Register Entry</h3>
      </div>
      <div className="cons-section-body">
        <div className="cons-grid-2" style={{ gap: 16 }}>
          <div className="cons-field"><label>Vide Page No. <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="Page number" value={data.sanctionPageNo || ""} onChange={e => set("sanctionPageNo", e.target.value)} /></div>
          <div className="cons-field"><label>Sl. No. <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="Serial number" value={data.sanctionSlNo || ""} onChange={e => set("sanctionSlNo", e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}

/* ── Manpower (full SSC) ── */
function ManpowerPage({ onBack, selectedProject }) {
  const [claims, setClaims] = useState(SAMPLE_CLAIMS);
  const [view, setView] = useState("list");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [nextId, setNextId] = useState(SAMPLE_CLAIMS.length + 1);
  const [newStaff, setNewStaff] = useState(null);
  const [newStaffSearch, setNewStaffSearch] = useState("");
  const [newRows, setNewRows] = useState([{ from: "", upto: "", cl: "", lop: "" }]);
  const [staffDropOpen, setStaffDropOpen] = useState(false);

  const getStaff = (id) => STAFF_LIST.find((s) => s.id === id);

  const openCombinedPreview = (claim, staff) => {
    const project = selectedProject || PROJECTS[0];
    const combinedHTML = buildCombinedReport("manpower", {}, project, claim, staff);
    const win = window.open("", "_blank");
    if (win) { win.document.write(combinedHTML); win.document.close(); }
  };

  const downloadCombinedPDF = async (claim, staff) => {
    const project = selectedProject || PROJECTS[0];
    const combinedHTML = buildCombinedReport("manpower", {}, project, claim, staff);
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(combinedHTML);
    iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1200));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pw = 210; const ph = (canvas.height * pw) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pw, Math.min(ph, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`claim_${staff.name.replace(/\s/g, "_")}.pdf`);
  };

  if (view === "list") return (
    <div className="ssc-page">
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="ssc-btn ssc-btn-back" onClick={onBack}>← Back</button>
          <div className="ssc-pagination">
            <button>First</button><button>Prev</button>
            <span>{claims.length} records</span>
            <button>Next</button><button>Last</button>
          </div>
        </div>
        <button className="ssc-btn ssc-btn-new" onClick={() => { setNewStaff(null); setNewRows([{ from: "", upto: "", cl: "", lop: "" }]); setView("new"); }}>+ New Salary Claim</button>
      </div>
    </div>
  );

  if (view === "report" && selectedClaim) {
    const staff = getStaff(selectedClaim.staffId);
    const project = selectedProject || PROJECTS[0];
    const combinedHTML = buildCombinedReport("manpower", {}, project, selectedClaim, staff);
    return (
      <div className="ssc-page">
        <div className="ssc-header"><h2>Salary Claim Report — {staff.name}</h2></div>
        <div className="ssc-report-actions">
          <button className="ssc-btn ssc-btn-primary" onClick={() => openCombinedPreview(selectedClaim, staff)}>👁 Preview Full Report (Cover + Pages)</button>
          <button className="ssc-btn ssc-btn-outline" onClick={() => downloadCombinedPDF(selectedClaim, staff)}>⬇ Download PDF</button>
          <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>← Back</button>
        </div>
        <div className="ssc-report-preview"><iframe srcDoc={combinedHTML} title="Report" className="ssc-iframe" /></div>
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
      setClaims([...claims, { id: nextId, staffId: newStaff.id, salaryFrom: newRows[0].from, salaryTo: newRows[newRows.length - 1].upto, clDays: totalCL, lopDays: totalLOP, claimDays: totalDays, claimAmount: totalAmt, rows: newRows.map(r => ({ from: r.from, upto: r.upto, cl: parseFloat(r.cl) || 0, lop: parseFloat(r.lop) || 0 })) }]);
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

/* ─── ConsumablesPage ─── */
function ConsumablesPage({ project, onSubmit, onBack }) {
  const [data, setData] = useState({ proceedingNo: "", amount: "", vendorName: "", vendorAddress: "", vendorCity: "", itemDescription: "chemicals", divisionLabel: "", sanctioningAuthority: "Director of Technical Education (DoTE), Chennai", mhNo: "16.1.17", financialYear: "2025 – 26", sanctionPageNo: "", sanctionSlNo: "" });
  const [preview, setPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const getCombinedHTML = () => buildCombinedReport("consumables", data, project, null, null);

  const handlePreview = () => {
    if (!data.proceedingNo || !data.amount || !data.vendorName) { alert("Please fill Proceeding No., Amount, and Vendor Name."); return; }
    setPreviewHTML(getCombinedHTML());
    setPreview(true);
  };

  const handleDownload = async () => {
    if (!data.proceedingNo || !data.amount || !data.vendorName) { alert("Please fill required fields first."); return; }
    const html = getCombinedHTML();
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1000));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      if (i > 0) pdf.addPage();
      const pw = 210; pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`Consumables_${project.id}.pdf`);
  };

  const handleSubmit = () => {
    if (!data.proceedingNo || !data.amount || !data.vendorName) { alert("Please fill all required fields."); return; }
    onSubmit({ ...data, _reportHTML: getCombinedHTML() }, "Consumables & Accessories");
  };

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className="slip-card cons-page" style={{ animation: "slideIn 0.3s ease" }}>
        <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
        <div className="cons-header">
          <h2>🧪 Consumables & Accessories — Claim Entry</h2>
          <p>Generates Cover Page + Department Proceedings (2 pages total)</p>
        </div>
        <ProjectDetailSection project={project} />
        <ProceedingSection data={data} set={set} sectionNo={2} />

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(167,139,250,0.18)", color: "#a78bfa" }}>3</div><h3>Expenditure Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field"><label>Amount (₹) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 18583" value={data.amount} onChange={e => set("amount", e.target.value)} /></div>
              <div className="cons-field"><label>Item / Purchase Description <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. chemicals, lab consumables..." value={data.itemDescription} onChange={e => set("itemDescription", e.target.value)} /></div>
            </div>
            {data.amount && Number(data.amount) > 0 && (<div className="cons-field" style={{ marginBottom: 16 }}><label>Amount in Words <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Rupees <strong>{toIndianWords(Number(data.amount))}</strong></div></div>)}
            <BalanceBar project={project} amount={data.amount} />
          </div>
        </div>

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>4</div><h3>Vendor / Supplier Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16 }}>
              <div className="cons-field"><label>Vendor Name (M/s.) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Sri Hari Scientific" value={data.vendorName} onChange={e => set("vendorName", e.target.value)} /></div>
              <div className="cons-field"><label>Vendor City / PIN <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Chennai – 600100" value={data.vendorCity} onChange={e => set("vendorCity", e.target.value)} /></div>
              <div className="cons-field" style={{ gridColumn: "1 / -1" }}><label>Vendor Full Address <span className="src-badge src-enter">Enter</span></label><textarea className="slip-input" rows={2} placeholder="No.1 Sample Street, Chennai - 600100" value={data.vendorAddress} onChange={e => set("vendorAddress", e.target.value)} style={{ resize: "vertical" }} /></div>
            </div>
          </div>
        </div>

        <SanctionRegSection data={data} set={set} sectionNo={5} />

        <div className="cons-action-row">
          <div className="cons-action-left">
            <button className="cons-preview-btn" onClick={handlePreview}>👁 Preview Full Report</button>
            <button className="cons-download-btn" onClick={handleDownload}>⬇ Download PDF</button>
          </div>
          <button className="cons-submit-btn" onClick={handleSubmit}>✓ Submit Claim →</button>
        </div>
      </div>
      {preview && previewHTML && (
        <div className="cons-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div className="cons-preview-box">
            <div className="cons-preview-head">
              <span>📄 Consumables Claim — {project.id} (Cover + Proceedings)</span>
              <div><button className="btn-dl" onClick={handleDownload}>⬇ Download</button><button className="btn-cl" onClick={() => setPreview(false)}>✕ Close</button></div>
            </div>
            <iframe className="cons-preview-iframe" srcDoc={previewHTML} title="Consumables Full Report" />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── TravelPage ─── */
function TravelPage({ project, onSubmit, onBack }) {
  const [data, setData] = useState({ proceedingNo: "", amount: "", modeOfTravel: "own car", vehicleNo: "", travelDate: "", duration: "One day", fromPlace: "Chennai", toPlace: "", purpose: "Data collection field work", payeeName: "", headOfAccount: "Travel", divisionLabel: "", startKm: "", endKm: "", sanctioningAuthority: "Director of Technical Education (DoTE), Chennai", mhNo: "16.1.17", financialYear: "2025 – 26", sanctionPageNo: "", sanctionSlNo: "" });
  const [preview, setPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  const validate = () => {
    if (!data.proceedingNo || !data.amount || !data.toPlace || !data.travelDate || !data.payeeName) { alert("Please fill Proceeding No., Amount, Destination, Travel Date and Payee Name."); return false; }
    return true;
  };

  const getCombinedHTML = () => buildCombinedReport("travel", data, project, null, null);

  const handlePreview = () => { if (!validate()) return; setPreviewHTML(getCombinedHTML()); setPreview(true); };

  const handleDownload = async () => {
    if (!validate()) return;
    const html = getCombinedHTML();
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1000));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      if (i > 0) pdf.addPage();
      const pw = 210; pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`Travel_${project.id}.pdf`);
  };

  const handleSubmit = () => { if (!validate()) return; onSubmit({ ...data, _reportHTML: getCombinedHTML() }, "Travel"); };

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className="slip-card cons-page" style={{ animation: "slideIn 0.3s ease" }}>
        <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
        <div className="cons-header">
          <h2>✈️ Travel — Claim Entry</h2>
          <p>Generates Cover Page + Sanction Proceedings (2 pages total)</p>
        </div>
        <ProjectDetailSection project={project} />
        <ProceedingSection data={data} set={set} sectionNo={2} />

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(167,139,250,0.18)", color: "#a78bfa" }}>3</div><h3>Travel Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-3" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field"><label>From Place <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Chennai" value={data.fromPlace} onChange={e => set("fromPlace", e.target.value)} /></div>
              <div className="cons-field"><label>To Place (Destination) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Tanjore" value={data.toPlace} onChange={e => set("toPlace", e.target.value)} /></div>
              <div className="cons-field"><label>Mode of Travel <span className="src-badge src-enter">Enter</span></label>
                <select className="slip-input" value={data.modeOfTravel} onChange={e => set("modeOfTravel", e.target.value)}>
                  <option value="own car">Own Car</option><option value="own two wheeler">Own Two Wheeler</option><option value="train">Train</option><option value="bus">Bus</option><option value="flight">Flight</option><option value="taxi">Taxi</option>
                </select>
              </div>
            </div>
            <div className="cons-grid-3" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field"><label>Vehicle No. <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. TN 14 D 1651" value={data.vehicleNo} onChange={e => set("vehicleNo", e.target.value)} /></div>
              <div className="cons-field"><label>Travel Date <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 23.08.2025" value={data.travelDate} onChange={e => set("travelDate", e.target.value)} /></div>
              <div className="cons-field"><label>Duration <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. One day" value={data.duration} onChange={e => set("duration", e.target.value)} /></div>
            </div>
            <div className="cons-grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field" style={{ gridColumn: "1 / -1" }}><label>Purpose of Travel <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Data collection field work" value={data.purpose} onChange={e => set("purpose", e.target.value)} /></div>
              <div className="cons-field"><label>Amount (₹) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 9440" value={data.amount} onChange={e => set("amount", e.target.value)} /></div>
              <div className="cons-field"><label>Payee Name (NEFT in favour of) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. P. Uma Maheswari" value={data.payeeName} onChange={e => set("payeeName", e.target.value)} /></div>
            </div>
            {data.amount && Number(data.amount) > 0 && (<div className="cons-field" style={{ marginBottom: 16 }}><label>Amount in Words <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Rupees <strong>{toIndianWords(Number(data.amount))}</strong></div></div>)}
            <BalanceBar project={project} amount={data.amount} />
          </div>
        </div>

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>4</div><h3>Odometer Readings (for own vehicle)</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16 }}>
              <div className="cons-field"><label>Starting Reading (Km) <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 87236" value={data.startKm} onChange={e => set("startKm", e.target.value)} /></div>
              <div className="cons-field"><label>Closing Reading (Km) <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 87856" value={data.endKm} onChange={e => set("endKm", e.target.value)} /></div>
            </div>
            {data.startKm && data.endKm && Number(data.endKm) > Number(data.startKm) && (<div className="cons-field" style={{ marginTop: 16 }}><label>Total Distance <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Total <strong>{Number(data.endKm) - Number(data.startKm)} Km</strong></div></div>)}
          </div>
        </div>

        <SanctionRegSection data={data} set={set} sectionNo={5} />

        <div className="cons-action-row">
          <div className="cons-action-left">
            <button className="cons-preview-btn" onClick={handlePreview}>👁 Preview Full Report</button>
            <button className="cons-download-btn" onClick={handleDownload}>⬇ Download PDF</button>
          </div>
          <button className="cons-submit-btn" onClick={handleSubmit}>✓ Submit Claim →</button>
        </div>
      </div>
      {preview && previewHTML && (
        <div className="cons-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div className="cons-preview-box">
            <div className="cons-preview-head">
              <span>📄 Travel Claim — {project.id} (Cover + Proceedings)</span>
              <div><button className="btn-dl" onClick={handleDownload}>⬇ Download</button><button className="btn-cl" onClick={() => setPreview(false)}>✕ Close</button></div>
            </div>
            <iframe className="cons-preview-iframe" srcDoc={previewHTML} title="Travel Full Report" />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── ContingencyPage ─── */
function ContingencyPage({ project, onSubmit, onBack }) {
  const [data, setData] = useState({ proceedingNo: "", amount: "", itemDescription: "contingency items", divisionLabel: "", sanctioningAuthority: "Director of Technical Education (DoTE), Chennai", mhNo: "16.1.17", financialYear: "2025 – 26", sanctionPageNo: "", sanctionSlNo: "" });
  const [preview, setPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));
  const getCombinedHTML = () => buildCombinedReport("contingency", data, project, null, null);
  const handlePreview = () => { if (!data.proceedingNo || !data.amount) { alert("Please fill Proceeding No. and Amount."); return; } setPreviewHTML(getCombinedHTML()); setPreview(true); };
  const handleDownload = async () => {
    if (!data.proceedingNo || !data.amount) { alert("Please fill required fields first."); return; }
    const html = getCombinedHTML();
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1000));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      if (i > 0) pdf.addPage();
      const pw = 210; pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`Contingency_${project.id}.pdf`);
  };
  const handleSubmit = () => { if (!data.proceedingNo || !data.amount) { alert("Please fill all required fields."); return; } onSubmit({ ...data, _reportHTML: getCombinedHTML() }, "Contingency"); };

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className="slip-card cons-page" style={{ animation: "slideIn 0.3s ease" }}>
        <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
        <div className="cons-header"><h2>📦 Contingency — Claim Entry</h2><p>Generates Cover Page + Department Proceedings (2 pages total)</p></div>
        <ProjectDetailSection project={project} />
        <ProceedingSection data={data} set={set} sectionNo={2} />
        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(167,139,250,0.18)", color: "#a78bfa" }}>3</div><h3>Expenditure Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field"><label>Amount (₹) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 5000" value={data.amount} onChange={e => set("amount", e.target.value)} /></div>
              <div className="cons-field"><label>Item / Description <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. printing, postage, stationery..." value={data.itemDescription} onChange={e => set("itemDescription", e.target.value)} /></div>
            </div>
            {data.amount && Number(data.amount) > 0 && (<div className="cons-field" style={{ marginBottom: 16 }}><label>Amount in Words <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Rupees <strong>{toIndianWords(Number(data.amount))}</strong></div></div>)}
            <BalanceBar project={project} amount={data.amount} />
          </div>
        </div>
        <SanctionRegSection data={data} set={set} sectionNo={4} />
        <div className="cons-action-row">
          <div className="cons-action-left"><button className="cons-preview-btn" onClick={handlePreview}>👁 Preview Full Report</button><button className="cons-download-btn" onClick={handleDownload}>⬇ Download PDF</button></div>
          <button className="cons-submit-btn" onClick={handleSubmit}>✓ Submit Claim →</button>
        </div>
      </div>
      {preview && previewHTML && (
        <div className="cons-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div className="cons-preview-box">
            <div className="cons-preview-head"><span>📄 Contingency Claim — {project.id} (Cover + Proceedings)</span><div><button className="btn-dl" onClick={handleDownload}>⬇ Download</button><button className="btn-cl" onClick={() => setPreview(false)}>✕ Close</button></div></div>
            <iframe className="cons-preview-iframe" srcDoc={previewHTML} title="Contingency Full Report" />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── OtherExpensesPage ─── */
function OtherExpensesPage({ project, onSubmit, onBack }) {
  const [data, setData] = useState({ proceedingNo: "", amount: "", purchaseOf: "", vendorName: "", vendorCity: "", divisionLabel: "", sanctioningAuthority: "Director of Technical Education (DoTE), Chennai", mhNo: "16.1.17", financialYear: "2025 – 26", sanctionPageNo: "", sanctionSlNo: "" });
  const [preview, setPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));
  const getCombinedHTML = () => buildCombinedReport("otherExpenses", data, project, null, null);
  const handlePreview = () => { if (!data.proceedingNo || !data.amount || !data.purchaseOf) { alert("Please fill Proceeding No., Amount, and Purchase of (what)."); return; } setPreviewHTML(getCombinedHTML()); setPreview(true); };
  const handleDownload = async () => {
    if (!data.proceedingNo || !data.amount || !data.purchaseOf) { alert("Please fill required fields first."); return; }
    const html = getCombinedHTML();
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1000));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      if (i > 0) pdf.addPage();
      const pw = 210; pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`OtherExpenses_${project.id}.pdf`);
  };
  const handleSubmit = () => { if (!data.proceedingNo || !data.amount || !data.purchaseOf) { alert("Please fill all required fields."); return; } onSubmit({ ...data, _reportHTML: getCombinedHTML() }, "Other Expenses"); };

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className="slip-card cons-page" style={{ animation: "slideIn 0.3s ease" }}>
        <button className="back-btn" onClick={onBack}>← Back to Recurring</button>
        <div className="cons-header"><h2>💰 Other Expenses — Claim Entry</h2><p>Generates Cover Page + Department Proceedings (2 pages total)</p></div>
        <ProjectDetailSection project={project} />
        <ProceedingSection data={data} set={set} sectionNo={2} />
        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(167,139,250,0.18)", color: "#a78bfa" }}>3</div><h3>Expenditure Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field"><label>Purchase of (What?) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Publication charges, Patent filing fees..." value={data.purchaseOf} onChange={e => set("purchaseOf", e.target.value)} /></div>
              <div className="cons-field"><label>Amount (₹) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 8000" value={data.amount} onChange={e => set("amount", e.target.value)} /></div>
            </div>
            {data.amount && Number(data.amount) > 0 && (<div className="cons-field" style={{ marginBottom: 16 }}><label>Amount in Words <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Rupees <strong>{toIndianWords(Number(data.amount))}</strong></div></div>)}
            <BalanceBar project={project} amount={data.amount} />
          </div>
        </div>
        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>4</div><h3>Vendor / Payee Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16 }}>
              <div className="cons-field"><label>Vendor / Payee Name (M/s.) <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Springer, IEEE, Patent Office..." value={data.vendorName} onChange={e => set("vendorName", e.target.value)} /></div>
              <div className="cons-field"><label>City / Location <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. New Delhi" value={data.vendorCity} onChange={e => set("vendorCity", e.target.value)} /></div>
            </div>
          </div>
        </div>
        <SanctionRegSection data={data} set={set} sectionNo={5} />
        <div className="cons-action-row">
          <div className="cons-action-left"><button className="cons-preview-btn" onClick={handlePreview}>👁 Preview Full Report</button><button className="cons-download-btn" onClick={handleDownload}>⬇ Download PDF</button></div>
          <button className="cons-submit-btn" onClick={handleSubmit}>✓ Submit Claim →</button>
        </div>
      </div>
      {preview && previewHTML && (
        <div className="cons-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div className="cons-preview-box">
            <div className="cons-preview-head"><span>📄 Other Expenses Claim — {project.id} (Cover + Proceedings)</span><div><button className="btn-dl" onClick={handleDownload}>⬇ Download</button><button className="btn-cl" onClick={() => setPreview(false)}>✕ Close</button></div></div>
            <iframe className="cons-preview-iframe" srcDoc={previewHTML} title="Other Expenses Full Report" />
          </div>
        </div>
      )}
    </>
  );
}

/* ─── NonRecurringEquipmentPage ─── */
function NonRecurringEquipmentPage({ project, onSubmit, onBack }) {
  const [data, setData] = useState({ proceedingNo: "", amount: "", equipmentName: "", vendorName: "", hodName: "", divisionLabel: "", sanctioningAuthority: "Director of Technical Education (DoTE), Chennai", mhNo: "16.1.17", financialYear: "2025 – 26", sanctionPageNo: "", sanctionSlNo: "" });
  const [preview, setPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState(null);
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));
  const getCombinedHTML = () => buildCombinedReport("nonRecurring", data, project, null, null);
  const handlePreview = () => { if (!data.proceedingNo || !data.amount || !data.equipmentName) { alert("Please fill Proceeding No., Amount, and Equipment Name."); return; } setPreviewHTML(getCombinedHTML()); setPreview(true); };
  const handleDownload = async () => {
    if (!data.proceedingNo || !data.amount || !data.equipmentName) { alert("Please fill required fields first."); return; }
    const html = getCombinedHTML();
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
    document.body.appendChild(iframe);
    iframe.contentDocument.open(); iframe.contentDocument.write(html); iframe.contentDocument.close();
    await new Promise(r => setTimeout(r, 1000));
    const pages = iframe.contentDocument.querySelectorAll(".page");
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      if (i > 0) pdf.addPage();
      const pw = 210; pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(iframe);
    pdf.save(`Equipment_${project.id}.pdf`);
  };
  const handleSubmit = () => { if (!data.proceedingNo || !data.amount || !data.equipmentName) { alert("Please fill all required fields."); return; } onSubmit({ ...data, _reportHTML: getCombinedHTML() }, data.equipmentName); };

  return (
    <>
      <style>{FORM_CSS}</style>
      <div className="slip-card cons-page" style={{ animation: "slideIn 0.3s ease" }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="cons-header"><h2>🔧 Non-Recurring — Equipment Proceedings</h2><p>Generates Cover Page + Department Proceedings (2 pages total)</p></div>
        <ProjectDetailSection project={project} />

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge">2</div><h3>Proceeding Details</h3><span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(20,30,70,0.35)", fontFamily: "DM Sans, sans-serif" }}>To be entered by user</span></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16 }}>
              <div className="cons-field"><label>HOD Name <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Dr. S. Senthil Kumaran" value={data.hodName} onChange={e => set("hodName", e.target.value)} /></div>
              <div className="cons-field"><label>Proceeding No. <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 02 / RAC /CMRG/ 2025-26" value={data.proceedingNo} onChange={e => set("proceedingNo", e.target.value)} /></div>
              <div className="cons-field"><label>Division / Lab Label <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. R&AC, Thermal..." value={data.divisionLabel} onChange={e => set("divisionLabel", e.target.value)} /></div>
              <div className="cons-field"><label>Sanctioning Authority <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Director of Technical Education (DoTE), Chennai" value={data.sanctioningAuthority} onChange={e => set("sanctioningAuthority", e.target.value)} /></div>
              <div className="cons-field"><label>M.H. No. <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 16.1.17" value={data.mhNo} onChange={e => set("mhNo", e.target.value)} /></div>
              <div className="cons-field"><label>Financial Year <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. 2025 – 26" value={data.financialYear} onChange={e => set("financialYear", e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div className="cons-section">
          <div className="cons-section-head"><div className="cs-badge" style={{ background: "rgba(167,139,250,0.18)", color: "#a78bfa" }}>3</div><h3>Equipment & Expenditure Details</h3></div>
          <div className="cons-section-body">
            <div className="cons-grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div className="cons-field" style={{ gridColumn: "1 / -1" }}><label>Equipment Name <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Multi-parameter Bench Top Measuring Instrument..." value={data.equipmentName} onChange={e => set("equipmentName", e.target.value)} /></div>
              <div className="cons-field"><label>Amount (₹) <span className="req">*</span> <span className="src-badge src-enter">Enter</span></label><input type="number" className="slip-input" placeholder="e.g. 73750" value={data.amount} onChange={e => set("amount", e.target.value)} /></div>
              <div className="cons-field"><label>Vendor / Supplier Name (M/s.) <span className="src-badge src-enter">Enter</span></label><input type="text" className="slip-input" placeholder="e.g. Acurel weighing systems Pvt. Ltd." value={data.vendorName} onChange={e => set("vendorName", e.target.value)} /></div>
            </div>
            {data.amount && Number(data.amount) > 0 && (<div className="cons-field" style={{ marginBottom: 16 }}><label>Amount in Words <span className="src-badge src-auto">Auto</span></label><div className="cons-static">Rupees <strong>{toIndianWords(Number(data.amount))}</strong></div></div>)}
            <BalanceBar project={project} amount={data.amount} />
          </div>
        </div>

        <SanctionRegSection data={data} set={set} sectionNo={4} />

        <div className="cons-action-row">
          <div className="cons-action-left"><button className="cons-preview-btn" onClick={handlePreview}>👁 Preview Full Report</button><button className="cons-download-btn" onClick={handleDownload}>⬇ Download PDF</button></div>
          <button className="cons-submit-btn" onClick={handleSubmit}>✓ Submit Claim →</button>
        </div>
      </div>
      {preview && previewHTML && (
        <div className="cons-preview-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
          <div className="cons-preview-box">
            <div className="cons-preview-head"><span>📄 Equipment Claim — {project.id} (Cover + Proceedings)</span><div><button className="btn-dl" onClick={handleDownload}>⬇ Download</button><button className="btn-cl" onClick={() => setPreview(false)}>✕ Close</button></div></div>
            <iframe className="cons-preview-iframe" srcDoc={previewHTML} title="Equipment Full Report" />
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ZBASlipPage() {
  const [screen, setScreen] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [recurringHead, setRecurringHead] = useState(null);
  const [claimsStore, setClaimsStore] = useState({});
  const [reviewTab, setReviewTab] = useState("review");
  const [settledProject, setSettledProject] = useState(null);
  const [settledTab, setSettledTab] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);

  const projectClaims = (pid) => claimsStore[pid] || [];
  const allClaims = selectedProject ? projectClaims(selectedProject.id) : [];
  const reviewClaims = allClaims.filter(c => c.status === "review");
  const approvedClaims = allClaims.filter(c => c.status === "approved");

  const pushClaim = (pid, claim) => setClaimsStore(prev => ({ ...prev, [pid]: [...(prev[pid] || []), claim] }));
  const approveClaim = (pid, cid) => setClaimsStore(prev => ({ ...prev, [pid]: (prev[pid] || []).map(c => c.id === cid ? { ...c, status: "approved" } : c) }));
  const showSuccessFor = (ms = 2200) => { setShowSuccess(true); setTimeout(() => setShowSuccess(false), ms); };

  const handleRecurringSubmit = (data, headName) => {
    const id = Date.now();
    const amount = Number(data.amount || 0);
    pushClaim(selectedProject.id, { id, type: "Recurring", head: headName, amount, date: today(), status: "review", reportHTML: data._reportHTML || "" });
    showSuccessFor();
    setTimeout(() => setScreen("underReview"), 2200);
  };

  const generateReportPDF = async (claim, mode = "preview") => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:-9999px;top:0;width:900px;padding:30px;background:#fff;";
    el.innerHTML = claim.reportHTML;
    document.body.appendChild(el);
    const pages = el.querySelectorAll(".page");
    const targets = pages.length > 0 ? Array.from(pages) : [el];
    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < targets.length; i++) {
      const canvas = await html2canvas(targets[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const pw = pdf.internal.pageSize.getWidth();
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, 297));
    }
    document.body.removeChild(el);
    const fn = `Claim_${claim.head.replace(/\s/g, "_")}.pdf`;
    if (mode === "download") pdf.save(fn);
    else { const url = URL.createObjectURL(pdf.output("blob")); setPdfPreview({ name: fn, url }); }
  };

  /* ── Projects ── */
  const renderProjects = () => (
    <div className="slip-table-card">
      <h2>Projects</h2>
      <div className="slip-table-wrap">
        <table>
          <thead><tr><th>Project No.</th><th>Scheme</th><th>Project Title</th><th>PI</th><th>Dept.</th><th>Sanctioned</th><th>Actions</th></tr></thead>
          <tbody>
            {PROJECTS.map(p => (
              <tr key={p.id}>
                <td>{p.projectNo}</td><td>{p.scheme}</td><td>{p.title}</td><td>{p.pi}</td><td>{p.department}</td><td>{fmt(p.sanctionedAmount)}</td>
                <td style={{ display: "flex", gap: 0 }}>
                  <button className="slip-view-btn" onClick={() => { setSelectedProject(p); setScreen("headType"); }}>Update Claim</button>
                  <button className="settled-btn" onClick={() => { setSettledProject(p); setSettledTab(p.id); }}>📋 Settled Bills</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── Head Type ── */
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
        <button className="settled-btn" style={{ marginLeft: 0 }} onClick={() => setScreen("underReview")}>📋 Under Review ({reviewClaims.length})</button>
      </div>
    </div>
  );

  /* ── Non-Recurring ── */
  const renderNonRecurring = () => (
    <NonRecurringEquipmentPage
      project={selectedProject}
      onSubmit={(data, headName) => {
        const id = Date.now();
        pushClaim(selectedProject.id, { id, type: "Non-Recurring", head: headName, amount: Number(data.amount || 0), date: today(), status: "review", reportHTML: data._reportHTML || "" });
        showSuccessFor();
        setTimeout(() => setScreen("underReview"), 2200);
      }}
      onBack={() => setScreen("headType")}
    />
  );

  /* ── Recurring selection ── */
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

  const renderRecurringHead = () => {
    if (recurringHead === "manpower") return <ManpowerPage onBack={() => setScreen("recurring")} selectedProject={selectedProject} />;
    if (recurringHead === "consumables") return <ConsumablesPage project={selectedProject} onSubmit={handleRecurringSubmit} onBack={() => setScreen("recurring")} />;
    if (recurringHead === "travel") return <TravelPage project={selectedProject} onSubmit={handleRecurringSubmit} onBack={() => setScreen("recurring")} />;
    if (recurringHead === "contingency") return <ContingencyPage project={selectedProject} onSubmit={handleRecurringSubmit} onBack={() => setScreen("recurring")} />;
    if (recurringHead === "otherExpenses") return <OtherExpensesPage project={selectedProject} onSubmit={handleRecurringSubmit} onBack={() => setScreen("recurring")} />;
    return null;
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
          <button className={`review-tab ${reviewTab === "review" ? "active-under" : ""}`} onClick={() => setReviewTab("review")}>⏳ Under Review <span className="review-tab-count">{reviewClaims.length}</span></button>
          <button className={`review-tab ${reviewTab === "approved" ? "active-approved" : ""}`} onClick={() => setReviewTab("approved")}>✅ Approved <span className="review-tab-count">{approvedClaims.length}</span></button>
        </div>
        {displayClaims.length === 0 ? (
          <div className="empty-bills"><div className="empty-icon">{reviewTab === "review" ? "⏳" : "✅"}</div>{reviewTab === "review" ? "No claims under review." : "No approved claims yet."}</div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(0,100,220,0.07)" }}>
            <table className="review-table">
              <thead><tr><th>#</th><th>Date</th><th>Type</th><th>Head</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {displayClaims.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ color: "rgba(20,30,70,0.4)", fontWeight: 700 }}>{i + 1}</td>
                    <td>{c.date}</td>
                    <td><span className="type-badge">{c.type}</span></td>
                    <td><span className="head-badge-purple">{c.head}</span></td>
                    <td className="amount-cell">{fmt(c.amount)}</td>
                    <td>{c.status === "review" ? <span className="status-badge-review">Under Review</span> : <span className="status-badge-approved">✓ Approved</span>}</td>
                    <td>
                      <div className="review-action-group">
                        <button className="preview-btn" onClick={() => setPdfPreview({ name: `${c.head}_report.html`, url: null, html: c.reportHTML })}>👁 Preview</button>
                        <button className="download-btn" onClick={() => generateReportPDF(c, "download")}>⬇ Download</button>
                        {c.status === "review" && <button className="approve-btn" onClick={() => approveClaim(selectedProject.id, c.id)}>✓ Approve</button>}
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
            <div className="settled-modal-actions"><button className="modal-close-btn" onClick={() => setSettledProject(null)}>✕ Close</button></div>
          </div>
          <div className="settled-modal-body">
            <div className="settled-tabs">
              {PROJECTS.map(p => (
                <button key={p.id} className={`settled-tab ${settledTab === p.id ? "active" : ""}`} onClick={() => setSettledTab(p.id)}>
                  {p.projectNo} — {p.title}
                  {projectClaims(p.id).filter(c => c.status === "approved").length > 0 && <span style={{ marginLeft: 6, background: "rgba(34,197,94,0.15)", color: "#22c55e", borderRadius: 999, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{projectClaims(p.id).filter(c => c.status === "approved").length}</span>}
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
                        <td style={{ color: "rgba(20,30,70,0.35)", fontWeight: 700 }}>{i + 1}</td>
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

  return (
    <>
      <style>{css}</style>
      <div className="slip-page">
        {screen === "projects" && renderProjects()}
        {screen === "headType" && renderHeadType()}
        {screen === "nonRecurring" && renderNonRecurring()}
        {screen === "recurring" && renderRecurring()}
        {screen === "recurringHead" && renderRecurringHead()}
        {screen === "underReview" && renderUnderReview()}

        {settledProject && renderSettledModal()}

        {showSuccess && (
          <div className="success-overlay">
            <div className="success-box">
              <div className="success-check">✓</div>
              <h2>Claim Submitted</h2>
              <p>Your claim has been sent for review</p>
            </div>
          </div>
        )}

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