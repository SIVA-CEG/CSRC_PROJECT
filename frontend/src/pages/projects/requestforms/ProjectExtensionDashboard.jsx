// PATH: frontend/src/pages/projects/requestforms/ProjectExtensionDashboard.jsx
import React, { useEffect, useState } from "react";
import "./ProjectExtensionDashboard.css";
import { useProjectContext } from "../requestforms/ProjectContext";

export default function ProjectExtensionDashboard({ onNavigate }) {
  const { extActive, extTransferred, extCompleted } = useProjectContext();

  const stats = {
    total:    extActive.length + extTransferred.length + extCompleted.length,
    pending:  extActive.length + extTransferred.length,
    approved: extCompleted.length,
    declined: extCompleted.filter(r => r.status === "declined").length,
  };

  const statCards = [
    { label: "Total Requests", value: stats.total,    color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
    { label: "Under Review",   value: stats.pending,  color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
    { label: "Approved",       value: stats.approved, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Declined",       value: stats.declined, color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  ];

  // Type (without / with financial support) is chosen ONLY here.
  // The destination route encodes the type, same convention as ReappropriationDashboard.
  const actions = [
    {
      key: "without",
      route: "project-extension-without",
      icon: "📅",
      title: "Extension without Financial Support",
      desc: "Request a no-cost timeline extension. The agency extends the project period without releasing any additional funds.",
      chips: ["No new grant", "Timeline only", "CSRC Proceedings"],
      accent: "#0369a1", light: "#f0f9ff", border: "#bae6fd",
    },
    {
      key: "with",
      route: "project-extension-with",
      icon: "💰",
      title: "Extension with Financial Support",
      desc: "Combine a timeline extension with an additional grant instalment released by the funding agency.",
      chips: ["Grant + bank details", "Timeline extension", "CSRC Proceedings"],
      accent: "#15803d", light: "#f0fdf4", border: "#bbf7d0",
    },
    {
      key: "history",
      route: "project-extension-history",
      icon: "📜",
      title: "Extension History",
      desc: "Track all submitted extension requests, view approval status, and download official CSRC letters.",
      chips: ["Status tracking", "PDF download", "Full history"],
      accent: "#475569", light: "#f8fafc", border: "#e2e8f0",
    },
  ];

  return (
    <div className="ped-page">
      {/* Header */}
      <div className="ped-header">
        <div className="ped-eyebrow">CSRC — Faculty Portal</div>
        <h1 className="ped-title">Project Extension Dashboard</h1>
        <p className="ped-sub">
          Manage timeline extension requests and track proceedings across all your projects
        </p>
      </div>

      {/* Stats */}
      <div className="ped-stats">
        {statCards.map((c) => (
          <div
            key={c.label}
            className="ped-stat-card"
            style={{ "--sc": c.color, "--sb": c.bg, "--sbr": c.border }}
          >
            <div className="ped-stat-label">{c.label}</div>
            <div className="ped-stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="ped-divider">
        <span>What would you like to do?</span>
      </div>

      {/* Action Cards */}
      <div className="ped-cards">
        {actions.map((a) => (
          <button
            key={a.key}
            className="ped-card"
            style={{ "--ac": a.accent, "--al": a.light, "--ab": a.border }}
            onClick={() => onNavigate(a.route)}
          >
            <div className="ped-card-icon-wrap">
              <span className="ped-card-icon">{a.icon}</span>
            </div>
            <div className="ped-card-body">
              <div className="ped-card-title">{a.title}</div>
              <p className="ped-card-desc">{a.desc}</p>
              <div className="ped-card-chips">
                {a.chips.map((ch) => (
                  <span key={ch} className="ped-chip">{ch}</span>
                ))}
              </div>
            </div>
            <div className="ped-card-arrow">→</div>
          </button>
        ))}
      </div>

      {/* Info strip */}
      <div className="ped-info-strip">
        <span className="ped-info-icon">ℹ️</span>
        <span>
          Both extension types generate official CSRC proceedings in A4 format, matching the
          sanction document template. Submitted requests are routed through CSRC office staff
          for approval.
        </span>
      </div>
    </div>
  );
}