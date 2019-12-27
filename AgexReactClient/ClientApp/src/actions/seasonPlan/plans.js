import {
  GET_SEASONS,
  GET_TYPES,
  // CREATE_PLAN,
  LOAD_PLAN,
  GET_AGROOPERATIONS,
  SET_LAST_UPDATED_PLAN_TIME,
  SET_UPDATED_DATA,
  SET_OPERATIONAL_DIR_ID
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

export const setLastUpdatedTime = lastUpdated => ({
  type: SET_LAST_UPDATED_PLAN_TIME,
  payload: lastUpdated
});

export const getPlanSeasons = () => async dispatch => {
  // var response = await agex.get("/agrofield/season");
  var response = await agex.get("/seasonplan/seasons");

  if (response && response.status === 200) dispatch(getSeasons(response.data));
  else {
  }
};

export const getPlanTypes = () => async dispatch => {
  const response = await agex.get("/seasonplan/types");
  if (response && response.status === 200) dispatch(getTypes(response.data));
};

export const createNewPlan = ({
  season,
  type,
  version,
  clone = false,
  cloneId = null
}) => async dispatch => {
  try {
    var response = await agex.post("/seasonplan/create", {
      seasonId: season.id,
      seasonPlanTypeId: type.id,
      version: version,
      clone: clone,
      cloneId: cloneId
    });
  } catch (error) {}

  if (response && response.status === 201) {
    dispatch(loadPlan({ season, type, version }));
  } else {
    // alert.error(response.statusText);
  }
};

export const loadPlan = ({ season, type, version }) => async dispatch => {
  const response = await agex.get(
    `/seasonplan/season-plan-list/${season.id}/${type.id}/${version}`
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

export const checkUpdates = (season, lastUpdated) => async (
  dispatch,
  getState
) => {
  // get version of currently opened plan
  const state = getState();
  const plan = state.plan.plans[0];
  if (!plan) return;

  const response = await agex.get("/seasonplan/check-events", {
    params: {
      seasonPlanId: plan.id,
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
    });

    if (data) {
      data.forEach(entry => {
        alert.success(entry.user.fullName + "\n" + entry.comment);
      });
      const state = getState();
      const type = state.plan.types[0];
      dispatch(loadPlan({ season, type }));
    }
  }
};

export const getOperationalDirectorRoleId = () => async dispatch => {
  const response = await agex.get("/seasonplan/header-role");

  if (response && response.status === 200) {
    dispatch({
      type: SET_OPERATIONAL_DIR_ID,
      payload: response.data.roleId
    });
  }
};
