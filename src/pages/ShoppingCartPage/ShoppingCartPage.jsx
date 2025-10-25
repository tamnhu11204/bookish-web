import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, seletedOrder } from '../../redux/slides/OrderSlide';
import * as ProductService from '../../services/ProductService';
import * as PromotionService from '../../services/PromotionService';
import "./ShoppingCartPage.css";
import * as UserEventService from '../../services/UserEventService';

export const ShoppingCartPage = () => {
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]);
  const [listChecked, setListChecked] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const productIds = order.orderItems.map(item => item.product);
    if (productIds.length > 0) {
      const fetchDetails = async () => {
        try {
          const responses = await Promise.all(
            productIds.map(id => ProductService.getDetailProduct(id))
          );
          setProductDetails(responses.map(res => res.data));
        } catch (error) { console.error("Lỗi khi tải chi tiết sản phẩm:", error); }
      };
      fetchDetails();
    } else {
      setProductDetails([]);
    }
  }, [order.orderItems]);

  const { data: promotions, isLoading: isLoadingPromotions } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => (await PromotionService.getAllPromotion()).data,
  });

  const availablePromotions = useMemo(() => {
    if (!promotions) return [];
    const now = new Date();
    return promotions.filter(promo => {
      const startDate = new Date(promo.start);
      const finishDate = new Date(promo.finish);
      return now >= startDate && now <= finishDate && promo.quantity > promo.used;
    });
  }, [promotions]);

  const priceMemo = useMemo(() => {
    return order.orderItemSelected.reduce((total, item) => {
      const cleanPriceString = String(item.price || '0').replace(/,/g, '');
      const price = Number(cleanPriceString) || 0;
      const amount = Number(item.amount) || 0;
      return total + (price * amount);
    }, 0);
  }, [order.orderItemSelected]);

  const finalPriceMemo = useMemo(() => {
    if (selectedPromotion && priceMemo >= selectedPromotion.condition) {
      const final = priceMemo - selectedPromotion.value;
      return final > 0 ? final : 0;
    }
    return priceMemo;
  }, [priceMemo, selectedPromotion]);

  const handleSelectPromotion = (promo) => setSelectedPromotion(prev => (prev?._id === promo._id ? null : promo));

  const handleOrder = () => {
    if (!order.orderItemSelected?.length) return alert('Vui lòng chọn sản phẩm để thanh toán.');
    navigate('/order', {
      state: {
        promotion: priceMemo >= selectedPromotion?.condition ? selectedPromotion : null
      }
    });
  };

  const handleCountChange = (idProduct, type) => dispatch(type === 'increase' ? increaseAmount({ idProduct }) : decreaseAmount({ idProduct }));
 const handleDelete = async (idProduct) => {
  // 🆕 Ghi lại sự kiện xóa sản phẩm khỏi giỏ hàng
  try {
    await UserEventService.trackUserEvent({
      eventType: 'remove_from_cart',
      productId: idProduct,
      userId: user?.id || null,
    });
  } catch (error) {
    console.error('Error tracking remove_from_cart event:', error);
  }

  
  dispatch(removeOrderProduct({ idProduct }));
};

  const handleDeleteAll = () => dispatch(removeAllOrderProduct({ listChecked }));
  const handleCheckAll = (e) => setListChecked(e.target.checked ? order.orderItems.map(item => item.product) : []);
  const handleCheck = (e) => {
    const { value, checked } = e.target;
    setListChecked(checked ? [...listChecked, value] : listChecked.filter(item => item !== value));
  };


  useEffect(() => {
    dispatch(seletedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  return (
    <div className="shopping-cart-container">
      <div className="container">
        <h1 className="site-title">GIỎ HÀNG ({order.orderItems.length} sản phẩm)</h1>
        <div className="row">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="col-lg-8">
            <div className="cart-card header-card">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  onChange={handleCheckAll}
                  checked={order.orderItems.length > 0 && listChecked.length === order.orderItems.length}
                />
                <span className="ms-3">Chọn tất cả ({order.orderItems.length} sản phẩm)</span>
                <div className="ms-auto d-flex align-items-center gap-5">
                  <span style={{ width: '200px', textAlign: 'center' }}>Số lượng</span>
                  <span style={{ width: '90px', textAlign: 'center' }}>Thành tiền</span>
                  <i className="bi bi-trash header-delete" onClick={handleDeleteAll}></i>
                </div>
              </div>
            </div>

            {order.orderItems.length > 0 ? order.orderItems.map(orderItem => {
              const productDetail = productDetails.find(p => p._id === orderItem.product);
              if (!productDetail) {
                return <div key={orderItem.product} className="cart-card item-card">Đang tải thông tin sản phẩm...</div>;
              }

              const cleanPrice = Number(String(orderItem.price || '0').replace(/,/g, ''));
              const amount = Number(orderItem.amount || 0);
              const subtotal = cleanPrice * amount;

              return (
                <div className="cart-card item-card" key={orderItem.product}>
                  <div className="d-flex align-items-center">
                    <input type="checkbox" value={orderItem.product} onChange={handleCheck} checked={listChecked.includes(orderItem.product)} />
                    <img src={productDetail.img[0]} alt={productDetail.name} className="item-image ms-3" />
                    <div className="item-info">
                      <p className="item-name">{productDetail.name}</p>
                      <span className="current-price">{cleanPrice.toLocaleString()}đ</span>
                      {productDetail.price > cleanPrice && <span className="original-price">{productDetail.price.toLocaleString()}đ</span>}
                    </div>
                    <div className="quantity-selector">
                      <button onClick={() => handleCountChange(orderItem.product, 'decrease')}>-</button>
                      <input type="text" value={orderItem.amount} readOnly />
                      <button onClick={() => handleCountChange(orderItem.product, 'increase')}>+</button>
                    </div>
                    <span className="subtotal">{subtotal.toLocaleString()}đ</span>
                    <i className="bi bi-trash item-delete" onClick={() => handleDelete(orderItem.product)}></i>
                  </div>
                </div>
              )
            }) : <div className="cart-card"><p>Không có sản phẩm nào trong giỏ hàng.</p></div>}
          </div>

          {/* Cột phải: Khuyến mãi và thanh toán */}
          <div className="col-lg-4">
            <div className="cart-card promotion-card">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="bi bi-ticket-perforated me-2"></i>KHUYẾN MÃI</h5>
                <a href="/discount" className="see-more">Xem thêm &gt;</a>
              </div>
              {isLoadingPromotions ? <p>Đang tải khuyến mãi...</p> :
                availablePromotions.map(promo => {
                  const isApplicable = priceMemo >= promo.condition;
                  return (
                    <div className="promotion-item" key={promo._id}>
                      <p className="promo-title">{promo.name}</p>
                      <p className="promo-details">Điều kiện: Đơn hàng từ {promo.condition.toLocaleString()}đ</p>
                      <p className="promo-details">HSD: {new Date(promo.finish).toLocaleDateString('vi-VN')}</p>
                      <button
                        className={`btn ${selectedPromotion?._id === promo._id ? 'btn-success' : 'btn-primary'} w-100`}
                        onClick={() => handleSelectPromotion(promo)}
                        disabled={!isApplicable}
                      >
                        {selectedPromotion?._id === promo._id ? 'Bỏ chọn' : 'Áp dụng'}
                      </button>
                    </div>
                  )
                })
              }
            </div>

            <div className="cart-card checkout-card">
              <div className="d-flex justify-content-between">
                <span>Thành tiền</span>
                <span>{priceMemo.toLocaleString()}đ</span>
              </div>
              {selectedPromotion && priceMemo >= selectedPromotion.condition && (
                <div className="d-flex justify-content-between text-danger">
                  <span>Giảm giá</span>
                  <span>-{selectedPromotion.value.toLocaleString()}đ</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng Số Tiền</span>
                <span className="final-price">{finalPriceMemo.toLocaleString()}đ</span>
              </div>
              <ButtonComponent
                textButton="THANH TOÁN"
                onClick={handleOrder}
                disabled={!order.orderItemSelected.length}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;