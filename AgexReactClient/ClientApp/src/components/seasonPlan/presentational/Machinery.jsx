import React from "react";
import MachineryList from "./MachineryList.jsx";
import MachineryForm from "./MachineryForm.jsx";
import Checkbox from "../../shared/Checkbox.js";

function Machinery(props) {
  const { showAllMode, toggleShowAllMode } = props;
  const { totalProductivity } = props;
  const { machineryList, removeMachinery, addMachinery } = props;
  const { vehicle, vehicleList, onVehicleChange } = props;
  const { workEquipment, workEquipmentList, onWorkEquipmentChange } = props;
  const formProps = {
    showAllMode,
    toggleShowAllMode,
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

  const onInputChange = val => {
    toggleShowAllMode(val.checked);
  };

  return (
    <div className="machinery">
      <ul className="collapsible expandable">
        <li className="active">
          <div className="collapsible-header">
            <i className="material-icons">add</i>Назначить технику
          </div>
          <div className="collapsible-body">
            <div className="showAllCheckbox">
              <Checkbox
                item={{ name: "Показать всю технику", checked: showAllMode }}
                onInputChange={onInputChange}
              />
            </div>
            <MachineryForm {...formProps} />
          </div>
        </li>
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
      </ul>
    </div>
  );
}

export default Machinery;
