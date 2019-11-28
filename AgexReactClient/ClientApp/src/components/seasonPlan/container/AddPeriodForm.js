import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import history from "../../../history";
import uuidv4 from "uuidv4";

/** import components */
import { Link } from "react-router-dom";
import MachineryContainer from "./MachineryContainer";
import Modal from "../../shared/Modal";
import DatePicker from "../../shared/DatePicker";

/** import utils */
import { getTotalProductivity, getPeriodDates } from "../../../utils/periods";
import { getSquareRemainder } from "../../../utils/plans";

/** import actions */
import { addNewPeriod, setPeriodData } from "../../../actions/periods";
import { setOperationData } from "../../../actions/operations";

function AddPeriodForm(props) {
  const { operationData } = props;
  if (!operationData) return null;
  const { holding, farm, crop, cropSquare, agroOperation } = operationData;
  const remainingArea = getSquareRemainder(operationData);

  /*
   ********** state ********
   */
  const [machinery, setMachinery] = useState([]);
  const [startDate, setStartDate] = useState(operationData.selectedDay);
  const [endDate, setEndDate] = useState(null);
  const [duration, setDuration] = useState(null);

  // watch for duration changes
  useEffect(() => {
    if (!machinery.length && duration) {
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
  }, [machinery]);

  // watch for endDate changes
  useEffect(() => {
    if (!duration) return;
    let newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + Math.ceil(duration) - 1);
    setEndDate(newEndDate);
  }, [startDate, duration]);

  const removeMachinery = pair => {
    let newMachinery = [...machinery];

    for (let i = 0; i < newMachinery.length; i++) {
      let item = newMachinery[i];
      const { vehicle, workEquipment } = item;
      if (
        (vehicle && vehicle.id) === (pair.vehicle && pair.vehicle.id) &&
        (workEquipment && workEquipment.id) ===
          (pair.workEquipment && pair.workEquipment.id)
      ) {
        newMachinery.splice(i, 1);
        break;
      }
    }
    setMachinery(newMachinery);
  };

  const addMachinery = val => {
    setMachinery([...machinery, { ...val }]);
  };

  const addPeriod = () => {
    // create dates
    const days = getPeriodDates({
      ...operationData,
      startDate,
      endDate,
      machinery
    });

    const newPeriod = {
      id: uuidv4(),
      days,
      machinery: machinery.map(pair => ({
        vehicleModel: pair.vehicle,
        workEquipmentModel: pair.workEquipment
      }))
    };

    props.addNewPeriod({ newPeriod, operationData });
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
        onClick={addPeriod}
      >
        Добавить период
        <i className="material-icons right">add</i>
      </button>
    );
  };

  return (
    <Modal name="addPeriod" className="big" onClose={closeForm}>
      <div className="modal-content">
        <div className="row">
          {operationData && (
            <React.Fragment>
              <div className="col s12">
                <span>
                  {crop.name} - {agroOperation.name}{" "}
                  <b>
                    {cropSquare - remainingArea} / {cropSquare} га
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
              name="startNewPeriod"
              label="Дата начала"
              date={startDate}
              onSelect={date => setStartDate(date)}
            />
          </div>
          <div className="input-field col s12 m6">
            {machinery.length ? (
              <DatePicker
                name="endNewPeriod"
                label="Дата завершения"
                date={endDate}
                onSelect={date => setEndDate(date)}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="modal-footer">
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
    operationData: store.plan.operationData
  };
};

export default connect(mapStateToProps, {
  addNewPeriod,
  setOperationData,
  setPeriodData
})(AddPeriodForm);
