import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../SlipPages.css";

const projects = [
  {
    id: "CMRG001",
    title: "AI Based Research Project",
    pi: "Dr. Kumar",
    department: "IT",
    sanctionedAmount: 500000,
  },
  {
    id: "CMRG002",
    title: "IoT Smart Monitoring System",
    pi: "Dr. Priya",
    department: "CSE",
    sanctionedAmount: 350000,
  },
];

const heads = [
  {
    section: "A",
    title: "Non-Recurring Heads",
    options: ["Equipment 1", "Equipment 2", "Equipment 3"],
  },
  {
    section: "B",
    title: "Recurring Heads",
    options: ["Manpower", "Consumables & Accessories", "Travel", "Contingency"],
  },
];

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function refNo(pid, idx) {
  return `${pid}-CLM${String(idx).padStart(3, "0")}`;
}

function today() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CMRGSlipPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [claimData, setClaimData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [billsStore, setBillsStore] = useState({});
  const [settledProject, setSettledProject] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const handleChange = (head, field, value) => {
    setClaimData((prev) => ({
      ...prev,
      [head]: {
        ...prev[head],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!selectedProject) return;

    const pid = selectedProject.id;
    const existingClaims = billsStore[pid] || [];
    const newClaims = [];

    heads.forEach((group) => {
      const data = claimData[group.title];

      if (data?.selectedHead && data?.amount) {
        const idx = existingClaims.length + newClaims.length + 1;
        let fileURL = null;

        if (data.bill) {
          fileURL = URL.createObjectURL(data.bill);
        }

        newClaims.push({
          ref: refNo(pid, idx),
          date: today(),
          section: group.section,
          title: group.title,
          head: data.selectedHead,
          amount: Number(data.amount),
          fileName: data.bill ? data.bill.name : null,
          fileURL,
        });
      }
    });

    if (newClaims.length === 0) {
      alert("Please fill at least one head.");
      return;
    }

    setBillsStore((prev) => ({
      ...prev,
      [pid]: [...(prev[pid] || []), ...newClaims],
    }));

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProject(null);
      setClaimData({});
    }, 2200);
  };

  const createReportPDF = async (project, mode = "preview") => {
    const bills = billsStore[project.id] || [];
    const total = bills.reduce((s, b) => s + b.amount, 0);

    const reportElement = document.createElement("div");
    reportElement.style.width = "1000px";
    reportElement.style.padding = "30px";
    reportElement.style.background = "#ffffff";
    reportElement.style.color = "#111827";
    reportElement.style.fontFamily = "Arial, sans-serif";

    reportElement.innerHTML = `
      <h2 style="margin:0 0 6px;">CMRG Bill Report</h2>
      <p style="margin:0 0 20px;color:#555;">Generated on ${today()}</p>

      <div style="margin-bottom:20px;font-size:14px;">
        <b>Project ID:</b> ${project.id}<br/>
        <b>Title:</b> ${project.title}<br/>
        <b>PI:</b> ${project.pi}<br/>
        <b>Department:</b> ${project.department}
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#0f172a;color:white;">
            <th style="padding:10px;border:1px solid #ddd;">Ref No</th>
            <th style="padding:10px;border:1px solid #ddd;">Date</th>
            <th style="padding:10px;border:1px solid #ddd;">Section</th>
            <th style="padding:10px;border:1px solid #ddd;">Head</th>
            <th style="padding:10px;border:1px solid #ddd;">Item</th>
            <th style="padding:10px;border:1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${
            bills.length
              ? bills
                  .map(
                    (b) => `
                <tr>
                  <td style="padding:9px;border:1px solid #ddd;">${b.ref}</td>
                  <td style="padding:9px;border:1px solid #ddd;">${b.date}</td>
                  <td style="padding:9px;border:1px solid #ddd;">${b.section}</td>
                  <td style="padding:9px;border:1px solid #ddd;">${b.title}</td>
                  <td style="padding:9px;border:1px solid #ddd;">${b.head}</td>
                  <td style="padding:9px;border:1px solid #ddd;">₹${b.amount.toLocaleString(
                    "en-IN"
                  )}</td>
                </tr>
              `
                  )
                  .join("")
              : `<tr><td colspan="6" style="padding:20px;text-align:center;border:1px solid #ddd;">No claims found</td></tr>`
          }
        </tbody>
      </table>

      <div style="margin-top:22px;font-size:15px;">
        <b>Total Claims:</b> ${bills.length}<br/>
        <b>Total Claimed:</b> ₹${total.toLocaleString("en-IN")}<br/>
        <b>Balance Remaining:</b> ₹${(
          project.sanctionedAmount - total
        ).toLocaleString("en-IN")}
      </div>
    `;

    document.body.appendChild(reportElement);

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(reportElement);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const fileName = `CMRG_Bill_Report_${project.id}.pdf`;

    if (mode === "download") {
      pdf.save(fileName);
    } else {
      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfPreview({ name: fileName, url: pdfUrl });
    }
  };

  const activeProject = activeTab
    ? projects.find((p) => p.id === activeTab)
    : settledProject;

  const activeBills = activeProject ? billsStore[activeProject.id] || [] : [];
  const totalClaimed = activeBills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="slip-page">
      <div className="slip-table-card">
        <h2>CMRG Slip Projects</h2>

        <div className="slip-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Title</th>
                <th>PI Name</th>
                <th>Department</th>
                <th>Sanctioned Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.title}</td>
                  <td>{project.pi}</td>
                  <td>{project.department}</td>
                  <td>{fmt(project.sanctionedAmount)}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="slip-view-btn"
                      onClick={() => {
                        setSelectedProject(project);
                        setClaimData({});
                      }}
                    >
                      Update Claim
                    </button>

                    <button
                      className="settled-btn"
                      onClick={() => {
                        setSettledProject(project);
                        setActiveTab(project.id);
                      }}
                    >
                      📋 Settled Bills
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <div className="slip-card">
          <h2>Update Claim — {selectedProject.title}</h2>

          <div className="claim-project-info">
            <span>
              Project ID: <b>{selectedProject.id}</b>
            </span>
            <span>
              PI: <b>{selectedProject.pi}</b>
            </span>
            <span>
              Department: <b>{selectedProject.department}</b>
            </span>
            <span>
              Sanctioned: <b>{fmt(selectedProject.sanctionedAmount)}</b>
            </span>
          </div>

          <div className="claim-head-wrapper">
            {heads.map((group) => (
              <div className="claim-section" key={group.section}>
                <div className="claim-section-title">
                  <span>{group.section}</span>
                  <h3>{group.title}</h3>
                </div>

                <div className="claim-row">
                  <div className="claim-index">1</div>

                  <div className="claim-head-name">
                    <select
                      className="slip-input"
                      value={claimData[group.title]?.selectedHead || ""}
                      onChange={(e) =>
                        handleChange(
                          group.title,
                          "selectedHead",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Head</option>
                      {group.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="claim-input-group">
                    <input
                      type="number"
                      className="slip-input"
                      placeholder="Enter amount"
                      value={claimData[group.title]?.amount || ""}
                      onChange={(e) =>
                        handleChange(group.title, "amount", e.target.value)
                      }
                      disabled={!claimData[group.title]?.selectedHead}
                    />

                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="slip-input"
                      onChange={(e) =>
                        handleChange(group.title, "bill", e.target.files[0])
                      }
                      disabled={!claimData[group.title]?.selectedHead}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slip-submit-row">
            <button onClick={handleSubmit}>Submit Claim</button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="claim-success-overlay">
          <div className="claim-success-box">
            <div className="claim-success-check">✓</div>
            <h2>Claim Submitted</h2>
            <p>Your claim has been recorded successfully</p>
          </div>
        </div>
      )}

      {settledProject && (
        <div
          className="settled-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettledProject(null);
          }}
        >
          <div className="settled-modal">
            <div className="settled-modal-head">
              <h2>
                📋 Settled Bills <span>{activeProject?.title}</span>
              </h2>

              <div className="settled-modal-actions">
                <button
                  className="modal-report-btn"
                  onClick={() => createReportPDF(activeProject, "preview")}
                >
                  👁 Preview Report
                </button>

                <button
                  className="modal-report-btn"
                  onClick={() => createReportPDF(activeProject, "download")}
                >
                  ⬇ Download Report
                </button>

                <button
                  className="modal-close-btn"
                  onClick={() => setSettledProject(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="settled-modal-body">
              <div className="settled-tabs">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className={`settled-tab ${
                      activeTab === p.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(p.id)}
                  >
                    {p.id} — {p.title}
                    {(billsStore[p.id] || []).length > 0 && (
                      <span
                        style={{
                          marginLeft: 6,
                          background: "rgba(251,191,36,0.2)",
                          color: "#fbbf24",
                          borderRadius: "999px",
                          padding: "1px 7px",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        {(billsStore[p.id] || []).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {activeProject && (
                <div className="settled-summary">
                  <div className="settled-summary-card">
                    <p>Total Claims</p>
                    <h4>{activeBills.length}</h4>
                  </div>

                  <div className="settled-summary-card">
                    <p>Total Claimed</p>
                    <h4 className="green">{fmt(totalClaimed)}</h4>
                  </div>

                  <div className="settled-summary-card">
                    <p>Balance Remaining</p>
                    <h4 className="yellow">
                      {fmt(activeProject.sanctionedAmount - totalClaimed)}
                    </h4>
                  </div>
                </div>
              )}

              {activeBills.length === 0 ? (
                <div className="empty-bills">
                  <div className="empty-icon">🗂️</div>
                  No settled bills found for this project.
                  <br />
                  Submit a claim to see history here.
                </div>
              ) : (
                <div className="bills-table-wrap">
                  <table className="bills-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Reference No.</th>
                        <th>Date</th>
                        <th>Section</th>
                        <th>Head Category</th>
                        <th>Item / Equipment</th>
                        <th>Amount</th>
                        <th>Bill File</th>
                      </tr>
                    </thead>

                    <tbody>
                      {activeBills.map((bill, i) => (
                        <tr key={bill.ref}>
                          <td>{i + 1}</td>

                          <td>
                            <span className="ref-badge">{bill.ref}</span>
                          </td>

                          <td>{bill.date}</td>

                          <td>
                            <span className="section-badge">
                              {bill.section}
                            </span>
                          </td>

                          <td>
                            <span className="head-badge">{bill.title}</span>
                          </td>

                          <td>{bill.head}</td>

                          <td className="amount-cell">{fmt(bill.amount)}</td>

                          <td>
                            {bill.fileURL ? (
                              <div className="bill-action-group">
                                <button
                                  className="preview-bill-btn"
                                  onClick={() =>
                                    setPdfPreview({
                                      name: bill.fileName,
                                      url: bill.fileURL,
                                    })
                                  }
                                >
                                  👁 Preview
                                </button>

                                <a
                                  className="download-bill-btn"
                                  href={bill.fileURL}
                                  download={bill.fileName}
                                  style={{
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  ⬇ Download
                                </a>
                              </div>
                            ) : (
                              <span className="no-file-text">
                                No file uploaded
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {pdfPreview && (
        <div
          className="pdf-preview-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPdfPreview(null);
          }}
        >
          <div className="pdf-preview-box">
            <div className="pdf-preview-head">
              <span>{pdfPreview.name}</span>

              <div>
                <a href={pdfPreview.url} download={pdfPreview.name}>
                  ⬇ Download
                </a>

                <button onClick={() => setPdfPreview(null)}>✕ Close</button>
              </div>
            </div>

            {pdfPreview.name?.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/) ? (
              <img
                src={pdfPreview.url}
                alt={pdfPreview.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#fff",
                }}
              />
            ) : (
              <iframe
                className="pdf-preview-frame"
                src={pdfPreview.url}
                title={pdfPreview.name}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CMRGSlipPage;