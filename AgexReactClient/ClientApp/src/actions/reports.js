import agex from "../apis/agex";
import store from "../store";
import { LOAD_DEVIATION_REPORT } from "./types";

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
