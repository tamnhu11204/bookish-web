import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderProductComponent = () => {
  const [quantity, setQuantity] = useState(1);
  const price = 100000; // Giá sản phẩm

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="card mb-3" style={{ maxWidth: '540px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src="path_to_image" className="img-fluid rounded-start" alt="Product" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">Sách thuốc Nam</h5>
            <p className="card-text">Giá: {price.toLocaleString()} ₫</p>
            <div className="input-group mb-3">
              <span className="input-group-text">Số lượng</span>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </div>
            <p className="card-text">Tổng: {(price * quantity).toLocaleString()} ₫</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProductComponent;
