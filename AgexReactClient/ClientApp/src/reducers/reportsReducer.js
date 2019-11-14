import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT
} from "../actions/types";

const initState = {
  deviation: null,
  deficit: null,
  proficit: null,
  migration: {}
};

const reportsReducer = (state = initState, action) => {
  switch (action.type) {
    case LOAD_DEVIATION_REPORT:
      return {
        ...state,
        deviation: action.payload
      };
    case LOAD_DEFICIT_REPORT:
      return {
        ...state,
        deficit: action.payload
      };

    case LOAD_PROFICIT_REPORT:
      return {
        ...state,
        proficit: action.payload
      };

    default:
      return state;
  }
};

export default reportsReducer;
