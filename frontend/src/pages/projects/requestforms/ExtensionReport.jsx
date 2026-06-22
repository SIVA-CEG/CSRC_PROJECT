// PATH: frontend/src/pages/projects/requestforms/extensionReport.js
// Shared HTML report generator for Project Extension — used by the PI-side
// preview/download AND the office-side View modal so both always render the
// identical document.

export const today = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

export const parseDMY = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

export const formatDMY = (date) => {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

export const formatLong = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

export const toInputDate = (dmyStr) => {
  if (!dmyStr) return "";
  const parts = dmyStr.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export const durationBetween = (startStr, endDate) => {
  const start = parseDMY(startStr);
  if (!start || !endDate) return "";
  let months =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());
  if (endDate.getDate() < start.getDate()) months -= 1;
  if (months <= 0) return "";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years} Year${years > 1 ? "s" : ""}`);
  if (rem > 0) parts.push(`${rem} Month${rem > 1 ? "s" : ""}`);
  return "+" + parts.join(" ");
};

/* Number → Indian words (Lakh/Crore), shared style with Reappropriation */
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
export function numberToIndianWords(num) {
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

/* ─── Report HTML (Without grant / With new grant instalment) ─────────────── */
export function generateExtensionReport(item) {
  const isWith = item.extensionType === "with";

  const grantBlock = isWith
    ? `<p style="margin-top:18px;">
        In conjunction with this extension, the funding agency has released a further sum of
        <strong>Rs.${item.grantAmount || "——"}/- (${item.grantAmountWords || "——"})</strong> for the continuation
        of project activities, credited to A/c No. <strong>${item.bankAccount || "——"}</strong>,
        IFSC <strong>${item.ifscCode || "——"}</strong>, ${item.bankBranch || "——"}.
      </p>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Project Extension Request</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:"Times New Roman",serif;font-size:12px;color:#000;background:#fff;}
.page{width:210mm;min-height:297mm;padding:20mm 22mm;position:relative;}
h2{font-size:14px;text-align:center;font-weight:bold;margin-bottom:2px;}
h3{font-size:12px;text-align:center;font-weight:bold;margin-bottom:12px;}
table{width:100%;border-collapse:collapse;margin:12px 0;}
th,td{border:1px solid #555;padding:6px 10px;font-size:11.5px;vertical-align:top;}
th{background:#f0f0f0;font-weight:bold;text-align:left;}
.info-table td{border:none;padding:4px 6px;vertical-align:top;}
.info-table td:first-child{font-weight:bold;width:230px;white-space:nowrap;}
p{margin:10px 0;text-align:justify;line-height:1.75;font-size:12px;}
.sig-row{display:flex;justify-content:space-between;margin-top:55px;}
.sig-box{text-align:center;width:40%;}
.sig-line{border-top:1px solid #000;padding-top:6px;font-size:11.5px;}
.to-block{margin-top:36px;font-size:12px;line-height:2;text-align:left;}
.print-btn{position:fixed;top:10px;right:10px;padding:9px 20px;background:#1a237e;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;z-index:9999;letter-spacing:.3px;}
@media print{.print-btn{display:none;}}
</style></head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Print / Save PDF</button>
<div class="page">
<h2>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h2>
<h2>ANNA UNIVERSITY, CHENNAI – 600 025</h2>
<h3 style="margin-top:12px;text-decoration:underline;">REQUEST FOR PROJECT EXTENSION</h3>

<table class="info-table" style="border:none;margin-top:4px;">
  <tr><td>Funding Agency</td><td>: ${item.agency || "——"}</td></tr>
  <tr><td>Project Title</td><td>: ${item.projectTitle || "——"}</td></tr>
  <tr><td>Principal Investigator</td><td>: ${item.pi || "——"}</td></tr>
  <tr><td>Department &amp; Campus</td><td>: ${item.department || "——"}</td></tr>
  <tr><td>CTDT Procs. No. &amp; Date</td><td>: ${item.procNo || "——"}</td></tr>
  <tr><td>Date of Sanction</td><td>: ${item.sanctionedDate || "——"}</td></tr>
  <tr><td>Original Project Duration</td><td>: ${item.duration || "——"}</td></tr>
  <tr><td>Original End Date</td><td>: ${item.originalEndDate || "——"}</td></tr>
  <tr><td>Extension Period</td><td>: <strong>${item.extensionPeriod || "——"}</strong></td></tr>
  <tr><td>Proposed Revised End Date</td><td>: <strong>${item.revisedEndDateLong || item.revisedEndDate || "——"}</strong></td></tr>
  <tr><td>Date of Request</td><td>: ${item.submittedOn || today()}</td></tr>
</table>

<p style="margin-top:20px;">
  The Principal Investigator respectfully requests the Director, Centre for Sponsored Research and Consultancy,
  Anna University, Chennai – 600 025, to kindly consider and accord sanction for
  ${isWith ? "an extension with continued grant support" : "a <strong>no-cost extension</strong>"}
  of the above-mentioned project, thereby extending the project completion date from
  <strong>${item.originalEndDate || "——"}</strong> to <strong>${item.revisedEndDateLong || item.revisedEndDate || "——"}</strong>.
</p>

${grantBlock}

${item.reason ? `<h3 style="margin-top:22px;font-size:12px;text-align:left;">Reason for Extension</h3>
<p>${item.reason}</p>` : ""}

<p style="margin-top:20px;">It is certified that:</p>
<ol style="font-size:12px;line-height:2;padding-left:22px;margin-top:6px;">
  <li>${isWith ? "The continued grant amount is utilized strictly for approved project objectives." : "No additional funds are being requested along with this extension."}</li>
  <li>The project objectives remain unchanged.</li>
  <li>The extension is essential to complete all deliverables and submit the final report.</li>
  <li>The funding agency has been / will be duly informed about this extension request.</li>
</ol>

<div class="sig-row">
  <div class="sig-box">
    <div class="sig-line">Signature of Principal Investigator</div>
    <div style="font-size:10.5px;margin-top:5px;">${item.pi || "——"}</div>
    <div style="font-size:10.5px;">${item.department || "——"}</div>
    <div style="font-size:10.5px;margin-top:4px;">Date: ________________</div>
  </div>
  <div class="sig-box">
    <div class="sig-line">Signature of Professor &amp; Head / Dean</div>
    <div style="font-size:10.5px;margin-top:5px;">Date: ________________</div>
  </div>
</div>

<div class="to-block">
  <div><strong>To</strong></div>
  <div>The Director,</div>
  <div>Centre for Sponsored Research and Consultancy,</div>
  <div>Anna University, Chennai – 600 025.</div>
  <div style="margin-top:10px;"><strong>Encl:</strong> Project Extension Request Letter from Funding Agency (if applicable)</div>
  <div style="margin-top:6px;text-align:left;"><strong>Copy to:</strong></div>
  <div style="text-align:left;">1. ${item.pi || "——"}, ${item.department || "——"} – PI</div>
  <div style="text-align:left;">2. CSRC – 3</div>
  <div style="text-align:left;">3. CSRC – 4</div>
</div>
</div></body></html>`;
}