import React, { useState, useEffect } from "react";

const Switch = ({ label, on, id, ...props }) => {
  const [enabled, toggle] = useState(on);

  useEffect(() => {
    props.onChange(enabled);
  }, [enabled]);

  return (
    <div className="input-field col s12">
      <span className="switch right">
        <label>
          Off
          <input
            id={id}
            type="checkbox"
            checked={enabled}
            onChange={() => toggle(!enabled)}
          />
          <span className="lever"></span>
          On
        </label>
      </span>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

Switch.defaultProps = {
  onChange: status => console.log(status),
  on: false
};

export default Switch;
