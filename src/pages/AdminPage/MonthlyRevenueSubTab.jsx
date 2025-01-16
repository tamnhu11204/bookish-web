import React, { useEffect, useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as OrderService from "../../services/OrderService";
import PieChart from "../../components/PieChartComponent/PieChartComponent";

const MonthlyRevenueSubTab = () => {
    const [order, setOrder] = useState([]);
    const [filters, setFilters] = useState({ year: "2024", month: "" });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await OrderService.getAllOrder();
                setOrder(orders.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };
        fetchOrders();
    }, []);

    const monthOptions = [
        { value: "", label: "Tất cả" },
        { value: "1", label: "Tháng 1" },
        { value: "2", label: "Tháng 2" },
        { value: "3", label: "Tháng 3" },
        { value: "4", label: "Tháng 4" },
        { value: "5", label: "Tháng 5" },
        { value: "6", label: "Tháng 6" },
        { value: "7", label: "Tháng 7" },
        { value: "8", label: "Tháng 8" },
        { value: "9", label: "Tháng 9" },
        { value: "10", label: "Tháng 10" },
        { value: "11", label: "Tháng 11" },
        { value: "12", label: "Tháng 12" },
    ];

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from(
        { length: currentYear - 2024 + 1 },
        (_, index) => ({
            value: (2024 + index).toString(),
            label: (2024 + index).toString(),
        })
    );

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredData = order.filter((item) => {
        const updatedAtDate = new Date(item.updatedAt);
        const itemYear = updatedAtDate.getFullYear().toString();
        const itemMonth = (updatedAtDate.getMonth() + 1).toString();

        return (
            itemYear === filters.year &&
            (filters.month === "" || itemMonth === filters.month)
        );
    });

    const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalMoney, 0);
    const totalOrders = filteredData.length;

    // Lọc ra các tháng có dữ liệu
    const monthsWithData = Array.from(
        new Set(filteredData.map(item => new Date(item.updatedAt).getMonth())) // Set loại bỏ trùng
    );

    // Tính tổng doanh thu từng tháng chỉ cho các tháng có dữ liệu
    const monthlyRevenue = monthsWithData.map((month) => {
        return filteredData
            .filter((item) => new Date(item.updatedAt).getMonth() === month)
            .reduce((sum, item) => sum + item.totalMoney, 0);
    });

    // Cập nhật labels chỉ cho các tháng có dữ liệu
    const labels = monthsWithData.map((month) => `Tháng ${month + 1}`);

    // Màu sắc ngẫu nhiên cho từng tháng
    const colors = monthsWithData.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <form className="row">
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Năm"
                            placeholder="Chọn năm"
                            options={yearOptions}
                            selectedValue={filters.year}
                            onChange={handleFilterChange}
                            name="year"
                        />
                    </div>
                    <div className="col-md-6">
                        <FormSelectComponent
                            label="Tháng"
                            placeholder="Chọn tháng"
                            options={monthOptions}
                            selectedValue={filters.month}
                            onChange={handleFilterChange}
                            name="month"
                        />
                    </div>
                </form>
            </div>

            <div className="mb-4" >
                <h5 style={{ fontSize: "16px" }}>Tổng Doanh Thu: {totalRevenue.toLocaleString()} VND</h5>
                <h5 style={{ fontSize: "16px" }}>Tổng Số Đơn Hàng: {totalOrders.toLocaleString()}</h5>
            </div>

            {/* Hiển thị biểu đồ nếu chỉ chọn năm */}
            {filters.month === "" && (
                <PieChart
                    data={monthlyRevenue}
                    labels={labels}
                    colors={colors}
                />
            )}

            <table className="table table-striped" style={{ fontSize: "16px", marginTop:'20px' }}>
                <thead>
                    <tr>
                        <th scope="col">Tháng</th>
                        <th scope="col">Năm</th>
                        <th scope="col">Doanh thu</th>
                        <th scope="col">Số sản phẩm bán được</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => {
                        const updatedAtDate = new Date(item.updatedAt);
                        const itemMonth = updatedAtDate.getMonth() + 1;
                        const itemYear = updatedAtDate.getFullYear();

                        return (
                            <tr key={index}>
                                <td>{itemMonth}</td>
                                <td>{itemYear}</td>
                                <td>{item.totalMoney.toLocaleString()}</td>
                                <td>{item.orderItems.length}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MonthlyRevenueSubTab;
