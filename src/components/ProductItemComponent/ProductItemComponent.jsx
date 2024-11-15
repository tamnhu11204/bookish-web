import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductItem = ({ image, name, price, quantity, checked, onQuantityChange, onDelete }) => {
  return (
    <div className={`row align-items-center border-bottom py-3 ${checked ? 'border-primary rounded' : ''}`}>
      <div className="col-1">
        <input type="checkbox"  className="form-check-input" />
      </div>
      <div className="col-2">
        <img src={image} alt={name} className="img-fluid" style={{ width: '70px', height: 'auto' }} />
      </div>
      <div className="col-4">
        <p className="mb-1">{name}</p>
        <p className="fw-bold mb-0">{price} đ</p>
      </div>
      <div className="col-3 text-center">
        <p className="mb-1 text-muted">Số lượng</p>
        <div className="input-group input-group-sm justify-content-center">
          <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(quantity - 1)}>-</button>
          <span className="px-2">{quantity}</span>
          <button className="btn btn-outline-secondary" onClick={() => onQuantityChange(quantity + 1)}>+</button>
        </div>
      </div>
      <div className="col-1 text-end">
        <p className="fw-bold mb-0">{price} đ</p>
      </div>
      <div className="col-1 text-end">
        <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
};

export default ProductItem;
