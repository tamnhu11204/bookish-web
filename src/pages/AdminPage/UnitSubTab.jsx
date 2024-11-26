import React, { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';

const UnitSubTab = () => {
    const units = [
        {
            id: 103,
            name: 'Quyển',
            number : 100,
            note: 'scdvzvzvzcz',
        },
        {
            id: 104,
            name: 'Cái',
            number : 100,
            note: 'scdvzvzvzcz',
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
 
    // Hàm mở modal thêm ngôn ngữ
    const handleAddLanguage = () => {
        setModalTitle('THÊM ĐƠN VỊ');
        setModalBody(
            <>
                
                <FormComponent
                    id="nameInput"
                    placeholder="Nhập đơn vị"
                    type="text"
                    label="Đơn vị"
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    placeholder="Nhập ghi chú"
                ></FormComponent>

            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Đơn vị mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm đơn vị!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa ngôn ngữ
    const handleEditLanguage = (language) => {
        setModalTitle('CẬP NHẬT ĐƠN VỊ');
        setModalBody(
            <>
            <FormComponent
                    id="nameInput"
                    type="text"
                    label="Tên đơn vị"
                    defaultValue={language.name}
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    defaultValue={language.note}
                ></FormComponent>
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Ngôn ngữ"${language.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật đơn vị');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa ngôn ngữ
    const handleDeleteLanguage = (language) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa đơn vị <strong>{language.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Đơn vị "${language.name}" đã được xóa!`);
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
                            placeholder="Tìm kiếm theo tên đơn vị"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm đơn vị"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddLanguage}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '30%' }}>Hình thức</th>
                            <th scope="col" style={{ width: '20%' }}>Số sản phẩm</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {units.map((unit) => (
                            <tr key={unit.id}>
                                <td>{unit.id}</td>
                                <td>{unit.name}</td>
                                <td>{unit.number}</td>
                                <td>{unit.note}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditLanguage(unit)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteLanguage(unit)}
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

export default UnitSubTab;
