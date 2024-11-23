import React, { useState } from 'react';
import './AdminPage.css';
import BestSellerSubTab from './BestSellerSubTab';
import MonthlyRevenueSubTab from './MonthlyRevenueSubTab';

const StatisticTab = () => {
    const [activeTab, setActiveTab] = useState("revenue");

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">THỐNG KÊ</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row mt-4">
                    <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "revenue" ? "active" : ""}`}
                                onClick={() => setActiveTab("revenue")}
                            >
                                Doanh thu 
                            </button>
                        </li>

                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "bestSeller" ? "active" : ""}`}
                                onClick={() => setActiveTab("bestSeller")}
                            >
                                Sách bán chạy trong tháng
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="tab-content" style={{ flexGrow: 1 }}>
                    {activeTab === "revenue" && <MonthlyRevenueSubTab/>}
                    {activeTab === "bestSeller" && <BestSellerSubTab/>}
                </div>
            </div>
        </div>
    );
};

export default StatisticTab;
