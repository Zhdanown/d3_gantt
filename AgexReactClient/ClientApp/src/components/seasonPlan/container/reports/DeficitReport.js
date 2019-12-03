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

/** import actions */
import { loadDeficitReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import { exportDeficitReport } from "../../../../utils/exportReports";

function DeficitReport({ deficit, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  useEffect(() => {
    if (!deficit) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && deficit) toggleLoadStatus(false);
  }, [deficit]);

  const refresh = () => {
    props.loadDeficitReport();
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);
    exportDeficitReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
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
        {deficit && !isLoading && (
          <React.Fragment>
            <h5>Дефицит техники</h5>
            {renderDeficit()}
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
    deficit: state.reports.deficit
  };
};

export default connect(mapStateToProps, { loadDeficitReport })(DeficitReport);
