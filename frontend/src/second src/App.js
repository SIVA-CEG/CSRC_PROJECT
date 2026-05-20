import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/loginpage";
import RegisterPage from "./pages/registerpage";
import ForgotPasswordPage from "./pages/forgetpasswordpage";
import FindUserIdPage from "./pages/finduseridpage";
import ResetPasswordPage from "./pages/resetpasswordpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/find-userid" element={<FindUserIdPage />} />

        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
