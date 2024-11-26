import React, { useState } from "react";

const ProductDetailForm = (isOpen) => {
  // State lưu trữ thông tin sản phẩm
  const [product, setProduct] = useState({
    name: "Vợ nhặt",
    author: "Kim Lân",
    publisher: "NXB Văn học",
    publishYear: "2024",
    language: "Tiếng Việt",
    weight: "100g",
    dimensions: "26×20×0,5cm",
    pages: "100 trang",
    coverType: "Bìa mềm",
    series: "Không có",
    supplier: "An Nam",
    unit: "Quyển",
    description: `Tác phẩm "Vợ nhặt" của tác giả Kim Lân (1921-2007). Ông là một trong những cây bút viết truyện ngắn xuất sắc nhất của văn học Việt Nam hiện đại. Với "Vợ nhặt", tác giả viết về cái đói, khi con người ta tưởng như khánh kiệt và chỉ muốn chết. Nhưng không, khi đói người ta không nghĩ đến con đường chết mà chỉ nghĩ đến con đường sống.`,
    price: 100000,
    discount: 50,
    discountedPrice: 50000,
    category: "Văn học > Văn học Việt Nam",
    stock: 12,
    sold: 12,
  });

  // Xử lý khi thay đổi trường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Xử lý khi nhấn nút Cập nhật
  const handleSubmit = () => {
    console.log("Thông tin sản phẩm đã được cập nhật:", product);
    alert("Thông tin sản phẩm đã được cập nhật!");
  };
  if (!isOpen) return null;

  return (
    <div className="container my-4">
      <h4>Chi tiết sản phẩm</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
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
          ></textarea>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Giá</label>
          <input
            type="text"
            className="form-control"
            name="price"
            value={product.price.toLocaleString()}đ
            disabled
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Giảm giá</label>
          <input
            type="text"
            className="form-control"
            name="discount"
            value={`${product.discount}%`}
            disabled
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Sau giảm giá</label>
          <input
            type="text"
            className="form-control"
            name="discountedPrice"
            value={product.discountedPrice.toLocaleString()}đ
            disabled
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
          />
        </div>
      </div>
      <div className="text-end">
        <button className="btn btn-success" onClick={handleSubmit}>
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default ProductDetailForm;
