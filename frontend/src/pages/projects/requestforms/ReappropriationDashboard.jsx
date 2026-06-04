import React from "react";
import "./ReappropriationDashboard.css";

export default function ReappropriationDashboard({ onNavigate }) {
  return (
    <div className="rad-page">
      <div className="rad-header">
        <h2>Re-appropriation Dashboard</h2>
        <p>Manage re-appropriation requests and track history</p>
      </div>

      <div
  className="ped-card"
  onClick={() => onNavigate("project-reappropriation-request")}
>
  <h3>New Project Reappropriation</h3>
  <p>Create a new re-appropriation request</p>
</div>

<div
  className="ped-card"
  onClick={() => onNavigate("reappropriationhistory")}
>
  <h3>Project Reappropriation History</h3>
  <p>View submitted re-appropriation requests</p>
</div>
    </div>
  );
}