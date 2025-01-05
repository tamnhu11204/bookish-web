import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/UserSlide";

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const location=useLocation()
  const [password, setPassword] = useState('');
  const dispatch=useDispatch()

  const mutation = useMutationHook(data => UserService.loginUser(data))
  const { data, isLoading, isSuccess } = mutation
  const navigate = useNavigate();

  useEffect(()=>{
    if(isSuccess && data?.status !== 'ERR'){
      if(location?.state){
        navigate(location?.state)
      }
      else{
        navigate('/')
      }

      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token){
        const decoded=jwtDecode(data?.access_token)
        console.log('decoded', decoded)
        if(decoded?.id){
          handleGetDetailUser(decoded?.id, data?.access_token)
        }
      }
    }
  },[data, isSuccess, navigate])

  const handleGetDetailUser=async (id, token)=>{
    const res=await UserService.getDetailUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
  }

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangePassword = (value) => setPassword(value);

  const handleLogin = () => {
    mutation.mutate({ email, password })
    //console.log('signup', email, password);
  };

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
          width: "600px",
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
          ĐĂNG NHẬP
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
            value={email}
            onChange={handleOnChangeEmail}
          ></FormComponent>

          <FormComponent
            id="passwordInput"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={handleOnChangePassword}
          ></FormComponent>
          <a
            href="/"
            className="forgot-password"
            style={{ textAlign: "right", fontSize: "14px", color: "#198754", textDecoration: "none", }}>
            Quên mật khẩu?
          </a>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
            {data?.status === 'ERR' &&
              <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <LoadingComponent isLoading={isLoading}>
              <ButtonComponent
                onClick={handleLogin}
                textButton="Đăng nhập" />
            </LoadingComponent>
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