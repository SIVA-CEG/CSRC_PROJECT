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


import StatementOfExpenditure from './pages/projects/StatementOfExpenditure';
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

      // Type (with / without instalment) is now chosen ONLY on the
      // Dashboard above, which routes here with the type baked into
      // the route name — no more in-page type-selection screen.
      case 'reappropriation-without':
        return <ReappropriationPage claimType="without" onNavigate={navigate} />;

      case 'reappropriation-with':
        return <ReappropriationPage claimType="with" onNavigate={navigate} />;

      case 'reappropriationhistory':
        return <ReappropriationHistory onNavigate={navigate} />;

      case 'project-extension-dashboard':
        return <ProjectExtensionDashboard onNavigate={navigate} />;

      // Type (without / with new grant) is chosen ONLY on the Dashboard
      // above, which routes here with the type baked into the route name —
      // same convention as reappropriation-without / reappropriation-with.
      case 'project-extension-without':
        return <ProjectExtensionPage extensionType="without" onNavigate={navigate} />;

      case 'project-extension-with':
        return <ProjectExtensionPage extensionType="with" onNavigate={navigate} />;

      case 'project-extension-history':
        return <ProjectExtensionHistory onNavigate={navigate} />;

      case 'paymentclaims':     return <PaymentClaimsPage   onNavigate={navigate} />;
      case 'zbaslip':           return <ZBASlipPage          onNavigate={navigate} />;
      case 'statementofexpenditure':              return <StatementOfExpenditure                  onNavigate={navigate} />;
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