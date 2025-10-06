import React, { useState, useEffect } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';

const ProductSearchModal = ({ isOpen, products, onClose, onSelectProduct, index }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

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
    console.log('Product selected in modal:', product);
    // Chuẩn hóa dữ liệu sản phẩm
    const standardizedProduct = {
      _id: product._id,
      name: product.name || 'Không có tên',
      img: Array.isArray(product.img) ? product.img[0] || '' : product.img || '', // Lấy ảnh đầu tiên
      price: product.price || 0,
      sold: product.sold || 0,
      star: product.star || 0,
      score: product.score || 0,
      feedbackCount: product.feedbackCount || 0,
      view: product.view || 0,
      code: product.code || '',
      author: product.author?._id || product.author || '', // Lấy ID của author nếu là object
      publishDate: product.publishDate || '',
      language: product.language || '',
      weight: product.weight || 0,
      length: product.length || 0,
      width: product.width || 0,
      height: product.height || 0,
      page: product.page || 0,
      format: product.format || '',
      publisher: product.publisher || '',
      supplier: product.supplier || '',
      unit: product.unit || '',
      category: product.category?._id || product.category || '',
    };
    onSelectProduct(index, standardizedProduct);
    onClose();
  };

  const bodyContent = (
    <div
      style={{
        maxHeight: '400px',
        minHeight: '400px',
        overflowY: 'hidden',
      }}
    >
      <input
        style={{
          fontSize: '16px',
          position: 'sticky',
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
          maxHeight: '330px',
          overflowY: 'auto',
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
                  src={Array.isArray(product.img) ? product.img[0] : product.img}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
                <div>
                  <h6 style={{ fontSize: '16px' }} className="mb-1">{product.name}</h6>
                  <p className="text-danger mb-0">{product.price.toLocaleString()}đ</p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handleProductSelect(product)}
                style={{ backgroundColor: '#198754', color: 'white', borderColor: '#198754' }}
              >
                Chọn
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