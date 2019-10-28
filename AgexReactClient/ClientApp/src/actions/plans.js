import {
  GET_SEASONS,
  GET_TYPES,
  CREATE_PLAN,
  LOAD_PLAN,
  SET_OPERATION_DATA,
  GET_AGROOPERATIONS,
  SHOW_DEFICIT
} from "./types";
import agex from "../apis/agex";
import authHeader from "../apis/authHeader";
// import history from "../history";
// import alert from "../components/Alert";

const getSeasons = seasons => ({
  type: GET_SEASONS,
  payload: seasons
});

const getTypes = types => ({
  type: GET_TYPES,
  payload: types
});

export const getPlanSeasons = () => async dispatch => {
  const response = await agex.get("/agrofield/season", {
    headers: authHeader()
  });
  if (response.status === 200) dispatch(getSeasons(response.data));
};

export const getPlanTypes = () => async dispatch => {
  const response = await agex.get("/seasonplan/types", {
    headers: authHeader()
  });
  if (response.status === 200) dispatch(getTypes(response.data));
};

export const createNewPlan = ({
  seasonPlanId,
  typePlanId
}) => async dispatch => {
  const response = await agex.post(
    "/seasonplan/create",
    {
      SeasonId: seasonPlanId,
      SeasonPlanTypeId: typePlanId
    },
    {
      headers: authHeader()
    }
  );
  if (response.status === 201) {
    debugger;
    dispatch({
      type: CREATE_PLAN,
      payload: response.data
    });
    // alert.success("Операция добавлена успешно");
  } else {
    // alert.error(response.statusText);
  }
};

export const loadPlan = ({
  seasonId,
  typeId,
  start,
  end
}) => async dispatch => {
  const response = await agex.get(
    `/seasonplan/season-plan-list/${seasonId}/${typeId}/${start}/${end}`,
    {
      headers: authHeader()
    }
  );
  if (response.status === 200) {
    dispatch({
      type: LOAD_PLAN,
      payload: response.data
    });
  }
};

// export const setOperationData = data => {
//   return {
//     type: SET_OPERATION_DATA,
//     payload: data
//   };
// };

export const getAgrooperations = () => async dispatch => {
  const response = await agex.get("/operation/agrooperations", {
    headers: authHeader()
  });
  if (response.status === 200) {
    dispatch({
      type: GET_AGROOPERATIONS,
      payload: response.data
    });
  }
};

export const showDeficit = deficit => {
  return {
    type: SHOW_DEFICIT,
    payload: deficit
  };
};
