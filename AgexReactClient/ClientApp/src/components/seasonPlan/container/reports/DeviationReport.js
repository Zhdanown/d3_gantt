import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import history from "../../../../history";

// import FileSaver from "file-saverjs";
import TableExport from "tableexport";

/** import styles */
import "../../../../styles/css/reports.css";

/** import components */
import Modal from "../../../shared/Modal";
import Spinner from "../../../shared/Spinner";
import SpinnerWrapper from "../../../shared/SpinnerWrapper";

/** import actions */
import { loadDeviationReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import MaterialTable from "material-table";
import alert from "../../../../utils/Alert";

function DeviationReport({ deviation, ...props }) {
  const tableId = "deviation_report";
  const [isLoading, toggleLoadStatus] = useState(false);
  const [tableInstance, setTableInstance] = useState(null);

  useEffect(() => {
    if (!deviation) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && deviation) toggleLoadStatus(false);

    // if (deviation) {
    //   let table = TableExport(document.getElementById(tableId), {
    //     exportButtons: false
    //   });
    //   setTableInstance(table);
    // }
  }, [deviation]);

  const refresh = () => {
    props.loadDeviationReport();
    toggleLoadStatus(true);
  };

  const exportTable = () => {
    window.alert("in development");
    // var exportData = tableInstance.getExportData();
    // const { data, mimeType, filename, fileExtension } = exportData[
    //   tableId
    // ].xlsx;
    // tableInstance.export2file(data, mimeType, filename, fileExtension);
  };

  const renderDeviation = () => {
    if (!deviation) return null;
    deviation = deviation.filter(x => x.isDeviation);

    const columns = [
      { title: "Хозяйство", field: "farm" },
      { title: "Культура", field: "crop" },
      { title: "Агрооперации", field: "operation" },
      { title: "Агросрок по техкарте", field: "tm_terms" },
      { title: "Плановая дата исполнения", field: "plan_terms" },
      { title: "Остаток/Площадь", field: "square_balance" }
    ];

    const data = deviation.map(row => {
      const { crop, farm, agroOperation } = row;
      const { square, squareBalance } = row;
      // агросрок по техкарте
      const {
        startAgroOperationFact: tm_start,
        endAgroOperationFact: tm_end
      } = row;
      // запланированный агросрок
      const {
        startAgroOperationPlan: plan_start,
        endAgroOperationPlan: plan_end
      } = row;

      const fdate = dateString =>
        dateToString(stringToDate(dateString), "dd.mm.yyyy");

      return {
        farm: farm.name,
        crop: crop.name,
        operation: agroOperation.name,
        tm_terms: fdate(tm_start) + " - " + fdate(tm_end),
        plan_terms: fdate(plan_start) + " - " + fdate(plan_end),
        square_balance: squareBalance + "/" + square
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
        <h5>Реестр отклонений</h5>
        {renderDeviation()}
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
    deviation: state.reports.deviation
  };
};

export default connect(mapStateToProps, { loadDeviationReport })(
  DeviationReport
);
