import React, { useState, useMemo, useRef, useEffect } from 'react';
import './AuthorPage.css';
import * as AuthorService from '../../services/AuthorService';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';

const AuthorPage = () => {
    const { authorId } = useParams();
    const navigate = useNavigate();
    const detailSectionRef = useRef(null);
    const [selectedAlphabet, setSelectedAlphabet] = useState('All');

    // 1. Query danh sách tất cả tác giả
    const authorsQuery = useQuery({
        queryKey: ['allAuthors'],
        queryFn: () => AuthorService.getAllAuthor(),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Query danh sách tác phẩm theo tác giả đang chọn
    const productsQuery = useQuery({
        queryKey: ['products-by-author', authorId],
        queryFn: () => ProductService.getAllProductBySort({
            limit: 'all', // Lấy hết sách của tác giả này
            filters: {
                authors: [authorId] // Backend yêu cầu 'authors' (số nhiều) và phải là Mảng []
            }
        }),
        enabled: !!authorId,
    });

    // 3. Xử lý dữ liệu danh sách tác giả từ API
    const allAuthors = useMemo(() => {
        const rawData = authorsQuery.data;
        if (Array.isArray(rawData)) return rawData;
        if (Array.isArray(rawData?.data)) return rawData.data;
        return [];
    }, [authorsQuery.data]);

    // 4. Lọc tác giả hiển thị theo chữ cái (Alphabet)
    const filteredAuthors = useMemo(() => {
        if (selectedAlphabet === 'All') return allAuthors;
        return allAuthors.filter(author =>
            author?.name?.trim().toUpperCase().startsWith(selectedAlphabet)
        );
    }, [allAuthors, selectedAlphabet]);

    // 5. Lấy thông tin chi tiết của tác giả đang chọn
    const selectedAuthorDetails = useMemo(() => {
        if (!authorId || allAuthors.length === 0) return null;
        return allAuthors.find(a => a._id === authorId) || null;
    }, [allAuthors, authorId]);

    const products = useMemo(() => {
        // Backend trả về { status: 'OK', data: [...] }
        return productsQuery.data?.data || [];
    }, [productsQuery.data]);

    // 7. Đồng bộ chữ cái và tự động cuộn xuống khi chọn tác giả
    useEffect(() => {
        if (authorId && allAuthors.length > 0) {
            const authorToSelect = allAuthors.find(a => a._id === authorId);
            if (authorToSelect && authorToSelect.name) {
                const firstChar = authorToSelect.name.charAt(0).toUpperCase();
                setSelectedAlphabet(firstChar);

                // Đợi một chút để UI render rồi mới cuộn
                setTimeout(() => {
                    detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }
    }, [authorId, allAuthors]);

    // Hàm chọn chữ cái
    const handleAlphabetSelect = (char) => {
        setSelectedAlphabet(char);
        if (authorId) navigate('/author'); // Thoát chế độ xem chi tiết nếu đang xem dở tác giả khác
    };

    // Hàm chọn tác giả
    const handleAuthorSelect = (selectedId) => {
        if (authorId === selectedId) {
            navigate('/author');
        } else {
            navigate(`/author/${selectedId}`);
        }
    };

    // Chuyển đổi thông tin tác giả từ HTML sang Text
    const parseDescription = (htmlString) => {
        if (!htmlString) return "Thông tin đang được cập nhật...";
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    };

    // Xử lý khi click vào sản phẩm
    const handleOnClickProduct = async (id) => {
        await ProductService.updateView(id);
        navigate(`/product-detail/${id}`);
    };

    const alphabetList = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

    if (authorsQuery.isLoading) return <div className="status-message">Đang tải danh sách tác giả...</div>;

    return (
        <div className="author-page-combined">
            <div className='container'>
                <div className="header-hero-section">
                    <h1>Tác giả</h1>
                </div>

                {/* Bộ lọc chữ cái */}
                <div className="alphabet-filter-section">
                    {alphabetList.map(char => (
                        selectedAlphabet === char ? (
                            <ButtonComponent
                                key={char}
                                textButton={char}
                                onClick={() => handleAlphabetSelect(char)}
                                className="filter-btn active"
                            />
                        ) : (
                            <ButtonComponent2
                                key={char}
                                textButton={char}
                                onClick={() => handleAlphabetSelect(char)}
                                className="filter-btn"
                            />
                        )
                    ))}
                </div>

                {/* Danh sách các thẻ tác giả */}
                <div className="author-tags-section">
                    <div className="author-tags-container">
                        {filteredAuthors.length > 0 ? (
                            filteredAuthors.map(author => (
                                <button
                                    key={author._id}
                                    className={`author-tag ${authorId === author._id ? 'active' : ''}`}
                                    onClick={() => handleAuthorSelect(author._id)}
                                >
                                    {author.name}
                                </button>
                            ))
                        ) : (
                            <p className='text'>Không tìm thấy tác giả nào bắt đầu bằng ký tự '{selectedAlphabet}'.</p>
                        )}
                    </div>
                </div>

                {/* Chi tiết tác giả và sản phẩm */}
                {selectedAuthorDetails ? (
                    <div ref={detailSectionRef} className="author-detail-section">
                        <div className="text-featured-author section-header-left">
                            <i className="bi bi-stars"></i>
                            <p>Về tác giả</p>
                            <i className="bi bi-stars"></i>
                            <div className="header-line"></div>
                        </div>

                        <div className="author-info-container">
                            <div className="author-image-wrapper">
                                <img
                                    src={selectedAuthorDetails.img || 'https://s.gr-assets.com/assets/nophoto/user/u_200x266-e183445fd1a1b5cc7075bb1cf7043306.png'}
                                    alt={selectedAuthorDetails.name}
                                    className="author-detail-image"
                                />
                            </div>
                            <div className="author-details-content">
                                <h1 className="author-full-name">{selectedAuthorDetails.name}</h1>
                                <p className="author-full-description">
                                    {parseDescription(selectedAuthorDetails.info)}
                                </p>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm của tác giả */}
                        <div className="author-products-container">
                            <div className="text-featured-author section-header-left">
                                <i className="bi bi-stars"></i>
                                <p>Tác phẩm tiêu biểu</p>
                                <i className="bi bi-stars"></i>
                                <div className="header-line"></div>
                            </div>

                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                {productsQuery.isLoading ? (
                                    <p>Đang tải tác phẩm...</p>
                                ) : products.length > 0 ? (
                                    products.map(product => (
                                        <CardProductComponent
                                            key={product._id}
                                            id={product._id}
                                            img={product.img?.[0]}
                                            proName={product.name}
                                            currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
                                            originalPrice={product.price}
                                            sold={product.sold}
                                            star={product.star}
                                            feedbackCount={product.feedbackCount}
                                            onClick={() => handleOnClickProduct(product._id)}
                                            view={product.view}
                                            stock={product.stock}
                                            discount={product.discount}
                                        />
                                    ))
                                ) : (
                                    <p className='text'>Tác giả này hiện chưa có tác phẩm nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p className='text'>Vui lòng chọn một tác giả để xem chi tiết.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorPage;