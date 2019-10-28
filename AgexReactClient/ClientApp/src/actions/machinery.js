import agex from "../apis/agex";
import authHeader from "../apis/authHeader";
import { GET_EQUIPMENT, GET_VEHICLES } from "./types";

export const getVehicles = () => async dispatch => {
  const response = await agex.get("/seasonplan/farm-vehicle-models", {
    headers: authHeader()
  });
  if (response.status === 200)
    dispatch({
      type: GET_VEHICLES,
      payload: response.data
    });
};

export const getEquipment = () => async dispatch => {
  const response = await agex.get("/seasonplan/farm-work-equipment-models", {
    headers: authHeader()
  });
  if (response.status === 200)
    dispatch({
      type: GET_EQUIPMENT,
      payload: response.data
    });
};
