import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FacultyDashboardApp from "./pages/FacultyDashboardApp";
import LoginPage from "./page/loginpage";
import RegisterPage from "./page/registerpage";
import ForgotPasswordPage from "./page/forgetpasswordpage";
import FindUserIdPage from "./page/finduseridpage";
import ResetPasswordPage from "./page/resetpasswordpage";
import ResetPasswordMobilePage from "./page/resetpasswordmobilepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/find-userid" element={<FindUserIdPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/reset-password-mobile" element={<ResetPasswordMobilePage />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboardApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;