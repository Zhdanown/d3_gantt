import axios from "axios";
import Cookies from "js-cookie";
import history from "../history";
// import { login } from "../actions/auth";
import store from "../store";

const agex = axios.create({
  baseURL: "https://agexdev2.agroterra.ru/api"
});

agex.interceptors.request.use(request => {
  let token = Cookies.get("token");
  if (token) request.headers.common["Authorization"] = "Bearer " + token;

  return request;
});

agex.interceptors.response.use(
  response => response,
  error => {
    if (unauthorized(error.response)) {
      return reattemptRequest(error);
    }
    // error was due to other reasons than authentication
    return Promise.reject(error);
  }
);

function unauthorized(response) {
  let statusCodes = [401];
  return statusCodes.indexOf(response.status) !== -1;
}

/* ****************************** */
let isAlreadyFetchingToken = false;
// requests to be sent again when token recieved
let subscribers = [];

async function reattemptRequest(error) {
  try {
    const { response: errorResponse } = error;

    const retryOriginalRequest = new Promise(resolve => {
      addSubscriber(token => {
        errorResponse.config.headers["Authorization"] = "Bearer " + token;
        resolve(axios(errorResponse.config));
      });
    });

    if (!isAlreadyFetchingToken) {
      isAlreadyFetchingToken = true;

      const newToken = await refreshToken();
      isAlreadyFetchingToken = false;
      onTokenFetched(newToken);
    }

    return retryOriginalRequest;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function refreshToken() {
  const token = await new Promise(resolve => {
    history.push("/login");
    store.subscribe(() => {
      const state = store.getState();
      if (state.auth.isloggedIn) {
        const token = Cookies.get("token");
        resolve(token);
      }
    });
  });
  return token;
}

function onTokenFetched(newToken) {
  subscribers.forEach(callback => callback(newToken));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export default agex;
