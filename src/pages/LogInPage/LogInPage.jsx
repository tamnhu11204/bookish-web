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
          LOG IN
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
            placeholder="Enter your email"
          ></FormComponent>

          <FormComponent
            id="passwordInput"
            label="Password"
            type="password"
            placeholder="Enter your password"
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
            Forgot password?
          </a>

          <ButtonComponent
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#5C9EAD",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Log In
          </ButtonComponent>
        </form>
        <div
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          You don't have an account?{" "}
          <a class="text-decoration-underline"
            href="./signup"
            style={{
              color: "#198754",
              textDecoration: "none",
              fontStyle: "italic",
            }}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
