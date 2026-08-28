import React, { useState, useEffect, useRef } from "react";
import "./ReappropriationHistory.css";
import html2pdf from "html2pdf.js";
import { ReportWithout, ReportWith } from "./ReappropriationPage";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const fmtAmt = (n) => {
  const num = parseFloat(n) || 0;
  return num ? `${num.toLocaleString("en-IN")}/-` : "—";
};

/* ─── Status Badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    PENDING: {
      label: "Under Review",
      bg: "#fffbeb",
      color: "#b45309",
      dot: "#f59e0b",
    },
    ASSIGNED: {
      label: "Assigned",
      bg: "#eff6ff",
      color: "#1d4ed8",
      dot: "#3b82f6",
    },
    TRANSFERRED: {
      label: "In Review",
      bg: "#eff6ff",
      color: "#1d4ed8",
      dot: "#3b82f6",
    },
    COMPLETED: {
      label: "Approved",
      bg: "#f0fdf4",
      color: "#15803d",
      dot: "#22c55e",
    },
    APPROVED: {
      label: "Approved",
      bg: "#f0fdf4",
      color: "#15803d",
      dot: "#22c55e",
    },
    approved: {
      label: "Approved",
      bg: "#f0fdf4",
      color: "#15803d",
      dot: "#22c55e",
    },
    declined: {
      label: "Declined",
      bg: "#fef2f2",
      color: "#b91c1c",
      dot: "#ef4444",
    },
  };
  const s = map[status] || {
    label: status,
    bg: "#f1f5f9",
    color: "#64748b",
    dot: "#94a3b8",
  };
  return (
    <span className="rah-badge" style={{ background: s.bg, color: s.color }}>
      <span className="rah-badge-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

/* ─── Preview Modal ────────────────────────────────────────────────────────── */
function PreviewModal({ item, onClose }) {
  // reportRef wraps only the actual report content for PDF generation.
  // A separate scaled wrapper is used for the visual preview so the PDF
  // always captures the full 210mm layout at native scale.
  const reportRef = useRef(null); // native-scale, off-screen
  const previewRef = useRef(null); // scaled visual preview
  const isWith = item.claimType === "with";

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Reappropriation_${item.agency || "Request"}_${item.id || ""}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  };

  const reportProps = {
    data: {
      ...item,
      previousInstallments: item.previousInstallments || [],
    },
    budgetHeads: item.budgetHeads || [],
    reapPairs: item.reapPairs || [],
  };

  return (
    <div
      className="rah-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="rah-modal">
        {/* ── Header ── */}
        <div className="rah-modal-header">
          <div className="rah-modal-header-left">
            <div className="rah-modal-eyebrow">
              {isWith ? "📦 With Instalment" : "🔄 Without Instalment"}
            </div>
            <div className="rah-modal-title">{item.projectName}</div>
          </div>
          <div className="rah-modal-header-right">
            <button className="rah-btn rah-btn-download" onClick={downloadPDF}>
              📄 Download PDF
            </button>
            <button className="rah-btn rah-btn-close" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* ── Body: scaled visual preview ── */}
        <div className="rah-modal-body">
          {/* Scaled preview shown to the user */}
          <div className="rah-preview-scaler-wrap">
            <div className="rah-preview-scaler" ref={previewRef}>
              {isWith ? (
                <ReportWith {...reportProps} />
              ) : (
                <ReportWithout {...reportProps} />
              )}
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
          {isWith ? (
            <ReportWith {...reportProps} />
          ) : (
            <ReportWithout {...reportProps} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */
export default function ReappropriationHistory({ onNavigate }) {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  useEffect(() => {
    const user =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/reappropriation/list?user_id=${user.id}`)
      .then((r) => r.json())
      .then(async (rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return;

        const mapped = await Promise.all(
          rows.map(async (r) => {
            let reapPairs = [];
            let budgetHeads = [];
            let previousInstallments = [];

            try {
              const [detailRes, headsRes, prevRes] = await Promise.all([
                fetch(
                  `http://localhost:5000/api/reappropriation/detail/${r.reappropriation_id}`,
                ),
                fetch(
                  `http://localhost:5000/api/reappropriation/heads/${r.project_id}/${r.installment_id}`,
                ),
                fetch(
                  `http://localhost:5000/api/reappropriation/previous-installments/${r.project_id}/${r.installment_id}`,
                ),
              ]);

              const detail = await detailRes.json();

              reapPairs = detail.reap_pairs || [];

              if (headsRes.ok) {
                budgetHeads = await headsRes.json();
              }

              if (prevRes.ok) {
                previousInstallments = await prevRes.json();
              }
            } catch (err) {
              console.error(err);
            }

            let extra = r.extra || {};
            if (typeof extra === "string") {
              try {
                extra = JSON.parse(extra);
              } catch {
                extra = {};
              }
            }

            let refs = r.references || [];
            if (typeof refs === "string") {
              try {
                refs = JSON.parse(refs);
              } catch {
                refs = [];
              }
            }
            if (!Array.isArray(refs)) refs = [];

            return {
              id: `REAP-${r.reappropriation_id}`,
              project_id: r.project_id,
              installment_id: r.installment_id,
              claimType: r.reap_type || "without",
              projectName: r.project_title || "",
              agency: r.funding_agency || "",
              projectScheme: r.scheme || "",
              piName: r.pi_name || "",
              piDesig: r.pi_desig || "",
              piDept: r.pi_dept || "",
              piCampus: r.pi_campus || "",
              startDate: r.project_start_date
                ? new Date(r.project_start_date).toLocaleDateString("en-GB")
                : "",
              endDate: r.project_end_date
                ? new Date(r.project_end_date).toLocaleDateString("en-GB")
                : "",
              proceedingNo: r.proceeding_no || "",
              proceedingDate: r.proceeding_date || "",
              mhNo: r.mh_no || "",
              sanctionRegVol: r.sanction_reg_vol || "",
              sanctionRegSl: r.sanction_reg_sl || "",
              sanctionRegPage: r.sanction_reg_page || "",
              directorName: r.director_name || "",
              references: refs,
              status: (r.status || "PENDING").toUpperCase(),
              submittedOn: r.created_at
                ? new Date(r.created_at).toLocaleDateString("en-GB")
                : "",
              // without-installment fields
              reapFromHead: reapPairs[0]?.from_head || "",
              reapToHead: reapPairs[0]?.to_head || "",
              reapAmount: reapPairs[0]?.amount || "",
              reapPairs: reapPairs.map((p) => ({
                fromHead: p.from_head,
                toHead: p.to_head,
                amount: p.amount,
                amountWords: "",
                refCited: "",
              })),
              budgetHeads,
              // with-installment fields
              currentInstallmentNo: extra.current_installment_no || "",
              currentInstallmentAmount: extra.current_installment_amount || "",
              currentInstallmentWords: extra.current_installment_words || "",
              bankName: extra.bank_name || "",
              pfmsRefNo: extra.pfms_ref_no || "",
              pfmsRefCited: extra.pfms_ref_cited || "",
              tsa: extra.tsa || "",
              tsaRefCited: extra.tsa_ref_cited || "",
              toDesig: extra.to_desig || "",
              previousInstallments,
            };
          }),
        );
        setHistory(mapped);
      })
      .catch(console.error);
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, typeFilter]);
  const filtered = history.filter((item) => {
    const q = search.toLowerCase();
    const ms =
      !q ||
      item.projectName?.toLowerCase().includes(q) ||
      item.agency?.toLowerCase().includes(q) ||
      item.piName?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q);
    const fs =
      filter === "all"
        ? true
        : filter === "pending"
          ? item.status === "PENDING"
          : filter === "assigned"
            ? item.status === "ASSIGNED" ||
              item.status === "ASSIGNED TO SUPERVISOR" ||
              item.status === "ASSIGNED TO DIRECTOR"
            : filter === "approved"
              ? item.status === "COMPLETED"
              : true;
    const ts =
      typeFilter === "all"
        ? true
        : typeFilter === "without"
          ? item.claimType === "without"
          : typeFilter === "with"
            ? item.claimType === "with"
            : true;
    return ms && fs && ts;
  });
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const paginatedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const counts = {
    total: history.length,

    pending: history.filter((r) => r.status === "PENDING").length,

    assigned: history.filter(
      (r) =>
        r.status === "ASSIGNED" ||
        r.status === "ASSIGNED TO SUPERVISOR" ||
        r.status === "ASSIGNED TO DIRECTOR",
    ).length,

    approved: history.filter((r) => r.status === "COMPLETED").length,
  };

  return (
    <div className="rah-page">
      {/* Header */}
      <div className="rah-header">
        <button
          className="rah-back-btn"
          onClick={() => onNavigate("reappropriationdashboard")}
        >
          ← Back
        </button>

        <h1 className="rah-title">Re-appropriation History</h1>
        <p className="rah-sub">
          All submitted re-appropriation requests and their current status
        </p>
      </div>

      {/* Stats */}
      <div className="rah-stats">
        {[
          {
            label: "Total",
            value: counts.total,
            color: "#1d4ed8",
            bg: "#eff6ff",
            border: "#bfdbfe",
          },
          {
            label: "Yet To Be Assigned",
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
            label: "Approved",
            value: counts.approved,
            color: "#15803d",
            bg: "#f0fdf4",
            border: "#bbf7d0",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rah-stat"
            style={{ background: c.bg, borderColor: c.border }}
          >
            <div className="rah-stat-label">{c.label}</div>
            <div className="rah-stat-value" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="rah-controls">
        <div className="rah-search-wrap">
          <svg
            className="rah-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="rah-search"
            type="text"
            placeholder="Search by project, agency, PI, ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="rah-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
        <div className="rah-filters">
          <div className="rah-filter-group">
            <span className="rah-filter-label">Type:</span>
            {[
              ["all", "All Types"],
              ["without", "Without Inst."],
              ["with", "With Inst."],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`rah-filter-btn ${typeFilter === v ? "active" : ""}`}
                onClick={() => setTypeFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="rah-filter-group">
            <span className="rah-filter-label">Status:</span>
            {[
              ["all", "All"],
              ["pending", "Yet To Be Assigned"],
              ["assigned", "Assigned"],
              ["approved", "Approved"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={`rah-filter-btn ${filter === v ? "active" : ""}`}
                onClick={() => setFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rah-table-wrap">
        {filtered.length === 0 ? (
          <div className="rah-empty">
            <div className="rah-empty-icon">📭</div>
            <div className="rah-empty-title">
              {search ? `No results for "${search}"` : "No requests yet"}
            </div>
            <div className="rah-empty-sub">
              {!search &&
                "Submit your first re-appropriation request to see it here."}
            </div>
          </div>
        ) : (
          <table className="rah-table">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Request ID</th>
                <th>Project / PI</th>
                <th>Agency</th>
                <th>Type</th>
                <th>Details</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((item, idx) => (
                <tr key={item.id}>
                  <td className="rah-sl">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="rah-id">{item.id}</td>
                  <td>
                    <div className="rah-project-name">{item.projectName}</div>
                    {item.piName && (
                      <div className="rah-pi-name">{item.piName}</div>
                    )}
                  </td>
                  <td>
                    <span className="rah-agency-chip">{item.agency}</span>
                    {item.projectScheme && (
                      <div className="rah-scheme">{item.projectScheme}</div>
                    )}
                  </td>
                  <td>
                    {item.claimType === "with" ? (
                      <span className="rah-type-chip rah-type-with">
                        📦 With Inst.
                      </span>
                    ) : (
                      <span className="rah-type-chip rah-type-without">
                        🔄 Without Inst.
                      </span>
                    )}
                  </td>
                  <td>
                    {item.claimType === "without" ? (
                      <div className="rah-detail-lines">
                        <div>
                          <span>From:</span> {item.reapFromHead || "—"}
                        </div>
                        <div>
                          <span>To:</span> {item.reapToHead || "—"}
                        </div>
                        {item.reapAmount && (
                          <div>
                            <span>Amt:</span> ₹
                            {Number(item.reapAmount).toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rah-detail-lines">
                        <div>
                          <span>Inst:</span> {item.currentInstallmentNo || "—"}
                        </div>
                        {item.currentInstallmentAmount && (
                          <div>
                            <span>Amt:</span> ₹
                            {Number(
                              item.currentInstallmentAmount,
                            ).toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="rah-date">{item.submittedOn}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <div className="rah-row-actions">
                      <button
                        className="rah-btn rah-btn-preview"
                        onClick={() => setPreview(item)}
                      >
                        👁 Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="rah-pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>

          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}

      {preview && (
        <PreviewModal item={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
