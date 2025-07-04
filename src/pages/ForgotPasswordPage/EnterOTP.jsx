import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import OTPComponent from "../../components/OTPComponent/OTPComponent";
import * as AuthService from "../../services/AuthService";
import "./EnterOTP.css";

const EnterOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSendBackOTP = async () => {
    try {
      const response = await AuthService.forgotPassword(email);
      if (response.success) {
        alert("OTP mới đã được gửi!");
      } else {
        alert(response.message || "Lỗi khi gửi lại OTP.");
      }
    } catch (error) {
      alert(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleEnterOTP = async () => {
    const otpInputs = document.querySelectorAll(".input__otp");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (otp.length !== otpInputs.length) {
      alert("Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    try {
      const response = await AuthService.verifyOTP(email, otp);
      if (response.success) {
        alert("OTP hợp lệ! Đang chuyển đến trang đặt mật khẩu mới...");
        setTimeout(() => {
          navigate("/forgot-password/new-password", { state: { email } });
        }, 1500);
      } else {
        alert("Mã OTP không hợp lệ!");
      }
    } catch (error) {
      alert(error.message || "Mã OTP không hợp lệ!");
    }
  };

  const isValid = () => {
    const otpInputs = document.querySelectorAll(".input__otp");
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");
    return otp.length === otpInputs.length;
  };

  return (
    <div className="container-xl" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ width: "600px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <div>
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
            <div className="enter-otp__extend">
              <div onClick={handleSendBackOTP} className="enter-otp">
                Bạn chưa nhận được OTP? <b style={{ color: "#198754" }}>Gửi lại</b>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <ButtonComponent
                textButton="Xác nhận"
                onClick={handleEnterOTP}
                disabled={!isValid()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;