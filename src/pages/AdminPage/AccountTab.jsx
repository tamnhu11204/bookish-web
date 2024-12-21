import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserService from '../../services/UserService';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as message from "../../components/MessageComponent/MessageComponent";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { updateUser } from '../../redux/slides/UserSlide';
import Compressor from 'compressorjs';

const AccountTab = () => {
    const formStyle = {
        fontSize: "16px", // Tăng cỡ chữ toàn bộ form
    };

    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [img, setImg] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');

    const mutation = useMutationHook(
        async (data) => {
            const { id, ...rests } = data;
            const response = await UserService.updateUser(id, rests);
            return response;
        }
    );

    const dispatch = useDispatch();
    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setName(user.name || '');
            setPhone(user.phone || '');
            setImg(user.img || '');

            if (user.birthday) {
                const formattedBirthday = new Date(user.birthday).toISOString().split('T')[0];
                setBirthday(formattedBirthday);
            } else {
                setBirthday('');
            }
            setGender(user.gender || '');
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            handleGetDetailUser(user?.id, user?.access_token);
            alert('Cập nhật thông tin thành công');
        } else if (isError) {
            message.error();
        }
    }, [data?.status, isError, isSuccess]);

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };

    const handleOnChangeEmail = (value) => setEmail(value);
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangePhone = (value) => setPhone(value);
    const handleOnChangeBirthday = (value) => setBirthday(value);
    const handleOnChangeGender = (value) => setGender(value);

    const handleOnChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6, // Chất lượng ảnh (0.6 là 60%)
                maxWidth: 800, // Chiều rộng tối đa
                maxHeight: 800, // Chiều cao tối đa
                success(result) {
                    // Đọc file đã nén dưới dạng base64
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImg(reader.result); // Cập nhật state img bằng base64 URL
                    };
                    reader.readAsDataURL(result); // Đọc file đã nén như là base64
                },
                error(err) {
                    console.error(err);
                }
            });
        }
    };

    const handleUpdate = () => {
        const imgData = img instanceof File ? img : img;

        mutation.mutate({ id: user?.id, email, name, phone, img: imgData, gender, birthday, access_token: user?.access_token });
    };

    ////////////////--------Reset password-----------//////////////
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const mutationPass = useMutationHook(
        async (dataPass) => {
            const { id, ...rests } = dataPass;
            const response = await UserService.resetPassword(id, rests);
            return response;
        }
    );

    const { dataPass, isLoadingPass, isSuccessPass, isErrorPass } = mutationPass;

    useEffect(() => {
        if (isSuccessPass && dataPass?.status !== 'ERR') {
            message.success();
            alert('Cập nhật mật khẩu thành công');
        } else if (isErrorPass) {
            message.error();
        }
    }, [isErrorPass, isSuccessPass, dataPass]);

    const handleOnChangeOld = (value) => setOldPassword(value);
    const handleOnChangeNew = (value) => setNewPassword(value);
    const handleOnChangeConfirm = (value) => setConfirmPassword(value);

    const handleResetPassword = () => {
        mutation.mutate({ id: user?.id, oldPassword, newPassword, confirmPassword, access_token: user?.access_token });
    }


    return (
        <><div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">TÀI KHOẢN CỦA TÔI</h3>
            </div>

            <div className="container mt-5">
                <div style={{ fontSize: '20px', color: '#198754', marginBottom: '10px' }}>Thông tin hồ sơ</div>
                <form className="p-4 border rounded" style={{ fontSize: '16px' }}>
                    {/* Avatar */}
                    <div className="avatar-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: '10px' }}>
                        {/* Hình đại diện */}
                        <img
                            src={img || 'https://via.placeholder.com/100'}
                            alt="Avatar"
                            className="avatar-img"
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                border: '3px solid #ffffff',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                marginBottom: '10px',
                            }}
                        />

                        {/* Nút chọn ảnh */}
                        <ButtonComponent
                            textButton="Chọn ảnh"
                            onClick={() => document.getElementById('fileInput').click()}
                        />

                        {/* Input file ẩn */}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleOnChangeImg}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Tên đăng nhập */}
                    <FormComponent
                        id="nameInput"
                        label="Họ và tên"
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={name}
                        onChange={handleOnChangeName}
                    />

                    {/* Email */}
                    <FormComponent
                        id="emailInput"
                        label="Email"
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={handleOnChangeEmail}
                    />

                    {/* Số điện thoại */}
                    <FormComponent
                        id="phoneInput"
                        label="Số điện thoại"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={handleOnChangePhone}
                    />

                    {/* Giới tính */}
                    <div className="mb-3">
                        <label className="form-label">Giới tính</label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    checked={gender === 'male'}
                                    onChange={() => handleOnChangeGender('male')}
                                />
                                <label className="form-check-label" htmlFor="male">
                                    Nam
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    checked={gender === 'female'}
                                    onChange={() => handleOnChangeGender('female')}
                                />
                                <label className="form-check-label" htmlFor="female">
                                    Nữ
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="gender"
                                    id="other"
                                    checked={gender === 'other'}
                                    onChange={() => handleOnChangeGender('other')}
                                />
                                <label className="form-check-label" htmlFor="other">
                                    Khác
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Ngày sinh */}
                    <FormComponent
                        id="birthdayInput"
                        label="Ngày sinh"
                        type="date"
                        placeholder="Chọn ngày sinh"
                        value={birthday}
                        onChange={handleOnChangeBirthday}
                    />

                    {data?.status === 'ERR' &&
                        <span style={{ color: 'red', fontSize: '16px' }}>{data?.message}</span>}

                    {/* Nút lưu thay đổi */}
                    <div className="d-flex justify-content-end mt-3">
                        <LoadingComponent isLoading={isLoading}>
                            <ButtonComponent textButton="Cập nhật" onClick={handleUpdate} />
                        </LoadingComponent>
                    </div>
                </form>
            </div>

            <div className="container mt-5">
                <div style={{ fontSize: '20px', color: '#198754', marginBottom: '10px' }}>Đổi mật khẩu</div>
                <form className="p-4 border rounded" style={formStyle}>
                    {/* Mật khẩu cũ */}
                    <FormComponent
                        id="oldPassInput"
                        label="Mật khẩu cũ"
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={handleOnChangeOld}
                    />

                    {/* Mật khẩu mới */}
                    <FormComponent
                        id="newPassInput"
                        label="Mật khẩu mới"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={handleOnChangeNew}
                    />

                    {/* Xác nhận mật khẩu */}
                    <FormComponent
                        id="confirmPassInput"
                        label="Xác nhận mật khẩu"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={handleOnChangeConfirm}
                    />

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                        {errorMessage && (
                            <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                {errorMessage}
                            </div>
                        )}
                        {dataPass?.status === 'ERR' &&
                            <span style={{ color: "red", fontSize: "16px" }}>{dataPass?.message}</span>}
                    </div>

                    {/* Nút xác nhận */}
                    <div className="d-flex justify-content-end">
                        <LoadingComponent isLoading={isLoadingPass}>
                            <ButtonComponent textButton="Cập nhật" onClick={handleResetPassword} />
                        </LoadingComponent>
                    </div>
                </form>
            </div>
        </div>
        </>
    );

}



export default AccountTab;