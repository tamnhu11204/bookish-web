import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ImportDetails from './ImportDetailTab';
import AddImport from './AddImportTab';
import * as ImportService from '../../services/ImportService'; // Import service cho nhập hàng

const ImportTab = () => {
    const [imports, setImports] = useState([]); // State lưu danh sách nhập hàng
    const [loading, setLoading] = useState(true); // State quản lý trạng thái tải dữ liệu
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState('');
    const [onSave, setOnSave] = useState(() => () => {});
    const [onCancel, setOnCancel] = useState(() => () => {});
    const [type, setType] = useState(false);
    const [selectedImportId, setSelectedImportId] = useState(null); // State lưu ID nhập hàng được chọn

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
        setSelectedImportId(null); // Reset ID khi đóng modal
    };

    // Hàm mở modal thêm nhập hàng
    const handleAddImport = () => {
        setModalTitle('THÊM NHẬP HÀNG');
        setType(true);
        setShowModal(true);
    };

    // Hàm mở modal chi tiết nhập hàng
    const handleViewImportDetails = (importItem) => {
        setSelectedImportId(importItem._id); // Lưu ID của lần nhập hàng
        setModalTitle('CHI TIẾT NHẬP HÀNG');
        setType(false);
        setShowModal(true);
    };

    // Hàm xử lý tìm kiếm
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Lọc danh sách nhập hàng theo tìm kiếm
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
                            <th scope="col" style={{ width: '10%' }}></th>
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
                                    <td>{importItem._id.slice(-6)}</td> {/* Hiển thị 6 ký tự cuối của _id */}
                                    <td>
                                        <img
                                            src={importItem.importItems[0]?.product?.image || 'https://via.placeholder.com/50'}
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

    if (type === false) return (
        <ImportDetails
            isOpen={showModal}
            importId={selectedImportId} // Truyền ID nhập hàng vào ImportDetails
            onCancel={handleCloseModal}
        />
    );

    if (type === true) return (
        <AddImport
            isOpen={showModal}
            type={type}
            onCancel={handleCloseModal}
        />
    );
};

export default ImportTab;