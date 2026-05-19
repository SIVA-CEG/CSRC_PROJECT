import React, { useState } from 'react';
import './App.css';

import ModulesPage from './pages/ModulesPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProfilePage from './pages/profile/ProfilePage';
import EndorsementsPage from './pages/endorsements/EndorsementsPage';
import EndorsementsList from './pages/endorsements/EndorsementsList';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProposalsList from './pages/projects/ProposalsList';
import SanctionedList from './pages/projects/SanctionedList';
import ConsultanciesPage from './pages/consultancies/ConsultanciesPage';
import TestingPage from './pages/testing/TestingPage';
import TrainingPage from './pages/training/TrainingPage';
import WorkshopsPage from './pages/workshops/WorkshopsPage';

function App() {
  const [page, setPage] = useState('home');

  const navigate = (target) => setPage(target);

  if (page === 'home') {
    return <ModulesPage onNavigate={navigate} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'profile':          return <ProfilePage />;
      case 'endorsements':     return <EndorsementsPage onNavigate={navigate} />;
      case 'endorsements-list':return <EndorsementsList onNavigate={navigate} />;
      case 'endorsements-new': return <div style={{color:'#fff',fontFamily:'Rajdhani',fontSize:22,padding:40}}>New Endorsement Form — Coming Soon</div>;
      case 'projects':         return <ProjectsPage onNavigate={navigate} />;
      case 'proposals':        return <ProposalsList onNavigate={navigate} />;
      case 'sanctioned':       return <SanctionedList onNavigate={navigate} />;
      case 'consultancies':    return <ConsultanciesPage onNavigate={navigate} />;
      case 'testing':          return <TestingPage />;
      case 'training':         return <TrainingPage />;
      case 'workshops':        return <WorkshopsPage />;
      default:                 return <ProfilePage />;
    }
  };

  return (
    <DashboardLayout activePage={page} onNavigate={navigate}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default App;