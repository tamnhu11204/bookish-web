import React from "react";

const ButtonComponent2 = ({ textButton, icon, ...rests }) => {
  return (
    <button type="button" class="btn btn-outline-success" style={{ fontSize:'16px'}}>
      <span style={{color: '#198754'}}>{textButton}</span>
      {icon && <span style={{ color:"#FFFFFF", fontSize:'20px' }}>{icon}</span>} 

    </button>
  );
};

export default ButtonComponent2;
