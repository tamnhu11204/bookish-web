import React, { useEffect, useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from '../../services/UserService';
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirth] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const mutation = useMutationHook(data => UserService.signupUser(data));
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(()=>{
        if(isSuccess && data?.status !== 'ERR'){
            message.success()
            navigate("/login")
        } else if (isError){
            message.error()
        }
    }, [data?.status, isError, isSuccess, navigate])

    const handleOnChangeEmail = (value) => setEmail(value);
    const handleOnChangePassword = (value) => setPassword(value);
    const handleOnChangeConfirmPassword = (value) => setConfirmPassword(value);
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangePhone = (value) => setPhone(value);
    const handleOnChangeBirth = (value) => setBirth(value);

    const handleSignup = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Xác nhận mật khẩu không khớp! Vui lòng nhập lại.');
            return;
        }
        setErrorMessage('');
        mutation.mutate({ email, password, name, phone, birthday })
        //console.log('signup', email, password, confirmPassword, name, phone, birthday);
    };

    return (
        <div
            className="signup-container"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
            }}
        >
            <div
                style={{
                    width: "600px",
                    padding: "20px",
                    border: "1px solid #198754",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
            >
                <h1
                    className="title title_signup"
                    style={{
                        fontSize: "30px",
                        marginBottom: "20px",
                        textAlign: "center",
                        color: "#198754",
                    }}
                >
                    ĐĂNG KÝ
                </h1>
                <form
                    className="signup__form"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <FormComponent
                        id="emailInput"
                        placeholder="Nhập email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={handleOnChangeEmail}
                        required={true}
                        enable = {true}
                    />

                    <FormComponent
                        id="passwordInput"
                        label="Mật khẩu"
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={handleOnChangePassword}
                        required={true}
                        enable = {true}
                    />

                    <FormComponent
                        id="confirmPasswordInput"
                        label="Xác nhận mật khẩu"
                        type="password"
                        placeholder="Nhập lại mật khẩu ở trên"
                        value={confirmPassword}
                        onChange={handleOnChangeConfirmPassword}
                        required={true}
                        enable = {true}
                    />

                    <FormComponent
                        id="nameInput"
                        label="Họ và tên"
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={name}
                        onChange={handleOnChangeName}
                        required={true}
                        enable = {true}
                    />

                    <FormComponent
                        id="phoneInput"
                        label="Số điện thoại"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={handleOnChangePhone}
                        required={true}
                        enable = {true}
                    />

                    <FormComponent
                        id="birthInput"
                        label="Ngày sinh"
                        type="date"
                        placeholder="Chọn ngày sinh"
                        value={birthday}
                        onChange={handleOnChangeBirth}
                        required={true}
                        enable = {true}
                    />

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                        {errorMessage && (
                            <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                {errorMessage}
                            </div>
                        )}
                        {data?.status === 'ERR' &&
                            <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>

                        <LoadingComponent isLoading={isLoading}>
                            <ButtonComponent
                                onClick={handleSignup}
                                textButton="Đăng ký"
                            />
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
                    Bạn đã có tài khoản?{" "}
                    <a
                        className="text-decoration-underline"
                        href="./login"
                        style={{
                            color: "#198754",
                            textDecoration: "none",
                            fontStyle: "italic",
                        }}
                    >
                        Đăng nhập
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
