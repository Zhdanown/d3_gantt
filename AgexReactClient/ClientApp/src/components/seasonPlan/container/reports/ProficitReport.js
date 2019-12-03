import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import history from "../../../../history";

/** import styles */
import "../../../../styles/css/reports.css";

/** import components */
import Modal from "../../../shared/Modal";
import Spinner from "../../../shared/Spinner";
import SpinnerWrapper from "../../../shared/SpinnerWrapper";
import AsyncButton from "../../../shared/AsyncButton";

/** import actions */
import { loadProficitReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import { exportProficitReport } from "../../../../utils/exportReports";

function ProficitReport({ proficit, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  useEffect(() => {
    if (!proficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && proficit) toggleLoadStatus(false);
  }, [proficit]);

  const refresh = () => {
    props.loadProficitReport();
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);
    exportProficitReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
  };

  const renderProficit = () => {
    if (!proficit) return null;

    const columns = [
      { title: "Хозяйство", field: "farm" },
      { title: "Период", field: "period" },
      { title: "Тип техники", field: "type" },
      {
        title: "Наименование",
        field: "modelName",
        render: rowData => rowData.count + " " + rowData.modelName
      }
    ];

    const fdate = dateString =>
      dateToString(stringToDate(dateString), "dd.mm.yyyy");

    const data = proficit.map(row => {
      const { startDate: start, endDate: end, farm } = row;
      const { vehicleModel: vehicle, vehicleModelCount: vehicleCount } = row;
      const {
        workEquipmentModel: equipment,
        workEquipmentModelCount: equipmentCount
      } = row;
      const type = vehicle
        ? "Самоходная техника"
        : equipment
        ? "Сельхозорудие"
        : null;

      return {
        farm: farm.name,
        period: fdate(start) + " - " + fdate(end),
        type,
        modelName: (vehicle && vehicle.name) || (equipment && equipment.name),
        count: (vehicle && vehicleCount) || (equipment && equipmentCount)
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
      name="deviationReport"
      className="full"
      onClose={() => history.push("/sp")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {proficit && !isLoading && (
          <React.Fragment>
            <h5>Профицит техники</h5>
            {renderProficit()}
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
    proficit: state.reports.proficit
  };
};

export default connect(mapStateToProps, { loadProficitReport })(ProficitReport);
