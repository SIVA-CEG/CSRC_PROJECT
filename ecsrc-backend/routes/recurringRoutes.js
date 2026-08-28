const express = require("express");

const router = express.Router();

const { createRecurringHeads } = require("../controllers/recurringController");

router.post("/create", createRecurringHeads);

module.exports = router;
