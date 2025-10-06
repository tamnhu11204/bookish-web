import React from "react";

const ButtonComponent = ({ textButton, onClick, icon, isLoading }) => {
  return (
    <button
      type="button"
      className="btn btn-success"
      style={{ fontSize: '16px' }}
      onClick={onClick}
      disabled={isLoading} // Vô hiệu hóa khi đang loading
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Đang xử lý...
        </>
      ) : (
        <>
          <span style={{ color: '#FFFFFF' }}>{textButton}</span>
          {icon && <span style={{ color: "#FFFFFF", fontSize: '16px', marginLeft: '5px' }}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default ButtonComponent;
