import store from "../store";
import { createRange, stringToDate } from "./dateHelper";

export const getHierarchy = operations => {
  let tree = { id: "root", name: "root", children: [] };
  operations.forEach(operation => {
    let holding = handleNode(operation.holding, tree.children, operation);
    let farm = handleNode(operation.farm, holding.children, operation);
    let crop = handleNode(operation.crop, farm.children, operation);
    handleNode(operation.agroOperation, crop.children, operation, true);
  });

  function handleNode(node, arr, item, considerTerms = false) {
    let foundNode;
    if (considerTerms) {
      // debugger;
      foundNode = arr.find(x => x.id === node.id && x.node.id === item.id);
    } else {
      foundNode = arr.find(x => x.id === node.id);
    }

    if (!foundNode) {
      foundNode = { ...node, children: [], node: item };
      arr.push(foundNode);
    }
    return foundNode;
  }

  return tree;
};

export const getOperationDates = operation => {
  let start = new Date(operation.startDate);
  let end = new Date(operation.endDate);
  let dates = createRange(start, end);
  return dates.map(x => ({ date: stringToDate(x) }));
};

export const evalMachineryQuantity = (evaluatedDay, farmId, machinery) => {
  const state = store.getState();
  // get overlapping periods of all operations filtered by farm
  const periods = state.plan.plans
    .flatMap(plan => plan.operations)
    .filter(oper => oper.farm.id === farmId && oper.periods.length)
    .flatMap(operation => operation.periods)
    .filter(period => period.days.find(day => day.day === evaluatedDay));

  // get machinery models to be counted
  let vehicleModels = machinery.flatMap(pair => pair.vehicleModel);
  let workEquipmentModels = machinery.flatMap(pair => pair.workEquipmentModel);
  // get unique values of models
  vehicleModels = [...new Set(vehicleModels.map(x => JSON.stringify(x)))].map(
    x => JSON.parse(x)
  );
  workEquipmentModels = [
    ...new Set(workEquipmentModels.map(x => JSON.stringify(x)))
  ].map(x => JSON.parse(x));

  // count models of vehicles
  vehicleModels = vehicleModels.map(vehicleModel => ({
    ...vehicleModel,
    count: countModel(vehicleModel, "vehicleModel")
  }));
  // count models of workEquipment
  workEquipmentModels = workEquipmentModels
    .filter(x => x)
    .map(workEquipmentModel => ({
      ...workEquipmentModel,
      count: countModel(workEquipmentModel, "workEquipmentModel")
    }));

  // get farm's vehicles
  let farmsVehicles = state.machinery.vehicles
    .filter(x => x.farm.id === farmId)
    .map(x => ({
      ...x.vehicleModel,
      count: x.count
    }));
  // get farm's equipments
  let farmsWorkEquipment = state.machinery.equipment
    .filter(x => x.farm.id === farmId)
    .map(x => ({
      ...x.workEquipmentModel,
      count: x.count
    }));

  // compare assigned counted models with farm's machinery...

  // compare vehicles
  vehicleModels = vehicleModels.map(vehicle => {
    let farmsVehicle = farmsVehicles.find(x => x.id === vehicle.id);
    let balance = farmsVehicle.count - vehicle.count;
    return { ...vehicle, balance };
  });
  // compare equipments
  workEquipmentModels = workEquipmentModels.map(equipment => {
    let farmsEquipment = farmsWorkEquipment.find(x => x.id === equipment.id);
    let balance = farmsEquipment.count - equipment.count;
    return { ...equipment, balance };
  });

  // return deficit
  const deficit = {
    vehicles: vehicleModels.filter(x => x.balance < 0),
    workEquipment: workEquipmentModels.filter(x => x.balance < 0)
  };
  return deficit;

  function countModel(model, type) {
    return periods.reduce((count, period) => {
      period.machinery.forEach(pair => {
        if (pair[type] && pair[type].id === model.id) count++;
      });
      return count;
    }, 0);
  }
};

export const getSquareRemainder = (operation, periodId = null) => {
  // check if operation is closed (cropSquare <= machinery's sumProductivity)
  let { cropSquare, periods } = operation;
  // exclude given period
  periods = periods.filter(period => period.id !== periodId);

  let sumProductivity = periods.reduce((totalProd, period) => {
    totalProd += period.days.reduce((acc, day) => {
      acc += day.productivity;
      return acc;
    }, 0);
    return totalProd;
  }, 0);
  sumProductivity = Math.floor(sumProductivity * 10000) / 10000;
  let remainder = cropSquare - sumProductivity;

  return remainder;
};
