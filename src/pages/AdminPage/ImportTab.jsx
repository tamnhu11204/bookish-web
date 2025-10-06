import React, { useState, useEffect } from 'react';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ImportService from '../../services/ImportService';
import * as message from "../../components/MessageComponent/MessageComponent";
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImportDetails from './ImportDetailTab';
import AddImport from './AddImportTab';
import DeleteImportModal from './DeleteImportModal';
import * as XLSX from 'xlsx';
import './Import.css';
import SupplierSubTab from './SupplierSubTab';

const ImportTab = () => {
    const [imports, setImports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedImportId, setSelectedImportId] = useState(null);
    const [selectedImportData, setSelectedImportData] = useState(null);

    // Lấy danh sách nhập hàng
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
        setSelectedImportData(importItem);
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

    // Xử lý nhập từ Excel
    const handleImportExcel = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Kiểm tra cấu trúc Excel
                if (!jsonData.length || !jsonData[0].productId || !jsonData[0].quantity || !jsonData[0].importPrice) {
                    message.error('File Excel không đúng định dạng! Cần cột: productId, name, quantity, importPrice, imageUrl.');
                    return;
                }

                // Chuẩn bị FormData
                const fd = new FormData();
                fd.append('products', JSON.stringify(jsonData));
                fd.append('importDate', new Date().toISOString());
                // Giả định supplier mặc định hoặc lấy từ form khác
                fd.append('supplier', JSON.stringify({ name: 'Default Supplier', img: '' }));

                try {
                    const response = await ImportService.createImport(fd);
                    if (response.status === 'OK') {
                        message.success('Nhập hàng từ Excel thành công!');
                        setImports([...imports, response.data]);
                    } else {
                        message.error('Có lỗi khi nhập hàng từ Excel!');
                    }
                } catch (error) {
                    message.error('Lỗi khi nhập hàng từ Excel: ' + error.message);
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            message.error('Lỗi khi đọc file Excel: ' + error.message);
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
        <div className="import-tab-container">
            <div className="title-section">
                <h3>NHẬP HÀNG</h3>
            </div>

            <SupplierSubTab />

            <div className="action-section">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo thời gian hoặc nhà cung cấp"
                    enable={true}
                    onChange={handleSearchChange}
                />
                <div className="button-group">
                    <ButtonComponent
                        textButton="Nhập hàng"
                        icon={<i className="bi bi-plus-circle"></i>}
                        onClick={handleAddImport}
                    />
                    <label className="excel-button">
                        <i className="bi bi-file-earmark-excel"></i> Nhập từ Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportExcel}
                            hidden
                        />
                    </label>
                </div>
            </div>

            <div className="table-section">
                <table className="table custom-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Hình ảnh</th>
                            <th>Nhà cung cấp</th>
                            <th>Ngày nhập hàng</th>
                            <th>Tổng số tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <div className="spinner"></div>
                                </td>
                            </tr>
                        ) : filteredImports.length > 0 ? (
                            filteredImports.map((importItem) => (
                                <tr key={importItem._id}>
                                    <td>{importItem._id.slice(-6)}</td>
                                    <td>
                                        <img
                                            src={importItem.supplier?.img || 'https://placehold.co/50x50'}
                                            alt={importItem.supplier?.name || 'Nhập hàng'}
                                            className="supplier-img"
                                        />
                                    </td>
                                    <td>{importItem.supplier?.name || 'Không xác định'}</td>
                                    <td>{new Date(importItem.importDate).toLocaleDateString('vi-VN')}</td>
                                    <td>{importItem.totalImportPrice.toLocaleString('vi-VN')}đ</td>
                                    <td>
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => handleViewImportDetails(importItem)}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
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