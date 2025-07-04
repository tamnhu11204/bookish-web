import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as CategoryService from '../../services/CategoryService';
import './AdminPage.css';

const CatagoryTab = () => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [img, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [parentId, setParentId] = useState(null);
    const [slug, setSlug] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const queryClient = useQueryClient();

    // Lấy danh mục dạng cây
    const { isLoading: isLoadingCategory, data: categoryTree, error: categoryError } = useQuery({
        queryKey: ['categoryTree'],
        queryFn: async () => {
            const res = await CategoryService.getTreeCategory();
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (categoryError) toast.error(categoryError.message);
    }, [categoryError]);

    // Hàm tạo slug
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Kiểm tra vòng lặp danh mục
    const isCircularReference = (categoryId, parentId, categories) => {
        if (!parentId || !categoryId) return false;
        let currentId = parentId;
        while (currentId) {
            if (currentId === categoryId) return true;
            const parentCat = categories.find((cat) => cat._id === currentId);
            currentId = parentCat?.parent || null;
        }
        return false;
    };

    // Xử lý sự kiện
    const handleOnChangeName = (value) => {
        setName(value);
        setSlug(generateSlug(value));
    };

    const handleOnChangeNote = (value) => setNote(value);

    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Chỉ hỗ trợ file ảnh!');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage('Ảnh không được lớn hơn 5MB!');
                return;
            }
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    const resetForm = () => {
        setName('');
        setSlug('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
        setParentId(null);
        setSelectedCategory(null);
        setErrorMessage('');
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage('Vui lòng nhập tên danh mục!');
            return false;
        }
        if (!selectedCategory && !img) {
            setErrorMessage('Vui lòng chọn ảnh danh mục!');
            return false;
        }
        return true;
    };

    const addMutation = useMutation({
        mutationFn: (data) => {
            setIsProcessing(true);
            return CategoryService.addCategory(data);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                toast.success('Thêm danh mục thành công!');
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categoryTree']);
            } else {
                toast.error(response.message || 'Thêm danh mục thất bại!');
            }
        },
        onError: (error) => {
            setIsProcessing(false);
            toast.error(error.message || 'Có lỗi xảy ra!');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => {
            setIsProcessing(true);
            return CategoryService.updateCategory(id, formData);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                toast.success('Cập nhật danh mục thành công!');
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categoryTree']);
            } else {
                toast.error(response.message || 'Cập nhật danh mục thất bại!');
            }
        },
        onError: (error) => {
            setIsProcessing(false);
            toast.error(error.message || 'Có lỗi xảy ra!');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => {
            setIsProcessing(true);
            return CategoryService.deleteCategory(id);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                toast.success('Xóa danh mục thành công!');
                queryClient.invalidateQueries(['categoryTree']);
            } else {
                toast.error(response.message || 'Xóa danh mục thất bại!');
            }
        },
        onError: (error) => {
            setIsProcessing(false);
            toast.error(error.message || 'Có lỗi xảy ra!');
        },
    });

    const handleAddCategory = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setName(category.name);
        setSlug(category.slug || '');
        setNote(category.note || '');
        setImage(null);
        setPreviewImage(category.img || null);
        setParentId(category.parent || '');
        setSelectedCategory(category);
        setShowModal(true);
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(categoryToDelete._id);
        setShowDeleteModal(false);
    };

    const onSave = () => {
        if (!validateForm()) return;
        if (selectedCategory && isCircularReference(selectedCategory._id, parentId, categoryTree)) {
            setErrorMessage('Không thể chọn danh mục cha tạo vòng lặp!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('note', note);
        if (img instanceof File) {
            formData.append('img', img);
        } else if (previewImage) {
            formData.append('existingImg', previewImage);
        }
        formData.append('parent', parentId || null);

        // Debug: Log FormData entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        if (selectedCategory) {
            updateMutation.mutate({ id: selectedCategory._id, formData });
        } else {
            addMutation.mutate(formData);
        }
    };

    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };

    const handleOnChange = (value) => {
        setSearchTerm(value);
    };

    // Hiển thị danh mục dạng cây
    const renderCategoryTree = (categories, level = 0) => {
        return categories
            .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((cat) => (
                <React.Fragment key={cat._id}>
                    <tr>
                        <td style={{ paddingLeft: `${level * 20}px` }}>{cat.code}</td>
                        <td>
                            <img
                                src={cat.img}
                                alt={cat.name}
                                style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                            />
                        </td>
                        <td title={cat.name}>
                            {cat.name.length > 20 ? cat.name.slice(0, 20) + '...' : cat.name}
                        </td>
                        <td>{cat.parent ? categoryTree.find((c) => c._id === cat.parent)?.name || 'Đang tải...' : 'Không có'}</td>
                        <td title={cat.note}>
                            {cat.note && cat.note.length > 30 ? cat.note.slice(0, 30) + '...' : cat.note || 'Không có'}
                        </td>
                        <td>
                            <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEditCategory(cat)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCategory(cat)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                    {cat.children && renderCategoryTree(cat.children, level + 1)}
                </React.Fragment>
            ));
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
                            enable={true}
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
                            <th scope="col" style={{ width: '15%' }}>Mã</th>
                            <th scope="col" style={{ width: '15%' }}>Ảnh</th>
                            <th scope="col" style={{ width: '20%' }}>Tên danh mục</th>
                            <th scope="col" style={{ width: '20%' }}>Danh mục cha</th>
                            <th scope="col" style={{ width: '20%' }}>Mô tả</th>
                            <th scope="col" style={{ width: '15%' }}>Sửa/Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingCategory ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : categoryTree?.length > 0 ? (
                            renderCategoryTree(categoryTree)
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComponent
                isOpen={showModal}
                title={selectedCategory ? 'CẬP NHẬT DANH MỤC' : 'THÊM DANH MỤC'}
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
                            enable={true}
                        />
                        <FormComponent
                            id="slugCategoryInput"
                            label="Slug"
                            type="text"
                            placeholder="Slug tự động hoặc tự nhập"
                            value={slug}
                            onChange={(value) => setSlug(generateSlug(value))}
                            enable={true}
                        />
                        <FormComponent
                            id="noteCategoryInput"
                            label="Ghi chú"
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={note}
                            onChange={handleOnChangeNote}
                            enable={true}
                        />
                        <FormSelectComponent
                            id="parentCategorySelect"
                            label="Danh mục cha"
                            type="select"
                            options={[
                                { value: null, label: 'Không có' },
                                ...(categoryTree
                                    ?.filter((cat) => !selectedCategory || cat._id !== selectedCategory._id)
                                    .map((cat) => ({ value: cat._id, label: cat.name })) || []),
                            ]}
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            enable={true}
                        />
                        <div className="mb-3">
                            <input
                                type="file"
                                onChange={handleChangeImg}
                                accept="image/*"
                                required={!selectedCategory}
                            />
                            <div className="news__image">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="product-preview"
                                        style={{
                                            width: '36rem',
                                            height: '40rem',
                                            borderRadius: '15px',
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        {errorMessage && (
                            <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px', fontSize: '16px' }}>
                                {errorMessage}
                            </div>
                        )}
                    </>
                }
                textButton1={selectedCategory ? 'Cập nhật' : 'Thêm'}
                onClick1={onSave}
                onClick2={onCancel}
                isLoading={isProcessing}
            />
            <ModalComponent
                isOpen={showDeleteModal}
                title="Xác nhận xóa"
                body={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không?`}
                textButton1="Xóa"
                onClick1={confirmDelete}
                onClick2={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default CatagoryTab;