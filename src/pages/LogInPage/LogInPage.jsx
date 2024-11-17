import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
// import Styles from "../../style";

const LogInPage = () => {
  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div
        style={{
          width: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          className="title title_login"
          style={{
            marginBottom: "20px",
            textAlign: "center",
            color: "#198754",
          }}
        >
          ĐĂNG KÝ
        </h1>
        <form
          className="login__form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <FormComponent
            id="emailInput"
            label="Email"
            type="email"
            placeholder="Nhập email"
          ></FormComponent>

          <FormComponent
            id="passwordInput"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
          ></FormComponent>

          <a
            href="#"
            className="forgot-password"
            style={{
              textAlign: "right",
              fontSize: "14px",
              color: "#198754",
              textDecoration: "none",
            }}
          >
            Quên mật khẩu?
          </a>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <ButtonComponent
              textButton="Đăng nhập"
            />
          </div>
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          Bạn chưa có tài khoản?{" "}
          <a class="text-decoration-underline"
            href="./signup"
            style={{
              color: "#198754",
              textDecoration: "none",
              fontStyle: "italic",
            }}
          >
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
