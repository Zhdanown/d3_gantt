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
import { loadLogsReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import { exportLogsReport } from "../../../../utils/exportReports";

function LogsReport({ logs, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  let end = new Date();
  let start = new Date(new Date().setDate(new Date().getDate() - 1));
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  useEffect(() => {
    if (!logs) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && logs) toggleLoadStatus(false);
  }, [logs]);

  const refresh = () => {
    props.loadLogsReport(startDate, endDate);
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);
    exportLogsReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
  };

  const renderLogs = () => {
    if (!logs) return null;

    const columns = [
      { title: "Пользователь", field: "user" },
      { title: "Изменение", field: "comment" },
      { title: "Хозяйство", field: "farm" },
      { title: "Культура", field: "crop" },
      { title: "Агрооперация", field: "agroOperation" },
      { title: "Дата/время лога", field: "addDate" }
    ];

    const formatDate = dateString =>
      dateToString(stringToDate(dateString), "dd.mm.yyyy hh:mm:ss");

    const data = logs.map(row => {
      const { user, comment, farm, crop, addDate, agroOperation } = row;
      return {
        user,
        comment,
        farm: farm.name,
        crop: crop.name,
        agroOperation: agroOperation.name,
        addDate: formatDate(addDate)
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
      name="logsReport"
      className="full"
      onClose={() => history.push("/sp")}
    >
      <div className="modal-content">
        {isLoading && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {logs && !isLoading && (
          <React.Fragment>
            <h5>Логи</h5>
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
            {renderLogs()}
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
    logs: state.reports.logs
  };
};

export default connect(mapStateToProps, { loadLogsReport })(LogsReport);
