import axios from "axios";

export const Axios = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
});
