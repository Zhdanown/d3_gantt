import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import history from "../../../history";
/** import components */
import { Link } from "react-router-dom";
import Modal from "../../shared/Modal";
import MySelect from "../../shared/MySelect";
import DatePicker from "../../shared/DatePicker";
/** import actions */
import { loadPlan } from "../../../actions/seasonPlan/plans";
/** import utils */
import { dateToString } from "../../../utils/dateHelper";

function LoadPlanForm(props) {
  const [season, setSeason] = useState(null);
  const [type, setType] = useState(null);
  const [versionList, setVersionList] = useState([]);
  const [version, setVersion] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // set type
  useEffect(() => {
    if (props.types.length) {
      let _type = props.types[0];
      setType(_type);
    }
  }, [props.types]);

  useEffect(() => {
    setVersion(null);
    if (season) setVersionList(season.versions);
  }, [season]);

  // discard previous seasons
  let seasons = props.seasons.filter(x => !x.isDelete);
  seasons = seasons.slice(-6);

  const fetchPlan = () => {
    // const start = dateToString(startDate, "yyyy-mm-dd");
    // const end = dateToString(endDate, "yyyy-mm-dd");
    const start = "2020-03-01";
    const end = "2021-03-01";
    props.loadPlan({ season, type, version: version.version });
  };

  return (
    <Modal name="loadPlan" onClose={() => history.push("/sp")}>
      <div className="modal-content">
        <h5 className="center">Загрузить план</h5>
        <div className="row">
          <div className="input-field col s12">
            <h6>Сезон</h6>
            <MySelect
              name="season_plan_load"
              classPrefix="rs"
              label="Сезон"
              options={seasons}
              defaultValue={season}
              onChange={setSeason}
              placeholder="Выерите сезон"
            />
          </div>
          <div className="input-field col s12">
            <h6>Версия</h6>
            <MySelect
              name="version_plan_create"
              classPrefix="rs"
              label="Версия"
              options={versionList}
              defaultValue={version}
              onChange={setVersion}
              getOptionLabel={opt => opt.value.version}
              placeholder="Выберите версию"
            />
          </div>
        </div>
        {/* <div className="row">
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
        </div> */}
      </div>
      <div className="modal-footer">
        <Link to="/" className="modal-close waves-effect btn-flat">
          Отмена
        </Link>
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

export default connect(mapStateToProps, { loadPlan })(LoadPlanForm);
