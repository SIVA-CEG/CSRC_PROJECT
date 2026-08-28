import React, { createContext, useContext, useState } from "react";

// ── Seed Data ─────────────────────────────────────────────────────────────────
const FRESH_SEED = [
  {
    id: "FS-2026-001",
    refNo: "CRG/2026/001",
    title: "Advanced Material Science",
    cost: "50,00,000",
    fundingAgency: "SERB",
    pi: { name: "Dr. A. Kumar", department: "Mechanical Engineering", campus: "CEG Campus" },
    period: "01-01-2026 to 31-12-2028",
    installments: [{ installmentNo: "1st Installment", amount: "20,00,000" }],
    appliedOn: "01-06-2026",
    status: "PENDING",
    assignedAccount: "",
    accountCode: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },
  {
    id: "FS-2026-002",
    refNo: "DST/2026/005",
    title: "AI in Healthcare",
    cost: "25,00,000",
    fundingAgency: "DST",
    pi: { name: "Dr. B. Singh", department: "Information Technology", campus: "MIT Campus" },
    period: "01-02-2026 to 31-01-2029",
    installments: [{ installmentNo: "1st Installment", amount: "10,00,000" }],
    appliedOn: "03-06-2026",
    status: "PENDING",
    assignedAccount: "",
    accountCode: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },
];

const RENEWAL_SEED = [
  {
    id: "RS-2026-001",
    refNo: "CRG/2026/001",
    title: "Advanced Material Science",
    fundingAgency: "SERB",
    pi: { name: "Dr. A. Kumar", department: "Mechanical Engineering", campus: "CEG Campus" },
    currentInstallment: 2,
    installments: [
      {
        installmentNo: "1st Installment",
        amount: "20,00,000",
        approved: true,
        heads: [
          { head: "Equipment", amount: "8,00,000" },
          { head: "Manpower", amount: "4,00,000" },
          { head: "Consumables", amount: "3,00,000" },
          { head: "Travel", amount: "2,00,000" },
          { head: "Contingency", amount: "1,00,000" },
          { head: "Overhead", amount: "2,00,000" },
        ],
      },
      {
        installmentNo: "2nd Installment",
        amount: "15,00,000",
        approved: false,
        heads: [
          { head: "Equipment", amount: "5,00,000" },
          { head: "Manpower", amount: "3,00,000" },
          { head: "Consumables", amount: "2,00,000" },
          { head: "Travel", amount: "1,00,000" },
          { head: "Contingency", amount: "1,00,000" },
          { head: "Overhead", amount: "3,00,000" },
        ],
      },
    ],
    appliedOn: "05-06-2026",
    status: "PENDING",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },
];

const REAP_SEED = [
  {
    id: "REAP-2026-001",
    claimType: "without",
    submittedOn: "10-06-2026",
    agency: "SERB",
    projectName: "Development of Ti(C,N) based cermets",
    pi: "Dr. S. Balasivanandha Prabu",
    department: "Department of Mechanical Engineering, CEG Campus",
    procNo: "2433/CTDT-2/2020, dated 10-12-2020",
    installment: "2",
    headType: "recurring",
    reapRows: [
      { from: "Consumables", to: "Travel", amount: "20000" },
      { from: "Contingency", to: "Manpower", amount: "15000" },
    ],
    heads: {
      nonRecurring: [{ label: "Equipment 1", amount: 450000 }],
      recurring: [
        { label: "Manpower", subItems: [{ name: "JRF Salary", amount: 370080 }] },
        { label: "Consumables", amount: 80000 },
        { label: "Travel", amount: 40000 },
        { label: "Contingency", amount: 59920 },
      ],
    },
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },

  {
    id: "REAP-2026-002",
    claimType: "with",
    submittedOn: "12-06-2026",
    agency: "DST",
    projectName: "Technology Enabling Centre",
    pi: "Dr. R. Kumar",
    department: "Technology Enabling Centre, ACT Campus",
    procNo: "TEC/2026/045",
    currentInstallmentNo: "IV Instalment",
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },

  {
    id: "REAP-2026-003",
    claimType: "with",
    submittedOn: "15-06-2026",
    agency: "SERB",
    projectName: "AI Enabled Smart Agriculture",
    pi: "Dr. V. Rajesh",
    department: "Agricultural Engineering, CEG Campus",
    procNo: "SERB/2026/112",
    currentInstallmentNo: "III Instalment",
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },
];

const EXT_SEED = [
  {
    id: "EXT-2026-001",
    extensionType: "without",

    submittedOn: "08-06-2026",
    projectId: "P001",
    projectTitle: "Development of Ti(C,N) based cermets",
    pi: "Dr. S. Balasivanandha Prabu",
    department: "Department of Mechanical Engineering, CEG Campus",
    agency: "SERB",
    procNo: "2433/CTDT-2/2020",
    sanctionedDate: "10-12-2020",
    originalEndDate: "09-12-2023",
    duration: "3 Years",
    revisedEndDate: "09-06-2024",
    extensionPeriod: "+6 Months",
    reason: "Equipment procurement delayed due to supply-chain disruptions.",
    hasLetter: true,
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },

  {
    id: "EXT-2026-002",
    extensionType: "with",

    submittedOn: "12-06-2026",
    projectId: "P002",
    projectTitle: "Technology Enabling Centre",
    pi: "Dr. R. Kumar",
    department: "Technology Enabling Centre, ACT Campus",
    agency: "DST",
    procNo: "TEC/2026/045",
    sanctionedDate: "01-04-2023",
    originalEndDate: "31-03-2026",
    duration: "36 Months",
    revisedEndDate: "31-03-2028",
    extensionPeriod: "+24 Months",

    grantAmount: "2200000",
    grantAmountWords: "Twenty Two Lakh Only",
    bankAccount: "123456789012",
    ifscCode: "UBIN0567890",
    bankBranch: "Anna University Branch",

    hasLetter: true,
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },

  {
    id: "EXT-2026-003",
    extensionType: "with",

    submittedOn: "15-06-2026",
    projectId: "P003",
    projectTitle: "AI Enabled Smart Agriculture",
    pi: "Dr. V. Rajesh",
    department: "Agricultural Engineering, CEG Campus",
    agency: "SERB",
    procNo: "SERB/2026/112",
    sanctionedDate: "01-01-2024",
    originalEndDate: "31-12-2026",
    duration: "36 Months",
    revisedEndDate: "31-12-2027",
    extensionPeriod: "+12 Months",

    grantAmount: "1500000",
    grantAmountWords: "Fifteen Lakh Only",
    bankAccount: "987654321098",
    ifscCode: "SBIN0006756",
    bankBranch: "State Bank of India - Anna University",

    hasLetter: true,
    status: "PENDING",
    remarks: "",
    transferHistory: [],
    currentHolder: null,
    signatures: {},
  },
];

// ── Staff List ─────────────────────────────────────────────────────────────────
export const PROJECT_STAFF = [
  { id: 1, name: "Mr. R. Senthilkumar", role: "assistant" },
  { id: 2, name: "Mrs. K. Priya",       role: "assistant" },
  { id: 3, name: "Mr. T. Anbarasan",    role: "superintendent" },
  { id: 4, name: "Mrs. S. Meenakshi",   role: "superintendent" },
  { id: 5, name: "Dr. S. Balasivanandha Prabu", role: "director" },
];

// ── Context ───────────────────────────────────────────────────────────────────
const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  console.log("PROJECT PROVIDER MOUNTED");
  // Active (not yet transferred) items visible to assistant
  const [renewalActive, setRenewalActive] = useState(RENEWAL_SEED);
  const [reapActive,    setReapActive]    = useState(REAP_SEED);
  const [extActive,     setExtActive]     = useState(EXT_SEED);

  // Transferred items (visible in Transferred tabs, role-filtered)
  const [freshTransferred,   setFreshTransferred]   = useState([]);
  const [renewalTransferred, setRenewalTransferred] = useState([]);
  const [reapTransferred,    setReapTransferred]    = useState([]);
  const [extTransferred,     setExtTransferred]     = useState([]);

  // Completed items
  const [freshCompleted,   setFreshCompleted]   = useState([]);
  const [renewalCompleted, setRenewalCompleted] = useState([]);
  const [reapCompleted,    setReapCompleted]    = useState([]);
  const [extCompleted,     setExtCompleted]     = useState([]);

  const [freshActive, setFreshActive] = useState(() => {
  try {
    const stored = localStorage.getItem('csrc_fresh_active');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return FRESH_SEED;
});

  // ── Generic helpers ────────────────────────────────────────────────────────
  const makeTransferFns = (
    setActive, setTransferred, setCompleted
  ) => ({
    // Assistant/Superintendent transfers an item
    transfer: (item, toStaff) => {
      const today = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const fromRole = localStorage.getItem("userRole") || "assistant";
      const updated = {
        ...item,
        status: "TRANSFERRED",
        transferHistory: [
          ...(item.transferHistory || []),
          { from: "Office", fromRole, to: toStaff, date: today },
        ],
        currentHolder: toStaff,
      };
      // Remove from active list
      setActive(prev => prev.filter(i => i.id !== item.id));
      // Add/update in transferred list
      setTransferred(prev => {
        const exists = prev.find(i => i.id === updated.id);
        if (exists) return prev.map(i => i.id === updated.id ? updated : i);
        return [...prev, updated];
      });
    },

    // Director completes/approves an item
    complete: (item) => {
      const today = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const completed = { ...item, status: "COMPLETED", completedOn: today };
      setTransferred(prev => prev.filter(i => i.id !== item.id));
      setCompleted(prev => [...prev, completed]);
    },

    // Update an item in transferred (for edits by superintendent/director)
    updateTransferred: (updated) => {
      setTransferred(prev =>
        prev.map(i => i.id === updated.id ? updated : i)
      );
    },

    // Superintendent re-transfers to director
    forwardToDirector: (item, toStaff) => {
      const today = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      const fromRole = "superintendent";
      const updated = {
        ...item,
        transferHistory: [
          ...(item.transferHistory || []),
          { from: "Office", fromRole, to: toStaff, date: today },
        ],
        currentHolder: toStaff,
      };
      setTransferred(prev =>
        prev.map(i => i.id === updated.id ? updated : i)
      );
    },
  });

  const freshFns   = makeTransferFns(setFreshActive,   setFreshTransferred,   setFreshCompleted);
  const renewalFns = makeTransferFns(setRenewalActive, setRenewalTransferred, setRenewalCompleted);
  const reapFns    = makeTransferFns(setReapActive,    setReapTransferred,    setReapCompleted);
  const extFns     = makeTransferFns(setExtActive,     setExtTransferred,     setExtCompleted);

  return (
    <ProjectContext.Provider value={{
      // Fresh Sanction
      freshActive,   setFreshActive,
      freshTransferred,
      freshCompleted,
      ...Object.fromEntries(Object.entries(freshFns).map(([k,v]) => [`fresh_${k}`, v])),

      // Renewal Sanction
      renewalActive,   setRenewalActive,
      renewalTransferred,
      renewalCompleted,
      ...Object.fromEntries(Object.entries(renewalFns).map(([k,v]) => [`renewal_${k}`, v])),

      // Reappropriation
      reapActive,   setReapActive,
      reapTransferred,
      reapCompleted,
      ...Object.fromEntries(Object.entries(reapFns).map(([k,v]) => [`reap_${k}`, v])),

      // Extension
      extActive,   setExtActive,
      extTransferred,
      extCompleted,
      ...Object.fromEntries(Object.entries(extFns).map(([k,v]) => [`ext_${k}`, v])),
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used within ProjectProvider");
  return ctx;
}