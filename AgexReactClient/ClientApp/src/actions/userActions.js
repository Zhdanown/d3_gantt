import agex from "../apis/agex";
import Cookies from "js-cookie";

export const login = (username, password) => async dispatch => {
  const authResponse = await agex.post("/auth/logon", {
    Login: "unzhdan",
    Password: "12345"
  });

  // clear unwanted properties (password, token, etc...)
  const { password: pass, token, ...user } = authResponse.data;

  // const expirationDate = new Date(authResponse.data.tokenExpiredTime);
  let expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  Cookies.set("user", JSON.stringify(user), { expires: expirationDate });
  Cookies.set("token", authResponse.data.token, { expires: expirationDate });

  dispatch({
    type: "LOGIN",
    payload: {
      user,
      loggedIn: true
    }
  });
};

export function logout() {
  Cookies.remove("token");
  Cookies.remove("user");
}

export function getAuthInfo() {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : user;
}
