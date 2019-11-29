import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://agexdev2.agroterra.ru/api",
  headers: {
    Authorization: "bearer " + Cookies.get("token")
  }
});

export default api;
