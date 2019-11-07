import {
  GET_SEASONS,
  GET_TYPES,
  CREATE_PLAN,
  LOAD_PLAN,
  GET_AGROOPERATIONS
} from "./types";
import agex from "../apis/agex";
import alert from "../components/Alert";

const getSeasons = seasons => ({
  type: GET_SEASONS,
  payload: seasons
});

const getTypes = types => ({
  type: GET_TYPES,
  payload: types
});

export const getPlanSeasons = () => async dispatch => {
  var response = await agex.get("/agrofield/season");

  if (response.status === 200) dispatch(getSeasons(response.data));
  else {
  }
};

export const getPlanTypes = () => async dispatch => {
  const response = await agex.get("/seasonplan/types");
  if (response.status === 200) dispatch(getTypes(response.data));
};

export const createNewPlan = ({
  seasonPlanId,
  typePlanId
}) => async dispatch => {
  const response = await agex.post("/seasonplan/create", {
    SeasonId: seasonPlanId,
    SeasonPlanTypeId: typePlanId
  });
  if (response.status === 201) {
    dispatch({
      type: CREATE_PLAN,
      payload: response.data
    });
  } else {
    // alert.error(response.statusText);
  }
};

export const loadPlan = ({ season, type, start, end }) => async dispatch => {
  const response = await agex.get(
    `/seasonplan/season-plan-list/${season.id}/${type.id}`
  );
  if (response.status === 200) {
    dispatch({
      type: LOAD_PLAN,
      payload: response.data.map(x => ({
        ...x,
        selectedSeason: season
      }))
    });
  }
};

export const getAgrooperations = () => async dispatch => {
  const response = await agex.get("/operation/agrooperations");
  if (response.status === 200) {
    dispatch({
      type: GET_AGROOPERATIONS,
      payload: response.data
    });
  }
};
