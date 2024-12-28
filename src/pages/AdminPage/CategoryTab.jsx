import React, {useEffect, useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as CategoryService from '../../services/CategoryService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

const CatagoryTab = () => {
    

    // State quản lý modal
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
     const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(null);
    const [textButton1, setTextButton1] = useState(''); // Nút Lưu/Cập nhật
     const queryClient = useQueryClient(); // Get query client for manual cache updates
  


    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);

    const resetForm = () => {
        setName('');
        setNote('');
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage(""); // Clear error if valid
        return true;
    };

    const addMutation = useMutationHook(data => CategoryService.addCategory(data));
        const updateMutation = useMutationHook(data => CategoryService.updateCategory(selectedCategory._id, data));
        const deleteMutation = useMutationHook(data => CategoryService.deleteCategory(selectedCategory._id));
    
        const getAllCategory = async () => {
            const res = await CategoryService.getAllCategory();
            return res.data;
        };
    
        const { isLoading: isLoadingCategory, data: categories } = useQuery({
            queryKey: ['categories'],
            queryFn: getAllCategory,
        });
    
        const { data, isSuccess, isError } = addMutation;
        const { isSuccess: isSuccessUpdate, isError: isErrorUpdate } = updateMutation;
        const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;
    
        useEffect(() => {
            if (isSuccess && data?.status !== 'ERR') {
                message.success();
                alert('Thêm danh mục mới thành công!');
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categories']); // Invalidate the cache to refetch categories
            }
            if (isSuccessUpdate && data?.status !== 'ERR') {
                message.success();
                alert('Cập nhật danh mục thành công!');
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categories']); // Invalidate the cache to refetch categories
            }
            if (isError || isErrorUpdate || isErrorDelete) {
                message.error();
            }
        }, [isSuccess, isError, isSuccessUpdate, isErrorUpdate, isSuccessDelete, isErrorDelete, data?.status, queryClient]);
    
        const handleAddCategory = () => {
            resetForm();
            setShowModal(true);
            setSelectedCategory(null);
        };
    
        const handleEditCategory = (category) => {
            setName(category.name);
            setNote(category.note);
            setSelectedCategory(category);
            setShowModal(true);
        };
    
        const handleDeleteCategory = (category) => {
            if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`)) {
                deleteMutation.mutate(category._id);
            }
        };
    
        const onSave = async () => {
            if (validateForm()) {
                const dataToSave = { name, note };
                if (selectedCategory) {
                    dataToSave.id = selectedCategory._id;
                    updateMutation.mutate(dataToSave); // Update category
                } else {
                    addMutation.mutate(dataToSave); // Add new category
                }
            }
        };
    
        const onCancel = () => {
            resetForm();
            setShowModal(false);
        };
    

    const handleCloseModal = () => {
        setShowModal(false);
    };

    

    
    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH MỤC SẢN PHẨM</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên danh mục"
                        />
                    </div>

                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm danh mục"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddCategory}
                        />
                    </div>
                </div>

                <table className="table custom-table" style={{marginTop:'30px'}}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '10%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên danh mục</th>
                            <th scope="col" style={{ width: '30%' }}>Mô tả</th>
                            <th scope="col" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingCategory ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category._id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.note}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteCategory(category)}
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

            <ModalComponent
                isOpen={showModal}
                title={selectedCategory ? "CẬP NHẬT DANH MỤC" : "THÊM DANH MỤC"}
                body={
                    <>
                        <FormComponent
                            id="nameCategoryInput"
                            label="Tên danh mục"
                            type="text"
                            placeholder="Nhập tên danh mục"
                            value={name}
                            onChange={handleOnChangeName}
                            required={true}
                        />
                        <FormComponent
                            id="noteCategoryInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                        />
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", }}>
                            {errorMessage && (
                                <div style={{ color: "red", textAlign: "center", marginBottom: "10px", fontSize: "16px" }}>
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </>
                }
                textButton1={selectedCategory ? "Cập nhật" : "Thêm"}
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default CatagoryTab;
