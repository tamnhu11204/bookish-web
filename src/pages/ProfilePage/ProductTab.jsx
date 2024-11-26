import React, { useState } from 'react';

import FormComponent from '../../components/FormComponent/FormComponent';
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import img1 from '../../assets/img/img1.png'
import img2 from '../../assets/img/img2.png'
import img3 from '../../assets/img/img3.jpg'
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent'
import MiniCardComponent from '../../components/MiniCardComponent/MiniCardComponent'
import CardComponent from '../../components/CardComponent/CardComponent'

const ProductTab = () => {

    const [activeTab, setActiveTab] = useState("customer");
    const accounts = [
        {
            id: 103,
            image: 'https://via.placeholder.com/50',
            name: 'Nguyễn Văn A',
            email: 'nguyenvan@gmail.com',
            numPhone: '2124354425'
        },
        {
            id: 104,
            image: 'https://via.placeholder.com/50',
            name: 'Nguyễn Văn A',
            email: 'nguyenvan@gmail.com',
            numPhone: '2124354425'
        },
    ];

 
    
    // Hàm hiển thị sản phẩm
    const bookPurchasingTrendInfo = (
        <>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            {[...Array(8)].map((_, index) => (
              <CardProductComponent
                key={index}
                img={img3}
                proName="Ngàn mặt trời rực rỡ"
                currentPrice="120000"
                sold="12"
                star="4.5"
                score="210"
              />
            ))}
          </div>
        </>
      )

    //Nội dung ở tab tài khoản khách hàng
    const customerContent = (
        <>
            <div className="col-6">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên "
                />
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container" style={{ marginTop: '30px' }}>
          <CardComponent
           title="Sản phẩm đã thích"
            bodyContent={bookPurchasingTrendInfo}
            //icon="bi bi-graph-up-arrow"
          />
        </div>
      </div>
        </>
    )

    //Nội dung ở tab tài khoản admin
    const adminContent = (
        <>
            <div className="col-6">
                <FormComponent
                    id="searchInput"
                    type="text"
                    placeholder="Tìm kiếm theo tên "
                />
            </div>

            <div style={{ backgroundColor: '#F9F6F2' }}>
        <div class="container" style={{ marginTop: '30px' }}>
          <CardComponent
           title="Sản phẩm đã xem"
            bodyContent={bookPurchasingTrendInfo}
            //icon="bi bi-graph-up-arrow"
          />
        </div>
      </div>
        </>
    )

    //
    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ SẢN PHẨM</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {/* Tabs */}
                    <div className="row mt-4" >
                        <div className="col-12">
                            <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "customer" ? "active" : ""}`}
                                        onClick={() => setActiveTab("customer")}
                                    >
                                       Sản phẩm yêu thích
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "admin" ? "active" : ""}`}
                                        onClick={() => setActiveTab("admin")}
                                    >
                                        Sản phẩm đã xem
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {activeTab === "customer" && <div>{customerContent}</div>}
                        {activeTab === "admin" && <div>{adminContent}</div>}
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default ProductTab;
