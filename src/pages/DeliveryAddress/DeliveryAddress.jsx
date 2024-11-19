import React, { useState } from 'react';
import "../DeliveryAddress/DeliveryAddress.css"
const DeliveryAddress = () => {
  const [selectedOption, setSelectedOption] = useState('default');

  return (
    <div className="address">
    <div className="p-4 border rounded" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h4 className="text-center mb-4 text-success">CHỌN ĐỊA ĐIỂM GIAO HÀNG</h4>

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="radio"
          name="addressOption"
          id="defaultAddress"
          checked={selectedOption === 'default'}
          onChange={() => setSelectedOption('default')}
        />
        <label className="form-check-label" htmlFor="defaultAddress">
          Bạch Đằng, Tân Uyên, Bình Dương
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="radio"
          name="addressOption"
          id="otherAddress"
          checked={selectedOption === 'other'}
          onChange={() => setSelectedOption('other')}
        />
        <label className="form-check-label" htmlFor="otherAddress">
          Chọn địa điểm khác
        </label>
      </div>

      {selectedOption === 'other' && (
        <div className="mb-3">
          <div className="mb-2">
            <label className="form-label" htmlFor="province">Tỉnh/Thành phố</label>
            <select className="form-select" id="province">
              <option value="">Chọn Tỉnh/Thành phố</option>
              {/* Thêm các tùy chọn khác ở đây */}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label" htmlFor="district">Quận/Huyện</label>
            <select className="form-select" id="district">
              <option value="">Chọn Quận/Huyện</option>
              {/* Thêm các tùy chọn khác ở đây */}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label" htmlFor="ward">Xã/Phường</label>
            <select className="form-select" id="ward">
              <option value="">Chọn Xã/Phường</option>
              {/* Thêm các tùy chọn khác ở đây */}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="additional">Bổ sung</label>
            <input
              type="text"
              className="form-control"
              id="additional"
              placeholder="Nhập cụ thể địa chỉ nhà bạn"
            />
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-success me-2">Xác nhận</button>
        <button className="btn btn-outline-secondary">Hủy</button>
      </div>
    </div>
    </div>
  );
};

export default DeliveryAddress;
