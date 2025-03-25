import React, { useState } from "react";
import "./EnterNewPassword.css";
import { useNavigate, useLocation } from "react-router-dom";
import * as AuthService from "../../services/AuthService";
import Message from "../../components/MessageComponent/Message";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import background from "../../assets/img/background.jpg";

const EnterNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // Lấy email từ trang trước

  console.log("Email nhận được:", email); // Debug email

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

  const handleSendNewPassword = async () => { // Bỏ tham số e vì không dùng submit

    if (password !== confirmPassword) {
      setStatusMessage({
        type: "Error",
        message: "Mật khẩu nhập lại không khớp.",
      });
      return;
    }

    setShowLoading(true);

    try {
      console.log("Gửi yêu cầu reset password với:", { email, password }); // Debug
      const response = await AuthService.resetPassword(email, password);
      console.log("Response từ backend:", response); // Debug
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập...",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setStatusMessage({
          type: "Error",
          message: response.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.log("Lỗi:", error); // Debug
      setStatusMessage({
        type: "Error",
        message: error.message || "Không thể kết nối đến máy chủ.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const isValid = () => {
    return password.length >= 6 && password === confirmPassword;
  };

  return (
    <div className="container-xl container-new-password">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}

      <div className="new-password-container">
        {/* new-password right */}
        <div className="new-password-container__img">
          <img className="new-password__img" src={background} alt="Hình sách" />
        </div>
        {/* new-password left */}
        <div className="new-password__left">
          <h1
            className="title title_login"
            style={{
              marginBottom: "20px",
              textAlign: "center",
              color: "#198754",
            }}
          >
            QUÊN MẬT KHẨU
          </h1>
          <LoadingComponent isLoading={showLoading} />
          {!showLoading && (
            <form className="new-password__form">
              <FormComponent
                id="passwordInput"
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(value) => setPassword(value)}
                enable={true}
              />

              <FormComponent
                id="passwordConfirmInput"
                label="Xác nhận lại mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(value) => setConfirmPassword(value)}
                enable={true}
              />
            </form>
          )}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <ButtonComponent
              textButton="Gửi"
              onClick={handleSendNewPassword} // Sửa thành handleSendNewPassword
              disabled={!isValid()} // Dùng isValid để kiểm tra
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterNewPassword;