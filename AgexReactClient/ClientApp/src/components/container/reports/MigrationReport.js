import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../history";

import TableExport from "tableexport";

/** import components */
import MaterialTable from "material-table";
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

    // if (migration) {
    //   let table = TableExport(document.getElementById(tableId), {
    //     exportButtons: false
    //   });
    //   setTableInstance(table);
    // }
  }, [migration]);

  const refresh = () => {
    props.loadMigrationReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    alert("In progress");
    // var exportData = tableInstance.getExportData();
    // const { data, mimeType, filename, fileExtension } = exportData[
    //   tableId
    // ].xlsx;
    // tableInstance.export2file(data, mimeType, filename, fileExtension);
  };
  const renderMigration = () => {
    if (!migration) return null;

    const locales = {
      Vehicle: "Самоходная теника",
      WorkEquipment: "Сельхозорудие"
    };

    const columns = [
      { title: "Дата перемещения", field: "migrationDate" },
      { title: "Из", field: "whereFrom" },
      { title: "В", field: "whereTo" },
      { title: "Тип техники", field: "type" },
      { title: "Наименование", field: "modelName" }
    ];

    const data = migration.map(row => {
      return {
        modelName: row.equipmentName,
        type: locales[row.equipmentType],
        migrationDate: dateToString(
          stringToDate(row.dateMovement),
          "dd.mm.yyyy"
        ),
        whereFrom: row.from.name,
        whereTo: row.to.name
      };
    });

    return (
      <MaterialTable
        columns={columns}
        data={data}
        title=""
        options={{
          filtering: true,
          search: false,
          toolbar: false,
          pageSizeOptions: [5, 10, 20, 50, 100]
        }}
      />
    );
  };

  return (
    <Modal
      name="migrationReport"
      className="full"
      onClose={() => history.push("/")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        <h5>Перемещения техники</h5>
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
