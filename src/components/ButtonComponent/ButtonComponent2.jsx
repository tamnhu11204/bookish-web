import React from "react";

const ButtonComponent2 = ({ textButton, onClick, icon, isLoading }) => {
  return (
    <button 
      type="button" 
      className="btn btn-outline-success" 
      style={{ fontSize: '16px' }} 
      onClick={onClick} 
      disabled={isLoading} // Không cho bấm khi đang loading
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Đang xử lý...
        </>
      ) : (
        <>
          <span>{textButton}</span>
          {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default ButtonComponent2;
