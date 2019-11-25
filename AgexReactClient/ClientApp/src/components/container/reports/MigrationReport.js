import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../history";

import TableExport from "tableexport";

/** import components */
import Modal from "../../shared/Modal";
import Spinner from "../../shared/Spinner";
import SpinnerWrapper from "../../shared/SpinnerWrapper";

/** imprort actions */
import { loadMigrationReport } from "../../../actions/reports";

/** import helpers */
import { dateToString, stringToDate } from "../../../helpers/dateHelper";

function MigrationReport({ migration, ...props }) {
  const tableId = "migration_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!migration) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && migration) toggleLoadStatus(false);

    if (migration) {
      let table = TableExport(document.getElementById(tableId), {
        exportButtons: false
      });
      setTableInstance(table);
    }
  }, [migration]);

  const refresh = () => {
    props.loadMigrationReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    var exportData = tableInstance.getExportData();
    const { data, mimeType, filename, fileExtension } = exportData[
      tableId
    ].xlsx;
    tableInstance.export2file(data, mimeType, filename, fileExtension);
  };
  const renderMigration = () => {
    if (!migration) return null;

    const locales = {
      Vehicle: "Самоходная теника",
      WorkEquipment: "Сельхозорудие"
    };

    return (
      <table
        id={tableId}
        className="migration-report"
        style={{ display: isLoading ? "none" : "table" }}
      >
        <thead>
          <tr>
            <th>Дата перемещения</th>
            <th>Из</th>
            <th>В</th>
            <th>Тип техники</th>
            <th>Наименование</th>
          </tr>
        </thead>
        <tbody>
          {migration.map((row, index) => {
            const { dateMovement, equipmentName, equipmentType } = row;
            const { from, to } = row;
            return (
              <tr key={index}>
                <td>
                  {dateToString(stringToDate(dateMovement), "dd.mm.yyyy")}
                </td>
                <td>{from.name}</td>
                <td>{to.name}</td>
                <td>{locales[equipmentType]}</td>
                <td>{equipmentName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Modal
      name="migrationReport"
      className="big"
      onClose={() => history.push("/")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {renderMigration()}
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
    migration: state.reports.migration
  };
};

export default connect(mapStateToProps, { loadMigrationReport })(
  MigrationReport
);
