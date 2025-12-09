import React, { useState, useEffect } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as SupplierService from "../../services/OptionService/SupplierService";
import { useQuery } from "@tanstack/react-query";
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import FormComponent from '../../components/FormComponent/FormComponent';
import * as ProductService from '../../services/ProductService';
import * as ImportService from '../../services/ImportService';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as message from "../../components/MessageComponent/MessageComponent";
import ConfirmAddItemModal from '../../components/AddItemComponent/AddItem';

const AddImport = ({ isOpen, type, onCancel }) => {
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importItems, setImportItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  const handleOnChangeDate = (value) => setOrderDate(value);
  const handleOnChangeImportPrice = (value) => setImportPrice(value);
  const handleOnChangeQuantity = (value) => setQuantity(value);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ProductService.getAllProduct('?limit=99999');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const handleOnChangeSupplier = (e) => setSelectedSupplier(e.target.value);

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

  const productOptions = products.map((product) => ({
    value: product._id,
    label: product.name,
    image: Array.isArray(product.img) ? product.img[0] : product.img || 'https://placehold.co/40x40', // Thêm ảnh sản phẩm cho dropdown
  }));

  console.log("productOptions", products)

  const handleProductChange = (e) => {
    console.log("Selected product ID:", e.target.value);
    setSelectedProduct(e.target.value || "");
  };

  const handleAddItem = () => {
    console.log("selectedProduct:", selectedProduct);
    console.log("importPrice:", importPrice);
    console.log("quantity:", quantity);
    if (!selectedProduct || !importPrice || !quantity) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const price = parseInt(importPrice);
    const qty = parseInt(quantity);
    if (price <= 0 || qty <= 0) {
      alert("Giá nhập và số lượng phải lớn hơn 0!");
      return;
    }
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const newItem = {
      id: product._id,
      code: product.code,
      name: product.name,
      priceOriginal: product.price,
      priceImport: price,
      quantity: qty,
      image: Array.isArray(product.img) ? product.img[0] : product.img || 'https://placehold.co/80x80',
      stock: product.stock,
    };
    setPendingItem(newItem);
    setShowConfirmModal(true);
  };

  const handleConfirmAddItem = () => {
    if (pendingItem) {
      setImportItems([...importItems, pendingItem]);
      setImportPrice("");
      setQuantity("");
      setSelectedProduct("");
    }
    setShowConfirmModal(false);
    setPendingItem(null);
  };

  const handleCancelAddItem = () => {
    setShowConfirmModal(false);
    setPendingItem(null);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...importItems];
    newItems.splice(index, 1);
    setImportItems(newItems);
  };

  const total = importItems.reduce(
    (sum, item) => sum + item.priceImport * item.quantity,
    0
  );

  const mutation = useMutationHook(data => ImportService.createImport(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status !== 'ERR') {
      message.success();
      alert('Nhập hàng thành công!');
      setImportItems([]);
      setSelectedSupplier("");
      setOrderDate("");
      onCancel();
    } else if (isError) {
      message.error();
      alert('Có lỗi xảy ra khi nhập hàng! Vui lòng kiểm tra lại.');
    }
  }, [isSuccess, isError, data?.status]);

  const handleConfirmImport = () => {
    if (!selectedSupplier || !orderDate || importItems.length === 0) {
      alert("Vui lòng chọn nhà cung cấp, ngày nhập hàng và thêm ít nhất một sản phẩm!");
      return;
    }

    const userId = localStorage.getItem('userId') || '6711c5e1f2b1e2a4b5c6d7e8';

    const importData = {
      importItems: importItems.map(item => ({
        product: item.id,
        importPrice: item.priceImport,
        quantity: item.quantity
      })),
      supplier: selectedSupplier,
      importDate: orderDate,
      totalImportPrice: total,
      user: userId,
      note: 'Nhập hàng từ giao diện',
      status: 'completed'
    };

    mutation.mutate(importData);
  };

  if (!isOpen) return null;

  return (
    <div className="container my-4">
      <div className="title-section">
        <h3 className="text mb-0">NHẬP HÀNG</h3>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <FormSelectComponent
              label="Nhà cung cấp"
              placeholder="Chọn nhà cung cấp"
              options={AllSupplier}
              selectedValue={selectedSupplier}
              onChange={handleOnChangeSupplier}
              required={true}
            />
          </div>
          <div className="mb-3">
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
            <FormComponent
              id="PriceEntry"
              label="Tổng tiền"
              type="number"
              placeholder=""
              value={total}
              required={true}
              enable={false}
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-md-3">
          <FormSelectComponent
            label="Tên Sản Phẩm"
            placeholder="Tìm kiếm và chọn sản phẩm"
            options={productOptions}
            selectedValue={selectedProduct}
            onChange={handleProductChange}
            required={true}
            isSearchable={true}
            type="autocomplete"
          />

        </div>
        <div className="col-md-3">
          <FormComponent
            id="Price"
            label="Giá nhập"
            type="number"
            placeholder="Nhập giá nhập"
            value={importPrice}
            onChange={handleOnChangeImportPrice}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-3">
          <FormComponent
            id="Quantity"
            label="Số lượng"
            type="number"
            placeholder="Nhập số lượng"
            value={quantity}
            onChange={handleOnChangeQuantity}
            required={true}
            enable={true}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleAddItem}>
            Thêm
          </button>
        </div>
      </div>

      <hr />

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
          {importItems.map((item, index) => (
            <tr key={index}>
              <td>{item.code}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.priceOriginal.toLocaleString()}đ</td>
              <td>{item.priceImport.toLocaleString()}đ</td>
              <td>{item.quantity}</td>
              <td>{(item.priceImport * item.quantity).toLocaleString()}đ</td>
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

      <div className="text-end">
        <ButtonComponent
          textButton={isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          onClick={handleConfirmImport}
          disabled={isLoading}
        />
      </div>
      <div> -</div>
      <div className="text-end">
        <ButtonComponent textButton="Hủy bỏ" onClick={onCancel} />
      </div>

      <ConfirmAddItemModal
        isOpen={showConfirmModal}
        product={pendingItem}
        importPrice={importPrice}
        quantity={quantity}
        onConfirm={handleConfirmAddItem}
        onCancel={handleCancelAddItem}
      />
    </div>
  );
};

export default AddImport;