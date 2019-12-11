import React, { useEffect } from "react";

const InputField = ({
  label,
  type,
  id,
  value,
  onChange,
  helperText,
  ...props
}) => {
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  return (
    <div className="input-field col s12">
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        disabled={props.disabled}
      />
      <label htmlFor={id}>{label}</label>
      {helperText && (
        <span className="helper-text" data-error="wrong" data-success="right">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default InputField;
