import React, { useState } from "react";
import "../SlipPages.css";

const projects = [
  {
    id: "TSA001",
    title: "AI Based Research Project",
    pi: "Dr. Kumar",
    department: "IT",
    sanctionedAmount: "₹5,00,000",
  },
  {
    id: "TSA002",
    title: "IoT Smart Monitoring System",
    pi: "Dr. Priya",
    department: "CSE",
    sanctionedAmount: "₹3,50,000",
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

const TSASlipPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [claimData, setClaimData] = useState({});

  const handleChange = (head, field, value) => {
    setClaimData((prev) => ({
      ...prev,
      [head]: {
        ...prev[head],
        [field]: value,
      },
    }));
  };

  const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = () => {
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
    setSelectedProject(null);
    setClaimData({});
  }, 2200);
};

  return (
    <div className="slip-page">
      <div className="slip-table-card">
        <h2>TSA Slip Projects</h2>

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
                  <td>{project.sanctionedAmount}</td>
                  <td>
                    <button
                      className="slip-view-btn"
                      onClick={() => setSelectedProject(project)}
                    >
                      Update Claim
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
          <h2>Update Claim - {selectedProject.title}</h2>

          <div className="claim-project-info">
            <span>Project ID: {selectedProject.id}</span>
            <span>PI: {selectedProject.pi}</span>
            <span>Department: {selectedProject.department}</span>
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
                        handleChange(group.title, "selectedHead", e.target.value)
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
      <p>Your claim has been submitted successfully</p>
    </div>
  </div>
)}
    </div>
  );
};

export default TSASlipPage;