import React from 'react';

const PromoItemComponent = ({ icon, title, dateRange, isApplied, onActionClick, actionLabel }) => {
  return (
    <div className="d-flex align-items-start border rounded p-2 mt-2">
      <img
        src={icon}
        alt="Icon"
        className="me-3"
        style={{ width: '50px', height: '50px' }}
      />
      <div className="flex-grow-1">
        <p className="mb-1 fw-bold">{title}</p>
        <small className="text-muted">{dateRange}</small>
        {isApplied && <p className="text-primary mb-0">Đã áp dụng</p>}
      </div>
      <button
        className={`btn btn-sm ${isApplied ? 'btn-outline-secondary' : 'btn-success'}`}
        onClick={onActionClick}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default PromoItemComponent;
