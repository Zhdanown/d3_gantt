import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT,
  LOAD_MIGRATION_REPORT
} from "../actions/seasonPlan/types";

const initState = {
  deviation: null,
  deficit: null,
  proficit: null,
  migration: null
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
    case LOAD_MIGRATION_REPORT:
      return {
        ...state,
        migration: action.payload
      };

    default:
      return state;
  }
};

export default reportsReducer;
