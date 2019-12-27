import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT,
  LOAD_MIGRATION_REPORT,
  LOAD_TECHMAP_CHANGES_REPORT,
  LOAD_LOGS_REPORT
} from "../actions/seasonPlan/types";

const initState = {
  deviation: null,
  deficit: null,
  proficit: null,
  migration: null,
  logs: null,
  techmap_changes: null
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
    case LOAD_TECHMAP_CHANGES_REPORT:
      return {
        ...state,
        techmap_changes: action.payload
      };
    case LOAD_LOGS_REPORT:
      return {
        ...state,
        logs: action.payload
      };

    default:
      return state;
  }
};

export default reportsReducer;
