import React, { useState } from "react";
import { connect } from "react-redux";
import history from "../../history";
import Modal from "../shared/Modal";
import MySelect from "../shared/MySelect";
import DatePicker from "../shared/DatePicker";
/** import actions */
import { loadPlan } from "../../actions/plans";
/** import helpers */
import { dateToString } from "../../helpers/dateHelper";

function LoadPlanForm(props) {
  const [season, setSeason] = useState(null);
  const [type, setType] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // discard previous seasons
  let seasons = props.seasons.filter(x => !x.isDelete);
  seasons = seasons.slice(-6);

  const fetchPlan = () => {
    const start = dateToString(startDate, "yyyy-mm-dd");
    const end = dateToString(endDate, "yyyy-mm-dd");
    // const start = "2020-03-01";
    // const end = "2020-04-30";

    props.loadPlan({ seasonId: season.id, typeId: type.id, start, end });
  };

  return (
    <Modal name="loadPlan" onClose={() => history.push("/")}>
      <div className="modal-content">
        <h5 className="center">Загрузить план</h5>
        <div className="row">
          <div className="input-field col s12">
            <h6>Сезон</h6>
            <MySelect
              name="season_plan_load"
              label="Сезон"
              options={seasons}
              defaultValue={season}
              onChange={setSeason}
            />
          </div>
          <div className="input-field col s12">
            <h6>Тип</h6>
            <MySelect
              name="type_plan_create"
              label="Тип"
              options={props.types}
              defaultValue={type}
              onChange={setType}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-field col s6">
            <DatePicker
              name="start"
              label="Дата начала"
              date={startDate}
              onSelect={date => setStartDate(date)}
            />
          </div>
          <div className="input-field col s6">
            <DatePicker
              name="end"
              label="Дата завершения"
              date={endDate}
              onSelect={date => setEndDate(date)}
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">
          Отмена
        </a>
        <button
          className="btn waves-effect waves-light modal-close"
          type="submit"
          name="action"
          form="period-form"
          onClick={fetchPlan}
        >
          Загрузить план
          <i className="material-icons right">send</i>
        </button>
      </div>
    </Modal>
  );
}

const mapStateToProps = store => {
  return {
    seasons: store.plan.seasons,
    types: store.plan.types
  };
};

export default connect(
  mapStateToProps,
  { loadPlan }
)(LoadPlanForm);
