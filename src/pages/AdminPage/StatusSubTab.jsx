import React, { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as StatusService from '../../services/OptionService/StatusService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const StatusSubTab = () => {
    const statuses = [
        {
            id: 103,
            name: 'Đã giao hàng',
            note: 'scdvzvzvzcz',
        },
        {
            id: 104,
            name: 'Đã giao hàng',
            note: 'scdvzvzvzcz',
        },
    ];

    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState(null);
    const [id,setID]= useState('');
    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState(''); // Nút Lưu/Cập nhật
    const [onSave, setOnSave] = useState(() => () => {});
    const [onCancel, setOnCancel] = useState(() => () => {});

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm mở modal thêm loại trạng thái đơn hàng
    const handleAddStatus = () => {
        setModalTitle('THÊM LOẠI TRẠNG THÁI ĐƠN HÀNG');
        setModalBody(
            <>
                
                <FormComponent
                    id="nameInput"
                    placeholder="Nhập tên loại trạng thái đơn hàng"
                    type="text"
                    label="Loại trạng thái đơn hàng"
                    value={name}
                    onChange={handleOnChangeName}
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    placeholder="Nhập ghi chú"
                    value={note}
                    onChange={handleOnChangeNote}
                ></FormComponent>

            </>
        );
        setTextButton1('Thêm'); // Đặt nút là "Thêm"
        setOnSave(() => () => {
            alert('Loại trạng thái đơn hàng mới đã được thêm!');
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy thêm loại trạng thái đơn hàng!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal sửa loại trạng thái đơn hàng
    const handleEditStatus = (status) => {
        setModalTitle('CẬP NHẬT LOẠI TRẠNG THÁI ĐƠN HÀNG');
        setModalBody(
            <>
            <FormComponent
                    id="nameInput"
                    type="text"
                    label="Tên loại trạng thái đơn hàng"
                    defaultValue={status.name}
                    value={name}
                    onChange={handleOnChangeName}
                ></FormComponent>

                <FormComponent
                    id="noteInput"
                    label="Ghi chú"
                    type="text"
                    defaultValue={status.note}
                    value= {note}
                    onChange={handleOnChangeNote}
                ></FormComponent>
            </>
        );
        setTextButton1('Cập nhật'); // Đặt nút là "Cập nhật"
        setOnSave(() => () => {
            alert(`Loại trạng thái đơn hàng"${status.name}" đã được cập nhật!`);
            setShowModal(false);
        });
        setOnCancel(() => () => {
            alert('Hủy cập nhật loại trạng thái đơn hàng!');
            setShowModal(false);
        });
        setShowModal(true);
    };

    // Hàm mở modal xóa loại trạng thái đơn hàng
    const handleDeleteStatus = (status) => {
        setModalTitle('Xác nhận xóa');
        setModalBody(
            <p style={{fontSize:'16px'}}>Bạn có chắc chắn muốn xóa loại trạng thái đơn hàng <strong>{status.name}</strong> không?</p>
        );
        setTextButton1('Xóa'); // Có thể tùy chỉnh nếu cần
        setOnSave(() => () => {
            alert(`Loại trạng thái đơn hàng "${status.name}" đã được xóa!`);
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
                            placeholder="Tìm kiếm theo tên loại trạng thái đơn hàng"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm loại trạng thái đơn hàng"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddStatus}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '30%' }}>Tên loại trạng thái đơn hàng</th>
                            <th scope="col" style={{ width: '50%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {statuses.map((status) => (
                            <tr key={status.id}>
                                <td>{status.id}</td>
                                <td>{status.name}</td>
                                <td>{status.note}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleEditStatus(status)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteStatus(status)}
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

export default StatusSubTab;
