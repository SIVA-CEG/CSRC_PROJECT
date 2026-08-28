const express = require("express");

const router = express.Router();

const {
  createNonRecurringHeads,
} = require("../controllers/nonRecurringController");

router.post("/create", createNonRecurringHeads);

module.exports = router;
