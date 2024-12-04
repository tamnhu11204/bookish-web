import React from "react";

const ButtonComponent = (props) => {
  return (
    <button type="button" className="btn btn-success" style={{ fontSize:'16px', height:'35px'}}
    onClick={props.onClick}
    >
      <span style={{color: '#FFFFFF'}}>{props.textButton}</span>
      {props.icon && <span style={{ color:"#FFFFFF", fontSize:'16px', marginLeft:'5px' }}>{props.icon}</span>} 
    </button>
  );
};

export default ButtonComponent;
