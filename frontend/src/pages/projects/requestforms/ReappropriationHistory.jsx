import React from "react";
import "./ReappropriationHistory.css";

export default function ReappropriationHistory() {
  const history = [
    {
      id: 1,
      project:
        "Development of Ti(C,N) based cermets modified by Si3N4, B4C and Cr3C2",
      agency: "CMRG",
      installment: "1",
      status: "Pending",
      date: "02-Jun-2026",
    },
    {
      id: 2,
      project: "AI based Smart Agriculture Monitoring System",
      agency: "DST",
      installment: "2",
      status: "Completed",
      date: "28-May-2026",
    },
  ];

  const handlePreview = (item) => {
    console.log("Preview Report", item);

    // Later replace with actual previewReport(item)
    alert(`Preview Report\n\n${item.project}`);
  };

  const handleDownload = (item) => {
    console.log("Download Report", item);

    // Later replace with actual downloadReport(item)
    alert(`Download Report\n\n${item.project}`);
  };

  return (
    <div className="rah-page">
      <div className="rah-header">
        <h2>Re-appropriation History</h2>
        <p>All submitted re-appropriation requests</p>
      </div>

      <div className="rah-table-wrapper">
        <table className="rah-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Project</th>
              <th>Funding Agency</th>
              <th>Installment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.project}</td>
                <td>{item.agency}</td>
                <td>{item.installment}</td>

                <td>
                  <span
                    className={
                      item.status === "Completed"
                        ? "rah-completed"
                        : "rah-pending"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td className="rah-date">{item.date}</td>

                <td>
                  <div className="rah-actions">
                    <button
                      className="ra-btn ra-btn-preview"
                      onClick={() => handlePreview(item)}
                    >
                      Preview Report
                    </button>

                    <button
                      className="ra-btn ra-btn-download"
                      onClick={() => handleDownload(item)}
                    >
                      Download Report
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}