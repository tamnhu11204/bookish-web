import React from "react";
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ConfirmAddItemModal = ({ isOpen, product, importPrice, quantity, onConfirm, onCancel }) => {
  if (!isOpen || !product) return null;

  const totalPrice = importPrice * quantity;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">XÁC NHẬN THÊM SẢN PHẨM</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={product.image|| 'https://placehold.co/100x100'}
                    alt={product.name}
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <p><strong>Tên sản phẩm:</strong> {product.name}</p>
                  <p><strong>Mã sản phẩm:</strong> {product.code || product._id.slice(-6)}</p>
                  <p><strong>Số lượng tồn kho:</strong> {product.stock || 0}</p>
                  <p><strong>Giá nhập:</strong> {parseInt(importPrice).toLocaleString()}đ</p>
                  <p><strong>Số lượng:</strong> {quantity}</p>
                  <p><strong>Thành tiền:</strong> {totalPrice.toLocaleString()}đ</p>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <ButtonComponent
              textButton="Hủy bỏ"
              onClick={onCancel}
              className="btn btn-secondary"
            />
            <ButtonComponent
              textButton="Xác nhận"
              onClick={onConfirm}
              className="btn btn-success"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAddItemModal;