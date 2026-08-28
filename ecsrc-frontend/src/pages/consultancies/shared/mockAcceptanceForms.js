// PATH: frontend/src/pages/consultancies/shared/mockAcceptanceForms.js

/* ---------------------------------------------------------------------- */
/*  Shared mock acceptance-form records, used by:                         */
/*   - AcceptanceFormStatus  (submitted/accepted/rejected list + print)   */
/*   - InstallmentList       (records where installmentType === 'with')   */
/*   - InvoiceStatus         (records where details.work.workType ===     */
/*                            'proforma' — carries an `invoice` block)    */
/*   - PaymentStatus         (records where invoice.status === 'completed'*/
/*                            — carries a `payment` block once reached)   */
/*  Replace with a real API call once the backend is ready — every        */
/*  consumer reads from this single array, so there's only one place to   */
/*  swap the data source out.                                             */
/* ---------------------------------------------------------------------- */

export const MOCK_FORMS = [
  {
    id: '1819C1472', firmName: '', consultantTitle: 'jiooj', installment: 'Single',
    type: 'Prior Permission', amount: 657650, duration: '2018-04-01 to 2018-04-05',
    status: 'submitted', firmLetterFile: 'firm-letter-1819C1472.pdf',
    details: {
      principal: { name: 'Dr. A. Ravindran', designation: 'Professor', department: 'Mechanical Engineering', campus: 'CEG', contactNo: '9876500011', email: 'ravindran@annauniv.edu' },
      firm: { name: 'Jiooj Pvt Ltd', pan: 'AAAAJ1234K', gst: '33AAAAJ1234K1Z1', letterRef: 'JJ/2018/014 dt. 28.03.2018', contactName: 'S. Kumar', contactNo: '9944400011', address: 'Guindy, Chennai' },
      work: { title: 'jiooj', abstract: 'Abstract of the proposed consultancy work covering scope, deliverables and methodology.', startDate: '2018-04-01', endDate: '2018-04-05', totalHours: 40, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 200000, travel: 40000, equipment: 0, contingency: 15000, consumables: 10000, consultantRemuneration: 300000, deptStaffRemuneration: 20000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 657650, taxPercent: 18 },
    },
  },
  {
    id: '1819C2480', firmName: '', consultantTitle: 'gdshfdh', installment: 'Multiple / 1',
    type: 'Prior Permission', amount: 456395, duration: '2019-01-03 to 2019-01-03',
    status: 'accepted', firmLetterFile: 'firm-letter-1819C2480.pdf',
    details: {
      principal: { name: 'Dr. M. Priya', designation: 'Associate Professor', department: 'Civil Engineering', campus: 'CEG', contactNo: '9876500022', email: 'priya@annauniv.edu' },
      firm: { name: 'GDS Infra Pvt Ltd', pan: 'AAAAG5678K', gst: '33AAAAG5678K1Z2', letterRef: 'GDS/2019/002 dt. 02.01.2019', contactName: 'R. Meena', contactNo: '9944400022', address: 'Ambattur, Chennai' },
      work: { title: 'gdshfdh', abstract: 'Structural feasibility review and site assessment for the proposed facility.', startDate: '2019-01-03', endDate: '2019-01-03', totalHours: 60, hasEquipment: 'no', workType: 'permission', installmentType: 'with', installmentCount: 1 },
      expenditure: { manpower: 150000, travel: 25000, equipment: 0, contingency: 20000, consumables: 5000, consultantRemuneration: 220000, deptStaffRemuneration: 15000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 456395, taxPercent: 18 },
    },
  },
  {
    id: '1819C2522', firmName: '', consultantTitle: 'DEMO', installment: 'Single',
    type: 'Postfacto Permission', amount: 25000, duration: '2019-01-19 to 2019-01-31',
    status: 'rejected', remarks: 'GST certificate not attached — please resubmit with the required document.',
    firmLetterFile: 'firm-letter-1819C2522.pdf',
    details: {
      principal: { name: 'Dr. S. Kannan', designation: 'Assistant Professor', department: 'Electronics & Communication Engineering', campus: 'CEG', contactNo: '9876500033', email: 'kannan@annauniv.edu' },
      firm: { name: 'Demo Solutions', pan: 'AAAAD9999K', gst: '', letterRef: 'DEMO/2019/1', contactName: 'V. Raj', contactNo: '9944400033', address: 'T. Nagar, Chennai' },
      work: { title: 'DEMO', abstract: 'Sample demo consultancy record used for testing the workflow.', startDate: '2019-01-19', endDate: '2019-01-31', totalHours: 10, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 10000, travel: 5000, equipment: 0, contingency: 2000, consumables: 1000, consultantRemuneration: 5000, deptStaffRemuneration: 2000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 25000, taxPercent: 18 },
    },
  },
  {
    id: '1920C3398', firmName: 'SAL Pvt. Ltd', consultantTitle: 'Technical appraisal for MBR Sewage treatment plant of 100KLD', installment: 'Single',
    type: 'Permission', amount: 500000, duration: '2019-11-25 to 2019-11-25',
    status: 'accepted', firmLetterFile: 'firm-letter-1920C3398.pdf',
    details: {
      principal: { name: 'Dr. N. Suresh', designation: 'Professor', department: 'Civil Engineering', campus: 'CEG', contactNo: '9876500044', email: 'suresh@annauniv.edu' },
      firm: { name: 'SAL Pvt. Ltd', pan: 'AAAAS4321K', gst: '33AAAAS4321K1Z3', letterRef: 'SAL/2019/031 dt. 20.11.2019', contactName: 'K. Iyer', contactNo: '9944400044', address: 'Guindy, Chennai' },
      work: { title: 'Technical appraisal for MBR Sewage treatment plant of 100KLD', abstract: 'Technical evaluation of the proposed MBR-based sewage treatment plant design, capacity, and compliance.', startDate: '2019-11-25', endDate: '2019-11-25', totalHours: 30, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 180000, travel: 30000, equipment: 0, contingency: 25000, consumables: 5000, consultantRemuneration: 220000, deptStaffRemuneration: 15000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 500000, taxPercent: 18 },
    },
  },
  {
    id: '1920C3436', firmName: '43', consultantTitle: '4343', installment: 'Single',
    type: 'Prior Permission', amount: 11800, duration: '2019-12-16 to 2019-12-08',
    status: 'submitted', firmLetterFile: 'firm-letter-1920C3436.pdf',
    details: {
      principal: { name: 'Dr. T. Bala', designation: 'Assistant Professor', department: 'Information Technology', campus: 'CEG', contactNo: '9876500055', email: 'bala@annauniv.edu' },
      firm: { name: '43', pan: '', gst: '', letterRef: '', contactName: '', contactNo: '', address: '' },
      work: { title: '4343', abstract: 'Placeholder abstract text for test record 1920C3436.', startDate: '2019-12-16', endDate: '2019-12-08', totalHours: 5, hasEquipment: 'no', workType: 'permission', installmentType: 'without' },
      expenditure: { manpower: 4000, travel: 1000, equipment: 0, contingency: 500, consumables: 300, consultantRemuneration: 5000, deptStaffRemuneration: 500, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 11800, taxPercent: 18 },
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Proforma-invoice records — these are the ones that flow through    */
  /*  Invoice Status → Payment Status. Only records with                 */
  /*  details.work.workType === 'proforma' ever appear in those lists.   */
  /* ------------------------------------------------------------------ */
  {
    // Still in the Invoice Status "Submitted" tab — no invoice number
    // issued yet, so the printable letter shows the placeholder line.
    id: '2526C10379', firmName: 'M/s.GIZ GMBH', consultantTitle: 'Assessing the source sustainability and development of a climate-resilient plan for the identified water supply scheme in the state of Kerala',
    installment: 'Single', type: 'Proforma Invoice', amount: 1033600, duration: '—',
    status: 'accepted', firmLetterFile: 'firm-letter-2526C10379.pdf',
    details: {
      principal: { name: 'Ms. . Dummy Login', designation: 'Associate Professor', department: 'Electronics and Communication Engineering', campus: 'Anna University Regional Centre - Madurai', contactNo: '9876500066', email: 'dummy.login@annauniv.edu' },
      firm: { name: 'M/s.GIZ GMBH', pan: '', gst: '', letterRef: 'Email dated:19.06.2025', contactName: '', contactNo: '', address: '46, Paschimi Marg, Vasant Vihar, New Delhi - 110057, New Delhi' },
      work: { title: 'Assessing the source sustainability and development of a climate-resilient plan for the identified water supply scheme in the state of Kerala', abstract: 'Study of source sustainability for the identified water supply scheme and development of a climate-resilient management plan.', startDate: '2026-05-01', endDate: '2026-08-31', totalHours: 120, hasEquipment: 'no', workType: 'proforma', installmentType: 'without' },
      expenditure: { manpower: 300000, travel: 80000, equipment: 0, contingency: 40000, consumables: 20000, consultantRemuneration: 300000, deptStaffRemuneration: 25000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 875932, taxPercent: 18 },
    },
    invoice: { status: 'submitted', invoiceNo: '', raisedOn: '22-07-2026' },
  },
  {
    // Invoice completed → now visible in Payment Status "Submitted" tab,
    // payment particulars not yet added (matches the blank Add Payment
    // screen for Consultancy ID 2627C10879).
    id: '2627C10879', firmName: 'Chennai Metropolitan Development Authority, Chennai', consultantTitle: 'VERIFICATION OF STRUCTURAL DESIGN AND DRAWINGS',
    installment: 'Single', type: 'Proforma Invoice', amount: 500000, duration: '—',
    status: 'accepted', firmLetterFile: 'firm-letter-2627C10879.pdf',
    details: {
      principal: { name: 'Dr. R. Elango', designation: 'Professor', department: 'Civil Engineering', campus: 'CEG', contactNo: '9876500077', email: 'elango@annauniv.edu' },
      firm: { name: 'Chennai Metropolitan Development Authority', pan: '', gst: '', letterRef: 'CMDA/2026/077 dt. 02.05.2026', contactName: '', contactNo: '', address: 'Chennai' },
      work: { title: 'VERIFICATION OF STRUCTURAL DESIGN AND DRAWINGS', abstract: 'Independent verification of structural design and drawings submitted for the proposed development.', startDate: '2026-05-10', endDate: '2026-06-10', totalHours: 50, hasEquipment: 'no', workType: 'proforma', installmentType: 'without' },
      expenditure: { manpower: 150000, travel: 20000, equipment: 0, contingency: 15000, consumables: 5000, consultantRemuneration: 250000, deptStaffRemuneration: 15000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 500000, taxPercent: 18 },
    },
    invoice: { status: 'completed', invoiceNo: 'CSRC/INV/2026/0142', raisedOn: '10-05-2026' },
    payment: { status: undefined, particulars: null },
  },
  {
    // Fully completed — invoice issued AND payment approved. Matches the
    // signed-off Pay-In Slip for Consultancy ID 2627C10828.
    id: '2627C10828', firmName: 'M/s. Raymond Realty Limited', consultantTitle: 'Preparation of Local Level CRZ map for the land bearing C. S. No. 1505 (pt) & 1/1505 (pt) known as',
    installment: 'Single', type: 'Proforma Invoice', amount: 2596000, duration: '—',
    status: 'accepted', firmLetterFile: 'firm-letter-2627C10828.pdf',
    details: {
      principal: { name: 'Ms. . Dummy login', designation: 'Associate Professor', department: 'Electronics and Communication Engineering', campus: 'Anna University Regional Centre - Madurai', contactNo: '9876500066', email: 'dummy.login@annauniv.edu' },
      firm: { name: 'M/s. Raymond Realty Limited', pan: '', gst: '27AAKCT6747Q1ZA', letterRef: 'RRL/2026/012 dt. 15.04.2026', contactName: '', contactNo: '', address: 'Ground Floor, JKFT Building, Pokhran Road No. 1, Jekegram, Thane, Maharashtra' },
      work: { title: 'Preparation of Local Level CRZ map for the land bearing C. S. No. 1505 (pt) & 1/1505 (pt) known as', abstract: 'Preparation of a local-level CRZ map for the identified survey numbers, including field verification and demarcation.', startDate: '2026-04-20', endDate: '2026-06-20', totalHours: 90, hasEquipment: 'no', workType: 'proforma', installmentType: 'without' },
      expenditure: { manpower: 600000, travel: 150000, equipment: 0, contingency: 80000, consumables: 30000, consultantRemuneration: 1300000, deptStaffRemuneration: 50000, externalConsultant: 0, subcontracting: 0, hiringServices: 0 },
      approx: { totalCharges: 2596000, taxPercent: 18 },
    },
    invoice: { status: 'completed', invoiceNo: 'CSRC/INV/2026/0128', raisedOn: '20-04-2026' },
    payment: {
      status: 'completed',
      particulars: {
        splitCount: 1,
        splitRows: [{ bankName: 'Ghkhk', refNo: 'gkhjkj', paymentType: 'Cheque', refDate: '2026-05-14', amount: 2376000 }],
        tds: 220000, amountReceived: 2376000, taxPercent: 18,
        totalConsultancyCharges: 2596000,
        gstAmount: 396000, overheadAmount: 594000,
        csrcRemunEnabled: true, consultantRemunAmount: 1372140, csrcRemunAmount: 13860,
        approvedOn: '15-05-2026',
      },
    },
  },
];