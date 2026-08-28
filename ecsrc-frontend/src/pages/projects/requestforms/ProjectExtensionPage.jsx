// PATH: frontend/src/pages/projects/requestforms/ProjectExtensionPage.jsx
import React, { useState, useEffect, useRef } from "react";
import "./ProjectExtensionPage.css";
import html2pdf from "html2pdf.js";
import { useProjectContext } from "../requestforms/ProjectContext";
import axios from "axios";
/* ─── Static lookup data ───────────────────────────────────────────────────── */

const PI_DIRECTORY = [
  {
    name: "Dr. S. Balasivanandha Prabu",
    desig: "Professor",
    dept: "Department of Mechanical Engineering",
    campus: "CEG Campus",
  },
  {
    name: "Dr. K. Rajeswari",
    desig: "Professor",
    dept: "Department of Electronics & Communication Engineering",
    campus: "CEG Campus",
  },
  {
    name: "Dr. P. Anbalagan",
    desig: "Associate Professor",
    dept: "Department of Biotechnology",
    campus: "ACT Campus",
  },
  {
    name: "Dr. T. Vijayakumar",
    desig: "Professor",
    dept: "Department of Electrical Engineering",
    campus: "CEG Campus",
  },
  {
    name: "Dr. P. Varalakshmi",
    desig: "Director",
    dept: "Centre for Artificial Intelligence and Data Science Research & Applications",
    campus: "CEG Campus",
  },
  {
    name: "Dr. R. Karthikeyan",
    desig: "Professor",
    dept: "Department of Computer Science and Engineering",
    campus: "CEG Campus",
  },
  { name: "Other (specify manually)", desig: "", dept: "", campus: "" },
];

const PI_DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Director",
  "Coordinator",
  "Principal Investigator",
  "Other (specify manually)",
];

const DEPARTMENTS = [
  "Department of Biotechnology",
  "Department of Chemical Engineering",
  "Department of Civil Engineering",
  "Department of Computer Science and Engineering",
  "Department of Electrical Engineering",
  "Department of Electrical and Electronics Engineering",
  "Department of Electronics & Communication Engineering",
  "Department of Mechanical Engineering",
  "Centre for Artificial Intelligence and Data Science Research & Applications",
  "Technology Enabling Centre",
  "Other (specify manually)",
];

const CAMPUSES = [
  "CEG Campus",
  "MIT Campus",
  "ACT Campus",
  "SAP Campus",
  "Other (specify manually)",
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const todayDMY = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const parseDMY = (str) => {
  if (!str) return null;
  const [d, m, y] = str.split("-");
  return new Date(+y, +m - 1, +d);
};

const formatDMY = (date) => {
  if (!date) return "";
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
};

const durationBetween = (startDMY, endDate) => {
  const start = parseDMY(startDMY);
  if (!start || !endDate) return "";
  const diffMs = endDate - start;
  if (diffMs <= 0) return "";
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.round(diffDays / 30.44);
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m
      ? `${y} Year${y > 1 ? "s" : ""} ${m} Month${m > 1 ? "s" : ""}`
      : `${y} Year${y > 1 ? "s" : ""}`;
  }
  return `${months} Month${months > 1 ? "s" : ""}`;
};

// Add this helper near the top with other helpers:
const dmyToISO = (dmy) => {
  if (!dmy) return "";
  const [d, m, y] = dmy.split("-");
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};
const isoToDMY = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

/* ─── Number → Indian Words ────────────────────────────────────────────────── */
const ONES_W = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS_W = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function twoDigitWords(n) {
  if (n < 20) return ONES_W[n];
  return TENS_W[Math.floor(n / 10)] + (n % 10 ? " " + ONES_W[n % 10] : "");
}
function threeDigitWords(n) {
  const h = Math.floor(n / 100),
    r = n % 100;
  return (
    (h ? ONES_W[h] + " Hundred" : "") +
    (r ? (h ? " " : "") + twoDigitWords(r) : "")
  );
}
function numberToIndianWords(num) {
  let n = Math.round(parseFloat(num));
  if (!n || isNaN(n) || n <= 0) return "";
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const parts = [];
  if (crore) parts.push(threeDigitWords(crore) + " Crore");
  if (lakh) parts.push(threeDigitWords(lakh) + " Lakh");
  if (thousand) parts.push(threeDigitWords(thousand) + " Thousand");
  if (n) parts.push(threeDigitWords(n));
  return parts.join(" ") + " Rupees Only";
}

/* ─── SearchableSelect ─────────────────────────────────────────────────────── */
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className={`ext-ss ${open ? "ext-ss-open" : ""}`} ref={ref}>
      <div className="ext-ss-trigger" onClick={() => setOpen(!open)}>
        <span className={value ? "ext-ss-val" : "ext-ss-ph"}>
          {value || placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="ext-ss-chevron"
        >
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </div>
      {open && (
        <div className="ext-ss-drop">
          <input
            className="ext-ss-search"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div
            className={`ext-ss-opt ${!value ? "active" : ""}`}
            onClick={() => {
              onChange("");
              setOpen(false);
              setQ("");
            }}
          >
            — Select —
          </div>
          {filtered.map((o) => (
            <div
              key={o}
              className={`ext-ss-opt ${value === o ? "active" : ""}`}
              onClick={() => {
                onChange(o);
                setOpen(false);
                setQ("");
              }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Step Bar ─────────────────────────────────────────────────────────────── */
function StepBar({ steps, current }) {
  return (
    <div className="ext-stepbar">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div
            className={`ext-step ${current === i + 1 ? "active" : current > i + 1 ? "done" : ""}`}
          >
            <div className="ext-step-circle">
              {current > i + 1 ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="ext-step-label">{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div className={`ext-step-line ${current > i + 1 ? "done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Field wrapper ────────────────────────────────────────────────────────── */
const Field = ({ label, children, required, hint, span }) => (
  <div className={`ext-field${span ? " ext-span" : ""}`}>
    <label className="ext-label">
      {label}
      {required && <span className="ext-req">*</span>}
    </label>
    {children}
    {hint && <div className="ext-hint">{hint}</div>}
  </div>
);

/* ─── Computed (read-only) field ───────────────────────────────────────────── */
const ComputedField = ({ value, placeholder }) => (
  <div className="ext-computed">
    {value || <span className="ext-computed-ph">{placeholder}</span>}
  </div>
);

/* ─── Reference list editor ────────────────────────────────────────────────── */
function RefEditor({ refs, onChange, editable }) {
  const patch = (i, val) =>
    onChange(refs.map((r, idx) => (idx === i ? { ...r, text: val } : r)));
  const add = () => onChange([...refs, { no: refs.length + 1, text: "" }]);
  const del = (i) =>
    onChange(
      refs.filter((_, idx) => idx !== i).map((r, ix) => ({ ...r, no: ix + 1 })),
    );

  return (
    <div className="ext-ref-list">
      {refs.map((r, i) => (
        <div key={i} className="ext-ref-row">
          <span className="ext-ref-no">{r.no}.</span>
          {editable ? (
            <>
              <textarea
                value={r.text}
                onChange={(e) => patch(i, e.target.value)}
                rows={2}
                className="ext-ref-ta"
                placeholder="Reference text…"
              />
              <button
                className="ext-ref-del"
                onClick={() => del(i)}
                title="Remove"
              >
                ✕
              </button>
            </>
          ) : (
            <span className="ext-ref-text">{r.text || <em>—</em>}</span>
          )}
        </div>
      ))}
      {editable && (
        <button className="ext-add-btn" onClick={add}>
          ＋ Add Reference
        </button>
      )}
    </div>
  );
}

/* ─── Previous Extensions editor ───────────────────────────────────────────── */
function PrevExtEditor({ items }) {
  return (
    <table className="ext-prev-table">
      <thead>
        <tr>
          <th>Sl.</th>
          <th>Extension Period</th>
          <th>Funding Agency Approval</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.period}</td>
            <td>{item.approval}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── LIVE REPORT PREVIEW (matches OfficeProjectExtensionPage's ExtensionReport) ── */
function ExtensionReportPreview({ draft }) {
  const isWith = draft.extensionType === "with";
  const piName = typeof draft.pi === "object" ? draft.pi?.name : draft.pi;
  const piDesig =
    typeof draft.pi === "object" ? draft.pi?.designation : draft.piDesig || "";
  const piDept =
    typeof draft.pi === "object" ? draft.pi?.department : draft.piDept || "";
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
    center: { textAlign: "center" },
    bold: { fontWeight: "bold" },
    body: { textAlign: "justify", marginBottom: "10px" },
    sig: { textAlign: "right", marginTop: "36px", fontWeight: "bold" },
    ref: { textAlign: "left", marginBottom: "10px", lineHeight: "1.7" },
    to: { marginTop: "24px", textAlign: "left" },
    copy: { marginTop: "16px", textAlign: "left" },
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

  return (
    <div style={S.page}>
      <div style={{ ...S.center, marginBottom: "6px" }}>
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
        <span style={S.bold}>Extension of Project period</span>
        {isWith ? " with additional grant" : ""} – Sanction – Accorded
      </div>

      <div
        style={{ textAlign: "left", marginBottom: "10px", lineHeight: "1.7" }}
      >
        <span style={S.bold}>Ref: </span>
        {(draft.references || []).map((r, i) => (
          <div key={i}>
            {r.no}. {r.text}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "8px 0" }}>* * * * *</div>

      <div style={S.body}>
        The {draft.agency || "——"} has sanctioned a project entitled{" "}
        <span style={S.bold}>"{draft.projectTitle || "——"}"</span>{" "}
        {draft.projectScheme ? (
          <>
            {" "}
            under <span style={S.bold}>"{draft.projectScheme}"</span>{" "}
          </>
        ) : (
          ""
        )}
        to <span style={S.bold}>{piName || "——"}</span>,{" "}
        {piDesig ? <span>{piDesig}, </span> : null}
        {piDept}
        {piCampus ? `, ${piCampus}` : ""}, as the Principal Investigator for the
        period of{" "}
        <span style={S.bold}>
          {draft.projectDuration || draft.extensionPeriod || "——"}
        </span>{" "}
        <span style={S.bold}>{draft.sanctionedDate || "——"}</span> to{" "}
        <span style={S.bold}>{draft.originalEndDate || "——"}</span>
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

/* ─── Default form state factories ────────────────────────────────────────── */
function defaultWithout() {
  return {
    extensionType: "without",
    // Project info
    agency: "",
    agencyCustom: "",
    projectTitle: "",
    projectTitleCustom: "",
    projectScheme: "",
    projectSchemeCustom: "",
    piName: "",
    piDesig: "",
    piDept: "",
    piCampus: "",
    totalCost: "",
    // Timeline
    sanctionedDate: "",
    originalEndDate: "",
    duration: "",
    revisedEndDate: "",
    // References & history
    references: [
      { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
      { no: 2, text: "" },
      { no: 3, text: "" },
    ],
    previousExtensions: [],
    // Proceedings
    proceedingNo: "",
    proceedingDate: todayDMY(),
    directorName: "DIRECTOR, CSRC",
    // Reason
    reason: "",
    // Supporting doc
    supportingDoc: null,
    submittedOn: todayDMY(),
    status: "PENDING",
  };
}

function defaultWith() {
  return {
    extensionType: "with",
    // Project info
    agency: "",
    agencyCustom: "",
    projectTitle: "",
    projectTitleCustom: "",
    projectScheme: "",
    projectSchemeCustom: "",
    piName: "",
    piDesig: "",
    piDept: "",
    piCampus: "",
    totalCost: "",
    // Timeline
    sanctionedDate: "",
    originalEndDate: "",
    duration: "",
    revisedEndDate: "",
    // Grant details
    grantAmount: "",
    grantAmountWords: "",
    grantRefNo: "",
    mhNo: "",
    // Bank details
    bankName: "",
    bankNameCustom: "",
    bankAccount: "",
    ifscCode: "",
    bankBranch: "",
    // References & history
    references: [
      { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
      { no: 2, text: "" },
      { no: 3, text: "" },
    ],
    previousExtensions: [],
    // Proceedings
    proceedingNo: "",
    proceedingDate: todayDMY(),
    directorName: "DIRECTOR, CSRC",
    // Reason
    reason: "",
    // Supporting doc
    supportingDoc: null,
    submittedOn: todayDMY(),
    status: "PENDING",
  };
}
const getUser = () => {
  try {
    const u =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));
    console.log("getUser:", u);
    return u;
  } catch {
    return null;
  }
};
/* ═══════════════════════════════════════════════════════════════════════════
   FORM: Without Financial Support (4 steps)
═══════════════════════════════════════════════════════════════════════════ */
function FormWithout({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(defaultWithout());
  const [agencies, setAgencies] = useState([]);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchAgencies();
    fetchDirector();
  }, []);
  const fetchDirector = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/director",
      );

      console.log("DIRECTOR RESPONSE =", res.data);

      setData((prev) => ({
        ...prev,
        directorName: res.data.staff_name || res.data.name || "",
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAgencies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/agencies",
        {
          params: { user_id: userId },
        },
      );

      console.log("AGENCIES RESPONSE:", res.data);

      setAgencies(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const user = getUser();
  const userId = user?.id;
  const reportRef = useRef(null);
  const s = (k) => (v) => setData((d) => ({ ...d, [k]: v }));

  const effAgency =
    data.agency === "Other (specify manually)"
      ? data.agencyCustom
      : data.agency;
  const effTitle =
    data.projectTitle === "Other (specify manually)"
      ? data.projectTitleCustom
      : data.projectTitle;
  const effScheme =
    data.projectScheme === "Other (specify manually)"
      ? data.projectSchemeCustom
      : data.projectScheme;

  // Computed fields
  const revisedEndDateObj = data.revisedEndDate
    ? parseDMY(data.revisedEndDate)
    : null;
  const extensionPeriod =
    data.originalEndDate && revisedEndDateObj
      ? durationBetween(data.originalEndDate, revisedEndDateObj)
      : "";

  // Min date for revised end
  const minRevisedDate = (() => {
    const d = parseDMY(data.originalEndDate);
    if (!d) return "";
    d.setDate(d.getDate() + 1);
    return formatDMY(d);
  })();

  const selectPI = (name) => {
    if (name === "Other (specify manually)") {
      setData((d) => ({
        ...d,
        piName: name,
        piDesig: "",
        piDept: "",
        piCampus: "",
      }));
      return;
    }
    const rec = PI_DIRECTORY.find((p) => p.name === name);
    setData((d) => ({
      ...d,
      piName: name,
      piDesig: rec ? rec.desig : d.piDesig,
      piDept: rec ? rec.dept : d.piDept,
      piCampus: rec ? rec.campus : d.piCampus,
    }));
  };

  const validate = (st) => {
    if (st === 1) {
      if (!effAgency) return "Please select a Funding Agency.";
      if (!effTitle) return "Please enter the Project Title.";
      if (!data.piName) return "Please select the Principal Investigator.";
    }
    if (st === 2) {
      if (!data.sanctionedDate) return "Please enter the Sanctioned Date.";
      if (!data.originalEndDate) return "Please enter the Original End Date.";
      if (!data.revisedEndDate) return "Please enter the Revised End Date.";
    }
    if (st === 3) {
      if (data.references.some((r) => !r.text.trim()))
        return "Please fill all reference entries or remove empty ones.";
    }
    return null;
  };

  const next = () => {
    const e = validate(step);
    if (e) {
      alert(e);
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `Extension_Without_${effAgency || "Request"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  };

  const buildDraft = () => ({
    ...data,
    extensionType: "without",
    agency: effAgency,
    projectTitle: effTitle,
    projectScheme: effScheme,
    pi: {
      name: data.piName,
      designation: data.piDesig,
      department: data.piDept,
      campus: data.piCampus,
    },
    extensionPeriod,
    hasLetter: !!data.supportingDoc,
  });

  const STEPS = [
    "Project & PI Info",
    "Timeline Details",
    "References & History",
    "Preview & Submit",
  ];
  const handleAgencyChange = async (agency) => {
    setData((prev) => ({
      ...prev,
      agency,
    }));

    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/projects",
        {
          params: {
            user_id: userId,
            agency,
          },
        },
      );

      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const handleProjectChange = async (title) => {
    const project = projects.find((p) => p.project_title === title);

    if (!project) return;

    try {
      const previousRes = await axios.get(
        `http://localhost:5000/api/extensions/previous/${project.id}`,
      );
      console.log(previousRes.data);
      const previousExtensions = previousRes.data.map((ext) => ({
        period: formatDate(ext.revised_end_date),
        approval: ext.remarks || "Approved",
      }));

      setData((prev) => ({
        ...prev,

        projectTitle: project.project_title,
        projectScheme: project.scheme || "",
        project_id: project.id,

        piName: project.pi_name || "",
        piDesig: project.pi_designation || "",
        piDept: project.pi_department || "",
        piCampus: project.pi_campus || "",

        totalCost: project.total_cost || "",

        sanctionedDate: formatDate(project.project_start_date),

        originalEndDate: formatDate(project.project_end_date),

        previousExtensions,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="ext-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* ── STEP 1: Project & PI Info ── */}
      {step === 1 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">📋</span>Project & Principal
            Investigator
          </div>
          <div className="ext-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect
                options={agencies}
                value={data.agency}
                onChange={handleAgencyChange}
                placeholder="Select agency..."
              />
              {data.agency === "Other (specify manually)" && (
                <input
                  className="ext-input ext-mt8"
                  placeholder="Type agency name…"
                  value={data.agencyCustom}
                  onChange={(e) => s("agencyCustom")(e.target.value)}
                />
              )}
            </Field>

            <Field label="Project" required span>
              <SearchableSelect
                options={projects.map((p) => p.project_title)}
                value={data.projectTitle}
                onChange={handleProjectChange}
                placeholder="Select Project..."
              />
            </Field>

            <Field label="Project Scheme">
              <input
                className="ext-input"
                value={data.projectScheme}
                readOnly
              />
            </Field>

            <Field label="Total Project Cost (₹)">
              <input
                className="ext-input"
                type="number"
                placeholder="e.g. 2500000"
                value={data.totalCost}
                onChange={(e) => s("totalCost")(e.target.value)}
              />
            </Field>

            <Field label="PI Name" required>
              <SearchableSelect
                options={PI_DIRECTORY.map((p) => p.name)}
                value={data.piName}
                onChange={selectPI}
                placeholder="Select PI…"
              />
            </Field>

            <Field label="PI Designation">
              <SearchableSelect
                options={PI_DESIGNATIONS}
                value={data.piDesig}
                onChange={s("piDesig")}
                placeholder="Select designation…"
              />
            </Field>

            <Field label="Department / Centre" span>
              <SearchableSelect
                options={DEPARTMENTS}
                value={data.piDept}
                onChange={s("piDept")}
                placeholder="Select department…"
              />
            </Field>

            <Field label="Campus">
              <SearchableSelect
                options={CAMPUSES}
                value={data.piCampus}
                onChange={s("piCampus")}
                placeholder="Select campus…"
              />
            </Field>

            <Field
              label="Supporting Document (Extension Letter from Agency)"
              hint="PDF, DOC, DOCX, JPG accepted"
              span
            >
              <input
                className="ext-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => s("supportingDoc")(e.target.files[0])}
              />
              {data.supportingDoc && (
                <div className="ext-file-name">
                  📎 {data.supportingDoc.name}
                </div>
              )}
            </Field>
          </div>
          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Timeline Details ── */}
      {step === 2 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">📅</span>Extension Timeline
          </div>

          <div className="ext-timeline-strip">
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-blue" />
              <div className="ext-tl-label">Sanctioned</div>
              <div className="ext-tl-date">{data.sanctionedDate || "—"}</div>
            </div>
            <div className="ext-tl-bar ext-tl-bar-blue">
              <span>
                {durationBetween(
                  data.sanctionedDate,
                  parseDMY(data.originalEndDate),
                ) || "Duration"}
              </span>
            </div>
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-amber" />
              <div className="ext-tl-label">Original End</div>
              <div className="ext-tl-date">{data.originalEndDate || "—"}</div>
            </div>
            <div className="ext-tl-bar ext-tl-bar-green">
              <span>{extensionPeriod || "Extension"}</span>
            </div>
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-green" />
              <div className="ext-tl-label">Revised End</div>
              <div className="ext-tl-date">{data.revisedEndDate || "—"}</div>
            </div>
          </div>

          <div className="ext-grid-2">
            <Field
              label="Sanctioned / Start Date"
              required
              hint="Pick from calendar"
            >
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.sanctionedDate)}
                onChange={(e) => s("sanctionedDate")(isoToDMY(e.target.value))}
              />
            </Field>

            <Field label="Original End Date" required hint="Pick from calendar">
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.originalEndDate)}
                min={dmyToISO(data.sanctionedDate)}
                onChange={(e) => s("originalEndDate")(isoToDMY(e.target.value))}
              />
            </Field>

            <Field label="Original Duration" hint="Auto-calculated">
              <ComputedField
                value={durationBetween(
                  data.sanctionedDate,
                  parseDMY(data.originalEndDate),
                )}
                placeholder="Pick start & end dates…"
              />
            </Field>

            <Field label="Revised End Date" required hint="Pick from calendar">
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.revisedEndDate)}
                min={dmyToISO(data.originalEndDate)}
                onChange={(e) => s("revisedEndDate")(isoToDMY(e.target.value))}
              />
            </Field>

            <Field label="Extension Period" hint="Auto-calculated">
              <ComputedField
                value={extensionPeriod}
                placeholder="Fill dates above to calculate…"
              />
            </Field>
          </div>

          <Field
            label="Reason for Extension"
            hint="Briefly explain why the extension is needed"
            span
          >
            <textarea
              className="ext-input ext-textarea"
              rows={4}
              placeholder="The funding agency has extended the duration of the above mentioned project without any additional grant..."
              value={data.reason}
              onChange={(e) => s("reason")(e.target.value)}
            />
          </Field>

          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: References & History ── */}
      {step === 3 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">📚</span>References & Extension
            History
          </div>

          <div className="ext-section-label">
            References (Ref: list in CSRC proceedings)
          </div>
          <RefEditor
            refs={data.references}
            onChange={(refs) =>
              setData((prev) => ({
                ...prev,
                references: refs,
              }))
            }
            editable={true}
          />

          {data.previousExtensions?.length > 0 && (
            <>
              <div className="ext-section-label" style={{ marginTop: "24px" }}>
                Previous Extensions
              </div>

              <PrevExtEditor items={data.previousExtensions} />
            </>
          )}

          <div className="ext-section-label" style={{ marginTop: "24px" }}>
            Proceedings Details
          </div>
          <div className="ext-grid-2">
            <Field label="Proceeding No.">
              <input
                className="ext-input"
                placeholder="e.g. CSRC/EXT/2026/001"
                value={data.proceedingNo}
                onChange={(e) => s("proceedingNo")(e.target.value)}
              />
            </Field>
            <Field label="Proceeding Date" hint="DD-MM-YYYY">
              <input
                className="ext-input"
                placeholder={todayDMY()}
                value={data.proceedingDate}
                onChange={(e) => s("proceedingDate")(e.target.value)}
              />
            </Field>
            <Field label="Director Name">
              <input className="ext-input" value={data.directorName} readOnly />
            </Field>
          </div>

          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Preview Report →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Preview & Submit ── */}
      {step === 4 && (
        <div className="ext-animate">
          <div className="ext-preview-toolbar">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="ext-btn ext-btn-download"
                onClick={downloadPDF}
              >
                📄 Download PDF
              </button>
              <button
                className="ext-btn ext-btn-primary"
                onClick={() => onSubmit(buildDraft())}
              >
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="ext-report-shadow">
            <div ref={reportRef}>
              <ExtensionReportPreview draft={buildDraft()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM: With Financial Support (4 steps)
═══════════════════════════════════════════════════════════════════════════ */
function FormWith({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(defaultWith());
  const [agencies, setAgencies] = useState([]);
  const [projects, setProjects] = useState([]);

  const user = getUser();
  const userId = user?.id;
  console.log("USER ID =", userId);
  useEffect(() => {
    fetchAgencies();
    fetchDirector();
  }, []);
  const fetchDirector = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/director",
      );

      console.log("DIRECTOR RESPONSE =", res.data);

      setData((prev) => ({
        ...prev,
        directorName: res.data.staff_name || res.data.name || "",
      }));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAgencies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/agencies",
        {
          params: { user_id: userId },
        },
      );

      console.log("AGENCIES RESPONSE:", res.data);

      setAgencies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAgencyChange = async (agency) => {
    setData((prev) => ({
      ...prev,
      agency,
    }));

    try {
      const res = await axios.get(
        "http://localhost:5000/api/extensions/projects",
        {
          params: {
            user_id: userId,
            agency,
          },
        },
      );

      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const reportRef = useRef(null);
  const s = (k) => (v) => setData((d) => ({ ...d, [k]: v }));

  const effAgency =
    data.agency === "Other (specify manually)"
      ? data.agencyCustom
      : data.agency;
  const effTitle =
    data.projectTitle === "Other (specify manually)"
      ? data.projectTitleCustom
      : data.projectTitle;
  const effScheme =
    data.projectScheme === "Other (specify manually)"
      ? data.projectSchemeCustom
      : data.projectScheme;
  const effBank =
    data.bankName === "Other (specify manually)"
      ? data.bankNameCustom
      : data.bankName;

  // Computed fields
  const revisedEndDateObj = data.revisedEndDate
    ? parseDMY(data.revisedEndDate)
    : null;
  const extensionPeriod =
    data.originalEndDate && revisedEndDateObj
      ? durationBetween(data.originalEndDate, revisedEndDateObj)
      : "";

  // Auto-compute grant words
  useEffect(() => {
    setData((d) => ({
      ...d,
      grantAmountWords: numberToIndianWords(d.grantAmount),
    }));
  }, [data.grantAmount]);

  const selectPI = (name) => {
    if (name === "Other (specify manually)") {
      setData((d) => ({
        ...d,
        piName: name,
        piDesig: "",
        piDept: "",
        piCampus: "",
      }));
      return;
    }
    const rec = PI_DIRECTORY.find((p) => p.name === name);
    setData((d) => ({
      ...d,
      piName: name,
      piDesig: rec ? rec.desig : d.piDesig,
      piDept: rec ? rec.dept : d.piDept,
      piCampus: rec ? rec.campus : d.piCampus,
    }));
  };

  const validate = (st) => {
    if (st === 1) {
      if (!effAgency) return "Please select a Funding Agency.";
      if (!effTitle) return "Please enter the Project Title.";
      if (!data.piName) return "Please select the Principal Investigator.";
    }
    if (st === 2) {
      if (!data.sanctionedDate) return "Please enter the Sanctioned Date.";
      if (!data.originalEndDate) return "Please enter the Original End Date.";
      if (!data.revisedEndDate) return "Please enter the Revised End Date.";
    }
    if (st === 3) {
      if (data.references.some((r) => !r.text.trim()))
        return "Please fill all reference entries or remove empty ones.";
    }
    return null;
  };

  const next = () => {
    const e = validate(step);
    if (e) {
      alert(e);
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `Extension_With_Grant_${effAgency || "Request"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  };

  const buildDraft = () => ({
    ...data,
    extensionType: "with",
    agency: effAgency,
    projectTitle: effTitle,
    projectScheme: effScheme,
    bankName: effBank,
    pi: {
      name: data.piName,
      designation: data.piDesig,
      department: data.piDept,
      campus: data.piCampus,
    },
    extensionPeriod,
    hasLetter: !!data.supportingDoc,
  });
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const STEPS = [
    "Project & PI Info",
    "Timeline & Grant Details",
    "References & History",
    "Preview & Submit",
  ];
  const handleProjectChange = async (title) => {
    const project = projects.find((p) => p.project_title === title);

    if (!project) return;

    try {
      const previousRes = await axios.get(
        `http://localhost:5000/api/extensions/previous/${project.id}`,
      );

      const previousExtensions = previousRes.data.map((ext) => ({
        period: formatDate(ext.revised_end_date),
        approval: ext.remarks || "Approved",
      }));
      console.log(previousRes.data);
      setData((prev) => ({
        ...prev,

        projectTitle: project.project_title,
        projectScheme: project.scheme || "",
        project_id: project.id,

        piName: project.pi_name || "",
        piDesig: project.pi_designation || "",
        piDept: project.pi_department || "",
        piCampus: project.pi_campus || "",

        totalCost: project.total_cost || "",

        sanctionedDate: formatDate(project.project_start_date),

        originalEndDate: formatDate(project.project_end_date),

        previousExtensions,
      }));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="ext-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* ── STEP 1: Project & PI Info ── */}
      {step === 1 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">📋</span>Project & Principal
            Investigator
          </div>
          <div className="ext-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect
                options={agencies}
                value={data.agency}
                onChange={handleAgencyChange}
              />
              {data.agency === "Other (specify manually)" && (
                <input
                  className="ext-input ext-mt8"
                  placeholder="Type agency name…"
                  value={data.agencyCustom}
                  onChange={(e) => s("agencyCustom")(e.target.value)}
                />
              )}
            </Field>

            <Field label="Project" required span>
              <SearchableSelect
                options={projects.map((p) => p.project_title)}
                value={data.projectTitle}
                onChange={handleProjectChange}
                placeholder="Select Project..."
              />
            </Field>

            <Field label="Project Scheme">
              <input
                className="ext-input"
                value={data.projectScheme}
                readOnly
              />
            </Field>

            <Field label="Total Project Cost (₹)">
              <input
                className="ext-input"
                type="number"
                placeholder="e.g. 2500000"
                value={data.totalCost}
                onChange={(e) => s("totalCost")(e.target.value)}
              />
            </Field>

            <Field label="PI Name" required>
              <SearchableSelect
                options={PI_DIRECTORY.map((p) => p.name)}
                value={data.piName}
                onChange={selectPI}
                placeholder="Select PI…"
              />
            </Field>

            <Field label="PI Designation">
              <SearchableSelect
                options={PI_DESIGNATIONS}
                value={data.piDesig}
                onChange={s("piDesig")}
                placeholder="Select designation…"
              />
            </Field>

            <Field label="Department / Centre" span>
              <SearchableSelect
                options={DEPARTMENTS}
                value={data.piDept}
                onChange={s("piDept")}
                placeholder="Select department…"
              />
            </Field>

            <Field label="Campus">
              <SearchableSelect
                options={CAMPUSES}
                value={data.piCampus}
                onChange={s("piCampus")}
                placeholder="Select campus…"
              />
            </Field>

            <Field
              label="Supporting Document (Extension Letter from Agency)"
              hint="PDF, DOC, DOCX, JPG accepted"
              span
            >
              <input
                className="ext-file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => s("supportingDoc")(e.target.files[0])}
              />
              {data.supportingDoc && (
                <div className="ext-file-name">
                  📎 {data.supportingDoc.name}
                </div>
              )}
            </Field>
          </div>
          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Timeline & Grant Details ── */}
      {step === 2 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">💰</span>Timeline & Additional Grant
            Details
          </div>

          <div className="ext-timeline-strip">
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-blue" />
              <div className="ext-tl-label">Sanctioned</div>
              <div className="ext-tl-date">{data.sanctionedDate || "—"}</div>
            </div>
            <div className="ext-tl-bar ext-tl-bar-blue">
              <span>
                {durationBetween(
                  data.sanctionedDate,
                  parseDMY(data.originalEndDate),
                ) || "Duration"}
              </span>
            </div>
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-amber" />
              <div className="ext-tl-label">Original End</div>
              <div className="ext-tl-date">{data.originalEndDate || "—"}</div>
            </div>
            <div className="ext-tl-bar ext-tl-bar-green">
              <span>{extensionPeriod || "Extension"}</span>
            </div>
            <div className="ext-tl-node">
              <div className="ext-tl-dot ext-tl-dot-green" />
              <div className="ext-tl-label">Revised End</div>
              <div className="ext-tl-date">{data.revisedEndDate || "—"}</div>
            </div>
          </div>

          <div className="ext-section-label">Timeline</div>
          <div className="ext-grid-2">
            <Field
              label="Sanctioned / Start Date"
              required
              hint="Pick from calendar"
            >
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.sanctionedDate)}
                onChange={(e) => s("sanctionedDate")(isoToDMY(e.target.value))}
              />
            </Field>
            <Field label="Original End Date" required hint="Pick from calendar">
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.originalEndDate)}
                min={dmyToISO(data.sanctionedDate)}
                onChange={(e) => s("originalEndDate")(isoToDMY(e.target.value))}
              />
            </Field>
            <Field label="Original Duration" hint="Auto-calculated">
              <ComputedField
                value={durationBetween(
                  data.sanctionedDate,
                  parseDMY(data.originalEndDate),
                )}
                placeholder="Fill start & end dates…"
              />
            </Field>
            <Field label="Revised End Date" required hint="DD-MM-YYYY">
              <input
                className="ext-input"
                type="date"
                value={dmyToISO(data.revisedEndDate)}
                min={dmyToISO(data.originalEndDate)}
                onChange={(e) => s("revisedEndDate")(isoToDMY(e.target.value))}
              />
            </Field>
            <Field label="Extension Period" hint="Auto-calculated">
              <ComputedField
                value={extensionPeriod}
                placeholder="Fill dates above to calculate…"
              />
            </Field>
          </div>

          <Field
            label="Reason for Extension"
            hint="Briefly explain the reason"
            span
          >
            <textarea
              className="ext-input ext-textarea"
              rows={3}
              placeholder="The funding agency has extended the duration of the project with an additional grant…"
              value={data.reason}
              onChange={(e) => s("reason")(e.target.value)}
            />
          </Field>

          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: References & History ── */}
      {step === 3 && (
        <div className="ext-card ext-animate">
          <div className="ext-card-head">
            <span className="ext-card-icon">📚</span>References & Extension
            History
          </div>

          <div className="ext-section-label">
            References (Ref: list in CSRC proceedings)
          </div>
          <RefEditor
            refs={data.references}
            onChange={(refs) =>
              setData((prev) => ({
                ...prev,
                references: refs,
              }))
            }
            editable={true}
          />

          {data.previousExtensions?.length > 0 && (
            <>
              <div className="ext-section-label" style={{ marginTop: "24px" }}>
                Previous Extensions
              </div>

              <PrevExtEditor items={data.previousExtensions} />
            </>
          )}

          <div className="ext-section-label" style={{ marginTop: "24px" }}>
            Proceedings Details
          </div>
          <div className="ext-grid-2">
            <Field label="Proceeding No.">
              <input
                className="ext-input"
                placeholder="e.g. CSRC/EXT/2026/001"
                value={data.proceedingNo}
                onChange={(e) => s("proceedingNo")(e.target.value)}
              />
            </Field>
            <Field label="Proceeding Date" hint="DD-MM-YYYY">
              <input
                className="ext-input"
                placeholder={todayDMY()}
                value={data.proceedingDate}
                onChange={(e) => s("proceedingDate")(e.target.value)}
              />
            </Field>
            <Field label="Director Name">
              <input className="ext-input" value={data.directorName} readOnly />
            </Field>
          </div>

          <div className="ext-actions">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="ext-btn ext-btn-primary" onClick={next}>
              Preview Report →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Preview & Submit ── */}
      {step === 4 && (
        <div className="ext-animate">
          <div className="ext-preview-toolbar">
            <button className="ext-btn ext-btn-ghost" onClick={back}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="ext-btn ext-btn-download"
                onClick={downloadPDF}
              >
                📄 Download PDF
              </button>
              <button
                className="ext-btn ext-btn-primary"
                onClick={() => onSubmit(buildDraft())}
              >
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="ext-report-shadow">
            <div ref={reportRef}>
              <ExtensionReportPreview draft={buildDraft()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   extensionType is passed from the dashboard route:
     "project-extension-without" → extensionType="without"
     "project-extension-with"    → extensionType="with"
═══════════════════════════════════════════════════════════════════════════ */
export default function ProjectExtensionPage({ extensionType, onNavigate }) {
  const ctx = useProjectContext();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmitted2] = useState(null);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        project_id: data.project_id,

        original_end_date: dmyToISO(data.originalEndDate),

        revised_end_date: dmyToISO(data.revisedEndDate),

        extension_period: data.extensionPeriod,

        reason: data.reason,

        references: data.references,
      };

      const res = await axios.post(
        "http://localhost:5000/api/extensions/submit",
        payload,
      );

      const savedRecord = res.data;

      setSubmitted2(savedRecord);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit extension request");
    }
  };

  const handleBack = () =>
    onNavigate && onNavigate("project-extension-dashboard");

  /* Success screen */
  if (submitted && submittedData) {
    return (
      <div className="ext-page">
        <div className="ext-success-card">
          <div className="ext-success-icon">✅</div>
          <h2 className="ext-success-title">Request Submitted!</h2>
          <p className="ext-success-sub">
            Your project extension request has been submitted to CSRC for
            processing.
          </p>
          <div className="ext-success-meta">
            <div>
              <span>Request ID</span>
              <strong>{submittedData.id}</strong>
            </div>
            <div>
              <span>Type</span>
              <strong>
                {submittedData.extensionType === "with"
                  ? "With Financial Support"
                  : "Without Financial Support"}
              </strong>
            </div>
            <div>
              <span>Agency</span>
              <strong>{submittedData.agency}</strong>
            </div>
            <div>
              <span>Revised End Date</span>
              <strong>{submittedData.revisedEndDate}</strong>
            </div>
            <div>
              <span>Extension Period</span>
              <strong>{submittedData.extensionPeriod}</strong>
            </div>
            <div>
              <span>Submitted On</span>
              <strong>{submittedData.submittedOn}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="ext-status-pending">Under Review</strong>
            </div>
          </div>
          <div className="ext-success-actions">
            <button
              className="ext-btn ext-btn-ghost"
              onClick={() =>
                onNavigate && onNavigate("project-extension-history")
              }
            >
              View History →
            </button>
            <button className="ext-btn ext-btn-primary" onClick={handleBack}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ext-page">
      {/* Page header */}
      <div className="ext-page-header">
        <div className="ext-breadcrumb">
          <span
            className="ext-bc-link"
            onClick={() =>
              onNavigate && onNavigate("project-extension-dashboard")
            }
          >
            Extension Dashboard
          </span>
          <span className="ext-bc-sep">/</span>
          <span>
            {extensionType === "with"
              ? "With Financial Support"
              : "Without Financial Support"}
          </span>
        </div>
        <h1 className="ext-page-title">
          {extensionType === "with"
            ? "💰 Project Extension with Financial Support"
            : "📅 Project Extension without Financial Support"}
        </h1>
        <p className="ext-page-sub">
          {extensionType === "with"
            ? "Request a timeline extension alongside an additional grant instalment released by the funding agency"
            : "Apply for a no-cost timeline extension for your sponsored project"}
        </p>
      </div>

      {extensionType === "without" && (
        <FormWithout onSubmit={handleSubmit} onBack={handleBack} />
      )}
      {extensionType === "with" && (
        <FormWith onSubmit={handleSubmit} onBack={handleBack} />
      )}
      {!extensionType && (
        <div className="ext-card">
          <p>
            No extension type specified. Please go back to the dashboard and
            select a type.
          </p>
          <div className="ext-actions">
            <button className="ext-btn ext-btn-primary" onClick={handleBack}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
