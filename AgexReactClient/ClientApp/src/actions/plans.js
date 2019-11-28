import {
  GET_SEASONS,
  GET_TYPES,
  CREATE_PLAN,
  LOAD_PLAN,
  GET_AGROOPERATIONS
} from "./types";
import agex from "../apis/agex";
import alert from "../utils/Alert";
import store from "../store";

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

  if (response && response.status === 200) dispatch(getSeasons(response.data));
  else {
  }
};

export const getPlanTypes = () => async dispatch => {
  const response = await agex.get("/seasonplan/types");
  if (response && response.status === 200) dispatch(getTypes(response.data));
};

export const createNewPlan = ({ season, type }) => async dispatch => {
  try {
    var response = await agex.post("/seasonplan/create", {
      SeasonId: season.id,
      SeasonPlanTypeId: type.id
    });
  } catch (error) {}

  if (response && response.status === 201) {
    store.dispatch(loadPlan({ season, type }));
  } else {
    // alert.error(response.statusText);
  }
};

export const loadPlan = ({ season, type, start, end }) => async dispatch => {
  const response = await agex.get(
    `/seasonplan/season-plan-list/${season.id}/${type.id}`
  );
  if (response && response.status === 200) {
    if (!response.data.length) alert.success("Сезонный план не найден");
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
  if (response && response.status === 200) {
    dispatch({
      type: GET_AGROOPERATIONS,
      payload: response.data
    });
  }
};
