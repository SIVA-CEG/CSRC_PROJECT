import React, { useState } from 'react';
import './ProjectStaffPage.css';

// ── Sample data ──────────────────────────────────────────
const INIT_STAFF = [
  {
    id: 1, salutation: 'Mr', initial: 'J', name: 'VENKADANATHAN',
    designation: 'Junior Research Fellow', degree: 'M.E.',
    subject: 'MECHANICAL ENGINEERING', startDate: '21-12-2022',
    mobile: '9751006781', email: 'vnathan.98@gmail.com',
    aadhar: '821029018361', phdReg: '0',
    accountNo: '20162590992', bankName: 'STATE BANK OF INDIA',
    ifsc: 'SBIN0011071', pan: 'AVCPV1335N',
    project: '2433/CSRC-2/2020',
    salaryHead: 'Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)',
    status: 'Service',
  },
  {
    id: 2, salutation: 'Mr', initial: 'V', name: 'VETRI VEL',
    designation: 'Junior Research Fellow', degree: 'M.E.',
    subject: 'MECHANICAL ENGINEERING', startDate: '05-07-2021',
    mobile: '7639765043', email: 'vetri@gmail.com',
    aadhar: '912345678901', phdReg: '1',
    accountNo: '30172890991', bankName: 'STATE BANK OF INDIA',
    ifsc: 'SBIN0011072', pan: 'BVCPV1234N',
    project: '2433/CSRC-2/2020',
    salaryHead: 'Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)',
    status: 'Service',
  },
];

const DESIGNATIONS = ['Junior Research Fellow', 'Senior Research Fellow', 'Project Assistant', 'Research Scholar', 'Post-Doctoral Fellow', 'Project Associate', 'Project Scientist'];
const DEGREES = ['M.E.', 'M.Tech', 'M.Sc', 'B.E.', 'Ph.D', 'MBA', 'MCA'];
const SUBJECTS = ['MECHANICAL ENGINEERING', 'CIVIL ENGINEERING', 'COMPUTER SCIENCE', 'ELECTRONICS ENGINEERING', 'CHEMISTRY', 'PHYSICS', 'BIOTECHNOLOGY', 'MATHEMATICS'];
const BANKS = ['STATE BANK OF INDIA', 'INDIAN BANK', 'CANARA BANK', 'BANK OF BARODA', 'HDFC BANK', 'ICICI BANK', 'AXIS BANK', 'STANDARD CHARTERED BANK', 'STATE BANK OF INDIA & OMALUR BRANCH', 'STATE BANK OF INDIA , ALWARPET'];
const SALARY_HEADS = ['Manpower (1 JRF @ Rs.31000/- p.m. + 24% HRA)', 'Manpower : JRF-one @ Rs.14,000/- pm', 'Staff'];
const STATUSES = ['Service', 'Resigned', 'Promoted', 'Relieved'];
const PROJECTS = ['2433/CSRC-2/2020', '721/CSRC-2/2013', '1234/CSRC-2/2025'];
const SALUTATIONS = ['Mr', 'Ms', 'Mrs', 'Dr'];

const emptyForm = {
  salutation: '', initial: '', name: '', designation: '', degree: '',
  subject: '', startDate: '', mobile: '', email: '', aadhar: '', phdReg: '',
  accountNo: '', bankName: '', ifsc: '', pan: '',
  project: '', salaryHead: '', status: 'Service',
};

// ── Staff List View ──────────────────────────────────────
const StaffList = ({ staff, onAdd, onEdit }) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const total = staff.length;
  const paginated = staff.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Details</div>
          <div className="ps-inner-sub">Master / Project Staff</div>
        </div>
        <button className="ps-add-btn ps-btn-primary orange" onClick={onAdd}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Staff
        </button>
      </div>

      <div className="ps-table-card">
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
                  <td className="ps-sl-num">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="ps-name-cell">{s.salutation} {s.name} {s.initial}</td>
                  <td>{s.designation}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{s.mobile}</td>
                  <td style={{ color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{s.startDate}</td>
                  <td>
                    <span className={`ps-badge ${s.status === 'Service' ? 'verified' : 'pending'}`}>
                      <span className="ps-badge-dot"/>
                      {s.status === 'Service' ? 'VERIFIED' : s.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="ps-action-group">
                      <button className="ps-icon-btn edit" title="Edit" onClick={() => onEdit(s)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ps-pagination">
          <span className="ps-page-info">{page} of {Math.max(1, Math.ceil(total / PER_PAGE))} pages — {total} records</span>
          <div className="ps-page-btns">
            <button className="ps-page-btn" onClick={() => setPage(1)} disabled={page === 1}>First</button>
            <button className="ps-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <button className="ps-page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / PER_PAGE)}>Next</button>
            <button className="ps-page-btn" onClick={() => setPage(Math.ceil(total / PER_PAGE))} disabled={page >= Math.ceil(total / PER_PAGE)}>Last</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Staff Form (Add / Edit) ──────────────────────────────
const StaffForm = ({ initial, isEdit, onSave, onBack }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">{isEdit ? 'Editing Staff Details...' : 'Adding New Project Staff...'}</div>
          <div className="ps-inner-sub">Master / Staff</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div className="ps-form-panel">
        {/* Row 1 — Name */}
        <div className="ps-form-section-label">Personal Information</div>
        <div className="ps-form-grid" style={{ gridTemplateColumns: '100px 90px 1fr 1fr' }}>
          <div className="ps-field">
            <label>Salutation<span className="req">*</span></label>
            <select className="ps-select" value={form.salutation} onChange={e => upd('salutation', e.target.value)}>
              <option value="">--</option>
              {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Initial</label>
            <input className="ps-input" placeholder="J" value={form.initial} onChange={e => upd('initial', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Staff Name<span className="req">*</span></label>
            <input className="ps-input" placeholder="Staff Name" value={form.name} onChange={e => upd('name', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Designation<span className="req">*</span></label>
            <select className="ps-select" value={form.designation} onChange={e => upd('designation', e.target.value)}>
              <option value="">--Select--</option>
              {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2 — Academic */}
        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 1fr 180px 1fr' }}>
          <div className="ps-field">
            <label>Degree<span className="req">*</span></label>
            <select className="ps-select" value={form.degree} onChange={e => upd('degree', e.target.value)}>
              <option value="">--Select--</option>
              {DEGREES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Subject<span className="req">*</span></label>
            <select className="ps-select" value={form.subject} onChange={e => upd('subject', e.target.value)}>
              <option value="">--Select--</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Start Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.startDate} onChange={e => upd('startDate', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Mobile<span className="req">*</span></label>
            <input className="ps-input" placeholder="Mobile" value={form.mobile} onChange={e => upd('mobile', e.target.value)} />
          </div>
        </div>

        {/* Row 3 — Contact */}
        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 200px 1fr' }}>
          <div className="ps-field">
            <label>Email ID</label>
            <input className="ps-input" placeholder="Email" value={form.email} onChange={e => upd('email', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Aadhar<span className="req">*</span></label>
            <input className="ps-input" placeholder="Aadhar" value={form.aadhar} onChange={e => upd('aadhar', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Ph.D. Registration No</label>
            <input className="ps-input" placeholder="Ph.D Reg No" value={form.phdReg} onChange={e => upd('phdReg', e.target.value)} />
          </div>
        </div>

        {/* Row 4 — Bank */}
        <div className="ps-form-section-label" style={{ marginTop: 8 }}>Bank Details</div>
        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 1fr 180px 160px' }}>
          <div className="ps-field">
            <label>Account Number<span className="req">*</span></label>
            <input className="ps-input" placeholder="Account No" value={form.accountNo} onChange={e => upd('accountNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Bank Name<span className="req">*</span></label>
            <select className="ps-select" value={form.bankName} onChange={e => upd('bankName', e.target.value)}>
              <option value="">--Select--</option>
              {BANKS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>IFSC Code<span className="req">*</span></label>
            <input className="ps-input" placeholder="IFSC Code" value={form.ifsc} onChange={e => upd('ifsc', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>PAN Number</label>
            <input className="ps-input" placeholder="PAN" value={form.pan} onChange={e => upd('pan', e.target.value)} />
          </div>
        </div>

        {/* Row 5 — Project */}
        <div className="ps-form-section-label" style={{ marginTop: 8 }}>Project Assignment</div>
        <div className="ps-form-grid" style={{ gridTemplateColumns: '220px 1fr 180px' }}>
          <div className="ps-field">
            <label>Project<span className="req">*</span></label>
            <select className="ps-select" value={form.project} onChange={e => upd('project', e.target.value)}>
              <option value="">--Select--</option>
              {PROJECTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Salary Heads</label>
            <select className="ps-select" value={form.salaryHead} onChange={e => upd('salaryHead', e.target.value)}>
              <option value="">--Select--</option>
              {SALARY_HEADS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Status</label>
            <select className="ps-select" value={form.status} onChange={e => upd('status', e.target.value)}>
              <option value="">--Select--</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="ps-form-actions">
          <button className="ps-btn-primary orange" onClick={() => onSave(form)}>
            {isEdit ? 'Update' : 'Add'}
          </button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── Main StaffDetails Component ──────────────────────────
const StaffDetails = ({ onBack }) => {
  const [staff, setStaff] = useState(INIT_STAFF);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);

  const handleSave = (form) => {
    if (view === 'add') {
      setStaff(prev => [...prev, { ...form, id: Date.now() }]);
    } else {
      setStaff(prev => prev.map(s => s.id === editTarget.id ? { ...form, id: s.id } : s));
    }
    setView('list');
    setEditTarget(null);
  };

  return (
    <div className="ps-inner">
      {view === 'list' && (
        <>
          <div style={{ marginBottom: 20 }}>
            <button className="ps-back-btn" onClick={onBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Project Staff
            </button>
          </div>
          <StaffList staff={staff} onAdd={() => setView('add')} onEdit={s => { setEditTarget(s); setView('edit'); }} />
        </>
      )}
      {view === 'add' && (
        <StaffForm isEdit={false} onSave={handleSave} onBack={() => setView('list')} />
      )}
      {view === 'edit' && (
        <StaffForm isEdit initial={editTarget} onSave={handleSave} onBack={() => setView('list')} />
      )}
    </div>
  );
};

export default StaffDetails;