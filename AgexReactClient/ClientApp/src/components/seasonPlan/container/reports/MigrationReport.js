import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import history from "../../../../history";

/** import components */
import Modal from "../../../shared/Modal";
import Spinner from "../../../shared/Spinner";
import SpinnerWrapper from "../../../shared/SpinnerWrapper";
import AsyncButton from "../../../shared/AsyncButton";

/** imprort actions */
import { loadMigrationReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { dateToString, stringToDate } from "../../../../utils/dateHelper";
import { exportMigrationReport } from "../../../../utils/exportReports";

function MigrationReport({ migration, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  useEffect(() => {
    if (!migration) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && migration) toggleLoadStatus(false);
  }, [migration]);

  const refresh = () => {
    props.loadMigrationReport();
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);
    exportMigrationReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
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
      onClose={() => history.push("/sp")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {migration && !isLoading && (
          <React.Fragment>
            <h5>Перемещения техники</h5>
            {renderMigration()}
          </React.Fragment>
        )}
      </div>
      <div className="modal-footer">
        <AsyncButton
          label="Обновить отчет"
          className="btn left waves-effect waves-light"
          onClick={refresh}
          isLoading={isLoading}
        >
          <i className="material-icons right">refresh</i>
        </AsyncButton>
        <AsyncButton
          label="Экспортировать в excel"
          className="btn left waves-effect waves-light"
          onClick={exportReport}
          isLoading={isExporting}
        >
          <i className="material-icons right">forward</i>
        </AsyncButton>
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
