import React from "react";

const ButtonComponent2 = (props) => {
  return (
    <button type="button" className="btn btn-outline-success" style={{ fontSize:'16px'}}
    onClick={props.onClick}>
      <span >{props.textButton}</span>
      {props.icon && <span style={{ fontSize:'20px' }}>{props.icon}</span>} 

    </button>
  );
};

export default ButtonComponent2;
