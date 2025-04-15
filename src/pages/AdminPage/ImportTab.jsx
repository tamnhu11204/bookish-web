import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImportDetails from './ImportDetailTab';
import AddImport from './AddImportTab';
import DeleteImportModal from './DeleteImportModal'; // Import modal mới
import * as ImportService from '../../services/ImportService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";

const ImportTab = () => {
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add', 'details', hoặc 'delete'
    const [selectedImportId, setSelectedImportId] = useState(null);
    const [selectedImportData, setSelectedImportData] = useState(null); // Dữ liệu của lần nhập hàng được chọn để xóa

    // Lấy danh sách nhập hàng từ backend
    useEffect(() => {
        const fetchImports = async () => {
            try {
                const response = await ImportService.getAllImports();
                if (response.status === 'OK') {
                    setImports(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching imports:', error);
                setLoading(false);
            }
        };
        fetchImports();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType(null);
        setSelectedImportId(null);
        setSelectedImportData(null);
    };

    const handleAddImport = () => {
        setModalType('add');
        setShowModal(true);
    };

    const handleViewImportDetails = (importItem) => {
        setSelectedImportId(importItem._id);
        setModalType('details');
        setShowModal(true);
    };

    // Xử lý xóa lần nhập hàng
    const mutationDelete = useMutationHook((id) => ImportService.deleteImport(id));

    const handleDeleteImport = (importItem) => {
        setSelectedImportData(importItem); // Lưu dữ liệu của lần nhập hàng để hiển thị trong modal
        setModalType('delete');
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await mutationDelete.mutateAsync(selectedImportData._id);
            if (mutationDelete.isSuccess && mutationDelete.data?.status === 'OK') {
                message.success('Xóa lần nhập hàng thành công!');
                setImports(imports.filter(item => item._id !== selectedImportData._id));
            } else {
                message.error('Có lỗi xảy ra khi xóa lần nhập hàng!');
            }
            handleCloseModal();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa lần nhập hàng!');
            handleCloseModal();
        }
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const filteredImports = imports.filter((importItem) =>
        importItem.importDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        importItem.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (showModal === false) return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ NHẬP HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo thời gian hoặc nhà cung cấp"
                            enable={true}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Nhập hàng"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddImport}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '15%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Nhà cung cấp</th>
                            <th scope="col" style={{ width: '30%' }}>Ngày nhập hàng</th>
                            <th scope="col" style={{ width: '15%' }}>Tổng số tiền</th>
                            <th scope="col" style={{ width: '10%' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">Đang tải...</td>
                            </tr>
                        ) : filteredImports.length > 0 ? (
                            filteredImports.map((importItem) => (
                                <tr key={importItem._id}>
                                    <td>{importItem._id.slice(-6)}</td>
                                    <td>
                                        <img
                                            src={importItem.supplier?.img || 'https://placehold.co/50x50'}
                                            alt={importItem.supplier?.name || 'Nhập hàng'}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{importItem.supplier?.name || 'Không xác định'}</td>
                                    <td>{new Date(importItem.importDate).toLocaleDateString('vi-VN')}</td>
                                    <td>{importItem.totalImportPrice.toLocaleString('vi-VN')}đ</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleViewImportDetails(importItem)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteImport(importItem)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Không có dữ liệu nhập hàng</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (modalType === 'details') return (
        <ImportDetails
            isOpen={showModal}
            importId={selectedImportId}
            onCancel={handleCloseModal}
        />
    );

    if (modalType === 'add') return (
        <AddImport
            isOpen={showModal}
            type={true}
            onCancel={handleCloseModal}
        />
    );

    if (modalType === 'delete') return (
        <DeleteImportModal
            isOpen={showModal}
            importData={selectedImportData}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseModal}
        />
    );
};

export default ImportTab;