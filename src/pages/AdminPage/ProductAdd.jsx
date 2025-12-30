import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import FormComponent from '../../components/FormComponent/FormComponent';
import FormSelectComponent from "../../components/FormSelectComponent/FormSelectComponent";
import * as message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";

// Import các service
import * as AuthorService from "../../services/AuthorService";
import * as CategoryService from "../../services/CategoryService";
import * as FormatService from "../../services/OptionService/FormatService";
import * as LanguageService from "../../services/OptionService/LanguageService";
import * as PublisherService from "../../services/OptionService/PublisherService";
import * as SupplierService from "../../services/OptionService/SupplierService";
import * as UnitService from "../../services/OptionService/UnitService";
import * as ProductService from "../../services/ProductService";
import TextEditor from "./partials/TextEditor";

// Hàm làm phẳng cây danh mục để hiển thị trong select
const flattenCategoryTree = (categories, level = 0) => {
  let result = [];
  categories.forEach((category) => {
    result.push({
      value: category._id,
      label: "-".repeat(level * 2) + " " + category.name,
    });
    if (category.children && category.children.length > 0) {
      result = result.concat(flattenCategoryTree(category.children, level + 1));
    }
  });
  return result;
};


const AddProductForm = ({ isOpen, onCancel }) => {
  // --- STATE QUẢN LÝ DỮ LIỆU FORM ---
  const [name, setName] = useState('');
  const [pubdate, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [page, setPage] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [price, setPrice] = useState(0);
  const [img, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState(0);
  const [priceEntry, setPriceEntry] = useState(0);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ONCHANGE ---
  const handleOnChangeName = (value) => setName(value);
  const handleOnChangeDate = (value) => setDate(value);
  const handleOnChangeWeight = (value) => setWeight(value);
  const handleOnChangePage = (value) => setPage(value);
  const handleOnChangeHeight = (value) => setHeight(value);
  const handleOnChangeWidth = (value) => setWidth(value);
  const handleOnChangeLength = (value) => setLength(value);
  const handleOnChangeDescription = (value) => setDescription(value);
  const handleOnChangePrice = (value) => {
    setPrice(value);
    const calculatedPriceEntry = (value * (100 - discount)) / 100;
    setPriceEntry(calculatedPriceEntry);
  };
  const handleOnChangeDiscount = (value) => {
    setDiscount(value);
    const calculatedPriceEntry = (price * (100 - value)) / 100;
    setPriceEntry(calculatedPriceEntry);
  };
  const handleOnChangePriceEntry = (value) => setPriceEntry(value);

  // --- MUTATION ĐỂ TẠO SẢN PHẨM MỚI ---
  const mutation = useMutationHook(data => ProductService.addProduct(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status !== 'ERR') {
      message.success('Thêm sản phẩm mới thành công!');
      onCancel();
    } else if (isError || (data?.status === 'ERR')) {
      message.error(data?.message || "Có lỗi xảy ra khi thêm sản phẩm!");
    }
  }, [isSuccess, isError, data, onCancel]);


  // --- HÀM LƯU SẢN PHẨM ---
  const onSave = async () => {
    if (!name || !selectedAuthor || !price || !selectedPublisher || !selectedCategory || !selectedSupplier) {
      message.error('Vui lòng nhập đầy đủ các trường thông tin bắt buộc (*)!');
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("author", selectedAuthor);
    formData.append("publishDate", pubdate);
    formData.append("weight", weight);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("length", length);
    formData.append("page", page);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("publisher", selectedPublisher);
    formData.append("supplier", selectedSupplier);
    formData.append("language", selectedLanguage);
    formData.append("format", selectedFormat);
    formData.append("unit", selectedUnit);
    formData.append("category", selectedCategory);

    img.forEach((imageFile) => {
      formData.append(`img`, imageFile);
    });

    mutation.mutate(formData);
  };


  // --- CÁC HÀM XỬ LÝ HÌNH ẢNH ---
  const handleChangeImg = (event) => {
    const files = Array.from(event.target.files);
    setImage((prev) => [...prev, ...files]);
    setPreviewImage((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleRemoveImage = (index) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
    setPreviewImage((prev) => prev.filter((_, i) => i !== index));
  };


  // --- LOGIC LẤY DỮ LIỆU CHO CÁC DROPDOWN ---

  // Tác giả
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const handleOnChangeAuthor = (e) => setSelectedAuthor(e.target.value);
  const getAllAuthor = async () => (await AuthorService.getAllAuthor()).data;
  const { isLoading: isLoadingAuthor, data: authors } = useQuery({ queryKey: ['authors'], queryFn: getAllAuthor });
  const AllAuthors = Array.isArray(authors) ? authors.map(author => ({ value: author._id, label: author.name })) : [];

  // Nhà xuất bản
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const handleOnChangePublisher = (e) => setSelectedPublisher(e.target.value);
  const getAllPublisher = async () => (await PublisherService.getAllPublisher()).data;
  const { data: publishers } = useQuery({ queryKey: ['publishers'], queryFn: getAllPublisher });
  const AllPub = Array.isArray(publishers) ? publishers.map(p => ({ value: p._id, label: p.name })) : [];

  // Ngôn ngữ
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const handleOnChangeLanguage = (e) => setSelectedLanguage(e.target.value);
  const getAllLanguage = async () => (await LanguageService.getAllLanguage()).data;
  const { data: languages } = useQuery({ queryKey: ['languages'], queryFn: getAllLanguage });
  const AllLang = Array.isArray(languages) ? languages.map(l => ({ value: l._id, label: l.name })) : [];

  // Hình thức
  const [selectedFormat, setSelectedFormat] = useState("");
  const handleOnChangeFormat = (e) => setSelectedFormat(e.target.value);
  const getAllFormat = async () => (await FormatService.getAllFormat()).data;
  const { data: formats } = useQuery({ queryKey: ['formats'], queryFn: getAllFormat });
  const AllFormat = Array.isArray(formats) ? formats.map(f => ({ value: f._id, label: f.name })) : [];

  // Nhà cung cấp
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const handleOnChangeSupplier = (e) => setSelectedSupplier(e.target.value);
  const getAllSupplier = async () => (await SupplierService.getAllSupplier()).data;
  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: getAllSupplier });
  const AllSupplier = Array.isArray(suppliers) ? suppliers.map(s => ({ value: s._id, label: s.name })) : [];

  // Đơn vị
  const [selectedUnit, setSelectedUnit] = useState("");
  const handleOnChangeUnit = (e) => setSelectedUnit(e.target.value);
  const getAllUnit = async () => (await UnitService.getAllUnit()).data;
  const { data: units } = useQuery({ queryKey: ['units'], queryFn: getAllUnit });
  const AllUnit = Array.isArray(units) ? units.map(u => ({ value: u._id, label: u.name })) : [];

  // Danh mục
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleOnChangeCategory = (e) => setSelectedCategory(e.target.value);
  const getTreeCategory = async () => (await CategoryService.getTreeCategory()).data;
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getTreeCategory });
  const AllCategory = Array.isArray(categories) ? flattenCategoryTree(categories) : [];


  if (!isOpen) return null;

  // --- PHẦN RENDER GIAO DIỆN (JSX) ---
  return (
    <div className="container my-4">
      <h4 style={{
        color: "#198754",
        fontSize: "25px",
        fontWeight: "bold"
      }}>Thêm sản phẩm mới</h4>

      <div className="row">
        {/* Hàng 1: Tên sản phẩm và nút Hủy */}
        <div className="col-md-6 mb-3">
          <FormComponent
            id="name"
            label="Tên sản phẩm"
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={name}
            onChange={handleOnChangeName}
            required
            enable={true}
          />
        </div>
        <div className="col-6 d-flex justify-content-end align-items-start pt-3">
          <ButtonComponent
            textButton="Hủy bỏ"
            onClick={onCancel}
          />
        </div>

        {/* Hàng 2: Tác giả và NXB */}
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Tác giả (*)"
            placeholder="Chọn tác giả"
            options={AllAuthors}
            selectedValue={selectedAuthor}
            onChange={handleOnChangeAuthor}
            required
            isLoading={isLoadingAuthor}
          />
        </div>
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Nhà xuất bản (*)"
            placeholder="Chọn nhà xuất bản"
            options={AllPub}
            selectedValue={selectedPublisher}
            onChange={handleOnChangePublisher}
            required
          />
        </div>

        {/* Hàng 3: Năm XB và Ngôn ngữ */}
        <div className="col-md-6 mb-3">
          <FormComponent
            id="publishDate"
            label="Năm xuất bản"
            type="date"
            value={pubdate}
            onChange={handleOnChangeDate}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Ngôn ngữ"
            placeholder="Chọn ngôn ngữ"
            options={AllLang}
            selectedValue={selectedLanguage}
            onChange={handleOnChangeLanguage}
          />
        </div>

        {/* Hàng 4: Kích thước */}
        <div className="col-md-3 mb-3">
          <FormComponent
            id="weight"
            label="Trọng lượng (gram)"
            type="number"
            placeholder="gram"
            value={weight}
            onChange={handleOnChangeWeight}
            enable={true}
          />
        </div>
        <div className="col-md-3 mb-3">
          <FormComponent
            id="height"
            label="Cao (cm)"
            type="number"
            placeholder="cm"
            value={height}
            onChange={handleOnChangeHeight}
            enable={true}
          />
        </div>
        <div className="col-md-3 mb-3">
          <FormComponent
            id="width"
            label="Rộng (cm)"
            type="number"
            placeholder="cm"
            value={width}
            onChange={handleOnChangeWidth}
            enable={true}
          />
        </div>
        <div className="col-md-3 mb-3">
          <FormComponent
            id="length"
            label="Dài (cm)"
            type="number"
            placeholder="cm"
            value={length}
            onChange={handleOnChangeLength}
            enable={true}
          />
        </div>

        {/* Hàng 5: Số trang và Hình thức */}
        <div className="col-md-6 mb-3">
          <FormComponent
            id="page"
            label="Số trang"
            type="number"
            placeholder="Nhập số trang"
            value={page}
            onChange={handleOnChangePage}
            enable={true}
          />
        </div>
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Hình thức"
            placeholder="Chọn hình thức"
            options={AllFormat}
            selectedValue={selectedFormat}
            onChange={handleOnChangeFormat}
          />
        </div>

        {/* Hàng 6: NCC và Danh mục */}
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Nhà cung cấp (*)"
            placeholder="Chọn nhà cung cấp"
            options={AllSupplier}
            selectedValue={selectedSupplier}
            onChange={handleOnChangeSupplier}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Danh mục (*)"
            placeholder="Chọn danh mục"
            options={AllCategory}
            selectedValue={selectedCategory}
            onChange={handleOnChangeCategory}
            required
          />
        </div>

        {/* Hàng 7: Đơn vị */}
        {/* <div className="col-md-6 mb-3">
          <FormSelectComponent
            label="Đơn vị"
            placeholder="Chọn đơn vị"
            options={AllUnit}
            selectedValue={selectedUnit}
            onChange={handleOnChangeUnit}
          />
        </div> */}

        {/* Mô tả sản phẩm */}
        <div className="col-12 my-3">
          <p className="form-label" style={{ fontSize: '16px' }}>Mô tả sản phẩm</p>
          <TextEditor
            value={description}
            onChange={handleOnChangeDescription}
          />
        </div>

        {/* Hình ảnh */}
        <div className="col-12 mb-3">
          <label htmlFor="image" className="form-label" style={{ fontSize: '16px' }}>Hình ảnh</label>
          <div className="border rounded d-flex flex-wrap p-2" style={{ minHeight: "150px" }}>
            {previewImage.length > 0 ? (
              previewImage.map((image, index) => (
                <div key={index} className="position-relative me-2 mb-2" style={{ width: '120px', height: '120px' }}>
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 bg-light rounded-circle"
                    style={{ transform: 'translate(50%, -50%)' }}
                    onClick={() => handleRemoveImage(index)}
                  ></button>
                </div>
              ))
            ) : (
              <div className="w-100 d-flex align-items-center justify-content-center text-muted">Chưa có ảnh nào được chọn</div>
            )}
          </div>
          <input
            type="file"
            id="image"
            className="form-control mt-2"
            accept="image/*"
            multiple
            onChange={handleChangeImg}
          />
        </div>

        {/* Hàng giá */}
        <div className="col-md-4 mb-3">
          <FormComponent
            id="price"
            label="Giá"
            type="number"
            placeholder="Nhập giá"
            value={price}
            onChange={handleOnChangePrice}
            required
            enable={true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <FormComponent
            id="discount"
            label="Giảm giá (%)"
            type="number"
            placeholder="Nhập % giảm giá"
            value={discount}
            onChange={handleOnChangeDiscount}
            enable={true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <FormComponent
            id="PriceEntry"
            label="Giá sau giảm"
            type="number"
            value={priceEntry}
            onChange={handleOnChangePriceEntry}
            enable={false}
          />
        </div>
      </div>

      {/* Nút lưu */}
      <div className="text-end">
        <ButtonComponent
          textButton="Lưu sản phẩm"
          onClick={onSave}
          disabled={mutation.isLoading}
        />
      </div>
    </div>
  );
};

export default AddProductForm;