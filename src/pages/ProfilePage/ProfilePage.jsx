import React, { useState }  from 'react'
import PasswordTab from '../ProfilePage/PasswordTab';
import ProfileTab from '../ProfilePage/Profiletab';
import AddressTab from './AddressTab';

export const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("profileManagement");
    const [successMessage, setSuccessMessage] = useState(false); // Quản lý trạng thái thông báo

  

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

                

                
            </div>

            <div className="tab-content" style={{ flexGrow: 1 }}>
                <div className="tab-pane fade show active">
                {activeTab === "profileManagement" && <ProfileTab/>} 
                    {activeTab === "passwordManagement" && <PasswordTab />} 
                    {activeTab === "addressManagement" && <AddressTab/>} 
                   
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;