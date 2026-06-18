/**
 * CSRCProceedingsReport.jsx
 *
 * Renders the official "Request Sanctioned Project" proceedings letter in A4
 * format, matching the CSRC document format visible in the reference image.
 *
 * Props:
 *   reportData — assembled object (see assembleReportData helper below)
 *
 * ── assembleReportData(profileData, endorsementForm, sanctionedForm, installmentIndex) ──
 * Call this before rendering to merge data from all three source pages.
 */

import React from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────


const sanctionedForm = {
  projectTitle: "AI Based Crop Monitoring System",
  fundingAgency: "SERB",
  period: "3 Years",

  proceedingNo: "CSRC/2026/001",
  proceedingDate: "17-06-2026",

  sanctionRef:
    "SERB/F/2026/1234 dated 17-06-2026",

  refNo: "SERB/AI/2026/01",
  refDate: "15-06-2026",

  installments: [
    {
      label: "1st Installment",

      // Non Recurring
      nonRecurringTotal: 500000,

      // Recurring
      manpower: 300000,
      consumables: 150000,
      travel: 50000,
      contingency: 25000,

      // Other
      overheadTotal: 120000,
      ssrBudget: 30000,

      equipment: [
        {
          name: "High Performance Workstation",
        },
        {
          name: "Drone Camera",
        },
        {
          name: "GPU Server",
        },
      ],

      manpowerList: [
        {
          type: "Project Associate-I",
        },
        {
          type: "Junior Research Fellow",
        },
      ],
    },
  ],
};

const profile = {
  name: "Dr. Siva Kumar",
  designation: "Professor",
  department: "Department of Mechanical Engineering",
  campus: "CEG Campus",
  accountNumber: "1234567890",
  ifscCode: "SBIN0006756",
};

const endorsement = {
  piName: "Dr. Siva Kumar",
  fundingAgency: "SERB",
  title: "AI Based Crop Monitoring System",
  period: "3 Years",
};

const fmtINR = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num === 0) return '—';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (d) => {
  if (!d) return '___________';
  // accepts DD-MM-YYYY or YYYY-MM-DD
  const isoMatch = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;
  return d;
};

const todayStr = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Overhead is always split 5:4:4:2 of total (15 parts)
const splitOverhead = (total) => {
  const oh = parseFloat(total) || 0;
  return {
    registrar: oh * (5 / 15),
    dean:      oh * (4 / 15),
    csrc:      oh * (4 / 15),
    pdf:       oh * (2 / 15),
    total:     oh,
  };
};

const calcHeads = (inst) => {
  const nr  = parseFloat(inst.nonRecurringTotal) || 0;
  const man = parseFloat(inst.manpower)          || 0;
  const con = parseFloat(inst.consumables)       || 0;
  const trv = parseFloat(inst.travel)            || 0;
  const cnt = parseFloat(inst.contingency)       || 0;
  const ssr = parseFloat(inst.ssrBudget)         || 0;
  const oh  = splitOverhead(inst.overheadTotal);
  const grand = nr + man + con + trv + cnt + oh.total + ssr;
  return { nr, man, con, trv, cnt, ssr, oh, grand };
};

// ─── Data Assembler (export and call from parent) ────────────────────────────

/**
 * assembleReportData
 *
 * @param {object} profile        — from ProfilePage state / user object
 * @param {object} endorsement    — form state from NewEndorsementPage
 * @param {object} sanctionedForm — form state from RequestTab in SanctionedList
 * @param {number} instIndex      — which installment (0-based) this report is for
 * @param {Array}  previousInstallments — all installments before this one (for summary table)
 * @returns {object} reportData
 *
 * DUMMY DATA is provided as defaults so the component renders standalone.
 */
export function assembleReportData(
  profile        = {},
  endorsement    = {},
  sanctionedForm = {},
  instIndex      = 0,
  previousInstallments = [],
) {
  const inst = sanctionedForm.installments?.[instIndex] || {};

  // ── PI details ── (profile > endorsement > fallback)
  const piName        = profile.name        || endorsement.piName        || 'Dr. S. Balasivanandha Prabu';
  const piDesignation = profile.designation || endorsement.piDesignation || 'Professor';
  const piDept        = profile.department  || endorsement.piDept        || 'Department of Mechanical Engineering';
  const piCampus      = profile.campus      || endorsement.piCampus      || 'CEG Campus';
  const piRole        = endorsement.piRole  || 'PI';

  // ── Project details ── (endorsement > sanctionedForm)
  const projectTitle   = endorsement.title        || sanctionedForm.projectTitle   || 'Untitled Project';
  const fundingAgency  = endorsement.fundingAgency || sanctionedForm.fundingAgency || 'Funding Agency';
  const projectScheme  = endorsement.projectScheme || 'SPC';
  const projectPeriod  = endorsement.period        || sanctionedForm.period        || '';

  // ── Reference numbers (from endorsement / sanctionedForm) ──
  const refNo            = endorsement.refNo          || sanctionedForm.refNo   || '';
  const refDate          = endorsement.refDate        || sanctionedForm.refDate || '';
  const proceedingNo     = sanctionedForm.proceedingNo     || `CSRC/CTDT/${new Date().getFullYear()}/OBS`;
  const proceedingDate   = sanctionedForm.proceedingDate   || todayStr();

  // Fixed references that appear on every CSRC proceedings (per the image)
  const syndicateRef  = 'Syndicate Resolution No.172 S.D.dt.28.12.2016 — Accorded';
  const sanctionRef   = sanctionedForm.sanctionRef  || `Sanction Proceedings No. & Date: ${proceedingNo}, dated ${proceedingDate}`;
  const letterNo      = sanctionedForm.letterNo     || `Letter No. SRC/2021/002867 (G) & (C), dated 24-06-2022`;

  // ── Installment ──
  const installmentNumber = instIndex + 1;
  const instLabel         = inst.label || `${ordinal(installmentNumber)} Installment`;
  const heads             = calcHeads(inst);

  // ── Equipment list ──
  const equipmentItems = (inst.equipment || []).filter(e => e.name).map(e => e.name);
  const manpowerItems  = (inst.manpowerList || []).filter(m => m.type).map(m => m.type);

  // ── Account / IFS details ──
  const bankAccount   = profile.accountNumber || 'SBN00006463';
  const ifsCode       = profile.ifscCode      || 'SBIN0006756';
  const bankBranch    = profile.bankBranch    || 'Anna University';

  // ── Director ──
  const directorName = endorsement.directorName || 'THE DIRECTOR, CSRC';

  // ── "To" address ──
  const toAddress = sanctionedForm.toDean
    ? `The Director\n${piDept}\n${piCampus}\nAnna University`
    : `The Director\nCrystal Growth Centre, ACT Campus\nAnna University`;

  // ── Copy to list ──
  const copyTo = [
    piName,
    'CSRC – 3',
    'CSRC – 4',
    'PDF Register',
    'Bill',
  ];

  return {
    reportDate: todayStr(),
    proceedingNo,
    proceedingDate,
    syndicateRef,
    sanctionRef,
    letterNo,
    refNo,
    refDate,
    piName, piDesignation, piDept, piCampus, piRole,
    projectTitle,
    fundingAgency,
    projectScheme,
    projectPeriod,
    installmentNumber,
    instLabel,
    equipmentItems,
    manpowerItems,
    heads,
    bankAccount,
    ifsCode,
    bankBranch,
    directorName,
    toAddress,
    copyTo,
    previousInstallments,    // array of previously calculated { label, heads }
    inst,                    // raw installment data
  };
}

// ─── Inline styles (A4 print-ready) ─────────────────────────────────────────

const S = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    background: '#fff',
    padding: '14mm 14mm 14mm 20mm',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '11pt',
    lineHeight: 1.5,
    color: '#000',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '6px',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: '13pt',
    margin: 0,
    textDecoration: 'underline',
  },
  headerSub: {
    fontSize: '11pt',
    margin: '2px 0',
  },
  headerAddr: {
    fontSize: '11pt',
    margin: 0,
  },
  divider: {
    borderTop: '1.5px solid #000',
    margin: '6px 0 4px',
  },
  proceedingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '11pt',
  },
  stars: {
    textAlign: 'center',
    letterSpacing: '4px',
    margin: '6px 0',
    fontSize: '11pt',
  },
  subject: {
    marginTop: '10px',
    textAlign: 'justify',
    fontSize: '11pt',
  },
  para: {
    marginTop: '10px',
    textAlign: 'justify',
    fontSize: '11pt',
  },
  tableWrap: {
    marginTop: '10px',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '10.5pt',
  },
  th: {
    border: '1px solid #000',
    padding: '3px 5px',
    textAlign: 'center',
    fontWeight: 'bold',
    background: '#f5f5f5',
  },
  td: {
    border: '1px solid #000',
    padding: '2px 5px',
    verticalAlign: 'top',
  },
  tdRight: {
    border: '1px solid #000',
    padding: '2px 5px',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
  },
  tdCenter: {
    border: '1px solid #000',
    padding: '2px 5px',
    textAlign: 'center',
    verticalAlign: 'top',
  },
  groupRow: {
    fontWeight: 'bold',
    background: '#fafafa',
  },
  totalRow: {
    fontWeight: 'bold',
    background: '#f0f0f0',
  },
  indent: {
    paddingLeft: '20px',
  },
  signature: {
    marginTop: '48px',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: '11pt',
  },
  toSection: {
    marginTop: '14px',
    fontSize: '11pt',
  },
  copySection: {
    marginTop: '8px',
    fontSize: '11pt',
  },
  note: {
    marginTop: '10px',
    fontSize: '10.5pt',
    textAlign: 'justify',
  },
};

// ─── Previous Installments Summary Table ────────────────────────────────────

function PrevInstallmentsTable({ previousInstallments }) {
  if (!previousInstallments || previousInstallments.length === 0) return null;

  return (
    <div style={S.tableWrap}>
      <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '10.5pt' }}>
        Previous Installment(s) Summary:
      </p>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Sl. No.</th>
            <th style={S.th}>Installment</th>
            <th style={S.th}>Amount Sanctioned (₹)</th>
            <th style={S.th}>Released Date</th>
          </tr>
        </thead>
        <tbody>
          {previousInstallments.map((pi, i) => (
            <tr key={i}>
              <td style={S.tdCenter}>{i + 1}</td>
              <td style={S.td}>{pi.label}</td>
              <td style={S.tdRight}>{fmtINR(pi.heads?.grand ?? pi.amount)}</td>
              <td style={S.tdCenter}>{pi.releasedDate || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Budget Table ───────────────────────────────────────────────────────

function BudgetTable({ data }) {
  const { heads, equipmentItems, manpowerItems } = data;

  const rows = [
    // NON-RECURRING
    { sl: 'A', head: 'Non-Recurring Heads', amount: null, group: true },
    {
      sl: '1', group: false,
      head: (
        <span>
          Equipment
          {equipmentItems.length > 0 && (
            <span>
              {equipmentItems.map((e, i) => (
                <span key={i} style={{ display: 'block', paddingLeft: '16px' }}>• {e}</span>
              ))}
            </span>
          )}
          <br />
          <span style={{ fontSize: '10pt' }}>
            No. of equipment types: {equipmentItems.length}
          </span>
        </span>
      ),
      amount: heads.nr,
    },

    // RECURRING
    { sl: 'B', head: 'Recurring Heads', amount: null, group: true },
    {
      sl: '1', group: false,
      head: (
        <span>
          Manpower
          {manpowerItems.length > 0 && (
            <span>
              {manpowerItems.map((m, i) => (
                <span key={i} style={{ display: 'block', paddingLeft: '16px' }}>• {m}</span>
              ))}
            </span>
          )}
          <br />
          <span style={{ fontSize: '10pt' }}>
            No. of manpower types: {manpowerItems.length}
          </span>
        </span>
      ),
      amount: heads.man,
    },
    { sl: '2', head: 'Consumables & Accessories', amount: heads.con, group: false },
    { sl: '3', head: 'Travel',                    amount: heads.trv, group: false },
    { sl: '4', head: 'Contingency',               amount: heads.cnt, group: false },

    // OVERHEAD
    { sl: 'C', head: 'Overhead',                                      amount: heads.oh.total, group: true },
    { sl: '5', head: 'i) The Registrar A/C, Chennai 5%',             amount: heads.oh.registrar, group: false, indent: true },
    { sl: '6', head: 'ii) The Dean, Campus A/C 4%',                  amount: heads.oh.dean,      group: false, indent: true },
    { sl: '7', head: 'iii) CSRC Revenue, Chennai 4%',                amount: heads.oh.csrc,      group: false, indent: true },
    { sl: '8', head: 'iv) The Principal Investigator PDF 2%',        amount: heads.oh.pdf,       group: false, indent: true },

    // SSR
    { sl: 'D', head: 'Scientific Social Responsibility Budget Detail', amount: heads.ssr, group: false },
  ];

  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={{ ...S.th, width: '52px' }}>Sl. No.</th>
            <th style={S.th}>Head of Account</th>
            <th style={{ ...S.th, width: '160px' }}>Amount (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={r.group ? S.groupRow : {}}>
              <td style={S.tdCenter}>{r.sl}</td>
              <td style={{ ...S.td, ...(r.indent ? { paddingLeft: '24px' } : {}) }}>
                {r.head}
              </td>
              <td style={S.tdRight}>
                {r.amount !== null ? fmtINR(r.amount) : ''}
              </td>
            </tr>
          ))}
          <tr style={S.totalRow}>
            <td colSpan={2} style={{ ...S.td, textAlign: 'right', fontWeight: 'bold' }}>Total Amount</td>
            <td style={{ ...S.tdRight, fontWeight: 'bold' }}>{fmtINR(heads.grand)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Report Component ───────────────────────────────────────────────────

export default function CSRCProceedingsReport({ reportData }) {
  // Use dummy data if no reportData passed (standalone preview)
  const d =
  reportData ||
  assembleReportData(
    profile,
    endorsement,
    sanctionedForm,
    0
  );

  return (
    <div style={S.page}>

      {/* ── Letterhead ── */}
      <div style={S.header}>
        <p style={S.headerTitle}>Centre for Sponsored Research and Consultancy (CSRC)</p>
        <p style={S.headerSub}><em>(formerly known as CTDT)</em></p>
        <p style={S.headerAddr}>Anna University, Chennai – 600 025.</p>
      </div>

      <div style={S.divider} />

      {/* ── Proceedings No & Date ── */}
      <div style={S.proceedingRow}>
        <span><strong>Proceedings No: </strong>{d.proceedingNo}</span>
        <span><strong>Date: </strong>{fmtDate(d.proceedingDate) || todayStr()}</span>
      </div>

      {/* ── Reference chain (4 items matching the image) ── */}
      <div style={{ fontSize: '11pt', marginBottom: '4px' }}>
        <p style={{ margin: '2px 0' }}><strong>Ref:</strong></p>
        <ol style={{ margin: '2px 0 2px 18px', padding: 0 }}>
          <li style={{ marginBottom: '2px' }}>
            Anna University — SERB — SRC — Syndicate Resolution No. 172 S.D. dt. 28.12.2016 —&nbsp;
            <em>Transfer of Funds — Sanction — Accorded.</em>
          </li>
          <li style={{ marginBottom: '2px' }}>
            Sanction No. SRC/2021/002867 (G) &amp; (C), dated 24-06-2022.
          </li>
          <li style={{ marginBottom: '2px' }}>
            Sanction Proceedings No. &amp; Date:&nbsp;
            <strong>{d.sanctionRef}</strong>
          </li>
          <li style={{ marginBottom: '2px' }}>
            {d.refNo
              ? `Letter No. ${d.refNo}${d.refDate ? `, dated ${fmtDate(d.refDate)}` : ''}`
              : 'Letter No. ___________'}
          </li>
        </ol>
      </div>

      <div style={S.stars}>* * * * *</div>

      {/* ── Subject ── */}
      <p style={S.subject}>
        <strong>Sub:</strong>&nbsp;
        {d.fundingAgency} — Initiation of project&nbsp;
        <strong>"{d.projectTitle}"</strong>&nbsp;
        {d.projectScheme ? `under "${d.projectScheme}" ` : ''}
        under Principal Investigator&nbsp;
        <strong>{d.piName}</strong>,&nbsp;
        {d.piDept}, {d.piCampus} as the Principal Investigator for the project&nbsp;
        {d.projectPeriod && <>for the period <strong>{d.projectPeriod}</strong></>}
        — Prior sanction approval — reg.
      </p>

      {/* ── Body paragraph ── */}
      <p style={S.para}>
        The Science and Engineering Research Board, New Delhi has sanctioned a project entitled&nbsp;
        <strong>"{d.projectTitle}"</strong>&nbsp;
        under <strong>"{d.projectScheme || d.fundingAgency}"</strong>&nbsp;
        to <strong>{d.piName}</strong>,&nbsp;
        <strong>{d.piDesignation}</strong>,&nbsp;
        <strong>{d.piDept}</strong>, {d.piCampus}, as the Principal Investigator for the above said project.&nbsp;
        The funding agency has already been released by the funding agency and the necessary sanction proceedings had also been issued for the implementation of the above said project, as per the details given below.
      </p>

      {/* ── Installment meta table ── */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Sl. No.</th>
              <th style={S.th}>Installment</th>
              <th style={S.th}>Amount (Rs.)</th>
              <th style={S.th}>Released Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.tdCenter}>1</td>
              <td style={S.td}>{d.instLabel}</td>
              <td style={S.tdRight}>{fmtINR(d.heads.grand)}</td>
              <td style={S.tdCenter}>{fmtDate(d.proceedingDate)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Previous installments summary (if any) ── */}
      <PrevInstallmentsTable previousInstallments={d.previousInstallments} />

      {/* ── Transfer paragraph ── */}
      <p style={S.para}>
        Now, funding agency has released the&nbsp;
        <strong>{d.instLabel}</strong>&nbsp;
        of Rs. <strong>{fmtINR(d.heads.grand)}</strong>&nbsp;
        (Rupees{' '}
        <em>
          {/* spell-out placeholder — replace with a number-to-words util */}
          {d.heads.grand ? '[amount in words]' : '___________'}
        </em>
        ) vide the reference third cited above.
      </p>

      <p style={S.para}>
        In the reference fourth cited above, <strong>{d.piName}</strong>, Principal Investigator of the Project,&nbsp;
        has requested to transfer the Project grant to The Director after deducting Overhead charges as per the CSRC norms.
      </p>

      <p style={S.para}>
        Crystal Growth Centre, ACT Campus, Anna University, Account No.&nbsp;
        <strong>{d.bankAccount}</strong>, IFS Code: <strong>{d.ifsCode}</strong>,&nbsp;
        to meet the expenses related to the above project, after deducting Overhead charges as per the CSRC norms.
      </p>

      <p style={S.para}>
        In view of the above and as per the powers delegated in the reference first cited above, sanction is hereby accorded&nbsp;
        to transfer an amount not exceeding&nbsp;
        <strong>Rs. {fmtINR(d.heads.grand)}</strong>&nbsp;
        ({d.instLabel}) being the Project grant and Overhead charges to the respective account, as detailed below.
      </p>

      {/* ── Head-wise budget table ── */}
      <BudgetTable data={d} />

      {/* ── CSRC overhead note ── */}
      <p style={S.note}>
        The CSRC overhead charges 6(ii) along with PDF amount 8(iv) are retained in the Revenue a/c of CSRC.
      </p>

      <p style={S.note}>
        The amount allocated under PDF a/c... can be utilized by the individual, as per the norms prescribed in the CSRC Guidelines.
      </p>

      <p style={S.note}>
        The expenditure for the above project will be debitable to T/F – SERB Project&nbsp;
        <strong>"{d.projectTitle}"</strong>&nbsp;
        by <strong>{d.piName}</strong>, <strong>{d.piDesignation}</strong>,&nbsp;
        {d.piDept}, {d.piCampus}.
      </p>

      <p style={S.note}>
        The above sanction has been entered in the Project Sanction Register Vol. · VIIIB vide Sl. No. 2 at Page No. 98.
      </p>

      <p style={S.note}>
        The expenditure in this regard is debitable from <strong>"CSRC Project Account"</strong>&nbsp;
        under the Head of account "Project".
      </p>

      {/* ── Items & consumables standard clause ── */}
      <p style={S.para}>
        The items and consumables as detailed in your project may be purchased by following the University guidelines / rules in force at Anna University.&nbsp;
        The utilization of Contingency and Travel shall be as per the rules and regulations specified by Anna University.
      </p>

      {/* ── Signature block ── */}
      <div style={S.signature}>
        {d.directorName || 'DIRECTOR, CSRC'}
      </div>

      {/* ── To section ── */}
      <div style={S.toSection}>
        <strong>To</strong>
        <br />
        {d.toAddress.split('\n').map((line, i) => (
          <span key={i}>{line}<br /></span>
        ))}
      </div>

      {/* ── Copy to ── */}
      <div style={S.copySection}>
        <strong>Copy to:</strong>
        <ol style={{ margin: '4px 0 0 18px', padding: 0 }}>
          {d.copyTo.map((c, i) => <li key={i}>{c}</li>)}
        </ol>
      </div>

    </div>
  );
}

// ─── Print / PDF helper ──────────────────────────────────────────────────────

/**
 * printCSRCReport(reportData)
 * Opens a new window with the rendered report and triggers the browser print dialog.
 */
export function printCSRCReport(reportData) {
  const ReactDOM = require('react-dom/server');
  const html = ReactDOM.renderToStaticMarkup(
    <CSRCProceedingsReport reportData={reportData} />
  );
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>CSRC Proceedings — ${reportData?.projectTitle || 'Report'}</title>
  <style>
    body { margin: 0; background: #e5e5e5; display: flex; justify-content: center; }
    @page { size: A4; margin: 0; }
    @media print {
      body { background: #fff; display: block; }
    }
  </style>
</head>
<body>${html}</body>
</html>`);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}