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
import DatePicker from "../../../shared/DatePicker";

/** import actions */
import { loadTechMapChangesReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import { exportTechmapChangesReport } from "../../../../utils/exportReports";

function TechMapChangesReport({ techmapChanges, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  let end = new Date();
  let start = new Date(new Date().setDate(new Date().getDate() - 1));
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  useEffect(() => {
    if (!techmapChanges) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && techmapChanges) toggleLoadStatus(false);
  }, [techmapChanges]);

  const refresh = () => {
    props.loadTechMapChangesReport(startDate, endDate);
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);
    exportTechmapChangesReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
  };

  const renderTechmapChanges = () => {
    if (!techmapChanges) return null;

    const columns = [
      { title: "Дата изменения", field: "createDate" },
      { title: "Было", field: "previousState" },
      { title: "Стало", field: "nextState" }
    ];

    const formatDate = dateString =>
      dateToString(stringToDate(dateString), "dd.mm.yyyy hh:mm:ss");

    const data = techmapChanges.map(row => {
      const { createDate, previousState, nextState } = row;

      return {
        createDate: formatDate(createDate),
        previousState,
        nextState
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
      name="techmapChangesReport"
      className="full"
      onClose={() => history.push("/sp")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {techmapChanges && !isLoading && (
          <React.Fragment>
            <h5>Изменения техкарты</h5>
            <div className="row">
              <div className="input-field col s12 m6">
                <DatePicker
                  name="startLog"
                  label="Дата начала"
                  date={startDate}
                  onSelect={date => setStartDate(date)}
                />
              </div>
              <div className="input-field col s12 m6">
                <DatePicker
                  name="endLog"
                  label="Дата завершения"
                  date={endDate}
                  onSelect={date => setEndDate(date)}
                />
              </div>
            </div>
            {renderTechmapChanges()}
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
        {/* <AsyncButton
          label="Экспортировать в excel"
          className="btn left waves-effect waves-light"
          onClick={exportReport}
          isLoading={isExporting}
        >
          <i className="material-icons right">forward</i>
        </AsyncButton> */}
        <Link to="/" className="modal-close waves-effect btn-flat">
          Закрыть
        </Link>
      </div>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    techmapChanges: state.reports.techmap_changes
  };
};

export default connect(mapStateToProps, { loadTechMapChangesReport })(
  TechMapChangesReport
);
