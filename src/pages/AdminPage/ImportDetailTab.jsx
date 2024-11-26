import React from "react";

const ImportDetails = ({isOpen,type}) => {
  // Dữ liệu mẫu
  const supplier = {
    name: "An Nam",
    phone: "01234556778",
    address: "Bạch Đằng, Tân Uyên, Bình Dương",
    email: "annam@gmail.com",
    image: "https://via.placeholder.com/100", // Đổi sang URL hình thật
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
              <p><strong>Nhà cung cấp:</strong> {supplier.name}</p>
              <p><strong>Số điện thoại:</strong> {supplier.phone}</p>
              <p><strong>Địa chỉ:</strong> {supplier.address}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Ngày nhập hàng:</strong> {orderDetails.orderDate}</p>
              <p><strong>Email:</strong> {supplier.email}</p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Thông tin đơn hàng */}
      <h5 className="bg-light p-2">Mã nhập hàng: {orderDetails.orderId}</h5>
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
    </div>
    </div>
  );
};

export default ImportDetails;
