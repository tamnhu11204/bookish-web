import React, { useEffect, useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as OrderService from "../../services/OrderService";
import PieChart from "../../components/PieChartComponent/PieChartComponent";

const MonthlyRevenueSubTab = () => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({ year: "2025", month: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await OrderService.getAllOrder();
                const fetchedOrders = response?.data || [];
                setOrders(fetchedOrders);
                console.log("Fetched orders:", fetchedOrders); // Debug dữ liệu API
                setIsDataFetched(true);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Không thể tải dữ liệu đơn hàng.");
            } finally {
                setIsLoading(false);
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
        setIsDataFetched(false); // Reset để tải lại dữ liệu
    };

    const filteredData = orders.filter((item) => {
        if (!item.updatedAt) {
            console.warn("Order missing updatedAt:", item); // Debug đơn hàng lỗi
            return false;
        }
        const updatedAtDate = new Date(item.updatedAt);
        if (isNaN(updatedAtDate.getTime())) {
            console.warn("Invalid updatedAt date:", item.updatedAt); // Debug ngày không hợp lệ
            return false;
        }
        const itemYear = updatedAtDate.getFullYear().toString();
        const itemMonth = (updatedAtDate.getMonth() + 1).toString();
        return (
            itemYear === filters.year &&
            (filters.month === "" || itemMonth === filters.month)
        );
    });

    useEffect(() => {
        console.log("Filtered data:", filteredData); // Debug dữ liệu sau lọc
        setIsDataFetched(true); // Cập nhật lại sau khi lọc
    }, [filteredData]);

    const totalRevenue = filteredData.reduce((sum, item) => sum + (item.totalMoney || 0), 0);
    const totalOrders = filteredData.length;

    // Lọc ra các tháng có dữ liệu (chỉ khi chọn "Tất cả" tháng)
    const monthsWithData = Array.from(
        new Set(filteredData.map((item) => new Date(item.updatedAt).getMonth()))
    );

    // Tính tổng doanh thu từng tháng chỉ cho các tháng có dữ liệu
    const monthlyRevenue = monthsWithData.map((month) => {
        return filteredData
            .filter((item) => new Date(item.updatedAt).getMonth() === month)
            .reduce((sum, item) => sum + (item.totalMoney || 0), 0);
    });

    // Cập nhật labels chỉ cho các tháng có dữ liệu
    const labels = monthsWithData.map((month) => `Tháng ${month + 1}`);

    // Màu sắc cố định
    const colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#FF9F40",
        "#9966FF",
        "#FF6B6B",
        "#4CAF50",
        "#FFD700",
        "#00CED1",
        "#FF4500",
        "#6A5ACD",
    ].slice(0, monthsWithData.length);

    return (
        <div className="container mt-5">
            {isLoading && <div className="text-center">Đang tải dữ liệu...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!isLoading && isDataFetched && filteredData.length === 0 && (
                <div className="alert alert-info">Không có dữ liệu để hiển thị.</div>
            )}

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

            {isDataFetched && filteredData.length > 0 && (
                <div className="mb-4">
                    <h5 style={{ fontSize: "16px" }}>
                        Tổng Doanh Thu: {totalRevenue.toLocaleString()} VND
                    </h5>
                    <h5 style={{ fontSize: "16px" }}>
                        Tổng Số Đơn Hàng: {totalOrders.toLocaleString()}
                    </h5>
                </div>
            )}

            {isDataFetched && filteredData.length > 0 && filters.month === "" && (
                <div className="mb-4">
                    <PieChart data={monthlyRevenue} labels={labels} colors={colors} />
                </div>
            )}

            {isDataFetched && filteredData.length > 0 && (
                <table className="table custom-table" style={{ fontSize: "16px", marginTop: "20px" }}>
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
                                    <td>{(item.totalMoney || 0).toLocaleString()} VND</td>
                                    <td>{item.orderItems?.length || 0}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MonthlyRevenueSubTab;