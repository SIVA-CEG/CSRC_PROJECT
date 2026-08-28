const express = require("express");
const cors = require("cors");
require("dotenv").config();
const facultyRoutes = require("./routes/facultyroutes");
const authRoutes = require("./routes/authroutes");
const profileRoutes = require("./routes/profileroutes");
const app = express();
const endorsementRoutes = require("./routes/endorsementroutes");
const projectRoutes = require("./routes/projectRoutes");
const nonRecurringRoutes = require("./routes/nonRecurringRoutes");
const manpowerRoutes = require("./routes/manpowerRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const overheadRoutes = require("./routes/overheadRoutes");
const installmentRoutes = require("./routes/installmentRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const reportRoutes = require("./routes/reportRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const projectStaffRoutes = require("./routes/projectStaffRoutes");
const reappropriationRoutes = require("./routes/reappropriationRoutes");
const extensionRoutes = require("./routes/extensionRoutes");
const projectTransferRoutes = require("./routes/projectTransferRoutes");
const consultancyRoutes = require("./routes/consultancyRoutes");

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",

  express.static("uploads"),
);
app.use("/generated_reports", express.static("generated_reports"));
app.use("/api/auth", authRoutes);
app.use(
  "/api/profile",

  profileRoutes,
);
app.use(
  "/api/faculty",

  facultyRoutes,
);
app.use("/api/endorsements", endorsementRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/installments", installmentRoutes);
app.use("/api/non-recurring", nonRecurringRoutes);
app.use("/api/manpower", manpowerRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/overhead", overheadRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/project-staff", projectStaffRoutes);


app.use("/api/extensions", extensionRoutes);

app.use("/api/reappropriation", reappropriationRoutes);
app.use("/api/project-transfer", projectTransferRoutes);
app.use("/api/claim-projects", require("./routes/claimProjectsRoutes"));
app.use("/api/claim-submit", require("./routes/claimSubmissionRoutes"));



app.use("/api/consultancy", consultancyRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
