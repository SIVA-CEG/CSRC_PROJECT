import React, { useState, useRef, useEffect, useMemo } from "react";
import "./ReappropriationPage.css";
import html2pdf from "html2pdf.js";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const API = "http://localhost:5000/api/reappropriation";

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

const today = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const fmtAmt = (n) => {
  const num = parseFloat(n) || 0;
  return num ? `${num.toLocaleString("en-IN")}/-` : "—";
};

const fmtINR = (n) => {
  const num = parseFloat(n) || 0;
  return num.toLocaleString("en-IN");
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
  return n < 20
    ? ONES_W[n]
    : TENS_W[Math.floor(n / 10)] + (n % 10 ? " " + ONES_W[n % 10] : "");
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
  const cr = Math.floor(n / 1e7);
  n %= 1e7;
  const lk = Math.floor(n / 1e5);
  n %= 1e5;
  const th = Math.floor(n / 1e3);
  n %= 1e3;
  const parts = [];
  if (cr) parts.push(threeDigitWords(cr) + " Crore");
  if (lk) parts.push(threeDigitWords(lk) + " Lakh");
  if (th) parts.push(threeDigitWords(th) + " Thousand");
  if (n) parts.push(threeDigitWords(n));
  return parts.join(" ") + " Rupees Only";
}

/* ─── SearchableSelect ─────────────────────────────────────────────────────── */
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  loading = false,
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
    <div className={`rp-ss ${open ? "rp-ss-open" : ""}`} ref={ref}>
      <div className="rp-ss-trigger" onClick={() => !loading && setOpen(!open)}>
        <span className={value ? "rp-ss-val" : "rp-ss-ph"}>
          {loading ? "Loading…" : value || placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="rp-ss-chevron"
        >
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </div>
      {open && (
        <div className="rp-ss-drop">
          <input
            className="rp-ss-search"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div
            className={`rp-ss-opt ${!value ? "active" : ""}`}
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
              className={`rp-ss-opt ${value === o ? "active" : ""}`}
              onClick={() => {
                onChange(o);
                setOpen(false);
                setQ("");
              }}
            >
              {o}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rp-ss-opt" style={{ color: "#aaa" }}>
              No matches
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── StepBar ──────────────────────────────────────────────────────────────── */
function StepBar({ steps, current }) {
  return (
    <div className="rp-stepbar">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div
            className={`rp-step ${current === i + 1 ? "active" : current > i + 1 ? "done" : ""}`}
          >
            <div className="rp-step-circle">
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
            <div className="rp-step-label">{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div className={`rp-step-line ${current > i + 1 ? "done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Field ────────────────────────────────────────────────────────────────── */
const Field = ({ label, children, required, hint, span }) => (
  <div className={`rp-field${span ? " rp-span" : ""}`}>
    <label className="rp-label">
      {label}
      {required && <span className="rp-req">*</span>}
    </label>
    {children}
    {hint && <div className="rp-hint">{hint}</div>}
  </div>
);

const ComputedField = ({ value, placeholder }) => (
  <div className="rp-computed">
    {value || <span className="rp-computed-ph">{placeholder}</span>}
  </div>
);

/* ─── RefEditor ────────────────────────────────────────────────────────────── */
function RefEditor({ refs, onChange }) {
  const patch = (i, val) =>
    onChange(refs.map((r, idx) => (idx === i ? { ...r, text: val } : r)));
  const add = () => onChange([...refs, { no: refs.length + 1, text: "" }]);
  const del = (i) =>
    onChange(
      refs.filter((_, idx) => idx !== i).map((r, ix) => ({ ...r, no: ix + 1 })),
    );
  return (
    <div className="rp-ref-list">
      {refs.map((r, i) => (
        <div key={i} className="rp-ref-row">
          <span className="rp-ref-no">{r.no}.</span>
          <textarea
            value={r.text}
            onChange={(e) => patch(i, e.target.value)}
            rows={2}
            className="rp-ref-ta"
            placeholder="Reference text…"
          />
          <button className="rp-ref-del" onClick={() => del(i)} title="Remove">
            ✕
          </button>
        </div>
      ))}
      <button className="rp-add-btn" onClick={add}>
        ＋ Add Reference
      </button>
    </div>
  );
}

/* ─── ReapPairEditor — from/to options come from DB budget head labels ─────── */
function ReapPairEditor({ pairs, onChange, headLabels, refPrefix }) {
  const patch = (i, p) =>
    onChange(pairs.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  const add = () =>
    onChange([
      ...pairs,
      {
        fromHead: "",
        toHead: "",
        amount: "",
        amountWords: "",
        refCited: refPrefix || "",
      },
    ]);
  const del = (i) => onChange(pairs.filter((_, idx) => idx !== i));

  const onAmountChange = (i, val) =>
    patch(i, { amount: val, amountWords: numberToIndianWords(val) });

  return (
    <div className="rp-reap-pairs">
      {pairs.map((p, i) => (
        <div className="rp-reap-pair-card" key={i}>
          <div className="rp-reap-pair-head">
            <span>Re-appropriation #{i + 1}</span>
            {pairs.length > 1 && (
              <button
                className="rp-ref-del"
                onClick={() => del(i)}
                title="Remove"
              >
                🗑
              </button>
            )}
          </div>
          <div className="rp-grid-2">
            <Field label="From Head (Re-appropriate FROM)" required>
              <SearchableSelect
                options={headLabels}
                value={p.fromHead}
                onChange={(v) => patch(i, { fromHead: v })}
                placeholder="Select head…"
              />
            </Field>
            <Field label="To Head (Re-appropriate TO)" required>
              <SearchableSelect
                options={headLabels}
                value={p.toHead}
                onChange={(v) => patch(i, { toHead: v })}
                placeholder="Select head…"
              />
            </Field>
            <Field label="Re-appropriation Amount (₹)" required>
              <input
                className="rp-input"
                type="number"
                placeholder="e.g. 250000"
                value={p.amount}
                onChange={(e) => onAmountChange(i, e.target.value)}
              />
            </Field>
            <Field label="Amount in Words" hint="Auto-calculated">
              <ComputedField
                value={p.amountWords}
                placeholder="Calculated automatically…"
              />
            </Field>
            <Field label="Request Reference Cited">
              <input
                className="rp-input"
                placeholder="e.g. fourth"
                value={p.refCited}
                onChange={(e) => patch(i, { refCited: e.target.value })}
              />
            </Field>
          </div>
        </div>
      ))}
      <button className="rp-add-btn rp-mt8" onClick={add}>
        ＋ Add Another Re-appropriation
      </button>
    </div>
  );
}

/* ─── InstEditor (for previous installments) ───────────────────────────────── */
function InstEditor({ insts, onChange }) {
  const patch = (i, p) =>
    onChange(insts.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  const add = () =>
    onChange([...insts, { no: "", amount: "", releasedDate: "", procNo: "" }]);
  const del = (i) => onChange(insts.filter((_, idx) => idx !== i));
  return (
    <div className="rp-inst-editor">
      <table className="rp-inst-table">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Instalment Label</th>
            <th>Amount (₹)</th>
            <th>Released Date</th>
            <th>Proc. No. & Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {insts.map((inst, i) => (
            <tr key={i}>
              <td className="rp-inst-sl">{i + 1}</td>
              <td>
                <input
                  value={inst.no}
                  onChange={(e) => patch(i, { no: e.target.value })}
                  placeholder="e.g. I Instalment"
                  className="rp-inst-inp"
                />
              </td>
              <td>
                <input
                  value={inst.amount}
                  onChange={(e) => patch(i, { amount: e.target.value })}
                  type="number"
                  className="rp-inst-inp"
                />
              </td>
              <td>
                <input
                  value={inst.releasedDate}
                  onChange={(e) => patch(i, { releasedDate: e.target.value })}
                  type="date"
                  className="rp-inst-inp"
                />
              </td>
              <td>
                <input
                  value={inst.procNo}
                  onChange={(e) => patch(i, { procNo: e.target.value })}
                  placeholder="No. & Date"
                  className="rp-inst-inp"
                />
              </td>
              <td>
                <button className="rp-ref-del" onClick={() => del(i)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
          {insts.length === 0 && (
            <tr>
              <td colSpan={6} className="rp-inst-empty">
                No instalments added
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="rp-add-btn rp-mt8" onClick={add}>
        ＋ Add Instalment
      </button>
    </div>
  );
}

/* ─── Computed Budget Head Breakup (auto — not editable) ───────────────────── */
function BudgetBreakupTable({ budgetHeads, reapPairs }) {
  // For each head, compute net change from all reap pairs
  const rows = useMemo(
    () =>
      budgetHeads.map((h) => {
        const net = reapPairs.reduce((acc, p) => {
          const amt = parseFloat(p.amount) || 0;
          if (p.toHead === h.label) acc += amt;
          if (p.fromHead === h.label) acc -= amt;
          return acc;
        }, 0);
        return { head: h.label, unspent: h.amount, afterReap: h.amount + net };
      }),
    [budgetHeads, reapPairs],
  );

  const totalUnspent = rows.reduce((s, r) => s + r.unspent, 0);
  const totalAfter = rows.reduce((s, r) => s + r.afterReap, 0);

  if (rows.length === 0) {
    return (
      <div style={{ color: "#888", fontSize: "13px", padding: "12px 0" }}>
        Select a project and installment to see budget heads.
      </div>
    );
  }

  return (
    <div className="rp-head-table-wrap">
      <table className="rp-head-table">
        <thead>
          <tr>
            <th>Sl.</th>
            <th>Head of Account</th>
            <th>Unspent Amount (₹)</th>
            <th>After Re-appropriation (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="rp-inst-sl">{i + 1}</td>
              <td>{r.head}</td>
              <td className="rp-total-cell">{fmtAmt(r.unspent)}</td>
              <td
                className="rp-total-cell"
                style={{ color: r.afterReap < 0 ? "#dc2626" : "inherit" }}
              >
                {fmtAmt(r.afterReap)}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700, background: "#f8fafc" }}>
            <td colSpan={2} style={{ textAlign: "right", padding: "6px 8px" }}>
              Total
            </td>
            <td className="rp-total-cell">{fmtAmt(totalUnspent)}</td>
            <td className="rp-total-cell">{fmtAmt(totalAfter)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─── PDF Report: Without Installment ─────────────────────────────────────── */
export function ReportWithout({ data, budgetHeads, reapPairs }) {
  const P = {
    fontFamily: "Times New Roman, serif",
    fontSize: "11pt",
    color: "#000",
  };
  const th = {
    border: "1px solid #000",
    padding: "5px 8px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#fff",
  };
  const td = { border: "1px solid #000", padding: "5px 8px" };
  const tdR = {
    border: "1px solid #000",
    padding: "5px 8px",
    textAlign: "right",
  };
  const tdC = {
    border: "1px solid #000",
    padding: "5px 8px",
    textAlign: "center",
  };
  const J = { textAlign: "justify", marginBottom: "10px", lineHeight: "1.6" };
  const B = { fontWeight: "bold" };

  const rows = (budgetHeads || []).map((h) => {
    const net = (reapPairs || []).reduce((acc, p) => {
      const amt = parseFloat(p.amount) || 0;
      if (p.toHead === h.label) acc += amt;
      if (p.fromHead === h.label) acc -= amt;
      return acc;
    }, 0);
    return { head: h.label, unspent: h.amount, afterReap: h.amount + net };
  });

  const totalUnspent = rows.reduce((s, r) => s + r.unspent, 0);
  const totalAfter = rows.reduce((s, r) => s + r.afterReap, 0);
  const totalReapAmount = (reapPairs || []).reduce(
    (s, p) => s + (parseFloat(p.amount) || 0),
    0,
  );

  return (
    <div
      style={{
        width: "210mm",
        background: "#fff",
        margin: "0 auto",
        padding: "14mm 16mm",
        boxSizing: "border-box",
        ...P,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>
          Centre for Sponsored Research and Consultancy (CSRC)
        </div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={B}>
          Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}
        </div>
        <div>{data.proceedingDate || today()}</div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={B}>Sub: </span>Anna University – {data.agency || "——"}{" "}
        Project – {data.projectScheme ? `${data.projectScheme} – ` : ""}"
        {data.projectName || "——"}" by {data.piName || "——"} – Re-appropriation
        – Sanction – Accorded
      </div>

      {(data.references || []).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={B}>Ref: </span>
          {data.references.map((r, i) => (
            <div key={i}>
              {r.no}. {r.text}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>

      <div style={J}>
        The {data.agency || "funding agency"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{" "}
        {data.projectScheme ? (
          <>
            <span style={B}>under "{data.projectScheme}"</span>{" "}
          </>
        ) : (
          ""
        )}
        to{" "}
        <span style={B}>
          {data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"},{" "}
          {data.piCampus || "——"}
        </span>
        , as the Principal Investigator for a period of{" "}
        <span style={B}>{data.duration || "——"}</span> from{" "}
        <span style={B}>{data.startDate || "——"}</span> to{" "}
        <span style={B}>{data.endDate || "——"}</span> at a total cost of{" "}
        <span style={B}>
          Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})
        </span>
        .
      </div>

      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            Further, a sum has already been allotted by the funding agency and
            the necessary sanction proceedings were issued as per the details
            below:
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "12px",
              fontSize: "10.5pt",
              pageBreakInside: "avoid",
            }}
          >
            <thead>
              <tr>
                {[
                  "Sl.No.",
                  "Instalment",
                  "Amount (Rs.)",
                  "Released Date",
                  "Sanction Proceedings No. & Date",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td>
                  <td style={td}>{inst.no || inst.installment}</td>
                  <td style={tdR}>{inst.amount ? `${inst.amount}/-` : "—"}</td>
                  <td style={tdC}>{inst.releasedDate || "—"}</td>
                  <td style={td}>{inst.procNo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(reapPairs || []).map((p, i) => (
        <div style={J} key={i}>
          In the reference {p.refCited || "cited"} above, {data.piName || "——"},
          Principal Investigator of the Project, has requested to accord
          sanction for reappropriation to the tune of Rs.{p.amount || "——"}/- (
          {p.amountWords || numberToIndianWords(p.amount) || "——"}) from "
          {p.fromHead || "——"}" head to "{p.toHead || "——"}" head of the above
          mentioned project.
        </div>
      ))}

      <div style={J}>
        Accordingly, and as per the powers delegated reference first cited
        above, an administrative sanction is hereby accorded for re-appropriate
        a sum of{" "}
        <span style={B}>
          Rs.{totalReapAmount ? fmtINR(totalReapAmount) : "——"}/- (
          {numberToIndianWords(totalReapAmount) || "——"})
        </span>{" "}
        as detailed below:
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "12px",
          fontSize: "10.5pt",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Sl. No.</th>
            <th style={th}>Head of Account</th>
            <th style={th}>Unspent Amount Available (Rs.)</th>
            <th style={th}>Amount Available after Re-appropriation (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={tdC}>{i + 1}</td>
              <td style={td}>{r.head}</td>
              <td style={tdR}>{fmtAmt(r.unspent)}</td>
              <td style={tdR}>{fmtAmt(r.afterReap)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...td, textAlign: "right" }}>
              Total Amount
            </td>
            <td style={tdR}>{fmtAmt(totalUnspent)}</td>
            <td style={tdR}>{fmtAmt(totalAfter)}</td>
          </tr>
        </tbody>
      </table>

      <div style={J}>
        The expenditure for the above project will be debitable to{" "}
        {data.mhNo || "M.H.No.——"} – {data.agency || "——"} Project "
        {data.projectName || "——"}" by {data.piName || "——"},{" "}
        {data.piDesig || "——"}, {data.piDept || "——"}, {data.piCampus || "——"}.
      </div>

      {(data.sanctionRegVol || data.sanctionRegSl) && (
        <div style={{ ...J, marginBottom: "24px" }}>
          The above sanction has been entered in the Project Sanction Register
          Vol – {data.sanctionRegVol} C vide Sl.No.{data.sanctionRegSl} at Page
          No.{data.sanctionRegPage}.
        </div>
      )}

      <div
        className="avoid-break"
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <div
          style={{
            textAlign: "right",
            marginBottom: "28px",
            marginTop: "32px",
          }}
        >
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
          <div>
            1. {data.piName || "——"}, {data.piDesig || "——"},
            {data.piDept || "——"} – PI
          </div>
          <div>2. CSRC – 3</div>
          <div>3. CSRC – 4</div>
        </div>
      </div>
    </div>
  );
}

/* ─── PDF Report: With Installment ────────────────────────────────────────── */
export function ReportWith({ data, budgetHeads, reapPairs }) {
  const P = {
    fontFamily: "Times New Roman, serif",
    fontSize: "11pt",
    color: "#000",
  };
  const th = {
    border: "1px solid #000",
    padding: "5px 7px",
    textAlign: "center",
    fontWeight: "bold",
    background: "#fff",
    fontSize: "9.5pt",
  };
  const td = { border: "1px solid #000", padding: "5px 7px", fontSize: "10pt" };
  const tdR = {
    border: "1px solid #000",
    padding: "5px 7px",
    textAlign: "right",
    fontSize: "10pt",
  };
  const tdC = {
    border: "1px solid #000",
    padding: "5px 7px",
    textAlign: "center",
    fontSize: "10pt",
  };
  const J = { textAlign: "justify", marginBottom: "10px", lineHeight: "1.6" };
  const B = { fontWeight: "bold" };

  const rows = (budgetHeads || []).map((h) => {
    const net = (reapPairs || []).reduce((acc, p) => {
      const amt = parseFloat(p.amount) || 0;
      if (p.toHead === h.label) acc += amt;
      if (p.fromHead === h.label) acc -= amt;
      return acc;
    }, 0);
    return {
      head: h.label,
      unspent: h.amount,
      installmentAmount: 0,
      total: h.amount,
      afterReap: h.amount + net,
    };
  });

  const totalUnspent = rows.reduce((s, r) => s + r.unspent, 0);
  const totalAvail = rows.reduce((s, r) => s + r.total, 0);
  const currentInstAmt = parseFloat(data.currentInstallmentAmount) || 0;

  return (
    <div
      style={{
        width: "210mm",
        background: "#fff",
        margin: "0 auto",
        padding: "14mm 16mm",
        boxSizing: "border-box",
        ...P,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ ...B, fontSize: "13pt" }}>
          Centre for Sponsored Research and Consultancy (CSRC)
        </div>
        <div style={{ fontStyle: "italic" }}>(formerly known as CTDT)</div>
        <div>Anna University, Chennai – 600 025.</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={B}>
          Proceedings No. {data.proceedingNo || "CSRC/REAP/____/____"}
        </div>
        <div>{data.proceedingDate || today()}</div>
      </div>

      <div style={{ marginBottom: "10px", lineHeight: "1.6" }}>
        <span style={B}>Sub: </span>Anna University – {data.agency || "——"}{" "}
        Project – {data.projectScheme ? `${data.projectScheme} – ` : ""}"
        {data.projectName || "——"}" by {data.piName || "——"} –{" "}
        {data.currentInstallmentNo} &amp; Re-appropriation – Administrative
        sanction – Accorded
      </div>

      {(data.references || []).length > 0 && (
        <div style={{ marginBottom: "10px", lineHeight: "1.7" }}>
          <span style={B}>Ref: </span>
          {data.references.map((r, i) => (
            <div key={i}>
              {r.no}. {r.text}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", margin: "10px 0" }}>* * * * *</div>

      <div style={J}>
        The {data.agency || "——"} has sanctioned a project entitled{" "}
        <span style={B}>"{data.projectName || "——"}"</span>{" "}
        {data.projectScheme ? (
          <>
            <span style={B}>under "{data.projectScheme}"</span>{" "}
          </>
        ) : (
          ""
        )}
        to <span style={B}>{data.piName || "——"}</span>, {data.piDesig || "——"},{" "}
        {data.piDept || "——"}, {data.piCampus || "——"}, as the Principal
        Investigator for the period of {data.duration} from{" "}
        <span style={B}>{data.startDate || "——"}</span> to{" "}
        <span style={B}>{data.endDate || "——"}</span>.
        {data.extendedUpto
          ? ` The duration has been extended upto ${data.extendedUpto}.`
          : ""}
      </div>

      {(data.previousInstallments || []).length > 0 && (
        <>
          <div style={J}>
            A sum of{" "}
            <span style={B}>
              Rs.{data.totalCost || "——"}/- ({data.totalCostWords || "——"})
            </span>{" "}
            has already been released by the funding agency as per the details
            below:
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "12px",
              fontSize: "10.5pt",
            }}
          >
            <thead>
              <tr>
                {[
                  "Sl.No.",
                  "Instalment",
                  "Amount (Rs.)",
                  "Released Date",
                  "Sanction Proceedings No. & Date",
                ].map((h) => (
                  <th key={h} style={{ ...th, fontSize: "10pt" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.previousInstallments.map((inst, i) => (
                <tr key={i}>
                  <td style={tdC}>{i + 1}</td>
                  <td style={td}>{inst.no || inst.installment}</td>
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
        Now, the funding agency has assigned the{" "}
        <span style={B}>{data.currentInstallmentNo}</span> of{" "}
        <span style={B}>
          Rs.{fmtINR(currentInstAmt)}/- (
          {data.currentInstallmentWords ||
            numberToIndianWords(currentInstAmt) ||
            "——"}
          )
        </span>{" "}
        to THE DIRECTOR CSRC{" "}
        {data.projectScheme ? `${data.projectScheme.toUpperCase()}, ` : ""}
        {data.bankName || "UNION BANK OF INDIA"} A/c No.{data.pfmsRefNo || "——"}{" "}
        through <span style={B}>PFMS Portal</span>, vide reference{" "}
        {data.pfmsRefCited || "fifth"} cited.
      </div>

      {(reapPairs || []).map((p, i) => (
        <div style={J} key={i}>
          Also, requested for reappropriation to the tune of Rs.
          {p.amount || "——"}/- (
          {p.amountWords || numberToIndianWords(p.amount) || "——"}) from "
          {p.fromHead || "——"}" head to "{p.toHead || "——"}" head vide reference{" "}
          {p.refCited || "cited"} above.
        </div>
      ))}

      <div style={J}>
        Accordingly, an administrative sanction is hereby accorded for the{" "}
        {data.currentInstallmentNo} amount of{" "}
        <span style={B}>
          Rs.{fmtINR(currentInstAmt)}/- ({data.currentInstallmentWords || "——"})
        </span>{" "}
        and reappropriation of available funds as detailed below.
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "12px",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Sl. No.</th>
            <th style={th}>Head of Account</th>
            <th style={th}>Unspent Amount (Rs.)</th>
            <th style={th}>{data.currentInstallmentNo} Amount</th>
            <th style={th}>Total Available</th>
            <th style={th}>After Re-appropriation (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={tdC}>{i + 1}</td>
              <td style={td}>{r.head}</td>
              <td style={tdR}>{r.unspent ? `${fmtINR(r.unspent)}/-` : "—"}</td>
              <td style={tdR}>—</td>
              <td style={tdR}>{r.total ? `${fmtINR(r.total)}/-` : "—"}</td>
              <td style={tdR}>
                {r.afterReap ? `${fmtINR(r.afterReap)}/-` : "—"}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...td, textAlign: "right" }}>
              Total
            </td>
            <td style={tdR}>{fmtAmt(totalUnspent)}</td>
            <td style={tdR}>—</td>
            <td style={tdR}>{fmtAmt(totalAvail)}</td>
            <td style={tdR}>{fmtAmt(totalAvail)}</td>
          </tr>
        </tbody>
      </table>

      <div style={J}>
        The expenditure will be debitable under {data.mhNo || "M.H.No.——"} –{" "}
        {data.agency || "——"} Project "{data.projectName || "——"}" by{" "}
        {data.piName || "——"}, {data.piDesig || "——"}, {data.piDept || "——"},{" "}
        {data.piCampus || "——"}.
      </div>

      {(data.sanctionRegVol || data.sanctionRegSl) && (
        <div style={{ ...J, marginBottom: "24px" }}>
          The above sanction has been entered in the Project Sanction Register
          Vol – {data.sanctionRegVol} C vide Sl.No.{data.sanctionRegSl} at Page
          No.{data.sanctionRegPage}.
        </div>
      )}

      <div
        className="avoid-break"
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <div
          style={{
            textAlign: "right",
            marginBottom: "28px",
            marginTop: "32px",
          }}
        >
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
          <div>1. CSRC 3 & 4</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared project data hook (used by both form types) ───────────────────── */
function useProjectData() {
  const user = getUser();
  const userId = user?.id;

  const [agencies, setAgencies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingHeads, setLoadingHeads] = useState(false);

  // Fetch agencies on mount
  useEffect(() => {
    if (!userId) return;
    setLoadingAgencies(true);
    fetch(`${API}/agencies?user_id=${userId}`)
      .then((r) => r.json())
      .then((d) => setAgencies(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingAgencies(false));
  }, [userId]);

  const fetchProjects = (agency) => {
    if (!userId || !agency) {
      setProjects([]);
      return;
    }
    setLoadingProjects(true);
    fetch(
      `${API}/projects?user_id=${userId}&agency=${encodeURIComponent(agency)}`,
    )
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingProjects(false));
  };

  const fetchInstallments = (projectId) => {
    if (!projectId) {
      setInstallments([]);
      return;
    }
    fetch(`${API}/installments/${projectId}`)
      .then((r) => r.json())
      .then((d) => setInstallments(Array.isArray(d) ? d : []))
      .catch(console.error);
  };

  const fetchBudgetHeads = (projectId, installmentId) => {
    if (!projectId || !installmentId) {
      setBudgetHeads([]);
      return;
    }
    setLoadingHeads(true);
    fetch(`${API}/heads/${projectId}/${installmentId}`)
      .then((r) => r.json())
      .then((d) => setBudgetHeads(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoadingHeads(false));
  };

  return {
    agencies,
    projects,
    installments,
    budgetHeads,
    loadingAgencies,
    loadingProjects,
    loadingHeads,
    fetchProjects,
    fetchInstallments,
    fetchBudgetHeads,
    setBudgetHeads,
  };
}

/* ─── FORM: Without Installment ───────────────────────────────────────────── */
function FormWithout({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const reportRef = useRef(null);

  const {
    agencies,
    projects,
    installments,
    budgetHeads,
    loadingAgencies,
    loadingProjects,
    loadingHeads,
    fetchProjects,
    fetchInstallments,
    fetchBudgetHeads,
  } = useProjectData();

  // Form state
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState("");

  const [proceedingNo, setProceedingNo] = useState("");
  const [proceedingDate, setProceedingDate] = useState(today());
  const [directorName, setDirectorName] = useState("DIRECTOR, CSRC");

  useEffect(() => {
    fetch(`${API}/director`)
      .then((r) => r.json())
      .then((d) => setDirectorName(d.name || "DIRECTOR, CSRC"))
      .catch(console.error);
  }, []);
  const [mhNo, setMhNo] = useState("");
  const [sanctionRegVol, setSanctionRegVol] = useState("");
  const [sanctionRegSl, setSanctionRegSl] = useState("");
  const [sanctionRegPage, setSanctionRegPage] = useState("");
  const [duration, setDuration] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const [reapPairs, setReapPairs] = useState([
    {
      fromHead: "",
      toHead: "",
      amount: "",
      amountWords: "",
      refCited: "fourth",
    },
  ]);
  const [references, setReferences] = useState([
    { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
    { no: 2, text: "" },
    { no: 3, text: "" },
    { no: 4, text: "PI Re-appropriation Request dated " + today() + "." },
  ]);
  const [previousInstallments, setPreviousInstallments] = useState([]);
  const fetchPreviousInstallments = (projectId, installmentId) => {
    if (!projectId || !installmentId) {
      setPreviousInstallments([]);
      return;
    }
    fetch(`${API}/previous-installments/${projectId}/${installmentId}`)
      .then((r) => r.json())
      .then((d) => setPreviousInstallments(Array.isArray(d) ? d : []))
      .catch(console.error);
  };
  function numberToMonths(n, startDate, endDate) {
    if (n > 0) {
      const years = Math.floor(n / 12);
      const months = n % 12;
      const parts = [];
      if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
      if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
      return parts.join(" and ");
    }
    // fallback: calculate days if less than 1 month
    if (startDate && endDate) {
      const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days > 0) return `${days} Day${days > 1 ? "s" : ""}`;
    }
    return "";
  }
  // When project selected, auto-fill details and fetch installments
  const onProjectSelect = (projectId, proj) => {
    setSelectedProjectId(projectId);
    setSelectedInstallmentId("");
    fetchBudgetHeads(null, null);
    if (!projectId) {
      setSelectedProject(null);
      return;
    }
    setSelectedProject(proj || null);
    if (proj) {
      setTotalCost(proj.total_cost || "");
      if (proj.project_start_date && proj.project_end_date) {
        const start = new Date(proj.project_start_date);
        const end = new Date(proj.project_end_date);
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        console.log("MONTHS:", months);
        const words = numberToMonths(months, start, end);
        console.log("WORDS:", words); // ← now calls module-level function
        setDuration(words);
      }
    }
    fetchInstallments(projectId);
  };

  const onInstallmentSelect = (instId) => {
    setSelectedInstallmentId(instId);
    fetchBudgetHeads(selectedProjectId, instId);
    fetchPreviousInstallments(selectedProjectId, instId);
  };

  const headLabels = budgetHeads.map((h) => h.label);
  const selectedInstallmentObj = installments.find(
    (i) => String(i.id) === String(selectedInstallmentId),
  );
  const isFirstInstallment =
    (selectedInstallmentObj?.installment || "").trim().toUpperCase() === "I";
  const totalCostWords = useMemo(
    () => numberToIndianWords(totalCost),
    [totalCost],
  );

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [12, 10, 12, 10],

        filename: `Reappropriation_WithInst_${selectedProject?.funding_agency || "Request"}.pdf`,

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 1.5,
          useCORS: true,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: ["table", "tr", "td", ".avoid-break"],
        },
      })
      .from(reportRef.current)
      .save();
  };

  const validate = (st) => {
    if (st === 1) {
      if (!selectedAgency) return "Please select a Funding Agency.";
      if (!selectedProjectId) return "Please select a Project.";
      if (!selectedInstallmentId) return "Please select an Installment.";
    }
    if (st === 2) {
      if (reapPairs.some((p) => !p.fromHead || !p.toHead || !p.amount))
        return "Please complete From Head, To Head and Amount for every entry.";
    }
    if (st === 3) {
      if (references.some((r) => !r.text.trim()))
        return "Please fill all reference entries or remove empty ones.";
    }
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) {
      alert(err);
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const payload = {
        project_id: selectedProjectId,
        installment_id: selectedInstallmentId,
        reap_type: "without",
        proceeding_no: proceedingNo,
        proceeding_date: proceedingDate,
        mh_no: mhNo,
        sanction_reg_vol: sanctionRegVol,
        sanction_reg_sl: sanctionRegSl,
        sanction_reg_page: sanctionRegPage,
        director_name: directorName,
        references: JSON.stringify(references),
        reap_pairs: JSON.stringify(reapPairs),
      };

      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Submission failed");
        return;
      }

      // Upload generated PDF
      if (reportRef.current) {
        try {
          const pdfBlob = await html2pdf()
            .set({
              margin: [10, 8, 10, 8],
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4" },
              pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            })
            .from(reportRef.current)
            .outputPdf("blob");
          const form = new FormData();
          form.append(
            "report_pdf",
            new File([pdfBlob], `reap_${data.reappropriationId}.pdf`, {
              type: "application/pdf",
            }),
          );
          await fetch(`${API}/save-report/${data.reappropriationId}`, {
            method: "POST",
            body: form,
          });
        } catch (e) {
          console.error("PDF upload failed (non-critical)", e);
        }
      }

      onSubmit({ reappropriationId: data.reappropriationId });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  const STEPS = [
    "Project Info",
    "Re-appropriation",
    "References & History",
    "Preview & Submit",
  ];

  const reportData = {
    agency: selectedProject?.funding_agency || selectedAgency,
    projectName: selectedProject?.project_title || "",
    projectScheme: selectedProject?.scheme || "",
    piName: selectedProject?.pi_name || "",
    piDesig: selectedProject?.pi_desig || "",
    piDept: selectedProject?.pi_dept || "",
    piCampus: selectedProject?.pi_campus || "",
    totalCost,
    totalCostWords,
    startDate: selectedProject?.project_start_date
      ? new Date(selectedProject.project_start_date).toLocaleDateString("en-GB")
      : "",
    endDate: selectedProject?.project_end_date
      ? new Date(selectedProject.project_end_date).toLocaleDateString("en-GB")
      : "",
    duration,
    proceedingNo,
    proceedingDate,
    directorName,
    mhNo,
    sanctionRegVol,
    sanctionRegSl,
    sanctionRegPage,
    references,
    previousInstallments,
  };

  return (
    <div className="rp-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* STEP 1 ── Project Info */}
      {step === 1 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">📋</span>Project &amp; PI Information
          </div>
          <div className="rp-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect
                options={agencies}
                value={selectedAgency}
                loading={loadingAgencies}
                onChange={(v) => {
                  setSelectedAgency(v);
                  setSelectedProjectId("");
                  setSelectedProject(null);
                  fetchProjects(v);
                }}
                placeholder="Select agency…"
              />
            </Field>

            <Field label="Project Title" required span>
              <SearchableSelect
                options={projects.map((p) => `${p.id}||${p.project_title}`)}
                value={
                  selectedProjectId
                    ? `${selectedProject?.project_title || ""}`
                    : ""
                }
                loading={loadingProjects}
                onChange={(v) => {
                  const id = v.split("||")[0];
                  const proj = projects.find(
                    (p) => String(p.id) === String(id),
                  );
                  onProjectSelect(id, proj);
                }}
                placeholder={
                  selectedAgency ? "Select project…" : "Select agency first…"
                }
              />
            </Field>

            {installments.length > 0 && (
              <Field
                label="Reference Installment"
                required
                hint="Used to fetch budget heads"
                span
              >
                <select
                  className="rp-input"
                  value={selectedInstallmentId}
                  onChange={(e) => onInstallmentSelect(e.target.value)}
                >
                  <option value="">— Select installment —</option>
                  {installments.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.installment}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {selectedProject && (
              <>
                <Field label="PI Name">
                  <div className="rp-val-display">
                    {selectedProject.pi_name || "—"}
                  </div>
                </Field>
                <Field label="Designation">
                  <div className="rp-val-display">
                    {selectedProject.pi_desig || "—"}
                  </div>
                </Field>
                <Field label="Department" span>
                  <div className="rp-val-display">
                    {selectedProject.pi_dept || "—"}
                  </div>
                </Field>
                <Field label="Campus">
                  <div className="rp-val-display">
                    {selectedProject.pi_campus || "—"}
                  </div>
                </Field>
              </>
            )}

            <Field label="Total Project Cost (₹)">
              <input
                className="rp-input"
                type="number"
                placeholder="e.g. 2500000"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
              />
            </Field>
            <Field label="Total Cost in Words" hint="Auto-calculated">
              <ComputedField
                value={totalCostWords}
                placeholder="Calculated automatically…"
              />
            </Field>
            <Field
              label="Duration (in words)"
              hint="Auto-calculated from start/end date"
            >
              <ComputedField
                value={duration}
                placeholder="Calculated from project dates…"
              />
            </Field>
          </div>
          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 ── Re-appropriation Details */}
      {step === 2 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">🔄</span>Re-appropriation Details
          </div>

          {loadingHeads && (
            <div style={{ color: "#888", marginBottom: "12px" }}>
              Loading budget heads…
            </div>
          )}

          <ReapPairEditor
            pairs={reapPairs}
            onChange={setReapPairs}
            headLabels={headLabels}
            refPrefix="fourth"
          />

          <Field
            label="M.H. No."
            hint="Major Head number for debiting expenditure"
          >
            <input
              className="rp-input"
              placeholder="e.g. M.H.No.15.1.34"
              value={mhNo}
              onChange={(e) => setMhNo(e.target.value)}
            />
          </Field>

          <div className="rp-section-label" style={{ marginTop: "20px" }}>
            Budget Head Breakup
            <span
              style={{
                fontWeight: 400,
                fontSize: "12px",
                color: "#888",
                marginLeft: "8px",
              }}
            >
              — auto-calculated from DB amounts and re-appropriation entries
              above
            </span>
          </div>
          <BudgetBreakupTable budgetHeads={budgetHeads} reapPairs={reapPairs} />

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 ── References & Instalment History */}
      {step === 3 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">📚</span>References &amp; Instalment
            History
          </div>

          <div className="rp-section-label">References</div>
          <RefEditor refs={references} onChange={setReferences} />

          {/* Previous installments — only show if project has any */}
          {/* Previous installments — only show if NOT the first installment */}
          {!isFirstInstallment && previousInstallments.length > 0 && (
            <>
              <div className="rp-section-label" style={{ marginTop: "24px" }}>
                Previous Instalments
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#888",
                    marginLeft: "8px",
                  }}
                >
                  — fetched automatically from your project records
                </span>
              </div>
              <div className="rp-head-table-wrap">
                <table className="rp-head-table">
                  <thead>
                    <tr>
                      <th>Sl.No.</th>
                      <th>Instalment</th>
                      <th>Amount (Rs.)</th>
                      <th>Released Date</th>
                      <th>Sanction Proceedings No. &amp; Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousInstallments.map((i, idx) => (
                      <tr key={idx}>
                        <td className="rp-inst-sl">{idx + 1}</td>
                        <td>{i.no}</td>
                        <td className="rp-total-cell">{fmtAmt(i.amount)}</td>
                        <td>{i.releasedDate}</td>
                        <td>{i.procNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="rp-section-label" style={{ marginTop: "24px" }}>
            Sanction Register Details
          </div>
          <div className="rp-grid-2">
            <Field label="Proceedings No.">
              <input
                className="rp-input"
                value={proceedingNo}
                onChange={(e) => setProceedingNo(e.target.value)}
                placeholder="e.g. CSRC/REAP/001/2025"
              />
            </Field>
            <Field label="Proceedings Date">
              <input
                className="rp-input"
                value={proceedingDate}
                onChange={(e) => setProceedingDate(e.target.value)}
              />
            </Field>
            <Field label="Sanction Register Vol">
              <input
                className="rp-input"
                placeholder="e.g. VIII"
                value={sanctionRegVol}
                onChange={(e) => setSanctionRegVol(e.target.value)}
              />
            </Field>
            <Field label="Sl. No.">
              <input
                className="rp-input"
                placeholder="e.g. 124"
                value={sanctionRegSl}
                onChange={(e) => setSanctionRegSl(e.target.value)}
              />
            </Field>
            <Field label="Page No.">
              <input
                className="rp-input"
                placeholder="e.g. 56"
                value={sanctionRegPage}
                onChange={(e) => setSanctionRegPage(e.target.value)}
              />
            </Field>
            <Field
              label="Director Name"
              hint="Fetched automatically from records"
            >
              <ComputedField
                value={directorName}
                placeholder="Fetching director…"
              />
            </Field>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Preview Report →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 ── Preview & Submit */}
      {step === 4 && (
        <div className="rp-animate">
          <div className="rp-preview-toolbar">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="rp-btn rp-btn-download"
                onClick={handleDownloadPDF}
              >
                📄 Download PDF
              </button>
              <button className="rp-btn rp-btn-primary" onClick={handleSubmit}>
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="rp-report-shadow">
            <div ref={reportRef}>
              <ReportWithout
                data={reportData}
                budgetHeads={budgetHeads}
                reapPairs={reapPairs}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FORM: With Installment ───────────────────────────────────────────────── */
function FormWith({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const reportRef = useRef(null);

  const {
    agencies,
    projects,
    installments,
    budgetHeads,
    loadingAgencies,
    loadingProjects,
    loadingHeads,
    fetchProjects,
    fetchInstallments,
    fetchBudgetHeads,
  } = useProjectData();

  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState("");
  const [selectedInstallmentLabel, setSelectedInstallmentLabel] = useState("");

  const [proceedingNo, setProceedingNo] = useState("");
  const [proceedingDate, setProceedingDate] = useState(today());
  const [directorName, setDirectorName] = useState("DIRECTOR, CSRC");

  useEffect(() => {
    fetch(`${API}/director`)
      .then((r) => r.json())
      .then((d) => setDirectorName(d.name || "DIRECTOR, CSRC"))
      .catch(console.error);
  }, []);
  const [mhNo, setMhNo] = useState("");
  const [sanctionRegVol, setSanctionRegVol] = useState("");
  const [sanctionRegSl, setSanctionRegSl] = useState("");
  const [sanctionRegPage, setSanctionRegPage] = useState("");
  const [duration, setDuration] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [extendedUpto, setExtendedUpto] = useState("");

  const [currentInstallmentNo, setCurrentInstallmentNo] = useState("");
  const [currentInstallmentAmount, setCurrentInstallmentAmount] = useState("");
  const [bankName, setBankName] = useState("UNION BANK OF INDIA");
  const [pfmsRefNo, setPfmsRefNo] = useState("");
  const [pfmsRefCited, setPfmsRefCited] = useState("fifth");
  const [tsa, setTsa] = useState("");
  const [tsaRefCited, setTsaRefCited] = useState("sixth");
  const [toDesig, setToDesig] = useState("");

  const [reapPairs, setReapPairs] = useState([
    {
      fromHead: "",
      toHead: "",
      amount: "",
      amountWords: "",
      refCited: "seventh",
    },
  ]);
  const [references, setReferences] = useState([
    { no: 1, text: "Syndicate Resolution No.172.5.2 dt: 28.12.2005." },
    { no: 2, text: "" },
    { no: 3, text: "" },
    { no: 4, text: "" },
    { no: 5, text: "PFMS Release Advice dated " + today() + "." },
    { no: 6, text: "TSA Request dated " + today() + "." },
    { no: 7, text: "Reappropriation Request dated " + today() + "." },
  ]);
  const [previousInstallments, setPreviousInstallments] = useState([]);
  const fetchPreviousInstallments = (projectId, installmentId) => {
    if (!projectId || !installmentId) {
      setPreviousInstallments([]);
      return;
    }
    fetch(`${API}/previous-installments/${projectId}/${installmentId}`)
      .then((r) => r.json())
      .then((d) => setPreviousInstallments(Array.isArray(d) ? d : []))
      .catch(console.error);
  };
  function numberToMonths(n, startDate, endDate) {
    if (n > 0) {
      const years = Math.floor(n / 12);
      const months = n % 12;
      const parts = [];
      if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
      if (months > 0) parts.push(`${months} Month${months > 1 ? "s" : ""}`);
      return parts.join(" and ");
    }
    // fallback: calculate days if less than 1 month
    if (startDate && endDate) {
      const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days > 0) return `${days} Day${days > 1 ? "s" : ""}`;
    }
    return "";
  }
  const onProjectSelect = (projectId, proj) => {
    setSelectedProjectId(projectId);
    setSelectedInstallmentId("");
    fetchBudgetHeads(null, null);
    if (!projectId) {
      setSelectedProject(null);
      return;
    }
    setSelectedProject(proj || null);
    if (proj) {
      setTotalCost(proj.total_cost || "");
      if (proj.project_start_date && proj.project_end_date) {
        const start = new Date(proj.project_start_date);
        const end = new Date(proj.project_end_date);
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        const words = numberToMonths(months, start, end);
        setDuration(words);
      }
    }
    fetchInstallments(projectId);
  };

  const onInstallmentSelect = (instId) => {
    setSelectedInstallmentId(instId);
    fetchBudgetHeads(selectedProjectId, instId);
    fetchPreviousInstallments(selectedProjectId, instId);
    fetchInstallmentTotal(selectedProjectId, instId);
  };

  const fetchInstallmentTotal = (projectId, installmentId) => {
    if (!projectId || !installmentId) {
      setCurrentInstallmentAmount("");
      return;
    }
    fetch(`${API}/installment-total/${projectId}/${installmentId}`)
      .then((r) => r.json())
      .then((d) => setCurrentInstallmentAmount(d.total || ""))
      .catch(console.error);
  };

  const headLabels = budgetHeads.map((h) => h.label);
  const selectedInstallmentObj = installments.find(
    (i) => String(i.id) === String(selectedInstallmentId),
  );
  const isFirstInstallment =
    (selectedInstallmentObj?.installment || "").trim().toUpperCase() === "I";
  const totalCostWords = useMemo(
    () => numberToIndianWords(totalCost),
    [totalCost],
  );
  const currentInstallmentWords = useMemo(
    () => numberToIndianWords(currentInstallmentAmount),
    [currentInstallmentAmount],
  );

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    html2pdf()
      .set({
        margin: [12, 10, 12, 10],

        filename: `Reappropriation_WithInst_${selectedProject?.funding_agency || "Request"}.pdf`,

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 1.5,
          useCORS: true,
          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: ["table", "tr", "td", ".avoid-break"],
        },
      })
      .from(reportRef.current)
      .save();
  };

  const validate = (st) => {
    if (st === 1) {
      if (!selectedAgency) return "Please select a Funding Agency.";
      if (!selectedProjectId) return "Please select a Project.";
    }
    if (st === 2) {
      if (!selectedInstallmentId)
        return "Please select the current instalment.";
      if (!currentInstallmentAmount)
        return "Please enter the Instalment Amount.";
      if (reapPairs.some((p) => !p.fromHead || !p.toHead || !p.amount))
        return "Please complete From Head, To Head and Amount for every re-appropriation entry.";
    }
    if (st === 3) {
      if (references.some((r) => !r.text.trim()))
        return "Please fill all reference entries or remove empty ones.";
    }
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) {
      alert(err);
      return;
    }
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const payload = {
        project_id: selectedProjectId,
        installment_id: selectedInstallmentId,
        reap_type: "with",
        proceeding_no: proceedingNo,
        proceeding_date: proceedingDate,
        mh_no: mhNo,
        sanction_reg_vol: sanctionRegVol,
        sanction_reg_sl: sanctionRegSl,
        sanction_reg_page: sanctionRegPage,
        director_name: directorName,
        references: JSON.stringify(references),
        reap_pairs: JSON.stringify(reapPairs),
        current_installment_no: currentInstallmentNo,
        current_installment_amount: currentInstallmentAmount,
        bank_name: bankName,
        pfms_ref_no: pfmsRefNo,
        pfms_ref_cited: pfmsRefCited,
        tsa,
        tsa_ref_cited: tsaRefCited,
        to_desig: toDesig,
      };

      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Submission failed");
        return;
      }

      if (reportRef.current) {
        try {
          const pdfBlob = await html2pdf()
            .set({
              margin: [10, 8, 10, 8],
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4" },
              pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            })
            .from(reportRef.current)
            .outputPdf("blob");
          const form = new FormData();
          form.append(
            "report_pdf",
            new File([pdfBlob], `reap_with_${data.reappropriationId}.pdf`, {
              type: "application/pdf",
            }),
          );
          await fetch(`${API}/save-report/${data.reappropriationId}`, {
            method: "POST",
            body: form,
          });
        } catch (e) {
          console.error("PDF upload failed (non-critical)", e);
        }
      }

      onSubmit({ reappropriationId: data.reappropriationId });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  const STEPS = [
    "Project Info",
    "Instalment & Heads",
    "References & History",
    "Preview & Submit",
  ];

  const reportData = {
    agency: selectedProject?.funding_agency || selectedAgency,
    projectName: selectedProject?.project_title || "",
    projectScheme: selectedProject?.scheme || "",
    piName: selectedProject?.pi_name || "",
    piDesig: selectedProject?.pi_desig || "",
    piDept: selectedProject?.pi_dept || "",
    piCampus: selectedProject?.pi_campus || "",
    totalCost,
    totalCostWords,
    startDate: selectedProject?.project_start_date
      ? new Date(selectedProject.project_start_date).toLocaleDateString("en-GB")
      : "",
    endDate: selectedProject?.project_end_date
      ? new Date(selectedProject.project_end_date).toLocaleDateString("en-GB")
      : "",
    duration,
    extendedUpto,
    proceedingNo,
    proceedingDate,
    directorName,
    mhNo,
    sanctionRegVol,
    sanctionRegSl,
    sanctionRegPage,
    references,
    previousInstallments,
    currentInstallmentNo,
    currentInstallmentAmount,
    currentInstallmentWords,
    bankName,
    pfmsRefNo,
    pfmsRefCited,
    tsa,
    tsaRefCited,
    toDesig,
  };

  return (
    <div className="rp-form-wrap">
      <StepBar steps={STEPS} current={step} />

      {/* STEP 1 ── Project Info */}
      {step === 1 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">📋</span>Project &amp; PI Information
          </div>
          <div className="rp-grid-2">
            <Field label="Funding Agency" required span>
              <SearchableSelect
                options={agencies}
                value={selectedAgency}
                loading={loadingAgencies}
                onChange={(v) => {
                  setSelectedAgency(v);
                  setSelectedProjectId("");
                  setSelectedProject(null);
                  fetchProjects(v);
                }}
                placeholder="Select agency…"
              />
            </Field>

            <Field label="Project Title" required span>
              <SearchableSelect
                options={projects.map((p) => `${p.id}||${p.project_title}`)}
                value={
                  selectedProjectId
                    ? `${selectedProjectId}||${selectedProject?.project_title || ""}`
                    : ""
                }
                loading={loadingProjects}
                onChange={(v) => {
                  const id = v.split("||")[0];
                  const proj = projects.find(
                    (p) => String(p.id) === String(id),
                  );
                  onProjectSelect(id, proj);
                }}
                placeholder={
                  selectedAgency ? "Select project…" : "Select agency first…"
                }
              />
            </Field>

            {selectedProject && (
              <>
                <Field label="PI Name">
                  <div className="rp-val-display">
                    {selectedProject.pi_name || "—"}
                  </div>
                </Field>
                <Field label="Designation">
                  <div className="rp-val-display">
                    {selectedProject.pi_desig || "—"}
                  </div>
                </Field>
                <Field label="Department" span>
                  <div className="rp-val-display">
                    {selectedProject.pi_dept || "—"}
                  </div>
                </Field>
                <Field label="Campus">
                  <div className="rp-val-display">
                    {selectedProject.pi_campus || "—"}
                  </div>
                </Field>
              </>
            )}

            <Field label="Total Project Cost (₹)">
              <input
                className="rp-input"
                type="number"
                placeholder="e.g. 4500000"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
              />
            </Field>
            <Field label="Total Cost in Words" hint="Auto-calculated">
              <ComputedField
                value={totalCostWords}
                placeholder="Calculated automatically…"
              />
            </Field>
            <Field label="Project Start Date">
              <div className="rp-val-display">
                {selectedProject?.project_start_date
                  ? new Date(
                      selectedProject.project_start_date,
                    ).toLocaleDateString("en-GB")
                  : "—"}
              </div>
            </Field>
            <Field label="Project End Date">
              <div className="rp-val-display">
                {selectedProject?.project_end_date
                  ? new Date(
                      selectedProject.project_end_date,
                    ).toLocaleDateString("en-GB")
                  : "—"}
              </div>
            </Field>
            <Field label="Duration (in words)">
              <input
                className="rp-input"
                placeholder="e.g. sixty months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </Field>
            <Field label="Extended Upto (if applicable)">
              <input
                className="rp-input"
                type="date"
                value={extendedUpto}
                onChange={(e) => setExtendedUpto(e.target.value)}
              />
            </Field>
          </div>
          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={onBack}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 ── Instalment & Heads */}
      {step === 2 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">📦</span>Instalment &amp; Budget Head
            Details
          </div>

          <div className="rp-section-label">Current Instalment</div>
          <div className="rp-grid-2">
            <Field label="Select Instalment" required span>
              <select
                className="rp-input"
                value={selectedInstallmentId}
                onChange={(e) => onInstallmentSelect(e.target.value)}
              >
                <option value="">— Select instalment —</option>
                {installments.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.installment}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Instalment Amount (₹)"
              required
              hint="Auto-calculated from equipment, manpower, recurring & overhead heads"
            >
              <ComputedField
                value={
                  currentInstallmentAmount
                    ? fmtINR(currentInstallmentAmount)
                    : ""
                }
                placeholder="Select an instalment to calculate…"
              />
            </Field>
            <Field label="Amount in Words" span hint="Auto-calculated">
              <ComputedField
                value={currentInstallmentWords}
                placeholder="Calculated automatically…"
              />
            </Field>
            <Field label="Bank Name">
              <input
                className="rp-input"
                placeholder="UNION BANK OF INDIA"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </Field>
            <Field label="PFMS A/c No.">
              <input
                className="rp-input"
                placeholder="e.g. PFMS/2026/TEC/445"
                value={pfmsRefNo}
                onChange={(e) => setPfmsRefNo(e.target.value)}
              />
            </Field>
            <Field label="PFMS Reference Cited">
              <input
                className="rp-input"
                placeholder="e.g. fifth"
                value={pfmsRefCited}
                onChange={(e) => setPfmsRefCited(e.target.value)}
              />
            </Field>
            <Field label="TSA Account String" span>
              <input
                className="rp-input"
                placeholder="TSA A/c details…"
                value={tsa}
                onChange={(e) => setTsa(e.target.value)}
              />
            </Field>
            <Field label="TSA Reference Cited">
              <input
                className="rp-input"
                placeholder="e.g. sixth"
                value={tsaRefCited}
                onChange={(e) => setTsaRefCited(e.target.value)}
              />
            </Field>
            <Field
              label="To Designation"
              hint="Recipient's title in the 'To' section"
            >
              <input
                className="rp-input"
                placeholder="e.g. Professor"
                value={toDesig}
                onChange={(e) => setToDesig(e.target.value)}
              />
            </Field>
            <Field label="M.H. No.">
              <input
                className="rp-input"
                placeholder="e.g. M.H.No.21.4.55"
                value={mhNo}
                onChange={(e) => setMhNo(e.target.value)}
              />
            </Field>
          </div>

          <div className="rp-section-label" style={{ marginTop: "24px" }}>
            Re-appropriation Requests
          </div>
          {loadingHeads && (
            <div style={{ color: "#888", marginBottom: "8px" }}>
              Loading budget heads…
            </div>
          )}
          <ReapPairEditor
            pairs={reapPairs}
            onChange={setReapPairs}
            headLabels={headLabels}
            refPrefix="seventh"
          />

          <div className="rp-section-label" style={{ marginTop: "24px" }}>
            Budget Head Breakup
            <span
              style={{
                fontWeight: 400,
                fontSize: "12px",
                color: "#888",
                marginLeft: "8px",
              }}
            >
              — auto-calculated from DB &amp; re-appropriation entries above
            </span>
          </div>
          <BudgetBreakupTable budgetHeads={budgetHeads} reapPairs={reapPairs} />

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 ── References & History */}
      {step === 3 && (
        <div className="rp-card rp-animate">
          <div className="rp-card-head">
            <span className="rp-card-icon">📚</span>References &amp; Previous
            Instalments
          </div>

          <div className="rp-section-label">References</div>
          <RefEditor refs={references} onChange={setReferences} />

          {/* Previous installments from DB */}
          {installments.length > 1 && (
            <>
              <div className="rp-section-label" style={{ marginTop: "24px" }}>
                Previous Instalments
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#888",
                    marginLeft: "8px",
                  }}
                >
                  — fetched from your project
                </span>
              </div>
              <div className="rp-head-table-wrap">
                <table className="rp-head-table">
                  <thead>
                    <tr>
                      <th>Sl.</th>
                      <th>Instalment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments
                      .filter(
                        (i) => String(i.id) !== String(selectedInstallmentId),
                      )
                      .map((i, idx) => (
                        <tr key={i.id}>
                          <td className="rp-inst-sl">{idx + 1}</td>
                          <td>{i.installment}</td>
                          <td>{i.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="rp-section-label" style={{ marginTop: "12px" }}>
                Add Release Details for Previous Instalments (optional)
              </div>
              <InstEditor
                insts={previousInstallments}
                onChange={setPreviousInstallments}
              />
            </>
          )}

          <div className="rp-section-label" style={{ marginTop: "24px" }}>
            Sanction Register Details
          </div>
          <div className="rp-grid-2">
            <Field label="Proceedings No.">
              <input
                className="rp-input"
                value={proceedingNo}
                onChange={(e) => setProceedingNo(e.target.value)}
                placeholder="e.g. CSRC/REAP/001/2025"
              />
            </Field>
            <Field label="Proceedings Date">
              <input
                className="rp-input"
                value={proceedingDate}
                onChange={(e) => setProceedingDate(e.target.value)}
              />
            </Field>
            <Field label="Sanction Register Vol">
              <input
                className="rp-input"
                placeholder="e.g. X"
                value={sanctionRegVol}
                onChange={(e) => setSanctionRegVol(e.target.value)}
              />
            </Field>
            <Field label="Sl. No.">
              <input
                className="rp-input"
                placeholder="e.g. 212"
                value={sanctionRegSl}
                onChange={(e) => setSanctionRegSl(e.target.value)}
              />
            </Field>
            <Field label="Page No.">
              <input
                className="rp-input"
                placeholder="e.g. 88"
                value={sanctionRegPage}
                onChange={(e) => setSanctionRegPage(e.target.value)}
              />
            </Field>
            <Field
              label="Director Name"
              hint="Fetched automatically from records"
            >
              <ComputedField
                value={directorName}
                placeholder="Fetching director…"
              />
            </Field>
          </div>

          <div className="rp-actions">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <button className="rp-btn rp-btn-primary" onClick={next}>
              Preview Report →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 ── Preview & Submit */}
      {step === 4 && (
        <div className="rp-animate">
          <div className="rp-preview-toolbar">
            <button className="rp-btn rp-btn-ghost" onClick={back}>
              ← Back
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="rp-btn rp-btn-download"
                onClick={handleDownloadPDF}
              >
                📄 Download PDF
              </button>
              <button className="rp-btn rp-btn-primary" onClick={handleSubmit}>
                ✓ Submit Request
              </button>
            </div>
          </div>
          <div className="rp-report-shadow">
            <div ref={reportRef}>
              <ReportWith
                data={reportData}
                budgetHeads={budgetHeads}
                reapPairs={reapPairs}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Export ──────────────────────────────────────────────────────────── */
export default function ReappropriationPage({
  claimType,
  onNavigate,
  onNewRequest,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (data) => {
    setSubmittedData(data);
    setSubmitted(true);
    if (onNewRequest) onNewRequest(data);
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
          <p className="rp-success-sub">
            Your re-appropriation request has been submitted to CSRC for
            processing.
          </p>
          <div className="rp-success-meta">
            <div>
              <span>Request ID</span>
              <strong>REAP-{submittedData.reappropriationId}</strong>
            </div>
            <div>
              <span>Type</span>
              <strong>
                {claimType === "with"
                  ? "With Instalment"
                  : "Without Instalment"}
              </strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="rp-status-pending">Under Review</strong>
            </div>
          </div>
          <div className="rp-success-actions">
            <button
              className="rp-btn rp-btn-ghost"
              onClick={() => onNavigate && onNavigate("reappropriationhistory")}
            >
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
          <span
            onClick={() => onNavigate && onNavigate("reappropriationdashboard")}
            className="rp-bc-link"
          >
            Re-appropriation Dashboard
          </span>
          <span className="rp-bc-sep">/</span>
          <span>
            {claimType === "with" ? "With Instalment" : "Without Instalment"}
          </span>
        </div>
        <h1 className="rp-page-title">
          {claimType === "without" && "🔄 Re-appropriation without Instalment"}
          {claimType === "with" && "📦 Re-appropriation with Instalment"}
        </h1>
        <p className="rp-page-sub">
          Reallocate sanctioned funds between project budget heads
        </p>
      </div>

      {claimType === "without" && (
        <FormWithout
          onSubmit={handleSubmit}
          onBack={() => onNavigate && onNavigate("reappropriationdashboard")}
        />
      )}
      {claimType === "with" && (
        <FormWith
          onSubmit={handleSubmit}
          onBack={() => onNavigate && onNavigate("reappropriationdashboard")}
        />
      )}
      {!claimType && (
        <div className="rp-card">
          <p>
            No request type specified. Please go back to the dashboard and
            choose a re-appropriation type.
          </p>
          <div className="rp-actions">
            <button
              className="rp-btn rp-btn-primary"
              onClick={() =>
                onNavigate && onNavigate("reappropriationdashboard")
              }
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
