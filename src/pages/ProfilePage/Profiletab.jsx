import React, { useState } from 'react';

const ProfileTab = () => {
    const [activeTab, setActiveTab] = useState("language");
    const [activeTab1, setActiveTab1] = useState("supplier");
    const formStyle = {
        fontSize: "16px", // Tăng cỡ chữ toàn bộ form
      };
      const [successMessage, setSuccessMessage] = useState(false); // Quản lý trạng thái thông báo

      // Hàm xử lý khi nhấn nút xác nhận
      const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trang reload khi submit form
        setSuccessMessage(true); // Hiển thị thông báo
    
        // Ẩn thông báo sau 3 giây (nếu muốn)
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section" >
                <h3 className="text mb-0">HỒ SƠ CỦA TÔI</h3>
            </div>
        <div className="container mt-5">
      <form className="p-4 border rounded" style={formStyle}>
        <div className="row">
          {/* Form thông tin bên trái */}
          <div className="col-md-8">
            {/* Tên đăng nhập */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Tên đăng nhập
              </label>
              <input
               style={formStyle}
                type="text"
                className="form-control"
                id="username"
                defaultValue="abc1234"
              />
            </div>

            {/* Tên tài khoản */}
            <div className="mb-3">
              <label htmlFor="accountName" className="form-label">
                Tên tài khoản
              </label>
              <input
               style={formStyle}
                type="text"
                className="form-control"
                id="accountName"
                defaultValue="TenTaiKhoan"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
               style={formStyle}
                type="email"
                className="form-control"
                id="email"
                defaultValue="email"
              />
            </div>

            {/* Số điện thoại */}
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Số điện thoại
              </label>
              <input
               style={formStyle}
                type="text"
                className="form-control"
                id="phoneNumber"
                defaultValue="0123456xxx"
              />
            </div>

            {/* Giới tính */}
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                   style={formStyle}
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                  />
                  <label className="form-check-label" htmlFor="male">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                   style={formStyle}
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                  />
                  <label className="form-check-label" htmlFor="female">
                    Nữ
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                   style={formStyle}
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="other"
                  />
                  <label className="form-check-label" htmlFor="other">
                    Khác
                  </label>
                </div>
              </div>
            </div>

            {/* Ngày sinh */}
            <div className="mb-3" >
              <label className="form-label">Ngày sinh</label>
              <div className="d-flex gap-2" >
                <select className="form-select" defaultValue="30" style={formStyle}>
                  <option>1</option>
                  <option>2</option>
                  {/* Thêm các ngày khác */}
                  <option>30</option>
                </select>
                <select className="form-select" defaultValue="Tháng 9"  style={formStyle}>
                  <option>Tháng 1</option>
                  <option>Tháng 2</option>
                  {/* Thêm các tháng khác */}
                  <option>Tháng 9</option>
                </select>
                <select className="form-select" defaultValue="2024" style={formStyle}>
                  <option>2023</option>
                  <option>2024</option>
                  {/* Thêm các năm khác */}
                </select>
              </div>
            </div>
          </div>

          {/* Ảnh đại diện và nút chọn ảnh */}
          <div className="col-md-4 text-center d-flex flex-column justify-content-center">
            <div className="mb-3">
              <img
                src="https://via.placeholder.com/100"
                alt="avatar"
                className="rounded-circle"
              />
            </div>
            <button type="button" className="btn btn-success"  style={formStyle}>
              Chọn ảnh
            </button>
          </div>
        </div>

        {/* Nút lưu thay đổi */}
        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-success" style={formStyle}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
    </div>
    );

    
};

export default ProfileTab;