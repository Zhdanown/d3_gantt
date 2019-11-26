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
import MaterialTable from "material-table";

function ProficitReport({ proficit, ...props }) {
  const tableId = "proficit_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!proficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && proficit) toggleLoadStatus(false);

    // if (proficit) {
    //   let table = TableExport(document.getElementById(tableId), {
    //     exportButtons: false,
    //     trimWhitespace: false
    //   });
    //   setTableInstance(table);
    // }
  }, [proficit]);

  const refresh = () => {
    props.loadProficitReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    // var exportData = tableInstance.getExportData();
    // const { data, mimeType, filename, fileExtension } = exportData[
    //   tableId
    // ].xlsx;
    // tableInstance.export2file(data, mimeType, filename, fileExtension);
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
      onClose={() => history.push("/")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        <h5>Профицит техники</h5>
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
