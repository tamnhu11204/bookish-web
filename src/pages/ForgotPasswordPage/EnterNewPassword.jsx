import React, { useState } from "react";
import "./EnterNewPassword.css";
import { useNavigate, useLocation } from "react-router-dom";
import * as AuthService from "../../services/AuthService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const EnterNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleSendNewPassword = async () => {
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp.");
      return;
    }

    setShowLoading(true);
    try {
      const response = await AuthService.resetPassword(email, password);
      if (response.success) {
        alert("Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        alert(response.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (error) {
      alert(error.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setShowLoading(false);
    }
  };

  const isValid = () => {
    return password.length >= 6 && password === confirmPassword;
  };

  return (
    <div className="container-xl" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div>
        <div style={{ width: "600px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
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
              onClick={handleSendNewPassword}
              disabled={!isValid()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterNewPassword;