import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";

const SignUpPage = () => {
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
                    width: "auto",
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
                    ></FormComponent>

                    <FormComponent
                        id="passwordInput"
                        label="Mật khẩu"
                        type="password"
                        placeholder="Nhập mật khẩu"
                    ></FormComponent>

                    <FormComponent
                        id="confirmPasswordInput"
                        label="Xác nhận mật khẩu"
                        type="password"
                        placeholder="Nhập lại mật khẩu ở trên"
                    ></FormComponent>

                    <FormComponent
                        id="nameInput"
                        label="Họ và tên"
                        type="text"
                        placeholder="Nhập họ và tên"
                    ></FormComponent>

                    <FormComponent
                        id="phoneInput"
                        label="Số điện thoại"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                    ></FormComponent>

                    <FormComponent
                        id="birthInput"
                        label="Ngày sinh"
                        type="date"
                        placeholder="Chọn ngày sinh"
                    ></FormComponent>

                    {/* Địa chỉ được tách thành các trường riêng biệt */}
                    <FormSelectComponent
                        id="wardInput"
                        label="Xã/Phường"
                        type="text"
                        placeholder="Nhập Xã/Phường"
                    ></FormSelectComponent>

                    <FormSelectComponent
                        id="districtInput"
                        label="Quận/Huyện/TP"
                        type="text"
                        placeholder="Nhập Quận/Huyện/TP"
                    ></FormSelectComponent>

                    <FormSelectComponent
                        id="provinceInput"
                        label="Tỉnh"
                        type="text"
                        placeholder="Nhập Tỉnh"
                    ></FormSelectComponent>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                        }}
                    >
                        <ButtonComponent
                            textButton="Đăng ký"
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
