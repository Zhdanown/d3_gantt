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

/** import actions */
import { loadDeviationReport } from "../../../../actions/seasonPlan/reports";

/** import utils */
import { stringToDate, dateToString } from "../../../../utils/dateHelper";
import { exportDeviationReport } from "../../../../utils/exportReports";
import AsyncButton from "../../../shared/AsyncButton";

function DeviationReport({ deviation, ...props }) {
  const [isLoading, toggleLoadStatus] = useState(false);
  const [isExporting, toggleExportStatus] = useState(false);

  useEffect(() => {
    if (!deviation) refresh();
  }, []);

  useEffect(() => {
    if (isLoading && deviation) toggleLoadStatus(false);
  }, [deviation]);

  const refresh = () => {
    props.loadDeviationReport();
    toggleLoadStatus(true);
  };

  const exportReport = () => {
    toggleExportStatus(true);

    exportDeviationReport()
      .then(res => toggleExportStatus(false))
      .catch(res => toggleExportStatus(false));
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
        {deviation && !isLoading && (
          <React.Fragment>
            <h5>Реестр отклонений</h5>
            {renderDeviation()}
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
    deviation: state.reports.deviation
  };
};

export default connect(mapStateToProps, { loadDeviationReport })(
  DeviationReport
);
