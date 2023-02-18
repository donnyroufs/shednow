import { Axios } from "axios";

console.log({ env: process.env });
export const axios = new Axios({
  baseURL: process.env.NX_API_URL,
  withCredentials: true,
  responseType: "json",
});
