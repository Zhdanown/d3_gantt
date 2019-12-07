import { createRange, dateToString } from "./dateHelper";
import { getSquareRemainder } from "./plans";
import store from "../store";

export const getPeriodDates = data => {
  const { startDate, endDate, machinery, periodId } = data;
  const totalProductiity = getTotalProductivity(machinery);

  let remainingArea = getSquareRemainder(data, periodId);
  let range = createRange(new Date(startDate), new Date(endDate));

  let dates;
  if ( Math.ceil(remainingArea / totalProductiity) >= range.length ) {

    dates = range.map(date => {
      let prod =
        remainingArea / totalProductiity < 1 ? remainingArea : totalProductiity;
      prod = Math.round(prod * 10000) / 10000;
      remainingArea -= totalProductiity;
      return {
        day: dateToString(date, "ISO"),
        productivity: prod > 0 ? prod : 0
      };
    });
    
  } else {
    let avg = remainingArea / range.length;
    avg = Math.ceil(avg * 10000) / 10000;
    dates = range.map(date => {
      const prod = remainingArea < avg ? Math.ceil(remainingArea * 10000) / 10000 : avg;
      remainingArea -= avg;
      return {
        day: dateToString(date, "ISO"),
        productivity: prod
      }
    });
  }

  return dates;
};

export const getTotalProductivity = machinery => {
  // get total productivity for all machinery assigned to period
  return machinery.reduce((acc, pair) => {
    return acc + pair.productivity;
  }, 0);
};

export const decideProductivity = (machinery, agroOperationId) => {
  // get productivity for each pair of machinery
  // depending on operationId

  const state = store.getState();
  const { vehicles: vehicleList, equipment: equipmentList } = state.machinery;

  return machinery.map(pair => {
    // by default get workEquipment's productivity
    // if workEquipment is absent get vehicle's productivity
    let { vehicle: pairVehicle, workEquipment: pairEquipment } = pair;
    let foundVehicle, foundEquipment;
    let vehiclesProductivity, equipmentsProductivity;
    let productivity = 0;

    foundEquipment =
      pairEquipment &&
      equipmentList.find(x => x.workEquipmentModel.id === pairEquipment.id);
    foundVehicle = vehicleList.find(x => x.vehicleModel.id === pairVehicle.id);

    equipmentsProductivity =
      foundEquipment &&
      foundEquipment.productivity.find(
        x => x.agroOperationId === agroOperationId
      );
    vehiclesProductivity =
      foundVehicle &&
      foundVehicle.productivity.find(
        x => x.agroOperationId === agroOperationId
      );

    if (equipmentsProductivity)
      productivity = equipmentsProductivity.productivity;
    else if (vehiclesProductivity)
      productivity = vehiclesProductivity.productivity;

    return { ...pair, productivity };
  });
};

export const isTermsMet = (d, operationData) => {
  const { startDate, endDate } = operationData.data.node;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const day = new Date(d.day);
  return start.getTime() <= day.getTime() && day.getTime() <= end.getTime();
};
