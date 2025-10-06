/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as FavoriteProductService from '../../services/FavoriteProductService';
import * as ProductService from '../../services/ProductService';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'; // <-- THÊM IMPORT NÀY
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';

const ProductTab = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [productFavorite, setProductFavorite] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 10;

    // ... (Hàm fetchFavoriteProducts và useEffect giữ nguyên như cũ)
    const fetchFavoriteProducts = async () => {
        if (user?.id) {
            setLoading(true);
            try {
                const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);
                if (favoriteData?.data && Array.isArray(favoriteData.data)) {
                    const productDetailsPromises = favoriteData.data.map(async (favoriteItem) => {
                        const response = await ProductService.getDetailProduct(favoriteItem.product);
                        return response.data;
                    });
                    const products = await Promise.all(productDetailsPromises);
                    const validProducts = products.filter(Boolean);
                    setProductFavorite(validProducts);
                    setTotalPages(Math.ceil(validProducts.length / productsPerPage));
                }
            } catch (error) {
                console.error('Error fetching favorite products:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchFavoriteProducts();
    }, [user?.id]);

    const handleOnClickProduct = (productId) => {
        navigate(`/product-detail/${productId}`);
    };

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return productFavorite.slice(startIndex, startIndex + productsPerPage);
    }, [currentPage, productFavorite]);

    if (loading) {
        return <div>Đang tải sản phẩm yêu thích...</div>;
    }

    const paginationButtons = (
        <div className="pagination-category d-flex justify-content-center gap-2 mt-4">
            {currentPage > 1 && (
                <ButtonComponent2
                    textButton="Trước"
                    onClick={() => setCurrentPage(currentPage - 1)}
                />
            )}
            {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return currentPage === pageNumber ? (
                    // Dùng ButtonComponent cho trang active
                    <ButtonComponent
                        key={pageNumber}
                        textButton={String(pageNumber)}
                        onClick={() => setCurrentPage(pageNumber)}
                    />
                ) : (
                    // Dùng ButtonComponent2 cho các trang khác
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

    return (
        <div style={{ padding: '30px 30px', backgroundColor: "#F9F6F2" }}>
            <div>
                <h1 className="site-title">SẢN PHẨM YÊU THÍCH</h1>
            </div>

            <div className="content-section container" style={{ marginTop: '30px' }}>
                {productFavorite.length === 0 ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>Bạn chưa có sản phẩm yêu thích nào.</p>
                ) : (
                    <>
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            {paginatedProducts.map((product) => (
                                <CardProductComponent
                                    key={product._id}
                                    id={product._id}
                                    img={product.img && product.img.length > 0 ? product.img[0] : 'placeholder.png'}
                                    proName={product.name}
                                    currentPrice={(product.price * (100 - (product.discount || 0)) / 100)}
                                    originalPrice={product.price}
                                    sold={product.sold}
                                    star={product.star}
                                    feedbackCount={product.feedbackCount}
                                    onClick={() => handleOnClickProduct(product._id)}
                                    view={product.view}
                                    stock={product.stock}
                                    discount={product.discount}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && paginationButtons}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductTab;