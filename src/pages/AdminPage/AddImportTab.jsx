import React, { useState, useEffect } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as SupplierService from "../../services/OptionService/SupplierService";
import { useQuery } from "@tanstack/react-query";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import FormComponent from '../../components/FormComponent/FormComponent';
import * as ProductService from '../../services/ProductService';


const AddImport= ({isOpen,type,onCancel}) => {
  // Dữ liệu mẫu
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);

  const handleOnChangeDate = (value) => setOrderDate(value);

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
  
          //onSubmit(selectedProducts); // Gửi tất cả các sản phẩm đã chọn
          setSelectedProducts([]); // Reset danh sách sản phẩm đã chọn
          setProductName('');
          //onClose(); // Đóng modal
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
  

  //Xử lý nhà cung cấp
    const [selectedSupplier, setSelectedSupplier] = useState("");
  
    const handleOnChangeSupplier = (e) => {
      setSelectedSupplier(e.target.value);
    };
  
    const getAllSupplier = async () => {
      const res = await SupplierService.getAllSupplier();
      return res.data;
    };
  
  
    const { isLoading: isLoadingSupplier, data: suppliers } = useQuery({
      queryKey: ['suppliers'],
      queryFn: getAllSupplier,
  
    });
  
    const AllSupplier = Array.isArray(suppliers)
      ? suppliers.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      }))
      : [];
  

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
      <div className="title-section">
        <h3 className="text mb-0">NHẬP HÀNG</h3>
    </div>
      {/* Thông tin nhập hàng */}
      <div className="row">
        <div className="col-md-6">
        
          <div className="mb-3">
          <label className="form-label"></label>
          <FormSelectComponent
            label="Nhà cung cấp"
            placeholder={"Chọn nhà cung cấp"}
            options={AllSupplier}
            selectedValue={selectedSupplier}
            onChange={handleOnChangeSupplier}
            required={true}
          />
          </div>
          <div className="mb-3">
          <label className="form-label"></label>
          <FormComponent
            id="nameLanguageInput"
            label="Ngày nhập hàng"
            type="date"
            placeholder="Chọn ngày nhập hàng"
            value={orderDate}
            onChange={handleOnChangeDate}
            required={true}
            enable={true}
          />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
          <label className="form-label"></label>
          <FormComponent
                  id="PriceEntry"
                  label="Tổng tiền"
                  type="number"
                  placeholder=""
                  //value={priceEntry}
                  //onChange={handleOnChangePriceEntry}
                  required={true}
                  enable = {false}
          />
          </div>
        </div>
      </div>

      <hr />

      {/* Thêm sản phẩm */}
      <div className="row">
        <div className="col-md-3">
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
        <div className="col-md-3">
          
           <FormComponent
                  id="Price"
                  label="Giá nhập"
                  type="number"
                  placeholder="Nhập giá nhập"
                  value={importPrice}
                  onChange={(e) => setImportPrice(e.target.value)}
                  required={true}
                  enable = {true}
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
      <ButtonComponent
              textButton="Xác nhận thanh toán"
              onClick={onCancel}
           />
      </div>
      <div> -</div>
      <div className="text-end">
      <ButtonComponent
              textButton="Hủy bỏ"
              onClick={onCancel}
           />
      </div>
     
    </div>
  );
};

export default AddImport;
