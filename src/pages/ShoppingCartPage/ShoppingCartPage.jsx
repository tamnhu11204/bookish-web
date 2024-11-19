import React, { useState } from 'react'
import img3 from '../../assets/img/img3.jpg';
import ProductItem from '../../components/ProductItemComponent/ProductItemComponent'
import "../ShoppingCartPage/ShoppingCartPage.css"

export const ShoppingCartPage = () => {
  const [ProductItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Ngàn mặt trời rực rỡ',
      price: 100000,
      quantity: 1,
      image: img3,
    },
    {
      id: 2,
      name: 'Thư gửi quý nhà giàu Việt Nam',
      price: 100000,
      quantity: 1,
      image: img3,
    },
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = ProductItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = 25000;

  return (
    <div className="cart-page">
      <h3 className="cart-title mb-4">Giỏ Hàng ({ProductItems.length} sản phẩm)</h3>

      {/* Bố cục chính: Sản phẩm và Thanh toán/Khuyến mãi ngang nhau */}
      <div className="d-flex">
        {/* Phần hiển thị sản phẩm */}
        <div className="flex-grow-1">
          {/* Header nằm phía trên phần sản phẩm */}
          <div className="cart-header d-flex align-items-center border-bottom pb-2 mb-3">
            <input type="checkbox" className="me-3" />
            <span className="header-label flex-grow-1">Chọn tất cả ({ProductItems.length} sản phẩm)</span>
            <span className="header-quantity text-center" style={{ width: '100px' }}>
              Số lượng
            </span>
            <span className="header-price text-end" style={{ width: '120px' }}>
              Thành tiền
            </span>
          </div>

          {/* Hiển thị danh sách sản phẩm */}
          <div className="cart-items">
            {ProductItems.map((item, index) => (
              <ProductItem
                key={index}
                image={item.image}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onQuantityChange={(newQuantity) => handleQuantityChange(index, newQuantity)}
                onRemove={() =>handleRemove(index)}
              />
            ))}
          </div>
        </div>

        {/* Phần Khuyến mãi và Thanh toán */}
        <div className="checkout-section ms-4" style={{ width: '300px' }}>
          {/* Phần Khuyến mãi */}
          <div className="promo-section mb-3">
            <div className="d-flex justify-content-between border-bottom pb-2">
              <span>Khuyến mãi</span>
              <a href="#" className="text-decoration-none">Xem thêm</a>
            </div>
            <div className="promo-details bg-light p-2 my-2">
              <div className="d-flex justify-content-between align-items-center">
                <span>Mã giảm 25k</span>
                <button className="btn btn-sm btn-danger">X</button>
              </div>
              <small>Chỉ có thể áp dụng tối đa 1 mã giảm giá</small>
            </div>
          </div>

          {/* Phần Thanh toán */}
          <div className="payment-section border-top pt-2">
            <div className="d-flex justify-content-between">
              <span>Thành tiền:</span>
              <span>100.000đ</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Giảm giá:</span>
              <span>-25.000đ</span>
            </div>
            <div className="d-flex justify-content-between fw-bold text-danger">
              <span>Tổng số tiền:</span>
              <span>75.000đ</span>
            </div>
            <button className="btn btn-success w-100 mt-3">THANH TOÁN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;