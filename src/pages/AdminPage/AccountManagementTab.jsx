import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import './AdminPage.css';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const AccountManagementTab = () => {

    const [activeTab, setActiveTab] = useState("customer");

    //////////////--------Hien thi danh sach user-------//////////

    const getUser = useSelector((state) => state.user);

    const getAllUserIsUser = async (isAdmin, token) => {
        const res = await UserService.getAllUserByAdmin(isAdmin, token);
        return res.data;
    };

    const isAdminFalse = false

    const { isLoading: isLoadingAccountUser, data: accountsUser } = useQuery({
        queryKey: ["accountsUser_customer", isAdminFalse, getUser.access_token],
        queryFn: () => getAllUserIsUser(isAdminFalse, getUser?.access_token),
    });

    //////////////--------Hien thi danh sach admin-------//////////

    const getAllUserIsAdmin = async (isAdmin, token) => {
        const res = await UserService.getAllUserByAdmin(isAdmin, token);
        return res.data;
    };

    const isAdminTrue = true

    const { isLoading: isLoadingAccountAdmin, data: accountsAdmin } = useQuery({
        queryKey: ["accountsUser_admin", isAdminTrue, getUser.access_token],
        queryFn: () => getAllUserIsAdmin(isAdminTrue, getUser?.access_token),
    });


    //////////////--------Them admin----------////////////////

    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirth] = useState('');

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setBirth('');
    };

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const mutation = useMutationHook(data => UserService.signupUser(data));
    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success()
            alert("Thêm tài khoản admin thành công!")
            setShowModal(false);
        } else if (isError) {
            message.error()
        }
    }, [data?.status, isError, isSuccess, navigate])

    const handleAddAccount = () => { setShowModal(true) }

    const handleOnChangeEmail = (value) => setEmail(value);
    const handleOnChangePassword = (value) => setPassword(value);
    const handleOnChangeConfirmPassword = (value) => setConfirmPassword(value);
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangePhone = (value) => setPhone(value);
    const handleOnChangeBirth = (value) => setBirth(value);

    const onSave = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Xác nhận mật khẩu không khớp! Vui lòng nhập lại.');
            return;
        }
        // Đảm bảo isAdmin luôn là 'true'
        const isAdmin = 'true';
        setErrorMessage('');
        mutation.mutate({ email, password, name, phone, birthday, isAdmin });

        console.log('signup', email, password, confirmPassword, name, phone, birthday, isAdmin);
    };


    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    }

    ///////xóa
    const handleDeleteAccount = async (userId) => {
        try {
            // eslint-disable-next-line no-restricted-globals
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa admin này?");
            if (isConfirmed) {
                await UserService.deleteUser(userId, getUser?.access_token);
                alert("Xóa admin thành công!");
            }
        } catch (error) {
            console.error("Error deleting admin: ", error);
            alert("Đã xảy ra lỗi khi xóa admin.");
        }
    };

    // Toggle Active State
    const handleToggleActive = async (user) => {
        try {
            const message = user?.active
                ? "Bạn có chắc chắn muốn chặn trạng thái hoạt động của tài khoản này?"
                : "Bạn có chắc chắn muốn khôi phục trạng thái hoạt động của tài khoản này?";
    
            // eslint-disable-next-line no-restricted-globals
            const isConfirmed = confirm(message);
    
            if (isConfirmed) {
                // Gọi service để chuyển đổi trạng thái active
                await UserService.toggleActiveUser(user._id, getUser?.access_token);
    
                const successMessage = user?.active
                    ? "Tài khoản đã bị chặn thành công!"
                    : "Tài khoản đã được khôi phục thành công!";
                alert(successMessage);
            }
        } catch (error) {
            console.error("Error toggling active state: ", error);
            alert("Đã xảy ra lỗi khi thay đổi trạng thái tài khoản.");
        }
    };
    

    //Nội dung ở tab tài khoản khách hàng
    const customerContent = (
        <>
            <div className="col-6">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên "
                />
            </div>

            <table className="table custom-table" >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: '10%' }}>Mã</th>
                        <th scope="col" style={{ width: '20%' }}>Ảnh</th>
                        <th scope="col" style={{ width: '20%' }}>Họ và tên</th>
                        <th scope="col" style={{ width: '20%' }}>Email</th>
                        <th scope="col" style={{ width: '20%' }}>Số điện thoại</th>
                        <th scope="col" style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody className="table-content">
                    {isLoadingAccountUser ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <LoadingComponent />
                            </td>
                        </tr>
                    ) : accountsUser && accountsUser.length > 0 ? (
                        accountsUser.map((accountUser) => (
                            <tr key={accountUser._id}>
                                <td>{accountUser._id}</td>
                                <td>            {/* Hình đại diện */}
                                    <img
                                        src={accountUser.img || 'https://via.placeholder.com/100'}
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
                                </td>
                                <td>{accountUser.name}</td>
                                <td>{accountUser.email}</td>
                                <td>{accountUser.phone}</td>
                                <td>
                                <button
                                        className={`btn btn-sm ${
                                            accountUser.active ? "btn-danger" : "btn-primary"
                                        }`}
                                        onClick={() => handleToggleActive(accountUser)}
                                    >
                                        {accountUser.active ? 
                                        <i class="bi bi-exclamation-lg"></i> 
                                        : 
                                        <i class="bi bi-arrow-clockwise"></i>}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                Không có dữ liệu để hiển thị.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )

    //Nội dung ở tab tài khoản admin
    const adminContent = (
        <>
            <div className="row align-items-center mb-3">
                <div className="col-6">
                    <FormComponent
                        id="searchInput"
                        type="text"
                        placeholder="Tìm kiếm theo tên "
                    />
                </div>
                <div className="col-6 text-end">
                    <ButtonComponent
                        textButton="Thêm tài khoản"
                        icon={<i className="bi bi-plus-circle"></i>}
                        onClick={handleAddAccount}
                    />
                </div>
            </div>
            <table className="table custom-table" >
                <thead className="table-light">
                    <tr>
                        <th scope="col" style={{ width: '10%' }}>Mã</th>
                        <th scope="col" style={{ width: '20%' }}>Ảnh</th>
                        <th scope="col" style={{ width: '20%' }}>Họ và tên</th>
                        <th scope="col" style={{ width: '20%' }}>Email</th>
                        <th scope="col" style={{ width: '20%' }}>Số điện thoại</th>
                        <th scope="col" style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody className="table-content">
                    {isLoadingAccountAdmin ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <LoadingComponent />
                            </td>
                        </tr>
                    ) : accountsAdmin && accountsAdmin.length > 0 ? (
                        accountsAdmin.map((accountAdmin) => (
                            <tr key={accountAdmin._id}>
                                <td>{accountAdmin._id}</td>
                                <td><img
                                    src={accountAdmin.img || 'https://via.placeholder.com/100'}
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
                                </td>
                                <td>{accountAdmin.name}</td>
                                <td>{accountAdmin.email}</td>
                                <td>{accountAdmin.phone}</td>
                                <td>
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteAccount(accountAdmin._id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                Không có dữ liệu để hiển thị.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )

    //
    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">Tài khoản</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {/* Tabs */}
                    <div className="row mt-4" >
                        <div className="col-12">
                            <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "customer" ? "active" : ""}`}
                                        onClick={() => setActiveTab("customer")}
                                    >
                                        Khách hàng
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "admin" ? "active" : ""}`}
                                        onClick={() => setActiveTab("admin")}
                                    >
                                        Admin
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {activeTab === "customer" && <div>{customerContent}</div>}
                        {activeTab === "admin" && <div>{adminContent}</div>}
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={showModal}
                title="THÊM TÀI KHOẢN ADMIN"
                body={
                    <>
                        <FormComponent
                            id="emailInput"
                            placeholder="Nhập email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={handleOnChangeEmail}
                            required={true}
                        />

                        <FormComponent
                            id="passwordInput"
                            label="Mật khẩu"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={handleOnChangePassword}
                            required={true}
                        />

                        <FormComponent
                            id="confirmPasswordInput"
                            label="Xác nhận mật khẩu"
                            type="password"
                            placeholder="Nhập lại mật khẩu ở trên"
                            value={confirmPassword}
                            onChange={handleOnChangeConfirmPassword}
                            required={true}
                        />

                        <FormComponent
                            id="nameInput"
                            label="Họ và tên"
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                        />

                        <FormComponent
                            id="phoneInput"
                            label="Số điện thoại"
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            value={phone}
                            onChange={handleOnChangePhone}
                            required={true}
                        />

                        <FormComponent
                            id="birthInput"
                            label="Ngày sinh"
                            type="date"
                            placeholder="Chọn ngày sinh"
                            value={birthday}
                            onChange={handleOnChangeBirth}
                            required={true}
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
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default AccountManagementTab;
