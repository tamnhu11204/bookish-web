import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../services/AuthService";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import Message from "../../components/MessageComponent/Message";
import background from "../../assets/img/background.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (value) => {
    setEmail(value);
  };

  const handleSendEmail = async () => { // Bỏ tham số e vì không còn dùng e.preventDefault
    if (!isValid()) {
      setStatusMessage({
        type: "Error",
        message: "Vui lòng nhập email hợp lệ",
      });
      return;
    }

    setShowLoading(true);
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP đã được gửi! Đang chuyển đến trang nhập OTP...",
        });
        setTimeout(() => {
          navigate("/forgot-password/enter-otp", { state: { email } });
        }, 1500);
      } else {
        throw new Error(response.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const isValid = () => {
    return email.trim() !== "" && /\S+@\S+\.\S+/.test(email);
  };

  return (
    <div className="container-xxl container-forgot-password">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="forgot-password-container">
        <div className="forgot-password-container__img">
          <img
            className="forgot-password__img"
            src={background}
            alt="Hình sách"
          />
        </div>
        <div className="forgot-password__left">
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
            <form className="forgot-password__form">
              <FormComponent
                id="emailInput"
                label="Email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={handleChange}
                enable={true}
              />
              <a
                href="/login"
                className="forgot-password"
                style={{
                  display: "block",
                  textAlign: "right",
                  fontSize: "14px",
                  color: "#198754",
                  textDecoration: "none",
                  marginBottom: "15px",
                }}
              >
                Đăng nhập
              </a>
            </form>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <ButtonComponent
              textButton="Gửi"
              onClick={handleSendEmail} // Thêm onClick để gọi hàm trực tiếp
              disabled={!isValid()}
            />
          </div>
          </div>
        </div>
      </div>
      );
};

      export default ForgotPassword;