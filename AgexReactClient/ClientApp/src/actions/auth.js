/*
 ********** LOGIN, LOGOUT, FETCH_PROFILE ********
 */
import {
  LOGIN,
  LOGOUT,
  START_LOGGING_IN,
  STOP_LOGGING_IN
} from "./seasonPlan/types";
import agex from "../apis/agex";
import Cookies from "js-cookie";
// import history from "../history";

/*
 ********** ACTION CREATORS ********
 */
const loginUser = user => ({
  type: LOGIN,
  payload: {
    user,
    isloggedIn: true
  }
});

const logoutUser = () => ({ type: LOGOUT });

/*
 ********** ACTIONS ********
 */
export const login = (username, password) => async dispatch => {
  var authResponse;
  try {
    dispatch({
      type: START_LOGGING_IN
    });

    authResponse = await agex.post("/auth/logon", {
      Login: username,
      Password: password
    });

    // clear unwanted properties (password, token, etc...)
    const { password: pass, token, ...user } = authResponse.data;

    const expirationDate = new Date(authResponse.data.tokenExpiredTime);
    // let expirationDate = new Date();
    // expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    Cookies.set("user", JSON.stringify(user), { expires: expirationDate });
    Cookies.set("token", authResponse.data.token, { expires: expirationDate });

    dispatch(loginUser(user));

    return authResponse;
  } catch (error) {
    dispatch({
      type: STOP_LOGGING_IN
    });
    return error.response;
  }
};

export const logout = () => async dispatch => {
  Cookies.remove("token");
  Cookies.remove("user");
  dispatch(logoutUser());
};

export const getUserProfile = () => async dispatch => {
  const token = Cookies.get("token");
  if (!token) return;

  const response = await agex.get("/auth/info");
  if (response && response.status === 200) dispatch(loginUser(response.data));
};
