import React, { useState, useRef } from "react";
import "./StaffSalaryClaimsPage.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ─── Sample Data ──────────────────────────────────────────── */
const STAFF_LIST = [
  {
    id: 1,
    name: "J VENKADANATHAN",
    salutation: "Mr",
    initial: "J",
    designation: "Junior Research Fellow",
    mobile: "9751006781",
    email: "vnathan.98@gmail.com",
    joiningOrderNo: "CEG/MECH/SERB PROJECT/BSP/JRF/2023/1, dated 20-06-2023",
    bank: "STATE BANK OF INDIA",
    accountNo: "20162590992",
    ifsc: "SBIN0011071",
    appointmentFrom: "21-12-2022",
    appointmentTo: "30-11-2023",
    salaryPerMonth: 38440,
    fixedSalary: "Rs.31,000/-",
    hra: "Rs.7,440/-",
    projectTitle: "M.H.No.10.1.121—Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2 for metal cutting application",
    fundingAgency: "Science and Engineering Research Board, New Delhi {SERB}",
    projectPeriod: "From 05-12-2020 to 04-12-2023",
    procNo: "2433/CTDT-2/2020, dated 10-12-2020",
    expHead: "Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)",
    department: "Department of Mechanical Engineering, CEG Campus",
    pi: "Dr. S. Balasivanandha Prabu, Professor",
    departmentForSanction: "Department of Mechanical Engineering",
    campus: "CEG Campus",
  },
  {
    id: 2,
    name: "V VETRI VEL",
    salutation: "Mr",
    initial: "V",
    designation: "Junior Research Fellow",
    mobile: "9000000001",
    email: "vetri@gmail.com",
    joiningOrderNo: "CEG/MECH/JRF/2022/5",
    bank: "STATE BANK OF INDIA",
    accountNo: "31000000001",
    ifsc: "SBIN0001234",
    appointmentFrom: "01-07-2022",
    appointmentTo: "30-06-2024",
    salaryPerMonth: 38440,
    fixedSalary: "Rs.31,000/-",
    hra: "Rs.7,440/-",
    projectTitle: "Sample Project B",
    fundingAgency: "DST",
    projectPeriod: "From 01-07-2022 to 30-06-2025",
    procNo: "DST/2022/001",
    expHead: "Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)",
    department: "Department of Mechanical Engineering, CEG Campus",
    pi: "Dr. Sample PI, Professor",
    departmentForSanction: "Department of Mechanical Engineering",
    campus: "CEG Campus",
  },
];

const SAMPLE_CLAIMS = [
  { id: 1, staffId: 1, salaryFrom: "14-05-2023", salaryTo: "20-07-2023", clDays: 0.0, lopDays: 0.0, claimDays: 68, claimAmount: 85560.0, rows: [{ from: "14-05-2023", upto: "31-05-2023", cl: 0.0, lop: 0.0 }, { from: "01-06-2023", upto: "30-06-2023", cl: 0.0, lop: 0.0 }, { from: "01-07-2023", upto: "20-07-2023", cl: 0.0, lop: 0.0 }] },
  { id: 2, staffId: 1, salaryFrom: "01-04-2023", salaryTo: "30-04-2023", clDays: 1.0, lopDays: 0.0, claimDays: 30, claimAmount: 38440.0, rows: [{ from: "01-04-2023", upto: "30-04-2023", cl: 1.0, lop: 0.0 }] },
  { id: 3, staffId: 1, salaryFrom: "01-03-2023", salaryTo: "31-03-2023", clDays: 0.0, lopDays: 0.0, claimDays: 31, claimAmount: 38440.0, rows: [{ from: "01-03-2023", upto: "31-03-2023", cl: 0.0, lop: 0.0 }] },
  { id: 4, staffId: 1, salaryFrom: "01-02-2023", salaryTo: "28-02-2023", clDays: 1.0, lopDays: 0.0, claimDays: 28, claimAmount: 38440.0, rows: [{ from: "01-02-2023", upto: "28-02-2023", cl: 1.0, lop: 0.0 }] },
  { id: 5, staffId: 1, salaryFrom: "01-01-2023", salaryTo: "31-01-2023", clDays: 0.0, lopDays: 0.0, claimDays: 31, claimAmount: 38440.0, rows: [{ from: "01-01-2023", upto: "31-01-2023", cl: 0.0, lop: 0.0 }] },
  { id: 6, staffId: 1, salaryFrom: "21-12-2022", salaryTo: "31-12-2022", clDays: 0.0, lopDays: 0.0, claimDays: 11, claimAmount: 13640.0, rows: [{ from: "21-12-2022", upto: "31-12-2022", cl: 0.0, lop: 0.0 }] },
  { id: 7, staffId: 2, salaryFrom: "01-09-2022", salaryTo: "06-09-2022", clDays: 0.0, lopDays: 0.0, claimDays: 6, claimAmount: 7688.0, rows: [{ from: "01-09-2022", upto: "06-09-2022", cl: 0.0, lop: 0.0 }] },
  { id: 8, staffId: 2, salaryFrom: "01-07-2022", salaryTo: "04-07-2022", clDays: 0.0, lopDays: 0.0, claimDays: 4, claimAmount: 4960.0, rows: [{ from: "01-07-2022", upto: "04-07-2022", cl: 0.0, lop: 0.0 }] },
  { id: 9, staffId: 2, salaryFrom: "01-08-2022", salaryTo: "31-08-2022", clDays: 0.0, lopDays: 0.0, claimDays: 31, claimAmount: 38440.0, rows: [{ from: "01-08-2022", upto: "31-08-2022", cl: 0.0, lop: 0.0 }] },
  { id: 10, staffId: 2, salaryFrom: "05-07-2022", salaryTo: "31-07-2022", clDays: 0.0, lopDays: 0.0, claimDays: 27, claimAmount: 33480.0, rows: [{ from: "05-07-2022", upto: "31-07-2022", cl: 0.0, lop: 0.0 }] },
];

/* ─── Helpers ───────────────────────────────────────────────── */
function parseDateStr(str) {
  if (!str) return null;
  const [d, m, y] = str.split("-");
  return new Date(+y, +m - 1, +d);
}

function daysBetween(from, upto) {
  const a = parseDateStr(from), b = parseDateStr(upto);
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000) + 1;
}

function calcNetSalary(from, upto, salaryPerMonth, cl, lop) {
  const days = daysBetween(from, upto);
  if (!days || !salaryPerMonth) return 0;
  // Calculate based on 30-day month
  const dailyRate = salaryPerMonth / 30;
  const lopAmount = lop * dailyRate;
  return Math.round(dailyRate * days - lopAmount);
}

function toIndianWords(num) {
  const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
    "eighteen", "nineteen"];
  const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function words(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + words(n % 100) : "");
    if (n < 100000) return words(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + words(n % 1000) : "");
    if (n < 10000000) return words(Math.floor(n / 100000)) + " lakh" + (n % 100000 ? " " + words(n % 100000) : "");
    return words(Math.floor(n / 10000000)) + " crore" + (n % 10000000 ? " " + words(n % 10000000) : "");
  }
  if (!num) return "zero";
  const w = words(Math.floor(num));
  return w.charAt(0).toUpperCase() + w.slice(1) + " only";
}

function fmt(n) { return n.toFixed(2); }
function fmtAmt(n) { return n.toLocaleString("en-IN", { minimumFractionDigits: 2 }); }

/* ─── PDF Generation ─────────────────────────────────────────── */
function generateClaimPDF(claim, staff) {
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  const totalClaim = claim.rows.reduce((sum, r) => sum + calcNetSalary(r.from, r.upto, staff.salaryPerMonth, r.cl, r.lop), 0);
  const deductions = 0;

  // Generate leave particulars rows for page 2
  const monthRows = claim.rows.map((r, i) => {
    const d = parseDateStr(r.from);
    const monthYear = d ? d.toLocaleString("en-IN", { month: "long", year: "numeric" }) : "";
    return `<tr><td>${i + 1}</td><td>${monthYear}</td><td>CL</td><td>18</td><td>${r.cl}</td><td>${18 - r.cl}</td></tr>`;
  }).join("");

  // Sanction rows for page 3
  const sanctionRows = claim.rows.map((r, i) => {
    const net = calcNetSalary(r.from, r.upto, staff.salaryPerMonth, r.cl, r.lop);
    return `<tr><td>${i + 1}</td><td>${r.from}</td><td>${r.upto}</td><td>${r.cl}</td><td>${r.lop}</td><td>0</td><td>${fmtAmt(net)}/-</td></tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Salary Claim - ${staff.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Times New Roman", serif; font-size: 11px; background: #fff; color: #000; }
  .page { width: 210mm; min-height: 297mm; padding: 18mm 20mm; page-break-after: always; position: relative; }
  .page:last-child { page-break-after: avoid; }
  h3 { font-size: 12px; text-align: center; font-weight: bold; }
  h4 { font-size: 11px; text-align: center; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
  table, th, td { border: 1px solid #000; }
  th, td { padding: 4px 8px; }
  th { background: #f0f0f0; font-weight: bold; }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .section-label { background: #e0e0e0; font-weight: bold; }
  .no-border td, .no-border th { border: none; }
  .sig-area { display: flex; justify-content: space-between; margin-top: 40px; }
  .sig-box { text-align: center; width: 40%; }
  .office-section { border: 1px solid #000; margin-top: 20px; padding: 10px; }
  .office-row { display: flex; gap: 40px; }
  .office-col { flex: 1; }
  .underline { display: inline-block; border-bottom: 1px solid #000; min-width: 100px; }
  .cert-text { font-size: 10px; margin: 12px 0; }
  .sig-row { display: flex; justify-content: space-between; margin-top: 30px; font-weight: bold; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { page-break-after: always; }
  }
  .print-btn { position: fixed; top: 10px; right: 10px; padding: 8px 16px; background: #1976d2; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; z-index: 9999; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>

<!-- PAGE 1: Claim Form -->
<div class="page">
  <div class="center bold" style="margin-bottom:4px">CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</div>
  <div class="center bold">ANNA UNIVERSITY, CHENNAI 600 025</div>
  <div class="center bold" style="margin:6px 0">REQUEST FOR SALARY CLAIM IN PROJECT FUND</div>
  <div class="center bold">FOR THE PERIOD FROM ${claim.salaryFrom} TO ${claim.salaryTo}</div>
  <div class="right" style="margin-top:8px">Date: <strong>${today}</strong></div>

  <table style="margin-top:12px">
    <tr><td colspan="2" class="section-label bold">PROJECT DETAILS</td></tr>
    <tr><td style="width:35%">Project Title</td><td>${staff.projectTitle}</td></tr>
    <tr><td>Funding Agency</td><td>${staff.fundingAgency}</td></tr>
    <tr><td>Project Period</td><td>${staff.projectPeriod}</td></tr>
    <tr><td>CTDT Procs. No. & Date</td><td>${staff.procNo}</td></tr>
    <tr><td>Exp. Head</td><td>${staff.expHead}</td></tr>
    <tr><td>Department & Campus</td><td>${staff.department}</td></tr>
    <tr><td colspan="2" class="section-label bold">PI DETAILS</td></tr>
    <tr><td>Name</td><td>${staff.pi}</td></tr>
    <tr><td colspan="2" class="section-label bold">CLAIMANT DETAILS</td></tr>
    <tr><td>Name</td><td>${staff.salutation} ${staff.name}, ${staff.designation}</td></tr>
    <tr><td>Mobile/Email</td><td>${staff.mobile} / ${staff.email}</td></tr>
    <tr><td>Tenure Period</td><td>From ${staff.appointmentFrom} To ${staff.appointmentTo}</td></tr>
    <tr><td>Joining Order No.</td><td>${staff.joiningOrderNo}</td></tr>
    <tr><td>Bank Name</td><td>${staff.bank}</td></tr>
    <tr><td>Account Number</td><td>${staff.accountNo}</td></tr>
    <tr><td>IFSC Code</td><td>${staff.ifsc}</td></tr>
    <tr><td>Claiming period</td><td>${claim.salaryFrom} to ${claim.salaryTo}</td></tr>
    <tr><td>Fixed Salary+HRA</td><td>Rs.${fmtAmt(staff.salaryPerMonth)}/- per month [Salary: ${staff.fixedSalary} &amp; HRA: ${staff.hra} ]</td></tr>
    <tr><td>Number of days eligible for claiming salary</td><td>${claim.claimDays}</td></tr>
    <tr><td>Deductions, if any</td><td>Rs.${deductions}/-</td></tr>
    <tr><td>Total Amount claimed</td><td class="bold">Rs.${fmtAmt(totalClaim)}/- (Rupees ${toIndianWords(totalClaim)})</td></tr>
  </table>

  <p class="cert-text">Certified that the claim made in this bill was not drawn by me earlier, if any excess claim is noticed later, I will refund it and also<br>
  Certified that I am not occupying the hostel room.</p>

  <div class="right" style="margin-top:20px">Stamped Acquittance with Signature</div>

  <p class="cert-text" style="margin-top:30px">Certified that the claim is in order and may be admitted.</p>

  <div class="sig-area">
    <div class="sig-box">
      <div>SIGNATURE OF</div>
      <div class="bold">THE PRINCIPAL INVESTIGATOR</div>
    </div>
    <div class="sig-box">
      <div class="bold">PROFESSOR AND HEAD/DEAN</div>
    </div>
  </div>

  <div class="office-section">
    <div class="bold center" style="margin-bottom:8px">FOR CTDT OFFICE ONLY</div>
    <div class="office-row">
      <div class="office-col">
        <div>Entered in Appropriation Register</div>
        <div>Folio No. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> Year 20&nbsp;&nbsp;&nbsp;-20&nbsp;&nbsp;</div>
        <div style="margin-top:6px">Passed for and Pay Rs. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
        <div>Rupees <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
      </div>
      <div class="office-col">
        <div>Voucher No.</div>
        <div>Paid</div>
        <div>Cheque No. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>/Neft. Dt.</div>
        <div>Dated <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> for Rs. <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
      </div>
    </div>
    <div class="sig-row">
      <span>ASST.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DIRECTOR</span>
      <span>ASST.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SUPDT.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DIRECTOR</span>
    </div>
  </div>
</div>

<!-- PAGE 2: Leave Particulars -->
<div class="page">
  <div class="center bold" style="margin-bottom:8px">LEAVE PARTICULARS</div>
  <div>CTDT Procs. No. ${staff.procNo}</div>
  <div style="margin:6px 0">Name with Designation: &nbsp;&nbsp;<strong>${staff.salutation} ${staff.name}, ${staff.designation}</strong></div>
  <div>Tenure period: &nbsp;&nbsp;<strong>From ${staff.appointmentFrom} To ${staff.appointmentTo}</strong> &nbsp;&nbsp; Eligible Total CL Days: 18 days</div>

  <table style="margin-top:12px">
    <thead>
      <tr>
        <th>Sl.No.</th>
        <th>Month &amp; Year</th>
        <th>Leave Type (CL/LOP)</th>
        <th>Eligible Days</th>
        <th>Availed</th>
        <th>Balance CL</th>
      </tr>
    </thead>
    <tbody>
      ${monthRows}
    </tbody>
  </table>

  <p class="cert-text" style="margin-top:20px">Certified that the leave is granted as per leave eligibility maintained in the leave register.</p>

  <div class="sig-area" style="margin-top:60px">
    <div class="sig-box">
      <div>SIGNATURE OF</div>
      <div class="bold">THE PRINCIPAL INVESTIGATOR</div>
    </div>
    <div class="sig-box">
      <div class="bold">PROFESSOR AND HEAD/DEAN</div>
    </div>
  </div>
</div>

<!-- PAGE 3: Sanction Letter -->
<div class="page">
  <div class="center bold">DEPARTMENT OF MECHANICAL ENGINEERING</div>
  <div class="center bold">CEG CAMPUS,</div>
  <div class="center bold">ANNA UNIVERSITY, CHENNAI-600 025.</div>
  <div style="display:flex; justify-content:space-between; margin:12px 0">
    <div>PROCEEDINGS NO: ${staff.procNo}</div>
    <div>Dated: <strong>${today}</strong></div>
  </div>
  <table class="no-border" style="margin-bottom:8px">
    <tr>
      <td style="width:60px; vertical-align:top;">SUB:</td>
      <td>R&amp;D Project – <strong>${staff.projectTitle}</strong> - Sanction - Accorded</td>
    </tr>
    <tr>
      <td style="vertical-align:top;">REF:</td>
      <td>Salary Claim bill, enclosed.</td>
    </tr>
  </table>
  <div class="center bold">*****</div>

  <p style="margin:14px 0; text-align:justify">
    Sanction is hereby accorded for the payment of <strong>Rs.${fmtAmt(totalClaim)}/- (Rupees ${toIndianWords(totalClaim)})</strong> to Project staff towards salary for the period from <strong>${claim.salaryFrom} to ${claim.salaryTo}</strong> in connection with above mentioned project as detailed below:
  </p>

  <table>
    <thead>
      <tr>
        <th>Sl.No.</th>
        <th>Period From</th>
        <th>Period To</th>
        <th>CL Days</th>
        <th>LOP Days</th>
        <th>LOP Amount (Rs.)</th>
        <th>Net Salary (Rs.)</th>
      </tr>
    </thead>
    <tbody>
      ${sanctionRows}
      <tr>
        <td colspan="6" class="right bold">TOTAL CLAIM</td>
        <td class="bold">${fmtAmt(totalClaim)}/-</td>
      </tr>
    </tbody>
  </table>

  <p style="margin-top:14px">The payment may be made to <strong>${staff.salutation} ${staff.name}, ${staff.designation}</strong></p>

  <p style="margin-top:12px; text-align:justify">
    The expenditure is debitable under the Project on <strong>${staff.projectTitle}</strong> under the heads <strong>${staff.expHead}</strong>. Necessary entry has been made in the Project Sanction Register vide Page No. _______ Sl. No. _______.
  </p>

  <div class="right bold" style="margin-top:30px">PROFESSOR AND HEAD</div>

  <div style="margin-top:20px">
    <div>To</div>
    <div>${staff.pi}</div>
    <div>${staff.departmentForSanction}</div>
    <div>${staff.campus}, Anna University</div>
    <br/>
    <div class="bold">Copt to:</div>
    <div>Bill / Stock file</div>
  </div>
</div>

</body>
</html>`;
  return html;
}

/* ─── Main Component ────────────────────────────────────────── */
export default function StaffSalaryClaimsPage() {
  const [claims, setClaims] = useState(SAMPLE_CLAIMS);
  const [view, setView] = useState("list"); // list | new | edit | report
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [nextId, setNextId] = useState(SAMPLE_CLAIMS.length + 1);

  // New claim state
  const [newStaff, setNewStaff] = useState(null);
  const [newStaffSearch, setNewStaffSearch] = useState("");
  const [newRows, setNewRows] = useState([{ from: "", upto: "", cl: "", lop: "" }]);
  const [staffDropOpen, setStaffDropOpen] = useState(false);

  const reportRef = useRef();

  const getStaff = (id) => STAFF_LIST.find((s) => s.id === id);

  /* ── List View ── */
  if (view === "list") {
    return (
      <div className="ssc-page">
        <div className="ssc-header">
          <h2>CSRC Staff Salary claims</h2>
          <div className="ssc-breadcrumb"><span className="ssc-bc-link">Master</span> / Staff Salary Claims</div>
        </div>

        <div className="ssc-table-card">
          <table className="ssc-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Salary From</th>
                <th>Salary To</th>
                <th>No. CL</th>
                <th>No. LOP</th>
                <th>Claim Days</th>
                <th>Claim Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c, i) => {
                const staff = getStaff(c.staffId);
                return (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{staff?.name}</td>
                    <td>{staff?.designation}</td>
                    <td>{c.salaryFrom}</td>
                    <td>{c.salaryTo}</td>
                    <td>{fmt(c.clDays)}</td>
                    <td>{fmt(c.lopDays)}</td>
                    <td>{c.claimDays}</td>
                    <td className="ssc-amount">{fmtAmt(c.claimAmount)}</td>
                    <td className="ssc-actions">
                      <button className="ssc-action-btn ssc-edit" title="Edit" onClick={() => { setSelectedClaim(c); setView("edit"); }}>✏️</button>
                      <button className="ssc-action-btn ssc-view" title="View Report" onClick={() => { setSelectedClaim(c); setView("report"); }}>👁</button>
                      <button className="ssc-action-btn ssc-redo" title="Redo" onClick={() => {
                        if (window.confirm("Reset this claim to be re-entered?")) {
                          setClaims(claims.filter((x) => x.id !== c.id));
                        }
                      }}>↺</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Sl. No.</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Salary From</th>
                <th>Salary To</th>
                <th>No. CL</th>
                <th>No. LOP</th>
                <th>Claim Days</th>
                <th>Claim Amount</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="ssc-list-footer">
          <div className="ssc-pagination">
            <button>First</button>
            <button>Prev</button>
            <span>1 of {claims.length} records</span>
            <button>Next</button>
            <button>Last</button>
          </div>
          <button className="ssc-btn ssc-btn-new" onClick={() => { setNewStaff(null); setNewRows([{ from: "", upto: "", cl: "", lop: "" }]); setView("new"); }}>New Salary Claim</button>
        </div>
      </div>
    );
  }

  /* ── Report View (PDF) ── */
  if (view === "report" && selectedClaim) {
    const staff = getStaff(selectedClaim.staffId);
    const html = generateClaimPDF(selectedClaim, staff);

    const createPdf = async (mode) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  temp.style.top = "0";
  temp.style.width = "210mm";
  document.body.appendChild(temp);

  const pages = temp.querySelectorAll(".page");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = 210;
  const pdfHeight = 297;

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
  }

  document.body.removeChild(temp);

  const fileName = `claim_${staff.name.replace(/\s/g, "_")}_${selectedClaim.salaryFrom.replace(/-/g, "")}.pdf`;

  if (mode === "preview") {
    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  } else {
    pdf.save(fileName);
  }
};

const handlePreviewPdf = () => {
  createPdf("preview");
};

const handleDownloadPdf = () => {
  createPdf("download");
};

    return (
      <div className="ssc-page">
        <div className="ssc-header">
          <h2>Salary Claim Report — {staff.name}</h2>
          <div className="ssc-breadcrumb"><span className="ssc-bc-link">Master</span> / Staff Salary Claims / Report</div>
        </div>
        <div className="ssc-report-actions">
          <button className="ssc-btn ssc-btn-primary" onClick={handlePreviewPdf}>👁 Preview PDF</button>
<button className="ssc-btn ssc-btn-outline" onClick={handleDownloadPdf}>⬇ Download PDF</button>
          <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>← Back</button>
        </div>
        <div className="ssc-report-preview">
          <iframe
            srcDoc={html}
            title="Salary Claim Report"
            className="ssc-iframe"
          />
        </div>
      </div>
    );
  }

  /* ── Edit View ── */
  if (view === "edit" && selectedClaim) {
    const staff = getStaff(selectedClaim.staffId);
    const editRows = selectedClaim.rows;

    const handleUpdate = () => {
      const totalDays = editRows.reduce((s, r) => s + daysBetween(r.from, r.upto), 0);
      const totalCL = editRows.reduce((s, r) => s + (parseFloat(r.cl) || 0), 0);
      const totalLOP = editRows.reduce((s, r) => s + (parseFloat(r.lop) || 0), 0);
      const totalAmt = editRows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, staff.salaryPerMonth, parseFloat(r.cl) || 0, parseFloat(r.lop) || 0), 0);
      const updated = {
        ...selectedClaim,
        salaryFrom: editRows[0]?.from || selectedClaim.salaryFrom,
        salaryTo: editRows[editRows.length - 1]?.upto || selectedClaim.salaryTo,
        clDays: totalCL,
        lopDays: totalLOP,
        claimDays: totalDays,
        claimAmount: totalAmt,
        rows: editRows,
      };
      setClaims(claims.map((c) => (c.id === selectedClaim.id ? updated : c)));
      setView("list");
    };

    return (
      <div className="ssc-page">
        <div className="ssc-header">
          <h2>Salary Claim</h2>
          <div className="ssc-breadcrumb"><span className="ssc-bc-link">Master</span> / Salary Claim</div>
        </div>
        <div className="ssc-form-card">
          <div className="ssc-form-subtitle">Claim details editing....</div>
          <div className="ssc-staff-info-row">
            <div className="ssc-field">
              <label>Staff Name</label>
              <div className="ssc-static-select">{staff.salutation} {staff.name}</div>
            </div>
            <div className="ssc-info-block">
              <div><strong>Appointment Order from :</strong> {staff.appointmentFrom} <strong>upto :</strong> {staff.appointmentTo}</div>
              <div><strong>Salary claimed upto :</strong> {selectedClaim.salaryTo}</div>
              <div><strong>Total CL availed as on :</strong> {selectedClaim.clDays}</div>
            </div>
          </div>

          <table className="ssc-rows-table">
            <thead>
              <tr>
                <th>Claim from</th>
                <th>Upto</th>
                <th>CL</th>
                <th>LOP</th>
              </tr>
            </thead>
            <tbody>
              {editRows.map((row, i) => (
                <tr key={i}>
                  <td><input type="text" className="ssc-input" value={row.from}
                    onChange={(e) => { const r = [...editRows]; r[i] = { ...r[i], from: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="text" className="ssc-input" value={row.upto}
                    onChange={(e) => { const r = [...editRows]; r[i] = { ...r[i], upto: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="number" step="0.1" className="ssc-input" value={row.cl}
                    onChange={(e) => { const r = [...editRows]; r[i] = { ...r[i], cl: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                  <td><input type="number" step="0.1" className="ssc-input" value={row.lop}
                    onChange={(e) => { const r = [...editRows]; r[i] = { ...r[i], lop: e.target.value }; setSelectedClaim({ ...selectedClaim, rows: r }); }} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ssc-form-btns">
            <button className="ssc-btn ssc-btn-primary" onClick={handleUpdate}>Update</button>
          </div>
        </div>
        <div className="ssc-form-footer">
          <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>Back</button>
        </div>
      </div>
    );
  }

  /* ── New Claim View ── */
  if (view === "new") {
    const filteredStaff = STAFF_LIST.filter((s) =>
      s.name.toLowerCase().includes(newStaffSearch.toLowerCase())
    );

    const handleFind = () => {
      if (!newStaff) return alert("Please select a staff member.");
    };

    const handleAdd = () => {
      if (!newStaff) return alert("Please select a staff member first.");
      for (const r of newRows) {
        if (!r.from || !r.upto) return alert("Please fill all Claim from and Upto dates.");
      }
      const totalDays = newRows.reduce((s, r) => s + daysBetween(r.from, r.upto), 0);
      const totalCL = newRows.reduce((s, r) => s + (parseFloat(r.cl) || 0), 0);
      const totalLOP = newRows.reduce((s, r) => s + (parseFloat(r.lop) || 0), 0);
      const totalAmt = newRows.reduce((s, r) => s + calcNetSalary(r.from, r.upto, newStaff.salaryPerMonth, parseFloat(r.cl) || 0, parseFloat(r.lop) || 0), 0);
      const claim = {
        id: nextId,
        staffId: newStaff.id,
        salaryFrom: newRows[0].from,
        salaryTo: newRows[newRows.length - 1].upto,
        clDays: totalCL,
        lopDays: totalLOP,
        claimDays: totalDays,
        claimAmount: totalAmt,
        rows: newRows.map((r) => ({ from: r.from, upto: r.upto, cl: parseFloat(r.cl) || 0, lop: parseFloat(r.lop) || 0 })),
      };
      setClaims([...claims, claim]);
      setNextId(nextId + 1);
      setView("list");
    };

    const addRow = () => setNewRows([...newRows, { from: "", upto: "", cl: "", lop: "" }]);
    const deleteRow = () => { if (newRows.length > 1) setNewRows(newRows.slice(0, -1)); };
    const setRow = (i, k, v) => { const r = [...newRows]; r[i] = { ...r[i], [k]: v }; setNewRows(r); };

    // find last claimed salary date for this staff
    const lastClaim = claims.filter((c) => c.staffId === newStaff?.id).sort((a, b) => b.id - a.id)[0];

    return (
      <div className="ssc-page">
        <div className="ssc-header">
          <h2>Salary Claim</h2>
          <div className="ssc-breadcrumb"><span className="ssc-bc-link">Master</span> / Salary Claim</div>
        </div>
        <div className="ssc-form-card">
          <div className="ssc-form-subtitle">Claim details adding....</div>

          <div className="ssc-find-row">
            <div className="ssc-field">
              <label>Staff Name</label>
              <div className="ssc-ss-wrap">
                <div className="ssc-ss-trigger" onClick={() => setStaffDropOpen(!staffDropOpen)}>
                  <span className={newStaff ? "" : "ssc-placeholder"}>{newStaff ? `${newStaff.salutation} ${newStaff.name}` : "--Select--"}</span>
                  <span>▾</span>
                </div>
                {staffDropOpen && (
                  <div className="ssc-ss-dropdown">
                    <input className="ssc-ss-search" placeholder="Search..." value={newStaffSearch}
                      onChange={(e) => setNewStaffSearch(e.target.value)} autoFocus />
                    <div className={`ssc-ss-option ${!newStaff ? "ssc-ss-selected" : ""}`}
                      onClick={() => { setNewStaff(null); setStaffDropOpen(false); }}>--Select--</div>
                    {filteredStaff.map((s) => (
                      <div key={s.id} className={`ssc-ss-option ${newStaff?.id === s.id ? "ssc-ss-selected" : ""}`}
                        onClick={() => { setNewStaff(s); setStaffDropOpen(false); setNewStaffSearch(""); }}>
                        {s.salutation} {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className="ssc-btn ssc-btn-find" onClick={handleFind}>Find</button>
          </div>

          {newStaff && (
            <>
              <div className="ssc-info-block" style={{ margin: "12px 0" }}>
                <div><strong>Appointment Order from :</strong> {newStaff.appointmentFrom} <strong>upto :</strong> {newStaff.appointmentTo}</div>
                <div><strong>Salary claimed upto :</strong> {lastClaim?.salaryTo || "Not claimed yet"}</div>
                <div><strong>Total CL availed as on :</strong> {claims.filter((c) => c.staffId === newStaff.id).reduce((s, c) => s + c.clDays, 0)}</div>
              </div>

              <table className="ssc-rows-table ssc-rows-table-new">
                <thead>
                  <tr>
                    <th style={{ color: "#1976d2" }}>Claim from</th>
                    <th style={{ color: "#1976d2" }}>Upto</th>
                    <th style={{ color: "#1976d2" }}>CL</th>
                    <th style={{ color: "#1976d2" }}>LOP</th>
                  </tr>
                </thead>
                <tbody>
                  {newRows.map((row, i) => (
                    <tr key={i}>
                      <td><input type="date" className="ssc-input" value={row.from ? row.from.split("-").reverse().join("-") : ""}
                        onChange={(e) => { const parts = e.target.value.split("-"); setRow(i, "from", parts.reverse().join("-")); }} /></td>
                      <td><input type="date" className="ssc-input" value={row.upto ? row.upto.split("-").reverse().join("-") : ""}
                        onChange={(e) => { const parts = e.target.value.split("-"); setRow(i, "upto", parts.reverse().join("-")); }} /></td>
                      <td><input type="number" step="0.1" placeholder="No. of CL" className="ssc-input" value={row.cl}
                        onChange={(e) => setRow(i, "cl", e.target.value)} /></td>
                      <td><input type="number" step="0.1" placeholder="No. of LOP" className="ssc-input" value={row.lop}
                        onChange={(e) => setRow(i, "lop", e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ssc-row-actions">
                <button className="ssc-btn ssc-btn-outline" onClick={addRow}>Add Row</button>
                <button className="ssc-btn ssc-btn-outline" onClick={deleteRow}>Delete Row</button>
              </div>

              <div className="ssc-form-btns">
                <button className="ssc-btn ssc-btn-primary" onClick={handleAdd}>Add</button>
              </div>
            </>
          )}
        </div>
        <div className="ssc-form-footer">
          <button className="ssc-btn ssc-btn-back" onClick={() => setView("list")}>Back</button>
        </div>
      </div>
    );
  }

  return null;
}