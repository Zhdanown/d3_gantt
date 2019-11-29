import React, { useEffect, useRef } from "react";
import { Collapsible } from "materialize-css";

function CollapsibleCard({ ...props }) {
  const collapsibleRef = useRef();
  useEffect(() => {
    Collapsible.init(collapsibleRef.current, { accordion: false });
  }, []);

  return (
    <ul className="collapsible" ref={collapsibleRef}>
      <li className="active">
        <div className="collapsible-header">{props.header}</div>
        <div className="collapsible-body">{props.children}</div>
      </li>
    </ul>
  );
}

export default CollapsibleCard;
