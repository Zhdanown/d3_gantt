import { LOGIN, LOGOUT } from "../actions/types";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...action.payload
      };
    case LOGOUT:
      return {
        user: null,
        loggedIn: false
      };

    default:
      return state;
  }
};

export default authReducer;
