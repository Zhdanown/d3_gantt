import React from "react";
import MySelect from "../shared/MySelect";

function MachineryForm({ addMachinery, productivity, ...props }) {
  const { vehicle, vehicleList, onVehicleChange } = props;
  const { workEquipment, workEquipmentList, onWorkEquipmentChange } = props;

  const { selectedAgroOperationId: agroOperationId } = props;

  const renderaddMachineryButton = () => {
    return (
      <button
        type="button"
        className="btn"
        onClick={addMachinery}
        disabled={!vehicle || !vehicle.id}
      >
        Назначить
        {productivity ? ` ${productivity} га/сут` : null}
        <i className="material-icons right">add</i>
      </button>
    );
  };

  const disableByAgroOperation = option => {
    return !option.value.productivity.find(
      x => x.agroOperationId === agroOperationId
    );
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col s12 m6">
          <MySelect
            name="vehicle"
            label="Самоходная техника"
            options={vehicleList}
            defaultValue={vehicle}
            onChange={onVehicleChange}
            getOptionLabel={opt =>
              "(" + opt.value.count + " ед) - " + opt.label
            }
            isOptionDisabled={disableByAgroOperation}
          />
        </div>
        <div className="col s12 m6">
          <MySelect
            name="work-equipment"
            label="Сельхозорудие"
            options={workEquipmentList}
            onChange={onWorkEquipmentChange}
            defaultValue={workEquipment}
            getOptionLabel={opt =>
              "(" + opt.value.count + " ед) - " + opt.label
            }
            isOptionDisabled={disableByAgroOperation}
          />
        </div>
      </div>

      <div className="center-align">{renderaddMachineryButton()}</div>
    </React.Fragment>
  );
}

export default MachineryForm;
