import React, { useState, useEffect, useRef } from "react";
import "./ReappropriationHistory.css";
import html2pdf from "html2pdf.js";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const fmtAmt = (n) => {
  const num = parseFloat(n) || 0;
  return num ? `${num.toLocaleString("en-IN")}/-` : "—";
};

/* ─── Inline Report: Without Installment ──────────────────────────────────── */
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

  return (
    <div style={{ width: "210mm", background: "#fff", margin: "0 auto", padding: "14mm 16mm", boxSizing: "border-box", ...P }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>Centre for Sponsored Research and Consultancy (CSRC)</div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={B}>Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}</div>
        <div>{data.proceedingDate || data.submittedOn}</div>
      </div>
      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={B}>Sub: </span>Anna University – {data.agency || "——"} Project –{" "}
        {data.projectScheme ? `${data.projectScheme} – ` : ""}
        "{data.projectName || "——"}" by {data.piName || "——"} – Re-appropriation – Sanction – Accorded
      </div>
      {(data.references || []).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={B}>Ref: </span>
          {data.references.filter(r => r.text).map((r, i) => (
            <div key={i} style={{ paddingLeft: i === 0 ? "0" : "32px" }}>{r.no}. {r.text}</div>
          ))}
        </div>
      )}
      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>
      <div style={J}>
        The {data.agency || "funding agency"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{data.projectScheme ? <> under <span style={B}>"{data.projectScheme}"</span></> : ""}{" "}
        to <span style={B}>{data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"}</span>,
        as the Principal Investigator for a period of <span style={B}>{data.duration || "——"}</span> from{" "}
        <span style={B}>{data.startDate || "——"}</span> to <span style={B}>{data.endDate || "——"}</span> at a total cost of{" "}
        <span style={B}>Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})</span> vide reference second cited above.
      </div>
      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            Further, a sum has already been allotted by the funding agency and the necessary sanction proceedings was issued as per the details given below:
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
            <thead><tr>{["Sl.No.", "Instalment", "Amount (Rs.)", "Released Date", "Sanction Proceedings No. & Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td><td style={td}>{inst.no}</td>
                  <td style={tdR}>{inst.amount ? `${inst.amount}/-` : "—"}</td>
                  <td style={tdC}>{inst.releasedDate || "—"}</td><td style={td}>{inst.procNo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <div style={J}>
        In the reference {data.reapRefCited || "fourth"} cited above, {data.piName || "——"}, Principal Investigator of the Project,
        has requested to accord sanction for reappropriation to the tune of Rs.{data.reapAmount || "——"}/- ({data.reapAmountWords || "——"})
        from "{data.reapFromHead || "——"}" head to "{data.reapToHead || "——"}" head of the above mentioned project.
      </div>
      <div style={J}>
        Accordingly, and as per the powers delegated reference first cited above, an administrative sanction is hereby accorded for
        re-appropriate a sum of <span style={B}>Rs.{data.reapAmount || "——"}/- ({data.reapAmountWords || "——"})</span>{" "}
        from "{data.reapFromHead || "——"}" head to "{data.reapToHead || "——"}" head as detailed below.
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
        <thead>
          <tr>
            <th style={th}>Sl. No.</th><th style={th}>Head of Account</th>
            <th style={th}>Unspent Amount Available (Rs.)</th>
            <th style={th}>Amount Available after Re-appropriation (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {(data.reapHeads || []).map((h, i) => (
            <tr key={i}>
              <td style={tdC}>{i + 1}</td><td style={td}>{h.head}</td>
              <td style={tdR}>{fmtAmt(h.unspent)}</td><td style={tdR}>{fmtAmt(h.afterReap)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...td, textAlign: "right" }}>Total Amount</td>
            <td style={tdR}>{fmtAmt(totalUnspent)}</td><td style={tdR}>{fmtAmt(totalAfter)}</td>
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
      <div style={{ marginBottom: "14px" }}>
        <div style={B}>To</div>
        <div>The Professor and Head,</div>
        <div>{data.piDept || "——"},</div>
        <div>{data.piCampus || "——"},</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>
      <div>
        <div style={B}>Copy to:</div>
        <div>1. {data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"} – PI</div>
        <div>2. CSRC – 3</div>
        <div>3. CSRC – 4</div>
      </div>
    </div>
  );
}

/* ─── Inline Report: With Installment ─────────────────────────────────────── */
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

  return (
    <div style={{ width: "210mm", background: "#fff", margin: "0 auto", padding: "14mm 16mm", boxSizing: "border-box", ...P }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>Centre for Sponsored Research and Consultancy (CSRC)</div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={B}>Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}</div>
        <div>{data.proceedingDate || data.submittedOn}</div>
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
          {data.references.filter(r => r.text).map((r, i) => (
            <div key={i} style={{ paddingLeft: i === 0 ? "0" : "32px" }}>{r.no}. {r.text}</div>
          ))}
        </div>
      )}
      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>
      <div style={J}>
        The {data.agency || "funding agency"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{data.projectScheme ? <> under <span style={B}>"{data.projectScheme}"</span></> : ""}{" "}
        to <span style={B}>{data.piName || "——"}</span>, {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"},
        as the Principal Investigator for the period of {data.duration} from{" "}
        <span style={B}>{data.startDate || "——"}</span> to <span style={B}>{data.endDate || "——"}</span>.
        {data.extendedUpto ? ` Further the funding agency has extended the duration of the project period upto ${data.extendedUpto}.` : ""}
      </div>
      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            Further, a sum of <span style={B}>Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})</span>{" "}
            has already been released by the funding agency and the necessary sanction proceedings were issued as per the details given below:
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px", fontSize: "10.5pt" }}>
            <thead><tr>{["Sl.No.", "Instalment", "Amount (Rs.)", "Released Date", "Sanction Proceedings No. & Date"].map(h => <th key={h} style={{ ...th, fontSize: "10pt" }}>{h}</th>)}</tr></thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td><td style={td}>{inst.no}</td>
                  <td style={tdR}>{inst.amount ? `${inst.amount}/-` : "—"}</td>
                  <td style={tdC}>{inst.releasedDate || "—"}</td><td style={td}>{inst.procNo || "—"}</td>
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
        {data.tsa ? ` [${data.tsa}].` : ""}{" "}
        Also, requested for reappropriation vide reference {data.reapRefCited || "seventh"} cited.
      </div>
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
            <th style={th}>Sl. No.</th><th style={th}>Head of Account</th>
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
                <td style={tdC}>{i + 1}</td><td style={td}>{h.head}</td>
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
      <div style={{ marginBottom: "14px" }}>
        <div style={B}>To</div>
        <div>The {data.toDesig || data.piDesig || "——"},</div>
        <div>{data.piDept || "——"},</div>
        <div>{data.piCampus || "——"},</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>
      <div>
        <div style={B}>Copy to:</div>
        <div>1. CSRC 3 &amp; 4</div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    PENDING:     { label: "Under Review", bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
    TRANSFERRED: { label: "In Review",    bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
    COMPLETED:   { label: "Approved",     bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
    approved:    { label: "Approved",     bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
    declined:    { label: "Declined",     bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
  };
  const s = map[status] || { label: status, bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" };
  return (
    <span className="rah-badge" style={{ background: s.bg, color: s.color }}>
      <span className="rah-badge-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

/* ─── Preview Modal ────────────────────────────────────────────────────────── */
function PreviewModal({ item, onClose }) {
  const reportRef = useRef(null);
  const isWith = item.claimType === "with";

  const downloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf().set({
      margin: [8, 8, 8, 8],
      filename: `Reappropriation_${item.agency || "Request"}_${item.id || ""}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(reportRef.current).save();
  };

  return (
    <div className="rah-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rah-modal">
        <div className="rah-modal-header">
          <div>
            <div className="rah-modal-eyebrow">
              {isWith ? "📦 With Instalment" : "🔄 Without Instalment"}
            </div>
            <div className="rah-modal-title">{item.projectName}</div>
          </div>
          <div className="rah-modal-actions">
            <button className="rah-btn rah-btn-download" onClick={downloadPDF}>📄 Download PDF</button>
            <button className="rah-btn rah-btn-close" onClick={onClose}>✕ Close</button>
          </div>
        </div>
        <div className="rah-modal-body">
          <div className="rah-report-shadow" ref={reportRef}>
            {isWith ? <ReportWith data={item} /> : <ReportWithout data={item} />}
          </div>
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

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("csrc_reap_history") || "[]");
      // Merge with demo data if empty
      if (stored.length === 0) {
        setHistory([
          {
            id: "REAP-DEMO-001",
            claimType: "without",
            projectName: "Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2",
            agency: "SERB", projectScheme: "CRG",
            piName: "Dr. S. Balasivanandha Prabu", piDesig: "Associate Professor",
            piDept: "Department of Mechanical Engineering", piCampus: "CEG Campus",
            totalCost: "2500000", totalCostWords: "Twenty Five Lakh",
            startDate: "01-01-2025", endDate: "31-12-2027", duration: "thirty six months",
            reapAmount: "250000", reapAmountWords: "Two Lakh Fifty Thousand",
            reapFromHead: "Manpower", reapToHead: "Contingency", reapRefCited: "fourth",
            mhNo: "M.H.No.15.1.34", sanctionRegVol: "VIII", sanctionRegSl: "124", sanctionRegPage: "56",
            references: [
              { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
              { no: 2, text: "SERB Sanction Order No.CRG/2025/101 dated 01-01-2025." },
              { no: 3, text: "CSRC Proceedings No.101 dated 10-01-2025." },
              { no: 4, text: "PI Re-appropriation Request dated 15-06-2026." },
            ],
            previousInstallments: [
              { no: "I Instalment", amount: "1250000", releasedDate: "15-03-2025", procNo: "CSRC/SERB/2025/101 Dt.15-03-2025" },
            ],
            reapHeads: [
              { head: "Manpower", unspent: "500000", afterReap: "250000" },
              { head: "Contingency", unspent: "100000", afterReap: "350000" },
            ],
            submittedOn: "02-06-2026", status: "PENDING",
          },
          {
            id: "REAP-DEMO-002",
            claimType: "with",
            projectName: "Technology Enabling Centre",
            agency: "DST", projectScheme: "TEC",
            piName: "Dr. R. Kumar", piDesig: "Coordinator",
            piDept: "Technology Enabling Centre", piCampus: "ACT Campus",
            totalCost: "4500000", totalCostWords: "Forty Five Lakh",
            startDate: "01-04-2023", endDate: "31-03-2028", duration: "sixty months",
            extendedUpto: "31-03-2028",
            currentInstallmentNo: "IV Instalment", currentInstallmentAmount: "2200000",
            currentInstallmentWords: "Twenty Two Lakh",
            bankName: "UNION BANK OF INDIA", pfmsRefNo: "PFMS/2026/TEC/445",
            pfmsRefCited: "fifth", tsaRefCited: "sixth", reapRefCited: "seventh",
            tsa: "TSA-2026-445", toDesig: "Coordinator",
            mhNo: "M.H.No.21.4.55", sanctionRegVol: "X", sanctionRegSl: "212", sanctionRegPage: "88",
            references: [
              { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
              { no: 2, text: "DST Sanction Order TEC/2023/001." },
              { no: 3, text: "CSRC Proceedings dated 01-04-2023." },
              { no: 4, text: "Project Extension Order dated 01-04-2025." },
              { no: 5, text: "PFMS Release Advice dated 10-06-2026." },
              { no: 6, text: "TSA Request dated 12-06-2026." },
              { no: 7, text: "Reappropriation Request dated 14-06-2026." },
            ],
            previousInstallments: [
              { no: "I Instalment",   amount: "1000000", releasedDate: "15-01-2024", procNo: "CSRC/DST/2024/101" },
              { no: "II Instalment",  amount: "1500000", releasedDate: "20-08-2024", procNo: "CSRC/DST/2024/225" },
              { no: "III Instalment", amount: "1800000", releasedDate: "12-03-2025", procNo: "CSRC/DST/2025/067" },
            ],
            installmentHeads: [
              { head: "Manpower",         unspent: "400000", installmentAmount: "900000" },
              { head: "Travel",           unspent: "100000", installmentAmount: "250000" },
              { head: "Contingency",      unspent: "150000", installmentAmount: "450000" },
              { head: "Training Program", unspent: "50000",  installmentAmount: "600000" },
            ],
            submittedOn: "14-06-2026", status: "COMPLETED",
          },
        ]);
      } else {
        setHistory(stored);
      }
    } catch (e) {}
  }, []);

  const filtered = history.filter(item => {
    const q = search.toLowerCase();
    const ms = !q
      || item.projectName?.toLowerCase().includes(q)
      || item.agency?.toLowerCase().includes(q)
      || item.piName?.toLowerCase().includes(q)
      || item.id?.toLowerCase().includes(q);
    const fs = filter === "all"      ? true
             : filter === "pending"  ? (item.status === "PENDING" || item.status === "TRANSFERRED")
             : filter === "approved" ? (item.status === "COMPLETED" || item.status === "approved")
             : filter === "declined" ? item.status === "declined"
             : true;
    const ts = typeFilter === "all"     ? true
             : typeFilter === "without" ? item.claimType === "without"
             : typeFilter === "with"    ? item.claimType === "with"
             : true;
    return ms && fs && ts;
  });

  const counts = {
    total:    history.length,
    pending:  history.filter(r => r.status === "PENDING" || r.status === "TRANSFERRED").length,
    approved: history.filter(r => r.status === "COMPLETED" || r.status === "approved").length,
    declined: history.filter(r => r.status === "declined").length,
  };

  return (
    <div className="rah-page">
      {/* Header */}
      <div className="rah-header">
        <h1 className="rah-title">Re-appropriation History</h1>
        <p className="rah-sub">All submitted re-appropriation requests and their current status</p>
        {onNavigate && (
          <button className="rah-new-btn" onClick={() => onNavigate("project-reappropriation-request")}>
            + New Request
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="rah-stats">
        {[
          { label: "Total", value: counts.total,    color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
          { label: "Under Review", value: counts.pending,  color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
          { label: "Approved", value: counts.approved, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Declined", value: counts.declined, color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
        ].map(c => (
          <div key={c.label} className="rah-stat" style={{ background: c.bg, borderColor: c.border }}>
            <div className="rah-stat-label">{c.label}</div>
            <div className="rah-stat-value" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="rah-controls">
        <div className="rah-search-wrap">
          <svg className="rah-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input className="rah-search" type="text" placeholder="Search by project, agency, PI, ID…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="rah-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <div className="rah-filters">
          <div className="rah-filter-group">
            <span className="rah-filter-label">Type:</span>
            {[["all","All Types"],["without","Without Inst."],["with","With Inst."]].map(([v,l]) => (
              <button key={v} className={`rah-filter-btn ${typeFilter === v ? "active" : ""}`}
                onClick={() => setTypeFilter(v)}>{l}</button>
            ))}
          </div>
          <div className="rah-filter-group">
            <span className="rah-filter-label">Status:</span>
            {[["all","All"],["pending","Under Review"],["approved","Approved"],["declined","Declined"]].map(([v,l]) => (
              <button key={v} className={`rah-filter-btn ${filter === v ? "active" : ""}`}
                onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rah-table-wrap">
        {filtered.length === 0 ? (
          <div className="rah-empty">
            <div className="rah-empty-icon">📭</div>
            <div className="rah-empty-title">{search ? `No results for "${search}"` : "No requests yet"}</div>
            <div className="rah-empty-sub">{!search && "Submit your first re-appropriation request to see it here."}</div>
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
              {filtered.map((item, idx) => (
                <tr key={item.id}>
                  <td className="rah-sl">{idx + 1}</td>
                  <td className="rah-id">{item.id}</td>
                  <td>
                    <div className="rah-project-name">{item.projectName}</div>
                    {item.piName && <div className="rah-pi-name">{item.piName}</div>}
                  </td>
                  <td>
                    <span className="rah-agency-chip">{item.agency}</span>
                    {item.projectScheme && <div className="rah-scheme">{item.projectScheme}</div>}
                  </td>
                  <td>
                    {item.claimType === "with"
                      ? <span className="rah-type-chip rah-type-with">📦 With Inst.</span>
                      : <span className="rah-type-chip rah-type-without">🔄 Without Inst.</span>
                    }
                  </td>
                  <td>
                    {item.claimType === "without" ? (
                      <div className="rah-detail-lines">
                        <div><span>From:</span> {item.reapFromHead || "—"}</div>
                        <div><span>To:</span> {item.reapToHead || "—"}</div>
                        {item.reapAmount && <div><span>Amt:</span> ₹{Number(item.reapAmount).toLocaleString("en-IN")}</div>}
                      </div>
                    ) : (
                      <div className="rah-detail-lines">
                        <div><span>Inst:</span> {item.currentInstallmentNo || "—"}</div>
                        {item.currentInstallmentAmount && <div><span>Amt:</span> ₹{Number(item.currentInstallmentAmount).toLocaleString("en-IN")}</div>}
                      </div>
                    )}
                  </td>
                  <td className="rah-date">{item.submittedOn}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="rah-row-actions">
                      <button className="rah-btn rah-btn-preview" onClick={() => setPreview(item)}>
                        👁 Preview
                      </button>
                      <button className="rah-btn rah-btn-download" onClick={() => setPreview(item)}>
                        📄 PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview Modal */}
      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}