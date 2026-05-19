import React, { useState } from 'react';
import Navbar from '../components/modules/Navbar';
import SectionCard from '../components/modules/SectionCard';
import ModulesBackground from '../components/modules/ModulesBackground';
import './ModulesPage.css';

const sections = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Manage and track all ongoing and completed research projects under your supervision.',
    tag: 'Research & Development',
    color: '#00b4ff',
    glow: 'rgba(0, 180, 255, 0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M17.5 14v6M14.5 17h6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'consultancies',
    title: 'Consultancies',
    description: 'View and manage industry consultancy engagements, agreements, and client records.',
    tag: 'Industry Collaboration',
    color: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: 'testing',
    title: 'Testing',
    description: 'Access lab testing requests, equipment schedules, and test result documentation.',
    tag: 'Lab & QA',
    color: '#34d399',
    glow: 'rgba(52, 211, 153, 0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l-4 4h14l-4-4V3"/>
        <path d="M5 9h14" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'training',
    title: 'Training',
    description: 'Schedule and oversee faculty and student training programs, certifications, and sessions.',
    tag: 'Skill Development',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'workshops',
    title: 'Workshops',
    description: 'Plan, organize, and review workshops, seminars, and outreach events conducted by CSRC.',
    tag: 'Events & Outreach',
    color: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.35)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
      </svg>
    ),
  },
];

const ModulesPage = ({ onNavigate }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardClick = (id) => {
    if (onNavigate) onNavigate(id);
  };

  return (
    <div className="modules-page">
      <ModulesBackground />
      <Navbar facultyName="Dr. S. Balasivanandha Prabu" />

      <main className="modules-main">
        {/* Header */}
        <div className="modules-header">
          <div className="header-badge">Faculty Dashboard</div>
          <h1 className="modules-title">
            Welcome back, <span className="title-highlight">Dr. Faculty</span>
          </h1>
          <p className="modules-subtitle">
            Select a module below to manage your activities within CSRC
          </p>
        </div>

        {/* Cards Grid */}
        <div className="modules-grid">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="card-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(section.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <SectionCard
                {...section}
                onClick={() => handleCardClick(section.id)}
              />
            </div>
          ))}
        </div>

        {/* Footer strip */}
        <div className="modules-footer">
          <span>CSRC — Centre for Scientific Research & Consultancy</span>
          <span className="footer-dot">·</span>
          <span>Anna University</span>
        </div>
      </main>
    </div>
  );
};

export default ModulesPage;