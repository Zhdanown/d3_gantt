import React from "react";
import CollapsibleCard from "../shared/CollapsibleCard";
import Switch from "../shared/Switch";
import InputField from "../shared/InputField";

function UserFieldsForm({ userProps, ...props }) {
  const { isActive, toggleActiveStatus } = userProps;
  const { isAdmin, toggleAdminStatus } = userProps;
  const { firstName, setFirstName } = userProps;
  const { lastName, setLastName } = userProps;
  const { middleName, setMiddleName } = userProps;
  const { login, setLogin } = userProps;
  const { password, setPassword } = userProps;
  const { domain, setDomain } = userProps;
  const { email, setEmail } = userProps;
  const { phone, setPhone } = userProps;

  return (
    <CollapsibleCard header="Основная информация">
      <div className="row">
        <InputField
          label="Фамилия"
          type="text"
          id="last_name"
          value={lastName}
          onChange={setLastName}
          disabled={true}
        />
        <InputField
          label="Имя"
          type="text"
          id="first_name"
          value={firstName}
          onChange={setFirstName}
          disabled={true}
        />
        <InputField
          label="Отчество"
          type="text"
          id="middle_name"
          value={middleName}
          onChange={setMiddleName}
          disabled={true}
        />
      </div>

      <div className="row">
        <InputField
          label="Логин"
          type="text"
          id="login"
          value={login}
          onChange={setLogin}
          disabled={true}
        />
        <InputField
          label="Пароль"
          type="text"
          id="password"
          value={password}
          onChange={setPassword}
          // disabled={true}
        />
        <InputField
          label="Домен"
          type="text"
          id="domain"
          value={domain}
          onChange={setDomain}
          disabled={true}
        />
        <InputField
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={setEmail}
          disabled={true}
        />
        <InputField
          label="Телефон"
          type="tel"
          id="phone"
          value={phone}
          onChange={setPhone}
          disabled={true}
        />
      </div>
      <div className="row">
        <Switch
          label="Активность"
          id="is_active"
          on={isActive}
          onChange={toggleActiveStatus}
        />
        <Switch
          label="Администратор"
          id="is_admin"
          on={isAdmin}
          onChange={toggleAdminStatus}
        />
      </div>
    </CollapsibleCard>
  );
}

export default UserFieldsForm;
