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
import ProposalsList        from './pages/projects/ProposalsList';
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
      case 'proposals':         return <ProposalsList       onNavigate={navigate} />;
      case 'sanctioned':        return <SanctionedList      onNavigate={navigate} />;
      case 'ctdt':              return <CTDTPage             onNavigate={navigate} />;
      case 'projectstaff':      return <ProjectStaffPage    onNavigate={navigate} />;
      case 'requestforms':      return <RequestFormsPage    onNavigate={navigate} />;
      case 'paymentclaims':     return <PaymentClaimsPage   onNavigate={navigate} />;
      case 'zbaslip':           return <ZBASlipPage          onNavigate={navigate} />;
      case 'tsaslip':           return <TSASlipPage          onNavigate={navigate} />;
      case 'cmrgslip':          return <CMRGSlipPage         onNavigate={navigate} />;
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