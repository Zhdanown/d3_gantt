import React from "react";

function AsyncButton({
  label,
  onClick,
  className,
  styles,
  isLoading,
  ...props
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", ...styles }}
      disabled={isLoading}
    >
      {label}
      {/* {props.children} */}
      {isLoading ? (
        <div className="lds-ring" style={{ marginRight: "unset" }}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        props.children
      )}
    </button>
  );
}

export default AsyncButton;
