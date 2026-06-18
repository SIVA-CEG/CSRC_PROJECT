// PATH: frontend/src/App.jsx

import React, { useState } from 'react';
import './App.css';

import ModulesPage          from './pages/ModulesPage';
import DashboardLayout      from './layouts/DashboardLayout';
import ProfilePage          from './pages/profile/ProfilePage';
import EndorsementsPage     from './pages/endorsements/EndorsementsPage';
import EndorsementsList     from './pages/endorsements/EndorsementsList';
import NewEndorsementPage   from './pages/endorsements/new/NewEndorsementPage';   // ← NEW
import ProjectsPage         from './pages/projects/ProjectsPage';
import SanctionedList       from './pages/projects/SanctionedList';
import CTDTPage             from './pages/projects/ctdt/CTDTPage';
import ProjectStaffPage     from './pages/projects/projectstaff/ProjectStaffPage';
import RequestFormsPage     from './pages/projects/requestforms/RequestFormsPage';
import PaymentClaimsPage    from './pages/projects/paymentclaims/PaymentClaimsPage';
import ZBASlipPage          from './pages/projects/zbaslip/ZBASlipPage';
import TSASlipPage          from './pages/projects/tsaslip/TSASlipPage';
import CMRGSlipPage         from './pages/projects/cmrgslip/CMRGSlipPage';
import ConsultanciesPage    from './pages/consultancies/ConsultanciesPage';
import TestingPage          from './pages/testing/TestingPage';
import TrainingPage         from './pages/training/TrainingPage';
import WorkshopsPage        from './pages/workshops/WorkshopsPage';
import ReappropriationDashboard from './pages/projects/requestforms/ReappropriationDashboard';
import ReappropriationPage from './pages/projects/requestforms/ReappropriationPage';
import ReappropriationHistory from './pages/projects/requestforms/ReappropriationHistory';
import ProjectExtensionDashboard from './pages/projects/requestforms/ProjectExtensionDashboard';
import ProjectExtensionHistory from './pages/projects/requestforms/ProjectExtensionHistory';
import ProjectExtensionPage from './pages/projects/requestforms/ProjectExtensionPage';


import SEUC from './pages/projects/SEUC';
import Reports from './pages/projects/Reports';   // ← NEW

function App() {
  const [page, setPage] = useState('home');

  const navigate = (target) => setPage(target);

  if (page === 'home') {
    return <ModulesPage onNavigate={navigate} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'profile':           return <ProfilePage />;
      case 'endorsements':      return <EndorsementsPage    onNavigate={navigate} />;
      case 'endorsements-list': return <EndorsementsList    onNavigate={navigate} />;
      case 'endorsements-new':  return <NewEndorsementPage  onNavigate={navigate} />;  // ← UPDATED
      case 'projects':          return <ProjectsPage        onNavigate={navigate} />;
      case 'sanctioned':        return <SanctionedList      onNavigate={navigate} />;
      case 'ctdt':              return <CTDTPage             onNavigate={navigate} />;
      case 'projectstaff':      return <ProjectStaffPage    onNavigate={navigate} />;
      case 'requestforms':      return <RequestFormsPage    onNavigate={navigate} />;

      case 'reappropriationdashboard':
  return <ReappropriationDashboard onNavigate={navigate} />;

  case 'project-reappropriation-request':
  return <ReappropriationPage onNavigate={navigate} />;

case 'reappropriationhistory':
  return <ReappropriationHistory onNavigate={navigate} />;

  case 'project-extension-dashboard':
  return <ProjectExtensionDashboard onNavigate={navigate} />;

case 'project-extension':
  return <ProjectExtensionPage onNavigate={navigate} />;

case 'project-extension-history':
  return <ProjectExtensionHistory onNavigate={navigate} />;

      case 'paymentclaims':     return <PaymentClaimsPage   onNavigate={navigate} />;
      case 'zbaslip':           return <ZBASlipPage          onNavigate={navigate} />;
      case 'tsaslip':           return <TSASlipPage          onNavigate={navigate} />;
      case 'cmrgslip':          return <CMRGSlipPage         onNavigate={navigate} />;
      case 'seuc':              return <SEUC                  onNavigate={navigate} />;
      case 'reports':           return <Reports               onNavigate={navigate} />;  // ← NEW
      case 'consultancies':     return <ConsultanciesPage    onNavigate={navigate} />;
      case 'testing':           return <TestingPage />;
      case 'training':          return <TrainingPage />;
      case 'workshops':         return <WorkshopsPage />;
      default:                  return <ProfilePage />;
    } 
  };

  return (
    <DashboardLayout activePage={page} onNavigate={navigate}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;