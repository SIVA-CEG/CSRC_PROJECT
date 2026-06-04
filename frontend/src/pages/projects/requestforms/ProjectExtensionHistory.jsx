import React from "react";
import "./ProjectExtensionHistory.css";

export default function ProjectExtensionHistory() {
  const history = [
    {
      id: 1,
      project:
        "Development of Ti(C,N) based cermets modified by Si3N4",
      agency: "SERB",
      originalEnd: "09-12-2023",
      revisedEnd: "09-06-2024",
      extension: "+6 Months",
      status: "Pending",
      date: "02-Jun-2026",
    },
  ];

  return (
    <div className="peh-page">
      <div className="peh-table-wrapper">
        <table className="peh-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Project</th>
              <th>Agency</th>
              <th>Original End</th>
              <th>Revised End</th>
              <th>Extension</th>
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
                <td>{item.originalEnd}</td>
                <td>{item.revisedEnd}</td>
                <td>{item.extension}</td>
                <td>{item.status}</td>
                <td className="peh-date">{item.date}</td>

                <td>
                  <div className="peh-actions">
                    <button className="pe-btn pe-btn-preview">
                      Preview Letter
                    </button>

                    <button className="pe-btn pe-btn-download">
                      Download Letter
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