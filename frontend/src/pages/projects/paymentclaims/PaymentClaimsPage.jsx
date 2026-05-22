import React, { useState } from "react";
import BeneficiariesPage from "./BeneficiariesPage";
import StaffSalaryClaimsPage from "./StaffSalaryClaimsPage";
import "./PaymentClaimsPage.css";

const TABS = [
  { key: "beneficiaries", label: "Beneficiaries" },
  { key: "advance", label: "Advance Payments" },
  { key: "reimbursements", label: "Reimbursements" },
  { key: "supplier", label: "Supplier Claims" },
  { key: "salary", label: "Staff Salary Claims" },
];

export default function PaymentClaimsPage() {
  const [activeTab, setActiveTab] = useState("beneficiaries");

  return (
    <div className="pc-layout">
      <aside className="pc-sidebar">
        <div className="pc-sidebar-header">
          <span className="pc-edit-icon">✏️</span>
          <span>Payment Claims</span>
          <span className="pc-chevron">▾</span>
        </div>
        <ul className="pc-nav">
          {TABS.map((tab) => (
            <li
              key={tab.key}
              className={`pc-nav-item ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="pc-radio">{activeTab === tab.key ? "◉" : "○"}</span>
              {tab.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="pc-main">
        {activeTab === "beneficiaries" && <BeneficiariesPage />}
        {activeTab === "salary" && <StaffSalaryClaimsPage />}
        {["advance", "reimbursements", "supplier"].includes(activeTab) && (
          <div className="pc-under-construction">
            <div className="pc-uc-icon">🚧</div>
            <h2>Under Construction</h2>
            <p>This section is coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}