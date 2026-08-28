import React, { useState, useRef, useMemo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AdvanceSanctionsPage.css";

/* ═══════════════════════════════════════════════════════════════════
   DATA — Projects owned by the logged-in PI
   (Swap this for a real API call: GET /api/projects/mine)
═══════════════════════════════════════════════════════════════════ */
const MY_PROJECTS = [
  {
    id: "PRJ-001",
    fileNo: "2433/CSRC-2/2020",
    title:
      "Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application",
    pi: "Dr. S. Balasivanandha Prabu",
    piDesignation: "Professor",
    department: "Mechanical Engineering",
    departmentFull: "Department of Mechanical Engineering",
    campus: "CEG Campus",
    scheme: "SERB",
    projectNo: "SERB2020MECH04001",
    csrcProcNo: "2433/CSRC-2/2020",
    csrcProcDate: "10-12-2020",
    sanctionedAmount: 4364360,
    headBudgets: {
      nonRecurring: {
        label: "Non-Recurring (Equipment)",
        allotment: 1500000,
        incurred: 480000,
      },
      manpower: { label: "Manpower", allotment: 1200000, incurred: 350000 },
      consumables: {
        label: "Consumables & Accessories",
        allotment: 400000,
        incurred: 120000,
      },
      travel: { label: "Travel", allotment: 150000, incurred: 22000 },
      contingency: { label: "Contingency", allotment: 100000, incurred: 15000 },
      other: { label: "Other Expenses", allotment: 80000, incurred: 8000 },
    },
  },
  {
    id: "PRJ-002",
    fileNo: "721/CSRC-2/2013",
    title:
      "Studies on Thermal Stability of Bulk Nano Structured Aluminium-Lithium (AA8090) Alloy Processed by Repetitive Corrugation and Straightening",
    pi: "Dr. S. Balasivanandha Prabu",
    piDesignation: "Professor",
    department: "Mechanical Engineering",
    departmentFull: "Department of Mechanical Engineering",
    campus: "CEG Campus",
    scheme: "DST",
    projectNo: "DST2013MECH01007",
    csrcProcNo: "721/CSRC-2/2013",
    csrcProcDate: "05-04-2013",
    sanctionedAmount: 1928000,
    headBudgets: {
      nonRecurring: {
        label: "Non-Recurring (Equipment)",
        allotment: 700000,
        incurred: 700000,
      },
      manpower: { label: "Manpower", allotment: 600000, incurred: 240000 },
      consumables: {
        label: "Consumables & Accessories",
        allotment: 300000,
        incurred: 90000,
      },
      travel: { label: "Travel", allotment: 80000, incurred: 10000 },
      contingency: { label: "Contingency", allotment: 60000, incurred: 5000 },
      other: { label: "Other Expenses", allotment: 40000, incurred: 0 },
    },
  },
];

const HEADS = [
  {
    key: "nonRecurring",
    label: "Non-Recurring (Equipment)",
    hint: "Advance for equipment procurement",
    icon: "M4 4h16v4H4zM6 8v12h12V8",
    color: "#00b4ff",
  },
  {
    key: "manpower",
    label: "Manpower",
    hint: "Advance for salary / stipend disbursal",
    icon: "M12 8a4 4 0 100-8 4 4 0 000 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
    color: "#34d399",
  },
  {
    key: "consumables",
    label: "Consumables & Accessories",
    hint: "Advance for lab materials / chemicals",
    icon: "M9 2h6v5l4 12H5L9 7z",
    color: "#a78bfa",
  },
  {
    key: "travel",
    label: "Travel",
    hint: "Advance for conference / field visit",
    icon: "M2 16l20-8-8 20-3-8-9-4z",
    color: "#fbbf24",
  },
  {
    key: "contingency",
    label: "Contingency",
    hint: "Advance for seminar / misc. expenses",
    icon: "M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2M3 8h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
    color: "#f472b6",
  },
  {
    key: "other",
    label: "Other Expenses",
    hint: "Advance for anything not listed above",
    icon: "M12 2v20M2 12h20",
    color: "#fb923c",
  },
];

const STORAGE_KEY = "csrc_advance_sanction_requests";

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
const fmtINR = (n) => {
  const num = parseFloat(n);
  if (isNaN(num)) return "—";
  return num.toLocaleString("en-IN", { minimumFractionDigits: 2 });
};

const todayDMY = () =>
  new Date()
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

const todayDisplay = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function toIndianWords(num) {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  function words(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 ? " " + words(n % 100) : "")
      );
    if (n < 100000)
      return (
        words(Math.floor(n / 1000)) +
        " thousand" +
        (n % 1000 ? " " + words(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        words(Math.floor(n / 100000)) +
        " lakh" +
        (n % 100000 ? " " + words(n % 100000) : "")
      );
    return (
      words(Math.floor(n / 10000000)) +
      " crore" +
      (n % 10000000 ? " " + words(n % 10000000) : "")
    );
  }
  if (!num) return "zero";
  const w = words(Math.floor(num));
  return w.charAt(0).toUpperCase() + w.slice(1) + " only";
}

function loadRequests() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch (_) {
    return [];
  }
}
function saveRequests(list) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

function nextProcNo(existing) {
  const year = new Date().getFullYear();
  const countThisYear =
    existing.filter((r) => r.procNo && r.procNo.includes(`/${year}/`)).length +
    1;
  return `ADV/CSRC/${year}/${String(countThisYear).padStart(3, "0")}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   DOCUMENT GENERATORS
═══════════════════════════════════════════════════════════════════ */

/* ── 1. Advance Sanction Proceedings (matches the Anna University format) ── */
function generateProceedingsHTML(form, project, procNo) {
  const headInfo = project.headBudgets[form.head];
  const amount = Number(form.amount) || 0;
  const inclThis = headInfo.incurred + amount;
  const balance = headInfo.allotment - inclThis;
  const td = todayDMY();

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Advance Sanction Proceedings</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:13px;background:#eef1f5;color:#000;padding:24px 0;}
.page{width:210mm;min-height:297mm;padding:20mm;background:#fff;margin:0 auto;box-shadow:0 2px 14px rgba(0,0,0,0.14);}
@media print{body{background:#fff;padding:0;}.page{box-shadow:none;margin:0;}.print-btn{display:none;}}
.print-btn{position:fixed;top:10px;right:10px;padding:8px 16px;background:#0284c7;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;z-index:9999;font-family:sans-serif;}
.top-row{display:flex;justify-content:space-between;font-weight:bold;margin-bottom:6px;}
.sub-line,.ref-line{display:flex;gap:8px;margin:8px 0;text-align:justify;}
.sub-line b,.ref-line b{flex-shrink:0;}
.stars{text-align:center;letter-spacing:6px;margin:10px 0;font-weight:bold;}
p.body-text{text-align:justify;line-height:1.7;margin:14px 0;}
.bullets{margin:16px 0 16px 20px;line-height:2;}
.bullets li{list-style:none;display:flex;justify-content:space-between;max-width:520px;}
.bullets li b{min-width:12px;margin-right:8px;}
.bullets .line{flex:1;border-bottom:1px dotted #000;margin:0 8px;}
.sig{text-align:right;font-weight:bold;margin-top:70px;}
.sig .sub{font-weight:normal;font-size:12px;margin-top:2px;}
.to-block{margin-top:26px;line-height:1.6;}
</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
  <div class="top-row"><span>Procs. No. ${procNo}</span><span>Date: ${td}</span></div>

  <div class="sub-line"><b>Sub:</b><span>${project.departmentFull} – Project entitled &ldquo;${project.title}&rdquo; – ${headInfo.label} – Advance – Sanction – Accorded.</span></div>
  <div class="ref-line"><b>Ref:</b><span>CSRC Proc. No. ${project.csrcProcNo}, dated ${project.csrcProcDate}.</span></div>

  <div class="stars">*****</div>

  <p class="body-text">Sanction is hereby accorded for a sum not exceeding <strong>Rs.${fmtINR(amount)}/- (Rupees ${toIndianWords(amount)})</strong> towards an advance to meet the expenses to be incurred in connection with <strong>${form.purpose || "—"}</strong> under the project entitled &ldquo;<strong>${project.title}</strong>&rdquo;.</p>

  <p class="body-text">The payment shall be made in the name of &ldquo;<strong>${form.beneficiaryName || "—"}</strong>&rdquo;.</p>

  <p class="body-text"><strong>The expenditure in this regard is debitable under the Project &ldquo;${project.title}&rdquo; under the Head of account &ldquo;${headInfo.label}&rdquo;.</strong></p>

  <ul class="bullets">
    <li><span><b>•</b>Amount Allocated in the Head of A/c</span><span class="line"></span><span>Rs.${fmtINR(headInfo.allotment)}/-</span></li>
    <li><span><b>•</b>Amount incurred so far (including this proceedings)</span><span class="line"></span><span>Rs.${fmtINR(inclThis)}/-</span></li>
    <li><span><b>•</b>Balance amount available in the Head of A/c</span><span class="line"></span><span>Rs.${fmtINR(balance)}/-</span></li>
  </ul>

  ${form.settlementDate ? `<p class="body-text">The Principal Investigator shall settle this advance by submitting the utilisation details / vouchers on or before <strong>${form.settlementDate}</strong>, failing which the amount is liable to be recovered from the PI&rsquo;s salary.</p>` : ""}

  <div class="sig">DEAN / DIRECTOR / HOD<div class="sub">(with seal)</div></div>

  <div class="to-block">
    <div>To</div>
    <div><strong>Professor &amp; Head</strong></div>
    <div>${project.departmentFull}</div>
    <div>${project.campus}, Anna University, Chennai – 600 025</div>
  </div>
</div>
</body></html>`;
}

/* ── 2. Covering Letter — PI to CSRC Director (needs wet signature) ── */
function generateDirectorLetterHTML(form, project) {
  const amount = Number(form.amount) || 0;
  const td = todayDisplay();
  const bodyParas = (form.letterBody || "")
    .split("\n")
    .filter((p) => p.trim())
    .map((p) => `<p class="body-text">${p}</p>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Covering Letter to CSRC Director</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:13px;background:#eef1f5;color:#000;padding:24px 0;}
.page{width:210mm;min-height:297mm;padding:20mm;background:#fff;margin:0 auto;box-shadow:0 2px 14px rgba(0,0,0,0.14);}
@media print{body{background:#fff;padding:0;}.page{box-shadow:none;margin:0;}.print-btn{display:none;}}
.print-btn{position:fixed;top:10px;right:10px;padding:8px 16px;background:#0284c7;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;z-index:9999;font-family:sans-serif;}
.letterhead{text-align:center;margin-bottom:22px;}
.letterhead h3{font-size:14px;letter-spacing:0.5px;}
.letterhead .rule{border-bottom:2px solid #000;margin-top:6px;}
.from-block{line-height:1.5;}
.date-right{text-align:right;margin:14px 0;}
.to-block{margin:14px 0;line-height:1.5;}
.subject{margin:16px 0 6px;}
.ref{margin:0 0 16px;}
.salutation{margin:16px 0 10px;}
p.body-text{text-align:justify;line-height:1.75;margin:12px 0;}
.closing{margin-top:26px;}
.sig-area{display:flex;justify-content:space-between;margin-top:80px;}
.sig-box{width:44%;}
.sig-line{border-bottom:1px solid #000;height:36px;}
.sig-box .role{font-weight:bold;margin-top:6px;}
.sig-box .name{margin-top:2px;font-size:12.5px;}
.enc{margin-top:34px;font-size:12.5px;}
</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
  <div class="letterhead">
    <h3>${project.pi}</h3>
    <div>${project.piDesignation}, ${project.departmentFull}</div>
    <div>${project.campus}, Anna University, Chennai – 600 025</div>
    <div class="rule"></div>
  </div>

  <div class="date-right">Date: ${td}</div>

  <div class="to-block">
    <div>To</div>
    <div><strong>The Director,</strong></div>
    <div>Centre for Sponsored Research and Consultancy (CSRC),</div>
    <div>Anna University, Chennai – 600 025.</div>
  </div>

  <div class="subject"><strong>Sub:</strong> ${form.letterSubject || "—"}</div>
  ${form.letterRef ? `<div class="ref"><strong>Ref:</strong> ${form.letterRef}</div>` : ""}

  <div class="salutation">Respected Sir / Madam,</div>

  ${bodyParas || `<p class="body-text">—</p>`}

  <p class="body-text">In this regard, I request the release of an advance amount of <strong>Rs.${fmtINR(amount)}/- (Rupees ${toIndianWords(amount)})</strong> under the Head of Account &ldquo;<strong>${project.headBudgets[form.head]?.label || "—"}</strong>&rdquo; of the above project, to be paid in favour of &ldquo;<strong>${form.beneficiaryName || "—"}</strong>&rdquo;, towards <strong>${form.purpose || "—"}</strong>.</p>

  <p class="body-text">I undertake to submit the utilisation certificate / supporting vouchers for the above advance in due course${form.settlementDate ? `, on or before <strong>${form.settlementDate}</strong>,` : ""} as per University norms.</p>

  <p class="body-text">Kindly accord sanction at the earliest and oblige.</p>

  <div class="closing">
    <div>Thanking you,</div>
    <div>Yours faithfully,</div>
  </div>

  <div class="sig-area">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="role">Signature of Principal Investigator</div>
      <div class="name">${project.pi}, ${project.piDesignation}</div>
    </div>
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="role">Countersigned by HOD</div>
      <div class="name">${project.departmentFull}</div>
    </div>
  </div>

  <div class="enc">Encl: Advance Sanction Proceedings (system generated)</div>
</div>
</body></html>`;
}

/* ── shared: render an HTML string's .page nodes to a multi-page PDF ── */
async function htmlToPdf(html, filename) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  await new Promise((r) => setTimeout(r, 700));
  const pages = iframe.contentDocument.querySelectorAll(".page");
  const targets = pages.length
    ? Array.from(pages)
    : [iframe.contentDocument.body];
  const pdf = new jsPDF("p", "mm", "a4");
  for (let i = 0; i < targets.length; i++) {
    const canvas = await html2canvas(targets[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const pw = 210;
    const ph = Math.min((canvas.height * pw) / canvas.width, 297);
    if (i > 0) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pw, ph);
  }
  document.body.removeChild(iframe);
  pdf.save(filename);
}

/* ═══════════════════════════════════════════════════════════════════
   SMALL UI PRIMITIVES
═══════════════════════════════════════════════════════════════════ */
const Icon = ({ d, size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const StatusBadge = ({ status }) => {
  if (status === "draft")
    return (
      <span className="asp-badge asp-badge-draft">
        <span className="asp-dot" />
        Awaiting Signature Upload
      </span>
    );
  return (
    <span className="asp-badge asp-badge-review">
      <span className="asp-dot" />
      Under CSRC Director Review
    </span>
  );
};

const Stepper = ({ step }) => {
  const steps = [
    "Select Project",
    "Advance Details",
    "Generate Documents",
    "Upload & Submit",
  ];
  return (
    <div className="asp-stepper">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "";
        return (
          <React.Fragment key={label}>
            <div className={`asp-step ${state}`}>
              <div className="asp-step-circle">{n < step ? "✓" : n}</div>
              <span className="asp-step-label">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`asp-step-line ${n < step ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const emptyForm = () => ({
  head: "",
  amount: "",
  purpose: "",
  beneficiaryName: "",
  settlementDate: "",
  letterSubject: "",
  letterRef: "",
  letterBody: "",
});

const AdvanceSanctionsPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("new"); // 'new' | 'mine'
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [requests, setRequests] = useState(loadRequests());
  const [procNo, setProcNo] = useState("");
  const [signedFile, setSignedFile] = useState(null); // {name, dataUrl, size}
  const [preview, setPreview] = useState(null); // {title, html}
  const [showSuccess, setShowSuccess] = useState(null); // 'draft' | 'submitted'
  const [detailRequest, setDetailRequest] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [resumingId, setResumingId] = useState(null);
  const fileInputRef = useRef(null);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const persist = (list) => {
    setRequests(list);
    saveRequests(list);
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedProject(null);
    setForm(emptyForm());
    setSignedFile(null);
    setProcNo("");
    setResumingId(null);
  };

  const goNewRequest = () => {
    resetFlow();
    setActiveTab("new");
  };

  const selectProject = (p) => {
    setSelectedProject(p);
    setStep(2);
  };

  const validateDetails = () => {
    if (!form.head) return "Please select a head of account.";
    if (!form.amount || Number(form.amount) <= 0)
      return "Please enter a valid advance amount.";
    if (!form.purpose.trim())
      return "Please describe the purpose / expenditure details.";
    if (!form.beneficiaryName.trim())
      return "Please enter the name in whose favour payment is to be made.";
    return null;
  };

  const validateLetter = () => {
    if (!form.letterSubject.trim()) return "Please enter the letter subject.";
    if (!form.letterBody.trim()) return "Please enter the letter body.";
    return null;
  };

  const goToDocuments = () => {
    const err = validateDetails() || validateLetter();
    if (err) {
      alert(err);
      return;
    }
    if (!procNo) setProcNo(nextProcNo(requests));
    setStep(3);
  };

  const proceedingsHTML = useMemo(() => {
    if (!selectedProject || !form.head) return "";
    return generateProceedingsHTML(
      form,
      selectedProject,
      procNo || "ADV/CSRC/DRAFT",
    );
  }, [form, selectedProject, procNo]);

  const letterHTML = useMemo(() => {
    if (!selectedProject || !form.head) return "";
    return generateDirectorLetterHTML(form, selectedProject);
  }, [form, selectedProject]);

  const openPreview = (which) => {
    if (which === "proceedings")
      setPreview({
        title: "Advance Sanction Proceedings",
        html: proceedingsHTML,
      });
    else
      setPreview({
        title: "Covering Letter to CSRC Director",
        html: letterHTML,
      });
  };

  const downloadDoc = (which) => {
    if (which === "proceedings")
      htmlToPdf(
        proceedingsHTML,
        `Advance_Proceedings_${selectedProject.id}.pdf`,
      );
    else htmlToPdf(letterHTML, `Advance_Letter_${selectedProject.id}.pdf`);
  };

  /* Save current progress as a draft and pause here — "Finish Later" */
  const saveAsDraft = () => {
    if (resumingId) {
      const list = requests.map((r) =>
        r.id === resumingId
          ? {
              ...r,
              project: selectedProject,
              form,
              procNo,
              updatedAt: todayDisplay(),
            }
          : r,
      );
      persist(list);
    } else {
      const rec = {
        id: "ADV-" + Date.now(),
        procNo,
        project: selectedProject,
        form,
        status: "draft",
        createdAt: todayDisplay(),
        updatedAt: todayDisplay(),
        signedFile: null,
      };
      persist([rec, ...requests]);
    }
    setShowSuccess("draft");
    setTimeout(() => {
      setShowSuccess(null);
      resetFlow();
      setActiveTab("mine");
    }, 1800);
  };

  /* Resume a saved draft straight into the upload step */
  const resumeDraft = (rec) => {
    setSelectedProject(rec.project);
    setForm(rec.form);
    setProcNo(rec.procNo);
    setSignedFile(rec.signedFile || null);
    setResumingId(rec.id);
    setStep(4);
    setActiveTab("new");
  };

  const handleFilePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("File is too large — please upload a scan under 8 MB.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setSignedFile({
      name: file.name,
      dataUrl,
      size: file.size,
      type: file.type,
    });
  };

  const submitToDirector = () => {
    if (!signedFile) {
      alert(
        "Please upload the physically signed covering letter before submitting.",
      );
      return;
    }
    const now = todayDisplay();
    if (resumingId) {
      const list = requests.map((r) =>
        r.id === resumingId
          ? {
              ...r,
              status: "submitted",
              signedFile,
              submittedAt: now,
              updatedAt: now,
            }
          : r,
      );
      persist(list);
    } else {
      const rec = {
        id: "ADV-" + Date.now(),
        procNo,
        project: selectedProject,
        form,
        status: "submitted",
        createdAt: now,
        updatedAt: now,
        submittedAt: now,
        signedFile,
      };
      persist([rec, ...requests]);
    }
    setShowSuccess("submitted");
    setTimeout(() => {
      setShowSuccess(null);
      resetFlow();
      setActiveTab("mine");
    }, 1800);
  };

  const headInfo =
    selectedProject && form.head
      ? selectedProject.headBudgets[form.head]
      : null;
  const amountNum = Number(form.amount) || 0;
  const inclThis = headInfo ? headInfo.incurred + amountNum : 0;
  const balance = headInfo ? headInfo.allotment - inclThis : 0;

  const filteredRequests = requests.filter((r) =>
    historyFilter === "all" ? true : r.status === historyFilter,
  );

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div className="asp-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home /{" "}
          <span onClick={() => onNavigate?.("projects")}>My Projects</span> /{" "}
          <span onClick={() => onNavigate?.("requestforms")}>
            Request Forms
          </span>{" "}
          / <span>Advance Sanction</span>
        </div>
        <h1 className="page-title">Advance Sanction</h1>
        <p className="page-subtitle">
          Request an advance against your sponsored project and track it through
          to CSRC approval
        </p>
      </div>

      <div className="asp-tabs">
        <button
          className={`asp-tab ${activeTab === "new" ? "active" : ""}`}
          onClick={goNewRequest}
        >
          <Icon d="M12 5v14M5 12h14" /> New Request
        </button>
        <button
          className={`asp-tab ${activeTab === "mine" ? "active" : ""}`}
          onClick={() => setActiveTab("mine")}
        >
          <Icon d="M4 4h16v16H4zM4 9h16M9 4v16" /> My Advance Requests
          {requests.length > 0 && (
            <span className="asp-tab-count">{requests.length}</span>
          )}
        </button>
      </div>

      {activeTab === "new" && (
        <div className="asp-flow">
          <Stepper step={step} />

          {/* STEP 1 — select project */}
          {step === 1 && (
            <div className="asp-card">
              <h2 className="asp-card-title">
                Select the project you are requesting an advance for
              </h2>
              <div className="asp-project-grid">
                {MY_PROJECTS.map((p) => (
                  <div
                    key={p.id}
                    className="asp-project-card"
                    onClick={() => selectProject(p)}
                  >
                    <div className="asp-project-top">
                      <span className="asp-project-file">{p.fileNo}</span>
                      <span className="asp-project-scheme">{p.scheme}</span>
                    </div>
                    <div className="asp-project-title">{p.title}</div>
                    <div className="asp-project-meta">
                      <span>{p.pi}</span>
                      <span>·</span>
                      <span>{p.departmentFull}</span>
                    </div>
                    <div className="asp-project-cost">
                      Total Sanctioned: ₹ {fmtINR(p.sanctionedAmount)}
                    </div>
                    <div className="asp-project-arrow">
                      <Icon d="M5 12h14M12 5l7 7-7 7" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — advance details + letter content */}
          {step === 2 && selectedProject && (
            <div className="asp-card">
              <button className="asp-back-btn" onClick={() => setStep(1)}>
                <Icon d="M15 18l-6-6 6-6" size={16} /> Change Project
              </button>
              <div className="asp-selected-banner">
                <div>
                  <span className="asp-banner-label">Project</span>
                  <strong>{selectedProject.title}</strong>
                </div>
                <div className="asp-banner-meta">
                  {selectedProject.fileNo} · {selectedProject.departmentFull}
                </div>
              </div>

              <h2 className="asp-card-title">Advance details</h2>
              <div className="asp-head-grid">
                {HEADS.map((h) => {
                  const hb = selectedProject.headBudgets[h.key];
                  const avail = hb.allotment - hb.incurred;
                  return (
                    <div
                      key={h.key}
                      className={`asp-head-card ${form.head === h.key ? "selected" : ""}`}
                      style={{ "--head-color": h.color }}
                      onClick={() => upd("head", h.key)}
                    >
                      <div className="asp-head-icon">
                        <Icon d={h.icon} />
                      </div>
                      <div className="asp-head-label">{h.label}</div>
                      <div className="asp-head-hint">{h.hint}</div>
                      <div className="asp-head-avail">
                        Available: ₹ {fmtINR(avail)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {headInfo && (
                <div className="asp-balance-strip">
                  <div>
                    <span>Allocated</span>
                    <strong>₹ {fmtINR(headInfo.allotment)}</strong>
                  </div>
                  <div>
                    <span>Incurred so far</span>
                    <strong>₹ {fmtINR(headInfo.incurred)}</strong>
                  </div>
                  <div>
                    <span>Incl. this advance</span>
                    <strong className={balance < 0 ? "asp-neg" : ""}>
                      ₹ {fmtINR(inclThis)}
                    </strong>
                  </div>
                  <div>
                    <span>Balance after</span>
                    <strong className={balance < 0 ? "asp-neg" : "asp-pos"}>
                      ₹ {fmtINR(balance)}
                    </strong>
                  </div>
                </div>
              )}

              <div className="asp-fields-grid">
                <div className="asp-field">
                  <label>
                    Advance Amount (₹) <span className="asp-req">*</span>
                  </label>
                  <input
                    className="asp-input"
                    type="number"
                    placeholder="e.g. 25000"
                    value={form.amount}
                    onChange={(e) => upd("amount", e.target.value)}
                  />
                </div>
                <div className="asp-field">
                  <label>
                    Payment in Favour of (Beneficiary){" "}
                    <span className="asp-req">*</span>
                  </label>
                  <input
                    className="asp-input"
                    type="text"
                    placeholder="e.g. Dr. S. Balasivanandha Prabu"
                    value={form.beneficiaryName}
                    onChange={(e) => upd("beneficiaryName", e.target.value)}
                  />
                </div>
                <div className="asp-field asp-field-wide">
                  <label>
                    Purpose / Expenditure Details{" "}
                    <span className="asp-req">*</span>
                  </label>
                  <input
                    className="asp-input"
                    type="text"
                    placeholder="e.g. Conduct of national seminar on advanced materials"
                    value={form.purpose}
                    onChange={(e) => upd("purpose", e.target.value)}
                  />
                </div>
                <div className="asp-field">
                  <label>
                    Expected Settlement Date{" "}
                    <span className="asp-optional">(optional)</span>
                  </label>
                  <input
                    className="asp-input"
                    type="date"
                    value={form.settlementDate}
                    onChange={(e) =>
                      upd(
                        "settlementDate",
                        e.target.value.split("-").reverse().join("-"),
                      )
                    }
                  />
                </div>
              </div>

              {amountNum > 0 && (
                <div className="asp-words-strip">
                  Amount in words:{" "}
                  <strong>Rupees {toIndianWords(amountNum)}</strong>
                </div>
              )}

              <h2 className="asp-card-title" style={{ marginTop: 28 }}>
                Covering letter to CSRC Director
              </h2>
              <p className="asp-card-sub">
                This is what you and your HOD will sign — fill in the subject,
                any reference, and the body of the letter.
              </p>
              <div className="asp-fields-grid">
                <div className="asp-field asp-field-wide">
                  <label>
                    Subject <span className="asp-req">*</span>
                  </label>
                  <input
                    className="asp-input"
                    type="text"
                    placeholder="e.g. Request for release of advance towards seminar expenses"
                    value={form.letterSubject}
                    onChange={(e) => upd("letterSubject", e.target.value)}
                  />
                </div>
                <div className="asp-field asp-field-wide">
                  <label>
                    Reference <span className="asp-optional">(optional)</span>
                  </label>
                  <input
                    className="asp-input"
                    type="text"
                    placeholder="e.g. CSRC Proc. No. 2433/CSRC-2/2020, dated 10-12-2020"
                    value={form.letterRef}
                    onChange={(e) => upd("letterRef", e.target.value)}
                  />
                </div>
                <div className="asp-field asp-field-wide">
                  <label>
                    Letter Body <span className="asp-req">*</span>
                  </label>
                  <textarea
                    className="asp-input asp-textarea"
                    rows={5}
                    placeholder="Write the body of the letter — one paragraph per line..."
                    value={form.letterBody}
                    onChange={(e) => upd("letterBody", e.target.value)}
                  />
                </div>
              </div>

              <div className="asp-actions-row">
                <button
                  className="asp-btn asp-btn-primary"
                  onClick={goToDocuments}
                >
                  Generate Documents{" "}
                  <Icon d="M5 12h14M12 5l7 7-7 7" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — generate & review documents */}
          {step === 3 && selectedProject && headInfo && (
            <div className="asp-card">
              <button className="asp-back-btn" onClick={() => setStep(2)}>
                <Icon d="M15 18l-6-6 6-6" size={16} /> Edit Details
              </button>
              <h2 className="asp-card-title">
                Review &amp; download your documents
              </h2>
              <p className="asp-card-sub">
                Proceeding No. <strong>{procNo}</strong> has been
                auto-generated. Download and print the covering letter for
                signature.
              </p>

              <div className="asp-doc-grid">
                <div className="asp-doc-card">
                  <div
                    className="asp-doc-icon"
                    style={{
                      background: "rgba(0,180,255,0.12)",
                      color: "#00b4ff",
                    }}
                  >
                    <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  </div>
                  <div className="asp-doc-name">
                    Advance Sanction Proceedings
                  </div>
                  <div className="asp-doc-desc">
                    System-generated record for the CSRC / departmental file. No
                    signature required from you.
                  </div>
                  <div className="asp-doc-btns">
                    <button
                      className="asp-btn-outline"
                      onClick={() => openPreview("proceedings")}
                    >
                      <Icon
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        size={15}
                      />{" "}
                      Preview
                    </button>
                    <button
                      className="asp-btn-outline green"
                      onClick={() => downloadDoc("proceedings")}
                    >
                      <Icon
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                        size={15}
                      />{" "}
                      Download
                    </button>
                  </div>
                </div>

                <div className="asp-doc-card highlight">
                  <div
                    className="asp-doc-icon"
                    style={{
                      background: "rgba(244,114,182,0.14)",
                      color: "#f472b6",
                    }}
                  >
                    <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  </div>
                  <div className="asp-doc-name">
                    Covering Letter to CSRC Director
                  </div>
                  <div className="asp-doc-desc">
                    Print this, get it signed by <strong>you (PI)</strong> and
                    your <strong>HOD</strong>, then come back and upload the
                    scanned copy.
                  </div>
                  <div className="asp-doc-btns">
                    <button
                      className="asp-btn-outline"
                      onClick={() => openPreview("letter")}
                    >
                      <Icon
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        size={15}
                      />{" "}
                      Preview
                    </button>
                    <button
                      className="asp-btn-outline green"
                      onClick={() => downloadDoc("letter")}
                    >
                      <Icon
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                        size={15}
                      />{" "}
                      Download &amp; Print
                    </button>
                  </div>
                </div>
              </div>

              <div className="asp-finish-later">
                <div className="asp-finish-later-icon">
                  <Icon d="M12 8v4l3 3M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </div>
                <div className="asp-finish-later-text">
                  <strong>Need to get the letter signed first?</strong>
                  <p>
                    Save this request now. It'll wait for you under{" "}
                    <em>My Advance Requests → Awaiting Signature Upload</em>{" "}
                    until you're ready to upload the signed copy and submit.
                  </p>
                </div>
                <button className="asp-btn-outline" onClick={saveAsDraft}>
                  Save &amp; Finish Later
                </button>
              </div>

              <div className="asp-actions-row">
                <button
                  className="asp-btn asp-btn-primary"
                  onClick={() => setStep(4)}
                >
                  I have the signed letter ready{" "}
                  <Icon d="M5 12h14M12 5l7 7-7 7" size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — upload signed letter & submit */}
          {step === 4 && selectedProject && (
            <div className="asp-card">
              <button className="asp-back-btn" onClick={() => setStep(3)}>
                <Icon d="M15 18l-6-6 6-6" size={16} /> Back to Documents
              </button>
              <h2 className="asp-card-title">
                Upload the physically signed letter
              </h2>
              <p className="asp-card-sub">
                Upload a scan or clear photo of the covering letter, signed by
                both the Principal Investigator and the HOD.
              </p>

              <div
                className={`asp-upload-zone ${signedFile ? "filled" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={handleFilePick}
                />
                {signedFile ? (
                  <>
                    <div className="asp-upload-icon done">
                      <Icon d="M20 6L9 17l-5-5" />
                    </div>
                    <div className="asp-upload-filename">{signedFile.name}</div>
                    <div className="asp-upload-sub">
                      {(signedFile.size / 1024).toFixed(0)} KB — click to
                      replace
                    </div>
                  </>
                ) : (
                  <>
                    <div className="asp-upload-icon">
                      <Icon d="M12 16V4M6 10l6-6 6 6M4 20h16" />
                    </div>
                    <div className="asp-upload-filename">
                      Click to upload signed letter
                    </div>
                    <div className="asp-upload-sub">
                      PDF, JPG or PNG — up to 8 MB
                    </div>
                  </>
                )}
              </div>

              {signedFile && signedFile.type?.startsWith("image/") && (
                <img
                  src={signedFile.dataUrl}
                  alt="Signed letter preview"
                  className="asp-upload-preview-img"
                />
              )}

              <div className="asp-summary-box">
                <div className="asp-summary-title">Request Summary</div>
                <div className="asp-summary-grid">
                  <div>
                    <span>Proceeding No.</span>
                    <strong>{procNo}</strong>
                  </div>
                  <div>
                    <span>Project</span>
                    <strong>{selectedProject.fileNo}</strong>
                  </div>
                  <div>
                    <span>Head</span>
                    <strong>
                      {HEADS.find((h) => h.key === form.head)?.label}
                    </strong>
                  </div>
                  <div>
                    <span>Amount</span>
                    <strong>₹ {fmtINR(amountNum)}</strong>
                  </div>
                  <div>
                    <span>Beneficiary</span>
                    <strong>{form.beneficiaryName}</strong>
                  </div>
                  <div>
                    <span>Purpose</span>
                    <strong>{form.purpose}</strong>
                  </div>
                </div>
              </div>

              <div className="asp-actions-row">
                <button className="asp-btn-outline" onClick={saveAsDraft}>
                  Save &amp; Finish Later
                </button>
                <button
                  className="asp-btn asp-btn-primary"
                  disabled={!signedFile}
                  onClick={submitToDirector}
                >
                  Submit to CSRC Director{" "}
                  <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "mine" && (
        <div className="asp-card">
          <div className="asp-history-head">
            <h2 className="asp-card-title" style={{ marginBottom: 0 }}>
              My Advance Requests
            </h2>
            <div className="asp-filter-chips">
              {[
                { key: "all", label: "All" },
                { key: "draft", label: "Awaiting Signature" },
                { key: "submitted", label: "Under CSRC Review" },
              ].map((f) => (
                <button
                  key={f.key}
                  className={`asp-chip ${historyFilter === f.key ? "active" : ""}`}
                  onClick={() => setHistoryFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="asp-empty">
              <div className="asp-empty-ring">
                <Icon
                  d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  size={30}
                />
              </div>
              <h3>No requests here yet</h3>
              <p>
                Submit an advance sanction request and it will show up in this
                list.
              </p>
              <button
                className="asp-btn asp-btn-primary"
                onClick={goNewRequest}
              >
                + New Advance Request
              </button>
            </div>
          ) : (
            <div className="asp-req-list">
              {filteredRequests.map((r) => (
                <div key={r.id} className="asp-req-row">
                  <div className="asp-req-main">
                    <div className="asp-req-title-line">
                      <span className="asp-req-proc">{r.procNo}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="asp-req-project">{r.project.title}</div>
                    <div className="asp-req-meta">
                      {HEADS.find((h) => h.key === r.form.head)?.label} · ₹{" "}
                      {fmtINR(Number(r.form.amount) || 0)} ·{" "}
                      {r.form.beneficiaryName}
                    </div>
                    <div className="asp-req-date">
                      Created {r.createdAt}
                      {r.submittedAt ? ` · Submitted ${r.submittedAt}` : ""}
                    </div>
                  </div>
                  <div className="asp-req-actions">
                    {r.status === "draft" ? (
                      <button
                        className="asp-btn asp-btn-small"
                        onClick={() => resumeDraft(r)}
                      >
                        Upload &amp; Submit →
                      </button>
                    ) : (
                      <button
                        className="asp-btn-outline asp-btn-small"
                        onClick={() => setDetailRequest(r)}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Preview modal ── */}
      {preview && (
        <div
          className="asp-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null);
          }}
        >
          <div className="asp-modal-box">
            <div className="asp-modal-head">
              <span>{preview.title}</span>
              <button
                className="asp-modal-close"
                onClick={() => setPreview(null)}
              >
                ✕
              </button>
            </div>
            <iframe
              className="asp-modal-frame"
              srcDoc={preview.html}
              title={preview.title}
            />
          </div>
        </div>
      )}

      {/* ── Detail modal for submitted requests ── */}
      {detailRequest && (
        <div
          className="asp-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailRequest(null);
          }}
        >
          <div className="asp-modal-box">
            <div className="asp-modal-head">
              <span>
                {detailRequest.procNo} — {detailRequest.project.title}
              </span>
              <button
                className="asp-modal-close"
                onClick={() => setDetailRequest(null)}
              >
                ✕
              </button>
            </div>
            <div className="asp-detail-body">
              <div className="asp-summary-box">
                <div className="asp-summary-grid">
                  <div>
                    <span>Head</span>
                    <strong>
                      {
                        HEADS.find((h) => h.key === detailRequest.form.head)
                          ?.label
                      }
                    </strong>
                  </div>
                  <div>
                    <span>Amount</span>
                    <strong>
                      ₹ {fmtINR(Number(detailRequest.form.amount) || 0)}
                    </strong>
                  </div>
                  <div>
                    <span>Beneficiary</span>
                    <strong>{detailRequest.form.beneficiaryName}</strong>
                  </div>
                  <div>
                    <span>Purpose</span>
                    <strong>{detailRequest.form.purpose}</strong>
                  </div>
                  <div>
                    <span>Created</span>
                    <strong>{detailRequest.createdAt}</strong>
                  </div>
                  <div>
                    <span>Submitted</span>
                    <strong>{detailRequest.submittedAt || "—"}</strong>
                  </div>
                </div>
              </div>
              <div className="asp-detail-btns">
                <button
                  className="asp-btn-outline"
                  onClick={() =>
                    downloadDoc("proceedings") ||
                    setPreview({
                      title: "Advance Sanction Proceedings",
                      html: generateProceedingsHTML(
                        detailRequest.form,
                        detailRequest.project,
                        detailRequest.procNo,
                      ),
                    })
                  }
                >
                  View Proceedings
                </button>
                <button
                  className="asp-btn-outline"
                  onClick={() =>
                    setPreview({
                      title: "Covering Letter",
                      html: generateDirectorLetterHTML(
                        detailRequest.form,
                        detailRequest.project,
                      ),
                    })
                  }
                >
                  View Covering Letter
                </button>
                {detailRequest.signedFile &&
                  (detailRequest.signedFile.type?.startsWith("image/") ? (
                    <a
                      className="asp-btn-outline"
                      href={detailRequest.signedFile.dataUrl}
                      download={detailRequest.signedFile.name}
                    >
                      Download Signed Copy
                    </a>
                  ) : (
                    <a
                      className="asp-btn-outline"
                      href={detailRequest.signedFile.dataUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Signed Copy
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Success overlay ── */}
      {showSuccess && (
        <div className="asp-success-overlay">
          <div className="asp-success-box">
            <div className="asp-success-check">✓</div>
            <h2>
              {showSuccess === "draft"
                ? "Saved for Later"
                : "Submitted to CSRC Director"}
            </h2>
            <p>
              {showSuccess === "draft"
                ? 'Find it anytime under "My Advance Requests → Awaiting Signature Upload".'
                : "Your advance sanction request is now under CSRC Director review."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvanceSanctionsPage;
