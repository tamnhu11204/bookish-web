import React from "react";

const OrderDetails = ({isOpen,type}) => {
  // Dữ liệu mẫu
  const supplier = {
    name: "Nguyễn Văn A",
    phone: "01234556778",
    address: "Bạch Đằng, Tân Uyên, Bình Dương",
    email: "annam@gmail.com",
    image: "https://via.placeholder.com/100", // Đổi sang URL hình thật
    static : 'Đã giao',
  };

  const orderDetails = {
    orderId: 103,
    orderDate: "01/01/2023",
    items: [
      {
        id: 11,
        name: "Đêm nhớ và những đứa con của biển",
        priceOriginal: 75000,
        priceImport: 70000,
        quantity: 10,
        image: "https://via.placeholder.com/80", // Đổi sang URL hình thật
      },
      {
        id: 11,
        name: "Đêm nhớ và những đứa con của biển",
        priceOriginal: 75000,
        priceImport: 70000,
        quantity: 10,
        image: "https://via.placeholder.com/80",
      },
      {
        id: 11,
        name: "Đêm nhớ và những đứa con của biển",
        priceOriginal: 75000,
        priceImport: 70000,
        quantity: 10,
        image: "https://via.placeholder.com/80",
      },
    ],
  };

  const payment = {
    method: "Thanh toán bằng tiền mặt khi nhận hàng",
    orderTime: "01/01/2023",
    paymentTime: "07/01/2023",
    shippingTime: "02/01/2023",
    completionTime: "07/01/2023",
  };

  // Tính tổng tiền
  const total = orderDetails.items.reduce(
    (sum, item) => sum + item.priceImport * item.quantity,
    0
  );

  if (!isOpen) return null;

  if (!type) return (
    <div style={{ padding: '0 20px' }}>
    <div className="title-section">
        <h3 className="text mb-0">LỊCH SỬ NHẬP HÀNG - Chi tiết</h3>
    </div>
    <div className="container my-4">
      {/* Thông tin nhà cung cấp */}
      <div className="row">
        <div className="col-md-2">
          <img
            src={supplier.image}
            alt={supplier.name}
            className="img-thumbnail"
          />
        </div>
        <div className="col-md-10">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Tên khách hàng:</strong> {supplier.name}</p>
              <p><strong>Số điện thoại:</strong> {supplier.phone}</p>
              <p><strong>Địa chỉ:</strong> {supplier.address}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Ngày đặt hàng:</strong> {orderDetails.orderDate}</p>
              <p><strong>Email:</strong> {supplier.email}</p>
              <p><strong>Trạng thái :</strong> {supplier.static}</p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Thông tin đơn hàng */}
      <h5 className="bg-light p-2">Mã đơn: {orderDetails.orderId}</h5>
      <table className="table table-bordered">
        <thead>
          <tr className="table-success">
            <th>Mã sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá bìa</th>
            <th>Giá nhập</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.items.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-thumbnail"
                  style={{ width: "80px" }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.priceOriginal.toLocaleString()}đ</td>
              <td>{item.priceImport.toLocaleString()}đ</td>
              <td>{item.quantity}</td>
              <td>
                {(item.priceImport * item.quantity).toLocaleString()}đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng tiền */}
      <div className="text-end">
        <h5 className="text-danger">
          Tổng tiền: {total.toLocaleString()}đ
        </h5>
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
  );
};

export default OrderDetails;
