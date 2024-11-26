import React, { useState } from "react";

const AddProductForm = (isOpen) => {
  // State lưu trữ thông tin sản phẩm
  const [product, setProduct] = useState({
    name: "",
    author: "",
    publisher: "",
    publishYear: "",
    language: "",
    weight: "",
    dimensions: "",
    pages: "",
    coverType: "",
    series: "",
    supplier: "",
    unit: "",
    description: "",
    price: "",
    discount: "",
    discountedPrice: "",
    category: "",
    stock: "",
    sold: "",
  });

  // Xử lý khi thay đổi trường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Xử lý khi nhấn nút Lưu sản phẩm
  const handleSubmit = () => {
    console.log("Thông tin sản phẩm mới:", product);
    alert("Sản phẩm mới đã được thêm!");
  };
 
  if (!isOpen) return null;
  return (
    <div className="container my-4">
      <h4>Thêm sản phẩm mới</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Tác giả</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={product.author}
            onChange={handleChange}
            placeholder="Nhập tên tác giả"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Nhà xuất bản</label>
          <select
            className="form-select"
            name="publisher"
            value={product.publisher}
            onChange={handleChange}
          >
            <option value="">Chọn nhà xuất bản</option>
            <option value="NXB Văn học">NXB Văn học</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Năm xuất bản</label>
          <input
            type="text"
            className="form-control"
            name="publishYear"
            value={product.publishYear}
            onChange={handleChange}
            placeholder="Nhập năm xuất bản"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Ngôn ngữ</label>
          <select
            className="form-select"
            name="language"
            value={product.language}
            onChange={handleChange}
          >
            <option value="">Chọn ngôn ngữ</option>
            <option value="Tiếng Việt">Tiếng Việt</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Trọng lượng</label>
          <input
            type="text"
            className="form-control"
            name="weight"
            value={product.weight}
            onChange={handleChange}
            placeholder="Nhập trọng lượng (ví dụ: 100g)"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Kích thước</label>
          <input
            type="text"
            className="form-control"
            name="dimensions"
            value={product.dimensions}
            onChange={handleChange}
            placeholder="Nhập kích thước (ví dụ: 26×20×0,5cm)"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Số trang</label>
          <input
            type="text"
            className="form-control"
            name="pages"
            value={product.pages}
            onChange={handleChange}
            placeholder="Nhập số trang"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Hình thức</label>
          <select
            className="form-select"
            name="coverType"
            value={product.coverType}
            onChange={handleChange}
          >
            <option value="">Chọn hình thức</option>
            <option value="Bìa mềm">Bìa mềm</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Bộ</label>
          <select
            className="form-select"
            name="series"
            value={product.series}
            onChange={handleChange}
          >
            <option value="">Chọn bộ</option>
            <option value="Không có">Không có</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Nhà cung cấp</label>
          <select
            className="form-select"
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
          >
            <option value="">Chọn nhà cung cấp</option>
            <option value="An Nam">An Nam</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Đơn vị</label>
          <select
            className="form-select"
            name="unit"
            value={product.unit}
            onChange={handleChange}
          >
            <option value="">Chọn đơn vị</option>
            <option value="Quyển">Quyển</option>
            {/* Thêm tùy chọn khác */}
          </select>
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="5"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Nhập mô tả sản phẩm"
          ></textarea>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Giá</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Nhập giá sản phẩm"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Giảm giá (%)</label>
          <input
            type="number"
            className="form-control"
            name="discount"
            value={product.discount}
            onChange={handleChange}
            placeholder="Nhập phần trăm giảm giá"
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Giá sau giảm</label>
          <input
            type="number"
            className="form-control"
            name="discountedPrice"
            value={product.discountedPrice}
            onChange={handleChange}
            placeholder="Tự động tính toán hoặc nhập giá sau giảm"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Tồn kho</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Nhập số lượng tồn kho"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Đã bán</label>
          <input
            type="number"
            className="form-control"
            name="sold"
            value={product.sold}
            onChange={handleChange}
            placeholder="Nhập số lượng đã bán"
          />
        </div>
      </div>
      <div className="text-end">
        <button className="btn btn-success" onClick={handleSubmit}>
          Lưu sản phẩm
        </button>
      </div>
    </div>
  );
};

export default AddProductForm;
