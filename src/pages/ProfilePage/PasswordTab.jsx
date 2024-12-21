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

    const mutation = useMutationHook(async (data) => {
        const { id, access_token, ...rest } = data;
        const response = await UserService.resetPassword(id, rest, access_token);
        return response;
    });

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status !== "ERR") {
            message.success();
            alert("Cập nhật mật khẩu thành công");
        } else if (isError) {
            message.error();
        }
    }, [data?.status, isError, isSuccess]);

    const handleUpdate = () => {
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        console.log("Access Token:", user?.access_token); 
        console.log("Redux State - User:", user);// Log token
        console.log("User ID:", user?.id);

        mutation.mutate({
            id: user?.id,
            oldPassword,
            newPassword,
            confirmPassword,
            access_token: user?.access_token,
        });
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
                        onChange={setOldPassword}
                    />
                    <FormComponent
                        id="newPassword"
                        label="Mật khẩu mới"
                        placeholder="Nhập mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                    />
                    <FormComponent
                        id="confirmPassword"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu trên"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />
                    {data?.status === "ERR" && (
                        <span style={{ color: "red", fontSize: "16px" }}>{data?.message}</span>
                    )}
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
