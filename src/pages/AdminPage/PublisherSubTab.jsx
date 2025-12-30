import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as PublisherService from '../../services/OptionService/PublisherService';
import './AdminPage.css';

const PublisherSubTab = () => {
    const queryClient = useQueryClient();

    // State chung
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [img, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [id, setID] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mutation
    const mutation = useMutationHook(data => PublisherService.addPublisher(data));
    const mutationEdit = useMutationHook(data => PublisherService.updatePublisher(id, data));
    const mutationDelete = useMutationHook(() => PublisherService.deletePublisher(id));

    const { data, isSuccess, isError } = mutation;
    const { data: editData, isSuccess: isEditSuccess, isError: isEditError } = mutationEdit;
    const { isSuccess: isDeleteSuccess, isError: isDeleteError } = mutationDelete;

    // Query lấy danh sách
    const getAllPublisher = async () => {
        const res = await PublisherService.getAllPublisher();
        return res.data || [];
    };

    const { isLoading: isLoadingPublisher, data: publishers = [] } = useQuery({
        queryKey: ['publishers'],
        queryFn: getAllPublisher,
    });

    // Tìm kiếm + phân trang
    const filteredPublishers = publishers.filter(publisher =>
        publisher.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPublishers = filteredPublishers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);

    // Tạo số trang thông minh
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

    // Reset trang khi tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Xử lý ảnh
    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setName('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
        setID('');
    };

    // Thêm
    const onSave = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("note", note);
        if (img instanceof File) formData.append("img", img);
        mutation.mutate(formData);
    };

    // Sửa
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

    // Xóa
    const onDelete = () => {
        mutationDelete.mutate();
    };

    // Effect thông báo + refetch
    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            message.success('Thêm nhà xuất bản thành công!');
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['publishers']);
        } else if (isError) {
            message.error(data?.message || 'Thêm thất bại');
        }
    }, [isSuccess, isError, data, queryClient]);

    useEffect(() => {
        if (isEditSuccess && editData?.status !== 'ERR') {
            message.success('Cập nhật thành công!');
            resetForm();
            setEditModal(false);
            queryClient.invalidateQueries(['publishers']);
        } else if (isEditError) {
            message.error(editData?.message || 'Cập nhật thất bại');
        }
    }, [isEditSuccess, isEditError, editData, queryClient]);

    useEffect(() => {
        if (isDeleteSuccess) {
            message.success('Xóa thành công!');
            queryClient.invalidateQueries(['publishers']);
            if (currentPublishers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } else if (isDeleteError) {
            message.error('Xóa thất bại');
        }
    }, [isDeleteSuccess, isDeleteError, queryClient, currentPublishers.length, currentPage]);

    // Handler
    const handleAddPublisher = () => setShowModal(true);

    const handleEditPublisher = (publisher) => {
        setEditModal(true);
        setID(publisher._id);
        setName(publisher.name || '');
        setNote(publisher.note || '');
        setImage(publisher.img || null);
        setPreviewImage(publisher.img || null);
    };

    const handleDeletePublisher = (publisher) => {
        setID(publisher._id);
        if (window.confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${publisher.name}"?`)) {
            onDelete();
        }
    };

    return (
        <div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                {/* Tìm kiếm + Thêm */}
                <div className="row align-items-center mb-4">
                    <div className="col-6">
                        <FormComponent
                            type="text"
                            placeholder="Tìm kiếm theo tên nhà xuất bản..."
                            value={searchTerm}
                            onChange={setSearchTerm}
                            enable={true}
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

                {/* Bảng */}
                <table className="table custom-table">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '15%' }}>Mã</th>
                            <th style={{ width: '20%' }}>Hình ảnh</th>
                            <th style={{ width: '25%' }}>Tên nhà xuất bản</th>
                            <th style={{ width: '25%' }}>Ghi chú</th>
                            <th style={{ width: '15%' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingPublisher ? (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : currentPublishers.length > 0 ? (
                            currentPublishers.map((publisher) => (
                                <tr key={publisher._id}>
                                    <td>{publisher.code || publisher._id}</td>
                                    <td>
                                        <img
                                            src={publisher.img || "https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"}
                                            alt={publisher.name}
                                            style={{
                                                width: '80px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </td>
                                    <td>{publisher.name}</td>
                                    <td>{publisher.note || 'Không có'}</td>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-category d-flex justify-content-center gap-2 mt-4 mb-5">
                        {currentPage > 1 && (
                            <ButtonComponent2
                                textButton="Trước"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            />
                        )}

                        {pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return <ButtonComponent2 key={`ellipsis-${index}`} textButton="..." disabled />;
                            }
                            return currentPage === page ? (
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
                                textButton="Tiếp"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Modal Thêm */}
            <ModalComponent
                isOpen={showModal}
                title="THÊM NHÀ XUẤT BẢN"
                body={
                    <>
                        <FormComponent label="Tên nhà xuất bản" type="text" value={name} onChange={setName} />
                        <FormComponent label="Ghi chú" type="text" value={note} onChange={setNote} />
                        <div className="mb-3">
                            <label className="form-label">Hình ảnh</label>
                            <input type="file" className="form-control" onChange={handleChangeImg} accept="image/*" />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-3" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                            )}
                        </div>
                        {data?.status === 'ERR' && <div className="text-danger">{data.message}</div>}
                    </>
                }
                textButton1="Thêm"
                onClick1={onSave}
                onClick2={() => { setShowModal(false); resetForm(); }}
            />

            {/* Modal Sửa */}
            <ModalComponent
                isOpen={editModal}
                title="CẬP NHẬT NHÀ XUẤT BẢN"
                body={
                    <>
                        <FormComponent label="Tên nhà xuất bản" type="text" value={name} onChange={setName} />
                        <FormComponent label="Ghi chú" type="text" value={note} onChange={setNote} />
                        <div className="mb-3">
                            <label className="form-label">Hình ảnh (chọn lại nếu muốn thay đổi)</label>
                            <input type="file" className="form-control" onChange={handleChangeImg} accept="image/*" />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-3" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }} />
                            )}
                        </div>
                        {editData?.status === 'ERR' && <div className="text-danger">{editData.message}</div>}
                    </>
                }
                textButton1="Lưu"
                onClick1={onSave2}
                onClick2={() => { setEditModal(false); resetForm(); }}
            />
        </div>
    );
};

export default PublisherSubTab;