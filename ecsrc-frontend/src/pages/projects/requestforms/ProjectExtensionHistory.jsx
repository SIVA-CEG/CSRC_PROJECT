import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ProjectExtensionHistory.css";
import html2pdf from "html2pdf.js";
import { useProjectContext } from "../requestforms/ProjectContext";

const parseDMY = (str) => {
  if (!str) return null;
  const [d, m, y] = str.split("-");
  return new Date(+y, +m - 1, +d);
};

const durationBetween = (startDMY, endDate) => {
  const start = parseDMY(startDMY);
  if (!start || !endDate) return "";
  const diffMs = endDate - start;
  if (diffMs <= 0) return "";
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays} Days`;
};

/* ─── Live report preview ──────────────────────────────────────────────────── */
function ExtensionReportPreview({ draft }) {
  const isWith = draft.extensionType === "with";
  const piName =
    typeof draft.pi === "object"
      ? draft.pi?.name
      : draft.pi || draft.piName || "";
  const piDesig =
    typeof draft.pi === "object" ? draft.pi?.designation : draft.piDesig || "";
  const piDept =
    typeof draft.pi === "object"
      ? draft.pi?.department
      : draft.piDept || draft.department || "";
  const piCampus =
    typeof draft.pi === "object" ? draft.pi?.campus : draft.piCampus || "";

  const S = {
    page: {
      width: "210mm",
      background: "#fff",
      margin: "0 auto",
      padding: "14mm 16mm",
      boxSizing: "border-box",
      fontFamily: "Times New Roman, serif",
      fontSize: "11pt",
      color: "#000",
      lineHeight: 1.5,
    },
    bold: { fontWeight: "bold" },
    body: { textAlign: "justify", marginBottom: "10px" },
    sig: { textAlign: "right", marginTop: "36px", fontWeight: "bold" },
    to: { marginTop: "24px" },
    copy: { marginTop: "16px" },
    th: {
      border: "1px solid #000",
      padding: "5px 10px",
      textAlign: "center",
      fontWeight: "bold",
      background: "#f5f5f5",
    },
    td: { border: "1px solid #000", padding: "5px 10px" },
    tdC: { border: "1px solid #000", padding: "5px 10px", textAlign: "center" },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "10px 0 14px",
      fontSize: "10.5pt",
    },
  };

  const todayDMY = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <div style={S.page}>
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ ...S.bold, fontSize: "13pt" }}>
          Centre for Sponsored Research and Consultancy (CSRC)
        </div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai - 600 025.</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          <span style={S.bold}>
            Proceedings No. {draft.proceedingNo || "CSRC/EXT/____/____"}
          </span>
        </div>
        <div>{draft.proceedingDate || todayDMY()}</div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={S.bold}>Sub: </span>Anna University –{" "}
        {draft.agency || "——"} Project –{" "}
        <span style={S.bold}>{draft.projectTitle || "——"}</span> by{" "}
        <span style={S.bold}>{piName || "——"}</span> –{" "}
        <span style={S.bold}>Extension of Project period</span>
        {isWith ? " with additional grant" : ""} – Sanction – Accorded
      </div>

      {(draft.references || []).filter((r) => r.text).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={S.bold}>Ref: </span>
          {draft.references
            .filter((r) => r.text)
            .map((r, i) => (
              <div key={i}>
                {r.no}. {r.text}
              </div>
            ))}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "8px 0" }}>* * * * *</div>

      <div style={S.body}>
        The {draft.agency || "——"} has sanctioned a project entitled{" "}
        <span style={S.bold}>"{draft.projectTitle || "——"}"</span>
        {draft.projectScheme ? (
          <>
            {" "}
            under <span style={S.bold}>"{draft.projectScheme}"</span>
          </>
        ) : (
          ""
        )}{" "}
        to <span style={S.bold}>{piName || "——"}</span>,{" "}
        {piDesig ? <span>{piDesig}, </span> : null}
        {piDept}
        {piCampus ? `, ${piCampus}` : ""}, as the Principal Investigator
        {draft.projectDuration ? (
          <>
            {" "}
            for the period of{" "}
            <span style={S.bold}>{draft.projectDuration}</span>
          </>
        ) : (
          ""
        )}
        {draft.sanctionedDate ? (
          <>
            {" "}
            from <span style={S.bold}>{draft.sanctionedDate}</span>
          </>
        ) : (
          ""
        )}
        {draft.originalEndDate ? (
          <>
            {" "}
            to <span style={S.bold}>{draft.originalEndDate}</span>
          </>
        ) : (
          ""
        )}
        {draft.totalCost ? (
          <>
            {" "}
            at a total cost of{" "}
            <span style={S.bold}>Rs.{draft.totalCost}/- </span>
          </>
        ) : (
          ""
        )}{" "}
        vide reference second cited above.
      </div>

      {(draft.previousExtensions || []).length > 0 && (
        <>
          <div style={S.body}>
            Further, the funding agency has already extended the tenure of the
            above mentioned project as per the details given below:
          </div>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Extension Period</th>
                <th style={S.th}>Funding agency approval</th>
              </tr>
            </thead>
            <tbody>
              {draft.previousExtensions.map((ext, i) => (
                <tr key={i}>
                  <td style={S.tdC}>{ext.period}</td>
                  <td style={S.td}>{ext.approval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div style={S.body}>
        Now, the funding agency has{" "}
        <span style={S.bold}>
          extended the duration of the above mentioned project up to{" "}
          {draft.revisedEndDate || "——"}
        </span>
        ,{" "}
        {isWith ? (
          <>
            with an additional grant of{" "}
            <span style={S.bold}>
              Rs.{draft.grantAmount || "——"}/- ({draft.grantAmountWords || "——"}
              )
            </span>{" "}
            (vide reference {draft.grantRefNo || "cited above"}).{" "}
          </>
        ) : (
          "without any additional grant (vide reference third cited). "
        )}
        In this connection, permission is hereby accorded to the Principal
        Investigator, {piName || "——"}, {piDesig ? `${piDesig}, ` : ""}
        {piDept}
        {piCampus ? `, ${piCampus}` : ""}, to carry out the project till{" "}
        <span style={S.bold}>{draft.revisedEndDate || "——"}</span>.
      </div>

      {isWith && draft.bankAccount && (
        <div style={S.body}>
          The expenditure for the above project will be debitable under M.H.No.{" "}
          {draft.mhNo || "——"}. The amount may be credited to the Bank Account
          No. <span style={S.bold}>{draft.bankAccount}</span>, IFSC Code:{" "}
          <span style={S.bold}>{draft.ifscCode}</span>, {draft.bankBranch}.
        </div>
      )}

      {draft.remarks && (
        <div style={{ ...S.body, fontStyle: "italic" }}>
          <span style={S.bold}>Note: </span>
          {draft.remarks}
        </div>
      )}

      <div style={S.sig}>{draft.directorName || "DIRECTOR, CSRC"}</div>

      <div style={S.to}>
        <div style={S.bold}>To</div>
        <div>The {piDesig || "Director"},</div>
        <div>{piDept},</div>
        {piCampus && <div>{piCampus},</div>}
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div style={S.copy}>
        <div style={S.bold}>Copy to :</div>
        <div>
          1. {piName}, {piDesig ? `${piDesig}, ` : ""}
          {piDept}
          {piCampus ? `, ${piCampus}` : ""} – MENT.
        </div>
        <div>2. CSRC – 3</div>
        <div>3. CSRC – 4</div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    PENDING: {
      label: "Awaiting Assignment",
      bg: "#fffbeb",
      color: "#b45309",
      dot: "#f59e0b",
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "#f5f3ff",
      color: "#7c3aed",
      dot: "#8b5cf6",
    },
    "ASSIGNED WITH SUPERVISOR": {
      label: "Assigned With Supervisor",
      bg: "#eef2ff",
      color: "#4338ca",
      dot: "#6366f1",
    },
    "ASSIGNED WITH DIRECTOR": {
      label: "Assigned With Director",
      bg: "#ecfeff",
      color: "#0891b2",
      dot: "#06b6d4",
    },
    COMPLETED: {
      label: "Completed",
      bg: "#f0fdf4",
      color: "#15803d",
      dot: "#22c55e",
    },
  };
  const s = map[status] || {
    label: status,
    bg: "#f1f5f9",
    color: "#64748b",
    dot: "#94a3b8",
  };
  return (
    <span className="peh-badge" style={{ background: s.bg, color: s.color }}>
      <span className="peh-badge-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

/* ─── Preview Modal ────────────────────────────────────────────────────────── */
// reportRef   → hidden native-scale div for PDF export (never scaled)
// previewRef  → visible scaled version shown to the user
function PreviewModal({ item, onClose }) {
  const reportRef = useRef(null); // native-scale, off-screen → used by html2pdf
  const isWith = item.extensionType === "with";

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Extension_${item.agency || "Request"}_${item.id || ""}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  };

  return (
    <div
      className="peh-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="peh-modal">
        {/* ── Header — always fully visible, never squished ── */}
        <div className="peh-modal-header">
          <div className="peh-modal-header-left">
            <div className="peh-modal-eyebrow">
              {isWith
                ? "💰 With Financial Support"
                : "📅 Without Financial Support"}
            </div>
            <div className="peh-modal-title">
              {item.projectTitle || "Extension Request"}
            </div>
          </div>
          <div className="peh-modal-header-right">
            <button className="peh-btn peh-btn-download" onClick={downloadPDF}>
              📄 Download PDF
            </button>
            <button className="peh-btn peh-btn-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* ── Body: scaled visual preview ── */}
        <div className="peh-modal-body">
          <div className="peh-preview-scaler-wrap">
            <div className="peh-preview-scaler">
              <ExtensionReportPreview draft={item} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden native-scale copy used only for PDF export ── */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={reportRef}>
          <ExtensionReportPreview draft={item} />
        </div>
      </div>
    </div>
  );
}

/* ─── Track Modal ──────────────────────────────────────────────────────────── */
function TrackModal({ item, onClose }) {
  return (
    <div
      className="peh-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="peh-modal peh-modal-narrow">
        <div className="peh-modal-header">
          <div className="peh-modal-header-left">
            <div className="peh-modal-eyebrow">Transfer Timeline</div>
            <div className="peh-modal-title">{item.id}</div>
          </div>
          <div className="peh-modal-header-right">
            <button className="peh-btn peh-btn-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>
        <div className="peh-modal-body">
          <div className="peh-timeline">
            <div className="peh-timeline-item">
              <div className="peh-timeline-dot" />
              <div>
                <strong>Submitted</strong>
                <div className="peh-timeline-meta">
                  {item.submittedOn} — by{" "}
                  {typeof item.pi === "object" ? item.pi?.name : item.pi}
                </div>
              </div>
            </div>
            {(item.transferHistory || []).map((t, i) => {
              const toName = typeof t.to === "object" ? t.to?.name : t.to;
              const toRole = typeof t.to === "object" ? t.to?.role : null;
              return (
                <div className="peh-timeline-item" key={i}>
                  <div
                    className={`peh-timeline-dot ${t.approved ? "approved" : ""}`}
                  />
                  <div>
                    <strong>
                      {t.from} ({t.fromRole}) → {toName}
                      {toRole ? ` (${toRole})` : ""}
                    </strong>
                    <div className="peh-timeline-meta">{t.date}</div>
                    <div
                      className="peh-timeline-badge"
                      style={{
                        background: t.approved ? "#f0fdf4" : "#eff6ff",
                        color: t.approved ? "#15803d" : "#1d4ed8",
                      }}
                    >
                      {t.approved
                        ? "✔ Approved & Forwarded"
                        : "↪ Forwarded (Pending)"}
                    </div>
                  </div>
                </div>
              );
            })}
            {item.status === "COMPLETED" && (
              <div className="peh-timeline-item">
                <div className="peh-timeline-dot approved" />
                <div>
                  <strong>Approved &amp; Completed</strong>
                  <div className="peh-timeline-meta">
                    {item.completedOn || "—"}
                  </div>
                </div>
              </div>
            )}
            {(!item.transferHistory || item.transferHistory.length === 0) &&
              item.status !== "COMPLETED" && (
                <div className="peh-timeline-empty">
                  No transfers yet — still with the CSRC office.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

const getUser = () => {
  try {
    return (
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"))
    );
  } catch {
    return null;
  }
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function ProjectExtensionHistory({ onNavigate }) {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const user = getUser();
      const user_id = user?.id;
      const res = await axios.get(
        "http://localhost:5000/api/extensions/history",
        { params: { user_id } },
      );

      const mapped = res.data.map((row) => {
        // ── Duration in months/years (human-readable for the report body) ──
        let projectDuration = "";
        if (row.project_start_date && row.project_end_date) {
          const start = new Date(row.project_start_date);
          const end = new Date(row.project_end_date);
          const months =
            (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth());
          if (months > 0) {
            const yrs = Math.floor(months / 12);
            const mos = months % 12;
            const parts = [];
            if (yrs > 0) parts.push(`${yrs} Year${yrs > 1 ? "s" : ""}`);
            if (mos > 0) parts.push(`${mos} Month${mos > 1 ? "s" : ""}`);
            projectDuration = parts.join(" and ");
          } else {
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (days > 0) projectDuration = `${days} Days`;
          }
        }

        // ── extensionType — inferred from whether a grant amount is stored ──
        // Add an `extension_type` column to project_extensions if you want
        // to store it explicitly. For now we fall back to "without" unless
        // the row explicitly says "with".
        const extensionType = row.extension_type || "without";

        return {
          id: row.id,
          projectTitle: row.project_title || "",
          agency: row.funding_agency || "",
          projectScheme: row.scheme || "",
          projectDuration,
          sanctionedDate: row.project_start_date
            ? new Date(row.project_start_date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")
            : "",
          originalEndDate:
            row.original_end_date || row.project_end_date
              ? new Date(row.original_end_date || row.project_end_date)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")
              : "",
          revisedEndDate: row.revised_end_date
            ? new Date(row.revised_end_date).toLocaleDateString("en-GB")
            : "",
          extensionPeriod: row.extension_period || "",
          extensionType,
          grantAmount: row.grant_amount || "",
          grantAmountWords: row.grant_amount_words || "",
          grantRefNo: row.grant_ref_no || "",
          bankAccount: row.bank_account || "",
          ifscCode: row.ifsc_code || "",
          bankBranch: row.bank_branch || "",
          mhNo: row.mh_no || "",
          totalCost: row.total_cost || "",
          proceedingNo: row.proceeding_no || "",
          proceedingDate: row.proceeding_date || "",
          directorName: row.director_name || "",
          remarks: row.reason || "",
          status: row.status || "PENDING",
          submittedOn: row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-GB")
            : "",
          pi: {
            name: row.staff_name || "",
            designation: row.designation || "",
            department: row.department || "",
            campus: row.campus || "",
          },
          references: Array.isArray(row.references_json)
            ? row.references_json
            : row.references_json
              ? (() => {
                  try {
                    return JSON.parse(row.references_json);
                  } catch {
                    return [];
                  }
                })()
              : [],
          previousExtensions: [],
          transferHistory: [],
          hasLetter: !!row.request_letter_path,
        };
      });

      setAll(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const counts = {
    total: all.length,
    pending: all.filter((r) => r.status === "PENDING").length,
    assigned: all.filter((r) =>
      [
        "ASSIGNED",
        "ASSIGNED WITH SUPERVISOR",
        "ASSIGNED WITH DIRECTOR",
      ].includes(r.status),
    ).length,
    completed: all.filter((r) => r.status === "COMPLETED").length,
  };

  const filtered = all.filter((item) => {
    const q = search.toLowerCase();
    const piName = typeof item.pi === "object" ? item.pi?.name : item.pi;
    const ms =
      !q ||
      item.projectTitle?.toLowerCase().includes(q) ||
      item.agency?.toLowerCase().includes(q) ||
      piName?.toLowerCase().includes(q) ||
      String(item.id)?.toLowerCase().includes(q);
    const fs =
      filter === "all"
        ? true
        : filter === "pending"
          ? item.status === "PENDING"
          : filter === "assigned"
            ? [
                "ASSIGNED",
                "ASSIGNED WITH SUPERVISOR",
                "ASSIGNED WITH DIRECTOR",
              ].includes(item.status)
            : filter === "completed"
              ? item.status === "COMPLETED"
              : true;
    const ts =
      typeFilter === "all"
        ? true
        : typeFilter === "without"
          ? item.extensionType === "without"
          : typeFilter === "with"
            ? item.extensionType === "with"
            : true;
    return ms && fs && ts;
  });

  return (
    <div className="peh-page">
      {/* Header */}
      <div className="peh-header">
        <h1 className="peh-title">Project Extension History</h1>
        <p className="peh-sub">
          All submitted extension requests and their current status
        </p>
        {onNavigate && (
          <button
            className="peh-new-btn"
            onClick={() => onNavigate("project-extension-dashboard")}
          >
            + New Request
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="peh-stats">
        {[
          {
            label: "Total",
            value: counts.total,
            color: "#1d4ed8",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Awaiting Assignment",
            value: counts.pending,
            color: "#b45309",
            bg: "#fffbeb",
            border: "#fde68a",
          },
          {
            label: "Assigned",
            value: counts.assigned,
            color: "#7c3aed",
            bg: "#f5f3ff",
            border: "#ddd6fe",
          },
          {
            label: "Completed",
            value: counts.completed,
            color: "#15803d",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="peh-stat"
            style={{ background: c.bg, borderColor: c.border }}
          >
            <div className="peh-stat-label">{c.label}</div>
            <div className="peh-stat-value" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="peh-controls">
        <div className="peh-search-wrap">
          <svg
            className="peh-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="peh-search"
            type="text"
            placeholder="Search by project, agency, PI, request ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="peh-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <div className="peh-filters">
          <div className="peh-filter-group">
            <span className="peh-filter-label">Type:</span>
            {[
              ["all", "All Types"],
              ["without", "No Grant"],
              ["with", "With Grant"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`peh-filter-btn ${typeFilter === v ? "active" : ""}`}
                onClick={() => setTypeFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="peh-filter-group">
            <span className="peh-filter-label">Status:</span>
            {[
              ["all", "All"],
              ["pending", "Awaiting Assignment"],
              ["assigned", "Assigned"],
              ["completed", "Completed"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`peh-filter-btn ${filter === v ? "active" : ""}`}
                onClick={() => setFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="peh-table-wrap">
        {filtered.length === 0 ? (
          <div className="peh-empty">
            <div className="peh-empty-icon">📭</div>
            <div className="peh-empty-title">
              {search
                ? `No results for "${search}"`
                : "No extension requests yet"}
            </div>
            <div className="peh-empty-sub">
              {!search && "Submit your first extension request to see it here."}
            </div>
            {!search && onNavigate && (
              <button
                className="peh-btn peh-btn-primary peh-mt16"
                onClick={() => onNavigate("project-extension-dashboard")}
              >
                + New Request
              </button>
            )}
          </div>
        ) : (
          <table className="peh-table">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Request ID</th>
                <th>Project / PI</th>
                <th>Agency</th>
                <th>Type</th>
                <th>Original End</th>
                <th>Extension</th>
                <th>Revised End</th>
                <th>Details</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const piName =
                  typeof item.pi === "object" ? item.pi?.name : item.pi;
                const piDept =
                  typeof item.pi === "object"
                    ? item.pi?.department
                    : item.department;
                const isWith = item.extensionType === "with";
                return (
                  <tr key={item.id}>
                    <td className="peh-sl">{idx + 1}</td>
                    <td className="peh-id">{item.id}</td>
                    <td>
                      <div className="peh-project-name">
                        {item.projectTitle}
                      </div>
                      {piName && <div className="peh-pi-name">{piName}</div>}
                      {piDept && (
                        <div className="peh-pi-dept">
                          {piDept?.split(",")[0]}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="peh-agency-chip">{item.agency}</span>
                      {item.projectScheme && (
                        <div className="peh-scheme">{item.projectScheme}</div>
                      )}
                    </td>
                    <td>
                      {isWith ? (
                        <span className="peh-type-chip peh-type-with">
                          💰 With Grant
                        </span>
                      ) : (
                        <span className="peh-type-chip peh-type-without">
                          📅 No Grant
                        </span>
                      )}
                    </td>
                    <td className="peh-date-cell">
                      {item.originalEndDate || "—"}
                    </td>
                    <td>
                      <span className="peh-ext-pill">
                        +{item.extensionPeriod || "—"}
                      </span>
                    </td>
                    <td className="peh-date-cell peh-revised">
                      {item.revisedEndDate || "—"}
                    </td>
                    <td>
                      {isWith ? (
                        <div className="peh-detail-lines">
                          <div>
                            <span>Grant:</span>{" "}
                            {item.grantAmount
                              ? `₹${Number(item.grantAmount).toLocaleString("en-IN")}`
                              : "—"}
                          </div>
                          <div>
                            <span>Bank:</span> {item.bankAccount || "—"}
                          </div>
                        </div>
                      ) : (
                        <div className="peh-detail-lines">
                          <div>
                            <span>No-cost extension</span>
                          </div>
                          <div>
                            <span>Letter:</span>{" "}
                            {item.hasLetter ? "✓ Attached" : "Not attached"}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="peh-date">{item.submittedOn}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <div className="peh-row-actions">
                        <button
                          className="peh-btn peh-btn-preview"
                          onClick={() => setPreview(item)}
                        >
                          👁 Preview
                        </button>
                        <button
                          className="peh-btn peh-btn-track"
                          onClick={() => setTracking(item)}
                        >
                          📍 Track
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {preview && (
        <PreviewModal item={preview} onClose={() => setPreview(null)} />
      )}
      {tracking && (
        <TrackModal item={tracking} onClose={() => setTracking(null)} />
      )}
    </div>
  );
}
