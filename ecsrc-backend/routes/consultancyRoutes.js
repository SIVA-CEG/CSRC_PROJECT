const express = require("express");

const router = express.Router();

const upload = require("../middleware/consultancyFirmLetterUpload");

const authMiddleware = require("../middleware/authmiddleware");

const {
  createAcceptanceForm,
  listAcceptanceForms,
  getAcceptanceFormDetail,
  updateAcceptanceFormStatus,
  uploadFirmLetter,
  listInstallmentForms,
  addInstallment,
  listInvoices,
  markInvoiceCompleted,
  listPayments,
  savePayment,
} = require("../controllers/consultancyController");

// Acceptance Form
router.post("/acceptance-forms", authMiddleware, createAcceptanceForm);
router.get("/acceptance-forms", listAcceptanceForms);
router.get("/acceptance-forms/:idOrCode", getAcceptanceFormDetail);
router.patch("/acceptance-forms/:idOrCode/status", authMiddleware, updateAcceptanceFormStatus);
router.post("/acceptance-forms/:idOrCode/firm-letter", authMiddleware, upload.single("firmLetter"), uploadFirmLetter);

// Installments
router.get("/installments", listInstallmentForms);
router.post("/installments/:idOrCode", authMiddleware, addInstallment);

// Invoices
router.get("/invoices", listInvoices);
router.patch("/invoices/:idOrCode/complete", authMiddleware, markInvoiceCompleted);

// Payments
router.get("/payments", listPayments);
router.post("/payments/:idOrCode", authMiddleware, savePayment);

module.exports = router;