import React from "react";
import MachineryList from "./MachineryList.jsx";
import MachineryForm from "./MachineryForm.jsx";

function Machinery(props) {
  const { totalProductivity } = props;
  const { machineryList, removeMachinery, addMachinery } = props;
  const { vehicle, vehicleList, onVehicleChange } = props;
  const { workEquipment, workEquipmentList, onWorkEquipmentChange } = props;
  const formProps = {
    vehicle,
    vehicleList,
    onVehicleChange,
    workEquipment,
    workEquipmentList,
    onWorkEquipmentChange,
    addMachinery,
    selectedAgroOperationId: props.selectedAgroOperationId,
    productivity: props.productivity
  };

  return (
    <div className="machinery">
      <ul className="collapsible expandable">
        <li>
          <div className="collapsible-header">
            Задействованная техника ({machineryList.length}) &nbsp;
            {totalProductivity ? <b>{totalProductivity} га/сут</b> : null}
          </div>
          <div className="collapsible-body">
            <MachineryList
              machineryList={machineryList}
              removeMachinery={removeMachinery}
            />
          </div>
        </li>
        <li>
          <div className="collapsible-header">
            <i className="material-icons">add</i>Назначить технику
          </div>
          <div className="collapsible-body">
            <MachineryForm {...formProps} />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Machinery;
