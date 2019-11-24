import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../history";

// import FileSaver from "file-saverjs";
import TableExport from "tableexport";

/** import styles */
import "../../../styles/css/reports.css";

/** import components */
import Modal from "../../shared/Modal";
import Spinner from "../../shared/Spinner";
import SpinnerWrapper from "../../shared/SpinnerWrapper";

/** import actions */
import { loadProficitReport } from "../../../actions/reports";

/** import helpers */
import { stringToDate, dateToString } from "../../../helpers/dateHelper";

function ProficitReport({ proficit, ...props }) {
  const tableId = "proficit_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!proficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && proficit) toggleLoadStatus(false);

    if (proficit) {
      let table = TableExport(document.getElementById(tableId), {
        exportButtons: false,
        trimWhitespace: false
      });
      setTableInstance(table);
    }
  }, [proficit]);

  const refresh = () => {
    props.loadProficitReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    var exportData = tableInstance.getExportData();
    const { data, mimeType, filename, fileExtension } = exportData[
      tableId
    ].xlsx;
    tableInstance.export2file(data, mimeType, filename, fileExtension);
  };

  const renderProficit = () => {
    if (!proficit) return null;

    return (
      <table
        id={tableId}
        className="proficit-report"
        style={{ display: isLoading ? "none" : "table" }}
      >
        <thead>
          <tr>
            <th>Хозяйство</th>
            <th>Период</th>
            <th>Техника</th>
            <th>Прицепное</th>
          </tr>
        </thead>
        <tbody>
          {proficit.map((row, index) => {
            const { startDate, endDate, farm } = row;
            const { vehicleModel: vehicle, vehicleModelCount: vehicleCount } = row;
            const { workEquipmentModel: equipment, workEquipmentModelCount: equipmentCount } = row;

            const renderPeriod = () => (
              <p>
                <span>{dateToString(stringToDate(startDate), "dd.mm.yyyy")}</span> - 
                <span>{dateToString(stringToDate(endDate), "dd.mm.yyyy")}</span>
              </p>
            )

            return (
              <tr key={index}>
                <td>{farm.name}</td>
                <td>{renderPeriod()}</td>
                <td>{vehicle && vehicleCount + " ед - " + vehicle.name}</td>
                <td>{equipment && equipmentCount + " ед - " + equipment.name}</td>
              </tr>
            )
          })}
       </tbody>
      </table>
    );
  };

  return (
    <Modal
      name="deviationReport"
      className="big"
      onClose={() => history.push("/")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {renderProficit()}
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
        <Link to="/" className="modal-close waves-effect btn-flat">
          Закрыть
        </Link>
      </div>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    proficit: state.reports.proficit
  };
};

export default connect(mapStateToProps, { loadProficitReport })(ProficitReport);
