import React, { useState } from 'react';
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
          <>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Nhập tên sản phẩm để tìm..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div
              className="product-list"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="product-item d-flex align-items-center justify-content-between mb-3"
                    style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={product.img}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                      />
                      <div>
                        <h6 className="mb-1">{product.name}</h6>
                        <p className="text-danger mb-0">{product.price}đ</p>
                      </div>
                    </div>
                    <button
                      className={`btn ${
                        selectedProducts[index]?._id === product?._id ? 'btn-success' : 'btn-primary'
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      {selectedProducts[index]?._id === product?._id ? 'Đã chọn' : 'Chọn'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">Không có sản phẩm nào để hiển thị.</p>
              )}
            </div>
          </>
        );
      
        return (
          <ModalComponent
            isOpen={isOpen}
            title="Tìm kiếm sản phẩm"
            body={bodyContent}
            onClick1={onClose}
            onClick2={onClose}
            textButton1="Đóng"
          />
        );
      };
      
      export default ProductSearchModal;
      

