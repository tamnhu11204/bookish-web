import React, { useState } from 'react';

const AccountTab = () => {
    
    const formStyle = {
        fontSize: "16px", // Tăng cỡ chữ toàn bộ form
      };

      

  // Ẩn thông báo sau 3 giây (nếu muốn)
 

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
                <h3 className="text mb-0">TÀI KHOẢN CỦA TÔI</h3>
            </div>

            <div className="container mt-5">
                <div style={formStyle}>Thông tin hồ sơ</div>
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
                                    defaultValue="abc1234" />
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
                                    defaultValue="TenTaiKhoan" />
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
                                    defaultValue="email" />
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
                                    defaultValue="0123456xxx" />
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
                                            id="male" />
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
                                            id="female" />
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
                                            id="other" />
                                        <label className="form-check-label" htmlFor="other">
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="mb-3">
                                <label className="form-label">Ngày sinh</label>
                                <div className="d-flex gap-2">
                                    <select className="form-select" defaultValue="30" style={formStyle}>
                                        <option>1</option>
                                        <option>2</option>
                                        {/* Thêm các ngày khác */}
                                        <option>30</option>
                                    </select>
                                    <select className="form-select" defaultValue="Tháng 9" style={formStyle}>
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
                                    className="rounded-circle" />
                            </div>
                            <button type="button" className="btn btn-success" style={formStyle}>
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
            
            <div className="container mt-5">
            <div style={formStyle}>Đổi mật khẩu</div>
                <form className="p-4 border rounded" style={formStyle}>
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
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success" style={formStyle} onClick={handleSubmit}>
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
            </div>
      </>
    );

}
    


export default AccountTab;