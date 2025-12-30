import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import FormComponent from '../../components/FormComponent/FormComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import './AdminPage.css';

import { useMutationHook } from "../../hooks/useMutationHook";
import * as SupplierService from '../../services/OptionService/SupplierService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const SupplierSubTab = () => {
    // State chung
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState(null);
    const [id, setID] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const queryClient = useQueryClient();

    // Mutation
    const mutation = useMutationHook(data => SupplierService.addSupplier(data));
    const mutationEdit = useMutationHook(data => SupplierService.updateSupplier(id, data));
    const mutationDelete = useMutationHook(() => SupplierService.deleteSupplier(id));

    const { data, isSuccess, isError } = mutation;
    const { data: editData, isSuccess: isEditSuccess, isError: isEditError } = mutationEdit;
    const { data: deleteData, isSuccess: isDeleteSuccess, isError: isDeleteError } = mutationDelete;

    // Query lấy danh sách supplier
    const getAllSupplier = async () => {
        const res = await SupplierService.getAllSupplier();
        return res.data;
    };

    const { isLoading: isLoadingSupplier, data: suppliers = [] } = useQuery({
        queryKey: ['suppliers'],
        queryFn: getAllSupplier,
    });

    // Tìm kiếm
    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

    // Tạo danh sách số trang thông minh (1 2 ... 5 6 7 ... 9 10)
    const generatePageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2);
            if (currentPage > 4) pages.push('...');
            const start = Math.max(3, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages - 1, totalPages);
        }
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    // Reset form
    const resetForm = () => {
        setName('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
        setID('');
    };

    // Xử lý upload ảnh
    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Thêm supplier
    const onSave = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("note", note);
        if (img instanceof File) formData.append("img", img);
        mutation.mutate(formData);
    };

    // Cập nhật supplier
    const onSave2 = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("note", note);
        if (img instanceof File) {
            formData.append("img", img);
        } else if (typeof img === "string" && img.startsWith("http")) {
            formData.append("existingImg", img);
        }
        mutationEdit.mutate(formData);
    };

    // Xóa supplier
    const onDelete = () => {
        mutationDelete.mutate();
    };

    // Effect thông báo thành công/thất bại
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success('Thêm nhà cung cấp thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['suppliers']);
        } else if (isError) {
            message.error(data?.message || 'Có lỗi xảy ra');
        }
    }, [isSuccess, isError, data, queryClient]);

    useEffect(() => {
        if (isEditSuccess && editData?.status !== 'ERR') {
            message.success('Cập nhật thành công!');
            resetForm();
            setEditModal(false);
            queryClient.invalidateQueries(['suppliers']);
        } else if (isEditError) {
            message.error(editData?.message || 'Có lỗi xảy ra');
        }
    }, [isEditSuccess, isEditError, editData, queryClient]);

    useEffect(() => {
        if (isDeleteSuccess && deleteData?.status !== 'ERR') {
            message.success('Xóa thành công!');
            resetForm();
            queryClient.invalidateQueries(['suppliers']);
            // Nếu xóa hết item ở trang cuối → lùi về trang trước
            if (currentSuppliers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } else if (isDeleteError) {
            message.error('Xóa thất bại');
        }
    }, [isDeleteSuccess, isDeleteError, deleteData, queryClient, currentSuppliers.length, currentPage]);

    // Các handler
    const handleAddSupplier = () => setShowModal(true);

    const handleEditSupplier = (supplier) => {
        setEditModal(true);
        setID(supplier._id);
        setName(supplier.name);
        setNote(supplier.note || '');
        setImage(supplier.img || null);
        setPreviewImage(supplier.img || null);
    };

    const handleDeleteSupplier = (supplier) => {
        setID(supplier._id);
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.name}"?`)) {
            onDelete();
        }
    };

    const handleOnChangeSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset về trang 1 khi search
    };

    return (
        <div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà cung cấp"
                            enable={true}
                            onChange={handleOnChangeSearch}
                            value={searchTerm}
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

                {/* Bảng supplier */}
                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '10%' }}>Hình ảnh</th>
                            <th scope="col" style={{ width: '25%' }}>Tên nhà cung cấp</th>
                            <th scope="col" style={{ width: '30%' }}>Ghi chú</th>
                            <th scope="col" style={{ width: '15%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingSupplier ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : currentSuppliers.length > 0 ? (
                            currentSuppliers.map((supplier) => (
                                <tr key={supplier._id}>
                                    <td>{supplier._id}</td>
                                    <td>
                                        <img
                                            src={supplier.img || "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"}
                                            alt={supplier.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    </td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.note || '*'}</td>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination custom */}
                {totalPages > 1 && (
                    <div className="pagination-category d-flex justify-content-center gap-2 mt-4" style={{ marginBottom: "40px" }}>
                        {currentPage > 1 && (
                            <ButtonComponent2
                                textButton="Trước"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            />
                        )}

                        {pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return <ButtonComponent2 key={`ellipsis-${index}`} textButton="..." disabled />;
                            }
                            const isActive = currentPage === page;
                            return isActive ? (
                                <ButtonComponent
                                    key={page}
                                    textButton={String(page)}
                                    onClick={() => setCurrentPage(page)}
                                />
                            ) : (
                                <ButtonComponent2
                                    key={page}
                                    textButton={String(page)}
                                    onClick={() => setCurrentPage(page)}
                                />
                            );
                        })}

                        {currentPage < totalPages && (
                            <ButtonComponent2
                                textButton="Tiếp theo"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Modal Thêm */}
            <ModalComponent
                isOpen={showModal}
                title="THÊM NHÀ CUNG CẤP"
                body={
                    <>
                        <FormComponent label="Tên nhà cung cấp" type="text" value={name} onChange={setName} enable={true} />
                        <FormComponent label="Ghi chú" type="text" value={note} onChange={setNote} enable={true} />
                        <div className="mb-3">
                            <label className="form-label">Hình ảnh</label>
                            <input type="file" className="form-control" onChange={handleChangeImg} accept="image/*" />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-3" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                            )}
                        </div>
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={() => { setShowModal(false); resetForm(); }}
            />

            {/* Modal Sửa */}
            <ModalComponent
                isOpen={editModal}
                title="CẬP NHẬT NHÀ CUNG CẤP"
                body={
                    <>
                        <FormComponent label="Tên nhà cung cấp" type="text" value={name} onChange={setName} enable={true} />
                        <FormComponent label="Ghi chú" type="text" value={note} onChange={setNote} enable={true} />
                        <div className="mb-3">
                            <label className="form-label">Hình ảnh (chọn lại nếu muốn thay đổi)</label>
                            <input type="file" className="form-control" onChange={handleChangeImg} accept="image/*" />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-3" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                            )}
                        </div>
                    </>
                }
                textButton1="Lưu"
                onClick1={onSave2}
                onClick2={() => { setEditModal(false); resetForm(); }}
            />
        </div>
    );
};

export default SupplierSubTab;