import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FormComponent from "../../components/FormComponent/FormComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/MessageComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const PasswordTab = () => {
    const formStyle = { fontSize: "16px" };
    const user = useSelector((state) => state.user);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    };

    const mutation = useMutationHook(async (data) => {
        const { id, oldPassword, newPassword, access_token } = data; // Giải nén dữ liệu
        const response = await UserService.resetPassword(id, { oldPassword, newPassword }, access_token);
        return response;
    });
    

    const { data, isLoading, isSuccess, isError } = mutation;

    const handleOnChangeOld = (value) => {
        setOldPassword(value.trim());
        setErrorMessage("");
    };

    const handleOnChangeNew = (value) => {
        setNewPassword(value.trim());
        setErrorMessage("");
    };

    const handleOnChangeConfirm = (value) => {
        setConfirmPassword(value.trim());
        setErrorMessage("");
    };

    useEffect(() => {
        if (isSuccess && data?.status !== "ERR") {
            message.success();
            alert("Cập nhật mật khẩu thành công!");
            resetForm();
        } else if (isError) {
            setErrorMessage(data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
            message.error();
        }
    }, [data?.status, isError, isSuccess]);

    const handleUpdate = async() => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Xác nhận mật khẩu không khớp! Vui lòng nhập lại.");
            return;
        }

        mutation.mutate({
            id: user?.id,
            oldPassword,
            newPassword,
            access_token: user?.access_token,
        });
        console.log('data',user?.id)
    };

    return (
        <div style={{ padding: "0 20px" }}>
            <div className="title-section">
                <h3 className="text mb-0">ĐỔI MẬT KHẨU</h3>
            </div>
            <div className="container mt-5">
                <form className="p-4 border rounded" style={formStyle}>
                    <FormComponent
                        id="oldPassword"
                        label="Mật khẩu cũ"
                        placeholder="Nhập mật khẩu cũ"
                        type="password"
                        value={oldPassword}
                        onChange={handleOnChangeOld}
                        enable = {true}
                    />
                    <FormComponent
                        id="newPassword"
                        label="Mật khẩu mới"
                        placeholder="Nhập mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={handleOnChangeNew}
                        enable = {true}
                    />
                    <FormComponent
                        id="confirmPassword"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu trên"
                        type="password"
                        value={confirmPassword}
                        onChange={handleOnChangeConfirm}
                        enable = {true}
                    />
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                        {errorMessage && (
                            <div
                                style={{
                                    color: "red",
                                    textAlign: "center",
                                    marginBottom: "10px",
                                    fontSize: "16px",
                                }}
                            >
                                {errorMessage}
                            </div>
                        )}
                        {data?.status === "ERR" && (
                            <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>
                        )}
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        <LoadingComponent isLoading={isLoading}>
                            <ButtonComponent textButton="Cập nhật" onClick={handleUpdate} />
                        </LoadingComponent>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordTab;
