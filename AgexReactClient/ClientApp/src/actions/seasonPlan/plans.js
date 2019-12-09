import {
  GET_SEASONS,
  GET_TYPES,
  // CREATE_PLAN,
  LOAD_PLAN,
  GET_AGROOPERATIONS,
  SET_LAST_UPDATED_PLAN_TIME,
  SET_UPDATED_DATA
} from "./types";
import agex from "../../apis/agex";
import alert from "../../utils/Alert";
import { dateToString } from "../../utils/dateHelper";
import store from "../../store";

const getSeasons = seasons => ({
  type: GET_SEASONS,
  payload: seasons
});

const getTypes = types => ({
  type: GET_TYPES,
  payload: types
});

export const setLastUpdatedTime = (lastUpdated) => ({
  type: SET_LAST_UPDATED_PLAN_TIME,
  payload: lastUpdated
})

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
    dispatch(loadPlan({ season, type }));
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

export const checkUpdates = (season, lastUpdated) => async (dispatch, getState) => {
  const response = await agex.get("/seasonplan/check-events", {
    params: {
      season: season.id, // seasonId
      start_date: lastUpdated
    }
  });
  if (response && response.status === 200) {
    const newLastUpdatedTime = dateToString(new Date(), "ISO");

    dispatch({
      type: SET_LAST_UPDATED_PLAN_TIME,
      payload: newLastUpdatedTime
    }); 

    const data = response.data.length ? response.data : null;
    dispatch({
      type: SET_UPDATED_DATA,
      payload: data
    })

    if (data) {
      data.forEach(entry => {
        alert.success(entry.user.fullName + "\n" + entry.comment)
      })
      const state = getState();
      const type = state.plan.types[0];
      dispatch(loadPlan({ season, type }));
    }
  }
};
