import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';

const AccountManagementTab = () => {

    const [activeTab, setActiveTab] = useState("customer");
    const accounts = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'Nguyễn Văn A',
            email: 'nguyenvan@gmail.com',
            numPhone: '2124354425'
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'Nguyễn Văn A',
            email: 'nguyenvan@gmail.com',
            numPhone: '2124354425'
        },
    ];

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState('');
    const [onSave, setOnSave] = useState(() => () => { });
    const [onCancel, setOnCancel] = useState(() => () => { });

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm mở modal thêm account
    const [selectedOption, setSelectedOption] = useState('default');
    const handleAddAccount = () => {
        setModalTitle('THÊM TÀI KHOẢN ADMIN');
        setModalBody(
            <>
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
                
                <div className="col-6">
                    <div className="form-check ">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="adminOption"
                            id="admin"
                            checked={selectedOption === 'default'}
                            onChange={() => setSelectedOption('default')}
                        />
                        <label className="form-check-label" htmlFor="admin">
                            Admin
                        </label>
                    </div>
                </div>
            </>
        );
        setTextButton1('Thêm');
        setOnSave(() => () => {
            alert('Admin mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm admin!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa acount
    // const handleEditAccount = (account) => {
    //     setModalTitle('CẬP NHẬT tài khoản');
    //     setModalBody(
    //         <>
    //             <p style={{ fontSize: '16px' }}>Chọn loại tài khoản</p>
    //             <div className="row">
    //                 <div className="col-6">
    //                     <div className="form-check ">
    //                         <input
    //                             className="form-check-input"
    //                             type="radio"
    //                             name="saleOption"
    //                             id="defaultAddress"
    //                             checked={selectedOption === 'default'}
    //                             onChange={() => setSelectedOption('default')}
    //                         />
    //                         <label className="form-check-label" htmlFor="defaultAddress">
    //                             Mã giảm giá
    //                         </label>
    //                     </div>


    //                 </div>

    //                 <div className="col-6">
    //                     <div className="form-check ">
    //                         <input
    //                             className="form-check-input"
    //                             type="radio"
    //                             name="freeShipOption"
    //                             id="otherAddress"
    //                             checked={selectedOption === 'other'}
    //                             onChange={() => setSelectedOption('other')}
    //                         />
    //                         <label className="form-check-label" htmlFor="otherAddress">
    //                             Miễn phí vận chuyển
    //                         </label>
    //                     </div>
    //                 </div>
    //             </div>

    //             <FormComponent
    //                 id="valueInput"
    //                 label="Mô tả"
    //                 type="number"
    //                 defaultValue={account.value}
    //             />

    //             <FormComponent
    //                 id="startAtInput"
    //                 label="Ngày bắt đầu"
    //                 type="date"
    //                 defaultValue={account.startAt}
    //             />

    //             <FormComponent
    //                 id="endAtInput"
    //                 label="Ngày kết thúc"
    //                 type="date"
    //                 defaultValue={account.endAt}
    //             />

    //             <FormComponent
    //                 id="applyForInput"
    //                 label="Áp dụng cho"
    //                 type="number"
    //                 defaultValue={account.applyFor}
    //             />

    //             <FormComponent
    //                 id="quantityInput"
    //                 label="Số lượng"
    //                 type="number"
    //                 defaultValue={account.quantity}
    //             />

    //             <FormComponent
    //                 id="usedInput"
    //                 label="Đã sử dụng"
    //                 type="number"
    //                 defaultValue={account.used}
    //             />
    //         </>
    //     );
    //     setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
    //     setOnSave(() => () => {
    //         alert(`tài khoản "${account.id}" đã được cập nhật!`);
    //         setShowModal(false);
    //     });
    //     setOnCancel(() => () => {
    //         alert('Hủy cập nhật tài khoản!');
    //         setShowModal(false);
    //     });
    //     setShowModal(true);
    // };

    // Hàm mở modal xóa tài khoản
    const handleDeleteAccount = (account) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{ fontSize: '16px' }}>Bạn có chắc chắn muốn xóa tài khoản <strong>{account.name}</strong> không?</p>
        );
        setTextButton1('Xóa');
        setOnSave(() => () => {
            alert(`tài khoản "${account.name}" đã được xóa!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
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
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>
                                <img
                                    src={account.image}
                                    alt={account.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{account.name}</td>
                            <td>{account.email}</td>
                            <td>{account.numPhone}</td>
                            <td>
                                {/* <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEditaccount(account)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button> */}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteAccount(account)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
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
                    {accounts.map((account) => (
                        <tr key={account.id}>
                            <td>{account.id}</td>
                            <td>
                                <img
                                    src={account.image}
                                    alt={account.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </td>
                            <td>{account.name}</td>
                            <td>{account.email}</td>
                            <td>{account.numPhone}</td>
                            <td>
                                {/* <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEditaccount(account)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button> */}
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteAccount(account)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
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
                title={modalTitle}
                body={modalBody}
                textButton1={textButton1}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default AccountManagementTab;
