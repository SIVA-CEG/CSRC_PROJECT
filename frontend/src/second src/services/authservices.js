import axios from "axios";

const API = "http://localhost:5000/api/auth";

// LOGIN

export const loginFaculty = async (data) => {
  return axios.post(`${API}/login`, data);
};

// REGISTER

export const registerFaculty = async (data) => {
  return axios.post(`${API}/register`, data);
};

// FIND USER ID

export const findUserId = async (data) => {
  return axios.post(`${API}/find-userid`, data);
};

// FORGOT PASSWORD

export const forgotPassword = async (data) => {
  return axios.post(`${API}/forgot-password`, data);
};

// RESET PASSWORD

export const resetPassword = async (
  token,

  data,
) => {
  return axios.post(
    `http://localhost:5000/api/auth/reset-password/${token}`,

    data,
  );
};
