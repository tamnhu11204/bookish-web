import React, { useState, useMemo, useRef, useEffect } from 'react';
import './AuthorPage.css';
import * as AuthorService from '../../services/AuthorService';
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';

// Component AuthorPage
const AuthorPage = () => {
    const { authorId } = useParams();
    console.log('authorId from URL:', authorId); // Debug
    const navigate = useNavigate();
    const detailSectionRef = useRef(null);
    const [selectedAlphabet, setSelectedAlphabet] = useState('All');

    // Debug: Theo dõi URL và authorId
    useEffect(() => {
        console.log('Current URL:', window.location.pathname);
        console.log('useParams authorId:', authorId);
    }, [authorId]);

    // Query danh sách tác giả
    const authorsQuery = useQuery({
        queryKey: ['allAuthors'],
        queryFn: () => AuthorService.getAllAuthor(),
        staleTime: 1000 * 60 * 5,
    });

    // Query danh sách tác phẩm
    const productsQuery = useQuery({
        queryKey: ['products-by-author', authorId],
        queryFn: () => ProductService.getAllProductBySort({
            filter: ['author', authorId]
        }),
        enabled: !!authorId,
    });

    // Xử lý danh sách tác giả
    const allAuthors = useMemo(() => {
        const rawData = authorsQuery.data;
        console.log('Raw data from authorsQuery:', rawData); // Debug
        if (Array.isArray(rawData)) return rawData;
        if (Array.isArray(rawData?.data)) return rawData.data;
        return [];
    }, [authorsQuery.data]);

    // Lọc tác giả theo alphabet
    const filteredAuthors = useMemo(() => {
        if (!Array.isArray(allAuthors)) return [];
        if (selectedAlphabet === 'All') return allAuthors;
        return allAuthors.filter(author =>
            author?.name?.trim().toUpperCase().startsWith(selectedAlphabet)
        );
    }, [allAuthors, selectedAlphabet]);

    // Tìm chi tiết tác giả
    const selectedAuthorDetails = useMemo(() => {
        console.log('authorId:', authorId, 'allAuthors:', allAuthors); // Debug
        if (!authorId || !Array.isArray(allAuthors)) return null;
        const author = allAuthors.find(author => author?._id === authorId) || null;
        console.log('selectedAuthorDetails:', author); // Debug
        return author;
    }, [allAuthors, authorId]);

    // Danh sách tác phẩm
    const products = useMemo(() => {
        console.log('productsQuery data:', productsQuery.data); // Debug
        return productsQuery.data?.data || [];
    }, [productsQuery.data]);

    // Đồng bộ alphabet và cuộn
    useEffect(() => {
        if (authorId && allAuthors.length > 0) {
            const authorToSelect = allAuthors.find(a => a._id === authorId);
            console.log('authorToSelect in useEffect:', authorToSelect); // Debug
            if (authorToSelect && authorToSelect.name) {
                const firstChar = authorToSelect.name.charAt(0).toUpperCase();
                if (firstChar) {
                    setSelectedAlphabet(firstChar);
                    setTimeout(() => {
                        detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            } else {
                console.log('No valid author or name found for authorId:', authorId);
                setSelectedAlphabet('All'); // Mặc định về 'All'
            }
        }
    }, [authorId, allAuthors]);

    // Hàm xử lý chọn alphabet
    const handleAlphabetSelect = (char) => {
        setSelectedAlphabet(char);
        if (authorId) navigate('/author');
    };

    // Hàm xử lý chọn tác giả
    const handleAuthorSelect = (selectedId) => {
        console.log('Selected author ID:', selectedId); // Debug
        if (authorId === selectedId) {
            navigate('/author');
        } else {
            navigate(`/author/${selectedId}`);
            console.log('Navigated to:', `/author/${selectedId}`); // Debug
        }
    };

    // Hàm parse HTML
    const parseDescription = (htmlString) => {
        if (!htmlString) return '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    };

    const alphabet = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

    // Render
    if (authorsQuery.isLoading) return <div className="status-message">Đang tải danh sách tác giả...</div>;
    if (authorsQuery.isError) return <div className="status-message error">Lỗi: {authorsQuery.error.message}</div>;

    const handleOnClickProduct = async (id) => {
        await ProductService.updateView(id);
        navigate(`/product-detail/${id}`);
    };

    return (
        <div className="author-page-combined">
            <div className='container'>
                <div className="header-hero-section">
                    <h1>Tác giả</h1>
                </div>
                <div className="alphabet-filter-section">
                    {alphabet.map(char => (
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

                {selectedAuthorDetails ? (
                    <div ref={detailSectionRef} className="author-detail-section">
                        <div className="text-featured-author section-header-left">
                            <i class="bi bi-stars"></i>
                            <p >Về tác giả</p>
                            <i class="bi bi-stars"></i>
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
                                    {parseDescription(selectedAuthorDetails.info)} Chưa có thông tin !!!
                                </p>
                            </div>
                        </div>
                        <div className="author-products-container">
                            <div className="text-featured-author section-header-left">
                                <i class="bi bi-stars"></i>
                                <p >Tác giả nổi bật</p>
                                <i class="bi bi-stars"></i>
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
                                            img={product.img[0]}
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
                                    <p className='text'>Tác giả này hiện chưa có tác phẩm nào được liệt kê.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className='text'>Vui lòng chọn một tác giả.</p>
                )}
            </div>
        </div>
    );
};

export default AuthorPage;