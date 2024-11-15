import React from "react";

const ButtonComponent2 = ({ textButton, icon, ...rests }) => {
  return (
    <button className='btn btn-outline-success'
      style={{
        backgroundColor: '#FFFFFF',
        height: '40px',
        width: 'fit-content',
        padding: '0 12px', // Thêm padding để có khoảng cách hai bên chữ
        fontSize: '16px',
        display: 'inline-block' // Đảm bảo nút chỉ chiếm không gian cần thiết
      }}
      {...rests}
    >
      <span style={{color: '#198754'}}>{textButton}</span>
      {icon && <span style={{ color:"#FFFFFF", fontSize:'16px' }}>{icon}</span>} 
    </button>
  );
};

export default ButtonComponent2;
