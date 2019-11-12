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

/** import actions */
import { loadDeviationReport } from "../../../actions/reports";

/** import helpers */
import { stringToDate, dateToString } from "../../../helpers/dateHelper";

function DeviationReport({ deviation, ...props }) {
  const tableId = "deviation_report";
  const [isDeviationLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!deviation) {
      props.loadDeviationReport();
      toggleLoadStatus(true);
    }
  }, []);

  useEffect(() => {
    if (isDeviationLoading && deviation) toggleLoadStatus(false);

    if (deviation) {
      let table = TableExport(document.getElementById(tableId), {
        exportButtons: false
      });
      setTableInstance(table);
    }
  }, [deviation]);

  const exportTable = () => {
    var exportData = tableInstance.getExportData();
    const { data, mimeType, filename, fileExtension } = exportData[
      tableId
    ].xlsx;
    tableInstance.export2file(data, mimeType, filename, fileExtension);
  };

  const renderDeviation = () => {
    if (!deviation) return null;

    deviation = deviation.filter(x => x.isDeviation);

    return (
      <table id={tableId} className="deviation-report">
        <thead>
          <tr>
            <th>ОП</th>
            <th>Культура</th>
            <th>Агрооперация</th>
            <th>Агросрок по техкарте</th>
            <th>Пановая дата исполенения</th>
            <th>Остаток/Площадь</th>
          </tr>
        </thead>
        <tbody>
          {deviation.map((entry, index) => {
            const { crop, farm, agroOperation } = entry;
            const { square, squareBalance } = entry;
            // агросрок по техкарте
            const { startAgroOperationFact, endAgroOperationFact } = entry;
            // запланированный агросрок
            const { startAgroOperationPlan, endAgroOperationPlan } = entry;

            const fdate = dateString =>
              dateToString(stringToDate(dateString), "dd.mm.yyyy");

            const isStartDeviation =
              stringToDate(startAgroOperationFact).getTime() >
              stringToDate(startAgroOperationPlan).getTime();

            const isEndDeviation =
              stringToDate(endAgroOperationFact).getTime() <
              stringToDate(endAgroOperationPlan).getTime();

            return (
              <tr key={index}>
                <td>{farm.name}</td>
                <td>{crop.name}</td>
                <td>{agroOperation.name}</td>
                <td>
                  {fdate(startAgroOperationFact) +
                    " - " +
                    fdate(endAgroOperationFact)}
                </td>
                <td>
                  <span className={isStartDeviation ? "deviation" : null}>
                    {fdate(startAgroOperationPlan)}
                  </span>
                  {" - "}
                  <span className={isEndDeviation ? "deviation" : null}>
                    {fdate(endAgroOperationPlan)}
                  </span>
                </td>
                <td className={squareBalance < square ? "deviation" : null}>
                  {squareBalance + "/" + square}
                </td>
              </tr>
            );
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
        {isDeviationLoading && (
          <p className="center">Loading deviation report...</p>
        )}
        {renderDeviation()}
      </div>
      <div className="modal-footer">
        <button
          className="btn left waves-effect waves-light"
          type="submit"
          name="action"
          form="period-form"
          onClick={e => console.log(e)}
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
    deviation: state.reports.deviation
  };
};

export default connect(
  mapStateToProps,
  { loadDeviationReport }
)(DeviationReport);
