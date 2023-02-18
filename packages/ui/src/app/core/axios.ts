import { Axios } from "axios";

export const axios = new Axios({
  baseURL: process.env.NX_API_URL,
  withCredentials: true,
  responseType: "json",
});
