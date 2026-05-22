import React, { useState } from 'react';
import './ProjectStaffPage.css';

// ── Sample data ──────────────────────────────────────────
const INIT_CONTRACTS = [
  { id: 138, staffName: 'Mr VENKADANATHAN J', designation: 'Junior Research Fellow', contractFrom: '21-12-2022', contractTo: '30-11-2023', joinDate: '21-06-2023', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/SERB PROJECT/BSP/JRF/', proceedingDate: '20-06-2023', tenureFrom: '21-12-2022', tenureTo: '30-11-2023', fixedSalary: 31000, hra: 7440, clDays: 18, documents: [
    { id: 1, name: 'Advt.', date: '16-11-2023', file: 'staff_file_616.pdf', status: 'VERIFIED' },
    { id: 2, name: 'Minutes', date: '16-11-2023', file: 'staff_file_617.pdf', status: 'VERIFIED' },
    { id: 3, name: 'Appointment', date: '16-11-2023', file: 'staff_file_618.pdf', status: 'VERIFIED' },
    { id: 4, name: 'Joining', date: '16-11-2023', file: 'staff_file_619.pdf', status: 'VERIFIED' },
    { id: 5, name: 'Passbook', date: '16-11-2023', file: 'staff_file_620.pdf', status: 'VERIFIED' },
  ], extensions: [] },
  { id: 53, staffName: 'Mr VENKADANATHAN J', designation: 'Junior Research Fellow', contractFrom: '21-12-2022', contractTo: '20-06-2023', joinDate: '21-12-2022', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/01', proceedingDate: '21-12-2022', tenureFrom: '21-12-2022', tenureTo: '20-06-2023', fixedSalary: 31000, hra: 7440, clDays: 18, documents: [], extensions: [] },
  { id: 32, staffName: 'Mr VETRI VEL V', designation: 'Junior Research Fellow', contractFrom: '05-07-2022', contractTo: '04-01-2023', joinDate: '05-07-2022', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/02', proceedingDate: '05-07-2022', tenureFrom: '05-07-2022', tenureTo: '04-01-2023', fixedSalary: 31000, hra: 7440, clDays: 18, documents: [], extensions: [] },
  { id: 31, staffName: 'Mr VETRI VEL V', designation: 'Junior Research Fellow', contractFrom: '05-01-2022', contractTo: '04-07-2022', joinDate: '05-01-2022', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/03', proceedingDate: '05-01-2022', tenureFrom: '05-01-2022', tenureTo: '04-07-2022', fixedSalary: 31000, hra: 7440, clDays: 18, documents: [], extensions: [] },
  { id: 30, staffName: 'Mr VETRI VEL V', designation: 'Junior Research Fellow', contractFrom: '05-07-2021', contractTo: '04-01-2022', joinDate: '05-07-2021', status: 'VERIFIED', extn: 'New', proceedingNo: 'CEG/MECH/JRF/04', proceedingDate: '05-07-2021', tenureFrom: '05-07-2021', tenureTo: '04-01-2022', fixedSalary: 31000, hra: 7440, clDays: 18, documents: [], extensions: [] },
];

const STAFF_NAMES = ['Mr VENKADANATHAN J', 'Mr VETRI VEL V'];
const DESIGNATIONS = ['Junior Research Fellow', 'Senior Research Fellow', 'Project Assistant', 'Research Scholar', 'Post-Doctoral Fellow', 'Project Associate'];

const emptyContract = {
  staffName: '', appointmentOrderNo: '', appointmentOrderDate: '',
  contractFrom: '', contractTo: '', joinDate: '',
  fixedSalary: 0, hra: 0, clDays: 0,
};

const emptyExtension = {
  staffName: '', extnOrderNo: '', extnOrderDate: '',
  extnFrom: '', extnTo: '', rejoinDate: '',
  fixedSalary: 0, hra: 0, clDays: 0,
};

// ── Document Viewer ──────────────────────────────────────
const DocumentViewer = ({ contract, onBack }) => (
  <>
    <div className="ps-inner-header">
      <div className="ps-inner-title-wrap">
        <div className="ps-inner-title">Project Staff Appointment Related Documents</div>
        <div className="ps-inner-sub">{contract.staffName} — Contract #{contract.id}</div>
      </div>
      <button className="ps-back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
    </div>
    <div className="ps-form-panel">
      {contract.documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
          No documents uploaded for this contract.
        </div>
      ) : (
        <table className="ps-doc-table">
          <thead>
            <tr><th>Sl. No.</th><th>Document</th><th>Date</th><th>Files</th><th>Status</th><th>File Input</th></tr>
          </thead>
          <tbody>
            {contract.documents.map((doc, i) => (
              <tr key={doc.id}>
                <td style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', width: 60 }}>{i + 1}</td>
                <td style={{ fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{doc.name}</td>
                <td style={{ color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>{doc.date}</td>
                <td><a href="#" className="ps-file-link">{doc.file}</a></td>
                <td><span className="ps-badge verified"><span className="ps-badge-dot"/>{doc.status}</span></td>
                <td>
                  <input type="file" style={{ display: 'none' }} id={`file-${doc.id}`} />
                  <label htmlFor={`file-${doc.id}`} className="ps-icon-btn doc" style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
);

// ── Tenure Edit View ─────────────────────────────────────
const TenureEdit = ({ contract, onSave, onBack }) => {
  const [form, setForm] = useState({
    staffName: contract.staffName,
    proceedingNo: contract.proceedingNo || '',
    proceedingDate: contract.proceedingDate || '',
    joinDate: contract.joinDate || '',
    tenureFrom: contract.tenureFrom || '',
    tenureTo: contract.tenureTo || '',
    fixedSalary: contract.fixedSalary || 0,
    hra: contract.hra || 0,
    clDays: contract.clDays || 0,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Tenure editing...</div>
          <div className="ps-inner-sub">Master / Staff Tenure</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff details editing....</div>

        {contract.status === 'VERIFIED' && (
          <div style={{ marginBottom: 16 }}>
            <span className="ps-info-tag success" style={{ fontSize: 16, fontWeight: 700, padding: '8px 18px', borderRadius: 10 }}>✓ VERIFIED</span>
          </div>
        )}

        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 1fr 160px 160px' }}>
          <div className="ps-field">
            <label>Staff Name</label>
            <select className="ps-select" value={form.staffName} onChange={e => upd('staffName', e.target.value)}>
              {STAFF_NAMES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Proceeding No<span className="req">*</span></label>
            <input className="ps-input" value={form.proceedingNo} onChange={e => upd('proceedingNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Proceeding Date</label>
            <input className="ps-input" type="date" value={form.proceedingDate} onChange={e => upd('proceedingDate', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Join Date</label>
            <input className="ps-input" type="date" value={form.joinDate} onChange={e => upd('joinDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px 160px 160px' }}>
          <div className="ps-field">
            <label>Tenure From</label>
            <input className="ps-input" type="date" value={form.tenureFrom} onChange={e => upd('tenureFrom', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Tenure Upto</label>
            <input className="ps-input" type="date" value={form.tenureTo} onChange={e => upd('tenureTo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Fixed Salary<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>HRA<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Total CL days<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.clDays} onChange={e => upd('clDays', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-actions">
          <button className="ps-btn-primary orange" onClick={() => onSave(form)}>Update</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── Extension Form ───────────────────────────────────────
const ExtensionForm = ({ contract, onSave, onBack }) => {
  const [form, setForm] = useState({ ...emptyExtension, staffName: contract?.staffName || '' });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Tenure</div>
          <div className="ps-inner-sub">Master / Staff Tenure</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff tenure details adding....</div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 1fr 180px' }}>
          <div className="ps-field">
            <label>Project Staff Name</label>
            <select className="ps-select" value={form.staffName} onChange={e => upd('staffName', e.target.value)}>
              <option value="">--Select--</option>
              {STAFF_NAMES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Extn Order No<span className="req">*</span></label>
            <input className="ps-input" placeholder="Proceeding No" value={form.extnOrderNo} onChange={e => upd('extnOrderNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Extn Order Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnOrderDate} onChange={e => upd('extnOrderDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Extn Period From<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnFrom} onChange={e => upd('extnFrom', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Extn Upto<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.extnTo} onChange={e => upd('extnTo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Re-Joined Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.rejoinDate} onChange={e => upd('rejoinDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Fixed Salary<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>HRA<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Total CL days<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.clDays} onChange={e => upd('clDays', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-actions">
          <button className="ps-btn-primary" style={{ background: 'linear-gradient(135deg,#fbbf24,#d97706)', boxShadow: '0 4px 16px rgba(251,191,36,0.3)' }} onClick={() => onSave(form)}>Add</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── New Contract Form ─────────────────────────────────────
const NewContractForm = ({ onSave, onBack }) => {
  const [form, setForm] = useState(emptyContract);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Tenure</div>
          <div className="ps-inner-sub">Master / Staff Tenure</div>
        </div>
        <button className="ps-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
      </div>

      <div className="ps-form-panel">
        <div className="ps-form-section-label">Staff tenure details adding....</div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '1fr 1fr 180px' }}>
          <div className="ps-field">
            <label>Project Staff Name</label>
            <select className="ps-select" value={form.staffName} onChange={e => upd('staffName', e.target.value)}>
              <option value="">--Select--</option>
              {STAFF_NAMES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="ps-field">
            <label>Appointment Order No<span className="req">*</span></label>
            <input className="ps-input" placeholder="Proceeding No" value={form.appointmentOrderNo} onChange={e => upd('appointmentOrderNo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Appointment Order Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.appointmentOrderDate} onChange={e => upd('appointmentOrderDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Contract Period From<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.contractFrom} onChange={e => upd('contractFrom', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Contract Period Upto<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.contractTo} onChange={e => upd('contractTo', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Joining Date<span className="req">*</span></label>
            <input className="ps-input" type="date" value={form.joinDate} onChange={e => upd('joinDate', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-grid" style={{ gridTemplateColumns: '160px 160px 160px' }}>
          <div className="ps-field">
            <label>Fixed Salary<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.fixedSalary} onChange={e => upd('fixedSalary', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>HRA<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.hra} onChange={e => upd('hra', e.target.value)} />
          </div>
          <div className="ps-field">
            <label>Total CL days<span className="req">*</span></label>
            <input className="ps-input" type="number" value={form.clDays} onChange={e => upd('clDays', e.target.value)} />
          </div>
        </div>

        <div className="ps-form-actions">
          <button className="ps-btn-primary" onClick={() => onSave(form)}>Add</button>
          <button className="ps-btn-secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    </>
  );
};

// ── Contract List View ───────────────────────────────────
const ContractList = ({ contracts, onAdd, onDocs, onAction, onExtn }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const PER_PAGE = 10;
  const filtered = contracts.filter(c => c.staffName.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="ps-inner-header">
        <div className="ps-inner-title-wrap">
          <div className="ps-inner-title">Project Staff Contract Details</div>
          <div className="ps-inner-sub">Master / Staff Appointment Orders</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              className="ps-input"
              style={{ paddingLeft: 32, width: 200 }}
              placeholder="Search staff name..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className="ps-add-btn ps-btn-primary pink" onClick={onAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Staff
          </button>
        </div>
      </div>

      <div className="ps-table-card">
        <div className="ps-table-wrap">
          <table className="ps-table">
            <thead>
              <tr>
                <th className="ps-sl-num">Sl. No.</th>
                <th>Staff Name</th>
                <th>Designation</th>
                <th>Contract From</th>
                <th>Contract To</th>
                <th>Date of Joining</th>
                <th>Documents</th>
                <th>Action</th>
                <th>Status</th>
                <th>Extn</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <tr key={c.id}>
                  <td className="ps-sl-num">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="ps-name-cell">{c.staffName} ({c.id})</td>
                  <td>{c.designation}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractFrom}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.contractTo}</td>
                  <td style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)' }}>{c.joinDate}</td>
                  <td>
                    <button className="ps-icon-btn doc" title="View Documents" onClick={() => onDocs(c)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </button>
                  </td>
                  <td>
                    <button className="ps-icon-btn view" title="View / Edit Tenure" onClick={() => onAction(c)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                  <td>
                    <span className={`ps-badge ${c.status === 'VERIFIED' ? 'verified' : 'pending'}`}>
                      <span className="ps-badge-dot"/>{c.status}
                    </span>
                  </td>
                  <td>
                    <button className="ps-icon-btn ext" title="Add Extension" onClick={() => onExtn(c)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                    </button>
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

// ── Main AppointmentOrders Component ─────────────────────
const AppointmentOrders = ({ onBack }) => {
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'docs' | 'action' | 'extn'
  const [target, setTarget] = useState(null);

  const handleAddContract = (form) => {
    const newC = {
      ...form,
      id: Date.now(),
      designation: 'Junior Research Fellow',
      contractFrom: form.contractFrom,
      contractTo: form.contractTo,
      joinDate: form.joinDate,
      status: 'VERIFIED',
      extn: 'New',
      documents: [],
      extensions: [],
      proceedingNo: form.appointmentOrderNo,
      proceedingDate: form.appointmentOrderDate,
      tenureFrom: form.contractFrom,
      tenureTo: form.contractTo,
      fixedSalary: form.fixedSalary,
      hra: form.hra,
      clDays: form.clDays,
    };
    setContracts(prev => [newC, ...prev]);
    setView('list');
  };

  const handleTenureSave = (form) => {
    setContracts(prev => prev.map(c => c.id === target.id ? { ...c, ...form } : c));
    setView('list');
  };

  const handleExtnSave = (form) => {
    setContracts(prev => prev.map(c => c.id === target.id ? { ...c, extensions: [...(c.extensions || []), form] } : c));
    setView('list');
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
          <ContractList
            contracts={contracts}
            onAdd={() => setView('add')}
            onDocs={c => { setTarget(c); setView('docs'); }}
            onAction={c => { setTarget(c); setView('action'); }}
            onExtn={c => { setTarget(c); setView('extn'); }}
          />
        </>
      )}
      {view === 'add' && (
        <NewContractForm onSave={handleAddContract} onBack={() => setView('list')} />
      )}
      {view === 'docs' && target && (
        <DocumentViewer contract={target} onBack={() => setView('list')} />
      )}
      {view === 'action' && target && (
        <TenureEdit contract={target} onSave={handleTenureSave} onBack={() => setView('list')} />
      )}
      {view === 'extn' && target && (
        <ExtensionForm contract={target} onSave={handleExtnSave} onBack={() => setView('list')} />
      )}
    </div>
  );
};

export default AppointmentOrders;