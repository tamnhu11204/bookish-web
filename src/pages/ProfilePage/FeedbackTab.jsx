import React, { useEffect, useState } from 'react'
import * as ProductService from '../../services/ProductService';
import * as FeedbackService from '../../services/FeedbackService';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import Compressor from 'compressorjs';

const FeedbackTab = () => {
    const user = useSelector((state) => state.user);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [img, setImg] = useState(null);
    const [starRating, setStarRating] = useState(0);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [name, setName] = useState(null);
    const [imgPro, setImgPro] = useState(null);

    useEffect(() => {
        const fetchFeedbackAndUserDetails = async () => {
            const feedbackData = await FeedbackService.getAllFeedbackByUser(user?.id);
            const feedbackWithProductDetails = await Promise.all(
                feedbackData.data.map(async (feedback) => {
                    const product = await ProductService.getDetailProduct(feedback.product);
                    return { ...feedback, product };
                })
            );
            setFeedbacks(feedbackWithProductDetails);
        };

        fetchFeedbackAndUserDetails();
    }, [user?.id]);

    const handleOnFeedback = (feedback, product) => {
        setShowModal(true);
        setSelectedFeedback(feedback);
        setStarRating(feedback.star || 0);
        setFeedbackContent(feedback.content || '');
        setImg(feedback.img || null);
        setName(product.name);
        setImgPro(product.img);
    };

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

    const onSave = async () => {
        const updatedFeedback = {
            star: starRating,
            content: feedbackContent,
            img: img,
        };

        try {
            const oldRating = selectedFeedback.star;
            const newRating = starRating;

            await FeedbackService.updateFeedback(selectedFeedback._id, updatedFeedback);

            await ProductService.updateRating2(selectedFeedback.product.data._id, {
                oldRating: oldRating || 0,
                newRating: newRating,
            });

            setFeedbacks((prev) =>
                prev.map((feedback) =>
                    feedback._id === selectedFeedback._id
                        ? { ...feedback, ...updatedFeedback }
                        : feedback
                )
            );

            alert('Cập nhật đánh giá thành công!');
            setShowModal(false);
        } catch (error) {
            console.error('Failed to update feedback:', error);
        }
    };

    const handleDeleteFeedback = async (id, product) => {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm("Bạn có chắc chắn muốn xóa đơn vị này?");
        if (isConfirmed) {
            try {
                const deletedFeedback = feedbacks.find((feedback) => feedback._id === id);
                const oldRating = deletedFeedback?.star;

                await FeedbackService.deleteFeedback(id);

                await ProductService.deleteRating(product._id, { rating: oldRating });

                setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));

                alert('Xóa đánh giá thành công!');
            } catch (error) {
                console.error('Failed to delete feedback:', error);
            }
        }

    };

    const onCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
            <div className="title-section">
                <h3 className="text mb-0">LỊCH SỬ ĐÁNH GIÁ</h3>
            </div>
            <div>
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback, index) => (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteFeedback(feedback._id, feedback.product.data)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                                <div className="d-flex align-items-center mb-3">
                                    <img
                                        src={feedback.product?.data.img || ''}
                                        alt={`${feedback.product?.data.name}'s avatar`}
                                        style={{ width: '100px', height: 'auto', marginRight: '15px' }}
                                    />
                                    <h5 style={{ fontSize: '18px' }} className="card-title mb-0">
                                        {feedback.product?.data.name || 'Người dùng ẩn danh'}
                                    </h5>
                                </div>
                                <p style={{ fontSize: '16px' }}>{feedback.content}</p>
                                <p style={{ fontSize: '16px' }}>Đánh giá: {feedback.star}/5⭐</p>
                                <p style={{ fontSize: '16px' }}>Ảnh:</p>
                                <img
                                    src={feedback.img || ''}
                                    alt={`${feedback.product?.data.name}'s avatar`}
                                    style={{ width: '80px', height: 'auto', marginRight: '15px' }}
                                />
                                <div className="text-end">
                                    <ButtonComponent
                                        textButton="Cập nhật"
                                        onClick={() => handleOnFeedback(feedback, feedback.product.data)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
            </div>

            {showModal && (
                <ModalComponent
                    isOpen={showModal}
                    title="CẬP NHẬT ĐÁNH GIÁ"
                    body={
                        <>
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={imgPro}
                                    alt="Product"
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: 'auto' }}
                                />
                                <h6 className="ml-3" style={{ fontSize: '20px', marginLeft: '10px' }}>{name}</h6>
                            </div>
                            <div className="mb-3">
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
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Nhập nội dung"
                                    value={feedbackContent}
                                    onChange={(e) => setFeedbackContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Hình ảnh</label>
                                <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                                    {img ? (
                                        <img src={img} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%' }} />
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
                    textButton1="Cập nhật"
                    onClick1={onSave}
                    onClick2={onCancel}
                />
            )}
        </div>
    );
};

export default FeedbackTab;

