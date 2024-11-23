import React, { useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";

const MonthlyRevenueSubTab = () => {
    const [filters, setFilters] = useState({ year: "2024", month: "" });

    const revenueData = [
        { month: "January", year: 2024, revenue: 10000, quantity:10 },
        { month: "February", year: 2024, revenue: 12000 , quantity:10},
        { month: "March", year: 2024, revenue: 15000 , quantity:10},
        { month: "April", year: 2024, revenue: 8000, quantity:10 },
        { month: "May", year: 2024, revenue: 20000 , quantity:10},
        { month: "June", year: 2024, revenue: 17000 , quantity:10},
    ];

    const yearOptions = [
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
    ];

    const monthOptions = [
        { value: "", label: "All" },
        { value: "January", label: "January" },
        { value: "February", label: "February" },
        { value: "March", label: "March" },
        { value: "April", label: "April" },
        { value: "May", label: "May" },
        { value: "June", label: "June" },
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Lọc dữ liệu theo năm và tháng
    const filteredData = revenueData.filter((item) => {
        return (
            item.year.toString() === filters.year &&
            (filters.month === "" || item.month === filters.month)
        );
    });

    return (
        <div className="container mt-5">

            {/* Bộ lọc */}
            <div className="mb-4">
                <form className="row">
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Năm"
                            placeholder="Chọn năm"
                            options={yearOptions}
                            event={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    year: e.target.value,
                                }))
                            }
                            values={filters.year}
                        />
                    </div>
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Tháng"
                            placeholder="Chọn tháng"
                            options={monthOptions}
                            event={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    month: e.target.value,
                                }))
                            }
                            values={filters.month}
                        />
                    </div>
                </form>
            </div>

            {/* Bảng dữ liệu */}
            <table className="table table-striped" style={{fontSize:'16px'}}>
                <thead>
                    <tr>
                    <th scope="col" style={{ width: '10%' }}>Tháng</th>
                    <th scope="col" style={{ width: '10%' }}>Năm</th>
                    <th scope="col" style={{ width: '10%' }}>Doanh thu</th>
                    <th scope="col" style={{ width: '10%' }}>Số đơn hàng</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.month}</td>
                            <td>{item.year}</td>
                            <td>{item.revenue.toLocaleString()}</td>
                            <td>{item.quantity.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonthlyRevenueSubTab;
