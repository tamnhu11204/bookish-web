import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import * as FavoriteProductService from '../../services/FavoriteProductService';
import * as UserEventService from '../../services/UserEventService'; 
import { addOrderProduct } from '../../redux/slides/OrderSlide';
import './CardProductComponent.css';
import { getSessionId } from '../../../src/utils/session';

const CardProductComponent = ({
    id,
    img,
    proName,
    currentPrice,
    originalPrice,
    sold,
    star,
    feedbackCount,
    onClick,
    view,
    stock,
    discount
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState('');

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (user?.id) {
                try {
                    const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);
                    if (favoriteData?.data) {
                        const favoriteProduct = favoriteData.data.find(fav => fav.product === id);
                        if (favoriteProduct) {
                            setIsFavorite(true);
                            setFavoriteId(favoriteProduct._id);
                        } else {
                            setIsFavorite(false);
                            setFavoriteId('');
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch favorite status:", error);
                }
            }
        };

        fetchFavoriteStatus();
    }, [id, user?.id]);

   // 🆕 Ghi lại sự kiện xem sản phẩm
const handleTrackView = async () => {
    try {
        await UserEventService.trackUserEvent({
            eventType: 'view',             
            productId: id,                 
            userId: user?.id || null,   
            sessionId: user?.id ? null : getSessionId(),   
        });
    } catch (error) {
        console.error('Error tracking view event:', error);
    }
};



    const handleOnAddToCart = async (e) => {
    e.stopPropagation();

    if (!user?.id) {
        alert('Hãy đăng nhập để tiếp tục mua sắm!');
        navigate('/login', { state: location?.pathname });
        return;
    }

    if (stock < 1) {
        alert('Sản phẩm đã hết hàng. Vui lòng quay lại sau!');
        return;
    }

    try {
        dispatch(addOrderProduct({
            orderItem: {
                product: id,
                name: proName,
                image: img,
                price: currentPrice,
                amount: 1,
                stock: stock,
            }
        }));

        alert('Sản phẩm đã được thêm vào giỏ hàng thành công!');

        // 🆕 Ghi lại sự kiện thêm vào giỏ hàng
        try {
            await UserEventService.trackUserEvent({
                eventType: 'add_to_cart',
                productId: id,
                userId: user?.id || null,
                sessionId: user?.id ? null : getSessionId(),
            });
        } catch (error) {
            console.error('Error tracking add_to_cart event:', error);
        }

    } catch (error) {
        console.error('Error in handleOnAddToCart:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
    }
};

    const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user?.id) {
        alert('Hãy đăng nhập để sử dụng tính năng này!');
        navigate('/login', { state: location?.pathname });
        return;
    }

    try {
        if (isFavorite) {
            const response = await FavoriteProductService.deleteFavoriteProduct(favoriteId);
            if (response?.status === 'OK') {
                alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
                setIsFavorite(false);
                setFavoriteId('');

                // 🆕 Ghi lại sự kiện xóa yêu thích
                try {
                    await UserEventService.trackUserEvent({
                        eventType: 'favorite_remove',
                        productId: id,
                        userId: user?.id || null,
                        sessionId: user?.id ? null : getSessionId(),
                    });
                } catch (error) {
                    console.error('Error tracking favorite_remove event:', error);
                }
            }
        } else {
            const favoriteData = { user: user.id, product: id };
            const response = await FavoriteProductService.addFavoriteProduct(favoriteData);
            if (response?.status === 'OK' && response?.data?._id) {
                alert('Đã thêm sản phẩm vào danh sách yêu thích!');
                setIsFavorite(true);
                setFavoriteId(response.data._id);

                // 🆕 Ghi lại sự kiện thêm yêu thích
                try {
                    await UserEventService.trackUserEvent({
                        eventType: 'favorite_add',
                        productId: id,
                        userId: user?.id || null,
                        sessionId: user?.id ? null : getSessionId(),
                    });
                } catch (error) {
                    console.error('Error tracking favorite_add event:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error in handleToggleFavorite:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại sau!');
    }
};


    // 🆕 Tạo wrapper cho onClick để vừa track, vừa gọi hàm gốc
    const handleCardClick = async (e) => {
        await handleTrackView(); // ghi lại event xem
        if (onClick) onClick(e); // vẫn chạy logic gốc của props onClick
    };

    return (
        <div className="card-product-component" onClick={handleCardClick }>
            <div className="card-product-img-container">
                <img src={img} className="card-product-img" alt={proName} />

                {discount > 0 && (
                    <div className="discount-tag">-{discount}%</div>
                )}

                <div className="card-product-hover-actions">
                    <button onClick={handleToggleFavorite} className={`action-btn ${isFavorite ? 'is-favorite' : ''}`} title="Yêu thích">
                        <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                    </button>
                    <button onClick={handleOnAddToCart} className="action-btn" title="Thêm vào giỏ hàng">
                        <i className="bi bi-cart3"></i>
                    </button>
                </div>
            </div>

            <div className="card-product-body">
                <h5 className="card-product-name">{proName}</h5>

                <div className="price-wrapper">
                    <p className="card-product-price">{currentPrice.toLocaleString()} đ</p>

                    {discount > 0 && (
                        <p className="original-price">
                            {originalPrice.toLocaleString()} đ
                        </p>
                    )}
                </div>
                <div className="card-product-row">
                    <strong>{star}/5⭐</strong>
                </div>
                <div className="card-product-row" style={{ marginLeft: '0px' }}>
                    {feedbackCount} đánh giá | {sold} lượt bán | {view} lượt xem
                </div>
            </div>
        </div>
    );
};

export default CardProductComponent;