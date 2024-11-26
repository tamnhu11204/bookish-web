import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderDetailsPage = () => {
  const customer = {
    name: "Nguyễn Văn A",
    phone: "01234556778",
    address: "Bạch Đằng, Tân Uyên, Bình Dương",
    orderDate: "01/01/2023",
    orderId: 103,
  };

  const items = [
    {
      name: "Đêm nhớ và những đứa con của biển",
      id: "#12",
      price: 70000,
      originalPrice: 75000,
      quantity: 1,
      image: "https://via.placeholder.com/80", // Thay bằng link ảnh thực tế
    },
    {
      name: "Đêm nhớ và những đứa con của biển",
      id: "#12",
      price: 70000,
      originalPrice: 75000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Đêm nhớ và những đứa con của biển",
      id: "#12",
      price: 70000,
      originalPrice: 75000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
  ];

  const totals = {
    subtotal: 210000,
    shippingFee: 25000,
    shippingDiscount: -25000,
    voucherDiscount: -20000,
    total: 200000,
  };

  const payment = {
    method: "Thanh toán bằng tiền mặt khi nhận hàng",
    orderTime: "01/01/2023",
    paymentTime: "07/01/2023",
    shippingTime: "02/01/2023",
    completionTime: "07/01/2023",
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-4">Trạng thái: <span className="badge bg-success">Đã giao</span></h5>

          <div className="row mb-4">
            <div className="col-md-6">
              <div>
                <strong>Tên khách hàng:</strong> {customer.name}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {customer.phone}
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <strong>Ngày đặt:</strong> {customer.orderDate}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {customer.address}
              </div>
            </div>
          </div>

          <h5 className="bg-light p-2">Mã đơn: {customer.orderId}</h5>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-thumbnail me-3"
                      style={{ width: "80px" }}
                    />
                    <div>
                      <div>{item.name}</div>
                      <small className="text-muted">{item.id}</small>
                    </div>
                  </td>
                  <td>
                    {item.price.toLocaleString()}đ
                    <br />
                    <small className="text-muted">
                      <del>{item.originalPrice.toLocaleString()}đ</del>
                    </small>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end">
            <p>Tiền hàng: {totals.subtotal.toLocaleString()}đ</p>
            <p>Phí vận chuyển: {totals.shippingFee.toLocaleString()}đ</p>
            <p>Ưu đãi phí vận chuyển: {totals.shippingDiscount.toLocaleString()}đ</p>
            <p>Voucher cửa hàng: {totals.voucherDiscount.toLocaleString()}đ</p>
            <h5 className="fw-bold text-danger">Tổng tiền: {totals.total.toLocaleString()}đ</h5>
          </div>

          <h5 className="bg-light p-2 mt-4">Phương thức thanh toán: {payment.method}</h5>
          <ul>
            <li>Thời gian đặt hàng: {payment.orderTime}</li>
            <li>Thời gian thanh toán: {payment.paymentTime}</li>
            <li>Thời gian giao hàng cho vận chuyển: {payment.shippingTime}</li>
            <li>Thời gian hoàn thành đơn hàng: {payment.completionTime}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;