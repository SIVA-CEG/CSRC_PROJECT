import React, { useState } from "react";
import "./FacultyDashboardApp.css";

import ModulesPage from "./ModulesPage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfilePage from "./profile/ProfilePage";
import EndorsementsPage from "./endorsements/EndorsementsPage";
import EndorsementsList from "./endorsements/EndorsementsList";
import ProjectsPage from "./projects/ProjectsPage";
import SanctionedList from "./projects/SanctionedList";
import CTDTPage from "./projects/ctdt/CTDTPage";
import ProjectStaffPage from "./projects/projectstaff/ProjectStaffPage";
import RequestFormsPage from "./projects/requestforms/RequestFormsPage";
import PaymentClaimsPage from "./projects/paymentclaims/PaymentClaimsPage";
import ZBASlipPage from "./projects/zbaslip/ZBASlipPage";
import TSASlipPage from "./projects/tsaslip/TSASlipPage";
import CMRGSlipPage from "./projects/cmrgslip/CMRGSlipPage";
import ConsultanciesPage from "./consultancies/ConsultanciesPage";
import TestingPage from "./testing/TestingPage";
import TrainingPage from "./training/TrainingPage";
import WorkshopsPage from "./workshops/WorkshopsPage";
import NewEndorsementPage from "./endorsements/new/NewEndorsementPage";
import { NewFormatReport } from "./endorsements/new/EndorsementReport";
import ReappropriationDashboard from "./projects/requestforms/ReappropriationDashboard";
import ReappropriationPage from "./projects/requestforms/ReappropriationPage";
import ReappropriationHistory from "./projects/requestforms/ReappropriationHistory";
import ProjectExtensionDashboard from "./projects/requestforms/ProjectExtensionDashboard";
import ProjectExtensionHistory from "./projects/requestforms/ProjectExtensionHistory";
import ProjectExtensionPage from "./projects/requestforms/ProjectExtensionPage";
import AdvanceSanctionsPage from "./projects/requestforms/AdvanceSanctionsPage";
import { ProjectProvider } from "./projects/requestforms/ProjectContext";
import ProjectTransfer from "./projects/projecttransfer/ProjectTransfer";
import StatementOfExpenditure from "./projects/StatementOfExpenditure";
import PDFRequest from "./projects/PDFRequest";
import Reports from "./projects/Reports";

import DepartmentConsultancies from "./consultancies/DepartmentConsultancies/DepartmentConsultancies";
import CenterConsultancies from "./consultancies/CenterConsultancies/CenterConsultancies";
import AcceptanceFormWizard from "./consultancies/shared/AcceptanceFormWizard";
import AcceptanceFormStatus from "./consultancies/shared/AcceptanceFormStatus";
import InstallmentList from "./consultancies/shared/InstallmentList";
import InvoiceStatus from "./consultancies/shared/InvoiceStatus";
import PaymentStatus from "./consultancies/shared/PaymentStatus";
// InvoicePrintView / PaymentEntryForm / PaymentPrintView / AcceptanceFormPrintView /
// AddInstallmentForm are all rendered internally by their parent pages above —
// no direct routes needed. AcceptanceTypeSelect has been retired (folded into
// AcceptanceFormWizard as a radio button).

function FacultyDashboardApp() {
  const [page, setPage] = useState("home");

  const navigate = (target) => setPage(target);

  if (page === "home") {
    return <ModulesPage onNavigate={navigate} />;
  }

  const renderPage = () => {
    switch (page) {
      case "profile":
        return <ProfilePage />;
      case "endorsements":
        return <EndorsementsPage onNavigate={navigate} />;
      case "endorsements-list":
        return <EndorsementsList onNavigate={navigate} />;
      case "endorsements-new":
        return <NewEndorsementPage onNavigate={navigate} />;
      case "endorsement-report":
        return <NewFormatReport onNavigate={navigate} />;

      case "projects":
        return <ProjectsPage onNavigate={navigate} />;
      case "projecttransfer":
        return <ProjectTransfer onNavigate={navigate} />;

      case "advance-sanction":
        return <AdvanceSanctionsPage onNavigate={navigate} />;

      case "reappropriationdashboard":
        return <ReappropriationDashboard onNavigate={navigate} />;
      case "reappropriation-without":
        return <ReappropriationPage claimType="without" onNavigate={navigate} />;
      case "reappropriation-with":
        return <ReappropriationPage claimType="with" onNavigate={navigate} />;
      case "reappropriationhistory":
        return <ReappropriationHistory onNavigate={navigate} />;

      case "project-extension-dashboard":
        return <ProjectExtensionDashboard onNavigate={navigate} />;
      case "project-extension-without":
        return <ProjectExtensionPage extensionType="without" onNavigate={navigate} />;
      case "project-extension-with":
        return <ProjectExtensionPage extensionType="with" onNavigate={navigate} />;
      case "project-extension":
        // ProjectProvider is already mounted once at the root render below —
        // no need to wrap again here.
        return <ProjectExtensionPage onNavigate={navigate} />;
      case "project-extension-history":
        return <ProjectExtensionHistory onNavigate={navigate} />;

      case "sanctioned":
        return <SanctionedList onNavigate={navigate} />;
      case "ctdt":
        return <CTDTPage onNavigate={navigate} />;
      case "projectstaff":
        return <ProjectStaffPage onNavigate={navigate} />;
      case "requestforms":
        return <RequestFormsPage onNavigate={navigate} />;
      case "paymentclaims":
        return <PaymentClaimsPage onNavigate={navigate} />;
      case "zbaslip":
        return <ZBASlipPage onNavigate={navigate} />;
      case "tsaslip":
        return <TSASlipPage onNavigate={navigate} />;
      case "cmrgslip":
        return <CMRGSlipPage onNavigate={navigate} />;
      case "statementofexpenditure":
        return <StatementOfExpenditure onNavigate={navigate} />;
      case "pdfrequest":
        return <PDFRequest onNavigate={navigate} />;
      case "reports":
        return <Reports onNavigate={navigate} />;

      case "consultancies":
        return <ConsultanciesPage onNavigate={navigate} />;
      case "department-consultancies":
        return <DepartmentConsultancies onNavigate={navigate} />;
      case "center-consultancies":
        return <CenterConsultancies onNavigate={navigate} />;

      case "department-consultancy-acceptance":
        return <AcceptanceFormWizard campus="department" onNavigate={navigate} />;
      case "center-consultancy-acceptance":
        return <AcceptanceFormWizard campus="center" onNavigate={navigate} />;

      case "department-consultancy-status":
        return <AcceptanceFormStatus campus="department" onNavigate={navigate} />;
      case "center-consultancy-status":
        return <AcceptanceFormStatus campus="center" onNavigate={navigate} />;

      case "department-consultancy-installments":
        return <InstallmentList campus="department" onNavigate={navigate} />;
      case "center-consultancy-installments":
        return <InstallmentList campus="center" onNavigate={navigate} />;

      case "department-invoice-status":
        return <InvoiceStatus campus="department" onNavigate={navigate} />;
      case "center-invoice-status":
        return <InvoiceStatus campus="center" onNavigate={navigate} />;

      case "department-payment-status":
        return <PaymentStatus campus="department" onNavigate={navigate} />;
      case "center-payment-status":
        return <PaymentStatus campus="center" onNavigate={navigate} />;

      case "testing":
        return <TestingPage />;
      case "training":
        return <TrainingPage />;
      case "workshops":
        return <WorkshopsPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <ProjectProvider>
      <DashboardLayout activePage={page} onNavigate={navigate}>
        {renderPage()}
      </DashboardLayout>
    </ProjectProvider>
  );
}

export default FacultyDashboardApp;