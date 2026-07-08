// PATH: frontend/src/pages/projects/projecttransfer/ProjectTransfer.jsx

import React, { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────
// NOTE ON THE "VIEWING AS" SWITCHER
// This app doesn't yet have multi-user login/session context, but a
// transfer genuinely involves TWO faculty (sender + recipient) plus the
// CSRC office. To let you test the full loop (initiate → accept/reject
// → CSRC approve) from a single screen, this page has a small
// "🧪 Viewing As" dropdown at the top that switches which faculty
// identity you're acting as. Remove this switcher once real per-user
// login is wired up — at that point `viewingFacultyId` should just come
// from the logged-in user's session instead.
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// NOTE ON THE TRANSFER FLOW
// 1. Faculty A picks a sanctioned project, fills in Sub / Ref / the
//    reason paragraph, and chooses Faculty B as the recipient.
// 2. A signature-less "Project Transfer Letter" is generated as a
//    genuine PDF (via html2pdf.js) that can be previewed or downloaded.
//    The moment it's generated, a DRAFT transfer record is saved —
//    Faculty A can close the app and come back any time later.
// 3. Faculty A prints it, physically collects signatures from
//    themself, Faculty B, and the HOD, then scans/photographs the
//    signed letter and comes back to "Continue" the draft.
// 4. Only once that signed copy is uploaded can Faculty A actually
//    "Initiate Transfer" — this is what turns the draft into a real,
//    submitted transfer.
// 5. Faculty B logs in, opens "Transferred To Me", reviews the
//    uploaded signed letter, and Accepts / Rejects.
// 6. CSRC office (simulated here with a temporary button) gives final
//    approval, which moves the project from A's list to B's list.
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// NOTE ON THE UI (updated)
// The page now leads with two compact SUMMARY CARDS — "Transferred By
// Me" and "Transferred To Me" — each showing just a headline count.
// Clicking a card expands the corresponding full section directly
// beneath the cards row (accordion-style, one open at a time). The old
// "View All Transferred Projects" list inside "Transferred By Me" is
// still its own nested toggle button, unchanged in behaviour.
// ─────────────────────────────────────────────────────────

// ─── Static faculty directory (stand-in for a real users table) ───────
const FACULTY_LIST = [
  { id: 'fac1', name: 'Dr. S. Balasivanandha Prabu', designation: 'Professor',              dept: 'Department of Mechanical Engineering', campus: 'CEG Campus' },
  { id: 'fac2', name: 'Dr. R. Anitha',                designation: 'Associate Professor',   dept: 'Department of Computer Science',        campus: 'CEG Campus' },
  { id: 'fac3', name: 'Dr. K. Elangovan',             designation: 'Professor',              dept: 'Department of Civil Engineering',        campus: 'CEG Campus' },
  { id: 'fac4', name: 'Dr. M. Priyadharshini',        designation: 'Assistant Professor',    dept: 'Department of Electronics Engineering',  campus: 'MIT Campus' },
  { id: 'fac5', name: 'Dr. V. Suresh Babu',           designation: 'Assistant Professor (Sr.Gr)', dept: 'Department of Information Science & Technology', campus: 'CEG Campus' },
];

const facultyById = (id) => FACULTY_LIST.find(f => f.id === id) || null;

// ─── Seed projects (stand-in for the real Sanctioned Projects data) ───
const SEED_PROJECTS = {
  fac1: [
    { id: 'p1', fileNo: '1234/CSRC-2/2025',  title: 'ABCD',                                                                                    cost: '1,00,000/-',   fundingAgency: 'SERB', period: '13-02-2026 to 12-02-2028' },
    { id: 'p2', fileNo: '2433/CSRC-2/2020',  title: 'Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application', cost: '43,64,360/-', fundingAgency: 'DST', period: '01-04-2020 to 31-03-2024' },
    { id: 'p3', fileNo: '721/CSRC-2/2013',   title: 'Studies on Thermal Stability of Bulk Nano Structured Aluminium-Lithium (AA8090) Alloy Processed by Respective Corrugation and Straightening', cost: '19,28,000/-', fundingAgency: 'CSIR', period: '01-01-2013 to 31-12-2016' },
  ],
  fac2: [], fac3: [], fac4: [], fac5: [],
};

// ─── Status configuration ──────────────────────────────────────────────
const STATUS = {
  draft:                { label: 'Letter Generated — Pending Signature Upload', color: '#6d28d9', bg: '#ede9fe', dot: '#8b5cf6' },
  pending_faculty:      { label: 'Awaiting Recipient Confirmation',     color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
  accepted_by_faculty:  { label: 'Accepted — Awaiting CSRC Approval',    color: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
  rejected_by_faculty:  { label: 'Rejected by Recipient',               color: '#991b1b', bg: '#fee2e2', dot: '#ef4444' },
  approved_by_csrc:     { label: 'Approved by CSRC — Transfer Complete', color: '#166534', bg: '#dcfce7', dot: '#22c55e' },
  rejected_by_csrc:     { label: 'Rejected by CSRC',                    color: '#991b1b', bg: '#fee2e2', dot: '#ef4444' },
};

// Statuses that still "lock" the project row (a transfer is in flight)
const ACTIVE_STATUSES = ['draft', 'pending_faculty', 'accepted_by_faculty'];

const TIMELINE_STEPS = ['pending_faculty', 'accepted_by_faculty', 'approved_by_csrc'];

const todayStr = () => new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

// ─── localStorage bridge helpers ───────────────────────────────────────
// `csrc_faculty_projects` : { [facultyId]: [project, ...] }
// `csrc_project_transfers`: [ transfer, ... ]   ← this is what the CSRC
//    office app (built later) will read to show pending transfer approvals.
//    Transfers with status 'draft' are letters that have been generated
//    but not yet submitted — CSRC / the recipient never see those.
const loadProjects = () => {
  try {
    const raw = localStorage.getItem('csrc_faculty_projects');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  localStorage.setItem('csrc_faculty_projects', JSON.stringify(SEED_PROJECTS));
  return SEED_PROJECTS;
};

const saveProjects = (projects) => {
  try { localStorage.setItem('csrc_faculty_projects', JSON.stringify(projects)); } catch (_) {}
};

const loadTransfers = () => {
  try {
    const raw = localStorage.getItem('csrc_project_transfers');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
};

const saveTransfers = (transfers) => {
  try { localStorage.setItem('csrc_project_transfers', JSON.stringify(transfers)); } catch (_) {}
};

// ─── html2pdf.js loader (CDN, loaded lazily on first use) ─────────────
let html2pdfLoadPromise = null;
const loadHtml2Pdf = () => {
  if (typeof window !== 'undefined' && window.html2pdf) return Promise.resolve(window.html2pdf);
  if (html2pdfLoadPromise) return html2pdfLoadPromise;

  html2pdfLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-lib="html2pdf"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.html2pdf));
      existing.addEventListener('error', () => reject(new Error('Failed to load html2pdf.js')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js';
    script.async = true;
    script.dataset.lib = 'html2pdf';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
    document.body.appendChild(script);
  });

  return html2pdfLoadPromise;
};

// ─── Transfer letter markup (From/To/Sub/Ref format, blank signatures) ─
// `draft` shape: { fileNo, title, cost, fundingAgency,
//                   fromFacultyName, fromFacultyDesignation, fromFacultyDept,
//                   toFacultyName, toFacultyDesignation, toFacultyDept,
//                   sub, ref, reason }
const buildLetterInnerHTML = (draft) => `
  <div class="pt-letter-page">
    <div class="pt-fromto-row">
      <span class="pt-fromto-label">From</span>
      <span class="pt-fromto-block">
        ${draft.fromFacultyName}<br/>
        ${draft.fromFacultyDesignation || 'Faculty'}<br/>
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

    <div class="pt-subref"><strong>Sub:</strong> ${draft.sub || '____________________________________________'}</div>
    <div class="pt-subref"><strong>Ref:</strong> ${(draft.ref || '____________________________________________').replace(/\n/g, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;')}</div>

    <div class="pt-divider">-------</div>

    <div class="pt-para">
      The sponsored project titled <strong>"${draft.title}"</strong> (File No: <strong>${draft.fileNo}</strong>,
      Sanctioned Cost: ₹ ${draft.cost}, Funding Agency: ${draft.fundingAgency}) is currently held by
      <strong>${draft.fromFacultyName}</strong>, ${draft.fromFacultyDept}, as Principal Investigator.
      It is proposed to transfer the Principal Investigator-ship of the above project to
      <strong>${draft.toFacultyName}</strong>, ${draft.toFacultyDept}.
    </div>

    <div class="pt-para">
      ${(draft.reason || '').trim().replace(/\n/g, '<br/>') ||
        '____________________________________________________________________________<br/>____________________________________________________________________________'}
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

// Renders the letter into an off-screen, attached DOM node so html2pdf.js
// (which relies on html2canvas) can rasterize it.
const renderLetterToContainer = (draft) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = `<style>${LETTER_STYLE}</style>${buildLetterInnerHTML(draft)}`;
  document.body.appendChild(container);
  return container;
};

const PDF_OPTS = (fileNo) => ({
  margin: 0,
  filename: `Project_Transfer_Letter_${String(fileNo).replace(/[^\w-]/g, '_')}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
});

// ─── File → base64 helper (for the signed-copy upload) ────────────────
const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// ─── Small UI helpers ───────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending_faculty;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
      color: s.color, background: s.bg, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>
  );
};

const Timeline = ({ status }) => {
  const idx = status === 'rejected_by_faculty' || status === 'rejected_by_csrc'
    ? (status === 'rejected_by_faculty' ? 0 : 1)
    : TIMELINE_STEPS.indexOf(status);
  const isRejected = status === 'rejected_by_faculty' || status === 'rejected_by_csrc';

  const labels = ['Submitted', 'Faculty Response', 'CSRC Approval'];

  return (
    <div style={styles.timelineRow}>
      {labels.map((label, i) => {
        let state = 'pending';
        if (isRejected && i === idx + 1) state = 'rejected';
        else if (i <= idx) state = 'done';
        return (
          <React.Fragment key={label}>
            <div style={styles.timelineStep}>
              <div style={{
                ...styles.timelineDot,
                background: state === 'done' ? '#22c55e' : state === 'rejected' ? '#ef4444' : '#e5e7eb',
                borderColor: state === 'done' ? '#22c55e' : state === 'rejected' ? '#ef4444' : '#d1d5db',
              }} />
              <span style={{ ...styles.timelineLabel, color: state === 'pending' ? '#9ca3af' : '#374151' }}>{label}</span>
            </div>
            {i < labels.length - 1 && <div style={{ ...styles.timelineBar, background: i < idx ? '#22c55e' : '#e5e7eb' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const emptyLetterFields = () => ({ recipientId: '', sub: '', ref: '', reason: '' });

// ─── Main component ─────────────────────────────────────────────────────
const ProjectTransfer = ({ onNavigate }) => {
  const [projects, setProjects] = useState({});
  const [transfers, setTransfers] = useState([]);
  const [viewingFacultyId, setViewingFacultyId] = useState('fac1');

  // Which of the two top-level sections is currently expanded below the
  // summary cards: null | 'sent' | 'received'
  const [activeSection, setActiveSection] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState(null);
  const [modalStep, setModalStep] = useState('form'); // 'form' | 'letter'
  const [letterFields, setLetterFields] = useState(emptyLetterFields());
  const [letterDraft, setLetterDraft] = useState(null); // the persisted draft transfer record being worked on
  const [signedFile, setSignedFile] = useState(null);   // { name, type, dataUrl }
  const [pdfBusy, setPdfBusy] = useState(null);          // null | 'preview' | 'download'
  const [uploadError, setUploadError] = useState('');

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
    setTransfers(loadTransfers());
  }, []);

  const persistProjects = (next) => { setProjects(next); saveProjects(next); };
  const persistTransfers = (next) => { setTransfers(next); saveTransfers(next); };

  const viewingFaculty = facultyById(viewingFacultyId);
  const myProjects = projects[viewingFacultyId] || [];

  // Transfers where I am the sender / recipient
  const sentTransfers = transfers.filter(t => t.fromFacultyId === viewingFacultyId);
  const receivedTransfers = transfers.filter(t => t.toFacultyId === viewingFacultyId && t.status !== 'draft');

  // Reset the expanded section (and its nested history toggle) whenever
  // the "viewing as" identity changes, so stale content isn't left open.
  useEffect(() => {
    setActiveSection(null);
    setShowHistory(false);
  }, [viewingFacultyId]);

  const toggleSection = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  // A project is "locked" (mid-transfer) if it has a non-final transfer in flight
  const activeTransferForProject = (projectId) =>
    transfers.find(t => t.projectId === projectId && ACTIVE_STATUSES.includes(t.status));

  const openTransferModal = (project) => {
    setModalProject(project);
    setModalStep('form');
    setLetterFields(emptyLetterFields());
    setLetterDraft(null);
    setSignedFile(null);
    setUploadError('');
    setShowModal(true);
  };

  // Reopen the modal directly at the "download / upload" step for an
  // already-generated draft — this is how someone resumes after
  // collecting physical signatures.
  const resumeDraft = (transfer) => {
    const project = (projects[transfer.fromFacultyId] || []).find(p => p.id === transfer.projectId) || {
      id: transfer.projectId, fileNo: transfer.fileNo, title: transfer.title,
      cost: transfer.cost, fundingAgency: transfer.fundingAgency,
    };
    setModalProject(project);
    setLetterFields({ recipientId: transfer.toFacultyId, sub: transfer.sub, ref: transfer.ref, reason: transfer.reason });
    setLetterDraft(transfer);
    setSignedFile(null);
    setUploadError('');
    setModalStep('letter');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalProject(null);
    setModalStep('form');
    setLetterFields(emptyLetterFields());
    setLetterDraft(null);
    setSignedFile(null);
    setUploadError('');
  };

  // Step 1 → Step 2: build the letter AND immediately persist it as a
  // 'draft' transfer, so nothing is lost if the user closes the app to
  // go get it physically signed.
  const handleGenerateLetter = () => {
    if (!modalProject || !letterFields.recipientId || !letterFields.sub.trim()) return;
    const recipient = facultyById(letterFields.recipientId);
    const sender = viewingFaculty;

    const draftTransfer = {
      id: `tr_${Date.now()}`,
      projectId: modalProject.id,
      fileNo: modalProject.fileNo,
      title: modalProject.title,
      cost: modalProject.cost,
      fundingAgency: modalProject.fundingAgency,
      fromFacultyId: sender.id,
      fromFacultyName: sender.name,
      fromFacultyDesignation: sender.designation,
      fromFacultyDept: sender.dept,
      toFacultyId: recipient.id,
      toFacultyName: recipient.name,
      toFacultyDesignation: recipient.designation,
      toFacultyDept: recipient.dept,
      sub: letterFields.sub.trim(),
      ref: letterFields.ref.trim(),
      reason: letterFields.reason.trim(),
      status: 'draft',
      createdAt: todayStr(),
      initiatedAt: null,
      respondedAt: null,
      csrcApprovedAt: null,
      signedLetter: null,
    };

    persistTransfers([...transfers, draftTransfer]);
    setLetterDraft(draftTransfer);
    setModalStep('letter');
  };

  // Renders the letter as a real PDF (via html2pdf.js) and opens it in a
  // new tab as a blob URL, so the browser's native PDF viewer displays
  // and centers it — not a raw HTML preview.
  const previewLetter = async (draft) => {
    if (!draft) return;
    setPdfBusy('preview');
    const container = renderLetterToContainer(draft);
    try {
      await loadHtml2Pdf();
      const target = container.querySelector('.pt-letter-page');
      const url = await window.html2pdf().set(PDF_OPTS(draft.fileNo)).from(target).outputPdf('bloburl');
      window.open(url, '_blank');
    } catch (e) {
      alert('Could not generate the PDF preview. Please check your connection and try again.');
    } finally {
      document.body.removeChild(container);
      setPdfBusy(null);
    }
  };

  const downloadLetter = async (draft) => {
    if (!draft) return;
    setPdfBusy('download');
    const container = renderLetterToContainer(draft);
    try {
      await loadHtml2Pdf();
      const target = container.querySelector('.pt-letter-page');
      await window.html2pdf().set(PDF_OPTS(draft.fileNo)).from(target).save();
    } catch (e) {
      alert('Could not generate the PDF. Please check your connection and try again.');
    } finally {
      document.body.removeChild(container);
      setPdfBusy(null);
    }
  };

  const handleSignedFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const okType = file.type === 'application/pdf' || file.type.startsWith('image/');
    if (!okType) {
      setUploadError('Please upload the signed copy as an image (JPG/PNG) or PDF.');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setSignedFile({ name: file.name, type: file.type, dataUrl });
      setUploadError('');
    } catch (_) {
      setUploadError('Could not read the selected file. Please try again.');
    }
  };

  // Turns the persisted 'draft' transfer into a real, submitted one.
  // Only reachable once a signed copy has been uploaded.
  const handleInitiateTransfer = () => {
    if (!letterDraft || !signedFile) return;

    const next = transfers.map(t => t.id === letterDraft.id ? {
      ...t,
      status: 'pending_faculty',
      initiatedAt: todayStr(),
      signedLetter: { name: signedFile.name, type: signedFile.type, dataUrl: signedFile.dataUrl },
    } : t);

    persistTransfers(next);
    closeModal();
  };

  const handleDiscardDraft = (transferId) => {
    persistTransfers(transfers.filter(t => t.id !== transferId));
  };

  const handleAccept = (transferId) => {
    const next = transfers.map(t =>
      t.id === transferId ? { ...t, status: 'accepted_by_faculty', respondedAt: todayStr() } : t
    );
    persistTransfers(next);
  };

  const handleReject = (transferId) => {
    const next = transfers.map(t =>
      t.id === transferId ? { ...t, status: 'rejected_by_faculty', respondedAt: todayStr() } : t
    );
    persistTransfers(next);
  };

  // TEMPORARY — stands in for the CSRC office approval step until that
  // module is built. Remove this button once the real office workflow
  // (reading from `csrc_project_transfers`) is wired up.
  const handleCsrcApprove = (transferId) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    // Move the project from sender's list to recipient's list
    const nextProjects = { ...projects };
    nextProjects[transfer.fromFacultyId] = (nextProjects[transfer.fromFacultyId] || [])
      .filter(p => p.id !== transfer.projectId);
    nextProjects[transfer.toFacultyId] = [
      ...(nextProjects[transfer.toFacultyId] || []),
      {
        id: transfer.projectId,
        fileNo: transfer.fileNo,
        title: transfer.title,
        cost: transfer.cost,
        fundingAgency: transfer.fundingAgency,
        period: '',
      },
    ];
    persistProjects(nextProjects);

    const nextTransfers = transfers.map(t =>
      t.id === transferId ? { ...t, status: 'approved_by_csrc', csrcApprovedAt: todayStr() } : t
    );
    persistTransfers(nextTransfers);
  };

  const handleCsrcReject = (transferId) => {
    const next = transfers.map(t =>
      t.id === transferId ? { ...t, status: 'rejected_by_csrc', csrcApprovedAt: todayStr() } : t
    );
    persistTransfers(next);
  };

  // Opens the physically-signed, uploaded copy of the letter (image or PDF)
  const viewSignedLetter = (transfer) => {
    if (!transfer.signedLetter || !transfer.signedLetter.dataUrl) return;
    const win = window.open('', '_blank');
    if (transfer.signedLetter.type === 'application/pdf') {
      // A PDF data URL can be navigated to directly — the browser's
      // native (centered) PDF viewer takes over.
      win.location.href = transfer.signedLetter.dataUrl;
    } else {
      win.document.write(`<!DOCTYPE html><html><head><title>Signed Transfer Letter — ${transfer.fileNo}</title>
        <style>body{margin:0;background:#111;display:flex;justify-content:center;padding:20px;}img{max-width:100%;height:auto;box-shadow:0 4px 20px rgba(0,0,0,0.4);}</style>
        </head><body><img src="${transfer.signedLetter.dataUrl}" alt="Signed transfer letter"/></body></html>`);
      win.document.close();
    }
  };

  const canGenerateLetter = !!(letterFields.recipientId && letterFields.sub.trim());

  // Small helpers for the summary cards' subtitle counts
  const pendingSentCount = sentTransfers.filter(t => ACTIVE_STATUSES.includes(t.status)).length;
  const pendingReceivedCount = receivedTransfers.filter(t => ACTIVE_STATUSES.includes(t.status)).length;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => onNavigate && onNavigate('home')}>Home</span>
          <span style={styles.breadcrumbSep}>›</span>
          <span style={styles.breadcrumbLink} onClick={() => onNavigate && onNavigate('projects')}>My Projects</span>
          <span style={styles.breadcrumbSep}>›</span>
          <span style={styles.breadcrumbCurrent}>Project Transfer</span>
        </div>
        <h1 style={styles.title}>Project Transfer</h1>
        <div style={styles.subtitle}>CSRC — Anna University</div>
      </div>

      {/* Testing identity switcher */}
      <div style={styles.testingBar}>
        <span style={styles.testingLabel}>🧪 Viewing As <span style={styles.testingHint}>(testing only — will be replaced by real login)</span></span>
        <select
          style={styles.testingSelect}
          value={viewingFacultyId}
          onChange={e => setViewingFacultyId(e.target.value)}
        >
          {FACULTY_LIST.map(f => (
            <option key={f.id} value={f.id}>{f.name} — {f.dept}</option>
          ))}
        </select>
      </div>

      {/* ── Two summary/selector cards ─────────────────────────── */}
      <div style={styles.summaryGrid}>
        <button
          style={{
            ...styles.summaryCard,
            ...(activeSection === 'sent' ? styles.summaryCardActive : {}),
          }}
          onClick={() => toggleSection('sent')}
        >
          <div style={{ ...styles.cardIcon, background: '#ede9fe', color: '#7c3aed' }}>📤</div>
          <div style={styles.summaryTextCol}>
            <div style={styles.cardTitle}>Transferred By Me</div>
            <div style={styles.cardSub}>
              {myProjects.length} project{myProjects.length === 1 ? '' : 's'} held
              {pendingSentCount > 0 && <> · {pendingSentCount} in progress</>}
            </div>
          </div>
          <span style={{
            ...styles.summaryChevron,
            transform: activeSection === 'sent' ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>›</span>
        </button>

        <button
          style={{
            ...styles.summaryCard,
            ...(activeSection === 'received' ? styles.summaryCardActive : {}),
          }}
          onClick={() => toggleSection('received')}
        >
          <div style={{ ...styles.cardIcon, background: '#dcfce7', color: '#16a34a' }}>📥</div>
          <div style={styles.summaryTextCol}>
            <div style={styles.cardTitle}>Transferred To Me</div>
            <div style={styles.cardSub}>
              {receivedTransfers.length} incoming
              {pendingReceivedCount > 0 && <> · {pendingReceivedCount} need action</>}
            </div>
          </div>
          <span style={{
            ...styles.summaryChevron,
            transform: activeSection === 'received' ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>›</span>
        </button>
      </div>

      {/* ── Expanded section content ───────────────────────────── */}
      {activeSection === 'sent' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: '#ede9fe', color: '#7c3aed' }}>📤</div>
            <div>
              <div style={styles.cardTitle}>Transferred By Me</div>
              <div style={styles.cardSub}>Initiate a project transfer to another faculty</div>
            </div>
          </div>

          <div style={styles.cardBody}>
            {myProjects.length === 0 ? (
              <div style={styles.emptyBox}>No sanctioned projects currently held by you.</div>
            ) : (
              <div style={styles.projectList}>
                {myProjects.map(p => {
                  const active = activeTransferForProject(p.id);
                  return (
                    <div key={p.id} style={styles.projectRow}>
                      <div style={styles.projectRowInfo}>
                        <span style={styles.projectFileNo}>{p.fileNo}</span>
                        <span style={styles.projectTitleText}>{p.title}</span>
                        <span style={styles.projectCost}>₹ {p.cost}</span>
                      </div>
                      {active ? (
                        active.status === 'draft' ? (
                          <div style={styles.draftRowActions}>
                            <StatusBadge status={active.status} />
                            <button style={styles.continueBtn} onClick={() => resumeDraft(active)}>Continue →</button>
                          </div>
                        ) : (
                          <StatusBadge status={active.status} />
                        )
                      ) : (
                        <button style={styles.transferBtn} onClick={() => openTransferModal(p)}>
                          Transfer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <button style={styles.historyToggle} onClick={() => setShowHistory(v => !v)}>
              {showHistory ? '▲ Hide' : '▼ View'} All Transferred Projects ({sentTransfers.length})
            </button>

            {showHistory && (
              <div style={styles.historyList}>
                {sentTransfers.length === 0 ? (
                  <div style={styles.emptyBox}>No transfers initiated yet.</div>
                ) : sentTransfers.map(t => (
                  <div key={t.id} style={styles.historyCard}>
                    <div style={styles.historyCardTop}>
                      <div>
                        <div style={styles.historyProjTitle}>{t.title}</div>
                        <div style={styles.historyMeta}>{t.fileNo} · To: {t.toFacultyName}</div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    {t.status === 'draft' ? (
                      <>
                        <div style={styles.draftNote}>
                          📝 Letter generated on {t.createdAt} — waiting on physical signatures from you,
                          {' '}{t.toFacultyName}, and the HOD. Upload the signed copy whenever it's ready.
                        </div>
                        <div style={styles.actionRow}>
                          <button style={styles.letterBtn} disabled={!!pdfBusy} onClick={() => previewLetter(t)}>
                            {pdfBusy === 'preview' ? 'Preparing…' : '👁 Preview PDF'}
                          </button>
                          <button style={styles.csrcApproveBtn} disabled={!!pdfBusy} onClick={() => downloadLetter(t)}>
                            {pdfBusy === 'download' ? 'Preparing…' : '⬇ Download PDF'}
                          </button>
                          <button style={styles.transferBtn} onClick={() => resumeDraft(t)}>Upload &amp; Initiate →</button>
                          <button style={styles.rejectBtn} onClick={() => handleDiscardDraft(t.id)}>Discard</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Timeline status={t.status} />
                        {t.signedLetter && (
                          <div style={styles.actionRow}>
                            <button style={styles.letterBtn} onClick={() => viewSignedLetter(t)}>📄 View Signed Letter</button>
                          </div>
                        )}
                      </>
                    )}

                    <div style={styles.historyDates}>
                      {t.initiatedAt && <span>Initiated: {t.initiatedAt}</span>}
                      {t.respondedAt && <span>Faculty Response: {t.respondedAt}</span>}
                      {t.csrcApprovedAt && <span>CSRC Action: {t.csrcApprovedAt}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'received' && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.cardIcon, background: '#dcfce7', color: '#16a34a' }}>📥</div>
            <div>
              <div style={styles.cardTitle}>Transferred To Me</div>
              <div style={styles.cardSub}>Projects other faculty want to transfer to you</div>
            </div>
          </div>

          <div style={styles.cardBody}>
            {receivedTransfers.length === 0 ? (
              <div style={styles.emptyBox}>No incoming project transfers.</div>
            ) : (
              <div style={styles.historyList}>
                {receivedTransfers.map(t => (
                  <div key={t.id} style={styles.historyCard}>
                    <div style={styles.historyCardTop}>
                      <div>
                        <div style={styles.historyProjTitle}>{t.title}</div>
                        <div style={styles.historyMeta}>{t.fileNo} · From: {t.fromFacultyName}</div>
                        <div style={styles.historyMeta}>₹ {t.cost} · {t.fundingAgency}</div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>

                    <Timeline status={t.status} />

                    {t.reason && (
                      <div style={styles.remarksBox}><strong>Reason given by sender:</strong> {t.reason}</div>
                    )}

                    <div style={styles.historyDates}>
                      <span>Initiated: {t.initiatedAt}</span>
                      {t.respondedAt && <span>Your Response: {t.respondedAt}</span>}
                      {t.csrcApprovedAt && <span>CSRC Action: {t.csrcApprovedAt}</span>}
                    </div>

                    {/* Everyone can view the signed letter that was uploaded at initiation */}
                    {t.signedLetter && (
                      <div style={styles.actionRow}>
                        <button style={styles.letterBtn} onClick={() => viewSignedLetter(t)}>📄 View Signed Transfer Letter</button>
                      </div>
                    )}

                    {/* Faculty accept/reject — the physical signatures are already on
                        the uploaded letter, so this just confirms it digitally */}
                    {t.status === 'pending_faculty' && (
                      <div style={styles.actionRow}>
                        <button style={styles.acceptBtn} onClick={() => handleAccept(t.id)}>✓ Confirm & Accept</button>
                        <button style={styles.rejectBtn} onClick={() => handleReject(t.id)}>✕ Reject</button>
                      </div>
                    )}

                    {/* Awaiting CSRC + temporary simulate buttons */}
                    {t.status === 'accepted_by_faculty' && (
                      <>
                        <div style={styles.tempNote}>
                          🔧 Temporary — simulates the CSRC office decision until that module is built:
                        </div>
                        <div style={styles.actionRow}>
                          <button style={styles.csrcApproveBtn} onClick={() => handleCsrcApprove(t.id)}>Approve (CSRC)</button>
                          <button style={styles.rejectBtn} onClick={() => handleCsrcReject(t.id)}>Reject (CSRC)</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Transfer initiation modal ───────────────────────────── */}
      {showModal && modalProject && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={{ ...styles.modalBox, width: modalStep === 'letter' ? 560 : 460 }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>{modalStep === 'form' ? 'Initiate Project Transfer' : 'Download, Sign & Upload Letter'}</span>
              <button style={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            {/* ── Step 1: recipient + letter details ───────────── */}
            {modalStep === 'form' && (
              <>
                <div style={styles.modalBody}>
                  <div style={styles.modalProjectBox}>
                    <div style={styles.modalProjectFile}>{modalProject.fileNo}</div>
                    <div style={styles.modalProjectTitle}>{modalProject.title}</div>
                    <div style={styles.modalProjectCost}>₹ {modalProject.cost}</div>
                  </div>

                  <label style={styles.modalLabel}>Transfer To (Faculty)</label>
                  <select
                    style={styles.modalSelect}
                    value={letterFields.recipientId}
                    onChange={e => setLetterFields(f => ({ ...f, recipientId: e.target.value }))}
                  >
                    <option value="">Select faculty…</option>
                    {FACULTY_LIST.filter(f => f.id !== viewingFacultyId).map(f => (
                      <option key={f.id} value={f.id}>{f.name} — {f.dept}</option>
                    ))}
                  </select>

                  <label style={styles.modalLabel}>Sub (Subject line of the letter)</label>
                  <input
                    style={styles.modalInput}
                    placeholder="e.g. AU – Project PI Change – Revised Sanction Requested – Reg."
                    value={letterFields.sub}
                    onChange={e => setLetterFields(f => ({ ...f, sub: e.target.value }))}
                  />

                  <label style={styles.modalLabel}>Ref (one per line, optional)</label>
                  <textarea
                    style={styles.modalTextarea}
                    rows={2}
                    placeholder={'e.g.\n1. Sanction Proceedings No. ... dated ...'}
                    value={letterFields.ref}
                    onChange={e => setLetterFields(f => ({ ...f, ref: e.target.value }))}
                  />

                  <label style={styles.modalLabel}>Reason for transfer</label>
                  <textarea
                    style={styles.modalTextarea}
                    rows={3}
                    placeholder="e.g. Owing to my superannuation / transfer, the responsibility of Principal Investigator is being handed over to…"
                    value={letterFields.reason}
                    onChange={e => setLetterFields(f => ({ ...f, reason: e.target.value }))}
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button style={styles.modalCancelBtn} onClick={closeModal}>Cancel</button>
                  <button
                    style={{ ...styles.modalSubmitBtn, opacity: canGenerateLetter ? 1 : 0.5, cursor: canGenerateLetter ? 'pointer' : 'not-allowed' }}
                    onClick={handleGenerateLetter}
                    disabled={!canGenerateLetter}
                  >
                    Generate Letter →
                  </button>
                </div>
              </>
            )}

            {/* ── Step 2: download unsigned letter, then upload signed copy ── */}
            {modalStep === 'letter' && letterDraft && (
              <>
                <div style={styles.modalBody}>
                  <div style={styles.letterStepIntro}>
                    This letter has been saved as a draft. Download it, get it signed by <strong>you</strong>,
                    {' '}<strong>{letterDraft.toFacultyName}</strong>, and the <strong>Head of the Department</strong>,
                    then come back and upload the signed copy — you can close this window any time and continue
                    later from "Transferred By Me".
                  </div>

                  <div style={styles.actionRow}>
                    <button style={styles.letterBtn} disabled={!!pdfBusy} onClick={() => previewLetter(letterDraft)}>
                      {pdfBusy === 'preview' ? 'Preparing…' : '👁 Preview Letter (PDF)'}
                    </button>
                    <button style={styles.csrcApproveBtn} disabled={!!pdfBusy} onClick={() => downloadLetter(letterDraft)}>
                      {pdfBusy === 'download' ? 'Preparing…' : '⬇ Download Letter (PDF)'}
                    </button>
                  </div>

                  <label style={{ ...styles.modalLabel, marginTop: 18 }}>Upload Signed Copy (image or PDF)</label>
                  <label style={styles.uploadBox}>
                    <span style={styles.uploadBoxText}>
                      {signedFile ? `✓ ${signedFile.name}` : 'Click to choose the signed, scanned letter…'}
                    </span>
                    <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleSignedFileChange} />
                  </label>
                  {uploadError && <div style={styles.uploadError}>{uploadError}</div>}
                </div>

                <div style={styles.modalFooter}>
                  <button style={styles.modalCancelBtn} onClick={closeModal}>Finish Later</button>
                  <button
                    style={{ ...styles.modalSubmitBtn, opacity: signedFile ? 1 : 0.5, cursor: signedFile ? 'pointer' : 'not-allowed' }}
                    onClick={handleInitiateTransfer}
                    disabled={!signedFile}
                  >
                    Initiate Transfer
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

// ─── Light theme styles ─────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#f7f8fb',
    padding: '28px 32px 60px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#1f2937',
  },

  header: { marginBottom: 18 },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9ca3af', marginBottom: 10 },
  breadcrumbLink: { cursor: 'pointer' },
  breadcrumbSep: { opacity: 0.5 },
  breadcrumbCurrent: { color: '#374151', fontWeight: 600 },
  title: { fontSize: 26, fontWeight: 700, margin: 0, color: '#111827' },
  subtitle: { fontSize: 13, color: '#9ca3af', marginTop: 4 },

  testingBar: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
    padding: '10px 16px', marginBottom: 22,
  },
  testingLabel: { fontSize: 13, fontWeight: 600, color: '#92400e' },
  testingHint: { fontWeight: 400, color: '#b45309', fontSize: 12 },
  testingSelect: {
    padding: '6px 10px', borderRadius: 8, border: '1px solid #fcd34d',
    background: '#fff', fontSize: 13, color: '#374151', minWidth: 280,
    colorScheme: 'light',
  },

  // ── Summary/selector cards row ──
  summaryGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20,
  },
  summaryCard: {
    display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
    background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '18px 20px',
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
  },
  summaryCardActive: {
    borderColor: '#a78bfa', boxShadow: '0 0 0 3px rgba(124,58,237,0.12)', background: '#fdfcff',
  },
  summaryTextCol: { flex: 1, minWidth: 0 },
  summaryChevron: {
    fontSize: 20, color: '#9ca3af', flexShrink: 0, transition: 'transform 0.15s ease',
  },

  cardsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
  },

  card: {
    background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column',
    minWidth: 0, marginBottom: 20,
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '18px 20px', borderBottom: '1px solid #f1f2f4',
  },
  cardIcon: {
    width: 40, height: 40, borderRadius: 10, display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  cardTitle: { fontSize: 15.5, fontWeight: 700, color: '#111827' },
  cardSub: { fontSize: 12.5, color: '#9ca3af', marginTop: 2 },
  cardBody: { padding: '16px 20px 20px' },

  emptyBox: {
    padding: '22px 14px', textAlign: 'center', color: '#9ca3af',
    fontSize: 13.5, background: '#fafafa', borderRadius: 10, border: '1px dashed #e5e7eb',
  },

  projectList: { display: 'flex', flexDirection: 'column', gap: 10 },
  projectRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    padding: '12px 14px', border: '1px solid #eef0f2', borderRadius: 10, background: '#fcfcfd',
  },
  projectRowInfo: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  projectFileNo: { fontSize: 11.5, color: '#9ca3af', fontWeight: 600 },
  projectTitleText: {
    fontSize: 13.5, color: '#1f2937', fontWeight: 600, maxWidth: 340,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  projectCost: { fontSize: 12.5, color: '#059669', fontWeight: 600 },

  transferBtn: {
    padding: '7px 16px', borderRadius: 8, border: 'none', background: '#7c3aed',
    color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
  },
  draftRowActions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  continueBtn: {
    padding: '7px 14px', borderRadius: 8, border: '1px solid #8b5cf6', background: '#fff',
    color: '#7c3aed', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },

  historyToggle: {
    marginTop: 16, width: '100%', padding: '9px 0', borderRadius: 9,
    border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151',
    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },

  historyList: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 },
  historyCard: {
    border: '1px solid #eef0f2', borderRadius: 12, padding: '14px 16px', background: '#fcfcfd',
  },
  historyCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  historyProjTitle: {
    fontSize: 13.5, fontWeight: 700, color: '#1f2937', maxWidth: 300,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  historyMeta: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  historyDates: { display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 11.5, color: '#9ca3af', marginTop: 10 },

  remarksBox: {
    marginTop: 10, fontSize: 12.5, color: '#4b5563', background: '#f3f4f6',
    borderRadius: 8, padding: '8px 12px', lineHeight: 1.5,
  },
  draftNote: {
    marginTop: 10, fontSize: 12.5, color: '#5b21b6', background: '#f5f3ff',
    borderRadius: 8, padding: '8px 12px', lineHeight: 1.5,
  },

  timelineRow: { display: 'flex', alignItems: 'center', marginTop: 14, marginBottom: 2 },
  timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 90 },
  timelineDot: { width: 14, height: 14, borderRadius: '50%', border: '2px solid', flexShrink: 0 },
  timelineLabel: { fontSize: 10.5, textAlign: 'center', fontWeight: 600 },
  timelineBar: { flex: 1, height: 2, marginTop: -18 },

  actionRow: { display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  acceptBtn: {
    padding: '7px 16px', borderRadius: 8, border: 'none', background: '#16a34a',
    color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },
  rejectBtn: {
    padding: '7px 16px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff',
    color: '#ef4444', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },
  letterBtn: {
    padding: '7px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff',
    color: '#374151', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },
  csrcApproveBtn: {
    padding: '7px 16px', borderRadius: 8, border: 'none', background: '#2563eb',
    color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },
  tempNote: { fontSize: 11, color: '#b45309', marginTop: 12, fontStyle: 'italic' },

  // Letter step
  letterStepIntro: {
    fontSize: 12.5, color: '#4b5563', background: '#f3f4f6', borderRadius: 10,
    padding: '10px 12px', lineHeight: 1.6, marginBottom: 6,
  },
  uploadBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    border: '1.5px dashed #c4b5fd', borderRadius: 10, background: '#faf5ff',
    padding: '16px 12px', cursor: 'pointer', marginTop: 4,
  },
  uploadBoxText: { fontSize: 12.5, color: '#6d28d9', fontWeight: 600 },
  uploadError: { fontSize: 12, color: '#ef4444', marginTop: 8 },

  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modalBox: {
    maxWidth: '92vw', background: '#fff', borderRadius: 16,
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)', overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f1f2f4', fontSize: 15, fontWeight: 700, color: '#111827',
  },
  modalClose: { border: 'none', background: 'transparent', fontSize: 16, cursor: 'pointer', color: '#9ca3af' },
  modalBody: { padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '70vh', overflowY: 'auto' },
  modalProjectBox: {
    background: '#f9fafb', border: '1px solid #eef0f2', borderRadius: 10,
    padding: '12px 14px', marginBottom: 12,
  },
  modalProjectFile: { fontSize: 11.5, color: '#9ca3af', fontWeight: 600 },
  modalProjectTitle: { fontSize: 13.5, fontWeight: 600, color: '#1f2937', marginTop: 2 },
  modalProjectCost: { fontSize: 12.5, color: '#059669', fontWeight: 600, marginTop: 4 },
  modalLabel: { fontSize: 12.5, fontWeight: 600, color: '#374151', marginTop: 10, marginBottom: 6 },
  modalSelect: {
    padding: '9px 12px', borderRadius: 9, border: '1px solid #d1d5db',
    fontSize: 13, color: '#1f2937', background: '#fff', colorScheme: 'light',
  },
  modalInput: {
    padding: '9px 12px', borderRadius: 9, border: '1px solid #d1d5db',
    fontSize: 13, color: '#1f2937', fontFamily: 'inherit',
    background: '#fff', colorScheme: 'light',
  },
  modalTextarea: {
    padding: '9px 12px', borderRadius: 9, border: '1px solid #d1d5db',
    fontSize: 13, color: '#1f2937', resize: 'vertical', fontFamily: 'inherit',
    background: '#fff', colorScheme: 'light',
  },
  modalFooter: {
    display: 'flex', justifyContent: 'flex-end', gap: 10,
    padding: '14px 20px', borderTop: '1px solid #f1f2f4', background: '#fafbfc',
  },
  modalCancelBtn: {
    padding: '9px 18px', borderRadius: 9, border: '1px solid #d1d5db',
    background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  modalSubmitBtn: {
    padding: '9px 18px', borderRadius: 9, border: 'none',
    background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 600,
  },
};

export default ProjectTransfer;