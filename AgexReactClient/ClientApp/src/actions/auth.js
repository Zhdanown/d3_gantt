/*
 ********** LOGIN, LOGOUT, FETCH_PROFILE ********
 */
import { LOGIN, LOGOUT } from "./types";
import agex from "../apis/agex";
import Cookies from "js-cookie";
import authHeader from "../apis/authHeader";

/*
 ********** ACTION CREATORS ********
 */
const loginUser = user => ({
  type: LOGIN,
  payload: {
    user,
    loggedIn: true
  }
});

const logoutUser = () => ({ type: LOGOUT });

/*
 ********** ACTIONS ********
 */
export const login = (username, password) => async dispatch => {
  const authResponse = await agex.post("/auth/logon", {
    Login: username, // "unzhdan"
    Password: password // "12345"
  });

  // clear unwanted properties (password, token, etc...)
  const { password: pass, token, ...user } = authResponse.data;

  const expirationDate = new Date(authResponse.data.tokenExpiredTime);
  // let expirationDate = new Date();
  // expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  Cookies.set("user", JSON.stringify(user), { expires: expirationDate });
  Cookies.set("token", authResponse.data.token, { expires: expirationDate });

  dispatch(loginUser(user));
};

export const logout = () => async dispatch => {
  Cookies.remove("token");
  Cookies.remove("user");
  dispatch(logoutUser());
};

export const getUserProfile = () => async dispatch => {
  const token = Cookies.get("token");
  if (!token) return;

  const response = await agex.get("/auth/info", {
    headers: authHeader()
  });

  if (response.status === 200) dispatch(loginUser(response.data));
};
