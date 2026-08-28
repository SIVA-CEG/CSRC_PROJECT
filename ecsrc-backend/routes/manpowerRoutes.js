const express = require("express");

const router = express.Router();

const { createManpower } = require("../controllers/manpowerController");

router.post("/create", createManpower);

module.exports = router;
