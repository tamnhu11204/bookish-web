import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import FormComponent from '../../components/FormComponent/FormComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as CategoryService from '../../services/CategoryService';
import * as ProductService from '../../services/ProductService';
import './AdminPage.css';
import AddProductForm from './ProductAdd';
import ProductDetailForm from './ProductEdit';
import { debounce } from 'lodash';

const getAllSubCategoryIds = (categories, parentId) => {
    const ids = new Set();
    if (!parentId || !categories) return [];

    const findChildrenRecursive = currentCategoryId => {
        ids.add(currentCategoryId);
        let categoryNode = null;
        const findNode = nodes => {
            for (const node of nodes) {
                if (node._id === currentCategoryId) {
                    categoryNode = node;
                    return;
                }
                if (node.children) findNode(node.children);
            }
        };
        findNode(categories);
        if (categoryNode?.children?.length > 0) {
            categoryNode.children.forEach(child => findChildrenRecursive(child._id));
        }
    };

    findChildrenRecursive(parentId);
    return Array.from(ids);
};

const ProductTab = ({ selectedCategoryId }) => {
    const [productID, setProductID] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Thêm state totalPages
    const itemsPerPage = 20;
    const queryClient = useQueryClient();

    const debouncedSetSearchTerm = debounce(setSearchTerm, 300);

    const { isLoading: isLoadingCategories, data: categories } = useQuery({
        queryKey: ['categoryTree'],
        queryFn: () => CategoryService.getTreeCategory().then(res => res.data),
        staleTime: 5 * 60 * 1000
    });

    const categoryNameMap = useMemo(() => {
        const map = {};
        if (!categories) return map;
        const flattenCategories = cats => {
            cats.forEach(cat => {
                map[cat._id] = cat.name;
                if (cat.children?.length > 0) flattenCategories(cat.children);
            });
        };
        flattenCategories(categories);
        return map;
    }, [categories]);

    const getFilteredProducts = async () => {
        const filters = {
            search: searchTerm,
            categories: selectedCategoryId ? getAllSubCategoryIds(categories, selectedCategoryId) : []
        };
        const params = new URLSearchParams({
            limit: itemsPerPage,
            page: currentPage,
            filters: JSON.stringify(filters)
        });
        const res = await ProductService.getAllProduct(`?${params.toString()}`);
        setTotalPages(res.totalPage); // Cập nhật totalPages từ API
        return res.data;
    };

    const { isLoading: isLoadingProduct, data: products } = useQuery({
        queryKey: ['products', currentPage, searchTerm, selectedCategoryId],
        queryFn: getFilteredProducts,
        staleTime: 5 * 60 * 1000
    });

    const paginatedProducts = products || []; // Dùng trực tiếp products từ API

    const maxVisible = 5;
    const pageNumbers = [];
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('...');
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        if (currentPage < totalPages - 2) pageNumbers.push('...');
        if (endPage < totalPages) pageNumbers.push(totalPages);
    }

    const paginationButtons = (
        <div className="pagination-category d-flex justify-content-center gap-2" style={{ marginBottom: "30px" }}>
            {currentPage > 1 && (
                <ButtonComponent2
                    textButton="Trước"
                    onClick={() => setCurrentPage(currentPage - 1)}
                />
            )}
            {pageNumbers.map((page, index) => {
                if (page === '...') {
                    return <ButtonComponent2
                        textButton={"..."}
                    />
                }
                const pageNumber = page;
                const isActive = currentPage === pageNumber;
                return isActive ? (
                    <ButtonComponent
                        key={pageNumber}
                        textButton={String(pageNumber)}
                        onClick={() => setCurrentPage(pageNumber)}
                    />
                ) : (
                    <ButtonComponent2
                        key={pageNumber}
                        textButton={String(pageNumber)}
                        onClick={() => setCurrentPage(pageNumber)}
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
    );

    const handleAddProduct = () => {
        setFormMode('add');
        setIsFormVisible(true);
    };

    const handleEditProduct = product => {
        setProductID(product._id);
        setFormMode('edit');
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false);
        setProductID('');
        queryClient.invalidateQueries(['products']);
    };

    const deleteMutation = useMutationHook(id => ProductService.softDeleteProduct(id));
    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = deleteMutation;

    React.useEffect(() => {
        if (isSuccessDelete) {
            toast.success('Xóa sản phẩm thành công!');
            queryClient.invalidateQueries(['products']);
        }
        if (isErrorDelete) {
            toast.error('Xóa sản phẩm thất bại!');
        }
    }, [isSuccessDelete, isErrorDelete, queryClient]);

    const handleDeleteProduct = product => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không?`)) {
            deleteMutation.mutate(product._id);
        }
    };

    if (isFormVisible) {
        if (formMode === 'add') {
            return <AddProductForm isOpen={true} onCancel={handleCloseForm} />;
        }
        if (formMode === 'edit') {
            return <ProductDetailForm isOpen={true} IDProduct={productID} onCancel={handleCloseForm} />;
        }
    }

    return (
        <div>
            <div className="title-section">
                <h3 className="text mb-0">DANH SÁCH SẢN PHẨM</h3>
            </div>
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        <FormComponent
                            id="searchInput"
                            type="text"
                            placeholder="Tìm kiếm theo tên sản phẩm"
                            value={searchTerm}
                            onChange={e => debouncedSetSearchTerm(e.target.value)}
                            enable={true}
                        />
                    </div>
                    <div className="col-6 text-end">
                        <ButtonComponent
                            textButton="Thêm sản phẩm"
                            icon={<i className="bi bi-plus-circle"></i>}
                            onClick={handleAddProduct}
                        />
                    </div>
                </div>
                <table className="table custom-table" style={{ marginTop: '30px' }}>
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '10%' }}>Ảnh</th>
                            <th style={{ width: '20%' }}>Tên sản phẩm</th>
                            <th style={{ width: '10%' }}>Giá</th>
                            <th style={{ width: '20%' }}>Thuộc danh mục</th>
                            <th style={{ width: '15%' }}>Tồn kho</th>
                            <th style={{ width: '15%' }}>Đã bán</th>
                            <th style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingProduct || isLoadingCategories ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : paginatedProducts.length > 0 ? (
                            paginatedProducts
                                .filter(product => product.isDeleted !== true)
                                .map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            {product.img?.[0] ? (
                                                <img
                                                    src={product.img[0]}
                                                    alt={product.name}
                                                    style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                                                    loading="lazy"
                                                    onError={e => (e.target.src = '/default-image.png')}
                                                />
                                            ) : (
                                                'No image'
                                            )}
                                        </td>
                                        <td title={product.name}>
                                            {product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name}
                                        </td>
                                        <td>{product.price?.toLocaleString('vi-VN')} VND</td>
                                        <td>{categoryNameMap[product.category?._id || product.category] || 'Không xác định'}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.sold}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteProduct(product)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    Không có dữ liệu để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {paginationButtons}
            </div>
        </div>
    );
};

export default ProductTab;