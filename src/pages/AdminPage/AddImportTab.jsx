import React, { useState } from "react";

const AddImport= ({isOpen,type}) => {
  // Dữ liệu mẫu
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);

  const products = [
    { id: 1, name: "Đêm nhớ và những đứa con của biển", price: 75000 },
    // Thêm sản phẩm khác ở đây
  ];

  // Thêm sản phẩm vào danh sách
  const handleAddItem = () => {
    if (!selectedProduct || !importPrice || !quantity) return;
    const product = products.find((p) => p.id === parseInt(selectedProduct));
    const newItem = {
      id: product.id,
      name: product.name,
      priceOriginal: product.price,
      priceImport: parseInt(importPrice),
      quantity: parseInt(quantity),
    };
    setItems([...items, newItem]);
    setImportPrice("");
    setQuantity("");
  };

  // Xóa sản phẩm khỏi danh sách
  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Tính tổng tiền
  const total = items.reduce(
    (sum, item) => sum + item.priceImport * item.quantity,
    0
  );
  if (!isOpen) return null;

   if (type)return (
    <div className="container my-4">
      {/* Thông tin nhập hàng */}
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label"><strong>Nhà cung cấp</strong></label>
            <select
              className="form-select"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            >
              <option value="">Chọn nhà cung cấp</option>
              <option value="An Nam">An Nam</option>
              {/* Thêm nhà cung cấp khác */}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Ngày nhập hàng</strong></label>
            <input
              type="date"
              className="form-control"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label"><strong>Thành tiền</strong></label>
            <p className="form-control bg-light">
              {total.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>

      <hr />

      {/* Thêm sản phẩm */}
      <div className="row">
        <div className="col-md-3">
          <label className="form-label"><strong>Sản phẩm</strong></label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label"><strong>Giá nhập</strong></label>
          <input
            type="number"
            className="form-control"
            value={importPrice}
            onChange={(e) => setImportPrice(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label"><strong>Số lượng</strong></label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleAddItem}>
            Thêm
          </button>
        </div>
      </div>

      <hr />

      {/* Danh sách sản phẩm */}
      <h5 className="bg-light p-2">Mã nhập hàng: 103</h5>
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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>
                <img
                  src="https://via.placeholder.com/80"
                  alt={item.name}
                  className="img-thumbnail"
                />
              </td>
              <td>{item.name}</td>
              <td>{item.priceOriginal.toLocaleString()}đ</td>
              <td>{item.priceImport.toLocaleString()}đ</td>
              <td>{item.quantity}</td>
              <td>
                {(item.priceImport * item.quantity).toLocaleString()}đ
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteItem(index)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Xác nhận thanh toán */}
      <div className="text-end">
        <button className="btn btn-success">Xác nhận thanh toán</button>
      </div>
    </div>
  );
};

export default AddImport;
