import axios from "axios";

export const getProfile = (userId) =>
  axios.get(`http://localhost:5000/api/profile/${userId}`);
export const updateProfile = (userId, data) =>
  axios.put(
    `http://localhost:5000/api/profile/${userId}`,

    data,
  );
export const uploadDocument = (formData) =>
  axios.post(
    "http://localhost:5000/api/profile/upload",

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );