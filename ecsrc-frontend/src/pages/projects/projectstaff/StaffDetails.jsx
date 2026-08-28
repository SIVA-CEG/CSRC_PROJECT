import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectStaffPage.css";

// ── Sample data ──────────────────────────────────────────

const DESIGNATIONS = [
  "Junior Research Fellow",
  "Senior Research Fellow",
  "Project Assistant",
  "Research Scholar",
  "Post-Doctoral Fellow",
  "Project Associate",
  "Project Scientist",
];
const DEGREES = ["M.E.", "M.Tech", "M.Sc", "B.E.", "Ph.D", "MBA", "MCA"];
const SUBJECTS = [
  "MECHANICAL ENGINEERING",
  "CIVIL ENGINEERING",
  "COMPUTER SCIENCE",
  "ELECTRONICS ENGINEERING",
  "CHEMISTRY",
  "PHYSICS",
  "BIOTECHNOLOGY",
  "MATHEMATICS",
];
const BANKS = [
  "STATE BANK OF INDIA",
  "INDIAN BANK",
  "CANARA BANK",
  "BANK OF BARODA",
  "HDFC BANK",
  "ICICI BANK",
  "AXIS BANK",
  "STANDARD CHARTERED BANK",
  "STATE BANK OF INDIA & OMALUR BRANCH",
  "STATE BANK OF INDIA , ALWARPET",
];

//const STATUSES = ["Service", "Resigned", "Promoted", "Relieved"];
const SALUTATIONS = ["Mr", "Ms", "Mrs", "Dr"];

const emptyForm = {
  salutation: "",
  initial: "",
  name: "",
  designation: "",
  degree: "",
  subject: "",
  startDate: "",
  mobile: "",
  email: "",
  aadhar: "",
  phdReg: "",
  accountNo: "",
  bankName: "",
  ifsc: "",
  pan: "",
  projectId: "",
  salaryHead: "",
  status: "Service",
};

// ── Project Selector ──────────────────────────────────────
const ProjectSelector = ({ selectedProject, onChange, projects }) => (
  <div className="ps-project-selector-bar">
    <div className="ps-project-selector-inner">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          width: 16,
          height: 16,
          color: "#9ca3af",
          flexShrink: 0,
        }}
      >
        <path d="M3 7a2 2 0 012-2h4l2 3H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
      <label
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 13,
          color: "#6b7280",
          whiteSpace: "nowrap",
        }}
      >
        Select Project
      </label>
      <select
        className="ps-select"
        style={{ flex: 1, maxWidth: 420 }}
        value={selectedProject}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Choose a Project --</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.project_title}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// ── Staff List View ──────────────────────────────────────
// CHANGED: added onDelete prop + delete button per row
const StaffList = ({ staff, projectId, onAdd, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const filtered = staff.filter(
    (s) => Number(s.project_id) === Number(projectId),
  );
  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  //const project = PROJECTS.find((p) => p.id === projectId);

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Details</div>
          <div className="ps-inner-sub">Project Staff Management</div>
        </div>
        <button className="ps-add-btn ps-btn-primary orange" onClick={onAdd}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Staff to Project
        </button>
      </div>

      <div className="ps-table-card">
        {total === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "#9ca3af",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14,
            }}
          >
            No staff assigned to this project yet.
          </div>
        ) : (
          <div className="ps-table-wrap">
            <table className="ps-table">
              <thead>
                <tr>
                  <th className="ps-sl-num">Sl. No.</th>
                  <th>Staff Name</th>
                  <th>Designation</th>
                  <th>Mobile</th>
                  <th>Service Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s, i) => (
                  <tr key={s.id}>
                    <td className="ps-sl-num">
                      {(page - 1) * PER_PAGE + i + 1}
                    </td>
                    <td className="ps-name-cell">
                      {s.salutation} {s.staff_name} {s.initial}
                    </td>
                    <td>{s.designation}</td>
                    <td
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        color: "#6b7280",
                      }}
                    >
                      {s.mobile}
                    </td>
                    <td
                      style={{
                        color: "#6b7280",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {s.status === "pending" ||
                      s.status === "Pending" ||
                      !s.status
                        ? "Yet to be Appointed"
                        : s.contract_period_from && s.contract_period_upto
                          ? `${new Date(s.contract_period_from).toLocaleDateString("en-GB")} – ${new Date(s.contract_period_upto).toLocaleDateString("en-GB")}`
                          : s.contract_period_from
                            ? `From ${new Date(s.contract_period_from).toLocaleDateString("en-GB")}`
                            : "Yet to be Appointed"}
                    </td>
                    <td>
                      <span
                        className={`ps-badge ${s.status === "Service" ? "verified" : "pending"}`}
                      >
                        <span className="ps-badge-dot" />
                        {s.status === "Service"
                          ? "VERIFIED"
                          : s.status.toUpperCase()}
                      </span>
                    </td>
                    {/* CHANGED: added delete button alongside edit */}
                    <td>
                      <div className="ps-action-group">
                        <button
                          className="ps-icon-btn edit"
                          title="Edit"
                          onClick={() => onEdit(s)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="ps-icon-btn danger"
                          title="Delete Staff"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remove ${s.salutation} ${s.staff_name} ${s.initial} from this project?`,
                              )
                            ) {
                              onDelete(s.id);
                            }
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && (
          <div className="ps-pagination">
            <span className="ps-page-info">
              {page} of {Math.max(1, Math.ceil(total / PER_PAGE))} pages —{" "}
              {total} records
            </span>
            <div className="ps-page-btns">
              <button
                className="ps-page-btn"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / PER_PAGE)}
              >
                Next
              </button>
              <button
                className="ps-page-btn"
                onClick={() => setPage(Math.ceil(total / PER_PAGE))}
                disabled={page >= Math.ceil(total / PER_PAGE)}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ── Staff Form (Add / Edit) ──────────────────────────────
const StaffForm = ({ initial, isEdit, projectId, onSave, onBack }) => {
  const [form, setForm] = useState(
    initial
      ? {
          ...emptyForm,
          ...initial,
          name: initial.staff_name || initial.name || "",
          aadhar: initial.aadhaar || initial.aadhar || "",
          phdReg: initial.phd_registration_no || initial.phdReg || "",
          accountNo: initial.account_number || initial.accountNo || "",
          bankName: initial.bank_name || initial.bankName || "",
          ifsc: initial.ifsc_code || initial.ifsc || "",
          pan: initial.pan_number || initial.pan || "",
          projectId: projectId || "",
        }
      : { ...emptyForm, projectId: projectId || "" },
  );
  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  //const project = PROJECTS.find((p) => p.id === (form.projectId || projectId));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">
            {isEdit
              ? "Editing Staff Details..."
              : "Adding New Project Staff..."}
          </div>
          <div className="ps-inner-sub">Selected Project</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      <div className="ps-form-panel">
        <div className="ps-form-section-label">Personal Information</div>

        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "100px 90px 1fr 1fr" }}
        >
          <div className="ps-field">
            <label>
              Salutation<span className="req">*</span>
            </label>
            <select
              className="ps-select"
              value={form.salutation}
              onChange={(e) => upd("salutation", e.target.value)}
            >
              <option value="">--</option>
              {SALUTATIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="ps-field">
            <label>Initial</label>
            <input
              className="ps-input"
              value={form.initial}
              onChange={(e) => upd("initial", e.target.value)}
            />
          </div>

          <div className="ps-field">
            <label>
              Staff Name<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
            />{" "}
          </div>

          <div className="ps-field">
            <label>
              Designation<span className="req">*</span>
            </label>
            <select
              className="ps-select"
              value={form.designation}
              onChange={(e) => upd("designation", e.target.value)}
            >
              {" "}
              <option value="">--Select--</option>
              {DESIGNATIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "160px 1fr 180px 1fr" }}
        >
          <div className="ps-field">
            <label>
              Degree<span className="req">*</span>
            </label>
            <select
              className="ps-select"
              value={form.degree}
              onChange={(e) => upd("degree", e.target.value)}
            >
              <option value="">--Select--</option>
              {DEGREES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="ps-field">
            <label>
              Subject<span className="req">*</span>
            </label>
            <select
              className="ps-select"
              value={form.subject}
              onChange={(e) => upd("subject", e.target.value)}
            >
              <option value="">--Select--</option>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div
            className="ps-field"
            style={{ gridTemplateColumns: "1fr 200px 1fr" }}
          >
            <label>
              Mobile<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="Mobile"
              value={form.mobile}
              onChange={(e) => upd("mobile", e.target.value)}
            />
          </div>
        </div>

        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 200px 1fr" }}
        >
          <div className="ps-field">
            <label>Email ID</label>
            <input
              className="ps-input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Aadhar<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="Aadhar"
              value={form.aadhar}
              onChange={(e) => upd("aadhar", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>Ph.D. Registration No</label>
            <input
              className="ps-input"
              placeholder="Ph.D Reg No"
              value={form.phdReg}
              onChange={(e) => upd("phdReg", e.target.value)}
            />
          </div>
        </div>

        <div className="ps-form-section-label" style={{ marginTop: 8 }}>
          Bank Details
        </div>
        <div
          className="ps-form-grid"
          style={{ gridTemplateColumns: "1fr 1fr 180px 160px" }}
        >
          <div className="ps-field">
            <label>
              Account Number<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="Account No"
              value={form.accountNo}
              onChange={(e) => upd("accountNo", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>
              Bank Name<span className="req">*</span>
            </label>
            <select
              className="ps-select"
              value={form.bankName}
              onChange={(e) => upd("bankName", e.target.value)}
            >
              <option value="">--Select--</option>
              {BANKS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="ps-field">
            <label>
              IFSC Code<span className="req">*</span>
            </label>
            <input
              className="ps-input"
              placeholder="IFSC Code"
              value={form.ifsc}
              onChange={(e) => upd("ifsc", e.target.value)}
            />
          </div>
          <div className="ps-field">
            <label>PAN Number</label>
            <input
              className="ps-input"
              placeholder="PAN"
              value={form.pan}
              onChange={(e) => upd("pan", e.target.value)}
            />
          </div>
        </div>

        <div className="ps-form-actions">
          <button
            className="ps-btn-primary orange"
            onClick={() => onSave(form)}
          >
            {isEdit ? "Update" : "Add"}
          </button>
          <button className="ps-btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

// ── Main StaffDetails Component ──────────────────────────
const StaffDetails = ({ onBack }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/projects/eligible-staff-projects",
      );

      console.log("PROJECTS", res.data);

      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const [selectedProject, setSelectedProject] = useState("");
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    if (selectedProject) {
      fetchStaff(selectedProject);
    }
  }, [selectedProject]);

  const fetchStaff = async (projectId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/project-staff/project/${projectId}`,
      );
      console.log("STAFF DATA", res.data);
      setStaff(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [view, setView] = useState("list"); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);

  const handleSave = async (form) => {
    try {
      const payload = {
        project_id: selectedProject,
        salutation: form.salutation,
        initial: form.initial,
        staff_name: form.name || form.staff_name,
        designation: form.designation,
        degree: form.degree,
        subject: form.subject,
        mobile: form.mobile,
        email: form.email,
        aadhaar: form.aadhar || form.aadhaar,
        phd_registration_no: form.phdReg || form.phd_registration_no,
        account_number: form.accountNo || form.account_number,
        bank_name: form.bankName || form.bank_name,
        ifsc_code: form.ifsc || form.ifsc_code,
        pan_number: form.pan || form.pan_number,
      };

      if (view === "edit" && editTarget?.id) {
        await axios.put(
          `http://localhost:5000/api/project-staff/${editTarget.id}`,
          payload,
        );
        alert("Staff Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/project-staff/create",
          payload,
        );
        alert("Staff Added Successfully");
      }

      await fetchStaff(selectedProject);
      setView("list");
    } catch (err) {
      console.log(err);
      alert("Failed to save staff");
    }
  };

  // CHANGED: delete handler passed down to StaffList
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/project-staff/${id}`);
      await fetchStaff(selectedProject);
    } catch (err) {
      console.log(err);
      alert("Failed to delete staff");
    }
  };

  return (
    <div className="ps-inner">
      <div style={{ marginBottom: 20 }}>
        <button className="ps-back-btn" onClick={onBack}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Project Staff
        </button>
      </div>

      {view === "list" && (
        <>
          <ProjectSelector
            selectedProject={selectedProject}
            projects={projects}
            onChange={(p) => {
              setSelectedProject(p);
            }}
          />
          {selectedProject ? (
            <StaffList
              staff={staff}
              projectId={selectedProject}
              onAdd={() => setView("add")}
              onEdit={(s) => {
                setEditTarget(s);
                setView("edit");
              }}
              onDelete={handleDelete}
            />
          ) : (
            <div
              className="ps-table-card"
              style={{ padding: "48px 20px", textAlign: "center" }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 14,
                }}
              >
                Please select a project above to view its staff.
              </div>
            </div>
          )}
        </>
      )}

      {view === "add" && (
        <StaffForm
          isEdit={false}
          projectId={selectedProject}
          onSave={handleSave}
          onBack={() => setView("list")}
        />
      )}
      {view === "edit" && (
        <StaffForm
          isEdit
          initial={editTarget}
          projectId={selectedProject}
          onSave={handleSave}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
};

export default StaffDetails;
