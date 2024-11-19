import React from "react";

const ButtonComponent2 = ({ textButton, icon, onClick }) => {
  return (
    <button type="button" class="btn btn-outline-success" style={{ fontSize:'16px'}}
    onClick={onClick}>
      <span >{textButton}</span>
      {icon && <span style={{ fontSize:'20px' }}>{icon}</span>} 

    </button>
  );
};

export default ButtonComponent2;
