import React from "react";

const OrderComponent = ({ status, shippingStatus, title, price, quantity, totalPrice, isCompleted ,onclick}) => {
    const formStyle = {
        fontSize: "16px", // Tăng cỡ chữ toàn bộ form
      };
  return (
    <> <div className="card mb-3">
      <div className={`card-header ${isCompleted ? "text-success" : "text-primary"}`} style={formStyle}>
        <strong>{status}</strong>
      </div>
      <div className="card-body d-flex align-items-center">
      
        <img
          src="https://via.placeholder.com/100" // Link ảnh minh họa
          alt={title}
          className="img-thumbnail me-3"
          style={{ width: "100px", height: "auto" }} />
          
        <div className="flex-grow-1" style={formStyle}>
          <h5 style={formStyle}>{title} <button className="btn btn-success" style={formStyle} onClick={onclick}>Chi tiết</button></h5>
          
          <p>Giá: {price.toLocaleString()} đ</p>
          <p>Số lượng: {quantity}</p>
          <p>Tổng số tiền: <strong>{totalPrice.toLocaleString()} đ</strong></p>
        </div>
        <div className="text-end">
          {isCompleted ? (
            <button className="btn btn-success" style={formStyle}>Đánh giá</button>
          ) : (
            <span className="badge bg-info" style={formStyle}>{shippingStatus}</span>
          )}
        </div>
       
      </div>
    </div></>
  );
};

export default OrderComponent;