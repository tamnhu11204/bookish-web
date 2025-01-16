import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as CategoryService from '../../services/CategoryService';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Compressor from 'compressorjs';

const CatagoryTab = () => {
    // State quản lý modal và tìm kiếm
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [img, setImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredCategories, setFilteredCategories] = useState([]); 
    const queryClient = useQueryClient(); 

    const handleOnChangeName = (value) => setName(value);
    const handleOnChangeNote = (value) => setNote(value);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success(result) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImage(reader.result); 
                    };
                    reader.readAsDataURL(result); 
                },
                error(err) {
                    console.error(err);
                }
            });
        }
    };

    const resetForm = () => {
        setName('');
        setNote('');
        setImage('');
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage(""); 
        return true;
    };

    const addMutation = useMutationHook(data => CategoryService.addCategory(data));
    const updateMutation = useMutationHook(data => {
        if (!selectedCategory) {
            return;
        }
        return CategoryService.updateCategory(selectedCategory._id, data);
    });
    const deleteMutation = useMutationHook(data => {
        if (!selectedCategory) {
            return;
        }
        return CategoryService.deleteCategory(selectedCategory._id);
    });

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
            message.success()
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['categories']);
        }
        if (isSuccessUpdate && data?.status !== 'ERR') {
            message.success()
            resetForm();
            setShowModal(false);
            queryClient.invalidateQueries(['categories']);
        }
        if (isSuccessDelete && data?.status !== 'ERR') {
            message.success("Xóa danh mục thành công!");
            resetForm();
            setSelectedCategory(null);
            queryClient.invalidateQueries(['categories']);
        }
        if (isError || isErrorUpdate || isErrorDelete) {
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }, [isSuccess, isError, isSuccessUpdate, isErrorUpdate, isSuccessDelete, isErrorDelete, data?.status, queryClient]);

    useEffect(() => {
        if (categories) {
            setFilteredCategories(
                categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, categories]);

    const handleAddCategory = () => {
        resetForm();
        setShowModal(true);
        setSelectedCategory(null);
    };

    const handleEditCategory = (category) => {
        setName(category.name);
        setNote(category.note);
        setImage(category.img || ''); 
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleDeleteCategory = (category) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`)) {
            setSelectedCategory(category);
            deleteMutation.mutate(); 
        }
    };

    const onSave = async () => {
        if (validateForm()) {
            const dataToSave = { name, note, img };
            if (selectedCategory) {
                dataToSave.id = selectedCategory._id;
                updateMutation.mutate(dataToSave);
            } else {
                addMutation.mutate(dataToSave); 
            }
        }
    };

    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };
    const handleOnChange = (value) => {
        setSearchTerm(value);
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
                            value={searchTerm}
                            onChange={handleOnChange}
                            enable = {true}
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

                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '20%' }}>Mã</th>
                            <th scope="col" style={{ width: '20%' }}>Tên danh mục</th>
                            <th scope="col" style={{ width: '30%' }}>Ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Mô tả</th>
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
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category._id}</td>
                                    <td>{category.name}</td>
                                    <td><img
                                            src={category.img}
                                            alt={category.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        /></td>
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
                            enable = {true}
                        />
                        <FormComponent
                            id="noteCategoryInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable = {true}
                        />
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                {img ? (
                                    <img src={img} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                ) : (
                                    <span className="text-muted">Chọn hình ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                className="form-control mt-2"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
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
