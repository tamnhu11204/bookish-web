import { useQuery, useQueryClient } from '@tanstack/react-query';
import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import * as message from "../../components/MessageComponent/MessageComponent";
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as FeedbackService from '../../services/FeedbackService';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService';
import * as UserEventService from '../../services/UserEventService';

const OrderTab = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State quản lý tab và dữ liệu
    const [activeTab, setActiveTab] = useState("all");
    const [productDetails, setProductDetails] = useState({});

    // --- STATE QUẢN LÝ MODAL ĐÁNH GIÁ ---
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [currentProductForFeedback, setCurrentProductForFeedback] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState('');

    // --- STATE CHO FORM BÊN TRONG MODAL (ĐÃ SỬA) ---
    const [starRating, setStarRating] = useState(5);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [imageFile, setImageFile] = useState(null);       // Sẽ lưu File object
    const [previewImage, setPreviewImage] = useState(null); // Sẽ lưu URL để hiển thị

    // --- LẤY DỮ LIỆU ĐƠN HÀNG VÀ SẢN PHẨM ---
    const { isLoading: isLoadingOrders, data: orders = [] } = useQuery({
        queryKey: ["orders", user?.id],
        queryFn: () => OrderService.getAllOrderByUser(user?.id),
        select: (data) => data.data || [],
        enabled: !!user?.id,
    });

    useEffect(() => {
        const fetchAllProductDetails = async () => {
            if (orders.length === 0) return;
            const allProductIds = [...new Set(orders.flatMap(order => order.orderItems.map(item => item.product)))];
            const productPromises = allProductIds.map(id =>
                ProductService.getDetailProduct(id).catch(() => ({ data: { _id: id, error: true, name: 'Sản phẩm không tồn tại' } }))
            );
            const productResults = await Promise.all(productPromises);
            const detailsMap = productResults.reduce((acc, result) => {
                if (result.data) acc[result.data._id] = result.data;
                return acc;
            }, {});
            setProductDetails(detailsMap);
        };
        fetchAllProductDetails();
    }, [orders]);

    // --- LOGIC MỞ/ĐÓNG MODAL ---
    const handleOpenFeedbackModal = (productDetail, orderId) => {
        setCurrentProductForFeedback(productDetail);
        setCurrentOrderId(orderId);
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        // Reset toàn bộ state của form khi đóng
        setStarRating(5);
        setFeedbackContent('');
        setImageFile(null);
        setPreviewImage(null);
        setCurrentProductForFeedback(null);
        setCurrentOrderId('');
    };

    // --- LOGIC XỬ LÝ ẢNH (ĐÚNG CHUẨN) ---
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success(result) {
                    setImageFile(result); // Lưu File object đã nén
                    setPreviewImage(URL.createObjectURL(result)); // Tạo URL tạm thời để xem trước
                },
                error(err) { console.error("Image Compression Error:", err); }
            });
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewImage(null);
    };

    // --- LOGIC GỬI ĐÁNH GIÁ (DÙNG FORMDATA) ---
    const addFeedbackMutation = useMutationHook(
        (formData) => FeedbackService.addFeedback(formData)
    );

    const handleSaveFeedback = () => {
    if (!currentProductForFeedback) return;

    const formData = new FormData();
    formData.append('star', starRating);
    formData.append('content', feedbackContent);
    formData.append('user', user.id);
    formData.append('product', currentProductForFeedback._id);

    if (imageFile) {
        formData.append('img', imageFile); // Thêm file ảnh thật vào FormData
    }

    addFeedbackMutation.mutate(formData, {
        onSuccess: async (response) => {
            message.success("Gửi đánh giá thành công!");

            // 🟢 Ghi nhận sự kiện tạo đánh giá
            try {
                
                await UserEventService.trackUserEvent({
                    eventType: 'create_feedback',     // loại sự kiện
                    productId: currentProductForFeedback._id,
                    userId: user?.id || null,
                    
                });
            } catch (error) {
                console.error('Error tracking feedback creation event:', error);
            }

            // ⚙️ Các bước logic gốc
            await ProductService.updateRating(currentProductForFeedback._id, { star: starRating });
            await OrderService.updateIsFeedback(currentOrderId, currentProductForFeedback._id);
            queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
            handleCloseFeedbackModal();
        },
        onError: (error) => {
            console.error('Error saving feedback:', error);
            message.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    });
};

    // --- CÁC HÀM XỬ LÝ KHÁC ---
    const handleCancelOrder = async (orderID) => {
        if (!orderID) return;
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
            try {
                await OrderService.updateCancel(orderID);
                await OrderService.updateActiveOrderNow(orderID, "Đã hủy");
                message.success('Hủy đơn hàng thành công!');
                queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
            } catch (error) {
                console.error('Error canceling order:', error);
                message.error('Hủy đơn hàng thất bại.');
            }
        }
    };

    const handleDetailOrder = (orderId) => {
        navigate(`/order-detail/${orderId}`);
    };

    if (isLoadingOrders) {
        return <div>Đang tải dữ liệu đơn hàng...</div>;
    }

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ ĐƠN HÀNG</h3>
            </div>
            <div className="content-section">
                <div className="row align-items-center mb-3">
                    <div className="col-12">
                        <ul className="nav nav-tabs" style={{ marginTop: '20px' }}>
                            <li className="nav-item">
                                <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>Tất cả</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="tab-content" style={{ flexGrow: 1, fontSize: '16px' }}>
                    {orders.length === 0 && <p>Bạn chưa có đơn hàng nào.</p>}
                    {orders.map((order) => (
                        <div className="card mb-3" key={order._id}>
                            <div className={`card-header ${order.isCancel ? "text-danger" : (order.status === "Đã hoàn thành" ? "text-success" : "text-primary")}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>{order.isCancel ? "Đã hủy" : order.status}</strong>
                                    <ButtonComponent2 textButton="Chi tiết" onClick={() => handleDetailOrder(order._id)} />
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Số lượng</th>
                                            <th>Tổng tiền</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.orderItems.map((item) => {
                                            const productDetail = productDetails[item.product];
                                            if (!productDetail) return <tr key={item.product}><td>Đang tải thông tin sản phẩm...</td></tr>;
                                            return (
                                                <tr key={item.product}>
                                                    <td className="d-flex align-items-center">
                                                        <img
                                                            src={productDetail?.img?.[0] || "https://via.placeholder.com/100"}
                                                            alt={productDetail?.name}
                                                            className="img-thumbnail me-3"
                                                            style={{ width: "80px", height: '80px', objectFit: 'cover' }}
                                                        />
                                                        {productDetail?.name}
                                                    </td>
                                                    <td>{item.price.toLocaleString()} đ</td>
                                                    <td>{item.amount}</td>
                                                    <td>{(item.amount * item.price).toLocaleString()} đ</td>
                                                    <td>
                                                        {order.activeNow === 'Đã hoàn thành' && !order.isCancel && (
                                                            item.isFeedback ? (
                                                                <span className="text-success fw-bold">Đã đánh giá</span>
                                                            ) : (
                                                                <ButtonComponent2
                                                                    textButton="Đánh giá"
                                                                    onClick={() => handleOpenFeedbackModal(productDetail, order._id)}
                                                                />
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <p>Tổng số tiền: <strong>{order.totalMoney.toLocaleString()} đ</strong></p>
                            </div>
                            {!order.isCancel && order.status !== "Đã hoàn thành" && (
                                <div className="card-footer text-end">
                                    <ButtonComponent textButton="Hủy đơn" onClick={() => handleCancelOrder(order._id)} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ModalComponent
                isOpen={isFeedbackModalOpen}
                title="ĐÁNH GIÁ SẢN PHẨM"
                body={
                    <>
                        {currentProductForFeedback && (
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={currentProductForFeedback.img?.[0]}
                                    alt="Product"
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: 'auto' }}
                                />
                                <h6 style={{ fontSize: '20px', marginLeft: '10px' }}>{currentProductForFeedback.name}</h6>
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label">Chất lượng sản phẩm</label>
                            <div className="d-flex" style={{ fontSize: '2rem' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`mr-1 ${starRating >= star ? 'text-warning' : 'text-muted'}`}
                                        style={{ cursor: 'pointer', marginRight: '5px' }}
                                        onClick={() => setStarRating(star)}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nội dung sản phẩm:</label>
                            <textarea style={{ fontSize: '16px' }}
                                className="form-control"
                                rows="3"
                                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé!"
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center position-relative" style={{ height: "150px" }}>
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: 'contain' }} />
                                        <button
                                            type="button"
                                            className="btn-close position-absolute top-0 end-0 bg-light rounded-circle"
                                            style={{ transform: 'translate(30%, -30%)', border: '1px solid #ccc' }}
                                            onClick={handleRemoveImage}
                                        ></button>
                                    </>
                                ) : (
                                    <span className="text-muted">Thêm hình ảnh</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="image"
                                className="form-control mt-2"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </>
                }
                textButton1="Gửi đánh giá"
                onClick1={handleSaveFeedback}
                onClick2={handleCloseFeedbackModal}
                disabled1={addFeedbackMutation.isPending}
            />
        </div>
    );
};

export default OrderTab;