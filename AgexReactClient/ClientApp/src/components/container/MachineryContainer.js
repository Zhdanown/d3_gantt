import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "../../styles/css/machinery.css";

import Machinery from "../presentational/Machinery.jsx";
/** import helpers */
import {
  getTotalProductivity,
  decideProductivity
} from "../../helpers/periods";

export const MachineryContainer = ({ ...props }) => {
  const { selectedAgroOperationId } = props;

  const [vehicle, setVehicle] = useState(null);
  const [workEquipment, setWorkEquipment] = useState(null);
  const [vehicleList, setVehicleList] = useState([]);
  const [workEquipmentList, setWorkEquipmentList] = useState([]);
  // productivity for new pair of machinery
  const [productivityVehicle, setProductivityVehicle] = useState(null);
  const [productivityEquipment, setProductivityEquipment] = useState(null);
  const [productivity, setProductivity] = useState(null);

  // init
  useEffect(() => {
    let elems = document.querySelectorAll(".machinery .collapsible");
    window.M.Collapsible.init(elems, { accordion: false });
  }, []);

  // update vehicle and equipment lists
  useEffect(() => {
    if (vehicleList.length !== props.vehicleList.length)
      setVehicleList(props.vehicleList);
    if (workEquipmentList.length !== props.workEquipmentList.length)
      setWorkEquipmentList(props.workEquipmentList);
  }, [props.vehicleList, props.workEquipmentList]);

  // watch for productivity changes
  useEffect(() => {
    setProductivity(productivityEquipment || productivityVehicle);
  }, [productivityVehicle, productivityEquipment]);

  const onVehicleChange = newVehicle => {
    setVehicle(newVehicle);

    // calculate vehicle's productivity
    if (newVehicle) {
      var productivityObj = newVehicle.productivity.find(
        x => x.agroOperationId === selectedAgroOperationId
      );
      if (productivityObj) setProductivityVehicle(productivityObj.productivity);
      else setProductivityVehicle(null);
    } else setProductivityVehicle(null);
  };

  const onWorkEquipmentChange = newWorkEquipment => {
    setWorkEquipment(newWorkEquipment);

    // calculate equipment's productivity
    if (newWorkEquipment) {
      var productivityObj = newWorkEquipment.productivity.find(
        x => x.agroOperationId === selectedAgroOperationId
      );
      productivityObj && setProductivityEquipment(productivityObj.productivity);
    } else setProductivityEquipment(null);
  };

  const addMachinery = () => {
    if (!vehicle) console.log("select Vehicle first!");
    else {
      props.addMachinery({ vehicle, workEquipment, productivity });

      /*
       ********** update models quantity ********
       */

      // decrement amount of selected vehicle
      if (vehicle) {
        let newVehicleList = vehicleList.map(x => {
          if (x.id === vehicle.id) {
            x.count--;
          }
          return x;
        });
        setVehicleList(newVehicleList);
      }

      // decrement amount of selected workEquipment
      if (workEquipment) {
        let newWorkEquipment = workEquipmentList.map(x => {
          if (x.id === workEquipment.id) x.count--;
          return x;
        });
        setWorkEquipmentList(newWorkEquipment);
      }
    }
  };

  const removeMachinery = item => {
    const { vehicle, workEquipment } = item;

    if (vehicle) {
      // increment amount of removed vehicle
      let newVehicleList = vehicleList.map(x => {
        if (x.id === vehicle.id) {
          x.count++;
        }
        return x;
      });
      setVehicleList(newVehicleList);
    }

    // increment amount of removed workEquipment
    if (workEquipment) {
      let newWorkEquipmentList = workEquipmentList.map(x => {
        if (x.id === workEquipment.id) x.count++;
        return x;
      });
      setWorkEquipmentList(newWorkEquipmentList);
    }
    props.removeMachinery(item);
  };

  return (
    <Machinery
      machineryList={props.machineryList}
      removeMachinery={removeMachinery}
      vehicle={vehicle}
      vehicleList={vehicleList}
      onVehicleChange={onVehicleChange}
      workEquipment={workEquipment}
      workEquipmentList={workEquipmentList}
      onWorkEquipmentChange={onWorkEquipmentChange}
      addMachinery={addMachinery}
      selectedAgroOperationId={props.selectedAgroOperationId}
      productivity={productivity}
      totalProductivity={getTotalProductivity(props.machineryList)}
    />
  );
};

MachineryContainer.defaultProps = {
  machineryList: [], // vehicle + (workEquipment)
  vehicleList: [],
  workEquipmentList: []
};

const mapStateToProps = (state, ownProps) => {
  /*
   ********** get productivity for machinery already assigned to period ********
   */

  let machineryWithProd = ownProps.machineryList.map(x => ({
    ...x,
    productivity: 1000
  }));

  /*
   ********** get list of available vehicles and equipment for selected farm ********
   */

  let vehicles = state.machinery.vehicles;
  let workEquipment = state.machinery.equipment;

  function countUsed(item, type) {
    if (!state.plan.periodData) return 0;
    // count machinery already used in this period
    return state.plan.periodData.machinery.reduce((count, x) => {
      if (item[type].id === (x[type] && x[type].id)) count++;
      return count;
    }, 0);
  }

  const { id: selectedFarmId } =
    state.plan.operationData.farm || state.plan.operationData.operation.farm;
  const { id: agroOperationId } =
    state.plan.operationData && state.plan.operationData.agroOperation;

  if (vehicles)
    vehicles = [...vehicles]
      .filter(x => x.farm.id === selectedFarmId) // filter machinery by farmId

      .map(x => ({
        ...x.vehicleModel,
        productivity: x.productivity,
        count: x.count - countUsed(x, "vehicleModel")
      }));
  if (workEquipment)
    workEquipment = workEquipment
      .filter(x => x.farm.id === selectedFarmId)
      .map(x => ({
        ...x.workEquipmentModel,
        productivity: x.productivity,
        count: x.count - countUsed(x, "workEquipmentModel")
      }));

  return {
    vehicleList: vehicles,
    workEquipmentList: workEquipment,
    selectedFarmId,
    selectedAgroOperationId: state.plan.operationData.agroOperation.id,
    machineryList: decideProductivity(ownProps.machineryList, agroOperationId)
  };
};

export default connect(mapStateToProps)(MachineryContainer);
