import React, { useState } from 'react';
import './AdminPage.css';
import SupplierSubTab from './SupplierSubTab';
import PublisherSubTab from './PublisherSubTab';
import LanguageSubTab from './LanguageSubTab';
import StatusSubTab from './StatusSubTab';
import FormSubTab from './FormSubTab';
import UnitSubTab from './UnitSubTab';

const OptionTab = () => {
    const [activeTab, setActiveTab] = useState("language");
    const [activeTab1, setActiveTab1] = useState("supplier");

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">TÙY CHỌN</h3>
            </div>

            {/* Tabs về sản phẩm */}
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row mt-4">
                    <h4>VỀ SẢN PHẨM</h4>
                    <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "language" ? "active" : ""}`}
                                onClick={() => setActiveTab("language")}
                            >
                                Ngôn ngữ
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "format" ? "active" : ""}`}
                                onClick={() => setActiveTab("format")}
                            >
                                Hình thức
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "unit" ? "active" : ""}`}
                                onClick={() => setActiveTab("unit")}
                            >
                                Đơn vị
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "publisher" ? "active" : ""}`}
                                onClick={() => setActiveTab("publisher")}
                            >
                                Nhà xuất bản
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" style={{ flexGrow: 1 }}>
                    {activeTab === "language" && <LanguageSubTab/>}
                    {activeTab === "format" && <FormSubTab/>}
                    {activeTab === "unit" && <UnitSubTab/>}
                    {activeTab === "publisher" && <PublisherSubTab/>}
                </div>
            </div>

            {/* Tabs về các tùy chọn khác */}
            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row mt-4">
                    <h4>VỀ CÁC TÙY CHỌN KHÁC</h4>
                    <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab1 === "supplier" ? "active" : ""}`}
                                onClick={() => setActiveTab1("supplier")}
                            >
                                Nhà cung cấp
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab1 === "status" ? "active" : ""}`}
                                onClick={() => setActiveTab1("status")}
                            >
                                Loại trạng thái đơn hàng
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" style={{ flexGrow: 1 }}>
                    {activeTab1 === "supplier" && <SupplierSubTab />}
                    {activeTab1 === "status" && <StatusSubTab/>}
                </div>
            </div>
        </div>
    );
};

export default OptionTab;
