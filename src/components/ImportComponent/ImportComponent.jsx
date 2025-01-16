import React, { useState, useEffect } from 'react';
import './ImportModal.css';
import * as ProductService from '../../services/ProductService';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ImportModal = ({ isOpen, onClose, onSubmit }) => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm đã chọn

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getAllProduct();
        setProducts(res.data); // Cập nhật danh sách sản phẩm từ API
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantity: 1 },
      ]); // Thêm sản phẩm vào danh sách đã chọn
    }
    setProductName(''); // Reset ô tìm kiếm
  };

  const handleQuantityChange = (productId, change) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity: Math.max(1, product.quantity + change), // Điều chỉnh số lượng, không dưới 1
            }
          : product
      )
    );
  };

  const handleAddProduct = async () => {
    if (selectedProducts.length > 0) {
      // Gọi API để cập nhật số lượng sản phẩm
      try {
        for (const product of selectedProducts) {
          await ProductService.updateProductStock(product._id, {
            quantityChange: product.quantity,
          });
        }

        onSubmit(selectedProducts); // Gửi tất cả các sản phẩm đã chọn
        setSelectedProducts([]); // Reset danh sách sản phẩm đã chọn
        setProductName('');
        onClose(); // Đóng modal
      } catch (error) {
        alert('Lỗi khi cập nhật sản phẩm');
        console.error('Error updating product stock:', error);
      }
    } else {
      alert('Vui lòng chọn ít nhất một sản phẩm.');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productName.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="import-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Nhập Sản Phẩm</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body" style={{fontSize:'16px'}}>
          <div className="mb-3">
            <label className="form-label">Tên Sản Phẩm</label>
            <input style={{fontSize:'16px'}}
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Tìm kiếm sản phẩm"
            />
            {productName && (
              <ul className="list-group mt-2">
                {filteredProducts.map((product) => (
                  <li
                    key={product._id}
                    className="list-group-item"
                    onClick={() => handleProductSelect(product)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="selected-products">
            <h6>Danh sách sản phẩm đã chọn:</h6>
            {selectedProducts.map((product) => (
              <div key={product._id} className="d-flex align-items-center mb-3">
                <strong>{product.name}</strong>
                <div className="d-flex align-items-center ms-3">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => handleQuantityChange(product._id, -1)} // Trừ số lượng
                    disabled={product.quantity <= 1} // Không thể trừ số lượng dưới 1
                  >
                    -
                  </button>
                  <input 
                    type="number"
                    className="form-control"
                    value={product.quantity}
                    onChange={(e) =>
                      setSelectedProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id
                            ? { ...p, quantity: Math.max(1, e.target.value) }
                            : p
                        )
                      )
                    }
                    min="1"
                    max={product.stock}
                    style={{ width: '60px', textAlign: 'center', fontSize:'16px' }}
                  />
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => handleQuantityChange(product._id, 1)} // Cộng số lượng
                    disabled={product.quantity >= product.stock} // Không thể cộng số lượng vượt quá tồn kho
                  >
                    +
                  </button>
                </div>
                <span className="ms-2">Tồn kho: {product.stock}</span>
              </div>
            ))}
          </div>

          <ButtonComponent
          textButton="Nhập hàng"
            onClick={handleAddProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
