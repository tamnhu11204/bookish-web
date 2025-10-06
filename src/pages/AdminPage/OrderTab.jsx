import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from '../../components/FormSelectComponent/FormSelectComponent';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as ActiveService from '../../services/OptionService/ActiveService';
import * as OrderActiveListService from '../../services/OrderActiveListService';
import * as OrderService from '../../services/OrderService';
import './AdminPage.css';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import { useNavigate } from 'react-router-dom';
import EnhancedModalComponent from '../../components/EnhancedModalComponent/EnhancedModalComponent';

const OrderTab = () => {
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();

    // State quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedActive, setSelectedActive] = useState("");
    const [initialShippingCode, setInitialShippingCode] = useState(""); 

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder();
        console.log("Dữ liệu đơn hàng:", res.data); // Thêm log ở đây
        return res.data;
    };

    const { isLoading: isLoadingOrder, data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrder,
    });

    console.log("Is Loading Orders:", isLoadingOrder);
    console.log("Orders Data:", orders);

    const getAllActive = async () => {
        const res = await ActiveService.getAllActive();
        return res?.data || [];
    };

    const { isLoading: isLoadingActive, data: actives } = useQuery({
        queryKey: ["actives"],
        queryFn: getAllActive,
    });

    const allActives = Array.isArray(actives)
        ? actives.map((active) => ({
            value: active.name,
            label: active.name,
        }))
        : [];

    //const handleOnChangeActive = (e) => setSelectedActive(e.target.value);

    const handleActive = (id,shipmentCode,activeNow) => {
        setSelectedOrder(id);
        setShowModal(true);
        setInitialShippingCode(shipmentCode);
        setSelectedActive(activeNow);
    };

    const resetForm = () => {
        setSelectedActive('');
        setSelectedOrder('');
    };

    const mutation = useMutationHook(({ orderId, data }) =>
        OrderActiveListService.updateOrderActive(orderId, data)
    );

    const { data: mutationData, isSuccess, isError } = mutation;

    useEffect(() => {
        if (isSuccess && mutationData?.status !== 'ERR') {
            message.success();
            alert('Cập nhật trạng thái thành công!');
            resetForm();
            setShowModal(false);
        } else if (isError) {
            message.error();
        }
    }, [mutationData, isError, isSuccess]);

    const onSave = async () => {
    const payload = { active: selectedActive, date: new Date() ,shipmentCode: initialShippingCode};
    console.log('Payload sent:', { orderId: selectedOrder, data: payload });
    mutation.mutate({ orderId: selectedOrder, data: payload });

    try {
        const response = await OrderService.updateActiveOrderNow(selectedOrder, payload);
        console.log('Order updated successfully:', response);
        if (response.emailSent) {
            alert('Email đã được gửi thành công!');
        } else if (response.emailError) {
            alert('Gửi email thất bại: ' + response.emailError);
        } else {
            alert('Trạng thái đơn hàng đã được cập nhật!');
        }
    } catch (error) {
        console.error('Error updating order:', error);
    }
};

    const onCancel = () => {
        alert('Hủy thao tác!');
        resetForm();
        setShowModal(false);
    };

    const handleDetail = (id) => {
        navigate(`/order-detail/${id}`);
    };

    // Lọc đơn hàng theo activeTab
    const filteredOrders = orders?.filter((order) => {
        if (activeTab === "all") return true;
        if (activeTab === "delivering" && order.activeNow === "Đang vận chuyển") return true;
        if (activeTab === "complete" && order.activeNow === "Đã hoàn thành") return true;
        if (activeTab === "cancel" && order.activeNow === "Đã hủy") return true;
        return false;
    });

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">DANH SÁCH ĐƠN HÀNG</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    <div className="row mt-4">
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
                        </div>
                    </div>
                </div>

                <div className="content-section" style={{ marginTop: '30px' }}>
                    <table className="table custom-table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Mã</th>
                                <th scope="col">Khách hàng</th>
                                <th scope="col">Ngày đặt</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody className="table-content">
                            {isLoadingOrder ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <LoadingComponent isLoading={isLoadingOrder} />
                                    </td>
                                </tr>
                            ) : filteredOrders && filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.name}</td>
                                        <td>{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                                        <td>{order.totalMoney.toLocaleString()}</td>
                                        <td>{order.activeNow}</td>
                                        <td>
                                            <ButtonComponent
                                                textButton="Duyệt"
                                                onClick={() => handleActive(order._id,order.shipmentCode,order.activeNow)}
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
                                    <td colSpan="6" className="text-center">
                                        Không có dữ liệu để hiển thị.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                

                <EnhancedModalComponent
                    isOpen={showModal}
                    title="TRẠNG THÁI ĐƠN HÀNG"
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
        </div>
    );
};

export default OrderTab;

