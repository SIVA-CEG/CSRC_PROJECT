import React, { useRef, useState, useEffect } from "react";
import "./ProfilePage.css";

import {
  getProfile,
  updateProfile,
  uploadDocument,
} from "../../services/profileservices";
const CAMPUS_OPTIONS = [
  { campus: "ACT Campus", abbr: "ACT Campus" },
  { campus: "Anna University Regional Campus Madurai", abbr: "Madurai" },
  {
    campus: "Anna University Regional Centre, Tirunelveli",
    abbr: "RC Tirunelveli",
  },
  {
    campus: "Bharathidasan Institute of Technology (BIT) Campus",
    abbr: "BIT Campus",
  },
  {
    campus: "Bharathidasan Institute of Technology (BIT) Campus",
    abbr: "BITS",
  },
  { campus: "CEG Campus", abbr: "CEG Campus" },
  { campus: "Main Campus", abbr: "Main Campus" },
  { campus: "MIT Campus", abbr: "MIT Campus" },
  { campus: "Regional Campus Coimbatore", abbr: "RC Coimbatore" },
  { campus: "SAP Campus", abbr: "SAP Campus" },
  {
    campus:
      "University College of Engineering (VOC College of Engg.), Tuticorin",
    abbr: "UCE Tuticorin",
  },
  {
    campus:
      "University College of Engineering - Bharathidasan Institute of Technology, Tiruchirappalli",
    abbr: "UCE-BIT Campus",
  },
  {
    campus: "University College of Engineering - Dindigul",
    abbr: "UCE Dindigul",
  },
  {
    campus: "University College of Engineering - Kanchipuram",
    abbr: "UCE Kanchipuram",
  },
  {
    campus: "University College of Engineering Villupuram",
    abbr: "Villupuram",
  },
  {
    campus: "University College of Engineering, Ariyalur",
    abbr: "UCE Ariyalur",
  },
  { campus: "University College of Engineering, Arni", abbr: "UCE Arni" },
  {
    campus: "University College of Engineering, Dindugal",
    abbr: "UCE Dindugal",
  },
  { campus: "University College of Engineering, Madurai", abbr: "UCE Madurai" },
  {
    campus: "University College of Engineering, Nagercoil",
    abbr: "UCE Nagercoil",
  },
  { campus: "University College of Engineering, Panruti", abbr: "UCE Panruti" },
  {
    campus: "University College of Engineering, Pattukottai",
    abbr: "UCE Pattukottai",
  },
  {
    campus: "University College of Engineering, Ramanathapuram",
    abbr: "UCE Ramanathapuram",
  },
  {
    campus: "University College of Engineering, Thirukkuvalai",
    abbr: "UCE Thirukkuvalai",
  },
  {
    campus: "University College of Engineering, Tindivanam",
    abbr: "UCE Tindivanam",
  },
  {
    campus: "University College of Engineering, Tirunelveli",
    abbr: "UCE Tirunelveli",
  },
  { campus: "University College of Engineering, Trichy", abbr: "UCE Trichy" },
  {
    campus: "University College of Engineering, Villupuram",
    abbr: "UCE Villupuram",
  },
];
const DEPARTMENT_OPTIONS = [
  { department: "Anna University Sports Board", abbr: "AUSB" },
  { department: "AU-FRG Institute for CAD/CAM", abbr: "AU-FRG" },
  { department: "AU-KBC Research Centre", abbr: "AU-KBC" },
  { department: "Building Technology Centre", abbr: "BTC" },
  { department: "Centralized Procurement Office", abbr: "CPO" },
  { department: "CENTRE FOR ADMISSIONS", abbr: "CFA" },
  { department: "Centre for AeroSpace Research", abbr: "CASR" },
  {
    department: "Centre for Alumni Relations and Corporate Affairs",
    abbr: "CARCA",
  },
  {
    department:
      "Centre for Artificial Intelligence and Data Science Researchh & Applications",
    abbr: "CAInDRA",
  },
  { department: "Centre for Biotechnology", abbr: "CBT" },
  {
    department: "Centre for Blended Learning and Human Empowerment",
    abbr: "CBLHE",
  },
  {
    department: "Centre for Climate Change and Adaptation Research",
    abbr: "CCCAR",
  },
  {
    department: "Centre for Climate Change and Disaster Management",
    abbr: "CCCDM",
  },
  { department: "Centre for Composite Materials", abbr: "CCM" },
  { department: "Centre for Crystal Growth Centre", abbr: "CGC" },
  { department: "Centre for Cyber Security", abbr: "CCS" },
  {
    department: "Centre for Development of Tamil in Engineering and Technology",
    abbr: "CDT",
  },
  { department: "Centre for Disaster Mitigation and Management", abbr: "CDMM" },
  { department: "Centre for Distance Education", abbr: "CDE" },
  { department: "Centre for E-Vehicle Technology", abbr: "CEVT" },
  { department: "Centre for Energy Storage Technologies", abbr: "CEST" },
  { department: "Centre for Entrance Examinations", abbr: "CEE" },
  { department: "Centre for Entreprenurship Development", abbr: "CED" },
  { department: "Centre for Environmental Studies", abbr: "CES" },
  { department: "Centre for Excellence Building", abbr: "CEB" },
  { department: "Centre for Faculty & Professional Development", abbr: "CFPD" },
  { department: "Centre for Food Technology", abbr: "Food Tech" },
  { department: "Centre for Human Settlement", abbr: "CHS" },
  { department: "Centre for Immersive Technologies", abbr: "CIT" },
  { department: "Centre for Industrial Safety", abbr: "CIS" },
  { department: "Centre for Intellectural Property Rights", abbr: "IPR" },
  { department: "Centre for Internet of things", abbr: "CIOT" },
  { department: "Centre for Medical Electronics", abbr: "CME" },
  { department: "Centre For Research", abbr: "CR" },
  { department: "Centre for Robotics and Automation", abbr: "CRA" },
  { department: "Centre for Sponsored Research and Consultancy", abbr: "CSRC" },
  { department: "Centre for Survey Training and Research", abbr: "CSTAR" },
  { department: "Centre for Technology in Traditional Medicine", abbr: "CTTM" },
  {
    department: "Centre for University - Industry Collaboration",
    abbr: "CUIC",
  },
  { department: "Centre for Water Resources", abbr: "CWR" },
  { department: "Department of Aerospace Engineering", abbr: "Aero" },
  { department: "Department of Architecture", abbr: "Architecture" },
  { department: "Department of Automobile Engineering", abbr: "Auto" },
  { department: "Department of Bio-Technology", abbr: "Bio Tech" },
  { department: "Department of Biomedical Engineering", abbr: "Biomedical" },
  { department: "Department of Chemical Engineering", abbr: "Chemical" },
  { department: "Department of Chemistry", abbr: "Chemistry" },
  { department: "Department of Civil Engineering", abbr: "Civil" },
  { department: "Department of Computer Science and Engineering", abbr: "CSE" },
  {
    department: "Department of Electrical And Electronics Engineering",
    abbr: "EEE",
  },
  {
    department: "Department of Electronics And Communication Engineering",
    abbr: "ECE",
  },
  { department: "Department of Information Technology", abbr: "IT" },
  {
    department: "Department of Information Science And Technology",
    abbr: "IST",
  },
  { department: "Department of Management Studies", abbr: "MBA" },
  { department: "Department of Mathematics", abbr: "Maths" },
  { department: "Department of Mechanical Engineering", abbr: "Mech" },
  { department: "Department of Physics", abbr: "Physics" },
  { department: "Dr. Kalam Computing Centre", abbr: "KCC" },
  { department: "Finance Office", abbr: "FO" },
  { department: "Institute for Energy Studies", abbr: "IES" },
  { department: "Institute of Ocean Management", abbr: "IOM" },
  { department: "Institute of Remote Sensing", abbr: "IRS" },
  { department: "Knowledge Data Centre", abbr: "KDC" },
  { department: "Legal Office", abbr: "LO" },
  { department: "Naan Mudhalvan", abbr: "NM" },
  { department: "Planning & Development", abbr: "P&D" },
  { department: "Ramanujan Computing Centre", abbr: "RCC" },
  { department: "Technology Enabling Centre", abbr: "TEC" },
  { department: "The Controller of Examinations", abbr: "CoE" },
  { department: "University Library", abbr: "UL" },
  { department: "Vice Chancellor - Anna University", abbr: "VC" },
];

const DESIGNATION_OPTIONS = [
  { id: "32", designation: "Adjunct Faculty" },
  { id: "29", designation: "Adjunct Professor" },
  { id: "1", designation: "Assistant Professor" },
  { id: "4", designation: "Assistant Professor (Sl. Gr.)" },
  { id: "40", designation: "Assistant Professor (Sr. Gr.)" },
  { id: "17", designation: "Assistant Professor of Practice" },
  { id: "2", designation: "Associate Professor" },
  { id: "5", designation: "Associate Professor (Sl.Gr.)" },
  { id: "28", designation: "Consultant Project" },
  { id: "23", designation: "CSIR Research Associate" },
  { id: "20", designation: "Director" },
  { id: "15", designation: "DST INSPIRE Fellow" },
  { id: "18", designation: "DST-Inspire Faculty" },
  { id: "24", designation: "Head" },
  { id: "6", designation: "Lecturer" },
  { id: "30", designation: "Ph.D. Student" },
  { id: "27", designation: "Professional Assistant II" },
  { id: "3", designation: "Professor" },
  { id: "26", designation: "Professor and Head" },
  { id: "34", designation: "Professor of Eminence" },
  { id: "33", designation: "Professor of Practice" },
  { id: "39", designation: "Project Scholar" },
  { id: "13", designation: "Research Professor, Faculty Scientist" },
  { id: "9", designation: "Research Scholar" },
  { id: "10", designation: "Scientist" },
  { id: "22", designation: "Studentship" },
  { id: "41", designation: "Teaching Fellow" },
  { id: "14", designation: "The Controller of Examination" },
  { id: "19", designation: "The Coordinator" },
  { id: "12", designation: "UGC-Assistant Professor" },
  { id: "11", designation: "UGC-FRP Assistant Professor" },
  { id: "7", designation: "Women Scientist" },
  { id: "8", designation: "Young Scientist" },
];
/* ── Reusable plain field ── */
const Field = ({ label, value, sensitive, editable, onChange }) => (
  <div className="field-group">
    <span className="field-label">{label}</span>

    {editable ? (
      <input
        type="text"
        className="field-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <div className={`field-value ${sensitive ? "sensitive" : ""}`}>
        {value}
      </div>
    )}
  </div>
);

/* ── Date field: real <input type="date"> when editing, so the browser
   enforces a valid YYYY-MM-DD value instead of letting free text (e.g. a
   stray "4") reach the backend and crash the DB update. ── */
const DateField = ({ label, value, editable, onChange }) => {
  // `value` coming in is the raw ISO-ish value from the profile object
  // (e.g. "2005-01-04" or "2005-01-04T00:00:00.000Z"); <input type="date">
  // needs exactly "YYYY-MM-DD".
  const isoValue = value ? String(value).slice(0, 10) : "";

  return (
    <div className="field-group">
      <span className="field-label">{label}</span>
      {editable ? (
        <input
          type="date"
          className="field-input"
          value={isoValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="field-value">
          {isoValue ? new Date(isoValue).toLocaleDateString("en-GB") : ""}
        </div>
      )}
    </div>
  );
};
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
const DocRow = ({ label, fileKey, docState, onUpload, isEditing }) => {
  const inputRef = useRef(null);
  const doc = docState[fileKey];

  const handleView = () => {
    if (doc?.url) window.open(`http://localhost:5000${doc.url}`, "_blank");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000${doc.url}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      alert("Download failed");
    }
  };

  return (
    <div className="doc-row">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="doc-file-input"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && onUpload) {
            onUpload(fileKey, file);
          }
        }}
      />

      {/* Doc info */}
      <div className="doc-info">
        <div className="doc-name">{label}</div>
        <div
          className={`doc-status ${doc?.uploaded ? "uploaded" : "not-uploaded"}`}
        >
          <span className="doc-status-dot" />
          {doc?.uploaded ? "Document uploaded" : "Not uploaded"}
        </div>
        {doc?.file && <div className="doc-filename">{doc.file.name}</div>}
      </div>

      {/* Action buttons */}
      <div className="doc-actions">
        {/* Upload */}
        {isEditing && (
          <button
            className="doc-btn upload"
            onClick={() => inputRef.current.click()}
            title="Upload document"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {doc?.uploaded ? "Replace" : "Upload"}
          </button>
        )}

        {/* View */}
        <button
          className="doc-btn view"
          onClick={handleView}
          disabled={!doc?.uploaded}
          title="View document"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

/* ── Main Profile Page ── */
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      await updateProfile(user.id, profile);
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Update failed");
    }
  };
  const handleUpload = async (key, file) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const formData = new FormData();
      formData.append("document", file);
      formData.append("userId", user.id);
      formData.append("documentType", key);

      await uploadDocument(formData);
      alert("Document uploaded");

      // REFRESH PROFILE
      const updated = await getProfile(user.id);
      setProfile(updated.data);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const res = await getProfile(user.id);
        setProfile(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          Home / <span>Profile</span>
        </div>
        <h1 className="page-title">User Profile</h1>
      </div>

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-photo-wrap">
          <div className="profile-photo">
            {profile?.staff_name
              ? profile.staff_name.substring(0, 2).toUpperCase()
              : "AU"}
          </div>
          <button className="photo-upload-btn" title="Upload photo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>
        </div>
        <div className="profile-hero-info">
          <div className="profile-name">
            {profile?.salutation} {profile?.initial} {profile?.staff_name}
          </div>
          <div className="profile-designation">
            {profile?.designation}
            {" — "}
            {profile?.department}
          </div>
          <div className="profile-tags">
            <span className="profile-tag">{profile?.campus || ""}</span>
            <span className="profile-tag">
              Staff ID: {profile?.user_id || ""}
            </span>
            <span className="profile-tag">
              Intercom: {profile?.intercom || ""}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        {/* ── Personal Info ── */}
        <SectionCard
          title="Personal Information"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          }
        >
          <div className="fields-grid">
            <Field label="Staff ID" value={profile?.user_id || ""} />

            <Field
              label="Salutation"
              value={profile?.salutation || ""}
              editable={isEditing}
              onChange={(value) => handleChange("salutation", value)}
            />

            <Field
              label="Initial"
              value={profile?.initial || ""}
              editable={isEditing}
              onChange={(value) => handleChange("initial", value)}
            />

            <Field
              label="Staff Name"
              value={profile?.staff_name || ""}
              editable={isEditing}
              onChange={(value) => handleChange("staff_name", value)}
            />

            <div className="field-group">
              <span className="field-label">Designation</span>

              {isEditing ? (
                <select
                  className="field-input"
                  value={profile?.designation || ""}
                  onChange={(e) => handleChange("designation", e.target.value)}
                >
                  <option value="">Select Designation</option>

                  {DESIGNATION_OPTIONS.map((item) => (
                    <option key={item.id} value={item.designation}>
                      {item.designation}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="field-value">{profile?.designation || ""}</div>
              )}
            </div>

            <div className="field-group">
              <span className="field-label">Department</span>

              {isEditing ? (
                <select
                  className="field-input"
                  value={profile?.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                >
                  <option value="">Select Department</option>

                  {DEPARTMENT_OPTIONS.map((item) => (
                    <option key={item.abbr} value={item.department}>
                      {item.department}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="field-value">{profile?.department || ""}</div>
              )}
            </div>

            <div className="field-group">
              <span className="field-label">Campus</span>

              {isEditing ? (
                <select
                  className="field-input"
                  value={profile?.campus || ""}
                  onChange={(e) => handleChange("campus", e.target.value)}
                >
                  <option value="">Select Campus</option>

                  {CAMPUS_OPTIONS.map((item) => (
                    <option key={item.campus} value={item.campus}>
                      {item.campus}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="field-value">{profile?.campus || ""}</div>
              )}
            </div>

            <Field
              label="Intercom"
              value={profile?.intercom || ""}
              editable={isEditing}
              onChange={(value) => handleChange("intercom", value)}
            />

            <Field
              label="Mobile"
              value={profile?.mobile || ""}
              editable={isEditing}
              onChange={(value) => handleChange("mobile", value)}
            />

            <Field
              label="Email ID"
              value={JSON.parse(sessionStorage.getItem("user"))?.email || ""}
            />

            <DateField
              label="Date of Birth"
              value={profile?.dob}
              editable={isEditing}
              onChange={(value) => handleChange("dob", value)}
            />

            <DateField
              label="Date of Service"
              value={profile?.dos}
              editable={isEditing}
              onChange={(value) => handleChange("dos", value)}
            />

            <DateField
              label="Date of Superannuation"
              value={profile?.superannuation_date}
              editable={isEditing}
              onChange={(value) => handleChange("superannuation_date", value)}
            />
          </div>
        </SectionCard>

        {/* ── Identity Documents ── */}
        <SectionCard
          title="Identity Documents"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          }
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field
              label="Aadhaar Number"
              value={profile?.aadhaar_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) => handleChange("aadhaar_number", value)}
            />

            <Field
              label="PAN Number"
              value={profile?.pan_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) => handleChange("pan_number", value)}
            />
          </div>

          <div className="doc-grid">
            <DocRow
              label="Aadhaar Card"
              fileKey="aadhaar"
              isEditing={isEditing}
              docState={{
                aadhaar: {
                  uploaded: !!profile?.aadhaar_file,
                  url: profile?.aadhaar_file,
                  file: { name: "Aadhaar Card" },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />

            <DocRow
              label="PAN Card"
              fileKey="pan"
              isEditing={isEditing}
              docState={{
                pan: {
                  uploaded: !!profile?.pan_file,
                  url: profile?.pan_file,
                  file: { name: "PAN Card" },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />
          </div>
        </SectionCard>

        {/* ── Bank Details ── */}
        <SectionCard
          title="Bank Details"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 9l9-5 9 5v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
              <polyline points="9 22 9 13 15 13 15 22" />
            </svg>
          }
        >
          <div className="fields-grid" style={{ marginBottom: 20 }}>
            <Field
              label="Bank Name"
              value={profile?.bank_name || ""}
              editable={isEditing}
              onChange={(value) => handleChange("bank_name", value)}
            />

            <Field
              label="Branch"
              value={profile?.branch || ""}
              editable={isEditing}
              onChange={(value) => handleChange("branch", value)}
            />

            <Field
              label="Account Number"
              value={profile?.account_number || ""}
              sensitive
              editable={isEditing}
              onChange={(value) => handleChange("account_number", value)}
            />

            <Field
              label="IFSC Code"
              value={profile?.ifsc_code || ""}
              editable={isEditing}
              onChange={(value) => handleChange("ifsc_code", value)}
            />

            <Field
              label="Account Type"
              value={profile?.account_type || ""}
              editable={isEditing}
              onChange={(value) => handleChange("account_type", value)}
            />
          </div>

          <div className="doc-grid">
            <DocRow
              label=" Bank Passbook "
              fileKey="passbookOrCheque"
              isEditing={isEditing}
              docState={{
                passbookOrCheque: {
                  uploaded: !!profile?.passbook_file,
                  url: profile?.passbook_file,
                  file: { name: "Passbook / Cancelled Cheque" },
                },
              }}
              onUpload={isEditing ? handleUpload : null}
            />
          </div>
        </SectionCard>
        <button
          className="update-btn"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Save Profile" : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;