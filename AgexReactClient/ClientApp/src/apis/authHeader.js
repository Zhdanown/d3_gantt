import Cookies from "js-cookie";

export default function authHeader() {
  let token = Cookies.get("token");
  return token ? { Authorization: "Bearer " + token } : {};
}
