import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as FormatService from '../../services/OptionService/FormatService';
import './AdminPage.css';

const FormSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFormats, setFilteredFormats] = useState([]);
    const queryClient = useQueryClient();

    // Hàm thay đổi tên hình thức
    const handleOnChangeName = (value) => setName(value);

    // Hàm thay đổi ghi chú
    const handleOnChangeNote = (value) => setNote(value);

    // Reset form
    const resetForm = () => {
        setName('');
        setNote('');
        setSelectedFormat(null);
    };

    // Kiểm tra form có hợp lệ không
    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập tên hình thức!");
            return false;
        }
        setErrorMessage(""); // Xóa lỗi khi dữ liệu hợp lệ
        return true;
    };

    // Hook thêm hình thức
    const addMutation = useMutation(data => FormatService.addFormat(data), {
        onSuccess: () => {
            alert("Thêm hình thức mới thành công!");
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['formats']);
        },
        onError: () => {
            message.error("Thêm hình thức thất bại!");
        }
    });

    // Hook cập nhật hình thức
    const updateMutation = useMutation(data => {
        if (!selectedFormat) return;
        return FormatService.updateFormat(selectedFormat._id, data);
    }, {
        onSuccess: () => {
            alert("Cập nhật hình thức thành công!");
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['formats']);
        },
        onError: () => {
            message.error("Cập nhật thất bại!");
        }
    });

    // Hook xóa hình thức
    const deleteMutation = useMutation(id => FormatService.deleteFormat(id), {
        onSuccess: () => {
            alert("Xóa hình thức thành công!");
            queryClient.invalidateQueries(['formats']);
        },
        onError: () => {
            message.error("Xóa thất bại!");
        }
    });

    // Lấy danh sách hình thức từ API
    const getAllFormats = async () => {
        const res = await FormatService.getAllFormat();
        return res.data;
    };

    const { isLoading: isLoadingFormat, data: formats } = useQuery({
        queryKey: ['formats'],
        queryFn: getAllFormats,
    });

    // Tìm kiếm hình thức theo tên
    useEffect(() => {
        if (formats) {
            setFilteredFormats(
                formats.filter(format =>
                    format.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, formats]);

    // Mở modal để thêm hình thức
    const handleAddFormat = () => {
        resetForm();
        setShowModal(true);
        setSelectedFormat(null);
    };

    // Mở modal để sửa hình thức
    const handleEditFormat = (format) => {
        if (!format) return;
        setName(format.name);
        setNote(format.note);
        setSelectedFormat(format);
        setShowModal(true);
    };

    // Xử lý xóa hình thức
    const handleDeleteFormat = (format) => {
        if (!format || !format._id) return;
        if (window.confirm(`Bạn có chắc chắn muốn xóa hình thức "${format.name}" không?`)) {
            deleteMutation.mutate(format._id);
        }
    };

    // Xử lý lưu hình thức (thêm mới hoặc cập nhật)
    const onSave = () => {
        if (validateForm()) {
            const dataToSave = { name, note };
            if (selectedFormat && selectedFormat._id) {
                updateMutation.mutate(dataToSave);
            } else {
                addMutation.mutate(dataToSave);
            }
        }
    };

    // Hủy thao tác thêm/sửa hình thức
    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };

    // Xử lý thay đổi ô tìm kiếm
    const handleOnChange = (value) => {
        setSearchTerm(value);
    };



    return (
        <div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên hình thức"
                            enable={true}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm hình thức"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddFormat}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '30%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên hình thức</th>
                            <th scope="col" style={{ width: '40%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '10%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingFormat ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : filteredFormats && filteredFormats.length > 0 ? (
                            filteredFormats.map((format) => (
                                <tr key={format._id}>
                                    <td>{format.code}</td>
                                    <td>{format.name.length > 20 ? format.name.slice(0, 20) + '...' : format.name}</td>
                                    <td>{format.note && format.note.length > 30 ? format.note.slice(0, 30) + '...' : format.note || 'Không có'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditFormat(format)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteFormat(format)}
                                        >
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
            </div>

            {/* Modal thêm/sửa hình thức */}
            <ModalComponent
                isOpen={showModal}
                title={selectedFormat ? "CẬP NHẬT HÌNH THỨC" : "THÊM HÌNH THỨC"}
                body={
                    <>
                        <FormComponent
                            id="nameFormatInput"
                            label="Tên hình thức"
                            type="text"
                            placeholder="Nhập tên hình thức"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                            enable={true}
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable={true}
                        />
                        {/* Hiển thị lỗi nếu có */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                            {errorMessage && (
                                <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </>
                }
                textButton1={selectedFormat ? "Cập nhật" : "Thêm"}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default FormSubTab;
