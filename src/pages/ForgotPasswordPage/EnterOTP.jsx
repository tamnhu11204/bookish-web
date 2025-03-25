import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as AuthService from "../../services/AuthService";
import "./EnterOTP.css";
import Message from "../../components/MessageComponent/Message";
import OTPComponent from "../../components/OTPComponent/OTPComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import background from "../../assets/img/background.jpg";

const EnterOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSendBackOTP = async () => {
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP mới đã được gửi!",
        });
      } else {
        setStatusMessage({
          type: "Error",
          message: response.message || "Lỗi khi gửi lại OTP.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  const handleEnterOTP = async () => { // Bỏ tham số e vì không dùng submit form
    const otpInputs = document.querySelectorAll(".input__otp");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (otp.length !== otpInputs.length) {
      setStatusMessage({
        type: "Warning",
        message: "Vui lòng nhập đầy đủ mã OTP!",
      });
      return;
    }

    try {
      const response = await AuthService.verifyOTP(email, otp);
      if (response.success) {
        setStatusMessage({
          type: "Success",
          message: "OTP hợp lệ! Đang chuyển đến trang đặt mật khẩu mới...",
        });
        setTimeout(() => {
          navigate("/forgot-password/new-password", { state: { email } });
        }, 1500);
      } else {
        setStatusMessage({
          type: "Error",
          message: "Mã OTP không hợp lệ!",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Mã OTP không hợp lệ!",
      });
    }
  };

  const isValid = () => {
    const otpInputs = document.querySelectorAll(".input__otp");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");
    return otp.length === otpInputs.length; // Trả về true nếu OTP đủ dài
  };

  return (
    <div className="container-xl container-enter-otp">
      {statusMessage && (
        <Message
          type={statusMessage.type}
          message={statusMessage.message}
          duration={3000}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="enter-otp-container">
        {/* enter-otp right */}
        <div className="enter-otp-container__img">
          <img className="enter-otp__img" src={background} alt="Hình sách" />
        </div>
        {/* enter-otp left */}
        <div className="enter-otp__left">
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

          <form className="enter-otp__form">
            <div className="otp__input">
              <OTPComponent />
              <OTPComponent />
              <OTPComponent />
              <OTPComponent />
            </div>
            {/* back to login */}
            <div className="enter-otp__extend">
              <div onClick={handleSendBackOTP} className="enter-otp">
                Bạn chưa nhận được OTP? <b>Gửi lại</b>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <ButtonComponent
                textButton="Xác nhận"
                onClick={handleEnterOTP} // Gọi trực tiếp handleEnterOTP
                disabled={!isValid()} // Vô hiệu hóa nếu OTP chưa đủ
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;