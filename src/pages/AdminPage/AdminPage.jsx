import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AccountManagementTab from './AccountManagementTab';
import './AdminPage.css';
import CategoryTab from './CategoryTab';
import ImportTab from './ImportTab';
import OptionTab from './OptionTab';
import OrderTab from './OrderTab';
import ProductTab from './ProductTab';
import PromotionTab from './PromotionTab';
import ShopManagementTab from './ShopManagementTab';
import StaticPageManagement from './StaticPageManagement';
import StatisticTab from './StatisticTab';

const AdminPage = () => {
    const { tab } = useParams(); // Lấy tab từ URL
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab || 'shopManagement'); // Mặc định là shopManagement nếu không có tab trong URL

    // Đồng bộ activeTab với URL khi tab thay đổi
    useEffect(() => {
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [activeTab, tab]);

    // Hàm xử lý khi nhấp vào tab
    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        navigate(`/admin/${newTab}`); // Điều hướng đến URL mới
    };

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart isHiddenNoti />
            <div className="d-flex container profile-container">
                {/* Tabs dọc */}
                <div className="nav flex-column nav-pills me-3" style={{ width: '200px', fontSize: '16px', fontWeight: 'bold' }}>
                    <button
                        className={`nav-link ${activeTab === 'shopManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('shopManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-shop"></i></div>
                            <div className="col"><p className="nav-title">Cửa hàng</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'accountManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('accountManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-person-vcard"></i></div>
                            <div className="col"><p className="nav-title">Người dùng</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'orderManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('orderManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-box2"></i></div>
                            <div className="col"><p className="nav-title">Đơn hàng</p></div>
                        </div>
                    </button>

                    {/* <button
                        className={`nav-link ${activeTab === 'productManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('productManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-book"></i></div>
                            <div className="col"><p className="nav-title">Quản lý sản phẩm</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'categoryManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('categoryManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-ui-checks-grid"></i></div>
                            <div className="col"><p className="nav-title">Quản lý danh mục</p></div>
                        </div>
                    </button> */}

                    {/* <button
                        className={`nav-link ${activeTab === 'promotionManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('promotionManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-gift"></i></div>
                            <div className="col"><p className="nav-title">Quản lý ưu đãi</p></div>
                        </div>
                    </button> */}

                    <button
                        className={`nav-link ${activeTab === 'importManagement' ? 'active' : ''}`}
                        onClick={() => handleTabChange('importManagement')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-cart4"></i></div>
                            <div className="col"><p className="nav-title">Nhập hàng</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`}
                        onClick={() => handleTabChange('statistics')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-bar-chart"></i></div>
                            <div className="col"><p className="nav-title">Thống kê</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'options' ? 'active' : ''}`}
                        onClick={() => handleTabChange('options')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-gear"></i></div>
                            <div className="col"><p className="nav-title">Tùy chọn</p></div>
                        </div>
                    </button>

                    <button
                        className={`nav-link ${activeTab === 'staticPage' ? 'active' : ''}`}
                        onClick={() => handleTabChange('staticPage')}
                    >
                        <div className="row">
                            <div className="col-1"><i className="bi-nav bi-blockquote-left"></i></div>
                            <div className="col"><p className="nav-title">Trang hỗ trợ khách hàng</p></div>
                        </div>
                    </button>
                </div>

                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {activeTab === 'categoryManagement' && <CategoryTab />}
                        {activeTab === 'promotionManagement' && <PromotionTab />}
                        {activeTab === 'accountManagement' && <AccountManagementTab />}
                        {activeTab === 'options' && <OptionTab />}
                        {activeTab === 'statistics' && <StatisticTab />}
                        {activeTab === 'importManagement' && <ImportTab />}
                        {activeTab === 'orderManagement' && <OrderTab />}
                        {activeTab === 'productManagement' && <ProductTab />}
                        {activeTab === 'shopManagement' && <ShopManagementTab />}
                        {activeTab === 'staticPage' && <StaticPageManagement />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPage;