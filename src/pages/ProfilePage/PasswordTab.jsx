import React, { useState } from 'react';

const PasswordTab = () => {
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
        <><div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">ĐỔI MẬT KHẨU</h3>
            </div>
        <div className="container mt-5">
                <form className="p-4 border rounded"  style={formStyle}>
                    {/* Mật khẩu cũ */}
                    <div className="mb-3">
                        <label htmlFor="oldPassword" className="form-label">
                            Mật khẩu cũ
                        </label>
                        <input
                        style={formStyle}
                            type="password"
                            className="form-control"
                            id="oldPassword"
                            placeholder="Nhập mật khẩu cũ" />
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                            Mật khẩu mới
                        </label>
                        <input
                        style={formStyle}
                            type="password"
                            className="form-control"
                            id="newPassword"
                            placeholder="Nhập mật khẩu mới" />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Xác nhận mật khẩu
                        </label>
                        <input
                        style={formStyle}
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Xác nhận mật khẩu mới" />
                    </div>

                    {/* Nút xác nhận */}
                    <div className="d-flex justify-content-end" > 
                        <button type="submit" className="btn btn-success" style={formStyle} onClick={ handleSubmit}>
                            Xác nhận
                        </button>
                    </div>
                </form>
                  {/* Thông báo đổi mật khẩu thành công */}
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          Đổi mật khẩu thành công!
        </div>
      )}
            </div>
            </div></>
    );

    
};

export default PasswordTab;