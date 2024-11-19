import React, { useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';

const SupplierSubTab = () => {
    const suppliers = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'An Nam',
            email: 'annam@gmail.com',
            numPhone: '2124354425', 
            address:'hhjhsabhkbckabskcbkab'
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'An Nam',
            email: 'annam@gmail.com',
            numPhone: '2124354425', 
            address:'hhjhsabhkbckabskcbkab'
        },
    ];

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState(''); // Nút Lưu/Cập nhật
    const [onSave, setOnSave] = useState(() => () => {});
    const [onCancel, setOnCancel] = useState(() => () => {});

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm mở modal thêm ncc
    const handleAddSupplier = () => {
        setModalTitle('THÊM NHÀ CUNG CẤP');
        setModalBody(
            <>
                
                <FormComponent
                    id="emailInput"
                    placeholder="Nhập email"
                    type="email"
                    label="Email"
                ></FormComponent>

                <FormComponent
                    id="nameInput"
                    label="Tên nhà cung cấp"
                    type="text"
                    placeholder="Nhập tên nhà cung cấp"
                ></FormComponent>

                <FormComponent
                    id="phoneInput"
                    label="Số điện thoại"
                    type="tel"
                    placeholder="Nhập số điện thoại"
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
            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Nhà cung cấp mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm nhà cung cấp!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa ncc
    const handleEditSupplier = (supplier) => {
        setModalTitle('CẬP NHẬT NHÀ CUNG CẤP');
        setModalBody(
            <>
            <FormComponent
                    id="emailInput"
                    label="Nhập email"
                    type="email"
                    defaultValue={supplier.email}
                ></FormComponent>

                <FormComponent
                    id="nameInput"
                    label="Tên nhà cung cấp"
                    type="text"
                    defaultValue={supplier.name}
                ></FormComponent>

                <FormComponent
                    id="phoneInput"
                    label="Số điện thoại"
                    type="tel"
                    defaultValue={supplier.numPhone}
                ></FormComponent>

                {/* Địa chỉ được tách thành các trường riêng biệt */}
                <FormSelectComponent
                    id="wardInput"
                    label="Xã/Phường"
                    type="text"
                    defaultValue={supplier.address}
                ></FormSelectComponent>

                <FormSelectComponent
                    id="districtInput"
                    label="Quận/Huyện/TP"
                    type="text"
                    defaultValue={supplier.address}
                ></FormSelectComponent>

                <FormSelectComponent
                    id="provinceInput"
                    label="Tỉnh"
                    type="text"
                    defaultValue={supplier.address}
                ></FormSelectComponent>
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Nhà cung cấp"${supplier.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật nhà cung cấp!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa ncc
    const handleDeleteSupplier = (supplier) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa nhà cung cấp <strong>{supplier.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`NHà cung cấp "${supplier.name}" đã được xóa!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            setShowModal(false);
        });
        setShowModal(true);
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà cung cấp"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm nhà cung cấp"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddSupplier}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '10%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '15%' }}>Tên nhà cung cấp</th>
                            <th scope="col" style={{ width: '15%' }}>Email</th>
                            <th scope="col" style={{ width: '10%' }}>Số điện thoại</th>
                            <th scope="col" style={{ width: '30%' }}>Địa chỉ</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td>{supplier.id}</td>
                                <td>
                                    <img
                                        src={supplier.image}
                                        alt={supplier.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{supplier.name}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.numPhone}</td>
                                <td>{supplier.address}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditSupplier(supplier)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteSupplier(supplier)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

export default SupplierSubTab;
