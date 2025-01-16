import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import './AdminPage.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FormatService from '../../services/OptionService/FormatService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const FormSubTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedFormat, setSelectedFormat] = useState(null); // Lưu trữ format đang được chọn
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState(''); 
        const [filteredFormats, setFilteredFormat] = useState([]); 

    // Hàm thay đổi tên hình thức
    const handleOnChangeName = (value) => setName(value);
    
    // Hàm thay đổi ghi chú
    const handleOnChangeNote = (value) => setNote(value);

    // Kiểm tra form có hợp lệ không
    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập tên hình thức!");
            return false;
        }
        setErrorMessage(""); // Xóa lỗi khi dữ liệu hợp lệ
        return true;
    };

    // Gọi hook để thêm hình thức
    const addMutation = useMutationHook(data => FormatService.addFormat(data));
    const updateMutation = useMutationHook(data => FormatService.updateFormat(selectedFormat._id, data)); // Sửa format
    const deleteMutation = useMutationHook(data => FormatService.deleteFormat(data)); // Xóa format

    // Lấy danh sách hình thức từ API
    const getAllFormat = async () => {
        const res = await FormatService.getAllFormat();
        return res.data;
    };

    const { isLoading: isLoadingFormat, data: formats } = useQuery({
        queryKey: ['formats'],
        queryFn: getAllFormat,
    });

    const { data, isSuccess, isError } = addMutation;
    const { isSuccess: isSuccessUpdate, isError: isErrorUpdate } = updateMutation;
    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;

    // Reset form sau khi thêm hoặc sửa
    const resetForm = () => {
        setName('');
        setNote('');
        setSelectedFormat(null);
    };

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success();
            alert('Thêm hình thức mới thành công!');
            resetForm();
            setShowModal(false);
        }
        if (isSuccessUpdate && data?.status !== 'ERR') {
            message.success();
            alert('Cập nhật hình thức thành công!');
            resetForm();
            setShowModal(false);
        }
        if (isError || isErrorUpdate || isErrorDelete) {
            message.error();
        }
    }, [isSuccess, isError, isSuccessUpdate, isErrorUpdate, isSuccessDelete, isErrorDelete, data?.status]);

    // Mở modal để thêm hình thức
    const handleAddFormat = () => {
        setShowModal(true);
        setSelectedFormat(null);
    };

    // Mở modal để sửa hình thức
    const handleEditFormat = (format) => {
        setName(format.name);
        setNote(format.note);
        setSelectedFormat(format);
        setShowModal(true);
    };

    // Xử lý lưu hình thức
    const onSave = async () => {
       if (validateForm()) {
            const dataToSave = { name, note };
            if (selectedFormat) {
                dataToSave.id = selectedFormat._id;
                updateMutation.mutate(dataToSave); // Cập nhật hình thức
            } else {
                addMutation.mutate(dataToSave); // Thêm mới hình thức
            }
        }
    };

    // Hủy thao tác thêm hoặc sửa hình thức
    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    // Xử lý xóa hình thức
    const handleDeleteFormat = (formatId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa hình thức này không?`)) {
            deleteMutation.mutate(formatId);
        }
    };

    const handleOnChange = (value) => {
            setSearchTerm(value);
        };
    
        useEffect(() => {
                if (formats) {
                    setFilteredFormat(
                        formats.filter(format => format.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }
            }, [searchTerm, formats]);
    

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên hình thức"
                            enable = {true}
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
                            <th scope="col" style={{ width: '10%' }}>Hành động</th>
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
                                    <td>{format._id}</td>
                                    <td>{format.name}</td>
                                    <td>{format.note}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditFormat(format)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteFormat(format._id)}
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
                        />
                        <FormComponent
                            id="noteUnitInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                        />
                        {/* Hiển thị lỗi nếu có */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
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
                textButton1={selectedFormat ? "Cập nhật" : "Thêm"}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default FormSubTab;
