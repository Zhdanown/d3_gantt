import React, { useState, useEffect } from "react";

function Checkbox({ item, onInputChange }) {
  const [checked, toggle] = useState(item.checked);

  useEffect(() => {
    toggle(item.checked);
  }, [item.checked]);

  const onChange = event => {
    toggle(event.target.checked);
  };

  useEffect(() => {
    onInputChange({ ...item, checked });
  }, [checked]);

  return (
    <p>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={item => onChange(item)}
        />
        <span>{item.name}</span>
      </label>
    </p>
  );
}

Checkbox.defaultProps = {
  checked: false,
  onInputChange: item => console.log(item)
};

export default Checkbox;
