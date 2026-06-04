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
      <div className="pc-navbar">
  <div className="pc-navbar-title">
    <span>💰 Payment Claims</span>
  </div>

  <div className="pc-tabs">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        className={`pc-tab ${activeTab === tab.key ? "active" : ""}`}
        onClick={() => setActiveTab(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
</div>

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