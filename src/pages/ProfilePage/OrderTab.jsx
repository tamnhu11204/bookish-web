import React, { useState } from 'react';

import FormComponent from '../../components/FormComponent/FormComponent';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import OrderComponent from '../../components/OrderComponent/OrderComponent';
import OrderDetailsPage from '../OrderDetailsPage/OrderDetailsPage';

const OrderTab = () => {

    const [activeTab, setActiveTab] = useState("all");
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

    const orders = [
        {
          status: "HOÀN THÀNH",
          shippingStatus: "Giao hàng thành công",
          title: "Thư gửi quý nhà giàu Việt Nam",
          price: 100000,
          quantity: 1,
          totalPrice: 95000,
          isCompleted: true,
        },
        {
          status: "ĐÃ XÁC NHẬN",
          shippingStatus: "Đơn hàng đang được giao",
          title: "Thư gửi quý nhà giàu Việt Nam",
          price: 100000,
          quantity: 1,
          totalPrice: 95000,
          isCompleted: false,
        },
      ];
    

 
    
    // Hàm mở modal xóa tài khoản
   
   

    //Nội dung ở tab tài khoản khách hàng
    const AllContent = (
        <>
            <div className="container my-5">
      {orders.map((order, index) => (
        <OrderComponent key={index} {...order}
       onclick = {() => setActiveTab("OrderDetail")}
         />
      ))}
    </div>
        </>
    )

    const OrderDetail = (
       <> <div> sao nó ko hiện vậy</div></>
    
        

    )

    
    //
    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ ĐƠN HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {/* Tabs */}
                    <div className="row mt-4" >
                        <div className="col-12">
                            <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                        onClick={() => setActiveTab("all")}
                                    >
                                       Tất cả
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "delivering" ? "active" : ""}`}
                                        onClick={() => setActiveTab("delivering")}
                                    >
                                        Đang giao
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "complete" ? "active" : ""}`}
                                        onClick={() => setActiveTab("complete")}
                                    >
                                        Đã giao
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "cancel" ? "active" : ""}`}
                                        onClick={() => setActiveTab("cancel")}
                                    >
                                        Đã hủy
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {activeTab === "all" && <div>{AllContent}</div>}
                        {activeTab === "complete" && <div>{AllContent}</div>}
                        {activeTab === "delivering" && <div>{AllContent}</div>}
                        {activeTab === "cancel" && <div>{AllContent}</div>}
                        
                    </div>
                </div>
                <OrderDetailsPage></OrderDetailsPage>
            </div>

            
        </div>
    );
};

export default OrderTab;
