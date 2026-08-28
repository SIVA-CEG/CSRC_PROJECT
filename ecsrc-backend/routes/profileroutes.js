const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,

  updateProfile,

  uploadDocument,
} = require("../controllers/profilecontroller");

// GET PROFILE

router.get(
  "/:userId",

  getProfile,
);

// UPDATE PROFILE

router.put(
  "/:userId",

  updateProfile,
);
router.post(
  "/upload",

  upload.single("document"),

  uploadDocument,
);
module.exports = router;

