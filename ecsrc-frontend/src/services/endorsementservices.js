import axios from "axios";

const API = "http://localhost:5000/api/endorsements";

export const getEndorsements = (userId) => axios.get(`${API}/${userId}`);

export const createEndorsement = (data) =>
  axios.post(
    `${API}/create`,

    data,
  );