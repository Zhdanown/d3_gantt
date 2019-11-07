import React, { useState, useEffect } from "react";

function Dropdown({ caption, ...props }) {
  const [id] = useState(props.name + "_" + Math.round(Math.random() * 100000));

  useEffect(() => {
    let elem = document.querySelector("#dropdown-trigger-" + id);
    window.M.Dropdown.init(elem, {
      coverTrigger: false,
      constrainWidth: false
    });
  });

  return (
    <React.Fragment>
      {/* Dropdown Trigger */}
      <a
        className="dropdown-trigger"
        id={"dropdown-trigger-" + id}
        href="#"
        data-target={"dropdown-" + id}
      >
        {caption}
      </a>

      {/* Dropdown Structure */}
      <ul id={"dropdown-" + id} className="dropdown-content">
        {props.children}
      </ul>
    </React.Fragment>
  );
}

export default Dropdown;
