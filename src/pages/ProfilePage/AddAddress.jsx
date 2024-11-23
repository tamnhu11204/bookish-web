import React from 'react';
import PromoItemComponent from '../../components/PromoItemComponent/PromoItemComponent';
import "../PromoSelectionPage/Promo.css"
const AddAddress = ({ isOpen,onClick1,onClick2 }) => {
  if (!isOpen) return null; // Không hiển thị nếu isOpen là false

  return (
      <div className="custom-modal">
          <div className="modal-content">
          <div className="container mt-4">
      <h4>Địa chỉ mới</h4>
      <form>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Họ và tên</label>
            <input type="text" className="form-control" placeholder="Họ và tên" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              placeholder="Số điện thoại"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Chọn tỉnh/thành phố</label>
            <select className="form-select">
              <option>Chọn tỉnh/thành phố</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Khánh Hòa</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Chọn quận/huyện</label>
            <select className="form-select">
              <option>Chọn quận/huyện</option>
              <option>Quận 1</option>
              <option>Quận 2</option>
              <option>Vạn Ninh</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Chọn xã/phường</label>
            <select className="form-select">
              <option>Chọn xã/phường</option>
              <option>Phường 1</option>
              <option>Phường 2</option>
              <option>Thị trấn Vạn Giã</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Địa chỉ cụ thể</label>
            <input
              type="text"
              className="form-control"
              placeholder="Địa chỉ cụ thể"
            />
          </div>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="defaultAddress"
          />
          <label className="form-check-label" htmlFor="defaultAddress">
            Đặt làm địa chỉ mặc định
          </label>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={onClick1}>
            Hủy
          </button>
          <button type="submit" className="btn btn-success"  onClick={onClick2}>
            Hoàn thành
          </button>
        </div>
      </form>
    </div>
          </div>
      </div>
  );
};

export default AddAddress;
