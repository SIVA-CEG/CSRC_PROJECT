import { useState, useRef, useEffect } from "react";
import {
  CSRCReport,
  DSTReport,
  CMRGReport,
  ANRFReport,
  NewFormatReport,
} from "./EndorsementReport";
import "./NewEndorsementPage.css";
import { createEndorsement } from "../../../services/endorsementservices";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── DATA ──────────────────────────────────────────────
/*const CAMPUS_DATA = {
  "CEG Campus": {
    "Mechanical Engineering": ["Dr. A. Ramesh", "Dr. B. Kumar", "Dr. C. Sundaram"],
    "Civil Engineering":      ["Dr. S. Kanmani", "Dr. R. Priya", "Dr. M. Nathan"],
    "Chemistry":              ["Dr. S. Ananda Kumar", "Dr. T. Lakshmi", "Dr. V. Raj"],
    "Physics":                ["Dr. D. Durgalakshmi", "Dr. K. Arjun", "Dr. L. Meena"],
    "Computer Science":       ["Dr. P. Suresh", "Dr. Q. Devi", "Dr. R. Bala"],
  },
  "ACT Campus": {
    "Chemical Engineering": ["Dr. E. Mani", "Dr. F. Selvi"],
    "Biotechnology":        ["Dr. G. Rajan", "Dr. H. Geetha"],
  },
  "SAP Campus": {
    "Architecture": ["Dr. I. Nair", "Dr. J. Mohan"],
    "Planning":     ["Dr. K. Prem", "Dr. L. Anbu"],
  },
};*/

// Comprehensive Master list gathered from official database entries
const FUNDING_AGENCIES = [
  "AICTE",
  "ANRF",
  "Anusandhan National Research Foundation",
  "ARG",
  "Aeronautics Research and Development Board",
  "Australia-India Cyber and Critical Technology Partnership Grant Round 4",
  "Biotechnology Industry Research Assistance Council (BIRAC)",
  "Central Council for Research in Unani Medicine (CCRUM)",
  "Central Power Research Institute",
  "Centre for Medical Electronics",
  "Centre for Research, Anna University",
  "Chennai Metropolitan Water Supply and Sewerage Board",
  "Chief Minister Research Grant (CMRG)",
  "CHIP to Startups",
  "CMR",
  "CMRG",
  "Council of Scientific and Industrial Research",
  "CSIR",
  "CSIR-ASPIRE",
  "CVRDE",
  "DBT",
  "DBT Network Project",
  "DBT-BIRAC",
  "DBT, Government of India",
  "Defence Research and Development Organisation",
  "Defence R&D Organisation",
  "Department of Biotechnology",
  "Department of Environment, Government of Tamil Nadu",
  "Department of Science and Technology",
  "Department of Science and Technology (DST)",
  "Department of Science and Technology (TIDE)",
  "Department of Science and Technology (WTC)",
  "Department of Science and Technology, New Delhi",
  "Department of Science and Technology, New Delhi (STW)",
  "Department of Telecommunications - Bharat 5G Labs",
  "Department of Telecommunications - USOF",
  "Dhaksha Unmanned Systems Pvt. Ltd.",
  "DHR",
  "Directorate General of Civil Aviation (DGCA)",
  "Directorate of Futuristic Technology Management, DRDO",
  "Directorate of Technical Education (DoTE)",
  "DRDL",
  "DRDO",
  "DST",
  "DST DAAD",
  "DST VAIBHAV Fellowship",
  "DST-FICCI",
  "DST-JSPS Joint Research Project",
  "EDALL Systems",
  "FSSAI",
  "Good Food Institute",
  "Google",
  "Government of India Ministry of Electronics and Information Technology",
  "MeitY R&D II Group",
  "Higher Education Financing Agency",
  "HEFA",
  "ICMR",
  "ICSSR",
  "IGSTC",
  "IIT Kanpur",
  "IKS",
  "IKS BGS Samvahan Karyakram",
  "IKS Division of MoE, New Delhi",
  "INAE",
  "INCOIS",
  "Indian Council of Agricultural Research",
  "Indian Council of Medical Research",
  "Indian Council of Medical Research (ICMR)",
  "Indian Council of Social Science Research (ICSSR)",
  "Indian Institute of Science",
  "Indian Space Research Organisation",
  "Indo-German Science & Technology Centre",
  "Indo-German Science & Technology Centre (IGSTC)",
  "Indo-U.S. Science and Technology Forum",
  "INSA",
  "Integrated Child Development Services",
  "Inter-University Accelerator Centre",
  "ISRO",
  "IUAC",
  "L&T",
  "Madras Fertilizers Limited (MFL)",
  "Masaero Innovations",
  "MathWorks",
  "MeitY",
  "Microsoft Academic Partnership Grant 2024",
  "Ministry of AYUSH, Government of India",
  "Ministry of Communications",
  "Ministry of Earth Sciences",
  "Ministry of Education (MoE)",
  "Ministry of Electronics and Information Technology",
  "Ministry of Electronics and Information Technology (MeitY)",
  "Ministry of Environment, Forest and Climate Change",
  "Ministry of Food Processing Industries",
  "Ministry of Jal Shakti",
  "Ministry of Mines",
  "Ministry of New and Renewable Energy",
  "Ministry of New and Renewable Energy (MNRE)",
  "Ministry of Panchayati Raj",
  "Ministry of Textiles",
  "Ministry of Water Resources",
  "MNRE",
  "MoFPI",
  "NABARD",
  "National Bank for Agriculture and Rural Development",
  "National Human Rights Commission",
  "National Institute of Urban Affairs (NIUA)",
  "National Medicinal Plants Board",
  "National Remote Sensing Centre (NRSC)",
  "National Technical Textile Mission",
  "NCERT",
  "NIOS, Ministry of Education",
  "NLC India Limited",
  "Norwegian Council of Research",
  "Office of Principal Accountant General (Audit-II), Odisha",
  "Petroleum Conservation and Research Association (PCRA)",
  "Power Grid Centre of Excellence in Cyber Security",
  "Principal Accountant General (Audit-II), Odisha",
  "Science and Engineering Research Board",
  "Science and Engineering Research Board, New Delhi",
  "Science and Engineering Research Board, New Delhi (Power)",
  "SERB",
  "SERB Overseas Visiting Doctoral Fellowship",
  "SERB POWER",
  "SERB-SURE",
  "Space Application Centre, Ahmedabad",
  "SPARC",
  "SPARC-UKIERI",
  "SREE PVF",
  "State Development Policy Council (SDPC)",
  "SURE",
  "Suzuki Innovation Centre",
  "Tamil Nadu Forest Department",
  "Tamil Nadu Forest Department - State Forest Research Institute",
  "Tamil Nadu Innovation Initiatives",
  "Tamil Nadu Innovation Initiatives (TANII)",
  "Tamil Nadu State Council for Higher Education",
  "Tamil Nadu State Council for Science and Technology",
  "Tamil Nadu State Land Use Research Board (TNSLURB)",
  "Tamil Nadu State Wetland Authority",
  "Tamil Virtual Academy",
  "Tamil Nadu Agricultural University",
  "Tamil Nadu Power Distribution Corporation Limited",
  "TANGEDCO",
  "TANII",
  "TANII State Planning Commission",
  "Technology Development Projects (TDP)",
  "TEXMiN",
  "TIH Foundation for IoT & IoE",
  "TIH-IoT",
  "TNPCB",
  "TNRPF",
  "TNSCST",
  "TNSCT",
  "UGC",
  "UGC-DAE CSR",
  "UK Aid",
  "UKIERI",
  "United Nations Children's Fund (UNICEF)",
  "University of Bath",
  "Welkinrim Technologies Pvt. Ltd., Chennai",
  "Wellcome Trust-India Alliance",
  "WISER",
  "Xagrotor Tek Private Limited",
].sort();

// Comprehensive Master list gathered from official layout printouts
// Deduped with Set to avoid duplicate React keys (e.g. "TARE" appeared twice)
const PROJECT_SCHEMES = [
  ...new Set([
    "2+2 proposal",
    "2D hub",
    "6G Research Proposal",
    "A Special Call for Research Grants for Women Scientists",
    "Academia Industry Collaborative proposal",
    "Academic/R&D organization",
    "Advanced Hydrogen and Fuel Cell Programme",
    "Advanced research Grant",
    "AERODYNAMICS",
    "Aeronautics Research & Development Board",
    "Aeronautics Research & Development Board - Extramural Research Grant",
    "AI",
    "ALML Applications in Earth Sciences",
    "AMT",
    "Announcement of Opportunity (AO) for utilizing Chandrayaan-2 Orbiter Payloads data for Scientific Analysis",
    "ANRF MISSION AI for Science and Engineering (AI-SE)",
    "ARG* AERONAUTCIS RESEARCH & DEVELOPMENT BOARD",
    "ASEAN-INDIAN Collaborative R&D Scheme",
    "ATAL",
    "AU-CFR-SEED RESEARCH GRANT",
    "Australia-India Cyber and Critical Technology Partnership Grant Round 4",
    "AYURGYAN",
    "Biomedical Device and Technology Development",
    "C2S",
    "C3iHub Call for Cohort III R&D Proposals",
    "Call for Ignition Grants",
    'Call for Investigator-Initiated Research Proposals for "ICMR SMALL Extramural Grants" ("ICMR ANVESHAN Extramural Grants") - 2026',
    "Call for Mission Mode Project Proposals",
    "Call for project proposals for Innovative R&D in emerging areas of Information Technology (IT)",
    "Capacity Building in Geospatial Science and Technology",
    "CAR",
    "Central Sector Scheme AYURSWASTHYA YAJONA",
    "Central Sector Scheme On Conservation, Development and Sustainable Management of Medicinal Plants",
    "Chief Minister Research Grant (CMRG)",
    "Chief Minister Research Grant {CMRG}",
    "Chips to Startup",
    "Climate Change Programme",
    "Climate compatible growth-FRF",
    "climate resilient agriculture",
    "CMRG",
    "CoE",
    "CoE Cyber Space",
    "Cognitive Science Research Initiative",
    "Collaborative Research Scheme",
    "Colloborative Research Proposal",
    "Convergence Centres of Excellence",
    "CORE RESEARCH GRANT",
    "CORE RESEARCH GRANT {CRG}",
    "Covid 19",
    "CRG",
    "CSR",
    "Cyber Security Research and Development Group",
    "DBT Amrit scheme",
    "DBT BIRAC Joint Call for Proposals on Bio-AI for establishing मूल अंकुर hubs under BioE3 Policy for Biomanufacturing",
    "DBT BIRAC Joint Call for Proposals on Functional Foods for Fostering High Performance Biomanufacturing under BioE3 Policy",
    "DBT-BIRAC Joint Call for Proposals on ‘Precision Biotherapeutics-Cell and Gene Therapy’ for Fostering High Performance Biomanufacturing under BioE3 Policy",
    "Deep Ocean Mission",
    "Device Development Programme",
    "Directed Research",
    "DST SERB SURE Scheme",
    "DST SYST",
    "DST-RSF Joint Call",
    "DST-SURE",
    "ECR",
    "ECRA",
    "EMEQ",
    "Empowerment and Equity Opportunities for Excellence in Science",
    "Empowerment and Equity Opportunities for Excellence in science(EMEQ)",
    "EMPOWERMENT AND EQUITY OPPORTUNITIES FOR EXCELLENCE IN SCIENCE",
    "Engineering Science",
    "ENHANCEMENT OF THE GRAM PANCHAYAT SPATIAL DEVELOPMENT PLANS",
    "Expression of Interest Scheme 2025-2026",
    "Extramural Research Grant",
    "Extramural Research",
    "FIRE",
    "Geospatial Technology and Solutions",
    "google impact challenge",
    "Grand Challenge Scheme",
    "grand challenges India",
    "Grant Assistance from R&D Fund of Nabard",
    "Grant-in-aid Scheme / Grants in Aid Scheme",
    "HEFA",
    "HRD",
    "HRDG",
    "ICMR-Call for Application: Small Extramural Grants – 2025",
    "ICMR-DHR INTERNATIONAL FELLOWSHIP PROGRAMME FOR INDIAN BIOMEDICAL SCIENTISTS ((SHORT TERM)",
    "ICSSR Research Grant",
    "IKS BGS SAMVAHAN KARYAKRAM",
    "IKS IKS BGS SAMVAHAN KARYAKRAM",
    "Impact of climate change on the probability and intensity of extreme weather events over Indian region",
    "Inclusivity Research Grant",
    "India - Phillipines Joint Research Project",
    "India Sri Lanka Joint Call for Research Proposal",
    "India-Austria Joint Project",
    "INDIA-EU COOPERATION ON RESEARCH & INNOVATION",
    "India-Japan Cooperative Science Programme",
    "Indian Knowledge Systems Scheme",
    "Indo - Norwegian Cooperation Programme",
    "Indo- Sri Lanka Joint Research Programme",
    "Indo-Canadian DBT-IC IMPACTS",
    "Indo-French",
    "Indo-German WISER",
    "INDO-RUSSIA TECHNOLOGY DEVELOPMENT",
    "INDO-SWEDISH",
    "INDO-TAIWAN S&T CO-OPERATION PROGRAMME",
    "Information Security Education and Awareness (ISEA) Project Phase-III",
    "Initiated Research Proposal for Small Extramural Grants",
    "Innovation Fund Denmark",
    "Innovation Scheme",
    "Integrated Technology Interventions for Sustainable Environment",
    "Intermediate Extramural Grant",
    "International Travel Support",
    "Intramural Research Scheme",
    "Investigator-Initiated Research Proposals for Intermediate Extramural Grants",
    "IRPHA",
    "ISRO-VSSC Grant Scheme",
    "IUAC",
    "Livestock and Animal Biotechnology& Aquaculture Genome Editing-based Therapeutics for Targeted Therapy of Human Diseases",
    "Human Genetic Diseases",
    "Major Research Project",
    "Major Research Project 2025",
    "Materials for Energy Storage {MES}",
    "MATLAB & Simulink",
    "MATRICS",
    "Mehar Baba Challenge II",
    "Mehar Baba Competition",
    "Mid Career Award",
    "Mineral Exploration",
    "Minor Research Project",
    "Mission for Advancement in High-impact Areas (MAHA)",
    "mnre",
    "Multi-Institutional Proposal",
    "National Centre for Coastal Research",
    "National Council of Science and Technology Communication",
    "National Geospatial Programme",
    "National Green Hydrogen Mission (NGHM)",
    "National Innovations in Climate Resilient Agriculture",
    "National QUantum Mission",
    "National Science and Technology Management Information System (NSTMIS)",
    "National Supercomputing Mission",
    "NavIC-GAGAN",
    "nest",
    "NI",
    "nices",
    "Nil",
    "nill",
    "NISAR Utilization Programme",
    "NPDF",
    "NPNST",
    "NRSC, Hyderabad Project",
    "nsf",
    "Optimal Water Use in Industrial Sectors",
    "Other",
    "Overseas Visiting Doctoral Fellowship",
    "PAMC_ocean sciences of REACHOUT scheme",
    "POSHAN Abhiyaan",
    "POWER",
    "POWER - Research Grant",
    "Power Fellowship",
    "Prime Minister Early Career Research Grant",
    "Project Related Grant",
    "Promoting Academic Research Conversion to Enterprise (PACE)",
    "Promotion of research attitude in young and aspiring students",
    "Punyashloka Devi Ahilyabai Holkar Special Call for Women-Led Research on Women-Led Development",
    "R&D Component of Science and Technology Programme of Ministry of Mines",
    "R&D Programme of MoWR",
    "R&D Scheme for Green Hydrogen",
    "Ramanujan Fellowship",
    "Remort Pilot Training Organization ( RPTO )",
    "Renewable Energy Research and Techonogy Development (RE-RTD)",
    "RENEWABLE ENERGY RESEARCH AND TECHNOLOGY DEVELOPMENT PROGRAMME",
    "repsond basket 2024 / RESPOND BASKET 2024 / respond basket 2024",
    "Research & Development Project Proposals",
    "Research and Development",
    "Research Excellence Scheme",
    "Research Grant for in-service faculty members",
    "Research Grant in Biomedical Research",
    "Research Project",
    "Research Project Proposals on Family and Family Systems in India (2025-26)",
    "RESEARCH PROMOTION SCHEME",
    "Research Proposal",
    "research scheme on power / RESEARCH SCHEME ON POWER (RSOP)",
    "Research Scientist Scheme",
    "RESPOND",
    "RESPOND BASKET",
    "RESPOND BASKET 2021",
    "respond basket 2023 / RESPONSE BASKET 2023",
    "Respond Research Grant",
    "RFRS",
    "RPS",
    "RSQR",
    "SAAR",
    "Scheme for Development of Particularly Vulnerable Tribal Groups",
    "Scheme for Transformational and Advanced Research in Sciences (STARS)",
    "SCHEME SUPPORTS SUSTAINABLE AGRICULTURE",
    "science and technology",
    "Science and Technology for Women",
    "Science and Technology of Yoga and Meditation (SATYAM)",
    "Science and Technology Project Scheme",
    "Science Technology and Innovation (STI) Hubs for Development of Scheduled Caste (SC) and Scheduled Tribe (ST) Communities",
    "Science Technology Innovation Hub for SC & ST",
    "SCSP",
    "SEED",
    "SEED-TIDE",
    "Seminar/Symposia",
    "SERB POWER Research Grant",
    "serb sure",
    "SERB-INAE Online and Digital Gaming Research Initiative",
    "SERB-POWER Grant Scheme",
    "SERB-POWER Research grant",
    "SERB-SURE",
    "SERB-SURE SCHEME",
    "Short Term Call on COVID 19",
    "Short Term Research Grant",
    "SHRI",
    "Social Science Discipline",
    "SPARC",
    "Special call for Collaborative Research Projects on Vision Viksit Bharat@2047",
    "Special Call for Proposals",
    "Sponsored Research & Development Scheme",
    "Sponsored Research and Development",
    "Sponsored Research Scheme",
    "SRG",
    "Sree Ramakrishna Paramahamsa Research Grant for Agriculture Research 2022",
    "Sree Ramakrishna Paramahamsa Research Grant for Translational Biomedical Research 2021",
    "SRF",
    "STAR",
    "State Energy Efficiency Research and Outreach Program Scheme",
    "State Innovation Fund",
    "State Planing Commission",
    "State University Research Excellence {SURE}",
    "STI Hub for SC Community",
    "Student Project Scheme",
    "Student Project Sheme",
    "SUPRA",
    "Suzuki Next Bharat Fellowship Program",
    "Swarnajayanti Fellowship Scheme",
    "Symposia Grant Scheme for Organising Scientific Events (Symposia /Seminars /Conferences /workshops, etc. within India",
    "TARE",
    "Tamil Nadu Innovation Initiatives",
    "Tamil Nadu Innovation Initiatives (TANII) 2024-25 first round",
    "Tamil Nadu Innovation Initiatives (TANII) 2024-2025 second round",
    "TANII",
    "Tata Innovation Fellowship Program",
    "TDF",
    "TDP",
    "Teachers Associateship for Research Excellence (TARE)",
    "Team Science Grant",
    "Technology Development Programme",
    "Telecom Technology Development Fund - TTDF",
    "TIH - IoT Technology Development Program (7)-2024 Marine IoT",
    "TIH-IoT CHANAKYA Faculty & Chair Professor Fellowship Program 2023 (1)",
    "TNSCT",
    "TNSDA State energy efficiency research & Outreach programme",
    "Transforming Technology Solution through Advanced Materials and Critical Minerals",
    "UFUP",
    "UKIERI - 4",
    "URSC",
    "Utilization of In house and DAE Mega Science Facilities",
    "VAIBHAV Fellowship",
    "Vibrant Advocacy for Advancement and Nurturing of Indian Languages (VAANI)-2025-26",
    "Vision Viksit Bharat @2047 Project",
    "Visiting Scientist Fellowship",
    "Waste Management Technology",
    "Water Technology Cell",
    "WISE KIRAN",
    "WISE KIRAN Women in Space and Allied Sciences Leadership Program (WiSLP)",
    "WISE SCPE",
    "WISE-SCOPE",
    "Women Scientist Scheme - A",
    "Women Technology Park",
    "Women's Instinct for Developing and Ushering in Scientific Heights & Innovation",
    "WTC",
    "WTI",
    "Year of Awareness on Science and Health (YASH)",
    "Young Scientist Scheme",
    "{ Critical and Emerging Technology: Quantum Technologies and Artificial Intelligence for Transforming Lives}",
  ]),
].sort();

const ENDORSEMENT_FORMATS = ["CSRC", "DST", "CMRG", "ANRF", "New Format"];

const CO_PI_ROLES = [
  "COPI",
  "PI",
  "MENT",
  "NOMI",
  "INDU",
  "STUD",
  "GUDE",
  "SUB-CON",
  "OI",
  "PART",
  "PC",
  "KI",
  "PRO-ADV",
  "RES-SCH",
  "DST Inspir",
  "tst",
];

//const initialCoPi   = { campus: "", department: "", faculty: "", dob: "", service: "", superannuation: "", role: "COPI" };
const initialExtInv = { name: "", designation: "", institute: "" };

function formatCurrency(val) {
  const n = parseFloat(val) || 0;
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function NewEndorsementPage({ onNavigate }) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    fundingAgency: "",
    projectScheme: "",
    fundingType: "Central Govt",
    projectType: "Academic",
    gst: "no",
    title: "",
    refNo: "",
    nonRecurring: "",
    recurring: "",
    overheadPct: 15,
    dueDate: "",
    isPIRegular: "yes",
    endorsementRequired: "yes",
    endorsementFormat: "",
    piName: "Dr. S. Balasivanandha Prabu",
    piDesignation: "Professor",
    piDept: "Mechanical Engineering",
    piCampus: "CEG Campus",
    piDob: "05-04-1977",
    piService: "18-02-2005",
    piSuperannuation: "05-04-2037",
    piRole: "PI",
    yearsService: "11",
    directorName: "Dr. S. BALASIVANANDHA PRABU",
  });

  const [coPIs, setCoPIs] = useState([
    {
      campus: "",

      department: "",

      facultyId: "",

      role: "",
    },
  ]);
  const addCoPiRow = () => {
    setCoPIs([
      ...coPIs,

      {
        campus: "",

        department: "",

        facultyId: "",

        role: "",
      },
    ]);
  };

  /*const updateCoPi = (
    index,

    field,

    value,
  ) => {
    const updated = [...coPIs];

    updated[index][field] = value;

    // RESET DEPENDENT FIELDS

    if (field === "campus") {
      updated[index].department = "";

      updated[index].facultyId = "";
    }

    if (field === "department") {
      updated[index].facultyId = "";
    }

    setCoPIs(updated);
  };*/
  const [extInvs, setExtInvs] = useState([{ ...initialExtInv }]);
  const [files, setFiles] = useState({
    proposal: null,
    writeup: null,
    budget: null,
    endorsementFile: null,
    overhead: null,
  });
  const [showReport, setShowReport] = useState(false);
  //const activeFormat = form.endorsementFormat || "CSRC";

  const reportRef = useRef();

  const [campuses, setCampuses] = useState([]);

  const [departments, setDepartments] = useState([]);
  //const [, setGeneratedReport] = useState(null);
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetchCampuses();
  }, []);
  const fetchCampuses = async () => {
    const res = await axios.get("http://localhost:5000/api/faculty/campuses");

    setCampuses(res.data);
  };

  const fetchDepartments = async (campus) => {
    const res = await axios.get(
      `http://localhost:5000/api/faculty/departments/${campus}`,
    );

    setDepartments(res.data);
  };

  const fetchFaculties = async (
    campus,

    department,
  ) => {
    const res = await axios.get(
      `http://localhost:5000/api/faculty/list/${campus}/${department}`,
    );

    setFaculties(res.data);
  };
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
      fetchProfile(user.id);
    }
  }, []);
  const fetchProfile = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/profile/${userId}`,
      );

      setProfile(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // Animation on load
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Derived Financial Values ────────────────────────────────────────────────
  const nrAmount = parseFloat(form.nonRecurring) || 0;
  const rAmount = parseFloat(form.recurring) || 0;
  const baseAmount = nrAmount + rAmount;
  const overheadPct = parseFloat(form.overheadPct) || 0;

  const overheadAmt = baseAmount * (overheadPct / 100);
  const subTotal = baseAmount + overheadAmt;
  const gstAmt = form.gst === "yes" ? subTotal * 0.18 : 0;
  const grandTotal = subTotal + gstAmt;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateCoPI = (
    index,

    field,

    value,
  ) => {
    const updated = [...coPIs];

    updated[index][field] = value;

    setCoPIs(updated);
  };
  /*const addCoPI = () => {
    setCoPIs([
      ...coPIs,

      {
        campus: "",

        department: "",

        facultyId: "",

        role: "",
      },
    ]);
  };*/
  const delCoPiRow = () => setCoPIs((p) => (p.length > 1 ? p.slice(0, -1) : p));

  const updateExtInv = (i, k, v) =>
    setExtInvs((prev) => {
      const n = [...prev];
      n[i] = { ...n[i], [k]: v };
      return n;
    });
  const addExtRow = () => setExtInvs((p) => [...p, { ...initialExtInv }]);
  const delExtRow = () =>
    setExtInvs((p) => (p.length > 1 ? p.slice(0, -1) : p));

  const handleFile = (k, e) =>
    setFiles((f) => ({ ...f, [k]: e.target.files[0] || null }));

  // ── Print / PDF ─────────────────────────────────────────────────────────────
  const generateReportPdf = async (shouldDownload = false) => {
    console.log("FUNCTION STARTED");
    const element = reportRef.current;
    console.log("ELEMENT:");
    console.log(element);
    if (!element) return;
    console.log(reportRef.current);
    console.log(reportRef.current.innerHTML);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("BEFORE HTML2CANVAS");
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    console.log("AFTER HTML2CANVAS");
    const imgData = canvas.toDataURL("image/png");
    console.log("CREATING PDF");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;

    const pdfHeight = 297;

    const imgWidth = pdfWidth;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pdfHeight;
    }

    // CREATE BLOB FIRST
    // CREATE PDF BLOB
    const pdfBlob = pdf.output("blob");

    // CREATE FILE
    const reportFile = new File(
      [pdfBlob],
      `${form.endorsementFormat}-Report.pdf`,
      {
        type: "application/pdf",
      },
    );
    // DOWNLOAD AFTER EVERYTHING
    if (shouldDownload) {
      pdf.save(`${form.endorsementFormat}-Report.pdf`);
    }
    console.log("RETURNING REPORT FILE");
    console.log(reportFile);
    return reportFile;
  };
  const handleSubmit = async () => {
    // REQUIRED FIELD VALIDATION

    if (
      !form.fundingAgency ||
      !form.projectScheme ||
      !form.projectType ||
      !form.title ||
      !form.nonRecurring ||
      !form.recurring ||
      !form.overheadPct ||
      !form.dueDate
    ) {
      alert("Please fill all the necessary details before submitting.");

      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));

      // FORM DATA FOR FILE UPLOADS

      const payload = new FormData();

      payload.append(
        "user_id",

        user.id,
      );

      payload.append(
        "funding_agency",

        form.fundingAgency,
      );

      payload.append(
        "funding_agency_type",

        form.fundingType,
      );

      payload.append(
        "project_type",

        form.projectType,
      );

      payload.append(
        "scheme",

        form.projectScheme,
      );

      payload.append(
        "full_project_title",

        form.title,
      );

      payload.append(
        "reference_number",

        form.refNo || "",
      );

      payload.append(
        "non_recurring",

        form.nonRecurring || "",
      );

      payload.append(
        "recurring",

        form.recurring || "",
      );

      payload.append(
        "overhead_percent",

        form.overheadPct || "",
      );

      payload.append(
        "gst_added",

        form.gst === "yes",
      );

      payload.append(
        "total_amount",

        grandTotal || "",
      );

      payload.append(
        "submission_due_date",

        form.dueDate,
      );

      payload.append(
        "is_pi_regular_faculty",

        form.isPIRegular === "yes",
      );

      payload.append(
        "endorsement_required",

        form.endorsementRequired === "yes",
      );

      // OPTIONAL

      payload.append(
        "endorsement_format",

        form.endorsementFormat || "",
      );

      payload.append(
        "overhead_exemption",

        form.overheadExemption || "",
      );

      // FILES

      if (files.proposal) {
        payload.append(
          "proposal_copy",

          files.proposal,
        );
      }

      if (files.writeup) {
        payload.append(
          "signed_writeup",

          files.writeup,
        );
      }

      if (files.budget) {
        payload.append(
          "signed_budget",

          files.budget,
        );
      }

      if (files.endorsementFile) {
        payload.append(
          "endorsement_format_file",

          files.endorsementFile,
        );
      }

      if (files.overhead) {
        payload.append(
          "overhead_exemption_file",

          files.overhead,
        );
      }

      // OPTIONAL Co-PI

      payload.append(
        "coPrincipalInvestigators",

        JSON.stringify(
          coPIs.length > 0
            ? coPIs.map((row) => ({
                copi_user_id: row.facultyId || 1,

                role: row.role || null,
              }))
            : [],
        ),
      );

      // OPTIONAL External Investigators

      payload.append(
        "externalInvestigators",

        JSON.stringify(
          extInvs.length > 0
            ? extInvs.map((row) => ({
                full_name: row.name || null,

                designation: row.designation || null,

                institute: row.institute || null,
              }))
            : [],
        ),
      );

      // GENERATE REPORT FIRST
      //const reportFile = await generateReportPdf(false);

      // APPEND REPORT

      // THEN CREATE ENDORSEMENT
      const res = await createEndorsement(payload);

      console.log("CREATE RESPONSE:");
      console.log(res.data);

      const endorsementId = res.data.endorsementId;

      console.log("BEFORE PDF GENERATION");

      const generatedPdfFile = await generateReportPdf(false);

      console.log("AFTER PDF GENERATION");

      console.log(generatedPdfFile);

      if (generatedPdfFile) {
        console.log("SENDING REPORT API");

        const reportPayload = new FormData();

        reportPayload.append("endorsementId", endorsementId);

        reportPayload.append(
          "report_pdf",
          generatedPdfFile,
          generatedPdfFile.name,
        );

        const reportRes = await axios.post(
          "http://localhost:5000/api/endorsements/save-report",
          reportPayload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        console.log("REPORT RESPONSE:");

        console.log(reportRes.data);
      }

      alert("Endorsement submitted successfully");
    } catch (err) {
      console.log(err);

      alert("Submission failed");
    }
  };
  const reportForm = {
    ...form,

    // PI DETAILS FROM PROFILE
    piName: profile?.staff_name || "",

    piDesignation: profile?.designation || "",

    piDept: profile?.department || "",

    piCampus: profile?.campus || "",

    yearsService: profile?.superannuation_date
      ? (
          new Date(profile.superannuation_date).getFullYear() -
          new Date().getFullYear()
        ).toString()
      : "",

    // CO-PI + EXTERNALS
    coPIs,

    extInvs,

    // FINANCIALS
    calculatedTotal: grandTotal,
  };

  const formatComponents = {
    CSRC: <CSRCReport form={reportForm} />,
    DST: <DSTReport form={reportForm} />,
    CMRG: <CMRGReport form={reportForm} />,
    ANRF: <ANRFReport form={reportForm} />,
    "New Format": <NewFormatReport form={reportForm} />,
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date)

      .toLocaleDateString("en-GB")

      .replace(/\//g, "-");
  };

  return (
    <div className={`ep-page ${mounted ? "ep-loaded" : ""}`}>
      <div
        style={{
          position: "fixed",
          left: "-99999px",
          top: 0,
          width: "210mm",
          background: "#fff",
          zIndex: -1,
        }}
      >
        <div ref={reportRef} className="actual-report-container">
          {formatComponents[form.endorsementFormat]}
        </div>
      </div>
      <div className="ep-container">
        {/* ── Top Navigation / Back Button ── */}
        <div className="ep-top-nav">
          <button
            className="ep-btn-back"
            onClick={() => onNavigate("endorsements")}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* ── Page Header ── */}
        <div className="ep-header-banner">
          <div className="ep-header-content">
            <h1 className="ep-header-title">New Proposal Endorsement</h1>
            <p className="ep-header-sub">
              Centre for Sponsored Research and Consultancy — Anna University
            </p>
          </div>
          <div className="ep-header-glow"></div>
        </div>

        {/* ══ SECTION 1: Funding Information ══════════════════════════════════ */}
        <div className="ep-card ep-anim-1">
          <div className="ep-card-heading">Funding Information</div>

          <div className="ep-grid-2">
            <div className="ep-input-group">
              <label className="ep-label">Funding Agency</label>
              <select
                className="ep-select"
                value={form.fundingAgency}
                onChange={(e) => setField("fundingAgency", e.target.value)}
              >
                <option value="">-- Select Agency --</option>
                {FUNDING_AGENCIES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="ep-input-group">
              <label className="ep-label">Project Scheme</label>
              <select
                className="ep-select"
                value={form.projectScheme}
                onChange={(e) => setField("projectScheme", e.target.value)}
              >
                <option value="">-- Select Scheme --</option>
                {PROJECT_SCHEMES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ep-grid-2 ep-mt24">
            <div className="ep-radio-card">
              <div className="ep-label">Funding Agency Type</div>
              <div className="ep-radio-group">
                {["Central Govt", "State Govt", "Private", "Individual"].map(
                  (label) => (
                    <label key={label} className="ep-custom-radio-label">
                      <input
                        type="radio"
                        name="fundingType"
                        value={label}
                        checked={form.fundingType === label}
                        onChange={(e) =>
                          setField("fundingType", e.target.value)
                        }
                      />
                      <span className="ep-radio-circle"></span>
                      {label}
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="ep-radio-card">
              <div className="ep-label">Project Type</div>
              <div className="ep-radio-group">
                {["Academic", "Collaborative", "International"].map((label) => (
                  <label key={label} className="ep-custom-radio-label">
                    <input
                      type="radio"
                      name="projectType"
                      value={label}
                      checked={form.projectType === label}
                      onChange={(e) => setField("projectType", e.target.value)}
                    />
                    <span className="ep-radio-circle"></span>
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: Project Title ════════════════════════════════════════ */}
        <div className="ep-card ep-anim-2">
          <div className="ep-card-heading">Project Details</div>
          <div className="ep-input-group">
            <label className="ep-label">Full Project Title</label>
            <textarea
              className="ep-textarea"
              placeholder="Enter the complete title of the proposal..."
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
          </div>
          <div className="ep-input-group ep-mt16">
            <label className="ep-label">
              Reference Number <span className="ep-hint">(optional)</span>
            </label>
            <input
              className="ep-input ep-input-sm"
              placeholder="e.g. 2526ET0937/CSRC-2"
              value={form.refNo}
              onChange={(e) => setField("refNo", e.target.value)}
            />
          </div>
        </div>

        {/* ══ SECTION 3: Financial Details ════════════════════════════════════ */}
        <div className="ep-card ep-anim-3">
          <div className="ep-card-heading">Financial Breakdown</div>

          <div className="ep-grid-3">
            <div className="ep-input-group">
              <label className="ep-label">
                Non-Recurring (₹) <span className="ep-hint">Equipment</span>
              </label>
              <input
                className="ep-input"
                type="number"
                placeholder="0"
                value={form.nonRecurring}
                onChange={(e) => setField("nonRecurring", e.target.value)}
              />
            </div>
            <div className="ep-input-group">
              <label className="ep-label">
                Recurring (₹){" "}
                <span className="ep-hint">Salary, Consumables</span>
              </label>
              <input
                className="ep-input"
                type="number"
                placeholder="0"
                value={form.recurring}
                onChange={(e) => setField("recurring", e.target.value)}
              />
            </div>
            <div className="ep-input-group">
              <label className="ep-label">Overhead %</label>
              <input
                className="ep-input"
                type="number"
                value={form.overheadPct}
                onChange={(e) => setField("overheadPct", e.target.value)}
              />
            </div>
          </div>

          <div className="ep-gst-toggle-wrap ep-mt24">
            <div className="ep-label">Include GST @ 18% on Subtotal?</div>
            <div className="ep-toggle-buttons">
              <button
                className={`ep-toggle-btn ${form.gst === "yes" ? "active" : ""}`}
                onClick={() => setField("gst", "yes")}
              >
                Yes, Include GST
              </button>
              <button
                className={`ep-toggle-btn ${form.gst === "no" ? "active danger" : ""}`}
                onClick={() => setField("gst", "no")}
              >
                No GST
              </button>
            </div>
          </div>

          {/* Premium Auto-calculation box */}
          <div className="ep-calc-box">
            <div className="ep-calc-header">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Dynamic Cost Summary
            </div>
            <div className="ep-calc-body">
              <div className="ep-calc-row">
                <span>Base Amount (Recurring + Non-Recurring)</span>
                <span className="ep-calc-val">
                  ₹ {formatCurrency(baseAmount)}
                </span>
              </div>
              <div className="ep-calc-row ep-calc-border">
                <span>Overhead ({form.overheadPct}%)</span>
                <span className="ep-calc-val">
                  ₹ {formatCurrency(overheadAmt)}
                </span>
              </div>
              <div className="ep-calc-row ep-calc-subtotal">
                <span>Subtotal</span>
                <span className="ep-calc-val">
                  ₹ {formatCurrency(subTotal)}
                </span>
              </div>

              <div
                className={`ep-calc-row ep-gst-row ${form.gst === "yes" ? "visible" : ""}`}
              >
                <span>GST (18% of Subtotal)</span>
                <span className="ep-calc-val">
                  + ₹ {formatCurrency(gstAmt)}
                </span>
              </div>

              <div className="ep-calc-row ep-calc-total">
                <span>Total Project Amount</span>
                <span className="ep-total-highlight">
                  ₹ {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 4: Submission & PI Details ══════════════════════════════ */}
        <div className="ep-card ep-anim-4">
          <div className="ep-card-heading">Submission &amp; PI Details</div>

          <div className="ep-grid-3">
            <div className="ep-input-group">
              <label className="ep-label">Due Date for Submission</label>
              <input
                className="ep-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
            <div className="ep-radio-card ep-radio-card-sm">
              <label className="ep-label">Is PI Regular Faculty?</label>
              <div className="ep-radio-group ep-radio-inline">
                <label className="ep-custom-radio-label">
                  <input
                    type="radio"
                    name="piReg"
                    value="yes"
                    checked={form.isPIRegular === "yes"}
                    onChange={() => setField("isPIRegular", "yes")}
                  />
                  <span className="ep-radio-circle"></span> Yes
                </label>
                <label className="ep-custom-radio-label">
                  <input
                    type="radio"
                    name="piReg"
                    value="no"
                    checked={form.isPIRegular === "no"}
                    onChange={() => setField("isPIRegular", "no")}
                  />
                  <span className="ep-radio-circle"></span> No
                </label>
              </div>
            </div>
            <div className="ep-radio-card ep-radio-card-sm">
              <label className="ep-label">Endorsement Required?</label>
              <div className="ep-radio-group ep-radio-inline">
                <label className="ep-custom-radio-label">
                  <input
                    type="radio"
                    name="endReq"
                    value="yes"
                    checked={form.endorsementRequired === "yes"}
                    onChange={() => setField("endorsementRequired", "yes")}
                  />
                  <span className="ep-radio-circle"></span> Yes
                </label>
                <label className="ep-custom-radio-label">
                  <input
                    type="radio"
                    name="endReq"
                    value="no"
                    checked={form.endorsementRequired === "no"}
                    onChange={() => setField("endorsementRequired", "no")}
                  />
                  <span className="ep-radio-circle"></span> No
                </label>
              </div>
            </div>
          </div>

          <div className="ep-grid-2 ep-mt24">
            <div className="ep-input-group">
              <label className="ep-label">Endorsement Format</label>
              <select
                className="ep-select"
                value={form.endorsementFormat}
                onChange={(e) => setField("endorsementFormat", e.target.value)}
              >
                <option value="">-- Select Format --</option>
                {ENDORSEMENT_FORMATS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="ep-input-group">
              <label className="ep-label">
                Years of Service Left Before Superannuation
              </label>
              <input
                className="ep-input"
                placeholder="e.g. 11"
                readOnly
                value={
                  profile?.superannuation_date
                    ? new Date(profile.superannuation_date).getFullYear() -
                      new Date().getFullYear()
                    : ""
                }
              />
            </div>
          </div>

          <div className="ep-pi-bar">
            <div className="ep-pi-avatar">
              {profile?.staff_name?.charAt(0) || "?"}
            </div>
            <div className="ep-pi-details">
              <div className="ep-pi-name">
                {profile?.staff_name || ""}{" "}
                <span className="ep-pi-role">{form.piRole}</span>
              </div>
              <div className="ep-pi-meta">
                {profile?.designation || ""}, Dept. of{" "}
                {profile?.department || ""}, {profile?.campus || ""}
              </div>
              <div className="ep-pi-stats">
                <span>
                  <i className="ep-icon-dot"></i> DoB:{" "}
                  {formatDate(profile?.dob)}
                </span>
                <span>
                  <i className="ep-icon-dot"></i> Service:{" "}
                  {formatDate(profile?.dos)}
                </span>
                <span>
                  <i className="ep-icon-dot"></i> Superannuation:{" "}
                  {formatDate(profile?.superannuation_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 5: Co-PI Table ═══════════════════════════════════════════ */}
        <div className="ep-card ep-anim-5">
          <div className="ep-card-heading ep-flex-between">
            Co-Principal Investigator (AU Faculty)
            <div className="ep-row-btns-top">
              <button
                className="ep-btn-icon ep-btn-add"
                onClick={addCoPiRow}
                title="Add Row"
              >
                +
              </button>
              <button
                className="ep-btn-icon ep-btn-del"
                onClick={delCoPiRow}
                disabled={coPIs.length <= 1}
                title="Remove Row"
              >
                −
              </button>
            </div>
          </div>
          <div className="ep-table-wrap">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Campus</th>
                  <th>Department</th>
                  <th>Faculty</th>
                  <th>DoB</th>
                  <th>Service</th>
                  <th>Superannuation</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {coPIs.map((row, i) => {
                  return (
                    <tr key={i} className="ep-table-row-anim">
                      {/* CAMPUS */}

                      <td>
                        <select
                          className="ep-select ep-select-sm"
                          value={row.campus}
                          onChange={(e) => {
                            updateCoPI(i, "campus", e.target.value);

                            fetchDepartments(e.target.value);
                          }}
                        >
                          <option value="">Select</option>

                          {campuses.map((c) => (
                            <option key={c.campus} value={c.campus}>
                              {c.campus}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* DEPARTMENT */}

                      <td>
                        <select
                          className="ep-select ep-select-sm"
                          value={row.department}
                          onChange={(e) => {
                            updateCoPI(i, "department", e.target.value);

                            fetchFaculties(row.campus, e.target.value);
                          }}
                          disabled={!row.campus}
                        >
                          <option value="">Select</option>

                          {departments.map((d) => (
                            <option key={d.department} value={d.department}>
                              {d.department}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* FACULTY */}

                      <td>
                        <select
                          className="ep-select ep-select-sm"
                          value={row.facultyId}
                          onChange={(e) =>
                            updateCoPI(i, "facultyId", e.target.value)
                          }
                          disabled={!row.department}
                        >
                          <option value="">Select</option>

                          {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.staff_name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* DOB */}

                      <td>
                        {row.facultyId &&
                          formatDate(
                            faculties.find(
                              (f) => f.id === Number(row.facultyId),
                            )?.dob,
                          )}
                      </td>

                      {/* DOS */}

                      <td>
                        {row.facultyId &&
                          formatDate(
                            faculties.find(
                              (f) => f.id === Number(row.facultyId),
                            )?.dos,
                          )}
                      </td>

                      {/* SUPERANNUATION */}

                      <td>
                        {row.facultyId &&
                          formatDate(
                            faculties.find(
                              (f) => f.id === Number(row.facultyId),
                            )?.superannuation_date,
                          )}
                      </td>

                      {/* ROLE */}

                      <td>
                        <select
                          className="ep-select ep-select-sm"
                          value={row.role}
                          onChange={(e) =>
                            updateCoPI(i, "role", e.target.value)
                          }
                        >
                          <option value="">Select Role</option>

                          {CO_PI_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ SECTION 6: External Investigators ═══════════════════════════════ */}
        <div className="ep-card ep-anim-6">
          <div className="ep-card-heading ep-flex-between">
            External Investigators
            <div className="ep-row-btns-top">
              <button
                className="ep-btn-icon ep-btn-add"
                onClick={addExtRow}
                title="Add Row"
              >
                +
              </button>
              <button
                className="ep-btn-icon ep-btn-del"
                onClick={delExtRow}
                disabled={extInvs.length <= 1}
                title="Remove Row"
              >
                −
              </button>
            </div>
          </div>
          <div className="ep-table-wrap">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Institute</th>
                </tr>
              </thead>
              <tbody>
                {extInvs.map((row, i) => (
                  <tr key={i} className="ep-table-row-anim">
                    <td>
                      <input
                        className="ep-input"
                        placeholder="Dr. John Doe"
                        value={row.name}
                        onChange={(e) =>
                          updateExtInv(i, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="ep-input"
                        placeholder="Senior Scientist"
                        value={row.designation}
                        onChange={(e) =>
                          updateExtInv(i, "designation", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="ep-input"
                        placeholder="IIT Madras"
                        value={row.institute}
                        onChange={(e) =>
                          updateExtInv(i, "institute", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ SECTION 7: Document Uploads ══════════════════════════════════════ */}
        <div className="ep-card ep-anim-7">
          <div className="ep-card-heading">Required Documents</div>
          <div className="ep-upload-grid">
            {[
              ["proposal", "Proposal / Intimation Copy"],
              ["writeup", "Signed One-Page Writeup"],
              ["budget", "Signed Head-wise Budget"],
              ["endorsementFile", "Endorsement Format (Optional)"],
              ["overhead", "Overhead Exemption (Optional)"],
            ].map(([key, label]) => (
              <div key={key} className="ep-upload-row">
                <div className="ep-upload-label-box">
                  <div className="ep-upload-title">{label}</div>
                  <div className="ep-upload-sub">PDF/DOCX format only</div>
                </div>
                <div className="ep-upload-control">
                  <input
                    type="file"
                    className="ep-file-input"
                    onChange={(e) => handleFile(key, e)}
                    id={`file-${key}`}
                  />
                  <label
                    htmlFor={`file-${key}`}
                    className={`ep-file-btn ${files[key] ? "uploaded" : ""}`}
                  >
                    {files[key] ? "Re-upload" : "Choose File"}
                  </label>
                  {files[key] && (
                    <span className="ep-file-badge">✓ {files[key].name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Generate Button ══════════════════════════════════════════════════ */}
        <div className="ep-generate-wrap ep-anim-8">
          <button
            className="ep-btn-generate ep-glow-effect"
            onClick={handleSubmit}
          >
            Submit Endorsement
          </button>

          <button
            className="ep-btn-generate ep-glow-effect"
            disabled={!form.endorsementFormat}
            onClick={() => setShowReport(true)}
          >
            <span>Generate Official Report</span>

            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ REPORT MODAL ═════════════════════════════════════════════════════ */}
      {showReport && (
        <div
          className="ep-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReport(false);
          }}
        >
          <div className="ep-modal">
            <div className="ep-modal-header">
              <h2 className="ep-modal-title">
                {form.endorsementFormat} Endorsement Preview
              </h2>
              <button
                className="ep-btn-close"
                onClick={() => setShowReport(false)}
              >
                ✕
              </button>
            </div>

            <div className="ep-format-bar">
              <button
                className="ep-btn-print"
                onClick={() => generateReportPdf(true)}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print / Download PDF
              </button>
            </div>

            <div className="ep-report-wrap">
              <div ref={reportRef} className="actual-report-container">
                {formatComponents[form.endorsementFormat]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}