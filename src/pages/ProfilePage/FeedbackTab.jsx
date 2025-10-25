import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import * as FeedbackService from '../../services/FeedbackService';
import * as ProductService from '../../services/ProductService';
import * as UserEventService from '../../services/UserEventService';

const FeedbackTab = () => {
    const user = useSelector((state) => state.user);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // State cho modal
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [starRating, setStarRating] = useState(0);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [productName, setProductName] = useState(null);
    const [productImage, setProductImage] = useState(null);

    useEffect(() => {
        const fetchFeedbackAndUserDetails = async () => {
            if (!user?.id) return;
            try {
                const feedbackData = await FeedbackService.getAllFeedbackByUser(user.id);
                const feedbackWithProductDetails = await Promise.all(
                    feedbackData.data.map(async (feedback) => {
                        const product = await ProductService.getDetailProduct(feedback.product);
                        return { ...feedback, productDetail: product.data };
                    })
                );
                setFeedbacks(feedbackWithProductDetails);
            } catch (error) {
                console.error("Failed to fetch feedbacks:", error);
            }
        };

        fetchFeedbackAndUserDetails();
    }, [user?.id]);

    const handleOpenUpdateModal = (feedback) => {
        setSelectedFeedback(feedback);
        setStarRating(feedback.star || 0);
        setFeedbackContent(feedback.content || '');
        setProductName(feedback.productDetail.name);
        setProductImage(feedback.productDetail.img[0]); // Lấy ảnh đầu tiên của sản phẩm

        // Logic ảnh feedback
        setPreviewImage(feedback.img || null);
        setImageFile(null);

        setShowModal(true);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 800,
                maxHeight: 800,
                success(result) {
                    setImageFile(result);
                    setPreviewImage(URL.createObjectURL(result));
                },
                error(err) {
                    console.error('Image compression error:', err);
                }
            });
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewImage(null);
    };

    const handleStarClick = (rating) => {
        setStarRating(rating);
    };

    const handleUpdateSave = async () => {
  const formData = new FormData();
  formData.append('star', starRating);
  formData.append('content', feedbackContent);

  if (imageFile) {
    formData.append('img', imageFile);
  } else if (previewImage) {
    formData.append('img', previewImage);
  } else {
    formData.append('img', '');
  }

  try {
    const oldRating = selectedFeedback.star || 0;
    const newRating = starRating;

    const updatedFeedbackData = await FeedbackService.updateFeedback(selectedFeedback._id, formData);

    if (oldRating !== newRating) {
      await ProductService.updateRating2(selectedFeedback.productDetail._id, {
        oldRating,
        newRating,
      });
    }

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === selectedFeedback._id ? { ...fb, ...updatedFeedbackData.data } : fb
      )
    );

    // 🟩 Ghi event: cập nhật đánh giá
   
    await UserEventService.trackUserEvent({
      eventType: 'update_feedback',
      productId: selectedFeedback.productDetail._id,
      userId: user?._id || null,
      
      details: {
        oldRating,
        newRating,
        feedbackId: selectedFeedback._id,
      },
    });

    alert('Cập nhật đánh giá thành công!');
    setShowModal(false);
  } catch (error) {
    console.error('Failed to update feedback:', error);
    alert('Cập nhật đánh giá thất bại!');
  }
};

    const handleDeleteFeedback = async (feedback) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
    try {
      const oldRating = feedback.star || 0;

      await FeedbackService.deleteFeedback(feedback._id);
      await ProductService.deleteRating(feedback.productDetail._id, { rating: oldRating });

      setFeedbacks((prev) => prev.filter((fb) => fb._id !== feedback._id));

      // 🟩 Ghi event: xóa đánh giá
      
      await UserEventService.trackUserEvent({
        eventType: 'delete_feedback',
        productId: feedback.productDetail._id,
        userId: user?._id || null,
        
        details: {
          rating: oldRating,
          feedbackId: feedback._id,
        },
      });

      alert('Xóa đánh giá thành công!');
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      alert('Xóa đánh giá thất bại!');
    }
  }
};


    return (
        <div className="container" style={{ padding: '0 20px' }}>
            <div className="title-section mb-3">
                <h3 className="text mb-0">LỊCH SỬ ĐÁNH GIÁ</h3>
            </div>
            <div>
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <div key={feedback._id} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={feedback.productDetail?.img[0] || ''}
                                            alt={feedback.productDetail?.name}
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                                        />
                                        <h5 style={{ fontSize: '18px' }} className="card-title mb-0">
                                            {feedback.productDetail?.name || 'Sản phẩm không tồn tại'}
                                        </h5>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteFeedback(feedback)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                                <p className="mb-1"><strong>Đánh giá của bạn:</strong></p>
                                <p style={{ fontSize: '16px' }}>{feedback.content}</p>
                                <p style={{ fontSize: '16px' }}><strong>Xếp hạng:</strong> {feedback.star}/5 ⭐</p>
                                {feedback.img && (
                                    <>
                                        <p style={{ fontSize: '16px' }} className="mb-1"><strong>Ảnh đính kèm:</strong></p>
                                        <img
                                            src={feedback.img}
                                            alt="Feedback"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    </>
                                )}
                                <div className="text-end mt-3">
                                    <ButtonComponent
                                        textButton="Cập nhật"
                                        onClick={() => handleOpenUpdateModal(feedback)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa có đánh giá nào.</p>
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
                                    src={productImage}
                                    alt="Product"
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: 'auto' }}
                                />
                                <h6 style={{ fontSize: '20px', marginLeft: '15px' }}>{productName}</h6>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Chất lượng sản phẩm</label>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`star ${starRating >= star ? 'text-warning' : 'text-muted'}`}
                                            style={{ cursor: 'pointer', fontSize: '2rem', marginRight: '5px' }}
                                            onClick={() => handleStarClick(star)}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nội dung đánh giá:</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                    value={feedbackContent}
                                    onChange={(e) => setFeedbackContent(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">Hình ảnh</label>
                                <div className="border rounded d-flex align-items-center justify-content-center position-relative" style={{ height: '150px' }}>
                                    {previewImage ? (
                                        <>
                                            <img src={previewImage} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
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
                    textButton1="Lưu thay đổi"
                    onClick1={handleUpdateSave}
                    onClick2={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default FeedbackTab;