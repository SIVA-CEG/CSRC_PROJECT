import React, { useState } from 'react';
import Navbar from '../components/modules/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import ModulesBackground from '../components/modules/ModulesBackground';
import './DashboardLayout.css';

const DashboardLayout = ({ children, activePage, onNavigate }) => {
  return (
    <div className="dashboard-layout">
      <ModulesBackground />
      <Navbar facultyName="Dr. S. Balasivanandha Prabu" />
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;