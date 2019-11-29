import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../../history";

import TableExport from "tableexport";

/** import components */
import Modal from "../../../shared/Modal";
import Spinner from "../../../shared/Spinner";
import SpinnerWrapper from "../../../shared/SpinnerWrapper";

/** import actions */
import { loadDeficitReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import MaterialTable from "material-table";

function DeficitReport({ deficit, ...props }) {
  const tableId = "deficit_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!deficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && deficit) toggleLoadStatus(false);

    // if (deficit) {
    //   let table = TableExport(document.getElementById(tableId), {
    //     exportButtons: false
    //   });
    //   setTableInstance(table);
    // }
  }, [deficit]);

  const refresh = () => {
    props.loadDeficitReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    // var exportData = tableInstance.getExportData();
    // const { data, mimeType, filename, fileExtension } = exportData[
    //   tableId
    // ].xlsx;
    // tableInstance.export2file(data, mimeType, filename, fileExtension);
  };

  const renderDeficit = () => {
    if (!deficit) return null;

    const columns = [
      { title: "Хозяйство", field: "farm" },
      { title: "Дата дефицита", field: "deficit_date" },
      {
        title: "Самоходная техника",
        field: "vehicles",
        render: rowData => {
          const { vehicles } = rowData;
          if (!vehicles.length) return null;
          return vehicles.map(v => (
            <p>
              {v.diffictCount} {v.modelName}
            </p>
          ));
        },
        customFilterAndSearch: (term, rowData) => {
          const { vehicles } = rowData;
          if (!vehicles.length) return false;
          return vehicles.find(v => v.modelName.includes(term));
        }
      },
      {
        title: "Сельхозорудие",
        field: "equipment",
        render: rowData => {
          const { equipment } = rowData;
          if (!equipment.length) return null;
          return equipment.map(e => (
            <p>
              {e.diffictCount} {e.modelName}
            </p>
          ));
        },
        customFilterAndSearch: (term, rowData) => {
          const { equipment } = rowData;
          if (!equipment.length) return false;
          return equipment.find(e => e.modelName.includes(term));
        }
      }
    ];

    const fdate = dateString =>
      dateToString(stringToDate(dateString), "dd.mm.yyyy");

    const data = deficit.map(row => {
      const { farm } = row;
      const { difictDate: deficitDate, diffictList: deficitList } = row;
      const vehiclesList = deficitList.filter(x => x.modelType == "Vehicle");

      const equipmentList = deficitList.filter(
        x => x.modelType == "WorkEquipment"
      );

      return {
        farm: farm,
        deficit_date: fdate(deficitDate),
        vehicles: vehiclesList,
        equipment: equipmentList
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
      name="deficitReport"
      className="full"
      onClose={() => history.push("/sp")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        <h5>Дефицит техники</h5>
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
        <Link to="/" className="modal-close waves-effect btn-flat">
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

export default connect(mapStateToProps, { loadDeficitReport })(DeficitReport);
