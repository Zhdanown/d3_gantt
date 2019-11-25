import agex from "../apis/agex";
import store from "../store";
import {
  LOAD_DEVIATION_REPORT,
  LOAD_DEFICIT_REPORT,
  LOAD_PROFICIT_REPORT,
  LOAD_MIGRATION_REPORT
} from "./types";

export const loadDeviationReport = () => async (dispatch, getState) => {
  // get selected season id
  const state = getState();

  const seasonId = state.plan.plans.length
    ? state.plan.plans[0].selectedSeason.id
    : await new Promise((resolve, reject) => {
        store.subscribe(() => {
          const state = getState();
          if (state.plan.plans.length) {
            const { id } = state.plan.plans[0].selectedSeason;
            resolve(id);
          }
        });
      });

  const response = await agex.get(
    `/seasonplan/tech-map-deviation-report/${seasonId}`
  );

  if (response.status === 200)
    dispatch({
      type: LOAD_DEVIATION_REPORT,
      payload: response.data
    });
};

export const loadDeficitReport = () => async (dispatch, getState) => {
  // get selected season id
  const state = getState();

  const seasonId = state.plan.plans.length
    ? state.plan.plans[0].selectedSeason.id
    : await new Promise((resolve, reject) => {
        store.subscribe(() => {
          const state = getState();
          if (state.plan.plans.length) {
            const { id } = state.plan.plans[0].selectedSeason;
            resolve(id);
          }
        });
      });

  const response = await agex.get(`/seasonplan/difict-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_DEFICIT_REPORT,
      payload: response.data
    });
};

export const loadProficitReport = () => async (dispatch, getState) => {
  // get selected season id
  const state = getState();

  const seasonId = state.plan.plans.length
    ? state.plan.plans[0].selectedSeason.id
    : await new Promise((resolve, reject) => {
        store.subscribe(() => {
          const state = getState();
          if (state.plan.plans.length) {
            const { id } = state.plan.plans[0].selectedSeason;
            resolve(id);
          }
        });
      });

  const response = await agex.get(`/seasonplan/profit-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_PROFICIT_REPORT,
      payload: response.data
    });
};

export const loadMigrationReport = () => async (dispatch, getState) => {
  // get selected season id
  const state = getState();

  const seasonId = state.plan.plans.length
    ? state.plan.plans[0].selectedSeason.id
    : await new Promise((resolve, reject) => {
        store.subscribe(() => {
          const state = getState();
          if (state.plan.plans.length) {
            const { id } = state.plan.plans[0].selectedSeason;
            resolve(id);
          }
        });
      });

  const response = await agex.get(`/seasonplan/movement-report/${seasonId}`);
  if (response.status === 200)
    dispatch({
      type: LOAD_MIGRATION_REPORT,
      payload: response.data
    });
};
