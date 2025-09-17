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

const CategoryTab = ({ selectedCategoryIdForFilter, onCategorySelect }) => {
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
    const [openedCategories, setOpenedCategories] = useState([]);
    const queryClient = useQueryClient();

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

    const generateSlug = (text) => {
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    };

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

    const toggleCategory = (categoryId) => {
        setOpenedCategories((prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]);
    };

    const handleSelectCategoryForFilter = (categoryId) => {
        if (selectedCategoryIdForFilter === categoryId) {
            onCategorySelect(null);
        } else {
            onCategorySelect(categoryId);
        }
    };

    const handleOnChangeName = (value) => { setName(value); setSlug(generateSlug(value)); };
    const handleOnChangeNote = (value) => setNote(value);
    const handleOnChangeSearch = (value) => setSearchTerm(value);

    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) { setErrorMessage('Chỉ hỗ trợ file ảnh!'); return; }
            if (file.size > 5 * 1024 * 1024) { setErrorMessage('Ảnh không được lớn hơn 5MB!'); return; }
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    const resetForm = () => {
        setName(''); setSlug(''); setNote(''); setImage(null); setPreviewImage(null); setParentId(null); setSelectedCategory(null); setErrorMessage('');
    };

    const validateForm = () => {
        if (!name.trim()) { setErrorMessage('Vui lòng nhập tên danh mục!'); return false; }
        if (!selectedCategory && !img) { setErrorMessage('Vui lòng chọn ảnh danh mục!'); return false; }
        return true;
    };

    const addMutation = useMutation({
        mutationFn: (data) => { setIsProcessing(true); return CategoryService.addCategory(data); },
        onSuccess: (response) => { setIsProcessing(false); if (response.status !== 'ERR') { toast.success('Thêm danh mục thành công!'); resetForm(); setShowModal(false); queryClient.invalidateQueries(['categoryTree']); } else { toast.error(response.message || 'Thêm danh mục thất bại!'); } },
        onError: (error) => { setIsProcessing(false); toast.error(error.message || 'Có lỗi xảy ra!'); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => { setIsProcessing(true); return CategoryService.updateCategory(id, formData); },
        onSuccess: (response) => { setIsProcessing(false); if (response.status !== 'ERR') { toast.success('Cập nhật danh mục thành công!'); resetForm(); setShowModal(false); queryClient.invalidateQueries(['categoryTree']); } else { toast.error(response.message || 'Cập nhật danh mục thất bại!'); } },
        onError: (error) => { setIsProcessing(false); toast.error(error.message || 'Có lỗi xảy ra!'); },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => { setIsProcessing(true); return CategoryService.deleteCategory(id); },
        onSuccess: (response) => { setIsProcessing(false); if (response.status !== 'ERR') { toast.success('Xóa danh mục thành công!'); queryClient.invalidateQueries(['categoryTree']); } else { toast.error(response.message || 'Xóa danh mục thất bại!'); } },
        onError: (error) => { setIsProcessing(false); toast.error(error.message || 'Có lỗi xảy ra!'); },
    });

    const handleAddCategory = () => { resetForm(); setShowModal(true); };
    const handleEditCategory = (category) => { setName(category.name); setSlug(category.slug || ''); setNote(category.note || ''); setImage(null); setPreviewImage(category.img || null); setParentId(category.parent || null); setSelectedCategory(category); setShowModal(true); };
    const handleDeleteCategory = (category) => { setCategoryToDelete(category); setShowDeleteModal(true); };
    const confirmDelete = () => { deleteMutation.mutate(categoryToDelete._id); setShowDeleteModal(false); setCategoryToDelete(null); };
    const onCancel = () => { resetForm(); setShowModal(false); };

    const onSave = () => {
        if (!validateForm()) return;
        if (selectedCategory && isCircularReference(selectedCategory._id, parentId, categoryTree || [])) { setErrorMessage('Không thể chọn danh mục cha tạo vòng lặp!'); return; }
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('slug', slug);
        formData.append('note', note);
        if (img instanceof File) { formData.append('img', img); } else if (previewImage) { formData.append('existingImg', previewImage); }
        formData.append('parent', parentId || '');
        if (selectedCategory) { updateMutation.mutate({ id: selectedCategory._id, formData }); } else { addMutation.mutate(formData); }
    };

    const renderCategoryTree = (categories, level = 0) => {
        if (!categories) return null;
        return categories
            .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((cat) => (
                <div key={cat._id} style={{ marginLeft: `${level * 25}px`, marginBottom: '5px' }}>
                    <div className={`d-flex align-items-center justify-content-between p-2 rounded category-item ${selectedCategoryIdForFilter === cat._id ? 'selected' : ''}`} onClick={() => handleSelectCategoryForFilter(cat._id)} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                            {cat.children?.length > 0 && (<span onClick={(e) => { e.stopPropagation(); toggleCategory(cat._id); }} className="plus_minus me-2" style={{ fontWeight: 'bold' }}>{openedCategories.includes(cat._id) ? '−' : '+'}</span>)}
                            {cat.img && (<img src={cat.img} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }} onError={(e) => (e.target.src = '/default-image.png')} />)}
                            <span title={cat.name} className="text-truncate">{cat.name}</span>
                        </div>
                        <div className="ms-2">
                            <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}><i className="bi bi-pencil-square"></i></button>
                            <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}><i className="bi bi-trash"></i></button>
                        </div>
                    </div>
                    {cat.children && openedCategories.includes(cat._id) && (<div style={{ marginTop: '5px', marginLeft: '20px' }}>{renderCategoryTree(cat.children, level + 1)}</div>)}
                </div>
            ));
    };

    if (isLoadingCategory) return <LoadingComponent />;

    return (
        <div>
            <div className="title-section"><h3 className="text">DANH MỤC SẢN PHẨM</h3></div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col-md-6"><FormComponent id="searchInput" type="text" placeholder="Tìm kiếm theo tên danh mục" value={searchTerm} onChange={handleOnChangeSearch} enable={true} /></div>
                    <div className="col-md-6 text-end"><ButtonComponent textButton="Thêm danh mục" icon={<i className="bi bi-plus-circle"></i>} onClick={handleAddCategory} className="btn btn-success" /></div>
                </div>
                <div className="tree-view" style={{ marginTop: '20px' }}>{categoryTree?.length > 0 ? renderCategoryTree(categoryTree) : <div className="text-center text-muted">Không có dữ liệu danh mục.</div>}</div>
            </div>
            <ModalComponent isOpen={showModal} title={selectedCategory ? 'CẬP NHẬT DANH MỤC' : 'THÊM DANH MỤC'} body={<><FormComponent id="nameCategoryInput" label="Tên danh mục *" type="text" placeholder="Nhập tên danh mục" value={name} onChange={handleOnChangeName} required={true} enable={true} /><FormComponent id="slugCategoryInput" label="Slug" type="text" placeholder="Slug tự động hoặc tự nhập" value={slug} onChange={(value) => setSlug(generateSlug(value))} enable={true} /><FormComponent id="noteCategoryInput" label="Ghi chú" type="textarea" placeholder="Nhập ghi chú" value={note} onChange={handleOnChangeNote} enable={true} /><FormSelectComponent id="parentCategorySelect" label="Danh mục cha" type="select" options={[{ value: '', label: 'Không có' }, ...(categoryTree?.filter((cat) => !selectedCategory || cat._id !== selectedCategory._id).map((cat) => ({ value: cat._id, label: cat.name })) || [])]} value={parentId || ''} onChange={(e) => setParentId(e.target.value || null)} enable={true} /><div className="mb-3"><label className="form-label">Ảnh danh mục {selectedCategory ? '(Tùy chọn)' : '*'}</label><input type="file" className="form-control" onChange={handleChangeImg} accept="image/*" />{previewImage && (<img src={previewImage} alt="Preview" style={{ maxWidth: '150px', maxHeight: '150px', marginTop: '10px', borderRadius: '8px' }} />)}</div>{errorMessage && (<div className="alert alert-danger text-center">{errorMessage}</div>)}</>} textButton1={selectedCategory ? 'Cập nhật' : 'Thêm'} onClick1={onSave} textButton2="Hủy" onClick2={onCancel} isLoading={isProcessing} />
            <ModalComponent isOpen={showDeleteModal} title="XÁC NHẬN XÓA" body={`Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" không?`} textButton1="Xóa" onClick1={confirmDelete} textButton2="Hủy" onClick2={() => setShowDeleteModal(false)} variant="danger" />
        </div>
    );
};

export default CategoryTab;