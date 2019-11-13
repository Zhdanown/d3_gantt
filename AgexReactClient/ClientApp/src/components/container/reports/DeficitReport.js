import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../history";

import TableExport from "tableexport";

/** import components */
import Modal from "../../shared/Modal";
import Spinner from "../../shared/Spinner";
import SpinnerWrapper from "../../shared/SpinnerWrapper";

/** import actions */
import { loadDeficitReport } from "../../../actions/reports";

/** import helpers */
import { stringToDate, dateToString } from "../../../helpers/dateHelper";

function DeficitReport({ deficit, ...props }) {
  const tableId = "deficit_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!deficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && deficit) toggleLoadStatus(false);

    if (deficit) {
      let table = TableExport(document.getElementById(tableId), {
        exportButtons: false
      });
      setTableInstance(table);
    }
  }, [deficit]);

  const refresh = () => {
    props.loadDeficitReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    var exportData = tableInstance.getExportData();
    const { data, mimeType, filename, fileExtension } = exportData[
      tableId
    ].xlsx;
    tableInstance.export2file(data, mimeType, filename, fileExtension);
  };

  const renderDeficit = () => {
    if (!deficit) return null;

    return (
      <table
        id={tableId}
        className="deficit-report"
        style={{ display: isLoading ? "none" : "table" }}
      >
        <thead>
          <tr>
            <th>ОП</th>
            <th>Культура</th>
            <th>Агрооперация</th>
            <th>Агросрок по техкарте</th>
            <th>Дата дефицита</th>
            <th>Техника</th>
            <th>Прицепное</th>
          </tr>
        </thead>
        <tbody>
          {deficit.map((entry, index) => {
            const { crop, farm, operation } = entry;
            const { difictDate: deficitDate, diffictList: deficitList } = entry;

            const vehiclesList = deficitList.filter(
              x => x.modelType == "Vehicle"
            );

            const equipmentList = deficitList.filter(
              x => x.modelType == "WorkEquipment"
            );

            const renderVehicles = () => {
              return vehiclesList.map((v, i) => {
                return (
                  <div key={i} className="truncate">
                    {v.diffictCount} {v.modelName}
                  </div>
                );
              });
            };

            const renderEquipment = () => {
              return equipmentList.map((e, i) => (
                <div key={i} className="truncate">
                  {e.diffictCount} {e.modelName}
                </div>
              ));
            };

            const fdate = dateString =>
              dateToString(stringToDate(dateString), "dd.mm.yyyy");

            return (
              <tr key={index}>
                <td>{farm}</td>
                <td>{crop}</td>
                <td>{operation}</td>
                <td>-----</td>
                <td>{fdate(deficitDate)}</td>
                <td>{renderVehicles()}</td>
                <td>{renderEquipment()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Modal
      name="deficitReport"
      className="big"
      onClose={() => history.push("/")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {renderDeficit()}
      </div>
      <div className="modal-footer">
        <button
          className="btn left waves-effect waves-light"
          type="submit"
          name="action"
          form="period-form"
          onClick={refresh}
        >
          Обновить отчет
          <i className="material-icons right">refresh</i>
        </button>
        <button
          className="btn left waves-effect waves-light"
          type="submit"
          name="action"
          form="period-form"
          onClick={exportTable}
        >
          Экспортировать в Excel
          <i className="material-icons right">forward</i>
        </button>
        <Link to="/" className="modal-close waves-effect waves-green btn-flat">
          Закрыть
        </Link>
      </div>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    deficit: state.reports.deficit
  };
};

export default connect(
  mapStateToProps,
  { loadDeficitReport }
)(DeficitReport);
