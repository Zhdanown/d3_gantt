import {
  LOGIN,
  LOGOUT,
  START_LOGGING_IN,
  STOP_LOGGING_IN
} from "../actions/seasonPlan/types";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case START_LOGGING_IN:
      return {
        ...state,
        isLoggingIn: true
      };
    case STOP_LOGGING_IN:
      return {
        ...state,
        isLoggingIn: false
      };
    case LOGIN:
      return {
        ...action.payload, // {user: {}, isLoggedIn: true}
        isLoggingIn: false
      };
    case LOGOUT:
      return {
        user: null,
        isloggedIn: false
      };

    default:
      return state;
  }
};

export default authReducer;
