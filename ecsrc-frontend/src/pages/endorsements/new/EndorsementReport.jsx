// ─── REPLACE THESE WITH YOUR ACTUAL IMAGE PATHS OR URLS ───────────────────────
export const AU_LOGO_PLACEHOLDER = "src/assets/anna-university-logo.png";
export const CSRC_LOGO_PLACEHOLDER = "src/assets/csrc-logo.png";
export const DIRECTOR_SIGNATURE_PLACEHOLDER = "src/assets/green-sign.png";
// ─────────────────────────────────────────────────────────────────────────────

function LogoHeader({ directorName }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      {/* Top Row: Logos and Main Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* AU Logo - Left */}
        <div style={{ flex: "0 0 90px", display: "flex", justifyContent: "flex-start" }}>
          {AU_LOGO_PLACEHOLDER ? (
            <img src={AU_LOGO_PLACEHOLDER} alt="Anna University" style={{ width: 60, height: 60, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 60, height: 60, border: "1px solid #aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, textAlign: "center", color: "#666" }}>AU Logo</div>
          )}
        </div>

        {/* Center Text */}
        <div style={{ flex: "1", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10px" }}>
          <div style={{ fontWeight: "bold", fontSize: "15pt", color: "#222", marginBottom: "4px", whiteSpace: "nowrap" }}>
            Centre for Sponsored Research and Consultancy
          </div>
          <div style={{ fontSize: "10pt", color: "#444", marginBottom: "6px", whiteSpace: "nowrap" }}>
            (Formerly Centre for Technology Development and Transfer)
          </div>
          <div style={{ fontSize: "13pt", fontWeight: "bold", color: "#222" }}>
            Anna University, Chennai 600 025.
          </div>
        </div>

        {/* CSRC Logo - Right */}
        <div style={{ flex: "0 0 90px", display: "flex", justifyContent: "flex-end" }}>
          {CSRC_LOGO_PLACEHOLDER ? (
            <img src={CSRC_LOGO_PLACEHOLDER} alt="CSRC" style={{ width: 60, height: 60, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 60, height: 60, border: "1px solid #aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, textAlign: "center", color: "#666" }}>CSRC Logo</div>
          )}
        </div>
      </div>

      {/* Bottom Row: Director Name (Left Aligned) */}
      <div style={{ marginTop: "10px", textAlign: "left" }}>
        <div style={{ fontSize: "11pt", fontWeight: "bold", color: "#222", marginBottom: "2px" }}>
          {directorName || "Dr. S. BALASIVANANDHA PRABU"}
        </div>
        <div style={{ fontSize: "10pt", fontWeight: "bold", color: "#444" }}>
          PROFESSOR AND DIRECTOR
        </div>
      </div>

      {/* Horizontal Divider exactly like the official document */}
      <hr style={{ border: "none", borderTop: "1px solid #888", marginTop: "5px", marginBottom: "0" }} />
    </div>
  );
}

// ─── Shared wrapper mapped perfectly to A4 ─────────────────────────────────────
export function ReportWrapper({ form, children }) {
  const today = new Date()
    .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, "-");

  return (
    <div
      className="a4-container"
      style={{
        background: "#fff",
        color: "#000",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        fontSize: "11pt",
        width: "210mm",
        minHeight: "297mm",
        padding: "18mm 15mm",
        margin: "0 15",
        lineHeight: 1.3,
        boxSizing: "border-box",
        position: "relative",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <LogoHeader directorName={form.directorName} />

      {/* Main Content Body */}
      <div style={{ flex: 1 }}>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "12pt", letterSpacing: "0.5px", margin: "20px 0", textDecoration: "underline" }}>
          ENDORSEMENT
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontWeight: "bold" }}>
          <span>Ref.No.{form.refNo || "XXXX/CSRC-2"}</span>
          <span>Date: {today}</span>
        </div>

        {/* Replicated the hanging indent format for the Project Title */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 10px", marginBottom: "20px" }}>
          <div style={{ display: "flex", width: "90%" }}>
            <div style={{ fontWeight: "bold", marginRight: "8px", whiteSpace: "nowrap" }}>Project Title:</div>
            <div style={{ fontWeight: "bold", textAlign: "justify" }}>"{form.title || "[Project Title]"}"</div>
          </div>
        </div>

        <div style={{ textAlign: "justify" }}>
          {children}
        </div>
        
      </div>

      {/* Bottom Footer block - Locked to same horizontal alignment */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px", marginBottom: "40px" }}>
        {/* Date and Place - Bottom Left */}
        <div style={{ fontWeight: "bold", fontSize: "11pt", lineHeight: "1.8" }}>
          <div style={{ display: "flex" }}>
            <span style={{ width: "60px" }}>Date:</span>
            <span>{today}</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ width: "60px" }}>Place:</span>
            <span>Chennai-25.</span>
          </div>
        </div>

        {/* Signature Block - Bottom Right */}
        <div style={{ textAlign: "center", width: "160px" }}>
          {DIRECTOR_SIGNATURE_PLACEHOLDER ? (
            <img src={DIRECTOR_SIGNATURE_PLACEHOLDER} alt="Signature" style={{ width: "100%", height: "auto", maxHeight: "60px", objectFit: "contain", marginBottom: "5px" }} />
          ) : (
            <div style={{ height: "60px", width: "100%", marginBottom: "5px" }}></div> 
          )}
          <div style={{ fontWeight: "bold", fontSize: "11pt" }}>DIRECTOR</div>
        </div>
      </div>

      {/* Page Absolute Footer */}
      <div style={{
        borderTop: "1px solid #aaa", paddingTop: "5px",
        fontSize: "8pt", color: "#55", textAlign: "center", fontStyle: "italic",
        marginTop: "auto"
      }}>
        CSRC, Kalanjiyam Building, III Floor, Ph: +91 -44 -2235 7929/7930; e-mail:- directorctdt@gmail.com, directorctdt@annauniv.edu
      </div>
    </div>
  );
}

// ─── CSRC Format ───────────────────────────────────────────────────────────────
export function CSRCReport({ form }) {
  const pi      = form.piName      || "The Principal Investigator";
  const piDesig = form.piDesignation || "Professor";
  const piDept  = form.piDept      || "Department";
  const piCampus= form.piCampus    || "CEG Campus";
  const yrs     = form.yearsService|| "__";
  const agency  = form.fundingAgency || "[Funding Agency]";

  return (
    <ReportWrapper form={form}>
      <div style={{ marginBottom: "10px" }}>This is to certify that:</div>
      <ol style={{ paddingLeft: "0", margin: "0", listStylePosition: "outside", marginLeft: "25px", textAlign: "justify" }}>
        <li style={{ marginBottom: "10px" }}>
          The University welcomes the participation <b>{pi}, {piDesig}, {piDept}, {piCampus}</b> as Principal Investigator will assume the responsibility of the fruitful completion of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The PI, <b>{pi}</b>, is a permanent / regular employee of this University and has <b><u>&nbsp;{yrs}&nbsp;</u></b> years of regular service left before superannuation.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The PI will assume full responsibility of implementing the project as PI as per the proposed objective, deliverable and timeline. The PI will also take the primary responsibility of submitting the progress report, utilization certificate, and statement of expenditure as stipulated by <b>{agency}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The project starts from the date on which the University receives the grant from <b>{agency}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The grant by the <b>{agency}</b> will be used to meet the expenditure on the project and for the period for which the project has been sanctioned as mentioned in the sanction order.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University will provide basic infrastructure and other required facilities to the investigator for undertaking the research project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University assumes to undertake the financial and other management responsibilities of the project.
        </li>
      </ol>
    </ReportWrapper>
  );
}

// ─── CMRG Format ──────────────────────────────────────────────────────────────
export function CMRGReport({ form }) {
  const pi       = form.piName      || "The Principal Investigator";
  const piDesig  = form.piDesignation || "Professor";
  const piDept   = form.piDept      || "Department";
  const piCampus = form.piCampus    || "CEG Campus";
  
  // Resolve Co-PI (Check External first, then Internal)
  let copiName = "Co-Investigator";
  let copiDesig = "Professor";

  if (form.extInvs && form.extInvs[0] && form.extInvs[0].name) {
    copiName = form.extInvs[0].name;
    copiDesig = form.extInvs[0].designation || "Professor";
  } else if (form.coPIs && form.coPIs[0] && form.coPIs[0].faculty) {
    copiName = form.coPIs[0].faculty;
    copiDesig = form.coPIs[0].role || "Professor";
  }

  //const agency   = form.fundingAgency || "CMRG";

  return (
    <ReportWrapper form={form}>
      <div style={{ marginBottom: "10px" }}>This is to certify that:</div>
      <ol style={{ paddingLeft: "0", margin: "0", listStylePosition: "outside", marginLeft: "25px", textAlign: "justify" }}>
        <li style={{ marginBottom: "10px" }}>
          Certified that the University welcomes participation of <b>{pi}, {piDesig}, {piDept}, {piCampus}</b> as Principal Investigator and <b>{copiName}, {copiDesig}</b> as Co-Investigator(s) of the project mentioned above. The Co-Investigator will assume the responsibility of the fruitful completion of the project if the Principal Investigator is unable to do (with due intimation to CMRG office).
        </li>
        <li style={{ marginBottom: "10px" }}>
          Certified that the equipments, software other basic facilities and such other administrative support required as per terms and conditions of the grant, will be extended to the investigator(s) throughout the duration of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          University will undertake the financial and other management responsibilities of the project and will ensure compliance with the terms and conditions laid down, in case the project is sanctioned.
        </li>
        <li style={{ marginBottom: "10px" }}>
          University agrees to indemnify the CMRG office against any legal action or liability of any kind that may arise in connection with the undertaking of the project.
        </li>
      </ol>
    </ReportWrapper>
  );
}

// ─── DST Format ───────────────────────────────────────────────────────────────
export function DSTReport({ form }) {
  const pi       = form.piName      || "The Principal Investigator";
  const piDesig  = form.piDesignation || "Professor";
  const piDept   = form.piDept      || "Department";
  const piCampus = form.piCampus    || "CEG Campus";
  
  // FIX: Robust logic to resolve Co-PI (Handles External Investigators perfectly now)
  let copiName = "Co-Investigator";
  let copiDesig = "Professor";
  let copiInst = "Institute";

  if (form.extInvs && form.extInvs[0] && form.extInvs[0].name) {
    // If there is an external investigator listed (e.g., from VIT)
    copiName = form.extInvs[0].name;
    copiDesig = form.extInvs[0].designation || "Professor";
    copiInst = form.extInvs[0].institute || "Institute";
  } else if (form.coPIs && form.coPIs[0] && form.coPIs[0].faculty) {
    // Fallback to internal Anna University Co-PI
    copiName = form.coPIs[0].faculty;
    copiDesig = form.coPIs[0].role || "Professor";
    copiInst = form.coPIs[0].department ? `Dept. of ${form.coPIs[0].department}, ${form.coPIs[0].campus}` : (form.coPIs[0].campus || "Anna University");
  }

  const yrs      = form.yearsService|| "__";
  const agency   = form.fundingAgency || "Department of Science and Technology - (DST)";

  return (
    <ReportWrapper form={form}>
      <div style={{ marginBottom: "10px" }}>This is to certify that:</div>
      <ol style={{ paddingLeft: "0", margin: "0", listStylePosition: "outside", marginLeft: "25px", textAlign: "justify" }}>
        <li style={{ marginBottom: "10px" }}>
          The University welcomes the participation <b>{pi}, {piDesig}, {piDept}, {piCampus}</b> as Principal Investigator and <b>{copiName}, {copiDesig}, {copiInst}</b> as Co-Investigator(s) will assume the responsibility of the fruitful completion of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The PI, <b>{pi}</b>, is a permanent / regular employee of this University and has <b><u>&nbsp;{yrs}&nbsp;</u></b> years of regular service left before superannuation.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The PI will assume full responsibility of implementing the project as PI as per the proposed objective, deliverable and timeline. The PI will also take the primary responsibility of submitting the progress report, utilization certificate, and statement of expenditure as stipulated by <b>{agency}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The project starts from the date on which the University receives the grant from <b>{agency}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The grant by the <b>{agency}</b> will be used to meet the expenditure on the project and for the period for which the project has been sanctioned as mentioned in the sanction order.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University will provide basic infrastructure and other required facilities to the investigator for undertaking the research project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University assumes to undertake the financial and other management responsibilities of the project.
        </li>
      </ol>
    </ReportWrapper>
  );
}

// ─── ANRF Format ──────────────────────────────────────────────────────────────
export function ANRFReport({ form }) {
  const pi       = form.piName   || "The Principal Investigator";
  const piDesig  = form.piDesignation || "Professor";
  const piDept   = form.piDept   || "Department";
  const piCampus = form.piCampus || "CEG Campus";
  const FA       = "Anusandhan National Research Foundation";

  return (
    <ReportWrapper form={form}>
      <div style={{ marginBottom: "10px" }}>This is to certify that:</div>
      <ol style={{ paddingLeft: "0", margin: "0", listStylePosition: "outside", marginLeft: "25px", textAlign: "justify" }}>
        <li style={{ marginBottom: "10px" }}>
          The University welcomes the participation <b>{pi}, {piDesig}, {piDept}, {piCampus}</b> as Principal Investigator and that in the unforeseen event of discontinuance by the Principal Investigator, the Co-Investigator will assume the responsibility of the fruitful completion of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The PI, <b>{pi}</b>, is an employee of this University.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The project starts from the date on which the University receives the grant from <b>{FA}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The investigator will be governed by the rules and regulations of University and will be under administrative control of the University for the duration of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The grant-in-aid by the <b>{FA}</b> will be used to meet the expenditure on the project and for the period for which the project has been sanctioned as mentioned in the sanction order.
        </li>
        <li style={{ marginBottom: "10px" }}>
          No administrative or other liability will be attached to <b>{FA}</b> at the end of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University will provide basic infrastructure and other required facilities to the investigator for undertaking the research project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University will take into its books all assets created in the above project and its disposal would be at the discretion of <b>{FA}</b>.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University assumes to undertake the financial and other management responsibilities of the project.
        </li>
      </ol>
    </ReportWrapper>
  );
}

// ─── New Format (generic / editable) ─────────────────────────────────────────
export function NewFormatReport({ form }) {
  return (
    <ReportWrapper form={form}>
      <div style={{ marginBottom: "10px" }}>This is to certify that:</div>
      <ol style={{ paddingLeft: "0", margin: "0", listStylePosition: "outside", marginLeft: "25px", textAlign: "justify" }}>
        <li style={{ marginBottom: "10px" }}>
          The University welcomes the participation of <b>{form.piName || "Principal Investigator"}</b> for the above-mentioned project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University extends its full administrative and financial support for the duration of the project.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University will ensure compliance with all terms and conditions of the funding agency.
        </li>
        <li style={{ marginBottom: "10px" }}>
          The University assumes management responsibility for all aspects of the project.
        </li>
      </ol>
      <div style={{ marginTop: "30px", padding: "15px", border: "1px dashed #aaa", borderRadius: "4px", fontSize: "11pt", color: "#666" }}>
        [Additional clauses for this funding agency can be added here. Contact CSRC for specific format requirements.]
      </div>
    </ReportWrapper>
  );
}