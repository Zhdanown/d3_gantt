import axios from "axios";
import Cookies from "js-cookie";
import history from "../history";
import store from "../store";
import {
  findMessage,
  showLoadMessage,
  hideLoadMessage
} from "../utils/LoadMessage";
import alert from "../utils/Alert";

const agex = axios.create({
  baseURL: "https://agexdev2.agroterra.ru/api"
});

agex.interceptors.request.use(request => {
  const loadMssg = findMessage(request);
  if (loadMssg) showLoadMessage(loadMssg);
  let token = Cookies.get("token");
  if (token) {
    request.headers.common["Authorization"] = "Bearer " + token;
  }
  return request;
  // else {
  //   if (request.url === "/auth/logon") return request;
  //   else return getTokenAndSend(request);
  // }
});

/**************************** */
// let isWaitingForToken = false;
// // request to be sent when token recieved
// let queue = [];

// async function getTokenAndSend(request) {
//   try {
//     const requestWithToken = new Promise((resolve, reject) => {
//       addSubscriber(token => {
//         request.headers.common["Authorization"] = "Bearer " + token;
//         resolve(axios(request));
//       }, queue);
//     });

//     if (!isWaitingForToken) {
//       isWaitingForToken = true;

//       const newToken = await refreshToken();
//       isWaitingForToken = false;
//       onTokenFetched(newToken, queue);
//     }

//     return requestWithToken;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }

agex.interceptors.response.use(
  response => {
    const loadMssg = findMessage(response.config);
    if (loadMssg) hideLoadMessage(loadMssg);
    return response;
  },
  error => {
    const loadMssg = findMessage(error.config);
    if (loadMssg) hideLoadMessage(loadMssg);
    if (error.response && unauthorized(error.response)) {
      return reattemptRequest(error);
    }
    // error was due to other reasons than authentication

    // const { response: errorResponse } = error;
    // if (errorResponse) {
    //   const { config, status, statusText } = errorResponse;
    //   const errorString = `${config.url}: ${status} (${statusText})`;
    //   alert.error(errorString);
    // } else {
    //   alert.error(error);
    // }
    console.error(error);
    alert.error(
      "При обращении к серверу произошла ошибка. Обратитесь в службу поддержки..."
    );

    return Promise.reject(error);
  }
);

function unauthorized(response) {
  let codes = [401];
  return codes.indexOf(response.status) !== -1;
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
      }, subscribers);
    });

    if (!isAlreadyFetchingToken) {
      isAlreadyFetchingToken = true;

      const newToken = await refreshToken();
      isAlreadyFetchingToken = false;
      onTokenFetched(newToken, subscribers);
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

function addSubscriber(callback, list) {
  list.push(callback);
}

function onTokenFetched(newToken, list) {
  list.forEach(callback => callback(newToken));
  list = [];
}

export default agex;
