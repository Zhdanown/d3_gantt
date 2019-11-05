import { combineReducers } from "redux";
import {
  GET_SEASONS,
  GET_TYPES,
  CREATE_PLAN,
  LOAD_PLAN,
  SET_OPERATION_DATA,
  GET_AGROOPERATIONS,
  ADD_NEW_OPERATION,
  DELETE_OPERATION,
  ADD_PERIOD,
  DELETE_PERIOD,
  EDIT_PERIOD,
  SET_PERIOD_DATA,
  APPLY_FILTER,
} from "../actions/types";

// helper
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

// Slice reducers
function seasonsReducer(state = [], action) {
  if (action.type === GET_SEASONS) return action.payload;
  else return state;
}
function typesReducer(state = [], action) {
  if (action.type === GET_TYPES) return action.payload;
  else return state;
}
function agrooperationsReducer(state = [], action) {
  if (action.type === GET_AGROOPERATIONS) return action.payload;
  else return state;
}
function operationDataReducer(state = null, action) {
  if (action.type === SET_OPERATION_DATA) return action.payload;
  else return state;
}
function periodDataReducer(state = null, action) {
  if (action.type === SET_PERIOD_DATA) return action.payload;
  else return state;
}
function filterReducer(state = {crops: [], farms: []}, action) {
  switch (action.type) {
    case APPLY_FILTER:
      return {...state, crops: action.payload.crops, farms: action.payload.farms}  
    default:
      return state
  }
}


function addNewOperation(plansState, action) {
  return plansState.map(plan => {
    if (plan.id === action.payload.planId) {
      plan.operations = [...plan.operations, action.payload];
    }
    return plan;
  });
}

function deleteOperation(plansState, action) {
  return plansState.map(plan => {
    if (plan.id === action.payload.planId) {
      plan.operations = plan.operations.filter(
        operation => operation.id !== action.payload.id
      );
    }
    return plan;
  });
}

function addPeriod(plansState, action) {
  return plansState.map(plan => {
    if (plan.id === action.payload.planId) {
      plan.operations = plan.operations.map(operation => {
        if (operation.id === action.payload.operationId)
          operation.periods = [...operation.periods, action.payload.newPeriod];
        return operation;
      });
    }
    return plan;
  });
}

function deletePeriod(plansState, action) {
  return plansState.map(plan => {
    if (plan.id === action.payload.planId) {
      plan.operations = plan.operations.map(operation => {
        if (operation.id === action.payload.operationId)
          operation.periods = operation.periods.filter(
            period => period.id !== action.payload.period.id
          );
        return operation;
      });
    }
    return plan;
  });
}

function editPeriod(plansState, action) {
  return plansState.map(plan => {
    if (plan.id === action.payload.planId) {
      plan.operations = plan.operations.map(operation => {
        if (operation.id === action.payload.operationId) {
          operation.periods = operation.periods.map(period => {
            if (period.id === action.payload.changedPeriod.id) {
              return action.payload.changedPeriod;
            } else return period;
          });
        }
        return operation;
      });
    }
    return plan;
  });
}

const plansReducer = createReducer([], {
  CREATE_PLAN: (plansState, action) => [...plansState, action.payload],
  LOAD_PLAN: (plansState, action) => [...action.payload],
  ADD_NEW_OPERATION: addNewOperation,
  DELETE_OPERATION: deleteOperation,
  ADD_PERIOD: addPeriod,
  DELETE_PERIOD: deletePeriod,
  EDIT_PERIOD: editPeriod
});

// Root reducer
const planReducer = combineReducers({
  seasons: seasonsReducer,
  types: typesReducer,
  operationData: operationDataReducer,
  periodData: periodDataReducer,
  agrooperations: agrooperationsReducer,
  plans: plansReducer,
  filter: filterReducer
});

export default planReducer;
