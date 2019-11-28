import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import history from "../../../history";

/** import components */
import { Link } from "react-router-dom";
import Modal from "../../shared/Modal";
import MachineryContainer from "./MachineryContainer";
import DatePicker from "../../shared/DatePicker";

/** import utils */
import {
  getPeriodDates,
  getTotalProductivity,
  decideProductivity
} from "../../../utils/periods";
import { getSquareRemainder } from "../../../utils/plans";

/** import actions */
import {
  deletePeriod,
  editPeriod,
  setPeriodData
} from "../../../actions/periods";
import { setOperationData } from "../../../actions/operations";

function EditPeriodForm({ periodData, operationData, ...props }) {
  if (!periodData) {
    history.push("/sp");
    return null;
  }
  const { holding, farm, crop, cropSquare, agroOperation } = operationData;
  const remainingArea =
    cropSquare - getSquareRemainder(operationData, periodData.id);
  const start = new Date(periodData.days[0].day);
  const end = new Date([...periodData.days].pop().day);
  // convert machinery
  const tech = periodData.machinery.map(x => ({
    vehicle: x.vehicleModel,
    workEquipment: x.workEquipmentModel
  }));
  /*
   ********** state ********
   */
  const [machinery, setMachinery] = useState(
    decideProductivity(tech, agroOperation.id)
  );
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);
  const [duration, setDuration] = useState(null);

  // watch for endDate changes
  useEffect(() => {
    if (!duration) return;
    let newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + Math.ceil(duration) - 1);
    setEndDate(newEndDate);
  }, [startDate, duration]);

  const updateDuration = () => {
    if (!machinery.length) {
      setDuration(null);
      return;
    }
    const totalProductivity = getTotalProductivity(machinery);
    if (!totalProductivity) {
      setDuration(null);
      return;
    }

    let newDuration = remainingArea / totalProductivity;
    newDuration = Math.ceil(newDuration * 10) / 10;
    setDuration(newDuration);
  };

  // const updateEndDate = () => {
  //   if (!duration) return;
  //   let newEndDate = new Date(startDate);
  //   newEndDate.setDate(newEndDate.getDate() + Math.ceil(duration) - 1);
  //   setEndDate(newEndDate);
  // };

  const addMachinery = val => {
    setMachinery([...machinery, { ...val }]);
    updateDuration();
    // updateEndDate();
  };

  const removeMachinery = entry => {
    let newMachinery = [...machinery];
    for (let i = 0; i < newMachinery.length; i++) {
      let item = newMachinery[i];
      const { vehicle, workEquipment } = item;
      if (
        vehicle.id === entry.vehicle.id &&
        (workEquipment && workEquipment.id) ===
          (entry.workEquipment && entry.workEquipment.id)
      ) {
        newMachinery.splice(i, 1);
        break;
      }
    }
    setMachinery(newMachinery);
    updateDuration();
    // updateEndDate();
  };

  const editPeriod = () => {
    // create dates
    let dates = getPeriodDates({
      ...operationData,
      periodId: periodData.id,
      startDate,
      endDate,
      machinery
    });

    const periodId = periodData.id;

    const changedPeriod = {
      id: periodId,
      days: dates,
      machinery: machinery.map(pair => ({
        vehicleModel: pair.vehicle,
        workEquipmentModel: pair.workEquipment
      }))
    };

    props.editPeriod({ changedPeriod, operationData });
  };

  const deletePeriod = () => {
    props.deletePeriod({ period: periodData, operation: operationData });
  };

  const closeForm = () => {
    history.push("/sp");
    props.setOperationData(null);
    props.setPeriodData(null);
  };

  const renderSubmitButton = () => {
    if (!startDate || !endDate || !machinery.length) return;
    else if (endDate.getTime() < startDate.getTime()) return;

    return (
      <button
        className="btn waves-effect waves-light modal-close"
        type="submit"
        name="action"
        form="period-form"
        onClick={editPeriod}
      >
        Изменить период
        <i className="material-icons right">add</i>
      </button>
    );
  };

  return (
    <Modal name="editPeriod" className="big" onClose={closeForm}>
      <div className="modal-content">
        {/* <h5>Edit Period</h5> */}
        <div className="row">
          {periodData && (
            <React.Fragment>
              <div className="col s12">
                <span>
                  {crop.name} - {agroOperation.name}{" "}
                  <b>
                    {remainingArea} / {cropSquare} га
                  </b>
                  {duration && " - " + duration + " дн."}
                </span>
                <span className="right">
                  {holding.name} - {farm.name}
                </span>
              </div>
              <div className="col s12 period-form">
                <MachineryContainer
                  machineryList={machinery}
                  addMachinery={addMachinery}
                  removeMachinery={removeMachinery}
                />
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="row">
          <div className="input-field col s12 m6">
            <DatePicker
              name="startPeriod"
              label="Дата начала"
              date={startDate}
              onSelect={date => setStartDate(date)}
            />
          </div>
          <div className="input-field col s12 m6">
            {machinery.length ? (
              <DatePicker
                name="endPeriod"
                label="Дата завершения"
                date={endDate}
                onSelect={date => setEndDate(date)}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          className="btn left red waves-effect waves-light modal-close"
          type="submit"
          name="action"
          form="period-form"
          onClick={deletePeriod}
        >
          Удалить период
          <i className="material-icons right">add</i>
        </button>
        <Link to="/" className="modal-close waves-effect btn-flat">
          Отмена
        </Link>
        {renderSubmitButton()}
      </div>
    </Modal>
  );
}

const mapStateToProps = store => {
  return {
    operationData: store.plan.operationData,
    periodData: store.plan.periodData
  };
};

export default connect(mapStateToProps, {
  deletePeriod,
  editPeriod,
  setPeriodData,
  setOperationData
})(EditPeriodForm);
