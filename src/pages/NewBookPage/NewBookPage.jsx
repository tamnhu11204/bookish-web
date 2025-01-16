import React, { useMemo, useEffect, useState } from 'react'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';
import { useNavigate } from 'react-router-dom';
import * as ProductService from '../../services/ProductService'
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import img1 from '../../assets/img/img1.png';
import img2 from '../../assets/img/img2.png';

const NewBookPage = () => {
    const navigate = useNavigate();
    const [newBooks, setNewBooks] = useState([])
    const [sortOrder, setSortOrder] = useState('desc');
     const [currentPage, setCurrentPage] = useState(1);
          const productsPerPage = 20; // Số sản phẩm trên mỗi trang
          const [totalPages, setTotalPages] = useState(1); // Khởi tạo giá trị totalPages
    
          const handlePageChange = (newPage) => {
            setCurrentPage(newPage); // Cập nhật trang hiện tại
          };
    
          const paginationButtons = (
                        <div className="pagination">
                        {currentPage > 1 && (
                          <button onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                        )}
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                          >
                            {index + 1}
                          </button>
                        ))}
                        {currentPage < totalPages && (
                          <button onClick={() => handlePageChange(currentPage + 1)}>Tiếp theo</button>
                        )}
                      </div>
                    );
                    const paginatedProducts = useMemo(() => {
                        const startIndex = (currentPage - 1) * productsPerPage;
                        return newBooks.slice(startIndex, startIndex + productsPerPage);
                      }, [currentPage, newBooks]);
    

    useEffect(() => {
        const fetchNewBooks = async () => {
            try {
                const params = {
                    limit: 10,
                    page: 0,
                    sort: ["createdAt", sortOrder],
                };
                const products = await ProductService.getAllProductBySort(params);
                setNewBooks(products.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchNewBooks();
    }, [sortOrder]);

    useEffect(() => {
        setTotalPages(Math.ceil(newBooks.length / productsPerPage));
    }, [newBooks, productsPerPage]);

    const handleOnClickProduct = async (id) => {
        await ProductService.updateView(id)
        navigate(`/product-detail/${id}`);
    }

    
    const handleSortToggle = () => {
        setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    };

    const newBookInfo = (
        <><div className='row'>
            <div className="col-11"></div>
            <div className="col-1">
                <button style={{ fontSize: '16px' }} onClick={handleSortToggle} className="btn btn-link">
                    <i className={`bi bi-arrow-${sortOrder === 'desc' ? 'down' : 'up'}-square`} />
                </button>
            </div>
        </div><div className="d-flex flex-wrap justify-content-center align-items-center gap-5">
                {paginatedProducts.map((product) => (
                    <CardProductComponent
                        key={product._id}
                        img={product.img[0]}
                        proName={product.name}
                        currentPrice={(product.price * (100 - product.discount) / 100).toLocaleString()}
                        sold={product.sold}
                        star={product.star}
                        feedbackCount={product.feedbackCount}
                        onClick={() => handleOnClickProduct(product._id)}
                        view={product.view} />
                ))}
            </div>
             {/* Hiển thị nút phân trang */}
             {paginationButtons}
            </>
    );

    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div style={{ backgroundColor: '#F9F6F2' }}>
                <div className="container">
                    <div style={{ marginTop: '30px' }}>
                        <SliderComponent arrImages={[img1, img2]} />
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
                <div className="container" style={{ marginTop: '30px' }}>
                    <CardComponent
                        title="Sách mới"
                        bodyContent={newBookInfo}
                        icon="bi bi-graph-up-arrow"
                    />
                </div>
            </div>
        </div>
    )
}

export default NewBookPage