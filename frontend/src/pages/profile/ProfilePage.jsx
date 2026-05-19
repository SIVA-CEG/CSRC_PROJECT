import React, { useRef, useState } from 'react';
import './ProfilePage.css';

/* ── Reusable plain field ── */
const Field = ({ label, value, sensitive }) => (
  <div className="field-group">
    <span className="field-label">{label}</span>
    <div className={`field-value ${sensitive ? 'sensitive' : ''}`}>{value}</div>
  </div>
);

/* ── Section wrapper ── */
const SectionCard = ({ title, icon, children }) => (
  <div className="profile-section-card">
    <div className="section-card-header">
      {icon}
      <h3>{title}</h3>
    </div>
    <div className="section-card-body">{children}</div>
  </div>
);

/* ── Document Row ── */
const DocRow = ({ label, fileKey, docState, onUpload }) => {
  const inputRef = useRef(null);
  const doc = docState[fileKey];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(fileKey, file);
  };

  const handleView = () => {
    if (doc?.url) window.open(doc.url, '_blank');
  };

  const handleDownload = () => {
    if (!doc?.url) return;
    const a = document.createElement('a');
    a.href = doc.url;
    a.download = doc.file.name;
    a.click();
  };

  return (
    <div className="doc-row">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="doc-file-input"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />

      {/* Doc info */}
      <div className="doc-info">
        <div className="doc-name">{label}</div>
        <div className={`doc-status ${doc?.uploaded ? 'uploaded' : 'not-uploaded'}`}>
          <span className="doc-status-dot" />
          {doc?.uploaded ? 'Document uploaded' : 'Not uploaded'}
        </div>
        {doc?.file && (
          <div className="doc-filename">{doc.file.name}</div>
        )}
      </div>

      {/* Action buttons */}
      <div className="doc-actions">
        {/* Upload */}
        <button
          className="doc-btn upload"
          onClick={() => inputRef.current.click()}
          title="Upload document"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          {doc?.uploaded ? 'Replace' : 'Upload'}
        </button>

        {/* View */}
        <button
          className="doc-btn view"
          onClick={handleView}
          disabled={!doc?.uploaded}
          title="View document"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          View
        </button>

        {/* Download */}
        <button
          className="doc-btn download"
          onClick={handleDownload}
          disabled={!doc?.uploaded}
          title="Download document"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

/* ── Main Profile Page ── */
const ProfilePage = () => {
  const [docState, setDocState] = useState({
    aadhaar:    { uploaded: false, file: null, url: null },
    pan:        { uploaded: false, file: null, url: null },
    passbookOrCheque: { uploaded: false, file: null, url: null },
    bankLetter: { uploaded: false, file: null, url: null },
  });

  const handleUpload = (key, file) => {
    const url = URL.createObjectURL(file);
    setDocState(prev => ({
      ...prev,
      [key]: { uploaded: true, file, url },
    }));
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-breadcrumb">Home / <span>Profile</span></div>
        <h1 className="page-title">User Profile</h1>
      </div>

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-photo-wrap">
          <div className="profile-photo">BP</div>
          <button className="photo-upload-btn" title="Upload photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
        <div className="profile-hero-info">
          <div className="profile-name">Dr. S. Balasivanandha Prabu</div>
          <div className="profile-designation">Professor — Department of Mechanical Engineering</div>
          <div className="profile-tags">
            <span className="profile-tag">CEG Campus</span>
            <span className="profile-tag">Staff ID: 62300</span>
            <span className="profile-tag">Intercom: 22357747</span>
          </div>
        </div>
      </div>

      <div className="profile-sections">

        {/* ── Personal Info ── */}
        <SectionCard
          title="Personal Information"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
        >
          <div className="fields-grid">
            <Field label="Staff ID"              value="62300" />
            <Field label="Salutation"            value="Dr." />
            <Field label="Initial"               value="S." />
            <Field label="Staff Name"            value="Balasivanandha Prabu" />
            <Field label="Designation"           value="Professor" />
            <Field label="Department"            value="Department of Mechanical Engineering" />
            <Field label="Campus"                value="CEG Campus" />
            <Field label="Intercom"              value="22357747" />
            <Field label="Mobile"                value="9600105714" />
            <Field label="Email ID"              value="sivanandha@annauniv.edu" />
            <Field label="Date of Birth"         value="05-04-1977" />
            <Field label="Date of Service"       value="18-02-2005" />
            <Field label="Date of Superannuation" value="05-04-2037" />
          </div>
          <button className="update-btn">Update Profile</button>
        </SectionCard>

        {/* ── Identity Documents ── */}
        <SectionCard
          title="Identity Documents"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field label="Aadhaar Number" value="XXXX XXXX 1234" sensitive />
            <Field label="PAN Number"     value="ABCDE1234F"     sensitive />
          </div>

          <div className="doc-grid">
            <DocRow
              label="Aadhaar Card"
              fileKey="aadhaar"
              docState={docState}
              onUpload={handleUpload}
            />
            <DocRow
              label="PAN Card"
              fileKey="pan"
              docState={docState}
              onUpload={handleUpload}
            />
          </div>
        </SectionCard>

        {/* ── Bank Details ── */}
        <SectionCard
          title="Bank Details"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-5 9 5v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/><polyline points="9 22 9 13 15 13 15 22"/></svg>}
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field label="Bank Name"       value="State Bank of India" />
            <Field label="Branch"          value="Anna University Branch" />
            <Field label="Account Number"  value="XXXXXXXXXXXX1234" sensitive />
            <Field label="IFSC Code"       value="SBIN0006756" />
            <Field label="Account Type"    value="Savings" />
          </div>

          <div className="doc-grid">
            <DocRow
              label="Passbook / Cancelled Cheque"
              fileKey="passbookOrCheque"
              docState={docState}
              onUpload={handleUpload}
            />
            <DocRow
              label="Bank Authorization Letter"
              fileKey="bankLetter"
              docState={docState}
              onUpload={handleUpload}
            />
          </div>
        </SectionCard>

      </div>
    </div>
  );
};

export default ProfilePage;