import { Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import './AdminPage.css';

const AccountManagementTab = () => {
    // Tabs
    const [activeTab, setActiveTab] = useState("customer");

    // Dữ liệu người dùng
    const [accountsUser, setAccountsUser] = useState([]);   // Khách hàng
    const [accountsAdmin, setAccountsAdmin] = useState([]); // Admin
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

    // Tìm kiếm khách hàng
    const [searchType, setSearchType] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');

    // Tìm kiếm admin
    const [searchTypeAdmin, setSearchTypeAdmin] = useState('name');
    const [searchTermAdmin, setSearchTermAdmin] = useState('');

    // Phân trang
    const [currentPageUser, setCurrentPageUser] = useState(1);
    const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
    const itemsPerPage = 10;

    const getUser = useSelector((state) => state.user);

    // ==================== LẤY DANH SÁCH KHÁCH HÀNG ====================
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoadingUser(true);
                const res = await UserService.getAllUserByAdmin(false);
                setAccountsUser(res.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khách hàng:", error);
                setAccountsUser([]);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUsers();
    }, [getUser?.access_token]);

    // ==================== LẤY DANH SÁCH ADMIN ====================
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setIsLoadingAdmin(true);
                const res = await UserService.getAllUserByAdmin(true);
                setAccountsAdmin(res.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách admin:", error);
                setAccountsAdmin([]);
            } finally {
                setIsLoadingAdmin(false);
            }
        };
        fetchAdmins();
    }, [getUser?.access_token]);

    // ==================== TÌM KIẾM KHÁCH HÀNG ====================
    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            // Nếu để trống → reload toàn bộ
            const res = await UserService.getAllUserByAdmin(false);
            setAccountsUser(res.data || []);
            setCurrentPageUser(1);
            return;
        }

        try {
            const searchParams = { [searchType]: searchTerm, isAdmin: false };
            const response = await UserService.filterUsers(searchParams);
            setAccountsUser(response?.data || []);
            setCurrentPageUser(1);
        } catch (error) {
            console.error("Lỗi tìm kiếm khách hàng:", error);
        }
    };

    useEffect(() => {
        handleSearchUser();
    }, [searchTerm, searchType]);

    // ==================== TÌM KIẾM ADMIN ====================
    const handleSearchAdmin = async () => {
        if (!searchTermAdmin.trim()) {
            const res = await UserService.getAllUserByAdmin(true);
            setAccountsAdmin(res.data || []);
            setCurrentPageAdmin(1);
            return;
        }

        try {
            const searchParams = { [searchTypeAdmin]: searchTermAdmin, isAdmin: true };
            const response = await UserService.filterUsers(searchParams);
            setAccountsAdmin(response?.data || []);
            setCurrentPageAdmin(1);
        } catch (error) {
            console.error("Lỗi tìm kiếm admin:", error);
        }
    };

    useEffect(() => {
        handleSearchAdmin();
    }, [searchTermAdmin, searchTypeAdmin]);

    // ==================== PHÂN TRANG KHÁCH HÀNG ====================
    const filteredUsers = accountsUser;
    const indexOfLastUser = currentPageUser * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPagesUser = Math.ceil(filteredUsers.length / itemsPerPage);

    // ==================== PHÂN TRANG ADMIN ====================
    const filteredAdmins = accountsAdmin;
    const indexOfLastAdmin = currentPageAdmin * itemsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - itemsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
    const totalPagesAdmin = Math.ceil(filteredAdmins.length / itemsPerPage);

    // ==================== TẠO PAGE NUMBERS THÔNG MINH ====================
    const generatePageNumbers = (totalPages, currentPage) => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2);
            if (currentPage > 4) pages.push('...');
            const start = Math.max(3, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages - 1, totalPages);
        }
        return pages;
    };

    const pageNumbersUser = generatePageNumbers(totalPagesUser, currentPageUser);
    const pageNumbersAdmin = generatePageNumbers(totalPagesAdmin, currentPageAdmin);

    // ==================== THÊM ADMIN ====================
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirth] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const resetForm = () => {
        setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setPhone(''); setBirth(''); setErrorMessage('');
    };

    const mutation = useMutationHook(data => UserService.signupUser(data));
    const { data, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success('Thêm tài khoản admin thành công!');
            resetForm();
            setShowModal(false);
            // Refetch danh sách admin
            const fetchAdmins = async () => {
                const res = await UserService.getAllUserByAdmin(true);
                setAccountsAdmin(res.data || []);
            };
            fetchAdmins();
        } else if (isError || data?.status === 'ERR') {
            message.error(data?.message || 'Có lỗi xảy ra');
        }
    }, [isSuccess, isError, data]);

    const onSave = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Xác nhận mật khẩu không khớp!');
            return;
        }
        setErrorMessage('');
        mutation.mutate({ email, password, name, phone, birthday, isAdmin: 'true' });
    };

    // ==================== XÓA & CHẶN/KHÔI PHỤC ====================
    const handleDeleteAccount = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

        try {
            await UserService.deleteUser(userId, getUser?.access_token);
            message.success('Xóa tài khoản thành công!');

            // Refetch danh sách tương ứng
            if (activeTab === "customer") {
                const res = await UserService.getAllUserByAdmin(false);
                setAccountsUser(res.data || []);
            } else {
                const res = await UserService.getAllUserByAdmin(true);
                setAccountsAdmin(res.data || []);
            }
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    const handleToggleActive = async (user) => {
        const messageText = user.active
            ? "Bạn có chắc chắn muốn CHẶN tài khoản này?"
            : "Bạn có chắc chắn muốn KHÔI PHỤC tài khoản này?";

        if (!window.confirm(messageText)) return;

        try {
            await UserService.toggleActiveUser(user._id, getUser?.access_token);
            message.success(user.active ? 'Đã chặn tài khoản!' : 'Đã khôi phục tài khoản!');

            // Refetch đúng danh sách (khách hàng hoặc admin)
            if (user.isAdmin) {
                const res = await UserService.getAllUserByAdmin(true);
                setAccountsAdmin(res.data || []);
            } else {
                const res = await UserService.getAllUserByAdmin(false);
                setAccountsUser(res.data || []);
            }
        } catch (error) {
            message.error('Thao tác thất bại');
        }
    };

    // ==================== POPOVER CONTENT ====================
    const popoverContent = (
        <div>
            <Button type="text" onClick={() => setSearchType('name')}>Tìm theo tên</Button><br />
            <Button type="text" onClick={() => setSearchType('email')}>Tìm theo email</Button><br />
            <Button type="text" onClick={() => setSearchType('phone')}>Tìm theo sđt</Button>
        </div>
    );

    const popoverContentAdmin = (
        <div>
            <Button type="text" onClick={() => setSearchTypeAdmin('name')}>Tìm theo tên</Button><br />
            <Button type="text" onClick={() => setSearchTypeAdmin('email')}>Tìm theo email</Button><br />
            <Button type="text" onClick={() => setSearchTypeAdmin('phone')}>Tìm theo sđt</Button>
        </div>
    );

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">Tài khoản</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                {/* Tabs */}
                <ul className="nav nav-tabs">
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

                {/* Nội dung tab */}
                <div className="tab-content mt-4">
                    {activeTab === "customer" && (
                        <div>
                            {/* Tìm kiếm khách hàng */}
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <FormComponent
                                    type="text"
                                    placeholder={`Tìm theo ${searchType === 'name' ? 'tên' : searchType === 'email' ? 'email' : 'số điện thoại'}...`}
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    enable={true}
                                    style={{ flex: 1 }}
                                />
                                <Popover content={popoverContent} title="Chọn trường tìm kiếm" trigger="click">
                                    <Button><i className="bi bi-filter" style={{ fontSize: '20px' }} /></Button>
                                </Popover>
                            </div>

                            {/* Bảng khách hàng */}
                            <table className="table custom-table">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '15%' }}>Mã</th>
                                        <th style={{ width: '15%' }}>Ảnh</th>
                                        <th style={{ width: '20%' }}>Họ và tên</th>
                                        <th style={{ width: '20%' }}>Email</th>
                                        <th style={{ width: '15%' }}>Số điện thoại</th>
                                        <th style={{ width: '8%' }}>Trạng thái</th>
                                        <th style={{ width: '7%' }}>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingUser ? (
                                        <tr><td colSpan="7" className="text-center py-5"><LoadingComponent /></td></tr>
                                    ) : currentUsers.length > 0 ? (
                                        currentUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>{user._id}</td>
                                                <td>
                                                    <img
                                                        src={user.img || "https://s.gr-assets.com/assets/nophoto/user/u_200x266-e183445fd1a1b5cc7075bb1cf7043306.png"}
                                                        alt="Avatar"
                                                        style={{
                                                            width: '80px', height: '80px', borderRadius: '50%',
                                                            objectFit: 'cover', border: '3px solid #fff',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </td>
                                                <td>{user.name || 'Chưa đặt'}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone || 'Chưa có'}</td>
                                                <td>
                                                    <button
                                                        className={`btn btn-sm ${user.active ? 'btn-danger' : 'btn-success'}`}
                                                        onClick={() => handleToggleActive(user)}
                                                    >
                                                        {user.active ? 'Chặn' : 'Khôi phục'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAccount(user._id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="7" className="text-center py-5">Không có dữ liệu</td></tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination khách hàng */}
                            {totalPagesUser > 1 && (
                                <div className="pagination-category d-flex justify-content-center gap-2 mt-4 mb-5">
                                    {currentPageUser > 1 && (
                                        <ButtonComponent2 textButton="Trước" onClick={() => setCurrentPageUser(prev => prev - 1)} />
                                    )}
                                    {pageNumbersUser.map((page, i) => (
                                        page === '...' ?
                                            <ButtonComponent2 key={i} textButton="..." disabled /> :
                                            <>{currentPageUser === page ?
                                                <ButtonComponent key={page} textButton={page} onClick={() => setCurrentPageUser(page)} /> :
                                                <ButtonComponent2 key={page} textButton={page} onClick={() => setCurrentPageUser(page)} />
                                            }</>
                                    ))}
                                    {currentPageUser < totalPagesUser && (
                                        <ButtonComponent2 textButton="Tiếp" onClick={() => setCurrentPageUser(prev => prev + 1)} />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "admin" && (
                        <div>
                            {/* Tìm kiếm + Thêm admin */}
                            <div className="row align-items-center mb-4">
                                <div className="col-6 d-flex align-items-center gap-3">
                                    <FormComponent
                                        type="text"
                                        placeholder={`Tìm theo ${searchTypeAdmin === 'name' ? 'tên' : searchTypeAdmin === 'email' ? 'email' : 'số điện thoại'}...`}
                                        value={searchTermAdmin}
                                        onChange={setSearchTermAdmin}
                                        enable={true}
                                        style={{ flex: 1 }}
                                    />
                                    <Popover content={popoverContentAdmin} title="Chọn trường tìm kiếm" trigger="click">
                                        <Button><i className="bi bi-filter" style={{ fontSize: '20px' }} /></Button>
                                    </Popover>
                                </div>
                                <div className="col-6 text-end">
                                    <ButtonComponent
                                        textButton="Thêm tài khoản"
                                        icon={<i className="bi bi-plus-circle"></i>}
                                        onClick={() => setShowModal(true)}
                                    />
                                </div>
                            </div>

                            {/* Bảng admin */}
                            <table className="table custom-table">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '15%' }}>Mã</th>
                                        <th style={{ width: '15%' }}>Ảnh</th>
                                        <th style={{ width: '25%' }}>Họ và tên</th>
                                        <th style={{ width: '25%' }}>Email</th>
                                        <th style={{ width: '15%' }}>Số điện thoại</th>
                                        <th style={{ width: '5%' }}>Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingAdmin ? (
                                        <tr><td colSpan="6" className="text-center py-5"><LoadingComponent /></td></tr>
                                    ) : currentAdmins.length > 0 ? (
                                        currentAdmins.map(admin => (
                                            <tr key={admin._id}>
                                                <td>{admin._id}</td>
                                                <td>
                                                    <img
                                                        src={admin.img || "https://s.gr-assets.com/assets/nophoto/user/u_200x266-e183445fd1a1b5cc7075bb1cf7043306.png"}
                                                        alt="Avatar"
                                                        style={{
                                                            width: '80px', height: '80px', borderRadius: '50%',
                                                            objectFit: 'cover', border: '3px solid #fff',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </td>
                                                <td>{admin.name || 'Chưa đặt'}</td>
                                                <td>{admin.email}</td>
                                                <td>{admin.phone || 'Chưa có'}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAccount(admin._id)}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center py-5">Không có dữ liệu</td></tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination admin */}
                            {totalPagesAdmin > 1 && (
                                <div className="pagination-category d-flex justify-content-center gap-2 mt-4 mb-5">
                                    {currentPageAdmin > 1 && (
                                        <ButtonComponent2 textButton="Trước" onClick={() => setCurrentPageAdmin(prev => prev - 1)} />
                                    )}
                                    {pageNumbersAdmin.map((page, i) => (
                                        page === '...' ?
                                            <ButtonComponent2 key={i} textButton="..." disabled /> :
                                            <>{currentPageAdmin === page ?
                                                <ButtonComponent key={page} textButton={page} onClick={() => setCurrentPageAdmin(page)} /> :
                                                <ButtonComponent2 key={page} textButton={page} onClick={() => setCurrentPageAdmin(page)} />
                                            }</>
                                    ))}
                                    {currentPageAdmin < totalPagesAdmin && (
                                        <ButtonComponent2 textButton="Tiếp" onClick={() => setCurrentPageAdmin(prev => prev + 1)} />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal thêm admin */}
            <ModalComponent
                isOpen={showModal}
                title="THÊM TÀI KHOẢN ADMIN"
                body={
                    <>
                        <FormComponent label="Email" type="email" value={email} onChange={setEmail} required />
                        <FormComponent label="Mật khẩu" type="password" value={password} onChange={setPassword} required />
                        <FormComponent label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
                        <FormComponent label="Họ và tên" type="text" value={name} onChange={setName} required />
                        <FormComponent label="Số điện thoại" type="tel" value={phone} onChange={setPhone} required />
                        <FormComponent label="Ngày sinh" type="date" value={birthday} onChange={setBirth} required />

                        {errorMessage && <div className="text-danger text-center mt-2">{errorMessage}</div>}
                        {data?.status === 'ERR' && <div className="text-danger text-center mt-2">{data.message}</div>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={() => { setShowModal(false); resetForm(); }}
            />
        </div>
    );
};

export default AccountManagementTab;