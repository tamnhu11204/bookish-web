import React, { useState, useEffect } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { addSelectedProduct } from '../../redux/slides/ComparisonSlide';

const ProductSearchModal = ({ isOpen, products, onClose, index }) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector((state) => state.comparison.selectedProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(value)
      )
    );
  };

  const handleProductSelect = (product) => {
    dispatch(addSelectedProduct({ index, product })); // Truyền index và sản phẩm
    onClose(); // Đóng modal sau khi chọn
  };

  const bodyContent = (
    <div
      style={{
        maxHeight: '400px',
        minHeight:'400px', // Chiều cao cố định cho toàn bộ nội dung modal
        overflowY: 'hidden', // Loại bỏ thanh cuộn từ wrapper
      }}
    >
      <input
        style={{
          fontSize: '16px',
          position: 'sticky', // Giữ thanh tìm kiếm cố định
          top: 0,
          zIndex: 10,
          backgroundColor: '#fff',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
        }}
        type="text"
        className="form-control mb-3"
        placeholder="Nhập tên sản phẩm để tìm..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div
        className="product-list"
        style={{
          maxHeight: '330px', // Chiều cao còn lại sau khi trừ input (khoảng 70px)
          overflowY: 'auto', // Chỉ danh sách có thanh cuộn
          fontSize: '16px',
        }}
      >
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-item d-flex align-items-center justify-content-between mb-3"
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
                fontSize: '16px',
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={product.img}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
                <div>
                  <h6 style={{ fontSize: '16px' }} className="mb-1">{product.name}</h6>
                  <p className="text-danger mb-0">{product.price.toLocaleString()}đ</p>
                </div>
              </div>
              <button
                className={`btn ${
                  selectedProducts[index]?._id === product?._id ? 'btn-success' : 'btn-primary'
                }`}
                onClick={() => handleProductSelect(product)}
                style={{ backgroundColor: '#198754', color: 'white', borderColor: '#198754' }}
              >
                {selectedProducts[index]?._id === product?._id ? 'Đã chọn' : 'Chọn'}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Không có sản phẩm nào để hiển thị.</p>
        )}
      </div>
    </div>
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      title="Tìm kiếm sản phẩm"
      body={bodyContent}
      onClick1={onClose}
      onClick2={onClose}
      textButton1="Hoàn thành"
    />
  );
};

export default ProductSearchModal;