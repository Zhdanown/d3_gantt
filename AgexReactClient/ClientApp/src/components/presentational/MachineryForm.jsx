import React from "react";
import MySelect from "../shared/MySelect";
import Checkbox from "../shared/Checkbox";

function MachineryForm({ addMachinery, productivity, ...props }) {
  const { showAllMode, toggleShowAllMode } = props;
  const { vehicle, vehicleList, onVehicleChange } = props;
  const { workEquipment, workEquipmentList, onWorkEquipmentChange } = props;

  const { selectedAgroOperationId: agroOperationId } = props;

  const disableByAgroOperation = option => {
    return !option.value.productivity.find(
      x => x.agroOperationId === agroOperationId
    );
  };


  const getLabel = opt => {
    if (showAllMode) {
      return (
        "(" +
        opt.value.count +
        " ед) - " +
        opt.label +
        " - (" +
        opt.value.farm.name +
        ")"
      );
    } else {
      return "(" + opt.value.count + " ед) - " + opt.label;
    }
  };

  const renderAddMachineryButton = () => {
    return (
      <button
        type="button"
        className="btn"
        onClick={addMachinery}
        disabled={!(vehicle && productivity)}
      >
        Назначить
        {productivity ? ` ${productivity} га/сут` : null}
        <i className="material-icons right">add</i>
      </button>
    );
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col s12 m6">
          <MySelect
            classPrefix="rs"
            maxHeight={210}
            placeholder="Самоходная техника"
            name="vehicle"
            label="Самоходная техника"
            options={vehicleList}
            defaultValue={vehicle}
            onChange={onVehicleChange}
            getOptionLabel={opt => getLabel(opt)}
            // isOptionDisabled={disableByAgroOperation}
          />
        </div>
        <div className="col s12 m6">
          <MySelect
            classPrefix="rs"
            maxHeight={210}
            placeholder="Сельхозорудие"
            name="work-equipment"
            label="Сельхозорудие"
            options={workEquipmentList}
            onChange={onWorkEquipmentChange}
            defaultValue={workEquipment}
            getOptionLabel={getLabel}
            isOptionDisabled={disableByAgroOperation}
          />
        </div>
      </div>

      <div className="center-align">{renderAddMachineryButton()}</div>
    </React.Fragment>
  );
}

export default MachineryForm;
