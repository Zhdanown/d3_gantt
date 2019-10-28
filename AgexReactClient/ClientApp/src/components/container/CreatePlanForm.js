import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import history from "../../history";
import Modal from "../shared/Modal";
import MySelect from "../shared/MySelect";
/** import actions */
import { createNewPlan } from "../../actions/plans";

function CreatePlanForm(props) {
  const [planSeason, setPlanSeason] = useState(null);
  const [planType, setPlanType] = useState(null);

  // discard previous seasons
  let seasons = props.seasons.filter(x => !x.isDelete);
  seasons = seasons.slice(-6);

  const submitNewPlan = e => {
    if (!planSeason || !planType) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    props.createNewPlan({
      seasonPlanId: planSeason.id,
      typePlanId: planType.id
    });
  };

  return (
    <Modal name="createPlan" onClose={() => history.push("/")}>
      <div className="modal-content">
        <h5 className="center">Создать план</h5>
        <div className="row">
          <div className="input-field col s12">
            <h6>Сезон</h6>
            <MySelect
              name="season_plan_create"
              label="Сезон"
              options={seasons}
              defaultValue={planSeason}
              onChange={setPlanSeason}
            />
          </div>
          <div className="input-field col s12">
            <h6>Тип</h6>
            <MySelect
              name="type_plan_create"
              label="Тип"
              options={props.types}
              defaultValue={planType}
              onChange={setPlanType}
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
          onClick={submitNewPlan}
        >
          Создать план
          <i className="material-icons right">send</i>
        </button>{" "}
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
  { createNewPlan }
)(CreatePlanForm);
