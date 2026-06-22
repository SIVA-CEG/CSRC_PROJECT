import React, { useState, useRef, useEffect } from "react";
import "./ReappropriationPage.css";
import html2pdf from "html2pdf.js";

/* ─── Funding Agencies ─────────────────────────────────────────────────────── */
const FUNDING_AGENCIES = [
  "AICTE","ANRF","ARG","BIRAC","CMRG","CSIR","CSIR-ASPIRE","CVRDE","DBT","DBT-BIRAC",
  "DRDO","DST","FSSAI","Google","HEFA","ICMR","ICSSR","IGSTC","INSA","ISRO","MeitY",
  "MNRE","NABARD","NCERT","SERB","SERB POWER","SERB-SURE","SPARC","SURE","TANGEDCO",
  "TANII","TNPCB","TNSCST","UGC","UGC-DAE CSR","UK Aid","UKIERI",
  "Aeronautics Research and Development Board","Anusandhan National Research Foundation",
  "Biotechnology Industry Research Assistance Council (BIRAC)",
  "Central Council for Research in Unani Medicine (CCRUM)",
  "Central Power Research Institute","Centre for Medical Electronics",
  "Centre for Research, Anna University",
  "Chennai Metropolitan Water Supply and Sewerage Board",
  "Chief Minister Research Grant (CMRG)","CHIP to Startups","CMR",
  "Council of Scientific and Industrial Research","DBT Network Project",
  "DBT, Government of India","Defence Research and Development Organisation",
  "Department of Biotechnology","Department of Environment, Government of Tamil Nadu",
  "Department of Science and Technology","Department of Science and Technology (DST)",
  "Department of Science and Technology (TIDE)","Department of Science and Technology (WTC)",
  "Department of Science and Technology, New Delhi",
  "Department of Telecommunications - Bharat 5G Labs",
  "Department of Telecommunications - USOF","EDALL Systems","Good Food Institute",
  "IIT Kanpur","IKS","Indian Council of Agricultural Research",
  "Indian Council of Medical Research","Indian Council of Social Science Research (ICSSR)",
  "Indian Space Research Organisation","Indo-German Science & Technology Centre (IGSTC)",
  "L&T","Ministry of AYUSH, Government of India","Ministry of Earth Sciences",
  "Ministry of Education (MoE)","Ministry of Electronics and Information Technology",
  "Ministry of Environment, Forest and Climate Change",
  "Ministry of Food Processing Industries","Ministry of Jal Shakti","Ministry of Mines",
  "Ministry of New and Renewable Energy (MNRE)","NLC India Limited",
  "Norwegian Council of Research","PCRA","Science and Engineering Research Board, New Delhi",
  "Tamil Nadu Forest Department","Tamil Nadu Innovation Initiatives (TANII)",
  "Tamil Nadu State Council for Science and Technology","Wellcome Trust-India Alliance",
  "Xagrotor Tek Private Limited","Other (specify manually)",
].sort();

const EXPENDITURE_HEADS = [
  "Manpower","Non-Recurring","Consumables","Travel","Contingency","Other Expenses",
  "Training Program","Overhead","Scientific Social Responsibility",
];

/* ─── Placeholder Project Directory ───────────────────────────────────────────
   TODO: Replace these dummy lookup lists with live data from ProjectContext
   (or your projects API/DB) once that integration is ready. Each PI record
   carries through designation / department / campus so selecting a PI can
   auto-fill the rest, while still allowing manual override. ──────────────── */
const PROJECT_TITLES = [
  "Development of Smart IoT-based Water Quality Monitoring System",
  "Low-Cost Solar Powered Cold Storage for Rural Agriculture",
  "AI-Driven Predictive Maintenance Framework for Manufacturing Units",
  "Novel Biodegradable Polymer Composites for Packaging Applications",
  "Energy-Efficient VLSI Architectures for Edge Computing Devices",
  "Other (specify manually)",
];

const PROJECT_SCHEMES = [
  "CRG","SRG","POWER","TEC","SURE","ECR","MATRICS","Core Research Grant",
  "Start-up Research Grant","Other (specify manually)",
];

const PI_DIRECTORY = [
  { name: "Dr. R. Karthikeyan", desig: "Professor", dept: "Department of Computer Science and Engineering", campus: "CEG Campus" },
  { name: "Dr. S. Meenakshi", desig: "Associate Professor", dept: "Department of Electronics and Communication Engineering", campus: "MIT Campus" },
  { name: "Dr. P. Vignesh", desig: "Assistant Professor", dept: "Department of Mechanical Engineering", campus: "CEG Campus" },
  { name: "Dr. A. Lakshmi Priya", desig: "Professor", dept: "Department of Biotechnology", campus: "ACT Campus" },
  { name: "Dr. M. Suresh Kumar", desig: "Associate Professor", dept: "Department of Civil Engineering", campus: "CEG Campus" },
  { name: "Other (specify manually)", desig: "", dept: "", campus: "" },
];

const PI_DESIGNATIONS = [
  "Professor","Associate Professor","Assistant Professor","Coordinator",
  "Principal Investigator","Co-Principal Investigator","Other (specify manually)",
];

const DEPARTMENTS = [
  "Department of Computer Science and Engineering",
  "Department of Electronics and Communication Engineering",
  "Department of Mechanical Engineering",
  "Department of Civil Engineering",
  "Department of Biotechnology",
  "Department of Chemical Engineering",
  "Department of Electrical and Electronics Engineering",
  "Technology Enabling Centre",
  "Other (specify manually)",
];

const CAMPUSES = [
  "CEG Campus","MIT Campus","ACT Campus","SAP Campus","Other (specify manually)",
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
};
const fmtAmt = (n) => {
  const num = parseFloat(n) || 0;
  return num ? `${num.toLocaleString("en-IN")}/-` : "—";
};

/* ─── Number → Indian Words Converter ─────────────────────────────────────── */
const ONES_W = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen"];
const TENS_W = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigitWords(n) {
  if (n < 20) return ONES_W[n];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS_W[t] + (o ? " " + ONES_W[o] : "");
}
function threeDigitWords(n) {
  const h = Math.floor(n / 100), r = n % 100;
  let out = "";
  if (h) out += ONES_W[h] + " Hundred";
  if (r) out += (out ? " " : "") + twoDigitWords(r);
  return out;
}
function numberToIndianWords(num) {
  let n = Math.round(parseFloat(num));
  if (!n || isNaN(n) || n <= 0) return "";
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh  = Math.floor(n / 100000);   n %= 100000;
  const thousand = Math.floor(n / 1000);  n %= 1000;
  const hundred = n;
  const parts = [];
  if (crore) parts.push(threeDigitWords(crore) + " Crore");
  if (lakh) parts.push(threeDigitWords(lakh) + " Lakh");
  if (thousand) parts.push(threeDigitWords(thousand) + " Thousand");
  if (hundred) parts.push(threeDigitWords(hundred));
  return parts.join(" ") + " Rupees Only";
}

/* ─── SearchableSelect ─────────────────────────────────────────────────────── */
function SearchableSelect({ options, value, onChange, placeholder = "Select…" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className={`rp-ss ${open ? "rp-ss-open" : ""}`} ref={ref}>
      <div className="rp-ss-trigger" onClick={() => setOpen(!open)}>
        <span className={value ? "rp-ss-val" : "rp-ss-ph"}>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rp-ss-chevron">
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </div>
      {open && (
        <div className="rp-ss-drop">
          <input className="rp-ss-search" placeholder="Search…" value={q}
            onChange={e => setQ(e.target.value)} autoFocus />
          <div className={`rp-ss-opt ${!value ? "active" : ""}`}
            onClick={() => { onChange(""); setOpen(false); setQ(""); }}>— Select —</div>
          {filtered.map(o => (
            <div key={o} className={`rp-ss-opt ${value === o ? "active" : ""}`}
              onClick={() => { onChange(o); setOpen(false); setQ(""); }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Step Bar ─────────────────────────────────────────────────────────────── */
function StepBar({ steps, current }) {
  return (
    <div className="rp-stepbar">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`rp-step ${current === i + 1 ? "active" : current > i + 1 ? "done" : ""}`}>
            <div className="rp-step-circle">
              {current > i + 1
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <div className="rp-step-label">{s}</div>
          </div>
          {i < steps.length - 1 && <div className={`rp-step-line ${current > i + 1 ? "done" : ""}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Field ────────────────────────────────────────────────────────────────── */
const Field = ({ label, children, required, hint, span }) => (
  <div className={`rp-field${span ? " rp-span" : ""}`}>
    <label className="rp-label">{label}{required && <span className="rp-req">*</span>}</label>
    {children}
    {hint && <div className="rp-hint">{hint}</div>}
  </div>
);

/* ─── Read-only computed field (for auto-calculated amount-in-words) ───────── */
const ComputedField = ({ value, placeholder }) => (
  <div className="rp-computed">
    {value || <span className="rp-computed-ph">{placeholder}</span>}
  </div>
);

/* ─── PDF Report: Without Installment ─────────────────────────────────────── */
function ReportWithout({ data }) {
  const P  = { fontFamily: "Times New Roman, serif", fontSize: "11pt", color: "#000" };
  const th = { border: "1px solid #000", padding: "5px 8px", textAlign: "center", fontWeight: "bold", background: "#fff" };
  const td = { border: "1px solid #000", padding: "5px 8px" };
  const tdR = { border: "1px solid #000", padding: "5px 8px", textAlign: "right" };
  const tdC = { border: "1px solid #000", padding: "5px 8px", textAlign: "center" };
  const J  = { textAlign: "justify", marginBottom: "10px", lineHeight: "1.6" };
  const B  = { fontWeight: "bold" };

  const totalUnspent = (data.reapHeads || []).reduce((s, h) => s + (parseFloat(h.unspent) || 0), 0);
  const totalAfter   = (data.reapHeads || []).reduce((s, h) => s + (parseFloat(h.afterReap) || 0), 0);
  const totalReapAmount = (data.reapPairs || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  return (
    <div style={{ width: "210mm", background: "#fff", margin: "0 auto", padding: "14mm 16mm", boxSizing: "border-box", ...P }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>Centre for Sponsored Research and Consultancy (CSRC)</div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={B}>Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}</div>
        <div>{data.proceedingDate || today()}</div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={B}>Sub: </span>Anna University – {data.agency || "——"} Project –{" "}
        {data.projectScheme ? `${data.projectScheme} – ` : ""}
        "{data.projectName || "——"}" by {data.piName || "——"} – Re-appropriation – Sanction – Accorded
      </div>

      {(data.references || []).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={B}>Ref: </span>
          {data.references.map((r, i) => (
            <div key={i} style={{ paddingLeft: "0", textAlign: "left" }}>{r.no}. {r.text}</div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>

      <div style={J}>
        The {data.agency || "funding agency"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{" "}
        {data.projectScheme ? <><span style={B}>under "{data.projectScheme}"</span>{" "}</> : ""}
        to <span style={B}>{data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"}</span>,
        as the Principal Investigator for a period of <span style={B}>{data.duration || "——"}</span> from{" "}
        <span style={B}>{data.startDate || "——"}</span> to <span style={B}>{data.endDate || "——"}</span> at a total cost of{" "}
        <span style={B}>Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})</span> vide reference second cited above.
      </div>

      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            Further, a sum of <span style={B}>Rs.{data.previousInstallments.map(i => i.amount).filter(Boolean).join(" + ")}/- </span>
            has already been allotted by the funding agency and the necessary sanction proceedings was issued
            for the implementation of the above said project, as per the details given below:
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
            <thead>
              <tr>{["Sl.No.", "Instalment", "Amount (Rs.)", "Released Date", "Sanction Proceedings No. & Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td>
                  <td style={td}>{inst.no}</td>
                  <td style={tdR}>{inst.amount ? `${inst.amount}/-` : "—"}</td>
                  <td style={tdC}>{inst.releasedDate || "—"}</td>
                  <td style={td}>{inst.procNo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(data.reapPairs || []).map((p, i) => (
        <div style={J} key={i}>
          In the reference {p.refCited || "fourth"} cited above, {data.piName || "——"}, Principal Investigator of the Project,
          has requested to accord sanction for reappropriation to the tune of{" "}
          Rs.{p.amount || "——"}/- ({p.amountWords || "——"}) from "{p.fromHead || "——"}" head
          to "{p.toHead || "——"}" head of the above mentioned project.
        </div>
      ))}

      <div style={J}>
        Accordingly, and as per the powers delegated reference first cited above, an administrative sanction
        is hereby accorded for re-appropriate a sum of{" "}
        <span style={B}>Rs.{totalReapAmount ? totalReapAmount.toLocaleString("en-IN") : "——"}/-{" "}
        ({numberToIndianWords(totalReapAmount) || "——"})</span>{" "}
        as detailed below:
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
        <thead>
          <tr>
            <th style={th}>Sl. No.</th>
            <th style={th}>Head of Account</th>
            <th style={th}>Unspent Amount Available (Rs.)</th>
            <th style={th}>Amount Available after Re-appropriation (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {(data.reapHeads || []).map((h, i) => (
            <tr key={i}>
              <td style={tdC}>{i + 1}</td>
              <td style={td}>{h.head}</td>
              <td style={tdR}>{fmtAmt(h.unspent)}</td>
              <td style={tdR}>{fmtAmt(h.afterReap)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...td, textAlign: "right" }}>Total Amount</td>
            <td style={tdR}>{fmtAmt(totalUnspent)}</td>
            <td style={tdR}>{fmtAmt(totalAfter)}</td>
          </tr>
        </tbody>
      </table>

      <div style={J}>
        The expenditure for the above project will be debitable to {data.mhNo || "M.H.No.——"} –{" "}
        {data.agency || "——"} Project "{data.projectName || "——"}" by {data.piName || "——"},{" "}
        {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"}.
      </div>

      {(data.sanctionRegVol || data.sanctionRegSl) && (
        <div style={{ ...J, marginBottom: "24px" }}>
          The above sanction has been entered in the Project Sanction Register Vol – {data.sanctionRegVol} C
          vide Sl.No.{data.sanctionRegSl} at Page No.{data.sanctionRegPage}.
        </div>
      )}

      <div style={{ textAlign: "right", marginBottom: "28px", marginTop: "32px" }}>
        <div style={{ marginBottom: "40px" }}></div>
        <div style={B}>{data.directorName || "DIRECTOR, CSRC"}</div>
      </div>

      <div style={{ marginBottom: "14px", textAlign: "left" }}>
        <div style={B}>To</div>
        <div>The Professor and Head,</div>
        <div>{data.piDept || "——"},</div>
        <div>{data.piCampus || "——"},</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div style={{ textAlign: "left" }}>
        <div style={B}>Copy to:</div>
        <div>1. {data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"} – PI</div>
        <div>2. CSRC – 3</div>
        <div>3. CSRC – 4</div>
      </div>
    </div>
  );
}

/* ─── PDF Report: With Installment ────────────────────────────────────────── */
function ReportWith({ data }) {
  const P  = { fontFamily: "Times New Roman, serif", fontSize: "11pt", color: "#000" };
  const th = { border: "1px solid #000", padding: "5px 7px", textAlign: "center", fontWeight: "bold", background: "#fff", fontSize: "9.5pt" };
  const td = { border: "1px solid #000", padding: "5px 7px", fontSize: "10pt" };
  const tdR = { border: "1px solid #000", padding: "5px 7px", textAlign: "right", fontSize: "10pt" };
  const tdC = { border: "1px solid #000", padding: "5px 7px", textAlign: "center", fontSize: "10pt" };
  const J   = { textAlign: "justify", marginBottom: "10px", lineHeight: "1.6" };
  const B   = { fontWeight: "bold" };

  const heads = data.installmentHeads || [];
  const totalUnspent = heads.reduce((s, h) => s + (parseFloat(h.unspent) || 0), 0);
  const totalInst    = heads.reduce((s, h) => s + (parseFloat(h.installmentAmount) || 0), 0);
  const totalAvail   = totalUnspent + totalInst;
  const totalReapAmount = (data.reapPairs || []).reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  return (
    <div style={{ width: "210mm", background: "#fff", margin: "0 auto", padding: "14mm 16mm", boxSizing: "border-box", ...P }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>Centre for Sponsored Research and Consultancy (CSRC)</div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={B}>Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}</div>
        <div>{data.proceedingDate || today()}</div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={B}>Sub: </span>Anna University – {data.agency || "——"} Project –{" "}
        {data.projectScheme ? `${data.projectScheme} – ` : ""}
        "{data.projectName || "——"}" by {data.piName || "——"} –{" "}
        {data.currentInstallmentNo} &amp; Re-appropriation – Administrative sanction – Accorded
      </div>

      {(data.references || []).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={B}>Ref: </span>
          {data.references.map((r, i) => (
            <div key={i} style={{ paddingLeft: "0", textAlign: "left" }}>{r.no}. {r.text}</div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>

      <div style={J}>
        The {data.agency || "funding agency"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{" "}
        {data.projectScheme ? <><span style={B}>under "{data.projectScheme}"</span>{" "}</> : ""}
        to <span style={B}>{data.piName || "——"}</span>, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"},
        as the Principal Investigator for the period of {data.duration} from{" "}
        <span style={B}>{data.startDate || "——"}</span> to <span style={B}>{data.endDate || "——"}</span>.
        {data.extendedUpto ? ` Further the funding agency has extended the duration of the project period upto ${data.extendedUpto}.` : ""}
      </div>

      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            Further, a sum of <span style={B}>Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})</span>{" "}
            has already been released by the funding agency and the necessary sanction proceedings were issued
            for the implementation of the above said project, as per the details given below:
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
            <thead>
              <tr>{["Sl.No.", "Instalment", "Amount (Rs.)", "Released Date", "Sanction Proceedings No. & Date"].map(h => <th key={h} style={{ ...th, fontSize: "10pt" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td>
                  <td style={td}>{inst.no}</td>
                  <td style={tdR}>{inst.amount ? `${inst.amount}/-` : "—"}</td>
                  <td style={tdC}>{inst.releasedDate || "—"}</td>
                  <td style={td}>{inst.procNo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div style={J}>
        Now, the funding agency has assigned the <span style={B}>{data.currentInstallmentNo}</span> of{" "}
        <span style={B}>Rs.{data.currentInstallmentAmount || "——"}/- ({data.currentInstallmentWords || "——"})</span>{" "}
        to THE DIRECTOR CSRC {data.projectScheme ? `${data.projectScheme.toUpperCase()},` : ""}{" "}
        {data.bankName || "UNION BANK OF INDIA"} A/c No.{data.pfmsRefNo || "——"} through{" "}
        <span style={B}>PFMS Portal</span>, vide reference {data.pfmsRefCited || "fifth"} cited.
      </div>

      <div style={J}>
        In the reference {data.tsaRefCited || "sixth"} cited above, {data.piName || "——"},{" "}
        {data.piDesig || "——"} of the Project, has requested to accord administrative sanction for the
        above amount of Rs.{data.currentInstallmentAmount || "——"}/- and by following CSRC norms.
        {data.tsa ? ` [${data.tsa}].` : ""}
      </div>

      {(data.reapPairs || []).map((p, i) => (
        <div style={J} key={i}>
          Also, requested for reappropriation to the tune of Rs.{p.amount || "——"}/- ({p.amountWords || "——"})
          from "{p.fromHead || "——"}" head to "{p.toHead || "——"}" head vide reference {p.refCited || "seventh"} cited.
        </div>
      ))}

      <div style={J}>
        Accordingly, as per the powers delegated in the reference first cited above, an administrative
        sanction is hereby accorded to {data.toDesig || data.piDesig || "——"},{" "}
        {data.piDept || "——"}, {data.piCampus || "——"} for the {data.currentInstallmentNo} amount of{" "}
        <span style={B}>Rs.{data.currentInstallmentAmount || "——"}/- ({data.currentInstallmentWords || "——"})</span>{" "}
        and reappropriation of available funds towards implementation of the above project as detailed below.
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
        <thead>
          <tr>
            <th style={th}>Sl. No.</th>
            <th style={th}>Head of Account</th>
            <th style={th}>Unspent Amount Available (Rs.)</th>
            <th style={th}>{data.currentInstallmentNo} Amount</th>
            <th style={th}>Total Amount Available</th>
            <th style={th}>Total Amount available after Re-appropriation and {data.currentInstallmentNo} (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {heads.map((h, i) => {
            const u = parseFloat(h.unspent) || 0;
            const a = parseFloat(h.installmentAmount) || 0;
            const total = u + a;
            return (
              <tr key={i}>
                <td style={tdC}>{i + 1}</td>
                <td style={td}>{h.head}</td>
                <td style={tdR}>{u ? `${u.toLocaleString("en-IN")}/-` : "—"}</td>
                <td style={tdR}>{a ? `${a.toLocaleString("en-IN")}/-` : "—"}</td>
                <td style={tdR}>{total ? `${total.toLocaleString("en-IN")}/-` : "—"}</td>
                <td style={tdR}>{total ? `${total.toLocaleString("en-IN")}/-` : "—"}</td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...td, textAlign: "right" }}>Total Amount</td>
            <td style={tdR}>{totalUnspent ? `${totalUnspent.toLocaleString("en-IN")}/-` : "—"}</td>
            <td style={tdR}>{totalInst ? `${totalInst.toLocaleString("en-IN")}/-` : "—"}</td>
            <td style={tdR}>{totalAvail ? `${totalAvail.toLocaleString("en-IN")}/-` : "—"}</td>
            <td style={tdR}>{totalAvail ? `${totalAvail.toLocaleString("en-IN")}/-` : "—"}</td>
          </tr>
        </tbody>
      </table>

      <div style={J}>
        The expenditure for the above project will be debitable under {data.mhNo || "M.H.No.——"} –{" "}
        {data.agency || "——"} Project "{data.projectName || "——"}" by {data.piName || "——"},{" "}
        {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"}.
      </div>

      {(data.sanctionRegVol || data.sanctionRegSl) && (
        <div style={{ ...J, marginBottom: "24px" }}>
          The above sanction has been entered in the Project Sanction Register Vol – {data.sanctionRegVol} C
          vide Sl.No.{data.sanctionRegSl} at Page No.{data.sanctionRegPage}.
        </div>
      )}

      <div style={{ textAlign: "right", marginBottom: "28px", marginTop: "32px" }}>
        <div style={{ marginBottom: "40px" }}></div>
        <div style={B}>{data.directorName || "DIRECTOR, CSRC"}</div>
      </div>

      <div style={{ marginBottom: "14px", textAlign: "left" }}>
        <div style={B}>To</div>
        <div>The {data.toDesig || data.piDesig || "——"},</div>
        <div>{data.piDept || "——"},</div>
        <div>{data.piCampus || "——"},</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div style={{ textAlign: "left" }}>
        <div style={B}>Copy to:</div>
        <div>1. CSRC 3 &amp; 4</div>
      </div>
    </div>
  );
}

/* ─── Default form data factories ──────────────────────────────────────────── */
function defaultWithout() {
  return {
    claimType: "without",
    agency: "", agencyCustom: "",
    projectName: "", projectNameCustom: "",
    projectScheme: "", projectSchemeCustom: "",
    piName: "", piDesig: "", piDept: "", piCampus: "",
    totalCost: "", totalCostWords: "",
    startDate: "", endDate: "", duration: "",
    proceedingNo: "", proceedingDate: today(), directorName: "DIRECTOR, CSRC",
    mhNo: "", sanctionRegVol: "", sanctionRegSl: "", sanctionRegPage: "",
    reapPairs: [
      { fromHead: "", toHead: "", amount: "", amountWords: "", refCited: "fourth" },
    ],
    references: [
      { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
      { no: 2, text: "" },
      { no: 3, text: "" },
      { no: 4, text: "PI Re-appropriation Request dated " + today() + "." },
    ],
    previousInstallments: [
      { no: "I Instalment", amount: "", releasedDate: "", procNo: "" },
    ],
    reapHeads: [
      { head: "", unspent: "", afterReap: "" },
      { head: "", unspent: "", afterReap: "" },
    ],
    supportingDoc: null,
    submittedOn: today(),
    status: "PENDING",
  };
}

function defaultWith() {
  return {
    claimType: "with",
    agency: "", agencyCustom: "",
    projectName: "", projectNameCustom: "",
    projectScheme: "", projectSchemeCustom: "",
    piName: "", piDesig: "", piDept: "", piCampus: "",
    totalCost: "", totalCostWords: "",
    startDate: "", endDate: "", duration: "", extendedUpto: "",
    proceedingNo: "", proceedingDate: today(), directorName: "DIRECTOR, CSRC",
    mhNo: "", sanctionRegVol: "", sanctionRegSl: "", sanctionRegPage: "",
    currentInstallmentNo: "", currentInstallmentAmount: "", currentInstallmentWords: "",
    bankName: "UNION BANK OF INDIA", pfmsRefNo: "",
    pfmsRefCited: "fifth", tsaRefCited: "sixth",
    tsa: "", toDesig: "",
    reapPairs: [
      { fromHead: "", toHead: "", amount: "", amountWords: "", refCited: "seventh" },
    ],
    references: [
      { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
      { no: 2, text: "" },
      { no: 3, text: "" },
      { no: 4, text: "" },
      { no: 5, text: "PFMS Release Advice dated " + today() + "." },
      { no: 6, text: "TSA Request dated " + today() + "." },
      { no: 7, text: "Reappropriation Request dated " + today() + "." },
    ],
    previousInstallments: [
      { no: "I Instalment", amount: "", releasedDate: "", procNo: "" },
    ],
    installmentHeads: [
      { head: "Manpower",    unspent: "", installmentAmount: "" },
      { head: "Contingency", unspent: "", installmentAmount: "" },
    ],
    supportingDoc: null,
    submittedOn: today(),
    status: "PENDING",
  };
}

/* ─── Reusable sub-editors ─────────────────────────────────────────────────── */
function RefEditor({ refs, onChange, editable }) {
  const patch = (i, val) => onChange(refs.map((r, idx) => idx === i ? { ...r, text: val } : r));
  const add   = () => onChange([...refs, { no: refs.length + 1, text: "" }]);
  const del   = (i) => onChange(refs.filter((_, idx) => idx !== i).map((r, ix) => ({ ...r, no: ix + 1 })));
  return (
    <div className="rp-ref-list">
      {refs.map((r, i) => (
        <div key={i} className="rp-ref-row">
          <span className="rp-ref-no">{r.no}.</span>
          {editable ? (
            <>
              <textarea value={r.text} onChange={e => patch(i, e.target.value)} rows={2} className="rp-ref-ta" placeholder="Reference text…" />
              <button className="rp-ref-del" onClick={() => del(i)} title="Remove">✕</button>
            </>
          ) : (
            <span className="rp-ref-text">{r.text || <em>—</em>}</span>
          )}
        </div>
      ))}
      {editable && (
        <button className="rp-add-btn" onClick={add}>＋ Add Reference</button>
      )}
    </div>
  );
}

function InstEditor({ insts, onChange }) {
  const patch = (i, p) => onChange(insts.map((r, idx) => idx === i ? { ...r, ...p } : r));
  const add   = () => onChange([...insts, { no: "", amount: "", releasedDate: "", procNo: "" }]);
  const del   = (i) => onChange(insts.filter((_, idx) => idx !== i));
  return (
    <div className="rp-inst-editor">
      <table className="rp-inst-table">
        <thead>
          <tr>
            <th>Sl.</th><th>Instalment Label</th><th>Amount (₹)</th><th>Released Date</th><th>Proc. No. & Date</th><th></th>
          </tr>
        </thead>
        <tbody>
          {insts.map((inst, i) => (
            <tr key={i}>
              <td className="rp-inst-sl">{i + 1}</td>
              <td><input value={inst.no} onChange={e => patch(i, { no: e.target.value })} placeholder="e.g. I Instalment" className="rp-inst-inp" /></td>
              <td><input value={inst.amount} onChange={e => patch(i, { amount: e.target.value })} placeholder="e.g. 1250000" className="rp-inst-inp" type="number" /></td>
              <td>
                <input
                  value={inst.releasedDate}
                  onChange={e => patch(i, { releasedDate: e.target.value })}
                  type="date"
                  className="rp-inst-inp"
                />
              </td>
              <td><input value={inst.procNo} onChange={e => patch(i, { procNo: e.target.value })} placeholder="No. & Date" className="rp-inst-inp" /></td>
              <td><button className="rp-ref-del" onClick={() => del(i)}>🗑</button></td>
            </tr>
          ))}
          {insts.length === 0 && <tr><td colSpan={6} className="rp-inst-empty">No instalments added</td></tr>}
        </tbody>
      </table>
      <button className="rp-add-btn rp-mt8" onClick={add}>＋ Add Instalment</button>
    </div>
  );
}

/* ─── Re-appropriation Pair Editor (From/To/Amount, repeatable) ───────────── */
function ReapPairEditor({ pairs, onChange, refPrefix }) {
  const patch = (i, p) => onChange(pairs.map((r, idx) => idx === i ? { ...r, ...p } : r));
  const add = () => onChange([...pairs, { fromHead: "", toHead: "", amount: "", amountWords: "", refCited: refPrefix || "" }]);
  const del = (i) => onChange(pairs.filter((_, idx) => idx !== i));

  const onAmountChange = (i, val) => {
    patch(i, { amount: val, amountWords: numberToIndianWords(val) });
  };

  return (
    <div className="rp-reap-pairs">
      {pairs.map((p, i) => (
        <div className="rp-reap-pair-card" key={i}>
          <div className="rp-reap-pair-head">
            <span>Re-appropriation #{i + 1}</span>
            {pairs.length > 1 && (
              <button className="rp-ref-del" onClick={() => del(i)} title="Remove this re-appropriation">🗑</button>
            )}
          </div>
          <div className="rp-grid-2">
            <Field label="From Head (Re-appropriate FROM)" required>
              <SearchableSelect options={EXPENDITURE_HEADS} value={p.fromHead}
                onChange={v => patch(i, { fromHead: v })} placeholder="Select head…" />
            </Field>
            <Field label="To Head (Re-appropriate TO)" required>
              <SearchableSelect options={EXPENDITURE_HEADS} value={p.toHead}
                onChange={v => patch(i, { toHead: v })} placeholder="Select head…" />
            </Field>
            <Field label="Re-appropriation Amount (₹)" required>
              <input className="rp-input" type="number" placeholder="e.g. 250000"
                value={p.amount} onChange={e => onAmountChange(i, e.target.value)} />
            </Field>
            <Field label="Amount in Words" hint="Auto-calculated">
              <ComputedField value={p.amountWords} placeholder="Calculated automatically…" />
            </Field>
            <Field label="Request Reference Cited" hint="Which reference cites this request? e.g. fourth">
              <input className="rp-input" placeholder="e.g. fourth" value={p.refCited}
                onChange={e => patch(i, { refCited: e.target.value })} />
            </Field>
          </div>
        </div>
      ))}
      <button className="rp-add-btn rp-mt8" onClick={add}>＋ Add Another Re-appropriation</button>
    </div>
  );
}

/* ─── FORM: Without Installment (4 steps) ─────────────────────────────────── */
function FormWithout({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(defaultWithout);
  const reportRef = useRef(null);
  const s = (k) => (v) => setData(d => ({ ...d, [k]: v }));
  const eff = data.agency === "Other (specify manually)" ? data.agencyCustom : data.agency;
  const effProjectName = data.projectName === "Other (specify manually)" ? data.projectNameCustom : data.projectName;
  const effScheme = data.projectScheme === "Other (specify manually)" ? data.projectSchemeCustom : data.projectScheme;

  // Auto-calc total cost in words whenever totalCost changes
  useEffect(() => {
    setData(d => ({ ...d, totalCostWords: numberToIndianWords(d.totalCost) }));
  }, [data.totalCost]);

  const selectPI = (name) => {
    if (name === "Other (specify manually)") {
      setData(d => ({ ...d, piName: name, piDesig: "", piDept: "", piCampus: "" }));
      return;
    }
    const rec = PI_DIRECTORY.find(p => p.name === name);
    setData(d => ({
      ...d,
      piName: name,
      piDesig: rec ? rec.desig : d.piDesig,
      piDept: rec ? rec.dept : d.piDept,
      piCampus: rec ? rec.campus : d.piCampus,
    }));
  };

  const validate = (st) => {
    if (st === 1) {
      if (!eff) return "Please select a Funding Agency.";
      if (!effProjectName) return "Please select/enter the Project Name.";
      if (!data.piName) return "Please select the PI Name.";
    }
    if (st === 2) {
      if (data.reapPairs.some(p => !p.fromHead || !p.toHead || !p.amount)) {
        return "Please complete From Head, To Head and Amount for every re-appropriation entry.";
      }
      if (data.reapHeads.some(h => !h.head)) return "Please fill all head names in the budget breakup table.";
    }
    if (st === 3) {
      if (data.references.some(r => !r.text.trim())) return "Please fill all reference entries (or remove empty ones).";
    }
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) { alert(err); return; }
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: `Reappropriation_${eff || "Request"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(reportRef.current).save();
  };

  const patchHead = (i, p) => setData(d => ({ ...d, reapHeads: d.reapHeads.map((h, idx) => idx === i ? { ...h, ...p } : h) }));

  const STEPS = ["Project Info", "Re-appropriation", "References & History", "Preview & Submit"];

  return (
    <div className="rp-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* STEP 1 — Project Info */}
      {step === 1 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">📋</span>Project & PI Information</div>
          <div className="rp-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect options={FUNDING_AGENCIES} value={data.agency} onChange={s("agency")} placeholder="Select agency…" />
              {data.agency === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type agency name…" value={data.agencyCustom} onChange={e => s("agencyCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="Project Name / Title" required span>
              <SearchableSelect options={PROJECT_TITLES} value={data.projectName} onChange={s("projectName")} placeholder="Select project…" />
              {data.projectName === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type project title…" value={data.projectNameCustom} onChange={e => s("projectNameCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="Project Scheme" hint="e.g. CRG, SRG, POWER…">
              <SearchableSelect options={PROJECT_SCHEMES} value={data.projectScheme} onChange={s("projectScheme")} placeholder="Select scheme…" />
              {data.projectScheme === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type scheme…" value={data.projectSchemeCustom} onChange={e => s("projectSchemeCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="PI Name" required>
              <SearchableSelect options={PI_DIRECTORY.map(p => p.name)} value={data.piName} onChange={selectPI} placeholder="Select PI…" />
            </Field>
            <Field label="PI Designation">
              <SearchableSelect options={PI_DESIGNATIONS} value={data.piDesig} onChange={s("piDesig")} placeholder="Select designation…" />
            </Field>
            <Field label="Department" span>
              <SearchableSelect options={DEPARTMENTS} value={data.piDept} onChange={s("piDept")} placeholder="Select department…" />
            </Field>
            <Field label="Campus">
              <SearchableSelect options={CAMPUSES} value={data.piCampus} onChange={s("piCampus")} placeholder="Select campus…" />
            </Field>
            <Field label="Total Project Cost (₹)">
              <input className="rp-input" type="number" placeholder="e.g. 2500000" value={data.totalCost} onChange={e => s("totalCost")(e.target.value)} />
            </Field>
            <Field label="Total Cost in Words" span hint="Auto-calculated">
              <ComputedField value={data.totalCostWords} placeholder="Calculated automatically…" />
            </Field>
            <Field label="Project Start Date">
              <input className="rp-input" type="date" value={data.startDate} onChange={e => s("startDate")(e.target.value)} />
            </Field>
            <Field label="Project End Date">
              <input className="rp-input" type="date" value={data.endDate} onChange={e => s("endDate")(e.target.value)} />
            </Field>
            <Field label="Duration (in words)">
              <input className="rp-input" placeholder="e.g. thirty six months" value={data.duration} onChange={e => s("duration")(e.target.value)} />
            </Field>
            <Field label="Supporting Document (optional)" span>
              <input className="rp-file" type="file" accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={e => s("supportingDoc")(e.target.files[0])} />
              {data.supportingDoc && <div className="rp-file-name">📎 {data.supportingDoc.name}</div>}
            </Field>
          </div>
          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={onBack}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* STEP 2 — Re-appropriation Details */}
      {step === 2 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">🔄</span>Re-appropriation Details</div>

          <ReapPairEditor pairs={data.reapPairs} onChange={s("reapPairs")} refPrefix="fourth" />

          <Field label="M.H. No." hint="Major Head number for debiting expenditure">
            <input className="rp-input" placeholder="e.g. M.H.No.15.1.34" value={data.mhNo} onChange={e => s("mhNo")(e.target.value)} />
          </Field>

          <div className="rp-section-label">Budget Head Breakup (for Proceedings Table)</div>
          <div className="rp-head-table-wrap">
            <table className="rp-head-table">
              <thead>
                <tr>
                  <th>Sl.</th><th>Head of Account</th><th>Unspent Amount (₹)</th><th>After Re-appropriation (₹)</th><th></th>
                </tr>
              </thead>
              <tbody>
                {data.reapHeads.map((h, i) => (
                  <tr key={i}>
                    <td className="rp-inst-sl">{i + 1}</td>
                    <td>
                      <SearchableSelect options={EXPENDITURE_HEADS} value={h.head}
                        onChange={v => patchHead(i, { head: v })} placeholder="Head…" />
                    </td>
                    <td><input type="number" value={h.unspent} onChange={e => patchHead(i, { unspent: e.target.value })} placeholder="e.g. 500000" className="rp-inst-inp" /></td>
                    <td><input type="number" value={h.afterReap} onChange={e => patchHead(i, { afterReap: e.target.value })} placeholder="e.g. 250000" className="rp-inst-inp" /></td>
                    <td><button className="rp-ref-del" onClick={() => setData(d => ({ ...d, reapHeads: d.reapHeads.filter((_, idx) => idx !== i) }))}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="rp-add-btn rp-mt8"
              onClick={() => setData(d => ({ ...d, reapHeads: [...d.reapHeads, { head: "", unspent: "", afterReap: "" }] }))}>
              ＋ Add Head Row
            </button>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* STEP 3 — References & Instalment History */}
      {step === 3 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">📚</span>References & Instalment History</div>

          <div className="rp-section-label">References (Ref: list in proceedings)</div>
          <RefEditor refs={data.references} onChange={s("references")} editable />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>Previous Instalments</div>
          <InstEditor insts={data.previousInstallments} onChange={s("previousInstallments")} />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>Sanction Register Details</div>
          <div className="rp-grid-2">
            <Field label="Sanction Register Vol"><input className="rp-input" placeholder="e.g. VIII" value={data.sanctionRegVol} onChange={e => s("sanctionRegVol")(e.target.value)} /></Field>
            <Field label="Sl. No."><input className="rp-input" placeholder="e.g. 124" value={data.sanctionRegSl} onChange={e => s("sanctionRegSl")(e.target.value)} /></Field>
            <Field label="Page No."><input className="rp-input" placeholder="e.g. 56" value={data.sanctionRegPage} onChange={e => s("sanctionRegPage")(e.target.value)} /></Field>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Preview Report →</button>
          </div>
        </div>
      )}

      {/* STEP 4 — Preview & Submit */}
      {step === 4 && (
        <div className="rp-animate">
          <div className="rp-preview-toolbar">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="rp-btn rp-btn-download" onClick={downloadPDF}>📄 Download PDF</button>
              <button className="rp-btn rp-btn-primary" onClick={() => onSubmit({ ...data, agency: eff, projectName: effProjectName, projectScheme: effScheme })}>
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="rp-report-shadow">
            <div ref={reportRef}><ReportWithout data={{ ...data, agency: eff, projectName: effProjectName, projectScheme: effScheme }} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FORM: With Installment (4 steps) ────────────────────────────────────── */
function FormWith({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(defaultWith);
  const reportRef = useRef(null);
  const s = (k) => (v) => setData(d => ({ ...d, [k]: v }));
  const eff = data.agency === "Other (specify manually)" ? data.agencyCustom : data.agency;
  const effProjectName = data.projectName === "Other (specify manually)" ? data.projectNameCustom : data.projectName;
  const effScheme = data.projectScheme === "Other (specify manually)" ? data.projectSchemeCustom : data.projectScheme;

  useEffect(() => {
    setData(d => ({ ...d, totalCostWords: numberToIndianWords(d.totalCost) }));
  }, [data.totalCost]);

  useEffect(() => {
    setData(d => ({ ...d, currentInstallmentWords: numberToIndianWords(d.currentInstallmentAmount) }));
  }, [data.currentInstallmentAmount]);

  const selectPI = (name) => {
    if (name === "Other (specify manually)") {
      setData(d => ({ ...d, piName: name, piDesig: "", piDept: "", piCampus: "" }));
      return;
    }
    const rec = PI_DIRECTORY.find(p => p.name === name);
    setData(d => ({
      ...d,
      piName: name,
      piDesig: rec ? rec.desig : d.piDesig,
      piDept: rec ? rec.dept : d.piDept,
      piCampus: rec ? rec.campus : d.piCampus,
    }));
  };

  const validate = (st) => {
    if (st === 1) {
      if (!eff) return "Please select a Funding Agency.";
      if (!effProjectName) return "Please select/enter the Project Name.";
      if (!data.piName) return "Please select the PI Name.";
    }
    if (st === 2) {
      if (!data.currentInstallmentNo) return "Please enter the current Instalment No.";
      if (!data.currentInstallmentAmount) return "Please enter the Instalment Amount.";
      if (data.installmentHeads.some(h => !h.head)) return "Please fill all head names.";
      if (data.reapPairs.some(p => !p.fromHead || !p.toHead || !p.amount)) {
        return "Please complete From Head, To Head and Amount for every re-appropriation entry.";
      }
    }
    if (st === 3) {
      if (data.references.some(r => !r.text.trim())) return "Please fill all reference entries.";
    }
    return null;
  };

  const next = () => { const err = validate(step); if (err) { alert(err); return; } setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: `Reappropriation_WithInst_${eff || "Request"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(reportRef.current).save();
  };

  const patchHead = (i, p) => setData(d => ({ ...d, installmentHeads: d.installmentHeads.map((h, idx) => idx === i ? { ...h, ...p } : h) }));
  const heads = data.installmentHeads || [];
  const totalAvail = heads.reduce((s, h) => s + (parseFloat(h.unspent) || 0) + (parseFloat(h.installmentAmount) || 0), 0);

  const STEPS = ["Project Info", "Instalment & Heads", "References & History", "Preview & Submit"];

  return (
    <div className="rp-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* STEP 1 — Project Info */}
      {step === 1 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">📋</span>Project & PI Information</div>
          <div className="rp-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect options={FUNDING_AGENCIES} value={data.agency} onChange={s("agency")} placeholder="Select agency…" />
              {data.agency === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type agency name…" value={data.agencyCustom} onChange={e => s("agencyCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="Project Name / Title" required span>
              <SearchableSelect options={PROJECT_TITLES} value={data.projectName} onChange={s("projectName")} placeholder="Select project…" />
              {data.projectName === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type project title…" value={data.projectNameCustom} onChange={e => s("projectNameCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="Project Scheme" hint="e.g. TEC, CRG…">
              <SearchableSelect options={PROJECT_SCHEMES} value={data.projectScheme} onChange={s("projectScheme")} placeholder="Select scheme…" />
              {data.projectScheme === "Other (specify manually)" && (
                <input className="rp-input rp-mt8" placeholder="Type scheme…" value={data.projectSchemeCustom} onChange={e => s("projectSchemeCustom")(e.target.value)} />
              )}
            </Field>
            <Field label="PI Name" required>
              <SearchableSelect options={PI_DIRECTORY.map(p => p.name)} value={data.piName} onChange={selectPI} placeholder="Select PI…" />
            </Field>
            <Field label="PI Designation">
              <SearchableSelect options={PI_DESIGNATIONS} value={data.piDesig} onChange={s("piDesig")} placeholder="Select designation…" />
            </Field>
            <Field label="Department / Centre" span>
              <SearchableSelect options={DEPARTMENTS} value={data.piDept} onChange={s("piDept")} placeholder="Select department…" />
            </Field>
            <Field label="Campus">
              <SearchableSelect options={CAMPUSES} value={data.piCampus} onChange={s("piCampus")} placeholder="Select campus…" />
            </Field>
            <Field label="Total Project Cost (₹)">
              <input className="rp-input" type="number" placeholder="e.g. 4500000" value={data.totalCost} onChange={e => s("totalCost")(e.target.value)} />
            </Field>
            <Field label="Total Cost in Words" span hint="Auto-calculated">
              <ComputedField value={data.totalCostWords} placeholder="Calculated automatically…" />
            </Field>
            <Field label="Project Start Date">
              <input className="rp-input" type="date" value={data.startDate} onChange={e => s("startDate")(e.target.value)} />
            </Field>
            <Field label="Project End Date">
              <input className="rp-input" type="date" value={data.endDate} onChange={e => s("endDate")(e.target.value)} />
            </Field>
            <Field label="Duration (in words)">
              <input className="rp-input" placeholder="e.g. sixty months" value={data.duration} onChange={e => s("duration")(e.target.value)} />
            </Field>
            <Field label="Extended Upto (if applicable)">
              <input className="rp-input" type="date" value={data.extendedUpto} onChange={e => s("extendedUpto")(e.target.value)} />
            </Field>
            <Field label="Supporting Document (optional)" span>
              <input className="rp-file" type="file" accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={e => s("supportingDoc")(e.target.files[0])} />
              {data.supportingDoc && <div className="rp-file-name">📎 {data.supportingDoc.name}</div>}
            </Field>
          </div>
          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={onBack}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* STEP 2 — Instalment & Heads */}
      {step === 2 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">📦</span>Instalment & Budget Head Details</div>

          <div className="rp-section-label">Current Instalment</div>
          <div className="rp-grid-2">
            <Field label="Instalment No." required hint="e.g. IV Instalment">
              <input className="rp-input" placeholder="e.g. IV Instalment" value={data.currentInstallmentNo} onChange={e => s("currentInstallmentNo")(e.target.value)} />
            </Field>
            <Field label="Amount (₹)" required>
              <input className="rp-input" type="number" placeholder="e.g. 2200000" value={data.currentInstallmentAmount} onChange={e => s("currentInstallmentAmount")(e.target.value)} />
            </Field>
            <Field label="Amount in Words" span hint="Auto-calculated">
              <ComputedField value={data.currentInstallmentWords} placeholder="Calculated automatically…" />
            </Field>
            <Field label="Bank Name">
              <input className="rp-input" placeholder="UNION BANK OF INDIA" value={data.bankName} onChange={e => s("bankName")(e.target.value)} />
            </Field>
            <Field label="PFMS A/c No.">
              <input className="rp-input" placeholder="e.g. PFMS/2026/TEC/445" value={data.pfmsRefNo} onChange={e => s("pfmsRefNo")(e.target.value)} />
            </Field>
            <Field label="PFMS Reference Cited" hint="Which ref cites the PFMS release? e.g. fifth">
              <input className="rp-input" placeholder="e.g. fifth" value={data.pfmsRefCited} onChange={e => s("pfmsRefCited")(e.target.value)} />
            </Field>
            <Field label="TSA Account String" span hint="TSA A/c – Receipt – Income – 1-40-46-20[17]">
              <input className="rp-input" placeholder="TSA A/c details…" value={data.tsa} onChange={e => s("tsa")(e.target.value)} />
            </Field>
            <Field label="TSA Reference Cited" hint="Which ref cites the TSA? e.g. sixth">
              <input className="rp-input" placeholder="e.g. sixth" value={data.tsaRefCited} onChange={e => s("tsaRefCited")(e.target.value)} />
            </Field>
            <Field label="To Designation" hint="Recipient's title in the 'To' section">
              <SearchableSelect options={PI_DESIGNATIONS} value={data.toDesig} onChange={s("toDesig")} placeholder="Select designation…" />
            </Field>
            <Field label="M.H. No.">
              <input className="rp-input" placeholder="e.g. M.H.No.21.4.55" value={data.mhNo} onChange={e => s("mhNo")(e.target.value)} />
            </Field>
          </div>

          <div className="rp-section-label" style={{ marginTop: "24px" }}>Re-appropriation Requests</div>
          <ReapPairEditor pairs={data.reapPairs} onChange={s("reapPairs")} refPrefix="seventh" />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>
            Budget Heads & Instalment Allocation
            {totalAvail > 0 && <span className="rp-total-badge">Total Available: ₹{totalAvail.toLocaleString("en-IN")}/-</span>}
          </div>
          <div className="rp-head-table-wrap">
            <table className="rp-head-table">
              <thead>
                <tr>
                  <th>Sl.</th><th>Head of Account</th><th>Unspent Amount (₹)</th><th>Instalment Amount (₹)</th><th>Total Available (₹)</th><th></th>
                </tr>
              </thead>
              <tbody>
                {heads.map((h, i) => {
                  const u = parseFloat(h.unspent) || 0;
                  const a = parseFloat(h.installmentAmount) || 0;
                  return (
                    <tr key={i}>
                      <td className="rp-inst-sl">{i + 1}</td>
                      <td><SearchableSelect options={EXPENDITURE_HEADS} value={h.head} onChange={v => patchHead(i, { head: v })} placeholder="Head…" /></td>
                      <td><input type="number" value={h.unspent} onChange={e => patchHead(i, { unspent: e.target.value })} placeholder="e.g. 400000" className="rp-inst-inp" /></td>
                      <td><input type="number" value={h.installmentAmount} onChange={e => patchHead(i, { installmentAmount: e.target.value })} placeholder="e.g. 900000" className="rp-inst-inp" /></td>
                      <td className="rp-total-cell">{(u + a) ? `${(u + a).toLocaleString("en-IN")}/-` : "—"}</td>
                      <td><button className="rp-ref-del" onClick={() => setData(d => ({ ...d, installmentHeads: d.installmentHeads.filter((_, idx) => idx !== i) }))}>🗑</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button className="rp-add-btn rp-mt8"
              onClick={() => setData(d => ({ ...d, installmentHeads: [...d.installmentHeads, { head: "", unspent: "", installmentAmount: "" }] }))}>
              ＋ Add Head Row
            </button>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Continue →</button>
          </div>
        </div>
      )}

      {/* STEP 3 — References & Instalment History */}
      {step === 3 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head"><span className="rp-card-icon">📚</span>References & Previous Instalments</div>

          <div className="rp-section-label">References (Ref: list in proceedings)</div>
          <RefEditor refs={data.references} onChange={s("references")} editable />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>Previous Instalments</div>
          <InstEditor insts={data.previousInstallments} onChange={s("previousInstallments")} />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>Sanction Register Details</div>
          <div className="rp-grid-2">
            <Field label="Sanction Register Vol"><input className="rp-input" placeholder="e.g. X" value={data.sanctionRegVol} onChange={e => s("sanctionRegVol")(e.target.value)} /></Field>
            <Field label="Sl. No."><input className="rp-input" placeholder="e.g. 212" value={data.sanctionRegSl} onChange={e => s("sanctionRegSl")(e.target.value)} /></Field>
            <Field label="Page No."><input className="rp-input" placeholder="e.g. 88" value={data.sanctionRegPage} onChange={e => s("sanctionRegPage")(e.target.value)} /></Field>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <button className="rp-btn rp-btn-primary" onClick={next}>Preview Report →</button>
          </div>
        </div>
      )}

      {/* STEP 4 — Preview & Submit */}
      {step === 4 && (
        <div className="rp-animate">
          <div className="rp-preview-toolbar">
            <button className="rp-btn rp-btn-ghost" onClick={back}>← Back</button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="rp-btn rp-btn-download" onClick={downloadPDF}>📄 Download PDF</button>
              <button className="rp-btn rp-btn-primary" onClick={() => onSubmit({ ...data, agency: eff, projectName: effProjectName, projectScheme: effScheme })}>
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="rp-report-shadow">
            <div ref={reportRef}><ReportWith data={{ ...data, agency: eff, projectName: effProjectName, projectScheme: effScheme }} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Export ──────────────────────────────────────────────────────────── */
/*
  claimType is now decided on the Dashboard (ReappropriationDashboard.jsx) and
  passed in via the route. This page no longer shows its own type-selection
  landing screen — that selection lived in two places before, which was
  redundant. Routing pattern (in AppRouter.jsx):
    "/reappropriation-without" → <ReappropriationPage claimType="without" .../>
    "/reappropriation-with"    → <ReappropriationPage claimType="with" .../>
*/
export default function ReappropriationPage({ claimType, onNavigate, onNewRequest }) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (data) => {
    try {
      const existing = JSON.parse(localStorage.getItem("csrc_reap_history") || "[]");
      const newItem = {
        ...data,
        id: `REAP-${Date.now()}`,
        submittedOn: today(),
        status: "PENDING",
      };
      localStorage.setItem("csrc_reap_history", JSON.stringify([newItem, ...existing]));
      setSubmittedData(newItem);
      setSubmitted(true);
      if (onNewRequest) onNewRequest(newItem);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedData(null);
    if (onNavigate) onNavigate("reappropriationdashboard");
  };

  if (submitted && submittedData) {
    return (
      <div className="rp-page">
        <div className="rp-success-card">
          <div className="rp-success-icon">✅</div>
          <h2 className="rp-success-title">Request Submitted!</h2>
          <p className="rp-success-sub">Your re-appropriation request has been submitted to CSRC for processing.</p>
          <div className="rp-success-meta">
            <div><span>Request ID</span><strong>{submittedData.id}</strong></div>
            <div><span>Type</span><strong>{submittedData.claimType === "with" ? "With Instalment" : "Without Instalment"}</strong></div>
            <div><span>Agency</span><strong>{submittedData.agency}</strong></div>
            <div><span>Submitted On</span><strong>{submittedData.submittedOn}</strong></div>
            <div><span>Status</span><strong className="rp-status-pending">Under Review</strong></div>
          </div>
          <div className="rp-success-actions">
            <button className="rp-btn rp-btn-ghost" onClick={() => onNavigate && onNavigate("reappropriationhistory")}>
              View History →
            </button>
            <button className="rp-btn rp-btn-primary" onClick={handleReset}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-page">
      <div className="rp-page-header">
        <div className="rp-breadcrumb">
          <span onClick={() => onNavigate && onNavigate("reappropriationdashboard")} className="rp-bc-link">Re-appropriation Dashboard</span>
          <span className="rp-bc-sep">/</span>
          <span>{claimType === "with" ? "With Instalment" : "Without Instalment"}</span>
        </div>
        <h1 className="rp-page-title">
          {claimType === "without" && "🔄 Re-appropriation without Instalment"}
          {claimType === "with"    && "📦 Re-appropriation with Instalment"}
        </h1>
        <p className="rp-page-sub">Reallocate sanctioned funds between project budget heads</p>
      </div>

      {claimType === "without" && (
        <FormWithout onSubmit={handleSubmit} onBack={() => onNavigate && onNavigate("reappropriationdashboard")} />
      )}
      {claimType === "with" && (
        <FormWith onSubmit={handleSubmit} onBack={() => onNavigate && onNavigate("reappropriationdashboard")} />
      )}
      {!claimType && (
        <div className="rp-card">
          <p>No request type specified. Please go back to the dashboard and choose a re-appropriation type.</p>
          <div className="rp-actions">
            <button className="rp-btn rp-btn-primary" onClick={() => onNavigate && onNavigate("reappropriationdashboard")}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}