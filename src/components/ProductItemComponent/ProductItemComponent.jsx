import React from 'react';

const ProductItem = ({ onClickIncrease, onClickDecrease, image, name, price, quantity, onQuantityChange, index, onRemove }) => {
  const totalPrice = price * quantity;

  return (
    <div className="cart-item d-flex align-items-center border-bottom py-3">
      <div className="col-1">
        <input type="checkbox" className="me-3 mt-2" />
      </div>

      <div className="col-2">
        <img
          src={image}
          alt={name}
          className="item-image"
          style={{ width: '80px', height: '100px' }}
        />
      </div>

      <div className="col-3">
        <h5 className="mb-2">{name}</h5>
      </div>

      <div className="col-2">
        <p className="mb-0">{price.toLocaleString()}đ</p>
      </div>

      <div className="col-2 d-flex align-items-center">
        <button style={{ width: '30px', height: '30px', marginRight:'5px', fontSize:'16px' }}
        type="button" className="btn btn-light" onClick={onClickDecrease}>
        <i className="bi bi-plus" ></i>
        </button>
        <input
          id="quantity"
          className="form-control"
          style={{ width: '30px', fontSize: '16px' }}
          value={quantity}
          min="1"
          max="10"
          onChange={(e) => onQuantityChange(e, index)} // Truyền index vào onChange
        />
        <button style={{ width: '30px', height: '30px', marginLeft:'5px', fontSize:'16px' }}
        type="button" className="btn btn-light" onClick={onClickIncrease}>
        <i className="bi bi-dash" ></i>
        </button>
      </div>

      <div className="col-1">
        <span className="total-price">{totalPrice.toLocaleString()}đ</span>
      </div>

      <div className="col-1">
        <button onClick={onRemove} className="remove-button btn btn-danger">
        <i className="bi bi-trash" ></i>
        </button>
      </div>
    </div>
  );
};


export default ProductItem;
