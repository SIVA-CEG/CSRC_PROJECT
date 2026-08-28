// PATH: frontend/src/pages/projects/projecttransfer/ProjectTransfer.jsx

import React, { useState, useEffect } from "react";

// ─── API base ───────────────────────────────────────────────────────────────
const API = "http://localhost:5000/api/project-transfer";

// ─── Get current logged-in faculty user ─────────────────────────────────────
const getCurrentUser = () => {
  try {
    const raw =
      sessionStorage.getItem("user") ||
      sessionStorage.getItem("faculty_user") ||
      sessionStorage.getItem("user") ||
      "{}";
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

// ─── Status configuration ────────────────────────────────────────────────────
const STATUS = {
  draft: {
    label: "Letter Generated — Pending Signature Upload",
    color: "#6d28d9",
    bg: "#ede9fe",
    dot: "#8b5cf6",
  },
  finish_later: {
    label: "Saved — Finish Later",
    color: "#92400e",
    bg: "#fef3c7",
    dot: "#f59e0b",
  },
  pending_faculty: {
    label: "Awaiting Recipient Confirmation",
    color: "#92400e",
    bg: "#fef3c7",
    dot: "#f59e0b",
  },
  accepted_by_faculty: {
    label: "Accepted — Awaiting CSRC Approval",
    color: "#1e40af",
    bg: "#dbeafe",
    dot: "#3b82f6",
  },
  rejected_by_faculty: {
    label: "Rejected by Recipient",
    color: "#991b1b",
    bg: "#fee2e2",
    dot: "#ef4444",
  },
  approved_by_csrc: {
    label: "Approved by CSRC — Transfer Complete",
    color: "#166534",
    bg: "#dcfce7",
    dot: "#22c55e",
  },
  rejected_by_csrc: {
    label: "Rejected by CSRC",
    color: "#991b1b",
    bg: "#fee2e2",
    dot: "#ef4444",
  },
};

const ACTIVE_STATUSES = [
  "draft",
  "finish_later",
  "pending_faculty",
  "accepted_by_faculty",
];

const TIMELINE_STEPS = [
  "pending_faculty",
  "accepted_by_faculty",
  "approved_by_csrc",
];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB");
};

// ─── html2pdf.js loader ──────────────────────────────────────────────────────
let html2pdfLoadPromise = null;
const loadHtml2Pdf = () => {
  if (typeof window !== "undefined" && window.html2pdf)
    return Promise.resolve(window.html2pdf);
  if (html2pdfLoadPromise) return html2pdfLoadPromise;
  html2pdfLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-lib="html2pdf"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.html2pdf));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load html2pdf.js")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
    script.async = true;
    script.dataset.lib = "html2pdf";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => reject(new Error("Failed to load html2pdf.js"));
    document.body.appendChild(script);
  });
  return html2pdfLoadPromise;
};

// ─── Transfer letter markup ──────────────────────────────────────────────────
const buildLetterInnerHTML = (draft) => `
  <div class="pt-letter-page">
    <div class="pt-fromto-row">
      <span class="pt-fromto-label">From</span>
      <span class="pt-fromto-block">
        ${draft.fromFacultyName}<br/>
        ${draft.fromFacultyDesignation || "Faculty"}<br/>
        ${draft.fromFacultyDept}<br/>
        Anna University, Chennai-25
      </span>
    </div>

    <div class="pt-fromto-row" style="margin-top:16px;">
      <span class="pt-fromto-label">To</span>
      <span class="pt-fromto-block">
        The Director,<br/>
        Centre for Sponsored Research and Consultancy,<br/>
        Anna University,<br/>
        Chennai-25
      </span>
    </div>

    <div class="pt-sir">Sir,</div>

    <div class="pt-subref"><strong>Sub:</strong> ${draft.sub || "____________________________________________"}</div>
    <div class="pt-subref"><strong>Ref:</strong> ${(draft.ref || "____________________________________________").replace(/\n/g, "<br/>&nbsp;&nbsp;&nbsp;&nbsp;")}</div>

    <div class="pt-divider">-------</div>

    <div class="pt-para">
      The sponsored project titled <strong>"${draft.title}"</strong> (File No: <strong>${draft.fileNo}</strong>,
      Sanctioned Cost: ₹ ${draft.cost}, Funding Agency: ${draft.fundingAgency}) is currently held by
      <strong>${draft.fromFacultyName}</strong>, ${draft.fromFacultyDept}, as Principal Investigator.
      It is proposed to transfer the Principal Investigator-ship of the above project to
      <strong>${draft.toFacultyName}</strong>, ${draft.toFacultyDept}.
    </div>

    <div class="pt-para">
      ${
        (draft.reason || "").trim().replace(/\n/g, "<br/>") ||
        "____________________________________________________________________________<br/>____________________________________________________________________________"
      }
    </div>

    <div class="pt-para">
      In this regard, it is requested that the Centre kindly take the above on record and process
      the necessary transfer of Principal Investigator-ship.
    </div>

    <div class="pt-para">Thanking you,</div>

    <div class="pt-signrow">
      <div class="pt-signcol">
        <div class="pt-signline">&nbsp;</div>
        <div class="pt-signname">${draft.fromFacultyName}</div>
        <div class="pt-signrole">Transferring Faculty (PI)<br/>Signature &amp; Date</div>
      </div>
      <div class="pt-signcol">
        <div class="pt-signline">&nbsp;</div>
        <div class="pt-signname">${draft.toFacultyName}</div>
        <div class="pt-signrole">Receiving Faculty (PI)<br/>Signature &amp; Date</div>
      </div>
      <div class="pt-signcol">
        <div class="pt-signline">&nbsp;</div>
        <div class="pt-signname">Head of the Department</div>
        <div class="pt-signrole">Forwarded<br/>Signature &amp; Seal</div>
      </div>
    </div>
  </div>
`;

const LETTER_STYLE = `
  .pt-letter-page {
    width: 210mm; min-height: 297mm; background: #fff; padding: 20mm;
    font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.6;
    color: #000; box-sizing: border-box;
  }
  .pt-letter-page * { box-sizing: border-box; }
  .pt-fromto-label { display: inline-block; width: 40px; vertical-align: top; font-weight: 600; }
  .pt-fromto-block { display: inline-block; vertical-align: top; }
  .pt-sir { margin-top: 22px; }
  .pt-subref { margin-top: 10px; }
  .pt-divider { text-align: center; margin: 14px 0; letter-spacing: 2px; color: #444; }
  .pt-para { margin-top: 16px; text-align: justify; }
  .pt-signrow { display: flex; justify-content: space-between; margin-top: 90px; gap: 16px; }
  .pt-signcol { flex: 1; text-align: center; font-size: 11pt; }
  .pt-signline { border-top: 1px solid #000; margin-top: 56px; }
  .pt-signname { margin-top: 6px; font-weight: 600; }
  .pt-signrole { color: #444; font-size: 10pt; margin-top: 2px; }
`;

const renderLetterToContainer = (draft) => {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = `<style>${LETTER_STYLE}</style>${buildLetterInnerHTML(draft)}`;
  document.body.appendChild(container);
  return container;
};

const PDF_OPTS = (fileNo) => ({
  margin: 0,
  filename: `Project_Transfer_Letter_${String(fileNo).replace(/[^\w-]/g, "_")}.pdf`,
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
  jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
});

// ─── Small UI helpers ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending_faculty;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }}
      />
      {s.label}
    </span>
  );
};

const Timeline = ({ status }) => {
  const idx =
    status === "rejected_by_faculty" || status === "rejected_by_csrc"
      ? status === "rejected_by_faculty"
        ? 0
        : 1
      : TIMELINE_STEPS.indexOf(status);
  const isRejected =
    status === "rejected_by_faculty" || status === "rejected_by_csrc";
  const labels = ["Submitted", "Faculty Response", "CSRC Approval"];

  return (
    <div style={styles.timelineRow}>
      {labels.map((label, i) => {
        let state = "pending";
        if (isRejected && i === idx + 1) state = "rejected";
        else if (i <= idx) state = "done";
        return (
          <React.Fragment key={label}>
            <div style={styles.timelineStep}>
              <div
                style={{
                  ...styles.timelineDot,
                  background:
                    state === "done"
                      ? "#22c55e"
                      : state === "rejected"
                        ? "#ef4444"
                        : "#e5e7eb",
                  borderColor:
                    state === "done"
                      ? "#22c55e"
                      : state === "rejected"
                        ? "#ef4444"
                        : "#d1d5db",
                }}
              />
              <span
                style={{
                  ...styles.timelineLabel,
                  color: state === "pending" ? "#9ca3af" : "#374151",
                }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{
                  ...styles.timelineBar,
                  background: i < idx ? "#22c55e" : "#e5e7eb",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const emptyLetterFields = () => ({
  recipientId: "",
  sub: "",
  ref: "",
  reason: "",
});

// ─── Main component ──────────────────────────────────────────────────────────
const ProjectTransfer = ({ onNavigate }) => {
  const user = getCurrentUser();
  const userId = user.id || user.user_id;
  console.log(
    "[ProjectTransfer] resolved user object:",
    user,
    "→ userId used for API calls:",
    userId,
  );

  const [myProjects, setMyProjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [sentTransfers, setSentTransfers] = useState([]);
  const [receivedTransfers, setReceivedTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [modalStep, setModalStep] = useState("form");
  const [letterFields, setLetterFields] = useState(emptyLetterFields());
  const [letterDraft, setLetterDraft] = useState(null);
  const [signedFile, setSignedFile] = useState(null);
  const [pdfBusy, setPdfBusy] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Load all data ──────────────────────────────────────────────────────────
  const loadAll = async () => {
    if (!userId) return;
    setLoading(true);
    console.log(
      `[ProjectTransfer] loadAll() firing with userId=${userId} — URLs:`,
      [
        `${API}/my-projects?user_id=${userId}`,
        `${API}/sent?user_id=${userId}`,
        `${API}/received?user_id=${userId}`,
      ],
    );
    try {
      const [proj, fac, sent, recv] = await Promise.all([
        fetch(`${API}/my-projects?user_id=${userId}`).then((r) => r.json()),
        fetch(`${API}/faculty-list`).then((r) => r.json()),
        fetch(`${API}/sent?user_id=${userId}`).then((r) => r.json()),
        fetch(`${API}/received?user_id=${userId}`).then((r) => r.json()),
      ]);
      setMyProjects(Array.isArray(proj) ? proj : []);
      setFacultyList(Array.isArray(fac) ? fac : []);
      setSentTransfers(Array.isArray(sent) ? sent : []);
      setReceivedTransfers(Array.isArray(recv) ? recv : []);
    } catch (err) {
      console.error("Failed to load transfer data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [userId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleSection = (section) =>
    setActiveSection((prev) => (prev === section ? null : section));

  const activeTransferForProject = (projectId) =>
    sentTransfers.find(
      (t) => t.project_id === projectId && ACTIVE_STATUSES.includes(t.status),
    );

  const recipientFromId = (id) =>
    facultyList.find((f) => String(f.user_id) === String(id));

  // ── Open modal for new transfer ────────────────────────────────────────────
  const openTransferModal = (project) => {
    setModalProject(project);
    setModalStep("form");
    setLetterFields(emptyLetterFields());
    setLetterDraft(null);
    setSignedFile(null);
    setUploadError("");
    setShowModal(true);
  };

  // ── Resume a draft/finish_later transfer ───────────────────────────────────
  const resumeDraft = (transfer) => {
    setModalProject({
      id: transfer.project_id,
      file_no: transfer.file_no,
      title: transfer.title,
      cost: transfer.cost,
      funding_agency: transfer.funding_agency,
    });
    setLetterFields({
      recipientId: String(transfer.to_user_id),
      sub: transfer.sub || "",
      ref: transfer.ref || "",
      reason: transfer.reason || "",
    });
    setLetterDraft(transfer);
    setSignedFile(null);
    setUploadError("");
    setModalStep("letter");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalProject(null);
    setModalStep("form");
    setLetterFields(emptyLetterFields());
    setLetterDraft(null);
    setSignedFile(null);
    setUploadError("");
  };

  // ── Build letter draft object for PDF rendering ────────────────────────────
  const buildLetterDraftObj = () => {
    const recipient = recipientFromId(letterFields.recipientId);
    return {
      fileNo: modalProject?.file_no || modalProject?.fileNo || "",
      title: modalProject?.title || "",
      cost: modalProject?.cost || "",
      fundingAgency:
        modalProject?.funding_agency || modalProject?.fundingAgency || "",
      fromFacultyName: user.name || user.staff_name || "",
      fromFacultyDesignation: user.designation || "",
      fromFacultyDept: user.department || "",
      toFacultyName: recipient?.name || "",
      toFacultyDesignation: recipient?.designation || "",
      toFacultyDept: recipient?.department || "",
      sub: letterFields.sub,
      ref: letterFields.ref,
      reason: letterFields.reason,
    };
  };

  // ── Generate letter + save draft to DB ────────────────────────────────────
  const handleGenerateLetter = async () => {
    if (!modalProject || !letterFields.recipientId || !letterFields.sub.trim())
      return;

    // Save to DB if not already saved
    if (!letterDraft) {
      try {
        const res = await fetch(`${API}/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: modalProject.id,
            from_user_id: userId,
            to_user_id: letterFields.recipientId,
            sub: letterFields.sub,
            ref: letterFields.ref,
            reason: letterFields.reason,
            status: "draft",
          }),
        });
        const saved = await res.json();
        if (saved.error) throw new Error(saved.error);
        setLetterDraft(saved);
      } catch (err) {
        alert(`Could not save draft: ${err.message}`);
        return;
      }
    }

    setModalStep("letter");
  };

  const previewLetter = async () => {
    const draft = letterDraft
      ? {
          ...buildLetterDraftObj(),
          toFacultyName:
            letterDraft.to_name || buildLetterDraftObj().toFacultyName,
        }
      : buildLetterDraftObj();
    setPdfBusy("preview");
    const container = renderLetterToContainer(draft);
    try {
      await loadHtml2Pdf();
      const target = container.querySelector(".pt-letter-page");
      const url = await window
        .html2pdf()
        .set(PDF_OPTS(draft.fileNo))
        .from(target)
        .outputPdf("bloburl");
      window.open(url, "_blank");
    } catch {
      alert("Could not generate the PDF preview.");
    } finally {
      document.body.removeChild(container);
      setPdfBusy(null);
    }
  };

  const downloadLetter = async () => {
    const draft = buildLetterDraftObj();
    setPdfBusy("download");
    const container = renderLetterToContainer(draft);
    try {
      await loadHtml2Pdf();
      const target = container.querySelector(".pt-letter-page");
      await window.html2pdf().set(PDF_OPTS(draft.fileNo)).from(target).save();
    } catch {
      alert("Could not generate the PDF.");
    } finally {
      document.body.removeChild(container);
      setPdfBusy(null);
    }
  };

  // ── Finish later ──────────────────────────────────────────────────────────
  const handleFinishLater = async () => {
    if (letterDraft?.id) {
      try {
        await fetch(`${API}/${letterDraft.id}/finish-later`, { method: "PUT" });
      } catch (err) {
        console.error(err);
      }
    }
    closeModal();
    loadAll();
  };

  // ── Upload signed letter & submit ─────────────────────────────────────────
  const handleSignedFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const okType =
      file.type === "application/pdf" || file.type.startsWith("image/");
    if (!okType) {
      setUploadError(
        "Please upload the signed copy as an image (JPG/PNG) or PDF.",
      );
      return;
    }
    setSignedFile(file);
    setUploadError("");
  };

  const handleInitiateTransfer = async () => {
    if (!signedFile || !letterDraft?.id) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("letter", signedFile);
      const res = await fetch(`${API}/${letterDraft.id}/upload-letter`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      closeModal();
      loadAll();
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Faculty accept / reject ───────────────────────────────────────────────
  const handleAccept = async (transfer) => {
    try {
      await fetch(`${API}/${transfer.id}/faculty-accept`, { method: "PUT" });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (transfer) => {
    const remarks = window.prompt("Reason for rejection (optional):");
    if (remarks === null) return; // cancelled
    try {
      await fetch(`${API}/${transfer.id}/faculty-reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks }),
      });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  // ── View letter ───────────────────────────────────────────────────────────
  const viewSignedLetter = (transfer) => {
    if (!transfer.letter_path) return;
    const normalized = transfer.letter_path.replace(/\\/g, "/");
    const uploadsIndex = normalized.indexOf("uploads/");
    const relativePath =
      uploadsIndex !== -1 ? normalized.slice(uploadsIndex) : normalized;
    const url = `http://localhost:5000/${relativePath}`;
    window.open(url, "_blank");
  };

  // ── Counts ────────────────────────────────────────────────────────────────
  const pendingSentCount = sentTransfers.filter((t) =>
    ACTIVE_STATUSES.includes(t.status),
  ).length;
  const pendingReceivedCount = receivedTransfers.filter(
    (t) => t.status === "pending_faculty",
  ).length;
  const canGenerateLetter = !!(
    letterFields.recipientId && letterFields.sub.trim()
  );

  if (loading) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            Loading project transfer data…
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center", color: "#ef4444", fontSize: 14 }}>
          Not logged in. Please log in to access project transfers.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span
            style={styles.breadcrumbLink}
            onClick={() => onNavigate && onNavigate("home")}
          >
            Home
          </span>
          <span style={styles.breadcrumbSep}>›</span>
          <span
            style={styles.breadcrumbLink}
            onClick={() => onNavigate && onNavigate("projects")}
          >
            My Projects
          </span>
          <span style={styles.breadcrumbSep}>›</span>
          <span style={styles.breadcrumbCurrent}>Project Transfer</span>
        </div>
        <h1 style={styles.title}>Project Transfer</h1>
        <div style={styles.subtitle}>CSRC — Anna University</div>
      </div>

      {/* ── Two summary/selector cards ─────────────────────────── */}
      <div style={styles.summaryGrid}>
        <button
          style={{
            ...styles.summaryCard,
            ...(activeSection === "sent" ? styles.summaryCardActive : {}),
          }}
          onClick={() => toggleSection("sent")}
        >
          <div
            style={{
              ...styles.cardIcon,
              background: "#ede9fe",
              color: "#7c3aed",
            }}
          >
            📤
          </div>
          <div style={styles.summaryTextCol}>
            <div style={styles.cardTitle}>Transferred By Me</div>
            <div style={styles.cardSub}>
              {myProjects.length} project{myProjects.length !== 1 ? "s" : ""}{" "}
              held
              {pendingSentCount > 0 && <> · {pendingSentCount} in progress</>}
            </div>
          </div>
          <span
            style={{
              ...styles.summaryChevron,
              transform:
                activeSection === "sent" ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ›
          </span>
        </button>

        <button
          style={{
            ...styles.summaryCard,
            ...(activeSection === "received" ? styles.summaryCardActive : {}),
          }}
          onClick={() => toggleSection("received")}
        >
          <div
            style={{
              ...styles.cardIcon,
              background: "#dcfce7",
              color: "#16a34a",
            }}
          >
            📥
          </div>
          <div style={styles.summaryTextCol}>
            <div style={styles.cardTitle}>Transferred To Me</div>
            <div style={styles.cardSub}>
              {receivedTransfers.length} incoming
              {pendingReceivedCount > 0 && (
                <> · {pendingReceivedCount} need action</>
              )}
            </div>
          </div>
          <span
            style={{
              ...styles.summaryChevron,
              transform:
                activeSection === "received" ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ›
          </span>
        </button>
      </div>

      {/* ── Transferred By Me ─────────────────────────────────── */}
      {activeSection === "sent" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div
              style={{
                ...styles.cardIcon,
                background: "#ede9fe",
                color: "#7c3aed",
              }}
            >
              📤
            </div>
            <div>
              <div style={styles.cardTitle}>Transferred By Me</div>
              <div style={styles.cardSub}>
                Initiate a project transfer to another faculty
              </div>
            </div>
          </div>

          <div style={styles.cardBody}>
            {myProjects.length === 0 ? (
              <div style={styles.emptyBox}>
                No sanctioned projects currently held by you.
              </div>
            ) : (
              <div style={styles.projectList}>
                {myProjects.map((p) => {
                  const active = activeTransferForProject(p.id);
                  return (
                    <div key={p.id} style={styles.projectRow}>
                      <div style={styles.projectRowInfo}>
                        <span style={styles.projectFileNo}>
                          {p.file_no || p.fileNo}
                        </span>
                        <span style={styles.projectTitleText}>{p.title}</span>
                        <span style={styles.projectCost}>
                          {p.funding_agency} · ₹{" "}
                          {Number(p.cost || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {active ? (
                        active.status === "draft" ||
                        active.status === "finish_later" ? (
                          <div style={styles.draftRowActions}>
                            <StatusBadge status={active.status} />
                            <button
                              style={styles.continueBtn}
                              onClick={() => resumeDraft(active)}
                            >
                              Continue →
                            </button>
                          </div>
                        ) : (
                          <StatusBadge status={active.status} />
                        )
                      ) : (
                        <button
                          style={styles.transferBtn}
                          onClick={() => openTransferModal(p)}
                        >
                          Transfer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              style={styles.historyToggle}
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "▲ Hide" : "▼ View"} All Transfer Records (
              {sentTransfers.length})
            </button>

            {showHistory && (
              <div style={styles.historyList}>
                {sentTransfers.length === 0 ? (
                  <div style={styles.emptyBox}>No transfers initiated yet.</div>
                ) : (
                  sentTransfers.map((t) => (
                    <div key={t.id} style={styles.historyCard}>
                      <div style={styles.historyCardTop}>
                        <div>
                          <div style={styles.historyProjTitle}>{t.title}</div>
                          <div style={styles.historyMeta}>
                            {t.file_no} · To: {t.to_name}
                          </div>
                          <div style={styles.historyMeta}>
                            {t.funding_agency}
                          </div>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>

                      {t.status === "draft" || t.status === "finish_later" ? (
                        <>
                          <div style={styles.draftNote}>
                            📝 Letter generated on {fmtDate(t.created_at)} —
                            waiting on physical signatures from you, {t.to_name}
                            , and the HOD. Upload the signed copy whenever it's
                            ready.
                          </div>
                          <div style={styles.actionRow}>
                            <button
                              style={styles.letterBtn}
                              disabled={!!pdfBusy}
                              onClick={() => {
                                setLetterDraft(t);
                                previewLetter();
                              }}
                            >
                              {pdfBusy === "preview"
                                ? "Preparing…"
                                : "👁 Preview PDF"}
                            </button>
                            <button
                              style={styles.csrcApproveBtn}
                              disabled={!!pdfBusy}
                              onClick={() => {
                                setLetterDraft(t);
                                downloadLetter();
                              }}
                            >
                              {pdfBusy === "download"
                                ? "Preparing…"
                                : "⬇ Download PDF"}
                            </button>
                            <button
                              style={styles.transferBtn}
                              onClick={() => resumeDraft(t)}
                            >
                              Upload &amp; Initiate →
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Timeline status={t.status} />
                          {t.letter_path && (
                            <div style={styles.actionRow}>
                              <button
                                style={styles.letterBtn}
                                onClick={() => viewSignedLetter(t)}
                              >
                                📄 View Signed Letter
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      <div style={styles.historyDates}>
                        <span>Created: {fmtDate(t.created_at)}</span>
                        {t.letter_upload_date && (
                          <span>
                            Submitted: {fmtDate(t.letter_upload_date)}
                          </span>
                        )}
                        {t.faculty_response_date && (
                          <span>
                            Faculty Response: {fmtDate(t.faculty_response_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Transferred To Me ─────────────────────────────────── */}
      {activeSection === "received" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div
              style={{
                ...styles.cardIcon,
                background: "#dcfce7",
                color: "#16a34a",
              }}
            >
              📥
            </div>
            <div>
              <div style={styles.cardTitle}>Transferred To Me</div>
              <div style={styles.cardSub}>
                Projects other faculty want to transfer to you
              </div>
            </div>
          </div>

          <div style={styles.cardBody}>
            {receivedTransfers.length === 0 ? (
              <div style={styles.emptyBox}>No incoming project transfers.</div>
            ) : (
              <div style={styles.historyList}>
                {receivedTransfers.map((t) => (
                  <div key={t.id} style={styles.historyCard}>
                    <div style={styles.historyCardTop}>
                      <div>
                        <div style={styles.historyProjTitle}>{t.title}</div>
                        <div style={styles.historyMeta}>
                          {t.file_no} · From: {t.from_name}
                        </div>
                        <div style={styles.historyMeta}>
                          {t.funding_agency} · ₹{" "}
                          {Number(t.cost || 0).toLocaleString("en-IN")}
                        </div>
                        {t.from_dept && (
                          <div style={styles.historyMeta}>
                            {t.from_designation}, {t.from_dept}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    <Timeline status={t.status} />

                    {t.reason && (
                      <div style={styles.remarksBox}>
                        <strong>Reason given by sender:</strong> {t.reason}
                      </div>
                    )}

                    <div style={styles.historyDates}>
                      <span>
                        Submitted:{" "}
                        {fmtDate(t.letter_upload_date || t.created_at)}
                      </span>
                      {t.faculty_response_date && (
                        <span>
                          Your Response: {fmtDate(t.faculty_response_date)}
                        </span>
                      )}
                    </div>

                    {/* View signed letter */}
                    {t.letter_path && (
                      <div style={styles.actionRow}>
                        <button
                          style={styles.letterBtn}
                          onClick={() => viewSignedLetter(t)}
                        >
                          📄 View Signed Transfer Letter
                        </button>
                      </div>
                    )}

                    {/* Accept / Reject */}
                    {t.status === "pending_faculty" && (
                      <div style={styles.actionRow}>
                        <button
                          style={styles.acceptBtn}
                          onClick={() => handleAccept(t)}
                        >
                          ✓ Confirm &amp; Accept
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={() => handleReject(t)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}

                    {t.status === "rejected_by_faculty" && t.reject_remarks && (
                      <div
                        style={{
                          ...styles.remarksBox,
                          marginTop: 10,
                          color: "#991b1b",
                        }}
                      >
                        <strong>Rejection reason:</strong> {t.reject_remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Transfer Modal ──────────────────────────────────────── */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div
            style={{
              ...styles.modalBox,
              width: modalStep === "letter" ? 560 : 460,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <span>
                {modalStep === "form"
                  ? "Initiate Project Transfer"
                  : "Download, Sign & Upload Letter"}
              </span>
              <button style={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>

            {/* Step 1: Fill in details */}
            {modalStep === "form" && (
              <>
                <div style={styles.modalBody}>
                  <div style={styles.modalProjectBox}>
                    <div style={styles.modalProjectFile}>
                      {modalProject?.file_no}
                    </div>
                    <div style={styles.modalProjectTitle}>
                      {modalProject?.title}
                    </div>
                    <div style={styles.modalProjectCost}>
                      {modalProject?.funding_agency} · ₹{" "}
                      {Number(modalProject?.cost || 0).toLocaleString("en-IN")}
                    </div>
                  </div>

                  <label style={styles.modalLabel}>Transfer To (Faculty)</label>
                  <select
                    style={styles.modalSelect}
                    value={letterFields.recipientId}
                    onChange={(e) =>
                      setLetterFields((f) => ({
                        ...f,
                        recipientId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select faculty…</option>
                    {facultyList
                      .filter((f) => String(f.user_id) !== String(userId))
                      .map((f) => (
                        <option key={f.user_id} value={f.user_id}>
                          {f.name} — {f.designation}, {f.department}
                        </option>
                      ))}
                  </select>

                  <label style={styles.modalLabel}>
                    Sub (Subject line of the letter)
                  </label>
                  <input
                    style={styles.modalInput}
                    placeholder="e.g. AU – Project PI Change – Revised Sanction Requested – Reg."
                    value={letterFields.sub}
                    onChange={(e) =>
                      setLetterFields((f) => ({ ...f, sub: e.target.value }))
                    }
                  />

                  <label style={styles.modalLabel}>
                    Ref (one per line, optional)
                  </label>
                  <textarea
                    style={styles.modalTextarea}
                    rows={2}
                    placeholder={
                      "e.g.\n1. Sanction Proceedings No. ... dated ..."
                    }
                    value={letterFields.ref}
                    onChange={(e) =>
                      setLetterFields((f) => ({ ...f, ref: e.target.value }))
                    }
                  />

                  <label style={styles.modalLabel}>Reason for transfer</label>
                  <textarea
                    style={styles.modalTextarea}
                    rows={3}
                    placeholder="e.g. Owing to my superannuation / transfer, the responsibility of Principal Investigator is being handed over to…"
                    value={letterFields.reason}
                    onChange={(e) =>
                      setLetterFields((f) => ({ ...f, reason: e.target.value }))
                    }
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button style={styles.modalCancelBtn} onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    style={{
                      ...styles.modalSubmitBtn,
                      opacity: canGenerateLetter ? 1 : 0.5,
                      cursor: canGenerateLetter ? "pointer" : "not-allowed",
                    }}
                    onClick={handleGenerateLetter}
                    disabled={!canGenerateLetter}
                  >
                    Generate Letter →
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Download + Upload signed copy */}
            {modalStep === "letter" && (
              <>
                <div style={styles.modalBody}>
                  <div style={styles.letterStepIntro}>
                    This letter has been saved as a draft. Download it, get it
                    signed by <strong>you</strong>,{" "}
                    <strong>
                      {recipientFromId(letterFields.recipientId)?.name ||
                        "the recipient"}
                    </strong>
                    , and the <strong>Head of the Department</strong>, then come
                    back and upload the signed copy — you can close this window
                    any time and continue later from "Transferred By Me".
                  </div>

                  <div style={styles.actionRow}>
                    <button
                      style={styles.letterBtn}
                      disabled={!!pdfBusy}
                      onClick={previewLetter}
                    >
                      {pdfBusy === "preview"
                        ? "Preparing…"
                        : "👁 Preview Letter (PDF)"}
                    </button>
                    <button
                      style={styles.csrcApproveBtn}
                      disabled={!!pdfBusy}
                      onClick={downloadLetter}
                    >
                      {pdfBusy === "download"
                        ? "Preparing…"
                        : "⬇ Download Letter (PDF)"}
                    </button>
                  </div>

                  <label style={{ ...styles.modalLabel, marginTop: 18 }}>
                    Upload Signed Copy (image or PDF)
                  </label>
                  <label style={styles.uploadBox}>
                    <span style={styles.uploadBoxText}>
                      {signedFile
                        ? `✓ ${signedFile.name}`
                        : "Click to choose the signed, scanned letter…"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: "none" }}
                      onChange={handleSignedFileChange}
                    />
                  </label>
                  {uploadError && (
                    <div style={styles.uploadError}>{uploadError}</div>
                  )}
                </div>

                <div style={styles.modalFooter}>
                  <button
                    style={styles.modalCancelBtn}
                    onClick={handleFinishLater}
                  >
                    Finish Later
                  </button>
                  <button
                    style={{
                      ...styles.modalSubmitBtn,
                      opacity: signedFile && !submitting ? 1 : 0.5,
                      cursor:
                        signedFile && !submitting ? "pointer" : "not-allowed",
                    }}
                    onClick={handleInitiateTransfer}
                    disabled={!signedFile || submitting}
                  >
                    {submitting ? "Uploading…" : "Initiate Transfer"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fb",
    padding: "28px 32px 60px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#1f2937",
  },
  header: { marginBottom: 18 },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 10,
  },
  breadcrumbLink: { cursor: "pointer" },
  breadcrumbSep: { opacity: 0.5 },
  breadcrumbCurrent: { color: "#374151", fontWeight: 600 },
  title: { fontSize: 26, fontWeight: 700, margin: 0, color: "#111827" },
  subtitle: { fontSize: 13, color: "#9ca3af", marginTop: 4 },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 20,
  },
  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    textAlign: "left",
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    padding: "18px 20px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition:
      "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
  },
  summaryCardActive: {
    borderColor: "#a78bfa",
    boxShadow: "0 0 0 3px rgba(124,58,237,0.12)",
    background: "#fdfcff",
  },
  summaryTextCol: { flex: 1, minWidth: 0 },
  summaryChevron: {
    fontSize: 20,
    color: "#9ca3af",
    flexShrink: 0,
    transition: "transform 0.15s ease",
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    marginBottom: 20,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 20px",
    borderBottom: "1px solid #f1f2f4",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  cardTitle: { fontSize: 15.5, fontWeight: 700, color: "#111827" },
  cardSub: { fontSize: 12.5, color: "#9ca3af", marginTop: 2 },
  cardBody: { padding: "16px 20px 20px" },

  emptyBox: {
    padding: "22px 14px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13.5,
    background: "#fafafa",
    borderRadius: 10,
    border: "1px dashed #e5e7eb",
  },

  projectList: { display: "flex", flexDirection: "column", gap: 10 },
  projectRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    border: "1px solid #eef0f2",
    borderRadius: 10,
    background: "#fcfcfd",
  },
  projectRowInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },
  projectFileNo: { fontSize: 11.5, color: "#9ca3af", fontWeight: 600 },
  projectTitleText: {
    fontSize: 13.5,
    color: "#1f2937",
    fontWeight: 600,
    maxWidth: 340,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  projectCost: { fontSize: 12.5, color: "#059669", fontWeight: 600 },

  transferBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
  draftRowActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  continueBtn: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid #8b5cf6",
    background: "#fff",
    color: "#7c3aed",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },

  historyToggle: {
    marginTop: 16,
    width: "100%",
    padding: "9px 0",
    borderRadius: 9,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#374151",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 14,
  },
  historyCard: {
    border: "1px solid #eef0f2",
    borderRadius: 12,
    padding: "14px 16px",
    background: "#fcfcfd",
  },
  historyCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  historyProjTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    color: "#1f2937",
    maxWidth: 300,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  historyMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  historyDates: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    fontSize: 11.5,
    color: "#9ca3af",
    marginTop: 10,
  },

  remarksBox: {
    marginTop: 10,
    fontSize: 12.5,
    color: "#4b5563",
    background: "#f3f4f6",
    borderRadius: 8,
    padding: "8px 12px",
    lineHeight: 1.5,
  },
  draftNote: {
    marginTop: 10,
    fontSize: 12.5,
    color: "#5b21b6",
    background: "#f5f3ff",
    borderRadius: 8,
    padding: "8px 12px",
    lineHeight: 1.5,
  },

  timelineRow: {
    display: "flex",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 2,
  },
  timelineStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    width: 90,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "2px solid",
    flexShrink: 0,
  },
  timelineLabel: { fontSize: 10.5, textAlign: "center", fontWeight: 600 },
  timelineBar: { flex: 1, height: 2, marginTop: -18 },

  actionRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  acceptBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "1px solid #ef4444",
    background: "#fff",
    color: "#ef4444",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  letterBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  csrcApproveBtn: {
    padding: "7px 16px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },

  letterStepIntro: {
    fontSize: 12.5,
    color: "#4b5563",
    background: "#f3f4f6",
    borderRadius: 10,
    padding: "10px 12px",
    lineHeight: 1.6,
    marginBottom: 6,
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    border: "1.5px dashed #c4b5fd",
    borderRadius: 10,
    background: "#faf5ff",
    padding: "16px 12px",
    cursor: "pointer",
    marginTop: 4,
  },
  uploadBoxText: { fontSize: 12.5, color: "#6d28d9", fontWeight: 600 },
  uploadError: { fontSize: 12, color: "#ef4444", marginTop: 8 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    maxWidth: "92vw",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f2f4",
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  modalClose: {
    border: "none",
    background: "transparent",
    fontSize: 16,
    cursor: "pointer",
    color: "#9ca3af",
  },
  modalBody: {
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    maxHeight: "70vh",
    overflowY: "auto",
  },
  modalProjectBox: {
    background: "#f9fafb",
    border: "1px solid #eef0f2",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 12,
  },
  modalProjectFile: { fontSize: 11.5, color: "#9ca3af", fontWeight: 600 },
  modalProjectTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#1f2937",
    marginTop: 2,
  },
  modalProjectCost: {
    fontSize: 12.5,
    color: "#059669",
    fontWeight: 600,
    marginTop: 4,
  },
  modalLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#374151",
    marginTop: 10,
    marginBottom: 6,
  },
  modalSelect: {
    padding: "9px 12px",
    borderRadius: 9,
    border: "1px solid #d1d5db",
    fontSize: 13,
    color: "#1f2937",
    background: "#fff",
    colorScheme: "light",
  },
  modalInput: {
    padding: "9px 12px",
    borderRadius: 9,
    border: "1px solid #d1d5db",
    fontSize: 13,
    color: "#1f2937",
    fontFamily: "inherit",
    background: "#fff",
    colorScheme: "light",
  },
  modalTextarea: {
    padding: "9px 12px",
    borderRadius: 9,
    border: "1px solid #d1d5db",
    fontSize: 13,
    color: "#1f2937",
    resize: "vertical",
    fontFamily: "inherit",
    background: "#fff",
    colorScheme: "light",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid #f1f2f4",
    background: "#fafbfc",
  },
  modalCancelBtn: {
    padding: "9px 18px",
    borderRadius: 9,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  modalSubmitBtn: {
    padding: "9px 18px",
    borderRadius: 9,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
  },
};

export default ProjectTransfer;
