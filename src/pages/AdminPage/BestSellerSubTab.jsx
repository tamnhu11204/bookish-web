import { useEffect, useState } from "react";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import PieChart from "../../components/PieChartComponent/PieChartComponent";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";

const BestSellingBooksSubTab = () => {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({ year: "2025", month: "" });
    const [productDetailsMap, setProductDetailsMap] = useState(new Map());
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await OrderService.getAllOrder();
                setOrders(response?.data || []);
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
        setIsDataFetched(false); // Reset khi thay đổi filter
    };

    const filteredData = orders.filter((item) => {
        const updatedAtDate = new Date(item.updatedAt);
        const itemYear = updatedAtDate.getFullYear().toString();
        const itemMonth = (updatedAtDate.getMonth() + 1).toString();
        return (
            itemYear === filters.year &&
            (filters.month === "" || itemMonth === filters.month)
        );
    });

    const productList = filteredData
        .flatMap((item) => item.orderItems)
        .reduce((acc, orderItem) => {
            if (!orderItem.product) return acc; // Bỏ qua nếu productId không hợp lệ
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
            setIsDataFetched(true);
            return;
        }

        const fetchProductDetails = async () => {
            setIsLoading(true);
            const productIds = [...productList.keys()];
            const productDetailsMap = new Map();

            await Promise.all(
                productIds.map(async (productId) => {
                    try {
                        const productDetail = await ProductService.getDetailProduct(productId);
                        if (productDetail?.data) {
                            const img = typeof productDetail.data.img === 'string'
                                ? productDetail.data.img
                                : productDetail.data.img?.[0] || '';
                            productDetailsMap.set(productId, {
                                ...productDetail.data,
                                img,
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching product details for ${productId}:`, error);
                    }
                })
            );

            setProductDetailsMap(productDetailsMap);
            setIsDataFetched(true);
            setIsLoading(false);
        };

        fetchProductDetails();
    }, [productList]);

    const chartData = [...productList.values()].map((product) => product.revenue);
    const chartLabels = [...productList.values()].map(
        (product) => productDetailsMap.get(product.productId)?.name || "Không xác định"
    );
    const chartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF"];

    return (
        <div className="container mt-5">
            {isLoading && <div className="text-center">Đang tải dữ liệu...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!isLoading && productList.size === 0 && isDataFetched && (
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

            {isDataFetched && productList.size > 0 && (
                <>
                    <div className="mb-4">
                        <PieChart data={chartData} labels={chartLabels} colors={chartColors} />
                    </div>

                    {/* Chỉ hiển thị bảng khi có dữ liệu */}
                    <table className="table custom-table" style={{ fontSize: "16px", marginTop: "20px" }}>
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
                                        <td>{filters.month || "Tất cả"}</td>
                                        <td>{filters.year}</td>
                                        <td>{product.productId}</td>
                                        <td>
                                            {productDetails?.img ? (
                                                <img
                                                    src={productDetails.img}
                                                    alt={productDetails.name || "Sản phẩm"}
                                                    style={{ width: "50px", height: "auto" }}
                                                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                                />
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td>{productDetails?.name || "Không xác định"}</td>
                                        <td>{product.amount}</td>
                                        <td>{product.revenue.toLocaleString()} VND</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default BestSellingBooksSubTab;