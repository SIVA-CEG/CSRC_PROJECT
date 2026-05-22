import React, { useState, useEffect, useRef } from "react";
import "./BeneficiariesPage.css";

const ACCOUNT_TYPES = ["Savings", "Current", "Salary", "NRI"];
const TRANSFER_TYPES = ["SBI", "Other Bank"];
const BANKS = [
  "STATE BANK OF INDIA",
  "INDIAN OVERSEAS BANK",
  "CANARA BANK",
  "HDFC BANK",
  "ICICI BANK",
  "AXIS BANK",
  "UNION BANK OF INDIA",
  "BANK OF BARODA",
  "BANK OF INDIA",
  "PUNJAB NATIONAL BANK",
];

const SALUTATIONS = ["Dr.", "Mr.", "Ms.", "Mrs.", "Prof."];

// Searchable Select Component
function SearchableSelect({ options, value, onChange, placeholder = "--Select--" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
  const display = value || placeholder;

  return (
    <div className="ss-wrap" ref={ref}>
      <div className="ss-trigger" onClick={() => setOpen(!open)}>
        <span className={value ? "" : "ss-placeholder"}>{display}</span>
        <span className="ss-arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="ss-dropdown">
          <input
            className="ss-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div
            className={`ss-option ${!value ? "ss-selected" : ""}`}
            onClick={() => { onChange(""); setOpen(false); setSearch(""); }}
          >
            --Select--
          </div>
          {filtered.map((o) => (
            <div
              key={o}
              className={`ss-option ${value === o ? "ss-selected" : ""}`}
              onClick={() => { onChange(o); setOpen(false); setSearch(""); }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = {
  salutation: "", initial: "", name: "", accountNo: "",
  accountType: "", bank: "", ifscCode: "", transferType: "",
  mobile: "", email: "", panNo: "", gstNo: "",
};

const SAMPLE_DATA = [
  { id: 1, salutation: "Mr.", initial: "G", name: "MUTHUKUMARAN G", accountNo: "40674676449", accountType: "Savings", bank: "STATE BANK OF INDIA", ifscCode: "SBIN0001234", transferType: "SBI", mobile: "9876543210", email: "muthu@gmail.com", panNo: "ABCPM1234D", gstNo: "" },
  { id: 2, salutation: "", initial: "L", name: "L", accountNo: "254901000013873", accountType: "Savings", bank: "INDIAN OVERSEAS BANK", ifscCode: "IOBA0002345", transferType: "Other Bank", mobile: "9123456789", email: "", panNo: "", gstNo: "" },
  { id: 3, salutation: "", initial: "", name: "A B Enterprises", accountNo: "06120200007387", accountType: "Current", bank: "CANARA BANK", ifscCode: "CNRB0003456", transferType: "Other Bank", mobile: "", email: "abent@gmail.com", panNo: "XYZAB1234C", gstNo: "33XYZAB1234C1Z5" },
];

export default function BeneficiariesPage() {
  const [list, setList] = useState(SAMPLE_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [nextId, setNextId] = useState(SAMPLE_DATA.length + 1);

  // Beneficiary Name dropdown options from list
  const nameOptions = list.map(
    (b) => `${b.name},${b.bank},${b.accountNo}`
  );

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); };

  const handleSave = () => {
    if (!form.name) return alert("Please select or enter a Beneficiary Name.");
    if (editId) {
      setList(list.map((b) => (b.id === editId ? { ...form, id: editId } : b)));
    } else {
      setList([...list, { ...form, id: nextId }]);
      setNextId(nextId + 1);
    }
    closeForm();
  };

  const handleNameSelect = (val) => {
    if (!val) { setForm({ ...form, name: "", bank: "", accountNo: "" }); return; }
    const parts = val.split(",");
    setForm({ ...form, name: parts[0] || "", bank: parts[1] || "", accountNo: parts[2] || "" });
  };

  const setField = (k, v) => setForm({ ...form, [k]: v });

  if (showForm) {
    return (
      <div className="bp-page">
        <div className="bp-header">
          <h2>Beneficiaries details viewing/editing . . . .</h2>
          <div className="bp-breadcrumb"><span className="bp-bc-link">Home</span> / Beneficiaries</div>
        </div>

        <div className="bp-form-card">
          <div className="bp-form-grid">
            {/* Row 1 */}
            <div className="bp-field">
              <label>Solutions</label>
              <input className="bp-input" placeholder="Dr./Mr./Ms." value={form.salutation}
                onChange={(e) => setField("salutation", e.target.value)} />
            </div>
            <div className="bp-field bp-field-sm">
              <label>Initial</label>
              <input className="bp-input" placeholder="Initial" value={form.initial}
                onChange={(e) => setField("initial", e.target.value)} />
            </div>
            <div className="bp-field bp-field-lg">
              <label>Beneficiary Name</label>
              <SearchableSelect
                options={nameOptions}
                value={form.name ? `${form.name},${form.bank},${form.accountNo}` : ""}
                onChange={handleNameSelect}
              />
            </div>
            <div className="bp-field">
              <label>Account No.</label>
              <input className="bp-input" placeholder="Account No." value={form.accountNo}
                onChange={(e) => setField("accountNo", e.target.value)} />
            </div>

            {/* Row 2 */}
            <div className="bp-field">
              <label>Account Type</label>
              <SearchableSelect options={ACCOUNT_TYPES} value={form.accountType} onChange={(v) => setField("accountType", v)} />
            </div>
            <div className="bp-field bp-field-xlg">
              <label>Bank Name</label>
              <SearchableSelect options={BANKS} value={form.bank} onChange={(v) => setField("bank", v)} />
            </div>
            <div className="bp-field bp-field-md">
              <label>IFSC Code</label>
              <SearchableSelect options={[]} value={form.ifscCode} onChange={(v) => setField("ifscCode", v)} />
            </div>
            <div className="bp-field">
              <label>Transfer Type</label>
              <SearchableSelect options={TRANSFER_TYPES} value={form.transferType} onChange={(v) => setField("transferType", v)} />
            </div>

            {/* Row 3 */}
            <div className="bp-field">
              <label>Mobile</label>
              <input className="bp-input" placeholder="Mobile" value={form.mobile}
                onChange={(e) => setField("mobile", e.target.value)} />
            </div>
            <div className="bp-field bp-field-xlg">
              <label>Email-Id</label>
              <input className="bp-input" placeholder="Email-ID" value={form.email}
                onChange={(e) => setField("email", e.target.value)} />
            </div>
            <div className="bp-field">
              <label>PAN No.</label>
              <input className="bp-input" placeholder="PAN" value={form.panNo}
                onChange={(e) => setField("panNo", e.target.value)} />
            </div>
            <div className="bp-field">
              <label>GST No.</label>
              <input className="bp-input" placeholder="GST" value={form.gstNo}
                onChange={(e) => setField("gstNo", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bp-form-actions">
          <button className="bp-btn bp-btn-save" onClick={handleSave}>Save</button>
          <button className="bp-btn bp-btn-close" onClick={closeForm}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bp-page">
      <div className="bp-header">
        <h2>Beneficiaries</h2>
        <div className="bp-breadcrumb"><span className="bp-bc-link">Home</span> / Beneficiaries</div>
      </div>

      <div className="bp-table-card">
        <table className="bp-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Name</th>
              <th>Bank</th>
              <th>Account No.</th>
              <th>Account Type</th>
              <th>Transfer Type</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "#888" }}>No beneficiaries added yet.</td></tr>
            )}
            {list.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{[b.salutation, b.initial, b.name].filter(Boolean).join(" ")}</td>
                <td>{b.bank}</td>
                <td>{b.accountNo}</td>
                <td>{b.accountType}</td>
                <td>{b.transferType}</td>
                <td>{b.mobile}</td>
                <td>
                  <button className="bp-action-btn bp-action-edit" onClick={() => openEdit(b)} title="Edit">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bp-list-footer">
        <button className="bp-btn bp-btn-new" onClick={openNew}>New Beneficiary</button>
      </div>
    </div>
  );
}