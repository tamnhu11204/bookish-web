import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as CategoryService from '../../services/CategoryService';
import './AdminPage.css';

const CatagoryTab = () => {
    // State quản lý modal và tìm kiếm
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [img, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState(null);
    const [parentId, setParentId] = useState('');
    const [slug, setSlug] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [parentCategories, setParentCategories] = useState({});

    const handleOnChangeName = (value) => {
        setName(value);
        setSlug(generateSlug(value));
    };

    const handleOnChangeNote = (value) => setNote(value);

    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            console.error("Không có file hợp lệ được chọn!");
        }
    };

    const resetForm = () => {
        setName('');
        setSlug('');
        setNote('');
        setImage(null);
        setPreviewImage(null);
        setSelectedCategory(null);
        setParentId('');
    };

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const validateForm = () => {
        if (!name) {
            setErrorMessage("Vui lòng nhập thông tin được yêu cầu!");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const getAllCategory = async () => {
        const res = await CategoryService.getAllCategory();
        return res.data;
    };

    const { isLoading: isLoadingCategory, data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategory,
    });

    useEffect(() => {
        console.log("Categories data:", categories);
        if (!categories) return;

        const fetchParentCategories = async () => {
            const parentData = {};
            for (const category of categories) {
                if (category.parent && !parentData[category.parent]) {
                    try {
                        const res = await CategoryService.getDetailCategory(category.parent);
                        parentData[category.parent] = res.data.name;
                    } catch (error) {
                        parentData[category.parent] = "Không có";
                    }
                }
            }
            console.log("Final parentData before setting state:", parentData);
            setParentCategories(parentData);
        };

        fetchParentCategories();
    }, [categories]);

    useEffect(() => {
        if (categories) {
            setFilteredCategories(
                categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    }, [searchTerm, categories]);

    const addMutation = useMutation({
        mutationFn: (data) => {
            setIsProcessing(true);
            return CategoryService.addCategory(data);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                alert("Thêm danh mục thành công!");
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categories']);
            } else {
                alert("Thêm danh mục thất bại!");
            }
        },
        onError: () => {
            setIsProcessing(false);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => {
            setIsProcessing(true);
            return CategoryService.updateCategory(id, formData);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                alert("Cập nhật danh mục thành công!");
                resetForm();
                setShowModal(false);
                queryClient.invalidateQueries(['categories']);
            } else {
                alert("Cập nhật danh mục thất bại!");
            }
        },
        onError: () => {
            setIsProcessing(false);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => {
            setIsProcessing(true);
            return CategoryService.deleteCategory(id);
        },
        onSuccess: (response) => {
            setIsProcessing(false);
            if (response.status !== 'ERR') {
                alert("Xóa danh mục thành công!");
                resetForm();
                queryClient.invalidateQueries(['categories']);
            } else {
                alert("Xóa danh mục thất bại!");
            }
        },
        onError: () => {
            setIsProcessing(false);
            alert("Có lỗi xảy ra khi xóa!");
        }
    });

    const handleAddCategory = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEditCategory = async (category) => {
        console.log('Editing category:', category);
        setName(category.name);
        setSlug(category.slug || '');
        setNote(category.note || '');
        setImage(null);
        setPreviewImage(category.img || null);
        const parentValue = category.parent || '';
        setParentId(parentValue);
        setSelectedCategory(category);
    
        if (category.parent) {
            try {
                const res = await CategoryService.getDetailCategory(category.parent);
                console.log('Parent category data:', res.data);
                if (res && res.data) {
                    setSelectedCategory({ ...category, parentName: res.data.name });
                } else {
                    setSelectedCategory({ ...category, parentName: 'Không có' });
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết danh mục:', error);
                setSelectedCategory({ ...category, parentName: 'Không có' });
            }
        } else {
            setSelectedCategory({ ...category, parentName: 'Không có' });
        }
    
        setShowModal(true);
    };

    const handleDeleteCategory = (category) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`)) {
            deleteMutation.mutate(category._id);
        }
    };

    const onSave = async () => {
        if (!validateForm()) return;
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug);
        formData.append("note", note);
        if (img instanceof File) {
            formData.append("img", img);
        } else if (typeof img === "string" && img.startsWith("http")) {
            formData.append("existingImg", img);
        }
    
        formData.append("parent", parentId || null);
    
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value} (type: ${typeof value})`);
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
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => {
                                // Tìm danh mục cha
                                return (
                                    <tr key={category._id}>
                                        <td>{category.code}</td>
                                        <td>
                                            <img
                                                src={category.img}
                                                alt={category.name}
                                                style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{category.name.length > 20 ? category.name.slice(0, 20) + '...' : category.name}</td>
                                        <td>
                                            {parentCategories[category.parent]
                                                ? parentCategories[category.parent]
                                                : (category.parent ? "Đang tải..." : "Không có")
                                            }
                                        </td>

                                        <td>{category.note && category.note.length > 30 ? category.note.slice(0, 30) + '...' : category.note || 'Không có'}</td>
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
                                );
                            })
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
                                { value: '', label: 'Không có' },
                                ...(categories
                                    ?.filter(cat => !cat.parent) // Chỉ lấy các danh mục không có parent
                                    .map(cat => ({ value: cat._id, label: cat.name })) || [])
                            ]}
                            value={parentId}
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                setParentId(selectedValue);
                            }}
                            enable={true}
                        />

                        <div className="mb-3">
                            <input
                                type="file"
                                onChange={handleChangeImg}
                                accept="image/*"
                                required
                            />
                            <div className="news__image">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="product-preview"
                                        style={{
                                            width: "36rem",
                                            height: "40rem",
                                            borderRadius: "15px"
                                        }}
                                    />
                                )}
                            </div>
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
                isLoading={isProcessing}
            />
        </div>
    );
};

export default CatagoryTab;