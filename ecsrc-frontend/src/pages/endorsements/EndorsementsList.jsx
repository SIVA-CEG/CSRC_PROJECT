import React, { useEffect, useState } from "react";
import "./EndorsementsList.css";

import { getEndorsements } from "../../services/endorsementservices";

const EndorsementsList = ({ onNavigate }) => {
  /*const handleDownloadPDF = (item) => {
    alert(`Downloading PDF for ${item.propId}...`);
  };*/
const [endorsements, setEndorsements] = useState([]);
const [currentPage, setCurrentPage] = useState(1);

const recordsPerPage = 5;
const totalPages = Math.ceil(endorsements.length / recordsPerPage);

const startIndex = (currentPage - 1) * recordsPerPage;

const currentRecords = endorsements.slice(
  startIndex,

  startIndex + recordsPerPage,
);
useEffect(() => {
  const fetchEndorsements = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));

      const res = await getEndorsements(user.id);

      setEndorsements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchEndorsements();
}, []);

  return (
    <div className="endorsements-list-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home /{" "}
          <span onClick={() => onNavigate("endorsements")}>Endorsements</span> /{" "}
          <span>List</span>
        </div>
        <h1 className="page-title">List of Endorsements</h1>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="table-card-title">
              Listing applied Endorsements
            </span>
            <span className="table-count-badge">
              {endorsements.length} records
            </span>
          </div>
          <button
            className="new-btn"
            onClick={() => onNavigate("endorsements-new")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: 14, height: 14 }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            NEW
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Endorsement ID</th>
              <th>Applied On</th>
              <th>Scheme</th>
              <th>Cost (Rs.)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item, index) => (
              <tr key={index + 1}>
                <td>{startIndex + index + 1}</td>
                <td style={{ color: "#00b4ff", fontWeight: 500 }}>
                  {item.endorsement_id}
                </td>
                <td>
                  {item.applied_on
                    ? new Date(item.applied_on).toLocaleDateString("en-GB")
                    : "-"}
                </td>
                <td style={{ maxWidth: 320 }}>{item.scheme}</td>
                <td>₹ {Number(item.total_amount || 0).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "currentColor",
                        display: "inline-block",
                      }}
                    />
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="action-btn view"
                      title="View"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${item.pdf_file}`,

                          "_blank",
                        )
                      }
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      className="action-btn pdf"
                      title="Download PDF"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `http://localhost:5000${item.pdf_file}`,
                          );

                          const blob = await response.blob();

                          const url = window.URL.createObjectURL(blob);

                          const link = document.createElement("a");

                          link.href = url;

                          link.setAttribute(
                            "download",

                            `${item.endorsement_id}.pdf`,
                          );

                          document.body.appendChild(link);

                          link.click();

                          link.remove();

                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.log(err);

                          alert("Download failed");
                        }
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>

          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>

          <span className="page-info">
            Page {currentPage}
            of {totalPages || 1}
          </span>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndorsementsList;
