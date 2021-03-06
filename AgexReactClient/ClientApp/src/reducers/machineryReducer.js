import { GET_VEHICLES, GET_EQUIPMENT } from "../actions/seasonPlan/types";

const machineryReducer = (state = { vehicles: [], equipment: [] }, action) => {
  switch (action.type) {
    case GET_VEHICLES:
      return {
        ...state,
        vehicles: [...action.payload]
        // vehiclesFetched: true
      };

    case GET_EQUIPMENT:
      return {
        ...state,
        equipment: [...action.payload]
        // equipmentFetched: true
      };

    default:
      return state;
  }
};

export default machineryReducer;
