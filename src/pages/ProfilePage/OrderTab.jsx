// OrderTab.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService'; // Import ProductService
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const OrderTab = () => {
    const user = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState("all");
    const [productDetails, setProductDetails] = useState({});

    const getAllOrderActive = async (id) => {
        const res = await OrderService.getAllOrderByUser(id);
        return res?.data;
    };

    const { isLoading: isLoadingOrders, data: orders } = useQuery(
        ["orders", user?.id],
        () => getAllOrderActive(user?.id)
    );

    useEffect(() => {
        if (orders && orders.length > 0) {
            const fetchProductDetails = async (orderItems) => {
                const productData = await Promise.all(
                    orderItems.map(async (item) => {
                        try {
                            const productDetail = await ProductService.getDetailProduct(item.product);
                            return { productId: item.product, ...productDetail.data };
                        } catch (error) {
                            console.error("Error fetching product details:", error);
                            return { productId: item.product, error: true };
                        }
                    })
                );
                setProductDetails((prev) => {
                    const updatedDetails = {};
                    productData.forEach((product) => {
                        updatedDetails[product.productId] = product;
                    });
                    return { ...prev, ...updatedDetails };
                });
            };

            // Iterate through all orders and their items to fetch product details
            orders.forEach(order => {
                if (order.orderItems && order.orderItems.length > 0) {
                    fetchProductDetails(order.orderItems);
                }
            });
        }
    }, [orders]); // Run this effect whenever orders change

    if (isLoadingOrders) {
        return <div>Đang tải dữ liệu đơn hàng...</div>;
    }

    const handleCancelOrder = async (orderId) => {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa đơn vị này?");
        if (isConfirmed) {
            await OrderService.updateCancel(orderId);
        }
    };

    const handleFeedback = (orderId) => {
        // Handle feedback logic here
    }

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ ĐƠN HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {/* Tabs */}
                    <div className="col-12">
                        <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                                    onClick={() => setActiveTab("all")}
                                >
                                    Tất cả
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "complete" ? "active" : ""}`}
                                    onClick={() => setActiveTab("complete")}
                                >
                                    Đã hoàn thành
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "cancel" ? "active" : ""}`}
                                    onClick={() => setActiveTab("cancel")}
                                >
                                    Đã hủy
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1 }}>
                    <div className="tab-pane fade show active">
                        {orders.map((order, index) => (
                            <div className="card mb-3" key={index}>
                                {/* Kiểm tra nếu isCancel === true thì hiển thị "Đã hủy" trong card-header */}
                                {order.isCancel !== true ? (
                                    <div className={`card-header ${order.activeNow === "Đã hoàn thành" ? "text-success" : "text-primary"}`}>
                                        <strong>{order.activeNow}</strong>
                                    </div>
                                ) : (
                                    <div className="card-header text-danger">
                                        <strong>Đã hủy</strong>
                                    </div>
                                )}

                                {/* Lặp qua các sản phẩm trong orderItems */}
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map((item, itemIndex) => {
                                                const productDetail = productDetails[item.product];
                                                return (
                                                    <tr key={itemIndex}>
                                                        <td className="d-flex align-items-center">
                                                            <img
                                                                src={productDetail?.img || "https://via.placeholder.com/100"}
                                                                alt={productDetail?.name}
                                                                className="img-thumbnail me-3"
                                                                style={{ width: "80px" }}
                                                            />
                                                            {productDetail?.name || item.title}
                                                        </td>
                                                        <td>{(productDetail?.price || item.price).toLocaleString()} đ</td>
                                                        <td>{item.amount}</td>
                                                        <td>{(item.amount * (productDetail?.price || item.price)).toLocaleString()} đ</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <p>Tổng số tiền: <strong>{order.totalMoney.toLocaleString()} đ</strong></p>
                                </div>

                                {/* Kiểm tra nếu đơn hàng chưa bị hủy mới hiển thị phần này */}
                                {order.isCancel !== true && (
                                    <div className="text-end">
                                        {order.activeNow === "Đã hoàn thành" ? (
                                            <ButtonComponent
                                                textButton="Đánh giá"
                                                onClick={() => handleFeedback(order._id)} />
                                        ) : (
                                            <ButtonComponent
                                                textButton="Hủy đơn"
                                                onClick={() => handleCancelOrder(order._id)} />
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTab;
