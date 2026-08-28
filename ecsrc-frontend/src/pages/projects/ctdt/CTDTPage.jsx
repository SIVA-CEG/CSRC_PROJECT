import React, { useMemo, useState } from "react";
import "../../endorsements/EndorsementsPage.css";
import "../SlipPages.css";

const CTDTPage = ({ onNavigate }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState(null);

  const proceedings = [
    {
      id: 1,
      fileNo: "CTDT/2023-24/001",
      date: "12-07-2023",
      title: "Technology Development Proposal Review",
      coordinator: "Dr. Shubra Singh",
      department: "Crystal Growth Centre",
      status: "Approved",
    },
    {
      id: 2,
      fileNo: "CTDT/2023-24/002",
      date: "21-08-2023",
      title: "Transfer of Sponsored Research Output",
      coordinator: "Dr. Anand Kumar",
      department: "Information Technology",
      status: "Pending",
    },
    {
      id: 3,
      fileNo: "CTDT/2023-24/003",
      date: "05-09-2023",
      title: "Industry Collaboration Proceedings",
      coordinator: "Dr. Meena Raj",
      department: "Mechanical Engineering",
      status: "Approved",
    },
  ];

  const pdfUrl = useMemo(() => {
    if (!selectedProceeding) return "";

    const html = `
      <html>
        <head>
          <title>CTDT Proceedings</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 35px;
              color: #111;
            }
            .page {
              border: 2px solid #111;
              padding: 28px;
              min-height: 90vh;
            }
            h2, h3 {
              text-align: center;
              margin: 6px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
            }
            td {
              border: 1px solid #222;
              padding: 10px;
              font-size: 14px;
            }
            .section {
              margin-top: 25px;
              line-height: 1.7;
              font-size: 14px;
            }
            .sign {
              margin-top: 80px;
              text-align: right;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <h2>ANNA UNIVERSITY</h2>
            <h3>CENTRE FOR SPONSORED RESEARCH AND CONSULTANCY</h3>
            <h3>CTDT PROCEEDINGS</h3>

            <table>
              <tr><td><b>File No.</b></td><td>${selectedProceeding.fileNo}</td></tr>
              <tr><td><b>Date</b></td><td>${selectedProceeding.date}</td></tr>
              <tr><td><b>Title</b></td><td>${selectedProceeding.title}</td></tr>
              <tr><td><b>Coordinator</b></td><td>${selectedProceeding.coordinator}</td></tr>
              <tr><td><b>Department</b></td><td>${selectedProceeding.department}</td></tr>
              <tr><td><b>Status</b></td><td>${selectedProceeding.status}</td></tr>
            </table>

            <div class="section">
              <p>
                The Committee for Technology Development and Transfer has reviewed the above
                proposal/proceeding details. Based on the discussion, the proceeding is recorded
                for further administrative and financial processing.
              </p>
              <p>
                This is a dummy PDF preview. Later, you can replace these values with real backend data.
              </p>
            </div>

            <div class="sign">
              DIRECTOR / CTDT AUTHORITY
            </div>
          </div>
        </body>
      </html>
    `;

    return URL.createObjectURL(new Blob([html], { type: "text/html" }));
  }, [selectedProceeding]);

  const handlePreview = (item) => {
    setSelectedProceeding(item);
    setPreviewOpen(true);
  };

  return (
    <div className="endorsements-page slip-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home /{" "}
          <span onClick={() => onNavigate("projects")}>My Projects</span> /{" "}
          <span>CTDT Proceedings</span>
        </div>
        <h1 className="page-title">CTDT Proceedings</h1>
        <p className="page-subtitle">
          Committee for Technology Development and Transfer
        </p>
      </div>

      <div className="slip-table-card">
        <h2>List of CTDT Proceedings</h2>

        <div className="slip-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL.No</th>
                <th>File No</th>
                <th>Date</th>
                <th>Title</th>
                <th>Coordinator</th>
                <th>Department</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {proceedings.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.fileNo}</td>
                  <td>{item.date}</td>
                  <td>{item.title}</td>
                  <td>{item.coordinator}</td>
                  <td>{item.department}</td>
                  <td>
                    <span className="slip-status">{item.status}</span>
                  </td>
                  <td>
                    <button
                      className="slip-view-btn"
                      onClick={() => handlePreview(item)}
                    >
                      👁 Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewOpen && selectedProceeding && (
        <div className="slip-modal">
          <div className="slip-modal-box">
            <div className="slip-modal-head">
              <h3>CTDT Proceedings PDF Preview</h3>

              <div>
                <a
                  href={pdfUrl}
                  download={`${selectedProceeding.fileNo.replaceAll("/", "-")}.pdf`}
                >
                  Download PDF
                </a>
                <button onClick={() => setPreviewOpen(false)}>Close</button>
              </div>
            </div>

            <iframe src={pdfUrl} title="CTDT Proceedings PDF Preview"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CTDTPage;