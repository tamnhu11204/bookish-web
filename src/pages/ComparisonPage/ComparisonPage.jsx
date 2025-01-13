import React , { useEffect, useMemo, useState }from 'react'
import './ComparisonPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import img4 from '../../assets/img/img4.png'
import TableComparison from '../../components/TableComponent/TableComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import {  removeOrderProduct, addComparisonProduct } from '../../redux/slides/ComparisonSlide';

const ComparisonPage = () => {

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    //bảng thông tin nổi bật
    const comparisonData = [
        { criteria: 'Giá bìa', product1: '200.000đ -50%', product2: '100.000đ -0%' },
        { criteria: 'Giá sau sale', product1: '100.000đ', product2: '100.000đ' },
        { criteria: 'Điểm', product1: '2222 điểm', product2: '2100 điểm' },
        { criteria: 'Lượt bán', product1: '11', product2: '11' },
        { criteria: 'Đánh giá', product1: '4,5/5 ⭐ (2000 đánh giá)', product2: '4,3/5 ⭐ (1230 đánh giá)' },
        { criteria: 'Lượt xem', product1: '5000', product2: '5100' },
    ];

    //bảng thông tin chi tiết
    const comparisonData1 = [
        { criteria: 'Mã hàng', product1: '200.000đ -50%', product2: '100.000đ -0%' },
        { criteria: 'Tác giả', product1: '100.000đ', product2: '100.000đ' },
        { criteria: 'Nhà xuất bản', product1: '2222 điểm', product2: '2100 điểm' },
        { criteria: 'Năm xuất bản', product1: '11', product2: '11' },
        { criteria: 'Ngôn ngữ', product1: '4,5/5 ⭐ (2000 đánh giá)', product2: '4,3/5 ⭐ (1230 đánh giá)' },
        { criteria: 'Trọng lượng', product1: '5000', product2: '5100' },
        { criteria: 'Kích thước', product1: '5000', product2: '5100' },
        { criteria: 'Số trang', product1: '5000', product2: '5100' },
        { criteria: 'Hình thức', product1: '5000', product2: '5100' },
    ];

    //body của card dùng để lọc các thông tin nổi bật
    const comparison1 = (
        <>
            <TableComparison
                data={comparisonData}
                pro1="Sản phẩm 1"
                pro2="Sản phẩm 2"
                pro3="Sản phẩm 3"
            />
        </>
    )

    //body của card dùng để lọc các thông tin chi tiết
    const comparison2 = (
        <>
            <TableComparison
                data={comparisonData1}
                pro1="Sản phẩm 1"
                pro2="Sản phẩm 2"
                pro3="Sản phẩm 3"
            />
        </>
    )

    return (
        <div style={{ backgroundColor: '#F9F6F2' }}>
            <div class="container">

                {/* chứa các sản phẩm chọn để so sánh */}
                <div class="card-comparison">
                    <div class="card-body-comparison" >
                        <h5 class="card-title-comparison">So sánh sách</h5>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-3">
                                <CardProductComponent
                                    img={img4}
                                    proName="Ngàn mặt trời rực rỡ"
                                    currentPrice="120000"
                                    sold="12"
                                    star="4.5"
                                    score="210"
                                >
                                </CardProductComponent>
                                <button
              type="button"
              className="btn btn-danger"
              //onClick={() => handleOnClickDeleteAll()}
            >
              <i className="bi bi-trash"></i>
            </button>
                            </div>

                            <div className="col-3">
                                <div className="card" style={{ width: '20rem', height: '39.2rem' }}>
                                    <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="btn" onClick={openModal}>
                                            <i className="bi bi-plus-circle" style={{ fontSize: '30px', color: '#198754' }}></i>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="col-3">
                                <div className="card" style={{ width: '20rem', height: '39.2rem' }}>
                                    <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div className="btn">
                                            <i className="bi bi-plus-circle" style={{ fontSize: '30px', color: '#198754' }}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chọn sản phẩm để so sánh</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Danh sách sản phẩm...</p>
                                {/* Danh sách sản phẩm có thể được hiển thị ở đây */}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Đóng
                                </button>
                                <button type="button" className="btn btn-primary">
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div class="container" style={{ marginTop: '30px' }}>
                <CardComponent
                    title="Danh mục"
                    bodyContent={comparison1}
                    icon="bi bi-bookmark-star"
                />
            </div>

            <div class="container" style={{ marginTop: '30px' }}>
                <CardComponent
                    title="Danh mục"
                    bodyContent={comparison2}
                    icon="bi bi-card-list"
                />
            </div>
        </div>
        
    )
}

export default ComparisonPage