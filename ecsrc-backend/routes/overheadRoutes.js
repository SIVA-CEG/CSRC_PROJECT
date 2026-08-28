const express = require("express");

const router = express.Router();

const { createOverhead } = require("../controllers/overheadController");

router.post("/create", createOverhead);

module.exports = router;
