import React from "react";
import "./ReappropriationDashboard.css";

export default function ReappropriationDashboard({ onNavigate }) {
  return (
    <div className="rad-page">
      <div className="rad-header">
        <h1>Re-appropriation Dashboard</h1>
        <p>Manage re-appropriation requests and track history</p>
      </div>

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
  );
}