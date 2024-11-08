import React from "react";

const ButtonComponent = ({ textButton, ...rests }) => {
  return (
    <button className='btn'
      style={{
        backgroundColor: '#198754',
        height: '40px',
        width: 'fit-content',
        padding: '0 20px', // Thêm padding để có khoảng cách hai bên chữ
        fontSize: '16px',
        display: 'inline-block' // Đảm bảo nút chỉ chiếm không gian cần thiết
      }}
      {...rests}
    >
      <span style={{color: '#FFFFFF'}}>{textButton}</span>
    </button>
  );
};

export default ButtonComponent;
