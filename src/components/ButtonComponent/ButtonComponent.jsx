import React from "react";

const ButtonComponent = ({ textButton, icon, ...rests }) => {
  return (
    <button type="button" class="btn btn-success" style={{ fontSize:'16px'}}>
      <span style={{color: '#FFFFFF'}}>{textButton}</span>
      {icon && <span style={{ color:"#FFFFFF", fontSize:'20px' }}>{icon}</span>} 
    </button>
  );
};

export default ButtonComponent;
