import { useState } from 'react';
import './AdminPage.css';
import AuthorSubTab from './AuthorSubTab';
import FormSubTab from './FormSubTab';
import LanguageSubTab from './LanguageSubTab';
import PublisherSubTab from './PublisherSubTab';
import StatusSubTab from './StatusSubTab';
import UnitSubTab from './UnitSubTab';

const OptionTab = () => {
    const [activeTab, setActiveTab] = useState("language");

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
                        {/* <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "unit" ? "active" : ""}`}
                                onClick={() => setActiveTab("unit")}
                            >
                                Đơn vị
                            </button>
                        </li> */}
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "publisher" ? "active" : ""}`}
                                onClick={() => setActiveTab("publisher")}
                            >
                                Nhà xuất bản
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "author" ? "active" : ""}`}
                                onClick={() => setActiveTab("author")}
                            >
                                Tác giả
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "status" ? "active" : ""}`}
                                onClick={() => setActiveTab("status")}
                            >
                                Loại trạng thái đơn hàng
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" style={{ flexGrow: 1 }}>
                    {activeTab === "language" && <LanguageSubTab />}
                    {activeTab === "format" && <FormSubTab />}
                    {activeTab === "unit" && <UnitSubTab />}
                    {activeTab === "publisher" && <PublisherSubTab />}
                    {activeTab === "author" && <AuthorSubTab />}
                    {activeTab === "status" && <StatusSubTab />}
                </div>
            </div>
        </div>
    );
};

export default OptionTab;
