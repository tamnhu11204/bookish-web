// OrderTab.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as FeedbackService from '../../services/FeedbackService';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService'; // Import ProductService
import ButtonComponent2 from '../../components/ButtonComponent/ButtonComponent2';
import { useNavigate } from 'react-router-dom';
import * as OrderActiveListService from '../../services/OrderActiveListService';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as message from "../../components/MessageComponent/MessageComponent";


const OrderTab = () => {
    const user = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState("all");
    const [productDetails, setProductDetails] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [img, setImg] = useState(null);
    const [name, setName] = useState(null);
    const [imgPro, setImgPro] = useState(null);
    const [starRating, setStarRating] = useState(0);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [selectedPro, setSelectedPro] = useState('');
    const [selectedOrder, setOrderId] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success(result) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setImg(reader.result);
                    };
                    reader.readAsDataURL(result);
                },
                error(err) {
                    console.error(err);
                }
            });
        }
    };

    const handleStarClick = (rating) => {
        setStarRating(rating);
    };


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

            orders.forEach(order => {
                if (order.orderItems && order.orderItems.length > 0) {
                    fetchProductDetails(order.orderItems);
                }
            });
        }
    }, [orders]);

        const mutation = useMutationHook(({ orderId, data }) =>
            OrderActiveListService.updateOrderActive(orderId, data)
        );
    
        const { data: mutationData, isSuccess, isError } = mutation;

    
    useEffect(() => {
        if (isSuccess && mutationData?.status !== 'ERR') {
            message.success();
            alert('Cập nhật trạng thái thành công!');
            setShowModal(false);
        } else if (isError) {
            message.error();
        }
    }, [mutationData, isError, isSuccess]);

    if (isLoadingOrders) {
        return <div>Đang tải dữ liệu đơn hàng...</div>;
    }


    const handleCancelOrder = async (orderID) => {
        // Kiểm tra orderID có hợp lệ không
        if (!orderID || typeof orderID !== 'string') {
            console.error('Invalid orderID:', orderID);
            return;
        }

        // Xác nhận với người dùng trước khi hủy đơn hàng
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");

        // Nếu người dùng xác nhận
        if (isConfirmed) {
            try {
                // Cập nhật trạng thái đơn hàng là đã hủy
                const cancelResponse = await OrderService.updateCancel(orderID);
                if (cancelResponse?.status === 'OK') {
                    console.log('Order canceled successfully');

                    const payload = {
                        active: "Đã hủy",
                        date: new Date(),
                    };
                    mutation.mutate({ orderId: orderID, data: payload });


                    // Tiến hành cập nhật trạng thái hoạt động của đơn hàng
                    const updateActiveOrderNowResponse = await OrderService.updateActiveOrderNow(orderID, "Đã hủy");
                    if (updateActiveOrderNowResponse?.status === 'OK') {
                        console.log('Order active status updated to "Đã hủy"');
                    } else {
                        console.error('Failed to update active order status:', updateActiveOrderNowResponse?.message);
                    }


                } else {
                    console.error('Failed to cancel order:', cancelResponse?.message);
                }

            } catch (error) {
                console.error('Error during cancel operation:', error);
            }
        } else {
            console.log('Order cancellation was canceled by the user.');
        }
    };


      

    const handleDetailOrder = async (orderId) => {
        navigate(`/order-detail/${orderId}`)
    };

    const handleFeedback = (product, orderId) => {
        setShowModal(true);
        setName(product.name);
        setImgPro(product.img);
        setSelectedPro(product._id);
        setOrderId(orderId);
    }

    const onSave = async () => {
        try {
            const feedbackData = {
                star: starRating,
                content: feedbackContent,
                img: img,
                user: user.id,
                product: selectedPro,
            };

            console.log('feedbackData:', feedbackData);

            // Thêm feedback cho sản phẩm
            const response = await FeedbackService.addFeedback(feedbackData);
            if (response) {
                alert('Đánh giá thành công!');

                const updateResponse = await ProductService.updateRating(selectedPro, { starRating });

                if (updateResponse) {
                    console.log('Cập nhật số sao thành công:', updateResponse);
                } else {
                    console.error('Cập nhật số sao thất bại.');
                }

                const updateFeedbackResponse = await OrderService.updateIsFeedback(selectedOrder, selectedPro);
                if (updateFeedbackResponse) {
                    console.log('Cập nhật trạng thái isFeedback thành công');
                } else {
                    console.error('Cập nhật trạng thái isFeedback thất bại.');
                }

                const updatedOrders = await getAllOrderActive(user.id);
                setProductDetails({});
                setOrderId('');
                queryClient.setQueryData(["orders", user.id], updatedOrders);

                setShowModal(false);
                setStarRating(0);
                setFeedbackContent('');
                setImg(null);
            }
        } catch (error) {
            console.error('Error saving feedback:', error);
            alert('Có lỗi xảy ra khi thêm đánh giá hoặc cập nhật số sao.');
        }
    };


    const onCancel = () => {
        setShowModal(false);
        setStarRating(0);
        setFeedbackContent('');
        setImg(null);
    };


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
                            {/* <li className="nav-item">
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
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Nội dung Tab */}
                <div className="tab-content" style={{ flexGrow: 1, fontSize: '16px' }}>
                    <div className="tab-pane fade show active">
                        {orders.map((order, index) => (
                            <div className="card mb-3" key={index}>
                                {/* Kiểm tra nếu isCancel === true thì hiển thị "Đã hủy" trong card-header */}
                                {order.isCancel !== true ? (
                                    <div className={`card-header ${order.activeNow === "Đã hoàn thành" ? "text-success" : "text-primary"}`}>
                                        <div className="row">
                                            <div className="col-11">
                                                <strong>{order.activeNow}</strong>
                                            </div>
                                            <div className="col-1">
                                                <ButtonComponent2
                                                    textButton="Chi tiết"
                                                    onClick={() => handleDetailOrder(order._id)} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card-header text-danger">
                                        <div className="row">
                                            <div className="col-11">
                                                <strong>Đã hủy</strong>
                                            </div>
                                            <div className="col-1">
                                                <ButtonComponent2
                                                    textButton="Chi tiết"
                                                    onClick={() => handleDetailOrder(order._id)} />
                                            </div>
                                        </div>
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
                                                <th></th>
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
                                                        <td>
                                                            {/* Hiển thị nút Đánh giá nếu tất cả các điều kiện đều thỏa mãn */}
                                                            {order.activeNow === 'Đã hoàn thành' &&
                                                                order.isCancel === false &&
                                                                item.isFeedback === false && (
                                                                    <ButtonComponent2
                                                                        textButton="Đánh giá"
                                                                        onClick={() => handleFeedback(productDetail, order._id)} // Truyền orderId vào hàm handleFeedback
                                                                    />
                                                                )}
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>


                                    </table>
                                    <p>Tổng số tiền: <strong>{order.totalMoney.toLocaleString()} đ</strong></p>
                                </div>

                                {/* Kiểm tra nếu đơn hàng chưa bị hủy mới hiển thị phần này */}
                                {order.isCancel !== true && (
                                    <div className="text-end" style={{ marginBottom: '5px', marginRight: '5px' }}>
                                        {order.activeNow === "Đã hoàn thành" ? (
                                            ''
                                        ) : (
                                            <>
                                                <ButtonComponent
                                                    textButton="Hủy đơn"
                                                    onClick={() => handleCancelOrder(order._id)} />

                                            </>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ModalComponent
                isOpen={showModal}
                title="ĐÁNH GIÁ SẢN PHẨM"
                body={
                    <>
                        <div className="d-flex align-items-center mb-3" >
                            <img
                                src={imgPro}
                                alt="Product"
                                className="img-thumbnail"
                                style={{ width: '80px', height: 'auto' }}
                            />
                            <h6 className="ml-3" style={{ fontSize: '20px', marginLeft: '10px' }}>{name}</h6>
                        </div>
                        <div className="mb-3" >
                            <label className="form-label">Chất lượng sản phẩm</label>
                            <div className="d-flex">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className={`mr-1 ${starRating > index ? 'text-warning' : 'text-muted'}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleStarClick(index + 1)}
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
                                placeholder="Nhập nội dung"
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Hình ảnh</label>
                            <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                {img ? (
                                    <img src={img} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                ) : (
                                    <span className="text-muted">Chọn hình ảnh</span>
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
                textButton1="Thêm đánh giá"
                onClick1={onSave}
                onClick2={onCancel}
            />
        </div>
    );
};

export default OrderTab;
