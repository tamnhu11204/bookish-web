import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import EnhancedModalComponent from '../../components/EnhancedModalComponent/EnhancedModalComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from '../../hooks/useMutationHook';
import * as ActiveService from '../../services/OptionService/ActiveService';
import * as OrderActiveListService from '../../services/OrderActiveListService';
import * as OrderService from '../../services/OrderService';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';

const OrderTab = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    // State modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedActive, setSelectedActive] = useState("");
    const [initialShippingCode, setInitialShippingCode] = useState("");

    // ==================== LẤY DANH SÁCH ĐƠN HÀNG ====================
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder();
        return res.data || [];
    };

    const { isLoading: isLoadingOrder, data: orders = [] } = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrder,
    });

    // ==================== LẤY DANH SÁCH TRẠNG THÁI ====================
    const getAllActive = async () => {
        const res = await ActiveService.getAllActive();
        return res?.data || [];
    };

    const { data: actives = [] } = useQuery({
        queryKey: ["actives"],
        queryFn: getAllActive,
    });

    const allActives = actives.map((active) => ({
        value: active.name,
        label: active.name,
    }));

    // ==================== LỌC ĐƠN HÀNG THEO TAB ====================
    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;
        if (activeTab === "delivering" && order.activeNow === "Đang vận chuyển") return true;
        if (activeTab === "complete" && order.activeNow === "Đã hoàn thành") return true;
        if (activeTab === "cancel" && order.activeNow === "Đã hủy") return true;
        return false;
    });

    // ==================== PHÂN TRANG ====================
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Tạo số trang thông minh
    const generatePageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2);
            if (currentPage > 4) pages.push('...');
            const start = Math.max(3, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages - 1, totalPages);
        }
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    // Reset trang khi đổi tab
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    // ==================== XỬ LÝ MODAL ====================
    const handleActive = (id, shipmentCode, activeNow) => {
        setSelectedOrder(id);
        setInitialShippingCode(shipmentCode || "");
        setSelectedActive(activeNow || "");
        setShowModal(true);
    };

    const resetForm = () => {
        setSelectedOrder(null);
        setSelectedActive("");
        setInitialShippingCode("");
    };

    const mutation = useMutationHook(({ orderId, data }) =>
        OrderActiveListService.updateOrderActive(orderId, data)
    );

    const { isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess) {
            message.success('Cập nhật trạng thái thành công!');
            resetForm();
            setShowModal(false);
        } else if (isError) {
            message.error('Cập nhật thất bại');
        }
    }, [isSuccess, isError]);

    const onSave = async () => {
        if (!selectedOrder || !selectedActive) return;

        const payload = {
            active: selectedActive,
            date: new Date(),
            shipmentCode: initialShippingCode
        };

        mutation.mutate({ orderId: selectedOrder, data: payload });

        try {
            const response = await OrderService.updateActiveOrderNow(selectedOrder, payload);
            if (response.emailSent) {
                alert('Email thông báo đã được gửi thành công!');
            } else if (response.emailError) {
                alert('Gửi email thất bại: ' + response.emailError);
            }
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái:', error);
        }
    };

    const onCancel = () => {
        resetForm();
        setShowModal(false);
    };

    const handleDetail = (id) => {
        navigate(`/order-detail/${id}`);
    };

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH SÁCH ĐƠN HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4">
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
                            className={`nav-link ${activeTab === "delivering" ? "active" : ""}`}
                            onClick={() => setActiveTab("delivering")}
                        >
                            Đang vận chuyển
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

                {/* Bảng đơn hàng */}
                <table className="table custom-table">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ width: '15%' }}>Mã đơn</th>
                            <th scope="col" style={{ width: '20%' }}>Khách hàng</th>
                            <th scope="col" style={{ width: '15%' }}>Ngày đặt</th>
                            <th scope="col" style={{ width: '15%' }}>Tổng tiền</th>
                            <th scope="col" style={{ width: '15%' }}>Trạng thái</th>
                            <th scope="col" style={{ width: '10%' }}>Duyệt</th>
                            <th scope="col" style={{ width: '10%' }}>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody className="table-content">
                        {isLoadingOrder ? (
                            <tr>
                                <td colSpan="7" className="text-center py-5">
                                    <LoadingComponent />
                                </td>
                            </tr>
                        ) : currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.name || 'Khách vãng lai'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td>{order.totalMoney?.toLocaleString('vi-VN')} đ</td>
                                    <td>
                                        <span className={`badge ${order.activeNow === "Đang vận chuyển" ? "bg-warning" :
                                                order.activeNow === "Đã hoàn thành" ? "bg-success" :
                                                    order.activeNow === "Đã hủy" ? "bg-danger" :
                                                        "bg-secondary"
                                            }`}>
                                            {order.activeNow}
                                        </span>
                                    </td>
                                    <td>
                                        <ButtonComponent
                                            textButton="Duyệt"
                                            onClick={() => handleActive(order._id, order.shipmentCode, order.activeNow)}
                                        />
                                    </td>
                                    <td>
                                        <ButtonComponent2
                                            textButton="Chi tiết"
                                            onClick={() => handleDetail(order._id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-5">
                                    Không có đơn hàng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-category d-flex justify-content-center gap-2 mt-4 mb-5">
                        {currentPage > 1 && (
                            <ButtonComponent2
                                textButton="Trước"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            />
                        )}

                        {pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return <ButtonComponent2 key={`ellipsis-${index}`} textButton="..." disabled />;
                            }

                            return currentPage === page ? (
                                <ButtonComponent
                                    key={page}
                                    textButton={String(page)}
                                    onClick={() => setCurrentPage(page)}
                                />
                            ) : (
                                <ButtonComponent2
                                    key={page}
                                    textButton={String(page)}
                                    onClick={() => setCurrentPage(page)}
                                />
                            );
                        })}

                        {currentPage < totalPages && (
                            <ButtonComponent2
                                textButton="Tiếp"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Modal cập nhật trạng thái */}
            <EnhancedModalComponent
                isOpen={showModal}
                title="CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG"
                selectedOrder={selectedOrder}
                allActives={allActives}
                initialStatus={selectedActive}
                initialShippingCode={initialShippingCode}
                textButton1="Cập nhật"
                onClick1={onSave}
                onClick2={onCancel}
                isLoading={mutation.isLoading}
            />
        </div>
    );
};

export default OrderTab;