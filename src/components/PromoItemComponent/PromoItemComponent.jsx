import React from 'react';

const PromoItemComponent = ({ value, condition, start, finish, isApplied, onActionClick, actionLabel }) => {
  return (
    <div className="d-flex align-items-start border rounded p-2 mt-2">
      <i style={{ fontSize: '50px', marginRight: '10px', marginLeft: '10px' }}
        class="bi bi-gift-fill"></i>
      <div className="flex-grow-1">
        <p className="mb-1 fw-bold">MÃ GIẢM GIÁ {value} đ</p>
        <p className="mb-1 fw-bold">CHO ĐƠN HÀNG TỪ {condition} đ</p>
        <small className="text-muted">Thời gian áp dụng: {start}</small>
        <small className="text-muted" style={{ marginTop: "-12px" }}>Hạn sử dụng: {finish}</small>
        {isApplied && <p className="text-primary mb-0">Đã áp dụng</p>}
      </div>
      <button
        style={{ fontSize: "14px" }}
        className={`btn ${isApplied ? 'btn-outline-secondary' : 'btn-success'}`}
        onClick={onActionClick}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default PromoItemComponent;
