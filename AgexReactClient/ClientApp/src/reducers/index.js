import { combineReducers } from "redux";
import authReducer from "./authReducer";
import planReducer from "./planReducer";
import machineryReducer from "./machineryReducer";
import reportsReducer from "./reportsReducer";
import spUpdateReducer from "./spUpdateReducer";
// import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
  auth: authReducer,
  plan: planReducer,
  machinery: machineryReducer,
  reports: reportsReducer,
  spUpdate: spUpdateReducer
  // form: formReducer
});

export default rootReducer;
