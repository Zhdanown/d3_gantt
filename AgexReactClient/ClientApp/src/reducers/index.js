import { combineReducers } from "redux";
import authReducer from "./authReducer";
import planReducer from "./planReducer";
import machineryReducer from "./machineryReducer";
import reportsReducer from "./reportsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  plan: planReducer,
  machinery: machineryReducer,
  reports: reportsReducer
});

export default rootReducer;
