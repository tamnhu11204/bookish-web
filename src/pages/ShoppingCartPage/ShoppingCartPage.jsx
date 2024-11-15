import React from 'react'
import img1 from '../../assets/img/img3.jpg'
import ProductItem from '../../components/ProductItemComponent/ProductItemComponent'
export const ShoppingCartPage = () => {
  const products = [
    {
      image: {img1},
      name: 'Ngàn mặt trời rực rỡ',
      price: '100.000',
      quantity: 1,
      checked: false,
    },
    {
      image: {img1},
      name: 'Thư gửi quý nhà giàu Việt Nam',
      price: '100.000',
      quantity: 1,
      checked: true,
    },
  ];

  const handleQuantityChange = (index, newQuantity) => {
    console.log(`Sản phẩm ${index} có số lượng mới: ${newQuantity}`);
  };

  const handleDelete = (index) => {
    console.log(`Xóa sản phẩm ở vị trí: ${index}`);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">GIỎ HÀNG ( {products.length} sản phẩm )</h2>

      {/* Header */}
      <div className="row align-items-center border-bottom pb-2 mb-3">
        <div className="col-6">
          <input type="checkbox" className="me-2" />
          <span>Chọn tất cả ( {products.length} sản phẩm )</span>
        </div>
        <div className="col-3 text-end">Số lượng</div>
        <div className="col-3 text-center">Thành tiền</div>
      </div>

      {/* Hiển thị sản phẩm */}
      {products.map((product, index) => (
        <ProductItem
          key={index}
          image= {img1}
          name={product.name}
          price={product.price}
          quantity={product.quantity}
          checked={product.checked}
          onQuantityChange={(newQuantity) => handleQuantityChange(index, newQuantity)}
          onDelete={() => handleDelete(index)}
        />
      ))}

      {/* Phần thanh toán */}
      <div className="row mt-4">
        <div className="col-12 col-md-4 offset-md-8">
          <div className="border p-3 rounded">
            <p className="d-flex justify-content-between">
              <span>Khuyến mãi</span>
              <button className="btn btn-link btn-sm p-0">Xem thêm &gt;</button>
            </p>
            <div className="d-flex justify-content-between bg-light p-2 rounded mb-2">
              <span>Mã giảm 25k</span>
              <button className="btn btn-sm btn-close"></button>
            </div>
            <p className="text-muted small">Chỉ có thể áp dụng tối đa 1 mã giảm giá</p>
            <hr />
            <p className="d-flex justify-content-between">
              <span>Thành tiền:</span>
              <span>100.000đ</span>
            </p>
            <p className="d-flex justify-content-between text-danger">
              <span>Giảm giá:</span>
              <span>-25.000đ</span>
            </p>
            <hr />
            <p className="d-flex justify-content-between fw-bold">
              <span>Tổng số tiền:</span>
              <span className="text-danger">75.000đ</span>
            </p>
            <button className="btn btn-success w-100">THANH TOÁN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;