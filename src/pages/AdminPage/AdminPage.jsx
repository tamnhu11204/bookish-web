import React, { useState } from 'react'
import './AdminPage.css'
import CatagoryTab from './CatagoryTab';
import PromotionTab from './PromotionTab';
import AccountManagementTab from './AccountManagementTab';
import OptionTab from './OptionTab';
import StatisticTab from './StatisticTab';
import AccountTab from './AccountTab';
import ImportTab from './ImportTab';
import OrderTab from './OrderTab';
import ProductTab from './ProductTab';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="d-flex">
            {/* Tabs dọc */}
            <div className="nav flex-column nav-pills me-3" style={{ width: '200px', fontSize: '16px', fontWeight: 'bold' }}>
                <button
                    className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-person-circle"></i></div>
                        <div className="col"><p className="nav-title">Hồ sơ cá nhân</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "orderManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("orderManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-box2"></i></div>
                        <div className="col"><p className="nav-title">Quản lý đơn hàng</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "productManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("productManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-book"></i></div>
                        <div className="col"><p className="nav-title">Quản lý sản phẩm</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "catagoryManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("catagoryManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-ui-checks-grid"></i></div>
                        <div className="col"><p className="nav-title">Quản lý danh mục</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "promotionManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("promotionManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-gift"></i></div>
                        <div className="col"><p className="nav-title">Quản lý ưu đãi</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "accountManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("accountManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-person-vcard"></i></div>
                        <div className="col"><p className="nav-title">Quản lý tài khoản</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "importManagement" ? "active" : ""}`}
                    onClick={() => setActiveTab("importManagement")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-cart4"></i></div>
                        <div className="col"><p className="nav-title">Quản lý nhập hàng</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "statistics" ? "active" : ""}`}
                    onClick={() => setActiveTab("statistics")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-bar-chart"></i></div>
                        <div className="col"><p className="nav-title">Thống kê</p></div>
                    </div>
                </button>

                <button
                    className={`nav-link ${activeTab === "options" ? "active" : ""}`}
                    onClick={() => setActiveTab("options")}
                >
                    <div className="row">
                        <div className="col-1"><i class="bi-nav bi-gear"></i></div>
                        <div className="col"><p className="nav-title">Tùy chọn</p></div>
                    </div>
                </button>
            </div>

            <div className="tab-content" style={{ flexGrow: 1 }}>
                <div className="tab-pane fade show active">
                    {activeTab === "catagoryManagement" && <CatagoryTab />}
                    {activeTab === "promotionManagement" && <PromotionTab />}
                    {activeTab === "accountManagement" && <AccountManagementTab />}
                    {activeTab === "options" && <OptionTab />}
                    {activeTab === "statistics" && <StatisticTab />}
                    {activeTab === "profile" && <AccountTab />} 
                    {activeTab === "importManagement" && <ImportTab />}
                    {activeTab === "orderManagement" && <OrderTab />}
                    {activeTab === "productManagement" && <ProductTab />}
                </div>
            </div>
        </div>
    )
}

export default AdminPage