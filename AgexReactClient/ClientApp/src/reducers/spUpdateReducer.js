import { SET_LAST_UPDATED_PLAN_TIME, SET_UPDATED_DATA } from "../actions/seasonPlan/types";

const spUpdateReducer = (state = {data: null, lastUpdated: null}, action) => {
  switch (action.type) {
    case SET_LAST_UPDATED_PLAN_TIME: 
      return {
        ...state,
        lastUpdated: action.payload
      };
    
    case SET_UPDATED_DATA:
      return {
        ...state,
        data: action.payload
      }
    
    default: 
      return state;
  }
};

export default spUpdateReducer;
