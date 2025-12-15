import axios from "axios";

const API = axios.create({
  baseURL: "https://skillstack-task-backend.onrender.com",
});

export default API;
