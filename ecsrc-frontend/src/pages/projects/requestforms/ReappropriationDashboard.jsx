import React, { useState, useEffect } from "react";
import "./ReappropriationDashboard.css";

export default function ReappropriationDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    approved: 0,
  });

  useEffect(() => {
    const user =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!user?.id) return;

    fetch(`http://localhost:5000/api/reappropriation/list?user_id=${user.id}`)
      .then((res) => res.json())
      .then((rows) => {
        if (!Array.isArray(rows)) return;

        setStats({
          total: rows.length,

          pending: rows.filter(
            (r) => (r.status || "").toUpperCase() === "PENDING",
          ).length,

          assigned: rows.filter((r) =>
            [
              "ASSIGNED",
              "ASSIGNED TO SUPERVISOR",
              "ASSIGNED TO DIRECTOR",
            ].includes((r.status || "").toUpperCase()),
          ).length,

          approved: rows.filter(
            (r) => (r.status || "").toUpperCase() === "COMPLETED",
          ).length,
        });
      })
      .catch(console.error);
  }, []);

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total,
      color: "#1d4ed8",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Yet To Be Assigned",
      value: stats.pending,
      color: "#b45309",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      label: "Assigned",
      value: stats.assigned,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    },
    {
      label: "Approved",
      value: stats.approved,
      color: "#15803d",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
  ];

  // Each action now carries its own claimType, which is the ONLY place this
  // selection happens. The destination route encodes the type directly
  // (see AppRouter.jsx) so ReappropriationPage no longer needs its own
  // type-selection landing screen.
  const actions = [
    {
      key: "without",
      route: "reappropriation-without",
      icon: "🔄",
      title: "Re-appropriation without Instalment",
      desc: "Re-allocate funds between budget heads from the existing unspent balance. No new instalment involved.",
      chips: ["No new instalment", "4-col proceeds table", "Instant PDF"],
      accent: "#7c3aed",
      light: "#f5f3ff",
      border: "#ddd6fe",
    },
    {
      key: "with",
      route: "reappropriation-with",
      icon: "📦",
      title: "Re-appropriation with Instalment",
      desc: "Combine a new instalment release (via PFMS) with re-appropriation of available funds.",
      chips: ["PFMS + TSA details", "6-col proceeds table", "Instant PDF"],
      accent: "#0369a1",
      light: "#f0f9ff",
      border: "#bae6fd",
    },
    {
      key: "history",
      route: "reappropriationhistory",
      icon: "📜",
      title: "Request History",
      desc: "Track all your submitted re-appropriation requests, view statuses, and download proceedings.",
      chips: ["Status tracking", "PDF download", "Full history"],
      accent: "#475569",
      light: "#f8fafc",
      border: "#e2e8f0",
    },
  ];

  return (
    <div className="rad-page">
      {/* Header */}
      <div className="rad-header">
        <div className="rad-eyebrow">CSRC — Faculty Portal</div>
        <h1 className="rad-title">Re-appropriation Dashboard</h1>
        <p className="rad-sub">
          Manage fund re-allocation requests and track proceedings across all
          your projects
        </p>
      </div>
      <div className="rad-back-row">
        <button
          className="rad-back-btn"
          onClick={() => onNavigate("requestforms")}
        >
          ← Back
        </button>
      </div>
      {/* Stats row */}
      <div className="rad-stats">
        {statCards.map((c) => (
          <div
            key={c.label}
            className="rad-stat-card"
            style={{ "--sc": c.color, "--sb": c.bg, "--sbr": c.border }}
          >
            <div className="rad-stat-label">{c.label}</div>
            <div className="rad-stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="rad-divider">
        <span>What would you like to do?</span>
      </div>

      {/* Action cards */}
      <div className="rad-cards">
        {actions.map((a) => (
          <button
            key={a.key}
            className="rad-card"
            style={{ "--ac": a.accent, "--al": a.light, "--ab": a.border }}
            onClick={() => onNavigate(a.route)}
          >
            <div className="rad-card-icon-wrap">
              <span className="rad-card-icon">{a.icon}</span>
            </div>
            <div className="rad-card-body">
              <div className="rad-card-title">{a.title}</div>
              <p className="rad-card-desc">{a.desc}</p>
              <div className="rad-card-chips">
                {a.chips.map((ch) => (
                  <span key={ch} className="rad-chip">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
            <div className="rad-card-arrow">→</div>
          </button>
        ))}
      </div>

      {/* Info strip */}
      <div className="rad-info-strip">
        <span className="rad-info-icon">ℹ️</span>
        <span>
          Both request types generate official CSRC proceedings in A4 format,
          matching the sanction document template. Submitted requests are routed
          to CSRC for approval.
        </span>
      </div>
    </div>
  );
}
