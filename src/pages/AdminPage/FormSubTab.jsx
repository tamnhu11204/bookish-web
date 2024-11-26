import React, { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';

const FormSubTab = () => {
    const format = [
        {
            id: 103,
            name: 'Bìa cứng',
            number : 100,
            note: 'scdvzvzvzcz',
        },
        {
            id: 104,
            name: 'Bìa mềm',
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
        setModalTitle('THÊM HÌNH THỨC');
        setModalBody(
            <>
                
                <FormComponent
                    id="nameInput"
                    placeholder="Nhập tên hình thức"
                    type="text"
                    label="Hình thức"
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
            alert('Hình thức mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm hình thức!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa ngôn ngữ
    const handleEditLanguage = (language) => {
        setModalTitle('CẬP NHẬT HÌNH THỨC');
        setModalBody(
            <>
            <FormComponent
                    id="nameInput"
                    type="text"
                    label="Tên hình thức"
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
            alert('Hủy cập nhật ngôn ngữ!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa ngôn ngữ
    const handleDeleteLanguage = (language) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa ngôn ngữ <strong>{language.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Ngôn ngữ "${language.name}" đã được xóa!`);
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
                            placeholder="Tìm kiếm theo tên hình thức"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm hình thức"
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
                        {format.map((format) => (
                            <tr key={format.id}>
                                <td>{format.id}</td>
                                <td>{format.name}</td>
                                <td>{format.number}</td>
                                <td>{format.note}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditLanguage(format)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteLanguage(format)}
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

export default FormSubTab;
