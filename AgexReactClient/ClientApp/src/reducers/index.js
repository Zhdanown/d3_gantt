import { combineReducers } from "redux";
import authReducer from "./authReducer";
import planReducer from "./planReducer";
import machineryReducer from "./machineryReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  plan: planReducer,
  machinery: machineryReducer
});

export default rootReducer;
