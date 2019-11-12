import { LOAD_DEVIATION_REPORT } from "../actions/types";

const initState = {
  deviation: null,
  deficit: {},
  proficit: {},
  migration: {}
};

const reportsReducer = (state = initState, action) => {
  switch (action.type) {
    case LOAD_DEVIATION_REPORT:
      return {
        ...state,
        deviation: action.payload
      };

    default:
      return state;
  }
};

export default reportsReducer;
