import React from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../components/FormComponent/FormComponent";

const SignUpPage = () => {
    return (

        <div
            className="signup-container"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px"
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
                    SIGN UP
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
                        placeholder="Enter your email"
                        type="email"
                        label="Email"
                    ></FormComponent>

                    <FormComponent
                        id="passwordInput"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                    ></FormComponent>

                    <FormComponent
                        id="confirmPasswordInput"
                        label="Confirm password"
                        type="password"
                        placeholder="Confirm your password"
                    ></FormComponent>

                    <FormComponent
                        id="nameInput"
                        label="Name"
                        type="tel"
                        placeholder="Enter your name"
                    ></FormComponent>

                    <FormComponent
                        id="phoneInput"
                        label="Phone number"
                        type="tel"
                        placeholder="Enter your phone number"
                    ></FormComponent>

                    <FormComponent
                        id="birthInput"
                        label="Birthday"
                        type="date"
                        placeholder="Pick your birthday"
                    ></FormComponent>

                    <FormComponent
                        id="addressInput"
                        label="Address"
                        type="text"
                        placeholder="Enter your address"
                    ></FormComponent>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <ButtonComponent
                            textButton="Sign Up"

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
                    You already have an account?{" "}
                    <a class="text-decoration-underline"
                        href="./login"
                        style={{
                            color: "#198754",
                            textDecoration: "none",
                            fontStyle: "italic",
                        }}
                    >
                        Log in
                    </a>
                </div>
            </div>
        </div>
        // </div>
    );
};

export default SignUpPage;
