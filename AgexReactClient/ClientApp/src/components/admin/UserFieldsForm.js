import React from "react";
import CollapsibleCard from "../shared/CollapsibleCard";

function UserFieldsForm(props) {
  return (
    <CollapsibleCard header="Основная информация">
      <div className="row">
        <div className="input-field col s12">
          <input id="last_name" type="text" />
          <label htmlFor="last_name">Фамилия</label>
        </div>
        <div className="input-field col s12">
          <input id="name" type="text" />
          <label htmlFor="name">Имя</label>
        </div>
        <div className="input-field col s12">
          <input id="patronymic" type="text" />
          <label htmlFor="patronymic">Отчество</label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s12">
          <input id="login" type="text" />
          <label htmlFor="login">Логин</label>
        </div>
        <div className="input-field col s12">
          <input id="domain" type="text" />
          <label htmlFor="domain">Домен</label>
        </div>
        <div className="input-field col s12">
          <input id="email" type="email" className="validate" />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field col s12">
          <input id="phone" type="tel" />
          <label htmlFor="phone">Телефон</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <span className="switch right">
            <label>
              Off
              <input id="is_active" type="checkbox" />
              <span className="lever"></span>
              On
            </label>
          </span>
          <label htmlFor="is_active">Активность</label>
        </div>
        <div className="input-field col s12">
          <span className="switch right">
            <label>
              Off
              <input id="is_admin" type="checkbox" />
              <span className="lever"></span>
              On
            </label>
          </span>
          <label htmlFor="is_admin">Администратор</label>
        </div>
      </div>
    </CollapsibleCard>
  );
}

export default UserFieldsForm;
