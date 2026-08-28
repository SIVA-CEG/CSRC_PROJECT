import React from 'react';
import './Navbar.css';
import annaLogo from "../../assets/anna-university-logo.png";
import csrcLogo from "../../assets/csrc-logo.png";
const Navbar = ({
  facultyName,

  onHome,

  onProfile,

  onLogout,

  onNavigateNotifications,
}) => {
  return (
    <nav className="navbar">
      {/* LEFT — Anna University Logo */}
      <div className="navbar-left">
        <img src={annaLogo} alt="Anna University" />
        <span className="institute-name">Anna University</span>
      </div>

      {/* CENTER — Nav Buttons */}
      <div className="navbar-center">
        <button className="nav-btn active" onClick={onHome}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>

        <button className="nav-btn" onClick={onProfile}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>

        <button
          className="nav-btn notif-btn"
          onClick={() => onNavigateNotifications()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span>Notifications</span>
          <span className="notif-badge"></span>
        </button>

        <button className="nav-btn logout-btn" onClick={onLogout}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* RIGHT — CSRC Logo */}
      <div className="navbar-right">
        <span className="csrc-label">CSRC</span>
        <img src={csrcLogo} alt="CSRC" />
      </div>
    </nav>
  );
};

export default Navbar;