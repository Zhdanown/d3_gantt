import React from "react";

function Attributes() {
  return (
    <div className="card">
      <div className="card-content">
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
            <span class="switch right">
              <label>
                Off
                <input id="is_active" type="checkbox" />
                <span class="lever"></span>
                On
              </label>
            </span>
            <label htmlFor="is_active">Активность</label>
          </div>
          <div className="input-field col s12">
            <span class="switch right">
              <label>
                Off
                <input id="is_admin" type="checkbox" />
                <span class="lever"></span>
                On
              </label>
            </span>
            <label htmlFor="is_admin">Администратор</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attributes;
