import React, { useState } from "react";
import { connect } from "react-redux";
import history from "../../../history";
import uuid from "uuidv4";

import { Link } from "react-router-dom";
/** import custom components */
import Modal from "../../shared/Modal";
import MySelect from "../../shared/MySelect";
import DatePicker from "../../shared/DatePicker";
import alert from "../../../utils/Alert";
/** import actions */
import { addNewOperation } from "../../../actions/seasonPlan/operations";

function AddOperationForm({ agroOperations, ...props }) {
  const { operationData } = props;
  if (!operationData) return null;
  const { holding, farm, crop, cropSquare } = operationData;

  const [selectedAgroOperation, selectAgroOperation] = useState(null);
  const [startDate, setStartDate] = useState(new Date(operationData.startDate));
  const [endDate, setEndDate] = useState(new Date(operationData.endDate));

  const addNewOperation = () => {
    let errors = [];
    if (!selectedAgroOperation) errors.push("Не выбрана агрооперация!");
    if (!startDate) errors.push("Не выбрана дата начала!");
    if (!endDate) errors.push("Не выбрана дата завершения!");
    if (startDate && endDate && startDate.getTime() >= endDate.getTime())
      errors.push("Дата начала должны быть меньше даты завершения!");
    if (errors.length) {
      errors.forEach(error => alert.warning(error));
      return;
    }

    const newOperation = {
      id: uuid(), // unique operation id in plans scope
      agroOperation: {
        id: selectedAgroOperation.id,
        name: selectedAgroOperation.name
      },
      crop,
      farm,
      holding,
      cropSquare,
      startDate,
      endDate,
      periods: []
    };
    props.addNewOperation(newOperation);
  };

  return (
    <Modal name="loadPlan" onClose={() => history.push("/sp")}>
      <div className="modal-content">
        <h5 className="center">Добавить операцию</h5>
        <div className="row">
          {operationData && (
            <div className="col s12 m6">
              <p>
                Холдинг: <b>{holding.name}</b>
              </p>
              <p>
                Хозяйство: <b>{farm.name}</b>
              </p>
              <p>
                Культура: <b>{crop.name}</b>
              </p>
            </div>
          )}
          <div className="input-field col s12 m6">
            <h6>Агрооперация</h6>
            <MySelect
              name="add_new_operation"
              label="Новая операция"
              options={agroOperations}
              // defaultValue={season}
              onChange={selectAgroOperation}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12 m6">
            <DatePicker
              name="startNewOperation"
              label="Дата начала"
              date={startDate}
              onSelect={date => setStartDate(date)}
            />
          </div>
          <div className="input-field col s12 m6">
            <DatePicker
              name="endNewOperation"
              label="Дата завершения"
              date={endDate}
              onSelect={date => setEndDate(date)}
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <Link to="/" className="modal-close waves-effect btn-flat">
          Отмена
        </Link>
        <button
          className="btn waves-effect waves-light modal-close"
          type="submit"
          name="action"
          form="period-form"
          onClick={addNewOperation}
        >
          Добавить операцию
          <i className="material-icons right">add</i>
        </button>
      </div>
    </Modal>
  );
}

const mapStateToProps = store => {
  return {
    operationData: store.plan.operationData,
    agroOperations: store.plan.agrooperations
  };
};

export default connect(mapStateToProps, { addNewOperation })(AddOperationForm);
