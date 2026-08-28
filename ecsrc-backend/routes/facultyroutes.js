const express = require("express");

const router = express.Router();

const {
  getCampuses,

  getDepartments,

  getFaculties,
} = require("../controllers/facultycontroller");

router.get(
  "/campuses",

  getCampuses,
);

router.get(
  "/departments/:campus",

  getDepartments,
);

router.get(
  "/list/:campus/:department",

  getFaculties,
);

module.exports = router;
