const express = require("express");

const router = express.Router();

const { createInstallment } = require("../controllers/installmentController");

router.post("/create", createInstallment);

module.exports = router;
