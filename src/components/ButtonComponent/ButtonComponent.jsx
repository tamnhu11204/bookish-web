import React from "react";

const ButtonComponent = ({ textButton, icon, ...rests }) => {
  return (
    <button type="button" class="btn btn-success" style={{ fontSize:'16px', height:'35px'}}>
      <span style={{color: '#FFFFFF'}}>{textButton}</span>
      {icon && <span style={{ color:"#FFFFFF", fontSize:'16px', marginLeft:'5px' }}>{icon}</span>} 
    </button>
  );
};

export default ButtonComponent;
