import agex from "../apis/agex";
import alert from "../components/Alert";

import {
  ADD_NEW_OPERATION,
  DELETE_OPERATION,
  SET_OPERATION_DATA
} from "./types";
import { dateToString } from "../helpers/dateHelper";

export async function loadOperations() {
  const response = await agex.get(
    "https://agexdev2.agroterra.ru/api/operation/agrooperations"
  );
}

export const addNewOperation = newOperation => async (dispatch, getState) => {
  // get currently selected plan and append planId to new operation
  const state = getState();
  const planId = state.plan.operationData.plan.id;
  newOperation.planId = planId;
  newOperation.isManual = true;

  // create body request
  const {
    id,
    agroOperation,
    crop,
    // cropSquare,
    farm,
    startDate,
    endDate
  } = newOperation;

  const bodyRequest = {
    Id: id,
    SeasonPlanId: planId,
    AgroOperationId: agroOperation.id,
    CropId: crop.id,
    FarmId: farm.id,
    StartDate: dateToString(new Date(startDate), "yyyy-mm-dd"),
    EndDate: dateToString(new Date(endDate), "yyyy-mm-dd")
    // CropSquare: cropSquare,
    // IsManual: true
  };

  const response = await agex.post("/seasonplan/operation", bodyRequest);

  if (response.status === 201) {
    dispatch({
      type: ADD_NEW_OPERATION,
      payload: newOperation
    });
    alert.success("Операция добавлена успешно");
  } else {
    alert.error(response.statusText);
  }
};

export const deleteOperation = operation => async dispatch => {
  const response = await agex.delete(`/seasonplan/operation`, {
    data: { Id: operation.id }
  });
  if (response.status === 200) {
    dispatch({
      type: DELETE_OPERATION,
      payload: { id: operation.id, planId: operation.plan.id }
    });
    alert.success("Операция успешно удалена");
  } else {
    alert.error(response.statusText);
  }
};

export const setOperationData = data => {
  return {
    type: SET_OPERATION_DATA,
    payload: data
  };
};
