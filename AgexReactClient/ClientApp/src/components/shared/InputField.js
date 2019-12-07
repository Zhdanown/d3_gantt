import React, {useEffect} from "react";

const InputField = ({ label, type, id, value, onChange, ...props }) => {
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
      </div>
    );
  };
  
export default InputField;