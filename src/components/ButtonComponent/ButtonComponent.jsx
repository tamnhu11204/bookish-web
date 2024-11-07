import React from "react";

const ButtonComponent = (props) => {
  return (
    <button
    type="button"
      className="btn btn-success"
      style={{
        borderRadius: '10px',
        border: 'none',
        color: '#FFFFFF',
        fontSize: '16px',
        height: "35px",
        width: "fit-content",
      }}
    >
      {props.children}
    </button>
  );
};

export default ButtonComponent;
