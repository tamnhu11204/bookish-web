import React, { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';

const PublisherSubTab = () => {
    const publishers = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'An Nam',
            note: 'scdvzvzvzcz',
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'An Nam',
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

    // Hàm mở modal thêm nxb
    const handleAddPublisher = () => {
        setModalTitle('THÊM NHÀ XUẤT BẢN');
        setModalBody(
            <>
                
                <FormComponent
                    id="nameInput"
                    placeholder="Nhập tên nhà xuất bản"
                    type="text"
                    label="Tên nhà xuất bản"
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
            alert('Nhà xuất bản mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm nhà xuất bản!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa nxb
    const handleEditPublisher = (publisher) => {
        setModalTitle('CẬP NHẬT NHÀ XUẤT BẢN');
        setModalBody(
            <>
            <FormComponent
                    id="nameInput"
                    type="text"
                    label="Tên nhà xuất bản"
                    defaultValue={publisher.name}
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    defaultValue={publisher.note}
                ></FormComponent>
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Nhà xuất bản"${publisher.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật nhà xuất bản!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa nxb
    const handleDeletePublisher = (publisher) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa nhà xuất bản <strong>{publisher.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Nhà xuất bản "${publisher.name}" đã được xóa!`);
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
                            placeholder="Tìm kiếm theo tên nhà xuất bản"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm nhà xuất bản"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddPublisher}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên nhà xuất bản</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {publishers.map((publisher) => (
                            <tr key={publisher.id}>
                                <td>{publisher.id}</td>
                                <td>
                                    <img
                                        src={publisher.image}
                                        alt={publisher.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{publisher.name}</td>
                                <td>{publisher.note}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditPublisher(publisher)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeletePublisher(publisher)}
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

export default PublisherSubTab;
