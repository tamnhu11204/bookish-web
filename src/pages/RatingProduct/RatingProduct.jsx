import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from "../../assets/img/img3.jpg"
import "../RatingProduct/RatingProduct.css"
function RatingProduct() {
  return (
      <div className="container p-4">
        <div className="card">
          <div className="card-header bg-light text-success" style={{ fontSize: '20px' }}>
            <h5 className="text">ĐÁNH GIÁ SẢN PHẨM</h5>
          </div>
          <div className="card-body" style={{ fontSize: '16px' }}>
            <div className="d-flex align-items-center mb-3">
              <img
                src={img}
                alt="Product"
                className="img-thumbnail"
                style={{ width: '80px', height: 'auto' }}
              />
              <h6 className="ml-3">Thư gửi quý nhà giàu Việt Nam</h6>
            </div>
            <div className="mb-3">
              <label className="form-label">Chất lượng sản phẩm</label>
              <div className="d-flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="text-warning mr-1">&#9733;</span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung sản phẩm:</label>
              <textarea className="form-control" rows="3" placeholder="Nhập nội dung"></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Chất lượng giấy/in:</label>
              <textarea className="form-control" rows="3" placeholder="Nhập nội dung"></textarea>
            </div>
            <div className="mb-3">
              <button className="btn btn-secondary btn-sm">
                <i className="bi bi-camera"></i> Thêm hình ảnh
              </button>
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="displayNameCheck" />
              <label className="form-check-label" htmlFor="displayNameCheck">
                Hiển thị tên bạn trên đánh giá này
              </label>
              <div className="text-muted small">Tên sẽ được hiển thị.</div>
            </div>
            <button className="btn btn-success">Hoàn thành</button>
          </div>
        </div>
      </div>
    );
  }

  export default RatingProduct;