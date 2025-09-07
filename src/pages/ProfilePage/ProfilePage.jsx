import React, { useState } from 'react';
import PasswordTab from '../ProfilePage/PasswordTab';
import AddressTab from './AddressTab';
import OrderTab from './OrderTab';
import ProductTab from './ProductTab';
import ProfileTab from './Profiletab';
import FeedbackTab from './FeedbackTab';

export const ProfilePage = () => {

    const [activeTab, setActiveTab] = useState("profileManagement");

    return (
        <div className="d-flex">
            {/* Tabs dọc */}
            <div className="nav flex-column nav-pills me-3" style={{ width: '200px', fontSize: '16px', fontWeight: 'bold' }}>
                <button
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profileManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-person-circle"></i></div>
                        <div className="col"><p className="nav-title">Tài khoản</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "profileManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("profileManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i ></i></div>
                        <div className="col"><p className="nav-title">Hồ sơ</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "addressManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("addressManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i ></i></div>
                        <div className="col"><p className="nav-title">Địa chỉ</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "passwordManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("passwordManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i ></i></div>
                        <div className="col"><p className="nav-title">Đổi mật khẩu</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "orderManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("orderManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-box2"></i></div>
                        <div className="col"><p className="nav-title">Đơn hàng</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "feedbackManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("feedbackManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi bi-bookmark-star"></i></div>
                        <div className="col"><p className="nav-title">Đánh giá</p></div>
                    </div>
                </button>



                <button
                    className={`nav-link ${activeTab === "productManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("productManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-book"></i></div>
                        <div className="col"><p className="nav-title">Sản phẩm yêu thích</p></div>
                    </div>
                </button>
            </div>

            <div className="tab-content" style={{ flexGrow: 1 }}>
                <div className="tab-pane fade show active">
                    {activeTab === "profileManagement" && <ProfileTab />}
                    {activeTab === "passwordManagement" && <PasswordTab />}
                    {activeTab === "addressManagement" && <AddressTab />}
                    {activeTab === "productManagement" && <ProductTab />}
                    {activeTab === "orderManagement" && <OrderTab />}
                    {activeTab === "feedbackManagement" && <FeedbackTab />}

                </div>
            </div>
        </div>
    )
}

export default ProfilePage;