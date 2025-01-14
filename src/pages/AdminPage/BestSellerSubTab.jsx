import React, { useEffect, useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";
import PieChart from "../../components/PieChartComponent/PieChartComponent";


const BestSellingBooksSubTab = () => {
    const [order, setOrder] = useState([]);
    const [filters, setFilters] = useState({ year: "2024", month: "" });
    const [productDetailsMap, setProductDetailsMap] = useState(new Map());
    const [isDataFetched, setIsDataFetched] = useState(false);

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
            item.activeNow === "Đã hoàn thành" &&
            itemYear === filters.year &&
            (filters.month === "" || itemMonth === filters.month)
        );
    });

    // Lọc và gộp các sản phẩm từ các order
    const productList = filteredData.flatMap((item) => item.orderItems)
        .reduce((acc, orderItem) => {
            const existingProduct = acc.get(orderItem.product);
            if (existingProduct) {
                existingProduct.amount += orderItem.amount;
                existingProduct.revenue += orderItem.amount * (orderItem.price || 0);
            } else {
                acc.set(orderItem.product, {
                    productId: orderItem.product,
                    amount: orderItem.amount,
                    revenue: orderItem.amount * (orderItem.price || 0),
                });
            }
            return acc;
        }, new Map());

    useEffect(() => {
        if (productList.size === 0) {
            return;
        }

        const fetchProductDetails = async () => {
            const productIds = [...productList.keys()]; // Lấy các productId duy nhất
            const productDetailsMap = new Map();

            await Promise.all(
                productIds.map(async (productId) => {
                    try {
                        const productDetail = await ProductService.getDetailProduct(productId);
                        if (productDetail && productDetail.data) {
                            productDetailsMap.set(productId, productDetail.data);
                        }
                    } catch (error) {
                        console.error("Error fetching product details for", productId, error);
                    }
                })
            );

            setProductDetailsMap(productDetailsMap);
            setIsDataFetched(true);
        };

        fetchProductDetails();
    }, [productList]);

    // Chuẩn bị dữ liệu cho PieChart
    const chartData = [...productList.values()].map((product) => product.revenue);
    const chartLabels = [...productList.values()].map(
        (product) => productDetailsMap.get(product.productId)?.name || "N/A"
    );
    const chartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF"];

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

            <div className="mb-4">
                <PieChart data={chartData} labels={chartLabels} colors={chartColors} />
            </div>

            <table className="table table-striped" style={{ fontSize: "16px", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th scope="col">Tháng</th>
                        <th scope="col">Năm</th>
                        <th scope="col">Mã sách</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tên sản phẩm</th>
                        <th scope="col">Số lượng bán</th>
                        <th scope="col">Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {[...productList.values()].map((product, idx) => {
                        const productDetails = productDetailsMap.get(product.productId);
                        return (
                            <tr key={idx}>
                                <td>{filters.month}</td>
                                <td>{filters.year}</td>
                                <td>{product.productId}</td>
                                <td>
                                    {productDetails ? (
                                        <img
                                            src={productDetails.img}
                                            alt={productDetails.name}
                                            style={{ width: "50px" }}
                                        />
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>{productDetails ? productDetails.name : "N/A"}</td>
                                <td>{product.amount}</td>
                                <td>{product.revenue.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BestSellingBooksSubTab;
