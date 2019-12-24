import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import history from "../../../history";

/** import components */
import { Link } from "react-router-dom";
import { Collapsible } from "materialize-css";
import MySelect from "../../shared/MySelect";
import Modal from "../../shared/Modal";
import Checkbox from "../../shared/Checkbox";

/** import actions */
import { createNewPlan } from "../../../actions/seasonPlan/plans";

function CreatePlanForm(props) {
  const collapsibleRef = useRef();
  const [isCopyingCurrent, toggleMode] = useState(false);
  const [planSeason, setPlanSeason] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    Collapsible.init(collapsibleRef.current);
  }, []);

  useEffect(() => {
    if (props.types.length) {
      let _type = props.types[0];
      setPlanType(_type);
    }
  }, [props.types]);

  useEffect(() => {
    if (planSeason) {
      if (planSeason.versions.length) {
        const lastVersion = Math.max(
          ...planSeason.versions.flatMap(x => x.version)
        );
        setNewVersion(lastVersion + 1);
      } else {
        setNewVersion(1);
      }
    } else setNewVersion(null);
  }, [planSeason]);

  // discard previous seasons
  let seasons = props.seasons;
  seasons = seasons.slice(-6);

  const createNewPlan = e => {
    if (!planSeason || !planType) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    props.createNewPlan({
      season: planSeason,
      type: planType,
      version: newVersion
    });
  };

  const createCopy = () => {
    console.log("create copy");
  };

  const renderCopyCurrentMode = () => {
    return (
      <React.Fragment>
        <div className="row center">
          <div className="col s12">
            <label htmlFor="">Будет создана копия текущего плана</label>
          </div>
        </div>
        <div className="row center">
          <div className="col s12">
            <button
              className="btn waves-effect waves-light modal-close"
              type="submit"
              name="action"
              form="period-form"
              onClick={createCopy}
            >
              Создать план
              <i className="material-icons right">add</i>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  };
  const renderNewMode = () => {
    const onSeasonChange = option => {
      setPlanSeason(option);
    };
    return (
      <React.Fragment>
        <div className="row">
          <div className="input-field col s12">
            <h6>Сезон</h6>
            <MySelect
              name="season_plan_create"
              classPrefix="rs"
              label="Сезон"
              options={seasons}
              defaultValue={planSeason}
              onChange={setPlanSeason}
              placeholder="Выберите сезон"
            />
          </div>
          <div className="col s12">
            {planSeason && (
              <React.Fragment>
                {planSeason.versions.length ? (
                  <React.Fragment>
                    <h6>Предыдущие версии</h6>
                    {planSeason.versions.map(v => (
                      <p key={v.version}>Версия {v.version}</p>
                    ))}
                  </React.Fragment>
                ) : (
                  <p>Нет предыдущих версий</p>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="row center">
          <div className="col s12">
            <label htmlFor="">
              {newVersion &&
                planSeason &&
                "Будет создана новая (" +
                  newVersion +
                  ") версия на сезон " +
                  planSeason.name}
            </label>
          </div>
        </div>

        <div className="row center">
          <div className="col s12">
            <button
              className="btn waves-effect waves-light modal-close"
              type="submit"
              name="action"
              form="period-form"
              onClick={createNewPlan}
              disabled={!planSeason || !newVersion}
            >
              Создать план
              <i className="material-icons right">add</i>
            </button>{" "}
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <Modal name="createPlan" onClose={() => history.push("/sp")}>
      <div className="modal-content">
        <ul className="collapsible" ref={collapsibleRef}>
          <li className="active">
            <div className="collapsible-header">Создать новый план</div>
            <div className="collapsible-body">{renderNewMode()}</div>
          </li>
          <li>
            <div className="collapsible-header">Создать копию текущего</div>
            <div className="collapsible-body">{renderCopyCurrentMode()}</div>
          </li>
        </ul>
      </div>
      <div className="modal-footer">
        <Link to="/" className="modal-close waves-effect btn-flat">
          Отмена
        </Link>
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

export default connect(mapStateToProps, { createNewPlan })(CreatePlanForm);
