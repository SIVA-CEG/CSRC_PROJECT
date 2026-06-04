import React from "react";
import "./ProjectExtensionDashboard.css";

export default function ProjectExtensionDashboard({ onNavigate }) {
  return (
    <div className="ped-page">
      <div className="ped-grid">
        <div
          className="ped-card"
          onClick={() => onNavigate("project-extension")}
        >
          <h3>New Project Extension</h3>
          <p>Create a new extension request</p>
        </div>

        <div
          className="ped-card"
          onClick={() => onNavigate("project-extension-history")}
        >
          <h3>Project Extension History</h3>
          <p>View submitted extension requests</p>
        </div>
      </div>
    </div>
  );
}