import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/UserSlide";

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const location = useLocation();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const mutation = useMutationHook(data => UserService.loginUser(data));
  const { data, isLoading, isSuccess, isError, error } = mutation;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Mutation state:', { isSuccess, isError, data, error });
    if (isSuccess && data?.status === 'OK') {
      console.log('Login response:', data);
      // Xóa localStorage cũ
      localStorage.clear();
      if (data?.access_token) {
        localStorage.setItem("access_token", JSON.stringify(data.access_token));
        try {
          const decoded = jwtDecode(data.access_token);
          console.log('Decoded token:', decoded);
          if (decoded?.id) {
            handleGetDetailUser(decoded.id, data.access_token);
          } else {
            console.error('No id in decoded token:', decoded);
          }
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      } else {
        console.error('No access_token in login response:', data);
      }
    } else if (isError) {
      console.error('Login error:', error);
    }
  }, [data, isSuccess, isError, error, navigate]);

  const handleGetDetailUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      console.log('User details response:', res);
      if (res?.status === 'OK' && res?.data?._id) {
        dispatch(updateUser({ ...res.data, access_token: token }));
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("user_id", res.data._id);
        console.log('Stored user:', res.data);
        console.log('Stored user_id:', res.data._id);
        console.log('localStorage after save:', {
          user: localStorage.getItem('user'),
          user_id: localStorage.getItem('user_id'),
          access_token: localStorage.getItem('access_token')
        });
        if (location?.state) {
          navigate(location?.state);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangePassword = (value) => setPassword(value);

  const handleLogin = () => {
    console.log('Attempting login with:', { email, password });
    mutation.mutate({ email, password });
  };

  return (
    <div className="container-xl container-new-password" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ width: "600px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}>
        <h1 className="title title_login" style={{ marginBottom: "20px", textAlign: "center", color: "#198754" }}>
          ĐĂNG NHẬP
        </h1>
        <form className="login__form" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <FormComponent id="emailInput" label="Email" type="email" placeholder="Nhập email" value={email} onChange={handleOnChangeEmail} enable={true}></FormComponent>
          <FormComponent id="passwordInput" label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" value={password} onChange={handleOnChangePassword} enable={true}></FormComponent>
          <a href="/forgot-password" className="forgot-password" style={{ textAlign: "right", fontSize: "14px", color: "#198754", textDecoration: "none" }}>
            Quên mật khẩu?
          </a>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            {data?.status === 'ERR' && <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <LoadingComponent isLoading={isLoading}>
              <ButtonComponent onClick={handleLogin} textButton="Đăng nhập" />
            </LoadingComponent>
          </div>
        </form>
        <div style={{ textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#333" }}>
          Bạn chưa có tài khoản?{" "}
          <a class="text-decoration-underline" href="./signup" style={{ color: "#198754", textDecoration: "none", fontStyle: "italic" }}>
            Đăng ký
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;