import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config";

const reportAPI = axios.create({
  baseURL: API_BASE_URL,
  responseType: "blob"
});

reportAPI.interceptors.request.use(request => {
  let token = Cookies.get("token");
  if (token) {
    request.headers.common["Authorization"] = "Bearer " + token;
  }
  return request;
});

export default reportAPI;
